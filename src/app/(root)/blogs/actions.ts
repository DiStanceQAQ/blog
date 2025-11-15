//服务端操作
//核心功能：
//查询已发布的博客: where: { published: true }（只显示已发布的）
//按时间倒序排列: orderBy: { createdAt: "desc" }（最新的在前面）
// 包含关联数据: include: { tags: true, category: true }（同时加载标签和分类）
//统计总数: 返回博客总数

import { prisma } from "@/lib/prisma";

/**
 * 获取已发布的博客列表
 * Server Action - 在服务器端执行
 */
export async function getPublishedBlogs() {
  try {
    // 查询已发布的博客
    const blogs = await prisma.blog.findMany({
      where: {
        published: true // 只显示已发布的博客
      },
      orderBy: {
        createdAt: "desc" // 最新的在前面
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // 统计总数
    const total = blogs.length;

    return {
      blogs,
      total,
    };
  } catch (error) {
    console.error("获取博客列表失败:", error);
    return {
      blogs: [],
      total: 0,
    };
  }
}