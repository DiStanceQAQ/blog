import { SITE_INFO } from "@/constants/info";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `简历 | ${SITE_INFO.name}`,
    description: `关于 ${SITE_INFO.name} 的个人简历，包括教育背景、专业技能及项目经验。`,
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8">

                {/* --- 1. 头部信息 (Header) --- */}
                <header className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {SITE_INFO.name}
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            {SITE_INFO.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-gray-500 dark:text-gray-400">
                            {/* 邮箱 */}
                            <a
                                href={`mailto:${SITE_INFO.author.email}`}
                                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {SITE_INFO.author.email}
                            </a>
                            {/* GitHub */}
                            <a
                                href={SITE_INFO.social.github}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                GitHub
                            </a>
                            {/* Bilibili */}
                            <a
                                href={SITE_INFO.social.bilibili}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.316 3.776 1.258 1.006.942 1.442 2.296 1.442 4.16v8.35c0 1.956-.37 3.356-1.442 4.364-1.072 1.008-2.45 1.144-3.776 1.144H5.333c-1.326 0-2.704-.136-3.776-1.144C.485 21.777.115 20.377.115 18.42v-8.35c0-1.864.436-3.218 1.442-4.16 1.007-.942 2.266-1.204 3.776-1.258h.854l-1.63-2.092c-.31-.41-.122-1.012.358-1.16.48-.15 1.03.1 1.252.55l1.838 3.01H15.99l1.84-3.01c.22-.45.772-.7 1.252-.55.48.15.67.75.358 1.16l-1.627 2.092zM6.5 12.75c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5zm9 0c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.672-1.5 1.5z" /></svg>
                                Bilibili
                            </a>
                        </div>
                    </div>
                </header>

                {/* --- 2. 教育背景 (Education) --- */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                        </span>
                        教育背景
                    </h2>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-1">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    中国地质大学（武汉）
                                    <span className="text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                                        211
                                    </span>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">硕士 | 测绘工程</p>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                                2024.09 - 2027.06
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 flex-wrap">
                                    南京信息工程大学
                                    <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                                        双一流
                                    </span>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">本科 | 地理空间信息工程</p>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                                2020.09 - 2024.06
                            </span>
                        </div>
                    </div>
                </section>

                {/* --- 3. 专业技能 (Skills) --- */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </span>
                        专业技能
                    </h2>
                    <div className="grid gap-4">
                        {/* 技能分组1: 前端核心 */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                前端开发
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["HTML/CSS/JS", "Vue3 生态", "React", "TypeScript", "ElementPlus", "Echarts"].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 技能分组2: GIS & 可视化 */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                GIS & 三维可视化
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["Cesium", "GeoServer", "PostGIS", "WebGL", "OpenLayers"].map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 技能分组3: 其他能力 */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                工程化 & 数据处理
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                                <li>熟悉地理信息相关数据格式和处理方法，能够使用 <strong className="text-gray-900 dark:text-gray-200">Python</strong> 编写自动化处理脚本</li>
                                <li>了解项目部署上线流程，熟悉使用 AI 工具辅助开发</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- 4. 项目经历 (Projects) --- */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-lg mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </span>
                        项目经历
                    </h2>

                    <div className="space-y-8">
                        {/* 项目 1 */}
                        <div className="group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    <a href="https://gitee.com/distance54564/rebuild" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        干旱数字孪生可视化平台
                                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1 sm:mt-0">2024.11 - 2025.05</span>
                            </div>

                            {/* 技术栈标签 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {["Vue3", "Cesium", "ECharts", "GeoServer", "Flask", "PostGIS"].map(tech => (
                                    <span key={tech} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded border border-blue-100 dark:border-blue-800">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
                                <p>
                                    <strong className="text-gray-900 dark:text-gray-200">项目介绍：</strong>为实验室科研成果展示平台，基于 Cesium 实现三维地理场景渲染，支持气象要素、卫星轨道及监测站点的可视化展示。本人负责系统前后端主要功能开发及云端部署。
                                </p>
                                <div>
                                    <strong className="block mb-1 text-gray-800 dark:text-gray-200">项目亮点：</strong>
                                    <ul className="list-disc list-outside ml-5 space-y-1">
                                        <li>通过自定义 WebGL 点数据集的方式，实现上万站点的创建、更新和销毁的流畅渲染。</li>
                                        <li>使用路由懒加载、资源复用等手段，降低了首屏时间，提高了功能切换的流畅性。</li>
                                        <li>利用光线步进算法与后处理技术，实现全球体积云仿真渲染，提升场景真实感。</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}