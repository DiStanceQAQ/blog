// src/app/(root)/page.tsx
import Link from "next/link";
import { PATHS } from "@/constants/path";

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* 中上部导航留空*/}
            <div className="mx-auto max-w-screen-2xl">
                <main className="flex items-center justify-center min-h-[calc(100vh-5rem)] pb-10 md:pb-20">
                    {/* 我把内容放在一个 2 列容器里，左侧占 60% 作为 hero 文本区（在大屏上更宽） */}
                    <div className="w-full px-6 md:px-10 2xl:px-24">
                        <section className="mx-auto max-w-5xl">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                {/* 左侧空白列，用来制造大留白（在大屏上） */}
                                <div className="hidden lg:block lg:w-1/4" />
                                <div className="w-full lg:w-3/4">
                                    <h1 className="text-2xl md:text-3xl font-normal text-gray-800 dark:text-gray-200 mb-2">
                                        你好，我是
                                    </h1>
                                    <h2
                                        className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-4
                               bg-linear-to-r from-cyan-400 via-sky-500 to-blue-600 bg-clip-text text-transparent
                               drop-shadow-sm"
                                        aria-label="姓名 刘家宁"
                                    >
                                        刘家宁
                                    </h2>
                                    <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-3">
                                        一名前端开发工程师。
                                    </p>
                                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                                        喜欢{" "}
                                        <span className="font-semibold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            可视化技术
                                        </span>{" "}
                                        的一切。
                                    </p>
                                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                                        我在这个网站记录我的成长，努力 💪 成为一个更好的程序员。
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                                        <div className="flex gap-4">
                                            <Link
                                                href={PATHS.BLOGS}
                                                className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-800 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-medium shadow-sm hover:shadow-md transition-all"
                                            >
                                                我的博客
                                            </Link>

                                            <Link
                                                href={PATHS.ABOUT}
                                                className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-800 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-medium shadow-sm hover:shadow-md transition-all"
                                            >
                                                我的简历
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-6">
                                            <a
                                                href="#"
                                                aria-label="GitHub"
                                                className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <svg className="h-5 w-5 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 .5C5.648.5.5 5.647.5 12c0 5.084 3.292 9.386 7.867 10.909.575.106.785-.25.785-.556 0-.275-.01-1-.015-1.96-3.2.696-3.876-1.542-3.876-1.542-.523-1.33-1.277-1.684-1.277-1.684-1.045-.714.08-.699.08-.699 1.157.082 1.765 1.188 1.765 1.188 1.027 1.76 2.694 1.252 3.35.958.104-.747.402-1.252.732-1.54-2.553-.29-5.238-1.277-5.238-5.679 0-1.254.447-2.278 1.185-3.082-.119-.29-.514-1.46.113-3.044 0 0 .967-.31 3.168 1.176a11.03 11.03 0 012.88-.387c.977.004 1.962.132 2.88.387 2.2-1.486 3.166-1.176 3.166-1.176.63 1.584.235 2.754.116 3.044.74.804 1.185 1.828 1.185 3.082 0 4.415-2.69 5.384-5.253 5.67.413.358.78 1.064.78 2.146 0 1.548-.014 2.797-.014 3.177 0 .31.208.668.792.555C20.712 21.384 24 17.084 24 12 24 5.647 18.352.5 12 .5z" />
                                                </svg>
                                            </a>

                                            <a
                                                href="#"
                                                aria-label="Bilibili"
                                                className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <svg className="h-5 w-5 text-sky-500 dark:text-sky-400" viewBox="0 0 96 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M19.9068 9.24502C17.7722 7.18582 17.7722 3.76656 19.9068 1.70742C21.9355 -0.249681 25.1494 -0.249681 27.1782 1.70742L38.4919 12.6215C38.8133 12.9316 39.0863 13.2725 39.311 13.635H56.4208C56.6459 13.2725 56.9189 12.9316 57.24 12.6215L68.5536 1.70742C70.5824 -0.249681 73.7963 -0.249681 75.8251 1.70742C77.96 3.76656 77.96 7.18582 75.8251 9.24502L71.2747 13.635H74.6667C86.4485 13.635 96 23.1863 96 34.9684V64.3312C96 76.1131 86.4485 85.6645 74.6667 85.6645H21.3333C9.55125 85.6645 0 76.1131 0 64.3312V34.9683C0 23.1862 9.55125 13.635 21.3333 13.635H24.4575L19.9068 9.24502ZM21.3333 23.925C15.4423 23.925 10.6667 28.7006 10.6667 34.5916V64.7077C10.6667 70.5989 15.4423 75.3744 21.3333 75.3744H74.6667C80.5579 75.3744 85.3333 70.5989 85.3333 64.7077V34.5916C85.3333 28.7006 80.5579 23.925 74.6667 23.925H21.3333ZM26.6667 44.6932C26.6667 41.7477 29.0545 39.3598 32 39.3598C34.9455 39.3598 37.3333 41.7477 37.3333 44.6932V49.4613C37.3333 52.4069 34.9455 54.7947 32 54.7947C29.0545 54.7947 26.6667 52.4069 26.6667 49.4613V44.6932ZM64 39.3598C61.0544 39.3598 58.6667 41.7477 58.6667 44.6932V49.4613C58.6667 52.4069 61.0544 54.7947 64 54.7947C66.9456 54.7947 69.3333 52.4069 69.3333 49.4613V44.6932C69.3333 41.7477 66.9456 39.3598 64 39.3598Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
