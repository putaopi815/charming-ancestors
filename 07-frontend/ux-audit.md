# UX 审查报告 · charming-ancestors
> 审查时间：2026-04-18  
> 审查范围：app.js + style.css（全页面）

---

## 发现问题（P0/P1/P2 分级）

### P0 · 阻断

| 位置 | 问题描述 | 修复方案 | 状态 |
|------|---------|---------|------|
| `app.js` · `onDynastyClick` | 重玩确认弹窗使用 `role: dialog` 而非 `alertdialog`，破坏性操作语义不正确，ESC 可意外关闭并触发 onDismiss | 改为 `role: 'alertdialog'`，ESC 不触发确认 | 已修复 |
| `app.js` · "更多"弹窗（结果页） | 弹窗里 replay 用 `outline`，无 primary，用户无法快速识别主操作；desktop `row-reverse` 后两个辅助按钮并列，主操作不突出 | replay 改为 `primary`+`autofocus`，home 改为 `ghost`；数组顺序 [ghost, primary] 使 desktop 右边为 primary | 已修复 |

### P1 · 影响体验

| 位置 | 问题描述 | 修复方案 | 状态 |
|------|---------|---------|------|
| `style.css` · `.btn--outline/.btn--ghost` | 两种变体缺少 `:active` 反馈，触摸设备按下无任何视觉响应，违反 Nielsen 反馈原则 | 补充 `opacity: 0.85/0.75` active 态 | 已修复 |
| `app.js` · `renderWrong` 空状态 | 错题页全部清零后无任何 CTA，用户陷入死胡同，无法自发跳出 | 添加"去答题"primary CTA，navigate('/home') | 已修复 |
| `style.css` · `.result-stage1` Mobile | 得分卡在 Mobile 全宽无圆角，与 Tablet/Desktop 圆角卡片体验割裂；边缘贴屏感廉价 | 添加 `border-radius: var(--radius-lg)` + `margin-inline: var(--space-gutter-mobile)` | 已修复 |
| `style.css` · `.result-wrong-entry` | 错题入口无 `min-block-size`，实际高度依赖内容，低于 48px 基线时触摸目标不达标 | 添加 `min-block-size: 56px` 明确锚定 | 已修复 |
| `style.css` · `.wrong-item[aria-expanded="true"]` | 展开时从 `padding: 14px 16px` + 无 border → `padding: 16px` + `border: 1px`，两侧各加 2px，导致列表元素轻微横向抖动 | 改用 `outline`（不占布局空间）替代 `border`，padding 保持一致 | 已修复 |
| `style.css` · `quiz-main` | Mobile 下 `quiz-main` 设 `padding-block-end: 120px` + `quiz-body` 也有 `padding-block: 16px 120px`，底部空间叠加到 240px；Tablet 也有额外 48px 冗余 | 删除 `quiz-main` 的 Mobile/Tablet `padding-block-end`，统一由 `quiz-body` 控制 | 已修复 |
| `style.css` · `.result-ctas-sticky` Desktop | Desktop 静态化后 `margin-block-start: 16px` 与 `result-main` 的 `gap: 24px` 叠加，CTA 组距上方内容 40px，间距不统一 | 删除 `margin-block-start: 16px`，间距交由 `result-main gap` 统一管理 | 已修复 |

### P2 · 轻微问题（已审查，保留）

| 位置 | 问题描述 | 决策 |
|------|---------|------|
| `style.css` · `body, *` transition | 全局通配符 transition 包含所有颜色属性，理论上对 quiz 动画密集页有轻微性能影响 | 改动风险高于收益，暂不修改 |
| `app.js` · 选项点击无"选中中间态" | 点选后立即进入 correct/wrong 态，无短暂 selected → reveal 过渡感 | 符合即时反馈设计意图，不是 bug |
| `style.css` · `wrong-detail-panel` Desktop outline | `wrong-item--active` 用 `outline: 2px solid` 作聚焦环，但与无障碍 `:focus-visible` 的 outline 视觉重叠 | 功能正常，无障碍不受影响，留待 Phase 4 优化 |

---

## 全局规范总结（修复后确立）

### 1. 按钮层级规范
- **Primary**：每个页面/弹窗最多 1 个，放主操作（继续答题、开始答题、重玩）
- **Outline/Secondary**：辅助操作，需要但不紧迫（保存进度、重开）
- **Ghost**：退出/返回/取消等破坏性操作或低优先级选项
- **弹窗 actions 数组顺序**：破坏性/取消在前（index 0），主操作在后（index last），CSS `row-reverse` 自动保证 Desktop 主操作在右

### 2. 弹窗角色规范
- 破坏性操作确认（退出答题、重玩、丢弃进度）→ `role: alertdialog`，ESC 不触发确认，autofocus 在取消按钮
- 信息性/引导性弹窗（续题提示、卡片）→ `role: dialog`，ESC 可关闭

### 3. 触摸目标规范
- 所有可点击元素 `min-block-size: 48px`（推荐 56px）
- 视觉尺寸不足时用 `::before` 虚拟扩展，不改变布局
- inline 元素（错题入口、wrong-entry）必须显式声明 `min-block-size`

### 4. 空状态规范
- 空列表页（cards 空、wrong 空）**必须**提供至少 1 个 primary CTA 导向下一步
- 不允许纯文案死胡同（无 CTA 的 empty state）

### 5. 间距规范
- 每个容器只由**一层**负责底部留白，禁止父子容器双重 padding 叠加
- Sticky CTA（quiz、result）的底部空间由其直接父容器或 `quiz-body` 自身管理
- 页面级 gap 交由 flex/grid gap 统一管理，子元素不再加 margin 叠加
