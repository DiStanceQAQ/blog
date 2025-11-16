/**
 * T15 - 所有分类列表页
 * 显示所有分类及其博客数量
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * 获取所有分类及其博客数量
 */
async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
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

        return categories;
    } catch (error) {
        console.error("获取分类列表失败:", error);
        return [];
    }
}

/**
 * 生成元数据
 */
export async function generateMetadata() {
    return {
        title: "所有分类",
        description: "浏览所有博客分类",
    };
}

/**
 * 所有分类列表页
 */
export default async function CategoriesPage() {
    const categories = await getAllCategories();

    if (categories.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">所有分类</h1>
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
                    <p className="mt-4 text-gray-600">暂无分类</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            {/* 页面头部 */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">所有分类</h1>
                <p className="text-lg text-gray-600">
                    共 {categories.length} 个分类
                </p>
            </div>

            {/* 分类网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <svg
                                        className="h-6 w-6 text-blue-600"
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
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{category._count.blogs} 篇文章</span>
                            <svg
                                className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

