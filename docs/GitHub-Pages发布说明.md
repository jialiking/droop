# GitHub Pages 发布说明

## 当前状态（诊断）

| 项 | 状态 |
|----|------|
| 仓库 `jialiking/droop` | Public |
| `main` 代码 | 已推送（含 workflow） |
| Actions `build` | 成功 |
| Actions `deploy` | **失败**（`actions/deploy-pages@v4`） |
| Pages 站点 | **未创建**（`/repos/.../pages` 为 404） |
| `https://jialiking.github.io/droop/` | Site not found |

### 还差的唯一一步

**仓库 Settings → Pages → Build and deployment → Source 选 `GitHub Actions`**

（不是 “Deploy from a branch”）

然后：**Actions → Deploy to GitHub Pages → Re-run all jobs**  
（或在终端再 push 一个空提交触发 workflow）

成功后链接：

```text
https://jialiking.github.io/droop/
https://jialiking.github.io/droop/#/vertical-panorama
https://jialiking.github.io/droop/#/cockpit
```

## 本地已就绪

- MinGit：`D:\Soft\git-portable\mingit\cmd\git.exe`
- 构建：`npm run build` → `dist/`（`base: './'` + HashRouter，适配 Pages 子路径）
- 工作流：push `main` 即部署

## 注意

- 纯前端 + Mock，无后端
- 天地图 Key 在前端包内，仅 Demo 用途
- 「永久」依赖账号与仓库长期保留
