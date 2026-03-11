window.render_bikeMap = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🚲 YouBike 2.0 站點預覽 (模擬)</h3>
            <div class="p-10 bg-slate-50 rounded-xl border border-dashed text-slate-400">
                點擊獲取定位以查看最近站點<br>(需要串接 Open Data API)
            </div>
            <button class="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg">獲取目前位置</button>
        </div>
    `;
};