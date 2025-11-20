/**
 * 关于页面
 * 展示站点信息
 */

import { SITE_INFO } from "@/constants/info";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "关于",
    description: `关于 ${SITE_INFO.name}`,
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            {/* 页面标题 */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    关于 {SITE_INFO.name}
                </h1>
                <p className="text-lg text-gray-600">
                    {SITE_INFO.description}
                </p>
            </div>

            {/* 站点信息 */}
            <div className="space-y-8">
                {/* 作者信息 */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        作者信息
                    </h2>
                    <div className="space-y-2 text-gray-600">
                        <p>
                            <span className="font-medium">姓名：</span>
                            {SITE_INFO.author.name}
                        </p>
                        <p>
                            <span className="font-medium">邮箱：</span>
                            <a
                                href={`mailto:${SITE_INFO.author.email}`}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {SITE_INFO.author.email}
                            </a>
                        </p>
                        <p>
                            <span className="font-medium">网站：</span>
                            <a
                                href={SITE_INFO.author.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {SITE_INFO.author.url}
                            </a>
                        </p>
                    </div>
                </section>

                {/* 技术栈 */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        技术栈
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Vue3", "React", "TypeScript", "Cesium", "GIS", "PostgreSQL"].map(
                            (tech) => (
                                <div
                                    key={tech}
                                    className="flex items-center justify-center bg-gray-50 rounded-lg p-4 text-gray-700 font-medium"
                                >
                                    {tech}
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* 社交媒体 */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        关注我
                    </h2>
                    <div className="flex gap-4">
                        <a
                            href={SITE_INFO.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href={SITE_INFO.social.bilibili}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
                        >
                            {/* 官方风格蓝色小电视图标（内联 SVG） */}
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 96 86"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M19.9068 9.24502C17.7722 7.18582 17.7722 3.76656 19.9068 1.70742C21.9355 -0.249681 25.1494 -0.249681 27.1782 1.70742L38.4919 12.6215C38.8133 12.9316 39.0863 13.2725 39.311 13.635H56.4208C56.6459 13.2725 56.9189 12.9316 57.24 12.6215L68.5536 1.70742C70.5824 -0.249681 73.7963 -0.249681 75.8251 1.70742C77.96 3.76656 77.96 7.18582 75.8251 9.24502L71.2747 13.635H74.6667C86.4485 13.635 96 23.1863 96 34.9684V64.3312C96 76.1131 86.4485 85.6645 74.6667 85.6645H21.3333C9.55125 85.6645 0 76.1131 0 64.3312V34.9683C0 23.1862 9.55125 13.635 21.3333 13.635H24.4575L19.9068 9.24502ZM21.3333 23.925C15.4423 23.925 10.6667 28.7006 10.6667 34.5916V64.7077C10.6667 70.5989 15.4423 75.3744 21.3333 75.3744H74.6667C80.5579 75.3744 85.3333 70.5989 85.3333 64.7077V34.5916C85.3333 28.7006 80.5579 23.925 74.6667 23.925H21.3333ZM26.6667 44.6932C26.6667 41.7477 29.0545 39.3598 32 39.3598C34.9455 39.3598 37.3333 41.7477 37.3333 44.6932V49.4613C37.3333 52.4069 34.9455 54.7947 32 54.7947C29.0545 54.7947 26.6667 52.4069 26.6667 49.4613V44.6932ZM64 39.3598C61.0544 39.3598 58.6667 41.7477 58.6667 44.6932V49.4613C58.6667 52.4069 61.0544 54.7947 64 54.7947C66.9456 54.7947 69.3333 52.4069 69.3333 49.4613V44.6932C69.3333 41.7477 66.9456 39.3598 64 39.3598Z"
                                    fill="#00AEEC"
                                />
                            </svg>

                            Bilibili
                        </a>
                    </div>
                </section>

                {/* 版权信息 */}
                <section className="text-center text-gray-600">
                    <p>{SITE_INFO.copyright}</p>
                </section>
            </div>
        </div>
    );
}

