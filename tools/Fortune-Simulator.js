window.render_fortuneSimulator = function () {
    const fortunes = [
        { level: '大吉', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', msg: '心想事成，萬事如意', detail: '今日運勢極佳！無論做什麼都能順利達成，把握機會大膽前進吧。', advice: '宜：告白、面試、簽約、投資' },
        { level: '大吉', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', msg: '鴻運當頭，貴人相助', detail: '將有貴人出現在你身邊，多留意周遭的善意與機會。', advice: '宜：社交、合作、旅行、開會' },
        { level: '中吉', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', msg: '平穩順遂，小有斬獲', detail: '今天不會有太大波折，踏實努力就能看到成果。', advice: '宜：學習、運動、整理、規劃' },
        { level: '中吉', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', msg: '穩中求進，水到渠成', detail: '保持耐心，你正在做的事情即將看到回報。', advice: '宜：讀書、存錢、培養習慣' },
        { level: '小吉', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', msg: '勤能補拙，莫急莫慌', detail: '今日事情可能進展緩慢，但只要堅持就有好結果。', advice: '宜：反省、休息、看書、散步' },
        { level: '小吉', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', msg: '小有收穫，知足常樂', detail: '不需要追求完美，珍惜手上已有的就是最大的福氣。', advice: '宜：感恩、陪伴家人、做飯' },
        { level: '末吉', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', msg: '守成待時，稍安勿躁', detail: '今日不適合衝動行事，等待更好的時機再出手。', advice: '宜：等待、觀察、養精蓄銳' },
        { level: '末吉', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', msg: '韜光養晦，以靜制動', detail: '低調一些反而對你更有利，暗中準備才是上策。', advice: '宜：冥想、計劃、低調行事' },
        { level: '凶', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', msg: '謹言慎行，以退為進', detail: '今日容易說錯話或做錯決定，凡事三思而後行。', advice: '忌：衝動消費、爭論、熬夜' },
        { level: '大凶', color: 'text-purple-900', bg: 'bg-purple-100', border: 'border-purple-300', msg: '逢凶化吉，否極泰來', detail: '看起來很糟？別擔心！最壞的時候就是轉運的開始。', advice: '忌：賭博、借錢、做重大決定' }
    ];

    container.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-6">
            <h3 class="font-bold text-xl">🎋 今日運勢求籤</h3>
            <div id="stickBox" class="w-24 h-48 bg-orange-800 mx-auto rounded-t-full shadow-2xl flex items-end justify-center pb-4 cursor-pointer hover:-translate-y-2 transition-transform relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-orange-700 to-orange-900 rounded-t-full"></div>
                <div id="stick1" class="absolute w-1.5 h-28 bg-orange-200 rounded-full left-1/2 -translate-x-3 bottom-4 transition-transform"></div>
                <div id="stick2" class="absolute w-1.5 h-32 bg-orange-300 rounded-full left-1/2 translate-x-1 bottom-4 transition-transform"></div>
                <div id="stick3" class="absolute w-1.5 h-30 bg-orange-100 rounded-full left-1/2 translate-x-4 bottom-4 transition-transform"></div>
            </div>
            <p class="text-slate-400 text-sm" id="fortHint">👆 點擊籤筒搖一搖</p>
            <div id="fortRes" class="hidden text-left"></div>
        </div>
    `;
    setTimeout(() => {
        const box = document.getElementById('stickBox');
        const res = document.getElementById('fortRes');
        const hint = document.getElementById('fortHint');
        const sticks = [document.getElementById('stick1'), document.getElementById('stick2'), document.getElementById('stick3')];
        let shaking = false;

        box.onclick = () => {
            if (shaking) return;
            shaking = true;
            hint.textContent = '🙏 搖籤中...';
            res.classList.add('hidden');

            // Shake animation
            let count = 0;
            const shake = setInterval(() => {
                sticks.forEach((s, i) => {
                    const angle = (count % 2 === 0 ? 1 : -1) * (5 + i * 3);
                    const y = (count % 2 === 0 ? -3 : 3) * (i + 1);
                    s.style.transform = `translateX(${i * 4 - 4}px) rotate(${angle}deg) translateY(${y}px)`;
                });
                count++;
                if (count > 8) {
                    clearInterval(shake);
                    sticks.forEach(s => s.style.transform = '');
                    // Show result
                    const f = fortunes[Math.floor(Math.random() * fortunes.length)];
                    res.innerHTML = `
                        <div class="p-5 ${f.bg} border-2 ${f.border} rounded-2xl space-y-3">
                            <div class="text-center">
                                <span class="text-3xl font-black ${f.color}">${f.level}</span>
                            </div>
                            <p class="text-lg font-bold text-slate-800 text-center">${f.msg}</p>
                            <p class="text-sm text-slate-600 leading-relaxed">${f.detail}</p>
                            <p class="text-xs font-bold ${f.color} bg-white/60 rounded-xl p-2 text-center">${f.advice}</p>
                        </div>
                    `;
                    res.classList.remove('hidden');
                    hint.textContent = '🔄 再點一次重新求籤';
                    shaking = false;
                }
            }, 100);
        };
    }, 0);
};
