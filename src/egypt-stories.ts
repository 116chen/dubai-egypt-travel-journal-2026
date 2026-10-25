import journalData from './data/journal.json';

type OriginalStory = (typeof journalData.stories)[number];
export type EgyptStory = OriginalStory & {
  authored?: boolean;
  kind?: 'memory' | 'online-joke';
  sources?: { title: string; url: string }[];
};

// User-supplied recollections. Reuse the original three IDs so browser notes
// and drafts remain attached; keep the fourth original highway story.
export const egyptStories: EgyptStory[] = [
  {
    id: 'egyptmeal', photo: 'p-0025', theme: 'paper',
    title: '难吃的埃及菜，跟粑粑一样。',
    dateLabel: '埃及 · 饭桌前', sticker: '胃的考验',
    text: '难吃的埃及菜，跟粑粑一样。眼睛在旅行，胃在参加《变形记》。',
    authored: true, kind: 'memory',
  },
  {
    id: 'one-dollar', photo: null, theme: 'orange',
    title: '随处都能听到 one dollar。',
    dateLabel: '埃及 · 砍价', sticker: 'one dollar',
    text: '随处都能听到“one dollar”。这趟遇到的报价，有的可以一折砍价。',
    authored: true, kind: 'memory',
  },
  {
    id: 'selling-sop', photo: null, theme: 'green',
    title: '一套属于他们的售卖 SOP。',
    dateLabel: '埃及 · 街头推销', sticker: 'China Number one',
    text: '“Where are you from?”\n“China.”\n“China Number one!”\n然后就开始推销。\n\n我说自己是泰国人、日本人，他们都有各自的流程。只有我说自己是越南人的时候，他们不知道该说些什么了，只剩一句：“Welcome to Egypt.”',
    authored: true, kind: 'memory',
  },
  {
    id: 'dollar-magic', photo: null, theme: 'orange',
    title: '用魔法打败魔法。',
    dateLabel: '埃及 · 街头', sticker: '反向 one dollar',
    text: '用魔法打败魔法：他向你“one dollar”，你也向他“one dollar”。',
    authored: true, kind: 'memory',
  },
  {
    id: 'taxi-aircon', photo: null, theme: 'green',
    title: '空调半路加价，电话打了一路。',
    dateLabel: '埃及 · 坐车', sticker: '真怕被卖了',
    text: '开空调半路加价。司机边开车边打电话，打了一路，真怕他把我们卖了。',
    authored: true, kind: 'memory',
  },
  {
    id: 'hurghada-car', photo: null, theme: 'paper',
    title: '一辆轿车，坐了七个人。',
    dateLabel: '赫尔格达 · 去市中心', sticker: '后备箱也能坐',
    text: '去赫尔格达市中心，一辆轿车坐了7个人，后备箱也能坐两个。',
    authored: true, kind: 'memory',
  },
  {
    ...journalData.stories.find((story) => story.id === 'highway')!,
    kind: 'memory',
  },
  {
    id: 'leopard-sister', photo: null, theme: 'paper',
    title: '豹纹姐的一顿日料。',
    dateLabel: '同行的人 · 聊天', sticker: '还是有钱的',
    text: '同行的豹纹姐，一顿日料1w多。还是有钱的。',
    authored: true, kind: 'memory',
  },
  {
    id: 'abu-training', photo: 'p-0109', theme: 'orange',
    title: '凌晨两点半，像来军训的。',
    dateLabel: '阿布辛贝 · 在路上', sticker: '来军训了',
    text: '凌晨2:30起来去阿布辛贝，然后再去另一个神庙，一整天都在路上。感觉自己是来军训的。',
    authored: true, kind: 'memory',
  },
  {
    id: 'crossing', photo: null, theme: 'orange',
    title: '没有红绿灯，过马路看运气。',
    dateLabel: '埃及 · 过马路', sticker: '靠运气',
    text: '这一路走过的马路，没有红绿灯，过马路完全看运气。除了看古迹，还顺便考验了一下胆量。',
    authored: true, kind: 'memory',
  },
  {
    id: 'valley-memory', photo: null, theme: 'green',
    title: '帝王谷，我戏称“恶人谷”。',
    dateLabel: '帝王谷 · 旅行里的历史', sticker: '黄金面具',
    text: '帝王谷，我戏称“恶人谷”。这里发现的一座保存较完整的王室陵墓，是图坦卡蒙的KV62墓；他也是那副著名黄金面具的主人。',
    authored: true, kind: 'memory',
    sources: [
      { title: '图坦卡蒙墓（埃及文物部）', url: 'https://egymonuments.gov.eg/monuments/tomb-of-tutankhamun/' },
      { title: '图坦卡蒙金棺与面具（埃及文物部）', url: 'https://egymonuments.gov.eg/news/gilded-coffin-of-king-tutankhamun/' },
    ],
  },
  {
    id: 'seawater', photo: 'p-0355', theme: 'blue',
    title: '红海水，半个元素周期表。',
    dateLabel: '红海 · 第一次浮潜', sticker: '下次不玩了',
    text: '猛灌了几口红海水，感觉喝了半个元素周期表的东西。第一次尝试浮潜，很好玩，下次不玩了。',
    authored: true, kind: 'memory',
  },
  {
    id: 'pyramid-empty', photo: null, theme: 'paper',
    title: '金字塔里面，突然悟了。',
    dateLabel: '金字塔 · 我的感慨', sticker: '一场空？',
    text: '金字塔的里面是什么？我看到的是一具空棺材。突然领悟生命的终极奥秘——一场空？？？',
    authored: true, kind: 'memory',
  },
  {
    id: 'nile-wrestling', photo: 'p-0261', theme: 'blue',
    title: '尼罗河上，被小哥吊打。',
    dateLabel: '尼罗河 · 帆船', sticker: '他三拳我头七',
    text: '尼罗河的帆船上，两位开船小哥很会调动气氛，和我们掰手腕，喊着“one dollar, one dollar”，载歌载舞。\n\n被小哥吊打。和他打三七开：他三拳，我头七。也加了他的 WhatsApp，把照片发给了他。',
    authored: true, kind: 'memory',
  },
  {
    id: 'balloon-first', photo: 'p-0283', theme: 'green',
    title: '第一次热气球，看日出。',
    dateLabel: '卢克索 · 热气球', sticker: '一点也不安全',
    text: '第一次坐热气球，视野很好，看着日出。看似很危险，实则一点也不安全。',
    authored: true, kind: 'memory',
  },
  {
    id: 'camel-joke', photo: null, theme: 'paper',
    title: '第一笔给他，第二笔给骆驼？',
    dateLabel: '网上看到的段子 · 骑骆驼', sticker: '网上段子',
    text: '网上看到的段子：在金字塔骑骆驼，准备下去了，对方却说：“你付的第一笔钱是给我的，还有一笔骆驼的呢？”',
    authored: true, kind: 'online-joke',
  },
  {
    id: 'daughters-joke', photo: null, theme: 'orange',
    title: '还有二女儿和三女儿呢？',
    dateLabel: '网上看到的段子 · 卖可怜', sticker: '网上段子',
    text: '网上看到的另一个段子：对方卖可怜，说家里有三个女儿要养。给了钱，又说：“这钱是给第一个女儿的，那二女儿和三女儿的呢？”',
    authored: true, kind: 'online-joke',
  },
];
