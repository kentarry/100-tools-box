window.render_vatChecker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4 text-slate-700">🏢 公司統編邏輯驗證</h3>
            <input type="text" id="vatIn" placeholder="請輸入 8 碼統編" maxlength="8" class="w-full text-2xl p-4 border-2 rounded-xl text-center font-mono tracking-widest mb-4">
            <div id="vatRes" class="p-4 rounded-xl text-center font-bold text-lg hidden"></div>
            <p class="text-[10px] text-slate-400 mt-4 leading-relaxed">遵循財政部統編邏輯：透過固定乘數 (1,2,1,2,1,2,4,1) 進行權數計算。可用於初步檢查輸入是否有誤。</p>
        </div>
    `;
    setTimeout(() => {
        const input = document.getElementById('vatIn');
        const res = document.getElementById('vatRes');
        input.oninput = () => {
            const val = input.value;
            if (val.length < 8) { res.classList.add('hidden'); return; }
            const multipliers = [1, 2, 1, 2, 1, 2, 4, 1];
            let sum = 0;
            for (let i = 0; i < 8; i++) {
                let step = val[i] * multipliers[i];
                sum += Math.floor(step / 10) + (step % 10);
            }
            res.classList.remove('hidden');
            if (sum % 10 === 0 || (val[6] === '7' && (sum + 1) % 10 === 0)) {
                res.textContent = '✅ 此統編格式正確';
                res.className = 'p-4 rounded-xl text-center font-bold text-lg bg-emerald-100 text-emerald-700';
            } else {
                res.textContent = '❌ 格式錯誤或無此統編';
                res.className = 'p-4 rounded-xl text-center font-bold text-lg bg-rose-100 text-rose-700';
            }
        };
    }, 0);
};