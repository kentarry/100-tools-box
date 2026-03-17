window.render_foodRoulette = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-6">
            <h3 class="font-bold text-xl">🎲 命運食神輪盤</h3>
            <textarea id="foodList" class="w-full h-32 p-3 border rounded-xl" placeholder="每行填入一家餐廳...">麥當勞\n火鍋\n壽司\n巷口乾麵</textarea>
            <button id="spinBtn" class="w-full py-4 bg-orange-500 text-white rounded-full font-bold shadow-lg hover:rotate-2 transition">隨機抽選一個！</button>
            <div id="foodRes" class="hidden p-10 bg-white border-4 border-orange-500 rounded-3xl text-3xl font-black text-orange-600 animate-bounce"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('spinBtn').onclick = () => {
            const list = document.getElementById('foodList').value.split('\n').filter(s => s.trim() !== '');
            const res = document.getElementById('foodRes');
            if (list.length === 0) return alert('請先輸入名單');
            res.classList.remove('hidden');
            res.textContent = list[Math.floor(Math.random() * list.length)];
        };
    }, 0);
};