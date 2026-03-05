// index.js - 记忆树主入口
// 功能：整合所有模块，提供统一接口

const fs = require('fs');
const path = require('path');

// 导入所有模块
const autoSaver = require('./auto-saver');
const heatTracker = require('./heat-tracker');
const memoryLoader = require('./memory-loader');
const searchEngine = require('./search-engine');
const vaultReader = require('./vault-reader');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';

// 初始化记忆树
function init(options = {}) {
  console.log('🌳 初始化记忆树系统...\n');
  
  const { autoLoad = true, context = {} } = options;
  
  // 1. 加载核心记忆和索引
  const loadResult = autoLoad ? memoryLoader.autoLoad(typeof context === 'string' ? context : '') : null;
  
  // 2. 应用热度衰减
  heatTracker.applyDecay();
  
  // 3. 检测火花
  const sparks = heatTracker.detectSparks(context.currentTopic || '');
  if (sparks.length > 0) {
    console.log('\n💡 记忆火花:');
    sparks.forEach(spark => {
      console.log(`   ${spark.message}`);
    });
  }
  
  // 4. 启动自动保存（如果需要）
  if (options.autoSave) {
    autoSaver.startAutoSave(options.getMessagesFn);
  }
  
  console.log('\n✅ 记忆树系统初始化完成\n');
  
  return {
    loadResult,
    sparks
  };
}

// 保存记忆
function saveMemory(content, options = {}) {
  const { topic, tags = [] } = options;
  
  // 保存到对应分支
  if (topic) {
    const branchPath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES', topic);
    if (!fs.existsSync(branchPath)) {
      fs.mkdirSync(branchPath, { recursive: true });
    }
    
    const fileName = `memory-${Date.now()}.md`;
    const filePath = path.join(branchPath, fileName);
    
    let fileContent = `# 记忆 - ${new Date().toISOString()}\n\n`;
    if (tags.length > 0) {
      fileContent += `标签：${tags.map(t => `#${t}`).join(' ')}\n\n`;
    }
    fileContent += content;
    
    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ 已保存记忆到 ${filePath}`);
    
    // 更新热度
    heatTracker.updateNodeHeat(topic);
    
    return filePath;
  }
  
  return null;
}

// 搜索记忆
function search(query, options = {}) {
  return searchEngine.advancedSearch(query, options);
}

// 获取凭证
function getVaultCredential(service, field) {
  return vaultReader.getCredential(service, field);
}

// 生成记忆报告
function generateReport(type = 'daily') {
  const now = new Date();
  const report = {
    type,
    generated: now.toISOString(),
    heatReport: heatTracker.generateHeatReport(),
    recentFiles: []
  };
  
  // 获取最近的文件
  const branchesPath = path.join(MEMORY_TREE_ROOT, '20-BRANCHES');
  if (fs.existsSync(branchesPath)) {
    const files = [];
    
    function walkDir(dirPath) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const stats = fs.statSync(fullPath);
          files.push({
            path: fullPath,
            mtime: stats.mtimeMs
          });
        }
      });
    }
    
    walkDir(branchesPath);
    
    // 按时间排序
    files.sort((a, b) => b.mtime - a.mtime);
    report.recentFiles = files.slice(0, 20).map(f => ({
      path: f.path.replace(MEMORY_TREE_ROOT + path.sep, ''),
      modified: new Date(f.mtime).toISOString()
    }));
  }
  
  // 保存报告
  const reportPath = path.join(MEMORY_TREE_ROOT, '40-EVOLUTION-LOG', 'heat-reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const reportFile = path.join(reportPath, `${type}-report-${now.toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  return report;
}

// 导出所有模块
module.exports = {
  init,
  saveMemory,
  search,
  getVaultCredential,
  generateReport,
  autoSaver,
  heatTracker,
  memoryLoader,
  searchEngine,
  vaultReader,
  MEMORY_TREE_ROOT
};

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🌳 记忆树管理系统\n');
  
  switch (command) {
    case 'init':
      init({ autoLoad: true });
      break;
      
    case 'search':
      const query = args.slice(1).join(' ');
      if (query) {
        console.log(`搜索："${query}"\n`);
        const results = search(query);
        results.forEach((r, i) => {
          console.log(`${i + 1}. ${r.path || r.fullPath}`);
        });
      } else {
        console.log('用法：node index.js search <关键词>');
      }
      break;
      
    case 'heat':
      const report = generateReport('on-demand');
      console.log('\n📊 热度报告:');
      console.log(`   总节点：${report.heatReport.totalNodes}`);
      console.log(`   🔥高热度：${report.heatReport.highHeat}`);
      console.log(`   🔶中热度：${report.heatReport.mediumHeat}`);
      console.log(`   ❄️低热度：${report.heatReport.lowHeat}`);
      break;
      
    case 'services':
      const services = vaultReader.listServices();
      console.log('\n可用服务:');
      services.forEach(s => console.log(`  - ${s}`));
      break;
      
    default:
      console.log('用法:');
      console.log('  node index.js init          - 初始化记忆树');
      console.log('  node index.js search <词>   - 搜索记忆');
      console.log('  node index.js heat          - 查看热度报告');
      console.log('  node index.js services      - 列出凭证服务');
  }
}
