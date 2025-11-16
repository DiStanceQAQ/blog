/**
 * T10 - useUpdateBlog Hook
 * 使用 SWR mutation 管理博客更新状态
 * T14 - 添加自动缓存更新功能
 */

import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { updateBlog, UpdateBlogData, Blog, ApiResponse } from '@/app/admin/blog/api';

/**
 * 更新博客的参数类型
 */
interface UpdateBlogArgs {
    id: string;
    data: UpdateBlogData;
}

/**
 * 更新博客的 fetcher 函数
 */
async function updateBlogFetcher(
    _key: string,
    { arg }: { arg: UpdateBlogArgs }
): Promise<ApiResponse<Blog>> {
    return updateBlog(arg.id, arg.data);
}

/**
 * useUpdateBlog Hook
 * 
 * 使用示例：
 * ```ts
 * const { trigger, isUpdating, error, data } = useUpdateBlog();
 * 
 * // 提交表单时调用
 * const result = await trigger({ id: blogId, data: { title, body, ... } });
 * if (result.data) {
 *   // 更新成功，相关缓存会自动刷新
 * } else if (result.error) {
 *   // 更新失败
 * }
 * ```
 */
export function useUpdateBlog() {
    const {
        trigger: originalTrigger,
        isMutating,
        error,
        data,
    } = useSWRMutation('/api/blog/update', updateBlogFetcher);

    /**
     * 增强的 trigger 函数，更新成功后自动刷新相关缓存
     */
    const trigger = async (args: UpdateBlogArgs) => {
        const result = await originalTrigger(args);

        // 如果更新成功，刷新相关缓存
        if (result?.data) {
            // 刷新该博客的详情缓存
            mutate(`/api/blog/${args.id}`);

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
         * 触发更新博客请求
         * @param args 包含博客 ID 和更新数据
         * @returns API 响应
         */
        trigger,

        /**
         * 是否正在更新中
         */
        isUpdating: isMutating,

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

