// auto-saver.js - 自动保存聊天记录到记忆树
// 功能：定期保存聊天记录，支持按时间/话题分段

const fs = require('fs');
const path = require('path');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';
const CHAT_LOGS_PATH = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', 'workflow', 'chat-logs');
const SAVE_INTERVAL = 30 * 60 * 1000; // 30 分钟保存一次
const AUTO_SUMMARIZE_INTERVAL = 15 * 24 * 60 * 60 * 1000; // 15 天总结一次

// 确保目录存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成日期字符串 YYYY-MM-DD
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// 生成时间戳字符串 YYYY-MM-DD_HH-mm-ss
function getTimestampString(date = new Date()) {
  return date.toISOString().replace('T', '_').replace(/:/g, '-').slice(0, 19);
}

// 保存聊天记录
function saveChatLog(messages, sessionKey = 'default') {
  try {
    ensureDir(CHAT_LOGS_PATH);
    
    const dateStr = getDateString();
    const logFile = path.join(CHAT_LOGS_PATH, `${dateStr}_${sessionKey}.json`);
    
    // 如果文件已存在，追加内容
    let existingData = [];
    if (fs.existsSync(logFile)) {
      const existing = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      existingData = existing.messages || [];
    }
    
    // 合并新消息
    const allMessages = [...existingData, ...messages];
    
    // 去重（基于 message_id）
    const uniqueMessages = allMessages.filter(
      (msg, index, self) => index === self.findIndex(m => m.message_id === msg.message_id)
    );
    
    // 写入文件
    fs.writeFileSync(logFile, JSON.stringify({
      date: dateStr,
      sessionKey,
      messages: uniqueMessages,
      lastUpdated: new Date().toISOString()
    }, null, 2));
    
    console.log(`✅ 已保存 ${uniqueMessages.length} 条消息到 ${logFile}`);
    return true;
  } catch (error) {
    console.error('❌ 保存聊天记录失败:', error.message);
    return false;
  }
}

// 按话题保存聊天记录
function saveChatByTopic(messages, topic) {
  try {
    const topicPath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', 'workflow', 'chat-logs', 'by-topic');
    ensureDir(topicPath);
    
    const safeTopic = topic.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 50);
    const logFile = path.join(topicPath, `${safeTopic}_${getTimestampString()}.json`);
    
    fs.writeFileSync(logFile, JSON.stringify({
      topic,
      timestamp: new Date().toISOString(),
      messages,
      count: messages.length
    }, null, 2));
    
    console.log(`✅ 已按话题 "${topic}" 保存 ${messages.length} 条消息`);
    return true;
  } catch (error) {
    console.error('❌ 按话题保存失败:', error.message);
    return false;
  }
}

// 自动生成总结（每 15 天）
function autoSummarize() {
  try {
    const today = new Date();
    const fifteenDaysAgo = new Date(today.getTime() - AUTO_SUMMARIZE_INTERVAL);
    
    // 查找需要总结的聊天记录
    const logsDir = CHAT_LOGS_PATH;
    if (!fs.existsSync(logsDir)) return;
    
    const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const fileDate = new Date(data.date);
      
      // 如果超过 15 天且未总结
      if (fileDate < fifteenDaysAgo && !data.summarized) {
        console.log(`📝 需要总结 ${file} 的聊天记录`);
        // 这里可以调用总结逻辑，或标记待总结
        data.summarized = false; // 标记为待总结
        data.summaryNeeded = true;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
    });
    
    console.log('✅ 自动总结检查完成');
  } catch (error) {
    console.error('❌ 自动总结检查失败:', error.message);
  }
}

// 启动定时保存
function startAutoSave(getMessagesFn) {
  console.log('🚀 启动自动保存服务...');
  console.log(`   - 保存间隔：${SAVE_INTERVAL / 1000 / 60} 分钟`);
  console.log(`   - 存储路径：${CHAT_LOGS_PATH}`);
  
  // 定期保存
  setInterval(() => {
    if (typeof getMessagesFn === 'function') {
      const messages = getMessagesFn();
      if (messages && messages.length > 0) {
        saveChatLog(messages);
      }
    }
  }, SAVE_INTERVAL);
  
  // 定期检查总结
  setInterval(() => {
    autoSummarize();
  }, AUTO_SUMMARIZE_INTERVAL);
  
  console.log('✅ 自动保存服务已启动');
}

// 导出函数
module.exports = {
  saveChatLog,
  saveChatByTopic,
  autoSummarize,
  startAutoSave,
  CHAT_LOGS_PATH,
  SAVE_INTERVAL
};

// 如果直接运行此文件
if (require.main === module) {
  console.log('🔧 Auto-saver 模块测试模式');
  console.log(`存储路径：${CHAT_LOGS_PATH}`);
  console.log(`保存间隔：${SAVE_INTERVAL / 1000 / 60} 分钟`);
  
  // 测试保存
  const testMessages = [
    { message_id: 'test1', role: 'user', content: '测试消息 1', timestamp: new Date().toISOString() },
    { message_id: 'test2', role: 'assistant', content: '测试消息 2', timestamp: new Date().toISOString() }
  ];
  
  saveChatLog(testMessages, 'test-session');
}
