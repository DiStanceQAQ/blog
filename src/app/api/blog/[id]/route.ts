import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * T08 - 单篇 Blog 的 GET/PUT/DELETE 路由
 * 支持获取、更新和删除单篇博客
 * PUT 和 DELETE 需要管理员权限
 */

/**
 * 生成 URL 友好的 slug
 */
function generateSlug(title: string): string {
    return title
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
 * GET /api/blog/[id]
 * 获取单篇博客
 * 
 * 路径参数：
 * - id: 博客 ID
 * 
 * 返回格式：
 * {
 *   data: Blog
 * }
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 验证 ID 是否存在
        if (!id) {
            return NextResponse.json(
                { error: '缺少博客 ID' },
                { status: 400 }
            );
        }

        // 查询博客
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        // 博客不存在
        if (!blog) {
            return NextResponse.json(
                { error: '博客不存在' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: blog },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/blog/[id] 错误:', error);
        return NextResponse.json(
            { error: '获取博客失败' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/blog/[id]
 * 更新博客
 * 需要管理员权限
 * 
 * 路径参数：
 * - id: 博客 ID
 * 
 * 请求体：
 * {
 *   title?: string
 *   body?: string
 *   description?: string
 *   cover?: string
 *   published?: boolean
 * }
 * 
 * 返回格式：
 * {
 *   data: Blog
 * }
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 权限检查
        const hasPermission = await checkAdminPermission();
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // 验证 ID 是否存在
        if (!id) {
            return NextResponse.json(
                { error: '缺少博客 ID' },
                { status: 400 }
            );
        }

        // 解析请求体
        const body = await request.json();

        // 验证是否有要更新的字段
        const updateFields = ['title', 'body', 'description', 'cover', 'published'];
        const hasUpdateFields = updateFields.some(field => field in body);

        if (!hasUpdateFields) {
            return NextResponse.json(
                { error: '请提供要更新的字段' },
                { status: 400 }
            );
        }

        // 检查博客是否存在
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existingBlog) {
            return NextResponse.json(
                { error: '博客不存在' },
                { status: 404 }
            );
        }

        // 准备更新数据
        const updateData: {
            title?: string;
            slug?: string;
            body?: string;
            description?: string;
            cover?: string | null;
            published?: boolean;
        } = {};

        // 验证并处理 title
        if (body.title !== undefined) {
            if (typeof body.title !== 'string' || body.title.trim().length === 0) {
                return NextResponse.json(
                    { error: 'title 必须是非空字符串' },
                    { status: 400 }
                );
            }

            if (body.title.length > 200) {
                return NextResponse.json(
                    { error: 'title 长度不能超过 200 字符' },
                    { status: 400 }
                );
            }

            const newSlug = generateSlug(body.title);
            if (!newSlug) {
                return NextResponse.json(
                    { error: 'title 无法生成有效的 slug' },
                    { status: 400 }
                );
            }

            // 检查新标题是否与其他博客冲突
            if (body.title !== existingBlog.title) {
                const conflict = await prisma.blog.findFirst({
                    where: {
                        AND: [
                            { id: { not: id } },
                            {
                                OR: [
                                    { title: body.title },
                                    { slug: newSlug },
                                ],
                            },
                        ],
                    },
                });

                if (conflict) {
                    return NextResponse.json(
                        { error: '该标题或 slug 已被其他博客使用' },
                        { status: 409 }
                    );
                }
            }

            updateData.title = body.title.trim();
            updateData.slug = newSlug;
        }

        // 验证并处理 body
        if (body.body !== undefined) {
            if (typeof body.body !== 'string' || body.body.trim().length === 0) {
                return NextResponse.json(
                    { error: 'body 必须是非空字符串' },
                    { status: 400 }
                );
            }
            updateData.body = body.body;
        }

        // 处理 description
        if (body.description !== undefined) {
            if (typeof body.description === 'string') {
                updateData.description = body.description.trim();
            }
        }

        // 处理 cover
        if (body.cover !== undefined) {
            updateData.cover = body.cover || null;
        }

        // 处理 published
        if (body.published !== undefined) {
            updateData.published = body.published === true;
        }

        // 更新博客
        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        return NextResponse.json(
            { data: updatedBlog },
            { status: 200 }
        );
    } catch (error) {
        console.error('PUT /api/blog/[id] 错误:', error);

        // 处理 Prisma 特定错误
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    { error: 'title 或 slug 已存在' },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: '更新博客失败' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/blog/[id]
 * 删除博客
 * 需要管理员权限
 * 
 * 路径参数：
 * - id: 博客 ID
 * 
 * 返回格式：
 * {
 *   message: string
 * }
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 权限检查
        const hasPermission = await checkAdminPermission();
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // 验证 ID 是否存在
        if (!id) {
            return NextResponse.json(
                { error: '缺少博客 ID' },
                { status: 400 }
            );
        }

        // 检查博客是否存在
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existingBlog) {
            return NextResponse.json(
                { error: '博客不存在' },
                { status: 404 }
            );
        }

        // 删除博客
        await prisma.blog.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: `博客 "${existingBlog.title}" 已成功删除` },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/blog/[id] 错误:', error);
        return NextResponse.json(
            { error: '删除博客失败' },
            { status: 500 }
        );
    }
}

