/**
 * - 博客列表页（支持搜索）
 * 显示所有博客，支持搜索功能
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * 获取博客列表
 */
async function getBlogs(searchQuery?: string) {
  try {
    // 构建搜索条件
    const whereCondition = searchQuery
      ? {
        AND: [
          { published: true }, // 只显示已发布的
          {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' as const } },
              { description: { contains: searchQuery, mode: 'insensitive' as const } },
              { body: { contains: searchQuery, mode: 'insensitive' as const } },
            ],
          },
        ],
      }
      : { published: true };

    const blogs = await prisma.blog.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      take: 50, // 最多显示 50 篇
    });

    return blogs;
  } catch (error) {
    console.error("获取博客列表失败:", error);
    return [];
  }
}

/**
 * 生成元数据
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query;

  if (query) {
    return {
      title: `搜索: ${query}`,
      description: `搜索"${query}"的博客文章`,
    };
  }

  return {
    title: "所有博客",
    description: "浏览所有博客文章",
  };
}

/**
 * 博客列表页
 */
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query;
  const blogs = await getBlogs(query);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* 页面头部 */}
      <div className="mb-12">
        {query ? (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              搜索结果
            </h1>
            <p className="text-lg text-gray-600">
              关键词：<span className="font-semibold text-blue-600">&ldquo;{query}&rdquo;</span>
              {" "}·{" "}找到 {blogs.length} 篇文章
            </p>
            <Link
              href="/blogs"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              查看所有博客
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">所有博客</h1>
            <p className="text-lg text-gray-600">
              共 {blogs.length} 篇文章
            </p>
          </>
        )}
      </div>

      {/* 博客列表 */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-xl text-gray-600">
            {query ? `没有找到包含"${query}"的文章` : "暂无博客文章"}
          </p>
          {query && (
            <p className="mt-2 text-gray-500">试试其他关键词</p>
          )}
        </div>
      ) : (
        <div className="grid gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
            >
              <Link href={`/blog/${blog.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.description}
                </p>

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <time dateTime={blog.createdAt.toISOString()}>
                    {formatDate(blog.createdAt)}
                  </time>

                  {/* 分类 */}
                  {blog.category && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-xs text-blue-800">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {blog.category.name}
                      </span>
                    </>
                  )}

                  {/* 标签 */}
                  {blog.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {tag.icon && <span>{tag.icon}</span>}
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
