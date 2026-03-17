window.render_customsTracker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-2">📦 海外網購免稅額紀錄</h3>
            <p class="text-xs text-slate-400 mb-4">半年內超過 6 次或單筆超過 2000 元即課稅。</p>
            <div class="flex gap-2 mb-4">
                <button id="addOrder" class="flex-1 py-2 bg-slate-800 text-white rounded-lg text-sm">+ 新增一筆紀錄</button>
            </div>
            <div id="orderCount" class="text-center p-4 bg-blue-50 rounded-xl font-bold text-blue-700 mb-2">已使用額度: 0 / 6</div>
        </div>
    `;
};
