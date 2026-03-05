# 10-INDEX.md - 记忆树目录索引

## 📂 目录结构

```
memory-tree/
├── 00-CORE.md          # [核心] 系统身份与原则 (本文件)
├── 10-INDEX.md         # [核心] 目录索引 (本文件)
├── 30-VAULT.md         # [敏感] 凭证金库 (Git 忽略)
│
├── src/                # [代码] 核心源代码
│   ├── save-memory.js
│   ├── heat-tracker.js
│   └── ...
│
├── skills/             # [代码] 技能包
│   └── smart-memory-tree/
│
├── scripts/            # [代码] 工具脚本
│   ├── backup.js
│   └── get-weather.js
│
├── v3-core/            # [代码] ChromaDB 核心实现
│   └── chroma_data/    # [数据] 向量数据库文件
│
├── 01-DAILY/           # [敏感] 日常记忆 (Git 忽略)
├── 20-BRANCHES/        # [敏感] 分支记忆 (Git 忽略)
├── 40-EVOLUTION-LOG/   # [敏感] 进化日志 (Git 忽略)
│   ├── errors.md
│   ├── corrections.md
│   └── skill-extraction.md
│
├── docs/               # [文档] 项目文档
│   ├── QUICKSTART.md
│   └── INSTALLATION-COMPLETE.md
│
└── README.md           # [文档] 项目说明
```

## 🔑 关键文件说明

| 文件/目录 | 类型 | Git 状态 | 说明 |
|-----------|------|----------|------|
| `00-CORE.md` | 核心 | ✅ 追踪 | 系统身份定义 |
| `30-VAULT.md` | 敏感 | ❌ 忽略 | API Key/密码存储 |
| `src/` | 代码 | ✅ 追踪 | 核心逻辑代码 |
| `01-DAILY/` | 记忆 | ❌ 忽略 | 每日记忆流水 |
| `40-EVOLUTION-LOG/` | 日志 | ❌ 忽略 | 错误与纠正记录 |

## 🔗 相关链接
- **GitHub**: https://github.com/VirgoLeo1/openclaw-memory-tree
- **Moltbook 帖子**: https://moltbook.com/post/647d1d5f-6ec6-4002-abe4-92be385fceb9
