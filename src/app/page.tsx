import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <main className="w-full max-w-4xl">
          {/* Header 区域 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg mb-8">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={24}
                priority
              />
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              开始你的
              <br />
              <span className="text-blue-600 dark:text-blue-400">Next.js</span> 之旅
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              探索现代 Web 开发的无限可能，从这里开始构建你的下一个伟大项目
            </p>

            {/* 特性卡片 */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">快速开发</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">使用 Next.js 的强大功能快速构建应用</p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">现代化</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">采用最新的 Web 技术和最佳实践</p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">易于使用</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">简单直观的开发体验</p>
              </div>
            </div>
          </div>

          {/* 行动按钮区域 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="mr-2 group-hover:scale-110 transition-transform duration-300"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              立即部署
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              className="inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              查看文档
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </a>
          </div>

          {/* 底部提示 */}
          <div className="text-center mt-16">
            <p className="text-gray-500 dark:text-gray-400">
              编辑 <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">src/app/page.tsx</code> 开始开发
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
