#!/usr/bin/env node
/**
 * Heat Tracker - 热度追踪器
 * 
 * 功能：
 * 1. 记录和更新记忆节点的热度
 * 2. 自动衰减计算（基于时间）
 * 3. 生成热度报告（每日/每周/每月）
 * 4. 火花机制：检测低热度但相关的记忆
 * 5. 自动归档建议（90 天未访问）
 * 
 * 用法：
 * node heat-tracker.js update <path>
 * node heat-tracker.js report [daily|weekly|monthly]
 * node heat-tracker.js check
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  memoryTreeRoot: 'D:\\.openclaw-backup\\memory-tree',
  heatLogFile: '99-SYSTEM\\heat-log.json',
  configPath: '99-SYSTEM\\config.json',
  heatReportsDir: '40-EVOLUTION-LOG\\heat-reports',
  
  // 热度参数
  decayFactor: 0.95,        // 每小时衰减系数
  heatIncrement: 10,        // 访问时增加的热度
  lowHeatThreshold: 40,     // 低热度阈值
  highHeatThreshold: 80,    // 高热度阈值
  halfLifeHours: 168,       // 半衰期（7 天=168 小时）
  archiveAfterDays: 90      // 90 天未访问建议归档
};

/**
 * 读取 JSON 文件
 */
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * 写入 JSON 文件
 */
function writeJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`写入失败 ${filePath}:`, error.message);
    return false;
  }
}

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
    return null;
  }
}

/**
 * 获取所有记忆节点
 */
function getAllMemoryNodes() {
  const nodes = [];
  const branchesPath = path.join(CONFIG.memoryTreeRoot, '20-BRANCHES');
  
  if (!fs.existsSync(branchesPath)) {
    return nodes;
  }
  
  function scanDirectory(dirPath, relativePath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      const relPath = path.join(relativePath, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (file.isFile() && file.name.endsWith('.md')) {
        const stats = fs.statSync(fullPath);
        nodes.push({
          path: fullPath,
          relativePath: relPath,
          name: file.name,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      }
    }
  }
  
  scanDirectory(branchesPath, '');
  return nodes;
}

/**
 * 更新节点热度
 */
function updateHeat(nodePath, heatData) {
  const relativePath = path.relative(CONFIG.memoryTreeRoot, nodePath);
  const now = Date.now();
  
  const current = heatData[relativePath] || { heat: 0, lastAccess: now, accessCount: 0 };
  
  // 计算时间衰减
  const hoursSinceAccess = (now - current.lastAccess) / (1000 * 60 * 60);
  const decayedHeat = current.heat * Math.pow(CONFIG.decayFactor, hoursSinceAccess);
  
  // 增加热度
  const newHeat = Math.min(100, decayedHeat + CONFIG.heatIncrement);
  
  heatData[relativePath] = {
    heat: newHeat,
    lastAccess: now,
    accessCount: current.accessCount + 1,
    lastAccessDate: new Date().toISOString()
  };
  
  return heatData;
}

/**
 * 计算所有节点的热度（带衰减）
 */
function calculateAllHeat(heatData) {
  const now = Date.now();
  const result = {};
  
  for (const [nodePath, data] of Object.entries(heatData)) {
    const hoursSinceAccess = (now - data.lastAccess) / (1000 * 60 * 60);
    const decayedHeat = data.heat * Math.pow(CONFIG.decayFactor, hoursSinceAccess);
    
    result[nodePath] = {
      ...data,
      currentHeat: Math.round(decayedHeat)
    };
  }
  
  return result;
}

/**
 * 获取热度等级
 */
function getHeatLevel(heat) {
  if (heat > CONFIG.highHeatThreshold) return '🔥';  // 高热度
  if (heat > CONFIG.lowHeatThreshold) return '🔶';   // 中热度
  return '❄️';  // 低热度
}

/**
 * 生成热度报告
 */
function generateReport(type = 'daily') {
  console.log(`📊 生成${type}热度报告...\n`);
  
  const heatLogPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
  let heatData = readJSON(heatLogPath) || {};
  
  // 计算当前热度
  const currentHeat = calculateAllHeat(heatData);
  
  // 转换为数组并排序
  const heatArray = Object.entries(currentHeat).map(([path, data]) => ({
    path,
    ...data
  }));
  
  heatArray.sort((a, b) => b.currentHeat - a.currentHeat);
  
  // 分类统计
  const highHeat = heatArray.filter(h => h.currentHeat > CONFIG.highHeatThreshold);
  const mediumHeat = heatArray.filter(h => h.currentHeat > CONFIG.lowHeatThreshold && h.currentHeat <= CONFIG.highHeatThreshold);
  const lowHeat = heatArray.filter(h => h.currentHeat <= CONFIG.lowHeatThreshold);
  
  // 90 天未访问的节点
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const oldNodes = heatArray.filter(h => now - h.lastAccess > ninetyDaysMs);
  
  // 生成报告
  const reportDate = new Date().toISOString().split('T')[0];
  const report = {
    generatedAt: new Date().toISOString(),
    type: type,
    summary: {
      totalNodes: heatArray.length,
      highHeatCount: highHeat.length,
      mediumHeatCount: mediumHeat.length,
      lowHeatCount: lowHeat.length,
      avgHeat: Math.round(heatArray.reduce((sum, h) => sum + h.currentHeat, 0) / (heatArray.length || 1))
    },
    topActive: heatArray.slice(0, 10),
    topInactive: heatArray.slice(-10).reverse(),
    oldNodes: oldNodes.map(n => ({
      path: n.path,
      daysSinceAccess: Math.round((now - n.lastAccess) / (1000 * 60 * 60 * 24))
    }))
  };
  
  // 保存报告
  const reportPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatReportsDir, `${reportDate}-${type}-report.json`);
  writeJSON(reportPath, report);
  
  // 打印摘要
  console.log('╔════════════════════════════════════════════╗');
  console.log('║         🔥 记忆热度报告                   ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  console.log(`📅 报告日期：${reportDate}`);
  console.log(`📊 类型：${type}\n`);
  
  console.log('📈 热度分布:');
  console.log(`  🔥 高热度节点：${highHeat.length} 个`);
  console.log(`  🔶 中热度节点：${mediumHeat.length} 个`);
  console.log(`  ❄️  低热度节点：${lowHeat.length} 个`);
  console.log(`  📊 平均热度：${report.summary.avgHeat}\n`);
  
  if (highHeat.length > 0) {
    console.log('🏆 最活跃节点 Top 5:');
    highHeat.slice(0, 5).forEach((node, i) => {
      console.log(`  ${i+1}. ${node.path} (热度：${node.currentHeat})`);
    });
    console.log('');
  }
  
  if (oldNodes.length > 0) {
    console.log(`⚠️  建议归档：${oldNodes.length} 个节点超过 90 天未访问`);
    console.log('   使用 /memory archive 归档这些节点\n');
  }
  
  console.log(`📄 完整报告已保存到：${path.relative(CONFIG.memoryTreeRoot, reportPath)}`);
  
  return report;
}

/**
 * 火花检查：检测低热度但相关的记忆
 */
function checkSparks(contextKeywords) {
  console.log('✨ 检查记忆火花...\n');
  
  const heatLogPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
  let heatData = readJSON(heatLogPath) || {};
  
  const currentHeat = calculateAllHeat(heatData);
  const sparks = [];
  
  // 查找低热度节点
  for (const [nodePath, data] of Object.entries(currentHeat)) {
    // 检查是否低热度且 7 天以上未访问
    const daysSinceAccess = (Date.now() - data.lastAccess) / (1000 * 60 * 60 * 24);
    
    if (data.currentHeat < CONFIG.lowHeatThreshold && daysSinceAccess > 7) {
      // 检查是否与上下文相关
      const isRelevant = contextKeywords && contextKeywords.some(keyword => 
        nodePath.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (isRelevant || daysSinceAccess > 30) {
        sparks.push({
          path: nodePath,
          heat: data.currentHeat,
          daysSinceAccess: Math.round(daysSinceAccess),
          reason: isRelevant ? '上下文相关' : '长时间未访问'
        });
      }
    }
  }
  
  if (sparks.length > 0) {
    console.log('💡 发现以下记忆火花:\n');
    sparks.forEach((spark, i) => {
      console.log(`  ${i+1}. ${spark.path}`);
      console.log(`     热度：${spark.heat} | ${spark.daysSinceAccess}天未访问 | 原因：${spark.reason}\n`);
    });
    console.log('提示：这些记忆很久没用了，要不要回顾一下？\n');
  } else {
    console.log('✅ 没有发现需要关注的记忆火花\n');
  }
  
  return sparks;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     🔥 Smart Memory Heat Tracker v2.0     ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  if (!command) {
    console.log('用法:');
    console.log('  node heat-tracker.js update <path>  - 更新节点热度');
    console.log('  node heat-tracker.js report [daily|weekly|monthly] - 生成报告');
    console.log('  node heat-tracker.js check [keywords] - 检查火花');
    console.log('  node heat-tracker.js list - 列出所有节点热度');
    return;
  }
  
  switch (command) {
    case 'update':
      if (!args[1]) {
        console.log('❌ 请提供节点路径');
        return;
      }
      const heatLogPath = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
      let heatData = readJSON(heatLogPath) || {};
      heatData = updateHeat(args[1], heatData);
      writeJSON(heatLogPath, heatData);
      console.log(`✅ 已更新 ${args[1]} 的热度`);
      break;
      
    case 'report':
      const type = args[1] || 'daily';
      generateReport(type);
      break;
      
    case 'check':
      const keywords = args.slice(1);
      checkSparks(keywords);
      break;
      
    case 'list':
      const heatLogPath2 = path.join(CONFIG.memoryTreeRoot, CONFIG.heatLogFile);
      let heatData2 = readJSON(heatLogPath2) || {};
      const current = calculateAllHeat(heatData2);
      
      console.log('📊 所有节点热度:\n');
      Object.entries(current)
        .sort((a, b) => b[1].currentHeat - a[1].currentHeat)
        .forEach(([node, data]) => {
          const level = getHeatLevel(data.currentHeat);
          console.log(`${level} ${node} (热度：${data.currentHeat}, 访问：${data.accessCount}次)`);
        });
      break;
      
    default:
      console.log('❌ 未知命令:', command);
  }
}

// 导出函数
module.exports = {
  updateHeat,
  calculateAllHeat,
  generateReport,
  checkSparks,
  getHeatLevel,
  readJSON,
  writeJSON,
  CONFIG
};

// 如果直接运行
if (require.main === module) {
  main();
}
