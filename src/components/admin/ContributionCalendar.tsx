/**
 * 贡献日历组件
 * 显示最近 52 周的贡献日历
 */

"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { API_PATHS } from "@/constants/path";

/**
 * 贡献数据接口
 */
interface ContributionData {
    date: string; // YYYY-MM-DD
    count: number; // 当天操作次数
}

/**
 * API 响应接口
 */
interface ContributionResponse {
    data: ContributionData[];
    error?: string;
}

/**
 * SWR fetcher
 */
const fetcher = async (url: string): Promise<ContributionData[]> => {
    const res = await fetch(url);
    const data: ContributionResponse = await res.json();
    if (!res.ok || data.error) {
        throw new Error(data.error || "获取贡献日历数据失败");
    }
    return data.data;
};

/**
 * 获取颜色等级（0-4）
 */
function getColorLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
}

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * 贡献日历组件
 */
export default function ContributionCalendar() {
    const { data, error, isLoading } = useSWR<ContributionData[]>(
        API_PATHS.ADMIN_CONTRIBUTION,
        fetcher
    );

    // 重新组织数据为扁平数组（按日期顺序）
    const tiles = useMemo(() => {
        if (!data) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);

        const dateMap = new Map<string, number>();
        data.forEach((item) => {
            dateMap.set(item.date, item.count);
        });

        const tiles: Array<{ date: string; count: number; dateObj: Date }> = [];
        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            if (currentDate > today) break;

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            tiles.push({
                date: dateStr,
                count: dateMap.get(dateStr) || 0,
                dateObj: currentDate,
            });
        }

        return tiles;
    }, [data]);

    // 计算第一个日期是星期几（0=周日, 1=周一...）
    const startDayOfWeek = useMemo(() => {
        if (!data || data.length === 0) return 0;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);
        return startDate.getDay();
    }, [data]);

    // 计算月份标签位置
    const monthLabels = useMemo(() => {
        if (!data || data.length === 0) return [];

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);

        const labels: Array<{ month: string; column: number }> = [];
        let currentMonth = -1;

        for (let week = 0; week < 53; week++) {
            const weekStartDate = new Date(startDate);
            weekStartDate.setDate(startDate.getDate() + week * 7);
            const month = weekStartDate.getMonth();

            if (month !== currentMonth) {
                labels.push({
                    month: weekStartDate.toLocaleDateString("zh-CN", { month: "short" }),
                    column: week + 2, // +2 因为第一列是星期标签
                });
                currentMonth = month;
            }
        }

        // 处理重叠和超出边界的情况
        const filteredLabels = labels.filter((label, index) => {
            if (index > 0 && label.column - labels[index - 1].column < 3) {
                return false; // 与上一个标签太近，隐藏
            }
            if (label.column > 53) {
                return false; // 超出边界
            }
            return true;
        });

        return filteredLabels;
    }, [data]);

    // 颜色方案（亮色模式）
    const lightColors = [
        "#ebedf0", // 0: 无活动
        "#9be9a8", // 1: 1-2 次
        "#40c463", // 2: 3-5 次
        "#30a14e", // 3: 6-10 次
        "#216e39", // 4: 10+ 次
    ];

    // 颜色方案（暗色模式）
    const darkColors = [
        "#161b22", // 0: 无活动
        "#0e4429", // 1: 1-2 次
        "#006d32", // 2: 3-5 次
        "#26a641", // 3: 6-10 次
        "#39d353", // 4: 10+ 次
    ];

    // 加载状态
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">加载贡献日历...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-12">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        加载失败: {error instanceof Error ? error.message : "未知错误"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                贡献日历
            </h2>

            <div>
                <div
                    className="block mx-auto"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto repeat(53, 1fr)',
                        gap: '3px',
                        width: '90%',
                        fontSize: '12px',
                    }}
                >
                    {/* 月份标签 - 第一行 */}
                    {monthLabels.map((label, index) => (
                        <div
                            key={index}
                            className="text-xs text-gray-500 dark:text-gray-400"
                            style={{
                                gridRow: '1 / 2',
                                gridColumn: label.column,
                                marginBottom: '-3px',
                            }}
                        >
                            {label.month}
                        </div>
                    ))}

                    {/* 星期标签 - 第一列 */}
                    <span
                        className="text-xs text-gray-500 dark:text-gray-400"
                        style={{
                            gridColumn: '1 / 2',
                            gridRow: '3',
                            lineHeight: '12px',
                            marginRight: '3px',
                        }}
                    >
                        一
                    </span>
                    <span
                        className="text-xs text-gray-500 dark:text-gray-400"
                        style={{
                            gridColumn: '1 / 2',
                            gridRow: '5',
                            lineHeight: '12px',
                            marginRight: '3px',
                        }}
                    >
                        三
                    </span>
                    <span
                        className="text-xs text-gray-500 dark:text-gray-400"
                        style={{
                            gridColumn: '1 / 2',
                            gridRow: '7',
                            lineHeight: '12px',
                            marginRight: '3px',
                        }}
                    >
                        五
                    </span>

                    {/* 贡献方块 */}
                    {tiles.map((tile, index) => {
                        const colorLevel = getColorLevel(tile.count);
                        const lightColor = lightColors[colorLevel];
                        const darkColor = darkColors[colorLevel];

                        // 计算在网格中的位置
                        const row = (startDayOfWeek + index) % 7 + 2; // +2 因为第一行是月份
                        const column = Math.floor((startDayOfWeek + index) / 7) + 2; // +2 因为第一列是星期

                        return (
                            <div
                                key={index}
                                className="group relative rounded-sm cursor-pointer"
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: lightColor,
                                    gridRow: row,
                                    gridColumn: column,
                                }}
                                data-dark-color={darkColor}
                                title={`${formatDate(tile.date)}: ${tile.count} 次操作`}
                            >
                                {/* 悬停提示 */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className="font-semibold">
                                        {tile.count} 次操作
                                    </div>
                                    <div className="text-gray-300">
                                        {formatDate(tile.date)}
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                </div>
                            </div>
                        );
                    })}

                    {/* 图例 - 最后一行 */}
                    <div
                        className="text-xs text-gray-600 dark:text-gray-400"
                        style={{
                            gridColumn: '2 / 30',
                            gridRow: '9',
                            marginTop: '4px',
                        }}
                    >
                        最近 52 周
                    </div>
                    <div
                        className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
                        style={{
                            gridColumn: '30 / 54',
                            gridRow: '9',
                            marginTop: '4px',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <span>少</span>
                        {lightColors.map((color, index) => (
                            <div
                                key={index}
                                className="rounded-sm"
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: color,
                                }}
                                data-dark-color={darkColors[index]}
                            />
                        ))}
                        <span>多</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
