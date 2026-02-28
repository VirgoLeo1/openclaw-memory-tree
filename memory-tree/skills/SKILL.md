# SKILL.md - Smart Memory Tree Manager (v2.0)

> **版本**: 2.0.0  
> **创建时间**: 2026-02-24  
> **作者**: GatekeeperAI (Self-Evolving)  
> **描述**: 管理无限层级记忆树，实现自动加载、影子模式、安全凭证调用、热度追踪与自我进化。  
> **记忆树位置**: `D:\.openclaw-backup\memory-tree\`  
> **最大容量**: 1GB

---

## 🎯 核心功能概览

### 1. 自动记忆加载 (Auto-Load)
- **触发**: 每次会话开始或用户提及特定领域
- **行为**: 
  - 自动读取 `00-CORE.md` + `10-INDEX.md`
  - 根据上下文关键词递归加载相关节点（深度 3 层）
  - 预加载时间/场景匹配的记忆
  - 显示加载进度和统计

### 2. 记忆保存 (Save & Archive)
- **触发**: 用户指令 "记住这个" 或自动检测重要信息
- **行为**:
  - 智能分类到对应分支（tech/workflow/projects/preferences）
  - 自动版本控制（.bak 备份）
  - 冲突检测与解决
  - 支持标签系统

### 3. 影子模式 (Shadow Mode)
- **触发**: 遇到新任务或现有记忆无法解决
- **行为**:
  - 影子执行并记录结果
  - 成功经验 → `40-EVOLUTION-LOG/pending/新经验.md`
  - 失败经验 → `40-EVOLUTION-LOG/pending/错误分析.md`
  - 定期提示用户审核（3 次确认后转入正式目录）

### 4. 热度追踪 (Heat System)
- **算法**: `新热度 = 旧热度 × 0.95 + 10`
- **分级**: 🔥高 (>80) | 🔶中 (40-80) | ❄️低 (<40)
- **火花机制**: 检测到低热度但相关的节点时主动提示
- **报告**: 每日/每周/每月生成热度报告

### 5. 安全凭证 (Vault)
- **位置**: `30-VAULT.md`
- **安全**: Base64/XOR 混淆，用后即焚
- **验证**: 高风险操作需三次确认
- **日志**: 记录访问时间，不记录凭证内容

### 6. 记忆搜索 (Search)
- 全文搜索、标签过滤、时间范围
- 按热度/时间/相关性排序
- 支持多条件组合搜索

### 7. 定期任务 (Scheduled Tasks)
- **每日**: 热度衰减、检查 pending、生成简报
- **每周**: 热度报告、凭证检查、备份 Vault
- **每月**: 整理 pending、清理建议
- **每半年**: 全面整理、归档旧记忆

---

## 🛠️ 工具命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `/memory load <topic>` | 加载指定主题记忆 | `/memory load moltbook` |
| `/memory save <content>` | 手动保存记忆 | `/memory save 今天学会了...` |
| `/memory search <query>` | 搜索记忆 | `/memory search python 脚本` |
| `/memory list [path]` | 列出节点 | `/memory list 20-BRANCHES/tech` |
| `/memory heat` | 查看热度报告 | `/memory heat` |
| `/memory vault get <service>` | 获取凭证 | `/memory vault get moltbook` |
| `/memory pending` | 查看待审核 | `/memory pending` |
| `/memory archive <path>` | 归档节点 | `/memory archive old-project` |
| `/memory stats` | 使用统计 | `/memory stats` |
| `/memory export <format>` | 导出记忆 | `/memory export json` |

---

## 📂 文件结构

```
D:\.openclaw-backup\memory-tree\
├── 00-CORE.md              # 核心身份与策略
├── 10-INDEX.md             # 导航目录（自动生成）
├── 20-BRANCHES\            # 主记忆分支
│   ├── tech\
│   ├── workflow\
│   ├── projects\
│   ├── preferences\
│   └── platform\
├── 30-VAULT.md             # 安全凭证
├── 40-EVOLUTION-LOG\
│   ├── pending\            # 待审核经验
│   ├── reviewed\
│   ├── errors\
│   └── heat-reports\
├── 99-SYSTEM\
│   ├── config.json
│   ├── access-log.json
│   └── cache\
└── skills\smart-memory-tree\
    ├── SKILL.md            # 本文件
    ├── 功能规格说明书.md    # 详细规格
    ├── memory-loader.js    # 记忆加载器
    ├── vault-reader.js     # 凭证读取器
    ├── heat-tracker.js     # 热度追踪器
    ├── auto-saver.js       # 自动保存器
    └── search-engine.js    # 搜索引擎
```

---

## ⚠️ 安全规则

1. **凭证保护**: 严禁发送 Vault 内容到网络/日志，高风险操作需三次确认
2. **隐私过滤**: 自动过滤敏感信息，支持标记私密节点
3. **大小限制**: 记忆树最大 1GB，单文件最大 100MB
4. **路径优化**: 超过 260 字符自动扁平化
5. **并发控制**: 同时只允许一个写入，读取最多 10 个并发

---

## 🧬 自我进化

本技能文件也可进化。发现更优策略时，在 `40-EVOLUTION-LOG/pending/` 提出建议，用户确认后更新。

**下次审查**: 2026-03-01
