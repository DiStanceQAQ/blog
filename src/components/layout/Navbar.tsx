/**
 * 导航栏组件
 * 使用常量配置，支持响应式设计
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_INFO, NAV_MENU } from "@/constants/info";
import { ADMIN_PATHS } from "@/constants/path";
import Search from "@/components/navbar/Search";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const pathname = usePathname();
    // 判断链接是否激活（当前页面）
    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo / 站点名称 */}
                    {/* 逻辑：当搜索展开且处于移动端(hidden md:flex)时，隐藏Logo */}
                    <div className={`flex items-center gap-2 shrink-0`}>
                        <Link
                            href="/"
                            className={`flex items-center gap-2 text-xl font-bold transition-colors ${pathname === "/"
                                ? "text-black dark:text-white"
                                : "text-gray-900 dark:text-white hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {/* Logo - 始终显示 */}
                            <Image
                                src="/logo.svg"
                                alt={SITE_INFO.name}
                                width={32}
                                height={32}
                                className="shrink-0"
                            />
                            {/* 站点名称 - 移动端隐藏，桌面端显示 */}
                            <span className="hidden md:inline">{SITE_INFO.name}</span>
                        </Link>
                    </div>

                    {/* 桌面导航菜单 - 只有桌面端显示，不受搜索影响（因为桌面端空间够） */}
                    <div className="hidden md:flex md:items-center md:gap-8">
                        {NAV_MENU.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`transition-all ${active
                                        ? "font-bold text-black dark:text-white"
                                        : "font-medium text-gray-700 dark:text-gray-300 hover:font-bold hover:text-black dark:hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* 右侧功能区：搜索、主题、后台、移动菜单 */}
                    {/* 逻辑：搜索展开时，这个容器在移动端需要占满宽度 (w-full) */}
                    <div className={`flex items-center gap-2 ${isSearchExpanded ? 'w-full md:w-auto justify-end' : ''}`}>

                        {/* 搜索组件 */}
                        <Search
                            isOpen={isSearchExpanded}
                            setIsOpen={(val) => {
                                setIsSearchExpanded(val);
                                // 如果打开搜索，顺便关闭移动菜单，防止重叠
                                if (val) setIsMobileMenuOpen(false);
                            }}
                        />

                        {/* 逻辑：当搜索展开且处于移动端时，隐藏这些按钮 */}
                        <div className={`flex items-center gap-2 ${isSearchExpanded ? 'hidden md:flex' : 'flex'}`}>
                            {/* 主题切换按钮 */}
                            <ThemeToggle />

                            {/* 后台管理按钮 */}
                            <Link
                                href={ADMIN_PATHS.DASHBOARD}
                                target="_blank"
                                rel="nofollow"
                                title="后台管理"
                                aria-label="后台管理"
                            >
                                <Button variant="ghost" size="icon" aria-label="后台管理">
                                    <UserCog className="size-4" />
                                </Button>
                            </Link>

                            {/* 移动菜单按钮 */}
                            <button
                                type="button"
                                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:font-bold hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="切换移动菜单"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 移动菜单下拉部分 */}
                {isMobileMenuOpen && !isSearchExpanded && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 z-40 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-4">
                                {NAV_MENU.map((item, index) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`transition-all px-2 py-2 rounded-md animate-in  ${active
                                                ? "font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                                                : "font-medium text-gray-700 dark:text-gray-300 hover:font-bold hover:text-black dark:hover:text-white"
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
                    </div>
                )}
            </div>
        </nav>
    );
}