window.render_truthDare = function () {
    const truths = ["最近一次哭是因為什麼？", "你最尷尬的一段戀情是什麼？", "如果可以變換性別一天，你最想做什麼？", "你手機裡最不想被別人看到的照片是什麼？"];
    const dares = ["模仿一個在場的人，直到大家猜出來是誰", "對窗外大喊三聲「我是大笨蛋」", "讓右手邊的人幫你畫一個鬼臉在臉上", "現場表演一段最近流行的舞步"];

    container.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-6">
            <h3 class="text-xl font-bold">🎲 真心話大冒險題庫</h3>
            <div class="grid grid-cols-2 gap-4">
                <button id="getTruth" class="py-10 bg-rose-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition">真心話</button>
                <button id="getDare" class="py-10 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition">大冒險</button>
            </div>
            <div id="tdBox" class="hidden p-8 bg-white border-2 border-slate-200 rounded-3xl min-h-[150px] flex items-center justify-center italic text-lg text-slate-700 shadow-inner">
            </div>
        </div>
    `;

    setTimeout(() => {
        const box = document.getElementById('tdBox');
        document.getElementById('getTruth').onclick = () => {
            box.classList.remove('hidden');
            box.textContent = "🤔 真心話： " + truths[Math.floor(Math.random() * truths.length)];
        };
        document.getElementById('getDare').onclick = () => {
            box.classList.remove('hidden');
            box.textContent = "🔥 大冒險： " + dares[Math.floor(Math.random() * dares.length)];
        };
    }, 0);
};