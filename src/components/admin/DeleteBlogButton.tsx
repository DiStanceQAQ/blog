"use client";

import { useState } from "react";
import { useDeleteBlog } from "@/hooks/useDeleteBlog";
import { useRouter } from "next/navigation";

interface DeleteBlogButtonProps {
    blogId: string;
    blogTitle: string;
}

export function DeleteBlogButton({ blogId }: DeleteBlogButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const { trigger: deleteBlog, isDeleting } = useDeleteBlog();
    const router = useRouter();

    const handleDelete = async () => {
        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        const result = await deleteBlog(blogId);

        if (result?.data) {
            // 删除成功，刷新页面
            router.refresh();
        } else {
            // 删除失败，取消确认状态
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        setIsConfirming(false);
    };

    if (isConfirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-600">确认删除？</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                >
                    是
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                    否
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="删除"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
            删除
        </button>
    );
}