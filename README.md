# 🧠 OpenClaw Memory Tree (记忆树)

[English](#-english) | [中文](#-中文)

---

## 🇬🇧 English

### What is Memory Tree?

**Memory Tree** is an intelligent memory management system for OpenClaw, featuring self-evolving capabilities and hierarchical organization.

### Core Features

- 🌳 **Hierarchical Structure**: CORE → INDEX → BRANCHES → VAULT
- 🔥 **Heat-based Tracking**: Automatically tracks memory usage frequency
- 🧬 **Self-Evolution**: Learns from errors and corrections
- 📦 **Smart Purge**: Dynamically removes low-value memories
- 🔄 **Version Control**: Git-backed with full history

### Project Structure

```
memory-tree/
├── 00-CORE.md           # Core memory & identity
├── 10-INDEX.md          # Directory index
├── 20-BRANCHES/         # Topic branches
├── 30-VAULT.md          # Long-term memory vault
├── 40-EVOLUTION-LOG/    # Self-improvement logs
│   ├── errors.md        # Error tracking
│   ├── corrections.md   # User corrections
│   └── skill-extraction.md
├── 01-DAILY/            # Daily memory files
├── scripts/             # Utility scripts
├── skills/              # Memory skills
├── knowledge-base/      # Knowledge databases
└── v3-core/             # v3.0 core (ChromaDB)
```

### Quick Start

```bash
# Load memory tree
node scripts/memory-loader.js

# Save memory
node save-memory-enhanced.js save "Your memory here"

# Scan for skills
node save-memory-enhanced.js scan-skills
```

### Version

- **Current**: v2.x (migrating to v3.0)
- **v3.0 Features**:
  - Full manual resurrection
  - Smart purge algorithm
  - ChromaDB vector store
  - nomic-embed-text embeddings

### License

MIT

---

## 🇨🇳 中文

### 记忆树是什么？

**记忆树** 是一个为 OpenClaw 设计的智能记忆管理系统，具有自我演化能力和分层组织结构。

### 核心特性

- 🌳 **分层结构**: CORE → INDEX → BRANCHES → VAULT
- 🔥 **热度追踪**: 自动追踪记忆使用频率
- 🧬 **自我演化**: 从错误和纠正中学习
- 📦 **智能清理**: 动态删除低价值记忆
- 🔄 **版本控制**: 基于 Git，完整历史

### 项目结构

```
memory-tree/
├── 00-CORE.md           # 核心记忆与身份
├── 10-INDEX.md          # 目录索引
├── 20-BRANCHES/         # 主题分支
├── 30-VAULT.md          # 长期记忆库
├── 40-EVOLUTION-LOG/    # 自我演化日志
│   ├── errors.md        # 错误追踪
│   ├── corrections.md   # 用户纠正
│   └── skill-extraction.md
├── 01-DAILY/            # 每日记忆文件
├── scripts/             # 工具脚本
├── skills/              # 记忆技能
├── knowledge-base/      # 知识库
└── v3-core/             # v3.0 核心 (ChromaDB)
```

### 快速开始

```bash
# 加载记忆树
node scripts/memory-loader.js

# 保存记忆
node save-memory-enhanced.js save "你的记忆内容"

# 扫描技能
node save-memory-enhanced.js scan-skills
```

### 版本信息

- **当前版本**: v2.x (正向 v3.0 迁移)
- **v3.0 特性**:
  - 全手动复活
  - 智能清理算法
  - ChromaDB 向量库
  - nomic-embed-text 嵌入

### 许可证

MIT

---

> **Note**: This project is actively maintained. For issues or contributions, please open an issue or PR.
>
> **注意**: 本项目持续维护中。如有问题或贡献，请提交 Issue 或 PR。
