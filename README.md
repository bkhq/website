# BK.io

A curated content collection website for tools, articles, guides, and resources.

精选内容集合网站，收录工具、文章、教程和资源。

**Website**: [bk.io](https://bk.io)

## Contributing / 投稿

We welcome contributions! You can submit tools, articles, guides, and other resources via GitHub Pull Request.

欢迎投稿！你可以通过 GitHub Pull Request 提交工具、文章、教程等各类内容。

- [Submit Guide (English)](https://bk.io/en/submit)
- [投稿指南 (中文)](https://bk.io/zh/submit)

### Quick Submit / 快速提交

Just open an [Issue](https://github.com/bkhq/website/issues/new?template=quick-submit.yml) with the tool URL — AI will automatically collect and organize the content.

只需提交一个 [Issue](https://github.com/bkhq/website/issues/new?template=quick-submit.yml)，附上工具网址，AI 会自动收集并整理内容。

### Manual Submit / 手动提交

1. Fork this repo / Fork 本仓库
2. Create `content/<your-slug>/meta.json` / 创建 `content/<your-slug>/meta.json`
3. Register in `content/list.json` / 在 `content/list.json` 中注册
4. Open a Pull Request / 发起 Pull Request

## Stack / 技术栈

- **Frontend**: [Astro](https://astro.build) + [React](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com)
- **Deploy**: Cloudflare Workers

## License

Apache-2.0
