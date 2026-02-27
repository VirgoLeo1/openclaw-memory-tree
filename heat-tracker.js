// heat-tracker.js - 记忆热度追踪器
// 功能：追踪记忆节点的热度，自动衰减，生成火花提醒

const fs = require('fs');
const path = require('path');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';
const HEAT_LOG_PATH = path.join(MEMORY_TREE_ROOT, '99-SYSTEM', 'heat-log.json');
const CORE_PATH = path.join(MEMORY_TREE_ROOT, '00-CORE.md');

// ========== v2.0 配置参数 ==========
// 热度阈值
const HEAT_HIGH = 80;
const HEAT_MEDIUM = 40;

// 衰减率
const DECAY_RATE = 0.95; // 基础衰减率 (5% 自然衰减)
const LOW_CONFIDENCE_DECAY = 0.90; // 低置信度衰减率 (10% 衰减)
const NO_EVIDENCE_DECAY = 0.85; // 无证据链高风险内容衰减率 (15% 衰减)

// 其他常量
const BOOST_AMOUNT = 10; // 有效访问增加的热度
const HIGH_RISK_CAP = 30; // 无证据链高风险内容的热度上限
const ECHO_CHAMBER_THRESHOLD = 80; // 回音室检查热度阈值
const ECHO_CHAMBER_PENALTY = 0.5; // 回音室惩罚系数
const MAX_CONSECUTIVE_ACCESSES = 5; // 连续访问阈值
const ACCESS_COOLDOWN_MS = 5 * 60 * 1000; // 5 分钟冷却时间

// 高风险关键词 (需要证据链)
const HIGH_RISK_KEYWORDS = ['财务', '投资', '配置', '密码', '密钥', '删除', '生产环境', '数据库', '转账', '支付'];

// 置信度等级
const CONFIDENCE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// 读取热度日志
function loadHeatLog() {
  if (fs.existsSync(HEAT_LOG_PATH)) {
    return JSON.parse(fs.readFileSync(HEAT_LOG_PATH, 'utf-8'));
  }
  return {
    nodes: {},
    lastDecay: new Date().toISOString(),
    logs: []
  };
}

// 保存热度日志
function saveHeatLog(heatLog) {
  const dir = path.dirname(HEAT_LOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(HEAT_LOG_PATH, JSON.stringify(heatLog, null, 2));
}

// 获取节点热度
function getNodeHeat(nodePath) {
  const heatLog = loadHeatLog();
  return heatLog.nodes[nodePath]?.heat || 0;
}

// 更新节点热度
function updateNodeHeat(nodePath, boost = BOOST_AMOUNT) {
  const heatLog = loadHeatLog();
  const now = new Date();
  
  if (!heatLog.nodes[nodePath]) {
    heatLog.nodes[nodePath] = {
      heat: 0,
      lastAccessed: now.toISOString(),
      accessCount: 0
    };
  }
  
  const node = heatLog.nodes[nodePath];
  node.heat = Math.min(100, node.heat * DECAY_RATE + boost);
  node.lastAccessed = now.toISOString();
  node.accessCount = (node.accessCount || 0) + 1;
  
  // 记录日志
  heatLog.logs.push({
    timestamp: now.toISOString(),
    node: nodePath,
    action: 'access',
    newHeat: node.heat
  });
  
  // 保留最近 1000 条日志
  if (heatLog.logs.length > 1000) {
    heatLog.logs = heatLog.logs.slice(-1000);
  }
  
  saveHeatLog(heatLog);
  return node.heat;
}

// 应用热度衰减
function applyDecay() {
  const heatLog = loadHeatLog();
  const now = new Date();
  const lastDecay = new Date(heatLog.lastDecay);
  
  // 如果距离上次衰减超过 24 小时
  const hoursSinceDecay = (now - lastDecay) / (1000 * 60 * 60);
  if (hoursSinceDecay >= 24) {
    console.log(`📉 应用热度衰减 (距离上次：${hoursSinceDecay.toFixed(1)}小时)`);
    
    Object.keys(heatLog.nodes).forEach(nodePath => {
      const node = heatLog.nodes[nodePath];
      node.heat = Math.max(0, node.heat * DECAY_RATE);
    });
    
    heatLog.lastDecay = now.toISOString();
    saveHeatLog(heatLog);
    console.log('✅ 热度衰减完成');
  }
}

// 获取热度等级
function getHeatLevel(heat) {
  if (heat > HEAT_HIGH) return '🔥高';
  if (heat > HEAT_MEDIUM) return '🔶中';
  return '❄️低';
}

// 生成热度报告
function generateHeatReport() {
  const heatLog = loadHeatLog();
  const nodes = Object.entries(heatLog.nodes)
    .map(([path, data]) => ({
      path,
      heat: data.heat,
      level: getHeatLevel(data.heat),
      accessCount: data.accessCount || 0,
      lastAccessed: data.lastAccessed
    }))
    .sort((a, b) => b.heat - a.heat);
  
  const report = {
    generated: new Date().toISOString(),
    totalNodes: nodes.length,
    highHeat: nodes.filter(n => n.heat > HEAT_HIGH).length,
    mediumHeat: nodes.filter(n => n.heat > HEAT_MEDIUM && n.heat <= HEAT_HIGH).length,
    lowHeat: nodes.filter(n => n.heat <= HEAT_MEDIUM).length,
    topNodes: nodes.slice(0, 10)
  };
  
  // 保存到报告目录
  const reportPath = path.join(MEMORY_TREE_ROOT, '40-EVOLUTION-LOG', 'heat-reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const reportFile = path.join(reportPath, `heat-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  return report;
}

// 检测火花（低热度但相关）
function detectSparks(currentContext, threshold = 30) {
  const heatLog = loadHeatLog();
  const sparks = [];
  
  Object.entries(heatLog.nodes).forEach(([nodePath, data]) => {
    if (data.heat < threshold && data.heat > 0) {
      // 检查是否与当前上下文相关
      if (isRelevant(nodePath, currentContext)) {
        sparks.push({
          path: nodePath,
          heat: data.heat,
          level: getHeatLevel(data.heat),
          lastAccessed: data.lastAccessed,
          message: `💡 记忆火花： "${nodePath}" 热度较低 (${data.heat.toFixed(1)})，但可能与当前话题相关，要看看吗？`
        });
      }
    }
  });
  
  return sparks.sort((a, b) => b.heat - a.heat);
}

// 简单的关键词匹配（可扩展为更复杂的相关性算法）
function isRelevant(nodePath, context) {
  if (!context) return false;
  const lowerPath = nodePath.toLowerCase();
  const lowerContext = context.toLowerCase();
  
  // 提取路径中的关键词
  const keywords = lowerPath.split(/[\/\\\-_]/).filter(k => k.length > 2);
  
  // 检查是否有关键词出现在上下文中
  return keywords.some(keyword => lowerContext.includes(keyword));
}

// ========== v2.1 语义复活功能 (原型) ==========

/**
 * 生成简易记忆指纹 (v2.1-alpha 模拟版)
 * 注：生产环境请替换为 nomic-embed-text 等真实嵌入模型
 * @param {string} content - 节点内容
 * @returns {number[]} - 简易词频向量 (模拟)
 */
function generateFingerprint(content) {
  if (!content) return [];
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const vocab = [...new Set(words)].slice(0, 50); // 取前 50 个唯一词作为简易向量
  const vector = vocab.map(word => words.filter(w => w === word).length);
  return vector;
}

/**
 * 计算余弦相似度
 * @param {number[]} vecA - 向量 A
 * @param {number[]} vecB - 向量 B
 * @returns {number} - 相似度 (0-1)
 */
function calculateSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 检查是否需要复活归档记忆
 * @param {string} currentContext - 当前上下文
 * @param {Object} archiveMetadata - 归档元数据
 * @returns {Array} - 待复活的节点列表
 */
function checkResurrection(currentContext, archiveMetadata) {
  const contextVec = generateFingerprint(currentContext);
  const toResurrect = [];
  Object.entries(archiveMetadata).forEach(([nodePath, meta]) => {
    const similarity = calculateSimilarity(contextVec, meta.fingerprint || []);
    if (similarity > 0.85) {
      toResurrect.push({ path: nodePath, similarity, originalHeat: meta.heat });
    }
  });
  return toResurrect.sort((a, b) => b.similarity - a.similarity);
}

// 导出函数
module.exports = {
  getNodeHeat,
  updateNodeHeat,
  applyDecay,
  generateHeatReport,
  detectSparks,
  getHeatLevel,
  loadHeatLog,
  // v2.1 新增导出
  generateFingerprint,
  calculateSimilarity,
  checkResurrection,
  HEAT_HIGH,
  HEAT_MEDIUM,
  DECAY_RATE
};

// 如果直接运行此文件
if (require.main === module) {
  console.log('🔥 热度追踪器测试模式');
  
  // 测试更新热度
  updateNodeHeat('tech/python/compatibility', 10);
  updateNodeHeat('platform/moltbook/strategy', 15);
  
  // 应用衰减
  applyDecay();
  
  // 生成报告
  const report = generateHeatReport();
  console.log('\n📊 热度报告摘要:');
  console.log(`   总节点数：${report.totalNodes}`);
  console.log(`   🔥高热度：${report.highHeat}`);
  console.log(`   🔶中热度：${report.mediumHeat}`);
  console.log(`   ❄️低热度：${report.lowHeat}`);
  
  console.log('\n🏆 Top 5 热门节点:');
  report.topNodes.slice(0, 5).forEach((node, i) => {
    console.log(`   ${i + 1}. ${node.path} (${node.level} ${node.heat.toFixed(1)})`);
  });
}
