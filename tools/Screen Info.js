window.render_screenInfo = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🖥️ 螢幕參數檢測</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl"><p class="text-xs">解析度</p><p class="font-bold text-xl">${window.screen.width}x${window.screen.height}</p></div>
                <div class="p-4 bg-slate-50 rounded-xl"><p class="text-xs">色彩深度</p><p class="font-bold text-xl">${window.screen.colorDepth}-bit</p></div>
                <div class="p-4 bg-slate-50 rounded-xl"><p class="text-xs">裝置像素比</p><p class="font-bold text-xl">${window.devicePixelRatio}</p></div>
                <div class="p-4 bg-slate-50 rounded-xl"><p class="text-xs">瀏覽器視窗</p><p class="font-bold text-xl">${window.innerWidth}x${window.innerHeight}</p></div>
            </div>
        </div>
    `;
};