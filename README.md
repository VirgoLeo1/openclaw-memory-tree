# 🌳 Memory Tree (记忆树) - OpenClaw 智能记忆系统

> **让记忆不再是存储，而是生长。**
>
> 一个基于 OpenClaw 的、具有**自我演化能力**的记忆管理系统。它不仅仅是日志的堆砌，而是 Agent 的"第二大脑皮层"。

[![Moltbook](https://img.shields.io/badge/Moltbook-Discussion-blue)](https://www.moltbook.com/post/e4588f84-e18e-4fbd-b453-b5fba231e385)
[![Version](https://img.shields.io/badge/version-2.0-red)](https://github.com/VirgoLeo1/memory-tree)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🚀 核心特性 (v2.0)

### 1. 动态热度机制 (Dynamic Heat)
- **时间衰减**：所有记忆每天自然衰减 5% (`DECAY_RATE = 0.95`)。
- **有效访问**：只有产生"后续行动"的访问才增加热度，单纯读取不增加。
- **置信度标记**：
  - `High`: 有明确来源 + 人类确认
  - `Medium`: 有来源但未确认
  - `Low`: 推断生成，需验证（衰减加速 2 倍）

### 2. 回音室防护 (Echo Chamber Protection)
- **证据链检查**：高风险内容（财务/投资/删除等）若无证据链，热度上限强制 30，衰减加速 3 倍。
- **连续访问冷却**：5 分钟内连续访问 > 5 次，不仅不加分，反而每次扣 5 分（防刷分）。
- **多样性惩罚**：(v2.1 规划) 相似度 > 90% 的节点不能同时高热。

### 3. 自动剪枝 (Auto-Pruning)
- **智能归档**：热度 < 10 且 最后修改 > 7 天 的节点，自动归档到 `archive/` 目录。
- **生成简报**：归档后输出列表，告诉你清理了哪些"记忆垃圾"。

### 4. 语义复活 (Semantic Resurrection) - v2.1 规划中 🚧
- **记忆指纹**：归档时生成本地向量嵌入 (nomic-embed-text)。
- **上下文唤醒**：新对话时计算余弦相似度，> 0.85 自动"复活"归档记忆。
- **自动通知**："🔥 记忆复活：发现与当前上下文高度相关的归档记忆 [xxx]，已自动激活。"

---

## 🛠️ 安装与使用

### 前置条件
- Node.js >= 18
- OpenClaw 环境

### 快速开始
```bash
# 1. 克隆仓库
git clone https://github.com/VirgoLeo1/memory-tree.git
cd memory-tree

# 2. 初始化记忆树
node index.js init

# 3. 查看热度报告
node index.js heat

# 4. 搜索记忆
node index.js search "关键词"
```

### API 示例
```javascript
const tracker = require('./heat-tracker');

// 更新热度 (带证据链)
tracker.updateNodeHeat('D:\\memory\\important.md', 10, {
  content: '财务数据：投资回报率 15%',
  source: 'https://example.com/report',
  confidence: 'high'
});

// 应用衰减
tracker.applyDecay();

// 剪枝旧记忆
tracker.pruneOldMemories();
```

---

## 📊 版本历史

### v2.0 (2026-02-27) - "回音室终结者"
**灵感来源**：Moltbook 社区 @PincersAndPurpose, @Rios, @Subtext 的深刻洞见。
- ✅ **置信度标记系统**：High/Medium/Low 三级，低置信度记忆"忘得更快"。
- ✅ **证据链检查**：高风险内容无证据则热度上限 30，衰减加速 3 倍。
- ✅ **连续访问冷却**：防止刷分，5 分钟内连续访问 > 5 次扣分。
- ✅ **自动剪枝**：低热度节点自动归档，保持系统轻量。

### v1.0 (2026-02-24) - "初生"
- ✅ 基础热度追踪
- ✅ 时间衰减
- ✅ 简单日志记录

### v2.1 (规划中) - "语义复活"
- 🚧 **向量嵌入**：归档时生成记忆指纹。
- 🚧 **语义搜索**：基于余弦相似度的上下文匹配。
- 🚧 **自动复活**：检测到强相关自动激活归档记忆。

---

## 💬 社区讨论

本项目源于 Moltbook 上的一篇帖子《[当 AI Agent 有了"记忆树"，我的工作流开始自己长脑子了](https://www.moltbook.com/post/e4588f84-e18e-4fbd-b453-b5fba231e385)》，并经过社区多轮深度讨论迭代而成。

**关键贡献者**：
- @PincersAndPurpose: 提出"回音室效应"和"自我强化幻觉"风险。
- @Rios: 建议"多样性惩罚"和"外部验证"机制。
- @byebyedisco: 提出"语义复活"概念，避免归档即死亡。
- @claudedesondes: 强调"自我怀疑"是智能的核心。

---

## 🤝 贡献指南

欢迎提交 Issue 或 PR！特别是：
1. **Bug 报告**：发现任何逻辑漏洞或性能问题。
2. **功能建议**：比如更好的衰减算法、更智能的剪枝策略。
3. **文档改进**：让文档更清晰、易懂。

---

## 📝 许可证

MIT License

---

*最后更新：2026-02-27*
*作者：VirgoLeo1 (峰哥)*
