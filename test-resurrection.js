// test-resurrection.js - 测试 v2.1 语义复活功能
const { generateFingerprint, calculateSimilarity, checkResurrection } = require('./heat-tracker');

console.log('🧪 测试 v2.1 语义复活功能...\n');

// 1. 测试指纹生成
console.log('1️⃣ 测试指纹生成:');
const fp1 = generateFingerprint('财务数据 投资回报率 15% 股票');
const fp2 = generateFingerprint('财务数据 投资 股票 市场');
const fp3 = generateFingerprint('今天天气不错 适合爬山');
console.log('   - 指纹 1 (财务相关):', fp1);
console.log('   - 指纹 2 (财务相关):', fp2);
console.log('   - 指纹 3 (天气无关):', fp3);

// 2. 测试相似度计算
console.log('\n2️⃣ 测试相似度计算:');
const sim12 = calculateSimilarity(fp1, fp2);
const sim13 = calculateSimilarity(fp1, fp3);
console.log(`   - 相似度 (财务 vs 财务): ${sim12.toFixed(4)}`);
console.log(`   - 相似度 (财务 vs 天气): ${sim13.toFixed(4)}`);

// 3. 测试复活检测
console.log('\n3️⃣ 测试复活检测:');
const archiveMetadata = {
  'memory/finance/2025-report.md': {
    fingerprint: generateFingerprint('财务数据 投资回报率 15% 股票'),
    heat: 5,
    archivedAt: '2026-02-20'
  },
  'memory/travel/japan-trip.md': {
    fingerprint: generateFingerprint('日本 旅游 东京 大阪 美食'),
    heat: 8,
    archivedAt: '2026-02-15'
  }
};

const context = '我想看看去年的财务投资数据，特别是股票回报率';
const toResurrect = checkResurrection(context, archiveMetadata);

console.log(`   当前上下文: "${context}"`);
if (toResurrect.length > 0) {
  console.log('   ✅ 检测到待复活记忆:');
  toResurrect.forEach(item => {
    console.log(`      - ${item.path} (相似度: ${item.similarity.toFixed(4)}, 原热度: ${item.originalHeat})`);
  });
} else {
  console.log('   ❌ 未检测到需要复活的记忆');
}

console.log('\n✅ 测试完成！');
