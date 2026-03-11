window.render_weatherOutfit = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">👕 今日穿搭建議</h3>
            <div class="flex items-center justify-center gap-4 mb-6">
                <span class="text-xs font-bold text-slate-400">氣溫</span>
                <input type="number" id="woTemp" value="20" class="w-24 p-2 border rounded-xl text-2xl font-bold text-center">
                <span class="text-xl font-bold text-slate-400">°C</span>
            </div>
            <div class="p-8 bg-blue-50 border border-blue-100 rounded-3xl">
                <p id="woAdv" class="text-xl font-bold text-blue-700">建議穿著：長袖襯衫 + 薄外套</p>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('woTemp').oninput = (e) => {
            const t = e.target.value;
            let adv = "短袖 + 短褲";
            if (t < 25) adv = "短袖 + 薄外套";
            if (t < 20) adv = "長袖 + 薄外套";
            if (t < 15) adv = "發熱衣 + 厚外套";
            if (t < 10) adv = "羽絨衣 + 手套圍巾";
            document.getElementById('woAdv').textContent = `建議穿著：${adv}`;
        };
    }, 0);
};