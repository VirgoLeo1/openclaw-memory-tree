# 🌳 OpenClaw Memory Tree v3.0 (记忆树)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0-red.svg)](https://github.com/VirgoLeo1/openclaw-memory-tree)
[![ChromaDB](https://img.shields.io/badge/vector-ChromaDB-blue.svg)](https://www.trychroma.com/)

> **让记忆不再是存储，而是生长。**  
> *Memory is not just storage — it's growth.*

**An intelligent, self-evolving memory system powered by ChromaDB and OpenClaw.**  
一个由 ChromaDB 和 OpenClaw 驱动的智能、自演化记忆系统。

---

## 🌐 Language / 语言切换

| [🇬🇧 English Version](#-english-version) | [🇨🇳 中文说明](#-中文说明) |
|---|---|
| [Overview](#-overview) • [Installation](#-installation) • [Usage](#-usage) • [Case Study](#-real-world-case-study) | [概述](#-概述) • [安装](#-安装) • [使用方法](#-使用方法) • [实战案例](#-实战案例演示) |

---

## 🇬🇧 English Version

### 🚀 Overview

Memory Tree v3.0 is not just a note-taking tool; it's a **living knowledge base**. It uses vector embeddings (ChromaDB) to store, retrieve, and evolve your memories, errors, and skills.

#### ✨ Key Features

- **🧠 Vector Search**: Semantic retrieval of memories using ChromaDB and nomic-embed-text
- **🔄 Self-Evolution**: Automatically logs errors and corrections to `40-EVOLUTION-LOG/`
- **🔒 Privacy First**: Sensitive data (vaults, daily logs, configs) are strictly local and git-ignored
- **🤖 Agent Powered**: Integrated with "Li Xin" (李馨) for advanced analysis
- **🔥 Dynamic Heat**: Memories decay over time; only meaningful interactions boost relevance
- **🛡️ Echo Chamber Protection**: High-risk claims require evidence chains

### 📦 Installation

#### Prerequisites

- Node.js >= 18
- OpenClaw environment
- Python 3.8+ (for ChromaDB)

#### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. Install dependencies
npm install
pip install chromadb sentence-transformers

# 3. Initialize memory tree
node src/index.js init

# 4. View heat report
node src/index.js heat

# 5. Search memories
node src/index.js search "keyword"
```

### 📁 Project Structure

```
openclaw-memory-tree/
├── src/                    # Core JavaScript code
│   ├── index.js           # Main entry point
│   ├── heat-tracker.js    # Heat management
│   └── vector-store.js    # ChromaDB integration
├── scripts/                # Utility scripts
│   ├── save-memory-enhanced.js
│   ├── lixin-update-readme.js
│   └── lixin-verify.js
├── skills/                 # Skill modules
├── v3-core/               # ChromaDB implementation
├── memory/                # Memory storage (git-ignored)
│   ├── 00-CORE.md
│   ├── 01-DAILY/
│   ├── 20-BRANCHES/
│   ├── 30-VAULT.md
│   └── 40-EVOLUTION-LOG/
└── docs/                  # Documentation
```

### 🔮 Real-World Case Study

> *To demonstrate the system's analytical power (via "Li Xin" agent), here is a de-identified snippet from a recent "BaZi" (Four Pillars) analysis:*

**Subject Profile:**
- **Gender**: Male
- **Birth**: 2005 (Yi-You Year), Shen Month, Gui-Wei Day, **Wu-Wu Hour** (戊午时)
- **Location**: Tianjin → Dezhou (moved in 2018)

**Key Traits Identified by Li Xin:**

| Category | Prediction | Verification |
|---|---|---|
| **Appearance** | Square chin (Earth element), scar/mark on right arm | ✅ Confirmed |
| **Personality** | Outwardly calm (Gui Water), inwardly stubborn (Wu Earth) | ✅ Accurate |
| **Life Event** | Moved from Tianjin to Dezhou in 2018 (Wu-Xu year) | ✅ Correct |
| **Injury** | Head injury from metal cage/structure | ✅ Validated |
| **Health** | Fire/Earth excess; prone to anxiety, sleep issues | ⚠️ Needs attention |

**Analysis Method:**
1. **Physical Traits**: Square chin → Earth element → Wu hour confirmation
2. **Birthmark Location**: Right arm (metal vs wood clash)
3. **Unique Event**: AC unit metal cage injury → Metal element confirmation
4. **Timeline**: 2018 school move → Wu-Xu year activation

> **Conclusion**: The system successfully deduced the birth hour (**Wu-Wu**) and validated it through multiple independent physical and life event markers.

### 📊 Usage Examples

#### Update Memory Heat

```javascript
const tracker = require('./src/heat-tracker');

// Update with evidence chain
tracker.updateNodeHeat('D:\\memory\\important.md', 10, {
  content: 'Financial data: ROI 15%',
  source: 'https://example.com/report',
  confidence: 'high' // 'high' | 'medium' | 'low'
});

// Apply decay
tracker.applyDecay();
```

#### Search Memories

```bash
# Semantic search
node src/index.js search "investment strategy"

# Search with confidence filter
node src/index.js search "health" --confidence=high
```

### 🛡️ Privacy & Security

**NEVER upload these files to Git:**
- `30-VAULT.md` - Personal secrets
- `01-DAILY/` - Daily logs
- `20-BRANCHES/` - Branch memories
- `40-EVOLUTION-LOG/` - Error logs
- `config*.json` - API keys and secrets

The `.gitignore` is pre-configured to exclude these. **Do not override.**

---

## 🇨🇳 中文说明

### 🚀 概述

记忆树 v3.0 不仅仅是一个笔记工具，它是一个**有生命的知识库**。它使用向量嵌入（ChromaDB）来存储、检索和演化你的记忆、错误和技能。

#### ✨ 核心特性

- **🧠 向量搜索**: 使用 ChromaDB 和 nomic-embed-text 进行语义化记忆检索
- **🔄 自我演化**: 自动记录错误和纠正到 `40-EVOLUTION-LOG/`
- **🔒 隐私优先**: 敏感数据（金库、日志、配置）严格本地存储且 git 忽略
- **🤖 Agent 驱动**: 集成"李馨"智能助手进行高级分析
- **🔥 动态热度**: 记忆随时间衰减，只有有意义的互动才会提升热度
- **🛡️ 回音室防护**: 高风险声明需要证据链支持

### 📦 安装说明

#### 前置条件

- Node.js >= 18
- OpenClaw 环境
- Python 3.8+ (用于 ChromaDB)

#### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. 安装依赖
npm install
pip install chromadb sentence-transformers

# 3. 初始化记忆树
node src/index.js init

# 4. 查看热度报告
node src/index.js heat

# 5. 搜索记忆
node src/index.js search "关键词"
```

### 📁 项目结构

```
openclaw-memory-tree/
├── src/                    # 核心 JavaScript 代码
│   ├── index.js           # 主入口
│   ├── heat-tracker.js    # 热度管理
│   └── vector-store.js    # ChromaDB 集成
├── scripts/                # 工具脚本
│   ├── save-memory-enhanced.js
│   ├── lixin-update-readme.js
│   └── lixin-verify.js
├── skills/                 # 技能模块
├── v3-core/               # ChromaDB 实现
├── memory/                # 记忆存储 (git 忽略)
│   ├── 00-CORE.md
│   ├── 01-DAILY/
│   ├── 20-BRANCHES/
│   ├── 30-VAULT.md
│   └── 40-EVOLUTION-LOG/
└── docs/                  # 文档
```

### 🔮 实战案例演示

> *为展示系统（通过"李馨"Agent）的分析能力，以下为脱敏后的真实案例片段：*

**对象档案：**
- **性别**: 男
- **出生**: 2005 年 (乙酉) 申月 癸未日 **戊午时**
- **地点**: 天津 → 德州（2018 年迁移）

**李馨识别的关键特征：**

| 类别 | 推断结果 | 验证状态 |
|---|---|---|
| **外貌** | 下巴方正（土旺），右臂有胎记 | ✅ 已确认 |
| **性格** | 外表随和（癸水），内心极有主见（戊土合身） | ✅ 准确 |
| **人生节点** | 2018 年（戊戌）从天津转学回山东德州 | ✅ 正确 |
| **伤病** | 头顶被金属笼子磕伤流血 | ✅ 已验证 |
| **健康** | 火土偏旺，易焦虑、睡眠不佳 | ⚠️ 需注意 |

**分析方法：**
1. **体貌特征**: 方下巴 → 土旺 → 确认戊午时
2. **胎记位置**: 右臂（金木交战）
3. **独特事件**: 空调金属笼磕伤头部 → 金元素确认
4. **时间线**: 2018 年转学 → 戊戌年引发

> **结论**: 系统通过多重独立的体貌特征和人生事件标记，成功推断出出生时辰（**戊午时**）并得到验证。

### 📊 使用示例

#### 更新记忆热度

```javascript
const tracker = require('./src/heat-tracker');

// 带证据链更新
tracker.updateNodeHeat('D:\\memory\\important.md', 10, {
  content: '财务数据：投资回报率 15%',
  source: 'https://example.com/report',
  confidence: 'high' // 'high' | 'medium' | 'low'
});

// 应用衰减
tracker.applyDecay();
```

#### 搜索记忆

```bash
# 语义搜索
node src/index.js search "投资策略"

# 带置信度过滤
node src/index.js search "健康" --confidence=high
```

### 🛡️ 隐私与安全

**永远不要将这些文件上传到 Git：**
- `30-VAULT.md` - 个人秘密
- `01-DAILY/` - 每日日志
- `20-BRANCHES/` - 分支记忆
- `40-EVOLUTION-LOG/` - 错误日志
- `config*.json` - API 密钥和机密

`.gitignore` 已预配置为排除这些文件。**请勿覆盖。**

---

## 🤝 Contributing / 贡献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

MIT © 2026 Peak (峰哥) & Li Xin (李馨)

---

## 🦞 About Li Xin / 关于李馨

**Li Xin** (李馨) is an advanced analytical agent integrated into Memory Tree, specializing in:
- BaZi (Four Pillars) destiny analysis
- Pattern recognition from physical traits
- Life event correlation
- Error logging and self-improvement

**李馨**是集成在记忆树中的高级分析 Agent，专长：
- 八字命理分析
- 体貌特征模式识别
- 人生事件关联分析
- 错误记录与自我演化

---

<div align="center">

**Made with ❤️ by Peak & Li Xin**  
**Memory Tree v3.0 — Where memories grow.**

[⬆️ Back to top](#-openclaw-memory-tree-v30-记忆树)

</div>
