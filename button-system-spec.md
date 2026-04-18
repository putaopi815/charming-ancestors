# Button System Spec · charming-ancestors

> 起因：用户反馈「全局主次按钮样式都不统一」「全局弹窗里的按钮乱七八糟没有主次统一」。
> 本规范一次性锁死全局按钮层级、尺寸、用法与弹窗 action 排版，作为 style.css / app.js 的唯一真源。
> 日期：2026-04-18。

---

## 0. 设计原则（为什么要这套规范）

- **一屏一个 primary**（Hick 定律 + Von Restorff）：任何一屏/一个弹窗最多一个主按钮，否则用户注意力被稀释，转化率下降。
- **按钮必须"看着像按钮"**（认知流畅性）：ghost 纯文字在 chrome-less 的 dialog 里会被误读为副标题/描述。按钮有可点感 = 命中率。
- **尺寸定语义**（Fitts 定律）：主流程推进的 CTA 用 56px；确认/取消/弹窗操作用 44px；顶栏工具和图标按钮用 40px（配 ::before 扩展命中 48）。
- **DOM 顺序和视觉顺序解耦**：一个弹窗里 ghost 永远走最左/最上（心理路径"先看次要选项"），primary 永远走最右/最下（拇指热区 + 序列位置效应尾部记忆）。

---

## 1. 全局按钮基类 `.btn`（不变动）

```
min-block-size: 44px    （base 触达线）
padding: 14px 24px
border-radius: --radius-md
font-size: 16px
font-weight: semibold
line-height: 1.2
gap: 8px                （icon + label）
```

触摸目标 >= 44×44 不依赖 ::before 扩展（因为是按钮本体）。

---

## 2. 按钮变体（五种，不增不减）

| 变体 | class | 视觉 | 用途 | 一屏/一弹窗数量 |
|---|---|---|---|---|
| **Primary** | `.btn .btn--primary` | bg=accent-primary，fg=on-accent，无边 | 当前场景唯一主行动（推进流程、提交、确认破坏性操作的对立面） | **最多 1** |
| **Outline** | `.btn .btn--outline` | bg=secondary，fg=primary，1.5px border=strong | 次要但仍是"按钮性"操作（替代路径、返回某个状态） | 0-1 |
| **Ghost** | `.btn .btn--ghost` | 透明 bg，fg=muted，无边 | **仅用于"离开/取消/放弃"类次要导航**，且在**有 primary 对比**的同一 actions bar 内 | 0-1 |
| **Danger** | `.btn .btn--danger` | bg=state-danger，fg=on-accent | 破坏性行动的确认按钮（删除、清零进度等） | 0-1（替代 primary 位） |
| **Icon-only**（**新增**） | `.btn .btn--icon` | 透明/elevated bg，仅图标，圆形或 radius-md | 纯图标操作（弹出菜单 ellipsis、关闭 X、返回箭头） | 不限 |

### 2.1 `.btn--icon` 规范（新增，解耦自 ghost）

```css
.btn--icon {
  min-block-size: 44px;
  min-inline-size: 44px;
  inline-size: 44px;
  block-size: 44px;
  padding: 0;
  gap: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-fg-primary);
  font-size: 20px;
  flex: 0 0 auto;
}
.btn--icon--elevated {
  /* 卡片详情关闭按钮：背景是图像/强色时需要白底 */
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-sm);
}
```

**为什么独立类**：Ghost 现状是"纯文字"样式（视觉上看不出来是按钮）。Result 页 `ellipsis` 按钮目前复用 `.btn--ghost`，导致它和 primary 的"下一朝代"宽高不一致、还要写 `flex: 0 0 56px; padding: 14px;` 覆盖——是变体混用导致的补丁。独立出 `.btn--icon` 后一行覆盖都不需要。

---

## 3. 尺寸规范（按场景锁死）

| 尺寸 | min-height | 使用场景 |
|---|---|---|
| **CTA 56px** | `min-block-size: 56px` | Quiz `.quiz-cta__btn`（Sticky bottom 推动答题）/ Result 非弹窗推进（下一朝代/回首页）。**仅用于 sticky bottom bar 的流程推进按钮**。 |
| **Base 44px** | `min-block-size: 44px`（`.btn` 默认） | 所有弹窗 action / 空态 CTA / 行内次要按钮 |
| **Compact 40px** | `inline-size: 40px; block-size: 40px` | 顶栏工具按钮（`.tool-btn`）和返回按钮（`.back-btn`）。此类按钮 **MUST 带 `::before { inset: -4px }` 扩展触摸区到 48×48** |

**强制规则 S1**：弹窗内按钮 **禁止**使用 56px（会让 dialog 内看起来像主页 hero CTA，和 dialog 视重不匹配，也挤压垂直空间）。
**强制规则 S2**：Quiz CTA 保留 56px（它不是 dialog，而是 sticky 推进主行动）。
**强制规则 S3**：顶栏工具按钮视觉 40，但 `::before` 必须扩展到 48，否则 Lighthouse 触摸目标告警。

---

## 4. 弹窗按钮体系（`.dialog__actions`，最关键）

### 4.1 数量与语义

- **一个弹窗最多 1 个 primary**。违反 = 用户不知道该点哪个。
- **一个弹窗最多 1 个 ghost**，且 ghost **必须是"离开/取消/放弃"语义**。
- **两个按钮不能走同一目的地**（目前 mid_quiz 的「放弃，回首页」ghost 和 ExitConfirm 的「放弃这一关」ghost 语义重复于 outline 分支——见审计 A-03）。

### 4.2 DOM 顺序（无条件遵守）

```
[ghost, outline, primary]   // 最多三个 action
```

- Mobile（column）从上到下依次是 ghost → outline → primary（primary 在底，拇指热区）。
- Desktop（row + `justify-content: flex-end`）从左到右依次是 ghost → outline → primary（primary 在右，视觉动线尾）。

### 4.3 视觉强制项

| 项 | 规则 |
|---|---|
| 高度 | 统一 44px base（`.btn` 默认），**禁止**应用 56px CTA |
| 宽度（mobile） | `.dialog__actions .btn { inline-size: 100% }`（现状已对） |
| 宽度（desktop） | `.dialog__actions .btn { inline-size: auto }`（现状已对） |
| 按钮间距 | mobile: `gap: 8px`；desktop: `gap: 12px`（现状已对） |
| autofocus | **非破坏性**弹窗 autofocus 在 primary；**破坏性**弹窗（alertdialog）autofocus 在 ghost（取消），防误触 |
| Ghost 视觉 | Ghost 在 dialog 里 **必须有最小视觉轮廓**（见下 §4.4） |

### 4.4 Ghost 在 dialog 内的视觉底线

现状 ghost 是"纯 muted 色文字"，在 dialog 里三按钮并排时 ghost 看起来像**副标题**而不是按钮。方案二选一：

**方案 A（推荐，最小改动）**：新增 `.dialog__actions .btn--ghost` 覆盖：
```css
.dialog__actions .btn--ghost {
  border: 1.5px solid transparent;  /* 占住边框槽位保持高度一致 */
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--color-fg-secondary);
}
```
让 ghost 保持"轻"但有可点提示（下划线）。

**方案 B**：将 ghost 降级为 outline，只留两档（primary / outline）。但这样三选项弹窗（mid_quiz / ExitConfirm）没法分三档层级。

**本规范采纳方案 A**。

---

## 5. 页面按钮速查表（落地对照）

| 位置 | 应用变体 | 尺寸 | 当前状态 |
|---|---|---|---|
| Home 顶栏 language/theme/cards | `.tool-btn`（独立类，不属 `.btn`） | 40×40，::before +4 扩到 48 | OK |
| Home dynasty 卡片 | `.dynasty-card`（独立卡片组件，非按钮） | 不适用 .btn 规范 | OK（卡片是容器非按钮） |
| Home「再来看一眼」错题入口 | `.wrong-entry`（独立 list-item） | 高 80-88px | OK |
| Quiz 返回 | `.back-btn` | 40/44×40/44，::before +4 | OK |
| Quiz 选项 A/B/C/D | `.quiz-option`（独立 radio card） | 不适用 .btn 规范 | OK |
| Quiz 底部「下一题」 | `.btn .btn--primary .quiz-cta__btn` | **56px CTA** | OK（符合 §3 S2） |
| Result 返回 | `.back-btn` | 同上 | OK |
| Result「下一朝代」 | `.btn .btn--primary` | 按 `.btn` base 44，实际因 sticky 视觉感强 | **改：应用 56px CTA 与 quiz 一致**（语义都是流程推进） |
| Result ellipsis 菜单 | 当前 `.btn .btn--ghost` 带 `flex: 0 0 56px; padding: 14px;` | 高度与 primary 不齐，宽度 56 | **改：改为 `.btn .btn--icon`，高度匹配 primary**（见审计 A-05） |
| Result「看看哪里差一点」 | `.result-wrong-entry`（独立 list-item） | 不适用 .btn 规范 | OK |
| Cards 返回 | `.back-btn` | 同上 | OK |
| Cards 卡片 | `.card-tile`（独立卡片） | 不适用 | OK |
| Cards 空态 CTA「去闯关」 | `.btn .btn--primary` | 44px base | OK |
| 卡片详情 X 关闭 | `.card-detail__close` | 44×44 圆形 elevated | **建议：迁移到 `.btn .btn--icon .btn--icon--elevated`** 统一 |
| 卡片详情「回到朝代图谱」 | `.card-detail__back-link`（a 链接样式） | 不适用 .btn 规范 | **保持**（语义是链接不是按钮）|
| Wrong 返回 | `.back-btn` | 同上 | OK |
| Wrong tab 筛选 | `.wrong-filter__tab` | 独立 tab | OK |
| Wrong 空态 CTA | `.btn .btn--primary` | 44px base | OK |
| **弹窗 mid_quiz**（3 actions） | ghost/outline/primary | **统一 44px** | **改：ghost 加下划线样式**（见审计 A-03） |
| **弹窗 ExitConfirm**（3 actions） | ghost/outline/primary | **统一 44px** | 同上 |
| **弹窗 ReplayConfirm**（2 actions） | ghost/primary，**alertdialog** | 44px，autofocus 在 ghost | **改：ghost 同上**；破坏性动作文案与视觉二次对齐（见审计 A-04） |
| **弹窗 Result more**（2 actions） | ghost/primary | 44px | **改：ghost 同上**（见审计 A-05） |
| **弹窗 Quiz load_error** | 仅 1 primary「放弃回家」 | 44px | **不合适**：错误弹窗的「放弃」是 ghost 语义不是 primary（审计 A-06）|

---

## 6. 不可跨越的红线（review 时一票否决）

1. 不允许 `.btn--primary` 与另一个 `.btn--primary` 出现在同一 `.dialog__actions` 或同一 `.result-ctas-sticky`。
2. 不允许弹窗内按钮 `min-block-size > 48px`。
3. 不允许 ghost 单独出现（无 primary 同屏对比时），否则降级为 outline。
4. 不允许图标按钮继承 `.btn--ghost`，必须走 `.btn--icon`。
5. 不允许新增第六种按钮变体（如 tertiary、link-btn）——有新需求先在本规范开 section。
6. 不允许给某个实例加 `.btn` 的内联 override（如 `style="min-height:60px"`、`flex: 0 0 56px`）——必须走变体 class。

---

## 7. 验证命令（grep 自查）

```bash
# 检查是否有弹窗内应用 56 CTA（违反 §3 S1）
grep -n 'dialog__actions.*56' style.css

# 检查是否有多个 primary 在同一 actions 里（JS 层）
# 用法：逐一读 openDialog 的 actions 数组，primary 计数 <= 1

# 检查是否有 ghost 被误用为图标按钮
grep -n "btn--ghost.*data-more\|btn--ghost.*aria-label.*close\|btn--ghost.*iconSvg" app.js
```

---

## 8. 实施顺序（给 frontend agent）

按审计报告 `button-audit-20260418.md` 的 A-01 → A-07 顺序修，每个 A-xx 修完重跑 1-8 的截图比对。
