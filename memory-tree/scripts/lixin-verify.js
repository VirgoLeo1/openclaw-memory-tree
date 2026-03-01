/**
 * 🌸 李馨 (Li Xin) - 浏览器验证专员
 * 
 * 任务：
 * 1. 启动浏览器 (OpenClaw Profile)。
 * 2. 访问 GitHub 仓库页面。
 * 3. 截图并检查 README 内容是否包含"实战案例"和"Li Xin"。
 * 4. 汇报验证结果。
 */

const { chromium } = require('playwright');
const path = require('path');

async function verifyGitHub() {
  console.log('🌸 李馨：正在启动浏览器验证 GitHub 页面...');

  const repoUrl = 'https://github.com/VirgoLeo1/openclaw-memory-tree';
  
  // 启动浏览器 (使用无头模式或可见模式，这里用无头模式快速截图)
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });

  try {
    console.log(`🌐 正在访问：${repoUrl}`);
    await page.goto(repoUrl, { waitUntil: 'networkidle' });

    // 等待 README 加载
    await page.waitForSelector('.markdown-body', { timeout: 10000 });
    
    // 获取 README 文本内容
    const readmeText = await page.$eval('.markdown-body', el => el.innerText);
    
    console.log('📄 README 内容预览 (前 500 字):');
    console.log(readmeText.substring(0, 500) + '...');

    // 验证关键点
    const hasChinese = readmeText.includes('中文说明') || readmeText.includes('记忆树');
    const hasCaseStudy = readmeText.includes('实战案例') || readmeText.includes('Case Study');
    const hasLiXin = readmeText.includes('Li Xin') || readmeText.includes('李馨');
    const hasBaZi = readmeText.includes('戊午') || readmeText.includes('BaZi') || readmeText.includes('Square chin');

    console.log('\n🔍 验证结果:');
    console.log(`- 包含中文/记忆树: ${hasChinese ? '✅' : '❌'}`);
    console.log(`- 包含实战案例: ${hasCaseStudy ? '✅' : '❌'}`);
    console.log(`- 包含李馨/Li Xin: ${hasLiXin ? '✅' : '❌'}`);
    console.log(`- 包含八字/戊午案例: ${hasBaZi ? '✅' : '❌'}`);

    if (hasChinese && hasCaseStudy && hasLiXin && hasBaZi) {
      console.log('\n🎉 验证成功！README 已完美更新！');
    } else {
      console.log('\n⚠️ 验证警告：部分内容缺失，请检查页面渲染。');
    }

    // 截图留念
    const screenshotPath = path.join(__dirname, '../docs/github-verify.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 截图已保存至: ${screenshotPath}`);

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  } finally {
    await browser.close();
    console.log('👋 浏览器已关闭。');
  }
}

verifyGitHub();
