/**
 * 🛡️ 记忆树守护者 (Memory Tree Guardian)
 * 
 * 功能：
 * 1. 读取专用的 NVIDIA API Key (来自 .env)
 * 2. 定期检查 Git 状态并提交推送
 * 3. 遇到错误自动重试
 * 
 * 使用方式：
 * node scripts/guardian.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. 加载环境变量 (.env)
const dotenvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  console.log('✅ 已加载专用 API Key (来自 .env)');
} else {
  console.warn('⚠️ 未找到 .env 文件，将使用系统默认 Key');
}

// 验证 Key 是否加载
const apiKey = process.env.NVIDIA_API_KEY;
if (!apiKey) {
  console.error('❌ 错误：未找到 NVIDIA_API_KEY');
  process.exit(1);
}

console.log(`🔑 当前使用 Key 前缀: ${apiKey.substring(0, 10)}...`);
console.log('🚀 记忆树守护者启动成功！');

// 2. 定义任务：Git 同步
function syncGit() {
  try {
    console.log('\n📡 正在检查 Git 状态...');
    
    // 检查状态
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    
    if (status) {
      console.log('📝 发现变更，正在提交...');
      execSync('git add .');
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      execSync(`git commit -m "auto: [Guardian] 自动同步 - ${timestamp}"`);
      console.log('📤 正在推送到 GitHub...');
      execSync('git push -u origin master');
      console.log('✅ 推送成功！');
    } else {
      console.log('✅ 无变更，工作区干净');
    }
  } catch (error) {
    const msg = error.message;
    if (msg.includes('nothing to commit') || msg.includes('no changes added')) {
      console.log('✅ 无变更需要提交');
    } else if (msg.includes('Aborting commit')) {
      console.log('⚠️ 提交中止（可能是空提交）');
    } else {
      console.error('❌ 同步失败:', msg.split('\n')[0]);
    }
  }
}

// 3. 启动循环 (每 5 分钟检查一次)
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 分钟

console.log(`⏰ 守护模式启动：每 5 分钟检查一次 Git 状态`);
console.log('按 Ctrl+C 停止守护者\n');

// 立即执行一次
syncGit();

// 定时器
setInterval(syncGit, CHECK_INTERVAL);
