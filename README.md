# Web Worker 播客 · podcast-website

「Web Worker」播客的官方网站：节目浏览与搜索筛选、章节时间戳跳转、全局播放器（倍速/音量/进度恢复）、收藏、RSS 与 SEO（全站静态预渲染）。

## 技术栈

- SvelteKit 3 + Svelte 5（Runes 语法，全局状态用 `.svelte.ts` 单例）
- Tailwind CSS v4（深色模式：class 策略 + 手动切换）
- TypeScript strict + svelte-check / ESLint / Prettier
- adapter-static 全站预渲染，`content/episodes/*.md` 为节目内容源

## 常用命令

```sh
npm install        # 安装依赖
npm run dev        # 开发服务器（热重载）
npm run build      # 生产构建，输出到 build/
npm run preview    # 预览生产构建
npm run check      # svelte-check 类型检查
npm run lint       # Prettier + ESLint
npm run format     # Prettier 格式化
```

## 目录结构

```
content/episodes/      节目 Markdown（YAML frontmatter + Shownotes）
src/lib/components/    组件按功能分类：episode / player / layout / seo / ui / favorites / theme
src/lib/content/       数据层：frontmatter 解析 + zod 校验
src/routes/            页面路由 + feed.xml / sitemap.xml / robots.txt 端点
```

## 部署

全站为纯静态预渲染（`build/` 目录），任意静态托管平台均可部署。仓库已内置两个 GitHub Actions 工作流：

- `.github/workflows/ci.yml` —— push / PR 时执行 lint + check + build
- `.github/workflows/deploy.yml` —— push 到 `main` 自动构建并发布到 GitHub Pages

### 路径 A：GitHub Pages（推荐，零第三方账号）

1. **本地初始化仓库并推送**（本机需先安装 Git for Windows：`winget install Git.Git`）：

   ```sh
   git init
   git add .
   git commit -m "init: Web Worker 播客网站"
   # 在 GitHub 上创建空仓库后：
   git remote add origin https://github.com/<你的用户名>/podcast-website.git
   git push -u origin main
   ```

2. **开启 Pages**：仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**（无需选分支）。
3. **部署子路径**：Pages 地址形如 `https://<用户名>.github.io/podcast-website/`，属于子路径部署，需在 `vite.config.ts` 的 `sveltekit({...})` 中加：

   ```ts
   paths: {
   	base: '/podcast-website';
   }
   ```

   绑定自定义域名则**不需要** base（根路径部署）。

4. **更新站点地址**：把 `src/lib/config/site.ts` 的 `url` 改成最终线上地址——RSS、sitemap、canonical URL 都取自这里。

### 路径 B：Vercel / Netlify（自动预览每次 PR）

在平台控制台「导入 GitHub 仓库」，构建命令 `npm run build`，输出目录 `build`，零额外配置。注意 `site.ts` 的 `url` 要改成平台分配（或自定义）域名。

### 上线前检查清单

- [ ] 替换 `content/episodes/*.md` 中的示例音频（`audioUrl/audioType/audioSize`）与各平台链接
- [ ] `site.ts` 的 `url`、`platforms` 改为真实值
- [ ] 部署后验证 `https://<域名>/feed.xml` 可被小宇宙 / Apple Podcasts 抓取
- [ ] 自定义域名：DNS 解析 + 仓库绑定，`sitemap.xml` 与 canonical 随 `site.url` 自动更新
