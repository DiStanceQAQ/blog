/**
 * T03 - 认证系统 stub 实现
 * 提供统一的认证接口，当前返回 null（表示未登录）
 * 后续将替换为 better-auth 的真实实现
 */

export type Session = {
    user: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
} | null;

/**
 * auth 对象提供认证相关的 API
 */
export const auth = {
    api: {
        /**
         * getSession - 获取当前用户的会话信息
         * @returns Session | null - 当前返回 null（stub 实现）
         * 
         * 未来将实现：
         * 1. 从请求中读取 cookie/token
         * 2. 验证 token 有效性
         * 3. 从数据库查询用户信息
         * 4. 返回完整的 session 对象
         */
        getSession: async (): Promise<Session> => {
            // 临时返回模拟的管理员 session（用于开发测试）
            // TODO: 后续替换为真实的 better-auth 实现
            return {
                user: {
                    id: "dev-admin-001",
                    email: "admin@example.com",
                    name: "开发管理员",
                    role: "admin",
                },
            };
        },
    },
};

