window.render_calendarConverter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center shadow-sm">
            <h3 class="font-bold mb-4 flex items-center justify-center gap-2">🏮 農曆/國曆轉換器</h3>
            <div class="space-y-4">
                <input type="date" id="calIn" class="w-full p-3 border rounded-xl text-lg font-bold">
                <div class="p-6 bg-red-50 rounded-2xl border border-red-100">
                    <p class="text-xs text-red-400 font-bold mb-1 uppercase">轉換後的農曆日期</p>
                    <div id="lunarResult" class="text-2xl font-bold text-red-700">請選擇日期</div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        // 動態載入繁體中文農曆轉換庫
        if (!window.lunar) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js";
            document.head.appendChild(script);
        }
        const input = document.getElementById('calIn');
        input.onchange = () => {
            const d = new Date(input.value);
            const l = Solar.fromDate(d).getLunar();
            document.getElementById('lunarResult').innerHTML = `
                ${l.getYearInGanZhi()}(${l.getYearShengXiao()})年<br>
                ${l.getMonthInChinese()}月${l.getDayInChinese()}
            `;
        };
    }, 0);
};