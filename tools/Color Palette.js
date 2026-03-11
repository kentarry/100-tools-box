window.render_colorPalette = function () {
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🎨 快速色彩調色盤</h3>
            <div class="grid grid-cols-5 gap-2">
                ${colors.map(c => `<div class="aspect-square rounded-lg cursor-pointer transition transform hover:scale-110" style="background:${c}" onclick="navigator.clipboard.writeText('${c}');alert('已複製 ${c}')"></div>`).join('')}
            </div>
            <p class="text-[10px] text-slate-400 mt-4">點擊顏色塊即可複製 HEX 色碼</p>
        </div>
    `;
};