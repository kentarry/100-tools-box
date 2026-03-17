window.render_foodRecommender = function () {
    // ===== 內建食譜資料庫 =====
    const recipeDB = [
        {
            name: '番茄炒蛋',
            icon: '🍳',
            tags: ['快速', '家常', '10分鐘'],
            difficulty: '簡單',
            time: '10 分鐘',
            ingredients: {
                '雞蛋': { amount: 3, unit: '顆' },
                '番茄': { amount: 2, unit: '顆' },
                '蔥': { amount: 1, unit: '根' },
                '鹽': { amount: 0.5, unit: '小匙' },
                '糖': { amount: 0.5, unit: '小匙' },
                '油': { amount: 1, unit: '大匙' }
            },
            steps: [
                '雞蛋打散，加少許鹽拌勻',
                '番茄切塊（約 8 等份），蔥切蔥花',
                '鍋中下油燒熱，倒入蛋液快速翻炒至半熟後盛出',
                '原鍋下少許油，放入番茄塊中火翻炒至出汁（約 2 分鐘）',
                '加入糖和鹽調味，將炒好的蛋倒回鍋中輕輕拌勻',
                '撒上蔥花即可起鍋'
            ],
            tips: '番茄先炒出汁再加蛋，口感更好。蛋不要炒過老，七分熟就先盛出。'
        },
        {
            name: '蒜香炒高麗菜',
            icon: '🥬',
            tags: ['素食', '快速', '5分鐘'],
            difficulty: '簡單',
            time: '8 分鐘',
            ingredients: {
                '高麗菜': { amount: 300, unit: 'g' },
                '蒜頭': { amount: 3, unit: '瓣' },
                '油': { amount: 1, unit: '大匙' },
                '鹽': { amount: 0.5, unit: '小匙' }
            },
            steps: [
                '高麗菜洗淨撕成適口大小，蒜頭切末',
                '鍋中下油，小火爆香蒜末至金黃',
                '轉大火放入高麗菜快速翻炒',
                '加入鹽和少許水，蓋鍋悶 1 分鐘',
                '打開鍋蓋翻炒均勻，菜變軟即可起鍋'
            ],
            tips: '大火快炒才能保持脆度。可加入少許米酒提味。'
        },
        {
            name: '醬油炒飯',
            icon: '🍚',
            tags: ['快速', '家常', '主食'],
            difficulty: '簡單',
            time: '12 分鐘',
            ingredients: {
                '白飯': { amount: 2, unit: '碗' },
                '雞蛋': { amount: 2, unit: '顆' },
                '蔥': { amount: 2, unit: '根' },
                '醬油': { amount: 1.5, unit: '大匙' },
                '油': { amount: 2, unit: '大匙' },
                '鹽': { amount: 0.25, unit: '小匙' }
            },
            steps: [
                '蔥切蔥花（分蔥白和蔥綠），雞蛋打散',
                '鍋中下油燒至冒煙，倒入蛋液快速翻炒至半凝固',
                '立刻加入白飯，用鍋鏟將飯壓散翻炒均勻',
                '沿鍋邊淋入醬油，快速翻炒讓每粒飯都均勻上色',
                '加入蔥白翻炒出香氣，最後撒上蔥綠即完成'
            ],
            tips: '隔夜飯水分少，炒出來更粒粒分明。醬油沿鍋邊下會產生鍋氣。'
        },
        {
            name: '味噌湯',
            icon: '🥣',
            tags: ['日式', '湯品', '15分鐘'],
            difficulty: '簡單',
            time: '15 分鐘',
            ingredients: {
                '豆腐': { amount: 150, unit: 'g' },
                '味噌': { amount: 2, unit: '大匙' },
                '蔥': { amount: 1, unit: '根' },
                '水': { amount: 600, unit: 'ml' },
                '海帶芽': { amount: 5, unit: 'g' }
            },
            steps: [
                '豆腐切小丁（約 1.5cm），蔥切蔥花，海帶芽泡水備用',
                '鍋中加水煮滾',
                '放入豆腐丁，中火煮 2 分鐘',
                '轉小火，用濾網將味噌溶入湯中（避免直接倒入產生顆粒）',
                '加入海帶芽，輕輕攪拌均勻',
                '關火撒上蔥花即完成（味噌不可大滾，否則風味流失）'
            ],
            tips: '味噌加入後不要再大火煮沸，會破壞益生菌和風味。'
        },
        {
            name: '麻油煎蛋',
            icon: '🥚',
            tags: ['快速', '補身', '5分鐘'],
            difficulty: '簡單',
            time: '5 分鐘',
            ingredients: {
                '雞蛋': { amount: 2, unit: '顆' },
                '麻油': { amount: 1.5, unit: '大匙' },
                '薑': { amount: 3, unit: '片' },
                '鹽': { amount: 0.25, unit: '小匙' }
            },
            steps: [
                '薑切薄片',
                '鍋中倒入麻油，小火煸香薑片至邊緣微捲',
                '打入雞蛋，中小火煎至底部金黃',
                '翻面再煎 30 秒，撒少許鹽調味',
                '盛盤即可享用'
            ],
            tips: '麻油不耐高溫，全程用小火至中火避免苦味。'
        },
        {
            name: '蠔油豆腐',
            icon: '🫘',
            tags: ['素食', '下飯', '15分鐘'],
            difficulty: '簡單',
            time: '15 分鐘',
            ingredients: {
                '豆腐': { amount: 300, unit: 'g' },
                '蒜頭': { amount: 2, unit: '瓣' },
                '蔥': { amount: 1, unit: '根' },
                '蠔油': { amount: 1.5, unit: '大匙' },
                '醬油': { amount: 0.5, unit: '大匙' },
                '油': { amount: 2, unit: '大匙' },
                '水': { amount: 50, unit: 'ml' }
            },
            steps: [
                '豆腐切約 1cm 厚片，用廚房紙巾輕壓吸乾水分',
                '蒜頭切末，蔥切段',
                '鍋中下油，中火將豆腐煎至兩面金黃（每面約 2 分鐘）',
                '鍋邊下蒜末爆香',
                '加入蠔油、醬油和水，輕輕搖晃鍋子讓醬汁均勻',
                '小火燒至醬汁略收乾，放上蔥段即完成'
            ],
            tips: '豆腐先壓乾水分煎出來才會金黃酥脆。'
        },
        {
            name: '蒜苗炒肉絲',
            icon: '🥩',
            tags: ['家常', '下飯', '15分鐘'],
            difficulty: '中等',
            time: '15 分鐘',
            ingredients: {
                '豬肉': { amount: 200, unit: 'g' },
                '蒜苗': { amount: 2, unit: '根' },
                '蒜頭': { amount: 2, unit: '瓣' },
                '醬油': { amount: 1, unit: '大匙' },
                '米酒': { amount: 1, unit: '大匙' },
                '油': { amount: 1.5, unit: '大匙' },
                '鹽': { amount: 0.25, unit: '小匙' }
            },
            steps: [
                '豬肉切絲，加入醬油和米酒醃 5 分鐘',
                '蒜苗斜切段（蒜白蒜綠分開），蒜頭切末',
                '鍋中下油燒熱，先炒肉絲至變色盛出',
                '原鍋下蒜末和蒜白爆香',
                '放回肉絲，加入蒜綠翻炒均勻',
                '以少許鹽調味即可起鍋'
            ],
            tips: '肉絲先醃過再炒比較入味嫩口。蒜白先下、蒜綠後下，口感層次更好。'
        },
        {
            name: '滑蛋蝦仁',
            icon: '🦐',
            tags: ['海鮮', '宴客', '15分鐘'],
            difficulty: '中等',
            time: '15 分鐘',
            ingredients: {
                '蝦仁': { amount: 200, unit: 'g' },
                '雞蛋': { amount: 4, unit: '顆' },
                '蔥': { amount: 2, unit: '根' },
                '米酒': { amount: 1, unit: '大匙' },
                '鹽': { amount: 0.5, unit: '小匙' },
                '油': { amount: 2, unit: '大匙' }
            },
            steps: [
                '蝦仁去腸泥洗淨，用米酒和少許鹽醃 5 分鐘',
                '雞蛋打散加鹽拌勻，蔥切蔥花',
                '鍋中下油燒熱，先將蝦仁炒至變色（約 1 分鐘），盛出',
                '原鍋下少許油，倒入蛋液，用筷子快速劃圈攪拌',
                '蛋液半凝固時放入蝦仁和蔥花',
                '快速翻拌後立刻起鍋（利用餘溫讓蛋剛好全熟）'
            ],
            tips: '蛋液半熟時就放蝦仁，靠餘溫加熱才能做出滑嫩口感。'
        },
        {
            name: '金沙豆腐',
            icon: '✨',
            tags: ['下飯', '宴客', '20分鐘'],
            difficulty: '中等',
            time: '20 分鐘',
            ingredients: {
                '豆腐': { amount: 300, unit: 'g' },
                '鹹蛋': { amount: 2, unit: '顆' },
                '蒜頭': { amount: 2, unit: '瓣' },
                '蔥': { amount: 1, unit: '根' },
                '油': { amount: 3, unit: '大匙' }
            },
            steps: [
                '豆腐切塊擦乾，鹹蛋蛋白蛋黃分開，蛋黃壓碎成泥，蛋白切碎',
                '蒜頭切末，蔥切蔥花',
                '鍋中下較多油，中火將豆腐煎至六面金黃，盛出瀝油',
                '鍋留少許油，小火炒鹹蛋黃泥至起泡冒沙',
                '加入蒜末和鹹蛋白碎拌勻',
                '放入煎好的豆腐，輕輕翻拌讓金沙均勻裹上',
                '撒上蔥花即完成'
            ],
            tips: '鹹蛋黃小火慢炒才會起沙。豆腐壓乾水分煎出來更酥脆。'
        },
        {
            name: '咖哩雞肉飯',
            icon: '🍛',
            tags: ['主食', '一鍋料理', '30分鐘'],
            difficulty: '中等',
            time: '30 分鐘',
            ingredients: {
                '雞肉': { amount: 300, unit: 'g' },
                '馬鈴薯': { amount: 1, unit: '顆' },
                '紅蘿蔔': { amount: 1, unit: '根' },
                '洋蔥': { amount: 1, unit: '顆' },
                '咖哩塊': { amount: 50, unit: 'g' },
                '水': { amount: 500, unit: 'ml' },
                '油': { amount: 1, unit: '大匙' },
                '白飯': { amount: 2, unit: '碗' }
            },
            steps: [
                '雞肉切塊，馬鈴薯和紅蘿蔔去皮切滾刀塊，洋蔥切丁',
                '鍋中下油，中火炒香洋蔥至透明',
                '放入雞肉炒至表面變白',
                '加入馬鈴薯和紅蘿蔔翻炒 1 分鐘',
                '倒入水煮滾後轉小火，蓋鍋燉煮 15 分鐘（直到蔬菜軟透）',
                '關火，放入咖哩塊攪拌至完全融化',
                '再次開小火煮 3~5 分鐘至醬汁濃稠',
                '淋在白飯上即可享用'
            ],
            tips: '咖哩塊要關火後再加，避免結塊。放涼後再覆熱味道更濃郁。'
        },
        {
            name: '涼拌小黃瓜',
            icon: '🥒',
            tags: ['涼拌', '開胃', '10分鐘'],
            difficulty: '簡單',
            time: '10 分鐘',
            ingredients: {
                '小黃瓜': { amount: 2, unit: '條' },
                '蒜頭': { amount: 3, unit: '瓣' },
                '醬油': { amount: 1, unit: '大匙' },
                '醋': { amount: 1, unit: '大匙' },
                '糖': { amount: 0.5, unit: '小匙' },
                '麻油': { amount: 0.5, unit: '小匙' },
                '辣椒': { amount: 1, unit: '根' }
            },
            steps: [
                '小黃瓜洗淨，用刀面拍裂後切成小段',
                '蒜頭拍碎切末，辣椒切圈',
                '將醬油、醋、糖、麻油混合成醬汁',
                '黃瓜段放入碗中，加入蒜末和辣椒',
                '淋上醬汁拌勻',
                '冷藏 10 分鐘後更入味，即可上桌'
            ],
            tips: '用刀拍裂黃瓜更容易吸收醬汁。冰鎮後口感更好。'
        },
        {
            name: '蛋花湯',
            icon: '🥚',
            tags: ['湯品', '簡易', '10分鐘'],
            difficulty: '簡單',
            time: '10 分鐘',
            ingredients: {
                '雞蛋': { amount: 2, unit: '顆' },
                '蔥': { amount: 1, unit: '根' },
                '水': { amount: 500, unit: 'ml' },
                '鹽': { amount: 0.5, unit: '小匙' }
            },
            steps: [
                '雞蛋打散，蔥切蔥花',
                '鍋中加水煮滾',
                '加入鹽調味',
                '將蛋液慢慢倒入滾水中，邊倒邊用筷子輕輕劃圈',
                '蛋花浮起後關火，撒上蔥花即完成'
            ],
            tips: '蛋液要慢慢倒入並輕劃圈，蛋花才會漂亮細緻。可加入紫菜或番茄增加風味。'
        },
        {
            name: '三杯雞',
            icon: '🐔',
            tags: ['經典台菜', '下飯', '25分鐘'],
            difficulty: '中等',
            time: '25 分鐘',
            ingredients: {
                '雞肉': { amount: 400, unit: 'g' },
                '薑': { amount: 5, unit: '片' },
                '蒜頭': { amount: 6, unit: '瓣' },
                '九層塔': { amount: 1, unit: '把' },
                '醬油': { amount: 2, unit: '大匙' },
                '米酒': { amount: 2, unit: '大匙' },
                '麻油': { amount: 2, unit: '大匙' },
                '糖': { amount: 1, unit: '小匙' }
            },
            steps: [
                '雞肉切塊，薑切片，蒜頭拍扁不去皮',
                '鍋中下麻油，小火煸香薑片至邊緣金黃',
                '放入蒜頭炒香，再放入雞肉轉中大火翻炒至表面金黃',
                '倒入醬油和米酒，加糖拌勻',
                '蓋鍋轉中小火燜煮 12~15 分鐘，中途翻拌一次',
                '開蓋轉大火收汁至醬汁濃稠',
                '關火放入九層塔快速拌勻即完成'
            ],
            tips: '九層塔最後才放，利用餘溫拌勻即可，避免變黑。麻油全程不要大火。'
        },
        {
            name: '乾煎豬排',
            icon: '🥩',
            tags: ['主菜', '簡單', '15分鐘'],
            difficulty: '簡單',
            time: '15 分鐘',
            ingredients: {
                '豬肉': { amount: 250, unit: 'g' },
                '鹽': { amount: 0.5, unit: '小匙' },
                '黑胡椒': { amount: 0.25, unit: '小匙' },
                '油': { amount: 1, unit: '大匙' },
                '蒜頭': { amount: 2, unit: '瓣' }
            },
            steps: [
                '豬排用刀背輕敲鬆弛肉質，兩面撒上鹽和黑胡椒',
                '靜置 5 分鐘讓調味滲入',
                '鍋中下油燒熱，放入蒜瓣煸香',
                '放入豬排，中火煎 3~4 分鐘至底部金黃',
                '翻面再煎 3 分鐘至全熟',
                '起鍋靜置 2 分鐘後切片即可'
            ],
            tips: '煎的時候不要頻繁翻動，讓一面充分焦香再翻。靜置後肉汁回流更嫩。'
        },
        {
            name: '蛤蜊絲瓜湯',
            icon: '🐚',
            tags: ['湯品', '海鮮', '15分鐘'],
            difficulty: '簡單',
            time: '15 分鐘',
            ingredients: {
                '蛤蜊': { amount: 300, unit: 'g' },
                '絲瓜': { amount: 1, unit: '條' },
                '薑': { amount: 3, unit: '片' },
                '水': { amount: 600, unit: 'ml' },
                '鹽': { amount: 0.25, unit: '小匙' }
            },
            steps: [
                '蛤蜊泡鹽水吐沙 30 分鐘，絲瓜去皮切塊，薑切片',
                '鍋中加水和薑片煮滾',
                '放入絲瓜煮 3 分鐘至軟',
                '加入蛤蜊，蓋鍋煮至蛤蜊全部打開（約 2~3 分鐘）',
                '加少許鹽調味（蛤蜊本身有鹹味，少加即可）',
                '關火即可上桌'
            ],
            tips: '蛤蜊開口就要馬上關火，煮太久肉會縮。絲瓜本身會出水，水可以少放。'
        },
        {
            name: '糖醋排骨',
            icon: '🍖',
            tags: ['宴客', '經典', '30分鐘'],
            difficulty: '中等',
            time: '30 分鐘',
            ingredients: {
                '豬肉': { amount: 400, unit: 'g' },
                '蒜頭': { amount: 2, unit: '瓣' },
                '蔥': { amount: 1, unit: '根' },
                '醬油': { amount: 2, unit: '大匙' },
                '醋': { amount: 2, unit: '大匙' },
                '糖': { amount: 2, unit: '大匙' },
                '番茄醬': { amount: 1, unit: '大匙' },
                '水': { amount: 100, unit: 'ml' },
                '油': { amount: 3, unit: '大匙' }
            },
            steps: [
                '排骨切小塊洗淨，用醬油醃 10 分鐘',
                '蒜頭切末，蔥切段',
                '調糖醋醬汁：醋、糖、番茄醬、水混合備用',
                '鍋中下較多油，中火將排骨煎至兩面金黃',
                '下蒜末爆香',
                '倒入糖醋醬汁，蓋鍋中小火燜煮 10 分鐘',
                '開蓋轉中大火收汁至濃稠裹上排骨',
                '撒上蔥段即完成'
            ],
            tips: '糖醋比例可依口味調整（1:1 是基本比例）。排骨先煎再燜才會外酥內嫩。'
        }
    ];

    // 所有可選食材（從食譜庫提取 + 額外常見食材）
    const allIngredients = [];
    const ingredientSet = new Set();
    recipeDB.forEach(r => {
        Object.keys(r.ingredients).forEach(name => ingredientSet.add(name));
    });
    ingredientSet.forEach(name => allIngredients.push(name));
    allIngredients.sort();

    // 食材分類圖示
    const ingredientIcons = {
        '雞蛋': '🥚', '番茄': '🍅', '蔥': '🧅', '鹽': '🧂', '糖': '🍬', '油': '🫗',
        '高麗菜': '🥬', '蒜頭': '🧄', '白飯': '🍚', '醬油': '🫙', '豆腐': '🧈',
        '味噌': '🫕', '海帶芽': '🌿', '麻油': '🫗', '薑': '🫚', '蠔油': '🫙',
        '豬肉': '🥩', '蒜苗': '🌿', '米酒': '🍶', '蝦仁': '🦐', '鹹蛋': '🥚',
        '雞肉': '🍗', '馬鈴薯': '🥔', '紅蘿蔔': '🥕', '洋蔥': '🧅', '咖哩塊': '🟡',
        '水': '💧', '小黃瓜': '🥒', '醋': '🫙', '辣椒': '🌶️', '九層塔': '🌿',
        '黑胡椒': '🫙', '蛤蜊': '🐚', '絲瓜': '🥒', '番茄醬': '🫙'
    };

    container.innerHTML = `
        <div class="w-full max-w-2xl mx-auto font-sans">

            <!-- 標題區塊 -->
            <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%222%22 fill=%22white%22/%3E%3C/svg%3E'); background-size: 16px 16px;"></div>
                <div class="relative">
                    <h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                        <span class="text-3xl">🍽️</span> 食材推薦
                    </h3>
                    <p class="text-emerald-100 text-sm mt-1 opacity-90">選擇手邊有的食材，智能推薦可做的料理與完整做法</p>
                </div>
            </div>

            <!-- 人數設定 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="flex items-center justify-between">
                    <div class="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <span>👥</span> 用餐人數
                    </div>
                    <div class="flex items-center gap-3">
                        <button id="fr-ppl-minus" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 text-lg font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">−</button>
                        <span id="fr-ppl-display" class="text-3xl font-extrabold text-slate-800 w-8 text-center tabular-nums select-none">2</span>
                        <button id="fr-ppl-plus" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 text-lg font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">+</button>
                        <span class="text-sm text-slate-400 font-medium">人份</span>
                    </div>
                </div>
            </div>

            <!-- 食材選擇 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <span>🥘</span> 選擇你手邊有的食材
                    </div>
                    <button id="fr-clear-btn" class="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer transition">清除全部</button>
                </div>

                <!-- 已選食材標籤 -->
                <div id="fr-selected-tags" class="flex flex-wrap gap-2 mb-4 min-h-[36px] p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span class="text-xs text-slate-400 italic" id="fr-placeholder">👆 點選下方食材…</span>
                </div>

                <!-- 食材按鈕列表 -->
                <div id="fr-ingredient-grid" class="flex flex-wrap gap-1.5">
                </div>
            </div>

            <!-- 推薦結果 -->
            <div id="fr-results" class="space-y-4 mb-4">
                <div class="text-center py-12 text-slate-400">
                    <div class="text-5xl mb-3">🍳</div>
                    <p class="text-sm font-medium">選擇食材後，將自動推薦可做的料理</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        let servings = 2;
        const selectedIngredients = new Set();

        const pplDisplay = document.getElementById('fr-ppl-display');
        const selectedTags = document.getElementById('fr-selected-tags');
        const placeholder = document.getElementById('fr-placeholder');
        const ingredientGrid = document.getElementById('fr-ingredient-grid');
        const resultsDiv = document.getElementById('fr-results');

        // ===== 渲染食材按鈕 =====
        allIngredients.forEach(name => {
            const icon = ingredientIcons[name] || '🥄';
            const btn = document.createElement('button');
            btn.className = 'fr-ing-btn px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-pointer active:scale-95';
            btn.dataset.name = name;
            btn.innerHTML = `${icon} ${name}`;
            btn.addEventListener('click', () => toggleIngredient(name, btn));
            ingredientGrid.appendChild(btn);
        });

        // ===== 人數控制 =====
        document.getElementById('fr-ppl-minus').addEventListener('click', () => {
            if (servings > 1) { servings--; pplDisplay.textContent = servings; updateResults(); }
        });
        document.getElementById('fr-ppl-plus').addEventListener('click', () => {
            if (servings < 20) { servings++; pplDisplay.textContent = servings; updateResults(); }
        });

        // ===== 清除全部 =====
        document.getElementById('fr-clear-btn').addEventListener('click', () => {
            selectedIngredients.clear();
            document.querySelectorAll('.fr-ing-btn').forEach(b => {
                b.classList.remove('bg-emerald-100', 'border-emerald-400', 'text-emerald-800', 'ring-1', 'ring-emerald-300');
                b.classList.add('bg-white', 'border-slate-200', 'text-slate-600');
            });
            renderSelectedTags();
            updateResults();
        });

        // ===== 切換食材 =====
        function toggleIngredient(name, btn) {
            if (selectedIngredients.has(name)) {
                selectedIngredients.delete(name);
                btn.classList.remove('bg-emerald-100', 'border-emerald-400', 'text-emerald-800', 'ring-1', 'ring-emerald-300');
                btn.classList.add('bg-white', 'border-slate-200', 'text-slate-600');
            } else {
                selectedIngredients.add(name);
                btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-600');
                btn.classList.add('bg-emerald-100', 'border-emerald-400', 'text-emerald-800', 'ring-1', 'ring-emerald-300');
            }
            renderSelectedTags();
            updateResults();
        }

        // ===== 已選食材標籤列 =====
        function renderSelectedTags() {
            selectedTags.innerHTML = '';
            if (selectedIngredients.size === 0) {
                selectedTags.innerHTML = '<span class="text-xs text-slate-400 italic" id="fr-placeholder">👆 點選下方食材…</span>';
                return;
            }
            selectedIngredients.forEach(name => {
                const icon = ingredientIcons[name] || '🥄';
                const tag = document.createElement('span');
                tag.className = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-red-100 hover:text-red-600 hover:border-red-200 transition-all';
                tag.innerHTML = `${icon} ${name} <span class="text-emerald-400 hover:text-red-400 ml-0.5">✕</span>`;
                tag.title = '點擊移除';
                tag.addEventListener('click', () => {
                    selectedIngredients.delete(name);
                    const gridBtn = ingredientGrid.querySelector(`[data-name="${name}"]`);
                    if (gridBtn) {
                        gridBtn.classList.remove('bg-emerald-100', 'border-emerald-400', 'text-emerald-800', 'ring-1', 'ring-emerald-300');
                        gridBtn.classList.add('bg-white', 'border-slate-200', 'text-slate-600');
                    }
                    renderSelectedTags();
                    updateResults();
                });
                selectedTags.appendChild(tag);
            });
        }

        // ===== 推薦邏輯 =====
        function updateResults() {
            if (selectedIngredients.size === 0) {
                resultsDiv.innerHTML = `
                    <div class="text-center py-12 text-slate-400">
                        <div class="text-5xl mb-3">🍳</div>
                        <p class="text-sm font-medium">選擇食材後，將自動推薦可做的料理</p>
                    </div>`;
                return;
            }

            // 計算每道食譜的匹配率
            const scored = recipeDB.map(recipe => {
                const recipeIngs = Object.keys(recipe.ingredients);
                const matched = recipeIngs.filter(ing => selectedIngredients.has(ing));
                const matchRate = matched.length / recipeIngs.length;
                const missing = recipeIngs.filter(ing => !selectedIngredients.has(ing));
                return { ...recipe, matched, missing, matchRate, matchCount: matched.length };
            });

            // 過濾至少有一個材料匹配，按匹配率排序
            const filtered = scored
                .filter(r => r.matchCount > 0)
                .sort((a, b) => b.matchRate - a.matchRate || b.matchCount - a.matchCount);

            if (filtered.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="text-center py-12 text-slate-400">
                        <div class="text-5xl mb-3">🤔</div>
                        <p class="text-sm font-medium">目前選的食材組合暫無推薦</p>
                        <p class="text-xs mt-1">試試選擇更多不同的食材？</p>
                    </div>`;
                return;
            }

            // 基於 2 人份量的倍率
            const baseServings = 2;
            const ratio = servings / baseServings;

            let html = `<div class="text-sm font-bold text-slate-500 flex items-center gap-1.5 mb-2">
                <span>✨</span> 找到 ${filtered.length} 道推薦料理
            </div>`;

            filtered.forEach((recipe, idx) => {
                const matchPercent = Math.round(recipe.matchRate * 100);
                const isFullMatch = recipe.missing.length === 0;

                // 顏色系統
                let matchColor, matchBg, matchBorder, cardBorder;
                if (matchPercent === 100) {
                    matchColor = 'text-emerald-700'; matchBg = 'bg-emerald-100'; matchBorder = 'border-emerald-200'; cardBorder = 'border-emerald-300';
                } else if (matchPercent >= 60) {
                    matchColor = 'text-amber-700'; matchBg = 'bg-amber-100'; matchBorder = 'border-amber-200'; cardBorder = 'border-amber-200';
                } else {
                    matchColor = 'text-slate-600'; matchBg = 'bg-slate-100'; matchBorder = 'border-slate-200'; cardBorder = 'border-slate-200';
                }

                // 食材列表 with 份量換算
                let ingredientList = '';
                Object.entries(recipe.ingredients).forEach(([name, info]) => {
                    const scaledAmount = Math.round(info.amount * ratio * 100) / 100;
                    const displayAmount = Number.isInteger(scaledAmount) ? scaledAmount : scaledAmount.toFixed(1).replace(/\.0$/, '');
                    const isMatched = recipe.matched.includes(name);
                    const icon = ingredientIcons[name] || '🥄';
                    ingredientList += `
                        <div class="flex items-center gap-2 py-1.5 px-2 rounded-lg ${isMatched ? 'bg-emerald-50' : 'bg-red-50'}">
                            <span class="text-sm">${icon}</span>
                            <span class="text-sm ${isMatched ? 'text-emerald-700' : 'text-red-500'} font-medium flex-1">${name}</span>
                            <span class="text-sm font-bold ${isMatched ? 'text-emerald-800' : 'text-red-600'} tabular-nums">${displayAmount} ${info.unit}</span>
                            ${isMatched ? '<span class="text-xs text-emerald-500">✓</span>' : '<span class="text-xs text-red-400">缺</span>'}
                        </div>`;
                });

                // 步驟
                let stepsList = '';
                recipe.steps.forEach((step, i) => {
                    stepsList += `
                        <div class="flex gap-3 py-2">
                            <div class="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">${i + 1}</div>
                            <div class="text-sm text-slate-700 leading-relaxed">${step}</div>
                        </div>`;
                });

                // 標籤
                let tags = '';
                recipe.tags.forEach(tag => {
                    tags += `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">${tag}</span>`;
                });

                html += `
                <div class="bg-white rounded-2xl shadow-sm border-2 ${cardBorder} overflow-hidden transition-all" id="fr-recipe-${idx}">
                    <!-- 食譜標題列 -->
                    <button class="fr-recipe-toggle w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all text-left" data-idx="${idx}">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="text-3xl">${recipe.icon}</span>
                            <div class="min-w-0">
                                <div class="font-bold text-slate-800 text-base sm:text-lg truncate">${recipe.name}</div>
                                <div class="flex items-center gap-2 mt-1 flex-wrap">
                                    <span class="text-xs text-slate-400">⏱ ${recipe.time}</span>
                                    <span class="text-xs text-slate-400">📊 ${recipe.difficulty}</span>
                                    ${isFullMatch ? '<span class="text-xs font-bold text-emerald-600">✅ 食材齊全</span>' : `<span class="text-xs text-amber-600">缺 ${recipe.missing.length} 項</span>`}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 flex-shrink-0">
                            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${matchBg} ${matchColor} ${matchBorder} border tabular-nums">${matchPercent}%</span>
                            <svg class="fr-chevron-${idx} h-5 w-5 text-slate-400 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </button>

                    <!-- 展開內容 -->
                    <div id="fr-detail-${idx}" class="hidden border-t border-slate-100">
                        <div class="p-5">
                            <!-- 標籤 -->
                            <div class="flex flex-wrap gap-1.5 mb-4">${tags}</div>

                            <!-- 食材清單 -->
                            <div class="mb-5">
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>📋 食材清單（${servings} 人份）</span>
                                    <span class="text-emerald-600 normal-case">${recipe.matched.length}/${Object.keys(recipe.ingredients).length} 項已有</span>
                                </div>
                                <div class="space-y-1">${ingredientList}</div>
                            </div>

                            <!-- 做法步驟 -->
                            <div class="mb-4">
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">👨‍🍳 做法步驟</div>
                                <div class="space-y-0.5 bg-slate-50 rounded-xl p-4 border border-slate-100">${stepsList}</div>
                            </div>

                            <!-- 小提示 -->
                            ${recipe.tips ? `
                            <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <div class="text-xs font-bold text-amber-600 mb-1">💡 料理小技巧</div>
                                <p class="text-sm text-amber-800 leading-relaxed">${recipe.tips}</p>
                            </div>` : ''}
                        </div>
                    </div>
                </div>`;
            });

            resultsDiv.innerHTML = html;

            // 綁定展開/收合
            document.querySelectorAll('.fr-recipe-toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = btn.dataset.idx;
                    const detail = document.getElementById(`fr-detail-${idx}`);
                    const chevron = document.querySelector(`.fr-chevron-${idx}`);

                    if (detail.classList.contains('hidden')) {
                        detail.classList.remove('hidden');
                        detail.style.animation = 'fadeIn 0.3s ease';
                        chevron.style.transform = 'rotate(180deg)';
                    } else {
                        detail.classList.add('hidden');
                        chevron.style.transform = 'rotate(0deg)';
                    }
                });
            });

            // 自動展開第一個完全匹配的（如果有）或第一個
            if (filtered.length > 0) {
                const firstFull = filtered.findIndex(r => r.missing.length === 0);
                const autoExpandIdx = firstFull >= 0 ? firstFull : 0;
                const detail = document.getElementById(`fr-detail-${autoExpandIdx}`);
                const chevron = document.querySelector(`.fr-chevron-${autoExpandIdx}`);
                if (detail) {
                    detail.classList.remove('hidden');
                    chevron.style.transform = 'rotate(180deg)';
                }
            }
        }

    }, 0);
};
