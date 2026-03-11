window.render_invoiceChecker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🧧 發票末 3 碼快對</h3>
            <input type="number" id="invIn" placeholder="請輸入末3碼" class="w-full p-4 border rounded-xl text-4xl font-black text-center mb-4">
            <div id="invRes" class="hidden p-6 rounded-2xl text-2xl font-bold"></div>
        </div>
    `;
    setTimeout(() => {
        const winning = ['123', '456', '789']; // 需定期更新或串接 API
        document.getElementById('invIn').oninput = (e) => {
            const v = e.target.value; const res = document.getElementById('invRes');
            if (v.length === 3) {
                res.classList.remove('hidden');
                if (winning.includes(v)) { res.textContent = '🎊 中獎了！'; res.className = 'p-6 rounded-2xl text-2xl font-bold bg-rose-500 text-white animate-bounce'; }
                else { res.textContent = '再接再厲'; res.className = 'p-6 rounded-2xl text-2xl font-bold bg-slate-100 text-slate-400'; }
            } else { res.classList.add('hidden'); }
        };
    }, 0);
};