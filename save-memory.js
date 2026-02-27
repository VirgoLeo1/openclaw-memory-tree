// save-memory.js - 记忆树自动保存脚本
// 用法：node save-memory.js [session-key]
// 功能：将当前会话记录保存到记忆树

const fs = require('fs');
const path = require('path');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';
const CHAT_LOGS_PATH = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', 'workflow', 'chat-logs');

// 确保目录存在
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 获取日期字符串 YYYY-MM-DD
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// 获取时间戳字符串
function getTimestampString(date = new Date()) {
  return date.toISOString().replace('T', '_').replace(/:/g, '-').slice(0, 19);
}

// 保存聊天记录
function saveChatLog(messages, sessionKey = 'default') {
  try {
    ensureDir(CHAT_LOGS_PATH);
    
    const dateStr = getDateString();
    const logFile = path.join(CHAT_LOGS_PATH, `${dateStr}_${sessionKey}.json`);
    
    // 如果文件已存在，读取现有内容
    let existingData = { messages: [] };
    if (fs.existsSync(logFile)) {
      existingData = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    }
    
    // 合并新消息
    const existingMessages = existingData.messages || [];
    const allMessages = [...existingMessages, ...messages];
    
    // 去重（基于 message_id）
    const uniqueMessages = allMessages.filter(
      (msg, index, self) => 
        index === self.findIndex(m => m.message_id === msg.message_id)
    );
    
    // 写入文件
    fs.writeFileSync(logFile, JSON.stringify({
      date: dateStr,
      sessionKey,
      messages: uniqueMessages,
      lastUpdated: new Date().toISOString(),
      count: uniqueMessages.length
    }, null, 2));
    
    console.log(`✅ 已保存 ${uniqueMessages.length} 条消息到 ${logFile}`);
    return true;
  } catch (error) {
    console.error('❌ 保存聊天记录失败:', error.message);
    return false;
  }
}

// 按话题保存
function saveChatByTopic(messages, topic) {
  try {
    const topicPath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', 'workflow', 'chat-logs', 'by-topic');
    ensureDir(topicPath);
    
    // 清理话题名称，只保留字母数字中文
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

// 主函数
function main() {
  const sessionKey = process.argv[2] || 'default';
  const testData = process.argv[3];
  
  console.log('🌳 记忆树自动保存系统\n');
  console.log(`会话密钥：${sessionKey}`);
  
  // 如果有测试数据
  if (testData) {
    const testMessages = [
      {
        message_id: `test_${Date.now()}`,
        role: 'user',
        content: testData,
        timestamp: new Date().toISOString()
      }
    ];
    saveChatLog(testMessages, sessionKey);
  } else {
    // 示例用法
    console.log('\n用法:');
    console.log('  node save-memory.js [session-key] [test-message]');
    console.log('\n示例:');
    console.log('  node save-memory.js default "测试消息"');
    console.log('\n当前存储路径:');
    console.log(`  ${CHAT_LOGS_PATH}`);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  saveChatLog,
  saveChatByTopic,
  CHAT_LOGS_PATH
};
