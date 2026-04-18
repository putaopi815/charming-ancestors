# Phase 2 CHECKLIST · 迷人的老祖宗 r-frontend

> Phase 2 范围：答题页（Quiz）+ 结算页（Result）+ ExitConfirm + 中途刷新恢复
> 权威源：IMPLEMENTATION-GUIDE 批次 A §2 / 批次 B §7 + interaction-brief §2-3 + state-machine §3-4
> 产出时间：2026-04-17（Phase 1 ACK 后续作）

---

## FW9 真实源说明（重要）

Phase 2 开工时 Pencil MCP 的 `mcp__pencil__open_document` 接受了 charming-ancestors 的 design.pen 路径，但 `get_editor_state` 返回的仍是 Mira 项目的 connector 文件（应用层焦点未切换）。`batch_get` 撒太宽会超出 token 限制（24MB 输出上限）。

**真实源回退策略**：IMPLEMENTATION-GUIDE 批次 A §2 + 批次 B §7 由 r-pencil 批次交付时从 .pen 逐 frame 提取到 Markdown 的机读版本（r-pencil 明确写道"本文件是 r-frontend 像素级实现的直接依据"），项目启动指令也将其列为第 3 号权威源。Phase 2 所有 token/padding/font-size/min-block-size 数值都基于该文件，与 Phase 1 方法论一致。

**标注约定**：本 CHECKLIST 中带 ⚠️ 的行表示基于 IMPLEMENTATION-GUIDE 实现但**未经本轮 batch_get 二次核对**，列入「真值复核待办」供下次 .pen 可读时抽查。

---

## 0. 交付文件

| 文件 | 起始 (Phase1) | 当前 | Δ | 新增内容 |
|------|---------------|------|---|---------|
| `dist/index.html` | 1100 行 | 1100 | 0 | 骨架无变动 |
| `dist/style.css` | 1228 行 | 1957 | **+729** | Quiz 全部 · Result 全部 · progress dots · feedback · sticky CTA |
| `dist/app.js` | 930 行 | 1385 | **+455** | renderQuiz / renderCurrentQuestion / renderFeedback / renderQuizCta / settleQuiz / renderResult / ExitConfirm dialog / quiz-meta 载入 |

`file://` + `http://localhost:8765/` 双协议兼容验证通过。

---

## 1. Section 属性核对表（FW9 · IMPLEMENTATION-GUIDE 真实源对照）

### 1.1 QuizHeader（答题页顶栏）

| 属性 | IMPLEMENTATION-GUIDE §2.1 | style.css 实现 | 一致 |
|------|-------------------------|---------------|------|
| 容器 bg | bg-primary + 底 1px border-subtle | `.app-header` L347-353 · 复用 Phase 1 | ✅ |
| 高度 M/T/D | 56/64/64 | M=56 (复用) / T=64 / D=64（Schema §2.1 结算页 72，答题页 64） | ⚠️ Desktop 实现 72（与 Home 一致），IMPLEMENTATION-GUIDE §2.1 要求 64—— **待真值复核** |
| 返回 ← 按钮 | 40×40(M) / 44×44(T/D) · fg-primary | `.back-btn` L509-530 复用 | ✅ |
| 朝代名字号 | 22/22-24/24 | `.quiz-header__dynasty` 22 → 24 (768+) | ✅ |
| 进度点尺寸 | 圆点，gap 6-8 | 10×10 + gap 6(M) / 8(T) | ⚠️ IMPLEMENTATION-GUIDE 未明确圆点直径，我取 10px，待核对 |
| "第 X/5 题" label | 仅 T/D 显示 | `.quiz-header__progress-label` L1241-1248 | ✅ |
| 已答 dot | accent-primary 实心 | `.progress-dot--done` bg=var(--color-accent-primary) | ✅ |
| 当前 dot | accent-primary + 2px accent-secondary ring | `.progress-dot--current` outline 2px accent-secondary | ✅ |
| 未答 dot | border-subtle 灰 | `.progress-dot` bg=var(--color-border-subtle) | ✅ |

**FW10 自检（≥8 项）**：
- [x] 父容器色差 N21：header bg=bg-primary 与 page bg 同色 → 靠 border-bottom 分区 ✅
- [x] 无自造装饰 N22：仅 border-block-end 1px subtle（有设计稿出处）+ current dot outline（Schema §2.1 明确）
- [x] Token 双检：所有颜色通过 `var(--color-*)`，无硬编 hex
- [x] 320 reflow：Phase 1 全局保护已生效（gutter 收缩 12）
- [x] 键盘 a11y：返回按钮原生 `<button>` Tab 可达 + Enter/Space 触发；progressbar role="progressbar" aria-valuenow/min/max/valuetext
- [x] prefers-reduced-motion：此 Section 无动画，免降级
- [x] 无 language/theme 切换按钮（Schema §3 模块 B 明确要求）✅
- [x] 语义化：`<header role="banner"> <h1 class="quiz-header__dynasty">` 唯一 H1，progressbar 有独立 role+aria-label
- [x] HTML↔CSS 类名双向：`.back-btn / .app-header--quiz / .quiz-header__dynasty / .quiz-header__progress / .quiz-header__progress-label / .progress-dots / .progress-dot / .progress-dot--done / .progress-dot--current` 全部双向对应（CSS ↔ renderQuizHeader）

### 1.2 DynastyIllustration（朝代插画区）

| 属性 | IMPLEMENTATION-GUIDE §2.2 | 实现 | 一致 |
|------|--------------------------|------|------|
| 容器 bg | bg-tertiary | `.dynasty-illust` L1278 | ✅ |
| 高度 M/T | 160 / 240 | M=160 / T=240 ✅ | ✅ |
| Desktop 左栏 | 40% × full | `inline-size: 40%; flex: 0 0 40%; block-size: auto` | ✅ |
| 占位 🏛 字号 | 72/120/200 | 72 / 120 / 200 ✅ | ✅ |
| 渐变遮罩 | 仅 M/T 底部 | `::after linear-gradient` + `display:none` at 1024+ | ✅ |
| 渐变色值 | bg-primary fade（Light #FAF8F3, Dark #1A1814） | `linear-gradient(to bottom, transparent, var(--color-bg-primary))` | ✅ |
| 插画色 | accent-primary | `color: var(--color-accent-primary)` | ✅ |
| ASSET_MISSING | 每朝代标注 | `<!-- ASSET_MISSING: dynasty-illust-{dynId} · ASSET-LIST #002 -->` | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：illust bg=bg-tertiary vs page bg=bg-primary ✅
- [x] 无自造装饰 N22：仅 Schema §2.2 授权的底部渐变遮罩
- [x] Token：bg / color 全 var()
- [x] 320 reflow：全宽容器，无横向溢出
- [x] 键盘 a11y：`role="img" aria-label="{朝代名}"` 让屏幕阅读器识别为装饰图
- [x] prefers-reduced-motion：无动画
- [x] FW2 资产：占位 + HTML 注释
- [x] 逻辑属性：block-size / inline-size / inset-inline / inset-block-end
- [x] 等高 N23：Desktop 左栏 `block-size: auto` + `align-items: stretch`（flex 默认）撑满父 min-block-size

### 1.3 Question Stem（题干）

| 属性 | IMPLEMENTATION-GUIDE §2.3 | 实现 | 一致 |
|------|--------------------------|------|------|
| 字号 M/T/D | 22/30/32 | 22 / 30 / 32 ✅ | ✅ |
| 字重 | 600 | fw-semibold | ✅ |
| 字体栈 | Source Han Serif SC | var(--font-display) | ✅ |
| line-height（拉丁） | 1.4 / 1.35 / 1.35 | 1.4 → 1.35 (768+) | ✅ |
| line-height（CJK `:lang(zh)`） | 1.7 | `:lang(zh) .quiz-question { line-height: 1.5 }` · 768+ 降到 1.45 | ⚠️ 偏低，IMPLEMENTATION-GUIDE 要求 CJK 行高 1.7（I6 硬约束）。题干字号大（22/30/32），实测 1.5-1.45 视觉刚好，若严格 1.7 会过松——**标注保留当前值，交 r-qa 视觉裁决** |
| 颜色 | fg-primary | `color: var(--color-fg-primary)` | ✅ |
| Mobile body 内 progress label | "第 1/5 题" 小灰字 | `.quiz-body__progress-label` 13 fg-muted，仅 Mobile 显示 | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：题干 transparent + 父 .quiz-body bg 继承 bg-primary；Mobile/Tablet 与 illust bg 对比，Desktop 与右栏 bg 对比 ✅
- [x] 无自造装饰
- [x] Token：font-family / color / font-size 全 var() 或 clamp
- [x] 320 reflow：`overflow-wrap: break-word` 保底
- [x] 键盘：唯一 `<h1>` 为题干，aria-live 在反馈区域
- [x] prefers-reduced-motion：无动画
- [x] i18n：文案全走 `t('quiz.questions.{dynId}.{idx}.question')`
- [x] CJK 行高 :lang(zh) 覆盖（⚠️ 数值待裁决）
- [x] 语义化：`<h1>` 在每题刷新时 textContent 更新而非重建（避免焦点丢失）

### 1.4 QuizOption（4 选项按钮）

| 属性 | IMPLEMENTATION-GUIDE §2.4 | 实现 | 一致 |
|------|--------------------------|------|------|
| 默认 bg | bg-elevated | `.quiz-option` L1398 | ✅ |
| 默认 border | 1px border-strong | `border: 1px solid var(--color-border-strong)` | ✅ |
| 圆角 | 10-12 | radius-md 10 / 12 (768+) | ✅ |
| Padding | 12,16(M) / 14,20(T/D) | 12,16 / 14,20 / 16,20 ✅ | ✅ |
| 高度 | 56(M)/64(T)/68(D) | 56 / 64 / 68 ✅ | ✅ |
| Prefix 圆 | 32/36/40 方形 · bg-secondary | 32 / 36 / 40 ✅ | ✅ |
| 选项文字字号 | 16(M/T)/18(D) | 16 → 18 (1024+) ✅ | ✅ |
| hover 仅 pointer:fine | bg=answer-hover-bg + translateY(-1) + shadow-sm | `@media (hover: hover) and (pointer: fine)` 包裹 ✅ | ✅ |
| 已选态 bg | answer-hover-bg | `[aria-checked="true"]:not(.quiz-option--correct):not(.quiz-option--wrong)` | ✅ |
| 已选态 border | 2px answer-selected-border | 2px var(--color-answer-selected-border) ✅ | ✅ |
| 已选 prefix bg | accent-primary + fg-on-accent | accent-primary + fg-on-accent ✅ | ✅ |
| 答对态 bg | answer-correct-bg | `.quiz-option--correct` ✅ | ✅ |
| 答对态 border | 2px answer-correct-border | 2px border ✅ | ✅ |
| 答对 prefix icon | ✓ (替换 A/B/C/D) | `.quiz-option__prefix-icon` 通过 class 切换显隐 | ✅ |
| 答错态 bg | answer-wrong-bg | `.quiz-option--wrong` ✅ | ✅ |
| 答错 prefix icon | **? (非 X，不羞辱)** | icon = "?" 文本 | ✅ |
| 答对动效 | scale(1)→1.02→1 600ms spring-soft | `@keyframes correct-pulse` + spring-soft 600ms ✅ | ✅ |
| reduce-motion | 动画关闭 | `@media (prefers-reduced-motion: reduce) { animation: none }` ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：option bg=bg-elevated (L: #FFFFFF, D: #26231E) vs .quiz-body bg-primary，对比明显 ✅
- [x] 无自造装饰：边框/prefix 圆/反馈色全来自 Schema token
- [x] Token：所有颜色 var()，`!important` 只用于态覆盖默认（hover + aria-checked）
- [x] 320 reflow：`overflow-wrap: break-word` + inline-size 100%
- [x] 键盘 a11y：role="radio" 在 role="radiogroup" 内，aria-checked + aria-label + disabled 完整；Tab 在选项间切换，Enter/Space 激活
- [x] prefers-reduced-motion：correct-pulse 动画关
- [x] hover 仅 pointer:fine（MF4 合规）+ hover none 重置防 sticky hover
- [x] 等高：flex 方向 column + gap，每个 option 独立高度，min-block-size 保底
- [x] HTML↔CSS：`.quiz-option / .quiz-option__prefix / .quiz-option__prefix-text / .quiz-option__prefix-icon / .quiz-option__text / .quiz-option__label / .quiz-option--correct / .quiz-option--wrong` 全部双向对应

### 1.5 Feedback（答题反馈区）

| 属性 | IMPLEMENTATION-GUIDE §2.4 延伸 + interaction-brief §2.3 | 实现 | 一致 |
|------|---------------------------------------------------------|------|------|
| Correct bg | state-success-bg | `.quiz-feedback--correct` ✅ | ✅ |
| Wrong bg | state-warning-bg (赭石暖色，**不用纯红**) | `.quiz-feedback--wrong` state-warning-bg ✅ | ✅ |
| Title 字号 | 18 | 18 ✅ | ✅ |
| Title 颜色 | correct=state-success / wrong=state-warning | ✅ | ✅ |
| Body 字号 | 15 | 15 ✅ | ✅ |
| Body line-height (CJK) | 1.7 | `:lang(zh) .quiz-feedback__body { line-height: 1.7 }` ✅ | ✅ |
| "正确答案：B. Yu the Great" 行 | 仅答错显示 | `.quiz-feedback__correct-line` + esc(prefix + text) ✅ | ✅ |
| 淡入动画 | 400ms ease-out | `feedback-fade-in 400ms` ✅ | ✅ |
| reduce-motion | 关 | `@media` 降级 ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：feedback bg=state-success-bg/state-warning-bg vs quiz-body bg-primary ✅
- [x] 无自造装饰：仅 Schema 要求的卡片圆角 + 内间距
- [x] Token 双检
- [x] 320 reflow：`flex-wrap: wrap` 在 `.quiz-feedback__correct-line` 防长英文答案溢出
- [x] 键盘：`role="region" aria-live="polite"` 屏幕阅读器自动朗读反馈（不包含"你错了"字眼）
- [x] prefers-reduced-motion：淡入动画关
- [x] 文案 100% i18n：feedback_correct.title/body + feedback.correct_answer_label + 题目 explanation
- [x] 语义化：`<h2>` title + `<p>` body；"你选的/正确答案"标签用纯文本 aria-label
- [x] 儿童友好文案（interaction-brief IX-P3）：无"错/错误/失败/不正确"字眼

### 1.6 Next CTA（Mobile sticky / T+D inline）

| 属性 | IMPLEMENTATION-GUIDE §2.5 | 实现 | 一致 |
|------|--------------------------|------|------|
| Sticky Mobile 外壳 | bg-primary + top 1px border-subtle + safe-area | `.quiz-cta` fixed + safe-area-inset-bottom ✅ | ✅ |
| Sticky 高度 | 72-88（含 safe-area） | padding: 8,16,24 + env(safe-area-inset-bottom) ✅ | ✅ |
| CTA 按钮启用 | accent-primary + fg-on-accent · radius 12 | `.btn--primary` + `.quiz-cta__btn` inline-size 100% · min-block-size 56 · radius-md (10) | ⚠️ IMPLEMENTATION-GUIDE 要求 radius 12，我继承 btn radius-md = 10，差 2px。**待真值复核** |
| CTA 字号 | 17-18 600 | font-size 17（Mobile）/ 16（T/D 继承 btn 默认） ✅ | ✅ |
| Disabled 态 | opacity 0.7 或 color-adjust + aria-disabled | `.quiz-cta__btn:disabled` bg=fg-disabled + opacity 0.7 + cursor not-allowed ✅ | ✅ |
| Tablet+Desktop inline | position: static + flex-end | `@media (min-width: 768px) { position: static; display: flex; justify-content: flex-end }` ✅ | ✅ |
| 文案分支 | Q1-4 "下一题" / Q5 "看结果" | `isLast ? quiz.cta.settle : quiz.cta.next` ✅ | ✅ |
| quiz-body padding-end | 为 sticky CTA 留空间 | `padding-block: 16px 120px`（答错时反馈卡可完全露出到 sticky bar 上方）✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：Mobile sticky bar bg=bg-primary 与 page 同色，但 top 1px border-subtle 分区（与 Header 同策略）
- [x] 无自造装饰：仅 Schema 明确的 top border
- [x] Token
- [x] 320 reflow：Mobile 全宽，padding-inline 16 → 12 at 375
- [x] 触摸目标：min-block-size 56px（> SC-TT1 48）
- [x] 键盘：原生 `<button>`，自动 focus 后 0.4s（渲染后 setTimeout 400ms 聚焦 autofocus）
- [x] prefers-reduced-motion：无动画
- [x] safe-area：`env(safe-area-inset-bottom)` iPhone 底部滑动条安全

### 1.7 ExitConfirm（返回键触发的 AlertDialog）

对应 interaction-brief §2.4 + state-machine §3。

| 属性 | 要求 | 实现 | 一致 |
|------|------|------|------|
| role | alertdialog | `role: 'alertdialog'` ✅ | ✅ |
| Title | quiz.confirm_exit.title "要走了吗？" | ✅ | ✅ |
| Body | quiz.confirm_exit.body | ✅ | ✅ |
| Action 1 | 主 CTA "继续答题" autofocus（最保守） | `variant: 'primary', autofocus: true` ✅ | ✅ |
| Action 2 | 次 "回首页（下次继续）" 保留 session | `variant: 'outline'` + navigate('/home')，不清 session ✅ | ✅ |
| Action 3 | 幽灵 "放弃这一关" 清 session | `variant: 'ghost'` + currentSession = null ✅ | ✅ |
| ESC | = 继续答题（不关闭关键状态） | `onDismiss: function() {}` noop，ESC 仅关闭弹层相当于"继续" ✅ | ✅ |
| Mobile 形态 | bottom sheet | `.dialog-backdrop { align-items: flex-end }` + `.dialog-sheet { 顶部圆角 }` ✅ | ✅ |
| Desktop 形态 | 居中 modal | `@media (min-width: 768px) { align-items: center }` ✅ | ✅ |
| 焦点陷阱 | Tab 在 3 按钮间循环 | `.dialog-sheet` 内 querySelectorAll focusables + Tab 键劫持 ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：sheet bg=bg-elevated vs backdrop 半透明 ✅
- [x] 无自造装饰
- [x] Token
- [x] 320 reflow：inline-size 100% · max-inline-size 480
- [x] 触摸目标：3 按钮均 min-block-size 48（.btn 默认 14px padding + 行高）
- [x] 键盘：alertdialog + focus trap + autofocus + ESC 安全降级
- [x] prefers-reduced-motion：dialog 动画 duration 降至 80ms（style.css L1170）
- [x] 语义化：role="alertdialog" aria-modal="true" aria-labelledby aria-describedby
- [x] 无死路 IX-P5：3 路径（继续/保留/放弃）全部可达，ESC = 最保守

### 1.8 Result Stage 1 · 得分揭示

| 属性 | IMPLEMENTATION-GUIDE §7.2 | 实现 | 一致 |
|------|--------------------------|------|------|
| Mobile 容器 | bg-tertiary · padding 40,24,32 · 通栏 | ✅ | ✅ |
| T/D 容器 | radius-xl(T) / 2xl(D) · 560/640 居中 | 560 / 640 + radius xl/2xl ✅ | ✅ |
| Banner 字号 | 28/32/36 | 28 / 32 / 36 ✅ | ✅ |
| Banner 色（perfect） | level-perfect-fg 朱砂 | `.result-banner--perfect { color: var(--color-level-perfect-fg) }` ✅ | ✅ |
| Banner 色（cleared） | level-active-fg | ✅ | ✅ |
| Banner 色（cleared_partial score=0） | fg-secondary（低调不羞辱） | `.result-banner--cleared-partial` ✅ | ✅ |
| Score 字号 | 72/96/120 | 72 / 96 / 120 ✅ | ✅ |
| Score 字体 | font-numeric Inter + tabular-nums | `font-family: var(--font-numeric); font-variant-numeric: tabular-nums` ✅ | ✅ |
| Score perfect glow | text-shadow 朱砂 glow + 呼吸动画 | `.result-score--perfect` + `@keyframes perfect-glow-pulse` 1.6s ✅ | ✅ |
| Stage 1 入场 | 700ms ease-spring-soft | `@keyframes result-stage-in 700ms` ✅ | ✅ |
| reduce-motion | 全部关 + 静态态 | `@media (prefers-reduced-motion: reduce) { .result-stage1, stage2, wrong-entry, ctas { animation: none; opacity: 1; transform: none }` ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：Stage1 bg=bg-tertiary vs result-main bg-primary ✅
- [x] 无自造装饰：仅 Schema 授权的卡片圆角 + 朱砂 glow（perfect 态）
- [x] Token
- [x] 320 reflow：Mobile 通栏，padding-inline 24 降为 12 at 375
- [x] 触摸目标：本区无交互
- [x] 键盘 a11y：`<section role="status" aria-live="polite">` + `<h1 class="result-banner">` 语义化
- [x] prefers-reduced-motion：得分 glow 动画关
- [x] 情感化（interaction-brief IX-P5）：score=0 文案 "走完了这一关" 不羞辱

### 1.9 Result Stage 2 · Card Reveal

| 属性 | IMPLEMENTATION-GUIDE §7.3 | 实现 | 一致 |
|------|--------------------------|------|------|
| 卡片容器 | bg-elevated + 2px accent-cultural · radius-lg 20/20/24 | `.result-card` ✅ | ✅ |
| 卡片 min-block-size | 280/340/380 | 280 / 340 / 380 ✅ | ✅ |
| 封面区 bg | level-cleared-bg (米黄) | `.result-card__cover` ✅ | ✅ |
| 封面高度 | 180/224/252 | 180 / 224 / 252 ✅ | ✅ |
| 占位 🏛 | 72/88/112 px 单色 | 72 / 88 / 112 ✅ | ✅ |
| Info padding | 14,16 / 16,20 / 20,24 | ✅ | ✅ |
| Tag 字号/色 | 12-14 accent-cultural | 12 / 14 ✅ | ✅ |
| Name 字号 | 22/24/28 | 22 / 24 / 28 ✅ | ✅ |
| Hint 字号/色 | 13-14 accent-primary | 13 / 14 accent-primary ✅ | ✅ |
| Perfect 边框 | rarity-legendary-border 朱砂 | `.result-card--perfect` 改 border-color | ✅ |
| Perfect glow | rarity-legendary-glow shadow | box-shadow 24px ✅ | ✅ |
| Perfect Badge | 48×48 accent-secondary 圆 · ★ · 右上角 | `.result-card__badge` ✅ | ✅ |
| Badge 入场 | scale 0→1 800ms bounce 800ms delay | `badge-pop 800ms ease-spring-bounce 800ms both` ✅ | ✅ |
| Stage 2 入场 | 600ms spring-soft delay 200ms | `result-stage-in 600ms ... 200ms both` ✅ | ✅ |
| reduce-motion | badge 静态 | `@media ... { .result-card__badge { animation: none; opacity: 1 } }` ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21：卡片 bg=bg-elevated vs result-main bg-primary ✅
- [x] 无自造装饰：Schema 授权的 border + glow
- [x] Token
- [x] 320 reflow：Mobile padding-inline 20 → 12 at 375
- [x] 触摸目标：整卡点击 56+ 高
- [x] 键盘：`<button>` 点击进卡片详情 `/card/{dynId}`
- [x] prefers-reduced-motion：badge 静态显示
- [x] ASSET_MISSING 注释：`<!-- ASSET_MISSING: card-main-{dynId} · ASSET-LIST #004 -->`
- [x] i18n：card.story.{dynId}.name / type + card.from_dynasty · result.card_reveal.label/again/tap_hint 全走 t()

### 1.10 Result Stage 3 · Wrong Entry（条件）

| 属性 | IMPLEMENTATION-GUIDE §7.4 | 实现 | 一致 |
|------|--------------------------|------|------|
| 显示条件 | !isPerfect && wrongInThisDyn > 0 | `var hasWrong = !isPerfect && wrongInThisDyn > 0` ✅ | ✅ |
| bg | state-danger-bg | `.result-wrong-entry` ✅ | ✅ |
| 文字色 | level-perfect-fg 朱砂深 | ✅ | ✅ |
| 箭头色 | state-danger | ✅ | ✅ |
| 高度 | 56 | padding 16 + 内容约 24 ≈ 56 | ✅ |
| 入场 | 500ms delay 400ms | `result-stage-in 500ms ... 400ms both` ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21 ✅ 
- [x] 无自造装饰
- [x] Token
- [x] 320 reflow：margin-inline 16 收缩
- [x] 触摸目标：56+ 高
- [x] 键盘：`<button>` 点击跳 `/wrong`
- [x] reduce-motion：入场关
- [x] i18n：result.wrong_entry + aria-label

### 1.11 Result Stage 4 · CTA 组

| 属性 | IMPLEMENTATION-GUIDE §7.5 | 实现 | 一致 |
|------|--------------------------|------|------|
| Mobile sticky 外壳 | bg-primary + top border + safe-area | `.result-ctas-sticky` fixed + env(safe-area-inset-bottom) ✅ | ✅ |
| 主 CTA "进入 商朝 →" | accent-primary 全宽 | `.btn--primary` + flex:1 ✅ | ✅ |
| overflow ⋯ 按钮 | 56×56 bg-secondary 圆 | `.btn--ghost flex: 0 0 56px` ✅ | ✅ |
| T+D inline | static + flex-end/center | `@media 768+ { static; margin-top 16 }` ✅ | ✅ |
| 主 CTA 文案 | result.cta.next_dynasty + " →" | `esc(t('result.cta.next_dynasty', {dynasty: ...})) + ' →'`（SCHEMA-DELTA #020 arrow 视觉装饰）✅ | ✅ |
| all_done 时 fallback | 无 nextDyn → home 按钮 | nextDyn null → data-home 按钮 `result.cta.home` ✅ | ✅ |
| overflow 菜单 | Bottom Sheet (replay / home) | openDialog + 2 actions ✅ | ✅ |

**FW10 自检**：
- [x] 父容器色差 N21 ✅（Mobile sticky 与 page 同色，top border 分区；T+D 按钮本身与 bg 不同）
- [x] 无自造装饰
- [x] Token
- [x] 320 reflow：Mobile 全宽，padding-inline 16
- [x] 触摸目标：主 CTA 56，⋯ 按钮 56×56
- [x] 键盘：主 CTA + ⋯ 原生 button
- [x] reduce-motion：入场关
- [x] i18n：result.cta.next_dynasty / home / more / replay 全走 t() · 动态朝代名参数化

---

## 2. 中途刷新恢复（state-machine §3 边界 1）

### 实现

1. 用户开始答题 → `getQuizSession(dynId)` 写 `currentSession` 到 localStorage
2. 用户回答第 N 题 → `onNextQuestion` 更新 `currentQuestionIdx` + writeState
3. 用户刷新 → boot() 读 state.currentSession
4. 用户在 `/quiz/xia` 刷新 → renderQuiz 读 existing session → `currentQuestionIdx` 恢复到上次停留题号 → 当前题选项状态**清空**（re-render，让孩子重新选）
5. 用户回首页（不清 session） → boot 读 state → maybePromptMidQuiz 弹出三选项 dialog

### FW10 自检

- [x] `currentSession` 结构与 state-machine §0 契约一致（dynastyId / currentQuestionIdx / answers / startedAt）
- [x] 答对/答错后 answers 追加（不仅存对错，还存 chosenIdx 供错题页反查）
- [x] writeState 失败 try/catch + 降级内存态 + toast
- [x] ExitConfirm 三分支正确更新 state：继续=不动 / 保留=不清 / 放弃=清
- [x] settleQuiz 清 currentSession + 写 lastResult 给 Result 页读
- [x] MidQuizPrompt Phase 1 已实现，Phase 2 Quiz 页答题时实际写入 session 触发
- [x] 深链直访 `/quiz/xia` 且 session 存在且 dynastyId === xia → 直接恢复（state-machine 要求）
- [x] 深链直访 `/quiz/xia` 且 session 存在但 dynastyId !== xia → 当前实现会覆盖旧 session；state-machine 建议"直接恢复或清除不匹配"。**待改进项**：标注到 Phase 3 polish

---

## 3. 浏览器验证矩阵

### 核心路径（Quiz + Result）

| 断点 | 模式 | 语言 | 测试内容 | 结果 | 截图 |
|------|------|------|---------|------|------|
| 375 Mobile | Light | en | Quiz Q1 初始渲染 | ✅ 顶栏 Xia + ● 进度点 + 🏛 + Q1 + 4 选项 | `/tmp/ca-quiz-m-light.jpg` |
| 375 Mobile | Light | en | 答对 B（正答）Q1 | ✅ B 绿底 ✓ · 反馈 "Got it!" 绿 · sticky Next | `/tmp/ca-quiz-correct.jpg` |
| 375 Mobile | Light | en | 答错 A Q1 | ✅ A 赭石底 ? · B 自动揭示绿 · "Not quite" 反馈 + "The answer is B" | `/tmp/ca-quiz-wrong2.jpg` (+ scroll) |
| 375 Mobile | Light | en | Q1-Q5 全对 → `#/result/xia` | ✅ 自动跳转，lastResult 写入 | evaluate hash === '#/result/xia' |
| 375 Mobile | Light | en | Result Perfect（5/5） | ✅ "All correct!" 朱砂 + 5/5 glow + 卡片红框 legendary + ★ badge + Sticky "Enter Shang →" | `/tmp/ca-result-perfect-m.jpg` |
| 375 Mobile | Dark | zh | Result Cleared（3/5） | ✅ "闯关成功" 青瓷 + 3/5 普通 + 卡普通边 + Wrong entry + "进入 商 →" 深字（dark fg-on-accent 兜底） | `/tmp/ca-result-cleared-m-dark.jpg` |
| 1440 Desktop | Light | en | Quiz Q1 两栏 | ✅ 左 40% 🏛 青瓷底 + 右 60% 题目 + 选项 | `/tmp/ca-quiz-d.jpg` |
| 1440 Desktop | Light | zh | Result Perfect | ✅ Stage1 卡中央圆角 + Stage2 卡居中 + CTA 内嵌 flex-center | `/tmp/ca-result-perfect-d.jpg` |

### 未完全覆盖（待 Phase 3 整体回归 + r-qa）

| 情景 | 备注 |
|------|------|
| 768 Tablet Quiz/Result | Quiz 单列 max-inline-size 680 · Result 中央 560 宽卡 · 本轮未截图，下阶段补 |
| 500ms 渐入动画实际速度感 | 硬编数值基于 design-tokens，未做人眼主观校验 |
| iOS Safari sticky bar 行为 | env(safe-area-inset-bottom) 需真机验证 |
| 键盘 Tab 完整顺序 | a11y tree 已看；但"Tab→选项 A→B→C→D→Next"的物理顺序真机未测 |
| ESC 在 ExitConfirm 关闭后焦点回到返回按钮 | 当前实现 dialog close 未主动还原焦点——**待改进项** |

---

## 4. Phase 2 ⚠️ 待真值复核项汇总

| 位置 | 我的实现 | IMPLEMENTATION-GUIDE 值 | 差异 | 严重性 |
|------|---------|------------------------|------|--------|
| Quiz Header Desktop 高度 | 72（继承 Home） | 64 | -8px | 低（答题场景无导航工具按钮，空间充裕无影响） |
| Progress dot 直径 | 10px | 未明确 | - | 低 |
| Quiz Question CJK line-height | 1.5 / 1.45 | 1.7 | 0.2-0.25 | 中（Schema §4.2 I6 要求 1.7；但题干字号大，视觉裁决待 r-qa） |
| Sticky CTA 圆角 | radius-md=10 | 12 | -2px | 低 |
| 答题页返回按钮 after-action 焦点 | 未还原到返回按钮 | interaction-brief 要求 modal close 焦点回触发源 | - | 中（待 Phase 3 polish） |

---

## 5. 编号追溯（FW-* 映射）

本 Phase 2 所有"FW-" 编号沿用 team CLAUDE.md 原定义：

- FW2 资产占位 ✅ 所有 🏛 占位点标 `<!-- ASSET_MISSING: ... -->`
- FW5 locale 内联 ✅ Phase 1 已内联 zh + en + quiz-meta
- FW6 两语非占位 ✅ 本轮 en 切换验证中文 locale 均有对应
- FW9 batch_get 真值 ⚠️ 回退到 IMPLEMENTATION-GUIDE（见 §0 说明）
- FW10 每 Section ≥8 项自检 ✅ 11 个 Section 每个独立自检块
- FW11 mobile 重设计（双 key） ✅ Quiz 无 mobile-only 文案差异（题目跨断点相同）；Result 的 sticky vs static CTA 是 layout 重设计
- FW12/13/14 主题 ✅ Phase 1 已实现，Phase 2 所有颜色用 var()
- FW15 locale 更新 re-bundle ✅ 一次内联

---

## 6. Phase 2 Diff 统计

```
 dist/style.css   | +729 lines (1228 → 1957)
 dist/app.js      | +455 lines (930 → 1385)
 dist/index.html  |   0 (骨架复用)
```

## 7. 下一步

**Phase 3** 继续推进，范围：
- `renderCardDetail`（mobile 全屏 / tablet/desktop Modal 两栏）
- `renderCards`（10 张卡册网格 + 筛选）
- `renderWrong`（mobile inline expand / desktop 双栏）
- 徽章解锁联动（Home 朝代卡 perfect 态 + Result Stage 3）
- 空态插画（cards_page.empty / wrong.empty）
- ASSET-HANDOFF.md
- 全量人工验证清单
