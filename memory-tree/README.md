# 🌳 OpenClaw Memory Tree v3.0 (记忆树)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-3.0-red.svg)](https://github.com/VirgoLeo1/openclaw-memory-tree)
[![ChromaDB](https://img.shields.io/badge/vector-ChromaDB-blue.svg)](https://www.trychroma.com/)
[![Agent](https://img.shields.io/badge/Agent-Li%20Xin-orange)](https://github.com/VirgoLeo1/openclaw-memory-tree)

> **让记忆不再是存储，而是生长。**  
> *Memory is not just storage — it's growth.*

**An intelligent, self-evolving memory system powered by ChromaDB and OpenClaw.**  
一个由 ChromaDB 和 OpenClaw 驱动的智能、自演化记忆系统。

---

## 🌐 Navigation / 导航

| **English** | **中文** |
| :--- | :--- |
| [🚀 Overview](#-english-version) | [🚀 概述](#-中文说明) |
| [📦 Installation](#-installation) | [📦 安装指南](#-安装指南) |
| [🔮 Case Study](#-real-world-case-study) | [🔮 实战案例](#-实战案例演示) |
| [🏗️ Architecture](#-project-structure) | [🏗️ 项目结构](#-项目结构) |

---

## 🇬🇧 English Version

### 🚀 Overview

Memory Tree v3.0 is not just a note-taking tool; it's a **living knowledge base**. It uses vector embeddings (ChromaDB) to store, retrieve, and evolve your memories, errors, and skills.

#### ✨ Key Features

- **🧠 Vector Search**: Semantic retrieval using ChromaDB & nomic-embed-text.
- **🔄 Self-Evolution**: Auto-logs errors/corrections to `40-EVOLUTION-LOG/`.
- **🔒 Privacy First**: Sensitive data strictly local & git-ignored.
- **🤖 Agent Powered**: Integrated with **"Li Xin"** for advanced destiny analysis.
- **🔥 Dynamic Heat**: Memories decay; only meaningful interactions boost relevance.

### 📦 Installation

```bash
# 1. Clone
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. Install Deps
npm install
pip install chromadb sentence-transformers

# 3. Init
node src/index.js init
```

### 🔮 Real-World Case Study: "Li Xin" Agent

> *Demonstrating the system's analytical power via the integrated "Li Xin" agent.*

**Subject**: Male, 2005 (Yi-You), Shen Month, Gui-Wei Day, **Wu-Wu Hour**.

| Category | Prediction | Verification |
| :--- | :--- | :--- |
| **Appearance** | Square chin, Right arm mark | ✅ Confirmed |
| **Personality** | Outwardly calm, Inwardly stubborn | ✅ Accurate |
| **Life Event** | Moved 2018 (Tianjin→Dezhou) | ✅ Correct |
| **Injury** | Head injury (Metal cage) | ✅ Validated |

### 🏗️ Project Structure

```text
openclaw-memory-tree/
├── src/                 # Core logic (Heat, Vector, Loader)
├── scripts/             # Utilities (Backup, Scan, Post)
├── skills/              # Agent skills (Li Xin, Search, etc.)
├── memory/              # [Git-Ignored] User data
│   ├── 00-CORE.md
│   ├── 30-VAULT.md
│   └── 40-EVOLUTION-LOG/
└── docs/                # Documentation
```

---

## 🇨🇳 中文说明

### 🚀 概述

记忆树 v3.0 不仅仅是一个笔记工具，它是一个**有生命的知识库**。它使用向量嵌入（ChromaDB）来存储、检索和演化你的记忆、错误和技能。

#### ✨ 核心特性

- **🧠 向量搜索**: 使用 ChromaDB 进行语义化检索。
- **🔄 自我演化**: 自动记录错误和纠正到 `40-EVOLUTION-LOG/`。
- **🔒 隐私优先**: 敏感数据严格本地存储且 Git 忽略。
- **🤖 Agent 驱动**: 集成 **"李馨"** 进行高级命理分析。
- **🔥 动态热度**: 记忆随时间衰减，只有有意义的互动才提升热度。

### 📦 安装指南

```bash
# 1. 克隆
git clone https://github.com/VirgoLeo1/openclaw-memory-tree.git
cd openclaw-memory-tree

# 2. 安装依赖
npm install
pip install chromadb sentence-transformers

# 3. 初始化
node src/index.js init
```

### 🔮 实战案例演示

> *展示“李馨”Agent 的深度分析能力（脱敏案例）。*

**对象**: 男，2005 年 (乙酉) 申月 癸未日 **戊午时**。

| 类别 | 推断结果 | 验证状态 |
| :--- | :--- | :--- |
| **外貌** | 下巴方正，右臂有胎记 | ✅ 已确认 |
| **性格** | 外表随和，内心极有主见 | ✅ 准确 |
| **人生节点** | 2018 年从天津转学回德州 | ✅ 正确 |
| **伤病** | 头顶被金属笼子磕伤 | ✅ 已验证 |

### 🏗️ 项目结构

```text
openclaw-memory-tree/
├── src/                 # 核心逻辑 (热度、向量、加载)
├── scripts/             # 工具脚本 (备份、扫描、发布)
├── skills/              # Agent 技能 (李馨、搜索等)
├── memory/              # [Git 忽略] 用户数据
│   ├── 00-CORE.md
│   ├── 30-VAULT.md
│   └── 40-EVOLUTION-LOG/
└── docs/                # 文档
```

---

## 🤝 Contributing / 贡献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License / 许可证

MIT © 2026 Peak (峰哥) & Li Xin (李馨)

---

<div align="center">

**Made with ❤️ by Peak & Li Xin**  
**Memory Tree v3.0 — Where memories grow.**

[⬆️ Back to top](#-openclaw-memory-tree-v30-记忆树)

</div>
