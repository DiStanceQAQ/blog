/**
 * T14 - useGetBlog Hook
 * 使用 SWR 获取单个博客并管理缓存
 */

import useSWR from 'swr';
import { Blog } from '@/app/admin/blog/api';

/**
 * 单个博客响应类型
 */
interface BlogResponse {
    data: Blog;
}

/**
 * Fetcher 函数
 */
async function fetcher(url: string): Promise<BlogResponse> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('获取博客详情失败');
    }
    return response.json();
}

/**
 * useGetBlog Hook
 * 
 * 使用示例：
 * ```ts
 * const { data, error, isLoading, mutate } = useGetBlog(blogId);
 * 
 * if (isLoading) return <div>加载中...</div>;
 * if (error) return <div>加载失败</div>;
 * if (data) {
 *   // 渲染博客详情
 *   return <div>{data.data.title}</div>
 * }
 * ```
 */
export function useGetBlog(id?: string) {
    // 只有当 id 存在时才发起请求
    const url = id ? `/api/blog/${id}` : null;

    const { data, error, isLoading, mutate } = useSWR<BlogResponse>(
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
         * 博客数据（包含 data 字段）
         */
        data,

        /**
         * 博客对象（便捷访问）
         */
        blog: data?.data,

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

