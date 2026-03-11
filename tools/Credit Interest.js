window.render_creditInterest = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-rose-100">
            <h3 class="font-bold text-rose-600 mb-2">💳 分期「真」利率還原</h3>
            <p class="text-xs text-slate-400 mb-4">手續費往往隱藏了高額利息，幫你算出來。</p>
            <div class="space-y-3">
                <div><label class="text-xs">總金額</label><input type="number" id="crTotal" value="12000" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">分期期數</label><input type="number" id="crMonths" value="12" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">每期手續費/利息</label><input type="number" id="crFee" value="100" class="w-full p-2 border rounded"></div>
            </div>
            <div class="mt-6 p-4 bg-rose-50 rounded-xl text-center">
                <p class="text-xs font-bold text-rose-400">實質年化利率約</p>
                <p id="crRealRate" class="text-3xl font-black text-rose-600">0%</p>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const P = document.getElementById('crTotal').value;
            const n = document.getElementById('crMonths').value;
            const f = document.getElementById('crFee').value;
            // 簡易 IRR 近似公式: (費率 * 2 * 期數) / (期數 + 1)
            const rate = ((f * n / P) * (24 / (parseInt(n) + 1))) * 100;
            document.getElementById('crRealRate').textContent = rate.toFixed(2) + '%';
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
        calc();
    }, 0);
};