import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * T04 - 基本 API 路由：博客列表（GET）与创建（POST）
 */

/**
 * 生成 URL 友好的 slug
 * 例如："我的博客" -> "wo-de-bo-ke"
 */
function generateSlug(title: string): string {
    // 简单实现：转小写、替换空格为连字符、移除特殊字符
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // 空格转为连字符
        .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留字母、数字、中文、连字符
        .replace(/--+/g, '-')           // 多个连字符合并为一个
        .replace(/^-+|-+$/g, '');       // 移除首尾连字符
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
 * GET /api/blogs
 * 获取博客列表，支持分页和搜索
 * 
 * 查询参数：
 * - page: 页码（从 1 开始，默认 1）
 * - pageSize: 每页数量（默认 10）
 * - query: 搜索关键词（可选，搜索 title、description、body）
 * 
 * 返回格式：
 * {
 *   data: Blog[],
 *   total: number
 * }
 */
export async function GET(request: NextRequest) {
    try {
        // 解析查询参数
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const query = (searchParams.get('query') || '').trim();

        // 验证参数合法性
        if (page < 1 || pageSize < 1 || pageSize > 100) {
            return NextResponse.json(
                { error: 'page 必须 >= 1，pageSize 必须在 1-100 之间' },
                { status: 400 }
            );
        }

        // 计算跳过的记录数
        const skip = (page - 1) * pageSize;

        // 非管理员默认只返回已发布内容
        const isAdmin = await checkAdminPermission(request);

        // 构建搜索条件
        const whereCondition = {
            ...(isAdmin ? {} : { published: true }),
            ...(query
                ? {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' as const } },
                        { description: { contains: query, mode: 'insensitive' as const } },
                        { body: { contains: query, mode: 'insensitive' as const } },
                    ],
                }
                : {}),
        };

        // 并行查询数据和总数
        const [data, total] = await Promise.all([
            prisma.blog.findMany({
                where: whereCondition,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }, // 最新的博客在前
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    cover: true,
                    published: true,
                    createdAt: true,
                    updatedAt: true,
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
            }),
            prisma.blog.count({ where: whereCondition }),
        ]);

        return NextResponse.json(
            { data, total },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/blogs 错误:', error);
        return NextResponse.json(
            { error: '获取博客列表失败' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/blogs
 * 创建新博客
 * 
 * 请求体：
 * {
 *   title: string (必需)
 *   body: string (必需)
 *   description?: string (可选，默认为 title)
 *   cover?: string (可选)
 *   published?: boolean (可选，默认 false)
 *   categoryId?: string (可选，分类 ID)
 *   tagIds?: string[] (可选，标签 ID 数组)
 * }
 * 
 * 返回格式：
 * {
 *   data: Blog
 * }
 */
export async function POST(request: NextRequest) {
    try {
        // 权限检查
        const hasPermission = await checkAdminPermission(request);
        if (!hasPermission) {
            return NextResponse.json(
                { error: '无权限执行此操作，需要管理员权限' },
                { status: 401 }
            );
        }

        // 解析请求体
        const body = await request.json();

        // 验证必需字段
        if (!body.title || typeof body.title !== 'string') {
            return NextResponse.json(
                { error: 'title 字段是必需的，且必须是字符串' },
                { status: 400 }
            );
        }

        if (!body.body || typeof body.body !== 'string') {
            return NextResponse.json(
                { error: 'body 字段是必需的，且必须是字符串' },
                { status: 400 }
            );
        }

        // 验证 title 长度
        if (body.title.trim().length === 0) {
            return NextResponse.json(
                { error: 'title 不能为空' },
                { status: 400 }
            );
        }

        if (body.title.length > 200) {
            return NextResponse.json(
                { error: 'title 长度不能超过 200 字符' },
                { status: 400 }
            );
        }

        // 验证 categoryId（如果提供）
        if (body.categoryId !== undefined && body.categoryId !== null && body.categoryId !== '') {
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
        if (body.tagIds !== undefined && body.tagIds !== null) {
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

        // 生成 slug
        const slug = generateSlug(body.title);

        if (!slug) {
            return NextResponse.json(
                { error: 'title 无法生成有效的 slug' },
                { status: 400 }
            );
        }

        // 检查 title 和 slug 是否已存在
        const existing = await prisma.blog.findFirst({
            where: {
                OR: [
                    { title: body.title },
                    { slug: slug },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: '该标题或 slug 已存在，请使用不同的标题' },
                { status: 409 }
            );
        }

        // 准备创建数据
        const createData: {
            title: string;
            slug: string;
            description: string;
            body: string;
            cover: string | null;
            published: boolean;
            category?: { connect: { id: string } };
            tags?: { connect: { id: string }[] };
        } = {
            title: body.title.trim(),
            slug,
            description: body.description?.trim() || body.title.trim(),
            body: body.body,
            cover: body.cover || null,
            published: body.published === true,
        };

        // 关联分类
        if (body.categoryId && body.categoryId !== '') {
            createData.category = { connect: { id: body.categoryId } };
        }

        // 关联标签
        if (body.tagIds && Array.isArray(body.tagIds) && body.tagIds.length > 0) {
            createData.tags = {
                connect: body.tagIds.map((id: string) => ({ id })),
            };
        }

        // 创建博客
        const blog = await prisma.blog.create({
            data: createData,
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
            { data: blog },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/blogs 错误:', error);

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
            { error: '创建博客失败' },
            { status: 500 }
        );
    }
}
