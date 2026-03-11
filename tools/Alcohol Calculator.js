window.render_alcoholCalculator = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-amber-200">
            <h3 class="font-bold mb-2">🍺 酒精代謝預估器</h3>
            <p class="text-xs text-slate-400 mb-4 font-bold text-rose-500">※ 僅供參考，請勿飲酒過量，酒後不開車。</p>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-2">
                    <div><label class="text-xs">體重 (kg)</label><input type="number" id="alcWeight" value="70" class="w-full p-2 border rounded"></div>
                    <div><label class="text-xs">酒精濃度 (%)</label><input type="number" id="alcPercent" value="5" class="w-full p-2 border rounded"></div>
                </div>
                <div><label class="text-xs">飲用量 (ml)</label><input type="number" id="alcAmount" value="500" class="w-full p-2 border rounded"></div>
                <div class="p-4 bg-amber-50 rounded-xl text-center">
                    <p class="text-xs text-amber-600">預計完全代謝所需時間</p>
                    <p id="alcTime" class="text-2xl font-black text-amber-800">0 小時</p>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const w = document.getElementById('alcWeight').value;
            const p = document.getElementById('alcPercent').value / 100;
            const a = document.getElementById('alcAmount').value;
            // 簡易公式：(ml * %) / (體重 * 0.1)
            const hours = (a * p) / (w * 0.1);
            document.getElementById('alcTime').textContent = hours.toFixed(1) + ' 小時';
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
        calc();
    }, 0);
};