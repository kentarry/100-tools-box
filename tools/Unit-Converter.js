window.render_unitConverter = function (containerElement) {
    // 1. 確保容器存在 (支援外部傳入參數，或退回尋找全域 container)
    const targetContainer = containerElement || (typeof container !== 'undefined' ? container : document.getElementById('container'));
    if (!targetContainer) {
        console.error('[UnitConverter] 找不到渲染容器');
        return;
    }

    // 2. 渲染 UI (加入響應式設計、單位後綴、轉換符號與聚焦效果)
    targetContainer.innerHTML = `
        <div class="max-w-md w-full mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <h3 class="text-lg font-bold mb-1 text-gray-800">房屋面積換算</h3>
            <p class="text-xs text-gray-400 mb-6">坪數與平方公尺 (m²) 雙向轉換</p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div class="w-full relative">
                    <label class="text-sm font-medium text-gray-600 block mb-2 text-left sm:text-center">台灣坪數</label>
                    <div class="relative">
                        <input type="number" id="unitPing" placeholder="0" min="0" 
                            class="w-full p-3 pr-10 border rounded-xl text-center text-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all">
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none pointer-events-none">坪</span>
                    </div>
                </div>

                <div class="text-gray-300 font-bold text-xl hidden sm:block pt-6">⇄</div>
                <div class="text-gray-300 font-bold text-xl sm:hidden">⇅</div>

                <div class="w-full relative">
                    <label class="text-sm font-medium text-gray-600 block mb-2 text-left sm:text-center">平方公尺</label>
                    <div class="relative">
                        <input type="number" id="unitM2" placeholder="0" min="0" 
                            class="w-full p-3 pr-10 border rounded-xl text-center text-xl font-bold text-gray-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all">
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none pointer-events-none">m²</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 3. 綁定邏輯 (innerHTML 是同步執行的，因此不需依賴 setTimeout)
    const inputPing = document.getElementById('unitPing');
    const inputM2 = document.getElementById('unitM2');
    const RATE = 3.305785; // 法定 1 平方公尺 = 0.3025 坪，因此 1 坪 = 1/0.3025 ≈ 3.305785 平方公尺

    const handleConversion = (sourceInput, targetInput, isPingToM2) => {
        // 防呆：如果清空輸入框，另一邊也清空
        if (sourceInput.value.trim() === '') {
            targetInput.value = '';
            return;
        }

        const value = parseFloat(sourceInput.value);
        if (isNaN(value) || value < 0) return;

        const result = isPingToM2 ? (value * RATE) : (value / RATE);

        // 使用 Math.round 保留小數點後兩位，並避免浮點數誤差 (例如 3.30000000001)
        targetInput.value = Math.round(result * 100) / 100;
    };

    // 使用 addEventListener 取代 oninput，更符合現代規範與模組化安全
    inputPing.addEventListener('input', () => handleConversion(inputPing, inputM2, true));
    inputM2.addEventListener('input', () => handleConversion(inputM2, inputPing, false));
};
