window.render_passportChecker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">✈️ 護照效期自動檢測</h3>
            <div class="space-y-4">
                <label class="text-sm font-bold block mb-1">護照到期日</label>
                <input type="date" id="ppDate" class="w-full p-3 border rounded-xl">
                <div id="ppRes" class="p-4 rounded-xl text-center font-bold hidden"></div>
            </div>
            <p class="text-[10px] text-slate-400 mt-4 leading-relaxed">※ 出國旅遊多數國家要求護照效期至少需有 6 個月以上，本工具將以此為準進行提醒。</p>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('ppDate').onchange = (e) => {
            const expiry = new Date(e.target.value);
            const halfYearLater = new Date();
            halfYearLater.setMonth(halfYearLater.getMonth() + 6);
            const res = document.getElementById('ppRes');
            res.classList.remove('hidden');
            if (expiry < halfYearLater) {
                res.className = "p-4 rounded-xl text-center font-bold bg-rose-100 text-rose-700";
                res.textContent = "⚠️ 效期少於六個月，建議換發！";
            } else {
                res.className = "p-4 rounded-xl text-center font-bold bg-emerald-100 text-emerald-700";
                res.textContent = "✅ 效期充裕，可以安心出發！";
            }
        };
    }, 0);
};