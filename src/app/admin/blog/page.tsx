/**
 * T09 - 管理后台博客列表页
 * 显示所有博客（包括草稿和已发布的），提供编辑和删除功能
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

/**
 * 获取所有博客（管理员视图）
 */
async function getAllBlogs() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: "desc", // 最新的在前面
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
                    },
                },
            },
        });

        return blogs;
    } catch (error) {
        console.error("获取博客列表失败:", error);
        return [];
    }
}

/**
 * 管理后台博客列表页
 */
export default async function AdminBlogListPage() {
    const blogs = await getAllBlogs();

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">博客管理</h1>
                    <p className="mt-2 text-gray-600">
                        共 {blogs.length} 篇博客
                    </p>
                </div>

                {/* 创建按钮 */}
                <Link
                    href="/admin/blog/create"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    创建博客
                </Link>
            </div>

            {/* 博客列表 */}
            {blogs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
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
                    <h3 className="mt-4 text-lg font-medium text-gray-900">暂无博客</h3>
                    <p className="mt-2 text-gray-600">
                        开始创建你的第一篇博客吧！
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/admin/blog/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                        >
                            创建博客
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状态
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    分类
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    标签
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    创建时间
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                    {/* 标题 */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                {blog.title}
                                            </Link>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {blog.description.length > 60
                                                    ? blog.description.substring(0, 60) + "..."
                                                    : blog.description}
                                            </span>
                                        </div>
                                    </td>

                                    {/* 状态 */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.published
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {blog.published ? "已发布" : "草稿"}
                                        </span>
                                    </td>

                                    {/* 分类 */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {blog.category ? (
                                            <span className="text-sm text-gray-900">
                                                {blog.category.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>

                                    {/* 标签 */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {blog.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                            {blog.tags.length > 2 && (
                                                <span className="text-xs text-gray-400">
                                                    +{blog.tags.length - 2}
                                                </span>
                                            )}
                                            {blog.tags.length === 0 && (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* 创建时间 */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(blog.createdAt)}
                                    </td>

                                    {/* 操作按钮 */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* 查看按钮 */}
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                                                title="查看"
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
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </Link>

                                            {/* 编辑按钮 */}
                                            <Link
                                                href={`/admin/blog/edit/${blog.id}`}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
                                                title="编辑"
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
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                编辑
                                            </Link>
                                            <DeleteBlogButton blogId={blog.id} blogTitle={blog.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

