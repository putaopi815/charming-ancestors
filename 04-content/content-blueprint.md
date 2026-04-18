# 迷人的老祖宗 · 内容蓝图（Content Blueprint）

> Content Strategist 产出 · 版本 v1.0 · 2026-04-17
> 权威源：`PRODUCT.md` + `page-map.md` + `state-machine.md`
> 下游读者：r-designer（Schema 对照）· r-frontend（内容落位）· r-qa（文案校对）

---

## 0. 内容策略一句话

> 把历史做成"孩子自己推开的一扇小门"——每道题是门上的一个问号，每张卡是推门进去看见的一个故事。不教、不背、不比。

---

## 1. 叙事主线（10 关结构）

| 关 # | 朝代 ID | 中文名 | 英文名 | 时代关键词 | 知识卡类型（轮换） | MVP 状态 |
|------|---------|--------|--------|-----------|-----------------|---------|
| 1 | xia | 夏 | Xia | 传说与起点 | 人物（大禹） | ✅ 完整 5 题 |
| 2 | shang | 商 | Shang | 占卜与青铜 | 器物（甲骨） | ✅ 完整 5 题 |
| 3 | zhou | 周 | Zhou | 礼乐与分封 | 事件（烽火戏诸侯） | ✅ 完整 5 题 |
| 4 | qin | 秦 | Qin | 统一与长城 | 人物（秦始皇） | ⏸ 结构占位 |
| 5 | han | 汉 | Han | 丝路与纸 | 器物（汉代纸） | ⏸ 结构占位 |
| 6 | sanguo | 三国 | Three Kingdoms | 英雄与智谋 | 事件（草船借箭） | ⏸ 结构占位 |
| 7 | suitang | 隋唐 | Sui-Tang | 盛世与诗 | 人物（李白） | ⏸ 结构占位 |
| 8 | song | 宋 | Song | 活字与市井 | 器物（活字印刷） | ⏸ 结构占位 |
| 9 | yuan | 元 | Yuan | 版图与驿道 | 事件（马可波罗来华） | ⏸ 结构占位 |
| 10 | mingqing | 明清 | Ming-Qing | 航海与宫殿 | 器物（郑和宝船） | ⏸ 结构占位 |

**知识卡类型轮换规则**：人物 → 器物 → 事件循环，10 关正好 4 人物 / 3 器物 / 3 事件。

---

## 2. 题库（MVP 前 3 关完整 15 题 + 后 7 关 1 题样例占位）

### 2.1 数据结构（传给 r-frontend）

```typescript
type Question = {
  id: string;               // 例 "q_xia_1"
  dynasty: string;          // dynastyId，见上表
  question_zh: string;
  question_en: string;
  options: Array<{ zh: string; en: string }>; // 固定 4 项
  answer_index: number;     // 0-3
  explanation_zh: string;   // 2-3 句，讲故事不讲知识点
  explanation_en: string;
  difficulty: 1 | 2 | 3;    // 1 易 / 2 中 / 3 略难
};
```

### 2.2 夏朝 · 5 题（完整）

#### Q1 · xia_1

- **difficulty**: 1
- **question_zh**: 传说里，是谁花了 13 年治水，三次路过家门都没进去？
- **question_en**: In the old stories, who spent 13 years taming floods and walked past his own home three times without going in?
- **options**:
  1. 黄帝 / Huang Di (Yellow Emperor)
  2. 大禹 / Yu the Great
  3. 后羿 / Hou Yi
  4. 神农 / Shen Nong
- **answer_index**: 1
- **explanation_zh**: 大禹治水的故事很长，但最让人记住的就是"三过家门而不入"。他不是不想家，是水不治完，大家都没家。
- **explanation_en**: Yu the Great's flood-taming story is long, but the part everyone remembers is walking past his door three times without stopping. He missed home — but if the waters weren't tamed, nobody had one.

#### Q2 · xia_2

- **difficulty**: 1
- **question_zh**: 夏朝是中国历史上第一个什么？
- **question_en**: The Xia is believed to be China's first what?
- **options**:
  1. 第一个国家（有君主的那种）/ The first state (one with a king)
  2. 第一个部落 / The first tribe
  3. 第一个城市 / The first city
  4. 第一支军队 / The first army
- **answer_index**: 0
- **explanation_zh**: 夏之前，大家是一群群部落。夏之后，才有了"王位传给儿子"的国家。这是很大的转变——从大家选首领，变成一家人接着管。
- **explanation_en**: Before Xia, people lived in tribes. After Xia, the throne started passing from father to son. That's a big switch — from picking a chief to one family running things.

#### Q3 · xia_3

- **difficulty**: 2
- **question_zh**: 大禹的儿子叫启，他做了一件让天下都议论的事，是什么？
- **question_en**: Yu's son was named Qi. He did one thing that got everyone talking. What was it?
- **options**:
  1. 发明了车 / He invented the cart
  2. 继承了父亲的王位 / He inherited his father's throne
  3. 迁都到了海边 / He moved the capital to the sea
  4. 打败了商朝 / He defeated the Shang
- **answer_index**: 1
- **explanation_zh**: 在那之前，首领是大家推举出来的。启直接继承了爸爸大禹的位置，从此"家天下"开始——这是夏朝留给历史最大的痕迹。
- **explanation_en**: Before Qi, chiefs were chosen by everyone. Qi simply took his dad's seat — and from that moment, rulers were picked by bloodline. That's Xia's biggest mark on history.

#### Q4 · xia_4

- **difficulty**: 2
- **question_zh**: 我们现在说的"夏天"的"夏"，和夏朝有关系吗？
- **question_en**: The word "Xia" in "Xia Dynasty" — is it related to "summer"?
- **options**:
  1. 有，就是夏天的意思 / Yes, it literally means summer
  2. 没关系，只是同一个字 / Not really, just the same character
  3. 意思是"大、盛大"/ It means "big" or "grand"
  4. 意思是"最早"/ It means "the earliest"
- **answer_index**: 2
- **explanation_zh**: "夏"在古代有"大"的意思。大禹的后人给自己的国家取名"夏"，是想说"我们这个国家很盛大"。和夏天的"夏"是同一个字，但意思不一样。
- **explanation_en**: In ancient Chinese, "Xia" meant "great" or "grand." Yu's descendants named their state "Xia" to say "we are magnificent." Same character as the one for summer, but different meaning.

#### Q5 · xia_5

- **difficulty**: 3
- **question_zh**: 关于夏朝，考古学家一直在争论一件事，是什么？
- **question_en**: There's one thing archaeologists are still arguing about when it comes to the Xia. What is it?
- **options**:
  1. 夏朝有没有文字 / Whether Xia had writing
  2. 夏朝是不是真的存在过 / Whether the Xia really existed
  3. 夏朝的皇帝是不是外星人 / Whether Xia kings were aliens
  4. 夏朝人吃不吃米饭 / Whether Xia people ate rice
- **answer_index**: 1
- **explanation_zh**: 夏朝的故事是口口相传的，目前还没有找到写着"夏"字的文物。所以有学者相信夏朝真的存在，也有学者在继续找证据。这个谜题还没揭开。
- **explanation_en**: The Xia's story was passed down by mouth. So far, no artifact has been found with the word "Xia" on it. Some scholars believe Xia existed; others are still digging. The mystery isn't solved yet.

---

### 2.3 商朝 · 5 题（完整）

#### Q1 · shang_1

- **difficulty**: 1
- **question_zh**: 商朝人想问老天爷问题的时候，他们用什么来占卜？
- **question_en**: When Shang people wanted to ask the gods a question, what did they use to find out the answer?
- **options**:
  1. 茶叶 / Tea leaves
  2. 乌龟壳和牛骨头 / Turtle shells and ox bones
  3. 星星的位置 / Star positions
  4. 抛铜钱 / Tossing coins
- **answer_index**: 1
- **explanation_zh**: 商朝人把问题刻在龟壳或牛骨上，再用火烤。壳上会裂出纹路，他们就看纹路来"听"老天爷的回答。这些字，就是我们说的"甲骨文"。
- **explanation_en**: Shang people carved their questions into turtle shells or ox bones, then heated them in fire. The cracks that appeared were read as the gods' reply. Those carved words are what we now call oracle bone script.

#### Q2 · shang_2

- **difficulty**: 1
- **question_zh**: 商朝人特别会做一种金属器具，是什么？
- **question_en**: The Shang were famously good at making a certain kind of metal object. What was it?
- **options**:
  1. 铁剑 / Iron swords
  2. 青铜鼎 / Bronze ding (cauldrons)
  3. 金杯子 / Gold cups
  4. 银筷子 / Silver chopsticks
- **answer_index**: 1
- **explanation_zh**: 商朝人把铜和锡混在一起，做出了又硬又漂亮的青铜器。最有名的是"鼎"——一个三条腿的大锅，用来祭祀，也是王权的象征。
- **explanation_en**: The Shang mixed copper with tin to make bronze — strong and beautiful. Their most famous pieces are "ding," huge three-legged cauldrons used in ceremonies and as symbols of royal power.

#### Q3 · shang_3

- **difficulty**: 2
- **question_zh**: 我们现在能认识的最早的汉字，是刻在哪里的？
- **question_en**: The earliest Chinese characters we can still read today — where were they carved?
- **options**:
  1. 石头墙上 / On stone walls
  2. 竹简上 / On bamboo strips
  3. 龟壳和兽骨上 / On turtle shells and animal bones
  4. 纸上 / On paper
- **answer_index**: 2
- **explanation_zh**: 甲骨文就是刻在龟壳和牛骨头上的字，是商朝人占卜留下的。它们在地下埋了 3000 多年，被人挖出来时，大家才发现——原来我们的文字这么早就有了。
- **explanation_en**: Oracle bone script was carved into turtle shells and ox bones when the Shang used them to ask the gods questions. Buried for over 3,000 years, they were finally dug up — and people realized Chinese writing started way earlier than anyone thought.

#### Q4 · shang_4

- **difficulty**: 2
- **question_zh**: 妇好是商朝的一个很特别的人，她是？
- **question_en**: Fu Hao was a very special person in the Shang. Who was she?
- **options**:
  1. 一位带兵打仗的王后 / A queen who led armies into battle
  2. 一个写字最好看的学生 / A student with the best handwriting
  3. 一位做青铜器的工匠 / A bronze-making craftsperson
  4. 一个卖茶的商人 / A tea merchant
- **answer_index**: 0
- **explanation_zh**: 妇好是商王武丁的王后，但她不只是坐在宫里——她真的带兵打过仗，还主持过祭祀。考古学家挖开她的墓，发现里面有很多武器和青铜器，非常特别。
- **explanation_en**: Fu Hao was Queen to King Wu Ding of Shang, but she didn't just sit in the palace — she actually led armies and ran ceremonies. When archaeologists opened her tomb, they found weapons and bronzes everywhere. A very unusual queen.

#### Q5 · shang_5

- **difficulty**: 3
- **question_zh**: 商朝后来是怎么结束的？
- **question_en**: How did the Shang eventually end?
- **options**:
  1. 被一场大地震毁掉了 / A giant earthquake destroyed it
  2. 被周人打败了 / The Zhou people defeated it
  3. 自己搬去了海外 / It moved overseas
  4. 被一场瘟疫灭了 / A plague wiped it out
- **answer_index**: 1
- **explanation_zh**: 商朝最后一位王叫纣王，传说他很残暴。西边有个叫"周"的部落，联合了其他不满的人，打败了商朝。从此，周朝开始了。
- **explanation_en**: The last Shang king, King Zhou (different character from the dynasty name), was said to be cruel. A tribe called "Zhou" in the west teamed up with others who were fed up, and defeated him. That's how the Zhou Dynasty began.

---

### 2.4 周朝 · 5 题（完整）

#### Q1 · zhou_1

- **difficulty**: 1
- **question_zh**: 周朝的王把土地分给亲戚和功臣去管，这个做法叫什么？
- **question_en**: The Zhou kings handed out land to relatives and helpers to rule on their behalf. What was this system called?
- **options**:
  1. 分封制 / The Fengjian (fief) system
  2. 选举制 / An election system
  3. 抽签制 / Drawing lots
  4. 比武制 / Winning a fight
- **answer_index**: 0
- **explanation_zh**: 周王一个人管不过来那么大的地方，就把土地分给亲戚和有功的人，让他们去当"诸侯"。诸侯每年要来给周王上贡，打仗时也要帮忙。
- **explanation_en**: The Zhou king couldn't manage such a huge territory alone, so he gave land to relatives and loyal helpers, making them "lords." These lords brought gifts every year and sent soldiers when the king needed help.

#### Q2 · zhou_2

- **difficulty**: 1
- **question_zh**: 周朝特别讲究"礼"，这里的"礼"是什么意思？
- **question_en**: The Zhou cared a lot about "li." What did "li" mean?
- **options**:
  1. 一种食物 / A kind of food
  2. 做事的规矩和仪式 / Rules and rituals for how things are done
  3. 打招呼的方式 / A way of saying hello
  4. 一种舞蹈 / A kind of dance
- **answer_index**: 1
- **explanation_zh**: "礼"不是礼物，是"该怎么做"的规矩。谁坐哪里、怎么说话、祭祀怎么排，都有讲究。周朝人相信，把规矩排好，天下就太平。
- **explanation_en**: "Li" isn't a gift — it's the rules for how things should be done. Who sits where, how to speak, how ceremonies are set up. The Zhou believed that if everyone followed the rules, the world stayed peaceful.

#### Q3 · zhou_3

- **difficulty**: 2
- **question_zh**: 有个周朝的王为了博美人一笑，点燃了报警用的烽火，结果呢？
- **question_en**: One Zhou king lit the warning beacons just to make his favorite lady smile. What happened next?
- **options**:
  1. 美人笑了，从此天下太平 / She smiled, and peace lasted forever
  2. 诸侯白跑一趟，后来真有敌人来时没人救他 / The lords rushed for nothing, and no one came when real enemies arrived
  3. 烽火引来了一场暴雨 / The beacons brought a huge rainstorm
  4. 美人跑掉了 / The lady ran away
- **answer_index**: 1
- **explanation_zh**: 这就是"烽火戏诸侯"的故事。周幽王骗了诸侯一次，诸侯白跑了一趟很生气。后来真的有敌人来攻，他再点烽火，没人来了。西周就这样结束了。
- **explanation_en**: This is the famous "Beacon Fires" story. King You of Zhou tricked his lords once, and they were furious after rushing over for nothing. Later, when real enemies came, he lit the beacons again — and no one showed up. That's how the Western Zhou ended.

#### Q4 · zhou_4

- **difficulty**: 2
- **question_zh**: 我们今天说的"中国"这两个字，最早是在周朝的一件青铜器上发现的。那是？
- **question_en**: The two characters for "China" (Zhongguo) were first found on a Zhou-era bronze piece. What is it?
- **options**:
  1. 毛公鼎 / Mao Gong Ding
  2. 何尊 / He Zun
  3. 司母戊鼎 / Simuwu Ding
  4. 越王剑 / Sword of Goujian
- **answer_index**: 1
- **explanation_zh**: "何尊"是西周的一件青铜器，里面刻着"宅兹中国"，意思是"我住在中国这块地方"。这是"中国"两个字第一次出现，距离现在 3000 多年。
- **explanation_en**: "He Zun" is a Western Zhou bronze vessel. Inscribed inside are the words "zhai zi zhong guo" — "I live in the central lands." That's the first time "Zhongguo" (China) appears in writing, over 3,000 years ago.

#### Q5 · zhou_5

- **difficulty**: 3
- **question_zh**: 孔子、孟子这些大思想家，是什么时候出现的？
- **question_en**: Big thinkers like Confucius and Mencius — when did they live?
- **options**:
  1. 商朝末年 / At the end of the Shang
  2. 周朝后半段（春秋战国）/ The second half of Zhou (the Spring-Autumn and Warring States era)
  3. 秦朝统一以后 / After Qin unified China
  4. 唐朝 / The Tang
- **answer_index**: 1
- **explanation_zh**: 周朝后期，天下很乱，诸侯打来打去。正因为乱，很多人开始思考"人该怎么活、国家该怎么治"。孔子、孟子、老子都是这个时候出现的，后来被叫做"百家争鸣"。
- **explanation_en**: In late Zhou, the land was chaotic — lords kept fighting each other. Because of the mess, many people started thinking "how should people live? how should a country be run?" Confucius, Mencius, and Laozi all lived in this era. It was later called the "Hundred Schools of Thought."

---

### 2.5 关卡 4-10 · 题目占位（MVP 不展开，保留 1 道样例）

每关后续将补完 5 题，MVP 阶段只填 1 道样例作为结构校验用（r-frontend 应做空题库降级：若某关题数 < 5，关卡在首页显示"即将上线"态，不可进入，与 state-machine 第 7 节"MVP 阶段题库缺失"对应）。

#### Q1 · qin_1（秦 样例）
- **difficulty**: 1
- **question_zh**: 秦始皇第一个统一了中国。他做的一件让全国都一样的事是？
- **question_en**: Emperor Qin Shi Huang unified China. What did he do to make the whole country "the same"?
- **options**:
  1. 让所有人穿一样的衣服 / Made everyone wear the same clothes
  2. 统一了文字和度量 / Standardized writing and measurements
  3. 让所有人吃一样的饭 / Made everyone eat the same food
  4. 给每个人取一样的名字 / Gave everyone the same name
- **answer_index**: 1
- **explanation_zh**: 秦朝之前，每个地方写字、称重、量长度都不一样。秦始皇规定全国用同一种文字、同一种秤、同一种尺。从此"一个中国"的感觉就建立起来了。
- **explanation_en**: Before Qin, each region had its own writing, weights, and measurements. Qin Shi Huang made everyone use the same script, the same scales, the same rulers. That's when "one China" really started feeling like one place.

#### Q1 · han_1（汉 样例）
- **difficulty**: 1
- **question_zh**: 汉朝有一条通往西方的大路，骆驼驮着丝绸走了好远，它叫？
- **question_en**: The Han had a long road running west, with camels carrying silk for thousands of miles. What was it called?
- **options**:
  1. 丝绸之路 / The Silk Road
  2. 黄金之路 / The Gold Road
  3. 茶马古道 / The Tea-Horse Road
  4. 大运河 / The Grand Canal
- **answer_index**: 0
- **explanation_zh**: 丝绸之路不是一条路，是一大片商人走出来的路网。骆驼驮着中国的丝绸、瓷器往西走，再把葡萄、胡萝卜、香料驮回来。东西方就这样开始认识了。
- **explanation_en**: The Silk Road wasn't really one road — it was a web of paths traders made with their feet. Camels carried silk and porcelain west, and brought back grapes, carrots, and spices. That's how East and West first got to know each other.

#### Q1 · sanguo_1（三国 样例）
- **difficulty**: 1
- **question_zh**: 三国时期，有一个很会打仗又很会写文章的人，他既是政治家又是诗人，是？
- **question_en**: In the Three Kingdoms era, one man was famous for both fighting wars and writing poetry. Who was he?
- **options**:
  1. 刘备 / Liu Bei
  2. 曹操 / Cao Cao
  3. 孙权 / Sun Quan
  4. 诸葛亮 / Zhuge Liang
- **answer_index**: 1
- **explanation_zh**: 曹操在故事里常常是"反派"，但真实的他特别厉害——会打仗、会治国、还写出了很多漂亮的诗。"老骥伏枥，志在千里"就是他写的。
- **explanation_en**: In the stories, Cao Cao is often painted as the villain — but the real Cao Cao was impressive. He fought battles, ran a state, and wrote beautiful poems. "An old warhorse in its stall still dreams of a thousand miles" — that line is his.

#### Q1 · suitang_1（隋唐 样例）
- **difficulty**: 1
- **question_zh**: 唐朝最有名的诗人，爱喝酒，被叫做"诗仙"，是谁？
- **question_en**: The Tang's most famous poet loved wine and was nicknamed the "Immortal of Poetry." Who was he?
- **options**:
  1. 杜甫 / Du Fu
  2. 白居易 / Bai Juyi
  3. 李白 / Li Bai
  4. 王维 / Wang Wei
- **answer_index**: 2
- **explanation_zh**: 李白的诗豪气、浪漫，像山像水。他一边喝酒一边写，写出来的东西别人怎么学都学不会。所以大家叫他"诗仙"——写诗像神仙。
- **explanation_en**: Li Bai's poems are bold and dreamy, like mountains and rivers. He drank while he wrote, and the words flowed so freely that no one could match him. People called him the "Immortal of Poetry" — a poet like a god.

#### Q1 · song_1（宋 样例）
- **difficulty**: 1
- **question_zh**: 宋朝有个叫毕昇的人发明了一种印刷方式，特别厉害，是？
- **question_en**: In the Song, a man named Bi Sheng invented a new way of printing. What was it?
- **options**:
  1. 活字印刷 / Movable-type printing
  2. 3D 打印 / 3D printing
  3. 手抄 / Hand copying
  4. 用印章盖章 / Stamp printing
- **answer_index**: 0
- **explanation_zh**: 以前印书，要把一整页字刻在一块木板上。毕昇想了个办法——把每个字都做成一小块，用完拆开还能再拼新书。这就是活字印刷，欧洲比中国晚了 400 年才有。
- **explanation_en**: Before Bi Sheng, each page had to be carved onto one big wooden block. He came up with a clever idea — make each character its own little piece, so you can mix and match for a new book. That's movable type. Europe got it 400 years later.

#### Q1 · yuan_1（元 样例）
- **difficulty**: 1
- **question_zh**: 元朝的时候，一个意大利人来到中国，后来写了一本书讲中国有多好玩，他是？
- **question_en**: During the Yuan, an Italian traveler came to China and later wrote a book about how amazing it was. Who was he?
- **options**:
  1. 哥伦布 / Columbus
  2. 马可·波罗 / Marco Polo
  3. 达·芬奇 / Leonardo da Vinci
  4. 牛顿 / Newton
- **answer_index**: 1
- **explanation_zh**: 马可·波罗是从意大利跋山涉水来到元朝的。他在中国待了很多年，回去后写了一本书，把中国写得像个奇幻世界。欧洲人读了都想来看看。
- **explanation_en**: Marco Polo traveled from Italy all the way to Yuan China. He stayed for years, then went home and wrote a book that made China sound like a fairytale land. Europeans who read it all wanted to see it too.

#### Q1 · mingqing_1（明清 样例）
- **difficulty**: 1
- **question_zh**: 明朝有个大航海家，带着几百艘大船七次下西洋，他是？
- **question_en**: A great Ming navigator led hundreds of ships on seven voyages to the "Western Seas." Who was he?
- **options**:
  1. 郑和 / Zheng He
  2. 戚继光 / Qi Jiguang
  3. 徐霞客 / Xu Xiake
  4. 李时珍 / Li Shizhen
- **answer_index**: 0
- **explanation_zh**: 郑和带的船队，比后来哥伦布的船队大得多。他们去过东南亚、印度、甚至非洲。带回来的不是金银，是交朋友、送礼物、做买卖。
- **explanation_en**: Zheng He's fleet was much bigger than Columbus's later voyages. They sailed to Southeast Asia, India, even Africa. What they brought back wasn't gold — it was friendships, gifts, and trade deals.

---

## 3. 知识卡（Cards · 10 张，MVP 前 3 张完整）

### 3.1 数据结构

```typescript
type Card = {
  id: string;               // "card_xia"
  dynasty: string;          // dynastyId
  type: 'person' | 'object' | 'event';
  name_zh: string;
  name_en: string;
  image_desc: string;       // 给插画 / AI 生图的视觉描述
  story_zh: string;         // ≤ 120 中文字
  story_en: string;         // ≤ 200 英文词
};
```

### 3.2 夏朝知识卡 · 大禹（人物）

- **id**: `card_xia`
- **dynasty**: xia
- **type**: person
- **name_zh**: 大禹
- **name_en**: Yu the Great
- **image_desc**: 一位年轻男子站在汹涌的水边，手里拿着简单的木质工具（耒耜），风吹着他的衣襟。他身后是刚刚退去洪水的田野，有几只鸟在飞。表情专注但温和，不是英雄般的威严，是"做事的人"的那种沉着。线条简洁，赭石与青瓷调。
- **story_zh**: 大禹的爸爸治水治了很多年，没成功。大禹接手后，不再像爸爸那样堵，而是挖沟让水流走。他走遍所有河流，13 年没回家一次。人们说他经过家门都没停下——不是不想家，是水不治完，大家都没家。
- **story_en**: Yu's father spent years trying to block the floods, but never succeeded. Yu tried something different — instead of blocking water, he dug channels to let it flow away. He walked along every river for 13 years and didn't go home once. People say he passed his own door three times without stopping. He missed his family. But if the waters weren't tamed, nobody had a home to go to.

### 3.3 商朝知识卡 · 甲骨（器物）

- **id**: `card_shang`
- **dynasty**: shang
- **type**: object
- **name_zh**: 甲骨
- **name_en**: Oracle Bones
- **image_desc**: 一块乌龟的腹甲（或牛肩胛骨），米白色，表面有自然裂纹和细小的刻字。光影从侧面打过来，能看出字是刻得很用力的。背景是一块深色木桌，旁边放一支青铜刻刀。不做任何神秘化处理，像一件博物馆里的静物。
- **story_zh**: 3000 多年前，商朝的人有问题想问老天，就把问题刻在乌龟壳或牛骨头上，再用火烤。裂开的纹路，就是老天的"回答"。这些刻字的壳埋在地下很久，被人挖出来时才发现——我们的汉字，原来从这里开始。
- **story_en**: Over 3,000 years ago, Shang people carved their questions into turtle shells or ox bones, then held them over fire. The cracks that appeared were read as answers from the gods. These shells stayed buried for centuries. When they were finally dug up, scholars realized something amazing — Chinese writing, as we know it, started right here, on these cracked pieces of bone.

### 3.4 周朝知识卡 · 烽火戏诸侯（事件）

- **id**: `card_zhou`
- **dynasty**: zhou
- **type**: event
- **name_zh**: 烽火戏诸侯
- **name_en**: The Lit Beacons
- **image_desc**: 远处山顶有一座烽火台，浓烟和火光升起。山下道路上，几队诸侯骑马奔来，队伍有点凌乱。画面右侧是城楼上两个小小的身影——一位王和一位妃子，神情各异。整体色调是黄昏的赭红，不夸张血腥，有一种"一场闹剧"的轻戏剧感。
- **story_zh**: 周幽王有个很爱的妃子叫褒姒，可她从不笑。为了逗她开心，周幽王点燃了报警用的烽火。诸侯以为有敌人，从各地赶来，结果发现被骗了。褒姒看见了，终于笑了。可后来真的有敌人来攻，王再点烽火——没人来。
- **story_en**: King You of Zhou loved a lady named Bao Si, but she never smiled. To make her laugh, the king lit the warning beacons. Lords from everywhere rushed over, only to find there was no enemy. Bao Si finally smiled. But when real enemies came later, the king lit the beacons again. This time, no one came. The kingdom fell not long after.

### 3.5 关卡 4-10 · 卡片占位（结构写全，故事 MVP 留空或简写）

| id | dynasty | type | name_zh | name_en | 简写（MVP 占位） |
|----|---------|------|---------|---------|----------------|
| card_qin | qin | person | 秦始皇 | Qin Shi Huang | 第一个皇帝，统一了文字、度量、货币，修了长城。 |
| card_han | han | object | 汉代纸 | Han-era Paper | 蔡伦改进了造纸术，薄薄的一张，从此写字不用竹简。 |
| card_sanguo | sanguo | event | 草船借箭 | Borrowing Arrows with Straw Boats | 诸葛亮一夜之间借来十万支箭的妙计。 |
| card_suitang | suitang | person | 李白 | Li Bai | 爱喝酒写诗的"诗仙"，写山像在飞。 |
| card_song | song | object | 活字印刷 | Movable Type | 毕昇发明的印刷法，每个字都能拆开重新拼。 |
| card_yuan | yuan | event | 马可·波罗来华 | Marco Polo in China | 一个意大利人走进元朝，把中国写成了传奇。 |
| card_mingqing | mingqing | object | 郑和宝船 | Zheng He's Treasure Ships | 明朝大船队七次下西洋，带回的不是金子是朋友。 |

---

## 4. 满分徽章（Badges · 10 枚）

### 4.1 数据结构

```typescript
type Badge = {
  id: string;               // "badge_xia"
  dynasty: string;
  name_zh: string;          // 徽章名（很短）
  name_en: string;
  image_desc: string;       // 图形描述
  story_zh: string;         // ≤ 30 中文字，一句话
  story_en: string;         // ≤ 50 英文词
};
```

### 4.2 10 枚徽章清单

| id | dynasty | name_zh | name_en | image_desc | story_zh | story_en |
|----|---------|---------|---------|-----------|---------|---------|
| badge_xia | xia | 治水章 | Flood Tamer | 一滴水形状的印章，中间一道弯弯的河流 | 你像大禹一样有耐心。 | Patient like Yu the Great. |
| badge_shang | shang | 甲骨章 | Oracle Mark | 一块龟壳上的裂纹 | 你读懂了最早的字。 | You read the oldest words. |
| badge_zhou | zhou | 礼乐章 | Rite & Music | 一只古朴的编钟侧影 | 你懂了规矩的意思。 | You see why rules matter. |
| badge_qin | qin | 一统章 | Unifier | 一把方方正正的"统一"印 | 你把零碎拼成了整个。 | You made scattered into whole. |
| badge_han | han | 丝路章 | Silk Path | 一头走着的骆驼剪影 | 你走过了最长的路。 | You walked the longest road. |
| badge_sanguo | sanguo | 智谋章 | Clever Mind | 一把羽毛扇 | 你有诸葛亮的脑子。 | You think like Zhuge Liang. |
| badge_suitang | suitang | 诗心章 | Poet's Heart | 一支古典毛笔和一弯月 | 你心里有诗。 | Poetry lives in you. |
| badge_song | song | 活字章 | Type Mark | 一块活字印章 | 你拼出了新的故事。 | You pieced a new story. |
| badge_yuan | yuan | 远行章 | Far Traveler | 一片马蹄印加一颗星 | 你走得比马可·波罗还远。 | Farther than Marco Polo. |
| badge_mingqing | mingqing | 远航章 | Voyager | 一艘剪影里的宝船 | 你和郑和一起看见了海。 | You saw the sea with Zheng He. |

---

## 5. UI 文案 Key 清单（locale 对照表）

供 r-frontend 对照使用，zh.json / en.json 两端 key 必须完全一致。

### 5.1 导航与全局

| Key | 用途 | 备注 |
|-----|------|------|
| `nav.home` | 首页标题 | "朝代图谱" / "Dynasty Map" |
| `nav.cards` | 卡册入口 | "我的卡册" / "My Cards" |
| `nav.back` | 通用返回 | 图标 aria-label |
| `nav.lang_zh` | 语言切换-中文 | "中" |
| `nav.lang_en` | 语言切换-英文 | "EN" |
| `nav.theme_light` | 主题-明 | aria-label |
| `nav.theme_dark` | 主题-暗 | aria-label |
| `nav.theme_system` | 主题-跟随系统 | |
| `brand.name` | 产品名 | "迷人的老祖宗" / "Charming Ancestors" |
| `brand.tagline` | 副标题 | 一句话定位 |

### 5.2 首页 / 朝代图谱

| Key | 用途 |
|-----|------|
| `home.welcome_first.title` | 首次访问欢迎标题 |
| `home.welcome_first.body` | 首次访问欢迎正文 |
| `home.welcome_first.cta` | 引导按钮 "从夏朝开始" |
| `home.welcome_return.title` | 回访欢迎 |
| `home.progress_summary` | 进度摘要 "{cleared}/10 关 · {perfect}/10 全对" |
| `home.wrong_entry` | 错题回看入口 "再来看一眼（{count} 题）" |
| `home.cards_hint` | 已解锁卡缩略区说明 |
| `home.section_dynasties` | 10 关区标题 |

### 5.3 朝代卡片（图谱上每张）

| Key | 用途 |
|-----|------|
| `dynasty.xia.name` ~ `dynasty.mingqing.name` | 10 关朝代名 |
| `dynasty.xia.era` ~ `dynasty.mingqing.era` | 10 关时代关键词 |
| `dynasty.status.locked` | 状态-锁定 "还没解锁" |
| `dynasty.status.locked_hint` | 锁定提示 "通关{prev}朝解锁" |
| `dynasty.status.unlocked` | 状态-可开始 "开始" |
| `dynasty.status.in_progress` | 状态-进行中 "继续（{current}/5）" |
| `dynasty.status.cleared` | 状态-已通关 "{score}/5" |
| `dynasty.status.perfect` | 状态-满分 "全对 ★" |
| `dynasty.status.coming_soon` | MVP 占位 "即将上线" |
| `dynasty.cta.start` | 开始按钮 |
| `dynasty.cta.continue` | 继续按钮 |
| `dynasty.cta.replay` | 重玩按钮 |
| `dynasty.replay_confirm.title` | 重玩确认标题 |
| `dynasty.replay_confirm.body` | 重玩确认正文 |
| `dynasty.replay_confirm.ok` | 确认 |
| `dynasty.replay_confirm.cancel` | 取消 |

### 5.4 答题页

| Key | 用途 |
|-----|------|
| `quiz.progress` | "第 {current}/{total} 题" |
| `quiz.option_prefix` | 选项前缀 A/B/C/D（可选） |
| `quiz.feedback_correct.title` | 答对标题 "没错！" |
| `quiz.feedback_wrong.title` | 答错标题 "再想想" |
| `quiz.feedback.explanation_label` | 解释区标签 "为什么" |
| `quiz.feedback.correct_answer_label` | 正确答案标签 "正确答案是" |
| `quiz.cta.next` | 下一题 |
| `quiz.cta.settle` | 第 5 题后按钮 "看结果" |
| `quiz.confirm_exit.title` | 返回确认标题 |
| `quiz.confirm_exit.body` | 返回确认正文 |
| `quiz.confirm_exit.continue` | 继续答题 |
| `quiz.confirm_exit.keep` | 回首页保留进度 |
| `quiz.confirm_exit.discard` | 放弃本关 |
| `quiz.load_error.title` | 加载失败 |
| `quiz.load_error.retry` | 再试一次 |
| `quiz.load_error.give_up` | 先回首页 |

### 5.5 结算页

| Key | 用途 |
|-----|------|
| `result.banner.perfect` | 满分横幅 "全对！" |
| `result.banner.cleared` | 通关横幅 "闯关成功" |
| `result.score` | "{score} / 5" |
| `result.card_reveal.label` | 卡片揭示提示 "解锁了一张新卡" |
| `result.card_reveal.again` | 重玩时 "这张卡你已经有了" |
| `result.badge_reveal.label` | 徽章揭示提示 "得到了一枚徽章" |
| `result.wrong_entry` | 本关错题入口 "看看刚才哪里差一点" |
| `result.cta.next_dynasty` | 下一关 "进入 {dynasty}" |
| `result.cta.home` | "回到朝代图谱" |
| `result.cta.replay` | "再玩一次这一关" |
| `result.all_done.title` | 通关全部关卡（最后一关）标题 |
| `result.all_done.body` | 通关全部关卡文案 |

### 5.6 MidQuizPrompt（未完成关卡提示）

| Key | 用途 |
|-----|------|
| `mid_quiz.title` | 标题 |
| `mid_quiz.body` | 正文 "你在{dynasty}的第{current}题停下了" |
| `mid_quiz.cta.continue` | 继续 |
| `mid_quiz.cta.restart` | 从头再来 |
| `mid_quiz.cta.discard` | 放弃，回首页 |

### 5.7 知识卡详情

| Key | 用途 |
|-----|------|
| `card.category.person` | 分类标签 "人物" |
| `card.category.object` | 分类标签 "器物" |
| `card.category.event` | 分类标签 "事件" |
| `card.from_dynasty` | "来自 {dynasty}" |
| `card.close` | 关闭按钮 aria-label |

### 5.8 卡册页

| Key | 用途 |
|-----|------|
| `cards_page.title` | 标题 "我的卡册" |
| `cards_page.progress` | "{unlocked}/10 已解锁" |
| `cards_page.locked_hint` | 未解锁卡 hover/tap 提示 "通关 {dynasty} 朝代解锁" |
| `cards_page.empty.title` | 空态标题 "还是一本空册子" |
| `cards_page.empty.body` | 空态正文 "去朝代图谱闯过第一关吧" |
| `cards_page.empty.cta` | 空态 CTA |

### 5.9 错题回看

| Key | 用途 |
|-----|------|
| `wrong.title` | 标题 "再来看一眼" |
| `wrong.filter.all` | 筛选-全部 |
| `wrong.filter.by_dynasty` | 筛选-按朝代 |
| `wrong.item.your_answer` | "你选的：" |
| `wrong.item.correct_answer` | "正确答案：" |
| `wrong.item.explanation` | "为什么：" |
| `wrong.empty.title` | 空态 "太棒了" |
| `wrong.empty.body` | 空态正文 |

### 5.10 空态 / 错误 / Toast

| Key | 用途 |
|-----|------|
| `empty.generic` | 通用空态 |
| `error.not_found.title` | 404 标题 |
| `error.not_found.body` | 404 正文 |
| `error.not_found.cta` | 回首页 |
| `error.dynasty_not_found` | toast "找不到这个朝代" |
| `error.dynasty_locked` | toast "先通关前面的朝代" |
| `error.card_locked` | toast "这张卡还没解锁" |
| `error.storage_full` | toast "进度可能无法保存" |
| `error.storage_reset` | toast "数据已重置" |
| `error.storage_unavailable` | toast "进度不会保存（隐私模式）" |

### 5.11 复数形式（英文用 ICU plural）

| Key | 用途 |
|-----|------|
| `count.questions` | "{count, plural, one {# 题} other {# 题}}" vs "{count, plural, one {# question} other {# questions}}" |
| `count.cards` | 卡片数 |
| `count.wrong` | 错题数 |
| `count.dynasties` | 朝代数 |

---

## 6. 文案风格守则（给下游 UX 写作者参考）

### 6.1 语气

- **面对孩子**：不说教、不夸奖过度、不卖萌
- **像学校里最受欢迎的语文老师**：有知识但不炫耀，讲故事不催促
- **不完美也没关系**：错题提示从不用"错"字，"再想想"、"差一点"、"再来看一眼"

### 6.2 禁用词

**中文禁用**：答错、错误、失败、淘汰、优秀、成就解锁、通关率、继续努力（说教感）、加油鸭（网络流行语）、打卡、闯关成功率、正确率

**英文禁用**：Wrong、Failed、Incorrect、Try Harder、Keep going!、You got it wrong、Congratulations!!! (多感叹号)、Awesome job!!! (过度热情)

### 6.3 推荐词

**中文推荐**：再想想、差一点、再看看、慢慢来、你发现了、解锁了、得到了、原来如此、接着试、没错、闯过了

**英文推荐**：Not quite、Almost、Take another look、You've found、Unlocked、Got it、Oh! So that's it、Give it another go、Yes!、Cleared

### 6.4 句式

- **短句优先**：儿童阅读 span 有限，一句话尽量不超过 20 字
- **动词开头**：「解锁了一张新卡」>「一张新卡被解锁」
- **避免被动语态**（英文尤其）
- **英文用 contraction**：You've / It's / Don't，更口语化

### 6.5 插值变量规范

| 变量 | 含义 | 示例 |
|------|------|------|
| `{dynasty}` | 朝代名（按当前语言） | "夏" / "Xia" |
| `{prev}` | 前一关朝代名 | "夏" / "Xia" |
| `{current}` | 当前题号（1-5） | "2" |
| `{total}` | 总题数（固定 5） | "5" |
| `{score}` | 得分 | "3" |
| `{count}` | 数量（配合 plural） | "3" |
| `{unlocked}` | 已解锁数 | "4" |
| `{cleared}` | 已通关数 | "5" |
| `{perfect}` | 满分数 | "2" |

---

## 7. 交接

| 交给谁 | 用到本文件的什么 |
|--------|----------------|
| r-frontend | 全量题库 + 卡片 + 徽章 JSON 化 / locale-zh.json + locale-en.json 直接加载 / key 清单对照 |
| r-designer | 第 5 节 key 清单 → Schema 每个文本节点绑到 key |
| r-pencil | 第 2/3 节内容填入 .pen 原型（MVP 前 3 关） |
| r-qa | 第 6 节风格守则 → 文案一致性检查 / 禁用词 grep / 中英 key 对齐检查 |
| 插画团队（未来） | 第 3 节 `image_desc` 字段 → 卡片插画 brief |
