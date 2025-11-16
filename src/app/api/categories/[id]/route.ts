import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * T11 - Category [id] API
 * GET: 获取单个分类
 * PUT: 更新分类（需要管理员权限）
 * DELETE: 删除分类（需要管理员权限）
 */

/**
 * 生成 URL 友好的 slug
 */
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * 检查是否有管理员权限
 */
async function checkAdminPermission(): Promise<boolean> {
    try {
        const session = await auth.api.getSession();
        if (!session) {
            return false;
        }
        return session.user.role === 'admin';
    } catch (error) {
        console.error('权限检查失败:', error);
        return false;
    }
}

/**
 * GET /api/categories/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: '分类不存在' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: category },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/categories/[id] 错误:', error);
        return NextResponse.json(
            { error: '获取分类失败' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/categories/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const hasPermission = await checkAdminPermission();
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        if (!body.name || typeof body.name !== 'string') {
            return NextResponse.json(
                { error: 'name 字段是必需的' },
                { status: 400 }
            );
        }

        const existing = await prisma.category.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: '分类不存在' },
                { status: 404 }
            );
        }

        const newSlug = generateSlug(body.name);
        if (!newSlug) {
            return NextResponse.json(
                { error: 'name 无法生成有效的 slug' },
                { status: 400 }
            );
        }

        // 检查新名称是否与其他分类冲突
        if (body.name !== existing.name) {
            const conflict = await prisma.category.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                { name: body.name },
                                { slug: newSlug },
                            ],
                        },
                    ],
                },
            });

            if (conflict) {
                return NextResponse.json(
                    { error: '该分类名称或 slug 已被使用' },
                    { status: 409 }
                );
            }
        }

        const updated = await prisma.category.update({
            where: { id },
            data: {
                name: body.name.trim(),
                slug: newSlug,
            },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });

        return NextResponse.json(
            { data: updated },
            { status: 200 }
        );
    } catch (error) {
        console.error('PUT /api/categories/[id] 错误:', error);
        return NextResponse.json(
            { error: '更新分类失败' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/categories/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const hasPermission = await checkAdminPermission();
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const existing = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: '分类不存在' },
                { status: 404 }
            );
        }

        // 检查是否有关联的博客
        if (existing._count.blogs > 0) {
            return NextResponse.json(
                { error: `该分类下有 ${existing._count.blogs} 篇博客，无法删除` },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: `分类 "${existing.name}" 已成功删除` },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/categories/[id] 错误:', error);
        return NextResponse.json(
            { error: '删除分类失败' },
            { status: 500 }
        );
    }
}

