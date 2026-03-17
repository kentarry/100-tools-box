window.render_screenInfo = function () {
    // 假設你的外層有一個 id 為 container 的元素，如果沒有請自行調整選取器
    const elContainer = typeof container !== 'undefined' ? container : document.getElementById('container');
    
    // 如果之前有綁定過 resize 事件，先解除綁定，避免在 100 個工具間切換時造成 Memory Leak
    if (window._screenInfoResizeHandler) {
        window.removeEventListener('resize', window._screenInfoResizeHandler);
    }

    // 更新畫面的主函數
    const updateUI = () => {
        // 計算硬體真實解析度 (邏輯解析度 x 裝置像素比)
        const physicalWidth = Math.round(window.screen.width * window.devicePixelRatio);
        const physicalHeight = Math.round(window.screen.height * window.devicePixelRatio);
        
        // 判斷螢幕方向 (支援手機翻轉)
        const orientationType = (window.screen.orientation || {}).type || '';
        const isPortrait = orientationType.includes('portrait') || window.innerHeight > window.innerWidth;
        const orientationText = isPortrait ? '直向 (Portrait)' : '橫向 (Landscape)';

        // 計算色彩支援度
        const colorsSupported = Math.pow(2, window.screen.colorDepth);
        const formatColors = colorsSupported > 1000000 
            ? `${Math.round(colorsSupported / 1000000)}00 萬色` 
            : `${colorsSupported.toLocaleString()} 色`;

        elContainer.innerHTML = `
            <div class="w-full max-w-lg mx-auto bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200 text-left font-sans">
                
                <div class="flex items-center justify-between mb-5 border-b pb-3">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span>🖥️</span> 螢幕與視窗參數檢測
                    </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    
                    <div class="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <p class="text-xs text-gray-500 mb-1">📏 邏輯解析度 (CSS)</p>
                        <p class="font-bold text-xl text-gray-800">${window.screen.width} × ${window.screen.height}</p>
                        <p class="text-[11px] text-gray-400 mt-1">網頁排版基準大小</p>
                    </div>

                    <div class="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <p class="text-xs text-gray-500 mb-1">🔍 實體解析度 (硬體)</p>
                        <p class="font-bold text-xl text-gray-800">${physicalWidth} × ${physicalHeight}</p>
                        <p class="text-[11px] text-gray-400 mt-1">螢幕真實發光點數量</p>
                    </div>

                    <div class="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-2 h-full bg-blue-400"></div>
                        <p class="text-xs text-blue-600 mb-1 font-medium">🪟 瀏覽器當前視窗</p>
                        <p class="font-bold text-xl text-blue-800">${window.innerWidth} × ${window.innerHeight}</p>
                        <p class="text-[11px] text-blue-500 mt-1">縮放視窗會即時改變</p>
                    </div>

                    <div class="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <p class="text-xs text-gray-500 mb-1">✨ 裝置像素比 (DPR)</p>
                        <p class="font-bold text-xl text-gray-800">${window.devicePixelRatio}</p>
                        <p class="text-[11px] text-gray-400 mt-1">1 單位包含 ${window.devicePixelRatio} 個實體像素</p>
                    </div>

                    <div class="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <p class="text-xs text-gray-500 mb-1">📱 螢幕方向</p>
                        <p class="font-bold text-lg text-gray-800 mt-1">${orientationText}</p>
                    </div>

                    <div class="p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <p class="text-xs text-gray-500 mb-1">🎨 色彩深度</p>
                        <p class="font-bold text-xl text-gray-800">${window.screen.colorDepth}-bit</p>
                        <p class="text-[11px] text-gray-400 mt-1">支援約 ${formatColors}</p>
                    </div>
                </div>

                <div class="mt-5 pt-3 border-t text-center sm:text-left">
                    <p class="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                        <span>💡</span> 提示：試著縮放瀏覽器視窗或旋轉手機，數據會自動更新。
                    </p>
                </div>
            </div>
        `;
    };

    // 初次渲染
    updateUI();

    // 將更新函數掛載到 window 以便後續清理
    window._screenInfoResizeHandler = updateUI;
    // 監聽視窗變化，即時更新數據
    window.addEventListener('resize', window._screenInfoResizeHandler);
};
