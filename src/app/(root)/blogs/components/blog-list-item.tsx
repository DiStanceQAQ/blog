import Link from "next/link";
import Image from "next/image";
import { Blog, Category, Tag } from "@prisma/client";

// 定义博客类型（包含关联的分类和标签）
type BlogWithRelations = Blog & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
  tags: Pick<Tag, "id" | "name" | "slug" | "icon">[];
};

interface BlogListItemProps {
  blog: BlogWithRelations;
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * 博客列表项组件
 * 显示单个博客的卡片
 */
export function BlogListItem({ blog }: BlogListItemProps) {
  return (
    <article className="group relative flex flex-col space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* 标题 */}
      <h3 className="text-2xl font-semibold leading-tight">
        <Link
          href={`/blog/${blog.slug}`}
          className="hover:underline hover:decoration-2"
        >
          {blog.title}
        </Link>
      </h3>

      {/* 描述/摘要 */}
      <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
        {blog.description}
      </p>

      {/* 元信息：日期、分类、标签 */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-gray-500 dark:text-gray-500">
        {/* 发布时间 */}
        <time dateTime={blog.createdAt.toISOString()}>
          {formatDate(blog.createdAt)}
        </time>

        {/* 分类 */}
        {blog.category && (
          <>
            <span>·</span>
            <Link
              href={`/category/${blog.category.slug}`}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              {blog.category.name}
            </Link>
          </>
        )}

        {/* 标签 */}
        {blog.tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {tag.icon && <span className="mr-1">{tag.icon}</span>}
                  {tag.name}
                </Link>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{blog.tags.length - 3}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* 封面图（如果有） */}
      {blog.cover && (
        <div className="relative mt-4 h-48 w-full overflow-hidden rounded-md">
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* 阅读更多链接 */}
      <div className="pt-2">
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          阅读全文
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
