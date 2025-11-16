/**
 * T07 - 博客管理前端 API Helper
 * 提供博客相关的 API 调用函数
 */

/**
 * 创建博客的请求数据类型
 */
export interface CreateBlogData {
    title: string;
    body: string;
    description?: string;
    cover?: string;
    published?: boolean;
}

/**
 * 博客数据类型
 */
export interface Blog {
    id: string;
    title: string;
    slug: string;
    description: string;
    body: string;
    cover: string | null;
    published: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    tags?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

/**
 * API 响应类型
 */
export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

/**
 * 创建博客
 * @param data 博客数据
 * @returns 创建的博客对象
 */
export async function createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
    try {
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.error || `请求失败 (${response.status})`,
            };
        }

        return {
            data: result.data,
        };
    } catch (error) {
        console.error('创建博客失败:', error);
        return {
            error: error instanceof Error ? error.message : '网络请求失败',
        };
    }
}

