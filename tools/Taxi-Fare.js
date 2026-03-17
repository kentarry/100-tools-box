window.render_taxiFare = function (containerId) {
    const target = document.getElementById(containerId) || container;

    // 全台主要地區費率設定 (2024-2026 參考標準)
    const REGIONS = {
        "north": { name: "北北基 (1.25km/85元)", base: 85, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 },
        "taoyuan": { name: "桃園市 (1.25km/95元)", base: 95, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 },
        "hsinchu": { name: "新竹縣市 (1.25km/100元)", base: 100, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 },
        "taichung": { name: "台中市 (1.25km/85元)", base: 85, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 },
        "tainan_kaohsiung": { name: "台南/高雄 (1.25km/85元)", base: 85, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 },
        "yilan": { name: "宜蘭地區 (1.25km/120元)", base: 120, baseDist: 1.25, nextDist: 0.2, nextPrice: 5, waitTime: 60, waitPrice: 5 }
    };

    target.innerHTML = `
        <div class="max-w-md mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-xl overflow-hidden font-sans">
            <div class="flex items-center justify-between mb-4 px-2">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span class="text-2xl">🚕</span> 全台計程車資預估
                </h3>
                <span class="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase tracking-widest">v2.0 Beta</span>
            </div>

            <div class="bg-white p-5 rounded-2xl shadow-sm space-y-5">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">選擇縣市區域</label>
                    <select id="regionSelect" class="w-full p-3 bg-slate-100 border-none rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-yellow-400 outline-none appearance-none cursor-pointer">
                        ${Object.keys(REGIONS).map(key => `<option value="${key}">${REGIONS[key].name}</option>`).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">預計里程 (公里)</label>
                        <div class="relative">
                            <input type="number" id="taxiDist" value="5" step="0.1" min="0" 
                                class="w-full p-3 bg-slate-100 border-none rounded-xl text-xl font-black text-slate-700 focus:ring-2 focus:ring-yellow-400 outline-none">
                            <span class="absolute right-3 top-3.5 text-slate-400 font-bold">km</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">塞車/等候 (分鐘)</label>
                        <div class="relative">
                            <input type="number" id="taxiWait" value="0" min="0" 
                                class="w-full p-3 bg-slate-100 border-none rounded-xl text-xl font-black text-slate-700 focus:ring-2 focus:ring-yellow-400 outline-none">
                            <span class="absolute right-3 top-3.5 text-slate-400 font-bold">min</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between px-1">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative">
                            <input type="checkbox" id="taxiNight" class="sr-only peer">
                            <div class="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                        </div>
                        <span class="text-sm font-bold text-slate-600">夜間加成 (23:00~06:00)</span>
                    </label>
                </div>

                <div class="pt-4 border-t border-dashed border-slate-200">
                    <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 p-5 rounded-2xl text-center shadow-lg shadow-yellow-100 relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12">🚕</div>
                        
                        <p class="text-[10px] text-yellow-900 font-black uppercase tracking-tighter mb-1 opacity-80">Estimated Total Fare</p>
                        <div class="flex items-center justify-center gap-1">
                            <span class="text-sm font-black text-yellow-900 mt-2">NT$</span>
                            <span id="taxiRes" class="text-4xl font-black text-yellow-900 tracking-tighter">155</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-slate-400 text-center mt-3 font-medium">※ 以上為預估值，實際金額以跳表為主，不含開票費或服務費。</p>
                </div>
            </div>
        </div>
    `;

    // 計算邏輯
    function calculate() {
        const regionKey = document.getElementById('regionSelect').value;
        const config = REGIONS[regionKey];
        const dist = parseFloat(document.getElementById('taxiDist').value) || 0;
        const waitMinutes = parseFloat(document.getElementById('taxiWait').value) || 0;
        const isNight = document.getElementById('taxiNight').checked;

        let total = config.base;

        // 里程計費
        if (dist > config.baseDist) {
            const extraDist = dist - config.baseDist;
            total += Math.ceil(extraDist / config.nextDist) * config.nextPrice;
        }

        // 延滯計費 (每滿 X 秒加收 Y 元)
        if (waitMinutes > 0) {
            const waitSeconds = waitMinutes * 60;
            total += Math.floor(waitSeconds / config.waitTime) * config.waitPrice;
        }

        // 夜間加成 (全台大多為固定加收 20 元，部分地區可能不同，此處採通用標準)
        if (isNight) {
            total += 20;
        }

        // 動畫跳號效果
        animateValue("taxiRes", parseInt(document.getElementById('taxiRes').textContent.replace('NT$ ', '')), total, 300);
    }

    // 數值跳動動畫
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (start === end) return;
        const range = end - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            obj.innerText = Math.floor(progress * range + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // 事件監聽
    const inputs = ['taxiDist', 'taxiWait', 'taxiNight', 'regionSelect'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', calculate);
    });

    // 初始化計算
    calculate();
};
