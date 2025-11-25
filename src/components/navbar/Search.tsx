"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export default function Search({ isOpen, setIsOpen }: SearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // 稍微延迟聚焦，等待动画开始
            setTimeout(() => inputRef.current?.focus(), 50);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (query.trim()) {
                router.push(`/blogs?query=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
            }
        },
        [query, router, setIsOpen]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setQuery("");
            setIsOpen(false);
        }
    };

    return (
        <div
            ref={searchContainerRef}
            // 1. 移动端(默认): 展开时 absolute inset-0 覆盖整个导航条，且 z-index 最高
            // 2. 桌面端(md): 保持 relative，宽度从 w-10 变 w-64
            className={`
                flex items-center 
                md:transition-all md:duration-300 md:ease-in-out
                bg-white dark:bg-gray-900 
                ${isOpen
                    ? "absolute inset-0 z-50 px-4 w-full md:static md:inset-auto md:px-0 md:w-64"
                    : "relative w-10"
                }
            `}
        >
            <form onSubmit={handleSearch} className="relative w-full flex items-center h-full">
                {/* 搜索图标按钮 */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        z-10 p-2 transition-colors duration-300
                        ${isOpen ? "text-primary absolute left-0" : "text-gray-600 hover:text-primary absolute left-0"}
                    `}
                    aria-label="搜索"
                >
                    <svg
                        className="h-6 w-6"
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
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="搜索博客..."
                    className={`
                        bg-transparent rounded-lg
                        focus:outline-none 
                        transition-all duration-300 ease-in-out
                        h-10
                        ${isOpen
                            ? "w-full pl-10 pr-4 border border-gray-300 dark:border-gray-700 opacity-100"
                            : "w-0 p-0 border-none opacity-0"
                        }
                    `}
                />
            </form>
        </div>
    );
}