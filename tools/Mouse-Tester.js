window.render_mouseTester = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl border text-center">
            <h3 class="font-bold mb-2">🖱️ 滑鼠連點/雙擊測試</h3>
            <p class="text-xs text-slate-400 mb-6">檢查滑鼠微動開關是否發生「點一下變兩下」的故障。</p>
            <div id="clickArea" class="w-full h-48 bg-slate-100 border-4 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer select-none active:bg-slate-200 transition">
                <span class="text-slate-400 font-bold">請在此快速點擊</span>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-3 rounded-lg"><p class="text-xs">總點擊</p><p id="clickTotal" class="text-2xl font-bold">0</p></div>
                <div class="bg-rose-50 p-3 rounded-lg"><p class="text-xs text-rose-600 font-bold">異常雙擊</p><p id="clickDouble" class="text-2xl font-bold text-rose-600">0</p></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        let lastClick = 0, total = 0, dub = 0;
        document.getElementById('clickArea').onmousedown = () => {
            const now = Date.now();
            total++;
            if (now - lastClick < 50) dub++; // 若點擊間隔小於 50ms 判斷為異常雙擊
            lastClick = now;
            document.getElementById('clickTotal').textContent = total;
            document.getElementById('clickDouble').textContent = dub;
        };
    }, 0);
};