window.render_ipChecker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center shadow-sm">
            <h3 class="font-bold mb-4 text-blue-600">🌐 我的公網 IP 地址</h3>
            <div id="ipRes" class="text-2xl font-mono font-bold p-6 bg-slate-50 rounded-xl mb-4 text-slate-800 italic">點擊獲取</div>
            <button onclick="fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>document.getElementById('ipRes').textContent=d.ip)" class="w-full py-2 bg-blue-500 text-white rounded-lg">查詢我的 IP</button>
        </div>
    `;
};