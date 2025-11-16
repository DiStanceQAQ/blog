/**
 * T14 - useGetBlogs Hook
 * 使用 SWR 获取博客列表并管理缓存
 */

import useSWR from 'swr';
import { Blog } from '@/app/admin/blog/api';

/**
 * 博客列表响应类型
 */
interface BlogsResponse {
    data: Blog[];
    total: number;
}

/**
 * 查询参数类型
 */
interface GetBlogsParams {
    page?: number;
    pageSize?: number;
}

/**
 * Fetcher 函数
 */
async function fetcher(url: string): Promise<BlogsResponse> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('获取博客列表失败');
    }
    return response.json();
}

/**
 * useGetBlogs Hook
 * 
 * 使用示例：
 * ```ts
 * const { data, error, isLoading, mutate } = useGetBlogs({ page: 1, pageSize: 10 });
 * 
 * if (isLoading) return <div>加载中...</div>;
 * if (error) return <div>加载失败</div>;
 * if (data) {
 *   // 渲染博客列表
 *   data.data.map(blog => ...)
 * }
 * ```
 */
export function useGetBlogs(params?: GetBlogsParams) {
    const { page = 1, pageSize = 10 } = params || {};

    // 构建查询 URL
    const url = `/api/blogs?page=${page}&pageSize=${pageSize}`;

    const { data, error, isLoading, mutate } = useSWR<BlogsResponse>(
        url,
        fetcher,
        {
            // SWR 配置选项
            revalidateOnFocus: false, // 窗口聚焦时不自动重新验证
            revalidateOnReconnect: true, // 网络重连时重新验证
            dedupingInterval: 5000, // 5秒内相同请求去重
        }
    );

    return {
        /**
         * 博客列表数据
         */
        data,

        /**
         * 博客列表（便捷访问）
         */
        blogs: data?.data || [],

        /**
         * 总数
         */
        total: data?.total || 0,

        /**
         * 是否加载中
         */
        isLoading,

        /**
         * 错误信息
         */
        error,

        /**
         * 手动重新验证/刷新数据
         */
        mutate,

        /**
         * 是否有数据
         */
        hasData: !!data,
    };
}

