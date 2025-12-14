/**
 * T06 - Admin 布局组件
 * 所有 /admin 路径下的页面都会使用这个布局
 * 在服务端检查用户权限，未授权则显示 401 错误
 */

import { noAdminPermission } from "@/app/actions";
import Link from "next/link";
import { ReactNode } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

// 强制动态渲染，因为需要使用 headers() 进行权限检查
export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
    children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    // 服务端检查：是否有管理员权限
    const hasNoPermission = await noAdminPermission();

    // 如果没有权限，返回 401 错误页面
    if (hasNoPermission) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        {/* 401 错误标题 */}
                        <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">401</h1>

                        {/* 错误说明 */}
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            无权限访问
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            您没有权限访问管理后台。请先登录管理员账号。
                        </p>

                        {/* 登录链接 */}
                        <Link
                            href="/auth/sign-in"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors mr-4"
                        >
                            前往登录
                        </Link>

                        {/* 返回首页链接 */}
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            返回首页
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 有权限，渲染子页面
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 管理后台导航栏 */}
            <AdminNavbar />

            {/* 主内容区域 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

