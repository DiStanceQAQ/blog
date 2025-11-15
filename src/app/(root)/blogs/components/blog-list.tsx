import { Blog, Category, Tag } from "@prisma/client";
import { BlogListItem } from "./blog-list-item";

// 定义博客类型（包含关联的分类和标签）
type BlogWithRelations = Blog & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
  tags: Pick<Tag, "id" | "name" | "slug" | "icon">[];
};

interface BlogListProps {
  blogs: BlogWithRelations[];
}

/**
 * 博客列表组件
 * 客户端组件，用于渲染博客列表
 */
export function BlogList({ blogs }: BlogListProps) {
  // 如果没有博客，显示空状态
  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          暂无博客文章
        </p>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          敬请期待精彩内容...
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8">
      {blogs.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
