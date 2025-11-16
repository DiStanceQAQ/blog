"use client";

/**
 * T13 - Markdown 渲染器组件
 * 用于在详情页渲染 Markdown 内容
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";

interface ViewerProps {
    content: string;
    className?: string;
}

/**
 * Markdown 内容渲染器
 * 支持 GitHub Flavored Markdown 和代码高亮
 */
export default function Viewer({ content, className = "" }: ViewerProps) {
    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                    // 自定义各个元素的样式
                    h1: ({ children, ...props }) => (
                        <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900" {...props}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3 className="text-2xl font-bold mt-5 mb-2 text-gray-900" {...props}>
                            {children}
                        </h3>
                    ),
                    h4: ({ children, ...props }) => (
                        <h4 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props}>
                            {children}
                        </h4>
                    ),
                    h5: ({ children, ...props }) => (
                        <h5 className="text-lg font-bold mt-3 mb-2 text-gray-900" {...props}>
                            {children}
                        </h5>
                    ),
                    h6: ({ children, ...props }) => (
                        <h6 className="text-base font-bold mt-2 mb-2 text-gray-900" {...props}>
                            {children}
                        </h6>
                    ),
                    p: ({ children, ...props }) => (
                        <p className="my-4 leading-7 text-gray-700" {...props}>
                            {children}
                        </p>
                    ),
                    a: ({ children, ...props }) => (
                        <a
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        >
                            {children}
                        </a>
                    ),
                    ul: ({ children, ...props }) => (
                        <ul className="my-4 ml-6 list-disc space-y-2 text-gray-700" {...props}>
                            {children}
                        </ul>
                    ),
                    ol: ({ children, ...props }) => (
                        <ol className="my-4 ml-6 list-decimal space-y-2 text-gray-700" {...props}>
                            {children}
                        </ol>
                    ),
                    li: ({ children, ...props }) => (
                        <li className="leading-7" {...props}>
                            {children}
                        </li>
                    ),
                    blockquote: ({ children, ...props }) => (
                        <blockquote
                            className="my-4 border-l-4 border-blue-500 bg-blue-50 p-4 italic text-gray-700"
                            {...props}
                        >
                            {children}
                        </blockquote>
                    ),
                    code: ({ inline, className, children, ...props }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                    }) => {
                        if (inline) {
                            return (
                                <code
                                    className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-pink-600"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children, ...props }) => (
                        <pre
                            className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4"
                            {...props}
                        >
                            {children}
                        </pre>
                    ),
                    table: ({ children, ...props }) => (
                        <div className="my-4 overflow-x-auto">
                            <table
                                className="min-w-full divide-y divide-gray-300 border border-gray-300"
                                {...props}
                            >
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children, ...props }) => (
                        <thead className="bg-gray-50" {...props}>
                            {children}
                        </thead>
                    ),
                    tbody: ({ children, ...props }) => (
                        <tbody className="divide-y divide-gray-200 bg-white" {...props}>
                            {children}
                        </tbody>
                    ),
                    tr: ({ children, ...props }) => (
                        <tr {...props}>{children}</tr>
                    ),
                    th: ({ children, ...props }) => (
                        <th
                            className="px-4 py-2 text-left text-sm font-semibold text-gray-900"
                            {...props}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }) => (
                        <td className="px-4 py-2 text-sm text-gray-700" {...props}>
                            {children}
                        </td>
                    ),
                    hr: ({ ...props }) => (
                        <hr className="my-8 border-t border-gray-300" {...props} />
                    ),
                    img: (props) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className="my-4 max-w-full rounded-lg shadow-md"
                            loading="lazy"
                            {...props}
                            alt={props.alt || ""}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

