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
  textures: {
    parchment: './artifacts/parchment-texture.svg',
    velvet: './artifacts/velvet-noise.svg'
  },
  ambience: [
    { stage: 'access', title: '禁书区书廊', imageUrl: './artifacts/scene-forbidden-library.svg' },
    { stage: 'logic', title: '赫敏的羊皮纸笔记', imageUrl: './artifacts/scene-logic-notebook.svg' },
    { stage: 'potion', title: '湖底公共休息室药剂架', imageUrl: './artifacts/scene-common-room.svg' },
    { stage: 'lock', title: '密室蛇形门锁', imageUrl: './artifacts/scene-chamber-door.svg' },
    { stage: 'result', title: '最终封印桌面', imageUrl: './artifacts/scene-seal-table.svg' }
  ]
};

export const ACCESS_CARDS = [
  {
    id: 'granger-note',
    title: '赫敏的页角批注',
    symbol: 'HG',
    type: 'seal',
    artifact: 'quill-note',
    tone: '#c8d7cf',
    visibleText: '逻辑先于勇气，页边的字永远不会骗人。',
    isKey: true
  },
  {
    id: 'otter-memory',
    title: '水獭形记忆',
    symbol: 'OT',
    type: 'memory',
    artifact: 'silver-ripple',
    tone: '#9fd0d0',
    visibleText: '银色水痕绕过禁书区的门缝。',
    isKey: true
  },
  {
    id: 'serpent-seal',
    title: '银蛇封蜡',
    symbol: 'SS',
    type: 'house',
    artifact: 'serpent-wax',
    tone: '#72b08f',
    visibleText: '只有蛇影知道哪扇门愿意打开。',
    isKey: true
  },
  {
    id: 'phoenix-ash',
    title: '凤凰灰烬',
    symbol: 'PX',
    type: 'decoy',
    artifact: 'ash-feather',
    tone: '#cf7b57',
    visibleText: '会重燃，但不属于这扇门。'
  },
  {
    id: 'stag-print',
    title: '鹿角足迹',
    symbol: 'ST',
    type: 'decoy',
    artifact: 'stag-track',
    tone: '#d9c28c',
    visibleText: '很英勇，也很容易把巡夜人引来。'
  },
  {
    id: 'moon-ink',
    title: '月光墨迹',
    symbol: 'MI',
    type: 'decoy',
    artifact: 'moon-ink',
    tone: '#aeb8d8',
    visibleText: '适合写信，不适合开锁。'
  },
  {
    id: 'bronze-key',
    title: '旧铜钥匙',
    symbol: 'BK',
    type: 'decoy',
    artifact: 'bronze-key',
    tone: '#b27a45',
    visibleText: '看起来像钥匙，正因为如此才可疑。'
  },
  {
    id: 'green-ribbon',
    title: '湖绿色缎带',
    symbol: 'GR',
    type: 'decoy',
    artifact: 'green-ribbon',
    tone: '#3f9c78',
    visibleText: '颜色正确，但没有留下推理痕迹。'
  },
  {
    id: 'library-dust',
    title: '禁书灰尘',
    symbol: 'LD',
    type: 'hint',
    artifact: 'library-dust',
    tone: '#b9a56c',
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
  { id: 'moon-owl', label: '月鸮', glyph: '☾', artifact: 'owl', constellation: '#9fb8d0', hint: '月鸮负责观察，不负责开门。' },
  { id: 'thorn', label: '荆棘', glyph: '♆', artifact: 'thorn', constellation: '#708f78', hint: '有防护，却没有羽毛的痕迹。' },
  { id: 'mirror', label: '镜湖', glyph: '◇', artifact: 'mirror', constellation: '#b9c7d7', hint: '只反射答案，不保存答案。' },
  { id: 'quill', label: '羽笔', glyph: '✒', artifact: 'quill', constellation: '#d7c39a', hint: '羽笔在旁边，但还缺少蛇影。' },
  {
    id: 'serpent-quill',
    label: '蛇羽',
    glyph: 'ϟ',
    artifact: 'serpent-quill',
    constellation: '#d7c39a',
    hint: '蛇影与羽毛在这里相遇。',
    isEntrance: true,
    scoreTags: ['style', 'luxury']
  },
  { id: 'coin', label: '金纹', glyph: '◎', artifact: 'coin', constellation: '#cba85d', hint: '金纹靠近金库，却不是本关钥匙。' },
  { id: 'star', label: '星尘', glyph: '✦', artifact: 'star', constellation: '#e6d9a8', hint: '太亮，会暴露密室门。' },
  { id: 'fern', label: '银蕨', glyph: '⌘', artifact: 'fern', constellation: '#8fb79e', hint: '它负责隐藏路径，不负责开门。' },
  { id: 'vial', label: '药瓶', glyph: '⚗', artifact: 'vial', constellation: '#95c0a8', hint: '这是下一关的东西。' },
  {
    id: 'mirror-serpent',
    label: '镜蛇',
    glyph: '◈',
    artifact: 'mirror-serpent',
    constellation: '#b8d3cf',
    hint: '镜面里的蛇影也能找到门缝。',
    isEntrance: true,
    scoreTags: ['classic', 'luxury']
  },
  { id: 'book-latch', label: '书扣', glyph: '▣', artifact: 'latch', constellation: '#9b7c56', hint: '书扣锁住的是旧知识，不是密室入口。' },
  { id: 'silver-flame', label: '银焰', glyph: '♨', artifact: 'flame', constellation: '#c7d8d2', hint: '火焰会暴露你，但能照亮下一条提示。' },
  {
    id: 'memory-lantern',
    label: '忆灯',
    glyph: '✧',
    artifact: 'lantern',
    constellation: '#d9c48f',
    hint: '它保存今天的光，也能成为一条入口。',
    isEntrance: true,
    scoreTags: ['memory', 'romance']
  },
  { id: 'vault-line', label: '库线', glyph: '⌁', artifact: 'vault', constellation: '#d8b968', hint: '这条线通向金库，不通向笔记页。' },
  { id: 'emerald-drop', label: '翠滴', glyph: '●', artifact: 'emerald', constellation: '#4fc08f', hint: '颜色太纯，反而不像赫敏会信的证据。' },
  { id: 'quiet-root', label: '静根', glyph: '♧', artifact: 'root', constellation: '#7e9c78', hint: '静根藏得很好，但没有回应羽笔。' }
];

export const CORRECT_RUNE_ID = 'serpent-quill';
export const VALID_RUNE_IDS = RUNE_CELLS.filter((cell) => cell.isEntrance).map((cell) => cell.id);

export const POTION_BOTTLES = [
  {
    id: 'mirror-silver',
    title: '镜湖与银框',
    artifact: 'faceted',
    liquid: ['#dbe7e4', '#7ba99b'],
    visibleText: '一滴能让目光更锋利的银色药液。',
    scoreTags: ['style', 'luxury']
  },
  {
    id: 'old-house',
    title: '古典学院',
    artifact: 'apothecary',
    liquid: ['#5a2736', '#b59b65'],
    visibleText: '来自旧书页边缘的深色粉末。',
    scoreTags: ['style', 'luxury', 'classic']
  },
  {
    id: 'travel-step',
    title: '远行鞋印',
    artifact: 'round',
    liquid: ['#6b8d79', '#d4bd85'],
    visibleText: '只在准备出发时才会发亮的砂粒。',
    scoreTags: ['style', 'practical', 'comfort']
  },
  {
    id: 'frozen-frame',
    title: '定格咒',
    artifact: 'tall',
    liquid: ['#8fb6cc', '#eee0b6'],
    visibleText: '能把一个笑容留到很久以后的光。',
    scoreTags: ['memory']
  },
  {
    id: 'vault-whisper',
    title: '金库密语',
    artifact: 'cut-crystal',
    liquid: ['#c9a24c', '#6a402c'],
    visibleText: '说出口之前，数字已经替它心动。',
    scoreTags: ['cash', 'romance']
  },
  {
    id: 'soft-vine',
    title: '舒缓藤蔓',
    artifact: 'vine',
    liquid: ['#79a987', '#214f3f'],
    visibleText: '贴近疲惫处时，会变得很安静。',
    scoreTags: ['care', 'body', 'neck']
  },
  {
    id: 'moon-rest',
    title: '柔光月息',
    artifact: 'moon',
    liquid: ['#d7d2e9', '#6d88a4'],
    visibleText: '专门照顾熬夜后那一点点酸涩。',
    scoreTags: ['care', 'eye']
  },
  {
    id: 'morning-dew',
    title: '晨露果香',
    artifact: 'wide',
    liquid: ['#f1c06d', '#7ca77b'],
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
