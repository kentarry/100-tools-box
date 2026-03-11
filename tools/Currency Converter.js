window.render_currencyConverter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">💱 即時匯率換算 (匯率僅供參考)</h3>
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <input type="number" id="curVal" value="1" class="flex-1 p-3 border rounded-xl text-2xl font-bold">
                    <select id="curFrom" class="p-3 border rounded-xl font-bold"><option>TWD</option><option>USD</option><option>JPY</option><option>EUR</option></select>
                </div>
                <div class="text-slate-400">⬇️ 轉換為 ⬇️</div>
                <div class="flex items-center gap-2">
                    <div id="curResult" class="flex-1 p-3 bg-slate-50 border rounded-xl text-2xl font-bold text-emerald-600">0</div>
                    <select id="curTo" class="p-3 border rounded-xl font-bold"><option>JPY</option><option>TWD</option><option>USD</option><option>EUR</option></select>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const rates = { TWD: 1, USD: 32.5, JPY: 0.21, EUR: 35.1 }; // 模擬匯率
        function convert() {
            const val = document.getElementById('curVal').value;
            const from = document.getElementById('curFrom').value;
            const to = document.getElementById('curTo').value;
            const res = (val * rates[from]) / rates[to];
            document.getElementById('curResult').textContent = res.toFixed(2);
        }
        document.querySelectorAll('input, select').forEach(el => el.oninput = convert);
        convert();
    }, 0);
};