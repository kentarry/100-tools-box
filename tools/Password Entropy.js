window.render_passwordEntropy = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">🛡️ 密碼強度試算</h3>
            <input type="password" id="peIn" placeholder="輸入密碼測試強度" class="w-full p-4 border-2 rounded-xl mb-4">
            <div id="peRes" class="p-4 bg-slate-50 rounded-xl space-y-2">
                <p class="text-sm">密碼熵值: <span id="peVal" class="font-bold">0</span> bits</p>
                <p class="text-sm">暴力破解預估時間：<br><span id="peTime" class="font-black text-rose-500 text-lg">瞬間</span></p>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('peIn').oninput = (e) => {
            const p = e.target.value;
            let pool = 0;
            if (/[a-z]/.test(p)) pool += 26;
            if (/[A-Z]/.test(p)) pool += 26;
            if (/[0-9]/.test(p)) pool += 10;
            if (/[^a-zA-Z0-9]/.test(p)) pool += 32;
            const entropy = p.length * (pool > 0 ? Math.log2(pool) : 0);
            document.getElementById('peVal').textContent = Math.round(entropy);
            let time = "瞬間";
            if (entropy > 40) time = "幾小時";
            if (entropy > 60) time = "幾個月";
            if (entropy > 80) time = "幾年";
            if (entropy > 100) time = "幾世紀";
            document.getElementById('peTime').textContent = time;
        };
    }, 0);
};