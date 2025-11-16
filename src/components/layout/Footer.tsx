/**
 * 页脚组件
 * 使用常量配置，显示站点信息和链接
 */

import Link from "next/link";
import { SITE_INFO, FOOTER_LINKS } from "@/constants/info";

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 站点信息 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {SITE_INFO.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {SITE_INFO.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {SITE_INFO.copyright}
                        </p>
                    </div>

                    {/* 主要链接 */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            快速链接
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.main.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 资源链接 */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            关注我
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.external && (
                                            <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 底部信息 */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            由 <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Next.js</a> 强力驱动
                        </p>
                        {SITE_INFO.icp && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {SITE_INFO.icp}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            联系邮箱：{" "}
                            <a
                                href={`mailto:${SITE_INFO.author.email}`}
                                className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                {SITE_INFO.author.email}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

