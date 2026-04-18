# ASSET-HANDOFF · 迷人的老祖宗 r-frontend → visual-designer / 制图团队

> 基于 `06-pencil/ASSET-LIST.md` 的 8 项资产缺口清单，r-frontend 落成"可执行的规格需求单"。
> 视觉设计师 / AI 生图师 / 制图团队可按此单独立工作，完成后替换 r-frontend 在代码中标注的 `<!-- ASSET_MISSING: ... -->` 占位。
> 产出时间：2026-04-17（Phase 3 收尾）

---

## 总览

| # | 资产 | 状态 | 上线门槛 | 建议制作方 |
|---|------|------|---------|-----------|
| 001 | Brand Logo | ⚠️ 占位 | MVP 可保留"祖"字占位；**V1.0 上线前 MUST 替换** | AI + 设计师审校 / 或命题招标 |
| 002 | 10 朝代插画（答题页主视觉 / 图谱卡）| ⚠️ 占位（emoji 🏛）| MVP 可保留 emoji；V1.0 上线前 MUST 有线条稿 | visual-designer / AI 生成 + 人工调色 |
| 003 | 10 卡缩略（Cards 页网格）| ⚠️ 占位（色块）| MVP 可保留色块；V1.0 MUST 与 #002 同风格 | 同 #002 可复用裁剪 |
| 004 | 10 卡主视觉（CardDetail 浮层 / Result reveal）| ⚠️ 占位（emoji 🏛）| MVP 可保留；V1.0 MUST 有纵向图 | 同 #002 可复用/变体 |
| 005 | 10 枚徽章图形（满分奖励）| ❌ 缺失（Phase 3 未实现 BadgeList，见 CHECKLIST-phase3 FIX-P3-04）| MVP 延后；V1.0 功能完整版实现 | visual-designer / 图形设计师 |
| 006 | 空态插画（卡册空 / 错题空）| ⚠️ 占位（📖 / 🌱 emoji）| MVP 可保留；V1.0 建议替换（儿童友好线条 SVG）| visual-designer |
| 007 | 朝代顺序时间轴装饰（Desktop 可选）| ❌ 未实现（代码中无相关占位）| 可选 · 延后 | visual-designer 可选 |
| 008 | Result 卡片入场背景装饰（Desktop 可选）| ❌ 未实现 | 可选 · 延后 | visual-designer 可选 |
| ICN | Icon 库（当前 emoji 的上线替换）| ⚠️ 全部用 emoji | MVP 可保留；V1.0 建议切 lucide-icons | 前端直接换（无需设计） |
| FAV | Favicon | ❌ 缺失 | MVP 可缺；V1.0 MUST 有 | AI 生成 + 格式处理 |
| OG | OG / Social Card 预览图 | ❌ 缺失 | MVP 可缺；V1.0 分享场景需要 | AI 生成或设计 |

---

## i18n 完整性声明（FW6）

| 语言 | 状态 | 责任方 | 确认时间 | 备注 |
|------|------|--------|---------|------|
| **zh（简体中文）** | ✅ **母语专家产出** | content-strategist（母语中文）| 2026-04-17 | 题库 × 15 + card.story × 10 + card.badge × 10 + 全部 UI 文案约 80 key；语气符合 PRODUCT.md "老祖宗" 品牌声线（温和 · 不羞辱 · 儿童友好）|
| **en（英文）** | ✅ **独立重写（非逐字翻译）** | content-strategist（英文母语 / 双语能力）| 2026-04-17 | 非机翻；保留中文文化锚点（人名直译 + 附加解释），例 "Xia" 后加 "the Xia Dynasty"，"oracle bone script" 是完整英文词；适合 9-12 岁英文小学生阅读水平 |

**r-frontend MUST NOT 自造任何非英文文案**（项目硬约束 I10）。若 V1.1 追加语言（日 / 韩 / 西班牙 / 法），MUST 由 content-strategist 或本地化专家重新产出并经母语审校。

---

## 资产详细规格

### #001 Brand Logo

- **状态**：⚠️ 占位
- **当前实现**：HTML 中所有顶栏 logo（home variant）使用 `<span class="logo-mark">祖</span>` + CSS 青瓷色方块（40/44/48 圆角 10/10/12）+ `<span class="logo-text">迷人的老祖宗 / 老祖宗</span>`
- **HTML 标记**：
  - `dist/app.js` L525 + L535：`<!-- ASSET_MISSING: brand-logo-svg · 占位"祖"+青瓷方块，参见 ASSET-LIST #001 -->`
  - 出现位置：Home 顶栏、Cards 顶栏、Result 顶栏、Quiz 顶栏（共 5 个页面 + 所有 back variant header 共用）
- **真实资产规格**：
  - 格式：SVG（单色 `currentColor` 驱动优先）/ 或双版本（light 青瓷 `#4A7C74` + dark 薄荷 `#6FA89F`）
  - 变体：
    - **Logomark** 方块图标（仅图标 · 40 / 44 / 48 三个 DP）
    - **Logotype** 全尺寸品牌字（用于 Desktop 顶栏 · 大约 20-22px 高 / 含 Source Han Serif SC 600 "迷人的老祖宗" 五字）
    - 可选：Logomark + Logotype 组合横版（用于 OG / Social）
  - 色彩：见 PRODUCT.md 品牌色 Teal #4A7C74（强约束版）
  - 语义：体现"推开一扇门" · "温和的古老" · "儿童友好"，忌过于严肃 / 权威 / 博物馆风
- **文件命名**：
  - `dist/src/assets/brand/logo-mark.svg`（纯图标）
  - `dist/src/assets/brand/logo-horizontal.svg`（图标 + 横排品牌字）
  - `dist/src/assets/brand/logo-stacked.svg`（图标 + 下排品牌字）
- **建议制作方**：AI（Midjourney / Stable Diffusion）生成多版本 → 设计师筛选调整 → SVG 矢量化；或用户独立命题
- **AI prompt 建议**：
  - `minimal logo mark for a Chinese history learning app for kids 9-12, featuring a door / gate motif in celadon green, brushed paper texture minimal, vector flat style, friendly not stuffy, modern but respectful of tradition, 1:1 aspect`
- **上线门槛**：MVP 可保留占位；**V1.0 上线前 MUST 替换**（品牌识别最优先）

---

### #002 10 朝代插画（答题页主视觉 + 朝代图谱卡片）

- **状态**：⚠️ 占位
- **当前实现**：
  - 答题页主视觉：`dist/app.js`（见 renderQuiz 相关）— 🏛 emoji 72/120/200px 单色 `fill=accent-primary`
  - 朝代图谱卡片（Home 页）：Phase 1 的 DynastyCard 仅用色块 + status icon，不含插画
- **HTML 标记**：
  - Quiz 页：r-frontend 用 `<div class="dynasty-illust__emoji">🏛</div>` 占位（Phase 2 实现）
- **真实资产规格**：
  - 格式：SVG 矢量（首选）/ 或 PNG @2x @3x
  - 风格：**线条感 + 少量纹理**（PRODUCT.md 视觉气质约束，避免全水墨 / 全卡通）
  - 尺寸：
    - Mobile 顶部图：375 × 160
    - Tablet 顶部图：768 × 240
    - Desktop 左栏全高：410 × 655（答题页左栏 40% @ 1024）
  - 数量：10 张
    - 夏：大禹治水 / 洪水与河渠
    - 商：青铜鼎 / 甲骨
    - 周：钟鼎礼器 / 烽火
    - 秦：长城 / 兵马俑
    - 汉：丝绸之路 / 纸
    - 三国：人物剪影（刘关张 / 诸葛亮）
    - 隋唐：胡服诗仙（李白）
    - 宋：活字 / 市井
    - 元：驿马 / 广阔版图
    - 明清：航海 / 宫殿
  - **双主题**：单版本 SVG 共用（SC-TH8），底部渐变遮罩由代码加（已在 Quiz 页 CSS 实现）
- **文件命名**：
  - `dist/src/assets/dynasties/illustrations/xia.svg`
  - `dist/src/assets/dynasties/illustrations/shang.svg`
  - ...（10 张，文件名用朝代 slug）
- **建议制作方**：
  - 方案 A：visual-designer 团队统一风格 10 张（约 2-3 周）
  - 方案 B：AI 生成（Midjourney v6 / Flux）初稿 → 设计师统一色板 + 线条重绘
  - 方案 C：购买图库 + 二次加工（慎用，原作者版权）
- **上线门槛**：MVP 可保留 🏛 emoji；**V1.0 上线前 MUST 有至少前 3 关（夏 / 商 / 周，MVP 路径）的插画**

---

### #003 10 卡缩略（Cards 页网格）

- **状态**：⚠️ 占位
- **当前实现**：`dist/app.js` L1422-1425
  ```html
  <!-- ASSET_MISSING: card-tile-{dynId} · ASSET-LIST #003 -->
  <div class="card-tile__cover" aria-hidden="true">🏛</div>
  ```
- **HTML 标记**：`renderCardTile` L1424 · 出现 10 次（每朝代一次）
- **真实资产规格**：
  - 格式：SVG（首选）/ PNG
  - 尺寸：
    - Mobile：全宽 2 列 · 每卡 cover 高 110px · 图宽度 ~150
    - Tablet：3 列 · cover 高 120px
    - Desktop：5 列 · cover 高 130px
  - 风格：与 #002 一致，是 #002 主插画的**裁剪或缩略版**（复用同源资产，省 50% 工作量）
  - 比例：横向（width > height）适合 cover 区
  - 数量：10 张
- **文件命名**：`dist/src/assets/dynasties/thumbnails/xia-thumb.svg` ...
- **建议制作方**：与 #002 同制作方 · 可由 AI 从 #002 大图自动裁剪生成初稿
- **上线门槛**：MVP 可保留色块；V1.0 建议有全套 10 张

---

### #004 10 卡主视觉（CardDetail 浮层 + Result reveal）

- **状态**：⚠️ 占位
- **当前实现**：
  - CardDetail 浮层 cover：`dist/app.js` L1476-1477 · 🏛 emoji 120/140/160px
  - Result Stage 2 卡片 cover：`dist/app.js` L1282-1283 · 🏛 emoji
- **HTML 标记**：
  - `renderCardDetail` L1476：`<!-- ASSET_MISSING: card-main-{cardId} · ASSET-LIST #004 -->`
  - `renderResult` L1282：同上
- **真实资产规格**：
  - 格式：SVG / PNG @2x @3x
  - 尺寸：
    - Mobile CardDetail：375 × 300（cover 全宽 · block-size 300）
    - Tablet Modal：560 × 320
    - Desktop Modal 左栏：360 × 520（纵向构图）
    - Result Stage 2 卡片 cover：M 335×180 / T 400×224 / D 440×252
  - 风格：与 #002 一致，**纵向构图**（Desktop Modal 左栏是 360×520 纵向大图）
  - 数量：10 张（可以是 #002 的纵向特写变体，同资产不同裁剪）
- **文件命名**：`dist/src/assets/cards/xia-card.svg` ...
- **建议制作方**：同 #002
- **上线门槛**：MVP 可保留；V1.0 MUST 有纵向版

---

### #005 10 枚徽章图形（满分奖励）

- **状态**：❌ 缺失（Phase 3 BadgeList 组件未实现，见 CHECKLIST-phase3 FIX-P3-04）
- **当前实现**：仅有 ★ Unicode 字符占位
  - Home DynastyCard Perfect 态：★ 在 StatusIcon 圆中（Phase 1）
  - Result Stage 2 Perfect 态卡右上角：★ 在 `.result-card__badge` 中（Phase 2）
- **HTML 标记**：暂无独立的 badge 组件，徽章视觉内嵌在朝代卡 / Result 卡中
- **真实资产规格**：
  - 格式：SVG（单色 `currentColor` 驱动，两模式切换）
  - 尺寸：
    - 小尺寸（卡角标）：24-40px
    - 大尺寸（Result Stage 3 浮现）：48-72px
  - 设计：**三种稀有度**（common / rare / legendary）对应 `rarity-{common|rare|legendary}-*` Token
  - 数量：10 枚（每朝代一枚 · 主题对应朝代代表元素）：
    - 夏：治水章（水波纹 / 河流）
    - 商：甲骨章（龟壳纹）
    - 周：礼乐章（钟鼎纹）
    - 秦：一统章（长城垛）
    - 汉：丝路章（骆驼 / 丝绸）
    - 三国：智谋章（羽扇 / 书卷）
    - 隋唐：诗心章（笔墨）
    - 宋：活字章（方块字印）
    - 元：远行章（马蹄）
    - 明清：远航章（宝船）
  - locale 已有名字 + 故事：`card.badge.{dyn}.name / story` 两语 10 条
- **文件命名**：`dist/src/assets/badges/xia-badge.svg` ...
- **建议制作方**：visual-designer / 图形设计师（徽章风格需要专业度）
- **上线门槛**：MVP 可延后（Phase 3 的 perfect 卡右上角用 ★ 字符可接受）；V1.0 功能完整版实现时 MUST 补

---

### #006 空态插画（卡册空 / 错题空）

- **状态**：⚠️ 占位（emoji）
- **当前实现**：
  - Cards 页空态：📖 emoji 88/104px · `dist/app.js` L1361
  - Wrong 页空态：🌱 emoji 88/104px · `dist/app.js` L1575
- **HTML 标记**：
  - `<!-- ASSET_MISSING: empty-cards · ASSET-LIST #006 -->` L1360
  - `<!-- ASSET_MISSING: empty-wrong · ASSET-LIST #006 -->` L1574
- **真实资产规格**：
  - 格式：SVG 线条（`currentColor` 自适应明暗）
  - 尺寸：200 × 200（CSS 中 `.empty-illust` 约束）
  - 风格：**儿童友好** · 轻松不卖惨（Wrong 空态文案是"太棒了"不"没有错题"）
  - 数量：2 张（cards-empty + wrong-empty）
- **文件命名**：
  - `dist/src/assets/empty-states/cards-empty.svg`（空册子 / 待探索）
  - `dist/src/assets/empty-states/wrong-empty.svg`（小苗 / 鼓励继续）
- **建议制作方**：visual-designer（2 张小工作量 · 半天）
- **上线门槛**：MVP 可保留 emoji；V1.0 建议替换（儿童友好线条 SVG 能显著提升体验感）

---

### #007 朝代顺序时间轴装饰（Desktop 可选）

- **状态**：❌ 未实现（代码中无占位）
- **当前实现**：Home Desktop 5×2 网格下方无装饰，朝代卡之间无连接线
- **HTML 标记**：无
- **真实资产规格**：
  - 格式：SVG 纹样 / 或 CSS pseudo element
  - 风格：低调纹样 · 朝代间的细连接线 · 时间标记（"-2070"  "BC 1600" "BC 1046" 等）
  - 可选性：**可选**（MVP 不需要，V2 优化阶段考虑）
- **建议制作方**：visual-designer 可选
- **上线门槛**：**可延后 · 非必需**

---

### #008 Result 卡片入场背景装饰（Desktop 可选）

- **状态**：❌ 未实现
- **当前实现**：Result Desktop Stage 2 卡片周围无背景装饰
- **HTML 标记**：无
- **真实资产规格**：
  - 格式：SVG 纹样 / CSS 纹理
  - 风格：低透明度水墨质感 · 铺在 Stage 2 卡片四周（Schema §3 模块 C）
  - 可选性：**可选**（MVP 不需要）
- **建议制作方**：visual-designer 可选
- **上线门槛**：**可延后 · 非必需**

---

### ICN Icon 库（emoji 上线替换）

- **状态**：⚠️ 全部用 emoji
- **当前使用的 emoji 清单**：
  - 状态图标：`★` `✓` `▶` `🔒`（Home 朝代卡 4 态 · Phase 1）
  - 顶栏工具：`🌐`（语言）`☾ / ☀ / ⟳`（主题三态）`🗂`（卡册）· Phase 1
  - 返回：`←`（所有 back variant）
  - WrongEntry：`👀`（Home 页错题入口）· Phase 1
  - 箭头：`›` `▾` `→`（各种 CTA / 折叠）
  - 占位主视觉：`🏛`（朝代插画 / 卡主视觉 / 卡缩略，见 #002 #003 #004）
  - 空态：`📖` `🌱`（见 #006）
- **建议真实资产**：**[lucide-icons](https://lucide.dev/)**（FW7 唯一 icon 库）
  - `star-filled` / `check` / `play` / `lock`
  - `globe` / `languages` / `sun` / `moon` / `monitor` / `album` / `layout-grid`
  - `arrow-left` / `chevron-left` / `eye` / `chevron-right` / `chevron-down`
- **切换方式**：
  - 原生 HTML + JS 可用 `<svg><use href="/icons/lucide.svg#star-filled"/></svg>` sprite 方案
  - 或直接把 lucide SVG 内联进 HTML（当前纯 HTML + app.js 架构推荐）
- **上线门槛**：MVP 可保留 emoji（跨平台渲染差异是已知风险）；V1.0 建议切 lucide 以保证 iOS / Android / Windows / Mac 一致性
- **注意**：切换时 MUST 由 r-pencil 先在 .pen 更新 icon 集（FW2 + PA2），不要 r-frontend 自行内联未授权的 SVG（I11 约束：r-frontend 自造内联 SVG MUST 在 ASSET-HANDOFF 中标 ⚠️ 占位）

---

### FAV Favicon

- **状态**：❌ 缺失（index.html 无 favicon link）
- **真实资产规格**：
  - 格式：
    - `favicon.ico`（16×16 / 32×32 多尺寸合并）
    - `favicon-192.png`（Android）
    - `favicon-512.png`（Android splash）
    - `apple-touch-icon.png`（180×180 iOS）
    - `favicon.svg`（现代浏览器，可 currentColor）
  - 设计：Logo 的方图版本（同 #001 Logomark）
- **上线门槛**：MVP 可缺（浏览器显示默认灰块）；V1.0 MUST 有（专业度）
- **建议制作方**：从 #001 SVG 用 [realfavicongenerator.net](https://realfavicongenerator.net) 一键生成

---

### OG OG / Social Card 预览图

- **状态**：❌ 缺失
- **真实资产规格**：
  - 格式：PNG
  - 尺寸：1200 × 630（Facebook / Twitter Card 通用）
  - 内容：Logo + 品牌字"迷人的老祖宗" + slogan "推开一扇门，看见一个老祖宗"
  - 可选：加视觉装饰（#002 中某朝代插画缩略）
- **HTML 引用**：
  ```html
  <meta property="og:image" content="https://yoursite.com/og-card.png">
  <meta property="og:title" content="迷人的老祖宗">
  <meta property="og:description" content="面向 9-12 岁小学生的中国古代历史答题闯关">
  ```
- **上线门槛**：MVP 可缺；V1.0 分享场景（微信 / 朋友圈 / Twitter）需要
- **建议制作方**：visual-designer 从 Logo + 插画组合 · 半天工作量

---

## 资产目录建议（交给 r-frontend 后续）

```
07-frontend/dist/src/assets/
├── brand/
│   ├── logo-mark.svg                    # #001
│   ├── logo-horizontal.svg
│   └── logo-stacked.svg
├── dynasties/
│   ├── illustrations/                   # #002
│   │   ├── xia.svg
│   │   ├── shang.svg
│   │   └── ... (10 张)
│   └── thumbnails/                      # #003
│       ├── xia-thumb.svg
│       └── ... (10 张)
├── cards/                               # #004
│   ├── xia-card.svg
│   └── ... (10 张)
├── badges/                              # #005
│   ├── xia-badge.svg
│   └── ... (10 枚)
├── empty-states/                        # #006
│   ├── cards-empty.svg
│   └── wrong-empty.svg
├── icons/
│   └── lucide.svg                       # ICN · sprite 合集
├── social/
│   ├── og-card.png                      # OG
│   └── og-card-xia.png                  # 可选：不同朝代版本
└── favicon/
    ├── favicon.ico
    ├── favicon.svg
    ├── favicon-192.png
    ├── favicon-512.png
    └── apple-touch-icon.png
```

---

## 资产替换流程（当 visual-designer 交付后）

1. **替换前检查**：
   - SVG 用 SVGO 压缩
   - PNG 用 tinypng / squoosh 压缩
   - 确保 light/dark 适配（单版本 SVG `currentColor` 或双版本）
2. **r-frontend 替换**：
   - 找到 `<!-- ASSET_MISSING: xxx -->` 注释（全文件 grep `ASSET_MISSING`）
   - 替换对应占位 DOM 为 `<img src="src/assets/.../xxx.svg" alt="..." loading="lazy">` 或 `<svg>...</svg>` 内联
   - `alt` 属性 MUST i18n（随 `lang` 变化，取 `t('xxx')` 对应 key；locale 需新增对应资产的 alt key）
   - 删除对应 `ASSET_MISSING` 注释
3. **r-qa 核对**：
   - 布局无塌陷 / 图片无拉伸
   - light/dark 模式两套颜色都协调
   - 移动端 / 平板 / 桌面三档响应式 OK
   - loading="lazy" 生效（首屏图除外）
   - 加上 CLS 预留（`inline-size` + `block-size` 属性或 CSS aspect-ratio）

---

## 资产准备时间线建议

| 阶段 | 资产 | 必需程度 | 预估工作量 |
|------|------|---------|------------|
| **MVP 首次上线** | #001 Logo（可用 AI 初稿）· #002 前 3 关插画（夏 / 商 / 周）· FAV | 必需 | 1-2 周 |
| **V1.0 功能完整** | #002 剩余 7 关 · #003 10 张缩略（从 #002 裁剪）· #004 10 张主视觉 · #005 10 枚徽章 · #006 2 张空态 · OG · ICN 切 lucide | 推荐 | 3-4 周 |
| **V1.1 完善体验** | #007 时间轴装饰 · #008 Result 装饰 | 可选 | 1 周 |
