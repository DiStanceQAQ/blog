/**
 * 管理后台导航栏组件
 * 包含 Logo、标题、导航菜单、主题切换和用户下拉菜单
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_INFO, ADMIN_NAV_MENU } from "@/constants/info";
import { ADMIN_PATHS } from "@/constants/path";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserDropdown } from "@/components/admin/UserDropdown";

export default function AdminNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // 判断链接是否激活（当前页面）
    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* 左侧：Logo + 标题 + 导航菜单 */}
                    <div className="flex items-center gap-6">
                        {/* Logo + 标题 */}
                        <Link
                            href={ADMIN_PATHS.DASHBOARD}
                            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors shrink-0"
                        >
                            <Image
                                src="/logo.svg"
                                alt={SITE_INFO.name}
                                width={32}
                                height={32}
                                className="shrink-0"
                            />
                            <span className="hidden sm:inline">后台管理</span>
                        </Link>

                        {/* 桌面导航菜单 */}
                        <div className="hidden md:flex md:items-center md:gap-6">
                            {ADMIN_NAV_MENU.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`transition-all px-3 py-2 rounded-md text-sm font-medium ${active
                                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* 右侧：主题切换 + 用户下拉菜单 + 移动菜单按钮 */}
                    <div className="flex items-center gap-2">
                        {/* 主题切换 */}
                        <ThemeToggle />

                        {/* 用户下拉菜单 */}
                        <UserDropdown />

                        {/* 移动菜单按钮 */}
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="切换移动菜单"
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* 移动菜单下拉部分 */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex flex-col gap-2">
                            {ADMIN_NAV_MENU.map((item, index) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`transition-all px-4 py-2 rounded-md text-sm font-medium ${active
                                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
