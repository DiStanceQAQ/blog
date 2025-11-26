// src/app/(root)/page.tsx
import Link from "next/link";
import { PATHS } from "@/constants/path";

export default function Home() {
    return (
        <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <main className="flex flex-col justify-center min-h-[calc(100vh-10rem)] max-w-5xl mx-auto">

                    {/* --- 文本区域 --- */}
                    <div className="space-y-6 md:space-y-8">
                        <p className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-wide mb-4">
                            你好，我是
                        </p>

                        {/* 2. 名字：视觉重心 */}
                        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight leading-tight">
                            <span className="bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent pb-2 block w-fit">
                                刘家宁
                            </span>
                        </h1>

                        {/* 3. 职业定位：清晰有力 */}
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                            一名前端开发工程师。
                        </h2>

                        {/* 4. 描述文案：增加行高，提升阅读舒适度 */}
                        <div className="max-w-2xl space-y-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                喜欢{" "}
                                <span className="font-bold text-gray-900 dark:text-white underline decoration-cyan-400/50 decoration-4 underline-offset-2">
                                    可视化技术
                                </span>{" "}
                                的一切。
                            </p>
                            <p>
                                我在这个网站记录我的成长，努力 💪 成为一个更好的程序员。
                            </p>
                        </div>

                        {/* --- 按钮与社交链接区域 --- */}
                        <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-5">

                            {/* 按钮组 */}
                            <div className="flex gap-4">
                                <Link
                                    href={PATHS.BLOGS}
                                    className="group relative px-8 py-3.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300"
                                >
                                    我的博客
                                    {/* 箭头动画 */}
                                    <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </Link>

                                <Link
                                    href={PATHS.ABOUT}
                                    className="px-8 py-3.5 rounded-full bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                                >
                                    我的简历
                                </Link>
                            </div>

                            {/* 分割线 (移动端隐藏) */}
                            <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-700 mx-2" />

                            {/* 社交图标 */}
                            <div className="flex items-center gap-4">
                                <SocialLink href="#" label="GitHub">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 .5C5.648.5.5 5.647.5 12c0 5.084 3.292 9.386 7.867 10.909.575.106.785-.25.785-.556 0-.275-.01-1-.015-1.96-3.2.696-3.876-1.542-3.876-1.542-.523-1.33-1.277-1.684-1.277-1.684-1.045-.714.08-.699.08-.699 1.157.082 1.765 1.188 1.765 1.188 1.027 1.76 2.694 1.252 3.35.958.104-.747.402-1.252.732-1.54-2.553-.29-5.238-1.277-5.238-5.679 0-1.254.447-2.278 1.185-3.082-.119-.29-.514-1.46.113-3.044 0 0 .967-.31 3.168 1.176a11.03 11.03 0 012.88-.387c.977.004 1.962.132 2.88.387 2.2-1.486 3.166-1.176 3.166-1.176.63 1.584.235 2.754.116 3.044.74.804 1.185 1.828 1.185 3.082 0 4.415-2.69 5.384-5.253 5.67.413.358.78 1.064.78 2.146 0 1.548-.014 2.797-.014 3.177 0 .31.208.668.792.555C20.712 21.384 24 17.084 24 12 24 5.647 18.352.5 12 .5z" />
                                    </svg>
                                </SocialLink>

                                <SocialLink href="#" label="Bilibili" hoverColor="hover:text-pink-400 dark:hover:text-pink-400">
                                    <svg className="h-6 w-6" viewBox="0 0 96 86" fill="currentColor">
                                        <path d="M19.9068 9.24502C17.7722 7.18582 17.7722 3.76656 19.9068 1.70742C21.9355 -0.249681 25.1494 -0.249681 27.1782 1.70742L38.4919 12.6215C38.8133 12.9316 39.0863 13.2725 39.311 13.635H56.4208C56.6459 13.2725 56.9189 12.9316 57.24 12.6215L68.5536 1.70742C70.5824 -0.249681 73.7963 -0.249681 75.8251 1.70742C77.96 3.76656 77.96 7.18582 75.8251 9.24502L71.2747 13.635H74.6667C86.4485 13.635 96 23.1863 96 34.9684V64.3312C96 76.1131 86.4485 85.6645 74.6667 85.6645H21.3333C9.55125 85.6645 0 76.1131 0 64.3312V34.9683C0 23.1862 9.55125 13.635 21.3333 13.635H24.4575L19.9068 9.24502ZM21.3333 23.925C15.4423 23.925 10.6667 28.7006 10.6667 34.5916V64.7077C10.6667 70.5989 15.4423 75.3744 21.3333 75.3744H74.6667C80.5579 75.3744 85.3333 70.5989 85.3333 64.7077V34.5916C85.3333 28.7006 80.5579 23.925 74.6667 23.925H21.3333ZM26.6667 44.6932C26.6667 41.7477 29.0545 39.3598 32 39.3598C34.9455 39.3598 37.3333 41.7477 37.3333 44.6932V49.4613C37.3333 52.4069 34.9455 54.7947 32 54.7947C29.0545 54.7947 26.6667 52.4069 26.6667 49.4613V44.6932ZM64 39.3598C61.0544 39.3598 58.6667 41.7477 58.6667 44.6932V49.4613C58.6667 52.4069 61.0544 54.7947 64 54.7947C66.9456 54.7947 69.3333 52.4069 69.3333 49.4613V44.6932C69.3333 41.7477 66.9456 39.3598 64 39.3598Z" />
                                    </svg>
                                </SocialLink>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SocialLink({ href, label, children, hoverColor = "hover:text-cyan-500" }: { href: string, label: string, children: React.ReactNode, hoverColor?: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className={`p-2 rounded-lg text-gray-500 dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${hoverColor}`}
        >
            {children}
        </a>
    );
}