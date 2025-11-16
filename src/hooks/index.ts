/**
 * T14 - SWR Hooks 统一导出
 * 提供所有博客相关的 SWR hooks
 */

// 查询 hooks
export { useGetBlogs } from './useGetBlogs';
export { useGetBlog } from './useGetBlog';

// 变更 hooks
export { useCreateBlog } from './useCreateBlog';
export { useUpdateBlog } from './useUpdateBlog';

// 类型导出（便于使用）
export type { Blog, CreateBlogData, UpdateBlogData, ApiResponse } from '@/app/admin/blog/api';

