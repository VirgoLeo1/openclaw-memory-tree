// search-engine.js - 记忆搜索引擎
// 功能：全文搜索、标签过滤、时间范围、多条件组合

const fs = require('fs');
const path = require('path');

const MEMORY_TREE_ROOT = 'D:\\.openclaw-backup\\memory-tree';

// 搜索选项
const SearchOptions = {
  caseSensitive: false,
  maxResults: 50,
  includeContent: true,
  sortBy: 'relevance' // relevance, date, heat
};

// 读取文件内容
function readFileContent(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

// 简单的全文搜索
function fullTextSearch(query, options = {}) {
  const {
    caseSensitive = false,
    maxResults = 50,
    includeContent = true
  } = options;
  
  const results = [];
  const queryLower = caseSensitive ? query : query.toLowerCase();
  
  // 递归搜索所有 .md 文件
  function searchDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // 跳过系统目录
        if (['99-SYSTEM', '40-EVOLUTION-LOG'].includes(entry.name)) return;
        searchDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = readFileContent(fullPath);
        if (!content) return;
        
        const contentLower = caseSensitive ? content : content.toLowerCase();
        const relativePath = fullPath.replace(MEMORY_TREE_ROOT + path.sep, '');
        
        // 检查是否匹配
        if (contentLower.includes(queryLower)) {
          // 计算相关度（基于出现次数和位置）
          const firstIndex = contentLower.indexOf(queryLower);
          const occurrenceCount = (contentLower.match(new RegExp(escapeRegex(queryLower), 'g')) || []).length;
          const relevanceScore = occurrenceCount * 10 + (100 - Math.min(100, firstIndex));
          
          results.push({
            path: relativePath,
            fullPath,
            fileName: entry.name,
            relevance: relevanceScore,
            firstIndex,
            occurrenceCount,
            preview: includeContent ? content.substring(Math.max(0, firstIndex - 50), firstIndex + 100).replace(/\n/g, ' ') + '...' : null
          });
        }
      }
    });
  }
  
  searchDir(MEMORY_TREE_ROOT);
  
  // 排序
  results.sort((a, b) => b.relevance - a.relevance);
  
  // 限制结果数量
  return results.slice(0, maxResults);
}

// 按标签搜索
function searchByTags(tags) {
  if (!tags || tags.length === 0) return [];
  
  const results = [];
  const tagList = tags.map(t => t.toLowerCase().replace('#', ''));
  
  function searchDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (['99-SYSTEM', '40-EVOLUTION-LOG'].includes(entry.name)) return;
        searchDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = readFileContent(fullPath);
        if (!content) return;
        
        const relativePath = fullPath.replace(MEMORY_TREE_ROOT + path.sep, '');
        
        // 检查是否包含所有标签
        const hasAllTags = tagList.every(tag => 
          content.toLowerCase().includes(`#${tag}`) || 
          content.toLowerCase().includes(`[[${tag}]]`)
        );
        
        if (hasAllTags) {
          results.push({
            path: relativePath,
            fullPath,
            fileName: entry.name,
            tags: tagList
          });
        }
      }
    });
  }
  
  searchDir(MEMORY_TREE_ROOT);
  return results;
}

// 按时间范围搜索
function searchByDateRange(startDate, endDate) {
  const results = [];
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  function searchDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (['99-SYSTEM', '40-EVOLUTION-LOG'].includes(entry.name)) return;
        searchDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const stats = fs.statSync(fullPath);
        const mtime = stats.mtimeMs;
        
        if (mtime >= start && mtime <= end) {
          const relativePath = fullPath.replace(MEMORY_TREE_ROOT + path.sep, '');
          results.push({
            path: relativePath,
            fullPath,
            fileName: entry.name,
            modified: new Date(mtime).toISOString()
          });
        }
      }
    });
  }
  
  searchDir(MEMORY_TREE_ROOT);
  return results.sort((a, b) => new Date(b.modified) - new Date(a.modified));
}

// 多条件组合搜索
function advancedSearch(query, options = {}) {
  const {
    tags = [],
    startDate,
    endDate,
    sortBy = 'relevance'
  } = options;
  
  let results = [];
  
  // 1. 文本搜索
  if (query) {
    const textResults = fullTextSearch(query, { maxResults: 1000 });
    results = textResults.map(r => ({
      ...r,
      score: r.relevance
    }));
  } else {
    // 如果没有文本搜索，获取所有文件
    function getAllFiles(dirPath) {
      const files = [];
      if (!fs.existsSync(dirPath)) return files;
      
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      entries.forEach(entry => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          if (['99-SYSTEM', '40-EVOLUTION-LOG'].includes(entry.name)) return;
          files.push(...getAllFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      });
      return files;
    }
    
    const allFiles = getAllFiles(MEMORY_TREE_ROOT);
    results = allFiles.map(f => ({
      fullPath: f,
      path: f.replace(MEMORY_TREE_ROOT + path.sep, ''),
      score: 0
    }));
  }
  
  // 2. 标签过滤
  if (tags.length > 0) {
    const tagResults = searchByTags(tags);
    const tagPaths = new Set(tagResults.map(r => r.fullPath));
    results = results.filter(r => tagPaths.has(r.fullPath));
  }
  
  // 3. 时间范围过滤
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Date.now();
    
    results = results.filter(r => {
      if (!r.fullPath) return false;
      try {
        const stats = fs.statSync(r.fullPath);
        return stats.mtimeMs >= start && stats.mtimeMs <= end;
      } catch {
        return false;
      }
    });
  }
  
  // 4. 排序
  if (sortBy === 'date') {
    results.sort((a, b) => {
      try {
        const aStats = fs.statSync(a.fullPath);
        const bStats = fs.statSync(b.fullPath);
        return bStats.mtimeMs - aStats.mtimeMs;
      } catch {
        return 0;
      }
    });
  } else if (sortBy === 'relevance') {
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
  
  return results;
}

// 转义正则表达式特殊字符
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 导出函数
module.exports = {
  fullTextSearch,
  searchByTags,
  searchByDateRange,
  advancedSearch,
  SearchOptions
};

// 如果直接运行此文件
if (require.main === module) {
  console.log('🔍 记忆搜索引擎测试模式');
  
  const query = process.argv[2] || 'test';
  console.log(`\n搜索："${query}"\n`);
  
  const results = fullTextSearch(query, { maxResults: 10 });
  
  if (results.length === 0) {
    console.log('未找到匹配结果');
  } else {
    console.log(`找到 ${results.length} 个结果:\n`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.path}`);
      console.log(`   相关度：${r.relevance.toFixed(1)} | 出现次数：${r.occurrenceCount}`);
      if (r.preview) {
        console.log(`   预览：...${r.preview}`);
      }
      console.log('');
    });
  }
}
