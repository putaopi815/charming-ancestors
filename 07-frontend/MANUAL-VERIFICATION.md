# MANUAL-VERIFICATION · 迷人的老祖宗 r-frontend 人工验收清单

> r-frontend agent 自动化 cover 不了的验收项（真机 / 屏幕阅读器 / Lighthouse / 键盘 / 系统偏好 / 网络 / localStorage 边界 / 字体回退）
> 交付对象：用户 · r-qa · 测试工程师
> 产出时间：2026-04-17（Phase 3 收尾）
> 项目路径：`/Users/fancyliu/Claude/projects/charming-ancestors/07-frontend/dist/`

---

## 使用说明

- **所有项必须勾选才能判定"可上线"**。任一未通过项 MUST 回记到 r-frontend 或 r-qa 修复。
- **测试环境准备**：
  - 本地 http server：`cd 07-frontend/dist && python3 -m http.server 8765`
  - 或直接浏览器打开 `07-frontend/dist/index.html`（`file://` 兼容）
  - Chrome DevTools: `⌘+⌥+I`（Mac）/ `F12`（Win）
- **记录格式**：`[ ]` 未测 · `[x]` 通过 · `[!]` 失败（填失败描述）· `[~]` 部分通过

---

## A. 真机测试（跨平台 / 跨设备）

### A.1 iOS Safari

| 设备 | 通过路径 | 需重点看 |
|------|---------|---------|
| [ ] iPhone 12 及以上 Safari | Home → 点夏朝 → 完成 5 题 → Result → 点卡片 → 看故事 → 关闭 → 回 Home → Cards 页查看解锁卡 → 回答错题 → 查看错题 | safe-area（刘海）· 底部 sticky CTA 是否被 home indicator 遮挡 · 键盘弹出后布局 |
| [ ] iPhone SE（4.7" · 小屏）| 同上 + 320px 布局边界 | 小屏无水平滚动 · 触摸目标 ≥44px 不挤 |
| [ ] iPad（Safari）| 同上 + Tablet 断点（768-1023）+ CardDetail Modal 形态 | Modal 560×720 是否居中 · backdrop 点击关闭是否工作 |

### A.2 Android Chrome

| 设备 | 通过路径 | 需重点看 |
|------|---------|---------|
| [ ] 中端机（比如红米 / 一加中端）| 全路径（Home → Quiz → Result → CardDetail → Cards → Wrong）| 字体回退（无 Noto Serif SC 时用 system fallback）· 触摸响应 < 100ms |
| [ ] 低端机（如果可访问）| 首屏 + 核心答题路径 | 渲染流畅度 · 动画降级 |

### A.3 桌面浏览器

| 浏览器 | 操作系统 | 通过路径 |
|--------|---------|---------|
| [ ] Chrome 最新 | macOS | 全路径 + DevTools Device Mode 4 断点 |
| [ ] Firefox 最新 | macOS | 同上 · 重点看 `:lang(zh)` / `inset-block-start` / `inline-size` 逻辑属性是否全支持 |
| [ ] Safari 最新 | macOS | 同上 · 重点看 `safe-area-inset-*` + `env()` + 逻辑属性 |
| [ ] Edge 最新 | Windows | 同上 · 重点看 Source Han Serif 回退 |

---

## B. 屏幕阅读器测试（a11y 核心）

### B.1 VoiceOver（Mac + iOS）

**启用**：Mac = `⌘ + F5`；iOS = 设置 → 辅助功能 → VoiceOver。

每个核心页面扫读 3 分钟，记录是否能听懂每个区块的语义：

| 页面 | 扫读清单 | 通过 |
|------|---------|------|
| [ ] Home（首次来）| 欢迎首次 title / body / CTA / 十个朝代 H2 / 10 张朝代卡（locked/unlocked）/ 卡册入口 | |
| [ ] Home（回访）| 欢迎回来 + 进度 / 错题入口 / 朝代卡 active 态 / 卡册预览 | |
| [ ] Quiz | 顶栏朝代名 + 进度（aria-live）/ 题干 / 4 选项（A/B/C/D）/ 选中 label 朗读 / CTA 禁用态语义 / 答对反馈 + explanation | |
| [ ] Result | banner "闯关成功" 朗读 / score / 卡片解锁 label / 继续 CTA | |
| [ ] Cards | title / progress / 每张卡（unlocked 朗读卡名 + 分类 + 来自 XX · locked 朗读"还没解锁"+ "通关 XX 解锁"）| |
| [ ] CardDetail | dialog 角色宣告 / H1 卡名 / 故事全文 / 关闭按钮 / Escape 关闭 | |
| [ ] Wrong | title / filter tabs / 每条错题（朝代 + "第 N 题" + 题干）/ 展开后"你选的 / 正确答案 / 为什么" 分块朗读 | |

### B.2 NVDA（Windows）

**下载**：https://www.nvaccess.org/download/

| 页面 | 扫读清单 | 通过 |
|------|---------|------|
| [ ] 核心 5 页（Home / Quiz / Result / Cards / Wrong）| 与 VoiceOver 相同检查项 | |
| [ ] 重点差异 | 中文朗读（NVDA 中文包）· 英文切换后 en 能正确朗读 | |

---

## C. Lighthouse 评分

### 配置
- Chrome DevTools → Lighthouse tab
- Mode: **Navigation**
- Device: 分别测 **Mobile（375）** 和 **Desktop（1440）**
- Categories: **Performance + Accessibility + Best Practices + SEO**
- Language: 分别测 **zh** 和 **en**

### 目标分数

| 路径 | 断点 | 语言 | Perf | A11y | Best | SEO |
|------|------|------|------|------|------|-----|
| [ ] `/#/home` | Mobile | zh | ≥90 | =100 | ≥95 | ≥90 |
| [ ] `/#/home` | Mobile | en | ≥90 | =100 | ≥95 | ≥90 |
| [ ] `/#/home` | Desktop | zh | ≥95 | =100 | ≥95 | ≥90 |
| [ ] `/#/quiz/xia` | Mobile | zh | ≥90 | =100 | ≥95 | ≥85 |
| [ ] `/#/result/xia`（手工造 perfect 数据后访问）| Mobile | zh | ≥90 | =100 | ≥95 | ≥85 |
| [ ] `/#/cards` | Desktop | zh | ≥90 | =100 | ≥95 | ≥85 |
| [ ] `/#/wrong`（有错题数据）| Desktop | zh | ≥90 | =100 | ≥95 | ≥85 |

### 已完成（Chrome DevTools MCP 自动化 · 2026-04-17）

| 路径 | 断点 | Mode | A11y | Best | SEO | Failed |
|------|------|------|------|------|-----|--------|
| `/#/home`（base URL）| Mobile | navigation | **100** | 100 | 100 | **0** ✅ |
| `/#/home`（base URL）| Desktop | navigation | **100** | 100 | 100 | **0** ✅ |
| `/#/wrong`（snapshot）| Desktop | snapshot | **100** | — | — | **0** ✅ |
| `/#/wrong`（snapshot）| Mobile | snapshot | **100** | — | — | **0** ✅ |
| Quiz DOM | — | evaluate_script 核验 | progressbar aria-label ✅ · li role=presentation ✅ · prefix aria-hidden ✅ | — | — | — |

### 重点关注

- **CLS < 0.05**：字体加载 swap 无跳动（Noto Serif SC / Inter）· ASSET_MISSING 占位有明确高度预留
- **LCP < 2.5s**：Home 页首屏朝代卡
- **FID / INP < 200ms**：所有点击响应
- **A11y 100**：所有 aria / landmark / heading 层级 / 对比度 / 触摸目标（修完 FIX-P3-05 后）

---

## D. 键盘导航（全键盘走完 = 可上线）

**要求**：不用鼠标 / 触摸，全部键盘走通。

| 路径 | 通过 |
|------|------|
| [ ] Skip Link：Tab 后首个焦点是 Skip Link，Enter 后跳到 `#main-content` | |
| [ ] Home：Tab 顺序 = 视觉顺序（logo → lang → theme → cards → 欢迎区 CTA → 朝代卡 10 张 → 错题入口 → 卡册预览），Enter 触发每项 | |
| [ ] Quiz：Tab 到 4 选项 → 空格 / Enter 选中 → Tab 到 CTA → Enter 提交 | |
| [ ] Quiz 退出确认：ExitConfirm 开启后 Tab 循环在 3 按钮内（焦点陷阱），Escape 关闭 | |
| [ ] Result：Tab 到卡片 → Enter 打开 CardDetail | |
| [ ] CardDetail：Escape 关闭 · Tab 在 modal 内循环（✅ **FIX-P3-03 2026-04-17 已修**：onKey Tab / Shift+Tab 在 `[data-card-sheet]` focusables 内循环，下层 `#app` 设 aria-hidden 双重防漂出）| |
| [ ] Cards：Tab 10 卡顺序 · locked 卡 Enter 触发 toast · unlocked 卡 Enter 打开 CardDetail | |
| [ ] Wrong：Tab 到 filter（Mobile select 可用空格打开 / Desktop tabs 逐个 Tab）· ArrowLeft/Right 切 tab（✅ **FIX-P3-06 2026-04-17 已修**：keydown ArrowLeft/Right/Home/End 循环切 tab + focus + navigate）· Tab 到列表项 Enter 展开 | |
| [ ] 所有可聚焦元素有 `:focus-visible` 可见指示器（绿色 outline + offset 2px） | |

---

## E. prefers-reduced-motion 降级

**启用方式**：
- macOS：系统偏好 → 辅助功能 → 显示 → 减弱动态效果
- iOS：设置 → 辅助功能 → 动态效果 → 减弱动态效果
- Chrome DevTools：⋮ → More tools → Rendering → Emulate CSS media feature prefers-reduced-motion = `reduce`

| 路径 | 验证项 | 通过 |
|------|-------|------|
| [ ] Home Active 朝代卡 | 呼吸 ring 动画停止（`.level-active` 无 scale/shadow 呼吸）| |
| [ ] Home 朝代卡 hover | translateY(-2px) 降级为静态（无过渡）| |
| [ ] Quiz 答对反馈 | scale 弹跳动画降级为静态（瞬时显示）| |
| [ ] Result Stage 1→2→3 reveal | 分阶段入场动画降级（四阶段瞬时全显）| |
| [ ] Result Perfect 态 badge | `badge-breathe` 2.4s 循环（入场 800ms pop + 1600ms 延迟后开始呼吸）· ✅ **FIX-P3-02 2026-04-17 已补** · prefers-reduced-motion 降级为静态 glow | |
| [ ] Cards 页 Perfect 卡 tile | `card-tile-perfect-breathe` 2.8s 循环 · ✅ FIX-P3-02 新增 · 降级静态 | |
| [ ] CardDetail Perfect 浮层 | `card-detail-perfect-breathe` 2.8s 循环（延迟 400ms）· ✅ FIX-P3-02 新增 · 降级静态 | |
| [ ] CardDetail slide-up | 入场动画降级为瞬时显示（`@media (prefers-reduced-motion: reduce)` L2185 已实现）| |
| [ ] Modal fade-in | backdrop 瞬时显示无淡入 | |
| [ ] 所有 transition 保留（< 100ms 微交互可保留） | |

---

## F. localStorage 边界

### F.1 无痕模式（隐私窗口）

| 步骤 | 预期 | 通过 |
|------|------|------|
| [ ] 打开 Chrome 无痕窗口 | | |
| [ ] 访问本地 http://localhost:8765（或 file://path）| 页面正常显示 | |
| [ ] 完成一题 → 进入 Result | 渲染正常 | |
| [ ] 底部应出现 toast：`"隐私模式下进度不会保存"`（来自 `error.storage_unavailable` · 英文 `Progress won't save in private mode`）| toast 显示 + 无 JS 崩溃 | |
| [ ] 关闭 Tab 后重新打开 | 进度不保留（预期行为）| |

### F.2 localStorage 手动清空

| 步骤 | 预期 | 通过 |
|------|------|------|
| [ ] DevTools → Application → Local Storage → 全部删除 | | |
| [ ] 刷新页面 | Home 显示"第一次来？"首次访问态，`home.welcome_first.*` 文案生效 | |
| [ ] 之前的 unlockedCards / progress 全部归零 | Cards 页空态 · Wrong 页空态 | |

### F.3 localStorage 塞满（QuotaExceededError）

| 步骤 | 预期 | 通过 |
|------|------|------|
| [ ] DevTools Console 运行：`try { while(true) localStorage.setItem('pad-' + Math.random(), 'x'.repeat(1000000)); } catch(e) { console.log('Full!', e); }` | localStorage 塞满 | |
| [ ] 尝试答一题（触发 writeState）| 应有 toast：`"进度可能没法保存了"`（`error.storage_full` · en `"Your progress might not save"`）| toast 显示 + 不崩溃 | |
| [ ] 清理：`localStorage.clear()` | 恢复正常 | |

### F.4 多 Tab 同步

| 步骤 | 预期 | 通过 |
|------|------|------|
| [ ] Tab 1 打开应用，完成夏朝第 3 题 | Tab 1 状态正常 | |
| [ ] Tab 2 打开应用，回到 Home | Tab 2 **不应**自动刷新显示 Tab 1 的进度（因为不监听 storage event）· 但进入 `/home` 时会读最新 localStorage | |
| [ ] Tab 1 完成夏朝 → Tab 2 点夏朝 | Tab 2 会走到正确的 Result（因读的是最新状态）| 无踩踏 |
| [ ] 两 Tab 同时答题（不同朝代）| 不互相覆盖 currentSession（因为 key 是 `charming-ancestors-progress-v1` 单条，后写覆盖先写）· **已知限制**，MVP 可接受 | 标注 |

---

## G. 网络协议兼容

| 协议 | 访问方式 | 预期 | 通过 |
|------|---------|------|------|
| [ ] `file://` | 直接双击 `07-frontend/dist/index.html` | 所有功能工作 · locale 从内联 JSON 读取 · 字体从 CDN 加载 | |
| [ ] `http://localhost` | `python3 -m http.server 8765` 然后访问 `http://localhost:8765` | 同上 | |
| [ ] 离线 | DevTools → Network → Offline | 首屏已加载的场景可继续走（字体可能失败回退 system）· localStorage 仍工作 | |

---

## H. 中英文切换

| 路径 | 验证项 | 通过 |
|------|-------|------|
| [ ] 初次访问时根据 `navigator.language` 自动切换（zh-CN → zh · 其他 → en）| inline script（index.html L46-48）工作 | |
| [ ] 顶栏 🌐 按钮点击循环 zh ↔ en | 点击后所有可见文本切换 | |
| [ ] 切换后 reload 保留选择 | localStorage 读取 | |
| [ ] **Quiz 答题过程中** 的语言切换 | **MUST 禁用**或至少不破坏 session（题目文本切换时 session answers 保留）| 核对：Quiz 页顶栏是否有 🌐 按钮？按照 Schema §3 模块 B，答题中不提供语言切换（Phase 2 renderHeader 'quiz' variant 只含返回 + 朝代名 + 进度点）✅ |
| [ ] 错题复习页的题目文本 | 切语言后同步切换 | 核对 |
| [ ] 卡详情故事 | 切语言后同步（`card.story.{dyn}.story` 两语都有 10 条）| |
| [ ] Skip Link 切 en | 切到英文后 Skip Link 显示 "Skip to main content"（✅ **FIX-P3-09 2026-04-17 已修**：locale 两语补 `a11y.skip_link` key + app.js 新增 `applyTranslations()` 在 `boot` + `setLang` 后调用）| |

---

## I. 明暗切换

| 路径 | 验证项 | 通过 |
|------|-------|------|
| [ ] 初次访问尊重 `prefers-color-scheme`（inline script L35-38）| 系统暗色 → 应用暗色；系统亮色 → 应用亮色 | |
| [ ] 顶栏 ☀ / ☾ / ⟳ 按钮循环 light → dark → system | 点击后所有 token 切换 | |
| [ ] system 模式下改系统偏好 | `matchMedia` 监听 · 应用跟随切换（需验证 DevTools Emulate CSS media feature prefers-color-scheme 切换）| |
| [ ] **FOUC 防护**：刷新时不闪白 | inline script 是 `<head>` 首个可执行节点（index.html L22，早于 `<link rel="stylesheet">` L56），`data-theme` 已设置再加载样式 | |
| [ ] 切换过渡时长 ≤ 200ms · 仅 color / background-color / border-color / fill / stroke 过渡（SC-TH7 / FW6）| 无布局抖动 · 不过渡 transform / width / height | |

---

## J. CJK 字体回退链

| 环境 | 预期字体（降序）| 通过 |
|------|----------------|------|
| [ ] macOS 安装 Source Han Serif SC | Source Han Serif SC 600 → 标题正常渲染 | |
| [ ] macOS 未安装 Source Han Serif | Noto Serif SC（Google Fonts CDN）→ Songti SC（系统） | |
| [ ] Windows 10+ 未装 Source Han | Noto Serif SC → SimSun → 系统默认 | 字体不缺字 |
| [ ] Android 默认 | Noto Serif CJK（系统预装）→ 正常 | |
| [ ] iOS 默认 | PingFang SC → HarmonyOS 缺失时 fallback | |
| [ ] **离线 + 系统无 CJK Web Font** | fallback 到系统中文字体 · 可读即可 | |
| [ ] body 字体 HarmonyOS Sans SC（无 Google Fonts 分发）的回退 | Source Han Sans SC (Noto Sans SC) → PingFang SC → Microsoft YaHei → Inter / system | |
| [ ] Inter 数字字体 | Google Fonts 直接加载 · 结算页大数字 `3 / 5` 用 tabular-nums | 数字等宽对齐 |

### J.1 字体总字节

- 目标：CJK 字体单个分片 < 100KB · 总 < 500KB（SC-FZ）
- 验证：DevTools Network → font 过滤 → 总 Transfer size
- [ ] CJK 总字节 < 500KB
- [ ] 无 block 渲染（font-display: swap 工作）

---

## K. 其他边界

| 项 | 验证 | 通过 |
|----|------|------|
| [ ] 200% 文本缩放（系统级 + 浏览器 Ctrl+= 3 次）| 内容不溢出 · 布局不破 · 仍可操作 | |
| [ ] 200% 缩放 = 320px 视口 | 无水平滚动（SC-BP5 + Phase 1 `min-inline-size: 320` + 374px 收缩 padding）| |
| [ ] 高对比度模式（Windows）| 内容可见 · 焦点指示器可见 · `@media (prefers-contrast: more)` 未特殊降级但原生不应破坏 | |
| [ ] Reduced data（`navigator.connection.saveData`）| MVP 未单独处理（字体仍加载）· 可接受 | 标注 |
| [ ] 禁用 JS | HTML 显示骨架（Skip Link + toast 容器 + 空 `#app`）· 提示无 JS 不工作（MVP 可接受）| |
| [ ] 浏览器翻译功能（Chrome 翻译中文到英文）| 原始 zh 内容被译 · 不破坏布局 · 语言 attribute 正确（`<html lang="zh">` → Chrome 识别翻译）| |
| [ ] 分享链接（复制 URL 到微信 / Twitter）| OG 预览图（FAV/OG 资产缺失，当前无预览）· MVP 可延后 | |

---

## L. 验收通过判定

**必需项（P0）**：A（核心浏览器 Chrome/Safari 至少 3 个通过）+ B.1（VoiceOver Mac 至少）+ C（Mobile zh Lighthouse A11y = 100）+ D（全键盘通核心 Home/Quiz/Result 路径）+ E（prefers-reduced-motion 核心路径降级）+ F.1（无痕模式不崩 + toast）+ G（http / file 都可运行）+ H（中英切换核心）+ I（明暗切换核心 + 无 FOUC）+ J（CJK 总字节 < 500KB）

**推荐项（P1）**：A（全部平台）+ B.2（NVDA）+ C（全部路径 ≥90）+ K（200% 缩放 / 200% 文本 OK）

**P0 任一不过 → 阻断上线**。P1 不过 → 记入 r-qa 待修列表。

---

## 条目总数统计

| Section | 条目数 |
|---------|-------|
| A. 真机测试 | 6 个设备路径 × 约 8 检查点 = 约 48 条 |
| B. 屏幕阅读器 | 7 页 × 2 读屏器 = 14 条 |
| C. Lighthouse | 7 个路径 × 4 分数维度 = 28 条 |
| D. 键盘导航 | 9 条 |
| E. prefers-reduced-motion | 8 条 |
| F. localStorage 边界 | 4 子场景 × 约 3 = 12 条 |
| G. 网络协议 | 3 条 |
| H. 中英切换 | 7 条 |
| I. 明暗切换 | 5 条 |
| J. CJK 字体 | 8 条（含 J.1 总字节 2 条）|
| K. 其他边界 | 7 条 |
| **合计** | **约 149 条** |

---

## M. 失败汇报模板

每遇一项 `[!]` 失败，填写：

```
### 失败 [编号 · 章节]
- 环境：<设备 / OS / 浏览器 / 语言 / 主题 / 网络>
- 步骤：<最小复现步骤>
- 预期：<按清单描述>
- 实际：<实际现象>
- 截图/视频：<路径或 URL>
- 建议严重度：P0 / P1 / P2
- 建议修复方：r-frontend / r-qa / visual-designer
```

---

## N. Phase 3 P2/P3 修复记录（2026-04-17 r-qa 自动修复，全部已关闭）

> 原 5 项 P2/P3 在 r-qa Lighthouse 自动修复阶段全部完成，详见 CHECKLIST-phase3 §4.2 + §4.3。
> **无遗留待裁决项。**

| ID | 严重度 | 修复内容 | 状态 |
|----|-------|---------|-----|
| FIX-P3-01 | P2 | CardDetail 回链改 `<a href="#/home">` + `t('result.cta.home')` | ✅ 2026-04-17 |
| FIX-P3-04 | P2 | CardDetail isPerfect 时展示 `.card-detail__badge-section`（badge name + story）| ✅ 2026-04-17 |
| FIX-P3-06 | P2 | wrong filter tabs 加 ArrowLeft/Right/Home/End keydown 循环切换 | ✅ 2026-04-17 |
| FIX-P3-07 | P3 | wrong-item__detail border-block-start 保留（UX 分隔线，接受现状）| ✅ 2026-04-17（接受）|
| FIX-P3-08 | P2 | button 内 div 全部改 span（CSS 已有 display:flex/grid 覆盖）| ✅ 2026-04-17 |

---

> 验收完成后请把此文件更新为 `MANUAL-VERIFICATION-RESULT-YYYYMMDD.md` 并归档到 `07-frontend/`。
