window.render_taxiFare = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">🚕 車資預估 (北北基標準)</h3>
            <div class="space-y-4">
                <div>
                    <label class="text-xs font-bold text-slate-500">預計里程 (公里)</label>
                    <input type="number" id="taxiDist" value="5" step="0.5" class="w-full p-2 border rounded-lg text-xl font-bold">
                </div>
                <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm">
                        <input type="checkbox" id="taxiNight"> 夜間加成
                    </label>
                </div>
                <div class="p-4 bg-yellow-50 rounded-xl text-center border border-yellow-100">
                    <p class="text-xs text-yellow-600 font-bold mb-1">預估跳表金額</p>
                    <p id="taxiRes" class="text-3xl font-black text-yellow-700">NT$ 155</p>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const dist = document.getElementById('taxiDist').value;
            const isNight = document.getElementById('taxiNight').checked;
            // 北北基公式：起程1.25公里85元，續程每200公尺5元
            let price = 85;
            if (dist > 1.25) {
                price += Math.ceil((dist - 1.25) * 1000 / 200) * 5;
            }
            if (isNight) price += 20;
            document.getElementById('taxiRes').textContent = `NT$ ${price}`;
        }
        document.querySelectorAll('input').forEach(i => i.onchange = calc);
        document.getElementById('taxiDist').oninput = calc;
    }, 0);
};