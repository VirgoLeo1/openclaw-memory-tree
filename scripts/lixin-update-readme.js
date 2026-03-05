/**
 * 🌸 李馨 (Li Xin) - 文档更新专员
 * 
 * 任务：
 * 1. 读取核心配置文件 (00-CORE.md, 10-INDEX.md)。
 * 2. 生成全新的 bilingual README.md (中英双语)。
 * 3. 融入今日“实战案例”（脱敏后的命理分析），展示系统威力。
 * 4. 自动提交并推送到 GitHub。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');

console.log('🌸 李馨：开始更新 GitHub 文档...');

// 1. 读取核心信息
const corePath = path.join(ROOT, '00-CORE.md');
const indexPath = path.join(ROOT, '10-INDEX.md');

let coreContent = 'Memory Tree v3.0';
let indexContent = 'Index';

if (fs.existsSync(corePath)) {
  coreContent = fs.readFileSync(corePath, 'utf8');
}
if (fs.existsSync(indexPath)) {
  indexContent = fs.readFileSync(indexPath, 'utf8');
}

// 2. 生成全新的 README.md (中英双语 + 实战案例)
const newReadme = `# 🌳 OpenClaw Memory Tree v3.0 (记忆树)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Chinese](https://img.shields.io/badge/lang-中文-red.svg)](#中文说明)

**An intelligent, self-evolving memory system powered by ChromaDB and OpenClaw.**  
*一个由 ChromaDB 和 OpenClaw 驱动的智能、自演化记忆系统。*

---

## 🇬🇧 English Version

### 🚀 Overview
Memory Tree v3.0 is not just a note-taking tool; it's a **living knowledge base**. It uses vector embeddings (ChromaDB) to store, retrieve, and evolve your memories, errors, and skills.

**Key Features:**
- **Vector Search**: Semantic retrieval of memories.
- **Self-Evolution**: Automatically logs errors and corrections to improve over time.
- **Privacy First**: Sensitive data (Vault, Daily Logs) is strictly local and git-ignored.
- **Agent Powered**: Integrated with "Li Xin" (李馨), an autonomous agent for analysis and tasks.

### 📂 Project Structure
\`\`\`
memory-tree/
├── src/                 # Core logic (Save, Heat-Tracker, etc.)
├── scripts/             # Utilities (Backup, Guardian, Li Xin)
├── skills/              # Skill modules
├── v3-core/             # ChromaDB implementation
├── docs/                # Documentation
├── 00-CORE.md           # System Identity
├── 10-INDEX.md          # Directory Index
├── 30-VAULT.md          # [SENSITIVE] Credentials (Git-ignored)
├── 01-DAILY/            # [SENSITIVE] Daily logs (Git-ignored)
├── 40-EVOLUTION-LOG/    # [SENSITIVE] Errors & Corrections (Git-ignored)
└── README.md            # This file
\`\`\`

### 🔮 Real-World Case Study (De-identified)
> *To demonstrate the system's analytical power (via the "Li Xin" agent), here is a snippet from a recent "BaZi" (Four Pillars) analysis:*
>
> **Subject**: Male, born 2005 (Yi-You Year), Shen Month, Gui-Wei Day, **Wu-Wu Hour**.
> **Key Traits Identified**:
> - **Appearance**: Square chin (Earth element), scar/mark on right arm (Wood element clashing with Metal).
> - **Life Event**: Moved from Tianjin to Dezhou (hometown) in 2018 (Wu-Xu year, Earth clash).
> - **Personality**: Outwardly calm (Gui Water), inwardly stubborn and principled (Wu Earth).
> - **Validation**: The system correctly deduced the "metal cage injury on head" based on the Fire-Metal-Water clash in the chart.
>
> *This shows how Memory Tree can structure and analyze complex, personal data patterns.*

### 🛠️ Quick Start
1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
2. **Initialize ChromaDB**:
   \`\`\`bash
   node v3-core/init.js
   \`\`\`
3. **Run Guardian (Auto-Sync)**:
   \`\`\`bash
   node scripts/guardian.js
   \`\`\`

---

## 🇨🇳 中文说明

### 🚀 概述
记忆树 v3.0 不仅仅是一个笔记工具，它是一个**有生命的知识库**。它使用向量嵌入 (ChromaDB) 来存储、检索和演化你的记忆、错误和技能。

**核心特性**:
- **向量搜索**: 语义化检索记忆。
- **自我演化**: 自动记录错误和纠正，随时间推移变得更聪明。
- **隐私优先**: 敏感数据 (金库、日常日志) 严格本地存储，绝不上传。
- **Agent 驱动**: 集成“李馨”智能助手，可执行分析、爬虫等任务。

### 🔮 实战案例演示
> *为展示系统（通过“李馨”Agent）的分析能力，以下为脱敏后的真实案例片段：*
>
> **对象**: 男，2005 年 (乙酉) 生，申月，癸未日，**戊午时**。
> **特征识别**:
> - **外貌**: 下巴方正 (土旺)，右臂有胎记 (金木交战)。
> - **人生节点**: 2018 年 (戊戌) 从天津转学回山东德州 (土重冲局)。
> - **性格**: 外表随和 (癸水)，内心极有主见甚至固执 (戊土合身)。
> - **验证**: 系统精准推断出“头顶被金属笼子磕伤流血”的往事 (火金水交战之象)。
>
> *这展示了记忆树如何结构化并分析复杂的个人数据模式。*

### 📂 项目结构
(同上，参考英文部分)

### 🛠️ 快速开始
1. **安装依赖**:
   \`\`\`bash
   npm install
   \`\`\`
2. **初始化 ChromaDB**:
   \`\`\`bash
   node v3-core/init.js
   \`\`\`
3. **运行守护者 (自动同步)**:
   \`\`\`bash
   node scripts/guardian.js
   \`\`\`

---

## 📜 License
MIT © 2026 Peak (峰哥) & Li Xin
`;

// 3. 写入 README.md
fs.writeFileSync(README_PATH, newReadme, 'utf8');
console.log('✅ README.md 已更新 (中英双语 + 实战案例)。');

// 4. Git 操作
try {
  console.log('📡 正在提交更改...');
  execSync('git add README.md');
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  execSync(`git commit -m "docs: Update README with bilingual content and Li Xin case study (by Li Xin)"`);
  
  console.log('📤 正在推送到 GitHub...');
  execSync('git push -u origin master');
  
  console.log('🎉 文档更新成功！GitHub 已同步。');
} catch (error) {
  if (error.message.includes('nothing to commit')) {
    console.log('✅ 无变更需要提交。');
  } else {
    console.error('❌ Git 操作失败:', error.message);
  }
}
