window.render_plantTracker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-emerald-100">
            <h3 class="font-bold mb-4 text-emerald-700">🪴 植物澆水日誌</h3>
            <div id="plantItems" class="space-y-3">
                <div class="p-4 bg-emerald-50 rounded-xl flex justify-between items-center">
                    <div><p class="font-bold">多肉植物</p><p class="text-xs text-emerald-600">上次：2024/03/01</p></div>
                    <button class="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full">點擊澆水</button>
                </div>
            </div>
        </div>
    `;
};