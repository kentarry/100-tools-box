window.render_creditCardValidator = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">💳 信用卡號 Luhn 算法校驗</h3>
            <input type="text" id="ccIn" placeholder="輸入 16 碼卡號" class="w-full p-3 border rounded-xl text-center tracking-widest font-mono text-xl">
            <div id="ccRes" class="mt-4 p-3 rounded-lg text-center font-bold hidden"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('ccIn').oninput = (e) => {
            let s = 0, v = e.target.value.replace(/\D/g, '');
            for (let i = 0; i < v.length; i++) {
                let n = parseInt(v[v.length - 1 - i]);
                if (i % 2 === 1) n *= 2;
                s += n > 9 ? n - 9 : n;
            }
            const res = document.getElementById('ccRes'); res.classList.remove('hidden');
            if (s % 10 === 0 && v.length >= 13) { res.textContent = '✅ 卡號格式合法'; res.className = 'mt-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg text-center font-bold'; }
            else { res.textContent = '❌ 卡號無效'; res.className = 'mt-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-center font-bold'; }
        };
    }, 0);
};