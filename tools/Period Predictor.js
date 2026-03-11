window.render_periodPredictor = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4 text-rose-500 flex items-center">🌸 生理期預測 (純本機儲存)</h3>
            <div class="space-y-4 text-sm">
                <div>
                    <label class="block mb-1 font-bold text-slate-600">上次經期開始日</label>
                    <input type="date" id="lastPeriod" class="w-full p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block mb-1 font-bold text-slate-600">平均週期 (天)</label>
                    <input type="number" id="periodCycle" value="28" class="w-full p-2 border rounded-lg">
                </div>
                <button id="calcPeriod" class="w-full py-3 bg-rose-400 text-white font-bold rounded-xl hover:bg-rose-500 transition">開始推算</button>
            </div>
            <div id="periodResult" class="hidden mt-6 space-y-3">
                <div class="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-center">
                    預計下次經期：<span id="nextPeriodDate" class="font-black"></span>
                </div>
                <div class="p-3 bg-orange-50 border border-orange-100 rounded-lg text-orange-700 text-center">
                    預計排卵日 (易受孕)：<span id="ovulationDate" class="font-black"></span>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('calcPeriod').onclick = () => {
            const start = new Date(document.getElementById('lastPeriod').value);
            const cycle = parseInt(document.getElementById('periodCycle').value);
            if (isNaN(start.getTime())) return alert('請選擇日期');

            const next = new Date(start);
            next.setDate(start.getDate() + cycle);
            const ovul = new Date(next);
            ovul.setDate(next.getDate() - 14);

            document.getElementById('nextPeriodDate').textContent = next.toLocaleDateString();
            document.getElementById('ovulationDate').textContent = ovul.toLocaleDateString();
            document.getElementById('periodResult').classList.remove('hidden');
        };
    }, 0);
};