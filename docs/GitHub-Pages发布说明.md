# GitHub Pages 发布说明

## 产出

- 构建：`npm run build` → `dist/`（`base: './'` + HashRouter，可直接挂在子路径）
- 工作流：`.github/workflows/deploy-pages.yml`（push 到 `main` 自动部署）

## 步骤（一次性）

1. 在 GitHub 新建空仓库（建议 `fengdong-ops`，Public 以便免费 Pages）
2. 本地推送（本机 MinGit：`D:\Soft\git-portable\mingit\cmd\git.exe`）
3. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**
4. 推送后工作流会发布，永久链接形如：

```text
https://<github-username>.github.io/<repo-name>/
```

入口：

- 垂起全景：`https://<username>.github.io/<repo>/#/vertical-panorama`
- 驾驶舱：`https://<username>.github.io/<repo>/#/cockpit`

## 注意

- 站点为纯前端 + Mock，无后端
- 天地图 Key 打在前端包内，仅适合 Demo
- “永久”依赖 GitHub 账号与仓库长期保留

## 本地命令

```powershell
$git = "D:\Soft\git-portable\mingit\cmd\git.exe"
& $git init
& $git add .
& $git commit -m "chore: deploy fengdong ops prototype"
& $git branch -M main
& $git remote add origin https://github.com/<user>/<repo>.git
& $git push -u origin main
```
