/**
 * T06 - Admin 首页
 * 管理后台的主页面
 */

export default function AdminPage() {
    return (
        <div className="space-y-6">
            {/* 欢迎卡片 */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    欢迎使用管理后台
                </h2>
                <p className="text-gray-600">
                    这是管理后台的主页。您可以在这里管理博客、分类、标签等内容。
                </p>
            </div>

            {/* 快捷操作 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">博客管理</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        创建、编辑和删除博客文章
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        前往管理 →
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">分类管理</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        管理博客分类
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        前往管理 →
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">标签管理</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        管理博客标签
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        前往管理 →
                    </button>
                </div>
            </div>
        </div>
    );
}

