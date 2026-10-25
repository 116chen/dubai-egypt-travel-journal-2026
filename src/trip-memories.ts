export type TripMemory = { id: string; title: string; text: string };
export type TripMemories = { title: string; entries: TripMemory[] };

// Personal recollections supplied by the author. Keep uncertain details as
// recollections, without assigning unprovided dates, currencies or identities.
export const tripMemories: Record<string, TripMemories> = {
  'japan-spring': {
    title: '第一次去日本',
    entries: [
      {
        id: 'station-encounter',
        title: '刚下地铁，就有点不舒服',
        text: '第一次去日本，刚从地铁站下来，就被小学生喊了一声“ji nei”。有点恶心。',
      },
      {
        id: 'street-leaflet',
        title: '街头的传单',
        text: '路上碰到有人发传单，内容大意是：中国和日本是友好国家，要统一面向美国，美国在日本建军事基地。',
      },
      {
        id: 'kamakura-students',
        title: '镰仓，帮女高中生拍照',
        text: '在镰仓的时候，帮几位日本女高中生拍了几张照片。她们很有活力，下午三点就下课了。',
      },
      {
        id: 'expensive-ramen',
        title: '看错价格的一碗拉面',
        text: '看错价格，误食天价拉面。以为付80，结果付了800。店员还学了一句中文：“好吃吗？”',
      },
      {
        id: 'akihabara-signs',
        title: '秋叶原，举着牌子的女生',
        text: '秋叶原街头有很多女生站在那里，举着牌子。具体价格已经忘了，但我问了她们一些问题，她们说只是陪酒。',
      },
      {
        id: 'airport-directions',
        title: '去机场路上的惊险',
        text: '去机场的路上，被一脸笑意的日本老头坑了。他说这条线不是去机场的，差点给我耽误了飞机。',
      },
      {
        id: 'fuji-colleague',
        title: '富士山，飞书里的缘分',
        text: '在富士山碰到了同事，是字节的法务。缘分是在车上看见对方也打开了飞书。',
      },
      {
        id: 'friday-omakase',
        title: '周五晚上的 omakase',
        text: '周五晚上，乱入了本地的一家 omakase，和他们坐在一起。虽然没怎么听懂他们在说什么，但那种周五晚上下班、喝酒的惬意，却都差不多。',
      },
      {
        id: 'shibuya-photographer',
        title: '在涩谷 SKY 当摄影师',
        text: '在涩谷 SKY 当摄影师，帮每个人拍照，还加了他们的 WhatsApp。',
      },
    ],
  },
  'japan-summer': {
    title: '第二次去日本',
    entries: [
      {
        id: 'queue-encounter',
        title: '插队，还把我拽到后面',
        text: '第二次去日本，被一个日本大汉插队，还一把把我拽到后面？？？当时看他的气质，觉得可能是军官。',
      },
      {
        id: 'ine-doctoral-student',
        title: '去伊根路上，聊了很多',
        text: '去伊根町的时候，碰到一位中国地质大学的留学博士，一路上聊了很多。她还给我介绍了她的学妹，可惜没有什么缘分，也就没有什么后续。',
      },
      {
        id: 'fushimi-storm',
        title: '暴雨里的伏见稻荷',
        text: '暴雨天去爬了京都伏见稻荷神社，又是打雷，又是下雨。那天差点就交代在那里了。',
      },
      {
        id: 'kamogawa-afternoon',
        title: '鸭川，什么也不想',
        text: '在鸭川坐了一下午。没什么事情，就那么安静地坐着，什么也不想。',
      },
      {
        id: 'ine-tour-guide',
        title: '从欧洲厨师，到日本导游',
        text: '那天去伊根町，报了个团。导游也是个能人，福建籍，最开始在欧洲做厨师，现在在日本做导游，也已经移民到日本。',
      },
    ],
  },
};

export function memoriesMarkdown(memories?: TripMemories) {
  return memories ? `## ${memories.title} · 小记\n\n${memories.entries.map((entry) => `### ${entry.title}\n\n${entry.text}`).join('\n\n')}` : '';
}
