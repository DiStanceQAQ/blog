/**
 * Better Auth 认证系统配置
 * 使用 Prisma 适配器连接数据库
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// 配置 better-auth
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // 开发阶段可以设为 false
    },
    // 可以添加社交登录（可选）
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID!,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    //     },
    // },
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
});

// 导出 Session 类型（兼容现有代码）
export type Session = {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
} | null;

