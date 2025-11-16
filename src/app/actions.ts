/**
 * T06 - 全局 Server Actions
 * 提供应用级别的服务端操作函数
 */

import { auth } from "@/lib/auth";

/**
 * 检查当前用户是否有管理员权限
 * @returns true 表示没有权限（需要拒绝访问），false 表示有权限
 * 
 * 当前实现（stub）：
 * - auth.api.getSession() 返回 null（未登录）
 * - 未来将检查 session.user.role === 'admin'
 */
export async function noAdminPermission(): Promise<boolean> {
    try {
        // 获取当前会话
        const session = await auth.api.getSession();

        // Stub 阶段：session 始终为 null，表示未登录
        // 未登录 = 无权限
        if (!session) {
            return true; // 没有权限
        }

        // 未来实现：检查用户角色
        // if (session.user.role !== 'admin') {
        //   return true; // 不是管理员，没有权限
        // }

        // 有管理员权限
        return false;
    } catch (error) {
        console.error("权限检查失败:", error);
        // 出错时默认拒绝访问
        return true;
    }
}

