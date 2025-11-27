/**
 * T12 - 编辑分类页面
 * 允许管理员编辑分类的名称
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { request, RequestError } from "@/lib/request";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 获取分类信息
    useEffect(() => {
        async function fetchCategory() {
            try {
                setLoading(true);
                const data = await request<Category>(`/api/categories/${id}`, {
                    showErrorToast: true,
                });
                setCategory(data);
                setName(data.name);
            } catch (err) {
                console.error("获取分类失败:", err);
                setError(
                    err instanceof RequestError
                        ? err.message
                        : err instanceof Error
                            ? err.message
                            : "获取分类失败"
                );
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCategory();
        }
    }, [id]);

    // 处理提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("分类名称不能为空");
            return;
        }

        setSubmitting(true);

        try {
            await request(`/api/categories/${id}`, {
                method: "PUT",
                body: { name: name.trim() },
                showErrorToast: true,
                showSuccessToast: true,
                successMessage: "分类更新成功！",
            });

            // 成功后返回列表页
            router.push("/admin/category");
        } catch (err) {
            console.error("更新分类失败:", err);
            setError(
                err instanceof RequestError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : "更新分类失败"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    if (error && !category) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-900 mb-2">加载失败</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <Link
                        href="/admin/category"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
                    >
                        ← 返回分类列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">编辑分类</h1>
                    <p className="mt-2 text-gray-600">修改分类信息</p>
                </div>
                <Link
                    href="/admin/category"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    ← 返回列表
                </Link>
            </div>

            {/* 表单 */}
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 错误提示 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* 分类名称 */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            分类名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="请输入分类名称"
                            required
                            disabled={submitting}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            分类名称将用于显示和生成 URL 友好的 slug
                        </p>
                    </div>

                    {/* Slug 预览（只读） */}
                    {category && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug（自动生成）
                            </label>
                            <input
                                type="text"
                                value={category.slug}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                readOnly
                                disabled
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Slug 会根据分类名称自动生成
                            </p>
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting || !name.trim()}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    更新中...
                                </>
                            ) : (
                                "更新分类"
                            )}
                        </button>
                        <Link
                            href="/admin/category"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}