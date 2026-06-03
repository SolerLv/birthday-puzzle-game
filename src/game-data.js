export const SCORE_KEYS = [
  'style',
  'luxury',
  'comfort',
  'memory',
  'cash',
  'care',
  'home',
  'practical',
  'romance',
  'eye',
  'body',
  'neck',
  'classic'
];

export const PRIZES = [
  {
    id: 'gentle-monster',
    displayName: 'GENTLE MONSTER 2000元内任意太阳镜兑换券',
    envelopeCode: 'S-01',
    categoryTags: ['style', 'luxury'],
    resultCopy: '银框与镜湖都指向同一枚封印。打开 S-01，收下密室给你的第一份偏爱。'
  },
  {
    id: 'gucci-sunglasses',
    displayName: '古驰 2000元内任意太阳镜兑换券',
    envelopeCode: 'S-02',
    categoryTags: ['style', 'luxury', 'classic'],
    resultCopy: '古典、学院与锋利的审美停在同一格。打开 S-02，那是属于你的封印。'
  },
  {
    id: 'shoes',
    displayName: '1000元内任意品牌鞋款兑换券',
    envelopeCode: 'S-03',
    categoryTags: ['style', 'practical', 'comfort'],
    resultCopy: '蛇形路径在远行处停下。打开 S-03，把下一段路走得更漂亮。'
  },
  {
    id: 'camera',
    displayName: '2000元佳能、索尼品牌相机代金券1张',
    envelopeCode: 'S-04',
    categoryTags: ['memory'],
    resultCopy: '定格咒没有选中瞬间，而是选中了以后想反复看的日子。打开 S-04。'
  },
  {
    id: 'red-packet',
    displayName: '1314元微信红包',
    envelopeCode: 'S-05',
    categoryTags: ['cash', 'romance'],
    resultCopy: '金库密语读出了一个很适合今天的数字。打开 S-05，让封印自己说话。'
  },
  {
    id: 'morphy-eye',
    displayName: '摩飞 眼部按摩仪 MF112',
    envelopeCode: 'S-06',
    categoryTags: ['care', 'eye'],
    resultCopy: '柔光落在眉眼之间。打开 S-06，把今天的疲惫交给封印保管。'
  },
  {
    id: 'meeegou-care',
    displayName: '米狗（MEEE GOU）肩颈腿部腰部电动按摩仪 MC529个护套装',
    envelopeCode: 'S-07',
    categoryTags: ['care', 'body'],
    resultCopy: '舒缓藤蔓缠上了整条旅途。打开 S-07，这是密室给你的照顾。'
  },
  {
    id: 'skg-neck',
    displayName: 'SKG 颈椎按摩仪 4098 蓝牙款',
    envelopeCode: 'S-08',
    categoryTags: ['care', 'neck'],
    resultCopy: '银蛇把守护落在肩颈。打开 S-08，让它替你松开紧绷的一天。'
  },
  {
    id: 'juicer',
    displayName: 'MOKKOM磨客 大口径原汁机 MK-199',
    envelopeCode: 'S-09',
    categoryTags: ['home'],
    resultCopy: '晨露与果香在杯口汇合。打开 S-09，把清晨也变成礼物。'
  }
];

export const VISUAL_ASSETS = {
  greatHall: {
    title: 'Great Hall of Hogwarts in Hogwarts Legacy',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Great_Hall_of_Hogwarts_in_Hogwarts_Legacy.jpg/1280px-Great_Hall_of_Hogwarts_in_Hogwarts_Legacy.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Great_Hall_of_Hogwarts_in_Hogwarts_Legacy.jpg',
    attribution: 'Hogwarts Legacy, CC BY 3.0, via Wikimedia Commons'
  }
};

export const ACCESS_CARDS = [
  {
    id: 'granger-note',
    title: '赫敏的页角批注',
    symbol: 'HG',
    type: 'seal',
    visibleText: '逻辑先于勇气，页边的字永远不会骗人。',
    isKey: true
  },
  {
    id: 'otter-memory',
    title: '水獭形记忆',
    symbol: 'OT',
    type: 'memory',
    visibleText: '银色水痕绕过禁书区的门缝。',
    isKey: true
  },
  {
    id: 'serpent-seal',
    title: '银蛇封蜡',
    symbol: 'SS',
    type: 'house',
    visibleText: '只有蛇影知道哪扇门愿意打开。',
    isKey: true
  },
  {
    id: 'phoenix-ash',
    title: '凤凰灰烬',
    symbol: 'PX',
    type: 'decoy',
    visibleText: '会重燃，但不属于这扇门。'
  },
  {
    id: 'stag-print',
    title: '鹿角足迹',
    symbol: 'ST',
    type: 'decoy',
    visibleText: '很英勇，也很容易把巡夜人引来。'
  },
  {
    id: 'moon-ink',
    title: '月光墨迹',
    symbol: 'MI',
    type: 'decoy',
    visibleText: '适合写信，不适合开锁。'
  },
  {
    id: 'bronze-key',
    title: '旧铜钥匙',
    symbol: 'BK',
    type: 'decoy',
    visibleText: '看起来像钥匙，正因为如此才可疑。'
  },
  {
    id: 'green-ribbon',
    title: '湖绿色缎带',
    symbol: 'GR',
    type: 'decoy',
    visibleText: '颜色正确，但没有留下推理痕迹。'
  },
  {
    id: 'library-dust',
    title: '禁书灰尘',
    symbol: 'LD',
    type: 'hint',
    visibleText: '真正的通行组合里，会同时有她、守护与学院。'
  }
];

export const ACCESS_CARD_IDS = ACCESS_CARDS.filter((card) => card.isKey).map((card) => card.id);

export const LOGIC_PATHS = [
  {
    id: 'silver-cloak',
    title: '优雅伪装',
    visibleText: '把线索藏进银色斗篷，先看气质，再看答案。',
    scoreTags: ['style', 'luxury']
  },
  {
    id: 'traveler-mark',
    title: '实用远行',
    visibleText: '沿着脚印排除干扰，能陪你走远的才是真的。',
    scoreTags: ['style', 'practical', 'comfort']
  },
  {
    id: 'memory-frame',
    title: '纪念影像',
    visibleText: '把碎片拼成一张会发光的照片，再决定下一步。',
    scoreTags: ['memory']
  },
  {
    id: 'vault-number',
    title: '即时惊喜',
    visibleText: '先打开金库，再让数字给出最直接的答案。',
    scoreTags: ['cash', 'romance']
  }
];

export const RUNE_CELLS = [
  { id: 'moon-owl', label: '月鸮', glyph: '☾', hint: '月鸮负责观察，不负责开门。' },
  { id: 'thorn', label: '荆棘', glyph: '♆', hint: '有防护，却没有羽毛的痕迹。' },
  { id: 'mirror', label: '镜湖', glyph: '◇', hint: '只反射答案，不保存答案。' },
  { id: 'quill', label: '羽笔', glyph: '✒', hint: '羽笔在旁边，但还缺少蛇影。' },
  {
    id: 'serpent-quill',
    label: '蛇羽',
    glyph: 'ϟ',
    hint: '蛇影与羽毛在这里相遇。',
    isEntrance: true,
    scoreTags: ['style', 'luxury']
  },
  { id: 'coin', label: '金纹', glyph: '◎', hint: '金纹靠近金库，却不是本关钥匙。' },
  { id: 'star', label: '星尘', glyph: '✦', hint: '太亮，会暴露密室门。' },
  { id: 'fern', label: '银蕨', glyph: '⌘', hint: '它负责隐藏路径，不负责开门。' },
  { id: 'vial', label: '药瓶', glyph: '⚗', hint: '这是下一关的东西。' },
  {
    id: 'mirror-serpent',
    label: '镜蛇',
    glyph: '◈',
    hint: '镜面里的蛇影也能找到门缝。',
    isEntrance: true,
    scoreTags: ['classic', 'luxury']
  },
  { id: 'book-latch', label: '书扣', glyph: '▣', hint: '书扣锁住的是旧知识，不是密室入口。' },
  { id: 'silver-flame', label: '银焰', glyph: '♨', hint: '火焰会暴露你，但能照亮下一条提示。' },
  {
    id: 'memory-lantern',
    label: '忆灯',
    glyph: '✧',
    hint: '它保存今天的光，也能成为一条入口。',
    isEntrance: true,
    scoreTags: ['memory', 'romance']
  },
  { id: 'vault-line', label: '库线', glyph: '⌁', hint: '这条线通向金库，不通向笔记页。' },
  { id: 'emerald-drop', label: '翠滴', glyph: '●', hint: '颜色太纯，反而不像赫敏会信的证据。' },
  { id: 'quiet-root', label: '静根', glyph: '♧', hint: '静根藏得很好，但没有回应羽笔。' }
];

export const CORRECT_RUNE_ID = 'serpent-quill';
export const VALID_RUNE_IDS = RUNE_CELLS.filter((cell) => cell.isEntrance).map((cell) => cell.id);

export const POTION_BOTTLES = [
  {
    id: 'mirror-silver',
    title: '镜湖与银框',
    visibleText: '一滴能让目光更锋利的银色药液。',
    scoreTags: ['style', 'luxury']
  },
  {
    id: 'old-house',
    title: '古典学院',
    visibleText: '来自旧书页边缘的深色粉末。',
    scoreTags: ['style', 'luxury', 'classic']
  },
  {
    id: 'travel-step',
    title: '远行鞋印',
    visibleText: '只在准备出发时才会发亮的砂粒。',
    scoreTags: ['style', 'practical', 'comfort']
  },
  {
    id: 'frozen-frame',
    title: '定格咒',
    visibleText: '能把一个笑容留到很久以后的光。',
    scoreTags: ['memory']
  },
  {
    id: 'vault-whisper',
    title: '金库密语',
    visibleText: '说出口之前，数字已经替它心动。',
    scoreTags: ['cash', 'romance']
  },
  {
    id: 'soft-vine',
    title: '舒缓藤蔓',
    visibleText: '贴近疲惫处时，会变得很安静。',
    scoreTags: ['care', 'body', 'neck']
  },
  {
    id: 'moon-rest',
    title: '柔光月息',
    visibleText: '专门照顾熬夜后那一点点酸涩。',
    scoreTags: ['care', 'eye']
  },
  {
    id: 'morning-dew',
    title: '晨露果香',
    visibleText: '把清晨压成一杯明亮的颜色。',
    scoreTags: ['home']
  }
];

export const LOCK_DIGITS = ['1', '3', '1', '4', '0'];
export const LOCK_CODE = LOCK_DIGITS.join('');

export const SEAL_PHRASES = [
  {
    id: 'lumos',
    spell: 'Lumos',
    title: '荧光闪烁',
    translation: '让黑暗先退一步。',
    scoreTags: ['style', 'luxury']
  },
  {
    id: 'expecto-patronum',
    spell: 'Expecto Patronum',
    title: '呼神护卫',
    translation: '把最明亮的记忆召到身边。',
    scoreTags: ['memory', 'romance']
  },
  {
    id: 'protego',
    spell: 'Protego',
    title: '盔甲护身',
    translation: '替你挡下一点世界的喧闹。',
    scoreTags: ['care', 'comfort']
  },
  {
    id: 'wingardium-leviosa',
    spell: 'Wingardium Leviosa',
    title: '羽加迪姆 勒维奥萨',
    translation: '让心事轻一点，像羽毛一样升起。',
    scoreTags: ['home']
  },
  {
    id: 'alohomora',
    spell: 'Alohomora',
    title: '阿拉霍洞开',
    translation: '愿今晚所有门都只为你打开。',
    scoreTags: ['cash', 'romance']
  }
];
