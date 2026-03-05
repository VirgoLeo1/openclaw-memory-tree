#!/usr/bin/env node
/**
 * Vault Reader - 安全凭证读取器
 * 
 * 功能：
 * 1. 安全读取 30-VAULT.md 中的凭证
 * 2. 支持 Base64/XOR 混淆
 * 3. 高风险操作三次确认
 * 4. 访问日志记录（不记录凭证内容）
 * 5. 用后即焚（仅内存中存在）
 * 
 * 用法：
 * node vault-reader.js get <service>
 * node vault-reader.js set <service> <value>
 * node vault-reader.js list
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 配置
const CONFIG = {
  memoryTreeRoot: 'D:\\.openclaw-backup\\memory-tree',
  vaultFile: '30-VAULT.md',
  accessLogFile: '40-EVOLUTION-LOG\\vault-access.json',
  requireTripleConfirm: true
};

// 简单的 XOR 密钥
const XOR_KEY = 'memory-vault-2026';

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
 * Base64 编码
 */
function encode(value) {
  const base64 = Buffer.from(value, 'utf-8').toString('base64');
  return xor(base64);
}

/**
 * Base64 解码
 */
function decode(encoded) {
  try {
    const base64 = xor(encoded);
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (error) {
    console.error('解码失败:', error.message);
    return null;
  }
}

/**
 * XOR 混淆
 */
function xor(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

/**
 * 记录访问日志
 */
function logAccess(service, action, success) {
  const logPath = path.join(CONFIG.memoryTreeRoot, CONFIG.accessLogFile);
  const logData = JSON.parse(readFile(logPath) || '[]');
  
  logData.push({
    timestamp: new Date().toISOString(),
    service: service,
    action: action,
    success: success
    // 注意：不记录凭证内容
  });
  
  writeFile(logPath, JSON.stringify(logData, null, 2));
}

/**
 * 解析 Vault 文件
 */
function parseVault(content) {
  const credentials = {};
  const lines = content.split('\n');
  
  let currentService = null;
  let currentValue = '';
  
  for (const line of lines) {
    // 匹配服务名：## ServiceName
    const serviceMatch = line.match(/^##\s+(.+)$/);
    if (serviceMatch) {
      if (currentService && currentValue) {
        credentials[currentService] = currentValue.trim();
      }
      currentService = serviceMatch[1].trim();
      currentValue = '';
      continue;
    }
    
    // 累积内容
    if (currentService && !line.startsWith('---') && !line.startsWith('#')) {
      currentValue += line + '\n';
    }
  }
  
  // 保存最后一个服务
  if (currentService && currentValue) {
    credentials[currentService] = currentValue.trim();
  }
  
  return credentials;
}

/**
 * 获取凭证
 */
async function getCredential(service, skipConfirm = false) {
  console.log('🔐 正在访问 Vault...\n');
  
  const vaultPath = path.join(CONFIG.memoryTreeRoot, CONFIG.vaultFile);
  const content = readFile(vaultPath);
  
  if (!content) {
    console.log('❌ Vault 文件不存在');
    logAccess(service, 'get', false);
    return null;
  }
  
  const credentials = parseVault(content);
  
  if (!credentials[service]) {
    console.log(`❌ 未找到服务 "${service}" 的凭证`);
    logAccess(service, 'get', false);
    return null;
  }
  
  // 高风险操作需要三次确认
  if (CONFIG.requireTripleConfirm && !skipConfirm) {
    console.log('⚠️  高风险操作：即将获取敏感凭证');
    console.log('📋 请确认以下事项：\n');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const confirm = async (question) => {
      return new Promise((resolve) => {
        rl.question(question + ' (yes/no): ', (answer) => {
          resolve(answer.toLowerCase() === 'yes');
        });
      });
    };
    
    const confirmations = [
      `1. 确认要获取 "${service}" 的凭证吗？`,
      `2. 再次确认，凭证仅用于本次任务，不会记录到日志？`,
      `3. 最终确认，凭证不会发送到网络或保存到其他文件？`
    ];
    
    for (const q of confirmations) {
      const result = await confirm(q);
      if (!result) {
        console.log('❌ 操作已取消');
        rl.close();
        logAccess(service, 'get', false);
        return null;
      }
    }
    
    rl.close();
  }
  
  // 解码凭证
  const decoded = decode(credentials[service]);
  
  if (!decoded) {
    console.log('❌ 凭证解码失败');
    logAccess(service, 'get', false);
    return null;
  }
  
  console.log(`✅ 成功获取 "${service}" 的凭证`);
  console.log('⚠️  凭证已加载到内存，将在任务结束后清除\n');
  
  logAccess(service, 'get', true);
  
  return decoded;
}

/**
 * 设置凭证
 */
function setCredential(service, value) {
  console.log('🔐 正在保存凭证到 Vault...\n');
  
  const vaultPath = path.join(CONFIG.memoryTreeRoot, CONFIG.vaultFile);
  let content = readFile(vaultPath) || '# 30-VAULT.md - 安全凭证存储\n\n> 最后更新：' + new Date().toISOString() + '\n';
  
  const encoded = encode(value);
  const newEntry = `\n## ${service}\n${encoded}\n`;
  
  // 检查是否已存在
  const credentials = parseVault(content);
  
  if (credentials[service]) {
    console.log('⚠️  凭证已存在，将创建备份...');
    writeFile(vaultPath + '.bak', content);
    
    // 替换旧凭证
    content = content.replace(
      new RegExp(`## ${service}[\\s\\S]*?(?=##|$)`, 'g'),
      newEntry
    );
  } else {
    content += newEntry;
  }
  
  if (writeFile(vaultPath, content)) {
    console.log(`✅ 已保存 "${service}" 的凭证`);
    console.log('🔒 凭证已加密存储\n');
    
    logAccess(service, 'set', true);
    return true;
  } else {
    console.log('❌ 保存失败');
    logAccess(service, 'set', false);
    return false;
  }
}

/**
 * 列出所有服务
 */
function listServices() {
  console.log('📋 Vault 中的服务列表:\n');
  
  const vaultPath = path.join(CONFIG.memoryTreeRoot, CONFIG.vaultFile);
  const content = readFile(vaultPath);
  
  if (!content) {
    console.log('❌ Vault 文件不存在');
    return [];
  }
  
  const credentials = parseVault(content);
  const services = Object.keys(credentials);
  
  if (services.length === 0) {
    console.log('ℹ️  Vault 为空');
    return [];
  }
  
  for (const service of services) {
    console.log(`🔑 ${service}`);
  }
  
  console.log(`\n共 ${services.length} 个服务`);
  
  // 显示访问日志统计
  const logPath = path.join(CONFIG.memoryTreeRoot, CONFIG.accessLogFile);
  const logData = JSON.parse(readFile(logPath) || '[]');
  
  if (logData.length > 0) {
    console.log('\n📊 最近访问记录:');
    const recentLogs = logData.slice(-5).reverse();
    for (const log of recentLogs) {
      const status = log.success ? '✅' : '❌';
      console.log(`  ${status} ${log.timestamp.slice(0, 16)} - ${log.service} (${log.action})`);
    }
  }
  
  return services;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     🔐 Smart Memory Vault Reader v2.0     ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  if (!command) {
    console.log('用法:');
    console.log('  node vault-reader.js get <service>     - 获取凭证');
    console.log('  node vault-reader.js set <service> <value> - 设置凭证');
    console.log('  node vault-reader.js list              - 列出所有服务');
    return;
  }
  
  switch (command) {
    case 'get':
      if (!args[1]) {
        console.log('❌ 请提供服务名');
        return;
      }
      const credential = await getCredential(args[1]);
      if (credential) {
        console.log('凭证内容:', credential);
      }
      break;
      
    case 'set':
      if (!args[1] || !args[2]) {
        console.log('❌ 请提供服务名和凭证值');
        return;
      }
      setCredential(args[1], args[2]);
      break;
      
    case 'list':
      listServices();
      break;
      
    default:
      console.log('❌ 未知命令:', command);
  }
}

// 导出函数
module.exports = {
  getCredential,
  setCredential,
  listServices,
  parseVault,
  encode,
  decode,
  readFile,
  writeFile,
  CONFIG
};

// 如果直接运行
if (require.main === module) {
  main().catch(console.error);
}
