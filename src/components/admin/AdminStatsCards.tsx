/**
 * 管理后台统计卡片组件
 * 显示博客、分类、标签的总数统计
 * 服务端组件，直接查询数据库
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ADMIN_PATHS } from "@/constants/path";
import { FileText, FolderTree, Tag } from "lucide-react";

/**
 * 统计数据接口
 */
interface StatsData {
    blogCount: number;
    categoryCount: number;
    tagCount: number;
}

/**
 * 获取统计数据
 */
async function getStats(): Promise<StatsData> {
    try {
        // 并行查询所有统计数据，提高性能
        const [blogCount, categoryCount, tagCount] = await Promise.all([
            prisma.blog.count(),
            prisma.category.count(),
            prisma.tag.count(),
        ]);

        return {
            blogCount,
            categoryCount,
            tagCount,
        };
    } catch (error) {
        console.error("获取统计数据失败:", error);
        // 出错时返回 0
        return {
            blogCount: 0,
            categoryCount: 0,
            tagCount: 0,
        };
    }
}

/**
 * 统计卡片配置
 */
const statsConfig = [
    {
        title: "博客总数",
        count: 0, // 将在组件中填充
        href: ADMIN_PATHS.BLOG_LIST,
        icon: FileText,
        color: "blue",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
        title: "分类总数",
        count: 0,
        href: ADMIN_PATHS.CATEGORY_LIST,
        icon: FolderTree,
        color: "green",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
    },
    {
        title: "标签总数",
        count: 0,
        href: ADMIN_PATHS.TAG_LIST,
        icon: Tag,
        color: "purple",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        borderColor: "border-purple-200 dark:border-purple-800",
    },
] as const;

/**
 * 统计卡片组件
 */
export default async function AdminStatsCards() {
    const stats = await getStats();

    // 将统计数据填充到配置中
    const cards = statsConfig.map((config, index) => {
        const counts = [stats.blogCount, stats.categoryCount, stats.tagCount];
        return {
            ...config,
            count: counts[index],
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:-translate-y-1"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {/* 标题 */}
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    {card.title}
                                </p>
                                {/* 数字 */}
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {card.count.toLocaleString()}
                                </p>
                            </div>
                            {/* 图标 */}
                            <div
                                className={`${card.bgColor} ${card.borderColor} p-3 rounded-lg border`}
                            >
                                <Icon
                                    className={`h-6 w-6 ${card.iconColor}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        {/* 悬停提示 */}
                        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                            <span>查看详情</span>
                            <svg
                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}