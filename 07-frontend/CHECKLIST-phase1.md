# Phase 1 CHECKLIST · 迷人的老祖宗 r-frontend

> Phase 1 范围：基础设施（i18n / store / router / theme / lang / toast / dialog）+ 首页（Welcome + Dynasty Map + Wrong Entry + Cards Preview）
> 基于 Schema v1（2026-04-17）+ IMPLEMENTATION-GUIDE 批次 A + SCHEMA-DELTA #001-011 裁决结果
> 产出时间：2026-04-17

---

## 0. 交付文件

| 文件 | 行数 | 大小 | 说明 |
|------|------|------|------|
| `dist/index.html` | 1100 | 50.5 KB | 含内联 locale-zh/en + quiz-meta JSON（FW5 全量内联） |
| `dist/style.css` | 1228 | 34.0 KB | Token + Reset + Header + Welcome + DynastyCard 四态 + WrongEntry + CardsPreview + Dialog + Button |
| `dist/app.js` | 930 | 36.6 KB | i18n / store / router / theme / lang / toast / dialog / header / home |

运行方式：
- `file://` 直接打开 `index.html`（零依赖）
- 或 `python3 -m http.server 8765` + `http://localhost:8765/index.html`

---

## 1. 按 FW10 每 Section ≥8 项核对

### 1.1 Header（顶栏）· Home 变体

- [x] 容器 bg = `var(--color-bg-primary)` + bottom border 1px `border-subtle`（IMPLEMENTATION-GUIDE 1.1）
- [x] **header 背景撑满视口宽（100vw）· 内部 `.app-header__inner` 在 1200 内居中**（2026-04-17 全屏 header/welcome 修复：`.page` 去除 max-inline-size；`.app-header__inner` 新增 `max-inline-size: var(--space-container-max); inline-size:100%; margin-inline:auto`）
- [x] 高度：M=56 / T=64 / D=72（style.css app-header__inner）
- [x] padding-x：M=16 / T=24 / D=32（逻辑属性 padding-inline）
- [x] LogoMark 40/44/48 方形 + radius-md / 12 + 青瓷 bg + 占位"祖"（含 `<!-- ASSET_MISSING: brand-logo-svg · ASSET-LIST #001 -->` 注释，FW2 合规）
- [x] Logo 文字：Mobile 隐藏 / Tablet 简写 `brand.name_short` / Desktop 完整 `brand.name`（双 span + CSS 可见性切换）
- [x] 工具按钮 3 个（Lang / Theme / Cards）触摸目标 ≥48（视觉 40 + ::before 扩展 -4 边距 = 48 虚拟区）
- [x] hover 样式在 `@media (hover: hover) and (pointer: fine)` 内（MF4）
- [x] `@media (hover: none) { :hover {重置} }` 防 sticky hover
- [x] Lang 按钮显示："Mobile 中/EN" / "Tablet 🌐 语言" / "Desktop 🌐 中 / EN"
- [x] Theme 按钮 3 态：light/dark/system · 图标 ☀/☾/⟳ · aria-pressed 标注
- [x] Cards 按钮有 `has-unread` class，条件显示红点（当 state.unreadCards > 0）
- [x] logo-group / tool-btn 100% 文案走 `t(key)`（I15 合规）

### 1.2 Welcome 欢迎区

- [x] 容器 bg = `bg-tertiary`（青瓷淡底）· 有父容器色差 ✅（N21）
- [x] **welcome 背景撑满视口宽（100vw）· 内部 `.welcome__inner` 在 1200 内居中**（2026-04-17 全屏 header/welcome 修复：`.welcome` 只保 `background + padding-block + min-block-size`；水平 padding 下沉到 `.welcome__inner`，加 `max-inline-size: var(--space-container-max); inline-size:100%; margin-inline:auto`；renderHome 在 section 内部包一层 `<div class="welcome__inner">`）
- [x] padding: 纵向 16/20/24 · 水平 16/24/32（下沉到 `.welcome__inner`）· min-block-size 88/104/120
- [x] 首访 vs 回访文案分支：首访 `welcome_first.title` + `body/body_mobile`；回访 `welcome_return.title` + `progress_summary` 拼接
- [x] Mobile 使用 `.welcome__body--mobile`（短版 body_mobile 或 progress_summary 单独）
- [x] Tablet+Desktop 使用 `.welcome__body--wide`（完整 body + progress_summary 拼接 "·"）
- [x] MC2 双 key 机制：locale 的 `home.welcome_first.body` + `body_mobile` 两份，HTML 各渲染一个 span，CSS 按断点切换显隐
- [x] `role="status" aria-live="polite"` · 播报变更
- [x] 标题字号 24/30/36 · body 14/15/16

### 1.3 Dynasty Map（朝代图谱）

- [x] Grid 布局：M=1 列 / T=2 列 / D=5 列（style.css dynasty-grid）
- [x] DynastyCard Mobile 横向 row（icon + name+era + badge 右）/ Tablet+Desktop 纵向 column（row 在顶 + badge 在底）
- [x] 5 态实现（Locked / Unlocked / Active / Cleared / Perfect），全部来自 `getDynastyState()`（state-machine §2）
- [x] Locked：灰底 + 🔒 icon + 灰字 + 无 badge + `aria-disabled="true"` + 点击弹 toast `locked_hint`
- [x] Unlocked：青瓷淡底 + 青瓷圆圈 + 数字 + "开始" badge 青瓷实心（本项目首关默认态）
- [x] Active：`level-active-bg` + 2px border + 呼吸动画 breathe 2.4s（`@media prefers-reduced-motion: reduce` 下禁用）
- [x] Cleared：`level-cleared-bg` 米黄 + 文化色 ✓ icon + "X/5" badge
- [x] Perfect：`level-perfect-bg` 粉陶 + ★ icon + "全对 ★" badge + 朱砂 glow（从 Token 取）
- [x] Cleared/Perfect 点击弹 ReplayConfirm 二次确认（默认焦点在"取消"）
- [x] `role="listitem"` + `aria-label="{name} · {status}"` 完整语义
- [x] 父容器 bg 对比：dynasty-card bg 与 section-dynasties bg（bg-primary）明显不同 ✅（N21）

### 1.4 WrongEntry（错题入口 · 条件渲染）

- [x] 仅当 `state.wrongQuestions.length > 0` 时渲染（state-machine §7）
- [x] 容器 bg = `state-danger-bg` + 圆角 16/20 · padding 16,20
- [x] 有父容器色差 ✅（N21）
- [x] 左侧 icon 👀 占位 + 主文字 `home.wrong_entry` + subtitle（仅 Desktop 显示）+ 右箭头 ›
- [x] Mobile/Tablet 不显示 subtitle（CSS `.wrong-entry__subtitle { display: none }`，Desktop 恢复 block）
- [x] 点击跳 `/wrong`
- [x] `<button>` 语义 + aria-label 含 count
- [x] 文案 100% 来自 locale key `home.wrong_entry` / `wrong.subtitle`

### 1.5 CardsPreview（卡册缩略）

- [x] 标题文案动态：有卡片用 `home.cards_hint`，无卡片用 `home.cards_hint_empty`
- [x] 右侧 "{unlocked}/10 已解锁" 仅 Desktop 显示（CSS .cards-preview__progress display:none + media query）
- [x] Mobile 5 张缩略 + 横滑溢出（SC-OV 合规：container 有 overflow-x: auto，child 有 flex-shrink:0 + fixed width 72px）
- [x] Tablet+Desktop 5 张 + `overflow-x: visible` + flex-wrap
- [x] 已解锁卡片：`bg-elevated` + 1.5px rarity-rare-border 文化色 + 封面色块（ASSET_MISSING 注释）
- [x] 未解锁卡片：`level-locked-bg` + 1.5px rarity-common-border 灰 + "?" 占位
- [x] "?" 占位图每项含 `<!-- ASSET_MISSING: card-thumb-{dynId} · ASSET-LIST #003 -->` 注释（FW2）
- [x] `role="list" / role="listitem"` 语义
- [x] 点击已锁定卡弹 toast `error.card_locked`；点击已解锁跳 `/card/{id}`

---

## 2. 基础设施

### 2.1 FW13 FOUC 防护

- [x] inline script 是 `<head>` 第一个可执行节点（第 26 行）· 早于 `<link rel="stylesheet">`
- [x] 读取顺序：localStorage.theme → prefers-color-scheme → 默认 light（SC-TH5）
- [x] 同步设置 `document.documentElement.setAttribute('data-theme', applied)` 避免闪烁
- [x] 同步设置 `lang`（navigator.language → zh/en）

### 2.2 FW12 Theme 切换

- [x] `<html data-theme="light|dark">` 切换，禁止 JS 直改 inline style（TH1）
- [x] CSS 两套变量块：`:root, [data-theme="light"]` + `[data-theme="dark"]`（TH2）
- [x] Semantic Token 全量两套（颜色 + shadow）
- [x] `transition` 白名单：color / background-color / border-color / fill / stroke，160ms（SC-TH7 / TM6）
- [x] 禁过渡 width/height/padding/margin/transform（TH6）
- [x] localStorage key: `theme`，值 `light / dark / system`（TH7）

### 2.3 FW14 Theme 按钮 3 态

- [x] 循环切换：light → dark → system → light
- [x] `aria-label` 含当前态名
- [x] `aria-pressed="true|false"`（system 时 false）
- [x] 键盘可用（原生 `<button>` 自带 Enter/Space）
- [x] 切换后 toast 播报

### 2.4 FW5 locale 全量内联

- [x] `<script type="application/json" id="locale-zh">` 完整 zh locale（17 KB）
- [x] `<script type="application/json" id="locale-en">` 完整 en locale（14 KB）
- [x] `<script type="application/json" id="quiz-meta">` quiz 元数据（1.5 KB）
- [x] `file://` 打开验证（无 fetch，纯内联读取）

### 2.5 i18n runtime

- [x] `t(key, vars)` 支持 `{var}` 替换
- [x] ICU plural `{count, plural, one {# x} other {# y}}` 英文有效
- [x] Missing key fallback：当前语言 → 英语 → 返回 key + console.warn（不是空字符串）
- [x] 禁止字符串拼接，所有复数参数化（如"共 N 题"走 plural key）

### 2.6 Router

- [x] hashchange 监听
- [x] `/` / `#/home` → home
- [x] `#/quiz/{dynId}` → quiz（Phase 2 占位）
- [x] `#/result/{dynId}` → result（Phase 2 占位）
- [x] `#/cards` → cards（Phase 3 占位）
- [x] `#/card/{id}` → card detail（Phase 3 占位）
- [x] `#/wrong[/{dynId}]` → wrong（Phase 3 占位）
- [x] 路由切换后 `window.scrollTo(0,0)`

### 2.7 localStorage Store

- [x] key: `charming-ancestors-progress-v1`（SC-AS4 约定）
- [x] 完整 schema：progress + unlockedCards + wrongQuestions + currentSession + unreadCards + lang + theme + version
- [x] try/catch 降级到内存态（隐私模式）+ toast `error.storage_unavailable`
- [x] 版本不匹配：清零 + toast `error.storage_reset`
- [x] 写入失败（quota）：toast `error.storage_full`

### 2.8 Dialog 基础

- [x] MidQuizPrompt 实现（触发条件：state.currentSession 存在）
- [x] ReplayConfirm 实现（点 cleared/perfect 朝代卡触发）
- [x] role=dialog / alertdialog + aria-modal=true + aria-labelledby/describedby
- [x] 焦点陷阱（Tab / Shift+Tab 在 dialog 内循环）
- [x] ESC 关闭（role=alertdialog 的 MidQuiz 也支持 ESC = keep session）
- [x] 背景点击关闭（非 alertdialog）
- [x] Mobile bottom sheet（slide-up 动画） / Tablet+Desktop modal 居中（scale-in）
- [x] 默认 autofocus 在主 CTA（ExitConfirm 默认"继续答题"最保守）
- [x] body 锁滚动 `overflow: hidden`

---

## 3. 响应式

- [x] Mobile-First CSS（base = 375px）+ `min-width` 媒体查询向上增强（C3）
- [x] 320px reflow 保护：`body { min-inline-size: 320px }` + `@media (max-width: 374px)` 收缩 gutter 到 12px（SC-BP5 / R3）
- [x] 所有方向属性用逻辑属性：margin-inline / padding-block / inset-block-start / min-inline-size / border-block-end（N1）
- [x] 触摸目标 ≥48px（视觉 40 + ::before -4 扩展 = 48）· MF3
- [x] clamp() 流体字号（--fs-display / --fs-h1 / --fs-h2 / --fs-h3）· R2
- [x] Mobile 重设计（MC1-5）：
  - 双 locale key：`welcome_first.body` vs `body_mobile`（MC2）
  - DOM 层可见性切换：`.welcome__body--mobile` vs `.welcome__body--wide`（MC1）
  - cards-preview__progress Mobile/Tablet 隐藏，Desktop 显示
  - wrong-entry__subtitle 仅 Desktop 显示

---

## 4. i18n

- [x] `<html lang>` 动态切换（I1）
- [x] CJK 行高覆盖：`:lang(zh) { line-height: 1.7 }` 单独选择器（I6 · 避开 feedback_css_lang_selector.md 陷阱）
- [x] 按钮使用 `min-inline-size: max-content` + padding（I5 · 文本膨胀安全）
- [x] 所有日期/数字/复数走 `t()` 的 plural（I4）
- [x] 翻译数据内联 HTML 而非 fetch（I8 · FW5）
- [x] data-i18n 元素内无嵌套 HTML（I9 · 所有文案用 `esc(t(key))` 作为纯文本）
- [x] FW6 zh + en 两语都 ✅ 来自 content-strategist（本项目 locale 文件已存在且非占位）

---

## 5. 无障碍

- [x] A2 Skip Link（第 47 行，`href="#main-content"` → main 上有对应 id）
- [x] A1 语义化标签：`<header role="banner"> / <main> / <section> / <footer>`
- [x] A3 heading 层级：h1（welcome title）→ h2（section-dynasties / cards-preview）
- [x] A5 `:focus-visible { outline: 3px solid ... }` 焦点可见
- [x] A6 原生 `<button>` 键盘自动可用（MidQuiz / ReplayConfirm / 朝代卡 / 顶栏按钮）
- [x] A8 `prefers-reduced-motion: reduce` 全局处理（duration 降为 80ms + active 卡片动画关闭 + dialog 动画缩短）
- [x] A9 原生 HTML 优于 ARIA：所有按钮用 `<button>` 而非 `<div role="button">`
- [x] 触摸/鼠标手势有点击替代（无手势专属操作）

---

## 6. 动画

- [x] M1 No-Motion-First：base 无动画；通过 media query 启用；reduce-motion 降级到 80ms
- [x] M2 仅动画合成属性：transform / opacity / box-shadow（active 呼吸）
- [x] M4 微交互 ≤200ms（hover）· 普通过渡 ≤500ms（dialog）· 禁止 >1000ms
- [x] M5 进入 ease-out（dialog-slide-up 用 spring-soft / fade-in 用 ease-out）· 退出 ease-in
- [x] 禁用 Framer Motion（零依赖项目，CSS only）· N3

---

## 7. MUST NOT 扫描

- [x] N1 无 left/right/top/bottom 物理属性（grep 确认）
- [x] N2 无 `@media max-width` 用于布局（除 320 reflow 保护的 374px 和响应式反向隐藏）
- [x] N3 无 Framer Motion / animation library
- [x] N4 无 animate width/height/margin/padding/font-size
- [x] N5 CJK 字体用系统 fallback（MVP）+ Google Fonts Noto Serif/Sans SC（未自定义 face，暂不需 unicode-range 分片，后续上生产字体时再补）
- [x] N6 无硬编码日期/数字格式（数量用 ICU plural，分数用 `{score}/5`）
- [x] N7 `:focus-visible` 自定义焦点而非 outline:none
- [x] N18 基于 IMPLEMENTATION-GUIDE + interaction-brief + state-machine 权威源实现，非想象
- [x] N19 无自加滚动入场动画（仅 dialog 入场 + active 呼吸 + 主题切换色彩过渡，均 Schema 授权）
- [x] N20 所有资产缺口都标 `<!-- ASSET_MISSING: ... -->`（Logo + 10 朝代插画 + 10 知识卡缩略）
- [x] N21 组件 bg token 与父容器 bg token 不同（welcome 用 bg-tertiary on bg-primary · dynasty-card 四态 bg 均不同 · wrong-entry 用 state-danger-bg · card-thumb 用 bg-elevated on section bg）
- [x] N22 无自造 border / divider（仅有 Schema 授权的 header border-block-end + dynasty-card--active 的 2px border-ring + card-thumb 1.5px border）
- [x] N23 Grid 卡片父容器无强制 align-items: stretch，但所有 grid 项 min-block-size 固定（72 / 140 / 140），Tablet+Desktop 等高（body Grid 隐式 stretch 默认）
- [x] N24 CSS 类名 vs HTML 类名双向扫描：所有 `.dynasty-card`、`.dynasty-card--*`、`.welcome__*`、`.tool-btn`、`.card-thumb`、`.wrong-entry` 等 CSS 选择器在 HTML 中都有对应渲染；无 orphan

---

## 8. 功能验证（浏览器手动）

| 测试 | Mobile 375 Light | Mobile 375 Dark | Tablet 768 | Desktop 1440 | 状态 |
|------|-------|-------|------|------|------|
| 首次访问渲染 | ✅ | ✅ | ✅ | ✅ | 通过 |
| welcome 文案分支（首访/回访） | ✅ | ✅ | ✅ | ✅ | 通过 |
| 朝代卡 5 态显示 | ✅ unlocked+9 locked | ✅ | ✅ | ✅ | 通过 |
| Locked 点击 toast hint | ✅ | - | ✅ | ✅ | 通过 |
| 点击夏朝跳 `#/quiz/xia` | ✅ | - | ✅ | ✅ | 通过（stub 页） |
| 语言切换中↔英 | ✅ | - | ✅ | ✅ | 通过（含 progress_summary + button label） |
| 主题循环 light→dark→system | ✅ | ✅ | ✅ | ✅ | 通过 |
| FOUC 防护（刷新无闪烁） | ✅ | ✅ | ✅ | ✅ | 通过 |
| Cards preview 横滑 Mobile | ✅ | ✅ | - | - | 通过 |
| Cards preview 弹出 toast 锁定 | ✅ | - | ✅ | ✅ | 通过 |

---

## 9. 未决 / 延后事项

1. **Quiz / Result / Card / Wrong / CardDetail 页**：Phase 2+3 实现
2. **朝代插画资产 #002 #004**：visual-designer 未交付，用 🏛 占位（答题页 Phase 2 将用到）
3. **Brand Logo #001**：用"祖"字占位
4. **知识卡缩略 #003**：用 "?" 占位
5. **徽章 #005**：Result perfect 态用 ★ 占位
6. **空态插画 #006**：Phase 3 错题空态/卡册空态需处理
7. **Lucide icons**：当前用 emoji（🔒 👀 🗂 🌐 ☀ ☾ ⟳ › ▶ ✓ ★）。MVP 后可替换为 lucide SVG 以跨平台一致
8. **文本膨胀**："Three Kingdoms" / "Movable Type & Markets" 等长英文在 Tablet 2×5 网格中有轻微裁切（box 允许，但文字可能贴边）。方案：Tablet 字号降 1px 或 CSS 增加 padding。Phase 3 polish 时再调
9. **字体 unicode-range 分片**：MVP 依赖 Google Fonts CDN，未自托管 subset。上线前补（F1 / SC-FZ2-3）
10. **真机 / 屏幕阅读器测试**：列入人工验证清单（HV5-6）

---

## 10. Phase 1 属性核对表（.pen 值 vs CSS 实现）

> 基于 IMPLEMENTATION-GUIDE.md 批次 A §1.1-1.5（.pen 值已由 r-pencil 固化到 token 映射表），CSS 实现对照核对。

| Section | 属性 | IMPLEMENTATION-GUIDE | style.css 实现 | 一致 |
|---------|------|---------------------|---------------|------|
| Header | 容器 bg | bg-primary + border-bottom 1px | L347-353 ✅ | ✅ |
| Header | 高度 M/T/D | 56/64/72 | L358-365 ✅ | ✅ |
| Header | padding-x | 16/24/32 | L358-365 via gutter vars | ✅ |
| LogoMark | 尺寸 | 40/44/48 | L381-398 ✅ | ✅ |
| LogoMark | radius | 10/10/12 | L386-397 ✅ | ✅ |
| Tool btn | 触摸目标 | ≥48 (视 40 + ::before) | L421-444 ✅ | ✅ |
| Welcome | bg | bg-tertiary | L538 ✅ | ✅ |
| Welcome | padding 组 | 16,20,24 / 20-24,24 / 24,32 | L539-550 ✅ | ✅ |
| Welcome | min-block-size | 88/104/120 | L540-550 ✅ | ✅ |
| Welcome | title 字号 | 24/30/36 | L553-560 ✅ | ✅ |
| DynastyGrid | cols | 1/2/5 | L599-608 ✅ | ✅ |
| DynastyGrid | gap | 12/20/20 | L602-608 ✅ | ✅ |
| DynastyCard | padding | 12,16 / 14 / 14 | L615,633 ✅ | ✅ |
| DynastyCard | min-block-size | 72/140/140 | L616,631 ✅ | ✅ |
| DynastyCard | border-radius | 16/16 | L617 via radius-lg | ✅ |
| DynastyCard Perfect | bg | level-perfect-bg | L655-657 ✅ | ✅ |
| DynastyCard Cleared | bg | level-cleared-bg | L659-662 ✅ | ✅ |
| DynastyCard Active | bg + 2px border | level-active-bg + level-active-ring | L664-668 ✅ | ✅ |
| DynastyCard Active | breathe 呼吸 | 2.4s infinite | L668-679 + reduced motion | ✅ |
| DynastyCard Locked | bg | level-locked-bg | L682-684 ✅ | ✅ |
| DynastyCard Icon | 尺寸 | 48/40/40 | L705-718 ✅ | ✅ |
| DynastyCard Icon Perfect | bg | accent-secondary | L719 ✅ | ✅ |
| DynastyCard Icon Cleared | bg | accent-cultural | L720 ✅ | ✅ |
| DynastyCard Badge | padding | 4,10 + radius-full | L773-783 ✅ | ✅ |
| WrongEntry | bg | state-danger-bg | L816 ✅ | ✅ |
| WrongEntry | 高度 | 72/88/88 | L815,825 ✅ | ✅ |
| WrongEntry | subtitle 仅 Desktop | ✅ 隐藏/显示切换 | L877-878 ✅ | ✅ |
| CardsPreview | padding | 24,16 / 20,24,40 / 20,32,40 | L890-901 ✅ | ✅ |
| CardThumb | 尺寸 M/D | 72×100 / 56×72 | L936-950 ✅ | ✅ |
| CardThumb | border | 1.5px rarity color | L941 ✅ | ✅ |

**一致率：100%**（Phase 1 覆盖范围）

---

## 11. 下一步

**Phase 2**：答题 + 结算
- 答题页（读 quiz-meta.json + locale quiz.questions）
- 反馈动效（发现感 / 得到感）
- 进度点
- MidQuizPrompt 已在 Phase 1 实现，Quiz 页将接入
- ExitConfirm
- 结算页分阶段 reveal
- 中途刷新恢复

**阻塞项**：无（所有 P0 locale 已在 Phase 1 读到）

**等待用户**：Phase 1 ACK 后开工 Phase 2
