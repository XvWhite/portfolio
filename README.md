# 郭春浩个人作品集

React 19 + Vite 6，亮色 PC 优先的单页作品集，内容依据个人简历整理。

## 运行

```sh
npm install
npm run dev
```

生产构建：`npm run build`。构建预览：`npm run preview`。

## 独立访客计数

页脚的 `VISITORS` 数字由 Cloudflare Pages Function `/api/visitors` 与 D1 数据库提供。同一浏览器使用保存在本地的匿名 UUID 去重，不采集 IP、地理位置或浏览内容。

1. 在 Cloudflare 创建 D1 数据库 `portfolio-visitors`。
2. 执行 `migrations/0001_create_visitors.sql` 初始化数据表。
3. 在 Pages 项目的 Production 环境添加 D1 Binding：变量名 `VISITOR_DB`，数据库选择 `portfolio-visitors`。
4. Preview 环境绑定单独的测试数据库，避免预览访问增加正式计数。

本地仅运行 Vite 时没有 Pages Function 和 D1，计数会自动隐藏，网站其他功能不受影响。

## 内容与素材

- `src/main.jsx`：个人经历、邮箱、项目与优势文案；项目集中在 `projects` 数组。
- `src/style.css`：颜色、版式、响应式布局；版心最大 1700px。
- `public/images/`：现有视觉示意图片，不代表真实项目交付物。替换为作品原图后，可同步删除页面占位提示。
- 个人介绍使用原创姓名排版作为头像占位，不冒用他人照片。
- `public/videos/nj1.mp4`：用户提供的 Nana Jacqueline 项目视频 NJ1.mp4，等比例铺满并居中裁切，保留磨砂视觉效果。浏览器无法自动播放时可手动播放；载入失败显示静态背景。
- 简历没有量化业务业绩，页面仅统计 4 个简历项目、3 个展示类别，并说明全流程服务。

## 已有交互

锚点导航、项目分类筛选、项目详情弹窗（Esc 关闭）、邮箱复制、邮件链接、视频暂停/播放、回到顶部及减少动态效果支持。

项目仅用于本地预览，尚未发布。
