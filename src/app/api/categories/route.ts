import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * T11 - Categories API
 * GET: 获取所有分类
 * POST: 创建新分类（需要管理员权限）
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
 * GET /api/categories
 * 获取所有分类
 */
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });

        return NextResponse.json(
            { data: categories },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/categories 错误:', error);
        return NextResponse.json(
            { error: '获取分类列表失败' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/categories
 * 创建新分类（需要管理员权限）
 * 
 * 请求体：
 * {
 *   name: string (必需)
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

        const body = await request.json();

        // 验证必需字段
        if (!body.name || typeof body.name !== 'string') {
            return NextResponse.json(
                { error: 'name 字段是必需的，且必须是字符串' },
                { status: 400 }
            );
        }

        if (body.name.trim().length === 0) {
            return NextResponse.json(
                { error: 'name 不能为空' },
                { status: 400 }
            );
        }

        // 生成 slug
        const slug = generateSlug(body.name);
        if (!slug) {
            return NextResponse.json(
                { error: 'name 无法生成有效的 slug' },
                { status: 400 }
            );
        }

        // 检查是否已存在
        const existing = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: body.name },
                    { slug: slug },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: '该分类名称或 slug 已存在' },
                { status: 409 }
            );
        }

        // 创建分类
        const category = await prisma.category.create({
            data: {
                name: body.name.trim(),
                slug,
            },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
        });

        return NextResponse.json(
            { data: category },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/categories 错误:', error);

        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    { error: '分类名称或 slug 已存在' },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: '创建分类失败' },
            { status: 500 }
        );
    }
}

