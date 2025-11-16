"use client";

/**
 * T07 - 博客创建页面
 * 使用 react-hook-form 管理表单，使用 SWR mutation 提交数据
 * T12 - 添加分类和标签选择
 */

import { useForm } from "react-hook-form";
import { useCreateBlog } from "@/hooks/useCreateBlog";
import { CreateBlogData } from "@/app/admin/blog/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// 定义分类和标签类型
interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Tag {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
}

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateBlogPage() {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 获取分类列表
    const { data: categoriesData } = useSWR<{ data: Category[] }>("/api/categories", fetcher);
    const categories = categoriesData?.data || [];

    // 获取标签列表
    const { data: tagsData } = useSWR<{ data: Tag[] }>("/api/tags", fetcher);
    const tags = tagsData?.data || [];

    // 初始化表单
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<CreateBlogData & { categoryId?: string; tagIds?: string[] }>({
        defaultValues: {
            title: "",
            body: "",
            description: "",
            cover: "",
            published: false,
            categoryId: "",
        },
    });

    // 初始化 SWR mutation
    const { trigger, isCreating } = useCreateBlog();

    // 标签复选框处理
    const handleTagToggle = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    // 表单提交处理
    const onSubmit = async (data: CreateBlogData & { categoryId?: string }) => {
        // 清空之前的消息
        setSuccessMessage("");
        setErrorMessage("");

        // 准备提交数据
        const submitData: CreateBlogData & { categoryId?: string; tagIds?: string[] } = {
            ...data,
            categoryId: data.categoryId && data.categoryId !== "" ? data.categoryId : undefined,
            tagIds: selectedTags.length > 0 ? selectedTags : undefined,
        };

        // 调用 API 创建博客
        const result = await trigger(submitData);

        if (result?.data) {
            // 创建成功
            setSuccessMessage(`博客 "${result.data.title}" 创建成功！ID: ${result.data.id}`);

            // 重置表单
            reset();
            setSelectedTags([]);

            // 可选：3 秒后跳转到博客列表或详情页
            setTimeout(() => {
                router.push("/admin");
            }, 2000);
        } else if (result?.error) {
            // 创建失败
            setErrorMessage(result.error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新博客</h1>
                <p className="text-gray-600">填写下面的表单来创建一篇新的博客文章</p>
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
                            <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            <p className="text-sm text-green-700 mt-1">正在跳转到管理后台...</p>
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
                            <p className="text-sm font-medium text-red-800">创建失败</p>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
                {/* 标题字段 */}
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
                            validate: (value) => value.trim().length > 0 || "标题不能为空",
                        })}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                {/* 描述字段 */}
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        描述 <span className="text-gray-400">(可选，默认使用标题)</span>
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
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
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
                            validate: (value) => value.trim().length > 0 || "内容不能为空",
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
                    <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
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

                {/* 分类选择 */}
                <div className="mb-6">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                        分类 <span className="text-gray-400">(可选)</span>
                    </label>
                    <select
                        id="categoryId"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        {...register("categoryId")}
                    >
                        <option value="">-- 不选择分类 --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 标签选择 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        标签 <span className="text-gray-400">(可选，可多选)</span>
                    </label>
                    {tags.length === 0 ? (
                        <p className="text-sm text-gray-500">暂无标签，请先创建标签</p>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {tags.map((tag) => (
                                    <label
                                        key={tag.id}
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(tag.id)}
                                            onChange={() => handleTagToggle(tag.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {tag.icon && <span className="mr-1">{tag.icon}</span>}
                                            {tag.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTags.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                            已选择 {selectedTags.length} 个标签
                        </p>
                    )}
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
                            立即发布（勾选后文章将对外可见）
                        </span>
                    </label>
                </div>

                {/* 按钮组 */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isCreating ? "创建中..." : "创建博客"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                    >
                        取消
                    </button>
                </div>
            </form>
        </div>
    );
}

