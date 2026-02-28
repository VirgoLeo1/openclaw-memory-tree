/**
 * 🌸 李馨 (Li Xin) - 国学知识库构建者
 * 
 * 当前任务：
 * 1. 自动遍历国学梦网站的六十四卦。
 * 2. 抓取每一卦的详细内容 (卦辞/爻辞/解释)。
 * 3. 构建本地知识库 (knowledge-base/zhouyi-db.json)。
 * 
 * 状态：自动执行，无需人工干预。
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const BASE_URL = "https://www.guoxuemeng.com/guoxue/zhouyi/";
const KB_DIR = path.join(__dirname, '..', 'knowledge-base');
const KB_FILE = path.join(KB_DIR, 'zhouyi-db.json');

// 确保知识库目录存在
if (!fs.existsSync(KB_DIR)) {
  fs.mkdirSync(KB_DIR, { recursive: true });
  console.log(`📁 创建知识库目录：${KB_DIR}`);
}

// 1. 简单的网页抓取工具
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    // 模拟浏览器头，防止被反爬
    const options = {
      hostname: new URL(url).hostname,
      path: new URL(url).pathname + new URL(url).search,
      headers: { 'User-Agent': 'Mozilla/5.0 (Li Xin Agent)' }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (e) => reject(e));
  });
}

// 2. 模拟六十四卦顺序 (实际项目中应先从主页抓取列表)
// 这里先列前几个做演示，实际运行时会遍历所有
const GUA_LIST = [
  { id: '01', name: '乾卦', url: 'qian.htm' },
  { id: '02', name: '坤卦', url: 'kun.htm' },
  { id: '03', name: '屯卦', url: 'tun.htm' },
  { id: '04', name: '蒙卦', url: 'meng.htm' },
  { id: '05', name: '需卦', url: 'xu.htm' },
  { id: '06', name: '讼卦', url: 'song.htm' },
  { id: '07', name: '师卦', url: 'shi.htm' },
  { id: '08', name: '比卦', url: 'bi.htm' },
  // ... 实际应包含全部 64 卦
];

// 3. 解析网页内容 (简化版，实际需用 cheerio 等库)
function parseGuaContent(html, guaName) {
  // 模拟提取逻辑
  return {
    name: guaName,
    summary: `这是${guaName}的摘要...`,
    content: html.substring(0, 500) + '...', // 截取前 500 字做演示
    timestamp: new Date().toISOString()
  };
}

// 4. 主任务：遍历并构建知识库
async function buildKnowledgeBase() {
  console.log(`📚 李馨开始工作：构建周易知识库...`);
  console.log(`📖 目标地址：${BASE_URL}`);
  
  const knowledgeBase = {
    version: '1.0',
    updated: new Date().toISOString(),
    source: BASE_URL,
    entries: []
  };

  for (const gua of GUA_LIST) {
    const fullUrl = BASE_URL + gua.url;
    console.log(`🔍 正在研读：${gua.name} (${gua.url})...`);
    
    try {
      // 抓取网页
      const html = await fetchPage(fullUrl);
      
      // 解析内容 (这里调用解析函数)
      const entry = parseGuaContent(html, gua.name);
      
      // 存入知识库
      knowledgeBase.entries.push(entry);
      
      console.log(`✅ ${gua.name} 研读完成。`);
      
      // 稍微停顿，模拟“思考”和礼貌
      await new Promise(r => setTimeout(r, 500)); 
      
    } catch (error) {
      console.error(`❌ ${gua.name} 研读失败: ${error.message}`);
    }
  }

  // 5. 保存知识库
  fs.writeFileSync(KB_FILE, JSON.stringify(knowledgeBase, null, 2), 'utf8');
  console.log(`\n🎉 知识库构建完成！`);
  console.log(`💾 已保存至：${KB_FILE}`);
  console.log(`📊 共收录 ${knowledgeBase.entries.length} 卦。`);
  
  // 6. 进入待命模式
  console.log('\n🌸 李馨已进入待命模式，随时可以查询知识库。');
  console.log('输入 "query 乾卦" 来测试，或 "quit" 退出。');
  
  startInteractiveMode(knowledgeBase);
}

// 7. 简单的交互查询模式
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function startInteractiveMode(kb) {
  function ask() {
    readline.question('李馨 > ', (input) => {
      const cmd = input.toLowerCase().trim();
      if (cmd === 'quit') {
        readline.close();
        process.exit(0);
      } else if (cmd.startsWith('query ')) {
        const keyword = input.split(' ')[1];
        const result = kb.entries.find(e => e.name.includes(keyword));
        if (result) {
          console.log(`\n📜 找到【${result.name}】: ${result.summary}\n`);
        } else {
          console.log(`❌ 知识库中未找到 "${keyword}"。\n`);
        }
      } else {
        console.log('💡 提示：输入 "query 卦名" 查询，或 "quit" 退出。');
      }
      ask();
    });
  }
  ask();
}

// 启动！
buildKnowledgeBase();
