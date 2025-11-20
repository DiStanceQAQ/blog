/**
 * - 博客详情页
 * 使用 Server Component 通过 slug 获取并渲染博客详情（SSR）
 * - 使用 Markdown 渲染器展示内容
 */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Viewer from "@/components/bytemd/Viewer";

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

/**
 * 根据 slug 获取博客
 */
async function getBlogBySlug(slug: string) {
    try {
        // 解码 URL 编码的 slug（处理中文等特殊字符）
        let decodedSlug = slug;
        try {
            decodedSlug = decodeURIComponent(slug);
        } catch {
            // 如果解码失败（可能已经是解码后的），使用原始值
            decodedSlug = slug;
        }

        console.log("查询 slug (原始):", slug);
        console.log("查询 slug (解码后):", decodedSlug);
        const blog = await prisma.blog.findUnique({
            where: { slug: decodedSlug },
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
        });

        return blog;
    } catch (error) {
        console.error("获取博客失败:", error);
        return null;
    }
}

/**
 * 生成静态参数（可选，用于静态生成）
 */
export async function generateStaticParams() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return blogs.map((blog) => ({
        slug: blog.slug,
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
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: "博客不存在",
        };
    }

    return {
        title: blog.title,
        description: blog.description,
    };
}

/**
 * 博客详情页
 */
export default async function BlogPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    // 博客不存在，显示 404
    if (!blog) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            {/* 面包屑导航 */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                    首页
                </Link>
                <span>/</span>
                <Link href="/blogs" className="hover:text-blue-600 transition-colors">
                    博客
                </Link>
                <span>/</span>
                <span className="text-gray-900">{blog.title}</span>
            </nav>

            {/* 文章头部 */}
            <header className="mb-12">
                {/* 标题 */}
                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                    {blog.title}
                </h1>

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    {/* 发布时间 */}
                    <div className="flex items-center gap-2">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <time dateTime={blog.createdAt.toISOString()}>
                            {formatDate(blog.createdAt)}
                        </time>
                    </div>

                    {/* 分类 */}
                    {blog.category && (
                        <>
                            <span>·</span>
                            <Link
                                href={`/category/${blog.category.slug}`}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200"
                            >
                                <svg
                                    className="h-4 w-4"
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
                            </Link>
                        </>
                    )}

                    {/* 发布状态 */}
                    <span>·</span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${blog.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {blog.published ? "已发布" : "草稿"}
                    </span>
                </div>

                {/* 标签 */}
                {blog.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/tag/${tag.slug}`}
                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                            >
                                {tag.icon && <span>{tag.icon}</span>}
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* 封面图 */}
                {blog.cover && (
                    <div className="relative mt-8 h-64 w-full overflow-hidden rounded-xl md:h-96">
                        <Image
                            src={blog.cover}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </header>

            {/* 文章内容 */}
            <article className="max-w-none">
                {/* 描述/摘要 */}
                {blog.description && blog.description !== blog.title && (
                    <div className="mb-8 border-l-4 border-blue-500 bg-blue-50 p-6 text-lg leading-relaxed text-gray-700">
                        {blog.description}
                    </div>
                )}

                {/* 正文 - Markdown 渲染 */}
                <Viewer content={blog.body} />
            </article>

            {/* 底部元信息 */}
            <footer className="mt-16 border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        <span>最后更新：</span>
                        <time dateTime={blog.updatedAt.toISOString()}>
                            {formatDate(blog.updatedAt)}
                        </time>
                    </div>

                    {/* 返回列表 */}
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg
                            className="h-4 w-4"
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
                        返回博客列表
                    </Link>
                </div>
            </footer>
        </div>
    );
}

