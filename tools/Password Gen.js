window.render_passwordGen = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center shadow-sm">
            <h3 class="font-bold mb-4">🔑 強密碼隨機產生</h3>
            <div id="pwOut" class="p-4 bg-slate-50 border rounded-xl text-2xl font-mono mb-4 break-all">********</div>
            <button id="pwBtn" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">重新產生</button>
        </div>
    `;
    setTimeout(() => {
        const gen = () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
            let pw = ""; for (let i = 0; i < 16; i++) pw += chars.charAt(Math.floor(Math.random() * chars.length));
            document.getElementById('pwOut').textContent = pw;
        };
        document.getElementById('pwBtn').onclick = gen; gen();
    }, 0);
};