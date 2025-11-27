/**
 * T11 - useDeleteBlog Hook
 * 使用 SWR mutation 管理博客删除状态
 * T14 - 添加自动缓存更新功能
 */

import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { deleteBlog, ApiResponse } from '@/app/admin/blog/api';

/**
 * 删除博客的 fetcher 函数
 */
async function deleteBlogFetcher(
    _key: string,
    { arg }: { arg: string }
): Promise<ApiResponse<{ message: string }>> {
    return deleteBlog(arg);
}

/**
 * useDeleteBlog Hook
 * 
 * 使用示例：
 *
 * const { trigger, isDeleting, error, data } = useDeleteBlog();
 * 
 * // 删除博客时调用
 * const result = await trigger(blogId);
 * if (result.data) {
 *   // 删除成功，列表会自动刷新
 * } else if (result.error) {
 *   // 删除失败
 * }
 *  */
export function useDeleteBlog() {
    const {
        trigger: originalTrigger,
        isMutating,
        error,
        data,
    } = useSWRMutation('/api/blog/delete', deleteBlogFetcher);

    /**
     * 增强的 trigger 函数，删除成功后自动刷新列表缓存
     */
    const trigger = async (id: string) => {
        const result = await originalTrigger(id);

        // 如果删除成功，刷新所有博客列表缓存
        if (result?.data) {
            // 刷新该博客的详情缓存（虽然已删除，但清除缓存）
            mutate(`/api/blog/${id}`, undefined, { revalidate: false });

            // 刷新所有博客列表缓存
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
         * 触发删除博客请求
         * @param id 博客 ID
         * @returns API 响应
         */
        trigger,

        /**
         * 是否正在删除中
         */
        isDeleting: isMutating,

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