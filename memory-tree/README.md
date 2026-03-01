<p align="center">
  <h1 align="center">🌳 VirgoLiant Memory Tree</h1>
  <p align="center">
    An intelligent, self-evolving memory system powered by ChromaDB and OpenClaw.
    <br>
    <strong>让记忆不再是存储，而是生长。</strong>
  </p>
</p>

<p align="center">
  <a href="#english-version"><img src="https://img.shields.io/badge/lang-English-blue" alt="English"></a>
  <a href="#中文说明"><img src="https://img.shields.io/badge/lang-中文-red" alt="中文"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://github.com/VirgoLeo1/openclaw-memory-tree"><img src="https://img.shields.io/badge/version-3.0-red.svg" alt="Version"></a>
</p>

---

## 🇬🇧 English Version

### 🚀 Overview

**VirgoLiant Memory Tree** is a **living knowledge base** designed for AI agents. It uses vector embeddings (ChromaDB) to store, retrieve, and evolve memories, errors, and skills dynamically.

Unlike traditional note-taking apps, Memory Tree implements:
- **Dynamic Heat Decay**: Memories fade over time unless reinforced.
- **Confidence Tracking**: Distinguishes between verified facts and speculative inferences.
- **Echo Chamber Protection**: Prevents high-risk unverified claims from gaining traction.
- **Agent Agnostic**: Works with any OpenClaw-compatible agent.

### 📦 Installation

#### Prerequisites
- Node.js >= 18
- Python 3.8+ (for ChromaDB)
- OpenClaw Environment

#### Quick Start
```bash
# 1. Clone
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. Install Dependencies
npm install
pip install chromadb sentence-transformers

# 3. Initialize
node src/index.js init

# 4. Verify
node src/index.js status
```

### 🔥 Core Concepts

1. **Dynamic Heat**: Every memory has a heat score that decays daily (`DECAY_RATE = 0.95`). Only meaningful interactions (producing actions) boost heat.
2. **Confidence Levels**:
   - `High`: Verified by human or strong evidence chain.
   - `Medium`: Has source but unverified.
   - `Low`: Inference or speculation (decays 2x faster).
3. **Privacy First**: Sensitive directories (`memory/`, `30-VAULT.md`) are git-ignored by default.

### 🏗️ Project Structure

```text
virgoliant-memory-tree/
├── src/                 # Core logic (Heat, Vector Store, Loader)
├── scripts/             # Utilities (Backup, Scan, Maintenance)
├── skills/              # Agent skill modules
├── memory/              # [Git-Ignored] User data storage
│   ├── 00-CORE.md       # Core memory index
│   ├── 01-DAILY/        # Daily logs
│   ├── 30-VAULT.md      # Sensitive secrets
│   └── 40-EVOLUTION-LOG/# Errors & corrections
└── docs/                # Documentation
```

---

## 🇨🇳 中文说明

### 🚀 概述

**VirgoLiant Memory Tree** 是一个为 AI Agent 设计的**动态知识库**。它使用向量嵌入（ChromaDB）来动态存储、检索和演化记忆、错误与技能。

与传统笔记不同，记忆树实现了：
- **动态热度衰减**：记忆若不强化会随时间自然消退。
- **置信度追踪**：区分已验证事实与推测性推断。
- **回音室防护**：防止高风险未验证信息获得高热度。
- **Agent 无关**：兼容任何 OpenClaw 代理。

### 📦 安装指南

#### 前置条件
- Node.js >= 18
- Python 3.8+ (用于 ChromaDB)
- OpenClaw 环境

#### 快速开始
```bash
# 1. 克隆
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. 安装依赖
npm install
pip install chromadb sentence-transformers

# 3. 初始化
node src/index.js init

# 4. 验证
node src/index.js status
```

### 🔥 核心概念

1. **动态热度**：每个记忆都有热度值，每日自然衰减 (`DECAY_RATE = 0.95`)。只有产生实际操作的交互才会提升热度。
2. **置信度等级**：
   - `High`: 经人类确认或有强证据链。
   - `Medium`: 有来源但未验证。
   - `Low`: 推断或推测（衰减速度 2 倍）。
3. **隐私优先**：敏感目录（`memory/`, `30-VAULT.md`）默认被 Git 忽略。

### 🏗️ 项目结构

```text
virgoliant-memory-tree/
├── src/                 # 核心逻辑 (热度、向量存储、加载器)
├── scripts/             # 工具脚本 (备份、扫描、维护)
├── skills/              # Agent 技能模块
├── memory/              # [Git 忽略] 用户数据存储
│   ├── 00-CORE.md       # 核心记忆索引
│   ├── 01-DAILY/        # 每日日志
│   ├── 30-VAULT.md      # 敏感机密
│   └── 40-EVOLUTION-LOG/# 错误与纠正记录
└── docs/                # 文档
```

---

## 🤝 Contributing / 贡献

We welcome contributions! Please follow these steps:
欢迎贡献！请遵循以下步骤：

1. Fork the repository / Fork 本仓库
2. Create your feature branch / 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your changes / 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch / 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request / 发起 Pull Request

---

## 📜 License / 许可证

MIT © 2026 **VirgoLiant**

---

<p align="center">
  <strong>Made with ❤️ by VirgoLiant</strong><br>
  <em>VirgoLiant Memory Tree — Where memories grow.</em>
</p>
