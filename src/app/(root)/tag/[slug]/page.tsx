/**
 * T15 - 单个标签的博客列表页
 * 显示特定标签下的所有已发布博客
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

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
 * 根据 slug 获取标签及其博客
 */
const getTagWithBlogs = cache(async (slug: string) => {
    try {
        let decodedSlug = slug;
        try {
            decodedSlug = decodeURIComponent(slug);
        } catch {
            decodedSlug = slug;
        }

        const tag = await prisma.tag.findUnique({
            where: { slug: decodedSlug },
            select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                iconDark: true,
                blogs: {
                    where: {
                        published: true, // 只显示已发布的博客
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        description: true,
                        createdAt: true,
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
                },
            },
        });

        return tag;
    } catch (error) {
        console.error("获取标签失败:", error);
        return null;
    }
});

/**
 * 生成静态参数
 */
export async function generateStaticParams() {
    const tags = await prisma.tag.findMany({
        select: { slug: true },
    });

    return tags.map((tag) => ({
        slug: tag.slug,
    }));
}

/**
 * 生成元数据
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tag = await getTagWithBlogs(slug);

    if (!tag) {
        return {
            title: "标签不存在",
        };
    }

    return {
        title: `${tag.name} - 标签`,
        description: `浏览 ${tag.name} 标签下的所有文章`,
    };
}

/**
 * 单个标签页面
 */
export default async function TagPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tag = await getTagWithBlogs(slug);

    // 标签不存在，显示 404
    if (!tag) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            {/* 面包屑导航 */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                    首页
                </Link>
                <span>/</span>
                <Link href="/tags" className="hover:text-blue-600 transition-colors">
                    标签
                </Link>
                <span>/</span>
                <span className="text-gray-900">#{tag.name}</span>
            </nav>

            {/* 标签头部 */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    {tag.icon && (
                        <div className="text-6xl">
                            {tag.icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">#{tag.name}</h1>
                        {tag.iconDark && (
                            <p className="mt-1 text-lg text-gray-600">{tag.iconDark}</p>
                        )}
                        <p className="mt-2 text-gray-600">
                            {tag.blogs.length} 篇文章
                        </p>
                    </div>
                </div>
            </div>

            {/* 博客列表 */}
            {tag.blogs.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                    <p className="mt-4 text-gray-600">该标签下暂无文章</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {tag.blogs.map((blog) => (
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

                                    {/* 其他标签 */}
                                    {blog.tags.filter(t => t.id !== tag.id).length > 0 && (
                                        <>
                                            <span>·</span>
                                            <div className="flex flex-wrap gap-2">
                                                {blog.tags
                                                    .filter(t => t.id !== tag.id)
                                                    .map((otherTag) => (
                                                        <span
                                                            key={otherTag.id}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                                                        >
                                                            {otherTag.icon && <span>{otherTag.icon}</span>}
                                                            #{otherTag.name}
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
