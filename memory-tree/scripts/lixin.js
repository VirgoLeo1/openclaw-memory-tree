/**
 * 🌸 李馨 (Li Xin) - 国学与网页阅读助手
 * 
 * 职责：
 * 1. 深度阅读指定网页（如国学梦、周易卦象）。
 * 2. 监听用户指令，进行智能解读。
 * 3. 长期驻守，随时待命。
 * 
 * 配置：
 * - 使用专用 NVIDIA API Key (来自 .env)
 * - 目标网页：可动态指定
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. 加载环境变量
const dotenvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(dotenvPath)) {
  const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
  dotenvContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
  console.log('🌸 李馨 (Li Xin) 已启动，加载专用 Key...');
}

const API_KEY = process.env.NVIDIA_API_KEY;
const TARGET_URL = "https://www.guoxuemeng.com/guoxue/zhouyi/";

console.log(`📖 专注阅读：${TARGET_URL}`);
console.log('👋 我是李馨，随时听候峰哥调遣。输入 "help" 查看指令。\n');

// 2. 网页抓取工具 (简化版)
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 3. 命令处理循环
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask() {
  readline.question('李馨等待指令 > ', (input) => {
    const cmd = input.toLowerCase().trim();
    
    if (cmd === 'quit' || cmd === 'exit') {
      console.log('👋 李馨告退。');
      readline.close();
      process.exit(0);
    } else if (cmd === 'help') {
      console.log(`
📜 李馨能做的事：
1. read [关键词] - 阅读网页并查找关键词 (如: read 乾卦)
2. summarize - 总结当前网页内容
3. monitor - 开始监控网页变化 (模拟)
4. quit - 退出
      `);
    } else if (cmd.startsWith('read ')) {
      const keyword = input.split(' ')[1];
      console.log(`🔍 正在阅读并查找 "${keyword}" ...`);
      // 这里可以接入 LLM 进行深度分析
      fetchPage(TARGET_URL).then(html => {
        if (html.includes(keyword)) {
          console.log(`✅ 在网页中找到了 "${keyword}" 相关内容！(内容过长，已省略，可进一步分析)`);
        } else {
          console.log(`❌ 未在当前页面找到 "${keyword}"。`);
        }
        ask();
      }).catch(err => {
        console.error('❌ 阅读失败:', err.message);
        ask();
      });
      return;
    } else {
      console.log('❓ 李馨没听懂，试试 "help" 查看指令。');
    }
    ask();
  });
}

ask();
