// 测试剪枝功能
const path = require('path');
const trackerPath = path.join(__dirname, 'heat-tracker.js');

// 加载模块
const tracker = require(trackerPath);

console.log('🧪 开始测试剪枝功能 (pruneOldMemories)...\n');

try {
  // 尝试调用剪枝函数
  if (typeof tracker.pruneOldMemories === 'function') {
    const result = tracker.pruneOldMemories();
    console.log('✅ 剪枝测试成功！');
    console.log('结果:', result);
  } else {
    console.log('❌ 错误：pruneOldMemories 函数未找到或未导出。');
    console.log('可用导出:', Object.keys(tracker));
  }
} catch (e) {
  console.error('❌ 测试报错:', e.message);
}
