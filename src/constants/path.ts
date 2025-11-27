/**
 * 路径常量
 * 集中管理应用中的所有路径，便于维护和避免拼写错误
 */

/**
 * 前台页面路径
 */
export const PATHS = {
    /** 首页 */
    HOME: "/",

    /** 博客相关 */
    BLOGS: "/blogs",
    BLOG_DETAIL: (slug: string) => `/blog/${slug}`,

    /** 分类相关 */
    CATEGORIES: "/categories",
    CATEGORY_DETAIL: (slug: string) => `/category/${slug}`,

    /** 标签相关 */
    TAGS: "/tags",
    TAG_DETAIL: (slug: string) => `/tag/${slug}`,

    /** 搜索 */
    SEARCH: (query: string) => `/blogs?query=${encodeURIComponent(query)}`,

    /** 关于页面 */
    ABOUT: "/about",
} as const;

/**
 * 管理后台路径
 */
export const ADMIN_PATHS = {
    /** 管理后台首页 */
    DASHBOARD: "/admin",

    /** 博客管理 */
    BLOG_LIST: "/admin/blog",
    BLOG_CREATE: "/admin/blog/create",
    BLOG_EDIT: (id: string) => `/admin/blog/edit/${id}`,

    /** 分类管理 */
    CATEGORY_LIST: "/admin/category",
    CATEGORY_CREATE: "/admin/category/create",
    CATEGORY_EDIT: (id: string) => `/admin/category/edit/${id}`,

    /** 标签管理 */
    TAG_LIST: "/admin/tag",
    TAG_CREATE: "/admin/tag/create",
    TAG_EDIT: (id: string) => `/admin/tag/edit/${id}`,

    /** 用户管理 */
    USER_LIST: "/admin/user",
} as const;

/**
 * API 路径
 */
export const API_PATHS = {
    /** 博客 API */
    BLOGS: "/api/blogs",
    BLOG_DETAIL: (id: string) => `/api/blog/${id}`,

    /** 分类 API */
    CATEGORIES: "/api/categories",
    CATEGORY_DETAIL: (id: string) => `/api/categories/${id}`,

    /** 标签 API */
    TAGS: "/api/tags",
    TAG_DETAIL: (id: string) => `/api/tags/${id}`,

    /** 认证 API */
    AUTH: "/api/auth",

    /** 管理后台 API */
    ADMIN_STATS: "/api/admin/stats",//统计数据
    ADMIN_CONTRIBUTION: "/api/admin/contribution",//贡献日历
} as const;

/**
 * 外部链接
 */
export const EXTERNAL_LINKS = {
    GITHUB: "https://github.com",
    TWITTER: "https://twitter.com",
    NEXTJS: "https://nextjs.org",
    VERCEL: "https://vercel.com",
} as const;

