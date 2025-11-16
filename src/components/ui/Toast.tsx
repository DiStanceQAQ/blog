/**
 * Toast 通知组件
 * 用于显示成功、错误、警告等信息提示
 */

"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

/**
 * 单个 Toast 组件
 */
function ToastItem({ toast, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(toast.id);
        }, 300); // 等待退出动画完成
    }, [onClose, toast.id]);

    useEffect(() => {
        // 进入动画
        setTimeout(() => setIsVisible(true), 10);

        // 自动关闭
        const duration = toast.duration ?? 3000;
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [toast.duration, handleClose]);

    // 根据类型设置样式
    const typeStyles = {
        success: {
            bg: "bg-green-50 dark:bg-green-900/20",
            border: "border-green-200 dark:border-green-800",
            text: "text-green-800 dark:text-green-200",
            icon: (
                <svg
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        error: {
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800",
            text: "text-red-800 dark:text-red-200",
            icon: (
                <svg
                    className="h-5 w-5 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        warning: {
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            border: "border-yellow-200 dark:border-yellow-800",
            text: "text-yellow-800 dark:text-yellow-200",
            icon: (
                <svg
                    className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            ),
        },
        info: {
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-800",
            text: "text-blue-800 dark:text-blue-200",
            icon: (
                <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    };

    const styles = typeStyles[toast.type];

    return (
        <div
            className={`
                flex items-start gap-3 p-4 rounded-lg border shadow-lg
                ${styles.bg} ${styles.border} ${styles.text}
                transition-all duration-300 ease-in-out
                ${isVisible && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
                min-w-[300px] max-w-md
            `}
            role="alert"
        >
            {/* 图标 */}
            <div className="shrink-0">{styles.icon}</div>

            {/* 消息 */}
            <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
            </div>

            {/* 关闭按钮 */}
            <button
                onClick={handleClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="关闭"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}

/**
 * Toast 容器组件
 */
export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handleShowToast = (event: CustomEvent<Omit<Toast, "id">>) => {
            const toast: Toast = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...event.detail,
            };

            setToasts((prev) => [...prev, toast]);
        };

        // 监听自定义事件
        window.addEventListener("show-toast", handleShowToast as EventListener);

        return () => {
            window.removeEventListener(
                "show-toast",
                handleShowToast as EventListener
            );
        };
    }, []);

    const handleClose = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className="fixed top-4 right-4 z-9999 flex flex-col gap-2 pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onClose={handleClose} />
                </div>
            ))}
        </div>
    );
}

/**
 * 显示 Toast 的工具函数
 */
export function showToast(
    type: ToastType,
    message: string,
    duration?: number
) {
    window.dispatchEvent(
        new CustomEvent("show-toast", {
            detail: {
                type,
                message,
                duration,
            },
        })
    );
}

