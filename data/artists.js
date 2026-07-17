const CORE_MUSICIANS = [
  {id:'monteverdi',nameZh:'蒙台威爾第',nameEn:'Claudio Monteverdi',birthYear:1567,deathYear:1643,nationality:'義大利',period:'巴洛克早期',artMovement:'歌劇與牧歌',title:'歌劇舞台的開拓者',color:'#a95d3e',stageId:'baroque',bgmId:'baroque',representativeWorks:['奧菲歐','波佩亞的加冕','聖母晚禱'],keyTerms:['早期歌劇','宣敘調','文藝復興到巴洛克'],moves:['牧歌音刃','奧菲歐呼喚','歌劇黎明']},
  {id:'purcell',nameZh:'普賽爾',nameEn:'Henry Purcell',birthYear:1659,deathYear:1695,nationality:'英格蘭',period:'巴洛克',artMovement:'英國巴洛克',title:'英倫舞台的抒情之聲',color:'#6f86a6',stageId:'baroque',bgmId:'baroque',representativeWorks:['狄多與埃涅阿斯','仙后','瑪麗女王葬禮音樂'],keyTerms:['英國歌劇','半歌劇','哀歌低音'],moves:['仙后迴響','狄多嘆息','英倫挽歌']},
  {id:'rameau',nameZh:'拉摩',nameEn:'Jean-Philippe Rameau',birthYear:1683,deathYear:1764,nationality:'法國',period:'巴洛克',artMovement:'法國巴洛克',title:'和聲理論的舞台魔法師',color:'#5b78a2',stageId:'baroque',bgmId:'baroque',representativeWorks:['希波呂托斯與阿里西埃','優雅的印度人','皮格馬利翁'],keyTerms:['和聲理論','法國歌劇','舞曲組曲'],moves:['和聲鎖鏈','印度舞火','皮格馬利翁覺醒']},
  {id:'vivaldi',nameZh:'韋瓦第',nameEn:'Antonio Vivaldi',birthYear:1678,deathYear:1741,nationality:'義大利',period:'巴洛克',artMovement:'義大利巴洛克',title:'四季風暴的紅髮司鐸',color:'#d15b38',stageId:'baroque',bgmId:'baroque',representativeWorks:['四季','榮耀頌','和諧的靈感'],keyTerms:['協奏曲','利托奈羅曲式','小提琴炫技'],moves:['春雷弓擊','夏日風暴','四季輪轉']},
  {id:'bach',nameZh:'巴赫',nameEn:'Johann Sebastian Bach',birthYear:1685,deathYear:1750,nationality:'德國',period:'巴洛克',artMovement:'德國巴洛克',title:'對位宇宙的建築師',color:'#c28b42',stageId:'baroque',bgmId:'baroque',representativeWorks:['布蘭登堡協奏曲','馬太受難曲','平均律鍵盤曲集'],keyTerms:['對位法','賦格','調性體系'],moves:['對位音階','賦格追擊','平均律宇宙']},
  {id:'handel',nameZh:'韓德爾',nameEn:'George Frideric Handel',birthYear:1685,deathYear:1759,nationality:'德國',period:'巴洛克',artMovement:'英國巴洛克',title:'清唱劇的王者',color:'#b27343',stageId:'baroque',bgmId:'baroque',representativeWorks:['彌賽亞','水上音樂','皇家煙火'],keyTerms:['清唱劇','義大利歌劇','宏大合唱'],moves:['水上序曲','哈利路亞震波','皇家煙火']},
  {id:'scarlatti',nameZh:'史卡拉第',nameEn:'Domenico Scarlatti',birthYear:1685,deathYear:1757,nationality:'義大利',period:'巴洛克',artMovement:'鍵盤奏鳴曲',title:'鍵盤火花的旅行者',color:'#8b6ba5',stageId:'baroque',bgmId:'baroque',representativeWorks:['D小調奏鳴曲K.141','E大調奏鳴曲K.380','五百五十五首鍵盤奏鳴曲'],keyTerms:['單樂章奏鳴曲','交叉手法','伊比利節奏'],moves:['交叉手閃擊','伊比利節拍','五百奏鳴爆發']},

  {id:'clementi',nameZh:'克萊曼蒂',nameEn:'Muzio Clementi',birthYear:1752,deathYear:1832,nationality:'義大利',period:'古典時期',artMovement:'古典鋼琴學派',title:'鋼琴技法的奠基者',color:'#6b83a8',stageId:'classical',bgmId:'classical',representativeWorks:['鋼琴藝術津梁','B小調鋼琴奏鳴曲','六首交響曲作品18'],keyTerms:['鋼琴技巧','奏鳴曲式','教學曲集'],moves:['音階練習','奏鳴推進','鋼琴藝術津梁']},
  {id:'haydn',nameZh:'海頓',nameEn:'Joseph Haydn',birthYear:1732,deathYear:1809,nationality:'奧地利',period:'古典時期',artMovement:'維也納古典樂派',title:'交響曲與弦樂四重奏之父',color:'#779565',stageId:'classical',bgmId:'classical',representativeWorks:['驚愕交響曲','創世紀','皇帝弦樂四重奏'],keyTerms:['主題發展','弦樂四重奏','古典交響曲'],moves:['驚愕重音','四重奏連鎖','創世紀開天']},
  {id:'mozart',nameZh:'莫札特',nameEn:'Wolfgang Amadeus Mozart',birthYear:1756,deathYear:1791,nationality:'奧地利',period:'古典時期',artMovement:'維也納古典樂派',title:'旋律天才與歌劇心理學家',color:'#4e91c5',stageId:'classical',bgmId:'classical',representativeWorks:['魔笛','費加洛的婚禮','安魂曲'],keyTerms:['均衡樂句','歌劇角色塑造','協奏曲'],moves:['夜后高音','費加洛疾走','安魂曲審判']},
  {id:'beethoven',nameZh:'貝多芬',nameEn:'Ludwig van Beethoven',birthYear:1770,deathYear:1827,nationality:'德國',period:'古典至浪漫',artMovement:'維也納古典樂派',title:'命運動機的革命者',color:'#d0a33f',stageId:'classical',bgmId:'classical',representativeWorks:['第五號交響曲','第九號交響曲','月光奏鳴曲'],keyTerms:['動機發展','英雄風格','古典到浪漫'],moves:['命運敲門','英雄展開','歡樂頌風暴']},
  {id:'paganini',nameZh:'帕格尼尼',nameEn:'Niccolò Paganini',birthYear:1782,deathYear:1840,nationality:'義大利',period:'浪漫時期',artMovement:'浪漫炫技派',title:'魔鬼小提琴的傳奇',color:'#9d4b66',stageId:'classical',bgmId:'classical',representativeWorks:['二十四首隨想曲','第一號小提琴協奏曲','鐘'],keyTerms:['小提琴炫技','左手撥弦','泛音'],moves:['左手撥弦','隨想飛弓','魔鬼之鐘']},
  {id:'rossini',nameZh:'羅西尼',nameEn:'Gioachino Rossini',birthYear:1792,deathYear:1868,nationality:'義大利',period:'古典至浪漫',artMovement:'美聲歌劇',title:'羅西尼漸強的喜劇大師',color:'#b65b4b',stageId:'classical',bgmId:'classical',representativeWorks:['塞維亞的理髮師','威廉泰爾','灰姑娘'],keyTerms:['美聲歌劇','羅西尼漸強','喜歌劇'],moves:['理髮師快刀','漸強浪潮','威廉泰爾序曲']},
  {id:'schubert',nameZh:'舒伯特',nameEn:'Franz Schubert',birthYear:1797,deathYear:1828,nationality:'奧地利',period:'浪漫時期',artMovement:'早期浪漫樂派',title:'藝術歌曲的吟遊詩人',color:'#6b74ad',stageId:'classical',bgmId:'classical',representativeWorks:['魔王','未完成交響曲','冬之旅'],keyTerms:['藝術歌曲','歌唱性旋律','調性轉換'],moves:['魔王奔馳','未完成樂章','冬之旅長夜']},

  {id:'mendelssohn',nameZh:'孟德爾頌',nameEn:'Felix Mendelssohn',birthYear:1809,deathYear:1847,nationality:'德國',period:'浪漫時期',artMovement:'浪漫樂派',title:'精靈夜曲的古典詩人',color:'#5c8b8a',stageId:'romantic',bgmId:'romantic',representativeWorks:['仲夏夜之夢','義大利交響曲','無言歌'],keyTerms:['透明配器','古典形式','標題音樂'],moves:['精靈舞步','無言歌流','仲夏夜之夢']},
  {id:'chopin',nameZh:'蕭邦',nameEn:'Frédéric Chopin',birthYear:1810,deathYear:1849,nationality:'波蘭',period:'浪漫時期',artMovement:'浪漫鋼琴學派',title:'鋼琴詩人',color:'#8e70ad',stageId:'romantic',bgmId:'romantic',representativeWorks:['降E大調夜曲','英雄波蘭舞曲','二十四首前奏曲'],keyTerms:['鋼琴詩性','半音和聲','波蘭舞曲'],moves:['夜曲微光','圓舞曲迴旋','英雄波蘭舞曲']},
  {id:'schumann',nameZh:'舒曼',nameEn:'Robert Schumann',birthYear:1810,deathYear:1856,nationality:'德國',period:'浪漫時期',artMovement:'德國浪漫樂派',title:'雙重人格的音樂詩人',color:'#557a9f',stageId:'romantic',bgmId:'romantic',representativeWorks:['詩人之戀','兒時情景','狂歡節'],keyTerms:['性格小品','文學聯想','聯篇歌曲'],moves:['兒時夢影','狂歡節面具','詩人之戀']},
  {id:'liszt',nameZh:'李斯特',nameEn:'Franz Liszt',birthYear:1811,deathYear:1886,nationality:'匈牙利',period:'浪漫時期',artMovement:'浪漫炫技派',title:'交響詩與鋼琴炫技之王',color:'#b54e5e',stageId:'romantic',bgmId:'romantic',representativeWorks:['匈牙利狂想曲第二號','愛之夢第三號','前奏曲'],keyTerms:['交響詩','主題變形','鋼琴炫技'],moves:['愛之夢飛音','狂想曲連擊','超技練習風暴']},
  {id:'wagner',nameZh:'華格納',nameEn:'Richard Wagner',birthYear:1813,deathYear:1883,nationality:'德國',period:'浪漫時期',artMovement:'德國浪漫歌劇',title:'樂劇與主導動機的鍛造者',color:'#9e493f',stageId:'romantic',bgmId:'romantic',representativeWorks:['尼貝龍根的指環','崔斯坦與伊索德','女武神'],keyTerms:['主導動機','半音和聲','總體藝術'],moves:['主導動機','崔斯坦和弦','女武神騎行']},
  {id:'verdi',nameZh:'威爾第',nameEn:'Giuseppe Verdi',birthYear:1813,deathYear:1901,nationality:'義大利',period:'浪漫時期',artMovement:'義大利浪漫歌劇',title:'人性戲劇的歌劇巨匠',color:'#ba6740',stageId:'romantic',bgmId:'romantic',representativeWorks:['茶花女','阿伊達','弄臣'],keyTerms:['義大利歌劇','戲劇性旋律','合唱場面'],moves:['弄臣詠嘆','凱旋進行','阿伊達終幕']},
  {id:'clara-schumann',nameZh:'克拉拉・舒曼',nameEn:'Clara Schumann',birthYear:1819,deathYear:1896,nationality:'德國',period:'浪漫時期',artMovement:'德國浪漫樂派',title:'鋼琴舞台的先鋒',color:'#a4658f',stageId:'romantic',bgmId:'romantic',representativeWorks:['A小調鋼琴協奏曲','三首浪漫曲','音樂晚會'],keyTerms:['鋼琴演奏','浪漫曲','主題變奏'],moves:['浪漫曲輕擊','音樂晚會','協奏曲星芒']},
  {id:'brahms',nameZh:'布拉姆斯',nameEn:'Johannes Brahms',birthYear:1833,deathYear:1897,nationality:'德國',period:'浪漫時期',artMovement:'德國浪漫樂派',title:'古典形式的浪漫守護者',color:'#8b684b',stageId:'romantic',bgmId:'romantic',representativeWorks:['第一號交響曲','德意志安魂曲','匈牙利舞曲第五號'],keyTerms:['發展變奏','古典形式','厚實織體'],moves:['匈牙利舞步','變奏重擊','安魂曲穹頂']},
  {id:'tchaikovsky',nameZh:'柴可夫斯基',nameEn:'Pyotr Ilyich Tchaikovsky',birthYear:1840,deathYear:1893,nationality:'俄羅斯',period:'浪漫時期',artMovement:'俄羅斯浪漫樂派',title:'芭蕾旋律的情感劇作家',color:'#4f82a6',stageId:'romantic',bgmId:'romantic',representativeWorks:['天鵝湖','胡桃鉗','第六號交響曲悲愴'],keyTerms:['芭蕾音樂','抒情旋律','管弦樂色彩'],moves:['糖梅仙舞','天鵝展翼','悲愴交響']},
  {id:'dvorak',nameZh:'德弗札克',nameEn:'Antonín Dvořák',birthYear:1841,deathYear:1904,nationality:'捷克',period:'浪漫時期',artMovement:'民族樂派',title:'新世界的波希米亞旅人',color:'#5f8b6a',stageId:'romantic',bgmId:'romantic',representativeWorks:['新世界交響曲','斯拉夫舞曲','大提琴協奏曲'],keyTerms:['民族音樂','舞曲節奏','管弦樂旋律'],moves:['斯拉夫舞步','大提琴歌詠','新世界交響']},

  {id:'mahler',nameZh:'馬勒',nameEn:'Gustav Mahler',birthYear:1860,deathYear:1911,nationality:'奧地利',period:'晚期浪漫',artMovement:'晚期浪漫樂派',title:'以交響曲容納世界的人',color:'#616e91',stageId:'modern',bgmId:'modern',representativeWorks:['第二號交響曲復活','第五號交響曲','大地之歌'],keyTerms:['巨型交響曲','歌曲與交響曲','遠距配器'],moves:['遠方號角','大地之歌','復活交響']},
  {id:'debussy',nameZh:'德布西',nameEn:'Claude Debussy',birthYear:1862,deathYear:1918,nationality:'法國',period:'現代音樂早期',artMovement:'印象主義音樂',title:'音色與光影的煉金師',color:'#4d8ca4',stageId:'modern',bgmId:'modern',representativeWorks:['牧神午後前奏曲','月光','大海'],keyTerms:['全音音階','音色和聲','非功能和聲'],moves:['月光音階','牧神迷霧','大海三景']},
  {id:'schoenberg',nameZh:'荀貝格',nameEn:'Arnold Schoenberg',birthYear:1874,deathYear:1951,nationality:'奧地利',period:'二十世紀',artMovement:'第二維也納樂派',title:'十二音列的革命者',color:'#8d5c8e',stageId:'modern',bgmId:'modern',representativeWorks:['月迷彼埃羅','昇華之夜','華沙倖存者'],keyTerms:['無調性','十二音技法','音色旋律'],moves:['音色旋律','無調突進','十二音矩陣']},
  {id:'ravel',nameZh:'拉威爾',nameEn:'Maurice Ravel',birthYear:1875,deathYear:1937,nationality:'法國',period:'二十世紀',artMovement:'法國現代音樂',title:'精密管弦樂的珠寶匠',color:'#4f719f',stageId:'modern',bgmId:'modern',representativeWorks:['波麗露','達夫尼與克羅埃','鵝媽媽'],keyTerms:['精密配器','舞曲節奏','和聲色彩'],moves:['鵝媽媽幻影','波麗露漸強','達夫尼黎明']},
  {id:'bartok',nameZh:'巴爾托克',nameEn:'Béla Bartók',birthYear:1881,deathYear:1945,nationality:'匈牙利',period:'二十世紀',artMovement:'民族現代主義',title:'把民歌帶進現代的人',color:'#5b8d74',stageId:'modern',bgmId:'modern',representativeWorks:['管弦樂協奏曲','神奇的滿大人','弦樂打擊樂與鋼片琴音樂'],keyTerms:['民族音樂採集','軸心音系','不規則節拍'],moves:['民歌採集','夜之音樂','打擊樂軸心']},
  {id:'stravinsky',nameZh:'史特拉汶斯基',nameEn:'Igor Stravinsky',birthYear:1882,deathYear:1971,nationality:'俄羅斯',period:'二十世紀',artMovement:'現代主義',title:'節奏革命的變色龍',color:'#c25545',stageId:'modern',bgmId:'modern',representativeWorks:['春之祭','火鳥','彼得洛希卡'],keyTerms:['不規則重音','複節奏','新古典主義'],moves:['火鳥振翅','彼得洛希卡節拍','春之祭震擊']},
  {id:'prokofiev',nameZh:'普羅高菲夫',nameEn:'Sergei Prokofiev',birthYear:1891,deathYear:1953,nationality:'俄羅斯',period:'二十世紀',artMovement:'俄羅斯現代主義',title:'鋼鐵節奏與抒情的辯證者',color:'#6a739a',stageId:'modern',bgmId:'modern',representativeWorks:['羅密歐與茱麗葉','彼得與狼','第五號交響曲'],keyTerms:['機械節奏','尖銳和聲','抒情旋律'],moves:['騎士之舞','彼得狼影','鋼鐵交響']},
  {id:'gershwin',nameZh:'蓋希文',nameEn:'George Gershwin',birthYear:1898,deathYear:1937,nationality:'美國',period:'二十世紀',artMovement:'爵士與古典跨界',title:'藍色狂想的都會聲音',color:'#3e86a4',stageId:'modern',bgmId:'modern',representativeWorks:['藍色狂想曲','一個美國人在巴黎','波吉與貝絲'],keyTerms:['爵士和聲','切分節奏','古典跨界'],moves:['切分音擊','巴黎都會','藍色狂想曲']},
  {id:'shostakovich',nameZh:'蕭斯塔科維契',nameEn:'Dmitri Shostakovich',birthYear:1906,deathYear:1975,nationality:'蘇聯',period:'二十世紀',artMovement:'蘇聯現代音樂',title:'在壓力下發聲的交響作家',color:'#7a596c',stageId:'modern',bgmId:'modern',representativeWorks:['第五號交響曲','第七號交響曲列寧格勒','第八號弦樂四重奏'],keyTerms:['DSCH動機','諷刺語法','交響戲劇'],moves:['DSCH印記','列寧格勒進行','四重奏證言']},
  {id:'bernstein',nameZh:'伯恩斯坦',nameEn:'Leonard Bernstein',birthYear:1918,deathYear:1990,nationality:'美國',period:'二十世紀',artMovement:'美國跨界音樂',title:'舞台、交響與教育的橋樑',color:'#b35d55',stageId:'modern',bgmId:'modern',representativeWorks:['西城故事','憨第德','奇切斯特詩篇'],keyTerms:['音樂劇','爵士節奏','指揮與教育'],moves:['曼波節拍','憨第德序曲','西城交響']},
];

export const ARTIST_CATEGORY_GROUPS = [
  {id:'baroque',label:'巴洛克',artistIds:['monteverdi','purcell','rameau','vivaldi','bach','handel','scarlatti']},
  {id:'classical',label:'古典與過渡',artistIds:['clementi','haydn','mozart','beethoven','paganini','rossini','schubert']},
  {id:'romantic',label:'浪漫與民族樂派',artistIds:['mendelssohn','chopin','schumann','liszt','wagner','verdi','clara-schumann','brahms','tchaikovsky','dvorak']},
  {id:'modern',label:'現代與跨界',artistIds:['mahler','debussy','schoenberg','ravel','bartok','stravinsky','prokofiev','gershwin','shostakovich','bernstein']},
];

const categoryOrder = new Map(ARTIST_CATEGORY_GROUPS.flatMap((group,groupIndex)=>group.artistIds.map((id,index)=>[id,{groupId:group.id,groupLabel:group.label,order:groupIndex*100+index}])));
const BOSS_VARIANTS={
  bach:{maxHp:260,shield:[35,40,45],phaseNames:['對位展開','賦格追逐','平均律宇宙'],animation:'counterpoint-orbit',colors:['#c28b42','#f2d47d','#5f78a8']},
  mozart:{maxHp:235,shield:[30,30,40],phaseNames:['魔笛序曲','夜后高音','安魂曲終章'],animation:'opera-stars',colors:['#4e91c5','#d8d1ff','#f0ba52']},
  beethoven:{maxHp:280,shield:[40,45,50],phaseNames:['命運敲門','英雄風暴','歡樂頌'],animation:'motif-storm',colors:['#d0a33f','#8b4f3d','#f0df8b']},
  chopin:{maxHp:230,shield:[25,35,40],phaseNames:['夜曲微光','革命練習曲','英雄波蘭舞曲'],animation:'piano-rain',colors:['#8e70ad','#d9b7e9','#5876a6']},
  wagner:{maxHp:285,shield:[40,45,55],phaseNames:['主導動機','崔斯坦渴望','女武神騎行'],animation:'leitmotif-rings',colors:['#9e493f','#df8b52','#e6cf88']},
  tchaikovsky:{maxHp:260,shield:[35,40,45],phaseNames:['糖梅仙舞','天鵝暗影','悲愴終章'],animation:'ballet-snow',colors:['#4f82a6','#c6e0ef','#d583a5']},
  stravinsky:{maxHp:290,shield:[40,50,55],phaseNames:['火鳥甦醒','複節奏暴走','春之祭'],animation:'rhythm-shards',colors:['#c25545','#e5a442','#2e6d83']},
};

export const ARTISTS = CORE_MUSICIANS.map(musician=>{
  const category=categoryOrder.get(musician.id);
  return {...musician,...category,
    portrait:`assets/characters/${musician.id}-gallery.png`,battleSprite:`assets/characters/${musician.id}-battle.webp`,ultimateSprite:`assets/characters/${musician.id}-ultimate.webp`,koSprite:`assets/characters/${musician.id}-ko.webp`,
    biography:`${musician.nameZh}（${musician.birthYear}–${musician.deathYear}）是${musician.nationality}作曲家，也是${musician.artMovement}的重要人物。其音樂以${musician.keyTerms.join('、')}著稱，代表作品包括${musician.representativeWorks.join('、')}。遊戲把旋律、節奏、和聲與作品意象轉化為招式，讓玩家在對戰中建立西洋音樂史脈絡。`,
    styleSummary:musician.keyTerms.join('、'),timeline:[`${musician.birthYear}：出生`,`${musician.deathYear}：逝世`],
    lightAttack:{name:musician.moves[0],damage:8},heavyAttack:{name:musician.moves[1],damage:16},ultimateAttack:{name:musician.moves[2],damage:32},
    galleryUnlockCondition:'在單人、故事、Boss 或音樂試煉中擊敗',bossVariant:BOSS_VARIANTS[musician.id]||null,
  };
}).sort((a,b)=>a.order-b.order);

// 保留舊模組名稱，讓成熟的戰鬥核心無需冒險重寫；內容來源已完整改為音樂家。
export const ARTIST_MAP = Object.fromEntries(ARTISTS.map(musician=>[musician.id,musician]));
export const MUSICIANS = ARTISTS;
export const MUSICIAN_MAP = ARTIST_MAP;
export const MUSICIAN_CATEGORY_GROUPS = ARTIST_CATEGORY_GROUPS;
