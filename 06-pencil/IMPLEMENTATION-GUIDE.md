# IMPLEMENTATION-GUIDE · 迷人的老祖宗

> r-pencil 交接物 D（FW8 强制 Markdown 格式 · 非 jpg 可替代）
> 逐 Section 的 token → hex 映射表（light/dark 双行）+ border + 圆角 + 间距 + 父容器色差确认
> **本文件是 r-frontend 像素级实现的直接依据**
> 覆盖范围：批次 A = Home + Quiz × 3 断点 × 2 模式

---

## 使用说明

- 每列含义：
  - **组件**：语义名 + 在 .pen 中的节点层级
  - **background (L/D)**：token 名 + light hex / dark hex
  - **border**：有 / 无（token + 宽度）
  - **圆角**：token
  - **间距**：padding 和 gap 主要值
  - **父容器色差确认**：该组件 bg 是否与其父容器 bg 不同（N21 核查项）
  - **备注**：特殊行为 / 资产占位 / 对比度风险

- Light hex 来自 design-tokens.md §7 `[data-theme="light"]` 块
- Dark hex 来自 design-tokens.md §7 `[data-theme="dark"]` 块
- 所有 hex 值都是 **Token 映射的 fallback 值**，r-frontend 实现 MUST 用 `var(--color-xxx)` 而非硬编

---

## 1. Home 页 · 全部断点通用组件 token 表

### 1.1 Header 顶栏

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Header 容器 | `bg-primary` #FAF8F3 / #1A1814 | bottom=`border-subtle` #E5E0D3 / #33302A · 1px | 0 | padding-x 16(M) 24(T) 32(D) / padding-y 0 · 高 56/64/72 | 与 page bg 同色（无色差）→ 靠 border-bottom 分区 | SC-NV 顶栏 |
| LogoMark（方块） | `accent-primary` #4A7C74 / #6FA89F | 无 | `radius-md` 10 (M) / 10 (T) / 12 (D) | 尺寸 40/44/48 方形 | **有**（青瓷 on 米白 / 墨黑） | 占位字"祖"，Light fg=#FAF8F3 Dark fg=#1A1814（fg-on-accent 双套）· ASSET-LIST #001 |
| Logo 文字（品牌名） | transparent | 无 | — | gap 12 从 mark | 无 bg | Mobile 省略 / Tablet `brand.name_short` / Desktop `brand.name` · fill=`fg-primary` · Source Han Serif SC 600 20-22px 1.2 |
| 工具按钮（Lang / Theme / Cards） | transparent | 无 | 10 | Mobile 40×40 纯 icon · T/D 44h + padding-x 12-14 + gap 6-8 | 无 bg | hover bg=`bg-secondary` #F2EFE7 / #1F1D19（见 hover 状态节） · fill=`fg-primary` · 触摸目标 ≥48 r-frontend 用 ::before 扩展 |
| Cards 按钮红点 | `accent-secondary` #C04A3A / #CD5B46 | 无 | radius-full 9999 | 8×8 绝对定位 right:6 top:6 | **有**（朱砂 on 透明底 on 米白） | 条件显示（newUnread > 0） |

### 1.2 WelcomeReturn 欢迎区

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Welcome 容器 | `bg-tertiary` #EDF4F2 / #152523 | 无 | 0 | padding 16(M) / 20,24(T) / 24,32(D) · 高 88(M) / 104(T) / 120(D) | **有**（青瓷淡底 on bg-primary 米白） | 层次：elevation-0 |
| 标题 "欢迎回来" | transparent | 无 | — | gap 6(M) / 8(T/D) 到副标 | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · 24(M)/30(T)/36(D) · lh 1.2 |
| 副标 progress_summary | transparent | 无 | — | — | 无 bg | fill=`fg-secondary` #4A4438 / #E5E0D3 · HarmonyOS Sans SC 500 · 14(M)/15(T)/16(D) · lh 1.5 |

### 1.3 DynastyCard 朝代卡 · 四态

#### 1.3.1 Perfect 态（满分）· 以"夏"为例

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 卡容器 | `level-perfect-bg` #F5D3CC / #5C221B | 无 | `radius-lg` 16(M) / 20(T) / 16(D) | padding 12,16(M) / 20(T) / 14(D) · 高 72/140/140 | **有** | 可选 elevation-1 for hover |
| StatusIcon 圆 | `accent-secondary` #C04A3A / #CD5B46 | 无 | radius-full | 48(M)/56(T)/40(D) 方形 | **有** | 子字"★" · fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 |
| NameBlock 文字块 | transparent | 无 | — | gap 2-4 内部 | 无 bg | Name fill=`level-perfect-fg` #7D2F24 / #EBA89B · 22-26px 600 |
| Era 副标 | transparent | 无 | — | — | 无 bg | fill=`level-perfect-fg`（同 Name 色）· 13-14 500 · lh 1.4 |
| Badge 胶囊 | `accent-secondary` #C04A3A / #CD5B46 | 无 | radius-full | padding 4,10 · gap 0 | **有** | 内容"全对 ★" · fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 |

#### 1.3.2 Cleared 态（通关，未满分）· 以"商 / 周"为例

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 卡容器 | `level-cleared-bg` #F1E0C4 / #50351B | 无 | 16/20/16 | 同上 | **有** | 同上 |
| StatusIcon 圆 | `accent-cultural` #B67B3D / #C4934D | 无 | radius-full | 同上 | **有** | 子字"✓" · fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 |
| Name / Era | transparent | 无 | — | — | 无 bg | fill=`level-cleared-fg` #714B26 / #E4C697 |
| Badge 胶囊 | `accent-cultural` #B67B3D / #C4934D | 无 | radius-full | 同上 | **有** | 内容"3/5" 或 "4/5" · fg=`fg-on-accent` |

#### 1.3.3 Active 态（进行中 · 有呼吸/ring 动效）· 以"秦"为例

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 卡容器 | `level-active-bg` #D6E6E1 / #223936 | **2px `level-active-ring`** #4A7C74 / #6FA89F | 16/20/16 | 同上 | **有** | ring 动效：box-shadow 呼吸 scale(1) → scale(1.008) infinite 2.4s · **需要实现 .level-active 类的动画** |
| StatusIcon 圆 | `accent-primary` #4A7C74 / #6FA89F | 无 | radius-full | 同上 | **有** | 子字"▶" · fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 |
| Name / Era | transparent | 无 | — | — | 无 bg | fill=`level-active-fg` #2F4E4A / #B5D0C7 |
| Badge 胶囊 | `accent-primary` #4A7C74 / #6FA89F | 无 | radius-full | 同上 | **有** | 内容"继续（2/5）" · fg=`fg-on-accent` |

#### 1.3.4 Locked 态

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 卡容器 | `level-locked-bg` #F2EFE7 / #1F1D19 | 无 | 16/20/16 | 同上 | **有** | 可选 `pointer-events: auto` · 但 aria-disabled=true |
| StatusIcon 圆 | `border-subtle` #E5E0D3 / #33302A | 无 | radius-full | 同上 | **有** | 子字"🔒" · fg=`level-locked-fg` #9A9282 / #6B6456 |
| Name / Era | transparent | 无 | — | — | 无 bg | fill=`level-locked-fg` · Name 为灰；副文"通关 X 解锁"同色 |
| Badge | ❌ 不显示 | — | — | — | — | Locked 态无 badge |

### 1.4 WrongEntry 错题入口

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `state-danger-bg` #F8E4E4 / #3A1616 | 无 | `radius-lg` 16-20 | padding 16,20 · 高 72(M)/88(T)/88(D) | **有** | 点击 role=link |
| icon 👀 | transparent | — | — | gap 12 到文字 | 无 bg | fill=父容器字色 |
| 主文字 | transparent | — | — | — | 无 bg | fill=`level-perfect-fg` #7D2F24 / #EBA89B（朱砂深字/明字）· 17-18 500 |
| 副文字 "不考你，就是看看"（仅 Desktop） | transparent | — | — | gap 2 | 无 bg | fill=`state-danger` #B53A3A / #D47373 · 14 400 |
| `›` 箭头 | transparent | — | — | — | 无 bg | fill=`state-danger` · 24-28 500 |

### 1.5 CardsPreview 卡册缩略

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 区标题 "解锁的卡片" | transparent | — | — | gap 12 到行 | 无 bg | fill=`fg-muted` #6B6456 / #C9C2B0 · 14-15 500 |
| 卡缩略容器（已解锁） | `bg-elevated` #FFFFFF / #26231E | 1.5px `rarity-rare-border` #B67B3D / #C4934D | `radius-md` 10-12 | padding 4-8 · 尺寸 72×88~100 (M/T) / 56×72 (D) | **有** | 内部上半图 + 下半文字 |
| 卡缩略内插画块 | `level-cleared-bg` #F1E0C4 / #50351B | — | 8 | 高 40-56 | **有** | 占位色块 · ASSET-LIST #003 |
| 卡缩略文字 | transparent | — | — | — | 无 bg | fill=`level-cleared-fg` #714B26 / #E4C697 · 9-11 500 |
| 卡缩略容器（未解锁） | `level-locked-bg` #F2EFE7 / #1F1D19 | 1.5px `rarity-common-border` #C9C2B0 / #6B6456 | 10-12 | 同上 | **有** | 内部"?" 占位 |
| "+N 更多"块 | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | 10-12 | center 对齐 | **有** | fg=`fg-muted` |

---

## 2. Quiz 页 · 全部断点通用组件 token 表

### 2.1 QuizHeader 答题页顶栏

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Header 容器 | `bg-primary` #FAF8F3 / #1A1814 | bottom=`border-subtle` 1px | 0 | padding-x 16/24/32 · 高 56/64/64 | 与 page bg 同色 | 无语言切换 / 主题切换 / 卡册入口（Schema §3 模块 B）|
| 返回 ← 按钮 | transparent | 无 | 10 | 40(M)/44(T/D) 方形 | 无 bg | fill=`fg-primary` |
| 朝代名 "夏" | transparent | 无 | — | gap 12-16 | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · 22-24 1.2 |
| 进度文字 "第 3/5 题"（仅 T/D） | transparent | 无 | — | — | 无 bg | fill=`fg-muted` · 14 500 |
| 进度点（5 个圆点） | — | — | radius-full | gap 6-8 | — | 已答 fill=`accent-primary` · 当前 fill=`accent-primary` + 2px `accent-secondary` ring · 未答 fill=`border-subtle` |

### 2.2 DynastyIllustration 朝代插画区

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `bg-tertiary` #EDF4F2 / #152523 | 无 | 0 | 高 160/240/655（Desktop 左栏全高） | **有** | 底部渐变遮罩（仅 M/T）· Light `linear-gradient(to bottom, transparent, rgba(250,248,243,0.85))` / Dark `rgba(26,24,20,0.88)` |
| 占位 🏛 图标 | transparent | 无 | — | center | 无 bg | fill=`accent-primary` · ASSET-LIST #002 真实插画待补 |

### 2.3 Question Stem 题干

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `bg-primary` | 无 | 0 | padding 16,20(M) / 40,24(T) / 48(D) | 无色差 | 容器用于控制 padding 和 max-width |
| "第 3/5 题" label（仅 Mobile，T/D 在 header） | transparent | — | — | gap 8 到题干 | 无 bg | fill=`fg-muted` · 13 500 |
| 题目文字 | transparent | — | — | — | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · **22 (M) / 30 (T) / 32 (D)** · **:lang(zh) 行高 1.7** (Schema §4.2) |

### 2.4 Options 4 选项按钮

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 默认态 (A/C/D) 容器 | `bg-elevated` #FFFFFF / #26231E | 1px `border-strong` #C9C2B0 / #6B6456 | `radius-md` 10-12 | padding 12,16(M)/14,20(T/D) · 高 56(M)/64(T)/68(D) | **有** | hover (pointer:fine only)：bg=`answer-hover-bg` #EDF4F2 / #152523 + translateY(-1px) + elevation-1 |
| 前缀字母徽章 (A/C/D) | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | radius-full | 32/36/40 方形 | **有** | fg=`fg-primary` 600 14-16 |
| 选项文字 | transparent | — | — | gap 12-16 from prefix | 无 bg | fill=`fg-primary` · HarmonyOS Sans SC 500 · 16-18 1.4 |
| **已选未提交 (B)** 容器 | `answer-hover-bg` #EDF4F2 / #152523 | **2px `answer-selected-border`** #4A7C74 / #6FA89F | 10-12 | 同上 | **有** | |
| B 前缀徽章 | `accent-primary` #4A7C74 / #6FA89F | 无 | radius-full | 同上 | **有** | **fg=`fg-on-accent`** L=#FAF8F3 D=#1A1814（⚠️ 本稿 Dark 未兜底深字，见 SCHEMA-DELTA #003） |
| B 选项文字 | transparent | — | — | — | 无 bg | fill=`level-active-fg` #2F4E4A / #B5D0C7 · 16-18 600 |
| B "已选" label | transparent | — | — | align-right | 无 bg | fill=`accent-primary` · 12-13 500 · SCHEMA-DELTA #008 待 locale 回写 key |
| **答对态** 容器 | `answer-correct-bg` #E7F2EC / #1D3A2E | 2px `answer-correct-border` #3E8A6E / #7BB396 | 10-12 | 同上 | **有** | 前缀替换为 ✓ icon (jade)，**未在本批次绘制**（待批次 B 补） |
| **答错态（用户选）** 容器 | `answer-wrong-bg` #F8E4E4 / #3A1616 | 2px `answer-wrong-border` #B53A3A / #D47373 | 10-12 | 同上 | **有** | 前缀替换为 ? icon (不用 X) · 文化避免 + 儿童不羞辱 · 同上待批次 B 补 |

### 2.5 Next CTA（Sticky Mobile / Inline Tablet+Desktop）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Sticky bar 外壳（仅 Mobile） | `bg-primary` | top=`border-subtle` 1px | 0 | padding 8,16,24,16 · 高 72-88 含 safe-area-inset-bottom | 无色差 | position:sticky bottom:0 · z-index:10 |
| CTA 主按钮 (启用) | `accent-primary` #4A7C74 / #6FA89F | 无 | `radius-lg` 12 | Mobile 全宽 · T/D padding-x 40/44 · 高 56 | **有** | fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 · 字体 HarmonyOS Sans SC 600 17-18 · ⚠️ Dark 白字需要兜底深字（Token 已定义 --color-fg-on-accent=#1A1814） |
| CTA 主按钮 (禁用 · 未选答案时) | `fg-disabled` #9A9282 / #9A9282（两模式共用）或 `bg-secondary` + opacity 0.5 | 无 | 12 | 同上 | 有或弱差 | fg=`fg-on-accent` · opacity 0.7 或 color-adjust · a11y aria-disabled=true |

---

## 3. 全断点 Radius / Spacing / Typography Token 快速查表

```
// 色值不再列（见上表） · 非颜色 Token
--radius-md: 10
--radius-lg: 16
--radius-xl: 24
--radius-2xl: 32
--radius-full: 9999

--space-1: 4 / --space-2: 8 / --space-3: 12 / --space-4: 16 / --space-5: 24 / --space-6: 32 / --space-7: 48 / --space-8: 64

--fs-display: clamp(32,6vw,56) // 大标题 (Home H1)
--fs-h1: clamp(28,4.5vw,40)    // 页面 H1
--fs-h2: clamp(22,3.5vw,30)    // 区块标题 (十个朝代)
--fs-h3: clamp(18,2.8vw,22)    // 题干 / 卡内朝代名 (mobile)
--fs-body-lg: 18                // 选项文字 (desktop)
--fs-body: 16                   // 常规 (选项 mobile/tablet)

--fw-regular: 400 / --fw-medium: 500 / --fw-semibold: 600

--lh-tight: 1.2 (标题) / --lh-snug: 1.35 (H2/H3) / --lh-normal: 1.55 (body) / --lh-loose: 1.75 (长故事)
// CJK 覆盖：:lang(zh) line-height: 1.7 for body

--font-display: "Source Han Serif SC, Noto Serif SC, Songti SC, SimSun, Playfair Display, Georgia, serif"
--font-body: "HarmonyOS Sans SC, Source Han Sans SC, Noto Sans SC, PingFang SC, Microsoft YaHei, Inter, -apple-system, sans-serif"
--font-numeric: "Inter, SF Pro Display, ui-monospace, sans-serif" + tabular-nums

--touch-target-min: 48(WCAG AAA) · PROJ-TT1 提升到 52
--touch-target-comfortable: 56
--touch-spacing-min: 8
```

---

## 4. 对比度核查矩阵（见 SCHEMA-DELTA · 逐色对比 [待验证 webaim]）

| 颜色对 | Light | Dark | 预估对比度 | 结论 |
|--------|-------|------|-----------|------|
| fg-primary on bg-primary | #1A1814/#FAF8F3 | #FAF8F3/#1A1814 | ~15:1 | ✅ |
| fg-secondary on bg-primary | #4A4438/#FAF8F3 | #E5E0D3/#1A1814 | 10-12:1 | ✅ |
| fg-muted on bg-primary | #6B6456/#FAF8F3 | #C9C2B0/#1A1814 | 5-9:1 | ✅（Light 需重点实测）|
| Perfect fg/bg | #7D2F24/#F5D3CC | #EBA89B/#5C221B | ~6:1 | ✅ |
| Cleared fg/bg | #714B26/#F1E0C4 | #E4C697/#50351B | ~6:1 | ✅ |
| Active fg/bg | #2F4E4A/#D6E6E1 | #B5D0C7/#223936 | ~7:1 | ✅ |
| Locked fg/bg | #9A9282/#F2EFE7 | #6B6456/#1F1D19 | ~2.8-3:1 | ⚠️ disabled 豁免 + 🔒 icon 形状区分 |
| fg-on-accent on CTA | #FAF8F3/#4A7C74 | #FAF8F3/#6FA89F | L ~4.8 / D ~3.2 | L 临界 · **D 不达标** · **dark 必须改深字 #1A1814（Token 已定义，r-frontend 在 CSS 中应用）** |
| state-danger fg/bg | #7D2F24/#F8E4E4 | #EBA89B/#3A1616 | ~5-6:1 | ✅ |

---

## 5. 资产 / 行为差异列表（r-frontend 重点看）

### 5.1 资产缺口（ASSET-LIST.md 详）
- #001 Brand Logo（当前"祖"字青瓷方块占位）
- #002 10 朝代插画（当前 🏛 emoji 占位，答题页主视觉 + 图谱卡不依赖，但在最终出版 MUST 全部由 visual-designer 产出）
- #003 10 张知识卡缩略封面（当前纯色块占位）

### 5.2 r-frontend 需要自行实现的动效
- **Level-Active 呼吸 ring**：box-shadow 呼吸 2.4s infinite（design-tokens §5.3 motion-discover 扩展）
- **朝代卡 hover**（pointer:fine）：translateY(-2px) + elevation-2 transitions 160ms
- **选项 hover**（pointer:fine）：translateY(-1px) + bg=answer-hover-bg 160ms
- **答对/答错反馈**：scale(1)→scale(1.03)→scale(1) 240ms ease-spring-soft（本批次未绘制反馈态，批次 B 补）
- **主题切换过渡**：仅 color/background-color/border-color/fill/stroke 过渡 160ms ease-in-out（TM6 合规）
- **CTA 切换态（反馈时 CTA 文字从"下一题"→"看结果"）**：仅 text-content 切换，无动效

### 5.3 r-frontend 需要 i18n 实现的关键点
- **所有文案 100% 来自 locale-zh.json / locale-en.json**（唯一待补：quiz 题库 #SCHEMA-DELTA-007）
- **`:lang(zh) { line-height: 1.7 }` 覆盖 body/body-lg**（CJK 行高 Schema §4.2）
- **朝代名 "三国" → "Three Kingdoms" (700% 膨胀) 卡内 min-height 保证两行**
- **CTA padding 弹性**：用 min-width + padding 而非 fixed width
- **Logo 品牌名 Mobile/Tablet/Desktop 切换**：`.mobile-only` / `.desktop-only` + key / key_mobile 机制
- **欢迎区 body 仅 Tablet+Desktop 显示**：同上机制

---

## 6. r-frontend 开工前置检查

- [ ] SCHEMA-DELTA.md 全部项目已审批（特别是 #007 题库必须回写 locale 否则 Quiz 页无内容）
- [ ] ASSET-LIST.md 的 #001 #002 #003 资产或标注 ASSET_MISSING 方式已确认
- [ ] Design Token CSS 变量表（design-tokens.md §7）已移植到代码
- [ ] 批次 B 完成（结算页 + 知识卡浮层 + 错题回看）

---

**本 IMPLEMENTATION-GUIDE 覆盖批次 A。批次 B 追加章节见下。**

---

# 批次 B · Result + Card Detail + Wrong Review Token 映射

## 7. Result 结算页

### 7.1 Header 顶栏（标题"夏朝 · 结算"）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Header 容器 | `bg-primary` #FAF8F3 / #1A1814 | bottom=`border-subtle` 1px | 0 | padding-x 16/24/32 · 高 56/64/72 | 与 page bg 同色 | 无 lang/theme 切换（结算仪式进行中）|
| 返回 ← 按钮 | transparent | 无 | `radius-md` 10 | 40/44/44 方形 | 无 bg | fill=`fg-primary` |
| 结算标题 "夏朝 · 结算" | transparent | 无 | — | gap 12 | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · 18/22/24 · lh 1.2 |

### 7.2 Stage 1 · 得分揭示区

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器（Mobile） | `bg-tertiary` #EDF4F2 / #152523 | 无 | 0（通栏） | padding 40,24,32,24 | **有**（青瓷淡底 on 米白） | Mobile 无外层 wrapper，直接 section |
| 容器（Tablet/Desktop） | `bg-tertiary` | 无 | `radius-xl` 24(T) / `radius-2xl` 32(D) | padding 40,32(T) / 48,40(D) · width 560(T) / 640(D) | **有** | 卡片形态 |
| Banner "闯关成功" | transparent | 无 | — | gap 12-20 to score | 无 bg | fill=`level-active-fg` #2F4E4A / #B5D0C7 · Source Han Serif SC 600 · 28/32/36 · lh 1.2 · textAlign center |
| Score "3 / 5" 大字 | transparent | 无 | — | — | 无 bg | fill=`fg-primary` · font-numeric Inter 600 · **72/96/120** · lh 1.05-1.1 · textAlign center · tabular-nums |
| 副标（成绩描述） | transparent | 无 | — | — | 无 bg | fill=`fg-muted` #6B6456 / #C9C2B0 · 14/15/16 400 · textAlign center · 可 parameterized 从 locale 取（结算场景文案备选） |

**Banner 文案分支**（r-frontend 按 score 渲染）：
- score=5 → `result.banner.perfect = "全对！"` · fg=`level-perfect-fg`（朱砂深 #7D2F24 / 朱砂明 #EBA89B）· Score 数字加 朱砂 glow
- score 1-4 → `result.banner.cleared = "闯关成功"` · fg=`level-active-fg`
- score=0 → `result.banner.cleared_partial = "走完了这一关"` · fg=`fg-secondary` · 低调不羞辱

### 7.3 Stage 2 · 卡片 Reveal

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Stage2 外容器 | transparent | 无 | — | padding 24,20(M) / gap 12 · width 335(M) / 400(T) / 440(D) | 无 bg | 居中 |
| "解锁了一张新卡" label | transparent | 无 | — | gap 12 | 无 bg | fill=`accent-cultural` #B67B3D / #C4934D · 14-16 500 · textAlign center |
| 卡片容器 | `bg-elevated` #FFFFFF / #26231E | **2px `accent-cultural`** #B67B3D / #C4934D | `radius-lg` 20 / 20 / 24 | — · height 280/340/380 | **有** | 受 motion-reward-unlock 入场 |
| 卡片图区（上） | `level-cleared-bg` #F1E0C4 / #50351B | 无 | 上半圆角 20/24（继承） | 高 180/224/252 · center 布局 | **有**（米黄底 on 白/暗卡） | 占位 🏛 fg=`level-cleared-fg` 88/112/132px |
| 卡片信息区（下） | `bg-elevated` 同 | 无 | 下半圆角 | padding 14,16(M) / 16,20(T) / 20,24(D) · gap 6 | 无 bg | — |
| 分类 tag (人/器/事) | transparent | 无 | — | — | 无 bg | fill=`accent-cultural` · 12-14 500 · 文案 `card.category.{kind}` + " · " + `card.from_dynasty` |
| 卡名 (H2) | transparent | 无 | — | — | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · 22/24/28 · lh 1.2 |
| "点一下看看" 提示 | transparent | 无 | — | — | 无 bg | fill=`accent-primary` #4A7C74 / #6FA89F · 13-14 500 · 文案 `result.card_reveal.tap_hint` |

**Perfect 态额外（未绘制，r-frontend 按此推导）**：
- 卡片边框由 `accent-cultural` → `rarity-legendary-border` #C04A3A / #CD5B46
- 外加 `rarity-legendary-glow` rgba(192,74,58,0.3) / rgba(205,91,70,0.4) shadow-filter
- 徽章浮现：卡片右上角绝对定位 48×48 朱砂圆 + ★ + motion-reward-perfect 呼吸 × 2

### 7.4 Wrong Entry 错题入口（条件显示）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `state-danger-bg` #F8E4E4 / #3A1616 | 无 | `radius-md` 12 | padding 0,16(M) · 高 56 · justify-center / Mobile | **有** | 文案 `result.wrong_entry = "看看刚才哪里差一点"` |
| 文字 | transparent | 无 | — | — | 无 bg | fill=`level-perfect-fg` #7D2F24 / #EBA89B · 15 500 |
| `›` 箭头 | transparent | 无 | — | — | 无 bg | fill=`state-danger` #B53A3A / #D47373 · 20 500 |

### 7.5 CTA 组（Mobile Sticky / Tablet+Desktop 内嵌）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Sticky 容器（Mobile） | `bg-primary` | top=`border-subtle` 1px | 0 | padding 16,16,24,16 · 高 104（含 safe-area）| 无色差 | `position: sticky; bottom: 0; z-index: 10` |
| 主 CTA "进入 商朝"（Mobile） | `accent-primary` #4A7C74 / #6FA89F | 无 | 12 | 全宽 · 高 56 | **有** | fg=`fg-on-accent` L=#FAF8F3 D=#1A1814 · Source Han Serif SC 600 17 · 文案 `result.cta.next_dynasty` |
| 更多 ⋯ overflow（Mobile） | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | 12 | 56×56 | **有** | fg=`fg-secondary` · 点击弹 Bottom Sheet listbox (home / replay / wrong_entry) |
| 次 CTA 组（Tablet/Desktop）| transparent 横排 | 无 | — | gap 12-16 | — | 内嵌 padding-top 16-20 |
| 次 CTA "回朝代图谱" | `bg-secondary` | 无 | 12 | 高 52 · padding-x 24-28 | **有**（弱差）| fg=`fg-secondary` #4A4438 / #E5E0D3 · 15-16 500 · 文案 `result.cta.home` |
| 次 CTA "看看哪里差一点" | `state-danger-bg` | 无 | 12 | 高 52 · padding-x 20-24 | **有** | fg=`level-perfect-fg` · 15-16 500 · 文案 `result.wrong_entry` |
| 主 CTA "进入 商朝 →"（Tablet/Desktop）| `accent-primary` | 无 | 12 | 高 52-56 · padding-x 32-40 | **有** | fg=`fg-on-accent` · 16-17 600 · 文案 `result.cta.next_dynasty` + 装饰箭头 |

---

## 8. Card Detail 知识卡浮层

### 8.1 Mobile 全屏浮层 (M-CardDetail)

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 浮层容器 | `bg-primary` #FAF8F3 / #1A1814 | 无 | 0（全屏）| width 375 height 100vh | — | 从底部上滑入 · motion-flip-enter 360ms |
| 顶栏 | `bg-primary` | 无 | — | 高 56 · padding 0,8,0,16 | 无色差 | 仅放 × 关闭（左上）|
| × 关闭按钮 | transparent | 无 | radius-full 9999 | 44×44（safe-area-top + 8）| 无 bg | fg=`fg-primary` · 28px 400 · aria-label=`card.close` |
| 主视觉图区 | `level-cleared-bg` #F1E0C4 / #50351B | 无 | 0（全宽）| 高 300 · center | **有** | 占位 🏛 150px fg=`level-cleared-fg` · ASSET-LIST #004（真实卡主视觉）|
| 信息区 | `bg-primary` | 无 | 0 | padding 20 · gap 12 | 无色差 | max-width 335 |
| 分类 tag (人物) | `level-cleared-bg` | 无 | radius-full | padding 4,10 | **有** | fg=`level-cleared-fg` · 12 500 · 文案 `card.category.person` |
| 朝代 tag (来自 夏朝) | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | radius-full | padding 4,10 | **有** | fg=`fg-muted` · 12 500 · 文案 `card.from_dynasty` |
| 卡名 (H1) | transparent | 无 | — | — | 无 bg | fill=`fg-primary` · Source Han Serif SC 600 · 32 · lh 1.2 |
| 故事正文 | transparent | 无 | — | — | 无 bg | fill=`fg-primary` · HarmonyOS Sans SC 400 · **17 · :lang(zh) lh 1.7** · 文案 `card.story.{cardId}` ≤120 字中 · max-width 335 · word-wrap MUST |
| 回朝代链接 | transparent | 无 | — | — | 无 bg | fill=`accent-primary` · 14 500 · role=link 跳 /?dynasty=xia |

### 8.2 Tablet/Desktop Modal 形态

Tablet-768：Modal 560×720 居中 · radius 24 · 遮罩 `bg-overlay`
- 结构同 Mobile 但：
  - × 按钮移到右上角
  - 主视觉图区高 320（不占全宽，继承 Modal 圆角）
  - 信息区 padding 24,32,32,32 · 卡名 H1 36px · 故事 17/1.7 max-width 496

Desktop-1024：Modal 720×520 居中 · radius 24 · **两栏布局**
- 左栏 360×fill (height) · bg=`level-cleared-bg` · 主图 🏛 200px 居中
- 右栏 360×fill：
  - 顶部 48h TopBar 仅放 × 按钮
  - 信息区 padding 0,32,32,32 · 卡名 H1 40px · 故事 17/1.7 max-width 296

**遮罩**：`bg-overlay` rgba(26,24,20,0.55) Light / rgba(0,0,0,0.65) Dark · 点遮罩关闭（Desktop+Tablet）

---

## 9. Wrong Review 错题回看

### 9.1 Header + 标题区

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Header | `bg-primary` | bottom=`border-subtle` 1px | 0 | 高 56/64/72 · padding-x 16/24/32 | 无色差 | 标题 `wrong.title = "再来看一眼"` · Source Han Serif SC 600 · 22/24/28 |
| 标题副标（Tablet+Desktop） | `bg-primary` | 无 | 0 | padding 20,24(T) / 20,32(D) | 无色差 | 文案 `wrong.subtitle = "不考你，就是看看"` · fg=`fg-muted` · 15-16 400 |

### 9.2 Filter（Mobile 下拉 · Tablet+Desktop 水平 Tab）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| **Mobile 下拉 select** | `bg-elevated` #FFFFFF / #26231E | 1px `border-strong` #C9C2B0 / #6B6456 | `radius-md` 12 | 高 56 · padding-x 16 · justify space_between | **有** | fg=`fg-primary` · 16 500 · role=combobox · ▾ 箭头 fg=`fg-muted` · 文案 "全部（{count} 题）" |
| **Tablet/Desktop Tab active** | `accent-primary` #4A7C74 / #6FA89F | 无 | radius-full | padding 8,14(T) / 8,16(D) · 高 auto | **有** | fg=`fg-on-accent` · 14 600 · role=tab aria-selected=true · 文案 `wrong.filter.all` + " ({count})" |
| **Tab 未激活** | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | radius-full | 同上 | **有** | fg=`fg-secondary` #4A4438 / #E5E0D3 · 14 500 · 每朝代名用 `dynasty.{id}.name` |

### 9.3 列表项（Collapsed / Expanded）

#### 9.3.1 Collapsed 态

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | `radius-lg` 14 | padding 16/18 · justify space_between | **有** | role=button aria-expanded=false |
| 朝代 tag (夏)  | `level-cleared-bg` | 无 | radius-full | padding 2,6(D) / 2,8(M/T) | **有** | fg=`level-cleared-fg` · 10-11 600 Source Han Serif |
| 朝代 tag (秦/active 朝代) | `level-active-bg` #D6E6E1 / #223936 | 无 | radius-full | 同上 | **有** | fg=`level-active-fg` |
| "第 N 题" label | transparent | 无 | — | gap 8 | 无 bg | fill=`fg-muted` · 11-13 500 · 文案从题库 meta 取 |
| 题干（短版）| transparent | 无 | — | max-width 250-560 | 无 bg | fill=`fg-primary` · 14-16 500 · lh 1.4 · 可能 clamp 2 行 |
| ▸ 箭头 | transparent | 无 | — | — | 无 bg | fill=`fg-muted` · 18 500 |

#### 9.3.2 Expanded 态（Mobile/Tablet 原位展开 · Desktop 右侧面板）

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| 容器 | `bg-elevated` #FFFFFF / #26231E | 1px `border-strong` #C9C2B0 / #6B6456 | 14-16 | padding 16-20 · gap 12-14 | **有** | role=button aria-expanded=true（Mobile/Tablet）或 role=region（Desktop right panel） |
| 题干（完整）| transparent | 无 | — | max-width 260-580 | 无 bg | fill=`fg-primary` · Source Han Serif SC 600（Desktop H2 24）· 15-24 · lh 1.3-1.4 |
| ▾ 箭头 | transparent | 无 | — | — | 无 bg | fill=`accent-primary` · 18 500 |
| **"你选的" 区块** | `bg-secondary` #F2EFE7 / #1F1D19 | 无 | `radius-md` 10 | padding 10-12,12-18 · gap 4 | **有** | label fg=`fg-muted` 12 500 · 文案 `wrong.item.your_answer` · 答案 fg=`fg-primary` 15-17 500 |
| **"正确答案" 区块** | `state-success-bg` #E7F2EC / #1D3A2E | 1px `state-success` #3E8A6E / #7BB396 | 10 | 同 | **有** | label fg=jade-700 #2A6450 / jade-300 #7BB396 · ✓ icon fg=`state-success` 14 600 · 文案 `wrong.item.correct_answer` · 答案 fg=`fg-primary` 15-17 **600（加粗强调正面）** |
| **"为什么" 区块** | `state-warning-bg` #FAEFD9 / #3D2E12 | 无 | 10 | padding 10-14,12-18 · gap 4-6 | **有** | label fg=apricot-700 #9A6A24 / apricot-300 #E8BE7A 12-13 500-600 · 文案 `wrong.item.explanation` · 正文 fg=`fg-primary` 14-15 400 · lh 1.6-1.7 · max-width 275-520 |

**Desktop 双栏布局**：
- 左列表 360 宽 · 列表项 padding 14,16 · 内容 compact（14px 题干 · 11px meta）
- 左列表 active item：bg=`bg-tertiary` #EDF4F2 / #152523 + 2px `accent-primary` ring · 字=`level-active-fg`
- gap 24 到右详情面板
- 右详情面板容器 `bg-elevated` + 1px `border-subtle` + radius 16 · padding 20,24 · gap 20
- 右面板内"你选的/正确答案"并排（各 50% gap 12）· "为什么"独立全宽下方

### 9.4 空态

| 组件 | background (L / D) | border | 圆角 | 间距 | 父容器色差 | 备注 |
|------|-------------------|--------|------|------|----------|------|
| Empty 容器 | `bg-primary` | 无 | 0 | padding 64,24 center | 无色差 | 当无错题时显示 · 文案 `wrong.empty.title = "太棒了"` + body |
| 空态插画（占位）| — | — | — | 200×200 | — | **ASSET-LIST #006**（线条 SVG currentColor）|
| 空态标题 | transparent | — | — | gap 12 | — | fg=`fg-primary` · Source Han Serif SC 600 · 22 · textAlign center |
| 空态 body | transparent | — | — | — | — | fg=`fg-secondary` · 15-16 400 · lh 1.6 · textAlign center |

---

## 10. Cover 图与 ASSET-LIST 对照总览（批次 A + B 综合）

参见 `06-pencil/ASSET-LIST.md`，综合 7 项资产缺口、字体加载策略、lucide-icons 建议、资产目录结构。

---

## 11. r-frontend 开工前置检查（综合批次 A + B）

- [ ] 所有 SCHEMA-DELTA 项已审批（尤其 #007 题库 + #012 card.story · 两者 P0 必须先回写 locale 再开工）
- [ ] ASSET-LIST 7 项资产决策确认：`<!-- ASSET_MISSING -->` 占位 vs 真实资产上线
- [ ] Design Token CSS 变量表完整移植（design-tokens.md §7 · 两套主题变量）
- [ ] `:lang(zh) { line-height: 1.7 }` 覆盖 body/body-lg
- [ ] 移动端独有组件已实现（Home sticky CTA 条件 / Quiz sticky CTA / Result sticky CTA + overflow menu / CardDetail 全屏浮层 / WrongReview 下拉 filter / MidQuizPrompt Bottom Sheet / ExitConfirm Bottom Sheet / ReplayConfirm Bottom Sheet）
- [ ] 主题切换 3 态（light/dark/system）+ FOUC 防护（inline script 在 head 最前）+ CSS var 驱动
- [ ] 文案 100% 来自 locale（Quiz 题库 + Card 故事必须回写 locale 后才能完整）
- [ ] 反馈动效实现（motion-reward-correct / motion-reward-unlock / motion-reward-perfect · motion-flip-enter 翻题 · motion-discover hover）· 全部 ≤ 800ms · `prefers-reduced-motion` 降级到 80ms
- [ ] 对比度实测（r-qa 阶段 webaim 人工核验）· SCHEMA-DELTA #003 风险实测后决定是否 fallback
- [ ] Touch Target ≥ 52px（PROJ-TT1）· 间距 ≥ 8px
- [ ] Logical properties（margin-inline-* / padding-inline-*）· 逻辑方向（即使本项目无 RTL）
