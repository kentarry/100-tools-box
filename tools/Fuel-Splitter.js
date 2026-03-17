window.render_fuelSplitter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">⛽ 自駕油資分攤</h3>
            <div class="space-y-3 text-sm">
                <div><label>行駛里程 (km)</label><input type="number" id="fuelDist" value="100" class="w-full p-2 border rounded"></div>
                <div><label>平均油耗 (km/L)</label><input type="number" id="fuelEff" value="12" class="w-full p-2 border rounded"></div>
                <div><label>目前油價 (元/L)</label><input type="number" id="fuelPrice" value="30" class="w-full p-2 border rounded"></div>
                <div class="pt-4 border-t">
                    <p class="font-bold text-slate-700">總油錢預估：<span id="fuelTotal" class="text-blue-600">250</span> 元</p>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const d = document.getElementById('fuelDist').value;
            const e = document.getElementById('fuelEff').value;
            const p = document.getElementById('fuelPrice').value;
            document.getElementById('fuelTotal').textContent = Math.round((d / e) * p);
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
    }, 0);
};