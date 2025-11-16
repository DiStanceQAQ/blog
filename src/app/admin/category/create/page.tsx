"use client";

/**
 * T11 - 创建分类页面
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface CreateCategoryData {
    name: string;
}

export default function CreateCategoryPage() {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateCategoryData>();

    const onSubmit = async (data: CreateCategoryData) => {
        setSuccessMessage("");
        setErrorMessage("");
        setIsCreating(true);

        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.data) {
                setSuccessMessage(`分类 "${result.data.name}" 创建成功！`);
                reset();

                setTimeout(() => {
                    router.push("/admin/category");
                }, 1500);
            } else {
                setErrorMessage(result.error || "创建失败");
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "网络请求失败"
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">创建分类</h1>
                <p className="text-gray-600">添加一个新的博客分类</p>
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
                                正在跳转到分类列表...
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
                            <p className="text-sm font-medium text-red-800">创建失败</p>
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
                <div className="mb-6">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        分类名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="例如：技术、生活、旅行"
                        {...register("name", {
                            required: "分类名称是必需的",
                            validate: (value) =>
                                (value?.trim()?.length ?? 0) > 0 || "分类名称不能为空",
                        })}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        Slug 将自动根据名称生成
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isCreating ? "创建中..." : "创建分类"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/category")}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                    >
                        取消
                    </button>
                </div>
            </form>
        </div>
    );
}

