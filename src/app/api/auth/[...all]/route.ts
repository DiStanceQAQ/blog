import { NextRequest, NextResponse } from 'next/server';
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * T03 - 基础 auth 后端 stub (better-auth 占位实现)
 * 这是一个占位路由，未来将被 better-auth 替代
 * [...all] 捕获所有 /api/auth/* 路由
 */

export async function GET(request: NextRequest) {
    // 读取 cookie header（用于后续 session 验证）
    const cookies = request.cookies;

    // 简单健康检查端点
    return NextResponse.json(
        { ok: true, message: 'Auth API is running' },
        { status: 200 }
    );
}

export async function POST(request: NextRequest) {
    // 读取 cookie header
    const cookies = request.cookies;

    // 占位实现，返回成功响应
    return NextResponse.json(
        { ok: true, message: 'Auth API is running' },
        { status: 200 }
    );
}

