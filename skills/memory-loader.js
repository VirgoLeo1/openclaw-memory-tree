#!/usr/bin/env node
/**
 * Memory Loader - 记忆加载器
 * 
 * 功能：
 * 1. 自动加载核心记忆（00-CORE.md, 10-INDEX.md）
 * 2. 根据上下文关键词智能加载相关分支
 * 3. 支持递归加载子节点（可配置深度）
 * 4. 预加载时间/场景匹配的记忆
 * 5. 显示加载进度和统计
 * 
 * 用法：
 * node memory-loader.js [topic] [depth]
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  memoryTreeRoot: 'D:\\.openclaw-backup\\memory-tree',
  defaultLoadDepth: 3,
  maxLoadDepth: 5,
  coreFiles: ['00-CORE.md', '10-INDEX.md'],
  branchesDir: '20-BRANCHES',
  cacheDir: '99-SYSTEM\\cache',
  heatLogFile: '99-SYSTEM\\access-log.json'
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
 * 获取文件热度
 */
function getHeat(filePath, heatLog) {
  const relativePath = path.relative(CONFIG.memoryTreeRoot, filePath);
  const logEntry = heatLog[relativePath];
  
  if (!logEntry) return 0;
  
  const now = Date.now();
  const lastAccess = logEntry.lastAccess || 0;
  const heat = logEntry.heat || 0;
  
  // 计算衰减
  const hoursSinceAccess = (now - lastAccess) / (1000 * 60 * 60);
  const decayFactor = Math.pow(0.95, hoursSinceAccess / 24); // 每天衰减 5%
  
  return Math.round(heat * decayFactor);
}

/**
 * 更新文件热度
 */
function updateHeat(filePath, heatLog) {
  const relativePath = path.relative(CONFIG.memoryTreeRoot, filePath);
  const now = Date.now();
  
  const currentHeat = heatLog[relativePath]?.heat || 0;
  const newHeat = Math.min(100, currentHeat * 0.95 + 10); // 新热度 = 旧热度×0.95 + 10
  
  heatLog[relativePath] = {
    lastAccess: now,
    heat: newHeat,
    accessCount: (heatLog[relativePath]?.accessCount || 0) + 1
  };
  
  // 保存热度日志
  const heatLogPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
  writeFile(heatLogPath, JSON.stringify(heatLog, null, 2));
  
  return newHeat;
}

/**
 * 加载核心记忆文件
 */
function loadCoreMemories() {
  console.log('🧠 正在加载核心记忆...\n');
  
  const results = {
    core: [],
    branches: [],
    totalSize: 0,
    loadedCount: 0
  };
  
  // 加载核心文件
  for (const file of CONFIG.coreFiles) {
    const filePath = path.join(CONFIG.memoryTreeRoot, file);
    const content = readFile(filePath);
    
    if (content) {
      results.core.push({
        file: file,
        path: filePath,
        content: content,
        size: Buffer.byteLength(content, 'utf-8')
      });
      results.totalSize += Buffer.byteLength(content, 'utf-8');
      results.loadedCount++;
      console.log(`✅ 已加载：${file} (${(Buffer.byteLength(content, 'utf-8') / 1024).toFixed(1)}KB)`);
    } else {
      console.log(`⚠️  未找到：${file}`);
    }
  }
  
  return results;
}

/**
 * 根据关键词加载相关分支
 */
function loadRelatedBranches(keywords, depth = CONFIG.defaultLoadDepth) {
  console.log(`\n🔍 根据关键词加载相关分支：${keywords.join(', ')} (深度：${depth})\n`);
  
  const results = {
    branches: [],
    totalSize: 0,
    loadedCount: 0
  };
  
  const branchesPath = path.join(CONFIG.memoryTreeRoot, CONFIG.branchesDir);
  
  if (!fs.existsSync(branchesPath)) {
    console.log('⚠️  分支目录不存在');
    return results;
  }
  
  // 加载热度日志
  const heatLogPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
  const heatLog = JSON.parse(readFile(heatLogPath) || '{}');
  
  // 递归加载目录
  function loadDirectory(dirPath, currentDepth, relativePath) {
    if (currentDepth > depth) return;
    
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      const relPath = path.join(relativePath, file.name);
      
      if (file.isDirectory()) {
        // 递归加载子目录
        loadDirectory(fullPath, currentDepth + 1, relPath);
      } else if (file.isFile() && file.name.endsWith('.md')) {
        // 检查是否匹配关键词
        const fileName = path.basename(file.name, '.md');
        const isMatch = keywords.some(keyword => 
          fileName.toLowerCase().includes(keyword.toLowerCase()) ||
          relPath.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // 如果是根目录加载或匹配关键词
        if (currentDepth === 1 || isMatch) {
          const content = readFile(fullPath);
          
          if (content) {
            const heat = updateHeat(fullPath, heatLog);
            const heatLevel = heat > 80 ? '🔥' : heat > 40 ? '🔶' : '❄️';
            
            results.branches.push({
              file: file.name,
              path: fullPath,
              relativePath: relPath,
              content: content,
              size: Buffer.byteLength(content, 'utf-8'),
              heat: heat,
              heatLevel: heatLevel
            });
            
            results.totalSize += Buffer.byteLength(content, 'utf-8');
            results.loadedCount++;
            
            console.log(`✅ ${heatLevel} 已加载：${relPath} (${(Buffer.byteLength(content, 'utf-8') / 1024).toFixed(1)}KB, 热度：${heat})`);
          }
        }
      }
    }
  }
  
  loadDirectory(branchesPath, 1, '');
  
  return results;
}

/**
 * 预加载时间/场景匹配的记忆
 */
function loadTimeBasedMemories() {
  console.log('\n⏰ 检查时间/场景匹配的记忆...\n');
  
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const timeKeywords = [];
  
  // 根据时间添加关键词
  if (hour >= 5 && hour < 12) {
    timeKeywords.push('morning', '早上', '上午');
  } else if (hour >= 12 && hour < 14) {
    timeKeywords.push('noon', '中午', '午餐');
  } else if (hour >= 14 && hour < 18) {
    timeKeywords.push('afternoon', '下午');
  } else if (hour >= 18 && hour < 23) {
    timeKeywords.push('evening', '晚上');
  } else {
    timeKeywords.push('night', '深夜', '凌晨');
  }
  
  // 周末
  if (day === 0 || day === 6) {
    timeKeywords.push('weekend', '周末');
  }
  
  // 加载匹配的记忆
  return loadRelatedBranches(timeKeywords, 2);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const topic = args[0] || null;
  const depth = parseInt(args[1]) || CONFIG.defaultLoadDepth;
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     🧠 Smart Memory Tree Loader v2.0      ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  // 1. 加载核心记忆
  const coreResults = loadCoreMemories();
  
  // 2. 如果指定了主题，加载相关分支
  let branchResults = { branches: [], totalSize: 0, loadedCount: 0 };
  
  if (topic) {
    const keywords = [topic, ...topic.split(/[\s,_]+/)];
    branchResults = loadRelatedBranches(keywords, depth);
  } else {
    // 否则自动加载时间匹配的记忆
    branchResults = loadTimeBasedMemories();
  }
  
  // 3. 汇总统计
  const totalSize = coreResults.totalSize + branchResults.totalSize;
  const totalCount = coreResults.loadedCount + branchResults.loadedCount;
  
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║              📊 加载统计                   ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`\n📦 核心文件：${coreResults.loadedCount} 个 (${(coreResults.totalSize / 1024).toFixed(1)}KB)`);
  console.log(`🌿 分支节点：${branchResults.loadedCount} 个 (${(branchResults.totalSize / 1024).toFixed(1)}KB)`);
  console.log(`📊 总计：${totalCount} 个文件 (${(totalSize / 1024).toFixed(1)}KB)`);
  
  if (branchResults.branches.length > 0) {
    const avgHeat = Math.round(
      branchResults.branches.reduce((sum, b) => sum + b.heat, 0) / branchResults.branches.length
    );
    console.log(`🔥 平均热度：${avgHeat}`);
  }
  
  console.log(`\n✅ 记忆加载完成！\n`);
  
  // 返回结果（供其他模块使用）
  return {
    core: coreResults.core,
    branches: branchResults.branches,
    stats: {
      totalSize,
      totalCount,
      avgHeat: branchResults.branches.length > 0 ? 
        Math.round(branchResults.branches.reduce((sum, b) => sum + b.heat, 0) / branchResults.branches.length) : 0
    }
  };
}

// 导出函数
module.exports = {
  loadCoreMemories,
  loadRelatedBranches,
  loadTimeBasedMemories,
  readFile,
  writeFile,
  CONFIG
};

// 如果直接运行
if (require.main === module) {
  main().catch(console.error);
}
