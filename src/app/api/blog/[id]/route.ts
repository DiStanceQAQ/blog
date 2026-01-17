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
async function checkAdminPermission(request: NextRequest): Promise<boolean> {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        if (!session) {
            return false;
        }

        // 从数据库查询用户信息（包含 role 字段）
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        // 检查用户角色是否为管理员
        return user?.role === 'admin';
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

        // 未发布博客仅管理员可访问
        if (!blog.published) {
            const hasPermission = await checkAdminPermission(request);
            if (!hasPermission) {
                return NextResponse.json(
                    { error: '博客不存在' },
                    { status: 404 }
                );
            }
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
 *   categoryId?: string | null (可以传 null 或空字符串来取消分类)
 *   tagIds?: string[] (标签 ID 数组，会替换现有标签)
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
        const hasPermission = await checkAdminPermission(request);
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
        const updateFields = ['title', 'body', 'description', 'cover', 'published', 'categoryId', 'tagIds'];
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

        // 验证 categoryId（如果提供）
        if ('categoryId' in body && body.categoryId !== null && body.categoryId !== '') {
            if (typeof body.categoryId !== 'string') {
                return NextResponse.json(
                    { error: 'categoryId 必须是字符串' },
                    { status: 400 }
                );
            }
            // 检查分类是否存在
            const categoryExists = await prisma.category.findUnique({
                where: { id: body.categoryId },
            });
            if (!categoryExists) {
                return NextResponse.json(
                    { error: '指定的分类不存在' },
                    { status: 400 }
                );
            }
        }

        // 验证 tagIds（如果提供）
        if ('tagIds' in body && body.tagIds !== null) {
            if (!Array.isArray(body.tagIds)) {
                return NextResponse.json(
                    { error: 'tagIds 必须是数组' },
                    { status: 400 }
                );
            }
            if (body.tagIds.length > 0) {
                // 检查所有标签是否存在
                const tags = await prisma.tag.findMany({
                    where: { id: { in: body.tagIds } },
                });
                if (tags.length !== body.tagIds.length) {
                    return NextResponse.json(
                        { error: '部分标签不存在' },
                        { status: 400 }
                    );
                }
            }
        }

        // 准备更新数据
        const updateData: {
            title?: string;
            slug?: string;
            body?: string;
            description?: string;
            cover?: string | null;
            published?: boolean;
            category?: { connect: { id: string } } | { disconnect: true };
            tags?: { set: { id: string }[] };
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

        // 处理 categoryId
        if ('categoryId' in body) {
            if (body.categoryId === null || body.categoryId === '') {
                // 取消关联
                updateData.category = { disconnect: true };
            } else {
                // 设置或更新关联
                updateData.category = { connect: { id: body.categoryId } };
            }
        }

        // 处理 tagIds
        if ('tagIds' in body) {
            if (Array.isArray(body.tagIds)) {
                // 替换所有标签（使用 set 操作）
                updateData.tags = {
                    set: body.tagIds.map((tagId: string) => ({ id: tagId })),
                };
            }
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
        const hasPermission = await checkAdminPermission(request);
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
