// memory-loader.js - 记忆加载器
// 功能：自动加载核心记忆、按上下文递归加载相关节点

const fs = require('fs');
const path = require('path');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';
const CORE_PATH = path.join(MEMORY_TREE_ROOT, '00-CORE.md');
const INDEX_PATH = path.join(MEMORY_TREE_ROOT, '10-INDEX.md');
const VAULT_PATH = path.join(MEMORY_TREE_ROOT, '30-VAULT.md');

// 加载深度限制
const DEFAULT_LOAD_DEPTH = 3;

// 读取文件内容
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

// 加载核心记忆（必读）
function loadCoreMemory() {
  console.log('📖 加载核心记忆...');
  
  if (!fs.existsSync(CORE_PATH)) {
    console.warn('⚠️  核心记忆文件不存在：' + CORE_PATH);
    return null;
  }
  
  const content = readFile(CORE_PATH);
  console.log('✅ 核心记忆加载完成');
  return content;
}

// 加载索引文件
function loadIndex() {
  console.log('📚 加载记忆索引...');
  
  if (!fs.existsSync(INDEX_PATH)) {
    console.warn('⚠️  索引文件不存在：' + INDEX_PATH);
    return null;
  }
  
  const content = readFile(INDEX_PATH);
  console.log('✅ 索引加载完成');
  return content;
}

// 解析索引中的节点路径
function parseIndexNodes(indexContent) {
  if (!indexContent) return [];
  
  const nodes = [];
  const lines = indexContent.split('\n');
  
  lines.forEach(line => {
    // 匹配 Markdown 链接格式：[名称](路径)
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      nodes.push({
        name: linkMatch[1],
        path: linkMatch[2]
      });
    }
  });
  
  return nodes;
}

// 根据关键词加载相关节点
function loadRelevantNodes(keywords, depth = DEFAULT_LOAD_DEPTH) {
  console.log(`🔍 根据关键词加载相关节点 (深度：${depth})...`);
  console.log(`   关键词：${keywords.join(', ')}`);
  
  const loadedNodes = [];
  const branchesPath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES');
  
  if (!fs.existsSync(branchesPath)) {
    console.warn('⚠️  分支目录不存在：' + branchesPath);
    return loadedNodes;
  }
  
  // 遍历分支目录
  const branches = fs.readdirSync(branchesPath);
  
  branches.forEach(branch => {
    const branchPath = path.join(branchesPath, branch);
    const stat = fs.statSync(branchPath);
    
    if (stat.isDirectory()) {
      // 递归查找匹配的文件
      const matches = findMatchingFiles(branchPath, keywords, depth);
      matches.forEach(matchPath => {
        const content = readFile(matchPath);
        if (content) {
          loadedNodes.push({
            path: matchPath,
            content: content,
            type: 'file'
          });
          console.log(`   ✅ 加载：${path.relative(MEMORY_TREE_ROOT, matchPath)}`);
        }
      });
    }
  });
  
  console.log(`✅ 共加载 ${loadedNodes.length} 个相关节点`);
  return loadedNodes;
}

// 递归查找匹配的文件
function findMatchingFiles(dirPath, keywords, maxDepth, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  
  const matches = [];
  const dirName = path.basename(dirPath).toLowerCase();
  
  // 检查目录名是否匹配关键词
  const isMatch = keywords.some(kw => dirName.includes(kw.toLowerCase()));
  
  if (isMatch) {
    // 如果是目录，读取其中所有.md 文件
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(dirPath, f));
    matches.push(...files);
  }
  
  // 继续递归子目录
  if (currentDepth < maxDepth) {
    try {
      const entries = fs.readdirSync(dirPath)
        .map(f => path.join(dirPath, f))
        .filter(p => {
          try {
            return fs.statSync(p).isDirectory();
          } catch {
            return false;
          }
        });
      
      entries.forEach(entry => {
        matches.push(...findMatchingFiles(entry, keywords, maxDepth, currentDepth + 1));
      });
    } catch (error) {
      // 忽略权限错误等
    }
  }
  
  return matches;
}

// 根据上下文自动加载
function autoLoad(context = '') {
  console.log('🚀 启动记忆自动加载...');
  
  // 1. 必读核心记忆
  const core = loadCoreMemory();
  
  // 2. 加载索引
  const index = loadIndex();
  
  // 3. 从上下文中提取关键词
  const keywords = extractKeywords(context);
  
  // 4. 预加载时间/场景匹配的记忆
  const timeMatches = loadTimeBasedMemories();
  
  // 5. 加载相关节点
  const relevantNodes = loadRelevantNodes(keywords);
  
  console.log('✅ 记忆自动加载完成');
  
  return {
    core,
    index,
    relevantNodes,
    timeMatches,
    loadedCount: relevantNodes.length + timeMatches.length
  };
}

// 从上下文提取关键词
function extractKeywords(context) {
  if (!context) return [];
  
  // 简单的关键词提取（可扩展为更智能的 NLP）
  const commonKeywords = [
    'moltbook', 'python', '记忆', '技能', '项目', '工作流',
    'tech', 'workflow', 'projects', 'platform'
  ];
  
  const lowerContext = context.toLowerCase();
  return commonKeywords.filter(kw => lowerContext.includes(kw.toLowerCase()));
}

// 加载基于时间的记忆（如每日任务、周期性内容）
function loadTimeBasedMemories() {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  const timeMatches = [];
  const timePath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', 'workflow', 'time-based');
  
  if (fs.existsSync(timePath)) {
    // 早晨记忆
    if (hour >= 6 && hour < 12) {
      const morningFile = path.join(timePath, 'morning.md');
      if (fs.existsSync(morningFile)) {
        timeMatches.push({ path: morningFile, content: readFile(morningFile) });
      }
    }
    
    // 晚间记忆
    if (hour >= 20 || hour < 6) {
      const eveningFile = path.join(timePath, 'evening.md');
      if (fs.existsSync(eveningFile)) {
        timeMatches.push({ path: eveningFile, content: readFile(eveningFile) });
      }
    }
    
    // 周末记忆
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const weekendFile = path.join(timePath, 'weekend.md');
      if (fs.existsSync(weekendFile)) {
        timeMatches.push({ path: weekendFile, content: readFile(weekendFile) });
      }
    }
  }
  
  return timeMatches;
}

// 导出的函数
module.exports = {
  loadCoreMemory,
  loadIndex,
  loadRelevantNodes,
  autoLoad,
  extractKeywords,
  loadTimeBasedMemories,
  readFile,
  MEMORY_TREE_ROOT,
  CORE_PATH,
  INDEX_PATH
};

// 如果直接运行此文件
if (require.main === module) {
  console.log('🔧 记忆加载器测试模式\n');
  
  const result = autoLoad('今天想聊聊 moltbook 和 python 项目的事');
  
  console.log('\n📊 加载统计:');
  console.log(`   核心记忆：${result.core ? '✅' : '❌'}`);
  console.log(`   索引文件：${result.index ? '✅' : '❌'}`);
  console.log(`   相关节点：${result.relevantNodes.length} 个`);
  console.log(`   时间匹配：${result.timeMatches.length} 个`);
  console.log(`   总计加载：${result.loadedCount} 个节点`);
}
