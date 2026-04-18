# Button System Audit · charming-ancestors · 2026-04-18

> 基于 `button-system-spec.md` 对当前 `07-frontend/dist/` 代码的偏离审计。
> 项目源：`/Users/fancyliu/Claude/projects/charming-ancestors/07-frontend/dist/`
> 截图归档：`/Users/fancyliu/Claude/projects/charming-ancestors/screenshots-btn-audit/`（01-11）

## 摘要

- **严重偏离 7 项**（A-01 ~ A-07），全部跟"弹窗按钮乱"和"ghost/icon 耦合"直接相关。
- **主要根因 3 个**：
  1. `.btn--ghost` 过度重载——既做弹窗的"取消/放弃"，又做 Result 的 ellipsis 图标按钮（A-05）。导致两套视觉冲突时互相打补丁。
  2. Ghost 的视觉太弱（纯 muted 文字），在 dialog 三按钮并排时完全丧失"按钮感"（A-01、A-02、A-03、A-04）。用户截图 02 / 04 / 07 / 11 已经反映。
  3. 错误弹窗把 ghost 语义（"放弃"）写成 primary（A-06），违反"primary 是当前场景的推进 CTA"。

---

## A-01 · 【P0】mid_quiz 弹窗 ghost「放弃，回首页」无按钮外观

**证据**：screenshots-btn-audit/02-dialog-mid-quiz.png
- 三个 actions 并排时，"放弃，回首页"仅是一行 muted 居中文字，"从头再来"是 outline 描边框，"接着答"是 primary 实心——三档视觉有一档（ghost）看着不像按钮。

**文件**：`app.js:848`
**当前**：
```js
{ label: t('mid_quiz.cta.discard'), variant: 'ghost', onClick: function () { ... }},
```

**偏离点**：`.btn--ghost` 在 dialog 场景下视觉过弱（spec §4.4）。

**修复**：在 `style.css` 第 1203 行（`.btn--ghost:active` 之后）增补：

```css
/* Ghost in dialog: 提升可点感（见 spec §4.4 方案 A） */
.dialog__actions .btn--ghost {
  border: 1.5px solid transparent;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--color-fg-secondary);
}
@media (hover: hover) and (pointer: fine) {
  .dialog__actions .btn--ghost:hover {
    text-decoration: none;
    background: var(--color-bg-secondary);
  }
}
```

**Edit 语法**：
```
old_string:
.btn--ghost:active { opacity: 0.75; }

.btn--danger {

new_string:
.btn--ghost:active { opacity: 0.75; }

/* Ghost in dialog: 提升可点感（spec §4.4 方案 A） */
.dialog__actions .btn--ghost {
  border: 1.5px solid transparent;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--color-fg-secondary);
}
@media (hover: hover) and (pointer: fine) {
  .dialog__actions .btn--ghost:hover {
    text-decoration: none;
    background: var(--color-bg-secondary);
  }
}

.btn--danger {
```

---

## A-02 · 【P0】ExitConfirm 弹窗同上

**证据**：screenshots-btn-audit/04-dialog-exit-confirm.png
- 三 actions：「放弃这一关」ghost 无按钮感，「回首页（下次继续）」outline，「继续答题」primary。

**文件**：`app.js:1271`
**偏离点**：同 A-01（ghost 视觉底线）。
**修复**：A-01 的样式补丁一次覆盖。

**额外子问题 A-02.1**：破坏性语义（"放弃这一关" = 丢弃进度）用 ghost 不够警示。建议把它升级为 `.btn--danger` 或在文案旁加 secondary muted 说明"（进度会丢失）"。

**建议 Edit**：`app.js:1271` 改为
```js
{ label: t('quiz.confirm_exit.discard'), variant: 'danger', onClick: function () { ... }},
```
但此改动涉及翻译文案、还会让 alertdialog 出现双"红意向"（danger + primary），需产品二次确认。**标为 P1**，先不执行，P0 只修视觉。

---

## A-03 · 【P0】mid_quiz 的"放弃，回首页"和 ExitConfirm 的"放弃这一关"语义重复

**证据**：两个弹窗里的 ghost 都是"清除当前 session 并回首页"同一个目的地。
- mid_quiz: `app.js:848-850` 执行 `s.currentSession = null; writeState(s);`
- ExitConfirm: `app.js:1271-1274` 执行 `s.currentSession = null; writeState(s); navigate('/home');`

**偏离点**：spec §4.1 "两个按钮不能走同一目的地"——同一套用户心智，两个弹窗用了**不同文案**指向**相同动作**，用户学不到一致的词。

**修复**（P1，需要 content 配合）：
1. 统一文案键：mid_quiz 的 `discard` 和 quiz 的 `confirm_exit.discard` 使用**同一翻译 key**，如 `action.discard_and_home`。
2. 统一标签："放弃，回首页"（mid_quiz 现文）更直白，建议 ExitConfirm 也改为这个；去掉"放弃这一关"里的"关"字（用户在 mid_quiz 上下文也叫"关"）。

**本次先不改代码，登记到未决单**。

---

## A-04 · 【P0】ReplayConfirm 弹窗 ghost 无按钮感

**证据**：screenshots-btn-audit/11-dialog-replay-confirm.png
- 两 actions：「先不了」ghost 无按钮感（就是一行蓝灰色文字）+「好，开始」primary。

**文件**：`app.js:815`
**偏离点**：同 A-01。
**修复**：A-01 的全局 patch 一次覆盖。

**额外校验**：autofocus 已在 ghost（取消）上（`autofocus: true`）—— 符合 spec §4.3 "破坏性弹窗 autofocus 在取消"。OK。

---

## A-05 · 【P0】Result ellipsis 按钮用 `.btn--ghost` 而非独立 icon 类

**证据**：
- screenshots-btn-audit/06-result.png：主 CTA「进入 商」占一行大部分，右边「…」小方块（56×44）。
- screenshots-btn-audit/07-dialog-result-more.png：点开后 ghost「回到朝代图谱」 + primary「再玩一次这一关」。

**文件**：`app.js:1369`、`style.css:2064-2065`

**当前代码**：
```js
// app.js:1369
'<button type="button" class="btn btn--ghost" data-more aria-label="' + esc(t('result.cta.more')) + '">' + iconSvg('ellipsis') + '</button>'
```
```css
/* style.css:2064-2065 */
.result-ctas-sticky .btn--primary { flex: 1 1 auto; }
.result-ctas-sticky .btn--ghost { flex: 0 0 56px; padding: 14px; }
```

**偏离点**：
1. spec §2 红线 4："不允许图标按钮继承 `.btn--ghost`，必须走 `.btn--icon`"。
2. `.result-ctas-sticky .btn--ghost` 用 `flex: 0 0 56px; padding: 14px` 硬覆盖——典型的"变体混用导致打补丁"。
3. 加上 A-01 的 dialog ghost 下划线补丁后，这个 ellipsis 按钮也会被错加下划线（因为它也是 ghost），必须先解耦。

**修复 step 1**：新增 `.btn--icon` 类。`style.css:1205` 之前（`.btn--danger` 之前）插入：

```css
/* ================================================================
   Icon-only button · spec §2.1
   用于 Result ellipsis / CardDetail close / 任何纯图标操作
   ================================================================ */
.btn--icon {
  inline-size: 44px;
  min-inline-size: 44px;
  block-size: 44px;
  min-block-size: 44px;
  padding: 0;
  gap: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-fg-primary);
  font-size: 20px;
  flex: 0 0 auto;
}
@media (hover: hover) and (pointer: fine) {
  .btn--icon:hover { background: var(--color-bg-secondary); }
}
.btn--icon:active { opacity: 0.75; }

.btn--icon--elevated {
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-sm);
}
```

**修复 step 2**：`app.js:1369` 改类名：
```
old_string: '<button type="button" class="btn btn--ghost" data-more aria-label="' + esc(t('result.cta.more')) + '">' + iconSvg('ellipsis') + '</button>' +

new_string: '<button type="button" class="btn btn--icon" data-more aria-label="' + esc(t('result.cta.more')) + '">' + iconSvg('ellipsis') + '</button>' +
```

**修复 step 3**：删掉 `style.css` 第 2065 行和 2078 行对 `.btn--ghost` 的 sticky 覆盖，改为 `.btn--icon`：
```
old_string:
.result-ctas-sticky .btn--primary { flex: 1 1 auto; }
.result-ctas-sticky .btn--ghost { flex: 0 0 56px; padding: 14px; }

new_string:
.result-ctas-sticky .btn--primary { flex: 1 1 auto; }
.result-ctas-sticky .btn--icon { flex: 0 0 44px; block-size: 44px; min-block-size: 44px; }
```

```
old_string:
  .result-ctas-sticky .btn--primary,
  .result-ctas-sticky .btn--secondary,
  .result-ctas-sticky .btn--ghost { flex: 0 0 auto; }

new_string:
  .result-ctas-sticky .btn--primary,
  .result-ctas-sticky .btn--secondary,
  .result-ctas-sticky .btn--icon { flex: 0 0 auto; }
```

**副作用检查**：改完后 ellipsis 按钮从 56×44 变成 44×44，视觉上更紧凑，且与 primary 等高——原先高度不一致问题顺带修了。

---

## A-06 · 【P1】Quiz 加载失败弹窗仅有 1 个 primary「放弃回家」

**证据**：`app.js:981`
```js
'<button type="button" class="btn btn--primary" data-back-home>' + esc(t('quiz.load_error.give_up')) + '</button>'
```

**偏离点**：spec §2 Primary 定义——"当前场景的唯一主行动"。加载失败页只有一个按钮且是"放弃"语义，写成 primary 会让用户以为这是"推荐操作"，实际是"除此无他"。

**修复**：改为 outline（语义"这是一个操作但不是推荐")：
```
old_string:
'<button type="button" class="btn btn--primary" data-back-home>' + esc(t('quiz.load_error.give_up')) + '</button>' +

new_string:
'<button type="button" class="btn btn--outline" data-back-home>' + esc(t('quiz.load_error.give_up')) + '</button>' +
```

或更好的方案：加个"重试"为 primary，原按钮为 outline——但这涉及新功能，登记到未决单。

---

## A-07 · 【P2】卡片详情关闭按钮 `.card-detail__close` 未统一到 `.btn--icon`

**证据**：screenshots-btn-audit/09-card-detail.png
- 左上圆形 X 按钮，`style.css:2359-2382` 独立样式，44×44 圆形带 shadow。

**偏离点**：视觉上已经符合 `.btn--icon--elevated` 预期（44×44、圆、elevated bg、shadow）——但存在**两套"图标按钮"定义**（`.card-detail__close` + 规划中的 `.btn--icon`）。违反规范第一原则"一套 class = 一个规范"。

**修复**（低优先级，可跟 A-05 一起做）：
1. `app.js:1539-1543` 改：
```
old_string:
'<button type="button" class="card-detail__close" aria-label="' + esc(t('card.close')) + '" data-card-close>' +

new_string:
'<button type="button" class="btn btn--icon btn--icon--elevated card-detail__close" aria-label="' + esc(t('card.close')) + '" data-card-close>' +
```
2. `style.css:2359-2382` 简化为只保留定位相关（position / topbar 位置），删除重复的 size/radius/bg/shadow 定义（由 `.btn--icon` 和 `.btn--icon--elevated` 提供）。

**跳过理由（P2）**：`.card-detail__close` 当前视觉没问题，用户没报这里的 bug。属于技术债规整，不紧急。可放到下一轮 polish。

---

## 未偏离但需要记录的正确项

- **Quiz 「下一题」** sticky CTA 用 56px（`.quiz-cta__btn { min-block-size: 56px }`）—— 符合 spec §3 S2（sticky bottom 推进主行动）。保留。
- **顶栏 tool-btn** 40×40 + `::before { inset: -4px }` 扩到 48 —— 符合 §3 S3。保留。
- **back-btn** mobile 40 / desktop 44 + `::before` 扩展 —— 符合 §3。保留。
- **openDialog 的 DOM 顺序** 实际是"按 actions 数组顺序渲染"，项目三次 openDialog 调用的 actions 数组都恰好是 `[ghost/outline → primary]`——意外符合 spec §4.2。**但这是纪律而非强制**，建议在 `app.js:444` openDialog 里加 sort：

```js
function openDialog(config) {
  // ... 现有 backdrop / sheet 初始化 ...
  // spec §4.2: DOM 顺序强制 ghost → outline → primary → danger
  var order = { ghost: 0, outline: 1, secondary: 1, primary: 2, danger: 3, icon: -1 };
  var actions = (config.actions || []).slice().sort(function (a, b) {
    return (order[a.variant || 'primary'] || 2) - (order[b.variant || 'primary'] || 2);
  });
  // ... 用 actions 替换原来的 config.actions 渲染
```

**Edit 语法**：
```
old_string:
  function openDialog(config) {
    // 关闭任何 open 的 dialog
    closeAllDialogs();

new_string:
  function openDialog(config) {
    // 关闭任何 open 的 dialog
    closeAllDialogs();
    // spec §4.2 弹窗 DOM 顺序：ghost → outline → primary → danger
    if (config && config.actions) {
      var _order = { ghost: 0, outline: 1, secondary: 1, primary: 2, danger: 3 };
      config.actions = config.actions.slice().sort(function (a, b) {
        return (_order[a.variant || 'primary'] || 2) - (_order[b.variant || 'primary'] || 2);
      });
    }
```

注意：需确认现有 `app.js:292` 的 `closeAllDialogs()` 之后才是 openDialog 主体；上面的锚点可能要微调。frontend 实施时请先 Read 整段确认。

---

## 建议实施顺序

| 优先级 | 任务 | 文件 | 预计工时 |
|---|---|---|---|
| P0 | A-05 新增 `.btn--icon` 并迁移 Result ellipsis | style.css + app.js | 15 min |
| P0 | A-01 `.dialog__actions .btn--ghost` 下划线补丁 | style.css | 5 min |
| P0 | A-02/A-04 自动吃上条补丁验证 | （只需截图） | 10 min |
| P0 | 补 openDialog 的 actions sort 守卫（未偏离但需固化） | app.js | 10 min |
| P1 | A-06 quiz load_error 按钮降级 outline | app.js | 2 min |
| P1 | A-03 统一 discard 文案（需 content） | lang json | 10 min |
| P1 | A-02.1 ExitConfirm 破坏性升级 danger（需产品确认） | lang json + app.js | 10 min |
| P2 | A-07 card-detail__close 迁移到 btn--icon--elevated | style.css + app.js | 10 min |

---

## 验证（实施后必跑）

在 Mobile 375×812 下对以下页重新截图对比：
1. `02-dialog-mid-quiz.png` — ghost 应显示下划线
2. `04-dialog-exit-confirm.png` — 同上
3. `06-result.png` — ellipsis 由 56×44 变成 44×44 圆形
4. `07-dialog-result-more.png` — ghost 应显示下划线
5. `11-dialog-replay-confirm.png` — ghost 应显示下划线

在 Desktop ≥1024 下额外截：
6. 所有 dialog 的 actions row 应按 ghost→outline→primary 从左到右排列
