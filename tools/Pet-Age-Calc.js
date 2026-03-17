window.render_petAgeCalc = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-indigo-100 text-center">
            <h3 class="font-bold mb-4">🐶 寵物年齡換算器</h3>
            <div class="flex gap-4 mb-6">
                <button class="flex-1 py-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl font-bold">貓貓</button>
                <button class="flex-1 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold">狗狗</button>
            </div>
            <label class="text-xs block mb-1">毛孩實際年齡</label>
            <input type="number" id="petAge" value="2" class="w-full text-3xl p-4 border rounded-2xl text-center font-bold mb-6">
            <div class="p-6 bg-indigo-600 text-white rounded-2xl">
                <p class="text-xs opacity-70">相當於人類的</p>
                <p id="humanAge" class="text-4xl font-black">24 歲</p>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('petAge').oninput = (e) => {
            const age = e.target.value;
            // 簡易換算公式：前兩年每年 12 歲，之後每年 4 歲
            let res = age <= 2 ? age * 12 : 24 + (age - 2) * 4;
            document.getElementById('humanAge').textContent = Math.round(res) + ' 歲';
        };
    }, 0);
};