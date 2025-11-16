/**
 * T07 - 博客管理前端 API Helper
 * 提供博客相关的 API 调用函数
 */

import { request, RequestError } from "@/lib/request";

/**
 * 创建博客的请求数据类型
 */
export interface CreateBlogData {
    title: string;
    body: string;
    description?: string;
    cover?: string;
    published?: boolean;
    categoryId?: string;
    tagIds?: string[];
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
 * 获取单个博客
 * @param id 博客 ID
 * @returns 博客对象
 */
export async function getBlog(id: string): Promise<ApiResponse<Blog>> {
    try {
        const data = await request<Blog>(`/api/blog/${id}`, {
            showErrorToast: true,
        });
        return { data };
    } catch (error) {
        console.error('获取博客失败:', error);
        return {
            error:
                error instanceof RequestError
                    ? error.message
                    : error instanceof Error
                        ? error.message
                        : "网络请求失败",
        };
    }
}

/**
 * 创建博客
 * @param data 博客数据
 * @returns 创建的博客对象
 */
export async function createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
    try {
        const result = await request<Blog>('/api/blogs', {
            method: 'POST',
            body: data,
            showErrorToast: true,
            showSuccessToast: true,
            successMessage: '博客创建成功！',
        });
        return { data: result };
    } catch (error) {
        console.error('创建博客失败:', error);
        return {
            error:
                error instanceof RequestError
                    ? error.message
                    : error instanceof Error
                        ? error.message
                        : "网络请求失败",
        };
    }
}

/**
 * 更新博客的请求数据类型
 */
export interface UpdateBlogData {
    title?: string;
    body?: string;
    description?: string;
    cover?: string;
    published?: boolean;
    categoryId?: string | null;
    tagIds?: string[];
}

/**
 * 更新博客
 * @param id 博客 ID
 * @param data 更新的数据
 * @returns 更新后的博客对象
 */
export async function updateBlog(
    id: string,
    data: UpdateBlogData
): Promise<ApiResponse<Blog>> {
    try {
        const result = await request<Blog>(`/api/blog/${id}`, {
            method: 'PUT',
            body: data,
            showErrorToast: true,
            showSuccessToast: true,
            successMessage: '博客更新成功！',
        });
        return { data: result };
    } catch (error) {
        console.error('更新博客失败:', error);
        return {
            error:
                error instanceof RequestError
                    ? error.message
                    : error instanceof Error
                        ? error.message
                        : "网络请求失败",
        };
    }
}

