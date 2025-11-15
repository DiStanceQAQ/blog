## 📚 项目架构

### 1️⃣ **技术栈概览**

这是一个现代化的全栈博客系统，使用的核心技术包括：

- **前端框架**: Next.js 16 + React 19（支持服务端渲染SSR）
- **编程语言**: TypeScript（类型安全）
- **样式方案**: Tailwind CSS 4 + shadcn/ui组件库
- **数据库**: SQLite + Prisma ORM
- **认证系统**: better-auth（支持邮箱密码和GitHub登录）
- **状态管理**: SWR（用于数据获取和缓存）
- **Markdown编辑**: Bytemd编辑器

---

### 2️⃣ **文件和文件夹结构详解**

```
fuxiaochen/
├── app/                          # Next.js App Router 核心目录
│   ├── (root)/                   # 前台页面组（访客可见）
│   │   ├── page.tsx             # 首页
│   │   ├── layout.tsx           # 前台布局（包含导航栏、底部）
│   │   ├── blogs/               # 博客列表页
│   │   ├── blog/[slug]/         # 博客详情页（动态路由）
│   │   ├── categories/          # 分类列表页
│   │   ├── category/[slug]/     # 分类详情页
│   │   ├── tags/                # 标签列表页
│   │   └── tag/[slug]/          # 标签详情页
│   │
│   ├── admin/                    # 后台管理页面（需要管理员权限）
│   │   ├── layout.tsx           # 后台布局（管理员导航）
│   │   ├── blog/                # 博客管理
│   │   │   ├── page.tsx         # 博客列表
│   │   │   ├── create/          # 创建博客
│   │   │   ├── edit/[id]/       # 编辑博客
│   │   │   ├── api.ts           # 前端API调用函数
│   │   │   └── components/      # 博客管理相关组件
│   │   ├── category/            # 分类管理
│   │   ├── tag/                 # 标签管理
│   │   └── user/                # 用户管理
│   │
│   ├── api/                      # API路由（后端接口）
│   │   ├── blogs/route.ts       # 博客列表API（GET, POST）
│   │   ├── blog/[id]/route.ts   # 单个博客API（GET, PUT, DELETE）
│   │   ├── categories/route.ts  # 分类API
│   │   ├── tags/route.ts        # 标签API
│   │   └── auth/[...all]/       # 认证API（由better-auth处理）
│   │
│   ├── auth/                     # 认证页面
│   │   ├── sign-in/             # 登录页
│   │   └── sign-up/             # 注册页
│   │
│   └── layout.tsx                # 根布局（全局配置）
│
├── components/                   # 可复用组件
│   ├── ui/                      # shadcn/ui组件（按钮、表单等）
│   ├── navbar/                  # 导航栏
│   ├── footer/                  # 页脚
│   ├── bytemd/                  # Markdown编辑器封装
│   └── providers/               # Context提供者（主题、进度条）
│
├── lib/                         # 核心工具库
│   ├── prisma.ts               # Prisma数据库客户端
│   ├── auth.ts                 # better-auth认证配置
│   ├── auth-client.ts          # 前端认证客户端
│   ├── request.ts              # Axios HTTP客户端
│   └── utils.ts                # 通用工具函数
│
├── prisma/                      # 数据库相关
│   ├── schema.prisma           # 数据库模型定义
│   └── migrations/             # 数据库迁移记录
│
├── types/                       # TypeScript类型定义
│   ├── blog.ts                 # 博客相关类型
│   ├── category.ts             # 分类相关类型
│   ├── tag.ts                  # 标签相关类型
│   └── user.ts                 # 用户相关类型
│
├── constants/                   # 常量配置
│   ├── info.ts                 # 站点信息（名称、邮箱等）
│   ├── path.ts                 # 路由路径常量
│   └── error.ts                # 错误消息
│
└── styles/                      # 样式文件
    ├── global.css              # 全局样式
    └── bytemd.css              # Markdown编辑器样式
```

---

### 3️⃣ **每个部分的作用**

#### **A. app/ 目录（核心应用）**

**Next.js App Router 架构**：采用基于文件系统的路由，每个文件夹代表一个路由段。

- **`(root)/`**: 括号表示**路由组**，不影响URL路径，用于组织相关页面并共享布局
  - 所有前台访客页面都在这里
  - 共享前台布局（导航栏+页脚）
  
- **`admin/`**: 后台管理区域
  - 需要管理员权限才能访问
  - 独立的管理后台布局
  
- **`api/`**: API路由处理器
  - 每个 `route.ts` 导出HTTP方法（GET、POST、PUT、DELETE）
  - 处理业务逻辑、数据库操作、权限验证

- **`auth/`**: 认证相关页面
  - 登录、注册界面

#### **B. components/ 目录（组件库）**

- **`ui/`**: 来自shadcn/ui的基础UI组件（按钮、对话框、表单等）
- **`navbar/`、`footer/`**: 布局组件
- **`bytemd/`**: Markdown编辑器和查看器的封装
- **`providers/`**: React Context提供者
  - `ThemeProvider`: 主题切换（明暗模式）
  - `BProgressProvider`: 页面加载进度条

#### **C. lib/ 目录（核心库）**

- **`prisma.ts`**: 数据库客户端实例（单例模式）
- **`auth.ts`**: 服务端认证配置
- **`auth-client.ts`**: 浏览器端认证客户端
- **`request.ts`**: Axios HTTP客户端，配置了：
  - 基础URL: `/api`
  - 错误拦截器（发布错误事件）
  - 响应数据提取

#### **D. prisma/ 目录（数据库）**

数据库模型包括：
- **User**: 用户（id、name、email、role）
- **Blog**: 博客（title、slug、description、body、published、category、tags）
- **Category**: 分类（name、slug）
- **Tag**: 标签（name、slug、icon）
- **Session**: 会话（认证用）
- **Account**: 账户关联（支持多种登录方式）

---

### 4️⃣ **状态存储位置**

这个项目采用**多层状态管理策略**：

#### **🗄️ 持久化数据**
- **位置**: SQLite数据库（通过Prisma ORM访问）
- **存储内容**: 用户、博客、分类、标签、会话

#### **🔐 认证状态**
- **位置**: 
  - 服务端：Session存储在数据库
  - 客户端：Cookie（由better-auth管理）
- **访问方式**: 
  ```typescript
  // 服务端
  import { auth } from "@/lib/auth";
  const session = await auth.api.getSession({ headers });
  
  // 客户端
  import { authClient } from "@/lib/auth-client";
  const { data: session } = authClient.useSession();
  ```

#### **📡 客户端数据缓存**
- **工具**: SWR（Stale-While-Revalidate）
- **作用**: 
  - 缓存API请求结果
  - 自动重新验证过期数据
  - 乐观更新
- **示例**:
  ```typescript
  // 自动缓存和刷新博客列表
  const { data, error, isLoading } = useGetBlogs({ pageIndex: 1, pageSize: 10 });
  ```

#### **🎨 UI状态**
- **主题**: `next-themes` + Context API
- **全局事件**: `pubsub-js`（用于跨组件通信，如错误通知）
- **表单**: `react-hook-form`（本地表单状态）

---

### 5️⃣ **服务之间如何连接（详细流程）**

#### **🔄 完整数据流示例：创建一篇博客**

```
用户操作 → 前端组件 → API客户端 → HTTP请求 → API路由 → 数据库 → 响应返回
```

**步骤拆解**：

1. **用户在管理后台填写表单**
   ```typescript
   // app/admin/blog/components/create-blog-form.tsx
   const { trigger } = useCreateBlog(); // SWR mutation
   
   const onSubmit = async (data) => {
     await trigger(data); // 触发API调用
   };
   ```

2. **前端API函数发起请求**
   ```typescript
   // app/admin/blog/api.ts
   export function createBlog(params: CreateBlogRequest) {
     return request.post<unknown, CreateBlogData>("/blogs", params);
   }
   // request是封装的axios实例，baseURL="/api"
   ```

3. **HTTP请求到达API路由**
   ```typescript
   // app/api/blogs/route.ts
   export async function POST(request: Request) {
     // 1. 权限检查
     if (await noAdminPermission()) {
       return createResponse({ error: "无权限" });
     }
     
     // 2. 参数验证（Zod schema）
     const params = await request.json();
     const result = await createBlogSchema.safeParseAsync(params);
     
     // 3. 业务逻辑检查
     const existingBlog = await prisma.blog.findUnique({
       where: { title: result.data.title }
     });
     if (existingBlog) {
       return createResponse({ error: "标题已存在" });
     }
     
     // 4. 写入数据库
     const data = await prisma.blog.create({
       data: { ...result.data }
     });
     
     // 5. 返回响应
     return createResponse({ data });
   }
   ```

4. **数据库操作**
   ```typescript
   // lib/prisma.ts
   export const prisma = new PrismaClient(); // 单例实例
   
   // Prisma自动将TypeScript操作转换为SQL
   // 写入SQLite数据库
   ```

5. **响应返回前端**
   - Axios拦截器提取 `response.data.data`
   - SWR更新缓存
   - UI自动刷新显示新博客

#### **🎯 前台页面渲染流程（SSR）**

```
用户访问URL → Next.js路由 → Server Component → 数据库查询 → 渲染HTML → 浏览器接收
```

#### **🔐 权限验证流程**

```
请求 → 读取Cookie → 验证Session → 检查角色 → 允许/拒绝
```

```typescript
// app/actions.ts
export async function noAdminPermission(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // 检查是否登录且角色为admin
  return !session?.user || session.user.role !== "admin";
}

// 在API路由中使用
if (await noAdminPermission()) {
  return createResponse({ error: "无权限" });
}
```

---

### 6️⃣ **关键设计模式**

1. **Server Actions vs API Routes**
   - **Server Actions** (`actions.ts`): 直接在服务端组件调用，不经过HTTP
   - **API Routes** (`api/*/route.ts`): RESTful API，供客户端组件调用

2. **数据获取策略**
   - **SSR**: 前台页面使用Server Components直接查询
   - **CSR + SWR**: 后台管理使用客户端获取+缓存

3. **类型安全**
   - Prisma生成数据库类型
   - Zod验证运行时数据
   - TypeScript编译时检查

---