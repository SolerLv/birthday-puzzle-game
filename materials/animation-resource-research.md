# GitHub 高星视觉与动画资源调研

这份调研用于下一步升级视觉，不要求一次性全部接入。当前项目已先接入 GSAP CDN，并保留 CSS 动画作为兜底。

## 推荐优先级

- GSAP：https://github.com/greensock/GSAP
- 用途：控制过关动画、药剂混合、符文发光、门锁打开
- 理由：约 25.4k stars，动画控制精细，适合当前这种纯静态网页

- lottie-web：https://github.com/airbnb/lottie-web
- 用途：加载 After Effects 导出的 JSON 动画，例如魔法火花、开门、药剂烟雾
- 理由：约 31.9k stars，Web/Android/iOS 都可用，适合后续找现成 Lottie 素材

- tsParticles：https://github.com/tsparticles/tsparticles
- 用途：魔法粒子、星尘、咒语释放、公共休息室环境动效
- 理由：约 8.9k stars，浏览器可用、可 CDN 引入，适合做轻量背景动效

- three.js：https://github.com/mrdoob/three.js
- 用途：3D 密室门锁、漂浮药瓶、立体符文
- 理由：约 113k stars，成熟度最高，但当前项目体量下会显著增加开发和调试成本

## 当前采用

当前版本先采用 GSAP 做过关动画增强，并保留 CSS 动画兜底。如果后续继续升级，建议按这个顺序：

1. 用 Lottie 替换“药剂混合”和“密室开门”动画
2. 用 tsParticles 增加咒语粒子和符文星尘
3. 只有在你想做 3D 门锁时再引入 three.js
