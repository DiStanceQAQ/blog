"use client";

/**
 * T16 - 搜索组件
 * 提供博客搜索功能
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    /**
     * 处理搜索提交
     */
    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (query.trim()) {
                // 跳转到搜索结果页
                router.push(`/blogs?query=${encodeURIComponent(query.trim())}`);
            }
        },
        [query, router]
    );

    /**
     * 处理按键事件（支持 Enter 搜索，Escape 清空）
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setQuery("");
            setIsExpanded(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="relative">
                <div
                    className={`flex items-center transition-all duration-200 ${isExpanded ? "w-64" : "w-10"
                        }`}
                >
                    {/* 搜索图标按钮 */}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute left-0 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="搜索"
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>

                    {/* 搜索输入框 */}
                    {isExpanded && (
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="搜索博客..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            autoFocus
                        />
                    )}
                </div>

                {/* 提交按钮（隐藏，通过 Enter 触发） */}
                <button type="submit" className="hidden" aria-label="提交搜索" />
            </form>

            {/* 快捷键提示 */}
            {isExpanded && query && (
                <div className="absolute right-0 top-full mt-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                    按 Enter 搜索，Esc 清空
                </div>
            )}
        </div>
    );
}

