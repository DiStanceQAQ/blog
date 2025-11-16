/**
 * T06 - Admin 布局组件
 * 所有 /admin 路径下的页面都会使用这个布局
 * 在服务端检查用户权限，未授权则显示 401 错误
 */

import { noAdminPermission } from "@/app/actions";
import { ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    // 服务端检查：是否有管理员权限
    const hasNoPermission = await noAdminPermission();

    // 如果没有权限，返回 401 错误页面
    if (hasNoPermission) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        {/* 401 错误标题 */}
                        <h1 className="text-6xl font-bold text-red-600 mb-4">401</h1>

                        {/* 错误说明 */}
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            无权限访问
                        </h2>

                        <p className="text-gray-600 mb-6">
                            您没有权限访问管理后台。请先登录管理员账号。
                        </p>

                        {/* 返回首页链接 */}
                        <a
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            返回首页
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // 有权限，渲染子页面
    return (
        <div className="min-h-screen bg-gray-100">
            {/* 管理后台头部 */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
                </div>
            </header>

            {/* 主内容区域 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

