# 迷人的老祖宗 - Design Tokens

> 视觉气质权威源：`~/Claude/projects/charming-ancestors/PRODUCT.md` §视觉气质
> 内核：时间的厚重感 + 发现的轻盈感 / 沉稳而不老气 · 童趣而不幼稚 · 国风而不刻板 · 克制而不冷淡
> 下游消费者：r-designer（05-design-schema）→ r-pencil（06-pencil）→ r-frontend（07-frontend）

---

## 0. 调色板主色决策（写在最前）

| 选择 | 值 | 来源 | 为什么是它 |
|------|-----|------|-----------|
| **品牌主色（明）** | `#4A7C74` 青瓷 | 龙泉青瓷釉色 | 承载"时间厚重感"的核心色；冷调不老气，沉静但有生命力；与小学生产品常见的亮黄/纯蓝形成差异化 |
| **品牌主色（暗）** | `#6FA89F` 青瓷·明 | 青瓷上拉 18% 明度 | 暗模式下保持可识别为同一品牌（Hue 偏移 ≤8°），不"洗白"不"闷死" |
| **强调色** | `#C04A3A` 朱砂 | 中国古典朱砂 | 承载"发现的轻盈感"——用于通关、满分、新解锁，60-30-10 中的 10% |
| **文化色** | `#B67B3D` 赭石 | 土系矿物色 | 知识卡边框、朝代章节分隔的次强调，给"时间"打底 |
| **墨黑** | `#1A1814` 墨黑 | 松烟墨 | 正文色（明）/ 底色（暗）——不用纯黑，带一点暖褐 |

**60-30-10 分配**：青瓷/米白（surface 60%）+ 墨黑/云白（文字 30%）+ 朱砂（强调 10%）
**刻意避开**：大红大金（国潮复古）/ 饱和黄（幼稚）/ 纯黑纯白（冷淡）

---

## 1. Color Tokens

### 1.1 Primitive 色板（两模式共用，禁止为 dark 新造 primitive）

#### 青瓷 · Celadon（品牌主色 · 冷）
```
celadon-50:  #EDF4F2   /* 薄冰 - 最浅背景 */
celadon-100: #D6E6E1   /* 青烟 */
celadon-200: #B5D0C7   /* 淡青 */
celadon-300: #8DB5A8   /* 嫩青 */
celadon-400: #6FA89F   /* 青瓷·明（暗模式品牌色） */
celadon-500: #4A7C74   /* 青瓷（明模式品牌主色） */
celadon-600: #3D6660   /* 深青 */
celadon-700: #2F4E4A   /* 古青 */
celadon-800: #223936   /* 墨青 */
celadon-900: #152523   /* 暗青 */
```

#### 朱砂 · Cinnabar（强调色 · 暖）
```
cinnabar-50:  #FBEDEA
cinnabar-100: #F5D3CC
cinnabar-200: #EBA89B
cinnabar-300: #DE7D6A
cinnabar-400: #CD5B46
cinnabar-500: #C04A3A   /* 朱砂（满分/通关/关键 CTA） */
cinnabar-600: #9F3C2F
cinnabar-700: #7D2F24
cinnabar-800: #5C221B
cinnabar-900: #3C1712
```

#### 赭石 · Ochre（文化辅色 · 暖）
```
ochre-50:  #FAF3E8
ochre-100: #F1E0C4
ochre-200: #E4C697
ochre-300: #D3A868
ochre-400: #C4934D
ochre-500: #B67B3D   /* 赭石（知识卡边框/朝代装饰） */
ochre-600: #946231
ochre-700: #714B26
ochre-800: #50351B
ochre-900: #312011
```

#### 墨黑 · Ink（中性色 · 暖灰）
> 中性色加入 3% 暖褐偏移（不是纯灰），呼应"古籍/墨"的文化基因
```
ink-0:   #FFFFFF     /* 纯白（仅用于白底图/极限高亮） */
ink-50:  #FAF8F3     /* 米白（明模式主背景） */
ink-100: #F2EFE7     /* 宣纸（明模式次背景） */
ink-200: #E5E0D3     /* 淡褐灰 */
ink-300: #C9C2B0     /* 灰褐 */
ink-400: #9A9282     /* 中灰褐 */
ink-500: #6B6456     /* 深灰褐（辅助文字） */
ink-600: #4A4438     /* 墨灰 */
ink-700: #33302A     /* 深墨 */
ink-800: #26231E     /* 墨夜 */
ink-850: #1F1D19     /* 暗模式次背景 */
ink-900: #1A1814     /* 墨黑（暗模式主背景） */
ink-950: #0F0E0B     /* 极暗（暗模式深层） */
```

#### 语义功能色（功能色也走古典色系而非纯粹 Material 色）
```
jade-500:    #3E8A6E   /* 竹青 - success */
apricot-500: #D89A3F   /* 杏黄 - warning */
carmine-500: #B53A3A   /* 绛红 - danger（比朱砂更深更冷，避免与强调色混淆） */
azurite-500: #3F7AA8   /* 石青 - info */

/* 每个功能色各准备明暗两档用于语义映射 */
jade-300: #7BB396      jade-700: #2A6450
apricot-300: #E8BE7A   apricot-700: #9A6A24
carmine-300: #D47373   carmine-700: #822626
azurite-300: #7CA7CC   azurite-700: #2C5878
```

---

### 1.2 Semantic Tokens（明暗双套完整，TM1 硬约束）

> 组件层只引用 Semantic，**禁止直引 Primitive**
> 所有对比度声称标注 [已验证] / [待验证]，见 §1.4 验证清单

#### Surface / 表面（背景）
| Token | Light | Dark | 用途 | 禁用场景 |
|-------|-------|------|------|---------|
| `bg-primary` | `ink-50` #FAF8F3 | `ink-900` #1A1814 | 页面主背景 | 不用于卡片堆叠 |
| `bg-secondary` | `ink-100` #F2EFE7 | `ink-850` #1F1D19 | 次级背景、卡片底 | - |
| `bg-tertiary` | `celadon-50` #EDF4F2 | `celadon-900` #152523 | 特色区块（朝代背景淡染） | 不用于长段正文区 |
| `bg-elevated` | `ink-0` #FFFFFF | `ink-800` #26231E | 浮层、弹窗、知识卡 | - |
| `bg-inverse` | `ink-900` #1A1814 | `ink-50` #FAF8F3 | 反白提示条 | - |
| `bg-overlay` | rgba(26,24,20,0.55) | rgba(0,0,0,0.65) | 模态遮罩 | - |

#### Foreground / 文字
| Token | Light | Dark | 用途 | 禁用场景 |
|-------|-------|------|------|---------|
| `fg-primary` | `ink-900` #1A1814 | `ink-50` #FAF8F3 | 正文主文字、标题 | - |
| `fg-secondary` | `ink-600` #4A4438 | `ink-200` #E5E0D3 | 次要文字、副标题 | 不用于 <14px 小字 |
| `fg-muted` | `ink-500` #6B6456 | `ink-300` #C9C2B0 | 辅助文字、时间戳、metadata | 不用于 body 正文 |
| `fg-disabled` | `ink-400` #9A9282 | `ink-400` #9A9282 | 禁用态 | - |
| `fg-on-accent` | `ink-50` #FAF8F3 | `ink-50` #FAF8F3 | 朱砂/青瓷按钮上的文字 | 不用在 celadon-300 以下 |
| `fg-on-inverse` | `ink-50` #FAF8F3 | `ink-900` #1A1814 | 反白提示条文字 | - |

#### Border / 描边
| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `border-subtle` | `ink-200` #E5E0D3 | `ink-700` #33302A | 卡片边、分隔线 |
| `border-strong` | `ink-300` #C9C2B0 | `ink-500` #6B6456 | 强边界、选项边框 |
| `border-focus` | `celadon-500` #4A7C74 | `celadon-400` #6FA89F | 焦点环（键盘聚焦） |

#### Accent / 品牌强调
| Token | Light | Dark | 用途 | 禁用场景 |
|-------|-------|------|------|---------|
| `accent-primary` | `celadon-500` #4A7C74 | `celadon-400` #6FA89F | 主 CTA、导航激活、进度填充 | - |
| `accent-primary-hover` | `celadon-600` #3D6660 | `celadon-300` #8DB5A8 | 主 CTA hover | - |
| `accent-muted` | `celadon-100` #D6E6E1 | `celadon-800` #223936 | 浅强调底（tag 背景） | - |
| `accent-secondary` | `cinnabar-500` #C04A3A | `cinnabar-400` #CD5B46 | 满分/通关/解锁高亮 | 不用于常规 CTA（保留稀缺感） |
| `accent-cultural` | `ochre-500` #B67B3D | `ochre-400` #C4934D | 知识卡边框、朝代装饰 | 不用于按钮背景 |

#### State / 功能状态
| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `state-success` | `jade-500` #3E8A6E | `jade-300` #7BB396 | 答对、通关提示 |
| `state-success-bg` | #E7F2EC | #1D3A2E | 答对反馈底 |
| `state-warning` | `apricot-500` #D89A3F | `apricot-300` #E8BE7A | 提示、倒数 |
| `state-warning-bg` | #FAEFD9 | #3D2E12 | 警告底 |
| `state-danger` | `carmine-500` #B53A3A | `carmine-300` #D47373 | 错题、删除 |
| `state-danger-bg` | #F8E4E4 | #3A1616 | 错题反馈底 |
| `state-info` | `azurite-500` #3F7AA8 | `azurite-300` #7CA7CC | 说明、tips |
| `state-info-bg` | #E3EEF8 | #132B3F | 信息底 |

---

### 1.3 特殊场景色（业务语义）

#### 关卡状态四态
| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `level-locked-bg` | `ink-100` #F2EFE7 | `ink-850` #1F1D19 | 锁定关卡底 |
| `level-locked-fg` | `ink-400` #9A9282 | `ink-500` #6B6456 | 锁定图标/文字（低调但可读） |
| `level-active-bg` | `celadon-100` #D6E6E1 | `celadon-800` #223936 | 进行中关卡底 |
| `level-active-fg` | `celadon-700` #2F4E4A | `celadon-200` #B5D0C7 | 进行中文字 |
| `level-active-ring` | `celadon-500` #4A7C74 | `celadon-400` #6FA89F | 进行中高亮环（呼吸动效载体） |
| `level-cleared-bg` | `ochre-100` #F1E0C4 | `ochre-800` #50351B | 通关关卡底（赭石底色 = 收藏感） |
| `level-cleared-fg` | `ochre-700` #714B26 | `ochre-200` #E4C697 | 通关文字 |
| `level-perfect-bg` | `cinnabar-100` #F5D3CC | `cinnabar-800` #5C221B | 满分关卡底 |
| `level-perfect-fg` | `cinnabar-700` #7D2F24 | `cinnabar-200` #EBA89B | 满分文字 |
| `level-perfect-glow` | rgba(192,74,58,0.35) | rgba(205,91,70,0.45) | 满分徽章外发光（motion token 关联） |

#### 答题反馈
| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `answer-correct-bg` | #E7F2EC | #1D3A2E | 正确选项背景 |
| `answer-correct-border` | `jade-500` #3E8A6E | `jade-300` #7BB396 | 正确选项边框 |
| `answer-wrong-bg` | #F8E4E4 | #3A1616 | 错误选项背景（文案 "再来看一眼" 不用 danger 字样） |
| `answer-wrong-border` | `carmine-500` #B53A3A | `carmine-300` #D47373 | 错误选项边框 |
| `answer-default-bg` | `bg-elevated` | `bg-elevated` | 默认选项底 |
| `answer-default-border` | `border-strong` | `border-strong` | 默认选项边 |
| `answer-hover-bg` | `celadon-50` #EDF4F2 | `celadon-900` #152523 | hover 悬停底 |
| `answer-selected-border` | `celadon-500` #4A7C74 | `celadon-400` #6FA89F | 已选未提交边框 |

#### 知识卡稀有度（Rarity）
| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `rarity-common-border` | `ink-300` #C9C2B0 | `ink-500` #6B6456 | 普通卡（通关解锁） |
| `rarity-common-accent` | `ink-500` #6B6456 | `ink-300` #C9C2B0 | 普通卡角标 |
| `rarity-rare-border` | `ochre-500` #B67B3D | `ochre-400` #C4934D | 稀有卡（满分解锁） |
| `rarity-rare-accent` | `ochre-600` #946231 | `ochre-300` #D3A868 | 稀有卡角标 |
| `rarity-legendary-border` | `cinnabar-500` #C04A3A | `cinnabar-400` #CD5B46 | 传说卡（全满分额外奖励） |
| `rarity-legendary-accent` | `cinnabar-600` #9F3C2F | `cinnabar-300` #DE7D6A | 传说卡角标 |
| `rarity-legendary-glow` | rgba(192,74,58,0.3) | rgba(205,91,70,0.4) | 传说卡发光 |

---

### 1.4 对比度验证清单（人工必检 · WCAG AA）

> LLM 无法精确计算 WCAG 相对亮度比值。以下声称均标注状态，下游人工用链接复核。
> AA 标准：正文 ≥4.5:1，大字（≥18pt 或 14pt Bold）≥3:1。

#### Light 模式
| 前景 / 背景 | 用途 | 状态 | 风险 | 验证链接 |
|------------|------|------|------|---------|
| `#1A1814` on `#FAF8F3` | fg-primary / bg-primary 正文 | [待验证] 预计 15:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=1A1814&bcolor=FAF8F3 |
| `#1A1814` on `#F2EFE7` | fg-primary / bg-secondary 卡片正文 | [待验证] 预计 14:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=1A1814&bcolor=F2EFE7 |
| `#4A4438` on `#FAF8F3` | fg-secondary / bg-primary 副标题 | [待验证] 预计 10:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=4A4438&bcolor=FAF8F3 |
| `#6B6456` on `#FAF8F3` | fg-muted / bg-primary metadata | [待验证] 需重点验证 | 需重点验证（中灰 on 米白） | https://webaim.org/resources/contrastchecker/?fcolor=6B6456&bcolor=FAF8F3 |
| `#6B6456` on `#F2EFE7` | fg-muted / bg-secondary | [待验证] 需重点验证 | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=6B6456&bcolor=F2EFE7 |
| `#FAF8F3` on `#4A7C74` | fg-on-accent / accent-primary CTA 按钮 | [待验证] 预计约 4.8:1 | 需重点验证（青瓷+白） | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=4A7C74 |
| `#FAF8F3` on `#C04A3A` | fg-on-accent / accent-secondary 满分 CTA | [待验证] 预计约 5.2:1 | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=C04A3A |
| `#2F4E4A` on `#D6E6E1` | level-active-fg / level-active-bg | [待验证] 预计 7:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=2F4E4A&bcolor=D6E6E1 |
| `#714B26` on `#F1E0C4` | level-cleared-fg / level-cleared-bg | [待验证] 预计 6:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=714B26&bcolor=F1E0C4 |
| `#7D2F24` on `#F5D3CC` | level-perfect-fg / level-perfect-bg | [待验证] 预计 6:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=7D2F24&bcolor=F5D3CC |
| `#3E8A6E` on `#E7F2EC` | state-success 图标 on bg | [待验证] | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=3E8A6E&bcolor=E7F2EC |
| `#B53A3A` on `#F8E4E4` | state-danger 图标 on bg | [待验证] | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=B53A3A&bcolor=F8E4E4 |

#### Dark 模式
| 前景 / 背景 | 用途 | 状态 | 风险 | 验证链接 |
|------------|------|------|------|---------|
| `#FAF8F3` on `#1A1814` | fg-primary / bg-primary 正文 | [待验证] 预计 15:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=1A1814 |
| `#FAF8F3` on `#1F1D19` | fg-primary / bg-secondary | [待验证] 预计 14:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=1F1D19 |
| `#E5E0D3` on `#1A1814` | fg-secondary / bg-primary | [待验证] 预计 12:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=E5E0D3&bcolor=1A1814 |
| `#C9C2B0` on `#1A1814` | fg-muted / bg-primary | [待验证] 预计 9:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=C9C2B0&bcolor=1A1814 |
| `#FAF8F3` on `#6FA89F` | fg-on-accent / accent-primary dark CTA | [待验证] 需重点验证 | ⚠️ 高风险（浅青+白易失败） | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=6FA89F |
| `#1A1814` on `#6FA89F` | 深字 on 暗模式青瓷 备选 | [待验证] 预计 7:1+ | 正常 | https://webaim.org/resources/contrastchecker/?fcolor=1A1814&bcolor=6FA89F |
| `#FAF8F3` on `#CD5B46` | fg-on-accent / accent-secondary dark | [待验证] 需重点验证 | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=FAF8F3&bcolor=CD5B46 |
| `#B5D0C7` on `#223936` | level-active-fg / level-active-bg dark | [待验证] | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=B5D0C7&bcolor=223936 |
| `#E4C697` on `#50351B` | level-cleared-fg / level-cleared-bg dark | [待验证] | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=E4C697&bcolor=50351B |
| `#EBA89B` on `#5C221B` | level-perfect-fg / level-perfect-bg dark | [待验证] | 需重点验证 | https://webaim.org/resources/contrastchecker/?fcolor=EBA89B&bcolor=5C221B |

> **⚠️ 已知风险提示**：`#FAF8F3 on #6FA89F`（暗模式青瓷 CTA 白字）—— 浅青瓷 + 白字大概率不达 AA 4.5:1。若验证失败，fallback 方案：dark 模式 accent-primary 文字用 `ink-900` 深字而非白字；或把 dark accent-primary 降至 `celadon-500`（#4A7C74），但需另验品牌辨识度。

#### 品牌色跨模式辨识度测试
| 场景 | Light | Dark | 辨识度 |
|------|-------|------|--------|
| 品牌色 vs bg-primary | #4A7C74 on #FAF8F3 | #6FA89F on #1A1814 | [待人工核验] 两模式需能"一眼认出青瓷家族" |
| 品牌色 vs bg-secondary | #4A7C74 on #F2EFE7 | #6FA89F on #1F1D19 | [待人工核验] |

---

## 2. Typography Tokens

### 2.1 Font Family Stacks

> CJK 字体栈完整覆盖 zh-Hans fallback；英文 30-60% 膨胀预算由字号系统承接。

#### 标题栈（文化重量 · 衬线）
```css
--font-display: 
  "Source Han Serif SC",      /* 思源宋体（首选） */
  "Noto Serif SC",            /* 思源宋体 Google 发行版 */
  "Songti SC",                /* macOS 系统宋体 */
  "SimSun",                   /* Windows 宋体 */
  "Playfair Display",         /* 英文标题衬线 */
  "Georgia",                  /* 英文 fallback */
  serif;
```

#### 正文栈（轻盈易读 · 无衬线）
```css
--font-body:
  "HarmonyOS Sans SC",        /* 鸿蒙（首选，儿童友好的现代黑体） */
  "Source Han Sans SC",       /* 思源黑体 */
  "Noto Sans SC",             /* 思源黑体 Google 发行版 */
  "PingFang SC",              /* macOS 苹方 */
  "Microsoft YaHei",          /* Windows 微软雅黑 */
  "Inter",                    /* 英文无衬线 */
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

#### 数字栈（等宽数字，用于分数/计时/关卡号）
```css
--font-numeric:
  "Inter",                    /* Inter 自带 tabular-nums */
  "SF Pro Display",
  ui-monospace,
  sans-serif;
/* 配合 font-variant-numeric: tabular-nums; */
```

### 2.2 字号阶梯（Modular Scale 1.25 + 响应式 clamp）

> 字号系统预留英文膨胀 30-60%：所有标题/按钮/Tab 用 clamp() 允许流体缩放。

| Token | Value | 用途 | 对应层级 |
|-------|-------|------|---------|
| `fs-display` | `clamp(32px, 6vw, 56px)` | 首页主标题（朝代图谱页标） | Display |
| `fs-h1` | `clamp(28px, 4.5vw, 40px)` | 页面一级标题 | H1 |
| `fs-h2` | `clamp(22px, 3.5vw, 30px)` | 区块标题、朝代名 | H2 |
| `fs-h3` | `clamp(18px, 2.8vw, 22px)` | 子标题、题目文字 | H3 |
| `fs-body-lg` | `18px` | 题目正文（9-12 岁儿童友好字号） | Body-large |
| `fs-body` | `16px` | 常规正文、选项文字 | Body |
| `fs-body-sm` | `14px` | 辅助说明、知识卡描述 | Body-small |
| `fs-caption` | `13px` | metadata、时间戳 | Caption（不低于 12） |
| `fs-micro` | `12px` | 极小信息（版权/角标） | 仅限非关键信息 |

**刻意决策**：
- **正文最小 16px，不做 14px 正文**：儿童眼睛疲劳度高，14px 只能做辅助
- **按钮文字走 `fs-body`（16px）**：配合 48px 触摸目标高度

### 2.3 字重（MUST 限制在 3 种）

```
--fw-regular: 400      /* 正文 */
--fw-medium:  500      /* 强调正文、按钮 */
--fw-semibold: 600     /* 标题、关键数据 */
```

**禁止引入 300/700/900**：超过 3 种字重削弱层级区分度；宋体走 Regular + Semibold 两种，黑体全用上 3 种。

### 2.4 行高 / 字距

| Token | Value | 用途 |
|-------|-------|------|
| `lh-tight` | `1.2` | Display / H1（承载标题重量） |
| `lh-snug` | `1.35` | H2 / H3 |
| `lh-normal` | `1.55` | Body / Body-lg（儿童阅读友好 1.5-1.6） |
| `lh-loose` | `1.75` | 长段说明文、知识卡背景故事 |

```
--ls-tight:  -0.01em   /* Display 收紧 */
--ls-normal: 0         /* 默认 */
--ls-wide:   0.02em    /* Caption / 全大写英文 */
--ls-cjk:    0.05em    /* CJK 标题微增字距防粘连 */
```

### 2.5 Typography 预设组合（组件 Token）

| Token | Family | Size | Weight | Line-height | 用途 |
|-------|--------|------|--------|-------------|------|
| `type-display` | display | fs-display | 600 | 1.2 | 首页大标题 |
| `type-h1` | display | fs-h1 | 600 | 1.25 | 页面标题 |
| `type-h2` | display | fs-h2 | 600 | 1.35 | 区块标题 |
| `type-h3` | body | fs-h3 | 500 | 1.4 | 题目/子标题（题目用黑体更易读） |
| `type-body-lg` | body | fs-body-lg | 400 | 1.55 | 题目正文 |
| `type-body` | body | fs-body | 400 | 1.55 | 常规正文 |
| `type-body-strong` | body | fs-body | 500 | 1.55 | 加粗正文 |
| `type-button` | body | fs-body | 500 | 1.2 | 按钮文字 |
| `type-caption` | body | fs-caption | 400 | 1.45 | 辅助文字 |
| `type-numeric` | numeric | fs-h2 | 600 | 1.1 | 分数/关卡号（tabular-nums） |

---

## 3. Spacing Tokens

### 3.1 基础阶梯（8pt 网格 + 4pt 子网格）

```
--space-0:    0
--space-1:    4px    /* 子网格，图标内边距 */
--space-2:    8px    /* 紧凑元素间隔 */
--space-3:    12px   /* 子网格，行内组件 */
--space-4:    16px   /* 常用组件内边距 */
--space-5:    24px   /* 组件间距 */
--space-6:    32px   /* 区块内间距 */
--space-7:    48px   /* 区块间距 */
--space-8:    64px   /* 大区块分隔 */
--space-9:    96px   /* 页面级留白（桌面端） */
--space-10:   128px  /* 首屏呼吸留白 */
```

### 3.2 语义间距（组件级）

| Token | Value | 用途 |
|-------|-------|------|
| `space-inline-xs` | 4px | 图标与文字间距 |
| `space-inline-sm` | 8px | 选项间垂直间距（硬约束：≥8px） |
| `space-inline-md` | 12px | chip 间距 |
| `space-stack-sm` | 16px | 卡片内段落间距 |
| `space-stack-md` | 24px | 卡片间距、列表项间 |
| `space-stack-lg` | 32px | 区块间距 |
| `space-stack-xl` | 48px | 大区块间距 |
| `space-section` | 64px | 页面区块分隔（mobile） |
| `space-section-lg` | 96px | 页面区块分隔（desktop） |
| `space-gutter-mobile` | 16px | 移动端页面左右边距 |
| `space-gutter-tablet` | 24px | 平板左右边距 |
| `space-gutter-desktop` | 32px | 桌面左右边距 |
| `space-container-max` | 1200px | 内容最大宽度 |

### 3.3 触摸目标硬约束

```
--touch-target-min: 48px    /* 移动端最小可点区域（WCAG AAA） */
--touch-target-comfortable: 56px  /* 舒适触摸（主 CTA） */
--touch-spacing-min: 8px    /* 相邻可点区间距 */
```

**应用**：所有按钮/选项/图标按钮/卡片 click 区 MUST 满足 `min-height: 48px` + `min-width: 48px`。选项 `padding-block` 至少 14px（配合 16px 字号 + 1.55 行高 = 48.8px）。

---

## 4. Radius / Shadow / Elevation Tokens

### 4.1 Border Radius

```
--radius-none:   0
--radius-sm:     6px     /* 小元素：chip、tag、input */
--radius-md:     10px    /* 按钮、选项 */
--radius-lg:     16px    /* 卡片、知识卡 */
--radius-xl:     24px    /* 大卡片、弹窗 */
--radius-2xl:    32px    /* 浮层、模态 */
--radius-full:   9999px  /* 圆形、胶囊 */
```

**决策理由**：9-12 岁儿童对圆角更有好感，但全圆过于幼稚。主体 10-16px 区间，既有亲和力又保持克制。

### 4.2 Shadow / Elevation

> Light 模式用暖褐偏移的阴影（不是纯黑），呼应墨色文化基因；Dark 模式用发光替代阴影。

#### Light 模式
```
--shadow-xs:   0 1px 2px rgba(26, 24, 20, 0.04)
--shadow-sm:   0 2px 4px rgba(26, 24, 20, 0.06), 0 1px 2px rgba(26, 24, 20, 0.04)
--shadow-md:   0 4px 12px rgba(26, 24, 20, 0.08), 0 2px 4px rgba(26, 24, 20, 0.04)
--shadow-lg:   0 12px 24px rgba(26, 24, 20, 0.10), 0 4px 8px rgba(26, 24, 20, 0.06)
--shadow-xl:   0 24px 48px rgba(26, 24, 20, 0.14), 0 8px 16px rgba(26, 24, 20, 0.08)
--shadow-focus-ring: 0 0 0 3px rgba(74, 124, 116, 0.35)   /* 青瓷焦点环 */
--shadow-perfect-glow: 0 0 24px rgba(192, 74, 58, 0.35)   /* 满分朱砂发光 */
```

#### Dark 模式
```
--shadow-xs:   0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-sm:   0 2px 4px rgba(0, 0, 0, 0.4)
--shadow-md:   0 4px 12px rgba(0, 0, 0, 0.5)
--shadow-lg:   0 12px 24px rgba(0, 0, 0, 0.6)
--shadow-xl:   0 24px 48px rgba(0, 0, 0, 0.7)
--shadow-focus-ring: 0 0 0 3px rgba(111, 168, 159, 0.5)   /* 暗模式青瓷焦点环 */
--shadow-perfect-glow: 0 0 32px rgba(205, 91, 70, 0.5)    /* 暗模式朱砂发光更强 */
```

### 4.3 Elevation 语义映射

| Token | Shadow | 用途 |
|-------|--------|------|
| `elevation-0` | none | 平面（页面底） |
| `elevation-1` | shadow-sm | 卡片、选项 |
| `elevation-2` | shadow-md | hover 卡片、进行中关卡 |
| `elevation-3` | shadow-lg | 浮层、知识卡详情 |
| `elevation-4` | shadow-xl | 模态、弹窗 |

---

## 5. Motion Tokens

> r-frontend 可直接使用。所有动效符合"微"的原则：发现 / 翻页 / 得到 三类，禁止粗暴庆祝。

### 5.1 Duration

```
--duration-instant:  80ms     /* 按压反馈、选中即时 */
--duration-fast:     160ms    /* hover / focus / 小组件状态切换 */
--duration-base:     240ms    /* 常规过渡、颜色/透明度 */
--duration-slow:     360ms    /* 布局变化、卡片展开 */
--duration-slower:   560ms    /* 翻页、知识卡解锁 */
--duration-reward:   800ms    /* 通关得到动效（上限） */
```

**硬上限**：任何动效 ≤ 800ms；主题切换 ≤ 200ms（引用 --duration-fast）。

### 5.2 Easing

```
--ease-linear:        cubic-bezier(0, 0, 1, 1)
--ease-out:           cubic-bezier(0.22, 1, 0.36, 1)      /* 进入、出现（默认） */
--ease-in:            cubic-bezier(0.55, 0, 1, 0.45)      /* 离开、退场 */
--ease-in-out:        cubic-bezier(0.76, 0, 0.24, 1)      /* 双向过渡（主题切换） */
--ease-spring-soft:   cubic-bezier(0.34, 1.2, 0.64, 1)    /* 轻微回弹，发现感 */
--ease-spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)   /* 较强回弹，得到感 */
```

**禁止**：`cubic-bezier(0, 0, 0.2, 1)`（Material 默认过于工业）/ 自造曲线 / overshoot > 0.6（儿童产品需克制）。

### 5.3 三类动效预设（发现 / 翻页 / 得到）

#### Discover · 发现（hover / 滚动进入 / 焦点）
```
--motion-discover: {
  transform: translateY(-2px) scale(1.01);
  duration: var(--duration-fast);        /* 160ms */
  easing: var(--ease-spring-soft);
  shadow: elevation-1 → elevation-2;
}
```
用途：关卡卡片 hover、朝代图标 hover、知识卡缩略 hover
语义：轻微浮起 + 极小放大，暗示"可推开的门"

#### Flip · 翻页（页面切换 / 题目切换 / 卡片翻面）
```
--motion-flip-exit: {
  opacity: 1 → 0;
  transform: translateX(0) → translateX(-8%);
  duration: var(--duration-base);        /* 240ms */
  easing: var(--ease-in);
}
--motion-flip-enter: {
  opacity: 0 → 1;
  transform: translateX(8%) → translateX(0);
  duration: var(--duration-slow);        /* 360ms */
  easing: var(--ease-out);
  delay: var(--duration-fast);           /* 衔接 exit */
}
--motion-flip-card: {
  /* 知识卡翻面 3D */
  transform: rotateY(0) → rotateY(180deg);
  duration: var(--duration-slower);      /* 560ms */
  easing: var(--ease-in-out);
}
```
用途：题目切换、页面切换、知识卡翻面
语义：像翻古籍一页，沉稳不急躁

#### Reward · 得到（答对 / 通关 / 解锁知识卡）
```
--motion-reward-correct: {
  /* 答对：选项边框+底色淡入 + 极轻缩放回弹 */
  transform: scale(1) → scale(1.03) → scale(1);
  duration: var(--duration-base);        /* 240ms */
  easing: var(--ease-spring-soft);
}
--motion-reward-unlock: {
  /* 通关解锁知识卡：淡入 + 上升 + 边框发光 */
  opacity: 0 → 1;
  transform: translateY(24px) scale(0.92) → translateY(0) scale(1);
  duration: var(--duration-reward);      /* 800ms */
  easing: var(--ease-spring-bounce);
  glow: fade-in var(--shadow-perfect-glow);
}
--motion-reward-perfect: {
  /* 满分徽章：朱砂发光呼吸 2 次后常驻 */
  box-shadow: 0 → var(--shadow-perfect-glow) → 衰减 → 常驻低强度;
  duration: var(--duration-reward) × 2;  /* 1600ms 一个循环×2 */
  easing: var(--ease-in-out);
  iteration: 2;
}
```
用途：答对反馈、通关庆祝、解锁知识卡
**禁止**：全屏撒花、烟花、震动手机、多彩渐变爆炸——这是儿童产品不是游戏氪金动画

### 5.4 Prefers-Reduced-Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* 所有 duration 压到 80ms，保留颜色/透明度过渡，禁用 transform/scale/rotate */
  * { --duration-base: 80ms; --duration-slow: 80ms; --duration-reward: 80ms; }
  .motion-reward-*, .motion-flip-card { transform: none !important; }
}
```

---

## 6. Breakpoint Tokens

```
--bp-mobile:   375px    /* 移动端起点（iPhone SE 宽） */
--bp-tablet:   768px    /* 平板 */
--bp-desktop:  1024px   /* 桌面 */
--bp-wide:     1440px   /* 宽屏（可选） */
```

### Media Query 语义

```css
--mq-tablet-up:  (min-width: 768px)
--mq-desktop-up: (min-width: 1024px)
--mq-wide-up:    (min-width: 1440px)
```

### 栅格 / 容器响应式

| 断点 | 列数 | Gutter | 页边距 | 最大宽度 |
|------|-----|--------|--------|---------|
| Mobile (375-767) | 4 | 16px | 16px | 100% |
| Tablet (768-1023) | 8 | 20px | 24px | 720px |
| Desktop (1024-1439) | 12 | 24px | 32px | 1200px |
| Wide (1440+) | 12 | 24px | auto | 1200px |

### 响应式规则

- **Mobile**: 朝代图谱纵向单列卡片流；答题页单栏（题目上 + 选项下）
- **Tablet**: 朝代图谱 2 列；答题单栏但卡片更宽
- **Desktop**: 朝代图谱 5 列网格（2 行 × 5 列 = 10 关）；答题两栏（题目/选项左 + 朝代插画右）

---

## 7. CSS 变量输出模板（供 r-frontend 直接落地）

```css
:root,
:root[data-theme="light"] {
  /* Surface */
  --color-bg-primary: #FAF8F3;
  --color-bg-secondary: #F2EFE7;
  --color-bg-tertiary: #EDF4F2;
  --color-bg-elevated: #FFFFFF;
  --color-bg-inverse: #1A1814;
  --color-bg-overlay: rgba(26, 24, 20, 0.55);
  
  /* Foreground */
  --color-fg-primary: #1A1814;
  --color-fg-secondary: #4A4438;
  --color-fg-muted: #6B6456;
  --color-fg-disabled: #9A9282;
  --color-fg-on-accent: #FAF8F3;
  --color-fg-on-inverse: #FAF8F3;
  
  /* Border */
  --color-border-subtle: #E5E0D3;
  --color-border-strong: #C9C2B0;
  --color-border-focus: #4A7C74;
  
  /* Accent */
  --color-accent-primary: #4A7C74;
  --color-accent-primary-hover: #3D6660;
  --color-accent-muted: #D6E6E1;
  --color-accent-secondary: #C04A3A;
  --color-accent-cultural: #B67B3D;
  
  /* State */
  --color-state-success: #3E8A6E;
  --color-state-success-bg: #E7F2EC;
  --color-state-warning: #D89A3F;
  --color-state-warning-bg: #FAEFD9;
  --color-state-danger: #B53A3A;
  --color-state-danger-bg: #F8E4E4;
  --color-state-info: #3F7AA8;
  --color-state-info-bg: #E3EEF8;
  
  /* Level states */
  --color-level-locked-bg: #F2EFE7;
  --color-level-locked-fg: #9A9282;
  --color-level-active-bg: #D6E6E1;
  --color-level-active-fg: #2F4E4A;
  --color-level-active-ring: #4A7C74;
  --color-level-cleared-bg: #F1E0C4;
  --color-level-cleared-fg: #714B26;
  --color-level-perfect-bg: #F5D3CC;
  --color-level-perfect-fg: #7D2F24;
  --color-level-perfect-glow: rgba(192, 74, 58, 0.35);
  
  /* Answer feedback */
  --color-answer-correct-bg: #E7F2EC;
  --color-answer-correct-border: #3E8A6E;
  --color-answer-wrong-bg: #F8E4E4;
  --color-answer-wrong-border: #B53A3A;
  --color-answer-hover-bg: #EDF4F2;
  --color-answer-selected-border: #4A7C74;
  
  /* Rarity */
  --color-rarity-common-border: #C9C2B0;
  --color-rarity-rare-border: #B67B3D;
  --color-rarity-legendary-border: #C04A3A;
  --color-rarity-legendary-glow: rgba(192, 74, 58, 0.3);
  
  /* Shadow */
  --shadow-xs: 0 1px 2px rgba(26, 24, 20, 0.04);
  --shadow-sm: 0 2px 4px rgba(26, 24, 20, 0.06), 0 1px 2px rgba(26, 24, 20, 0.04);
  --shadow-md: 0 4px 12px rgba(26, 24, 20, 0.08), 0 2px 4px rgba(26, 24, 20, 0.04);
  --shadow-lg: 0 12px 24px rgba(26, 24, 20, 0.10), 0 4px 8px rgba(26, 24, 20, 0.06);
  --shadow-xl: 0 24px 48px rgba(26, 24, 20, 0.14), 0 8px 16px rgba(26, 24, 20, 0.08);
  --shadow-focus-ring: 0 0 0 3px rgba(74, 124, 116, 0.35);
  --shadow-perfect-glow: 0 0 24px rgba(192, 74, 58, 0.35);
}

:root[data-theme="dark"] {
  /* Surface */
  --color-bg-primary: #1A1814;
  --color-bg-secondary: #1F1D19;
  --color-bg-tertiary: #152523;
  --color-bg-elevated: #26231E;
  --color-bg-inverse: #FAF8F3;
  --color-bg-overlay: rgba(0, 0, 0, 0.65);
  
  /* Foreground */
  --color-fg-primary: #FAF8F3;
  --color-fg-secondary: #E5E0D3;
  --color-fg-muted: #C9C2B0;
  --color-fg-disabled: #9A9282;
  --color-fg-on-accent: #1A1814;  /* ⚠️ 暗模式 accent 上用深字（见 1.4 风险提示） */
  --color-fg-on-inverse: #1A1814;
  
  /* Border */
  --color-border-subtle: #33302A;
  --color-border-strong: #6B6456;
  --color-border-focus: #6FA89F;
  
  /* Accent */
  --color-accent-primary: #6FA89F;
  --color-accent-primary-hover: #8DB5A8;
  --color-accent-muted: #223936;
  --color-accent-secondary: #CD5B46;
  --color-accent-cultural: #C4934D;
  
  /* State */
  --color-state-success: #7BB396;
  --color-state-success-bg: #1D3A2E;
  --color-state-warning: #E8BE7A;
  --color-state-warning-bg: #3D2E12;
  --color-state-danger: #D47373;
  --color-state-danger-bg: #3A1616;
  --color-state-info: #7CA7CC;
  --color-state-info-bg: #132B3F;
  
  /* Level states */
  --color-level-locked-bg: #1F1D19;
  --color-level-locked-fg: #6B6456;
  --color-level-active-bg: #223936;
  --color-level-active-fg: #B5D0C7;
  --color-level-active-ring: #6FA89F;
  --color-level-cleared-bg: #50351B;
  --color-level-cleared-fg: #E4C697;
  --color-level-perfect-bg: #5C221B;
  --color-level-perfect-fg: #EBA89B;
  --color-level-perfect-glow: rgba(205, 91, 70, 0.45);
  
  /* Answer feedback */
  --color-answer-correct-bg: #1D3A2E;
  --color-answer-correct-border: #7BB396;
  --color-answer-wrong-bg: #3A1616;
  --color-answer-wrong-border: #D47373;
  --color-answer-hover-bg: #152523;
  --color-answer-selected-border: #6FA89F;
  
  /* Rarity */
  --color-rarity-common-border: #6B6456;
  --color-rarity-rare-border: #C4934D;
  --color-rarity-legendary-border: #CD5B46;
  --color-rarity-legendary-glow: rgba(205, 91, 70, 0.4);
  
  /* Shadow */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.7);
  --shadow-focus-ring: 0 0 0 3px rgba(111, 168, 159, 0.5);
  --shadow-perfect-glow: 0 0 32px rgba(205, 91, 70, 0.5);
}

/* 非颜色 Token 两模式共用 */
:root {
  /* Typography */
  --font-display: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", "Playfair Display", Georgia, serif;
  --font-body: "HarmonyOS Sans SC", "Source Han Sans SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-numeric: "Inter", "SF Pro Display", ui-monospace, sans-serif;
  
  --fs-display: clamp(32px, 6vw, 56px);
  --fs-h1: clamp(28px, 4.5vw, 40px);
  --fs-h2: clamp(22px, 3.5vw, 30px);
  --fs-h3: clamp(18px, 2.8vw, 22px);
  --fs-body-lg: 18px;
  --fs-body: 16px;
  --fs-body-sm: 14px;
  --fs-caption: 13px;
  --fs-micro: 12px;
  
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  
  --lh-tight: 1.2;
  --lh-snug: 1.35;
  --lh-normal: 1.55;
  --lh-loose: 1.75;
  
  --ls-tight: -0.01em;
  --ls-normal: 0;
  --ls-wide: 0.02em;
  --ls-cjk: 0.05em;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  
  --space-gutter-mobile: 16px;
  --space-gutter-tablet: 24px;
  --space-gutter-desktop: 32px;
  --space-container-max: 1200px;
  
  --touch-target-min: 48px;
  --touch-target-comfortable: 56px;
  --touch-spacing-min: 8px;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
  
  /* Motion */
  --duration-instant: 80ms;
  --duration-fast: 160ms;
  --duration-base: 240ms;
  --duration-slow: 360ms;
  --duration-slower: 560ms;
  --duration-reward: 800ms;
  
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-spring-soft: cubic-bezier(0.34, 1.2, 0.64, 1);
  --ease-spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Breakpoints 仅供 JS 读取，CSS 用 @media */
  --bp-mobile: 375px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1440px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-base: 80ms;
    --duration-slow: 80ms;
    --duration-slower: 80ms;
    --duration-reward: 80ms;
  }
}
```

---

## 8. 主题切换过渡

```css
body, * {
  transition:
    background-color var(--duration-fast) var(--ease-in-out),
    color var(--duration-fast) var(--ease-in-out),
    border-color var(--duration-fast) var(--ease-in-out);
}
```

主题切换 ≤ 200ms，符合响应式硬约束 SC-TH7。

---

## 9. 协作边界 & 消费者指南

- **视觉设计师交付边界**：静态视觉 + Token 定义 + Motion duration/easing
- **动效实现细节**归 motion-designer（当前项目未设此角色，动效预设 5.3 由 r-frontend 直接用）
- **下游必读**：
  - r-designer：只引用 Semantic Token，禁止用 Primitive（`bg-primary` 而不是 `ink-50`）
  - r-pencil：把 Pencil 库变量与本 Token 映射（不在 .pen 里硬编码 hex）
  - r-frontend：直接复制 §7 CSS 变量块到项目；`data-theme` 切换驱动
  - r-qa：对比度验证清单（§1.4）逐条用 WebAIM 链接人工核验
