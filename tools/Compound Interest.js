window.render_compoundInterest = function () {
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold mb-4">📈 定期定額複利試算</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div><label class="text-xs">每月投入</label><input type="number" id="ciMonthly" value="10000" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">預期年報酬 (%)</label><input type="number" id="ciRate" value="7" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">投資年數</label><input type="number" id="ciYears" value="20" class="w-full p-2 border rounded"></div>
            </div>
            <div class="h-64 bg-slate-50 rounded-xl mb-4 flex items-end p-4 gap-1" id="ciChart"></div>
            <div class="text-center font-bold text-slate-700">預估資產終值：<span id="ciTotal" class="text-2xl text-indigo-600"></span> 元</div>
        </div>
    `;

    setTimeout(() => {
        function update() {
            const m = parseFloat(document.getElementById('ciMonthly').value);
            const r = parseFloat(document.getElementById('ciRate').value) / 100 / 12;
            const y = parseInt(document.getElementById('ciYears').value);
            const chart = document.getElementById('ciChart');
            chart.innerHTML = '';

            let current = 0;
            const history = [];
            for (let i = 1; i <= y; i++) {
                for (let j = 0; j < 12; j++) { current = (current + m) * (1 + r); }
                history.push(current);
            }

            const max = Math.max(...history);
            history.forEach(v => {
                const bar = document.createElement('div');
                bar.className = "flex-1 bg-indigo-400 rounded-t hover:bg-indigo-600 transition-all";
                bar.style.height = `${(v / max) * 100}%`;
                chart.appendChild(bar);
            });
            document.getElementById('ciTotal').textContent = Math.round(current).toLocaleString();
        }
        ['ciMonthly', 'ciRate', 'ciYears'].forEach(id => document.getElementById(id).oninput = update);
        update();
    }, 0);
};