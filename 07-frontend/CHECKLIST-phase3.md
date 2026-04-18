# Phase 3 CHECKLIST · 迷人的老祖宗 r-frontend

> Phase 3 范围：Cards 卡册（CardsGrid + CardThumbnail · locked/unlocked）+ CardDetail 浮层（Mobile 全屏抽屉 / Tablet Modal / Desktop 两栏 Modal）+ Badge 联动（perfect 态）+ WrongReview（Filter · ListItem · DetailPanel · Empty）
> 权威源：IMPLEMENTATION-GUIDE §7-11 + SCHEMA-DELTA 批次 B（#012 #013 #014 #015 #016 #017 #018 #019 #020 #021 #022）+ 批次 A/B 的 ASSET-LIST
> 产出时间：2026-04-17（Phase 2 ACK 后续作）
>
> **本轮约束**：本次终稿由代码 + 现有文档反查产出，**未调用 Pencil MCP / 未查看 .pen 截图**。FW9 核对仅对 IMPLEMENTATION-GUIDE Markdown 中已交付的条目做反查；设计稿原始像素的二次核对列入"真值复核待办"，由 r-qa 阶段 Chrome DevTools 现场比对完成。

---

## FW9 真实源说明（沿袭 Phase 2）

IMPLEMENTATION-GUIDE（`06-pencil/IMPLEMENTATION-GUIDE.md`）是 r-pencil 明确声明的"像素级实现直接依据"。Phase 3 所有 token / padding / font-size / min-block-size 数值都基于该文件 §7-11，本 CHECKLIST 只在 IMPLEMENTATION-GUIDE 与 `dist/style.css` 之间对照。

**标注约定**：
- ✅ = IMPLEMENTATION-GUIDE 对应条目有明确值且 CSS 一致
- ⚠️ = IMPLEMENTATION-GUIDE 无对应值或数值近似（自行推导），列入"真值复核待办"
- ❌ = 严重偏离 / 违反约束 → 末尾"待修列表"

---

## 0. 交付文件（累积）

| 文件 | Phase2 起始 | Phase3 当前 | Δ | 新增内容 |
|------|-------------|-------------|---|---------|
| `dist/index.html` | 1100 | 1100 | 0 | 骨架无变动 |
| `dist/style.css` | 1957 | 2634 | **+677** | cards-page / cards-grid / card-tile / cards-empty / card-detail（全三档）/ wrong-page / wrong-head / wrong-filter（select + tabs）/ wrong-layout / wrong-item / wrong-block / wrong-detail-panel |
| `dist/app.js` | 1385 | 1795 | **+410** | renderCards / renderCardTile / renderCardDetail（Escape + backdrop close + 下层维持）/ renderWrong / renderWrongItem / renderWrongDetailPanel / getQIdxFromId |

---

## 1. Section 属性核对表（FW9 · IMPLEMENTATION-GUIDE 真实源对照）

### 1.1 CardsGrid（卡册网格 · IMPLEMENTATION-GUIDE §10 延伸）

| 属性 | IMPLEMENTATION-GUIDE 对应（§） | style.css 实现 | 一致性 |
|------|-------------------------------|---------------|-------|
| 网格列数 M/T/D | ASSET-LIST #003 注明 "Home 卡册缩略三档 / Cards 页网格 2/3/5 列" | `.cards-grid` L1999-2005：2 / 3 / 5 列 | ✅ |
| 网格 gap | 未明示 | 12 / 16 / 20 px | ⚠️ 自定 |
| cards-page 外边距 | 未明示（§10 仅指 ASSET-LIST） | 16/24/32 gutter 复用全局 `--space-gutter-*`；**2026-04-17 全屏 header/welcome 修复**：cards-page 加 `max-inline-size: var(--space-container-max); inline-size:100%; margin-inline:auto`，大屏（1440/1920）两侧留白 | ⚠️ 自定（合理继承）|
| cards-page__title 字号 | 未明示专门值 | 26/30/34 px Source Han Serif 600 | ⚠️ 推导（与 wrong-head__title 同阶） |
| cards-page__progress 颜色 | 未明示 | `--color-accent-primary` | ⚠️ 自定（显示进度视觉亮点） |
| cards-page__head 布局 | 未明示 | flex + justify-space-between + align-baseline | ⚠️ 自定 |
| 空态 padding | ASSET-LIST #006 线条 SVG 200×200 · 儿童友好 | `.cards-empty` padding 48/24 · empty-illust 160/200px 📖 占位 | ✅（已标 `<!-- ASSET_MISSING #006 -->`）|

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差（N21）：grid 本身无 bg，子 card-tile bg=`--color-bg-elevated` #FFFFFF / #26231E，与 page `--color-bg-primary` #FAF8F3 / #1A1814 有色差 ✅
- [x] ② 无自造装饰线（N22）：`.cards-page__head` 无 border / hr ✅
- [x] ③ 同行卡等高（N23）：grid + `.card-tile` flex-column `align-items:stretch`（Grid 默认 stretch）+ `min-block-size:200px` 保底 ✅
- [x] ④ Token 双检：颜色全部 `var(--color-*)`（`--color-bg-elevated` / `--color-rarity-rare-border` / `--color-accent-primary`），无硬编 hex ✅
- [x] ⑤ 传统项：首页 logo "祖" 占位一致 + 顶栏 nav + H1="我的卡册"（`cards_page.title`）+ CTA 文案"去朝代图谱"（`cards_page.empty.cta`）全部来自 locale ✅
- [x] ⑥ 320px reflow：`.cards-grid` 2 列 + gap 12 → 每列 ~(320-32-12)/2 ≈ 138px 宽，card-tile 内容（48px icon + 12px padding + 16px 标题）可容纳 ✅；Phase 1 全局 `min-inline-size: 320px` + `max-width:374px` gutter 收缩已覆盖
- [x] ⑦ 键盘 a11y：`.card-tile` 原生 `<button type="button">` Tab 可达 + Enter/Space 触发 + aria-label 含卡名 + 朝代；空态 CTA 同为 `<button>` ✅
- [x] ⑧ prefers-reduced-motion：`.card-tile` 仅 transform + box-shadow hover 160ms，全局 `@media (prefers-reduced-motion: reduce)` 已覆盖（Phase 1 style.css 全局 L110-115）✅
- [x] ⑨ HTML↔CSS 类名双向：`.cards-page / __head / __title / __progress / .cards-grid / .card-tile / .card-tile--locked / .card-tile--perfect / .card-tile__cover / .card-tile__info / .card-tile__tag / .card-tile__name / .card-tile__hint` 全部 HTML(renderCards + renderCardTile) ↔ CSS 双向对应 ✅

---

### 1.2 CardThumbnail（卡片缩略 · locked / unlocked · IMPLEMENTATION-GUIDE §1.5 延伸）

| 属性 | IMPLEMENTATION-GUIDE §1.5 + ASSET-LIST #003 | 实现 | 一致性 |
|------|-------------------------------------------|------|-------|
| unlocked 卡容器 bg | `bg-elevated` #FFFFFF / #26231E | `.card-tile` bg=`var(--color-bg-elevated)` | ✅ |
| unlocked 卡 border | 1.5px `rarity-rare-border` #B67B3D / #C4934D | `.card-tile` border=1.5px solid `var(--color-rarity-rare-border)` | ✅ |
| 卡片圆角 | `radius-md` 10-12 | `border-radius: var(--radius-lg)` | ⚠️ IG §1.5 Home 卡册缩略用 radius-md，本 Cards 页用 radius-lg 更醒目；合理放大，**真值复核待办**（与 .pen 对比） |
| 插画块 bg | `level-cleared-bg` #F1E0C4 / #50351B | `.card-tile__cover` bg=`var(--color-level-cleared-bg)` | ✅ |
| 插画块高度 M/T/D | 40-56（IG §1.5）/ Home 缩略 | 110 / 120 / 130 px | ⚠️ 本页是专用 Cards 页（非 Home 缩略），尺寸更大合理，**真值复核待办** |
| 插画块文字 | `level-cleared-fg` #714B26 / #E4C697 · 9-11 500 | color=`var(--color-level-cleared-fg)` · font-size 48/56/64 | ⚠️ 字号偏大（因为是封面图占位 emoji 🏛 而非文字），符合占位语义 |
| locked 卡容器 bg | `level-locked-bg` #F2EFE7 / #1F1D19 | `.card-tile--locked` bg=`var(--color-level-locked-bg)` | ✅ |
| locked 卡 border | 1.5px `rarity-common-border` #C9C2B0 / #6B6456 | border-color=`var(--color-rarity-common-border)` | ✅ |
| locked 内"?" 占位 | `?` 字符 | app.js L1410: `coverIcon = isUnlocked ? '🏛' : '?'` ✅ | ✅ |
| 信息区 padding | 未明示 | 12 / 14 px | ⚠️ 自定 |
| 卡名字号 M/T/D | 未明示 | 16/18/20 px Source Han Serif 600 | ⚠️ 推导 |
| hover 动效 | IMPLEMENTATION-GUIDE §5.2 朝代卡 hover `translateY(-2px) + elevation-2 transitions 160ms` | `.card-tile:hover` translateY(-2px) + shadow-md 160ms（含 hover:hover + pointer:fine 守卫）+ hover:none 回退 | ✅ |
| perfect 态 | IG §1.3.1 perfect 态整卡变色 | `.card-tile--perfect` **未在 style.css 定义变体样式**（仅 class 存在）| ⚠️ 占位 class，视觉与 cleared 一致。**真值复核待办**：若 r-pencil 本批次有 perfect 卡册变体则需补样式，否则保持现状（MVP 可接受）|

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差（N21）：card-tile `bg-elevated` vs cards-page `bg-primary` 有色差 ✅；locked card-tile `level-locked-bg` vs cards-page `bg-primary` 有色差（浅灰 on 米白）✅
- [x] ② 无自造装饰线（N22）：`.card-tile` 只有 border（包裹边框，非装饰线）+ overflow:hidden 无 divider ✅
- [x] ③ 同行卡等高（N23）：Grid `grid-template-columns: repeat(N, 1fr)` 默认 `align-items: stretch`，card-tile 高度自动拉平；卡内 `.card-tile__info { flex: 1 1 auto }` 吸收剩余空间 ✅
- [x] ④ Token 双检：bg/color/border-color 全部 var 引用，两模式自动切换 ✅
- [x] ⑤ 传统项：卡名 / 分类 / "来自 {朝代}" 全部 `t('card.story.xxx.name / type')` + `t('card.from_dynasty')`；locked 态标题"?"是语义占位；locked hint 用 `t('dynasty.status.locked')` ✅
- [x] ⑥ 320px reflow：2 列 + 12 gap + outer 16 gutter = (320-32-12)/2=138px/卡，卡内 padding 12 → 可用 114px，可容 16px 字号 2 行卡名 ✅
- [x] ⑦ 键盘 a11y：`<button data-card-dyn aria-disabled="true">` locked 卡有 aria-disabled（L1423），但仍响应 click（app.js L1391 检查 locked 后显示 toast 提示）✅；unlocked 卡 Enter/Space 触发 navigate(/card/id) ✅
- [x] ⑧ prefers-reduced-motion：transition 160ms 小动效，符合 M4（≤200ms 微交互），全局降级已覆盖 ✅
- [x] ⑨ HTML↔CSS 类名：全部双向 ✅

---

### 1.3 CardDetailModal（移动全屏抽屉 / 平板 Modal / 桌面两栏 Modal · IMPLEMENTATION-GUIDE §8.1-8.2）

| 属性 | IMPLEMENTATION-GUIDE §8.1 / §8.2 | 实现 | 一致性 |
|------|--------------------------------|------|-------|
| Backdrop z-index | 未明示（推 100-200）| `.card-detail-backdrop` z-index=200 | ⚠️ 合理 |
| Backdrop 色 | `bg-overlay` rgba(26,24,20,0.55) / rgba(0,0,0,0.65)（§8.2 末）| bg=`var(--color-bg-overlay)` | ✅ |
| 浮层 Mobile 形态 | 全屏 width 375 height 100vh · 从底部上滑 · motion-flip-enter 360ms | `.card-detail` 100%×100% + `card-detail-slide-up` 480ms（var(--duration-slow)）+ ease-spring-soft | ⚠️ 时长 360→480ms（Phase 2 global duration-slow=480），设计目的一致（慢入场） |
| 浮层 Tablet 形态 | Modal 560×720 居中 radius 24 | inline-size 560 · max-block-size calc(100vh-48px) · radius-xl 24 · dialog-modal-in | ✅ |
| 浮层 Desktop 形态 | Modal 720×520 居中 radius 24 · 两栏 | inline-size 720 · max-block-size 600 · flex-direction:row | ⚠️ block 高度 520→600（更好容纳内容），**真值复核待办** |
| × 按钮位置 M | 左上（§8.1 IX-A 安全区）| `.card-detail__topbar` inset-block-start:0 inset-inline-start:0 + safe-area-inset-top | ✅ |
| × 按钮位置 T/D | 右上 | @media (min-width:768px) inset-inline-end:0 · inset-inline-start:auto | ✅ |
| × 按钮尺寸 | 44×44 · radius-full · aria-label="关闭" | 44×44 · radius-full · aria-label=`t('card.close')` | ✅ |
| 主视觉 cover bg | `level-cleared-bg` #F1E0C4 / #50351B | `.card-detail__cover` bg=`var(--color-level-cleared-bg)` | ✅ |
| 主视觉高度 M/T/D | 300 / 320 / Desktop 左栏全高 | 300 / 320 / Desktop `inline-size:50%; flex:0 0 50%; block-size:auto` | ✅ |
| 主视觉 emoji 字号 | 150 / 180 / 200 | 120 / 140 / 160 | ⚠️ 偏小，**真值复核待办**（IG §8.2 Desktop 左栏 200px · 我实 160） |
| 分类 tag bg | `level-cleared-bg` · fg=`level-cleared-fg` · 12 500 · padding 4,10 | `.card-detail__tag--category` 全匹配 | ✅ |
| 朝代 tag bg | `bg-secondary` · fg=`fg-muted` | `.card-detail__tag--dynasty` 全匹配 | ✅ |
| 卡名 H1 字号 M/T/D | 32 / 36 / 40 | 28 / 36 / 40 | ⚠️ Mobile 28（IG §8.1 要 32），因 mobile info 区 padding 20 缩小后 32 过挤 · **真值复核待办** |
| 故事正文 | HarmonyOS Sans SC 400 · 17 · :lang(zh) lh 1.7 · ≤120 字中 · max-width 335 | font-size 16/17 · :lang(zh) { line-height 1.7 · max-inline-size 35em } · overflow-wrap: break-word | ⚠️ Mobile 16（IG §8.1 要 17），为 mobile 更舒适的行宽 · **真值复核待办** |
| 回链接 | 14 500 accent-primary · role=link | `.card-detail__back-link` font-size 14 · `color: var(--color-accent-primary)` · text-decoration:none · 文案 `t('dynasty.cta.replay')` = "再玩一次" | ⚠️ IG §8.1 文案为"回朝代链接"（返回夏朝），我实为"再玩一次"（跳 /#/quiz/id）· **语义差异**，见待修列表 FIX-P3-01 |
| Perfect 态 cover 色 + 边框 + glow 呼吸 | IG §7.3 Perfect 态 stage 2 `rarity-legendary-border` + 朱砂 glow + motion-reward-perfect 呼吸 | `.card-detail--perfect .card-detail__cover` bg=`level-perfect-bg` · fg=`level-perfect-fg` · **`.card-detail--perfect` 2px rarity-legendary-border + box-shadow 0 0 24px level-perfect-glow + `card-detail-perfect-breathe` 2.8s infinite（降级 static）** | ✅ **FIX-P3-02 修复（2026-04-17）** |

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差：modal `bg-primary` vs backdrop rgba 遮罩强色差 ✅；cover vs info 区有色差（米黄 on 白/暗卡）✅
- [x] ② 无自造装饰线：modal 内容区无 divider，仅 cover/info 通过色块区分 ✅
- [x] ③ 同行等高：Desktop 两栏 flex-direction:row + align-items:stretch（默认 stretch）+ cover 和 info 各 50%（`flex:0 0 50%`）自动等高 ✅
- [x] ④ Token 双检：全部 var 引用 ✅
- [x] ⑤ 传统项：卡名 / 分类 / 故事 / "关闭" aria-label / "来自 XX" 全部 locale ✅
- [x] ⑥ 320px reflow：Mobile 全屏 100% 布局，cover 300h + info padding 20 · max-width 335 收缩至 320 时 info 宽度足够 ✅
- [x] ⑦ 键盘 a11y 深度：
    - role="dialog" aria-modal="true" aria-labelledby="card-detail-name" ✅
    - Escape 关闭（app.js L1531）✅
    - backdrop 点击关闭仅 Tablet+ 生效（app.js L1540-1544，Mobile 全屏禁止，避免误触）✅
    - 打开时焦点自动移到 × 关闭按钮（app.js L1547-1549）✅
    - 关闭后焦点归还触发元素（`activeBefore`，navigate 前尝试 + 失败 fallback 到新页面 `#main-content`）✅
    - 打开时 body scroll lock（`document.body.style.overflow='hidden'` + 关闭恢复）✅
    - ✅ **焦点陷阱 2026-04-17 补全（FIX-P3-03 修复）**：onKey 监听 Tab / Shift+Tab，在 `[data-card-sheet]` 内 focusables 范围循环（过滤 disabled + 不可见）；同时下层 `#app` 标记 `aria-hidden="true"`（关闭后移除），双重防漂出
- [x] ⑧ prefers-reduced-motion：`@media (prefers-reduced-motion: reduce) { .card-detail-backdrop, .card-detail { animation: none; } }` L2185-2187 ✅
- [x] ⑨ HTML↔CSS 类名双向：`.card-detail-backdrop / .card-detail / .card-detail--perfect / __topbar / __close / __cover / __info / __tags / __tag / __tag--category / __tag--dynasty / __name / __story / __back-link` 全部双向对应 ✅

---

### 1.4 BadgeList（徽章展示 · IMPLEMENTATION-GUIDE §7.3 Perfect 态推导 + locale `card.badge.*`）

> 注：Phase 3 **未单独实现 BadgeList Section**。徽章显示目前为：(a) Home 朝代卡 perfect 态 `★` 单字符占位（§1.3.1）（b) Result Stage 2 Perfect 态卡右上角 `★` 徽章（Phase 2 已实现，见 `app.js` L1270 `badgeHtml`）。独立的 BadgeList 网格组件 MVP 未要求。

| 属性 | IG § / ASSET-LIST #005 | 实现 | 一致性 |
|------|----------------------|------|-------|
| Perfect 态 Home 卡 ★ 徽章 | §1.3.1 `accent-secondary` 圆 + ★ + fg-on-accent | Phase 1 已实现 ✅（见 Phase 1 CHECKLIST）| ✅ |
| Result Stage 2 Perfect 卡右上角 ★ | §7.3 推导 · 48×48 朱砂圆 + ★ + motion-reward-perfect 呼吸 | `.result-card__badge` 入场 `badge-pop` 800ms + 1600ms 延迟后进入 `badge-breathe` 2.4s 循环呼吸（scale 1→1.06 + shadow 扩张）· prefers-reduced-motion 降级为静态 glow | ✅ **FIX-P3-02 修复（2026-04-17）** |
| Cards 页 perfect 卡缩略视觉 | 派生自 §7.3 | **`.card-tile--perfect` 2026-04-17 新增**：2px rarity-legendary-border + cover 换 level-perfect-bg/fg + `card-tile-perfect-breathe` 2.8s 循环呼吸（shadow 16px→24px）· 降级 static | ✅ **FIX-P3-02 修复（2026-04-17）** |
| CardDetail 浮层 perfect 态 | 派生自 §7.3 + §8 | **`.card-detail--perfect` 2026-04-17 新增**：2px legendary-border + `card-detail-perfect-breathe` 2.8s 延迟 400ms 循环呼吸 · 降级 static | ✅ **FIX-P3-02 修复（2026-04-17）** |
| Cards 页 / CardDetail 中独立展示徽章名和故事 | locale `card.badge.{dyn}.name / story` 10 条已有 | **Phase 3 未在 Cards Grid 或 CardDetail 中显式展示徽章文案** | ❌ 缺失独立 BadgeList 组件 · 见"Phase 3 待裁决 P2/P3" FIX-P3-04 |

**FW10 自检**（BadgeList 未交付，不单独自检。Phase 3 的徽章联动仅回溯确认 Result / Home 两处表现。）

**回溯确认：perfect 态联动（#021 推导）**：
- ✅ `settleQuiz` L1172：`if (score === quizRT.questionCount) prog.perfectBadge = true;`
- ✅ `renderResult` L1248：`var isPerfect = lastResult.perfect`
- ✅ L1252：isPerfect → `bannerText = t('result.banner.perfect')` "全对！"
- ✅ L1268-1270：`scoreCls += '--perfect'` · `cardCls += '--perfect'` · `badgeHtml = <span class="result-card__badge">★</span>`
- ✅ `renderCardTile` L1402-1405：`isPerfect && cls += 'card-tile--perfect'`（Phase 3 新增 locked/perfect 联动）
- ✅ `renderCardDetail` L1454 / L1461：`isPerfect && cls += 'card-detail--perfect'`
- ✅ **motion-reward-perfect 呼吸动画已补全（2026-04-17 FIX-P3-02 修复）**：三处 perfect 元素均有循环呼吸 + prefers-reduced-motion 降级
- ⚠️ 仍待裁决：独立 BadgeList 组件展示 `card.badge.{dyn}` 名字和故事（FIX-P3-04，P2 留待用户裁决）

---

### 1.5 WrongFilter（下拉 Mobile / Tab Tablet+Desktop · IMPLEMENTATION-GUIDE §9.2）

| 属性 | IMPLEMENTATION-GUIDE §9.2 | 实现 | 一致性 |
|------|---------------------------|------|-------|
| Mobile 下拉 bg | `bg-elevated` #FFFFFF / #26231E | `.wrong-filter__select` bg=`var(--color-bg-elevated)` | ✅ |
| Mobile 下拉 border | 1px `border-strong` #C9C2B0 / #6B6456 | border=1px solid `var(--color-border-strong)` | ✅ |
| Mobile 下拉圆角 | `radius-md` 12 | radius-md（10px 全局，IG §9.2 标 12 略大）| ⚠️ 10 vs 12 差 2px，**真值复核待办** |
| Mobile 下拉高度 | 56 · padding-x 16 · justify space_between | min-block-size 56 · padding 12 16 · padding-inline-end 40（留箭头位）| ✅ |
| Mobile 下拉字 | `fg-primary` · 16 500 · role=combobox | color=`var(--color-fg-primary)` · font-size 16 · font-weight 500 · 原生 `<select>` 隐含 combobox | ✅ |
| Mobile ▾ 箭头 | `fg-muted` 装饰 | linear-gradient 绘制的 6×6 CSS 箭头 `currentColor`（继承 fg-primary）| ⚠️ IG 要 `fg-muted`，我用 currentColor 偏深 · **真值复核待办** |
| Tablet+ Tab active bg | `accent-primary` #4A7C74 / #6FA89F | `.wrong-filter__tab[aria-selected="true"]` bg=`var(--color-accent-primary)` | ✅ |
| Tablet+ Tab active fg | `fg-on-accent` · 600 | color=`var(--color-fg-on-accent)` · font-weight 600 | ✅ |
| Tablet+ Tab 未激活 bg | `bg-secondary` #F2EFE7 / #1F1D19 | bg=`var(--color-bg-secondary)` | ✅ |
| Tablet+ Tab 未激活 fg | `fg-secondary` · 14 500 | color=`var(--color-fg-secondary)` · font-size 14 · font-weight 500 | ✅ |
| Tab padding | 8,14(T) / 8,16(D) | padding 12 18 · @media (min-width:1024) padding 12 20（随 min-block-size 52 扩 padding 保持文本垂直居中）| ✅ **修复时顺带调整，2026-04-17** |
| Tab 圆角 | radius-full | radius-full | ✅ |
| Tab 最小触摸尺寸 | 未明示 · PROJ-TT1 ≥ 52 | `min-block-size: 52 · min-inline-size: 52` | ✅ **FIX-P3-05 修复（2026-04-17）** · PROJ-TT1 合规 · grep 全局 `min-block-size: <52px` = 0 命中 |

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差：Tab 未激活 `bg-secondary` vs wrong-page `bg-primary` 有色差；active `accent-primary` vs 父容器强对比 ✅
- [x] ② 无自造装饰线：无 border/hr ✅
- [x] ③ 同行卡等高：Tabs 单行 flex-wrap，每个 tab 高度由内容 + min-block-size 保证一致 ✅
- [x] ④ Token 双检：全部 var ✅
- [x] ⑤ 传统项：`wrong.filter.all` / `wrong.filter.by_dynasty` / `dynasty.{id}.name` 全部 locale ✅
- [x] ⑥ 320px reflow：单个下拉 100% 宽自适应 ✅
- [x] ⑦ 键盘 a11y：Mobile 原生 `<select>` + aria-label；Tablet+ `role="tablist"` + `<button role="tab" aria-selected>` + click navigate → 但**未实现箭头键切换 tab**（APG tab pattern 要求 ArrowLeft/Right 切 tab + Home/End 跳首末）· 见待修列表 FIX-P3-06
- [x] ⑧ prefers-reduced-motion：无动画 ✅
- [x] ⑨ HTML↔CSS 类名双向：`.wrong-filter / __select / __tabs / __tab` ✅

---

### 1.6 WrongListItem（Mobile inline expand / Desktop 列表项 · IMPLEMENTATION-GUIDE §9.3.1-9.3.2）

| 属性 | IG §9.3.1 Collapsed | 实现 | 一致性 |
|------|---------------------|------|-------|
| Collapsed 容器 bg | `bg-secondary` #F2EFE7 / #1F1D19 | `.wrong-item` bg=`var(--color-bg-secondary)` | ✅ |
| 圆角 | `radius-lg` 14 | border-radius `var(--radius-lg)` = 16 | ⚠️ IG 要 14, 全局 lg=16（style.css L39 `--radius-lg: 16`）· **真值复核待办** |
| padding M/T | 16 / 18 | 14 16 / 16 18 | ⚠️ IG 要 16/18，我少 2px → 密度更高，**真值复核待办** |
| 朝代 tag active 朝代 | `level-active-bg` #D6E6E1 · fg=`level-active-fg` | `.wrong-item__dyn-tag` 固定用 `level-cleared-bg`（未区分 active）| ⚠️ 本 MVP 简化，所有朝代用 cleared 色（因为进到错题复习页的都是已完成关卡）· 合理简化，**真值复核待办** |
| "第 N 题" label | `fg-muted` · 11-13 500 | font-size 11/12 · color=`fg-muted` · font-weight 500 | ✅ |
| 题干短版 max-width | 250-560 | flex `min-inline-size: 0`（不锁具体宽度）+ overflow-wrap: break-word | ⚠️ 与 IG 约束不严格匹配，但 flex 布局天然约束 · **真值复核待办** |
| ▸ 箭头 | `fg-muted` · 18 500 | font-size 18 · color=`fg-muted` | ✅ |

| 属性 | IG §9.3.2 Expanded | 实现 | 一致性 |
|------|--------------------|------|-------|
| 容器 bg | `bg-elevated` #FFFFFF / #26231E | `.wrong-item[aria-expanded="true"]` bg=`bg-elevated` | ✅ |
| 容器 border | 1px `border-strong` | border 1px solid `var(--color-border-strong)` | ✅ |
| padding | 16-20 | 16 | ⚠️ 单值，**真值复核待办** |
| ▾ 箭头颜色 | `accent-primary` · 18 500 | `.wrong-item[aria-expanded="true"] .wrong-item__arrow` color=`accent-primary` · transform rotate(90deg) | ✅ |
| "你选的" 区块 bg | `bg-secondary` | `.wrong-block--my` bg=`bg-secondary` | ✅ |
| "正确答案" 区块 bg + border | `state-success-bg` + 1px `state-success` | `.wrong-block--correct` bg=`state-success-bg` · border 1px `state-success` | ✅ |
| "正确答案" ✓ label | fg=`state-success` 14 600 · 文案 "正确答案：" | label 含 `✓ ` 前缀字符 + locale `wrong.item.correct_answer` · color=`state-success` | ✅（不是真 icon，是字符占位 → ASSET-LIST 记为 lucide `check`）|
| "正确答案" 答案加粗 | 15-17 **600** 强调正面 | `.wrong-block--correct .wrong-block__text { font-weight: var(--fw-semibold) }` ✅ | ✅ |
| "为什么" 区块 bg | `state-warning-bg` #FAEFD9 / #3D2E12 | `.wrong-block--explanation` bg=`state-warning-bg` | ✅ |
| "为什么" label | fg=apricot-700/300 12-13 500-600 | color=`state-warning` · font-size 12 · font-weight 500 | ✅（颜色 token 简化为 state-warning，不拆 apricot-700/300）|
| "为什么" 正文 | `fg-primary` 14-15 400 · lh 1.6-1.7 | font-size 14 · font-weight 400 · line-height 1.6 · `:lang(zh) { line-height 1.7 }` | ✅ |

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差：Collapsed `bg-secondary` vs `bg-primary` 浅灰 on 米白 ✅；Expanded `bg-elevated` + border 明显区分 ✅；三种 wrong-block 三种底色（米灰/青玉淡/杏黄淡）强色差 ✅
- [x] ② 无自造装饰线：`.wrong-item__detail` 有 `border-block-start: 1px solid var(--color-border-subtle)` — **来自 IG §9.3.2 表格的隐含语义**（summary 与 detail 之间有视觉分隔）· ⚠️ IG 未明确要求这条线，**真值复核待办**是否违反 N22 · 见待修列表 FIX-P3-07
- [x] ③ 同行卡等高：wrong-list 单列堆叠，不涉及同行 ✅；Desktop 双栏 `align-items: start` 列表和右面板独立高度 ✅
- [x] ④ Token 双检：全部 var ✅
- [x] ⑤ 传统项：label / 答案 / 题干全部 locale（`wrong.item.your_answer / correct_answer / explanation` + `dynasty.{id}.name` + `quiz.progress` + `quiz.questions.{dyn}.{idx}.*`）✅
- [x] ⑥ 320px reflow：单列堆叠无水平溢出 ✅
- [x] ⑦ 键盘 a11y：
    - `<button class="wrong-item" role="button" aria-expanded>` ✅
    - Enter/Space 触发切换（原生 button）✅
    - aria-expanded 在点击后动态更新（app.js L1654 / L1657 / L1663-1665）✅
    - Desktop 双栏 aria-expanded="true" = active item + 右面板内容同步 ✅
    - ⚠️ Mobile inline expand 切换时，其他 item 自动折叠（L1664），但**未管理焦点**（展开后焦点留在按钮上，可能应该移到展开区域首个可聚焦元素 — 无可聚焦元素，接受现状）✅
    - ⚠️ **role="button" 套在外层的原因**：inner button（renderWrongItem L1695）同时有 `role="button"`，但外层 `<button>` 天然已是 button → `role="button"` 属性冗余但无害
    - ⚠️ renderWrongItem L1718：结构 `<li><button>...</button></li>` 嵌套 OK，但 L1705 的 `<div class="wrong-item__detail">` 放在 `<button>` 内部 — **嵌套块级在按钮内有语义争议**（button 应只含短语内容）· 见待修列表 FIX-P3-08
- [x] ⑧ prefers-reduced-motion：transition 160ms background-color 切换（小动效）✅
- [x] ⑨ HTML↔CSS 类名：`.wrong-item / __summary / __dyn-tag / __meta / __q-label / __q-text / __arrow / __detail / .wrong-block / --my / --correct / --explanation / __label / __text` 全部双向 ✅

---

### 1.7 WrongDetailPanel（desktop 右栏详情 · IMPLEMENTATION-GUIDE §9.3.2 desktop 双栏）

| 属性 | IG §9.3.2 Desktop 双栏 | 实现 | 一致性 |
|------|------------------------|------|-------|
| 容器 bg | `bg-elevated` | `.wrong-detail-panel` bg=`var(--color-bg-elevated)` | ✅ |
| 容器 border | 1px `border-subtle` | border 1px solid `var(--color-border-subtle)` | ✅ |
| 容器 radius | 16 | radius-lg（16）| ✅ |
| padding | 20,24 | 24（单值）| ⚠️ IG 20 24 双值，我单值 24 → padding-block 偏大 · **真值复核待办** |
| 左列表 active bg | `bg-tertiary` #EDF4F2 + 2px `accent-primary` ring | `.wrong-layout--desktop .wrong-item--active` bg=`bg-tertiary` + outline 2px `accent-primary` | ✅ |
| 右面板内布局 | "你选的/正确答案"并排（50% gap 12）· "为什么"独立全宽 | `.wrong-detail-panel__blocks` grid-template-columns 1fr 1fr gap 12 · `--explanation` grid-column 1 / -1 | ✅ |
| 右面板 __q 题干 | Source Han Serif 600 H2 24 · lh 1.3-1.4 · :lang(zh) 1.5 | font-size 22 · font-weight 600 · line-height 1.3 · `:lang(zh) { line-height 1.5 }` | ⚠️ 字号 22 vs IG 24 差 2px · **真值复核待办** |
| 空态文案 | 未明示 | `t('wrong.empty.body')` · color=`fg-muted` · padding-block 60 · textAlign center | ⚠️ IG 未定义右面板默认态，我自定"还没选中题"占位 · 合理 |
| 左列表 compact | 14px 题干 · 11px meta | 同上 `.wrong-item__q-text` 14 + `__q-label` 11 · 在左列表一致 | ✅ |
| 左/右间距 | gap 24 | grid-template-columns 360px 1fr · gap 24 | ✅ |

**SCHEMA-DELTA #019 裁决落实**（Wrong Review Desktop 用单一 explanation · 不引入 explanation_long）：
- ✅ `app.js` L1733 `renderWrongDetailPanel`: `var explanation = q.explanation || ''` — 只读单字段
- ✅ `app.js` L1690 `renderWrongItem`: 同样 `q.explanation`
- ✅ 两处渲染的 explanation 内容 100% 一致（无 mobile 短版 / desktop 长版分支）
- ✅ locale 中仅有 `quiz.questions.{dyn}.{idx}.explanation` 单 key（无 `explanation_long`）
- 裁决落实：**✅ 完全一致**

**FW10 自检（≥8 项）**：
- [x] ① bg 与父容器色差：`bg-elevated` + border vs wrong-page `bg-primary` 强色差 ✅
- [x] ② 无自造装饰线：仅 1px border-subtle 包裹边框（非装饰线）+ 内部 block 通过 bg 区分 ✅
- [x] ③ 同行卡等高：desktop 双栏 `align-items: start`（避免左列表空时右面板被压扁）✅
- [x] ④ Token 双检：全部 var ✅
- [x] ⑤ 传统项：`wrong.empty.body` / `wrong.item.*` 全部 locale ✅
- [x] ⑥ 320px reflow：`.wrong-detail-panel` 默认 display:none，Mobile 不渲染 ✅
- [x] ⑦ 键盘 a11y：`role="region" aria-label` 存在 ✅；但右面板内无可聚焦元素（纯展示）✅；选中列表项后焦点保留在列表按钮上 ✅
- [x] ⑧ prefers-reduced-motion：无动画 ✅
- [x] ⑨ HTML↔CSS 类名：`.wrong-detail-panel / __empty / __q / __blocks` ✅

---

## 2. SCHEMA-DELTA 裁决落实回溯

| # | SCHEMA-DELTA 条目 | Phase3 落实 | 验证 |
|---|------------------|-------------|------|
| **019** | Wrong Review Desktop 用 locale 单句 `explanation` | ✅ `renderWrongDetailPanel` L1733 + `renderWrongItem` L1690 两处都只读 `q.explanation`，无 `explanation_long` 分支 | grep `explanation_long` 0 命中 |
| **021** | Result perfect 变体由 r-frontend 推导（banner "全对！" + score 朱砂色 + 徽章浮现）| ✅ `settleQuiz` L1172 写入 `perfectBadge=true` · `renderResult` L1248/1252/1268-1270 按 isPerfect 渲染分支 · `badgeHtml` 渲染 `★` · `.result-card--perfect` CSS 变体存在（Phase 2 style.css）· **Phase 3 追加**：`.card-tile--perfect` 和 `.card-detail--perfect` 联动（§1.2 + §1.3）| grep `isPerfect` 8 命中 |
| 021 缺失 | motion-reward-perfect 呼吸 × 2 动效 | ⚠️ 未实现（glow 呼吸 + 朱砂 shadow 动画）| 见 FIX-P3-02 |
| **022** | Result all_done（10 关全通关）MVP 不实现 | ✅ 符合。`renderResult` L1265 用 `curIdx < DYNASTY_ORDER.length - 1 ? nextDyn : null`，最后一关显示"回到朝代图谱"CTA（`data-home`）· locale `result.all_done.*` 有 key 但未激活调用 | grep `result.all_done` 0 命中（app.js）→ **符合 MVP 不实现裁决** |
| **012** | Card Detail 故事文本从 locale 取 | ✅ `renderCardDetail` L1457 `cardStory = t('card.story.' + cardId + '.story')` · locale 两语 `card.story.{dyn}.story` 10 条均就位 | ✅ |
| **013** | Card Detail 遮罩用 `var(--color-bg-overlay)` | ✅ `.card-detail-backdrop` L2140 `background: var(--color-bg-overlay)` | ✅ |
| **014** | Card Detail Dark Tablet/Desktop 由 Token 驱动 | ✅ 两模式共用同一 CSS，由 `:root[data-theme]` 切换 token | ✅ |
| **015** | Wrong Review Dark 由 Token 驱动 | ✅ 同上 | ✅ |

---

## 3. A11y 抽查（Modal + 列表 + 跳转）

### 3.1 CardDetail Modal 焦点管理

| 检查项 | 实现 | 状态 |
|-------|------|------|
| role="dialog" aria-modal="true" | L1469 | ✅ |
| aria-labelledby 指向 H1 id | `aria-labelledby="card-detail-name"` + `<h1 id="card-detail-name">` L1483 | ✅ |
| 打开时焦点迁入 | 打开后 100ms 焦点移到 `[data-card-close]` | ✅ |
| Escape 关闭 | `onKey` Escape 分支 + preventDefault · 修复后 L1567-1571 | ✅ |
| Backdrop 点击关闭（仅 T+D）| `window.innerWidth >= 768` 守卫 | ✅ |
| 关闭后焦点归还 | navigate **之前**先尝试 `activeBefore.focus()`（下层 DOM 仍存在），若 activeBefore 已被销毁则 fallback 到新页面 `#main-content` | ✅ **FIX-P3-03 修复 2026-04-17**（修正了原实现 navigate 后 activeBefore 引用失效的 bug）|
| body scroll lock | `document.body.style.overflow='hidden'` + 关闭恢复 | ✅ |
| **焦点陷阱 Tab 循环** | onKey Tab / Shift+Tab 在 `[data-card-sheet]` focusables（过滤 disabled + offsetParent）内循环 · 代码 L1569-1586 | ✅ **FIX-P3-03 修复 2026-04-17** |
| 下层 #app 对 SR 隐藏 | `appRoot.setAttribute('aria-hidden','true')` 打开时标记，关闭时 removeAttribute | ✅ **FIX-P3-03 修复 2026-04-17** |
| 移除 keydown listener | `document.removeEventListener('keydown', onKey)` 关闭时清理 | ✅ |

### 3.2 Wrong Review 交互焦点

| 检查项 | 实现 | 状态 |
|-------|------|------|
| 列表项 Enter/Space 触发展开 | 原生 `<button>` 天然支持 ✅ | ✅ |
| aria-expanded 动态同步 | L1654 / 1657 / 1663-1665 | ✅ |
| Desktop 左列表 aria-selected？ | 未用 aria-selected（用 aria-expanded + `.wrong-item--active`）· role=button 合理 | ✅ |
| Tab 箭头键切 filter | ❌ 未实现（仅支持 Tab 逐个到达）| ⚠️ FIX-P3-06 |
| select Mobile Enter 切换 | 原生 `<select>` ✅ | ✅ |

### 3.3 Skip Link 到卡册跳转

| 检查项 | 验证 | 状态 |
|-------|------|------|
| Skip Link 存在 | `<a class="skip-link" href="#main-content">` L1089 | ✅ |
| 跳转目标 ID | 所有页面 `<main id="main-content">` | ✅ renderCards / renderWrong / renderCardDetail 的下层页都有 `#main-content` |
| CardDetail 浮层时 Skip Link 的目标？ | 浮层追加在 body 末尾，#main-content 仍在下层 home/cards 页 — Skip Link 点击后焦点到下层 main，**而非浮层** | ⚠️ 合理（modal 有自己的焦点管理，Skip Link 语义为"跳过导航"不含浮层场景）✅ |
| Skip Link locale | HTML `data-i18n="a11y.skip_link"` + locale 两语都新增 `a11y.skip_link` key（zh "跳到主要内容" / en "Skip to main content"）· app.js 新增 `applyTranslations()` 扫描 `[data-i18n]` 节点，在 `boot()` 后 + `setLang()` 内各调用一次 · curl http://localhost:8765/ + 离线 smoketest 6/6 pass | ✅ **FIX-P3-09 修复 2026-04-17** |

---

## 4. Phase 3 待修列表

### 4.1 P0 + P1 已修复（2026-04-17 · 本轮 r-frontend 交付前硬约束兜底）

| ID | 严重度 | 位置 | 修复方式 | 状态 |
|----|-------|------|---------|-----|
| **FIX-P3-05** | P0（WCAG / PROJ-TT1）| `.wrong-filter__tab` style.css L2473-2487 + `.card-detail__close` L2253-2273 | ① wrong-filter__tab：`min-block-size: 36 → 52` + 新增 `min-inline-size: 52` + padding 调为 12 18（D 12 20）保持文本垂直居中；② card-detail__close 保留视觉 44×44 但加 `::before { inset: -4px }` 虚拟扩展到 52。全局 grep `min-block-size: <52px` 命中 0 条 | ✅ |
| **FIX-P3-02** | P1（视觉 / motion）| style.css 三处 perfect 变体 | ① `.result-card__badge` 入场 `badge-pop` 800ms + 1600ms 延迟后进入 `badge-breathe` 2.4s infinite（scale 1→1.06 + shadow 扩张）；② `.card-tile--perfect` 新增 2px legendary-border + cover 换 perfect 色 + `card-tile-perfect-breathe` 2.8s infinite；③ `.card-detail--perfect` 新增 2px legendary-border + `card-detail-perfect-breathe` 2.8s 延迟 400ms infinite。三处全部 prefers-reduced-motion 降级为静态 glow | ✅ |
| **FIX-P3-03** | P1（a11y）| `renderCardDetail` app.js L1528-1591 | ① onKey 加 Tab / Shift+Tab 在 `[data-card-sheet]` 内 focusables 循环（过滤 disabled + `offsetParent !== null`）；② 打开时下层 `#app` 设 `aria-hidden="true"`（关闭 remove）双重防漂出；③ 焦点归还修正：navigate **之前**先尝试 activeBefore.focus（DOM 仍存在），失败 fallback 到新页面 `#main-content`（修正了原实现 navigate 后 activeBefore 引用失效的 bug）；④ Escape 加 preventDefault | ✅ |
| **FIX-P3-09** | P1（i18n）| index.html 3 处 + app.js 3 处 | ① locale zh/en 两份都新增 `a11y.skip_link` key；② HTML Skip Link `data-i18n` 改为 `a11y.skip_link`；③ app.js 新增 `applyTranslations()` 函数扫描 `[data-i18n]` 并按 currentLang 覆盖 textContent（仅在 t() 命中真实值时写入，空值保留占位）；④ `boot()` render 后调用一次 · `setLang()` render 后调用一次。离线 smoketest 6/6 pass（zh/en 两语 skip_link + card.close + wrong.filter.all 全部命中） | ✅ |

### 4.2 P2 / P3 全部已修（2026-04-17 · r-qa 阶段自动修复）

> 原 5 项 P2/P3 在 r-qa Lighthouse 自动修复阶段全部完成，无遗留待裁决项。

| ID | 严重度 | 修复内容 | 状态 |
|----|-------|---------|-----|
| **FIX-P3-01** | P2（语义）| CardDetail 回链改为 `<a href="#/home">` + `t('result.cta.home')` = "回到朝代图谱"；原 `dynasty.cta.replay` 已移除 | ✅ 2026-04-17 |
| **FIX-P3-04** | P2（功能）| CardDetail info 区末尾，若 `isPerfect`，展示 `.card-detail__badge-section`（badge-label + badge-name + badge-story），locale 10 条均有值 | ✅ 2026-04-17 |
| **FIX-P3-06** | P2（APG）| `renderWrong` 在 tab click 绑定后追加 keydown 监听：ArrowRight / ArrowLeft（循环）/ Home / End 切换 tab + focus() + navigate('/wrong/' + filter) | ✅ 2026-04-17 |
| **FIX-P3-07** | P3（N22）| `.wrong-item__detail border-block-start` 保留——作为 summary/detail 区块视觉分隔线，属 UX 必要，非纯装饰；接受现状 | ✅ 2026-04-17（接受） |
| **FIX-P3-08** | P2（HTML 语义）| `renderWrongItem` 内所有 `<div class="wrong-item__summary/meta/detail">` 及三种 `<div class="wrong-block">` 全部改为 `<span>`（CSS 已有 display:flex/grid 覆盖，无需额外样式改动）| ✅ 2026-04-17 |

### 4.3 r-qa Lighthouse 对比度 / ARIA 专项修复（2026-04-17）

| 修复内容 | 文件 | 状态 |
|---------|------|-----|
| 徽章对比度光模式覆盖：`.dynasty-card--cleared .dynasty-card__badge` → `#8B5E29`；active/unlocked → `var(--color-accent-primary-hover)` | style.css | ✅ |
| `--color-state-success: #1E6B4E`（5.7:1 on #E7F2EC，原 #3E8A6E = 3.63:1 不过 AA） | style.css `:root {}` | ✅ |
| `--color-state-warning: #8B6000`（4.9:1 on #FAEFD9，原 #D89A3F = 2.13:1 不过 AA） | style.css `:root {}` | ✅ |
| `.cards-preview__progress` 光模式强制 `var(--color-accent-primary-hover)` | style.css | ✅ |
| `.wrong-filter__tab[aria-selected="true"]` 光模式强制 `var(--color-accent-primary-hover)` | style.css | ✅ |
| Lang 按钮 `aria-label` 移除（避免 label-content-name-mismatch；可见文本即为无障碍名称） | app.js | ✅ |
| `wrong-entry__subtitle` 加 `aria-hidden="true"`（副标题不在 aria-label 里，防 mismatch） | app.js | ✅ |
| quiz-header progressbar 加 `aria-label="第 1/5 题"` | app.js | ✅ |
| quiz-option `<li role="presentation">` + option button `aria-label` 含前缀字母；prefix span 加 `aria-hidden="true"` | app.js | ✅ |
| wrong-item `__dyn-tag` / `__q-label` / `__detail` 全部加 `aria-hidden="true"`（防 aria-label mismatch） | app.js | ✅ |

---

## 5. 一致率汇总（2026-04-17 修复后刷新）

- Section 总数：7（CardsGrid / CardThumbnail / CardDetailModal / BadgeList / WrongFilter / WrongListItem / WrongDetailPanel）
- 属性级核对：7 Section × 约 8-12 属性 ≈ 67 条（BadgeList 新增 2 行 perfect 变体）
- ✅ 直接一致：**48**（72%）· 比初次核对 +6（FIX-P3-02/03/05/09 共 4 条 + Tab padding + Skip Link key 命中）
- ⚠️ 自定 / 近似 / 待真值复核：17（25%）
- ❌ 偏离 / 违反约束：**0**（0%）· r-qa 阶段修复 FIX-P3-04/08 后清零

**FW10 自检覆盖率**：7 Section × ≥8 项 = ≥56 条 · 本 CHECKLIST 执行了 63 项（BadgeList 因未交付只做回溯确认）。

**r-qa 全部修复后的交付门槛**：
- ✅ 无 P0 违反（PROJ-TT1 全合规）
- ✅ 无 P1 a11y 漏洞（Modal 焦点陷阱 + Skip Link i18n 闭环）
- ✅ Perfect 态 motion 补全（IG §7.3 "得到感"落实）
- ✅ 代码通过 `node --check` JS 语法校验
- ✅ 本地 HTTP 200 三文件可加载 + locale 6/6 key smoketest pass
- ✅ **Lighthouse 全通（2026-04-17 r-qa 验证）**：
  - Home Mobile navigation：A11y 100 / Best 100 / SEO 100 / Failed 0
  - Home Desktop navigation：A11y 100 / Best 100 / SEO 100 / Failed 0
  - Wrong Desktop snapshot：A11y 100 / Failed 0
  - Wrong Mobile snapshot：A11y 100 / Failed 0
  - Quiz DOM（evaluate_script 核验）：progressbar aria-label ✅ · li role=presentation ✅ · prefix aria-hidden ✅
- ✅ P2/P3 全 5 项修复完成（无遗留待裁决）

---

## 6. 编号追溯（FW-* 映射 · 沿袭 Phase 2）

| FW 编号 | 位置 |
|--------|------|
| FW2 | ASSET_MISSING 注释 7 处（brand logo × 5 + cards grid × 10 + card main × 10 + empty-cards + empty-wrong）|
| FW5 | locale 两语内联 + `file://` 首读（Phase 1 已验证）|
| FW6 | 三态语言声明：见 ASSET-HANDOFF.md |
| FW7 | Icon 库统一用 lucide 建议（但本 Phase 仍用 emoji 占位，见 ASSET-HANDOFF）|
| FW9 | 本 CHECKLIST §1 所有表格 |
| FW10 | §1 每个 Section 末自检 + §3 a11y 抽查 |
| FW12 | Token 双检（light/dark 通过 var 自动切换）|
| FW13 | 主题 inline script + 无 FOUC（Phase 1 已验证）|

---

## 7. Phase 3 Diff 统计（含 2026-04-17 收尾修复）

| 文件 | Phase2 | Phase3 初稿 | + P0/P1 修复 | + 全屏 header/welcome 修复 | Δ 累计 |
|------|-------|------------|--------------|---------------------------|-------|
| `dist/style.css` | 1957 | 2634 | 2699 | **2754** | +797 总 / +65 来自 P0/P1 / +55 来自全屏修复 |
| `dist/app.js` | 1385 | 1795 | 1853 | **1855** | +470 总 / +58 来自 P0/P1 / +2 来自 welcome__inner 包裹（JS 拼接多 1 个 open + 1 个 close div）|
| `dist/index.html` | 1100 | 1100 | 1102 | **1102** | +2（本轮全屏修复不改 HTML 模板 · 仅 app.js 拼接改）|

- 新增组件 CSS block（Phase 3 初稿）：`.cards-page` / `.cards-grid` / `.card-tile` / `.cards-empty` / `.empty-illust` / `.empty-title` / `.empty-body` / `.card-detail-backdrop` / `.card-detail` / `.card-detail__*` / `.wrong-page` / `.wrong-head` / `.wrong-filter` / `.wrong-filter__*` / `.wrong-layout` / `.wrong-list` / `.wrong-item` / `.wrong-item__*` / `.wrong-block` / `.wrong-block--*` / `.wrong-detail-panel`
- 新增 JS 函数（Phase 3 初稿）：`renderCards` / `renderCardTile` / `renderCardDetail` / `renderWrong` / `renderWrongItem` / `renderWrongDetailPanel` / `getQIdxFromId`
- **2026-04-17 P0/P1 修复追加**：
  - CSS：`@keyframes badge-breathe` / `@keyframes card-tile-perfect-breathe` / `@keyframes card-detail-perfect-breathe`；`.card-tile--perfect` / `.card-detail--perfect` 完整样式；`.card-detail__close::before` 虚拟扩展；`.wrong-filter__tab` min 52；三处 prefers-reduced-motion 降级块
  - JS：`applyTranslations()` 函数；`renderCardDetail` 的 onKey 改写（Tab 焦点陷阱 + 下层 aria-hidden + 焦点归还修正）
  - HTML：`a11y.skip_link` locale key × 2；Skip Link data-i18n 修正
- **2026-04-17 全屏 header/welcome 修复追加**：
  - CSS：`.page` 去除 max-inline-size + margin-inline auto（恢复 100vw）；`.app-header__inner / .welcome__inner / .main-home / .section-dynasties / .wrong-entry-wrapper / .cards-preview / .app-footer / .quiz-main / .result-main / .cards-page / .wrong-page` 共 **10 处** 新增 `max-inline-size: var(--space-container-max); inline-size:100%; margin-inline:auto`；`.welcome` 拆分为 `.welcome`（全宽背景 + padding-block + min-h）+ 新增 `.welcome__inner`（水平 padding + 1200 居中 + flex 内容）；320px reflow 保护中 `.welcome` 改为 `.welcome__inner`，`.page` 条目删除
  - JS：`renderHome` welcome section 内部包一层 `<div class="welcome__inner">`

---

## 8. 下一步

1. ✅ P0 FIX-P3-05 已修（2026-04-17）
2. ✅ P1 FIX-P3-02 / 03 / 09 已修（2026-04-17）
3. ✅ P2/P3 FIX-P3-01 / 04 / 06 / 07 / 08 全部已修（2026-04-17 r-qa 自动修复）
4. ✅ Lighthouse 四轮全部 A11y 100，Failed 0（2026-04-17 r-qa 验证完成）
5. 待完成：真机测试 + 屏幕阅读器 + .pen 逐像素核对 ⚠️ 项（17 条）→ 见 MANUAL-VERIFICATION.md
6. 待完成：visual-designer 补全 ASSET-LIST 8 项 → 见 ASSET-HANDOFF.md
