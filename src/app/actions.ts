/**
 * T06 - 全局 Server Actions
 * 提供应用级别的服务端操作函数
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * 检查当前用户是否有管理员权限
 * @returns true 表示没有权限（需要拒绝访问），false 表示有权限
 */
export async function noAdminPermission(): Promise<boolean> {
    try {
        // 获取请求头（用于读取 cookie）
        const headersList = await headers();

        // 获取当前会话
        const session = await auth.api.getSession({
            headers: headersList,
        });

        // 未登录 = 无权限
        if (!session) {
            return true; // 没有权限
        }

        // 从数据库查询用户信息（包含 role 字段）
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        // 检查用户角色是否为管理员
        if (!user || user.role !== "admin") {
            return true; // 不是管理员，没有权限
        }

        // 有管理员权限
        return false;
    } catch (error) {
        console.error("权限检查失败:", error);
        // 出错时默认拒绝访问
        return true;
    }
}

