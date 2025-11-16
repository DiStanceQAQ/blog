/**
 * T10 - useUpdateBlog Hook
 * 使用 SWR mutation 管理博客更新状态
 */

import useSWRMutation from 'swr/mutation';
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
 *   // 更新成功
 * } else if (result.error) {
 *   // 更新失败
 * }
 * ```
 */
export function useUpdateBlog() {
    const {
        trigger,
        isMutating,
        error,
        data,
    } = useSWRMutation('/api/blog/update', updateBlogFetcher);

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

