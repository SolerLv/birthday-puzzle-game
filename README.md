# 斯莱特林密室试炼

一个可在手机浏览器中运行的静态生日解谜网页。网页只输出最终封印编号，真正礼品名写在实体兑换券中。

## 运行

使用 Codex 桌面自带 Node 或本机 Node 启动：

```powershell
node tools/serve.mjs
```

然后在这台电脑上打开 `http://localhost:4173`。

如果没有安装系统 Node，可用 Codex 运行时：

```powershell
& 'C:\Users\不 二\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/serve.mjs
```

## 实体券

见 [materials/printable-cards.md](materials/printable-cards.md)。最终兑换券请分别装入 `S-01` 到 `S-09` 信封，网页不会显示礼品名。

## 安卓和 iPhone 打开方式

`127.0.0.1` 和 `localhost` 只代表当前设备自己，所以手机不能直接打开电脑上的 `http://127.0.0.1:4173`。

最稳的方式是部署到 GitHub Pages：

1. 把 `birthday-puzzle-game` 目录作为一个 GitHub 仓库上传。
2. 在仓库 Settings -> Pages 中选择 GitHub Actions。
3. 推送到 `main` 分支后，`.github/workflows/pages.yml` 会自动部署。
4. 部署完成后，用 GitHub Pages 给出的 `https://用户名.github.io/仓库名/` 链接在安卓或 iPhone 浏览器打开。

本地临时测试也可以用局域网 IP，但需要电脑和手机在同一 Wi-Fi，并允许防火墙访问端口 `4173`。

## 私密五位封印码

当前默认封印码是 `13140`。要换成你们的私密数字，改 `src/game-data.js` 里的 `LOCK_DIGITS`，并同步修改 `materials/printable-cards.md` 里的五张数字券。

## 素材来源

见 [materials/asset-sources.md](materials/asset-sources.md)。

## 测试

```powershell
node --test tests/*.test.mjs
```
