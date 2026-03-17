window.render_blueLightFilter = function () {
    // 確保 container 存在，若你的主程式有定義 container 變數，請保持原樣
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('app');

    targetContainer.innerHTML = `
        <div class="max-w-md w-full mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-5 font-sans">
            <div class="text-center">
                <h3 class="text-xl font-bold text-gray-800 mb-1">🌙 護眼濾藍光預覽器</h3>
                <p class="text-sm text-gray-500">調整下方拉桿，體驗不同程度的濾藍光效果</p>
            </div>

            <div class="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span class="text-gray-500 text-sm font-medium">弱</span>
                <input 
                    type="range" 
                    id="blRange" 
                    min="0" 
                    max="80" 
                    value="0" 
                    class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                <span class="text-gray-500 text-sm font-medium">強</span>
                <span id="blValue" class="text-orange-600 font-mono font-bold w-10 text-right">0%</span>
            </div>

            <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-inner">
                <div class="p-6">
                    <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        📰 網頁內容預覽
                    </h4>
                    <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                        這是一個模擬網頁的區塊。當您調整上方的護眼濾鏡強度時，可以觀察這段文字與按鈕顏色的變化。適當的暖色調有助於減輕夜間閱讀的眼睛疲勞，特別是在低光源環境下。
                    </p>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">藍色按鈕</button>
                        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">一般按鈕</button>
                    </div>
                </div>
                
                <div 
                    id="blOverlay" 
                    class="absolute inset-0 pointer-events-none transition-colors duration-100 mix-blend-multiply" 
                    style="background-color: rgba(255, 160, 0, 0);"
                ></div>
            </div>
        </div>
    `;

    // 綁定事件：使用 requestAnimationFrame 確保 DOM 已經渲染完成
    requestAnimationFrame(() => {
        const slider = document.getElementById('blRange');
        const overlay = document.getElementById('blOverlay');
        const valueDisplay = document.getElementById('blValue');

        if (slider && overlay && valueDisplay) {
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                // 更新數字顯示
                valueDisplay.textContent = `${val}%`;
                // 轉換數值為透明度 (將最大值限制在 0.8 以免畫面過暗)
                const alpha = (val / 100).toFixed(2);
                // 使用偏橘黃的暖色調來模擬濾藍光
                overlay.style.backgroundColor = `rgba(255, 160, 0, ${alpha})`;
            });
        }
    });
};
