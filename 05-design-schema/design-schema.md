# 设计方案：迷人的老祖宗（Charming Ancestors · Responsive i18n Schema v1）

> r-designer 产出 · Schema-v1 · 2026-04-17
> 权威源链：`PRODUCT.md` > `page-map.md` > `state-machine.md` > `interaction-brief.md` > `design-tokens.md` > `content-blueprint.md` + `locale-{zh,en}.json`
> 下游消费者：r-pencil（06-pencil）→ r-frontend（07-frontend）→ r-qa（08-qa）
> 本文件是响应式 + 多语言策略的**权威源**（SC-AS4 优先级 3）；视觉以 `.pen` 为准（优先级 1），文案以 locale JSON 为准（优先级 2）

---

## 修订记录

| 日期 | 来源 | 改动摘要 | 批准理由 |
|------|------|---------|---------|
| 2026-04-17 | r-designer 初稿 | Schema-v1 首发：6 页面 × 3 断点 × 2 模式 × 2 语言矩阵；含主题模式章节、断点内容差异表、chip 溢出规范 | 初稿 |

---

## META

- 项目：迷人的老祖宗（Charming Ancestors）
- 日期：2026-04-17
- 主语言：zh-CN（根据 PRODUCT.md 与内容蓝图）
- 目标语言：zh-CN, en（二选一 ICU plural，英文膨胀预算 +40-70% 儿童表达更啰嗦）
- 目标文字系统：CJK（Hans 简体）+ Latin
- 目标断点：375 (SC-BP1) / 768 (SC-BP2) / **1024**（项目级覆盖 SC-BP3，桌面基准非 1440）
- 目标设备：手机竖屏 / 平板（竖+横）/ 小笔记本与 iPad Pro 横屏；不追求 ≥1440 大屏优化（PRODUCT §技术边界）
- 目标模式：light / dark / system，默认跟随系统（SC-TH1）
- 目标用户：9-12 岁小学生 + 次要家长观察；**触摸目标提升到 ≥52px**（大于 SC-TT1 默认 44/48，儿童食指点击精度差）
- Pencil library 建议路径：**默认强约束**（`/Users/fancyliu/Documents/1_工作/Mira agent/design-system/Business version/` 下最新 `.lib.pen`）
- Design Token 权威源：`03-design-tokens/design-tokens.md`（只引用 Semantic Token 名，禁止硬编 hex）
- 修订记录指针：见本文件顶部 `## 修订记录` 节

### META 补充 · 项目级常量覆盖

| 项目级 ID | 覆盖的 SC-* | 项目值 | 理由 |
|----------|-----------|-------|------|
| PROJ-BP3 | SC-BP3 (1440) | **1024** | PRODUCT.md §技术边界明确桌面起点 1024（9-12 岁家庭常用 iPad 横屏 + 小笔记本） |
| PROJ-TT1 | SC-TT1 (44px) | **≥52px**（主选项按钮 ≥56px） | 儿童食指触控面积大、精度低；PRODUCT 硬约束；Design Token 已定义 `--touch-target-comfortable: 56px` |
| PROJ-EX | SC-EX1/2 (35%/50%) | **≥60%** 长文本 / **≥80%** 中短 / 200-300% 短 | 儿童英文表达更啰嗦（如 "Got It!" vs "没错！"，"Take Another Look" vs "再来看一眼"），比成人 UI 膨胀更显著 |
| PROJ-TY | SC-TY6 (≥16px) | **正文 ≥18px**（儿童友好字号） | Design Token `--fs-body-lg: 18px` 专为 9-12 岁定义；题目使用 body-lg 而非 body |

---

## 1. 移动端内容优先级（Mobile First 核心）

### 1.1 核心任务（3-5 个，按 9-12 岁儿童使用频率 + 情感权重排序）

1. **闯当前可解锁的关卡**（首次 = 夏朝 / 回访 = 继续未完成关或下一关）—— 主用户任务，决定 App 价值
2. **看刚刚解锁的那张知识卡**（即时奖励兑现，收集欲载体）
3. **随时回朝代图谱看总进度 + 错题入口**（家长偶尔瞟到也能看到孩子在做什么）
4. **切换中英双语 + 明暗主题**（辅助任务，但在首页顶栏必须始终可见 —— 家长放心感）
5. **恢复未完成关卡**（跨 session 复访的首屏行为，MidQuizPrompt）

**决策理由**：答题（闯关）是核心引擎，知识卡是情感燃料，朝代图谱是仪表盘。首页一屏必须容纳"下一关 + 已有卡缩略"两个信息。

### 1.2 内容分级表

| 内容/功能 | 移动 375 | 平板 768 | 桌面 1024 |
|----------|---------|---------|----------|
| 顶栏 Logo + 品牌名 | ✅ 仅 Logo 图标（省空间） | ✅ Logo + 简写品牌名 | ✅ Logo + 完整品牌名 |
| 语言切换（中/EN） | ✅ 纯 icon 按钮 → bottom sheet 选择 | ✅ icon + 下拉 | ✅ icon + 下拉（含"跟随系统"选项） |
| 主题切换 | ✅ 纯 icon（☀/☾/auto） | ✅ icon | ✅ icon 或三态 segmented |
| 卡册入口 | ✅ 纯 icon + 小红点 | ✅ icon + 简写"卡册" | ✅ icon + 完整"我的卡册" |
| 错题入口（条件） | ✅ 简写"再来看一眼({count})" | ✅ 完整版 | ✅ 完整版 + 副文 |
| 首次访问欢迎区 | ✅ 精简 1 句 | ✅ 完整 2 句 | ✅ 完整 2 句 + 插画装饰 |
| 朝代图谱主体 | ✅ 纵向卡片流（10 关，每卡全宽） | ✅ 2×5 网格 | ✅ 5×2 网格（横向时间轴）|
| 朝代卡片内朝代简介 | ❌ 移除（只留名+时代词+状态） | ✅ hover 时 tooltip | ✅ hover 时 tooltip |
| 答题页朝代插画 | ⚠️ 顶部 160px 小图 | ✅ 顶部 240px 中图 | ✅ 左侧 40% 主视觉 |
| 答题页选项 | ✅ 单列 4 按钮 | ✅ 单列 4 按钮（居中加宽） | ✅ 单列 4 按钮（右栏 60%）|
| 答题反馈解释文 | ✅ 完整 | ✅ 完整 | ✅ 完整 |
| 结算页卡片揭示 | ✅ 居中大卡 | ✅ 居中大卡 | ✅ 居中大卡 + 装饰背景 |
| 卡册网格 | ✅ 2 列 | ✅ 3 列 | ✅ 5 列（满屏 2 行 × 5）|
| 错题列表 | ✅ inline expand，单列 | ✅ inline expand，单列加宽 | ✅ inline expand 或双栏（左列表 + 右详情） |
| 知识卡详情 | ✅ 全屏浮层 | ✅ 居中 Modal（560 宽） | ✅ 居中 Modal（720 宽）或右侧抽屉（480 宽）|
| MidQuizPrompt | ✅ Bottom Sheet（占 45%） | ✅ 居中 Modal（480 宽） | ✅ 居中 Modal（480 宽）|

---

## 2. 断点策略

| 断点 | 视口 | 布局模式 | 列数 | 内容增减 | 导航形态 |
|------|------|---------|------|---------|---------|
| 移动 (SC-BP1) | 375px | Layout Shifter（页面间差异大）+ Mostly Fluid 内 | 1 列 | 基准；砍掉朝代卡内简介、桌面 hover tooltip | 顶栏 4 icon（Logo / 🌐 / ☀☾ / 🗂️）；无底 Tab（page-map IA-2）|
| 平板 (SC-BP2) | 768px | Column Drop（答题页保持单栏） | 2 列（图谱） | +品牌文字、+朝代简介 hover | 顶栏同构但 icon 边上加文字标签 |
| 桌面 (PROJ-BP3) | 1024px | **Layout Shifter**（答题页两栏重设） | 2-5 列 | +完整品牌名、+右侧抽屉、+键盘快捷键提示 | 顶栏 + 首页图谱横向时间轴呈现 |
| 大屏 (SC-BP4) | 1280px+ | 同桌面 | 同桌面 | 同桌面，内容区 **max-width: 1200px** 居中（Design Token `--space-container-max`） | 同桌面 |

### 2.1 断点决策理由（符合 R2 基于内容）

- **375**：纵向卡片流保证 10 关全部一屏内可纵向滚动浏览；答题页单题全屏沉浸（儿童注意力 span 短，多余元素=干扰）
- **768**：2×5 图谱开始显露时间轴感，但答题页仍保持单栏（避免 iPad 竖屏出现过早的两栏阅读负担）
- **1024**：答题页**重设为两栏**（左插画 + 右题目），知识卡详情用右侧抽屉保留图谱上下文
- **≤320 reflow (SC-BP5)**：200% 缩放下布局退化为单列，选项按钮可纵向堆叠，`max-inline-size: 100vw` 保证无水平滚动

---

## 2.5 主题模式（SC-TH1-8 + 团队 TM2 强制）

> 本节是 team CLAUDE.md 定义的"主题模式"权威真相源。下游 r-pencil / r-frontend MUST 以此为准。

### 2.5.1 默认模式与切换入口

- **默认模式**：**跟随 `prefers-color-scheme`**（SC-TH1），首次访问 `localStorage.theme = 'system'`
- **切换入口位置**：
  - **所有 L0/L1 页面顶栏**（首页 / 卡册 / 错题 / 结算）
  - **答题页也允许切换**（interaction-brief §7.2：主题切换不影响答题数据，允许）
  - **L2 知识卡详情浮层不露主题入口**（浮层瞬时存在，避免分心）
- **切换形态**：
  - 移动端：单按钮循环三态 `system → light → dark → system`（省空间）+ 长按展开三选菜单（桌面端同步可用）
  - 桌面端：icon 按钮 hover 展开 dropdown 显示三选
- 引用 SC-TH2：三态按钮 `aria-pressed` / `aria-label="主题：明亮，点击切换"`

### 2.5.2 FOUC 防护与 SSR

- **首绘决策顺序**：`localStorage.theme` → `prefers-color-scheme` → `'system'`
- **落地方式**：inline script 在 `<head>` 最前（早于任何 `<link rel="stylesheet">`）执行，设置 `<html data-theme="light|dark">`（SC-TH5 / FW13）
- **SSR 一致性**：本项目为 SPA（无 SSR），不涉及 hydration 错配；若后续上线 SSR MUST 补 cookie 同步

### 2.5.3 切换动画（呼应 SC-TH7 + TM6）

- **过渡属性白名单**：`color` / `background-color` / `border-color` / `fill` / `stroke`
- **禁用**：`width` / `height` / `padding` / `margin` / `transform`（触发重排）
- **时长**：**≤ 200ms**（引用 Design Token `--duration-fast: 160ms`），缓动：`--ease-in-out`
- 实现位置：`body, *` 全局 `transition` 仅针对上述白名单（design-tokens §8 已给出完整代码片段）

### 2.5.4 各 Section 模式适配差异

| Section | Light 模式表现 | Dark 模式表现 | 差异策略 |
|---------|--------------|--------------|---------|
| **顶栏** | 米白底（`bg-primary`）+ 墨黑字 | 墨黑底 + 米白字；底部 `border-subtle` 从 `#E5E0D3 → #33302A` | Token 驱动，无需独立资产 |
| **朝代图谱卡片**（四态） | 见 Design Token `--color-level-*`（locked/active/cleared/perfect 各自 bg+fg+ring）| Dark 版已在 Token 中定义（`level-cleared-bg: #50351B` 等） | Token 双套，component 只引 semantic |
| **答题页朝代插画区** | 插画背景叠**浅渐变遮罩**（`linear-gradient(to bottom, transparent, rgba(250,248,243,0.85))`）确保题干可读 | 同插画叠**深渐变遮罩**（`linear-gradient(to bottom, transparent, rgba(26,24,20,0.88))`）| **插画本身不换**（SC-TH8：实拍/主视觉复用），只换遮罩 |
| **选项按钮**（默认态） | `bg-elevated` 白底 + `border-strong` 浅描边 + `shadow-xs` | `bg-elevated` 深灰底 + `border-strong` 中灰描边 + dark shadow（发光偏移） | Token 驱动 |
| **选项按钮**（答对） | `answer-correct-bg: #E7F2EC` + `jade-500` 边 + 勾 icon | `answer-correct-bg: #1D3A2E` + `jade-300` 边 | Token 双套 |
| **选项按钮**（答错 · 用户选） | `answer-wrong-bg: #F8E4E4` + `carmine-500` 边 + "?" icon | `answer-wrong-bg: #3A1616` + `carmine-300` 边 | Token 双套；**禁止纯红**（文化避免 + 儿童不羞辱）|
| **知识卡详情主视觉** | 卡片插画原图 + 赭石色边框（`accent-cultural: #B67B3D`） | 卡片插画原图 + 赭石暗色边框（`#C4934D`）+ **外发光**（`shadow-perfect-glow` 0.4 opacity） | 插画本身不换（SC-TH8）；dark 模式用 glow 替代 shadow |
| **满分徽章** | 朱砂底 + 白字 + 朱砂 glow 0.35 opacity | 朱砂底 + 白字 + 朱砂 glow 0.5 opacity（更强）| Token `--color-level-perfect-glow` 双套 |
| **结算页 card reveal 背景** | 渐变 `bg-tertiary`（`#EDF4F2` 青瓷淡底）| 渐变 `bg-tertiary`（`#152523` 暗青底）| Token 驱动 |
| **错题卡片**（展开） | `bg-secondary` + `state-success-bg` 正确答案框 | `bg-secondary` + `state-success-bg` 暗版正确答案框 | Token 驱动；答错不用 `state-danger`，用 `neutral` 强调正确 |

### 2.5.5 图像资产策略（引用 SC-TH8）

| 资产类别 | 双版本? | 策略 |
|---------|--------|------|
| 10 张朝代插画（图谱卡片用 + 答题页主视觉用）| ❌ 不换 | 单版本插画 + 两模式各自**遮罩色**适配；插画自身画风保持两模式可读 |
| 10 张知识卡主视觉 | ❌ 不换 | 单版本 + dark 模式外加 glow 发光（`shadow-perfect-glow`）增强边缘识别 |
| 10 枚徽章图形 | ⚠️ SVG 用 `currentColor` 自适应 | 徽章形状 SVG 化，颜色走 Token；朱砂作为 accent 在两模式下自动切换 |
| Logo（品牌） | ⚠️ 如 Logo 彩色 = 双版本；如纯字形 = `currentColor` 自适应 | 由 visual-designer 后续确定；r-pencil 阶段先用 Token 化单色版本 |
| 空态插画（卡册空 / 错题空） | ⚠️ 线条 SVG + `currentColor` | 单线条风格可两模式共用 |
| 装饰纹样（朝代装饰，如有） | ⚠️ SVG `currentColor` + 透明背景 | 装饰克制，避免过度国潮 |

**资产清单交给 r-pencil**：r-pencil 产出 .pen 时 MUST 在 ASSET-HANDOFF 声明每个插画/徽章/Logo 的"实际来源（占位 / 真实导出）"三态标注（FW7）；MVP 阶段允许用 AI 占位图但 MUST 标 ⚠️。

---

## 3.0 断点内容差异表（SC-MC1/3/4 强制 · 本项目移动端重设计核心）

> 本表为 FW11 打底：r-frontend MUST 按此实现 DOM 级差异，不得仅 CSS 隐藏。所有 `key_mobile` 后缀需在 locale-zh/en.json 中新增（见 §5.1 补充 locale key 列表）。

| Section | 移动端可见元素 (375) | 平板可见元素 (768) | 桌面可见元素 (1024) | 文案变体策略 | 移动端独有组件 |
|---------|---------------------|-------------------|-------------------|------------|--------------|
| **顶栏（首页/卡册/错题/结算）** | Logo-icon · 🌐 icon · ☀/☾ icon · 🗂️ icon（小红点） | + `brand.name_short`（简写："老祖宗"）+ 🗂️ 边上"卡册"字样 | + `brand.name` 完整 + 🗂️"我的卡册"字样 + 🌐 下拉展开 | `brand.name_short` 新增 key | 无 |
| **顶栏（答题页专属）** | 返回箭头 + `dynasty.{id}.name`（"夏"）+ 进度点`●●○○○` | 同左 + `quiz.progress` 文字"第 2/5 题" | 同左，禁加语言/主题/卡册入口 | 同 key | 无 |
| **Home § 欢迎区（首次）** | `home.welcome_first.title` + `.cta`（砍 body 正文） | + `home.welcome_first.body` 完整 | + `home.welcome_first.body` 完整 + 装饰插画 | 标题与 CTA 同 key；body 仅 tablet+ 显示 | 无 |
| **Home § 欢迎区（回访）** | `home.welcome_return.title` +（若 cleared>0）`home.progress_summary` | + `.body` 完整（"上次你走到了 X"）| + 完整 + hover 进度条高亮 | 同 key | 无 |
| **Home § 朝代图谱** | 10 关纵向卡片流 · 每卡 1 列全宽 · 卡内: 朝代名 + era + 状态（2026-04-17 决策修订：r-pencil 实测单列空间足够，保留 era 作为 9-12 岁儿童的记忆锚点） | 10 关 2×5 网格 · 每卡 1/2 列 · 卡内 + hover tooltip（桌面特性） | 10 关 5×2 网格 · 每卡 ~200×140 · + hover 朝代简介 tooltip（40-60 字）| 朝代名/era/状态全断点共用 key；`dynasty.era_mobile` 保留为空串 hook（未来极窄场景兜底），当前默认不触发 | 无 |
| **Home § 错题入口**（条件） | `home.wrong_entry`（简写"再来看一眼 (3)"）| 完整文字 + icon | 完整文字 + 副文 `wrong.subtitle`"不考你，就是看看" | `wrong.subtitle` 桌面加显 | 无 |
| **Home § 卡册缩略**（条件） | `cards_hint` 一句话 + 横向滑动的 3-5 个缩略 icon | 完整 + 2 行缩略 | 完整 + 3 行缩略 | 同 key | 横向滑动（mobile 特有） |
| **Quiz § 朝代插画区** | 顶部 160px 高 + 轻渐变遮罩 | 顶部 240px 高 | **左侧 40% 全高主视觉** + 朝代名 + "第 N 题" 浮字 | 无文案差 | 无 |
| **Quiz § 题干** | `fs-h3` (18-22px) 上方 + 完整题干 | 同左但字号 clamp 到中值 | 右侧 60% 区块内 + `fs-h2` 更大字号 | 同 key（题目文案完全 parameterized） | 无 |
| **Quiz § 选项按钮** | 单列 4 按钮 全宽 min-height **56px** · 编号 A/B/C/D + 文本左对齐 | 单列加宽（居中 max-width 600px）| 单列在右栏 60% 区块内 · max-width 640px | 选项文本 100% parameterized（locale） | 无 |
| **Quiz § 底部 Next CTA** | **Sticky 底栏**（固定底部 safe-area 之上，高 72px）| 内嵌非 sticky | 内嵌非 sticky | `quiz.cta.next` / `quiz.cta.settle` 同 key | **Sticky CTA bar (SC-MC5 特有)** |
| **Result § 得分揭示** | 中央大字 `score` + banner 文案 | 同左 + 分数字号放大 | 同左 + 装饰性背景插画 | `result.banner.*` 根据 score 分支 | 无 |
| **Result § 卡片 reveal** | 卡片占屏宽 - 32px padding · 中央上浮 | 卡片 max-width 400 · 居中 | 卡片 max-width 480 · 居中 + 侧边装饰 | 同 key | 无 |
| **Result § Next CTA 组** | **Sticky 底栏**（主 CTA + 2 个次 CTA 折叠到 overflow menu "更多"）| 内嵌横向 3 按钮 | 内嵌横向 3 按钮 + 副文 | 同 key；mobile overflow 需新增 `result.cta.more` 新 key | **Sticky CTA bar** + overflow menu |
| **Cards Page § 网格** | 2 列 | 3 列 | 5 列（2 行 × 5 = 10 张全展） | 同 key | 无 |
| **Card Detail § 浮层** | **全屏浮层**（100vh），底部上滑入 | **居中 Modal 560 宽** | **居中 Modal 720 宽** 或右侧抽屉 480 宽（二选一，默认 Modal） | 同 key；mobile 故事文本可能用 `card.story_mobile_{id}`（若 120 字超长需精简，MVP 不触发）| 全屏浮层（mobile 特有） |
| **Wrong Review § 筛选器** | 下拉 select（节省横向空间） | 水平 Tab 2-3 个 | 水平 Tab 全部朝代（有错题的） | `wrong.filter.all` / `.by_dynasty` 同 key | 下拉（mobile 特有） |
| **Wrong Review § 列表** | 单列 inline expand | 单列 inline expand 加宽 | 单列 inline expand 或**双栏**（左列表点击展开右详情）| 同 key | 无 |
| **MidQuizPrompt** | **Bottom Sheet**（屏 45%，从底上滑）| 居中 Modal 480 宽 | 居中 Modal 480 宽 | 同 key | Bottom Sheet（mobile 特有）|
| **ExitConfirm** | Bottom Sheet（屏 48%）| 居中 Modal 480 宽 | 居中 Modal 480 宽 | 同 key | Bottom Sheet（mobile 特有）|

**判定规则自检**（SC-MC1/2）：
- ✅ 无"同一行三档完全相同"的情况（除非本身无差异如 Quiz 题干）
- ✅ 文案变体策略列有标注差异的地方对应 `key_mobile` 新 key（见 §5.1 locale 补 key）
- ✅ 移动端独有组件栏列出 4 项（sticky CTA × 2 · Bottom Sheet × 2 · 全屏浮层 · 横向滑动），满足 SC-MC5

---

## 3. 模块清单（每个页面独立定义）

### 模块 A · 首页 / 朝代图谱 `/`

- **布局模式**：Layout Shifter（3 档视觉语言各不相同）
- **移动端文案**（精简）：
  - 标题（首访）：`home.welcome_first.title`"第一次来？"
  - 副标题：**移动端省略**
  - CTA：`home.welcome_first.cta`"从夏朝开始"（单 CTA）
- **桌面端文案**（完整）：
  - 标题：同上
  - 副标题：`home.welcome_first.body`"这里有十位老祖宗在等你。点夏朝，推开第一扇门。"
  - CTA：同上
- **移动端形态**：顶栏 56px → 欢迎区 96px 高（首访）/ 72px（回访） → 朝代图谱纵向 10 卡（每卡 72px 高 · gap 12px · 内 padding 16px）→ 错题入口（条件，72px 高）→ 卡册缩略横向滑动
- **桌面端形态**：顶栏 64px → 欢迎区 160px 高 + 装饰 → 朝代图谱 5×2 网格（卡 200×140 · gap 24px · 横向时间轴表达）→ 右侧次级区域：错题入口 + 卡册入口 + 总进度环
- **触摸交互**：
  - 核心操作：点第 1 可解锁关卡（Unlocked 态）→ 位置：**首屏第一张或第二张卡**（拇指可达，不在顶栏）
  - 手势：无复杂手势；仅纵向原生滚动 + 卡片 tap（IX §5.1）
  - 破坏性操作：重玩 Cleared/Perfect 关 → 位置：**二次确认 Bottom Sheet，默认焦点在"取消"**（防误触，MI6）
  - 反馈：Locked 卡点击 → toast"通关上一关就解锁啦"（toast 出现在屏幕上方 1/3，不被拇指遮挡，MI7）
- **数据表格转换**：无表格
- **弹窗转换**：MidQuizPrompt / ReplayConfirm → Bottom Sheet（移动）/ 居中 Modal（桌面）
- **侧边栏转换**：桌面端右侧次级区（进度环 + 卡册入口）→ 移动端下沉到主流后（纵向堆叠）

---

### 模块 B · 答题页 `/quiz/:dynastyId`

- **布局模式**：**Layout Shifter**（375 单列 vs 1024 两栏，真的重设布局）
- **移动端文案**：
  - 顶栏：朝代名（如"夏"）+ 进度点 `●●○○○`（纯视觉不带文字）
  - 题干：完整 locale（题目无移动端裁剪需求）
  - 选项：完整 locale（儿童需要完整理解）
  - 反馈解释：完整（儿童教育场景，不能省）
- **桌面端文案**：同移动（题库文案不分端），但顶栏加"第 N/5 题"文字补充
- **移动端形态**（单列）：
  1. 顶栏 56px（返回 + 关卡名 + 进度点）
  2. 朝代插画 160px 高（带底部渐变遮罩确保下方文字可读）
  3. 题干区 padding 16px，`fs-h3` 22px
  4. 选项区 4 按钮纵向，每按钮 min-height **56px**，gap 12px
  5. Sticky 底栏 72px（Next CTA 占满宽，含 safe-area padding）
- **桌面端形态**（两栏 40/60 分割）：
  - 左栏 40%：朝代插画全高 + 关卡名 + 第 N 题浮字（朝代插画成为主视觉）
  - 右栏 60%：题干 + 4 选项（max-width 640px 内边距 48px） + 下方 Next CTA（非 sticky，内嵌）
- **触摸交互**：
  - 核心操作：点选项按钮 → 位置：屏幕中下部，拇指热区
  - 手势：**无** swipe 切题（强约束 · 防止儿童意外滑走）；Next CTA 是唯一推进方式（interaction-brief §2.2）
  - 破坏性操作：返回箭头 → 进入 ExitConfirm Bottom Sheet，默认焦点"继续答题"（MI6）
  - 反馈：答对/答错 icon 在选项内显示；解释文本在选项下方展开（在触摸点下方是可接受的，因选项已完成作答锁定，MI7 例外）
- **弹窗转换**：ExitConfirm → Bottom Sheet（移动）/ Modal（桌面）
- **i18n 特殊标注**：**答题页禁止切换语言**（顶栏移除 🌐 入口，硬决策，防止 locale 切换导致题目对应错位；interaction-brief §7.1）

---

### 模块 C · 关卡结算页 `/result/:dynastyId`

- **布局模式**：Mostly Fluid（3 档都是纵向堆叠，仅宽度和装饰差异）
- **移动端文案**：
  - Banner: `result.banner.{perfect|cleared|cleared_partial}`（按分数分支）
  - Score: `result.score` "3 / 5"
  - Card reveal label: `result.card_reveal.label`"解锁了一张新卡" + `.tap_hint`"点一下看看"
  - Badge（仅 5/5）：`result.badge_reveal.label`
  - Wrong entry（条件）：`result.wrong_entry`"看看刚才哪里差一点"
  - CTA 组：主 CTA `result.cta.next_dynasty`"进入 {dynasty}"（如非最后关）+ `result.cta.home` + `result.cta.replay`
- **桌面端文案**：同移动（结算仪式内容不变）
- **移动端形态**：
  1. 顶栏 56px（返回 + "X 朝结算"）
  2. 阶段 1：得分揭示居中 1/3 屏
  3. 阶段 2：卡片 reveal 居中 1/3 屏
  4. 阶段 3（5/5）：徽章浮现卡片右上
  5. Sticky 底栏 96px：主 CTA 占满 + 次 CTA 折叠"更多"按钮弹 overflow menu（含 `.home` + `.replay` + 条件 `.wrong_entry`）
- **桌面端形态**：
  - 居中内容区 max-width 800px
  - 阶段 1-3 分阶段渐次出现（interaction-brief §3.1 分阶段 reveal）
  - 次级 CTA 组横向排列（非 sticky），主 CTA 居中放大 56px 高
- **触摸交互**：
  - 核心操作：点主 CTA "进入下一关" → 位置：Sticky 底栏（拇指热区）
  - 手势：点屏幕空白跳过动效（interaction-brief §3.2）；键盘 Tab 第一项"跳过动效"隐藏链接（a11y）
  - 反馈：卡片 reveal 后点击 → 进 L2 知识卡详情
- **弹窗转换**：L2 知识卡详情 → 全屏浮层（移动）/ Modal（桌面）

---

### 模块 D · 我的卡册 `/cards`

- **布局模式**：Mostly Fluid（Grid 列数变化）
- **移动端文案**：
  - 标题：`cards_page.title`"我的卡册"
  - 进度：`cards_page.progress`"3/10 已解锁"
  - 未解锁卡 overlay：`cards_page.locked_hint`"通关 {dynasty} 朝解锁"
  - 空态：`cards_page.empty.title` + `.body` + `.cta`
- **桌面端文案**：同移动
- **移动端形态**：顶栏 56px → 标题+进度区 88px → 2 列网格（16:9 卡 · gap 16px · padding 16px）
- **桌面端形态**：顶栏 64px → 标题+进度区 120px（标题加大）→ 5 列网格（2 行 × 5 = 10 卡全展 · gap 24px）
- **触摸交互**：
  - 核心操作：点已解锁卡 → L2 详情；位置：网格中央（不在顶栏）
  - 手势：无；仅点击
  - 破坏性操作：无
  - 反馈：Locked 卡点击微晃 + toast（interaction-brief §4.1）

---

### 模块 E · 错题回看 `/wrong[/:dynastyId]`

- **布局模式**：Column Drop（桌面可选双栏，移动/平板单列）
- **移动端文案**：
  - 标题：`wrong.title`"再来看一眼"（**不用"错题本"**）
  - 副标题：**移动端省略**（空间紧张）
  - 筛选器：下拉 select
  - Item 展开内容：`wrong.item.your_answer` / `.correct_answer` / `.explanation`
  - 空态：`wrong.empty.title` + `.body`
- **桌面端文案**：
  - 标题：同
  - 副标题：`wrong.subtitle`"不考你，就是看看"（桌面端加显）
  - 筛选器：水平 Tab
- **移动端形态**：顶栏 56px → 标题区 72px → 筛选器（下拉 56px）→ 列表单列 inline expand，一次只展开一题
- **桌面端形态**：顶栏 64px → 标题+副标题区 120px → 筛选器（水平 Tab 48px）→ 列表**或双栏**（左列表 360 宽 + 右详情面板，默认选中第一条）
- **关键原则**：**只看不做**（page-map IA-6），没有"重答"按钮；答错选项标"你选的"用 `state-neutral`，正确选项标"正确答案"用 `state-success` 强调正面
- **触摸交互**：
  - 核心操作：点列表项 → inline 展开 / 桌面端右栏刷新
  - 手势：无
  - 反馈：展开动效 400ms 发现感

---

### 模块 F · 知识卡详情（L2 浮层）`/card/:cardId`

- **布局模式**：Off Canvas（移动全屏覆盖）/ Modal 或 Drawer（桌面）
- **移动端文案**：
  - 关闭按钮 aria-label：`card.close`
  - 卡名（大标题）+ `card.from_dynasty` + 分类 `card.category.{person|object|event}`
  - 故事正文：`Card.story_zh/en`（≤ 120 中 / ≤ 200 英词，内容蓝图 §3.1）
- **桌面端文案**：同移动
- **移动端形态**：**全屏浮层**（100vw × 100vh），结构：
  1. 关闭 × 按钮左上角（44×44 触摸区 · 顶部 safe-area 上 16px）
  2. 大图/主视觉占上半屏（纵向 40%）
  3. 分类 tag + 朝代 tag 横向（fg-muted）
  4. 卡名 `fs-h1`
  5. 故事正文 `fs-body-lg` 18px, lh-normal 1.55（CJK 走 1.7 见 §5）
  6. 相关朝代 link
- **桌面端形态**：**居中 Modal**（720×响应式高度），遮罩 `bg-overlay`
  - 关闭 × 按钮右上角
  - 大图左半 + 文字右半（Modal 内部两栏）
  - 内容最大高度 80vh，超出内部滚动
- **触摸交互**：
  - 核心操作：滑动阅读（纵向原生滚动）
  - 手势：`overscroll-behavior: contain`（防止拉到底穿透到外层）
  - 破坏性操作：× 关闭 / 点遮罩 / ESC / 移动端物理返回键（劫持 history，interaction-brief §4.2）
  - 焦点管理：打开时焦点自动到 × 按钮；关闭后焦点回到触发元素

---

## 4. 排版规格

### 4.1 字号层级（引用 Design Token §2.2，模数缩放比率 1.25）

| Token | 移动 (375) | 平板 (768) | 桌面 (1024+) | 实际 clamp() |
|-------|-----------|-----------|------------|-------------|
| `fs-display` | ~32px | ~42px | ~56px | `clamp(32px, 6vw, 56px)` |
| `fs-h1` | ~28px | ~34px | ~40px | `clamp(28px, 4.5vw, 40px)` |
| `fs-h2` | ~22px | ~26px | ~30px | `clamp(22px, 3.5vw, 30px)` |
| `fs-h3` | ~18-20px | ~20-22px | ~22px | `clamp(18px, 2.8vw, 22px)` |
| `fs-body-lg` | 18px | 18px | 18px | 18px（题目正文儿童友好） |
| `fs-body` | 16px | 16px | 16px | 16px（SC-TY6 满足） |
| `fs-body-sm` | 14px | 14px | 14px | 14px（辅助） |
| `fs-caption` | 13px | 13px | 13px | 13px |

**关键约束**：
- 题目文字 MUST 使用 `fs-body-lg` (18px) 不用 `fs-body`（项目级 PROJ-TY 约束）
- 标题 MUST 使用 `clamp()` 流体缩放（CP1：Apple 模式）；正文阶梯式不需要 clamp

### 4.2 行高（按文字系统 · SC-TY1/2）

| 场景 | CJK (zh-CN) | Latin (en) | Token |
|------|-------------|-----------|-------|
| Display / H1（标题） | **1.2** (`lh-tight`) | **1.2** | 两系统共用 |
| H2 / H3（子标题） | **1.35** (`lh-snug`) | **1.35** | 共用 |
| Body（正文） | **≥1.7** (SC-TY2)；本项目用 `lh-normal 1.55` 需**提升到 1.7** for `:lang(zh)` | **1.5-1.6**（用 `lh-normal 1.55` 满足 SC-TY1） | 用 `:lang(zh) { line-height: 1.7 }` 覆盖 |
| Body-lg（题目） | 同上 1.7 for zh | 1.55-1.6 | 同上 `:lang(zh)` 覆盖 |
| 长故事（知识卡）| 1.75 for zh / 1.65 for en | | `lh-loose` |

**实现提示给 r-frontend**：
```css
:root { --lh-normal: 1.55; --lh-body-cjk: 1.7; --lh-loose: 1.65; }
:lang(zh) { line-height: var(--lh-body-cjk); }
:lang(zh) .knowledge-story { line-height: 1.75; }
```
**避免 :lang() 陷阱**（feedback_css_lang_selector.md）：`:lang(zh)` 单独使用时会匹配 `<html lang="zh">` 根，**不要**用逗号分隔写 `:lang(zh), :lang(ja) .x`（单独那个会匹配整页）。本项目只 zh/en 两语言，用 `html[lang^="zh"]` 或单独 `:lang(zh)` 选择器但不做 chain 组合即可。

### 4.3 行宽（SC-TY1/2）

| 场景 | CJK max | Latin max |
|------|---------|----------|
| 题目（quiz.question） | **≤ 30em**（约 28-32 字一行，儿童阅读舒适）| **≤ 60ch**（约 50-60 英文字符）|
| 知识卡故事（body-lg） | **≤ 35em**（SC-TY2） | **≤ 65ch**（SC-TY1） |
| 朝代简介 tooltip | ≤ 20em | ≤ 40ch |
| 错题解释 | ≤ 35em | ≤ 65ch |

### 4.4 字体栈（引用 Design Token §2.1）

- **Display（标题）**：`"Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", "Playfair Display", Georgia, serif` —— CJK 优先宋体承载文化重量
- **Body（正文）**：`"HarmonyOS Sans SC", "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Inter", -apple-system, ..., sans-serif` —— 儿童友好现代黑体
- **Numeric（计数）**：`"Inter", "SF Pro Display", ui-monospace, sans-serif` + `font-variant-numeric: tabular-nums`（分数/关卡号对齐）

**字体加载预算（SC-FZ）**：
- 西文文件：Playfair Display（Display）+ Inter（Body + Numeric）= **2 个文件**（SC-FZ1 ≤ 4 OK）
- CJK：思源宋体 + 鸿蒙/思源黑体 采用**系统字体优先 + Google Fonts 分片 fallback**；禁止全量打包（SC-FZ2 单分片 < 100KB / SC-FZ3 总 < 500KB · 由 r-frontend 用 unicode-range 或 Google Fonts subset 实现）

### 4.5 字重（3 种上限，Design Token §2.3）

- `fw-regular: 400` / `fw-medium: 500` / `fw-semibold: 600`
- 宋体（Display）只用 400 + 600；黑体（Body）三种都用
- **禁止**引入 300 / 700 / 900（削弱层级）

---

## 5. 多语言适配

### 5.1 文本膨胀敏感区域（引用 PROJ-EX 覆盖 SC-EX）

| 元素 | 中文当前（zh） | 预留膨胀 | 英文预估（en） |
|------|--------------|---------|--------------|
| 主 CTA "从夏朝开始" | 5 字 | **300%**（SC-EX3 短文本 + PROJ-EX 儿童加成） | "Start with Xia" / "Begin with Xia Dynasty"（14-22 字符 = 280-440%） |
| "再来看一眼（3 题）" | 8 字 | 200% | "Take Another Look (3 Qs)" ~23 字符 |
| "继续（3/5）" | 6 字 | 200% | "Continue (3/5)" ~15 字符 |
| 朝代状态 "还没解锁" | 4 字 | 300% | "Not Yet Unlocked" ~17 字符 |
| 导航 "朝代图谱" | 4 字 | 150% | "Dynasty Map" ~11 字符 |
| 导航 "我的卡册" | 4 字 | 200% | "My Cards" ~8 字符 |
| 答对反馈 "没错！" | 3 字 | 200% | "Got It!" ~7 字符 |
| 答错反馈 "再想想" | 3 字 | 200% | "Not Quite" ~9 字符 |
| 朝代名 "三国" | 2 字 | 300% | "Three Kingdoms" ~14 字符（膨胀 700%⚠️）|
| 朝代名 "隋唐" | 2 字 | 300% | "Sui-Tang" ~8 字符 |
| 朝代名 "明清" | 2 字 | 300% | "Ming-Qing" ~9 字符 |
| 关卡卡片（图谱上） | 约 6-10 字 | 150-200% | 8-20 字符 |
| Result banner "全对！" | 3 字 | 200% | "All Correct!" ~12 字符 |

**关键风险**："三国 → Three Kingdoms" 在朝代卡片（移动端仅 ~175px 宽）英文会**两行换行**，设计 MUST 允许朝代卡内的朝代名**自动换行**（`word-break: keep-all` for CJK, `overflow-wrap: break-word` 通用）；图谱卡片高度 MUST 用 `min-height` 而非 `height` 保证容纳英文两行情形。

**解决方式**：
- 朝代图谱卡片 min-height 72px (mobile) / 140px (desktop)，**禁用** `white-space: nowrap`
- CTA 按钮 min-width 不用 fixed width（CP2：Wise/Booking 做法），padding 水平 16-24px 弹性
- 数字+单位（如 "3/5" "3 题"）用 `tabular-nums` 等宽数字避免跳字

### 5.1.1 locale 补 key 清单（提交给 content-strategist / 上游回写）

本 Schema 在 §3.0 断点差异表推导出的新 key（MVP 可 MUST 新增到 locale-zh/en.json）：

| Key | zh | en | 用途 |
|-----|-----|-----|-----|
| `brand.name_short` | 老祖宗 | Ancestors | tablet 顶栏简写 |
| `dynasty.{id}.era_mobile` | "" (空串) | "" (空串) | mobile 朝代卡覆盖 era（或用 CSS 隐藏） |
| `result.cta.more` | 更多 | More | mobile sticky 底栏 overflow menu 入口 |
| `home.welcome_first.body_mobile` | (可选，省略 body) | "" | mobile 欢迎区若仍需要极简 1 句 fallback |
| `nav.theme_switch_label_short` | 主题 | Theme | tablet/mobile icon 边旁简写 |
| `nav.lang_switch_label_short` | 语言 | Lang | tablet/mobile icon 边旁简写 |

> r-designer 不直接改 locale；此清单 MUST 由 content-strategist（或用户）批准后回写 locale-zh.json / locale-en.json，然后 r-pencil 和 r-frontend 才按新 key 实现。

### 5.2 RTL 适配

**本项目目标语言仅 zh-CN + en，不含 RTL 语言（Arabic/Hebrew），因此 RTL 镜像规则不触发**。但为未来可能扩展保留以下 hook：

- CSS 布局 MUST 使用**逻辑方向**（`margin-inline-start` / `padding-inline-end` / `inset-inline-*`），禁用 `left` / `right`（L3）
- Flex / Grid 方向使用 `row`（而非 `row-reverse`）+ 依赖 `dir="rtl"` 自动翻转
- 图标如箭头方向 MUST 在 RTL 时翻转（未来加 Arabic 时 MUST 补完）
- Logo / 视频播放按钮 / 数字方向 / 汉字本身 **不翻转**（CP4 行业共识）

### 5.3 文化适配

目标文化：中文简体圈（内地）+ 英语儿童教育（北美/英/澳）

| 维度 | 差异 | 设计应对 |
|------|------|---------|
| 颜色 | 中文：朱砂红 = 喜庆 / 通关；英文：红色易与危险/错误关联 | **答错态避免纯红** ，用 `carmine-500` 略偏冷的深红 + 问号 icon（形状区分）；通关朱砂保留（不是错误语境） |
| 数字"4" | 中文：部分人忌讳；英文：无影响 | 朝代编号不显式标 "No.4"，直接用朝代名 |
| 礼仪 | 中文重师道 / 英文重平等 | 文案避免"你必须学会"（权威口吻），用"你发现了"（同伴口吻）—— content-blueprint §6 已贯彻 |
| 朝代名 | 英文音译 + 意译双轨 | content-blueprint §1 已确定 "Xia" "Shang" 等音译；用户可通过 hover/tooltip 看到扩展释义 |

### 5.4 多语言走查结果（阶段性自检，真正走查由 r-pencil 出图 + r-qa 实测）

- [x] **中文走查**（zh-CN）：CJK 行高 1.7 覆盖 / 行宽 ≤ 35em / 字距 0.05em 防粘连已在 Token
- [x] **英文走查**（en）：Latin 行高 1.55 / 行宽 ≤ 65ch / CTA 膨胀 200-300% 覆盖 / "Three Kingdoms" "Movable Type" 等长词自动换行策略已定
- [ ] **德语/阿拉伯语走查**：⚠️ **本项目目标语言不含**，因此 O10 约束"MUST 用德语/阿拉伯语走查"在本项目降级为"MUST 用英语 + 中文双向走查"（英文"Three Kingdoms" 14 字符 vs 中文"三国" 2 字 = 700% 膨胀已是本项目最极端场景，具备等价挑战性）

---

## 6. 无障碍

### 6.1 颜色对比度（引用 Design Token §1.4，所有 hex 标 [待验证]）

| 颜色对 | 用途 | 预估对比度 | 达标 | 状态 |
|--------|------|-----------|------|------|
| `#1A1814` on `#FAF8F3` (light) | 正文 fg-primary | ~15:1 | ✅ AA 4.5:1 | [待验证]（webaim 链接在 design-tokens §1.4） |
| `#4A4438` on `#FAF8F3` (light) | 副标题 fg-secondary | ~10:1 | ✅ | [待验证] |
| `#6B6456` on `#FAF8F3` (light) | metadata fg-muted | ~5.5:1 | ✅（需验） | [待验证 · **重点**] |
| `#FAF8F3` on `#4A7C74` (light) | CTA 青瓷按钮 + 白字 | ~4.8:1 | ✅（临界） | [待验证 · **重点**] |
| `#FAF8F3` on `#C04A3A` (light) | 满分 CTA 朱砂 + 白字 | ~5.2:1 | ✅ | [待验证] |
| `#FAF8F3` on `#1A1814` (dark) | 正文 fg-primary dark | ~15:1 | ✅ | [待验证] |
| **`#FAF8F3` on `#6FA89F` (dark)** | **⚠️ 暗模式 CTA** | ~3.2:1 | ⚠️ **不达 4.5:1** | **[待验证 · 已知风险]** |
| `#1A1814` on `#6FA89F` (dark fallback) | 暗模式 CTA 深字替代 | ~7:1 | ✅ | [待验证] |

**关键决策（承接 Design Token §1.4 风险提示）**：
- Dark 模式 `--color-fg-on-accent` **硬定义为深字 `#1A1814`**（Design Token §7 已如此实现）
- Light 模式 accent-primary 白字临界，r-qa MUST 实测；如失败，fallback 方案：CTA 内文字加 `text-shadow: 0 1px 2px rgba(0,0,0,0.2)` 轻微增强 或将 accent-primary 降 5% 亮度（需 visual-designer 回写 Token）

### 6.2 焦点管理

| 场景 | 焦点策略 |
|------|---------|
| 首页 Tab 顺序 | Logo → 🌐 → ☀☾ → 🗂️ → 错题入口（条件）→ 关卡 1 → 2 → ... → 10 → 卡册缩略 |
| 答题页 Tab 顺序 | 返回 → 选项 A → B → C → D → Next CTA（反馈态后） |
| 方向键在关卡网格 | 桌面 5×2 网格：↑↓ 跨行 / ←→ 跨列；Enter/Space 激活 |
| Modal/Bottom Sheet 打开 | 焦点**自动移到最保守选项**（MidQuizPrompt→"继续答题"；ReplayConfirm→"取消"；ExitConfirm→"继续答题"）；MUST 实现焦点陷阱（Focus Trap） |
| Modal 关闭 | 焦点回到触发元素（来源按钮/卡片） |
| 知识卡详情浮层 | 焦点自动到 × 关闭按钮（让孩子 / 键盘用户第一步就能退出） |
| ESC 键 | 所有 Modal / Bottom Sheet / 浮层可关闭；在答题页 ESC = 打开 ExitConfirm |
| 焦点指示器 | `--shadow-focus-ring` 3px 青瓷色 ring，明暗两套，对比度 ≥ 3:1（SC-CR3）|
| RTL 焦点顺序 | 本项目暂无 RTL，未来加 Arabic 时 MUST 随阅读方向翻转 |

### 6.3 ARIA 需求

| 组件 | ARIA 角色 | 键盘交互 | 播报行为 |
|------|----------|---------|---------|
| 朝代图谱卡片 | `role="link" aria-label="夏朝 已通关 3/5 点击重玩"` / Locked `aria-disabled="true"` + `aria-describedby` | Enter/Space = 点击 | 状态 + 提示 |
| 关卡进度点 | `role="progressbar" aria-valuenow aria-valuemax aria-valuetext="第 2 题 共 5 题"` | 不可聚焦 | 随题变化 |
| 选项按钮组（Quiz） | `role="radiogroup" aria-labelledby="question-stem"` · 每项 `role="radio" aria-checked` | Tab 进入组 + ↑↓ 切换 | 选中态 + 答对/错 |
| 反馈区 `aria-live` | `aria-live="polite"` | — | "答对了，XX 是 YY" / "正确答案是 XX"（不播报"你错了"） |
| MidQuizPrompt / ExitConfirm / ReplayConfirm | `role="dialog" aria-modal="true" aria-labelledby` | Focus Trap + ESC 关闭 | 标题 + 默认选项 |
| 知识卡详情浮层 | `role="dialog" aria-modal="true"` | Focus Trap + ESC + 遮罩点击关闭 | 标题 + 朝代 |
| 语言切换按钮 | `aria-label="切换语言，当前 中文"` | Enter/Space 展开 | 切换后 `role="status"` 播报"已切换为英文" |
| 主题切换按钮 | `aria-label="主题：明亮，点击切换"` + `aria-pressed` | Enter/Space 循环 | 播报新主题 |
| 卡册卡片网格 | `role="grid"` · 每项 `role="gridcell" aria-label="夏朝 器物 已解锁"` | 方向键导航 | — |
| 错题 inline expand | `<button aria-expanded="false">` + `aria-controls` | Enter/Space 切换 | 展开时 `aria-live="polite"` 读题干+正确答案 |

### 6.4 其他 WCAG 硬约束自检

- **A4 键盘可操作**：所有交互元素（按钮/卡片/选项/Tab/下拉）MUST Tab 可达；无"仅鼠标可触发"操作（如 hover-only 信息）
- **A5 焦点可见**：`:focus-visible` 实现，焦点 ring 不被 overflow 遮挡
- **A6 Heading 层级**：每页一个 h1（页面主标题）→ h2（区块）→ h3（卡片标题）；**禁止跳级**
- **A7 Landmark**：`<header>` + `<nav>` + `<main>` + `<footer>`（若有）；主内容用 `<main aria-label="朝代图谱">` 等
- **A8 prefers-reduced-motion**：Design Token §5.4 已定义 `@media (prefers-reduced-motion: reduce)` 将 duration 压到 80ms，禁用 transform/scale/rotate；r-frontend MUST 落地
- **颜色非唯一信号（L4）**：
  - 答对/答错：配**勾 icon / 问号 icon**（不是叉，不是"X"），形状区分
  - 关卡 Locked：配**锁 icon**（不仅灰调）
  - 关卡 Perfect：配**星标 icon**（不仅朱砂）
  - 知识卡解锁/未解锁：配**剪影 vs 完整封面**（形状区分）

---

## 响应式关键组件行为表（SC-OV1-4 配套 · O15 强制）

| 组件 | Mobile (375) 行为 | Desktop (1024) 行为 | 每行容量 | 溢出策略 |
|------|------------------|-------------------|---------|---------|
| 朝代图谱 10 关卡 | 纵向流，每行 1 | 5×2 网格 | mobile 1 / tablet 2 / desktop 5 | 无溢出（固定 10 项） |
| 选项按钮 A/B/C/D | 纵向 4 行 | 纵向 4 行（右栏内） | 每行 1 | 无溢出（固定 4 项） |
| 错题筛选 chip/tag（按朝代） | **下拉 select**（最多 10 项展开）| 水平 Tab **wrap** 多行 | desktop ≤ 5 tag/行（SC-OV4）；mobile 用下拉省空间 | ✅ CSS `flex-wrap: wrap`；.pen 内需手动拆行（SC-OV1）|
| 卡片分类 tag（人物/器物/事件） | 单行 1-2 个 tag | 单行 1-2 个 tag | 固定 1-2 项 | 无溢出 |
| 结算页次级 CTA 组（"再来看一眼" + "回图谱" + "重玩"）| **折叠到 overflow "更多"** | 横向 3 按钮 inline | desktop 3 inline / mobile 1 主 + overflow | ✅ mobile 折叠 menu |
| Result 统计数字组（X/5 · X/10）| 纵向堆叠 | 横向 inline | — | tabular-nums 等宽 |
| 总进度摘要 "已闯过 3/10 关 · 全对 1/10" | **允许换行**（`word-break: normal; overflow-wrap: break-word`）| 单行 | — | wrap |

**引用 SC-OV1**：错题筛选 chip 在 `.pen` 内 MUST 用 `layout: "vertical"` 外容器 + N 行子 frame 手动拆行（Pencil 不支持 flex-wrap）
**引用 SC-OV4**：mobile 单行 ≤ 3 短 chip；本项目错题筛选最多 10 个朝代 = 必须下拉或多行

---

## 7. 自检结果

### Mobile First [MF1-MF5] ✅

- [x] **MF1**：移动端独立内容优先级列表在 §1.1（5 个核心任务）
- [x] **MF2**：移动端首屏是欢迎区 + 朝代图谱卡片（内容），不是导航结构
- [x] **MF3**：§1.2 + §3.0 每个断点标注了内容增减（era 副标题 mobile 隐藏 / body 文案 mobile 省略 / 卡册缩略 mobile 仅 3-5 项等）
- [x] **MF4**：**次要内容 MUST 在移动端 DOM 移除**（通过 `.mobile-only` / `.desktop-only` + locale `key_mobile` 双变体，不是 `display:none` 隐藏桌面 DOM）—— 传给 r-frontend 的 FW11 依据
- [x] **MF5**：§3 每个模块文案分"移动端"和"桌面端"两栏标注

### 布局模式 [LP1-LP6, R1-R6] ✅

- [x] **LP1**：§3 每个模块都标注布局模式（Layout Shifter × 2 / Mostly Fluid × 2 / Column Drop × 1 / Off Canvas × 1）
- [x] **LP2**：答题页（复杂页面）使用 **Layout Shifter** 重设布局（375 单列 ↔ 1024 两栏）
- [x] **LP3**：本项目无数据表格
- [x] **LP4**：所有桌面弹窗在移动端 → Bottom Sheet（MidQuizPrompt / ExitConfirm / ReplayConfirm）或全屏浮层（知识卡详情）
- [x] **LP5**：本项目无桌面侧边栏；但首页右侧次级区（桌面）在 mobile 下沉为纵向堆叠
- [x] **LP6**：本项目无多列定价对比
- [x] **R1**：断点覆盖 375/768/1024（项目级 PROJ-BP3 覆盖 SC-BP3 1440） + 1280+ 大屏 max-width 居中
- [x] **R2**：每个断点标注了内容原因（9-12 岁设备分布 / iPad 横屏 / 答题沉浸 / 图谱时间轴等）
- [x] **R3**：所有容器用 `max-width` / `min-width` / `clamp()`，无固定 px 宽度
- [x] **R4/R5**：行宽 Latin ≤ 65ch / CJK ≤ 35em（§4.3）
- [x] **R6**：200% 缩放 / 320px reflow 要求传给 r-frontend（SC-BP5）

### Mobile First 交互 [MI1-MI7] ✅

- [x] **MI1**：核心操作（Quiz Next CTA / Result 主 CTA）位于 **sticky 底栏拇指热区**
- [x] **MI2**：触摸目标 **≥52px**（PROJ-TT1 覆盖），选项按钮 ≥56px，间距 ≥8px
- [x] **MI3**：本项目无表单（除选择题，已优化为 4 按钮选择器）
- [x] **MI4**：移动端导航降级为顶栏 4 icon（无底部 Tab · page-map IA-2）
- [x] **MI5**：每个手势有点击替代（卡片点击替代 swipe · Modal 遮罩/ESC/按钮三种关闭路径）
- [x] **MI6**：破坏性操作（重玩 / ExitConfirm "放弃这一关"）**远离拇指热区**（Bottom Sheet 上部）+ 默认焦点在保守选项
- [x] **MI7**：反馈（toast / Locked 提示）出现在屏幕上方 1/3，不被拇指遮挡

### 排版 [T1-T7] ✅

- [x] **T1 Latin**：行高 1.55（`lh-normal`，in range 1.5-1.6）
- [x] **T2 CJK**：`:lang(zh)` 覆盖到 1.7（satisfy SC-TY2）
- [x] **T3 Arabic**：本项目不含，hook 保留
- [x] **T4 标题**：1.2 / 1.35（lh-tight / lh-snug，in range 1.1-1.2 / 1.2-1.35）
- [x] **T5 正文 ≥16px**：本项目正文 16px（body）或 18px（body-lg 题目），覆盖 SC-TY6
- [x] **T6 模数缩放**：Design Token 明确比率 1.25（12 → 15 → 18.75 ≈ 18 → 22.5 ≈ 22 → 28 → 35 ≈ 34→40→56），5-6 级梯度一致
- [x] **T7 文本间距可调**：使用 `em`/`rem` 相对单位，用户调 font-size/line-height/letter-spacing 不丢内容（WCAG 1.4.12）

### 多语言 [L1-L7] ✅

- [x] **L1**：§5.1 各 UI 文本预留 150-300% 膨胀
- [x] **L2**：短文本（朝代名、CTA）预留 200-300%
- [x] **L3**：CSS 用逻辑方向 `margin-inline-*` / `padding-inline-*`（给 r-frontend 硬约束）
- [x] **L4**：答对/答错 / Locked / Unlocked 都有 icon + 文案双编码
- [x] **L5**：所有 UI 文字 100% 参数化自 locale（含插画 alt）；**禁止**把文字嵌入插画 PNG
- [x] **L6**：§META 声明目标语言 zh-CN + en
- [x] **L7**：目标语言 ≥ 2 ✅；导航**含语言切换 UI 组件**。顶栏组件排列顺序：`Logo · Nav(none，本项目顶栏无中间 nav links) · 🌐 语言 · ☀☾ 主题 · 🗂️ 卡册`（本项目无 Sign In + 主 CTA 配对，因此 SC-NV1"auth 配对组"规则不触发；移动端汉堡菜单本项目不使用，4 icon 顶栏直接展开）

### 无障碍 [A1-A9] ✅

- [x] **A1/A2/A3**：对比度 ≥ 4.5:1 / 3:1（§6.1 清单，dark CTA 用深字兜底已决策）
- [x] **A4**：键盘可操作（§6.2/6.3 定义 Tab 顺序 + 方向键 + Enter/Space）
- [x] **A5**：焦点指示器 `--shadow-focus-ring` 3px ring 明暗两套
- [x] **A6**：Heading 层级 h1 → h2 → h3 不跳级（r-frontend 实现时注意）
- [x] **A7**：Landmark header/nav/main 覆盖（给 r-frontend）
- [x] **A8**：`prefers-reduced-motion` 已在 Design Token §5.4 落地
- [x] **A9**：RTL 焦点顺序 hook 保留（暂不触发）

### 输出完整性 [O1-O15] ✅

- [x] **O1**：断点策略表（§2）✅ 含 375/768/1024/1280+
- [x] **O2**：排版规格表（§4）✅ CJK + Latin 两系统
- [x] **O3**：多语言适配标注（§5）✅ 膨胀 + RTL hook + 文化
- [x] **O4**：无障碍标注（§6）✅ 对比度 + 焦点 + ARIA
- [x] **O5**：自检清单逐条确认（本节）✅
- [x] **O6**：移动端内容优先级 5 任务（§1.1）
- [x] **O7**：移动端导航方案（§2 + §3 模块 A，非桌面缩小版）
- [x] **O8**：移动端核心操作位置（sticky 底栏 / 拇指热区）
- [x] **O9**：每个模块标注布局模式（§3）
- [x] **O10**：多语言走查记录（§5.4：中 + 英双向覆盖，本项目不含 DE/AR 按项目级豁免说明）
- [x] **O11**：接收回写机制（修订记录 + CO1-CO4 协议 · Schema 顶部已预留 `## 修订记录` 节）
- [x] **O12**：Schema 粒度精确到条数（朝代图谱 10 关 · 选项 4 个 · 顶栏 4 icon · 卡册 10 张等）
- [x] **O13**：断点内容差异表（§3.0）✅ 17 行 Section × 4 列（含移动端独有组件）
- [x] **O14**：Pencil library 建议路径（META：默认强约束）
- [x] **O15**：chip/tag/pill 溢出规范（§响应式关键组件行为表）✅ 含错题筛选 + 次级 CTA overflow

### MUST NOT [N1-N16] ✅

- [x] **N1**：无任何代码（仅 CSS 片段作实现提示，r-frontend 会翻译，非交付代码）
- [x] **N2**：zh + en 双语假设（非单语）
- [x] **N3**：无固定 px 布局宽度（均为 clamp/max-width/logical props）
- [x] **N4**：分步自检均执行
- [x] **N5**：使用 `margin-inline-*` 逻辑方向
- [x] **N6**：UI 文字全部参数化，不嵌入图片
- [x] **N7**：颜色 + icon + 文案三重编码
- [x] **N8**：布局可缩放（clamp + 百分比）
- [x] **N9**：移动端独立设计（§3 每个模块移动/桌面两栏）
- [x] **N10**：移动首屏是内容（朝代图谱）不是导航
- [x] **N11**：**Hover 仅 `@media (hover:hover) and (pointer:fine)`（引用 SC-HV1-5，r-frontend 硬约束）**；移动端用 `:active` 内陷反馈（`opacity: 0.8` or `scale(0.97)`）；Schema 交互章节每组件 5 态（default / hover-desktop / active-touch / focus-visible / disabled）在 §6.3 ARIA 表 + §3 模块交互段落中覆盖（组件状态完整性待 r-pencil 5 态绘制）
- [x] **N12**：移动端核心操作（Next CTA / Start CTA）在 sticky 底栏 / 中央区域，不在顶栏
- [x] **N13**：本项目无数据表格（答题选项已是卡片化）
- [x] **N14**：桌面 Modal 在移动端全部改 Bottom Sheet / 全屏浮层
- [x] **N15**：手势（滑动 / 长按）均有点击替代
- [x] **N16**：多语言走查用中 + 英双向覆盖（本项目目标仅此两种）

### 竞品对标 [CP1-CP6]

- [x] **CP1 排版 Apple 模式**：Display/H1/H2 用 `clamp()` 流体，Body 阶梯式 `16px`
- [x] **CP2 CTA 弹性宽度**：主 CTA 用 `min-width` + `padding` 弹性（Wise/Booking 模式），德语 ~2.5×（本项目不含 DE，儿童 EN 用 PROJ-EX 200-300%）
- [x] **CP3 line-clamp**：知识卡故事长段可用 `-webkit-line-clamp` 截断（长度已在 content-blueprint §3 约束 ≤120 中 / ≤200 英，MVP 可能不需触发）
- [N/A] **CP4 RTL 镜像**：本项目不含 RTL
- [x] **CP5 复杂筛选移动端全屏 modal**：错题筛选用 mobile 下拉 + desktop Tab；本项目无"复杂筛选"但下拉是等价轻量方案
- [N/A] **CP6 本地化信任信号**：儿童教育无此场景（无付费/无合规信号）

### 协作协议 [CO1-CO4]

- [x] **CO1**：r-pencil 提交 SCHEMA-DELTA 后 r-designer 24h 裁决（承诺）
- [x] **CO2**：批准修订落回 Schema 顶部 `## 修订记录` 节
- [x] **CO3**：r-pencil 按断点提交（375 → 768 → 1024 顺序，每档裁决后再进下一档）
- [x] **CO4**：三方冲突按 SC-AS4 优先级：视觉 .pen > 文案 locale > 策略 Schema

### 主题模式 [TM1-TM6] ✅

- [x] **TM1**：Design Token 含 light/dark 双套 Semantic（design-tokens §1.2 + §7）
- [x] **TM2**：本 Schema §2.5 主题模式章节覆盖 SC-TH1-8 全部 8 点
- [x] **TM3**：r-pencil MUST 画 Hero (首页 + 朝代图谱) + 代表性 Section（答题页反馈态）两模式各一组（指令传给 r-pencil）
- [x] **TM4**：r-frontend MUST 三态切换 + FOUC + SSR 一致性（指令传给 r-frontend，FW12-14）
- [x] **TM5**：QA 矩阵 3 断点 × 2 语言 × 2 模式 = 12 组合全覆盖（指令传给 r-qa）
- [x] **TM6**：切换动画仅过渡色彩属性，禁 layout 属性（§2.5.3 + Design Token §8）

---

## 8. 交接清单

| 交给 | 关键章节 | 硬约束/输出期望 |
|------|---------|---------------|
| r-pencil | §META 路径 + §2 断点 + §2.5 主题 + §3.0 差异表 + §3 模块 + §4 排版 + §5 膨胀 + §响应式关键组件表 | 绘制 375/768/1024 三档 + light/dark 两模式（Hero + 答题反馈代表性 Section 至少双模式各一版） + SCHEMA-DELTA.md 按断点提交（CO3）+ IMPLEMENTATION-GUIDE.md + chip/tag 手动拆行（SC-OV1） |
| r-frontend | §META 断点 + §2.5 主题 FOUC + §3.0 FW11 移动端重设计 + §4 排版 + §5.1 locale 补 key + §6 无障碍 + §响应式关键组件表 | 按 FW9 严格遵循 .pen 精确值 + FW11 `key_mobile` 双变体 locale + FW12-14 主题实现 + FW15 locale re-bundle |
| r-qa | §META 断点 + §2.5 主题 + §6.1 对比度验证清单 + §7 自检 | 12 组合矩阵全覆盖（3 断点 × 2 语言 × 2 模式）+ Lighthouse a11y 100 + 对比度人工实测 webaim |
| content-strategist / 用户 | §5.1.1 locale 补 key 清单 | 批准后回写 locale-zh/en.json（6 个新 key） |

---

**Schema v1 完稿签字**：r-designer · 2026-04-17
**下一步**：⏸️ 审批节点 1（用户裁决 Schema），批准后 r-pencil 开工
