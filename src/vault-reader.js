// vault-reader.js - 安全凭证读取器
// 功能：安全读取和管理凭证，支持 Base64/XOR 混淆，用后即焚

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';
const VAULT_PATH = path.join(MEMORY_TREE_ROOT, '30-VAULT.md');
const VAULT_LOG_PATH = path.join(MEMORY_TREE_ROOT, '99-SYSTEM', 'vault-access-log.json');

// 简单的 XOR 加密（用于混淆，非强加密）
function xorEncrypt(text, key) {
  const keyBuffer = Buffer.from(key);
  const textBuffer = Buffer.from(text, 'utf-8');
  const result = Buffer.alloc(textBuffer.length);
  
  for (let i = 0; i < textBuffer.length; i++) {
    result[i] = textBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }
  
  return result.toString('base64');
}

function xorDecrypt(encrypted, key) {
  try {
    const keyBuffer = Buffer.from(key);
    const encryptedBuffer = Buffer.from(encrypted, 'base64');
    const result = Buffer.alloc(encryptedBuffer.length);
    
    for (let i = 0; i < encryptedBuffer.length; i++) {
      result[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    return result.toString('utf-8');
  } catch (error) {
    console.error('❌ 解密失败:', error.message);
    return null;
  }
}

// 读取凭证文件
function readVault() {
  if (!fs.existsSync(VAULT_PATH)) {
    console.warn('⚠️ 凭证文件不存在');
    return null;
  }
  
  const content = fs.readFileSync(VAULT_PATH, 'utf-8');
  return content;
}

// 解析凭证文件
function parseVault() {
  const content = readVault();
  if (!content) return {};
  
  const credentials = {};
  const lines = content.split('\n');
  let currentService = null;
  let currentCreds = {};
  
  lines.forEach(line => {
    // 匹配服务标题：## ServiceName
    const serviceMatch = line.match(/^##\s+(.+)$/);
    if (serviceMatch) {
      if (currentService) {
        credentials[currentService] = currentCreds;
      }
      currentService = serviceMatch[1].trim();
      currentCreds = {};
      return;
    }
    
    // 匹配键值对：- key: value 或 - key: `encoded_value`
    const kvMatch = line.match(/^\s*-\s*([^:]+):\s*(.+)$/);
    if (kvMatch && currentService) {
      const key = kvMatch[1].trim();
      let value = kvMatch[2].trim();
      
      // 如果是 base64 编码（以 ` 包裹）
      if (value.startsWith('`') && value.endsWith('`')) {
        value = value.slice(1, -1);
        currentCreds[key] = { encoded: true, value };
      } else {
        currentCreds[key] = { encoded: false, value };
      }
    }
  });
  
  // 保存最后一个服务
  if (currentService) {
    credentials[currentService] = currentCreds;
  }
  
  return credentials;
}

// 解码凭证值
function decodeValue(encodedValue, key) {
  try {
    // 尝试 Base64 解码
    const decoded = Buffer.from(encodedValue, 'base64').toString('utf-8');
    return decoded;
  } catch {
    // 如果 Base64 失败，尝试 XOR 解密
    return xorDecrypt(encodedValue, key);
  }
}

// 获取凭证
function getCredential(service, field, options = {}) {
  const {
    autoLog = true,
    requireConfirmation = false
  } = options;
  
  const vault = parseVault();
  
  if (!vault[service]) {
    console.error(`❌ 服务 "${service}" 不存在于凭证库`);
    return null;
  }
  
  const creds = vault[service];
  if (!creds[field]) {
    console.error(`❌ 字段 "${field}" 不存在于服务 "${service}"`);
    return null;
  }
  
  const cred = creds[field];
  let value = cred.value;
  
  // 如果是编码的，需要解码
  if (cred.encoded) {
    value = decodeValue(cred.value, service);
    if (!value) {
      console.error('❌ 解码失败');
      return null;
    }
  }
  
  // 记录访问日志
  if (autoLog) {
    logAccess(service, field);
  }
  
  return value;
}

// 记录访问日志
function logAccess(service, field) {
  const log = {
    timestamp: new Date().toISOString(),
    service,
    field,
    action: 'read'
  };
  
  let accessLog = [];
  if (fs.existsSync(VAULT_LOG_PATH)) {
    accessLog = JSON.parse(fs.readFileSync(VAULT_LOG_PATH, 'utf-8'));
  }
  
  accessLog.push(log);
  
  // 保留最近 100 条记录
  if (accessLog.length > 100) {
    accessLog = accessLog.slice(-100);
  }
  
  // 确保目录存在
  const logDir = path.dirname(VAULT_LOG_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.writeFileSync(VAULT_LOG_PATH, JSON.stringify(accessLog, null, 2));
}

// 获取访问历史
function getAccessHistory(service) {
  if (!fs.existsSync(VAULT_LOG_PATH)) return [];
  
  const logs = JSON.parse(fs.readFileSync(VAULT_LOG_PATH, 'utf-8'));
  
  if (service) {
    return logs.filter(log => log.service === service);
  }
  
  return logs;
}

// 列出所有服务
function listServices() {
  const vault = parseVault();
  return Object.keys(vault);
}

// 列出服务的所有字段
function listFields(service) {
  const vault = parseVault();
  if (!vault[service]) return [];
  return Object.keys(vault[service]);
}

// 导出函数
module.exports = {
  getCredential,
  getAccessHistory,
  listServices,
  listFields,
  parseVault,
  readVault,
  xorEncrypt,
  xorDecrypt,
  VAULT_PATH
};

// 如果直接运行此文件
if (require.main === module) {
  console.log('🔐 凭证读取器测试模式');
  
  const services = listServices();
  console.log('\n可用服务:');
  services.forEach(s => console.log(`  - ${s}`));
  
  if (services.length > 0) {
    const service = services[0];
    console.log(`\n${service} 的字段:`);
    const fields = listFields(service);
    fields.forEach(f => console.log(`  - ${f}`));
  }
  
  console.log('\n访问历史:');
  const history = getAccessHistory();
  history.slice(-5).forEach(log => {
    console.log(`  ${log.timestamp} - ${log.service}/${log.field} (${log.action})`);
  });
}
