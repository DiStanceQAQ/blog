/**
 * T06 - Admin 首页
 * 管理后台的主页面
 * 包含统计卡片和贡献日历
 */

import AdminStatsCards from "@/components/admin/AdminStatsCards";
import ContributionCalendar from "@/components/admin/ContributionCalendar";

export default function AdminPage() {
    return (
        <div className="space-y-8">
            {/* 统计卡片区域 */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    数据统计
                </h2>
                <AdminStatsCards />
            </div>

            {/* 贡献日历区域 */}
            <div>
                <ContributionCalendar />
            </div>
        </div>
    );
}

