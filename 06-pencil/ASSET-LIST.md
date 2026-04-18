# ASSET-LIST · 迷人的老祖宗

> r-pencil 交接物的一部分（FW2 + FW7 依据）
> 列出所有 .pen 中用占位的视觉资产 + 真实资产出处 / 状态
> r-frontend 引用 ASSET_MISSING 注释的依据 · r-qa 验证资产完整度的依据
> MVP 阶段允许占位，上线前 MUST 由 visual-designer 补全

---

## 资产状态标记

- ✅ 已交付（真实 SVG/PNG 文件）
- ⚠️ 占位（本 .pen 用了视觉替代，r-frontend MUST 标 `<!-- ASSET_MISSING: [description] -->`）
- ❌ 缺失（连占位都没有）

---

## 批次 A 资产清单

| # | 资产 | 当前状态 | 本稿占位方案 | 真实资产规格 | 使用位置 | 负责方 |
|---|------|---------|-------------|------------|---------|--------|
| 001 | **Brand Logo** | ⚠️ 占位 | "祖"字 Source Han Serif SC 600 + 青瓷色方块（40/44/48 圆角 10-12）· fg=#FAF8F3 L / #1A1814 D | SVG Logomark + Logotype · 单色可 currentColor 驱动（优先）或双版本 Light/Dark · 支持 Logomark (只图标) + Logo (图标 + 文字) 两变体 | 所有页面顶栏（Home · Quiz · Cards · Wrong · Result）| visual-designer（未启动）/ 或用户命题 |
| 002 | **10 朝代插画（朝代图谱卡片内 + 答题页主视觉）** | ⚠️ 占位 | 🏛 emoji · 图谱卡不用插画（仅色块 + icon）· 答题页主视觉用 🏛 72/120/200px 单色 fill=accent-primary | 10 张矢量插画 · 线条感 + 少量纹理（PRODUCT.md 视觉气质约束，避免全水墨）· 每张一个朝代代表元素（夏=大禹治水、商=青铜/甲骨、周=钟鼎、秦=长城/兵马俑、汉=丝路/纸、三国=人物剪影、隋唐=胡服诗仙、宋=活字/市井、元=驿马/版图、明清=航海/宫殿）· 主尺寸 ~400×600（答题页左栏 40% @ 1024 = 410×655）· 单版本共用两模式（SC-TH8）· 答题页底部渐变遮罩由代码加 | 答题页朝代插画区（Mobile 顶 160h · Tablet 顶 240h · Desktop 左栏 410×655 全高）| visual-designer / 或采购 |
| 003 | **10 张知识卡缩略封面（卡册缩略区内嵌）** | ⚠️ 占位 | 米黄色块（level-cleared-bg #F1E0C4 L / #50351B D）占位 · 下方文字 "夏·人 / 商·器 / 周·事" | 10 张小图 · 每张 ~64×56（Mobile/Tablet）/ ~48×40（Desktop）· 与 #002 主插画风格一致 · 可以是主插画的裁剪/缩略版 | Home 页卡册缩略（三档）· 批次 B 的 Cards 页网格（2/3/5 列）| visual-designer |
| 004 | **10 张知识卡主视觉（卡详情浮层 · Result reveal）** | ⚠️ 占位（批次 B 已在 CardDetail + Result 稿使用） | 🏛 emoji · Mobile 150px · Tablet 180px · Desktop Modal 左栏 200px · Result 卡片 88/112/132px | 10 张大图 · 纵向构图（Desktop Modal 左栏 360×520 纵向）· Mobile 顶部图 375×300 · Tablet Modal 顶部 560×320 · Desktop 左栏 360×520 全高 · 与 #002 主插画风格一致 · 可以是 #002 主插画的特写 / 变体 | 批次 B · Card Detail 浮层（Mobile 全屏 · Tablet 560 Modal · Desktop 720 Modal 两栏左半栏）· Result 卡片 reveal 上半区 | visual-designer |
| 005 | **10 枚徽章图形（满分奖励）** | ❌ 缺失（批次 B 未绘制 perfect 变体；MVP 3 关 × 5 题达到 perfect 较稀缺）| — | SVG 徽章形状 · 用 currentColor + Token 驱动朱砂双模式切换 · 3 种稀有度 common/rare/legendary 对应 `rarity-{common\|rare\|legendary}-*` Token | Home 朝代卡 Perfect 态右上角 + Result 页满分阶段 3 徽章浮现 | visual-designer |
| 006 | **空态插画（卡册空 / 错题空）** | ❌ 缺失（批次 B 未绘制 empty 态，场景中用户已有数据）| — | 线条 SVG · currentColor 自适应 · ~200×200 · 儿童友好 · Cards 空 `cards_page.empty.*` · Wrong 空 `wrong.empty.*`（"太棒了"语气轻松不卖惨） | Cards 页空态 / Wrong 页空态 | visual-designer |
| 007 | **朝代顺序时间轴装饰**（桌面可选） | ❌ 缺失（本稿桌面端未加） | — | 可选装饰 · 朝代间连接线 / 时间标记 · 低调纹样 | Desktop Home 5×2 网格下方时间标记 | visual-designer（可选） |
| 008 | **Result 卡片入场背景装饰**（Desktop 可选） | ❌ 缺失 | 无（当前稿 Result Desktop 无装饰背景） | SVG 或 CSS 纹样 · 低透明度水墨质感 · 铺在 Stage 2 卡片周围（Schema §3 模块 C 提到 "加装饰性背景插画"） | Desktop Result 阶段 2 卡片 reveal 的背景装饰 | visual-designer（可选 · MVP 可延后） |

---

## 状态图标（Status Icon）

本批次 .pen 使用 Unicode 字符 + emoji 作为占位，r-frontend **建议用 lucide-icons 或自托管 SVG**：

| 位置 | 占位 | 推荐真实资产 | 理由 |
|------|------|------------|------|
| 关卡 Perfect 态 icon | `★` | lucide `star-filled` 或自制 | 稳定跨平台渲染 · 矢量 |
| 关卡 Cleared 态 icon | `✓` | lucide `check` | 同上 |
| 关卡 Active 态 icon | `▶` | lucide `play` | 同上 |
| 关卡 Locked 态 icon | `🔒` emoji | lucide `lock` | emoji 跨平台不一致 |
| Cards 入口 | `🗂` emoji | lucide `album` 或 `layout-grid` | 同上 |
| Lang 入口 | `🌐` emoji | lucide `globe` 或 `languages` | 同上 |
| Theme 入口 | `☀/☾` emoji | lucide `sun` / `moon` / `monitor` | 同上 |
| Back | `←` | lucide `arrow-left` / `chevron-left` | 同上 |
| WrongEntry 入口 | `👀` emoji | lucide `eye` | 同上 |
| Badge / Dropdown | `›` / `▾` | lucide `chevron-right` / `chevron-down` | 同上 |

**r-frontend 决策建议**：用 [lucide](https://lucide.dev/) 作为**唯一 icon 库**（FW7 防自造 SVG），按需 import。全部用 currentColor 自适应明暗主题。记入 IMPLEMENTATION-GUIDE 后续补充。

---

## 字体资产

| 字体 | 状态 | 本项目使用 | 加载方式 |
|------|------|----------|---------|
| Source Han Serif SC（思源宋体） | ⚠️ 需 Google Fonts 分片或系统 fallback | Display / 标题 / 朝代名 | `<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap">` + unicode-range 分片 · fallback Songti SC / SimSun |
| HarmonyOS Sans SC（鸿蒙） | ⚠️ 无 Google Fonts 分发，需自托管或 fallback | Body / 正文 | 优先 fallback Source Han Sans SC (思源黑体 via Noto Sans SC) · 系统 PingFang SC / Microsoft YaHei |
| Inter | ✅ Google Fonts 直接 | Numeric / 英文 | `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">` |

字体加载预算（SC-FZ）：MUST ≤ 4 西文文件 · 单 CJK 分片 < 100KB · 总 < 500KB（r-frontend 用 `unicode-range` 拆分按需加载）

---

## 资产目录建议（交给 r-frontend）

```
07-frontend/src/assets/
├── brand/
│   ├── logo.svg                      # #001
│   ├── logo-mark.svg
├── dynasties/
│   ├── illustrations/                # #002
│   │   ├── xia.svg
│   │   ├── shang.svg
│   │   ├── ... (10 张)
│   └── thumbnails/                   # #003
│       ├── xia-thumb.svg
│       ├── ... (10 张)
├── cards/                            # #004
│   ├── xia-card.svg
│   ├── ... (10 张)
├── badges/                           # #005
│   ├── perfect-star.svg
│   ├── ... (10 张可选)
├── empty-states/                     # #006
│   ├── cards-empty.svg
│   └── wrong-empty.svg
└── icons/
    └── 用 lucide-react/lucide-vue 按需 import 即可，不落地文件
```

---

## 资产准备时间线建议

- **MVP 首次上线**：Logo #001 + 10 朝代插画 #002（最低保真） + 10 张缩略 #003 必须有；其余可暂用占位
- **功能完整版**：补全 #004 卡详情主视觉 + #005 徽章 + #006 空态插画
- **完善体验版**：补 #007 装饰纹样

---

## r-frontend 引用 ASSET_MISSING 的规范

当 r-frontend 实现到某处需要资产（#001 - #006）时，在代码中：

```html
<!-- ASSET_MISSING: brand-logo-svg · 暂用占位字"祖"+青瓷方块，参见 ASSET-LIST #001 -->
<div class="logo-placeholder" aria-label="迷人的老祖宗 Logo">
  <svg class="logo-mark" .../>  <!-- 或简化占位 -->
</div>
```

**禁止**（FW2）：静默跳过资产缺口 / 用空 div 占位不注释。
