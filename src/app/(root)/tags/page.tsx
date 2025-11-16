/**
 * T15 - 所有标签列表页
 * 显示所有标签及其博客数量
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * 获取所有标签及其博客数量
 */
async function getAllTags() {
    try {
        const tags = await prisma.tag.findMany({
            include: {
                _count: {
                    select: {
                        blogs: {
                            where: {
                                published: true, // 只计算已发布的博客
                            },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return tags;
    } catch (error) {
        console.error("获取标签列表失败:", error);
        return [];
    }
}

/**
 * 生成元数据
 */
export async function generateMetadata() {
    return {
        title: "所有标签",
        description: "浏览所有博客标签",
    };
}

/**
 * 所有标签列表页
 */
export default async function TagsPage() {
    const tags = await getAllTags();

    if (tags.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">所有标签</h1>
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                    </svg>
                    <p className="mt-4 text-gray-600">暂无标签</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            {/* 页面头部 */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">所有标签</h1>
                <p className="text-lg text-gray-600">
                    共 {tags.length} 个标签
                </p>
            </div>

            {/* 标签云 */}
            <div className="flex flex-wrap gap-4">
                {tags.map((tag) => {
                    // 根据文章数量计算标签大小
                    const count = tag._count.blogs;
                    let sizeClass = 'text-base';
                    if (count > 10) sizeClass = 'text-2xl';
                    else if (count > 5) sizeClass = 'text-xl';
                    else if (count > 2) sizeClass = 'text-lg';

                    return (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className={`group inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 ${sizeClass}`}
                        >
                            {tag.icon && (
                                <span className="text-xl">{tag.icon}</span>
                            )}
                            <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                #{tag.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({count})
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* 标签列表视图（备选） */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">标签列表</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                {tag.icon && (
                                    <span className="text-2xl">{tag.icon}</span>
                                )}
                                <div>
                                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        #{tag.name}
                                    </p>
                                    {tag.iconDark && (
                                        <p className="text-xs text-gray-500">{tag.iconDark}</p>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {tag._count.blogs} 篇
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

