window.render_healthCalc = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">🥗 體脂與熱量 (TDEE) 計算</h3>
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><label>身高 (cm)</label><input type="number" id="hHeight" value="170" class="w-full p-2 border rounded"></div>
                <div><label>體重 (kg)</label><input type="number" id="hWeight" value="65" class="w-full p-2 border rounded"></div>
            </div>
            <div class="p-4 bg-slate-900 text-white rounded-2xl text-center">
                <p class="text-xs text-slate-400">每日維持體重所需熱量</p>
                <p id="hTdee" class="text-3xl font-black">2100 kcal</p>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const h = document.getElementById('hHeight').value, w = document.getElementById('hWeight').value;
            const bmr = 10 * w + 6.25 * h - 5 * 25 + 5; // 簡化版公式
            document.getElementById('hTdee').textContent = Math.round(bmr * 1.375) + ' kcal';
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
        calc();
    }, 0);
};