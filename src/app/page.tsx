// src/app/page.tsx
import { prisma } from '@/lib/prisma'

export default async function Home() {
  let dbStatus = '';
  let tableInfo = '';

  try {
    // 测试基本连接
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = '✅ 数据库连接成功';

    // 获取表信息
    const blogCount = await prisma.blog.count();
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const tagCount = await prisma.tag.count();

    tableInfo = `
      📊 数据库统计:
      - 博客: ${blogCount} 条
      - 用户: ${userCount} 条  
      - 分类: ${categoryCount} 条
      - 标签: ${tagCount} 条
    `;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    dbStatus = `❌ 数据库连接失败: ${errorMessage}`;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>博客系统状态</h1>
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <p>{dbStatus}</p>
        <pre>{tableInfo}</pre>
      </div>
    </div>
  )
}