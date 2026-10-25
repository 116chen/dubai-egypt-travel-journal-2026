export type TripChapter = {
  id: string;
  title: string;
  paragraphs: string[];
  photoIds: string[];
  placeIds: string[];
};
export type DayStory = { date: string; title: string; text: string; coverId: string };
export type PlaceStory = { text: string; details: string[]; photoIds: string[] };
export type TripEditorial = {
  lead: string;
  chapterHeading: string;
  chapters: TripChapter[];
  days: DayStory[];
  places: Record<string, PlaceStory>;
  notePrompts: string[];
};
const photos = (trip: string, ...numbers: number[]) => numbers.map((number) => `${trip}-${String(number).padStart(3, '0')}`);

export const tripEditorial: Record<string, TripEditorial> = {
  'new-zealand': {
    lead: '湖面上的蓝、山坡上的金色，还有海水里的动物。十天的照片从奥克兰展开，穿过南岛，再回到城市与机场。',
    chapterHeading: '把南岛，收进三段风景。',
    chapters: [
      {
        id: 'lakes-and-snow', title: '白天看湖，夜里抬头。',
        paragraphs: [
          '蒂卡波湖的照片里，雪山、金色草坡和蓝色水面占据了大部分画面。沿着湖岸走，坐在长椅上，再到好牧羊人教堂旁停一会儿，同一片湖有了不同的角度。',
          '翻到夜里的照片，教堂缩成星空下的一点轮廓。之后是普卡基湖、山谷里的河道，以及停在雪地上的直升机：湖与山不再只隔着一段公路。',
        ],
        photoIds: photos('new-zealand', 71, 126, 153), placeIds: ['tekapo', 'pukaki', 'mount-cook'],
      },
      {
        id: 'southern-autumn', title: '四月，南半球正是秋天。',
        paragraphs: [
          '箭镇的木拱门框住一棵红树。继续往外看，金色小路、石屋与整面山坡把秋色连在一起；合影和秋千让这些风景有了人的尺度。',
          '到了皇后镇，镜头从湖岸移到山顶，又回到街道和花园。瓦纳卡湖中的树、皇后镇湖湾上的天光，是这段秋日照片里安静的两页。',
        ],
        photoIds: photos('new-zealand', 186, 209, 274), placeIds: ['wanaka', 'arrowtown', 'queenstown'],
      },
      {
        id: 'coast-and-animals', title: '走到海边，风景开始动起来。',
        paragraphs: [
          '但尼丁留下车站和海蚀拱门，奥马鲁留下清晨的街角与日出。沿途的建筑有自己的轮廓，海岸则在每一张照片里换着浪花。',
          '阿卡罗阿的羊驼靠近了镜头，凯库拉的海豹睡在岩石上，海豚从船边与水下游过。相册最后再回到奥克兰的书店、公园和街道，把旅程收回到日常。',
        ],
        photoIds: photos('new-zealand', 359, 430, 493), placeIds: ['dunedin', 'oamaru', 'akaroa', 'kaikoura'],
      },
    ],
    days: [
      { date: '2026-04-25', title: '先从舷窗下的海湾开始', text: '海岸与岛屿从舷窗下展开，机场外是粉色天光。这一天的五张照片，记录的是抵达途中和路上的一餐。', coverId: 'new-zealand-013' },
      { date: '2026-04-26', title: '在蒂卡波，把湖水看个够', text: '从草坡到湖岸，从长椅到教堂，蓝色湖面始终在画面里。傍晚的水面与金色倒影，是这一天最后几页。', coverId: 'new-zealand-071' },
      { date: '2026-04-27', title: '从星空、雪地，到瓦纳卡日落', text: '这一天先留下教堂上方的星空，接着经过普卡基湖与库克山周边的雪地，最后拍下瓦纳卡湖中的树和红色晚霞。', coverId: 'new-zealand-153' },
      { date: '2026-04-28', title: '穿过箭镇的秋色', text: '木拱门、红树、秋千和金色树林构成箭镇这一组照片。后面的画面转到皇后镇，汉堡、街头音乐与湖边天色一起入镜。', coverId: 'new-zealand-186' },
      { date: '2026-04-29', title: '从高处看皇后镇', text: '山谷里的彩虹、山顶的合影和湖湾上的云层，记录了皇后镇的另一种尺度。入夜后，台阶与山坡上的灯亮起来。', coverId: 'new-zealand-274' },
      { date: '2026-04-30', title: '湖岸与花园里的慢镜头', text: '湖边的鸭子、花园的倒影、玫瑰与一杯冰淇淋。皇后镇这一天的照片更接近日常，也给山湖之间的旅程留了些空白。', coverId: 'new-zealand-308' },
      { date: '2026-05-01', title: '但尼丁，石墙之后是海', text: '教堂与车站之后，相册走向隧道海滩。海水穿过石拱门，月亮从海上升起，城市的灯在最后几张里渐渐亮起。', coverId: 'new-zealand-359' },
      { date: '2026-05-02', title: '从奥马鲁晨光，到海湾牧场', text: '奥马鲁的清晨从红色天光和海上日出开始。之后是阿卡罗阿的绿色山坡与羊驼，晚霞和夜色把画面带回基督城。', coverId: 'new-zealand-430' },
      { date: '2026-05-03', title: '凯库拉，山脉靠近海', text: '雪山在海岸背后，海豹在岩石上，海豚在船边和水下。人物与相机也留在船上的照片中，记录看海的人。', coverId: 'new-zealand-493' },
      { date: '2026-05-04', title: '回到奥克兰，再走一小段', text: '机场与飞机之后，还有奥克兰的海边、广场、书店与公园。旅途尾声的一张自拍，把风景和日常放回同一页。', coverId: 'new-zealand-535' },
    ],
    places: {
      auckland: { text: '旅程中两次遇见奥克兰。开头是空中的海湾与机场天光，结尾换成海边、书店、公园和街道，给南岛风景前后各添一页城市日常。', details: ['舷窗与机场', '书店、公园与海边'], photoIds: photos('new-zealand', 13, 535, 541, 550) },
      christchurch: { text: '这组照片集中在旅程后段：返程路上的晚霞、基督城夜色、镜头里的月亮，以及机场。它把海湾与海岸之间的行程连接起来。', details: ['返程晚霞', '城市夜色与机场'], photoIds: photos('new-zealand', 447, 451, 452, 507) },
      tekapo: { text: '雪山、草坡和湖水在白天同框，教堂、步桥与长椅给湖岸添上细节。夜里的银河则让同一个地点有了完全不同的画面。', details: ['好牧羊人教堂', '湖岸与银河'], photoIds: photos('new-zealand', 71, 107, 89, 126) },
      pukaki: { text: '公路、窗框和金色山谷之间，普卡基湖的蓝不断出现。这里的照片把远处雪山与靠近镜头的湖岸放在一起。', details: ['蓝色湖面', '去往山谷的公路'], photoIds: photos('new-zealand', 143, 134, 140, 146) },
      'mount-cook': { text: '视角从山谷中的河道升到雪地。直升机、山脊、阳光与高处的合影，把高山从远景变成了身旁的风景。', details: ['直升机与雪地', '河道、山脊与合影'], photoIds: photos('new-zealand', 153, 149, 154, 162) },
      wanaka: { text: '三张照片都留给傍晚：夕阳照进湖面，湖中的树立在水里，最后天空变成了红色。短短一组，可以慢慢看天光的变化。', details: ['湖中的树', '日落前后的天色'], photoIds: photos('new-zealand', 170, 169, 175) },
      arrowtown: { text: '木拱门里的红树、石屋外的金色树林，还有整面换色的山坡。秋千与林间合影让箭镇的秋色显得亲近。', details: ['红树与木拱门', '秋千、石屋与山坡'], photoIds: photos('new-zealand', 186, 209, 184, 224) },
      queenstown: { text: '皇后镇的照片跨了三天：山顶看湖湾，街上听吉他，湖岸吃冰淇淋，再走进花园。高处的风景与城市日常交替出现。', details: ['山顶湖湾', '湖岸、街道与花园'], photoIds: photos('new-zealand', 274, 244, 308, 301) },
      dunedin: { text: '石墙、钟塔与教堂之后是海岸。隧道海滩的岩石和海蚀拱门占了这组照片的后半段，浪花、月亮与人物一起留下来。', details: ['但尼丁车站', '隧道海滩与石拱门'], photoIds: photos('new-zealand', 359, 343, 355, 372) },
      oamaru: { text: '老建筑迎来清晨，太阳从海平面升起。街角、招牌、风景框与企鹅雕像，记录了奥马鲁这一站的不同小细节。', details: ['海上日出', '老建筑与街角'], photoIds: photos('new-zealand', 391, 380, 403, 408) },
      akaroa: { text: '海湾藏在绿色山坡之间，羊驼则从远处草地走到镜头跟前。山坡远景与近距离合影，构成这一站的两种尺度。', details: ['绿色山坡与海湾', '羊驼牧场'], photoIds: photos('new-zealand', 424, 430, 441, 443) },
      kaikoura: { text: '海岸背后是雪山，岩石上是休息的海豹。到了海上，照片转向船边的鸟群、跃出水面的海豚和水下的蓝色。', details: ['海豹与海岸', '船边和水下的海豚'], photoIds: photos('new-zealand', 493, 459, 476, 504) },
    },
    notePrompts: ['哪一片湖的蓝最让你记得？', '箭镇的秋色与凯库拉的海风，哪一刻想再回去？'],
  },
  jeju: {
    lead: '四月的济州，樱花与海岸轮流出现。船头的合影、黑色礁石、沙滩和一桌饭菜，把四天连成一段海岛日常。',
    chapterHeading: '樱花、海风，还有岛上的日常。',
    chapters: [
      {
        id: 'flowers-and-coast', title: '沿着樱花路，走到海边。',
        paragraphs: [
          '抵达的第一张照片留给夜里的公交站。到了白天，街道被樱花覆盖，棕榈树、红色灯塔和油菜花又把镜头引向海岸。',
          '西侧的海更有浪的形状：黑色礁石围着白色浪花，海水退去时留下浅色沙滩。粉色与蓝色在同一天的相册里交替出现。',
        ],
        photoIds: photos('jeju', 24, 13, 38), placeIds: ['seogwipo', 'west-coast'],
      },
      {
        id: 'island-by-sea', title: '从船头，看岛屿的另一面。',
        paragraphs: [
          '东海岸这一组照片先从船上展开。红色救生衣、船头合影、岩壁与海鸟，让“海风”有了具体的画面。',
          '回到岸边，山崖直落进蓝色海水，灯塔立在黑色岩石上。咸德的沙滩与秋千接住了后面的照片，天色随后走向傍晚。',
        ],
        photoIds: photos('jeju', 125, 80, 143), placeIds: ['east-coast', 'hamdeok'],
      },
      {
        id: 'island-everyday', title: '海岸之外，也留一点可爱。',
        paragraphs: [
          '南侧海岸的步桥、礁石和树影之外，还有 Hello Kitty 的小世界，以及草地上的小猪、小狗和围栏边的小驴。',
          '把烤肉、饭菜、试戴墨镜的自拍和返程零食也放在一起，济州就不只是一片海，而是一段有吃饭、有散步的旅行。',
        ],
        photoIds: photos('jeju', 165, 182, 184), placeIds: ['seogwipo', 'inland', 'jeju-city'],
      },
    ],
    days: [
      { date: '2026-04-03', title: '夜里的公交站，济州到了', text: '抵达这一晚只留下一张公交站的照片。旅程从城市的夜色开始，后面的海岸与樱花还在下一页。', coverId: 'jeju-001' },
      { date: '2026-04-04', title: '樱花、灯塔与西海岸的浪', text: '白天从西归浦一带的樱花和海岸走起，再看西侧的礁石与浪花。晚上回到城市，一餐烤肉把这一天收住。', coverId: 'jeju-024' },
      { date: '2026-04-05', title: '乘船看岩壁，再去咸德看海', text: '船头合影、海鸟、岩壁和灯塔占据白天的照片。后面是咸德的沙滩与秋千，最后回到城市夜色里的樱花。', coverId: 'jeju-125' },
      { date: '2026-04-06', title: '最后一天，海岸与小动物', text: '步桥和南侧礁石之后，镜头走进展馆与动物园。饭菜、墨镜自拍和返程小零食，留下海岛旅行里的日常一面。', coverId: 'jeju-184' },
    ],
    places: {
      'jeju-city': { text: '从抵达时的公交站，到烤肉店、夜樱和旅程末尾的一桌饭菜，城市照片把几段海岸风景接在一起。', details: ['抵达的夜色', '烤肉、夜樱与返程日常'], photoIds: photos('jeju', 1, 49, 161, 192) },
      seogwipo: { text: '樱花街道、棕榈树、灯塔和海边步桥，记录了岛的南侧。黑色岩石与浅蓝海水之间，人物、树影与花色不断出现。', details: ['樱花路与灯塔', '南侧礁石与步桥'], photoIds: photos('jeju', 24, 13, 165, 171) },
      'west-coast': { text: '西海岸这五张照片集中在海水与岩石。白色浪花不断涌来，浅色沙滩在退潮的水面旁露出来，远处还有一座灯塔。', details: ['黑色礁石', '浪花、沙滩与灯塔'], photoIds: photos('jeju', 38, 40, 44, 46) },
      'east-coast': { text: '船头与岸上的视角放在同一组：岩壁、海鸟、白色灯塔，以及直接落进海水的绿色山崖。合影让这一片海也有了人的记忆。', details: ['乘船与船头合影', '岩壁、灯塔与山崖'], photoIds: photos('jeju', 125, 80, 108, 138) },
      hamdeok: { text: '沙滩与秋千是这组照片的中心。海边晾晒的鱿鱼、路过的车和傍晚车流，把咸德一带的风景连回生活。', details: ['沙滩与秋千', '海边与傍晚车流'], photoIds: photos('jeju', 143, 153, 141, 160) },
      inland: { text: '四张照片从 Hello Kitty 展馆走到草地与围栏。小猪、小狗和小驴，是这册海岛照片里几张轻松的插页。', details: ['Hello Kitty 展馆', '草地上的小动物'], photoIds: photos('jeju', 182, 184, 186, 189) },
    },
    notePrompts: ['海边的风、船上的片刻，哪一个还记得？', '樱花路和烤肉店，想给哪一天添一句？'],
  },
  'japan-summer': {
    lead: '大阪的招牌、神户的海湾、京都的鸟居，再往北到天桥立与伊根。六天的关西照片，一半是城市，一半朝向海。',
    chapterHeading: '关西的街巷，慢慢走到海边。',
    chapters: [
      {
        id: 'cities-and-harbor', title: '从大阪街头，走到神户晚霞。',
        paragraphs: [
          '抵达关西后，相册先走进大阪：大阪城、四天王寺、通天阁和难波八阪神社各有自己的轮廓，道顿堀的招牌则把城市变得热闹。',
          '之后的神户照片换成海边旧洋房、明石海峡大桥与港湾夜色。再翻一页，是旧洋馆的房间、展馆里的线条和一份定食。',
        ],
        photoIds: photos('japan-summer', 16, 45, 65), placeIds: ['osaka', 'kobe'],
      },
      {
        id: 'kyoto-streets', title: '京都，把红色留在街巷里。',
        paragraphs: [
          '鸭川把傍晚的人与街屋放在两岸，伏见稻荷的鸟居把目光带向石阶。雨里的楼门、电车与老街，留下京都这一天的天色。',
          '同一组照片里还有 Nintendo KYOTO、马力欧、amiibo 与抹茶冰淇淋。寺院、老街与喜欢的小物，让散步有了不同的停顿。',
        ],
        photoIds: photos('japan-summer', 104, 120, 124), placeIds: ['kyoto'],
      },
      {
        id: 'northern-bay', title: '再往北，海湾里有舟屋。',
        paragraphs: [
          '天桥立先从观景台出现在镜头里：细长沙洲、蓝色海湾与岸边小城。缆车、沙滩和浅浅的海水，把视角慢慢放低。',
          '伊根的舟屋沿水面排开，海鸥围着船边飞，岸边石头透过清亮海水可见。相册随后回到大阪的夜色与商店，给初夏旅程收尾。',
        ],
        photoIds: photos('japan-summer', 154, 189, 184), placeIds: ['amanohashidate', 'ine'],
      },
    ],
    days: [
      { date: '2025-05-31', title: '抵达关西，窗外是傍晚', text: '舷窗下是日本海岸，机场的窗框里留着晚霞，飞机停在航站楼旁。三张照片记录了这段旅程的开头。', coverId: 'japan-summer-007' },
      { date: '2025-06-01', title: '大阪的街头，神户的海边', text: '从大阪城、寺院与通天阁走到道顿堀，再看明石海峡大桥的日落。神户港湾与摩天轮在后面的照片里亮起。', coverId: 'japan-summer-045' },
      { date: '2025-06-02', title: '旧洋馆之后，京都的鸭川', text: '神户的旧洋馆与展馆占了白天的照片；站台和列车之后，画面转到京都站与鸭川，水面映着傍晚和夜里的灯。', coverId: 'japan-summer-096' },
      { date: '2025-06-03', title: '雨里的鸟居，街角的马力欧', text: '红色楼门、鸟居、雨里的电车与老街，接着是 Nintendo KYOTO 和任天堂小物。点心、抹茶冰淇淋与八坂神社的灯笼也留在这一天。', coverId: 'japan-summer-104' },
      { date: '2025-06-04', title: '天桥立与伊根，换成海的颜色', text: '观景台上的海湾、缆车和沙滩之后，是伊根的舟屋、海鸥与清亮海水。最后几张再回到大阪的热面和道顿堀夜色。', coverId: 'japan-summer-189' },
      { date: '2025-06-05', title: '在大阪，把喜欢的小物带进结尾', text: '旅程尾声的三张照片是商店门口、宝可梦与一枚马力欧 amiibo。它们把海湾和老街之后的最后一天放回城市日常。', coverId: 'japan-summer-199' },
    ],
    places: {
      arrival: { text: '机场窗外的飞机与傍晚天光，是这一册最开始的三张照片。两张机场照片的定位在关西机场，单独留作抵达的一页。', details: ['关西机场', '舷窗与傍晚天光'], photoIds: photos('japan-summer', 7, 8, 1) },
      osaka: { text: '大阪城、四天王寺、通天阁与狮子殿，和道顿堀的招牌一起组成城市切片。最后几张又回到这里，拍商店、美食与喜欢的小物。', details: ['城楼、寺院与通天阁', '道顿堀与商店'], photoIds: photos('japan-summer', 16, 32, 196, 199) },
      kobe: { text: '海边的大桥日落与港湾夜色之后，照片走进旧洋馆和展馆。窗框、房间、摆设与线条，把神户从远处风景变成可慢慢看的细节。', details: ['明石海峡大桥与港湾', '旧洋馆与展馆'], photoIds: photos('japan-summer', 45, 65, 69, 85) },
      kyoto: { text: '鸭川、鸟居、雨中的楼门和老街之外，京都还留下任天堂商店、点心与抹茶冰淇淋。红色与木色贯穿了这组散步照片。', details: ['鸭川与伏见稻荷', '老街与 Nintendo KYOTO'], photoIds: photos('japan-summer', 104, 96, 120, 124) },
      amanohashidate: { text: '先在高处看沙洲与海湾，再沿着缆车线下山，到沙滩看浅浅的海水。观景台的合影与岸边片刻，记录这一站不同的视角。', details: ['沙洲与观景台', '缆车、沙滩与浅海'], photoIds: photos('japan-summer', 154, 149, 166, 176) },
      ine: { text: '舟屋沿海湾排开，船边飞近的海鸥和清亮水面占了另外几张。这里的照片很适合从建筑的木色，慢慢看到海水的蓝。', details: ['海湾中的舟屋', '海鸥与清亮海水'], photoIds: photos('japan-summer', 189, 178, 184, 190) },
    },
    notePrompts: ['神户的日落，还是伊根的海水，想再看哪一眼？', '京都的小物与街边点心，哪一个想补写？'],
  },
  'japan-spring': {
    lead: '江之电、樱花、海岸与富士山，最后是东京上空的日落。五天照片把春日从街道一路铺到湖边。',
    chapterHeading: '春天，从电车窗边开始。',
    chapters: [
      {
        id: 'kamakura-spring', title: '电车穿过街道，春天在树梢。',
        paragraphs: [
          '镰仓的绿色电车、站台与神社，和满街樱花放在一起。到了海边，江之岛隔着水面，富士山也曾出现在海岸远处。',
          '这段照片里有电车经过的瞬间，也有坐在防波堤和岩石上的人。街道与海岸交替出现，留下一个可以散步的春天。',
        ],
        photoIds: photos('japan-spring', 16, 61, 38), placeIds: ['kamakura'],
      },
      {
        id: 'fuji-day', title: '到山脚，等富士山走进画面。',
        paragraphs: [
          '忠灵塔与樱花先出现在云层下，河口湖随后把山与水放在一起。芦苇、花圃和湖边留影，让富士山有了几种不同的前景。',
          '再换到街角和便利店屋顶，雪白的山离城市很近。合影与拿起相机的背影，也留在这一组山脚照片中。',
        ],
        photoIds: photos('japan-spring', 129, 151, 148), placeIds: ['fuji'],
      },
      {
        id: 'tokyo-light', title: '东京，从夜樱到日落。',
        paragraphs: [
          '浅草寺、晴空塔与隅田川之后，是夜里的樱花、小店和秋叶原的招牌。街边饭菜与商店细节，把城市春天连回日常。',
          '最后一天走到涩谷，从街头再看向城市上空。SHIBUYA SKY 的玻璃边角、合影、日落与夜色，为这一册留下最后几幅大画面。',
        ],
        photoIds: photos('japan-spring', 84, 197, 213), placeIds: ['tokyo'],
      },
    ],
    days: [
      { date: '2025-04-03', title: '从成田，到镰仓的樱花路', text: '机场指示牌之后，是江之电、站台、神社与樱花街道。江之岛出现在海面另一边，一餐饭给走了一天的照片收尾。', coverId: 'japan-spring-016' },
      { date: '2025-04-04', title: '上午看海，后面是东京夜樱', text: '海岸远处的富士山、江之岛岩壁与绿色电车，接着变成东京的楼宇、浅草寺和晴空塔。夜里的樱花把这一天留在春天里。', coverId: 'japan-spring-061' },
      { date: '2025-04-05', title: '在东京街头，把春天看近一点', text: '街角与河道旁的樱花、小店饭菜、动漫商店与秋叶原，构成东京这一天的照片。白天的花与夜里的招牌，各有自己的颜色。', coverId: 'japan-spring-102' },
      { date: '2025-04-06', title: '河口湖与街角里的富士山', text: '湖畔、芦苇、花圃、便利店和街道，轮流成为富士山的前景。人物与山一起入镜，晚上的照片再回到东京。', coverId: 'japan-spring-151' },
      { date: '2025-04-07', title: '涩谷，从十字路口看到日落', text: '十字路口与街头之后，是城市上空的玻璃、合影和金色天际线。太阳落下后，涩谷的灯亮起来，五天的春日照片在这里收束。', coverId: 'japan-spring-213' },
    ],
    places: {
      narita: { text: '一张机场指示牌的照片，记录这段日本春季旅行的起点。后面的相册很快就走向镰仓的街道与电车。', details: ['抵达的第一张照片'], photoIds: photos('japan-spring', 2) },
      kamakura: { text: '江之电在街道与海岸之间穿过，神社和樱花给散步添上颜色。到了江之岛一带，岩壁、沙滩、海鸟与远处富士山又组成另一组画面。', details: ['江之电与樱花', '江之岛与镰仓海岸'], photoIds: photos('japan-spring', 16, 61, 38, 49) },
      tokyo: { text: '这组照片跨过夜樱、浅草寺、秋叶原、银座与涩谷。城市的春天可以很近，也可以站到高处，看它一直延伸到日落。', details: ['夜樱与城市街头', '涩谷与 SHIBUYA SKY'], photoIds: photos('japan-spring', 84, 72, 197, 213) },
      fuji: { text: '富士山前面轮流出现河口湖、芦苇、花圃和街道。湖边与街角的合影，让山不只是远处的背景，也成为这一天的中心。', details: ['河口湖与忠灵塔', '山脚街角与合影'], photoIds: photos('japan-spring', 151, 129, 120, 148) },
    },
    notePrompts: ['樱花、电车与富士山，最想留住哪一张？', '东京日落时，想给旅程添怎样的结尾？'],
  },
};
