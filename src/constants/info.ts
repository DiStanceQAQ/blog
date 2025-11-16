/**
 * 站点信息常量
 * 集中管理站点的基本信息，便于维护和更新
 */

/**
 * 站点基本信息
 */
export const SITE_INFO = {
    /** 站点名称 */
    name: "我的博客",

    /** 站点标题（用于浏览器标签） */
    title: "我的博客 - 分享技术与生活",

    /** 站点描述 */
    description: "一个基于 Next.js 构建的现代化博客系统，分享编程技术、开发经验和生活感悟",

    /** 站点关键词 */
    keywords: ["博客", "技术", "编程", "Next.js", "React", "TypeScript"],

    /** 站点语言 */
    locale: "zh-CN",

    /** 作者信息 */
    author: {
        name: "博客作者",
        email: "admin@example.com",
        url: "https://example.com",
    },

    /** 社交媒体链接 */
    social: {
        github: "https://github.com/yourusername",
        twitter: "https://twitter.com/yourusername",
        email: "mailto:admin@example.com",
    },

    /** 站点 URL */
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

    /** 版权信息 */
    copyright: `© ${new Date().getFullYear()} 我的博客. All rights reserved.`,

    /** ICP 备案号（如需要） */
    icp: "",

    /** 每页显示的博客数量 */
    postsPerPage: 10,

    /** 每页显示的摘要长度 */
    excerptLength: 200,
} as const;

/**
 * 导航菜单配置
 */
export const NAV_MENU = [
    {
        label: "首页",
        href: "/",
    },
    {
        label: "博客",
        href: "/blogs",
    },
    {
        label: "分类",
        href: "/categories",
    },
    {
        label: "标签",
        href: "/tags",
    },
    {
        label: "关于",
        href: "/about",
    },
] as const;

/**
 * 管理员菜单配置
 */
export const ADMIN_NAV_MENU = [
    {
        label: "仪表板",
        href: "/admin",
    },
    {
        label: "博客管理",
        href: "/admin/blog",
    },
    {
        label: "分类管理",
        href: "/admin/category",
    },
    {
        label: "标签管理",
        href: "/admin/tag",
    },
] as const;

/**
 * 页脚链接配置
 */
export const FOOTER_LINKS = {
    main: [
        {
            label: "首页",
            href: "/",
        },
        {
            label: "博客",
            href: "/blogs",
        },
        {
            label: "关于",
            href: "/about",
        },
    ],
    resources: [
        {
            label: "GitHub",
            href: SITE_INFO.social.github,
            external: true,
        },
        {
            label: "Twitter",
            href: SITE_INFO.social.twitter,
            external: true,
        },
    ],
} as const;

