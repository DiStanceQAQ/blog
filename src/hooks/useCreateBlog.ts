/**
 * T07 - useCreateBlog Hook
 * 使用 SWR mutation 管理博客创建状态
 * T14 - 添加自动缓存更新功能
 */

import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
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
 *   // 创建成功，列表会自动刷新
 * } else if (result.error) {
 *   // 创建失败
 * }
 * ```
 */
export function useCreateBlog() {
    const {
        trigger: originalTrigger,
        isMutating,
        error,
        data,
    } = useSWRMutation('/api/blogs', createBlogFetcher);

    /**
     * 增强的 trigger 函数，创建成功后自动刷新列表缓存
     */
    const trigger = async (blogData: CreateBlogData) => {
        const result = await originalTrigger(blogData);

        // 如果创建成功，刷新所有博客列表缓存
        if (result?.data) {
            // 使用通配符匹配所有分页的博客列表
            mutate(
                (key) => typeof key === 'string' && key.startsWith('/api/blogs'),
                undefined,
                { revalidate: true }
            );
        }

        return result;
    };

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

