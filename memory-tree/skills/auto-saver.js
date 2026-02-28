#!/usr/bin/env node
/**
 * Auto Saver - 自动保存器
 * 
 * 功能：
 * 1. 即时保存用户指定的记忆
 * 2. 智能分类到对应分支
 * 3. 自动版本控制（.bak 备份）
 * 4. 冲突检测与解决
 * 5. 支持标签系统
 * 
 * 用法：
 * node auto-saver.js save "内容" [category] [tags]
 * node auto-saver.js summarize "对话内容"
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  memoryTreeRoot: 'D:\\.openclaw-backup\\memory-tree',
  branchesDir: '20-BRANCHES',
  pendingDir: '40-EVOLUTION-LOG\\pending',
  categories: {
    'tech': ['代码', '编程', 'python', 'javascript', 'api', '脚本', '技术', '算法', '数据库'],
    'workflow': ['流程', '步骤', '方法', '工作', '操作', '指南', '教程', 'sop'],
    'projects': ['项目', '任务', '计划', '目标', 'moltbook', 'github', 'openclaw'],
    'preferences': ['喜欢', '偏好', '习惯', '常用', '默认', '设置', '配置'],
    'platform': ['平台', '网站', 'app', '工具', '软件', '服务']
  }
};

/**
 * 读取文件内容
 */
function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`读取文件失败 ${filePath}:`, error.message);
    return null;
  }
}

/**
 * 写入文件内容
 */
function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`写入文件失败 ${filePath}:`, error.message);
    return false;
  }
}

/**
 * 创建备份
 */
function createBackup(filePath) {
  if (!fs.existsSync(filePath)) {
    return true;
  }
  
  const backupPath = filePath + '.bak';
  const content = readFile(filePath);
  
  if (content) {
    return writeFile(backupPath, content);
  }
  
  return false;
}

/**
 * 智能分类内容
 */
function classifyContent(content) {
  const lowerContent = content.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CONFIG.categories)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return category;
    }
  }
  
  return 'general'; // 默认分类
}

/**
 * 生成文件名
 */
function generateFileName(content, category) {
  // 提取前 20 个字符作为文件名基础
  const title = content.split('\n')[0].slice(0, 30)
    .replace(/[^\w\u4e00-\u9fa5]/g, '_')
    .replace(/_+/g, '_');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  return `${category}-${title}-${timestamp}.md`;
}

/**
 * 保存记忆
 */
function saveMemory(content, category = null, tags = []) {
  console.log('💾 正在保存记忆...\n');
  
  // 智能分类
  if (!category) {
    category = classifyContent(content);
    console.log(`🤖 自动分类为：${category}`);
  }
  
  // 确定保存路径
  let savePath;
  
  if (category === 'pending' || category === 'shadow') {
    // 影子模式：保存到 pending 目录
    const fileName = generateFileName(content, 'shadow');
    savePath = path.join(CONFIG.memoryTreeRoot, CONFIG.pendingDir, fileName);
  } else {
    // 正式保存
    const categoryDir = path.join(CONFIG.memoryTreeRoot, CONFIG.branchesDir, category);
    const fileName = generateFileName(content, category);
    savePath = path.join(categoryDir, fileName);
  }
  
  // 检查是否已存在（冲突检测）
  if (fs.existsSync(savePath)) {
    console.log('⚠️  检测到冲突，创建备份...');
    createBackup(savePath);
  }
  
  // 格式化内容
  const timestamp = new Date().toISOString();
  const formattedContent = `---
created: ${timestamp}
category: ${category}
tags: [${tags.join(', ')}]
---

${content}

---
*最后更新：${timestamp}*
`;
  
  // 保存文件
  if (writeFile(savePath, formattedContent)) {
    console.log(`✅ 已保存到：${path.relative(CONFIG.memoryTreeRoot, savePath)}`);
    console.log(`📦 分类：${category}`);
    console.log(`🏷️  标签：${tags.join(', ') || '无'}`);
    console.log(`📊 大小：${(Buffer.byteLength(formattedContent, 'utf-8') / 1024).toFixed(1)}KB`);
    
    return {
      success: true,
      path: savePath,
      category: category,
      tags: tags
    };
  } else {
    console.log('❌ 保存失败');
    return { success: false, error: '写入文件失败' };
  }
}

/**
 * 总结对话并保存
 */
function summarizeAndSave(conversation, autoSave = true) {
  console.log('📝 正在总结对话...\n');
  
  // 简单总结：提取关键信息
  const lines = conversation.split('\n');
  const keyPoints = [];
  
  for (const line of lines) {
    // 提取包含关键词的行
    if (line.match(/(记住 | 保存 | 重要 | 注意 | 关键 | 决策 | 待办|todo)/i)) {
      keyPoints.push(line.trim());
    }
  }
  
  if (keyPoints.length === 0) {
    console.log('ℹ️  未检测到需要保存的关键信息');
    return { success: false, reason: 'no_key_points' };
  }
  
  const summary = `# 对话总结\n\n**时间**: ${new Date().toISOString()}\n\n## 关键点\n${keyPoints.map(p => `- ${p}`).join('\n')}\n`;
  
  if (autoSave) {
    return saveMemory(summary, 'workflow', ['对话总结', '自动保存']);
  } else {
    console.log(summary);
    return { success: true, summary: summary };
  }
}

/**
 * 批量保存
 */
function batchSave(items) {
  console.log(`📦 正在批量保存 ${items.length} 条记忆...\n`);
  
  const results = [];
  
  for (const item of items) {
    const result = saveMemory(item.content, item.category, item.tags || []);
    results.push(result);
    
    // 短暂延迟，避免过快写入
    if (items.indexOf(item) < items.length - 1) {
      // 同步延迟
      const start = Date.now();
      while (Date.now() - start < 100) {}
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ 批量保存完成：${successCount}/${items.length} 成功`);
  
  return results;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     💾 Smart Memory Auto Saver v2.0       ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  if (!command) {
    console.log('用法:');
    console.log('  node auto-saver.js save "内容" [category] [tags]');
    console.log('  node auto-saver.js summarize "对话内容"');
    console.log('  node auto-saver.js batch "[{content, category, tags}]"');
    return;
  }
  
  switch (command) {
    case 'save':
      if (!args[1]) {
        console.log('❌ 请提供要保存的内容');
        return;
      }
      saveMemory(args[1], args[2], args[3] ? args[3].split(',') : []);
      break;
      
    case 'summarize':
      if (!args[1]) {
        console.log('❌ 请提供对话内容');
        return;
      }
      summarizeAndSave(args[1], true);
      break;
      
    case 'batch':
      if (!args[1]) {
        console.log('❌ 请提供 JSON 数组');
        return;
      }
      try {
        const items = JSON.parse(args[1]);
        batchSave(items);
      } catch (error) {
        console.log('❌ JSON 解析失败:', error.message);
      }
      break;
      
    default:
      console.log('❌ 未知命令:', command);
  }
}

// 导出函数
module.exports = {
  saveMemory,
  summarizeAndSave,
  batchSave,
  classifyContent,
  createBackup,
  readFile,
  writeFile,
  CONFIG
};

// 如果直接运行
if (require.main === module) {
  main();
}
