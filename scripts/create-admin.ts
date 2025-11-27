/**
 * 创建管理员账号脚本
 * 使用 better-auth 的内部方法创建用户，确保密码格式正确
 * 运行方式: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// 创建 better-auth 实例（与主应用配置一致）
const prisma = new PrismaClient();
const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
});

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "admin";

    try {
        // 检查管理员是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (existingUser) {
            console.log(`管理员账号 ${email} 已存在，重新创建凭据...`);

            // 删除旧的 credential 账户记录
            await prisma.account.deleteMany({
                where: { userId: existingUser.id, providerId: "credential" },
            });

            // 通过 better-auth 再次创建 credential 账户（自动使用 scrypt）
            await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                },
            });

            // signUpEmail 会新建用户；由于用户已存在，此处会抛已存在错误
            // 因此我们需要手动创建账号记录
        } else {
            // 用户不存在，直接调用 signUp
            await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                },
            });
        }

        // 无论是新用户还是已有用户，确保角色为 admin
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("创建用户失败，未找到对应账号");
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                role: "admin",
                name,
            },
        });

        console.log(`✅ 管理员账号已准备就绪`);
        console.log(`   邮箱: ${email}`);
        console.log(`   密码: ${password}`);
        console.log(`   角色: admin`);
        console.log(`\n⚠️  请妥善保管密码，建议首次登录后修改密码`);
    } catch (error) {
        console.error("创建管理员账号失败:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
