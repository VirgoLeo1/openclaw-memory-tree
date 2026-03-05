#!/usr/bin/env python3
"""初始化 ChromaDB 向量数据库"""
import chromadb
import os
from pathlib import Path

# 获取项目根目录
root_dir = Path(__file__).parent.parent
chroma_dir = root_dir / "v3-core" / "chroma_data"

# 创建持久化客户端
print(f"📂 ChromaDB 数据目录：{chroma_dir}")
client = chromadb.PersistentClient(path=str(chroma_dir))

# 创建记忆集合
collections = {
    "memories": "日常记忆存储",
    "knowledge": "知识库",
    "skills": "技能记忆"
}

for name, desc in collections.items():
    try:
        collection = client.get_collection(name=name)
        print(f"✅ 集合已存在：{name} ({desc})")
    except:
        collection = client.create_collection(name=name, metadata={"description": desc})
        print(f"🆕 创建集合：{name} ({desc})")

# 测试添加和查询
test_collection = client.get_collection("memories")
test_collection.add(
    documents=["记忆树初始化成功！"],
    metadatas=[{"source": "system"}],
    ids=["init-001"]
)

# 查询测试
results = test_collection.query(
    query_texts=["初始化"],
    n_results=1
)

print(f"\n🎉 ChromaDB 初始化完成！")
print(f"📊 集合数量：{len(client.list_collections())}")
print(f"✅ 测试查询成功：{results['documents'][0][0] if results['documents'] else '无结果'}")
