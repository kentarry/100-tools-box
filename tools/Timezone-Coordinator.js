window.render_timezoneCoordinator = function () {
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('app-container');

    // 內建世界主要時區資料庫
    const worldTimezones = [
        { city: '東京', country: '日本', offset: 9, flag: '🇯🇵', color: 'pink' },
        { city: '首爾', country: '韓國', offset: 9, flag: '🇰🇷', color: 'purple' },
        { city: '曼谷', country: '泰國', offset: 7, flag: '🇹🇭', color: 'orange' },
        { city: '新加坡', country: '新加坡', offset: 8, flag: '🇸🇬', color: 'emerald' },
        { city: '雪梨', country: '澳洲', offset: 10, flag: '🇦🇺', color: 'sky' },
        { city: '杜拜', country: '阿聯酋', offset: 4, flag: '🇦🇪', color: 'amber' },
        { city: '巴黎', country: '法國', offset: 1, flag: '🇫🇷', color: 'blue' },
        { city: '倫敦', country: '英國', offset: 0, flag: '🇬🇧', color: 'indigo' },
        { city: '紐約', country: '美國', offset: -5, flag: '🇺🇸', color: 'rose' },
        { city: '洛杉磯', country: '美國', offset: -8, flag: '🇺🇸', color: 'fuchsia' },
        { city: '溫哥華', country: '加拿大', offset: -8, flag: '🇨🇦', color: 'red' },
        { city: '柏林', country: '德國', offset: 1, flag: '🇩🇪', color: 'yellow' },
        { city: '新德里', country: '印度', offset: 5.5, flag: '🇮🇳', color: 'orange' }
    ];

    targetContainer.innerHTML = `
        <style>
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        </style>

        <div class="w-full max-w-sm sm:max-w-md mx-auto bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out relative overflow-hidden group flex flex-col h-[650px] max-h-[85vh]">
            
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

            <div class="relative z-10 flex flex-col h-full">
                <div class="mb-4 shrink-0 text-center">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-xl font-bold text-slate-800 tracking-wide">🌍 全球會議協調</h3>
                        <span class="text-2xl animate-bounce cursor-default">🚀</span>
                    </div>
                    <p class="text-xs font-mono text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">
                        目前現實 (台北): <span id="realTimeDisplay" class="font-bold text-slate-700">載入中...</span>
                    </p>
                </div>
                
                <div class="p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg text-white mb-4 shrink-0 hover:-translate-y-1 transition-transform">
                    <div class="flex justify-between items-end mb-3">
                        <div>
                            <p class="text-xs font-bold text-indigo-300 mb-1">📍 台北 (基準協調時間)</p>
                            <p id="tzTDate" class="text-sm text-slate-400 font-mono">YYYY/MM/DD</p>
                        </div>
                        <p id="tzTVal" class="text-2xl font-bold font-mono text-white tracking-wider">14:00:00</p>
                    </div>
                    <input type="range" id="tzTaipei" min="0" max="23" value="" 
                        class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-400">
                </div>

                <div class="mb-3 shrink-0 relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-slate-400">🔍</span>
                    </div>
                    <input type="text" id="tzSearch" placeholder="搜尋國家或城市 (如: 紐約, 日本)" 
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all shadow-inner">
                </div>

                <div id="tzList" class="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar pb-2"></div>
            </div>
        </div>
    `;

    // 避免重複綁定 setInterval 導致效能問題
    if (window.tzInterval) clearInterval(window.tzInterval);

    setTimeout(() => {
        const slider = document.getElementById('tzTaipei');
        const searchInput = document.getElementById('tzSearch');
        const listContainer = document.getElementById('tzList');
        const realTimeDisplay = document.getElementById('realTimeDisplay');
        const tzTDateDisplay = document.getElementById('tzTDate');
        const tzTValDisplay = document.getElementById('tzTVal');

        if (!slider || !searchInput || !listContainer) return;

        // 取得強制以「台北 (UTC+8)」為基準的真實 Date 物件
        const getTaipeiNow = () => {
            const d = new Date();
            const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            return new Date(utc + (3600000 * 8));
        };

        // 初始化滑桿位置為當前小時
        slider.value = getTaipeiNow().getHours();

        // 數字補零輔助函數
        const pad = (num) => String(num).padStart(2, '0');
        const formatDate = (d) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
        const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

        const renderList = () => {
            const taipeiNow = getTaipeiNow();
            const query = searchInput.value.trim().toLowerCase();

            // 1. 更新頂部最真實的跳動時間
            realTimeDisplay.textContent = `${formatDate(taipeiNow)} ${formatTime(taipeiNow)}`;

            // 2. 計算「模擬」的台北時間 (套用滑桿的小時，但分秒吃現實)
            const simulatedTaipei = new Date(taipeiNow.getTime());
            simulatedTaipei.setHours(parseInt(slider.value));

            // 更新基準卡片顯示
            tzTDateDisplay.textContent = formatDate(simulatedTaipei);
            const tHour = simulatedTaipei.getHours();
            const tIcon = (tHour >= 6 && tHour < 18) ? "☀️" : "🌙";
            tzTValDisplay.textContent = `${tIcon} ${formatTime(simulatedTaipei)}`;

            // 3. 處理國家清單與時間對照
            const filteredData = worldTimezones.filter(tz =>
                tz.city.toLowerCase().includes(query) || tz.country.toLowerCase().includes(query)
            );

            listContainer.innerHTML = '';
            if (filteredData.length === 0) {
                listContainer.innerHTML = `<div class="text-center text-slate-400 py-6 text-sm">找不到符合的國家或城市 🥲</div>`;
                return;
            }

            // 用於計算「昨天/今天/明天」的純日期比較基準 (把時間歸零)
            const startOfDayTaipei = new Date(simulatedTaipei);
            startOfDayTaipei.setHours(0, 0, 0, 0);

            filteredData.forEach(tz => {
                // 計算目標國家的真實對應時間：先轉回 UTC，再加目標偏移量
                const utcTime = simulatedTaipei.getTime() - (3600000 * 8);
                const targetDate = new Date(utcTime + (3600000 * tz.offset));

                // 計算跨日邏輯 (安全比較日期差)
                const startOfDayTarget = new Date(targetDate);
                startOfDayTarget.setHours(0, 0, 0, 0);
                const diffDays = Math.round((startOfDayTarget - startOfDayTaipei) / (24 * 3600 * 1000));

                let dayBadge = '<span class="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">今天</span>';
                if (diffDays === -1) dayBadge = '<span class="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 font-bold">昨天</span>';
                if (diffDays === 1) dayBadge = '<span class="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 font-bold">明天</span>';

                const targetHour = targetDate.getHours();
                const icon = (targetHour >= 6 && targetHour < 18) ? "☀️" : "🌙";

                const cardHtml = `
                    <div class="p-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-slate-50 hover:bg-white border-slate-100 flex justify-between items-center group/card">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">${tz.flag}</span>
                            <div>
                                <p class="text-sm font-bold text-slate-700 group-hover/card:text-indigo-600 transition-colors">${tz.city}</p>
                                <p class="text-xs text-slate-400">${tz.country} (UTC${tz.offset >= 0 ? '+' : ''}${tz.offset})</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-mono text-slate-400 mb-0.5">${pad(targetDate.getMonth() + 1)}/${pad(targetDate.getDate())} ${dayBadge}</p>
                            <p class="text-lg font-bold font-mono text-slate-800 tracking-tight">${icon} ${formatTime(targetDate)}</p>
                        </div>
                    </div>
                `;
                listContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        };

        // 綁定事件
        slider.addEventListener('input', renderList);
        searchInput.addEventListener('input', renderList);

        // 啟動時鐘：每秒自動更新畫面，達到吃現實分秒的效果
        renderList();
        window.tzInterval = setInterval(renderList, 1000);
    }, 0);
};
