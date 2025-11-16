/**
 * T07 - useCreateBlog Hook
 * 使用 SWR mutation 管理博客创建状态
 */

import useSWRMutation from 'swr/mutation';
import { createBlog, CreateBlogData, Blog, ApiResponse } from '@/app/admin/blog/api';

/**
 * 创建博客的 fetcher 函数
 * SWR mutation 需要这样的签名：(key, { arg }) => Promise
 */
async function createBlogFetcher(
    _key: string,
    { arg }: { arg: CreateBlogData }
): Promise<ApiResponse<Blog>> {
    return createBlog(arg);
}

/**
 * useCreateBlog Hook
 * 
 * 使用示例：
 * ```ts
 * const { trigger, isMutating, error, data } = useCreateBlog();
 * 
 * // 提交表单时调用
 * const result = await trigger({ title, body, ... });
 * if (result.data) {
 *   // 创建成功
 * } else if (result.error) {
 *   // 创建失败
 * }
 * ```
 */
export function useCreateBlog() {
    const {
        trigger,
        isMutating,
        error,
        data,
    } = useSWRMutation('/api/blogs', createBlogFetcher);

    return {
        /**
         * 触发创建博客请求
         * @param data 博客数据
         * @returns API 响应
         */
        trigger,

        /**
         * 是否正在创建中
         */
        isCreating: isMutating,

        /**
         * 请求错误（如果有）
         */
        error,

        /**
         * 响应数据（如果有）
         */
        data,
    };
}

