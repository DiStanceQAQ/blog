/**
 * 用户下拉菜单组件
 * 显示用户信息并提供退出登录功能
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, Mail } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: session, isPending } = useSession();
    const router = useRouter();

    // 点击外部关闭下拉菜单
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // 处理退出登录
    const handleLogout = async () => {
        try {
            await signOut();
            setIsOpen(false);
            // 登出后重定向到首页或登录页
            router.push("/");
        } catch (error) {
            console.error("退出登录失败:", error);
        }
    };

    // 如果 session 还在加载中，显示加载状态
    if (isPending) {
        return (
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        );
    }

    // 如果没有 session，不显示组件
    if (!session?.user) {
        return null;
    }

    const user = session.user;
    const displayName = user.name || user.email?.split("@")[0] || "用户";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 用户头像/图标按钮 */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
                aria-label="用户菜单"
                aria-expanded={isOpen}
            >
                {/* 用户头像 */}
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {initials}
                    </div>
                )}
                {/* 下拉箭头 */}
                <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* 用户信息 */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={displayName}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium">
                                    {initials}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {displayName}
                                </p>
                                {user.email && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 菜单项 */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>退出登录</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}