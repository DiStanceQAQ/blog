// src/app/(root)/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SITE_INFO } from "@/constants/info";
import { PATHS } from "@/constants/path";

export default async function Home() {
    // 获取最新博客
    const recentBlogs = await prisma.blog.findMany({
        where: { published: true },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            tags: true,
        },
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <h1 className="text-5xl font-bold mb-6">
                        欢迎来到 {SITE_INFO.name}
                    </h1>
                    <p className="text-xl mb-8 text-blue-100">
                        {SITE_INFO.description}
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href={PATHS.BLOGS}
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            浏览博客
                        </Link>
                        <Link
                            href={PATHS.ABOUT}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                        >
                            了解更多
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Blogs */}
            <section className="py-16 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">最新文章</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentBlogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={PATHS.BLOG_DETAIL(blog.slug)}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {blog.description}
                                </p>
                                {blog.category && (
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {blog.category.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href={PATHS.BLOGS}
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            查看所有文章 →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}