/**
 * OpenClaw 事件驱动备份脚本 (修复版)
 * 用法：node backup.js [事件名称]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const OPENCLAW_ROOT = path.resolve(__dirname, '..'); 
const BACKUP_ROOT = path.join('D:', 'openclawBack', 'Event');

// 需要备份的关键目录
const ITEMS_TO_BACKUP = [
    'workspace', 'openclaw.json', 'agents', 'skills', 'extensions'
];

// 排除项
const EXCLUDE_PATTERNS = ['node_modules', '.git', 'logs', 'browser', 'media'];

async function runBackup(eventName = 'manual') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5).replace('T', '_');
    const backupName = `${eventName}_${timestamp}`;
    const backupPath = path.join(BACKUP_ROOT, backupName);
    
    console.log(`🛡️  开始事件备份：${eventName}`);
    console.log(`📂 目标路径：${backupPath}`);
    
    try {
        // 1. 使用 Node.js 原生 API 创建目录 (避免 shell 兼容性问题)
        if (!fs.existsSync(BACKUP_ROOT)) {
            fs.mkdirSync(BACKUP_ROOT, { recursive: true });
        }
        
        // 2. 构建要备份的项列表
        const validItems = ITEMS_TO_BACKUP.filter(item => {
            return fs.existsSync(path.join(OPENCLAW_ROOT, item));
        });

        if (validItems.length === 0) {
            throw new Error("没有找到任何有效备份项！");
        }

        // 3. 执行 Robocopy
        // 注意：robocopy 在目标路径不存在时会自动创建，但为了保险，我们先确保父目录存在
        const sourcePath = OPENCLAW_ROOT;
        const itemsStr = validItems.join(' ');
        const excludeStr = EXCLUDE_PATTERNS.join(' ');
        
        // 命令格式：robocopy <源> <目标> <文件/目录> <选项>
        const cmd = `robocopy "${sourcePath}" "${backupPath}" ${itemsStr} /E /COPYALL /R:1 /W:1 /NFL /NDL /XD ${excludeStr}`;
        
        console.log('🚀 执行备份中...');
        let exitCode = 0;
        try {
            // execSync 在退出码 > 7 时会抛出错误，但 robocopy 1-7 通常表示成功或部分成功
            execSync(cmd, { stdio: 'inherit' });
        } catch (e) {
            exitCode = e.status || 1;
            if (exitCode > 7) {
                console.error(`❌ Robocopy 严重错误 (退出码：${exitCode})`);
                // 不立即退出，尝试写入标记文件记录错误
            }
        }
        
        console.log(`\n✅ 备份执行完成！(退出码：${exitCode || 0})`);
        console.log(`📦 备份位置：${backupPath}`);
        
        // 4. 写入标记文件
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }
        const markerContent = `Event: ${eventName}\nTime: ${new Date().toISOString()}\nRoot: ${OPENCLAW_ROOT}\nItems: ${itemsStr}\nStatus: ${exitCode > 7 ? 'Failed' : 'Success'}`;
        fs.writeFileSync(path.join(backupPath, 'BACKUP_COMPLETE.txt'), markerContent, 'utf8');
        console.log(`📝 标记文件已写入`);
        
    } catch (error) {
        console.error('❌ 备份失败:', error.message);
        process.exit(1);
    }
}

runBackup(process.argv[2] || 'manual');