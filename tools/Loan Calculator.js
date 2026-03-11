window.render_loanCalculator = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold mb-4">🏠 貸款提前還款試算</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                    <label class="font-bold text-slate-600">貸款總額 (萬)</label>
                    <input type="number" id="loanAmount" value="1000" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="font-bold text-slate-600">年利率 (%)</label>
                    <input type="number" id="loanRate" value="2.1" step="0.1" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="font-bold text-slate-600">貸款年限 (年)</label>
                    <input type="number" id="loanYears" value="30" class="w-full p-2 border rounded">
                </div>
                <div>
                    <label class="font-bold text-slate-600">每月額外還款 (元)</label>
                    <input type="number" id="extraPay" value="5000" class="w-full p-2 border rounded border-emerald-300">
                </div>
            </div>
            <div id="loanResult" class="p-4 bg-emerald-50 rounded-xl text-emerald-800 space-y-2">
                <p>每月原應還款：<span id="origMonthly" class="font-bold"></span> 元</p>
                <p class="text-lg">提前還款可節省總利息：<span id="saveInterest" class="font-black text-emerald-600"></span> 元</p>
                <p>還款年限可提早：<span id="saveYears" class="font-bold text-emerald-600"></span> 年結清</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        const inputs = ['loanAmount', 'loanRate', 'loanYears', 'extraPay'];
        function calc() {
            const P = document.getElementById('loanAmount').value * 10000;
            const r = document.getElementById('loanRate').value / 100 / 12;
            const n = document.getElementById('loanYears').value * 12;
            const extra = parseFloat(document.getElementById('extraPay').value);

            const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            document.getElementById('origMonthly').textContent = Math.round(monthly).toLocaleString();

            let balance = P, totalIntOrig = 0, totalIntNew = 0, monthsNew = 0;
            // 原始利息
            totalIntOrig = (monthly * n) - P;
            // 模擬還款
            while (balance > 0 && monthsNew < 600) {
                let interest = balance * r;
                totalIntNew += interest;
                balance = balance - (monthly + extra - interest);
                monthsNew++;
            }
            document.getElementById('saveInterest').textContent = Math.max(0, Math.round(totalIntOrig - totalIntNew)).toLocaleString();
            document.getElementById('saveYears').textContent = ((n - monthsNew) / 12).toFixed(1);
        }
        inputs.forEach(id => document.getElementById(id).addEventListener('input', calc));
        calc();
    }, 0);
};