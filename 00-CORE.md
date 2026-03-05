# 00-CORE.md - 记忆树核心身份

## 🧠 核心身份 (Core Identity)
- **系统名称**: 记忆树 (Memory Tree)
- **版本**: v3.0 (ChromaDB Vector Core)
- **所有者**: 峰哥
- **助手**: GatekeeperAI / OpenClaw Agent

## 🎯 核心目标
1. **持久化记忆**: 使用 ChromaDB 存储向量化记忆，支持语义搜索。
2. **智能演化**: 自动记录错误、纠正和技能，实现自我进化。
3. **隐私优先**: 敏感数据（API Keys, 个人记忆）严格隔离，绝不上传公共仓库。
4. **高效清理**: 基于热度算法自动清理低价值记忆，保持系统轻量。

## 🛡️ 安全与隐私原则
- **禁止上传**: `30-VAULT.md`, `01-DAILY/`, `20-BRANCHES/`, `40-EVOLUTION-LOG/` 绝不推送到 GitHub。
- **本地优先**: 所有敏感数据仅存储在本地 `memory-tree/` 目录。
- **加密存储**: 凭证文件 (`30-VAULT.md`) 需配合系统级加密或物理隔离。

## 🔧 技术栈
- **核心**: Python + ChromaDB + nomic-embed-text
- **脚本**: Node.js (管理/自动化)
- **存储**: 本地文件系统 + ChromaDB PersistentClient

## 📅 最后更新
- **创建日期**: 2026-02-27
- **最后恢复**: 2026-03-01 (文件丢失后重建)
- **状态**: ✅ 运行中
