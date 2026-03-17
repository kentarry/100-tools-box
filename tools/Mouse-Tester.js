window.render_mouseTester = function (containerId) {
    // 支援傳入特定 ID，若無則預設使用全域 container，避免影響其他 99 個工具
    const targetContainer = typeof containerId === 'string' ? document.getElementById(containerId) : (typeof container !== 'undefined' ? container : document.getElementById('container'));

    if (!targetContainer) {
        console.error("滑鼠測試器錯誤：找不到容器元素");
        return;
    }

    targetContainer.innerHTML = `
        <div class="w-full max-w-lg mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-center transition-all">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 2v6"/></svg>
                    滑鼠連點/雙擊測試
                </h3>
                <button id="resetMouseTest" class="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-full transition-colors font-medium">
                    重新測試
                </button>
            </div>
            
            <p class="text-xs sm:text-sm text-slate-500 mb-5 text-left leading-relaxed">
                檢查滑鼠微動開關是否老化發生「點一下變兩下」的故障。支援左鍵、中鍵、右鍵測試。<br>
                <span class="text-rose-500 font-medium">* 若同一個按鍵兩次點擊間隔小於 80 毫秒，將判定為硬體異常。</span>
            </p>

            <div id="clickArea"
                 class="w-full h-40 sm:h-48 bg-slate-50 border-4 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-crosshair select-none transition-colors relative overflow-hidden group">
                <span class="text-slate-500 font-bold text-lg pointer-events-none mb-1 group-active:scale-95 transition-transform">請在此區域快速點擊</span>
                <span id="lastAction" class="text-xs text-slate-400 pointer-events-none">等待測試...</span>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                <div class="bg-blue-50 p-3 sm:p-4 rounded-xl shadow-inner border border-blue-100">
                    <p class="text-[10px] sm:text-xs text-blue-600 mb-1 font-medium">總點擊</p>
                    <p id="clickTotal" class="text-xl sm:text-2xl font-bold text-blue-700">0</p>
                </div>
                <div class="bg-emerald-50 p-3 sm:p-4 rounded-xl shadow-inner border border-emerald-100">
                    <p class="text-[10px] sm:text-xs text-emerald-600 mb-1 font-medium">正常點擊</p>
                    <p id="clickNormal" class="text-xl sm:text-2xl font-bold text-emerald-700">0</p>
                </div>
                <div class="bg-rose-50 p-3 sm:p-4 rounded-xl shadow-inner border border-rose-100">
                    <p class="text-[10px] sm:text-xs text-rose-600 font-bold mb-1">異常連點</p>
                    <p id="clickDouble" class="text-xl sm:text-2xl font-bold text-rose-700">0</p>
                </div>
            </div>
        </div>
    `;

    // 確保 DOM 已經渲染完成後再綁定事件
    setTimeout(() => {
        let stats = { total: 0, normal: 0, abnormal: 0 };
        // 獨立紀錄左(0)、中(1)、右(2)鍵的最後點擊時間
        let lastClicks = { 0: 0, 1: 0, 2: 0 };
        const THRESHOLD = 80; // 判定為微動異常的毫秒數

        const clickArea = document.getElementById('clickArea');
        const elTotal = document.getElementById('clickTotal');
        const elNormal = document.getElementById('clickNormal');
        const elDouble = document.getElementById('clickDouble');
        const elLastAction = document.getElementById('lastAction');
        const btnReset = document.getElementById('resetMouseTest');

        // 阻擋測試區域的右鍵選單，確保可以測試右鍵微動開關
        clickArea.addEventListener('contextmenu', (e) => e.preventDefault());

        // 核心點擊邏輯
        clickArea.addEventListener('mousedown', (e) => {
            e.preventDefault(); // 防止選取文字

            const now = Date.now();
            const btnCode = e.button;
            let btnName = "未知鍵";

            if (btnCode === 0) btnName = "左鍵";
            else if (btnCode === 1) btnName = "中鍵";
            else if (btnCode === 2) btnName = "右鍵";
            else btnName = `側鍵`;

            stats.total++;
            const timeDiff = now - lastClicks[btnCode];

            // 判斷是否為異常連點 (排除第一次點擊 lastClicks === 0 的狀況)
            if (lastClicks[btnCode] !== 0 && timeDiff < THRESHOLD) {
                stats.abnormal++;
                elLastAction.innerHTML = `<span class="text-rose-500 font-bold">⚠️ ${btnName} 異常連點！(間隔 ${timeDiff}ms)</span>`;

                // 視覺回饋：紅框閃爍
                clickArea.className = "w-full h-40 sm:h-48 bg-rose-50 border-4 border-dashed border-rose-500 rounded-2xl flex flex-col items-center justify-center cursor-crosshair select-none relative overflow-hidden group";
            } else {
                stats.normal++;
                elLastAction.innerHTML = `<span class="text-emerald-600">${btnName} 觸發成功</span>`;

                // 視覺回饋：綠框閃爍
                clickArea.className = "w-full h-40 sm:h-48 bg-emerald-50 border-4 border-dashed border-emerald-400 rounded-2xl flex flex-col items-center justify-center cursor-crosshair select-none relative overflow-hidden group";
            }

            // 更新最後點擊時間
            lastClicks[btnCode] = now;

            // 短暫延遲後恢復原始外觀
            setTimeout(() => {
                clickArea.className = "w-full h-40 sm:h-48 bg-slate-50 border-4 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-crosshair select-none transition-colors duration-300 relative overflow-hidden group";
            }, 150);

            // 更新畫面數字
            elTotal.textContent = stats.total;
            elNormal.textContent = stats.normal;
            elDouble.textContent = stats.abnormal;
        });

        // 綁定重新測試按鈕
        btnReset.addEventListener('click', () => {
            stats = { total: 0, normal: 0, abnormal: 0 };
            lastClicks = { 0: 0, 1: 0, 2: 0 };
            elTotal.textContent = '0';
            elNormal.textContent = '0';
            elDouble.textContent = '0';
            elLastAction.innerHTML = '等待測試...';
        });

    }, 0);
};
