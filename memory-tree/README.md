# 🧠 Memory Tree v3.0 / 记忆树 v3.0

**A persistent memory system for AI agents powered by ChromaDB**  
**由 ChromaDB 驱动的 AI 智能体持久化记忆系统**

---

## 🌐 Language / 语言

- [English](#english)
- [中文](#中文)

---

## English

### Overview

Memory Tree v3.0 is a semantic memory system designed for AI agents. It uses vector embeddings to store, search, and retrieve memories with context-aware relevance scoring.

### Key Features

- 🔹 **Vector Search**: Semantic similarity search using ChromaDB
- 🔹 **Smart Purge**: Automatic cleanup of low-value memories
- 🔹 **Multi-Branch Structure**: Organized memory categories (tech, life, platform, tools)
- 🔹 **Daily Logging**: Automatic session summaries and consolidation
- 🔹 **Evolution Tracking**: Errors, corrections, and skill extraction logs

### Tech Stack

- **Backend**: Python + ChromaDB
- **Embeddings**: nomic-embed-text (via ONNX)
- **Node.js**: Management scripts and automation
- **Storage**: Persistent vector database with JSONL backup

### Installation

```bash
# Install Python dependencies
pip install chromadb sentence-transformers numpy tiktoken openai pydantic rich tqdm

# Verify installation
python -c "import chromadb; print(chromadb.__version__)"
```

### Quick Start

```bash
# Initialize memory tree
node memory-tree/v3-core/init.js

# Add a memory
node save-memory-enhanced.js add "Your memory text here" --branch tech/python

# Search memories
node save-memory-enhanced.js search "semantic search query"
```

### Project Structure

```
memory-tree/
├── 00-CORE.md           # Core identity and preferences
├── 10-INDEX.md          # Directory index
├── 20-BRANCHES/         # Memory branches
│   ├── tech/            # Technical knowledge
│   ├── life/            # Life experiences
│   ├── platform/        # Platform-specific (Moltbook, etc.)
│   └── tools/           # Tool usage patterns
├── 01-DAILY/            # Daily logs
├── 40-EVOLUTION-LOG/    # Evolution tracking
│   ├── errors.md        # Error logs
│   ├── corrections.md   # User corrections
│   └── skill-extraction.md
├── 30-VAULT.md          # Long-term curated memories
└── v3-core/             # v3 core implementation
    ├── chroma_data/     # ChromaDB persistent data
    └── init.py          # Initialization script
```

### Repository

**GitHub**: [VirgoLeo1/openclaw-memory-tree](https://github.com/VirgoLeo1/openclaw-memory-tree)

---

## 中文

### 简介

记忆树 v3.0 是一个专为 AI 智能体设计的语义记忆系统。它使用向量嵌入来存储、搜索和检索记忆，并支持基于上下文的相关性评分。

### 核心特性

- 🔹 **向量搜索**: 使用 ChromaDB 进行语义相似度搜索
- 🔹 **智能清理**: 自动清理低价值记忆 (Smart Purge 算法)
- 🔹 **多分支结构**: 组织化的记忆分类 (技术、生活、平台、工具)
- 🔹 **日常记录**: 自动会话总结和记忆整合
- 🔹 **进化追踪**: 错误日志、用户纠正和技能提取记录

### 技术栈

- **后端**: Python + ChromaDB
- **嵌入模型**: nomic-embed-text (通过 ONNX)
- **Node.js**: 管理脚本和自动化
- **存储**: 持久化向量数据库 + JSONL 备份

### 安装方法

```bash
# 安装 Python 依赖
pip install chromadb sentence-transformers numpy tiktoken openai pydantic rich tqdm

# 验证安装
python -c "import chromadb; print(chromadb.__version__)"
```

### 快速开始

```bash
# 初始化记忆树
node memory-tree/v3-core/init.js

# 添加记忆
node save-memory-enhanced.js add "你的记忆内容" --branch tech/python

# 搜索记忆
node save-memory-enhanced.js search "语义搜索查询"
```

### 项目结构

```
memory-tree/
├── 00-CORE.md           # 核心身份和偏好
├── 10-INDEX.md          # 目录索引
├── 20-BRANCHES/         # 记忆分支
│   ├── tech/            # 技术知识
│   ├── life/            # 生活经验
│   ├── platform/        # 平台特定 (Moltbook 等)
│   └── tools/           # 工具使用模式
├── 01-DAILY/            # 日常记录
├── 40-EVOLUTION-LOG/    # 进化追踪
│   ├── errors.md        # 错误日志
│   ├── corrections.md   # 用户纠正
│   └── skill-extraction.md
├── 30-VAULT.md          # 长期精选记忆
└── v3-core/             # v3 核心实现
    ├── chroma_data/     # ChromaDB 持久化数据
    └── init.py          # 初始化脚本
```

### 项目地址

**GitHub**: [VirgoLeo1/openclaw-memory-tree](https://github.com/VirgoLeo1/openclaw-memory-tree)

---

## License / 许可证

MIT License

---

> **🦞 Built with love for the Moltbook community**  
> **为 Moltbook 社区精心打造**
