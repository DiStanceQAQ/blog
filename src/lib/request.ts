/**
 * 统一的请求封装
 * 提供标准的错误处理和响应格式
 */

/**
 * 标准错误对象
 */
export class RequestError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'RequestError';
    }
}

/**
 * 请求选项
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
    /** 是否在错误时自动显示 toast（默认 true） */
    showErrorToast?: boolean;
    /** 是否在成功时显示 toast（默认 false） */
    showSuccessToast?: boolean;
    /** 成功消息 */
    successMessage?: string;
    /** 请求体（会自动 JSON.stringify） */
    body?: unknown;
}

/**
 * 统一的请求函数
 * @param url 请求 URL
 * @param options 请求选项
 * @returns 响应数据
 * @throws RequestError 当请求失败时
 */
export async function request<T = unknown>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        showErrorToast = true,
        showSuccessToast = false,
        successMessage,
        ...fetchOptions
    } = options;

    try {
        // 处理 body：如果是对象，自动 JSON.stringify
        let body: string | undefined;
        if (fetchOptions.body !== undefined) {
            if (typeof fetchOptions.body === 'string') {
                body = fetchOptions.body;
            } else {
                body = JSON.stringify(fetchOptions.body);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { body: _, ...restOptions } = fetchOptions;

        const response = await fetch(url, {
            ...restOptions,
            body,
            headers: {
                'Content-Type': 'application/json',
                ...restOptions.headers,
            },
        });

        const result = await response.json();

        // 如果响应不成功，抛出错误
        if (!response.ok) {
            const errorMessage =
                result.error ||
                result.message ||
                `请求失败 (${response.status})`;

            const error = new RequestError(
                errorMessage,
                response.status,
                result
            );

            // 如果需要显示错误 toast，触发事件
            if (showErrorToast) {
                // 使用自定义事件来触发 toast
                window.dispatchEvent(
                    new CustomEvent('show-toast', {
                        detail: {
                            type: 'error',
                            message: errorMessage,
                        },
                    })
                );
            }

            throw error;
        }

        // 如果需要显示成功 toast
        if (showSuccessToast && successMessage) {
            window.dispatchEvent(
                new CustomEvent('show-toast', {
                    detail: {
                        type: 'success',
                        message: successMessage,
                    },
                })
            );
        }

        // 返回数据（支持 data 字段或直接返回）
        return (result.data !== undefined ? result.data : result) as T;
    } catch (error) {
        // 如果是我们自己的 RequestError，直接抛出
        if (error instanceof RequestError) {
            throw error;
        }

        // 网络错误或其他错误
        const errorMessage =
            error instanceof Error
                ? error.message
                : '网络请求失败，请检查网络连接';

        const networkError = new RequestError(errorMessage, 0);

        // 如果需要显示错误 toast
        if (showErrorToast) {
            window.dispatchEvent(
                new CustomEvent('show-toast', {
                    detail: {
                        type: 'error',
                        message: errorMessage,
                    },
                })
            );
        }

        throw networkError;
    }
}

/**
 * GET 请求
 */
export async function get<T = unknown>(
    url: string,
    options?: RequestOptions
): Promise<T> {
    return request<T>(url, {
        ...options,
        method: 'GET',
    });
}

/**
 * POST 请求
 */
export async function post<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions
): Promise<T> {
    return request<T>(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * PUT 请求
 */
export async function put<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions
): Promise<T> {
    return request<T>(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
}

/**
 * DELETE 请求
 */
export async function del<T = unknown>(
    url: string,
    options?: RequestOptions
): Promise<T> {
    return request<T>(url, {
        ...options,
        method: 'DELETE',
    });
}

