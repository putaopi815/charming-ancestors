# 迷人的老祖宗 · 交互审查报告

> 审查范围：`dist/app.js`（约 1914 行）+ `dist/style.css`（约 2100 行）
> 审查日期：2026-04-18
> 审查维度：导航流程 · 答题流程 · 状态可见性 · 错误恢复 · 错题流程 · 卡册流程 · 微交互 · Hick 定律

---

## 一、流程图（关键路径文字描述）

### 主干路径

```
启动
  ├── 首访 → Home（空进度，夏朝 unlocked）
  └── 回访 → Home（已有进度，MidQuizPrompt 提示残局）

Home
  ├── 点击 unlocked/active 朝代 → /quiz/{dynId}
  ├── 点击 cleared/perfect 朝代 → 重玩确认弹窗 → /quiz/{dynId} 或取消
  ├── 点击 locked 朝代 → Toast 提示解锁条件（无跳转）
  ├── 点击「再来看一眼」→ /wrong
  ├── 点击卡册缩略区 → /card/{dynId}（已解锁）或 Toast（锁定）或 /cards（更多）
  └── Header 卡册图标 → /cards

/quiz/{dynId}
  ├── 后退按钮 → 退出确认弹窗
  │     ├── 继续答题（取消弹窗，保留进度）
  │     └── 保存进度并退出 → /home（currentSession 保留）
  └── 答题循环（10 题）
        选项点击 → 即时反馈 + CTA 按钮出现
        下一题 CTA → 下一题 / 最后一题 → 结算
        → /result/{dynId}

/result/{dynId}
  ├── 后退按钮（左上） → /home
  ├── 文化卡按钮 → /card/{dynId}
  ├── 「再来看看错题」→ /wrong（filtered by dynId? 实际跳 /wrong 全量）
  ├── 下一朝代 CTA → /quiz/{nextDyn}
  ├── 更多（...） → 弹窗（重玩 / 回首页）
  └── 最后一关完成 → 首页按钮

/wrong[/{dynId}]
  ├── 后退 → /home
  ├── 筛选器（Mobile select / Tablet+ tab） → URL 切换 /wrong/{dynId}
  └── 错题项
        Mobile/Tablet：点击 inline 展开/折叠
        Desktop：点击选中 → 右侧面板更新

/cards
  ├── 后退 → /home
  └── 点击 card tile
        ├── 已解锁 → /card/{cardId}
        └── 锁定 → Toast

/card/{cardId}（全屏浮层）
  ├── 关闭按钮 / ESC / Tablet+ 点击遮罩 → 关闭 → /cards 或 /home
  └── 卡内「回首页」链接 → /home
```

### 特殊路径：MidQuizPrompt

```
Home 渲染时检测 currentSession ≠ null
  → 100ms 延迟后弹出 MidQuizPrompt
       ├── 继续（autofocus） → /quiz/{sess.dynastyId}
       ├── 重新开始 → 清 session → /quiz/{sess.dynastyId}
       └── 丢弃进度 → 清 session → 留在 Home
```

---

## 二、问题清单

### P0（阻塞体验，建议立即修复）

---

**P0-01 退出确认弹窗：两个选项意图不清，"保留进度"的主动性没有区分**

- 位置：`openExitConfirm()` / quiz 顶栏后退按钮
- 当前行为：弹窗有两个 action——`quiz.confirm_exit.continue`（autofocus，primary）和 `quiz.confirm_exit.keep`（outline）。从 key 名推断：一个是"继续答题"、一个是"保留进度退出"。但弹窗没有第三个"放弃进度"选项——用户无法从这个弹窗直接抛弃进度、干净退出。
- 现象：点后退 → 弹窗只有两个选项，都不能丢弃进度并退回首页。用户若想放弃本次答题，只能通过 MidQuizPrompt 的"丢弃"，但 MidQuizPrompt 只在二次回 Home 时才触发。
- 原则依据：尼尔森第3条（用户控制与自由）、Norman 约束原则——用户进入死胡同，无法通过退出确认弹窗完成"我不想要这次答题记录"这一合理诉求。
- 建议：在 `openExitConfirm` 中增加第三个 ghost 按钮"放弃本次（不计分）"，onClick 清 currentSession 并 navigate('/home')。同时把 autofocus 改到"继续答题"保持不变，将"放弃"放最末位降低误触。

---

**P0-02 结果页「再来看看错题」跳转到全量 /wrong，而非本朝代筛选视图**

- 位置：`renderResult()` 中 `$('[data-wrong]').addEventListener` → `navigate('/wrong')`
- 当前行为：从结果页点击错题入口，跳转到未经筛选的 `/wrong`，用户需要再手动切换 tab 筛选当前朝代。
- 原则依据：尼尔森第6条（识别而非记忆）——用户刚完成某朝代，期望直接看该朝代错题，而非记住自己在哪个朝代后再筛选。
- 建议：`navigate('/wrong/' + dynId)` 直接带朝代参数，结果页跳转后用户无需额外操作。

---

**P0-03 卡册详情页 `renderCardDetail` 依赖 `document.referrer` 判断下层页面，来源不可靠**

- 位置：`renderCardDetail()` 第 1560 行 `var lowerHash = /\/result\//.test(referrer) ? 'result' : ...`
- 当前行为：通过 `document.referrer` 推断来源，当用户直接输入 URL 或从书签打开 `#/card/xia` 时，referrer 为空，lowerHash 回退到 'home'，但下层实际渲染 home 会造成"双重渲染"（先 renderHome 再 renderCards 再 append backdrop）。
- 更深层问题：`renderCardDetail` 先调用 `renderHome(app)` 或 `renderCards(app)` 渲染下层，再 `document.body.appendChild(backdrop)` 追加浮层。如果中间发生状态变化，下层和浮层可能不同步，甚至出现 aria-hidden 残留（`app.setAttribute('aria-hidden','true')` 但 closeDetail 里 navigate 后 #app 已被重绘）。
- 原则依据：Norman 容错设计——非正常入口路径导致界面破损。
- 建议：router 层维护一个 `prevRoute` 变量（上一个路由），`renderCardDetail` 直接读 prevRoute 决定下层而非依赖 referrer。或简化方案：卡片详情永远以 `/cards` 为下层（hash 路由语义上 `/card/:id` 和 `/cards` 是兄弟关系，不依赖来源上下文）。

---

### P1（明显影响体验，建议本版本修复）

---

**P1-01 首页 MidQuizPrompt 每次回 Home 都弹，100ms 延迟不足以让用户先看清页面**

- 位置：`renderHome()` 末尾 `setTimeout(maybePromptMidQuiz, 100)`
- 当前行为：只要 currentSession 存在，回到首页 100ms 后立即弹窗，用户连 Home 内容都没看清楚就被打断。sessionStorage 的 `skipMidQuizOnce` 只跳过一次，下次再回首页又弹。
- 原则依据：尼尔森第8条（美学与极简）——干扰性弹窗；情感化设计行为层——操作摩擦高。
- 建议：延迟改为 600ms（让 Home 动画先完成），或仅在用户停留首页超过 3 秒后弹出（idle 检测），避免路由跳回时的立即打断。同时限制同一 session 内只弹一次（sessionStorage 记录"已提示"而非"跳过一次"）。

---

**P1-02 答题页 CTA 按钮（下一题/结算）仅靠 setTimeout 400ms 聚焦，屏幕阅读器体验断裂**

- 位置：`renderQuizCta()` 末尾 `setTimeout(function(){ btn.focus(); }, 400)`
- 问题：选完选项后，反馈区用 `aria-live="polite"` 播报，CTA 通过 setTimeout 聚焦，但两个区域的播报顺序和用户焦点跳转时机都不确定，键盘用户不知道该 Tab 到哪里。
- 原则依据：WCAG 2.1 AA 2.4.3（焦点顺序）——操作性弱。
- 建议：`renderFeedback` 先执行，确保 DOM 插入；再在 `renderQuizCta` 的 CTA 按钮追加时通过 `requestAnimationFrame` 而非 `setTimeout` 聚焦，保证在 paint 之后稳定聚焦到 CTA 按钮。

---

**P1-03 进度点（progress dots）在 10 题时 Mobile 端可能挤出可视区**

- 位置：`renderQuizHeader()` 的 `.progress-dots` / `style.css` 第 1310 行
- 当前行为：10 个 dot，每个 10px + gap 6px，共约 154px。`.quiz-header__progress` 用 `margin-inline-start: auto` 推到右侧。当朝代名较长（如英文"Three Kingdoms"）时，左侧朝代名 + 进度点总宽可能超出 header，进度点被截断。
- 补充：`.quiz-header__progress-label`（"3/10"文字）在 Mobile 隐藏，只有 dots——dots 截断后用户在 Mobile 上完全看不出进度数字。
- 原则依据：尼尔森第1条（系统状态可见性）——进度信息不可见。
- 建议：Mobile 上进度区改为只展示 `N/10` 纯文字标签（复用 `.quiz-body__progress-label` 的设计），dots 改为 Tablet+ 专属。或给 `.quiz-header__progress` 加 `min-inline-size: 0; overflow: hidden`，退化为文字。

---

**P1-04 答题结束后 CTA"结算"按钮文案语义模糊**

- 位置：`renderQuizCta()` `t('quiz.cta.settle')` / i18n key
- 问题："结算"是财务/电商语言，不符合"历史问答游戏"的语境。用户不清楚点击后会发生什么（跳转到结果页还是弹窗）。
- 原则依据：尼尔森第2条（系统与现实匹配），Luke Wroblewski 主操作突出。
- 建议：改为"查看结果"或"完成 · 查看分数"，明确告知点击后进入结果页。

---

**P1-05 结果页 result-ctas-sticky 在 Mobile 遮挡下方错题入口**

- 位置：`style.css` 第 2026 行 `.result-ctas-sticky`（position: fixed，bottom: 0）
- 当前行为：CTA 固定在底部，但 `.result-wrong-entry` 在 CTA 区域上方的流式布局中，且 `.result-main` 有 `padding-block-end: 120px`——理论上内容底部留空。但在实际小屏（375px，内容多时），错题按钮和卡片信息可能被 sticky bar 部分遮挡，用户需要滚动才能看到错题入口。
- 原则依据：Fitts 定律——错题入口是中频操作，被遮挡需要额外滚动；尼尔森第1条（状态可见性）。
- 建议：将 120px padding 改为动态 `calc(120px + env(safe-area-inset-bottom, 0px))`（已有部分做法但 `.result-main` 层未统一），或在 CTA bar 下方的滚动区加明确的视觉提示（「向上滑动查看错题」arrow 微动效）。

---

**P1-06 卡册详情页 Mobile 无法通过「点击遮罩」关闭，但没有任何提示**

- 位置：`renderCardDetail()` 第 1641 行 `if (e.target === backdrop && window.innerWidth >= 768)`
- 当前行为：Desktop 点遮罩可关闭，Mobile 不可以。这是有意的设计决策（Mobile 全屏浮层语义），但 Mobile 用户可能尝试点黑色区域关闭，发现无效，不知道还有关闭按钮。
- 原则依据：尼尔森第4条（一致性与标准）——iOS/Android sheet 模式通常支持下滑/点遮罩关闭；Norman 可供性。
- 建议：至少确保关闭按钮在 Mobile 上的位置足够显眼（当前在 `card-detail__topbar` 左上，可加文字标签"关闭"）；或支持 Mobile 下滑手势关闭（touch Y 偏移 > 80px 触发）。

---

**P1-07 Home 首页 Hick 定律：10 个朝代同时展示，无任何引导聚焦机制**

- 位置：`renderHome()` dynasty-grid
- 当前行为：10 个朝代同时全量渲染，除了首访时的欢迎文案外，没有任何"从哪开始"的视觉引导；locked 朝代和 unlocked 朝代外观差异（颜色/图标）存在但不够强烈，新用户容易扫视焦虑。
- 原则依据：Hick 定律——选项越多决策时间越长；Gestalt 近似性——缺少分组区隔锁定 vs 解锁区域。
- 建议：方案 A：首访时对唯一 unlocked 的"夏"朝卡片添加 pulse 光圈动效（CSS keyframe，类似 `--active` 的 breathe），强制视觉焦点。方案 B：在 locked 组和 unlocked 组之间加分隔标签（"已解锁 · 可答题"/"待解锁"），利用 Gestalt 接近性分组降低认知扫描成本。方案 B 对代码改动小。

---

**P1-08 wrong-item 展开的内容（`aria-hidden="true"`）对屏幕阅读器不可见**

- 位置：`renderWrongItem()` 第 1821 行 `<span class="wrong-item__detail" aria-hidden="true">`
- 当前行为：错题展开内容被 `aria-hidden="true"` 永久标记，展开状态时 aria-hidden 没有被移除。屏幕阅读器用户点击展开后，仍然无法听到"你的答案 / 正确答案 / 解析"。
- 原则依据：WCAG 2.1 AA 可感知原则，可操作原则——aria 状态未与可见性同步。
- 建议：展开时移除 `aria-hidden`，折叠时添加回；或改用 `hidden` attribute 控制可见性（CSS `[hidden]{ display:none }` 对 SR 自然不可见）。JS 端 click 事件里同步切换 `aria-hidden` 属性。

---

### P2（体验优化，可在下一个迭代处理）

---

**P2-01 答题页选项点击后没有滚动到反馈区域**

- 位置：`renderFeedback()` / `renderQuizCta()`
- 问题：Mobile 上选项可能位于屏幕中部，点击后反馈区（`.quiz-feedback`）和 CTA bar 在视口下方，不会自动滚动。用户可能不知道已产生反馈，需要手动下滑。
- 建议：`renderFeedback` 后追加 `feedbackSlot.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`，将反馈区滚入可视范围。

---

**P2-02 Cards 预览区（首页下方）locked card 的"?"标签和 landmark 图标信息量重复**

- 位置：`renderCardThumb()` / `style.css` card-thumb
- 问题：locked 状态同时显示 lock icon + "?" label，信息冗余；unlocked 状态显示 landmark icon + "朝·类" label，图标和 label 同样重复。Gestalt 原则要求信息精简。
- 建议：locked 只保留 lock icon，去掉"?"；unlocked 只保留文字 label，去掉 landmark icon（或改为有朝代象征的颜色/简字）。

---

**P2-03 结果页"更多"按钮（`...`）的 ghost 样式优先级低，在 sticky bar 中与主 CTA 对比不足**

- 位置：`.result-ctas-sticky .btn--ghost`（`flex: 0 0 56px; padding: 14px`）
- 问题：用户很难意识到 `...` 是一个操作按钮，特别是在 dark 模式下 ghost 几乎不可见。用户可能错失"重玩"功能。
- 建议：`...` 改为 `btn--outline`（有 border），或改为图标+文字"更多选项"，增加可识别性。

---

**P2-04 切换语言后 quiz-header 的进度文字未 live 重播**

- 位置：`setLang()` → `render()` 重绘整个页面。但 quiz 页切语言后，整个页面重渲染，当前答题进度（quizRT）会被复位为初始状态（因为 `renderQuiz` 重新调用 `getQuizSession` 重置了 quizRT.current = null，题目重置到当前 session 的 currentQuestionIdx）。
- 实际影响：如果用户在第 5 题切语言，页面重渲染，第 5 题重新加载（选项 state 被清空），用户答过但未记录的题目状态丢失。
- 建议：quiz 页面内不允许切换语言（或在切换前弹确认弹窗"切换语言将重置当前题目，确认吗？"）；也可在 `renderCurrentQuestion` 里从 `quizRT.session.answers` 还原已选答案状态。

---

**P2-05 卡册页（/cards）空状态使用了 emoji 📖，不符合跨平台一致性规范**

- 位置：`renderCards()` 第 1417 行 `<div class="empty-illust" aria-hidden="true">📖</div>`
- 问题：emoji 渲染在不同 OS 字体下外观差异大，与整体"宣纸水墨"调性不符；且有 ASSET_MISSING 注释，说明后续要替换为 SVG 插画。
- 建议：改用 `iconSvg('layers')` 或 `iconSvg('landmark')` 作为临时占位，与其他空状态的图标风格保持一致。

---

**P2-06 /wrong 筛选器 Mobile select 和 Tablet+ tabs 同时渲染，CSS 控制显隐时 ARIA 双重存在**

- 位置：`renderWrong()` 第 1692 行 & 第 1701 行（select + tablist 同时写入 DOM）
- 问题：select（`role` 默认 listbox）和 tablist 同时存在 DOM，屏幕阅读器会播报两套控件。`aria-label` 相同，可能引起混淆。
- 建议：根据当前视口只渲染一个控件（JS 判断 `window.innerWidth >= 768`），或给 select 和 tabs 分别加 `aria-hidden="true"` 与对方互斥。

---

**P2-07 `isPartial` 条件逻辑错误：`score === 0` 才算 partial，1~9 分全部归入 cleared banner**

- 位置：`renderResult()` 第 1305 行 `var isPartial = score === 0`
- 当前行为：1/10 和 9/10 都显示同样的 `result-banner--cleared` banner，只有全错（0/10）才触发 `cleared_partial`。这与一般游戏设计中"及格线"语义不符（通常 <60% 为 partial）。
- 原则依据：系统状态可见性、情感化设计——成绩反映不够细粒度，1 分和 9 分给到同样的情感反馈不合适。
- 建议：调整为 `score < 6`（60%以下）显示 partial，`score >= 6` 且 `score < total` 显示 cleared，`score === total` 显示 perfect。或至少拆出 `score < 3` 的鼓励文案。

---

## 三、正向确认（做得好的交互决策）

**[+] MidQuizPrompt 三选项设计完整**
续答 / 重新开始 / 丢弃，覆盖了中断场景的三种用户意图，autofocus 指向最安全的"继续"选项，符合"错误预防 + 用户控制"原则。

**[+] 退出确认弹窗用 `alertdialog` role，正确阻止 backdrop 点击关闭**
quiz 退出确认弹窗使用 `role='alertdialog'`，点击背景不会意外退出；ESC 也不会关闭（因为 alertdialog 的 Dismiss 被绑定但不会导致退出），这一细节做到了防误操作。

**[+] 答题选项点击后即时 disable + 反馈，无提交步骤**
单选后立即展示正确/错误反馈，无需二次确认"提交"，符合效率原则和游戏化快速迭代节奏。

**[+] 进度点 + body 内文字双重进度表达**
quiz 顶栏有 progress dots（视觉），body 内有 `N/10` 文字标签（Mobile），Desktop 用 label + dots 双重保障，尼尔森第1条（状态可见性）落实充分。

**[+] 答题反馈区 fade-in 动效 + aria-live="polite"**
`quiz-feedback` 用 CSS `feedback-fade-in` 动效，同时保留 `aria-live="polite"` 给屏幕阅读器，视觉与无障碍并行落实。

**[+] 朝代卡片五态颜色体系清晰**
locked / unlocked / active / cleared / perfect 五态用背景色 + 图标 + badge 三层语言区分，颜色梯度从灰到金到红，语义一致性高。

**[+] locked 朝代 Toast 提示包含解锁条件**
点击 locked 时 Toast 显示"先完成{prevDynasty}才能解锁"，而非笼统"已锁定"，符合尼尔森第9条（帮助识别错误原因）。

**[+] 焦点陷阱在弹窗和卡册详情中均有实现**
`openDialog` 和 `renderCardDetail` 都实现了 Tab/Shift+Tab 焦点循环，符合 WCAG 2.1 2.4.3；`Escape` 关闭也正确绑定。

**[+] prefers-reduced-motion 全覆盖**
动效 token 在 `@media (prefers-reduced-motion: reduce)` 下全部缩短至 80ms，`breathe`/`perfect-glow-pulse`/`badge-breathe` 均有对应取消规则，无障碍动效降级完整。

**[+] 卡册详情浮层 aria-hidden 处理**
`renderCardDetail` 打开时给 `#app` 加 `aria-hidden="true"`，关闭时移除，对辅助技术屏蔽下层内容，SR 焦点管理正确。

**[+] Hash 路由遇到锁定/不存在朝代时的优雅 fallback**
`renderQuiz` 对 dynasty 不存在、dynasty locked、quiz 数据缺失均有独立处理分支，不会白屏——要么 Toast+跳首页，要么渲染友好错误页，符合"优雅降级"原则。

---

## 四、可用性自检清单（6 大专项快速核对）

### 尼尔森十大
| # | 原则 | 状态 | 备注 |
|---|------|------|------|
| 1 | 系统状态可见性 | 部分通过 | P1-03 进度点溢出、P1-05 CTA 遮挡 |
| 2 | 系统与现实匹配 | 部分通过 | P1-04"结算"文案语义 |
| 3 | 用户控制与自由 | 未通过 | **P0-01** 退出弹窗无放弃选项 |
| 4 | 一致性与标准 | 部分通过 | P1-06 遮罩关闭 Mobile/Desktop 不一致 |
| 5 | 错误预防 | 通过 | 重玩/退出均有确认弹窗 |
| 6 | 识别而非记忆 | 未通过 | **P0-02** 错题跳转不带朝代上下文 |
| 7 | 灵活性与效率 | 通过 | 新手有引导 toast，回访有 MidQuizPrompt |
| 8 | 美学与极简 | 部分通过 | P1-01 MidQuizPrompt 打断时机过早 |
| 9 | 错误识别与恢复 | 通过 | locked toast 包含解锁条件 |
| 10 | 帮助与文档 | 通过 | 错误页有返回 CTA |

### 无障碍（WCAG AA）
| 检查项 | 状态 | 备注 |
|--------|------|------|
| 焦点陷阱 | 通过 | 弹窗 + 卡详情均实现 |
| aria-live | 通过 | feedback slot、welcome 区均标注 |
| wrong-item 展开 aria-hidden | **未通过** | P1-08 |
| 键盘导航（quiz filter tabs） | 通过 | Arrow/Home/End 均实现 |
| 触控目标 ≥ 48px | 通过 | tool-btn/back-btn 用 ::before 扩展 |
| prefers-reduced-motion | 通过 | 全覆盖 |
| 色彩对比（light mode badge） | 通过 | 已有 :root:not([data-theme="dark"]) 修正 |

### 表单
| 检查项 | 状态 | 备注 |
|--------|------|------|
| native select on Mobile | 通过 | wrong 筛选器正确使用 select |
| tablist ARIA | 通过 | APG pattern 键盘导航完整 |
| 双重 select+tablist | **待改进** | P2-06 |

### 响应式
| 检查项 | 状态 | 备注 |
|--------|------|------|
| Mobile 单列 / Tablet 2列 / Desktop 5列 | 通过 | dynasty-grid 正确 |
| Sticky CTA safe-area | 通过 | env(safe-area-inset-bottom) 已引用 |
| 320px reflow 保护 | 通过 | max-width:374px 规则存在 |
| 进度点 Mobile 溢出 | **待改进** | P1-03 |

### 多语言
| 检查项 | 状态 | 备注 |
|--------|------|------|
| i18n 参数化模板 | 通过 | {dynasty}/{count} 参数替换 |
| ICU 复数 | 通过 | pluralCategory 已实现 |
| 切语言 quiz 状态 | **待改进** | P2-04 |
| 容器弹性宽度 | 通过 | overflow-wrap: break-word 普遍使用 |

---

## 五、P0/P1 优先级汇总

| ID | 优先级 | 位置 | 问题 | 建议方案 |
|----|--------|------|------|---------|
| P0-01 | P0 | `openExitConfirm` | 退出弹窗无"放弃进度"选项，用户陷入死胡同 | 增加第三个 ghost 按钮"放弃本次" |
| P0-02 | P0 | `renderResult` wrong CTA | 错题跳 /wrong 全量，丢失朝代上下文 | 改为 `navigate('/wrong/' + dynId)` |
| P0-03 | P0 | `renderCardDetail` | 依赖 document.referrer 判断下层，来源不可靠 | 维护 prevRoute 变量或固定下层为 /cards |
| P1-01 | P1 | `renderHome` MidQuizPrompt | 100ms 即弹，打断首屏渲染 | 延迟至 600ms 或 idle 3s 触发 |
| P1-02 | P1 | `renderQuizCta` | CTA 聚焦用 setTimeout 400ms，SR 体验断裂 | 改用 requestAnimationFrame |
| P1-03 | P1 | `renderQuizHeader` | 10个 dot 在 Mobile 可能溢出，英文朝代名更严重 | Mobile 改为 N/10 文字标签 |
| P1-04 | P1 | `quiz.cta.settle` | "结算"文案语义不符游戏语境 | 改为"查看结果" |
| P1-05 | P1 | `.result-ctas-sticky` | sticky bar 遮挡 Mobile 错题入口 | 检查 120px padding 在全机型生效 |
| P1-06 | P1 | `renderCardDetail` backdrop | Mobile 点遮罩无效且无提示 | 增加关闭按钮文字标签或支持下滑关闭 |
| P1-07 | P1 | `renderHome` dynasty-grid | 10 个朝代同时展示，无引导焦点机制 | 首访对唯一可答朝代加 pulse 光圈，或加分组标签 |
| P1-08 | P1 | `renderWrongItem` | wrong-item 展开内容 aria-hidden="true" 永久，SR 不可见 | 展开时移除 aria-hidden |
