window.render_dataMask = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🔒 資料遮蔽 (去識別化)</h3>
            <input type="text" id="maskIn" placeholder="輸入姓名、電話或 Email" class="w-full p-3 border rounded-xl mb-4">
            <div id="maskOut" class="p-4 bg-slate-50 border rounded-xl font-mono text-center text-xl font-bold text-slate-500">****</div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('maskIn').oninput = (e) => {
            const v = e.target.value; let res = v;
            if (v.length > 2) res = v[0] + '*'.repeat(v.length - 2) + v[v.length - 1];
            document.getElementById('maskOut').textContent = res;
        };
    }, 0);
};
