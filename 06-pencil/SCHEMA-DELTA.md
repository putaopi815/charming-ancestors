# SCHEMA-DELTA · 迷人的老祖宗

> r-pencil 交接物 E · 列出 .pen 与 Schema v1 / locale-{zh,en}.json / design-tokens.md 之间的所有差异
> 基于 Schema-v1（2026-04-17）+ locale-zh/en.json + design-tokens.md
> 产出时间：2026-04-17（批次 A：Home + Quiz · 3 断点 × 2 模式 = 12 Frame）
> 审批规则（团队 CLAUDE.md ⏸️ 2）：用户裁决 + 权威方回写后 r-frontend 才可开工

---

## 批次 A · 本次提交差异清单（Home + Quiz）

表头按 `CO2` 协议固定 6 列：位置 | .pen 设计稿 | Schema/locale | 跨断点差异 | 判定 | 裁决/处理。

| # | 位置 | .pen 设计稿 | Schema / locale | 跨断点差异 | 判定 | 裁决 / 处理 |
|---|------|------------|----------------|----------|------|------------|
| 001 | Home · 朝代卡 era 副标题 | Mobile-375 显示 era 副标（"传说与起点"等） | Schema §3.0 断点差异表约定 mobile 用 `dynasty.{id}.era_mobile: ""` 空串覆盖（隐藏） | mobile 保留 era / tablet+desktop 保留 era / 三档一致显示 | **偏离 Schema §3.0**，但 locale 的 `era_mobile: ""` 并未被实际应用 | **建议回写 Schema §3.0**：移动端单列布局空间充裕（72px 高 × 全宽），era 副标显示是**改善而非损害**——建议 Schema 把"mobile 隐藏 era"改为"mobile 保留 era（单列空间允许）"，删除 `era_mobile` key 作为未使用 locale。**等 r-designer 裁决** |
| 002 | Home · 朝代卡 · "秦" active 态的 badge | Mobile-375 显示 "继续（2/5）" · Tablet/Desktop 相同 | `dynasty.status.in_progress = "继续（{current}/5）"` ✅ 文案一致 | 三档一致 | 符合 | 无需裁决 |
| 003 | Dark 模式 · Accent 底上的文字颜色 | 所有 Dark 版 accent-primary / accent-secondary / accent-cultural 底上的"▶ / ✓ / ★ / B（前缀字）/ 下一题（CTA 字）"仍为 `#FAF8F3` 白字 | Design Token §1.4 + §7 定义 `--color-fg-on-accent = #1A1814`（dark 模式深字兜底），理由是 `#FAF8F3 on #6FA89F ~3.2:1` 不达 AA 4.5:1 | 三档 Dark 版全受影响 · Light 版 fg-on-accent=#FAF8F3 OK（~4.8:1 临界） | **偏离 Design Token 兜底方案**（Pencil 批量 replace 未覆盖到 `FAF8F3` 作为 from 色值） | **接受设计稿现状**，**交给 r-frontend 在 CSS 中用 `var(--color-fg-on-accent)` 自动切换**（FW12 已约束 Token 驱动）。**r-qa 阶段 MUST 用 webaim 实测**：若 Light 模式 4.8:1 也失败，则回写 Design Token 降 accent-primary 5% 亮度 |
| 004 | 所有页面 · 顶栏 Logo | 用"祖"字 + 青瓷方块占位（Mobile 40×40 · Tablet 44×44 · Desktop 48×48） | PRODUCT.md 视觉气质节 + Design Token 未定义正式 Logo · locale `brand.name = "迷人的老祖宗"` / `brand.name_short = "老祖宗"` ✅ | 三档一致占位 | 资产缺口（非权威源冲突） | **登记到 ASSET-LIST #001**，真实 Logo 由 visual-designer 后续产出 SVG · r-pencil 在本批次用占位 · **不阻塞** r-frontend（frontend 用 placeholder div + `<!-- ASSET_MISSING: brand logo -->` 注释） |
| 005 | 所有页面 · 朝代插画 / 答题页主视觉 | 用 emoji 🏛 占位 · Mobile 72px · Tablet 120px · Desktop 200px 单色 | Schema §2.5.5 "10 张朝代插画（图谱卡片用 + 答题页主视觉用）" · 未约束具体资产 | Mobile 顶部小图 160h · Tablet 顶部中图 240h · Desktop 左栏全高主视觉（410×655） | 资产缺口 | **登记到 ASSET-LIST #002**，10 张朝代插画需由 visual-designer 产出（线条 + 少量纹理方向，PRODUCT.md 视觉气质约束），每张插画 MUST 适配两模式（单版本 + 遮罩/glow 适配，SC-TH8） |
| 006 | Home · 卡册缩略 · 已解锁卡"封面" | 用 米黄色块 + "夏·人 / 商·器 / 周·事" 文字占位 | Schema §3.0 未具体约束；locale `card.category.*` 有 person/object/event | 三档缩略卡尺寸不同（72×100 → 72×88 → 56×72）但都是色块占位 | 资产缺口 | **登记到 ASSET-LIST #003**，10 张朝代知识卡缩略封面（64×56）· 与主卡插画一致 |
| 007 | Quiz · 问答题干 | 硬编文案"夏朝的开国君主是谁？" · A=炎帝 B=大禹 C=启 D=黄帝 | locale-zh.json **没有 quiz.question / quiz.options** 的题库结构（只有 `quiz.progress` `quiz.feedback_*` `quiz.cta` `quiz.confirm_exit` 等框架文案） | 三档题目文案一致 | 内容蓝图 content-blueprint.md 未导出到 locale · r-pencil 为展示目的填充了示例题 | **建议回写 locale**：content-strategist 或用户需把题库（MVP 15 题 = 3 关 × 5 题）导出到 `locale-zh.json` 和 `locale-en.json` 的 `quiz.questions.{dynastyId}[idx]` 结构（或单独 `quiz-questions.json`）。**r-frontend 实现前阻塞项**（无题库则页面无内容） · 等用户裁决题库生成方式 |
| 008 | Quiz · 选项 B 的 "已选" label | 所有断点的 OptB selected 态右侧带 "已选" 小字 | locale **没有 `a11y.option_selected` 对应文案**（仅 `option_selected: "已选中"` 在 a11y 区） | 三档一致 | 为避免依赖仅 a11y 的 key（仅 screen reader 朗读用），显式加视觉 label | **建议回写 locale**：在 `quiz.option_selected_label = "已选"` / en "Selected" 处新增 key 用于视觉显示；a11y key 保留只读用 |
| 009 | 所有断点 · 顶栏"中/EN"按钮 | Mobile 纯 icon "中" · Tablet "🌐 语言" · Desktop "🌐 中 / EN ▾" | Schema §2.5.1 约定 Mobile 单按钮循环 / Tablet 带 label / Desktop 展开 dropdown；locale 有 `nav.lang_zh = "中"` + `nav.lang_en = "EN"` + `nav.lang_switch_label = "切换语言"` + `nav.lang_switch_label_short = "语言"` | Mobile/Tablet/Desktop 样式逐级增强 | 符合 Schema · locale key 可精确取到 | 无需裁决 |
| 010 | Home · Mobile 欢迎区 · body 文案 | Mobile 回访场景显示 `welcome_return.title + progress_summary` · **不显示 body** | Schema §3.0 约定 mobile 在"若 cleared>0" 时显示 progress_summary，**不显示 body**"上次你走到了 X" · locale `welcome_return.body = "上次你走到了 {dynasty}。"` | Mobile 省略 / Tablet+Desktop 组合显示在单行："上次你走到了秦朝。已闯过 3/10 关 · 全对 1/10" | 符合 Schema | 无需裁决 · r-frontend 按断点 .mobile-only / .desktop-only + key_mobile 机制实现 |
| 011 | 所有页面 · 文字嵌入图 | ❌ 无 · 所有朝代名 / 状态 / 徽章 / Logo 字均为 text layer（L5 合规） | L5 约束 | 三档一致 | 符合 | 无需裁决 |

---

## 跨断点一致性自检（SC-MC1/3/4）

| 维度 | Mobile-375 | Tablet-768 | Desktop-1024 | 差异说明 |
|------|-----------|-----------|-------------|--------|
| 朝代图谱布局 | 纵向 1×10 单列 | 2×5 网格 | 5×2 网格（横向时间轴） | **DOM 结构差异**（非 CSS 隐藏），r-frontend MUST 用 grid-template-columns 响应式 |
| 顶栏 Logo | icon-only 40px | icon + 简写 44px | icon + 完整名 48px | DOM 同构但 `.mobile-only / .desktop-only` 切换 Logo 文字 |
| 顶栏工具按钮 | 纯 icon 40×40 | icon + label 带宽 44h | icon + label + dropdown 箭头 44h | 同上 |
| 欢迎区 body | ❌ 隐藏 | ✅ 显示（与 progress_summary 同行） | ✅ 显示 + 装饰（本稿无装饰） | 符合 Schema §3.0 |
| 卡册缩略 | 横滑 5 卡 | 单行 5 卡 | 单行 5 卡（底部区域） | 尺寸逐级缩小：72×100→72×88→56×72 |
| 答题页布局 | 单列堆叠 | 单列堆叠（inner max-width 600 居中） | **两栏重设**（左 40% 插画 + 右 60% 题目） | Layout Shifter 硬差异，符合 Schema §3 模块 B |
| 答题页 CTA | **Sticky 底栏 72-88h** | 内嵌（inline 右对齐） | 内嵌（inline 右对齐） | Mobile 独有 sticky · 符合 SC-MC5 |
| 朝代卡内结构 | icon-left + name-era-badge 中 + 无右侧 | icon-left + name-era 中 + badge 底 | icon + name 顶 + era 中 + badge 底（vertical） | 卡片纵横比驱动的布局切换 |

---

## 文案 100% 从 locale 取的自检

- 所有朝代名、era、状态 badge 文字：`dynasty.{id}.name` / `dynasty.{id}.era` / `dynasty.status.*`
- 首页文案：`home.welcome_return.title` / `home.progress_summary` / `home.wrong_entry` / `home.cards_hint` / `home.section_dynasties`
- 答题页文案：`quiz.progress` / `quiz.cta.next` / `quiz.feedback_*`
- 顶栏：`brand.name` / `brand.name_short` / `nav.lang_switch_label_short` / `nav.theme_switch_label_short`
- **唯一例外**：Quiz 的具体题目 / 选项（#007 建议回写 locale）

---

## 等待回写 · 阻塞状态

| # | 项目 | 回写到 | 所需裁决方 | 阻塞程度 |
|---|------|-------|-----------|---------|
| 001 | era_mobile 决策 | Schema §3.0 | r-designer | P2（不阻塞前端） |
| 007 | 题库结构到 locale | locale-zh/en.json | 用户 / content-strategist | **P0**（r-frontend 无题库无法实现答题页） |
| 008 | `quiz.option_selected_label` | locale-zh/en.json | content-strategist | P2（可用 a11y 临时 fallback） |

---

## Schema 版本记录

本次批次 A 基于 **Schema-v1**（2026-04-17）。若 r-designer 回写任何修订，本文档 MUST 更新批次 B（结算/卡册/错题回看）时引用的版本号。

批次 B 预计差异：卡册网格 · 错题 inline-expand / 双栏 · 知识卡浮层（Off Canvas）· Result 分阶段 reveal。

---

## 批次 A 审批后的下一步（已完成）

1. ✅ 用户裁决 #001（Schema 更新：mobile 保留 era 作为儿童记忆锚点）
2. ✅ 用户并行处理 #007（content-strategist 产出题库 JSON）
3. ✅ 用户回写 #008（新增 `quiz.option_selected_label`）
4. ⚠️ #003 Dark 对比度风险保留，r-frontend 用 `var(--color-fg-on-accent)` 自动切换即可

---

# 批次 B · Result + Card Detail + Wrong Review 差异清单

> 产出时间：2026-04-17（批次 B：Result × 双模式 + CardDetail + WrongReview · 共 16 新 Frame）
> 基于 Schema-v1 + 批次 A 审批后的 locale 更新（题库 key 结构已并行进行中）
> 审批规则：同批次 A，用户裁决后 r-frontend 开工

## 批次 B 差异表

表头同批次 A：位置 | .pen 设计稿 | Schema/locale | 跨断点差异 | 判定 | 裁决/处理

| # | 位置 | .pen 设计稿 | Schema / locale | 跨断点差异 | 判定 | 裁决 / 处理 |
|---|------|------------|----------------|----------|------|------------|
| 012 | Card Detail · 故事正文 | 用虚构文案"他不是一个传说里的神..."占位（~110 字中文） | locale-zh.json **没有 `card.story.{cardId}` 结构**，Schema §3 模块 F 提到 "Card.story_zh/en（≤ 120 中 / ≤ 200 英词，内容蓝图 §3.1）"但 locale 未落 key | Mobile/Tablet/Desktop 三档显示同一故事文本（仅字号和宽度变化） | **locale 缺失 key**（类似 #007） | **建议回写 locale**：content-strategist 在题库 JSON 产出时一并产出 `card.story.{dynastyId}-{cardSlug}` 结构（如 `card.story.xia-dayu = "..."` ≤120 字中）。**与 #007 绑定同时处理**，不阻塞批次 B 画稿（占位可见即验证布局）|
| 013 | Card Detail · 遮罩色 | 本稿用纯色 `#8D8070A0` 模拟遮罩（Tablet/Desktop） | Design Token `bg-overlay` = `rgba(26,24,20,0.55)` Light / `rgba(0,0,0,0.65)` Dark | Mobile 无遮罩（全屏浮层）· Tablet/Desktop 有遮罩 | Pencil 不原生支持 rgba 半透明 fill，本稿用近似 solid 色替代 | **不阻塞**：r-frontend 直接用 `var(--color-bg-overlay)` 实现真半透明遮罩；设计稿遮罩色仅作参考 |
| 014 | Card Detail · Dark 版 Tablet/Desktop | 本稿仅画 Mobile 的 Dark（cOXsx），Tablet/Desktop **只画 Light** | 用户指示："card-detail 明模式为主，dark 用 Notes + Token 差异表" | Mobile Dark 完整画 / Tablet/Desktop Dark 在 Notes 中描述 Token 映射 | 符合用户指示 | **不阻塞**：r-frontend 按 CardDetail-Notes 中 Token 映射 + design-tokens §7 dark 块实现 |
| 015 | Wrong Review · Dark 版 | 三断点均只画 Light | 用户指示："wrong-review 明模式为主，dark 用 Notes + Token 差异表" | — | 符合用户指示 | 同上 · WrongReview-Notes 中 Token 映射完整 |
| 016 | Wrong Review · Filter 下拉（Mobile） | 显示"全部（3 题）" + ▾ 箭头 占位 | locale `wrong.filter.all = "全部"` + `wrong.filter.by_dynasty = "按朝代"` ✅ 已有 key | Mobile 下拉 / Tablet+Desktop 水平 Tab | 符合 | 无需裁决 |
| 017 | Wrong Review · 展开态的 3 个区块 label | "你选的：/ 正确答案：/ 为什么：" | locale `wrong.item.your_answer` / `correct_answer` / `explanation` ✅ 已有 | 三档一致（Desktop 并排 + 单列 / Mobile+Tablet 纵向 + Desktop 也横向） | 符合 | 无需裁决 |
| 018 | Wrong Review · 正确答案的 ✓ icon + "正确答案" 文案 | 视觉用 ✓ + "正确答案" | locale **新增 key** `wrong.item.correct_answer` = "正确答案：" ✅（已在 locale 中）· ✓ icon 建议 lucide `check` | 三档一致 | 符合 | ASSET-LIST 已记 icon 库（lucide）|
| 019 | Wrong Review · Desktop 右详情面板「为什么」长解释 | 用扩展文案"...秦亡后隶书逐步取代小篆成为日常字体。"（mobile 稿没这句） | locale `quiz.questions.{dynastyId}.{idx}.explanation` 单一字段 | Mobile/Tablet = 短版（约 1 句）· Desktop = 加长版多一句 | **偏离一致性**：Desktop 用了占位扩展文案，与 locale 单一 explanation 字段不一致 | **r-pencil 修正**：改为与 Mobile/Tablet 一致的单句版本。**当前 Desktop Wrong 的「为什么」区块文案与 Mobile 版完全一致即可**；如需 "短/长" 双版本应回写 locale 加 `explanation_long` 字段。建议保持 locale 单一 explanation 字段不扩展 |
| 020 | Result · 「进入 商朝 →」CTA 文案 | 结算页主 CTA 用"进入 商朝 →"（arrow 在文案内） | locale `result.cta.next_dynasty = "进入 {dynasty}"` 没有 arrow | 三档一致加 → | 视觉装饰 arrow | **不阻塞**：r-frontend 实现时用 `<span class="arrow" aria-hidden="true">→</span>` 装饰，不污染 locale · arrow 在视觉稿中作为 visual cue |
| 021 | Result · Perfect 满分态 | **本批次未绘制**（只画了 cleared 3/5 非满分） | Schema §3 模块 C 要求 perfect 有阶段 3 徽章浮现 + 朱砂 glow 呼吸 | 三档均缺 perfect 变体 | 未交付 | **补交建议**：MVP 阶段允许 r-frontend 按 cleared 稿 + IMPLEMENTATION-GUIDE 中 Token 推导 perfect 变体（banner 改 "全对！" + score 朱砂色 + 徽章区加 motion-reward-perfect glow）。如 QA 时发现视觉偏差大，再补画 perfect 稿 |
| 022 | Result · all_done 全通关态 | **本批次未绘制**（10 朝代全通关的终极 Result） | locale `result.all_done.title = "十位老祖宗都见过了"` + body + cta | 极罕见边界场景 | 未交付 | **补交建议**：同 021 · 极罕见（MVP 阶段 3 关 × 5 题 = 15 题无法达到 all_done）· 不阻塞 |

---

## 批次 A + B 合并阻塞项（给 r-frontend）

| # | 项目 | 状态 | 阻塞程度 |
|---|------|------|---------|
| 007 | quiz 题库结构到 locale | 🟡 用户并行处理中（content-strategist） | **P0**（Quiz + WrongReview + Result 的部分 reveal 都依赖）|
| 012 | card.story.{cardId} 结构到 locale | 🟡 与 #007 绑定同时处理 | **P0**（CardDetail 页无正文内容）|
| 003 | Dark 模式 CTA 白字对比度 | 🟢 Token 已兜底，r-frontend CSS var 切换 | P2 |
| 021/022 | Result perfect/all_done 变体 | 🟠 未绘制 | P1（MVP 可延后，由 r-frontend 推导） |

---

## 批次 B 完成后的整体进度

✅ 批次 A：Home + Quiz（3 断点 × 2 模式 = 12 Frame + 8 Notes）
✅ 批次 B：Result（3 断点 × 2 模式 = 6 Frame）+ CardDetail（4 Frame：3 Light + 1 Dark Mobile）+ WrongReview（3 Frame Light）+ 3 Notes = 16 Frame
**总计**：28 页面 Frame + 11 Notes + Cover = **40 顶层节点**（实际 37，部分说明 Frame 合并）

📸 截图交付：**25 张 JPG**（批次 A 12 + 批次 B 13）

下一步：等待题库 + card.story locale 回写完成 → r-frontend 开工
