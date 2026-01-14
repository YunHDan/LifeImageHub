# LifeImageHub

中文 | [English](README.en.md)

一个基于 Next.js 的相册/生活轨迹展示站点，用于以时间线方式展示照片。

本项目基于 ned.im 的站点结构改造而来，保留了部分原项目的组件与文档路由。

![](public/showcase.png)

## 功能特性

- 生活轨迹/时间线展示（支持每条记录挂多张照片）
- 图片缩略图预取、点击打开查看器（viewer）
- 支持两种图片来源：
	- 公开可访问的图片基址（CDN/对象存储公开桶/你的站点域名）
	- 私有对象存储（当前实现为七牛私有空间）通过签名接口临时授权访问
- 内置 MDX 文档路由（当前仓库包含 Noty 文档页面）

## TODO

- 2026-01-14 :white_check_mark: 完成了支持本地使用的相册。
- 2026-xx-xx :brain: 完成与shoka主题博客的适配。
- 2026-xx-xx :brain: 完成与telegram图床的适配，以实现LifeImageHub的无限空间存储。

## 技术栈

- Next.js 15（App Router）
- React 19
- Tailwind CSS
- MDX（@next/mdx）

## 快速开始

### 1) 安装依赖

> 推荐使用 pnpm。

```bash
pnpm install
```

### 2) 配置环境变量（按需）

复制示例文件并按你的情况填写：

```bash
copy .env.example .env.local
```

环境变量说明见下文「环境变量」。

### 3) 启动开发服务器

```bash
pnpm dev
```

打开：

- http://localhost:3000

### 4) 构建与启动（生产模式）

```bash
pnpm build
pnpm start
```

## 环境变量

本项目有两条“图片加载链路”，二选一即可：

### 方案 A：公开图片基址（最简单）

当你把图片放在一个公开可访问的域名（例如 CDN、对象存储公开桶、或你自己的站点域名）时，在.env.local设置：

- `NEXT_PUBLIC_PHOTO_BASE`

示例：

```env
NEXT_PUBLIC_PHOTO_BASE=https://cdn.example.com
```

备注：如果你想在本地直接用 Next.js 的 public 静态文件（例如把图片放到 public 目录），也可以在开发时设置：

```env
NEXT_PUBLIC_PHOTO_BASE=http://localhost:3000
```

然后在数据里使用 `"/xxx.jpg"` 或 `"xxx.jpg"` 这类 key。

### 方案 B：七牛私有空间（需要签名）

当你的图片放在七牛私有空间（或你希望用临时签名 URL 控制访问）时，配置：

- `QINIU_ACCESS_KEY`
- `QINIU_SECRET_KEY`
- `QINIU_BUCKET_DOMAIN`（例如 `https://img.example.com`，不带查询参数）

此时前端会请求签名接口获取可访问的临时 URL：

- `GET /api/sign?key=<object-key>`（默认返回 307 重定向，适合直接作为 `<img src>`）
- `GET /api/sign?mode=json&key=<object-key>`（返回 `{ url }`，适合前端先 fetch 再赋值）

## 如何添加/修改照片内容

当前示例数据在：

- lib/utils.tsx

你可以在 `changelogItems` 里新增记录（日期、标题、描述、photos 等）。

关于 `photos[].src`：

- 如果是完整 URL（以 http/https 开头），会直接使用该 URL。
- 如果是 key/相对路径，会根据 `NEXT_PUBLIC_PHOTO_BASE` 或 `/api/sign` 规则解析。

## 常见问题

### 1) 图片不显示 / 刷新后图片失效

通常是图片源配置不正确：

- 使用七牛私有空间：确认 `.env.local` 里 `QINIU_*` 三个变量齐全。
- 使用公开基址：确认 `.env.local` 里配置了 `NEXT_PUBLIC_PHOTO_BASE`，并且该域名能直接访问到对应 key。

建议打开浏览器 DevTools → Network，查看图片请求是否为 307 跳转到真实图片，或是否返回了 4xx/5xx。

### 2) 本地开发时访问不了网络地址

如果你用局域网 IP 访问 dev 服务（手机/同网段设备），Next dev 可能会出现跨域限制提示。
本项目在 next.config.mjs 里配置了 `allowedDevOrigins`，你可以按需改为你自己的 dev 访问地址。

## 可选：部署

- 默认可部署到任意支持 Node.js 的平台（如 Vercel/自建服务器）。
- 仓库包含 wrangler.json，可作为 Cloudflare 部署的起点（如果你不用 Cloudflare，可以忽略/删除）。

## 致谢

- 站点结构与部分组件来自 ned.im（在此基础上做了相册化改造）

## License

见 LICENSE。

