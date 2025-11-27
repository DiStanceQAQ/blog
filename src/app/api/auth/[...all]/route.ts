import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Better Auth API 路由处理器
 * [...all] 捕获所有 /api/auth/* 路由
 * 处理登录、注册、登出、会话管理等所有认证相关请求
 */

export const { GET, POST } = toNextJsHandler(auth);
