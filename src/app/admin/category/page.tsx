/**
 * T11 - 分类管理列表页
 * 显示所有分类，提供创建和删除功能
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";

interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    _count: {
        blogs: number;
    };
}

async function fetcher(url: string) {
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
}

export default function CategoryListPage() {
    const { data: categories, error, isLoading } = useSWR<Category[]>(
        "/api/categories",
        fetcher
    );
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string): Promise<void> => {
        if (!confirm(`确定要删除分类 "${name}" 吗？`)) {
            return;
        }

        setDeleting(id);

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "删除成功");
                mutate("/api/categories");
            } else {
                alert(result.error || "删除失败");
            }
        } catch (error) {
            alert("删除失败：" + (error instanceof Error ? error.message : "未知错误"));
        } finally {
            setDeleting(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-red-900 mb-2">加载失败</h2>
                <p className="text-red-700">无法加载分类列表</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
                    <p className="mt-2 text-gray-600">
                        共 {categories?.length || 0} 个分类
                    </p>
                </div>

                {/* 创建按钮 */}
                <Link
                    href="/admin/category/create"
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
                    创建分类
                </Link>
            </div>

            {/* 分类列表 */}
            {!categories || categories.length === 0 ? (
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">暂无分类</h3>
                    <p className="mt-2 text-gray-600">开始创建你的第一个分类吧！</p>
                    <div className="mt-6">
                        <Link
                            href="/admin/category/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                        >
                            创建分类
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    名称
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    博客数量
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
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{category.slug}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {category._count.blogs} 篇
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(category.createdAt).toLocaleDateString("zh-CN")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            disabled={deleting === category.id || category._count.blogs > 0}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            title={
                                                category._count.blogs > 0
                                                    ? "该分类下有博客，无法删除"
                                                    : "删除分类"
                                            }
                                        >
                                            {deleting === category.id ? "删除中..." : "删除"}
                                        </button>
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

