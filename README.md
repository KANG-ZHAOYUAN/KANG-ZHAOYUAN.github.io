# KANG-ZHAOYUAN.github.io

## 项目简介

这个仓库是我用来练习创建网站的项目。它没有其他特殊的用途，主要作为个人学习和实验的平台。通过这个仓库，我在不断尝试和提升网页开发技能。

## 项目目的

- 学习 HTML、CSS、JavaScript 等前端技术。
- 熟悉 Git 和 GitHub 的使用。
- 练习如何通过 GitHub Pages 部署静态网站。

## 项目结构

- **index.html**: 网站的主页，包含一个用于显示日期的元素（`id="date_display"`）。
- **get_date.js**: JavaScript 脚本，调用 News API 获取最新文章时间作为日期、负责自动刷新以及失败时的回退处理。
- **README.md**: 项目说明文件。

## 使用说明

1. 克隆仓库到本地：
   ```bash
   git clone git@github.com:KANG-ZHAOYUAN/KANG-ZHAOYUAN.github.io.git
   ```

2. 本地运行：
   - 直接在浏览器中打开 `index.html`（部分浏览器可能限制跨域请求）。
   - 或使用简单 HTTP 服务器，例如：`python -m http.server 8000`，然后访问 `http://localhost:8000`。

---

## 网站功能

- 显示 “今天是：YYYY年MM月DD日”，日期来源于 News API（使用第一篇新闻的 `publishedAt` 字段）。
- 自动刷新：默认每 60 秒重新请求并更新页面（可在 `get_date.js` 中调整）。
- 失败回退：当请求失败或返回数据无效时，页面会显示：
  > 失败，显示本地时间：YYYY年MM月DD日（已停止自动刷新）
  并停止后续的自动刷新请求，避免触发 API 速率限制。
- 错误信息会输出到浏览器控制台，便于调试。

## 配置与注意事项

- 在 `get_date.js` 中设置 `api_key` 为你的 News API Key（在文件顶部）。
- 注意 News API 的请求配额与速率限制；减少刷新频率或使用缓存可以避免达限。
- 如需更改自动刷新的间隔，请修改文件中 `setInterval` 的间隔值（以毫秒为单位）。

---

## 故障排查 — 编码问题

如果页面出现中文乱码（例如看到不正常的符号而不是中文），通常是文件编码不匹配导致的。解决方法：

- 在代码编辑器（例如 VS Code）中确认并将所有项目文件（`index.html`、`get_date.js` 等）保存为 **UTF-8（无 BOM）**。
- 在 VS Code 中：右下角编码处点击 → 选择 “Reopen with Encoding” 验证内容 → 然后 “Save with Encoding” 选择 `UTF-8`。
- 若使用服务器，请确保服务器响应头包含 `Content-Type: text/html; charset=utf-8`。


