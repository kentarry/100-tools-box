// ============================================================
// Weather-Outfit.js — 穿搭建議 & 虛擬試穿 (Enhanced v3)
// 由 app.js 透過 container 全域變數呼叫 render_weatherOutfit()
// 需搭配 Weather-Outfit-Data.js
// ============================================================

window.render_weatherOutfit = function () {
    var root = (typeof container !== 'undefined' && container)
        ? container
        : document.getElementById('tool-container');
    if (!root) return;

    var trends = window._outfitTrends || [];
    var colorMap = {
        black: '#1a1a1a', white: '#f5f5f5', navy: '#1e3a5f', gray: '#6b7280',
        beige: '#d4c5a9', brown: '#7c5e3c', olive: '#556b2f', wine: '#722f37',
        pink: '#e8a0bf', sky: '#87ceeb', cream: '#f5e6c8', denim: '#4a6d8c',
        camel: '#c19a6b', lavender: '#b4a7d6', sage: '#9caf88', coral: '#f08080',
        mustard: '#d4a520', teal: '#2d8b8b', burgundy: '#5c1a1a', forest: '#2d5a2d',
        rust: '#b7541e', plum: '#6a3d6a', peach: '#f5c2a0', charcoal: '#36454f'
    };
    var colorNames = {
        black: '黑色', white: '白色', navy: '海軍藍', gray: '灰色', beige: '米色',
        brown: '棕色', olive: '橄欖綠', wine: '酒紅', pink: '粉色', sky: '天空藍',
        cream: '奶油色', denim: '丹寧藍', camel: '駝色', lavender: '薰衣草紫',
        sage: '鼠尾草綠', coral: '珊瑚色', mustard: '芥末黃', teal: '藍綠',
        burgundy: '勃根地', forest: '森林綠', rust: '鐵鏽', plum: '梅紫',
        peach: '蜜桃', charcoal: '炭灰'
    };

    function tempToSeason(t) {
        if (t >= 28) return 'summer';
        if (t >= 20) return 'spring';
        if (t >= 12) return 'autumn';
        return 'winter';
    }

    root.innerHTML = '<div class="w-full max-w-3xl mx-auto font-sans">' +
        '<div class="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg">' +
        '<h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2"><span class="text-3xl">👗</span> 穿搭建議 & 虛擬試穿</h3>' +
        '<p class="text-pink-100 text-sm mt-1">天氣穿搭建議 ・ SVG 虛擬形象 ・ 360° 旋轉 ・ 圖片辨識配色</p>' +
        '</div>' +
        '<div class="flex gap-2 mb-4">' +
        '<button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-violet-500 bg-violet-50 text-violet-700 shadow-sm" data-tab="weather">☀️ 天氣穿搭</button>' +
        '<button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-tab="avatar">👤 虛擬試穿</button>' +
        '<button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-tab="trends">✨ 穿搭靈感</button>' +
        '</div>' +
        '<div id="wo-weather-panel" class="wo-panel"></div>' +
        '<div id="wo-avatar-panel" class="wo-panel hidden"></div>' +
        '<div id="wo-trends-panel" class="wo-panel hidden"></div>' +
        '</div>';

    // ── Weather Panel ──
    document.getElementById('wo-weather-panel').innerHTML =
        '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">' +
        '<div class="flex flex-col sm:flex-row gap-4 items-center mb-4">' +
        '<div class="flex items-center gap-3 flex-1">' +
        '<span class="text-sm font-bold text-slate-500">🌡️</span>' +
        '<button id="wo-tm" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 font-bold transition active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer">−</button>' +
        '<span id="wo-temp" class="text-3xl font-extrabold text-slate-800 w-12 text-center tabular-nums">25</span>' +
        '<span class="text-sm text-slate-400">°C</span>' +
        '<button id="wo-tp" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 font-bold transition active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer">+</button>' +
        '</div>' +
        '<button id="wo-loc" class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold cursor-pointer hover:shadow-md transition active:scale-95 whitespace-nowrap">📍 自動定位</button>' +
        '</div>' +
        '<div id="wo-winfo" class="text-xs text-slate-400 text-center hidden mb-3"></div>' +
        '<div class="flex gap-2">' +
        '<button id="wo-gm" class="wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 border-blue-400 bg-blue-50 text-blue-700" data-g="male">🚹 男生</button>' +
        '<button id="wo-gf" class="wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-g="female">🚺 女生</button>' +
        '</div>' +
        '</div>' +
        '<div id="wo-wresults" class="space-y-3 mb-4"></div>';

    // ── Avatar Panel ──
    document.getElementById('wo-avatar-panel').innerHTML =
        '<div id="av-sel-bar" class="hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-3 mb-3">' +
        '<div class="flex items-center gap-2 mb-1.5"><span class="text-xs font-bold text-slate-400">目前選擇</span>' +
        '<button id="av-reset-all" class="text-xs text-red-400 hover:text-red-600 cursor-pointer ml-auto transition">全部清除</button></div>' +
        '<div id="av-pills" class="flex flex-wrap gap-1.5"></div></div>' +
        '<div class="flex flex-col lg:flex-row gap-4 mb-4">' +
        /* Preview sidebar */
        '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col items-center lg:w-52 flex-shrink-0 sticky top-4 self-start">' +
        '<div class="flex items-center justify-between w-full mb-2"><span class="text-xs font-bold text-slate-500">👤 預覽</span><span class="text-xs text-slate-300">拖曳旋轉</span></div>' +
        '<div id="av-stage" class="w-40 h-56 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing" style="touch-action:none"></div>' +
        '<div class="flex items-center gap-1 mt-2 w-full">' +
        '<button id="av-rot-f" class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200 transition">正面</button>' +
        '<input type="range" id="av-rot-s" min="-180" max="180" value="0" class="flex-1 accent-violet-500">' +
        '<button id="av-rot-b" class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200 transition">背面</button>' +
        '</div>' +
        '<div id="av-rot-lbl" class="text-xs text-slate-300 mt-1 text-center">👤 正面 0°</div>' +
        '<div id="av-sum" class="text-xs text-slate-400 mt-2 text-center leading-relaxed"></div>' +
        '</div>' +
        /* Controls */
        '<div class="flex-1 space-y-3 min-w-0" id="av-controls">' +
        /* Tab nav for avatar sections */
        '<div class="flex gap-1.5 overflow-x-auto pb-1" id="av-tabs"></div>' +
        '<div id="av-tab-content"></div>' +
        '</div>' +
        '</div>';

    // ── Trends Panel ──
    document.getElementById('wo-trends-panel').innerHTML =
        '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">' +
        '<div class="flex flex-wrap gap-1.5">' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-violet-400 bg-violet-50 text-violet-700 cursor-pointer transition" data-f="all">全部</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="spring">🌸 春</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="summer">☀️ 夏</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="autumn">🍂 秋</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="winter">❄️ 冬</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="male">🚹 男</button>' +
        '<button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="female">🚺 女</button>' +
        '</div>' +
        '</div>' +
        '<div id="wo-tresults" class="space-y-3 mb-4"></div>';

    // ═══════════════════════════════════════
    // LOGIC
    // ═══════════════════════════════════════
    setTimeout(function () {
        var temp = 25, wGender = 'male', tFilter = 'all';

        // ── Avatar State ──
        var AV = {
            body: 'male', ht: 170, wt: 60, skin: '#deb887',
            face: 'oval', hair: 'short', hc: '#3a2a1a',
            hLen: 0.5, hVol: 0.5, hY: 0.5,
            topT: 'tee', topC: '#f5f5f5',
            botT: 'jeans', botC: '#4a6d8c',
            tuck: false, rot: 0, acc: {}, img: null
        };
        var AV_DEF = JSON.parse(JSON.stringify(AV));
        var avTab = 'body';

        // ── Data ──
        var faces = [
            { id: 'oval', n: '鵝蛋臉', rx: 1, ry: 1.05, hw: 1 },
            { id: 'round', n: '圓臉', rx: 1.08, ry: 1, hw: 1.1 },
            { id: 'square', n: '方臉', rx: 1, ry: 1, hw: 1.03, jaw: 1 },
            { id: 'heart', n: '心形臉', rx: 1.05, ry: 1, hw: 1.08, jaw: -1 },
            { id: 'long', n: '長臉', rx: 0.9, ry: 1.15, hw: 0.88 },
            { id: 'diamond', n: '菱形臉', rx: 1, ry: 1.05, hw: 1.02, jaw: -0.5 },
            { id: 'oblong', n: '橢圓臉', rx: 0.94, ry: 1.1, hw: 0.92 },
            { id: 'pear', n: '梨形臉', rx: 0.95, ry: 1, hw: 0.95, jaw: 0.5 }
        ];
        var hairStyles = {
            male: [
                { id: 'short', n: '經典短髮' }, { id: 'buzzcut', n: '板寸平頭' }, { id: 'sidePart', n: '側分油頭' },
                { id: 'pompadour', n: '飛機頭' }, { id: 'curly', n: '自然捲' }, { id: 'undercut', n: 'Undercut' },
                { id: 'mohawk', n: '莫霍克' }, { id: 'messy', n: '微亂蓬鬆' }, { id: 'manBun', n: '丸子頭' },
                { id: 'middlePart', n: '中分' }, { id: 'combOver', n: '梳背頭' }, { id: 'textured', n: '層次短髮' },
                { id: 'fringe', n: '瀏海短髮' }, { id: 'taper', n: '漸層剃邊' }, { id: 'wolfcut', n: '狼尾' },
                { id: 'quiff', n: '蓬鬆上梳' }
            ],
            female: [
                { id: 'long', n: '長直髮' }, { id: 'bob', n: '鮑伯頭' }, { id: 'curlyLong', n: '長捲髮' },
                { id: 'ponytail', n: '高馬尾' }, { id: 'twoBuns', n: '雙丸子' }, { id: 'pixie', n: '精靈短髮' },
                { id: 'braids', n: '編髮' }, { id: 'wavyMid', n: '中長微捲' }, { id: 'bangs', n: '齊瀏海長髮' },
                { id: 'sideSwept', n: '側掃瀏海' }, { id: 'lowPony', n: '低馬尾' }, { id: 'halfUp', n: '公主半頭' },
                { id: 'curtainBangs', n: '窗簾瀏海' }, { id: 'layered', n: '層次長髮' }, { id: 'bun', n: '丸子頭' },
                { id: 'fishtail', n: '魚骨辮' }
            ]
        };
        var hairColors = [
            { h: '#1a1a1a', n: '黑' }, { h: '#3a2a1a', n: '深棕' }, { h: '#6b4423', n: '棕' },
            { h: '#a0764f', n: '淺棕' }, { h: '#d4a843', n: '金' }, { h: '#e8dcc8', n: '淺金' },
            { h: '#8b3a2a', n: '紅棕' }, { h: '#c65d3e', n: '薑紅' }, { h: '#888', n: '灰' },
            { h: '#ddd', n: '銀白' }, { h: '#3366cc', n: '寶藍' }, { h: '#e87ba8', n: '粉' },
            { h: '#7744aa', n: '紫' }, { h: '#44885a', n: '墨綠' }, { h: '#cc3333', n: '正紅' }, { h: '#ff8800', n: '橘' }
        ];
        var skins = [
            { h: '#fef0e0', n: '瓷白' }, { h: '#fde7c5', n: '淺膚' }, { h: '#f5d5b8', n: '粉嫩' },
            { h: '#deb887', n: '自然' }, { h: '#d4a574', n: '蜜桃' }, { h: '#c4956a', n: '健康' },
            { h: '#b8865a', n: '小麥' }, { h: '#a0764f', n: '古銅' }, { h: '#8b6240', n: '咖啡' },
            { h: '#6b4423', n: '深膚' }, { h: '#5a3520', n: '巧克力' }, { h: '#3d2517', n: '黑檀' }
        ];
        var tops = [
            { id: 'tee', n: 'T恤', i: '👕' }, { id: 'polo', n: 'POLO衫', i: '👔' },
            { id: 'shirt', n: '襯衫', i: '👔', lo: 1 }, { id: 'hoodie', n: '帽T', i: '🧥', lo: 1 },
            { id: 'sweater', n: '毛衣', i: '🧶', lo: 1 }, { id: 'cardigan', n: '針織外套', i: '🧥', lo: 1 },
            { id: 'jacket', n: '夾克', i: '🧥', lo: 1 }, { id: 'coat', n: '大衣', i: '🧥', lo: 1, ct: 1 },
            { id: 'puffer', n: '羽絨外套', i: '🧥', lo: 1, ct: 1 }, { id: 'blazer', n: '西裝外套', i: '🤵', lo: 1 },
            { id: 'tank', n: '背心', i: '🎽' }, { id: 'crop', n: '短版上衣', i: '👚' },
            { id: 'blouse', n: '雪紡上衣', i: '👚', lo: 1 }, { id: 'denim-j', n: '牛仔外套', i: '🧥', lo: 1 },
            { id: 'windbreaker', n: '風衣', i: '🧥', lo: 1 }, { id: 'turtleneck', n: '高領毛衣', i: '🧶', lo: 1 },
            { id: 'henley', n: '亨利衫', i: '👕' }, { id: 'hawaiian', n: '夏威夷衫', i: '🌺' },
            { id: 'vest', n: '西裝背心', i: '🦺' }, { id: 'leather', n: '皮衣', i: '🧥', lo: 1 }
        ];
        var bots = [
            { id: 'jeans', n: '牛仔褲', i: '👖' }, { id: 'shorts', n: '短褲', i: '🩳' },
            { id: 'chinos', n: '卡其褲', i: '👖' }, { id: 'sweats', n: '運動褲', i: '👖' },
            { id: 'dress-p', n: '西裝褲', i: '👖' }, { id: 'skirt', n: '短裙', i: '👗' },
            { id: 'long-sk', n: '長裙', i: '👗' }, { id: 'leggings', n: '內搭褲', i: '👖' },
            { id: 'wide', n: '寬褲', i: '👖' }, { id: 'cargo', n: '工裝褲', i: '👖' },
            { id: 'pleated', n: '百褶裙', i: '👗' }, { id: 'overalls', n: '吊帶褲', i: '👖' },
            { id: 'jogger', n: '束口褲', i: '👖' }, { id: 'culottes', n: '裙褲', i: '👗' },
            { id: 'bermuda', n: '百慕達短褲', i: '🩳' }
        ];
        var accCats = [
            {
                cat: 'hat', n: '帽子', icon: '🧢', items: [
                    { id: 'cap', n: '棒球帽' }, { id: 'bucket', n: '漁夫帽' }, { id: 'beanie', n: '毛帽' },
                    { id: 'beret', n: '貝雷帽' }, { id: 'fedora', n: '紳士帽' }, { id: 'straw', n: '草帽' },
                    { id: 'visor', n: '遮陽帽' }, { id: 'newsboy', n: '報童帽' }, { id: 'cowboy', n: '牛仔帽' },
                    { id: 'trapper', n: '雷鋒帽' }, { id: 'panama', n: '巴拿馬帽' }, { id: 'headband', n: '髮帶' },
                    { id: 'snapback', n: '後扣帽' }, { id: 'boater', n: '平頂草帽' }, { id: 'turban', n: '頭巾' }
                ]
            },
            {
                cat: 'eyewear', n: '眼鏡', icon: '🕶️', items: [
                    { id: 'sunglasses', n: '經典墨鏡' }, { id: 'aviator', n: '飛行員墨鏡' }, { id: 'roundG', n: '圓框眼鏡' },
                    { id: 'squareG', n: '方框眼鏡' }, { id: 'catEye', n: '貓眼眼鏡' }, { id: 'halfRim', n: '半框眼鏡' },
                    { id: 'sport', n: '運動眼鏡' }, { id: 'oversized', n: '大框墨鏡' }, { id: 'tinted', n: '彩色鏡片' },
                    { id: 'rimless', n: '無框眼鏡' }, { id: 'clubmaster', n: '眉框眼鏡' }, { id: 'wayfarer', n: '旅行者墨鏡' },
                    { id: 'shield', n: '面罩墨鏡' }, { id: 'octagon', n: '八角眼鏡' }, { id: 'geometric', n: '幾何眼鏡' }
                ]
            },
            {
                cat: 'neckwear', n: '頸部配件', icon: '📿', items: [
                    { id: 'goldChain', n: '金項鍊' }, { id: 'silverChain', n: '銀項鍊' }, { id: 'pendant', n: '墜飾項鍊' },
                    { id: 'choker', n: '頸圈' }, { id: 'pearls', n: '珍珠項鍊' }, { id: 'scarf', n: '圍巾' },
                    { id: 'tie', n: '領帶' }, { id: 'bowtie', n: '蝴蝶結' }, { id: 'bandana', n: '領巾' },
                    { id: 'locket', n: '相片項鍊' }, { id: 'layeredN', n: '疊戴項鍊' }, { id: 'beaded', n: '串珠項鍊' },
                    { id: 'torque', n: '金屬頸環' }, { id: 'leatherN', n: '皮繩項鍊' }, { id: 'ascot', n: '蝶領巾' }
                ]
            },
            {
                cat: 'wrist', n: '腕飾', icon: '⌚', items: [
                    { id: 'watchGold', n: '金錶' }, { id: 'watchSilver', n: '銀錶' }, { id: 'watchSport', n: '運動手錶' },
                    { id: 'braceletGold', n: '金手鏈' }, { id: 'braceletSilver', n: '銀手鏈' }, { id: 'braceletBeads', n: '串珠手環' },
                    { id: 'braceletLeather', n: '皮革手環' }, { id: 'bangle', n: '手鐲' }, { id: 'charm', n: '吊飾手鏈' },
                    { id: 'cuff', n: '寬手環' }, { id: 'thread', n: '編織手繩' }, { id: 'fitness', n: '運動手環' },
                    { id: 'banglesSet', n: '多層手鐲' }, { id: 'rosegold', n: '玫瑰金手環' }, { id: 'smartWatch', n: '智慧手錶' }
                ]
            },
            {
                cat: 'ears', n: '耳飾', icon: '💎', items: [
                    { id: 'studGold', n: '金耳釘' }, { id: 'studSilver', n: '銀耳釘' }, { id: 'studDiamond', n: '鑽石耳環' },
                    { id: 'hoopSmall', n: '小圈耳環' }, { id: 'hoopLarge', n: '大圈耳環' }, { id: 'dropGold', n: '金墜耳環' },
                    { id: 'dropPearl', n: '珍珠耳環' }, { id: 'huggie', n: '貼耳環' }, { id: 'tassel', n: '流蘇耳環' },
                    { id: 'clipOn', n: '夾式耳環' }, { id: 'cuffE', n: '耳骨夾' }, { id: 'chandelier', n: '吊燈耳環' },
                    { id: 'threadE', n: '線條耳環' }, { id: 'geoE', n: '幾何耳環' }, { id: 'floral', n: '花朵耳環' }
                ]
            },
            {
                cat: 'bag', n: '包包', icon: '👜', items: [
                    { id: 'tote', n: '托特包' }, { id: 'backpack', n: '後背包' }, { id: 'crossbody', n: '斜背包' },
                    { id: 'clutch', n: '手拿包' }, { id: 'messenger', n: '郵差包' }, { id: 'fanny', n: '腰包' },
                    { id: 'drawstring', n: '束口袋' }, { id: 'bucketBag', n: '水桶包' }, { id: 'duffel', n: '旅行袋' },
                    { id: 'sling', n: '胸包' }, { id: 'miniBack', n: '迷你後背包' }, { id: 'briefcase', n: '公事包' },
                    { id: 'hobo', n: '流浪包' }, { id: 'saddleBag', n: '馬鞍包' }, { id: 'schoolBag', n: '書包' }
                ]
            },
            {
                cat: 'beard', n: '鬍子', icon: '🧔', items: [
                    { id: 'stubble', n: '短鬍渣' }, { id: 'goatee', n: '山羊鬍' }, { id: 'mustache', n: '八字鬍' },
                    { id: 'full', n: '落腮鬍' }, { id: 'chin', n: '下巴鬍' }, { id: 'handlebar', n: '英倫鬍' }
                ]
            },
            {
                cat: 'belt', n: '腰帶', icon: '🪢', items: [
                    { id: 'leatherBlack', n: '黑皮帶' }, { id: 'leatherBrown', n: '棕皮帶' }, { id: 'canvas', n: '帆布腰帶' },
                    { id: 'chainB', n: '鏈條腰帶' }, { id: 'woven', n: '編織腰帶' }, { id: 'western', n: '西部腰帶' },
                    { id: 'thin', n: '細腰帶' }, { id: 'wideBelt', n: '寬腰帶' }, { id: 'elastic', n: '彈性腰帶' },
                    { id: 'designer', n: '名牌腰帶' }, { id: 'obi', n: '和風腰帶' }, { id: 'rope', n: '繩結腰帶' },
                    { id: 'military', n: '軍風腰帶' }, { id: 'studded', n: '鉚釘腰帶' }, { id: 'sash', n: '綢帶腰帶' }
                ]
            }
        ];
        var allColors = Object.keys(colorMap).map(function (id) { return { id: id, hex: colorMap[id], name: colorNames[id] }; });

        // ── Tab switching ──
        root.querySelectorAll('.wo-tab').forEach(function (b) {
            b.addEventListener('click', function () {
                var t = b.getAttribute('data-tab');
                root.querySelectorAll('.wo-tab').forEach(function (x) {
                    var on = x.getAttribute('data-tab') === t;
                    x.className = 'wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 ' + (on ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500');
                });
                root.querySelectorAll('.wo-panel').forEach(function (p) { p.classList.add('hidden'); });
                document.getElementById('wo-' + t + '-panel').classList.remove('hidden');
            });
        });

        // ═══ WEATHER ═══
        var tD = document.getElementById('wo-temp');
        document.getElementById('wo-tm').addEventListener('click', function () { if (temp > -10) { temp--; tD.textContent = temp; renderW(); } });
        document.getElementById('wo-tp').addEventListener('click', function () { if (temp < 45) { temp++; tD.textContent = temp; renderW(); } });
        root.querySelectorAll('.wo-gbtn').forEach(function (b) {
            b.addEventListener('click', function () {
                wGender = b.getAttribute('data-g');
                document.getElementById('wo-gm').className = 'wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 ' + (wGender === 'male' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500');
                document.getElementById('wo-gf').className = 'wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 ' + (wGender === 'female' ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-slate-200 bg-white text-slate-500');
                renderW();
            });
        });
        document.getElementById('wo-loc').addEventListener('click', function () {
            var btn = document.getElementById('wo-loc');
            btn.textContent = '⏳ 定位中...';
            if (!navigator.geolocation) { btn.textContent = '❌ 不支援'; return; }
            navigator.geolocation.getCurrentPosition(function (p) {
                fetch('https://api.open-meteo.com/v1/forecast?latitude=' + p.coords.latitude.toFixed(2) + '&longitude=' + p.coords.longitude.toFixed(2) + '&current_weather=true&timezone=auto')
                    .then(function (r) { return r.json(); })
                    .then(function (d) {
                        temp = Math.round(d.current_weather.temperature);
                        tD.textContent = temp;
                        var info = document.getElementById('wo-winfo');
                        info.classList.remove('hidden');
                        info.textContent = '📍 即時氣溫 ' + temp + '°C ・ 風速 ' + d.current_weather.windspeed + ' km/h';
                        btn.textContent = '📍 自動定位';
                        renderW();
                    }).catch(function () { btn.textContent = '❌ 取得失敗'; });
            }, function () { btn.textContent = '❌ 定位被拒'; });
        });

        function trendCard(a) {
            var dots = (a.c || []).map(function (c) {
                return '<span class="inline-block w-4 h-4 rounded-full border border-slate-200 flex-shrink-0" style="background:' + (colorMap[c] || '#ccc') + '" title="' + (colorNames[c] || c) + '"></span>';
            }).join('');
            var stars = ''; for (var k = 0; k < Math.min(a.pop, 5); k++) stars += '🔥';
            return '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">' +
                '<div class="flex items-start justify-between mb-1"><div class="text-base font-bold text-slate-800">' + a.t + '</div><div class="text-xs text-slate-300 whitespace-nowrap">' + stars + '</div></div>' +
                '<div class="text-xs text-slate-400 mb-2">' + a.style + ' 風格 ・ ' + (a.g === 'male' ? '🚹 男' : '🚺 女') + '</div>' +
                '<div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3"><div class="text-sm font-medium text-slate-700">📦 ' + a.items + '</div></div>' +
                '<p class="text-sm text-slate-600 mb-2">' + a.d + '</p>' +
                '<div class="flex items-center gap-1.5"><span class="text-xs text-slate-400">配色：</span>' + dots + '</div></div>';
        }

        function renderW() {
            var s = tempToSeason(temp);
            var sn = { spring: '春天', summer: '夏天', autumn: '秋天', winter: '冬天' }[s];
            var si = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' }[s];
            var matches = trends.filter(function (t) { return t.s === s && t.g === wGender; });
            var adv = '';
            if (temp >= 30) adv = '天氣炎熱 🔥 建議穿著輕薄透氣衣物，注意防曬';
            else if (temp >= 25) adv = '天氣溫暖 ☀️ 短袖搭薄長褲或短褲都合適';
            else if (temp >= 20) adv = '氣溫舒適 🌤️ 可搭配薄外套早晚備用';
            else if (temp >= 15) adv = '微涼天氣 🌥️ 建議穿長袖加外套';
            else if (temp >= 10) adv = '天氣偏冷 🌧️ 需要毛衣和厚外套';
            else adv = '天氣寒冷 ❄️ 請穿羽絨衣保暖，搭配圍巾帽子';
            var bg = { summer: 'from-orange-50 to-yellow-50', winter: 'from-blue-50 to-indigo-50', autumn: 'from-amber-50 to-orange-50', spring: 'from-green-50 to-emerald-50' }[s];
            var bd = { summer: 'border-orange-100', winter: 'border-blue-100', autumn: 'border-amber-100', spring: 'border-green-100' }[s];
            var html = '<div class="bg-gradient-to-r ' + bg + ' rounded-2xl p-5 border ' + bd + '"><div class="flex items-center gap-2 mb-1"><span class="text-2xl">' + si + '</span><span class="text-lg font-bold text-slate-800">' + temp + '°C — ' + sn + '穿搭建議</span></div><p class="text-sm text-slate-600">' + adv + '</p></div>';
            html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">🔥 共 ' + matches.length + ' 組推薦（依人氣排序）</div>';
            matches.forEach(function (a) { html += trendCard(a); });
            document.getElementById('wo-wresults').innerHTML = html;
        }

        // ═══════════════════════════════════════
        // AVATAR — SVG Drawing Functions
        // ═══════════════════════════════════════

        function getFace(id) { return faces.find(function (f) { return f.id === id; }) || faces[0]; }

        // ── Generate Hair SVG ──
        function genHair(cx, hy, hr, faceId, style, col, body, hLen, hVol, hY, hasHat, layer) {
            if (hasHat) return '';
            var l = layer || 'all';
            var f = getFace(faceId);
            var fRx = hr * f.rx, fRy = hr * f.ry;
            var fem = body === 'female';
            var vol = 0.8 + hVol * 0.4;
            var len = 0.5 + hLen * 0.5;
            var s = '';
            var T = hy - fRy;
            var B = hy + 2;
            var L = cx - fRx;
            var R = cx + fRx;
            var hw = fRx * vol + 0.5;
            var ht = 1 + len * 2.5;

            if (!fem) {
                var capL = cx - hw, capR = cx + hw;
                var capT = T - ht;
                var cap = 'M' + capL + ' ' + B + ' C' + capL + ' ' + (T - 1) + ' ' + (capL + 1) + ' ' + capT + ' ' + cx + ' ' + (capT - 0.5) + ' C' + (capR - 1) + ' ' + capT + ' ' + capR + ' ' + (T - 1) + ' ' + capR + ' ' + B + ' Z';

                if (style === 'buzzcut') {
                    if (l === 'base' || l === 'all') {
                        var bL = cx - fRx * vol, bR = cx + fRx * vol, bT = T - 0.5 - len * 0.8;
                        s += '<path d="M' + bL + ' ' + (B - 1) + ' C' + bL + ' ' + T + ' ' + (bL + 1) + ' ' + bT + ' ' + cx + ' ' + (bT - 0.3) + ' C' + (bR - 1) + ' ' + bT + ' ' + bR + ' ' + T + ' ' + bR + ' ' + (B - 1) + ' Z" fill="' + col + '" opacity=".5"/>';
                    }
                } else if (style === 'sidePart') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') s += '<path d="M' + (cx - hw * 0.3) + ' ' + capT + ' C' + cx + ' ' + (capT - len * 1.5) + ' ' + (capR + 1) + ' ' + (T + 1) + ' ' + capR + ' ' + (B - 2) + '" fill="' + col + '"/>';
                } else if (style === 'pompadour') {
                    if (l === 'base' || l === 'all') {
                        var pT = capT - 2 * len;
                        s += '<path d="M' + capL + ' ' + B + ' C' + capL + ' ' + (T - 1) + ' ' + (capL + 2) + ' ' + pT + ' ' + cx + ' ' + (pT - 1) + ' C' + (capR - 2) + ' ' + pT + ' ' + capR + ' ' + (T - 1) + ' ' + capR + ' ' + B + ' Z" fill="' + col + '"/>';
                    }
                } else if (style === 'curly') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') {
                        for (var ci = -2; ci <= 2; ci++) s += '<circle cx="' + (cx + ci * (hw * 0.4)) + '" cy="' + (capT + 0.5 + Math.abs(ci) * 0.3) + '" r="' + (1.5 * vol) + '" fill="' + col + '"/>';
                    }
                } else if (style === 'undercut') {
                    if (l === 'base' || l === 'all') s += '<path d="M' + L + ' ' + B + ' C' + L + ' ' + (T + 2) + ' ' + (L + 2) + ' ' + (T + 1) + ' ' + cx + ' ' + (T + 1) + ' C' + (R - 2) + ' ' + (T + 1) + ' ' + R + ' ' + (T + 2) + ' ' + R + ' ' + B + ' Z" fill="' + col + '" opacity=".2"/>';
                    if (l === 'front' || l === 'all') s += '<path d="M' + (cx - hw * 0.5) + ' ' + (T + 1) + ' C' + (cx - hw * 0.3) + ' ' + (capT - len) + ' ' + (cx + hw * 0.3) + ' ' + (capT - len) + ' ' + (cx + hw * 0.6) + ' ' + T + ' Z" fill="' + col + '"/>';
                } else if (style === 'mohawk') {
                    if (l === 'base' || l === 'all') s += '<path d="M' + L + ' ' + B + ' C' + L + ' ' + (T + 2) + ' ' + (L + 2) + ' ' + (T + 1) + ' ' + cx + ' ' + (T + 1) + ' C' + (R - 2) + ' ' + (T + 1) + ' ' + R + ' ' + (T + 2) + ' ' + R + ' ' + B + ' Z" fill="' + col + '" opacity=".15"/>';
                    if (l === 'front' || l === 'all') {
                        var mT = capT - 3 * len;
                        s += '<path d="M' + (cx - 2 * vol) + ' ' + (T + 1) + ' C' + (cx - 1.5) + ' ' + mT + ' ' + (cx + 1.5) + ' ' + mT + ' ' + (cx + 2 * vol) + ' ' + (T + 1) + ' Z" fill="' + col + '"/>';
                    }
                } else if (style === 'messy') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') {
                        for (var mi = -2; mi <= 2; mi++) {
                            var mx = cx + mi * (hw * 0.35);
                            var my = capT + Math.abs(mi) * 0.3;
                            s += '<line x1="' + mx + '" y1="' + my + '" x2="' + (mx + mi * 0.8) + '" y2="' + (my - 1.2 * len) + '" stroke="' + col + '" stroke-width="' + (1.5 * vol) + '" stroke-linecap="round"/>';
                        }
                    }
                } else if (style === 'manBun') {
                    if (l === 'base' || l === 'all') s += '<path d="M' + L + ' ' + B + ' C' + L + ' ' + (T + 2) + ' ' + (L + 2) + ' ' + (T + 1) + ' ' + cx + ' ' + (T + 1) + ' C' + (R - 2) + ' ' + (T + 1) + ' ' + R + ' ' + (T + 2) + ' ' + R + ' ' + B + ' Z" fill="' + col + '" opacity=".2"/>';
                    if (l === 'base' || l === 'all') s += '<circle cx="' + cx + '" cy="' + (T - ht * 0.8) + '" r="' + (3 * vol) + '" fill="' + col + '"/>';
                } else if (style === 'middlePart') {
                    if (l === 'base' || l === 'all') {
                        s += '<path d="M' + capL + ' ' + B + ' C' + capL + ' ' + (T - 1) + ' ' + (capL + 1) + ' ' + capT + ' ' + (cx - 0.5) + ' ' + (capT + 0.5) + ' L' + (cx - 0.5) + ' ' + (T + 1) + ' L' + capL + ' ' + B + ' Z" fill="' + col + '"/>';
                        s += '<path d="M' + capR + ' ' + B + ' C' + capR + ' ' + (T - 1) + ' ' + (capR - 1) + ' ' + capT + ' ' + (cx + 0.5) + ' ' + (capT + 0.5) + ' L' + (cx + 0.5) + ' ' + (T + 1) + ' L' + capR + ' ' + B + ' Z" fill="' + col + '"/>';
                    }
                } else if (style === 'combOver') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') s += '<path d="M' + (cx - hw * 0.4) + ' ' + capT + ' Q' + cx + ' ' + (capT - 0.8 * len) + ' ' + (capR + 0.5) + ' ' + (T + 1) + '" fill="' + col + '"/>';
                } else if (style === 'textured') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') {
                        for (var ti = -1; ti <= 1; ti++) {
                            var tx = cx + ti * (hw * 0.4);
                            s += '<line x1="' + tx + '" y1="' + (capT + 1) + '" x2="' + tx + '" y2="' + (capT - 0.5) + '" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/>';
                        }
                    }
                } else if (style === 'fringe') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'front' || l === 'all') s += '<path d="M' + (capL + 1) + ' ' + (T + 1) + ' Q' + (cx - hw * 0.2) + ' ' + (T + fRy * 0.3) + ' ' + (cx + hw * 0.3) + ' ' + (T + fRy * 0.2) + '" fill="' + col + '"/>';
                } else if (style === 'taper') {
                    if (l === 'base' || l === 'all') {
                        s += '<path d="M' + L + ' ' + B + ' C' + L + ' ' + (T + 2) + ' ' + (L + 2) + ' ' + (T + 1) + ' ' + cx + ' ' + (T + 1) + ' C' + (R - 2) + ' ' + (T + 1) + ' ' + R + ' ' + (T + 2) + ' ' + R + ' ' + B + ' Z" fill="' + col + '" opacity=".15"/>';
                        s += '<path d="M' + (cx - hw * 0.5) + ' ' + (T + 1) + ' Q' + cx + ' ' + (capT - 0.5) + ' ' + (cx + hw * 0.5) + ' ' + (T + 1) + ' Z" fill="' + col + '"/>';
                    }
                } else if (style === 'wolfcut') {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                    if (l === 'base' || l === 'all') {
                        var wl = 5 + len * 8;
                        for (var wi = -1; wi <= 1; wi += 2) s += '<path d="M' + (cx + wi * hw) + ' ' + B + ' Q' + (cx + wi * (hw + 1)) + ' ' + (B + wl * 0.4) + ' ' + (cx + wi * (hw - 0.3)) + ' ' + (B + wl) + '" stroke="' + col + '" stroke-width="' + (2 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                } else if (style === 'quiff') {
                    if (l === 'base' || l === 'all') {
                        var qT = capT - 1.5 * len;
                        s += '<path d="M' + capL + ' ' + B + ' C' + capL + ' ' + (T - 1) + ' ' + (capL + 2) + ' ' + qT + ' ' + cx + ' ' + (qT - 0.5) + ' C' + (capR - 1) + ' ' + (qT + 0.5) + ' ' + capR + ' ' + (T - 1) + ' ' + capR + ' ' + B + ' Z" fill="' + col + '"/>';
                    }
                } else {
                    if (l === 'base' || l === 'all') s += '<path d="' + cap + '" fill="' + col + '"/>';
                }
            } else {
                var hL = 8 + len * 20;
                var hW = fRx * vol + 0.5;
                var topH = 1 + len * 2;
                var hT = T - topH;
                if (l === 'base' || l === 'all') s += '<path d="M' + (cx - hW) + ' ' + (hy + 5) + ' C' + (cx - hW) + ' ' + (T - 2) + ' ' + (cx - hW + 1) + ' ' + hT + ' ' + cx + ' ' + (hT - 0.5) + ' C' + (cx + hW - 1) + ' ' + hT + ' ' + (cx + hW) + ' ' + (T - 2) + ' ' + (cx + hW) + ' ' + (hy + 5) + ' Z" fill="' + col + '"/>';

                var hasLong = ['long', 'curlyLong', 'braids', 'wavyMid', 'bangs', 'sideSwept', 'curtainBangs', 'layered', 'halfUp', 'fishtail'].indexOf(style) >= 0;
                if (hasLong) {
                    if (l === 'base' || l === 'all') {
                        for (var si2 = -1; si2 <= 1; si2 += 2) s += '<path d="M' + (cx + si2 * hW) + ' ' + B + ' Q' + (cx + si2 * (hW + 1.5)) + ' ' + (B + hL * 0.35) + ' ' + (cx + si2 * (hW - 0.3)) + ' ' + (B + hL) + '" stroke="' + col + '" stroke-width="' + (3.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                }

                if (style === 'bob') {
                    if (l === 'base' || l === 'all') {
                        for (var bi2 = -1; bi2 <= 1; bi2 += 2) s += '<path d="M' + (cx + bi2 * hW) + ' ' + B + ' Q' + (cx + bi2 * (hW + 0.8)) + ' ' + (B + 5) + ' ' + (cx + bi2 * hW) + ' ' + (B + 6 + len * 4) + '" stroke="' + col + '" stroke-width="' + (3.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                } else if (style === 'ponytail') {
                    if (l === 'back' || l === 'all') {
                        s += '<path d="M' + cx + ' ' + T + ' Q' + (cx + 3) + ' ' + (T - 1) + ' ' + (cx + 4) + ' ' + (T + 3) + ' Q' + (cx + 6) + ' ' + (B + 3) + ' ' + (cx + 4) + ' ' + (B + hL * 0.5) + '" stroke="' + col + '" stroke-width="' + (3 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                    if (l === 'base' || l === 'all') {
                        s += '<circle cx="' + (cx + 3) + '" cy="' + (T + 0.5) + '" r="' + (1.8 * vol) + '" fill="#e8a0bf"/>';
                    }
                } else if (style === 'twoBuns') {
                    if (l === 'base' || l === 'all') {
                        s += '<circle cx="' + (cx - 7 * vol) + '" cy="' + (T) + '" r="' + (4.5 * vol) + '" fill="' + col + '"/>';
                        s += '<circle cx="' + (cx + 7 * vol) + '" cy="' + (T) + '" r="' + (4.5 * vol) + '" fill="' + col + '"/>';
                    }
                } else if (style === 'pixie') {
                    if (l === 'base' || l === 'all') s += '<path d="M' + (cx - hW) + ' ' + B + ' Q' + (cx - hW - 0.5) + ' ' + (B + 1.5) + ' ' + (cx - hW + 1) + ' ' + (B + 3) + '" stroke="' + col + '" stroke-width="' + (2 * vol) + '" fill="none" stroke-linecap="round"/>';
                } else if (style === 'braids') {
                    if (l === 'back' || l === 'all') {
                        for (var bri = -1; bri <= 1; bri += 2)
                            for (var brj = 0; brj < Math.floor(2 + len * 2.5); brj++)
                                s += '<ellipse cx="' + (cx + bri * (hW - 0.3) + bri * Math.sin(brj * 0.8) * 1) + '" cy="' + (B + brj * 4) + '" rx="' + (1.8 * vol) + '" ry="2" fill="' + col + '"/>';
                    }
                } else if (style === 'lowPony') {
                    if (l === 'back' || l === 'all') {
                        s += '<path d="M' + cx + ' ' + (B + fRy) + ' Q' + (cx + 0.5) + ' ' + (B + fRy + 4) + ' ' + cx + ' ' + (B + hL) + '" stroke="' + col + '" stroke-width="' + (3 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                    if (l === 'base' || l === 'all') {
                        s += '<rect x="' + (cx - 2) + '" y="' + (B + fRy - 1) + '" width="4" height="2.5" rx="1.2" fill="#c19a6b"/>';
                    }
                } else if (style === 'halfUp') {
                    if (l === 'base' || l === 'all') s += '<circle cx="' + cx + '" cy="' + (T - 0.5) + '" r="' + (3 * vol) + '" fill="' + col + '"/>';
                } else if (style === 'curtainBangs') {
                    if (l === 'front' || l === 'all') {
                        s += '<path d="M' + cx + ' ' + (T + 0.5) + ' Q' + (cx - 4) + ' ' + (T + fRy * 0.25) + ' ' + (cx - hW) + ' ' + (T + fRy * 0.15) + '" fill="' + col + '"/>';
                        s += '<path d="M' + cx + ' ' + (T + 0.5) + ' Q' + (cx + 4) + ' ' + (T + fRy * 0.25) + ' ' + (cx + hW) + ' ' + (T + fRy * 0.15) + '" fill="' + col + '"/>';
                    }
                } else if (style === 'bun') {
                    if (l === 'base' || l === 'all') s += '<circle cx="' + cx + '" cy="' + (hT - 1.5) + '" r="' + (4.5 * vol) + '" fill="' + col + '"/>';
                } else if (style === 'bangs') {
                    if (l === 'front' || l === 'all') s += '<rect x="' + (cx - hW) + '" y="' + T + '" width="' + (hW * 2) + '" height="' + (fRy * 0.4) + '" rx="' + (hW * 0.3) + '" fill="' + col + '"/>';
                } else if (style === 'sideSwept') {
                    if (l === 'front' || l === 'all') s += '<path d="M' + (cx - hW * 0.3) + ' ' + (T + 0.5) + ' Q' + (cx - hW * 0.5) + ' ' + (T + fRy * 0.2) + ' ' + (cx + hW + 0.5) + ' ' + (T + 1.5) + '" fill="' + col + '"/>';
                } else if (style === 'curlyLong') {
                    if (l === 'base' || l === 'all') {
                        for (var cli = -1; cli <= 1; cli += 2) s += '<path d="M' + (cx + cli * hW) + ' ' + B + ' Q' + (cx + cli * (hW + 2)) + ' ' + (B + 5) + ' ' + (cx + cli * hW) + ' ' + (B + 10) + ' Q' + (cx + cli * (hW + 2.5)) + ' ' + (B + 15) + ' ' + (cx + cli * (hW - 0.3)) + ' ' + (B + hL) + '" stroke="' + col + '" stroke-width="' + (3.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                } else if (style === 'wavyMid') {
                    if (l === 'base' || l === 'all') {
                        for (var wmi = -1; wmi <= 1; wmi += 2) s += '<path d="M' + (cx + wmi * hW) + ' ' + B + ' Q' + (cx + wmi * (hW + 1.2)) + ' ' + (B + 5) + ' ' + (cx + wmi * hW) + ' ' + (B + 9) + ' Q' + (cx + wmi * (hW + 0.8)) + ' ' + (B + 13) + ' ' + (cx + wmi * (hW - 0.3)) + ' ' + (B + hL * 0.5) + '" stroke="' + col + '" stroke-width="' + (3.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                } else if (style === 'fishtail') {
                    if (l === 'back' || l === 'all') {
                        s += '<path d="M' + (cx - 1.5) + ' ' + (B + fRy) + ' Q' + (cx - 1) + ' ' + (B + hL * 0.4) + ' ' + (cx - 2.5) + ' ' + (B + hL) + '" stroke="' + col + '" stroke-width="' + (2.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                        s += '<path d="M' + (cx + 1.5) + ' ' + (B + fRy) + ' Q' + (cx + 1) + ' ' + (B + hL * 0.4) + ' ' + (cx + 2.5) + ' ' + (B + hL) + '" stroke="' + col + '" stroke-width="' + (2.5 * vol) + '" fill="none" stroke-linecap="round"/>';
                    }
                } else if (style === 'layered') {
                    if (l === 'base' || l === 'all') {
                        for (var li = -1; li <= 1; li += 2) s += '<path d="M' + (cx + li * (hW + 0.3)) + ' ' + (B + 1) + ' Q' + (cx + li * (hW + 1.5)) + ' ' + (B + hL * 0.25) + ' ' + (cx + li * (hW - 0.3)) + ' ' + (B + hL * 0.6) + '" stroke="' + col + '" stroke-width="' + (1.8 * vol) + '" fill="none" stroke-linecap="round" opacity=".5"/>';
                    }
                }
            }
            return s;
        }

        function genFace(cx, hy, hr, faceId, skin) {
            var f = getFace(faceId);
            var rx = hr * f.rx, ry = hr * f.ry;
            var s = '';
            // Square jaw
            if (f.jaw === 1) s += '<rect x="' + (cx - rx) + '" y="' + (hy - ry) + '" width="' + (rx * 2) + '" height="' + (ry * 2 + 1) + '" rx="3" fill="' + skin + '" stroke="none"/>';
            // Heart (wide forehead, narrow chin)
            else if (f.jaw === -1) s += '<path d="M' + cx + ' ' + (hy + ry + 1) + ' Q' + (cx - rx - 2) + ' ' + (hy + 1) + ' ' + (cx - rx) + ' ' + (hy - ry * 0.4) + ' Q' + (cx - rx + 1) + ' ' + (hy - ry - 1) + ' ' + cx + ' ' + (hy - ry) + ' Q' + (cx + rx - 1) + ' ' + (hy - ry - 1) + ' ' + (cx + rx) + ' ' + (hy - ry * 0.4) + ' Q' + (cx + rx + 2) + ' ' + (hy + 1) + ' ' + cx + ' ' + (hy + ry + 1) + 'Z" fill="' + skin + '" stroke="none"/>';
            // Diamond (wide at cheeks, narrow at top and chin)
            else if (f.jaw === -0.5) s += '<path d="M' + cx + ' ' + (hy - ry) + ' Q' + (cx + rx * 0.6) + ' ' + (hy - ry * 0.5) + ' ' + (cx + rx + 0.5) + ' ' + hy + ' Q' + (cx + rx * 0.6) + ' ' + (hy + ry * 0.6) + ' ' + cx + ' ' + (hy + ry + 1) + ' Q' + (cx - rx * 0.6) + ' ' + (hy + ry * 0.6) + ' ' + (cx - rx - 0.5) + ' ' + hy + ' Q' + (cx - rx * 0.6) + ' ' + (hy - ry * 0.5) + ' ' + cx + ' ' + (hy - ry) + 'Z" fill="' + skin + '" stroke="none"/>';
            // Pear (narrow forehead, wide jaw)
            else if (f.jaw === 0.5) s += '<path d="M' + cx + ' ' + (hy - ry) + ' Q' + (cx + rx * 0.8) + ' ' + (hy - ry + 1) + ' ' + (cx + rx + 0.5) + ' ' + (hy + 1) + ' Q' + (cx + rx + 1) + ' ' + (hy + ry) + ' ' + cx + ' ' + (hy + ry + 1) + ' Q' + (cx - rx - 1) + ' ' + (hy + ry) + ' ' + (cx - rx - 0.5) + ' ' + (hy + 1) + ' Q' + (cx - rx * 0.8) + ' ' + (hy - ry + 1) + ' ' + cx + ' ' + (hy - ry) + 'Z" fill="' + skin + '" stroke="none"/>';
            // Default: oval/round/long/oblong — simple ellipse
            else s += '<ellipse cx="' + cx + '" cy="' + hy + '" rx="' + rx + '" ry="' + ry + '" fill="' + skin + '" stroke="none"/>';
            // Eyes
            s += '<ellipse cx="' + (cx - 4) + '" cy="' + (hy + 0.5) + '" rx="1.5" ry="1.8" fill="#333"/>';
            s += '<circle cx="' + (cx - 3.5) + '" cy="' + (hy - 0.1) + '" r="0.6" fill="#fff"/>';
            s += '<ellipse cx="' + (cx + 4) + '" cy="' + (hy + 0.5) + '" rx="1.5" ry="1.8" fill="#333"/>';
            s += '<circle cx="' + (cx + 4.5) + '" cy="' + (hy - 0.1) + '" r="0.6" fill="#fff"/>';
            // Brows
            s += '<path d="M' + (cx - 6) + ' ' + (hy - 3) + ' Q' + (cx - 4) + ' ' + (hy - 4) + ' ' + (cx - 2) + ' ' + (hy - 3) + '" stroke="#4a3a2a" stroke-width="0.7" fill="none"/>';
            s += '<path d="M' + (cx + 2) + ' ' + (hy - 3) + ' Q' + (cx + 4) + ' ' + (hy - 4) + ' ' + (cx + 6) + ' ' + (hy - 3) + '" stroke="#4a3a2a" stroke-width="0.7" fill="none"/>';
            // Nose
            s += '<path d="M' + (cx - 0.5) + ' ' + (hy + 2) + ' L' + cx + ' ' + (hy + 4) + ' L' + (cx + 1) + ' ' + (hy + 3.5) + '" stroke="rgba(0,0,0,0.08)" stroke-width="0.5" fill="none"/>';
            // Mouth
            s += '<path d="M' + (cx - 2.5) + ' ' + (hy + 6.5) + ' Q' + cx + ' ' + (hy + 8.5) + ' ' + (cx + 2.5) + ' ' + (hy + 6.5) + '" stroke="#c0766e" stroke-width="0.8" fill="none"/>';
            return s;
        }

        function genBeard(cx, hy, hr, faceId, skin, beard, hc) {
            if (!beard) return '';
            var f = getFace(faceId);
            var fRx = hr * f.rx, fRy = hr * f.ry;
            var s = '';
            var jawY = hy + fRy;
            if (beard === 'stubble') {
                s += '<path d="M' + (cx - fRx + 1) + ' ' + (hy + 4) + ' Q' + cx + ' ' + (jawY + 1) + ' ' + (cx + fRx - 1) + ' ' + (hy + 4) + '" stroke="' + hc + '" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="0.5 2" stroke-linecap="round"/>';
            } else if (beard === 'goatee') {
                s += '<path d="M' + (cx - 2) + ' ' + (hy + 8.5) + ' L' + (cx - 1.5) + ' ' + (jawY - 1) + ' L' + (cx + 1.5) + ' ' + (jawY - 1) + ' L' + (cx + 2) + ' ' + (hy + 8.5) + ' Z" fill="' + hc + '"/>';
                s += '<path d="M' + (cx - 3) + ' ' + (hy + 5) + ' Q' + cx + ' ' + (hy + 4) + ' ' + (cx + 3) + ' ' + (hy + 5) + '" stroke="' + hc + '" stroke-width="1" fill="none"/>';
            } else if (beard === 'mustache') {
                s += '<path d="M' + (cx - 3.5) + ' ' + (hy + 5.5) + ' Q' + (cx - 1.5) + ' ' + (hy + 4) + ' ' + cx + ' ' + (hy + 4.5) + ' Q' + (cx + 1.5) + ' ' + (hy + 4) + ' ' + (cx + 3.5) + ' ' + (hy + 5.5) + '" stroke="' + hc + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
            } else if (beard === 'full') {
                s += '<path d="M' + (cx - fRx) + ' ' + (hy + 2) + ' Q' + (cx - fRx + 2) + ' ' + (jawY) + ' ' + cx + ' ' + (jawY + 1) + ' Q' + (cx + fRx - 2) + ' ' + (jawY) + ' ' + (cx + fRx) + ' ' + (hy + 2) + ' Q' + cx + ' ' + (jawY - 3) + ' ' + (cx - fRx) + ' ' + (hy + 2) + ' Z" fill="' + hc + '"/>';
            } else if (beard === 'chin') {
                s += '<path d="M' + (cx - 2) + ' ' + (jawY - 1.5) + ' Q' + cx + ' ' + (jawY + 1) + ' ' + (cx + 2) + ' ' + (jawY - 1.5) + '" stroke="' + hc + '" stroke-width="2" fill="none" stroke-linecap="round"/>';
            } else if (beard === 'handlebar') {
                s += '<path d="M' + (cx - 4) + ' ' + (hy + 6) + ' Q' + (cx - 2) + ' ' + (hy + 4) + ' ' + cx + ' ' + (hy + 4.5) + ' Q' + (cx + 2) + ' ' + (hy + 4) + ' ' + (cx + 4) + ' ' + (hy + 6) + '" stroke="' + hc + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
            }
            return s;
        }

        // Female side/hanging hair — visible even with hat
        function genHairSides(cx, hy, hr, faceId, style, col, hLen, hVol) {
            var f = getFace(faceId);
            var fRx = hr * f.rx;
            var fHW = f.hw || 1;
            var vol = 0.6 + hVol * 0.5;
            var len = 0.4 + hLen * 0.8;
            var hL = 15 + len * 30;
            var hW = (fRx + 1) * fHW * vol + 1;
            var s = '';
            var hasLong = ['long', 'curlyLong', 'braids', 'wavyMid', 'bangs', 'sideSwept', 'lowPony', 'curtainBangs', 'layered', 'halfUp', 'fishtail', 'bob'].indexOf(style) >= 0;
            if (hasLong || style === 'long') {
                for (var i = -1; i <= 1; i += 2)
                    s += '<path d="M' + (cx + i * hW) + ' ' + (hy + 2) + ' Q' + (cx + i * (hW + 2)) + ' ' + (hy + hL * 0.3) + ' ' + (cx + i * (hW - 1)) + ' ' + (hy + hL) + '" stroke="' + col + '" stroke-width="' + (4 * vol) + '" fill="none" stroke-linecap="round"/>';
            }
            return s;
        }

        // ── Main Avatar Draw ──
        function drawAvatar() {
            var el = document.getElementById('av-stage');
            if (!el) return;
            var fem = AV.body === 'female';
            var cx = 70, wF = (AV.wt - 40) / 80;
            var hr = 10, hy = 22;
            var nW = fem ? 3.5 : 4, nY = hy + hr + 1, nH = 4;
            var sW = (fem ? 12 : 14) + Math.round(wF * 6);
            var wW = (fem ? 9 : 12) + Math.round(wF * 7);
            var tTop = nY + nH, tH = 34, tBot = tTop + tH;
            var aW = 3.5 + Math.round(wF * 1.5);
            var legW = 4 + Math.round(wF * 2.5);
            var legH = 46 + Math.round((AV.ht - 150) * 0.6);
            var legBot = tBot + legH, totalH = legBot + 8;
            var topObj = tops.find(function (t) { return t.id === AV.topT; }) || tops[0];
            var longSleeve = topObj.lo;
            var isCoat = topObj.ct;
            var armLen = longSleeve ? tH + 5 : tH * 0.3;
            var isSkirt = ['skirt', 'long-sk', 'pleated', 'culottes', 'dress'].indexOf(AV.botT) >= 0;
            var isShort = AV.botT === 'shorts' || AV.botT === 'skirt' || AV.botT === 'bermuda';
            var bLen = isShort ? legH * 0.3 : (AV.botT === 'long-sk' || AV.botT === 'dress') ? legH * 0.85 : legH * 0.92;
            var aY = tTop + 2;
            var topEnd = isCoat ? tBot + 15 : AV.tuck ? tBot - 1 : tBot + 3;
            var skinTop = tBot + bLen;

            var hasHat = !!AV.acc.hat;
            // ─── FRONT VIEW ───
            var svg = '';
            // Hair on back (behind body)
            svg += genHair(cx, hy, hr, AV.face, AV.hair, AV.hc, AV.body, AV.hLen, AV.hVol, AV.hY, hasHat, 'back');
            // Female long hair sides drawn BEHIND body (so torso covers them)
            if (fem) {
                svg += genHairSides(cx, hy, hr, AV.face, AV.hair, AV.hc, AV.hLen, AV.hVol);
            }
            // Legs (skin)
            if (skinTop < legBot) {
                svg += '<rect x="' + (cx - legW - 2) + '" y="' + skinTop + '" width="' + legW + '" height="' + (legBot - skinTop) + '" rx="2" fill="' + AV.skin + '"/>';
                svg += '<rect x="' + (cx + 2) + '" y="' + skinTop + '" width="' + legW + '" height="' + (legBot - skinTop) + '" rx="2" fill="' + AV.skin + '"/>';
            }
            // Shoes
            svg += '<ellipse cx="' + (cx - legW / 2 - 1) + '" cy="' + (legBot + 2) + '" rx="7" ry="3.5" fill="#2a2a2a"/>';
            svg += '<ellipse cx="' + (cx + legW / 2 + 1) + '" cy="' + (legBot + 2) + '" rx="7" ry="3.5" fill="#2a2a2a"/>';
            // Bottoms
            if (isSkirt) {
                var skW = wW + 5;
                svg += '<path d="M' + (cx - wW) + ' ' + tBot + ' Q' + (cx - skW) + ' ' + (tBot + bLen * 0.5) + ' ' + (cx - skW - 2) + ' ' + (tBot + bLen) + ' L' + (cx + skW + 2) + ' ' + (tBot + bLen) + ' Q' + (cx + skW) + ' ' + (tBot + bLen * 0.5) + ' ' + (cx + wW) + ' ' + tBot + ' Z" fill="' + AV.botC + '"/>';
                for (var pi = -2; pi <= 2; pi++) svg += '<line x1="' + (cx + pi * 5) + '" y1="' + (tBot + 3) + '" x2="' + (cx + pi * 6) + '" y2="' + (tBot + bLen - 2) + '" stroke="rgba(0,0,0,0.05)" stroke-width="0.8"/>';
            } else {
                var cY = tBot + 10 + Math.round(wF * 3);
                var wide = AV.botT === 'wide' || AV.botT === 'cargo';
                var legEndW = wide ? legW + 3 : legW;
                svg += '<path d="M' + (cx - wW) + ' ' + tBot + ' L' + (cx - legEndW - 1) + ' ' + (tBot + bLen) + ' L' + (cx - 1) + ' ' + (tBot + bLen) + ' L' + cx + ' ' + cY + ' L' + (cx + 1) + ' ' + (tBot + bLen) + ' L' + (cx + legEndW + 1) + ' ' + (tBot + bLen) + ' L' + (cx + wW) + ' ' + tBot + ' Z" fill="' + AV.botC + '"/>';
                svg += '<rect x="' + (cx - wW) + '" y="' + tBot + '" width="' + (wW * 2) + '" height="2.5" rx="1.2" fill="' + AV.botC + '" stroke="rgba(0,0,0,0.08)" stroke-width="0.3"/>';
                if (AV.botT === 'overalls') {
                    svg += '<line x1="' + (cx - wW + 3) + '" y1="' + tBot + '" x2="' + (cx - 4) + '" y2="' + (tTop + 6) + '" stroke="' + AV.botC + '" stroke-width="2" stroke-linecap="round"/>';
                    svg += '<line x1="' + (cx + wW - 3) + '" y1="' + tBot + '" x2="' + (cx + 4) + '" y2="' + (tTop + 6) + '" stroke="' + AV.botC + '" stroke-width="2" stroke-linecap="round"/>';
                    svg += '<rect x="' + (cx - 6) + '" y="' + (tTop + 4) + '" width="12" height="10" rx="1.5" fill="' + AV.botC + '"/>';
                }
            }
            // Neck
            svg += '<rect x="' + (cx - nW) + '" y="' + nY + '" width="' + (nW * 2) + '" height="' + nH + '" rx="2" fill="' + AV.skin + '"/>';
            // Arms skin
            if (!longSleeve) {
                svg += '<rect x="' + (cx - sW - aW) + '" y="' + (aY + armLen) + '" width="' + aW + '" height="' + (tH - armLen + 6) + '" rx="' + (aW / 2) + '" fill="' + AV.skin + '"/>';
                svg += '<rect x="' + (cx + sW) + '" y="' + (aY + armLen) + '" width="' + aW + '" height="' + (tH - armLen + 6) + '" rx="' + (aW / 2) + '" fill="' + AV.skin + '"/>';
            }
            svg += '<ellipse cx="' + (cx - sW - aW / 2) + '" cy="' + (aY + tH + 7) + '" rx="3" ry="3.5" fill="' + AV.skin + '"/>';
            svg += '<ellipse cx="' + (cx + sW + aW / 2) + '" cy="' + (aY + tH + 7) + '" rx="3" ry="3.5" fill="' + AV.skin + '"/>';
            // Top
            svg += '<path d="M' + (cx - sW) + ' ' + tTop + ' L' + (cx - wW - (AV.tuck ? -1 : 1)) + ' ' + topEnd + ' L' + (cx + wW + (AV.tuck ? -1 : 1)) + ' ' + topEnd + ' L' + (cx + sW) + ' ' + tTop + ' Z" fill="' + AV.topC + '"/>';
            if (AV.tuck && !isCoat) svg += '<rect x="' + (cx - wW) + '" y="' + (tBot - 2) + '" width="' + (wW * 2) + '" height="3" rx="1" fill="' + AV.botC + '" stroke="rgba(0,0,0,0.06)" stroke-width="0.3"/>';
            // Sleeves
            svg += '<rect x="' + (cx - sW - aW) + '" y="' + aY + '" width="' + aW + '" height="' + armLen + '" rx="' + (aW / 2) + '" fill="' + AV.topC + '"/>';
            svg += '<rect x="' + (cx + sW) + '" y="' + aY + '" width="' + aW + '" height="' + armLen + '" rx="' + (aW / 2) + '" fill="' + AV.topC + '"/>';
            // Top details
            if (['shirt', 'blazer', 'blouse'].indexOf(AV.topT) >= 0) {
                for (var bi = 0; bi < 4; bi++) svg += '<circle cx="' + cx + '" cy="' + (tTop + 6 + bi * 7) + '" r="0.8" fill="rgba(255,255,255,0.3)"/>';
                svg += '<line x1="' + cx + '" y1="' + (tTop + 3) + '" x2="' + cx + '" y2="' + (topEnd - 3) + '" stroke="rgba(255,255,255,0.1)" stroke-width="0.6"/>';
            }
            if (AV.topT === 'hoodie') svg += '<path d="M' + (cx - sW + 3) + ' ' + tTop + ' Q' + (cx - sW) + ' ' + (tTop - 8) + ' ' + cx + ' ' + (tTop - 11) + ' Q' + (cx + sW) + ' ' + (tTop - 8) + ' ' + (cx + sW - 3) + ' ' + tTop + '" fill="' + AV.topC + '" stroke="rgba(0,0,0,0.06)" stroke-width="0.3"/>';
            if (AV.topT === 'polo') svg += '<rect x="' + (cx - 6) + '" y="' + (tTop - 2) + '" width="12" height="3.5" rx="1.5" fill="' + AV.topC + '" stroke="rgba(0,0,0,0.06)" stroke-width="0.3"/>';
            if (AV.topT === 'turtleneck') svg += '<rect x="' + (cx - 5) + '" y="' + (tTop - 4) + '" width="10" height="6" rx="3" fill="' + AV.topC + '" stroke="rgba(0,0,0,0.04)" stroke-width="0.3"/>';
            if (AV.topT === 'puffer') { for (var qi = 1; qi < 4; qi++) svg += '<line x1="' + (cx - sW + 2) + '" y1="' + (tTop + qi * 8) + '" x2="' + (cx + sW - 2) + '" y2="' + (tTop + qi * 8) + '" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>'; }
            if (['jacket', 'denim-j', 'leather'].indexOf(AV.topT) >= 0) svg += '<line x1="' + cx + '" y1="' + (tTop + 2) + '" x2="' + cx + '" y2="' + (topEnd - 2) + '" stroke="rgba(0,0,0,0.06)" stroke-width="0.8"/>';

            // Hair on base (behind face)
            svg += genHair(cx, hy, hr, AV.face, AV.hair, AV.hc, AV.body, AV.hLen, AV.hVol, AV.hY, hasHat, 'base');
            // Head + Face
            svg += genFace(cx, hy, hr, AV.face, AV.skin);
            // Beard
            if (!fem && AV.acc.beard) svg += genBeard(cx, hy, hr, AV.face, AV.skin, AV.acc.beard, AV.hc);
            // Hair on front
            svg += genHair(cx, hy, hr, AV.face, AV.hair, AV.hc, AV.body, AV.hLen, AV.hVol, AV.hY, hasHat, 'front');

            // Accessories
            var acc = AV.acc;
            // Hat — properly sized to head (r=10, center hy=22, top at y=12)
            if (acc.hat) {
                var ht = hy - hr; // = 12 (top of head)
                var hat = acc.hat;
                var hR = hr + 2; // hat radius slightly wider than head
                if (hat === 'cap') { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + hR + '" ry="3.5" fill="#333"/>'; svg += '<rect x="' + (cx - hR + 1) + '" y="' + (ht - 4) + '" width="' + (hR * 2 - 2) + '" height="7" rx="4" fill="#333"/>'; svg += '<rect x="' + cx + '" y="' + (ht - 2) + '" width="' + (hR + 2) + '" height="2.5" rx="1" fill="#444"/>'; }
                else if (hat === 'bucket') { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + (hR + 3) + '" ry="4" fill="#8B7355"/>'; svg += '<path d="M' + (cx - hR + 1) + ' ' + (ht + 1) + ' Q' + cx + ' ' + (ht - 7) + ' ' + (cx + hR - 1) + ' ' + (ht + 1) + '" fill="#8B7355"/>'; }
                else if (hat === 'beanie') { svg += '<rect x="' + (cx - hR + 1) + '" y="' + (ht - 6) + '" width="' + (hR * 2 - 2) + '" height="' + (hr + 2) + '" rx="' + (hR - 2) + '" fill="#CC4444"/>'; svg += '<circle cx="' + cx + '" cy="' + (ht - 7) + '" r="2" fill="#CC4444"/>'; }
                else if (hat === 'beret') svg += '<ellipse cx="' + (cx - 2) + '" cy="' + (ht) + '" rx="' + (hR + 2) + '" ry="5" fill="#333366"/>';
                else if (hat === 'fedora') { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + (hR + 4) + '" ry="3.5" fill="#5c4033"/>'; svg += '<rect x="' + (cx - hR + 1) + '" y="' + (ht - 6) + '" width="' + (hR * 2 - 2) + '" height="9" rx="4" fill="#5c4033"/>'; svg += '<rect x="' + (cx - hR + 3) + '" y="' + (ht + 1) + '" width="' + (hR * 2 - 6) + '" height="2" rx="1" fill="#3a2a1a"/>'; }
                else if (hat === 'straw') { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + (hR + 5) + '" ry="4" fill="#d4b96a"/>'; svg += '<rect x="' + (cx - hR + 1) + '" y="' + (ht - 5) + '" width="' + (hR * 2 - 2) + '" height="8" rx="5" fill="#d4b96a"/>'; }
                else if (hat === 'cowboy') { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + (hR + 7) + '" ry="3.5" fill="#8B6914"/>'; svg += '<path d="M' + (cx - hR + 1) + ' ' + (ht + 1) + ' Q' + (cx - hR + 3) + ' ' + (ht - 10) + ' ' + cx + ' ' + (ht - 8) + ' Q' + (cx + hR - 3) + ' ' + (ht - 10) + ' ' + (cx + hR - 1) + ' ' + (ht + 1) + '" fill="#8B6914"/>'; }
                else if (hat === 'headband') svg += '<rect x="' + (cx - hR) + '" y="' + (ht + 1) + '" width="' + (hR * 2) + '" height="2.5" rx="1.2" fill="#e8a0bf"/>';
                else { svg += '<ellipse cx="' + cx + '" cy="' + (ht + 2) + '" rx="' + hR + '" ry="3.5" fill="#6b5b4a"/>'; svg += '<rect x="' + (cx - hR + 1) + '" y="' + (ht - 5) + '" width="' + (hR * 2 - 2) + '" height="8" rx="5" fill="#6b5b4a"/>'; }
            }
            // Eyewear
            if (acc.eyewear) {
                var ew = acc.eyewear, ey = hy;
                if (ew === 'sunglasses' || ew === 'wayfarer') svg += '<rect x="' + (cx - 8) + '" y="' + (ey - 0.5) + '" width="6" height="4" rx="1" fill="rgba(0,0,0,0.78)"/><rect x="' + (cx + 2) + '" y="' + (ey - 0.5) + '" width="6" height="4" rx="1" fill="rgba(0,0,0,0.78)"/><line x1="' + (cx - 2) + '" y1="' + (ey + 1) + '" x2="' + (cx + 2) + '" y2="' + (ey + 1) + '" stroke="#555" stroke-width="0.5"/>';
                else if (ew === 'aviator') svg += '<path d="M' + (cx - 8) + ' ' + (ey - 0.5) + ' Q' + (cx - 8) + ' ' + (ey + 4.5) + ' ' + (cx - 5) + ' ' + (ey + 4.5) + ' Q' + (cx - 2) + ' ' + (ey + 4.5) + ' ' + (cx - 2) + ' ' + (ey - 0.5) + '" stroke="#888" stroke-width="0.6" fill="rgba(100,60,30,0.35)"/><path d="M' + (cx + 2) + ' ' + (ey - 0.5) + ' Q' + (cx + 2) + ' ' + (ey + 4.5) + ' ' + (cx + 5) + ' ' + (ey + 4.5) + ' Q' + (cx + 8) + ' ' + (ey + 4.5) + ' ' + (cx + 8) + ' ' + (ey - 0.5) + '" stroke="#888" stroke-width="0.6" fill="rgba(100,60,30,0.35)"/>';
                else if (ew === 'roundG') svg += '<circle cx="' + (cx - 5) + '" cy="' + (ey + 1) + '" r="4" stroke="#333" stroke-width="0.8" fill="none"/><circle cx="' + (cx + 5) + '" cy="' + (ey + 1) + '" r="4" stroke="#333" stroke-width="0.8" fill="none"/><line x1="' + (cx - 1) + '" y1="' + (ey + 1) + '" x2="' + (cx + 1) + '" y2="' + (ey + 1) + '" stroke="#333" stroke-width="0.6"/>';
                else if (ew === 'squareG') svg += '<rect x="' + (cx - 9) + '" y="' + (ey - 1) + '" width="7" height="5" rx="0.5" stroke="#333" stroke-width="0.8" fill="none"/><rect x="' + (cx + 2) + '" y="' + (ey - 1) + '" width="7" height="5" rx="0.5" stroke="#333" stroke-width="0.8" fill="none"/>';
                else svg += '<circle cx="' + (cx - 5) + '" cy="' + (ey + 1) + '" r="3.5" stroke="#555" stroke-width="0.6" fill="rgba(200,220,255,0.1)"/><circle cx="' + (cx + 5) + '" cy="' + (ey + 1) + '" r="3.5" stroke="#555" stroke-width="0.6" fill="rgba(200,220,255,0.1)"/>';
            }
            // Neckwear
            var ny = nY + nH;
            if (acc.neckwear) {
                var nk = acc.neckwear;
                if (nk.indexOf('Chain') >= 0) { var nc = nk.indexOf('gold') >= 0 ? '#DAA520' : '#C0C0C0'; svg += '<path d="M' + (cx - 7) + ' ' + (ny - 1) + ' Q' + cx + ' ' + (ny + 5) + ' ' + (cx + 7) + ' ' + (ny - 1) + '" stroke="' + nc + '" stroke-width="1" fill="none"/>'; }
                else if (nk === 'pendant') svg += '<path d="M' + (cx - 7) + ' ' + (ny - 1) + ' Q' + cx + ' ' + (ny + 6) + ' ' + (cx + 7) + ' ' + (ny - 1) + '" stroke="#DAA520" stroke-width="0.7" fill="none"/><circle cx="' + cx + '" cy="' + (ny + 4) + '" r="1.5" fill="#DAA520"/>';
                else if (nk === 'choker') svg += '<rect x="' + (cx - 8) + '" y="' + (ny - 3) + '" width="16" height="2.5" rx="1.2" fill="#1a1a1a"/>';
                else if (nk === 'pearls') { for (var pi2 = -3; pi2 <= 3; pi2++) svg += '<circle cx="' + (cx + pi2 * 2.5) + '" cy="' + (ny + Math.abs(pi2) * 0.5 - 1) + '" r="1.5" fill="#f5f0e8" stroke="#ddd" stroke-width="0.2"/>'; }
                else if (nk === 'scarf') svg += '<path d="M' + (cx - 10) + ' ' + (nY + 1) + ' Q' + cx + ' ' + (ny + 4) + ' ' + (cx + 10) + ' ' + (nY + 1) + '" stroke="#CC4444" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M' + (cx - 6) + ' ' + ny + ' L' + (cx - 9) + ' ' + (tTop + 16) + '" stroke="#CC4444" stroke-width="3" fill="none" stroke-linecap="round"/>';
                else if (nk === 'tie') svg += '<path d="M' + (cx - 2) + ' ' + (ny - 1) + ' L' + (cx + 2) + ' ' + (ny - 1) + ' L' + (cx + 1.5) + ' ' + (ny + 3) + ' L' + (cx - 1.5) + ' ' + (ny + 3) + ' Z" fill="#1e3a5f"/><path d="M' + (cx - 1.5) + ' ' + (ny + 3) + ' L' + cx + ' ' + (tBot - 10) + ' L' + (cx + 1.5) + ' ' + (ny + 3) + '" fill="#1e3a5f"/>';
                else if (nk === 'bowtie') svg += '<path d="M' + (cx - 6) + ' ' + ny + ' L' + (cx - 1.5) + ' ' + (ny + 2) + ' L' + (cx - 6) + ' ' + (ny + 4) + '" fill="#722f37"/><path d="M' + (cx + 6) + ' ' + ny + ' L' + (cx + 1.5) + ' ' + (ny + 2) + ' L' + (cx + 6) + ' ' + (ny + 4) + '" fill="#722f37"/><circle cx="' + cx + '" cy="' + (ny + 2) + '" r="1.5" fill="#5c1a1a"/>';
                else svg += '<path d="M' + (cx - 7) + ' ' + (ny - 1) + ' Q' + cx + ' ' + (ny + 5) + ' ' + (cx + 7) + ' ' + (ny - 1) + '" stroke="#DAA520" stroke-width="1" fill="none"/>';
            }
            // Wrist
            if (acc.wrist) {
                var wy = aY + armLen - 2, wx = cx - sW - aW;
                var gc = (acc.wrist.indexOf('Gold') >= 0 || acc.wrist === 'rosegold') ? '#DAA520' : '#C0C0C0';
                svg += '<rect x="' + (wx - 1) + '" y="' + wy + '" width="' + (aW + 3) + '" height="4" rx="1.5" fill="' + gc + '"/>';
            }
            // Ears
            if (acc.ears) {
                var eY = hy + 3, eX = hr;
                if (acc.ears.indexOf('hoop') >= 0) {
                    var er = acc.ears === 'hoopLarge' ? 5 : 3;
                    svg += '<circle cx="' + (cx - eX) + '" cy="' + (eY + 2) + '" r="' + er + '" stroke="#DAA520" stroke-width="0.8" fill="none"/>';
                    svg += '<circle cx="' + (cx + eX) + '" cy="' + (eY + 2) + '" r="' + er + '" stroke="#DAA520" stroke-width="0.8" fill="none"/>';
                } else {
                    var ec = acc.ears.indexOf('Diamond') >= 0 ? '#87CEEB' : acc.ears.indexOf('Gold') >= 0 ? '#DAA520' : '#C0C0C0';
                    svg += '<circle cx="' + (cx - eX) + '" cy="' + eY + '" r="1.5" fill="' + ec + '"/><circle cx="' + (cx + eX) + '" cy="' + eY + '" r="1.5" fill="' + ec + '"/>';
                }
            }
            // Belt
            if (acc.belt) {
                var by2 = tBot - 1;
                var bClr = (acc.belt.indexOf('Brown') >= 0 || acc.belt === 'woven') ? '#5c4033' : '#1a1a1a';
                svg += '<rect x="' + (cx - wW) + '" y="' + by2 + '" width="' + (wW * 2) + '" height="2.5" rx="1.2" fill="' + bClr + '"/><rect x="' + (cx - 1) + '" y="' + (by2 - 0.5) + '" width="3" height="3.5" rx="0.6" fill="#C0C0C0"/>';
            }
            // Bag (front)
            if (acc.bag) {
                var bx = cx + sW + aW + 2, by3 = tTop + 14;
                if (acc.bag === 'backpack' || acc.bag === 'miniBack' || acc.bag === 'schoolBag') {
                    // Front: show straps on shoulders
                    svg += '<path d="M' + (cx - sW + 4) + ' ' + (tTop + 1) + ' Q' + (cx - sW + 3) + ' ' + (tTop + 8) + ' ' + (cx - sW + 4) + ' ' + (tTop + 16) + '" stroke="#555" stroke-width="2" fill="none" stroke-linecap="round"/>';
                    svg += '<path d="M' + (cx + sW - 4) + ' ' + (tTop + 1) + ' Q' + (cx + sW - 3) + ' ' + (tTop + 8) + ' ' + (cx + sW - 4) + ' ' + (tTop + 16) + '" stroke="#555" stroke-width="2" fill="none" stroke-linecap="round"/>';
                } else if (acc.bag === 'crossbody') {
                    svg += '<line x1="' + (cx - sW) + '" y1="' + (tTop + 3) + '" x2="' + (bx + 4) + '" y2="' + (tBot - 4) + '" stroke="#5c4033" stroke-width="1.5"/>';
                    svg += '<rect x="' + (bx - 2) + '" y="' + (tBot - 7) + '" width="10" height="9" rx="2" fill="#5c4033"/>';
                } else if (acc.bag === 'fanny') {
                    svg += '<path d="M' + (cx - wW - 2) + ' ' + (tBot + 1) + ' Q' + cx + ' ' + (tBot + 4) + ' ' + (cx + wW + 2) + ' ' + (tBot + 1) + '" stroke="#333" stroke-width="1.2" fill="none"/>';
                    svg += '<rect x="' + (cx + wW - 3) + '" y="' + (tBot - 1) + '" width="8" height="6" rx="2" fill="#333"/>';
                } else if (acc.bag === 'sling') {
                    svg += '<line x1="' + (cx + sW - 4) + '" y1="' + tTop + '" x2="' + (cx - sW + 6) + '" y2="' + (tBot - 8) + '" stroke="#333" stroke-width="1.5"/>';
                    svg += '<rect x="' + (cx - sW + 2) + '" y="' + (tBot - 12) + '" width="8" height="7" rx="2" fill="#333"/>';
                } else {
                    svg += '<rect x="' + bx + '" y="' + by3 + '" width="11" height="14" rx="2" fill="#8B6914"/>';
                    svg += '<path d="M' + (bx + 2) + ' ' + by3 + ' Q' + (bx + 5.5) + ' ' + (by3 - 5) + ' ' + (bx + 9) + ' ' + by3 + '" stroke="#8B6914" stroke-width="1" fill="none"/>';
                }
            }

            // ─── BACK VIEW ───
            var bk = '';
            // Legs skin
            if (skinTop < legBot) {
                bk += '<rect x="' + (cx - legW - 2) + '" y="' + skinTop + '" width="' + legW + '" height="' + (legBot - skinTop) + '" rx="2" fill="' + AV.skin + '"/>';
                bk += '<rect x="' + (cx + 2) + '" y="' + skinTop + '" width="' + legW + '" height="' + (legBot - skinTop) + '" rx="2" fill="' + AV.skin + '"/>';
            }
            bk += '<ellipse cx="' + (cx - legW / 2 - 1) + '" cy="' + (legBot + 2) + '" rx="7" ry="3.5" fill="#2a2a2a"/>';
            bk += '<ellipse cx="' + (cx + legW / 2 + 1) + '" cy="' + (legBot + 2) + '" rx="7" ry="3.5" fill="#2a2a2a"/>';
            // Pants back
            if (!isSkirt) {
                var cYb = tBot + 10 + Math.round(wF * 3);
                bk += '<path d="M' + (cx - wW) + ' ' + tBot + ' L' + (cx - legW - 1) + ' ' + (tBot + bLen) + ' L' + (cx - 1) + ' ' + (tBot + bLen) + ' L' + cx + ' ' + cYb + ' L' + (cx + 1) + ' ' + (tBot + bLen) + ' L' + (cx + legW + 1) + ' ' + (tBot + bLen) + ' L' + (cx + wW) + ' ' + tBot + ' Z" fill="' + AV.botC + '"/>';
            } else {
                bk += '<path d="M' + (cx - wW) + ' ' + tBot + ' Q' + (cx - wW - 5) + ' ' + (tBot + bLen * 0.5) + ' ' + (cx - wW - 7) + ' ' + (tBot + bLen) + ' L' + (cx + wW + 7) + ' ' + (tBot + bLen) + ' Q' + (cx + wW + 5) + ' ' + (tBot + bLen * 0.5) + ' ' + (cx + wW) + ' ' + tBot + ' Z" fill="' + AV.botC + '"/>';
            }
            bk += '<rect x="' + (cx - nW) + '" y="' + nY + '" width="' + (nW * 2) + '" height="' + nH + '" rx="2" fill="' + AV.skin + '"/>';
            // Arms back
            if (!longSleeve) {
                bk += '<rect x="' + (cx - sW - aW) + '" y="' + (aY + armLen) + '" width="' + aW + '" height="' + (tH - armLen + 6) + '" rx="' + (aW / 2) + '" fill="' + AV.skin + '"/>';
                bk += '<rect x="' + (cx + sW) + '" y="' + (aY + armLen) + '" width="' + aW + '" height="' + (tH - armLen + 6) + '" rx="' + (aW / 2) + '" fill="' + AV.skin + '"/>';
            }
            bk += '<ellipse cx="' + (cx - sW - aW / 2) + '" cy="' + (aY + tH + 7) + '" rx="3" ry="3.5" fill="' + AV.skin + '"/>';
            bk += '<ellipse cx="' + (cx + sW + aW / 2) + '" cy="' + (aY + tH + 7) + '" rx="3" ry="3.5" fill="' + AV.skin + '"/>';
            // Top back
            bk += '<path d="M' + (cx - sW) + ' ' + tTop + ' L' + (cx - wW) + ' ' + topEnd + ' L' + (cx + wW) + ' ' + topEnd + ' L' + (cx + sW) + ' ' + tTop + ' Z" fill="' + AV.topC + '"/>';
            bk += '<rect x="' + (cx - sW - aW) + '" y="' + aY + '" width="' + aW + '" height="' + armLen + '" rx="' + (aW / 2) + '" fill="' + AV.topC + '"/>';
            bk += '<rect x="' + (cx + sW) + '" y="' + aY + '" width="' + aW + '" height="' + armLen + '" rx="' + (aW / 2) + '" fill="' + AV.topC + '"/>';
            // Head back
            bk += '<circle cx="' + cx + '" cy="' + hy + '" r="' + hr + '" fill="' + AV.skin + '"/>';
            // Back hair
            bk += '<path d="M' + (cx - 10) + ' ' + (hy - 9) + ' Q' + cx + ' ' + (hy - 13) + ' ' + (cx + 10) + ' ' + (hy - 9) + '" fill="' + AV.hc + '"/>';
            bk += '<path d="M' + (cx - 10) + ' ' + (hy - 9) + ' Q' + (cx - 11) + ' ' + hy + ' ' + (cx - 10) + ' ' + (hy + 5) + '" fill="' + AV.hc + '"/>';
            bk += '<path d="M' + (cx + 10) + ' ' + (hy - 9) + ' Q' + (cx + 11) + ' ' + hy + ' ' + (cx + 10) + ' ' + (hy + 5) + '" fill="' + AV.hc + '"/>';
            if (fem) {
                var bhL = 15 + (0.4 + AV.hLen) * 30;
                var bvol = 0.5 + AV.hVol * 0.8;
                if (bhL > 14) {
                    for (var bhi = -1; bhi <= 1; bhi += 2)
                        bk += '<path d="M' + (cx + bhi * 10) + ' ' + (hy + 5) + ' Q' + (cx + bhi * 13) + ' ' + (hy + bhL * 0.3) + ' ' + (cx + bhi * 11) + ' ' + (hy + bhL) + '" stroke="' + AV.hc + '" stroke-width="' + (5 * bvol) + '" fill="none" stroke-linecap="round"/>';
                }
                if (AV.hair === 'bun') bk += '<circle cx="' + cx + '" cy="' + (hy - 14) + '" r="' + (7 * bvol) + '" fill="' + AV.hc + '"/>';
                if (AV.hair === 'twoBuns') { bk += '<circle cx="' + (cx - 10 * bvol) + '" cy="' + (hy - 12) + '" r="' + (7 * bvol) + '" fill="' + AV.hc + '"/>'; bk += '<circle cx="' + (cx + 10 * bvol) + '" cy="' + (hy - 12) + '" r="' + (7 * bvol) + '" fill="' + AV.hc + '"/>'; }
                if (AV.hair === 'ponytail') bk += '<path d="M' + cx + ' ' + (hy + 5) + ' Q' + (cx + 1) + ' ' + (hy + bhL * 0.3) + ' ' + cx + ' ' + (hy + bhL * 0.7) + '" stroke="' + AV.hc + '" stroke-width="' + (4 * bvol) + '" fill="none" stroke-linecap="round"/>';
                if (AV.hair === 'lowPony') { bk += '<path d="M' + cx + ' ' + (hy + 10) + ' Q' + (cx + 1) + ' ' + (hy + bhL * 0.4) + ' ' + cx + ' ' + (hy + bhL * 0.7) + '" stroke="' + AV.hc + '" stroke-width="' + (4 * bvol) + '" fill="none" stroke-linecap="round"/>'; bk += '<rect x="' + (cx - 3) + '" y="' + (hy + 8) + '" width="6" height="3" rx="1.5" fill="#c19a6b"/>'; }
                if (AV.hair === 'braids' || AV.hair === 'fishtail') {
                    for (var bbi = -1; bbi <= 1; bbi += 2)
                        for (var bbj = 0; bbj < Math.floor(2 + AV.hLen * 3); bbj++)
                            bk += '<ellipse cx="' + (cx + bbi * 7 + bbi * Math.sin(bbj * 0.8)) + '" cy="' + (hy + 8 + bbj * 5) + '" rx="' + (2.5 * bvol) + '" ry="3" fill="' + AV.hc + '"/>';
                }
            } else {
                if (AV.hair === 'manBun') bk += '<circle cx="' + cx + '" cy="' + (hy - 12) + '" r="' + (5 * (0.5 + AV.hVol * 0.8)) + '" fill="' + AV.hc + '"/>';
                if (AV.hair === 'wolfcut') {
                    var bwl = 12 * (0.4 + AV.hLen);
                    for (var bwi = -1; bwi <= 1; bwi += 2) bk += '<path d="M' + (cx + bwi * 9) + ' ' + (hy + 5) + ' Q' + (cx + bwi * 11) + ' ' + (hy + bwl) + ' ' + (cx + bwi * 9) + ' ' + (hy + bwl + 6) + '" stroke="' + AV.hc + '" stroke-width="' + (3 * (0.5 + AV.hVol * 0.8)) + '" fill="none" stroke-linecap="round"/>';
                }
            }
            // Detailed backpack back view
            if (acc.bag === 'backpack' || acc.bag === 'miniBack' || acc.bag === 'schoolBag') {
                var bsz = acc.bag === 'miniBack' ? 0.65 : 1;
                var bpW = 22 * bsz, bpH = 30 * bsz;
                var bpx = cx - bpW / 2, bpy = tTop - 5;
                bk += '<rect x="' + bpx + '" y="' + bpy + '" width="' + bpW + '" height="' + bpH + '" rx="' + (4 * bsz) + '" fill="#555"/>';
                // Top flap
                bk += '<path d="M' + (bpx + 1) + ' ' + (bpy + 1) + ' Q' + cx + ' ' + (bpy - 4 * bsz) + ' ' + (bpx + bpW - 1) + ' ' + (bpy + 1) + '" fill="#4a4a4a"/>';
                // Front pocket
                bk += '<rect x="' + (bpx + 3 * bsz) + '" y="' + (bpy + bpH * 0.18) + '" width="' + (bpW - 6 * bsz) + '" height="' + (bpH * 0.28) + '" rx="' + (2.5 * bsz) + '" fill="#4a4a4a" stroke="#666" stroke-width="0.3"/>';
                // Zipper
                bk += '<line x1="' + (bpx + 4 * bsz) + '" y1="' + (bpy + bpH * 0.18 + 1.5) + '" x2="' + (bpx + bpW - 4 * bsz) + '" y2="' + (bpy + bpH * 0.18 + 1.5) + '" stroke="#888" stroke-width="0.6" stroke-dasharray="1.5 1"/>';
                bk += '<circle cx="' + (cx) + '" cy="' + (bpy + bpH * 0.18 + 1.5) + '" r="' + (1.5 * bsz) + '" fill="#aaa"/>';
                // Lower pocket
                bk += '<rect x="' + (bpx + 4 * bsz) + '" y="' + (bpy + bpH * 0.54) + '" width="' + (bpW - 8 * bsz) + '" height="' + (bpH * 0.12) + '" rx="' + (1.5 * bsz) + '" fill="#4a4a4a" stroke="#666" stroke-width="0.2"/>';
                // Straps
                bk += '<path d="M' + (bpx + 3) + ' ' + (bpy + 3) + ' Q' + (cx - sW + 3) + ' ' + (bpy + 6) + ' ' + (cx - sW + 4) + ' ' + (tTop + 16) + '" stroke="#555" stroke-width="' + (3 * bsz) + '" fill="none" stroke-linecap="round"/>';
                bk += '<path d="M' + (bpx + bpW - 3) + ' ' + (bpy + 3) + ' Q' + (cx + sW - 3) + ' ' + (bpy + 6) + ' ' + (cx + sW - 4) + ' ' + (tTop + 16) + '" stroke="#555" stroke-width="' + (3 * bsz) + '" fill="none" stroke-linecap="round"/>';
                // Strap adjusters
                bk += '<rect x="' + (cx - sW + 2) + '" y="' + (tTop + 12) + '" width="' + (3 * bsz) + '" height="' + (3 * bsz) + '" rx="0.5" fill="#aaa"/>';
                bk += '<rect x="' + (cx + sW - 5) + '" y="' + (tTop + 12) + '" width="' + (3 * bsz) + '" height="' + (3 * bsz) + '" rx="0.5" fill="#aaa"/>';
                // Top handle
                bk += '<path d="M' + (cx - 3 * bsz) + ' ' + bpy + ' Q' + cx + ' ' + (bpy - 4 * bsz) + ' ' + (cx + 3 * bsz) + ' ' + bpy + '" stroke="#555" stroke-width="' + (2 * bsz) + '" fill="none" stroke-linecap="round"/>';
                // Bottom detail
                bk += '<rect x="' + (bpx + 1) + '" y="' + (bpy + bpH - 3 * bsz) + '" width="' + (bpW - 2) + '" height="' + (2.5 * bsz) + '" rx="1" fill="#4a4a4a"/>';
            }
            // Belt back
            if (acc.belt) {
                var bblt = (acc.belt.indexOf('Brown') >= 0 || acc.belt === 'woven') ? '#5c4033' : '#1a1a1a';
                bk += '<rect x="' + (cx - wW) + '" y="' + (tBot - 1) + '" width="' + (wW * 2) + '" height="2.5" rx="1.2" fill="' + bblt + '"/>';
            }
            // Hat back
            if (acc.hat) {
                var hbt = hy - hr;
                if (acc.hat === 'cap') bk += '<rect x="' + (cx - 11) + '" y="' + (hbt - 3) + '" width="22" height="8" rx="5" fill="#333"/><rect x="' + (cx - 14) + '" y="' + (hbt - 1) + '" width="5" height="3" rx="1.5" fill="#444"/>';
                else if (acc.hat === 'beanie') bk += '<rect x="' + (cx - 10) + '" y="' + (hbt - 5) + '" width="20" height="14" rx="7" fill="#CC4444"/><circle cx="' + cx + '" cy="' + (hbt - 6) + '" r="2" fill="#CC4444"/>';
                else bk += '<ellipse cx="' + cx + '" cy="' + (hbt + 3) + '" rx="14" ry="4" fill="#6b5b4a"/><rect x="' + (cx - 11) + '" y="' + (hbt - 4) + '" width="22" height="10" rx="6" fill="#6b5b4a"/>';
            }

            // Render with rotation
            var rotY = AV.rot % 360;
            var scaleX = Math.cos((rotY * Math.PI) / 180);
            var isBack = Math.abs(rotY % 360) > 90 && Math.abs(rotY % 360) < 270;
            var viewContent = isBack ? bk : svg;
            el.innerHTML = '<div style="transform:scaleX(' + scaleX + ');transition:' + (el._dragging ? 'none' : 'transform .1s ease') + '">' +
                '<svg viewBox="20 4 100 ' + (totalH - 4) + '" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' + viewContent + '</svg></div>';

            // Rotation label
            var rotLbl = document.getElementById('av-rot-lbl');
            if (rotLbl) rotLbl.textContent = (isBack ? '🔄 背面' : '👤 正面') + ' ' + Math.round(AV.rot) + '°';

            // Summary
            var topN = tops.find(function (t) { return t.id === AV.topT; });
            var botN = bots.find(function (b2) { return b2.id === AV.botT; });
            var sumEl = document.getElementById('av-sum');
            if (sumEl) sumEl.textContent = (topN ? topN.i + topN.n : '') + ' + ' + (botN ? botN.i + botN.n : '') + (AV.tuck ? ' (紮入)' : '') + ' ・ ' + AV.ht + 'cm ・ ' + AV.wt + 'kg';

            // Update selection pills
            updatePills();
        }

        // ── Drag rotation ──
        var stage = document.getElementById('av-stage');
        var dragging = false, lastX = 0;
        stage.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; stage._dragging = true; stage.setPointerCapture(e.pointerId); });
        stage.addEventListener('pointermove', function (e) { if (!dragging) return; AV.rot = AV.rot + (e.clientX - lastX) * 0.8; lastX = e.clientX; var rs = document.getElementById('av-rot-s'); if (rs) rs.value = Math.max(-180, Math.min(180, AV.rot)); drawAvatar(); });
        stage.addEventListener('pointerup', function () { dragging = false; stage._dragging = false; });
        document.getElementById('av-rot-s').addEventListener('input', function (e) { AV.rot = +e.target.value; drawAvatar(); });
        document.getElementById('av-rot-f').addEventListener('click', function () { AV.rot = 0; document.getElementById('av-rot-s').value = 0; drawAvatar(); });
        document.getElementById('av-rot-b').addEventListener('click', function () { AV.rot = 180; document.getElementById('av-rot-s').value = 180; drawAvatar(); });

        // ── Selection Pills ──
        function updatePills() {
            var bar = document.getElementById('av-sel-bar');
            var pillsEl = document.getElementById('av-pills');
            if (!bar || !pillsEl) return;
            var pills = [];
            if (AV.body !== AV_DEF.body) pills.push({ l: AV.body === 'male' ? '🚹 男' : '🚺 女', d: function () { AV.body = AV_DEF.body; AV.hair = AV_DEF.hair; renderAvTab(); drawAvatar(); } });
            if (AV.face !== AV_DEF.face) { var fn = faces.find(function (f) { return f.id === AV.face; }); pills.push({ l: fn ? fn.n : AV.face, d: function () { AV.face = AV_DEF.face; drawAvatar(); } }); }
            if (AV.hair !== (AV.body === 'male' ? 'short' : 'long')) { var hn = (hairStyles[AV.body] || []).find(function (h) { return h.id === AV.hair; }); pills.push({ l: '💇 ' + (hn ? hn.n : AV.hair), d: function () { AV.hair = AV.body === 'male' ? 'short' : 'long'; drawAvatar(); } }); }
            if (AV.topT !== AV_DEF.topT) { var tn = tops.find(function (t) { return t.id === AV.topT; }); pills.push({ l: '👕 ' + (tn ? tn.n : ''), d: function () { AV.topT = AV_DEF.topT; renderAvTab(); drawAvatar(); } }); }
            if (AV.botT !== AV_DEF.botT) { var bn = bots.find(function (b2) { return b2.id === AV.botT; }); pills.push({ l: '👖 ' + (bn ? bn.n : ''), d: function () { AV.botT = AV_DEF.botT; renderAvTab(); drawAvatar(); } }); }
            if (AV.tuck) pills.push({ l: '👔 紮入', d: function () { AV.tuck = false; drawAvatar(); } });
            Object.keys(AV.acc).forEach(function (cat) {
                var id = AV.acc[cat]; if (!id) return;
                var catDef = accCats.find(function (c) { return c.cat === cat; });
                var it = catDef ? catDef.items.find(function (i) { return i.id === id; }) : null;
                if (it) pills.push({ l: catDef.icon + ' ' + it.n, d: function () { delete AV.acc[cat]; renderAvTab(); drawAvatar(); } });
            });
            if (pills.length === 0) { bar.classList.add('hidden'); return; }
            bar.classList.remove('hidden');
            pillsEl.innerHTML = '';
            pills.forEach(function (p) {
                var sp = document.createElement('span');
                sp.className = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-200';
                sp.innerHTML = p.l + '<button class="ml-0.5 w-4 h-4 rounded-full bg-violet-200 hover:bg-red-300 text-violet-700 hover:text-red-700 flex items-center justify-center text-xs cursor-pointer transition leading-none" style="font-size:9px">✕</button>';
                sp.querySelector('button').addEventListener('click', p.d);
                pillsEl.appendChild(sp);
            });
        }

        // ── Reset all ──
        document.getElementById('av-reset-all').addEventListener('click', function () {
            AV = JSON.parse(JSON.stringify(AV_DEF));
            renderAvTab();
            drawAvatar();
        });

        // ── Avatar Tab System ──
        var avTabs = [
            { id: 'body', n: '體型', ic: '👤' }, { id: 'face', n: '臉型髮型', ic: '💇' },
            { id: 'top', n: '上衣', ic: '👕' }, { id: 'bottom', n: '下身', ic: '👖' },
            { id: 'acc', n: '配件', ic: '✨' }
        ];

        function renderAvTabs() {
            var html = '';
            avTabs.forEach(function (t) {
                var on = t.id === avTab;
                html += '<button class="av-stab flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ' + (on ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200') + '" data-st="' + t.id + '">' + t.ic + ' ' + t.n + '</button>';
            });
            html += '<button id="av-reset-btn" class="px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer transition border border-red-200 whitespace-nowrap">🗑 清除</button>';
            document.getElementById('av-tabs').innerHTML = html;
            root.querySelectorAll('.av-stab').forEach(function (b) {
                b.addEventListener('click', function () { avTab = b.getAttribute('data-st'); renderAvTabs(); renderAvTab(); });
            });
            document.getElementById('av-reset-btn').addEventListener('click', function () {
                AV = JSON.parse(JSON.stringify(AV_DEF));
                renderAvTab();
                drawAvatar();
            });
        }

        function renderAvTab() {
            var el = document.getElementById('av-tab-content');
            if (!el) return;
            var html = '';

            if (avTab === 'body') {
                html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">';
                html += '<div class="text-xs font-bold text-slate-400 mb-2">性別</div>';
                html += '<div class="flex gap-2">';
                html += '<button class="av-bd2 flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition border-2 ' + (AV.body === 'male' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500') + '" data-b="male">🚹 男生</button>';
                html += '<button class="av-bd2 flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition border-2 ' + (AV.body === 'female' ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-slate-200 bg-white text-slate-500') + '" data-b="female">🚺 女生</button>';
                html += '</div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-1">身高</div>';
                html += '<div class="flex items-center gap-2"><input type="range" class="av-ctrl flex-1 accent-violet-500" data-k="ht" min="140" max="210" value="' + AV.ht + '"><span class="text-xs font-bold text-slate-600 w-14 text-right">' + AV.ht + 'cm</span></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-2 mb-1">體重</div>';
                html += '<div class="flex items-center gap-2"><input type="range" class="av-ctrl flex-1 accent-violet-500" data-k="wt" min="35" max="150" value="' + AV.wt + '"><span class="text-xs font-bold text-slate-600 w-14 text-right">' + AV.wt + 'kg</span></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">膚色</div>';
                html += '<div class="flex gap-1.5 flex-wrap" id="av-skin-grid"></div>';
                html += '</div>';
            } else if (avTab === 'face') {
                html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">';
                html += '<div class="text-xs font-bold text-slate-400 mb-2">臉型</div><div class="grid grid-cols-4 gap-1.5" id="av-face-grid"></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">髮型</div><div class="grid grid-cols-3 gap-1.5" id="av-hair-grid"></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-1">髮型微調</div>';
                html += '<div class="space-y-2">';
                html += '<div class="flex items-center gap-2"><span class="text-xs text-slate-500 w-8">長度</span><input type="range" class="av-ctrl flex-1 accent-violet-500" data-k="hLen" min="0" max="100" value="' + Math.round(AV.hLen * 100) + '"><span class="text-xs text-slate-400 w-8 text-right">' + Math.round(AV.hLen * 100) + '%</span></div>';
                html += '<div class="flex items-center gap-2"><span class="text-xs text-slate-500 w-8">蓬鬆</span><input type="range" class="av-ctrl flex-1 accent-violet-500" data-k="hVol" min="0" max="100" value="' + Math.round(AV.hVol * 100) + '"><span class="text-xs text-slate-400 w-8 text-right">' + Math.round(AV.hVol * 100) + '%</span></div>';
                html += '<div class="flex items-center gap-2"><span class="text-xs text-slate-500 w-8">高低</span><input type="range" class="av-ctrl flex-1 accent-violet-500" data-k="hY" min="0" max="100" value="' + Math.round(AV.hY * 100) + '"><span class="text-xs text-slate-400 w-8 text-right">' + Math.round(AV.hY * 100) + '%</span></div>';
                html += '</div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">髮色</div><div class="flex gap-1.5 flex-wrap" id="av-hc-grid"></div>';
                html += '</div>';
            } else if (avTab === 'top') {
                html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">';
                html += '<div class="text-xs font-bold text-slate-400 mb-2">上衣款式</div><div class="grid grid-cols-3 gap-1.5" id="av-top-grid"></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">衣服紮入 / 放外</div>';
                html += '<div class="flex gap-2"><button class="av-tuck flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition border-2 ' + (!AV.tuck ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500') + '" data-t="0">放在外面</button>';
                html += '<button class="av-tuck flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition border-2 ' + (AV.tuck ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500') + '" data-t="1">紮入褲子</button></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">上衣顏色</div><div class="flex gap-1.5 flex-wrap" id="av-topc-grid"></div>';
                html += '</div>';
            } else if (avTab === 'bottom') {
                html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">';
                html += '<div class="text-xs font-bold text-slate-400 mb-2">下身款式</div><div class="grid grid-cols-3 gap-1.5" id="av-bot-grid"></div>';
                html += '<div class="text-xs font-bold text-slate-400 mt-3 mb-2">下身顏色</div><div class="flex gap-1.5 flex-wrap" id="av-botc-grid"></div>';
                html += '</div>';
            } else if (avTab === 'acc') {
                accCats.forEach(function (cat) {
                    if (cat.cat === 'beard' && AV.body === 'female') return;
                    html += '<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-2">';
                    html += '<div class="text-xs font-bold text-slate-400 mb-2">' + cat.icon + ' ' + cat.n + '（' + cat.items.length + '款）</div>';
                    html += '<div class="grid grid-cols-3 gap-1.5 av-acc-grid" data-cat="' + cat.cat + '"></div>';
                    if (AV.acc[cat.cat]) html += '<button class="av-acc-clear text-xs text-slate-400 hover:text-red-400 cursor-pointer mt-1.5 transition" data-cat="' + cat.cat + '">✕ 取消選擇</button>';
                    html += '</div>';
                });
            }

            el.innerHTML = html;
            bindAvControls();
        }

        function bindAvControls() {
            // Body gender
            root.querySelectorAll('.av-bd2').forEach(function (b) {
                b.addEventListener('click', function () { AV.body = b.getAttribute('data-b'); AV.hair = AV.body === 'male' ? 'short' : 'long'; renderAvTab(); drawAvatar(); });
            });
            // Range controls
            root.querySelectorAll('.av-ctrl').forEach(function (r) {
                r.addEventListener('input', function () {
                    var k = r.getAttribute('data-k');
                    if (k === 'ht') { AV.ht = +r.value; r.nextElementSibling.textContent = AV.ht + 'cm'; }
                    else if (k === 'wt') { AV.wt = +r.value; r.nextElementSibling.textContent = AV.wt + 'kg'; }
                    else if (k === 'hLen') { AV.hLen = +r.value / 100; r.nextElementSibling.textContent = r.value + '%'; }
                    else if (k === 'hVol') { AV.hVol = +r.value / 100; r.nextElementSibling.textContent = r.value + '%'; }
                    else if (k === 'hY') { AV.hY = +r.value / 100; r.nextElementSibling.textContent = r.value + '%'; }
                    drawAvatar();
                });
            });
            // Skin colors
            var skGrid = document.getElementById('av-skin-grid');
            if (skGrid) {
                skins.forEach(function (s) {
                    var b = document.createElement('button');
                    b.className = 'w-7 h-7 rounded-full border-2 cursor-pointer transition active:scale-90 ' + (s.h === AV.skin ? 'border-violet-500 ring-2 ring-violet-200 scale-110' : 'border-slate-200');
                    b.style.background = s.h; b.title = s.n;
                    b.addEventListener('click', function () { AV.skin = s.h; renderAvTab(); drawAvatar(); });
                    skGrid.appendChild(b);
                });
            }
            // Face grid
            var fGrid = document.getElementById('av-face-grid');
            if (fGrid) {
                faces.forEach(function (f) {
                    var b = document.createElement('button');
                    b.className = 'py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border-2 ' + (AV.face === f.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500');
                    b.textContent = f.n;
                    b.addEventListener('click', function () { AV.face = f.id; renderAvTab(); drawAvatar(); });
                    fGrid.appendChild(b);
                });
            }
            // Hair grid
            var hGrid = document.getElementById('av-hair-grid');
            if (hGrid) {
                (hairStyles[AV.body] || []).forEach(function (h) {
                    var b = document.createElement('button');
                    b.className = 'py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border-2 ' + (AV.hair === h.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500');
                    b.textContent = h.n;
                    b.addEventListener('click', function () { AV.hair = h.id; renderAvTab(); drawAvatar(); });
                    hGrid.appendChild(b);
                });
            }
            // Hair color
            var hcGrid = document.getElementById('av-hc-grid');
            if (hcGrid) {
                hairColors.forEach(function (c) {
                    var b = document.createElement('button');
                    b.className = 'w-7 h-7 rounded-full border-2 cursor-pointer transition active:scale-90 ' + (c.h === AV.hc ? 'border-violet-500 ring-2 ring-violet-200 scale-110' : 'border-slate-200');
                    b.style.background = c.h; b.title = c.n;
                    b.addEventListener('click', function () { AV.hc = c.h; renderAvTab(); drawAvatar(); });
                    hcGrid.appendChild(b);
                });
            }
            // Top grid
            var topGrid = document.getElementById('av-top-grid');
            if (topGrid) {
                tops.forEach(function (t) {
                    var b = document.createElement('button');
                    b.className = 'py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border-2 ' + (AV.topT === t.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500');
                    b.textContent = t.i + ' ' + t.n;
                    b.addEventListener('click', function () { AV.topT = t.id; renderAvTab(); drawAvatar(); });
                    topGrid.appendChild(b);
                });
            }
            // Tuck
            root.querySelectorAll('.av-tuck').forEach(function (b) {
                b.addEventListener('click', function () { AV.tuck = b.getAttribute('data-t') === '1'; renderAvTab(); drawAvatar(); });
            });
            // Top color
            var tcGrid = document.getElementById('av-topc-grid');
            if (tcGrid) {
                allColors.forEach(function (c) {
                    var b = document.createElement('button');
                    b.className = 'w-6 h-6 rounded-full border-2 cursor-pointer transition active:scale-90 ' + (c.hex === AV.topC ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200');
                    b.style.background = c.hex; b.title = c.name;
                    b.addEventListener('click', function () { AV.topC = c.hex; renderAvTab(); drawAvatar(); });
                    tcGrid.appendChild(b);
                });
            }
            // Bot grid
            var botGrid = document.getElementById('av-bot-grid');
            if (botGrid) {
                bots.forEach(function (b2) {
                    var b = document.createElement('button');
                    b.className = 'py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border-2 ' + (AV.botT === b2.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500');
                    b.textContent = b2.i + ' ' + b2.n;
                    b.addEventListener('click', function () { AV.botT = b2.id; renderAvTab(); drawAvatar(); });
                    botGrid.appendChild(b);
                });
            }
            // Bot color
            var bcGrid = document.getElementById('av-botc-grid');
            if (bcGrid) {
                allColors.forEach(function (c) {
                    var b = document.createElement('button');
                    b.className = 'w-6 h-6 rounded-full border-2 cursor-pointer transition active:scale-90 ' + (c.hex === AV.botC ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200');
                    b.style.background = c.hex; b.title = c.name;
                    b.addEventListener('click', function () { AV.botC = c.hex; renderAvTab(); drawAvatar(); });
                    bcGrid.appendChild(b);
                });
            }
            // Acc grids
            root.querySelectorAll('.av-acc-grid').forEach(function (grid) {
                var catId = grid.getAttribute('data-cat');
                var catDef = accCats.find(function (c) { return c.cat === catId; });
                if (!catDef) return;
                catDef.items.forEach(function (it) {
                    var b = document.createElement('button');
                    var on = AV.acc[catId] === it.id;
                    b.className = 'py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition border-2 text-left ' + (on ? 'border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-200' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300');
                    b.textContent = it.n;
                    b.addEventListener('click', function () {
                        if (AV.acc[catId] === it.id) delete AV.acc[catId];
                        else AV.acc[catId] = it.id;
                        renderAvTab(); drawAvatar();
                    });
                    grid.appendChild(b);
                });
            });
            root.querySelectorAll('.av-acc-clear').forEach(function (b) {
                b.addEventListener('click', function () { delete AV.acc[b.getAttribute('data-cat')]; renderAvTab(); drawAvatar(); });
            });
            // Upload
            var uploadBtn = document.getElementById('av-upload-btn');
            var fileInput = document.getElementById('av-file-input');
            if (uploadBtn && fileInput) {
                uploadBtn.addEventListener('click', function () { fileInput.click(); });
                fileInput.addEventListener('change', function (e) {
                    var f = e.target.files && e.target.files[0];
                    if (!f) return;
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        var im = new Image();
                        im.onload = function () {
                            var info = analyzeImgFast(im, 'full');
                            AV.skin = closestColor(info.sc, skins);
                            AV.hc = closestColor(info.hc, hairColors);
                            AV.topC = 'rgb(' + info.tc[0] + ',' + info.tc[1] + ',' + info.tc[2] + ')';
                            AV.botC = 'rgb(' + info.bc[0] + ',' + info.bc[1] + ',' + info.bc[2] + ')';
                            AV.img = info.src;
                            var prevEl = document.getElementById('av-upload-preview');
                            var prevImg = document.getElementById('av-upload-img');
                            if (prevEl && prevImg) { prevEl.classList.remove('hidden'); prevImg.src = AV.img; }
                            renderAvTab(); drawAvatar();
                        };
                        im.src = ev.target.result;
                    };
                    reader.readAsDataURL(f);
                });
            }
            var clearImg = document.getElementById('av-clear-img');
            if (clearImg) clearImg.addEventListener('click', function () {
                AV.img = null;
                var prevEl = document.getElementById('av-upload-preview');
                if (prevEl) prevEl.classList.add('hidden');
                renderAvTab();
            });
            function closestColor(rgb, arr) {
                var best = arr[0], bd = Infinity;
                arr.forEach(function (a) {
                    var hx = a.h || a.hex;
                    if (!hx || hx.length < 4) return;
                    var r1 = parseInt(hx.slice(1, 3), 16), g1 = parseInt(hx.slice(3, 5), 16), b1 = parseInt(hx.slice(5, 7), 16);
                    if (isNaN(r1)) return;
                    var dist = Math.sqrt(Math.pow(r1 - rgb[0], 2) + Math.pow(g1 - rgb[1], 2) + Math.pow(b1 - rgb[2], 2));
                    if (dist < bd) { bd = dist; best = a; }
                });
                return best.h || best.hex;
            }

            function removeBg(ctx, w, h) {
                var imgData = ctx.getImageData(0, 0, w, h);
                var d = imgData.data;
                var visited = new Uint8Array(w * h);
                var stack = new Int32Array(w * h);
                var stackPt = 0;
                
                var edgeColors = [];
                for(var x=0; x<w; x+=10) edgeColors.push([d[x*4], d[x*4+1], d[x*4+2], d[x*4+3]]);
                for(var x=0; x<w; x+=10) edgeColors.push([d[((h-1)*w+x)*4], d[((h-1)*w+x)*4+1], d[((h-1)*w+x)*4+2], d[((h-1)*w+x)*4+3]]);
                for(var y=0; y<h; y+=10) edgeColors.push([d[y*w*4], d[y*w*4+1], d[y*w*4+2], d[y*w*4+3]]);
                for(var y=0; y<h; y+=10) edgeColors.push([d[(y*w+w-1)*4], d[(y*w+w-1)*4+1], d[(y*w+w-1)*4+2], d[(y*w+w-1)*4+3]]);

                var isTransparentBg = false;
                var transparentEdges = 0;
                edgeColors.forEach(function(c) { if (c[3] < 50) transparentEdges++; });
                if (transparentEdges > edgeColors.length * 0.3) isTransparentBg = true;

                var bestCol = [255, 255, 255], bestCount = 0;
                if (!isTransparentBg) {
                    edgeColors.forEach(function(c1){
                        var count = 0;
                        edgeColors.forEach(function(c2){
                            if(Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]) + Math.abs(c1[2]-c2[2]) < 30) count++;
                        });
                        if(count > bestCount) { bestCount = count; bestCol = c1; }
                    });
                }

                function push(x, y) {
                    if (x < 0 || x >= w || y < 0 || y >= h) return;
                    var idx = y * w + x;
                    if (visited[idx] === 0) { visited[idx] = 1; stack[stackPt++] = idx; }
                }
                for (var x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
                for (var y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
                
                while (stackPt > 0) {
                    var idx = stack[--stackPt];
                    var p = idx * 4;
                    var match = false;
                    if (isTransparentBg) {
                        match = d[p + 3] < 50; 
                    } else {
                        match = (Math.abs(d[p] - bestCol[0]) + Math.abs(d[p+1] - bestCol[1]) + Math.abs(d[p+2] - bestCol[2])) < 50 || d[p+3] < 50;
                    }
                    if (match) {
                        d[p+3] = 0;
                        var xx = idx % w, yy = Math.floor(idx / w);
                        push(xx-1, yy); push(xx+1, yy); push(xx, yy-1); push(xx, yy+1);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                return d;
            }

            function analyzeImgFast(im, cropMode) {
                var cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
                var ctx = cv.getContext('2d'); ctx.drawImage(im, 0, 0);
                var w = im.width, h = im.height, t = h, b = 0, l = w, ri = 0;
                var d = removeBg(ctx, w, h);
                for (var y = 0; y < h; y += 4) {
                    for (var x = 0; x < w; x += 4) {
                        var i = (y * w + x) * 4;
                        if (d[i + 3] > 60) {
                            if (y < t) t = y; if (y > b) b = y;
                            if (x < l) l = x; if (x > ri) ri = x;
                        }
                    }
                }
                if (b <= t || ri <= l) { t=0; b=h; l=0; ri=w; }
                var bbH = b - t, bbW = ri - l, asp = bbH / bbW;

                function sampleBaseColor(ryS, ryE, rxS, rxE) {
                    var Math_floor = Math.floor, Math_max = Math.max, Math_min = Math.min;
                    var pixels = [];
                    var sY_f = Math_floor(t + bbH * ryS), eY_f = Math_floor(t + bbH * ryE);
                    var sX_f = Math_floor(l + bbW * rxS), eX_f = Math_floor(l + bbW * rxE);
                    var mY = (sY_f + eY_f) / 2, mH = (eY_f - sY_f) * 0.6;
                    var mX = (sX_f + eX_f) / 2, mW = (eX_f - sX_f) * 0.6;
                    var sY = Math_max(0, Math_floor(mY - mH/2)), eY = Math_min(h, Math_floor(mY + mH/2));
                    var sX = Math_max(0, Math_floor(mX - mW/2)), eX = Math_min(w, Math_floor(mX + mW/2));
                    
                    for (var py = sY; py < eY; py += 2) {
                        for (var px = sX; px < eX; px += 2) {
                            var idx = (py * w + px) * 4;
                            if (d[idx + 3] > 100) {
                                pixels.push([d[idx], d[idx+1], d[idx+2]]);
                            }
                        }
                    }
                    if (pixels.length === 0) {
                        for (var py = sY_f; py < eY_f; py += 3) {
                            for (var px = sX_f; px < eX_f; px += 3) {
                                var idx = (py * w + px) * 4;
                                if (d[idx + 3] > 100) pixels.push([d[idx], d[idx+1], d[idx+2]]);
                            }
                        }
                    }
                    if (pixels.length === 0) return [128, 128, 128];
                    
                    pixels.sort(function(v1, v2){ 
                        return (v1[0]+v1[1]+v1[2]) - (v2[0]+v2[1]+v2[2]); 
                    });
                    
                    // For flat SVGs, median (50%) looks like a shadow. 
                    // Using 85th percentile gives the unshaded "base color".
                    return pixels[Math_floor(pixels.length * 0.85)];
                }

                if (cropMode === 'full') {
                    return {
                        hc: sampleBaseColor(0.00, 0.12, 0.35, 0.65),
                        sc: sampleBaseColor(0.12, 0.22, 0.40, 0.60),
                        tc: sampleBaseColor(0.25, 0.50, 0.35, 0.65),
                        bc: sampleBaseColor(0.55, 0.85, 0.35, 0.65),
                        src: cv.toDataURL()
                    };
                }
                return { asp: asp, rgb: sampleBaseColor(0.2, 0.8, 0.2, 0.8), src: cv.toDataURL() };
            }
            // Separate top image upload
            var topUpBtn = document.getElementById('av-upload-top-btn');
            var topFile = document.getElementById('av-file-top');
            if (topUpBtn && topFile) {
                topUpBtn.addEventListener('click', function () { topFile.click(); });
                topFile.addEventListener('change', function (e) {
                    var f = e.target.files && e.target.files[0]; if (!f) return;
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        var im = new Image(); im.onload = function () {
                            var info = analyzeImgFast(im);
                            AV.topC = 'rgb(' + info.rgb[0] + ',' + info.rgb[1] + ',' + info.rgb[2] + ')';
                            AV.img = info.src;
                            if (info.asp > 1.4) AV.topT = 'coat';
                            else if (info.asp > 1.25) AV.topT = 'shirt';
                            else AV.topT = 'tee';
                            var prevImg = document.getElementById('av-upload-img');
                            if (prevImg) { prevImg.src = AV.img; document.getElementById('av-upload-preview').classList.remove('hidden'); }
                            renderAvTab(); drawAvatar();
                        }; im.src = ev.target.result;
                    }; reader.readAsDataURL(f);
                });
            }
            // Separate bottom image upload
            var botUpBtn = document.getElementById('av-upload-bot-btn');
            var botFile = document.getElementById('av-file-bot');
            if (botUpBtn && botFile) {
                botUpBtn.addEventListener('click', function () { botFile.click(); });
                botFile.addEventListener('change', function (e) {
                    var f = e.target.files && e.target.files[0]; if (!f) return;
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        var im = new Image(); im.onload = function () {
                            var info = analyzeImgFast(im);
                            AV.botC = 'rgb(' + info.rgb[0] + ',' + info.rgb[1] + ',' + info.rgb[2] + ')';
                            AV.img = info.src;
                            if (info.asp > 1.7) AV.botT = 'jeans';
                            else if (info.asp < 1.1) AV.botT = 'skirt';
                            else AV.botT = 'shorts';
                            var prevImg = document.getElementById('av-upload-img');
                            if (prevImg) { prevImg.src = AV.img; document.getElementById('av-upload-preview').classList.remove('hidden'); }
                            renderAvTab(); drawAvatar();
                        }; im.src = ev.target.result;
                    }; reader.readAsDataURL(f);
                });
            }
        }

        // ═══ TRENDS ═══
        root.querySelectorAll('.wo-tf').forEach(function (b) {
            b.addEventListener('click', function () {
                tFilter = b.getAttribute('data-f');
                root.querySelectorAll('.wo-tf').forEach(function (x) {
                    var on = x.getAttribute('data-f') === tFilter;
                    x.className = 'wo-tf px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition border ' + (on ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500');
                });
                renderT();
            });
        });

        function renderT() {
            var f = trends;
            if (tFilter !== 'all') f = f.filter(function (t) { return t.s === tFilter || t.g === tFilter; });
            var el = document.getElementById('wo-tresults');
            if (!f.length) { el.innerHTML = '<div class="text-center py-10 text-slate-400"><p class="text-sm">沒有符合的穿搭</p></div>'; return; }
            el.innerHTML = '<div class="text-xs font-bold text-slate-400 mb-2">📋 共 ' + f.length + ' 組穿搭（依人氣排序）</div>' + f.map(function (a) { return trendCard(a); }).join('');
        }

        // ─── Init ───
        renderW();
        renderAvTabs();
        renderAvTab();
        drawAvatar();
        renderT();
    }, 0);
};
