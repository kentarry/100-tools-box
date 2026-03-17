window.render_keyboardTester = function (container) {
    // 確保有傳入容器，若無則嘗試抓取預設容器
    const targetContainer = container || document.getElementById('tool-container');
    if (!targetContainer) return console.error('找不到工具渲染容器');

    targetContainer.innerHTML = `
        <div id="keyboard-test-area" tabindex="0" class="w-full max-w-3xl mx-auto bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer group relative overflow-hidden">
            
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-focus:bg-emerald-500/20 transition-all duration-500"></div>

            <div class="relative z-10 w-full flex flex-col items-center">
                <h3 class="text-white text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                    ⌨️ 鍵盤防鬼鍵測試 (NKRO / Ghosting)
                </h3>
                <p class="text-slate-400 text-sm mb-6 text-center max-w-md transition-colors group-focus:text-slate-300">
                    請<span class="text-emerald-400 font-bold">點擊此區塊</span>以啟用測試。<br class="hidden sm:block">
                    啟用後按下鍵盤上的多個按鍵，下方將即時顯示同時觸發的按鍵數與鍵碼。
                </p>

                <div class="flex items-center justify-center gap-4 mb-6 w-full">
                    <div class="px-6 py-3 bg-slate-800/80 rounded-xl border border-slate-700 w-full sm:w-1/2 text-center shadow-inner">
                        <span class="text-slate-500 text-xs sm:text-sm block mb-1 font-medium tracking-wider">同時觸發按鍵數 (KRO)</span>
                        <span id="keyCount" class="text-4xl font-black text-emerald-400 tabular-nums">0</span>
                    </div>
                </div>

                <div id="keyDisplay" class="flex flex-wrap gap-2 sm:gap-3 justify-center items-center min-h-[120px] w-full p-4 sm:p-6 bg-slate-950/50 rounded-xl border border-slate-700/50 shadow-inner">
                    <div class="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm animate-pulse">點擊上方區塊開始輸入...</div>
                </div>
            </div>
        </div>
    `;

    // 延遲執行以確保 DOM 已渲染
    setTimeout(() => {
        const testArea = targetContainer.querySelector('#keyboard-test-area');
        const display = targetContainer.querySelector('#keyDisplay');
        const countDisplay = targetContainer.querySelector('#keyCount');
        const pressedKeys = new Set();

        // 更新介面函數
        const updateUI = () => {
            countDisplay.textContent = pressedKeys.size;

            // 變更計數器顏色以提供視覺回饋 (超過 6 鍵變色，超過 10 鍵再變色)
            if (pressedKeys.size >= 10) {
                countDisplay.className = "text-4xl font-black text-purple-400 tabular-nums drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]";
            } else if (pressedKeys.size >= 6) {
                countDisplay.className = "text-4xl font-black text-blue-400 tabular-nums drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]";
            } else {
                countDisplay.className = "text-4xl font-black text-emerald-400 tabular-nums drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]";
            }

            if (pressedKeys.size === 0) {
                display.innerHTML = '<div class="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm transition-all">等待輸入...</div>';
                return;
            }

            display.innerHTML = '';
            pressedKeys.forEach(code => {
                const div = document.createElement('div');
                // 移除過於干擾的 animate-bounce，改用微幅放大與漸變效果
                div.className = "px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600 text-white font-mono text-sm sm:text-base font-bold rounded-lg shadow-md transform scale-100 animate-[pop_0.1s_ease-out]";
                div.textContent = code.replace('Key', '').replace('Digit', ''); // 簡化鍵碼顯示，例如 'KeyA' 變成 'A'
                display.appendChild(div);
            });
        };

        // 事件監聽器：按下按鍵
        const handleKeyDown = (e) => {
            e.preventDefault(); // 防止空白鍵、方向鍵捲動網頁
            if (!pressedKeys.has(e.code)) {
                pressedKeys.add(e.code);
                updateUI();
            }
        };

        // 事件監聽器：釋放按鍵
        const handleKeyUp = (e) => {
            e.preventDefault();
            pressedKeys.delete(e.code);
            updateUI();
        };

        // 事件監聽器：失去焦點時清除按鍵狀態 (防止防鬼鍵卡死)
        const handleBlur = () => {
            pressedKeys.clear();
            updateUI();
        };

        // 綁定事件至特定區塊，而非全域 window
        testArea.addEventListener('keydown', handleKeyDown);
        testArea.addEventListener('keyup', handleKeyUp);
        testArea.addEventListener('blur', handleBlur);

        // 如果你的單頁應用 (SPA) 有卸載工具的機制，請確保移除監聽器以防記憶體洩漏
        // targetContainer.unmount = () => {
        //     testArea.removeEventListener('keydown', handleKeyDown); ...
        // };

        // 寫入自訂動畫 (如果你的 Tailwind 沒有設定這個 keyframe)
        if (!document.getElementById('keyboard-tester-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-tester-styles';
            style.innerHTML = `
                @keyframes pop {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }, 0);
};
