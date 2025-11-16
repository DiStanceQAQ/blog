/**
 * 通知提供者组件
 * 管理全局 Toast 通知
 */

"use client";

import { ReactNode } from "react";
import { ToastContainer } from "@/components/ui/Toast";

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}

