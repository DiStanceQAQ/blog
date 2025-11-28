/**
 * Better Auth 客户端配置
 * 用于浏览器端的认证操作（登录、注册、登出等）
 */

"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    //baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    basePath: "/api/auth",
});

// 导出常用的客户端方法
export const {
    signIn,
    signOut,
    signUp,
    useSession,
    getSession,
} = authClient;
