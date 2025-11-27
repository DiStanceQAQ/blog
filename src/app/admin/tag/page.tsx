/**
 * T11 - 标签管理列表页
 * 显示所有标签，提供创建和删除功能
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";

interface Tag {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    iconDark: string | null;
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

export default function TagListPage() {
    const { data: tags, error, isLoading } = useSWR<Tag[]>("/api/tags", fetcher);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string, name: string): Promise<void> => {
        if (!confirm(`确定要删除标签 "${name}" 吗？`)) {
            return;
        }

        setDeleting(id);

        try {
            const response = await fetch(`/api/tags/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "删除成功");
                mutate("/api/tags");
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
                <p className="text-red-700">无法加载标签列表</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">标签管理</h1>
                    <p className="mt-2 text-gray-600">共 {tags?.length || 0} 个标签</p>
                </div>

                {/* 创建按钮 */}
                <Link
                    href="/admin/tag/create"
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
                    创建标签
                </Link>
            </div>

            {/* 标签列表 */}
            {!tags || tags.length === 0 ? (
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
                    <h3 className="mt-4 text-lg font-medium text-gray-900">暂无标签</h3>
                    <p className="mt-2 text-gray-600">开始创建你的第一个标签吧！</p>
                    <div className="mt-6">
                        <Link
                            href="/admin/tag/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                        >
                            创建标签
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
                                    图标
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
                            {tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {tag.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{tag.slug}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {tag.icon ? (
                                            <span className="text-lg">{tag.icon}</span>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {tag._count.blogs} 篇
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(tag.createdAt).toLocaleDateString("zh-CN")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* 编辑按钮 */}
                                            <Link
                                                href={`/admin/tag/edit/${tag.id}`}
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
                                        </div>
                                        <button
                                            onClick={() => handleDelete(tag.id, tag.name)}
                                            disabled={deleting === tag.id || tag._count.blogs > 0}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            title={
                                                tag._count.blogs > 0
                                                    ? "该标签下有博客，无法删除"
                                                    : "删除标签"
                                            }
                                        >
                                            {deleting === tag.id ? "删除中..." : "删除"}
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

