window.render_fortuneSimulator = function () {
    const fortunes = ["大吉：心想事成，萬事如意", "中吉：平穩順遂，小有斬獲", "小吉：勤能補拙，莫急莫慌", "末吉：守成待時，稍安勿躁", "凶：謹言慎行，以退為進"];
    container.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-6">
            <h3 class="font-bold text-xl">🎋 今日運勢求籤</h3>
            <div id="stickBox" class="w-24 h-48 bg-orange-800 mx-auto rounded-t-full shadow-2xl flex items-end justify-center pb-4 cursor-pointer hover:-translate-y-2 transition-transform">
                <div class="w-2 h-32 bg-orange-200 rounded-full animate-bounce"></div>
            </div>
            <p class="text-slate-400 text-sm">點擊籤筒搖一搖</p>
            <div id="fortRes" class="hidden p-8 bg-white border-2 border-orange-200 rounded-3xl text-2xl font-bold text-orange-800 shadow-inner"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('stickBox').onclick = () => {
            const res = document.getElementById('fortRes');
            res.classList.remove('hidden');
            res.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
            res.classList.add('animate-pulse');
            setTimeout(() => res.classList.remove('animate-pulse'), 1000);
        };
    }, 0);
};