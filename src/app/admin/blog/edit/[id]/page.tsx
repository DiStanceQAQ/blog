"use client";

/**
 * T10 - 博客编辑页面
 * 使用 react-hook-form 管理表单，通过 SWR 获取数据并预填充
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getBlog, UpdateBlogData } from "@/app/admin/blog/api";
import { useUpdateBlog } from "@/hooks/useUpdateBlog";

interface EditBlogPageProps {
    params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
    const router = useRouter();
    const [blogId, setBlogId] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 解析 params
    useEffect(() => {
        params.then((p) => setBlogId(p.id));
    }, [params]);

    // 使用 SWR 获取博客数据
    const { data: blogResponse, error: fetchError, isLoading } = useSWR(
        blogId ? `/api/blog/${blogId}` : null,
        () => getBlog(blogId)
    );

    // 初始化表单
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateBlogData>({
        defaultValues: {
            title: "",
            body: "",
            description: "",
            cover: "",
            published: false,
        },
    });

    // 当博客数据加载完成时，预填充表单
    useEffect(() => {
        if (blogResponse?.data) {
            reset({
                title: blogResponse.data.title,
                body: blogResponse.data.body,
                description: blogResponse.data.description,
                cover: blogResponse.data.cover || "",
                published: blogResponse.data.published,
            });
        }
    }, [blogResponse, reset]);

    // 初始化更新 hook
    const { trigger, isUpdating } = useUpdateBlog();

    // 表单提交处理
    const onSubmit = async (data: UpdateBlogData) => {
        if (!blogId) return;

        // 清空之前的消息
        setSuccessMessage("");
        setErrorMessage("");

        // 调用更新 API
        const result = await trigger({ id: blogId, data });

        if (result?.data) {
            // 更新成功
            setSuccessMessage(`博客 "${result.data.title}" 更新成功！`);

            // 可选：延迟后跳转
            setTimeout(() => {
                router.push("/admin/blog");
            }, 2000);
        } else if (result?.error) {
            // 更新失败
            setErrorMessage(result.error);
        }
    };

    // 加载状态
    if (!blogId || isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">加载中...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 加载错误
    if (fetchError || blogResponse?.error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-900 mb-2">加载失败</h2>
                    <p className="text-red-700">
                        {blogResponse?.error || "无法加载博客数据"}
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        返回
                    </button>
                </div>
            </div>
        );
    }

    const blog = blogResponse?.data;
    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                        博客不存在
                    </h2>
                    <p className="text-yellow-700">找不到该博客</p>
                    <button
                        onClick={() => router.push("/admin/blog")}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        返回列表
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑博客</h1>
                <p className="text-gray-600">编辑博客：{blog.title}</p>
            </div>

            {/* 成功消息 */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-green-600 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                {successMessage}
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                正在跳转到博客列表...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 错误消息 */}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-red-600 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">更新失败</p>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 表单 */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow rounded-lg p-6"
            >
                {/* 标题字段 */}
                <div className="mb-6">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        标题 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.title ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="请输入博客标题"
                        {...register("title", {
                            required: "标题是必需的",
                            maxLength: {
                                value: 200,
                                message: "标题长度不能超过 200 字符",
                            },
                            validate: (value) =>
                                (value?.trim()?.length ?? 0) > 0 || "标题不能为空",
                        })}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                {/* 描述字段 */}
                <div className="mb-6">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        描述 <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                        id="description"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="请输入博客描述"
                        {...register("description")}
                    />
                </div>

                {/* 内容字段 */}
                <div className="mb-6">
                    <label
                        htmlFor="body"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="body"
                        rows={12}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm ${errors.body ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="请输入博客内容（支持 Markdown 格式）"
                        {...register("body", {
                            required: "内容是必需的",
                            validate: (value) =>
                                (value?.trim()?.length ?? 0) > 0 || "内容不能为空",
                        })}
                    />
                    {errors.body && (
                        <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        提示：当前使用简单文本框，后续会集成 ByteMD 编辑器
                    </p>
                </div>

                {/* 封面字段 */}
                <div className="mb-6">
                    <label
                        htmlFor="cover"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        封面图片 URL <span className="text-gray-400">(可选)</span>
                    </label>
                    <input
                        id="cover"
                        type="url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="https://example.com/image.jpg"
                        {...register("cover")}
                    />
                </div>

                {/* 发布状态 */}
                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            {...register("published")}
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            发布（勾选后文章将对外可见）
                        </span>
                    </label>
                </div>

                {/* 按钮组 */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isUpdating ? "保存中..." : "保存更改"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/blog")}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                    >
                        取消
                    </button>

                    <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition inline-flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        预览
                    </a>
                </div>
            </form>
        </div>
    );
}

