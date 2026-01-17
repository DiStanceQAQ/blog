/**
 * 贡献日历数据 API
 * 统计最近 52 周（364 天）每天的操作次数
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * 检查管理员权限
 */
async function checkAdminPermission(request: NextRequest): Promise<boolean> {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        if (!session) {
            return false;
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        return user?.role === 'admin';
    } catch (error) {
        console.error('权限检查失败:', error);
        return false;
    }
}

/**
 * GET /api/admin/contribution
 * 获取贡献日历数据
 * 
 * 返回格式：
 * {
 *   data: Array<{
 *     date: string, // YYYY-MM-DD
 *     count: number // 当天操作次数
 *   }>
 * }
 */
export async function GET(request: NextRequest) {
    try {
        // 权限检查
        const hasPermission = await checkAdminPermission(request);
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        // 计算日期范围：最近 52 周（364 天）
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // 364 天前

        // 并行查询所有操作数据
        const [blogsCreated, blogsUpdated, categoriesCreated, tagsCreated] = await Promise.all([
            // 博客创建
            prisma.blog.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: today,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
            // 博客更新
            prisma.blog.findMany({
                where: {
                    updatedAt: {
                        gte: startDate,
                        lte: today,
                    },
                },
                select: {
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            // 分类创建
            prisma.category.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: today,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
            // 标签创建
            prisma.tag.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: today,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
        ]);

        // 合并所有操作日期
        const allDates: Date[] = [];

        // 博客创建
        blogsCreated.forEach(blog => {
            allDates.push(new Date(blog.createdAt));
        });

        // 博客更新（排除同一天的创建，避免重复计算）
        blogsUpdated.forEach(blog => {
            const updateDate = new Date(blog.updatedAt);
            const createDate = new Date(blog.createdAt);
            // 如果更新日期和创建日期不是同一天，才计入
            if (updateDate.toDateString() !== createDate.toDateString()) {
                allDates.push(updateDate);
            }
        });

        // 分类创建
        categoriesCreated.forEach(category => {
            allDates.push(new Date(category.createdAt));
        });

        // 标签创建
        tagsCreated.forEach(tag => {
            allDates.push(new Date(tag.createdAt));
        });

        // 按日期统计操作次数
        const dateCountMap = new Map<string, number>();

        // 初始化所有日期为 0
        for (let i = 0; i < 365; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;// YYYY-MM-DD
            dateCountMap.set(dateStr, 0);
        }

        // 统计每天的操作次数
        allDates.forEach(date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;// YYYY-MM-DD
            const currentCount = dateCountMap.get(dateStr) || 0;
            dateCountMap.set(dateStr, currentCount + 1);
        });

        // 转换为数组格式
        const data = Array.from(dateCountMap.entries())
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date)); // 按日期排序

        return NextResponse.json(
            { data },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/admin/contribution 错误:', error);
        return NextResponse.json(
            { error: '获取贡献日历数据失败' },
            { status: 500 }
        );
    }
}
