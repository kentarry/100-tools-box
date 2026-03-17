window.render_fuelSplitter = function () {
    // 使用專屬 ID 包裝，避免與其他 99 個工具的 CSS 或 JS 發生衝突
    container.innerHTML = `
        <div id="tool-fuel-splitter" class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-out">
            <div class="flex items-center justify-between mb-5 border-b pb-3">
                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span class="text-2xl">⛽</span> 自駕油資分攤計算機
                </h3>
            </div>
            
            <div class="space-y-4 text-sm text-gray-700">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-1 font-medium text-gray-600" for="fuelDist">行駛里程 (km)</label>
                        <input type="number" id="fuelDist" value="100" min="0" step="0.1" inputmode="decimal" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none">
                    </div>
                    <div>
                        <label class="block mb-1 font-medium text-gray-600" for="fuelEff">平均油耗 (km/L)</label>
                        <input type="number" id="fuelEff" value="12" min="0.1" step="0.1" inputmode="decimal" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-1 font-medium text-gray-600" for="fuelPrice">目前油價 (元/L)</label>
                        <input type="number" id="fuelPrice" value="30" min="0" step="0.1" inputmode="decimal" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none">
                    </div>
                    <div>
                        <label class="block mb-1 font-medium text-gray-600" for="fuelExtra">過路費/停車費 (元)</label>
                        <input type="number" id="fuelExtra" value="0" min="0" inputmode="numeric" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none">
                    </div>
                </div>

                <div class="pt-2">
                    <label class="block mb-1 font-medium text-gray-600" for="fuelPeople">分攤人數 (人)</label>
                    <div class="flex items-center gap-3">
                        <input type="range" id="fuelPeopleRange" min="1" max="10" value="2" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
                        <input type="number" id="fuelPeople" value="2" min="1" max="99" inputmode="numeric" class="w-16 p-2 text-center bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100 bg-blue-50/50 rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600 font-medium">總計費用：</span>
                        <span class="text-lg font-bold text-gray-800"><span id="fuelTotal">250</span> 元</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-blue-800 font-bold">每人應付：</span>
                        <span class="text-2xl font-black text-blue-600"><span id="fuelPerPerson">125</span> 元</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 確保 DOM 渲染完成後再綁定事件
    setTimeout(() => {
        const widget = document.getElementById('tool-fuel-splitter');
        if (!widget) return; // 避免找不到元素導致報錯

        const inputs = widget.querySelectorAll('input');
        const rangeInput = widget.querySelector('#fuelPeopleRange');
        const numberInput = widget.querySelector('#fuelPeople');

        // 同步滑桿與數字輸入框
        rangeInput.addEventListener('input', (e) => {
            numberInput.value = e.target.value;
            calc();
        });
        numberInput.addEventListener('input', (e) => {
            rangeInput.value = e.target.value;
            calc();
        });

        // 核心計算邏輯
        function calc() {
            // 取值並處理防呆 (避免空值或除以零)
            const d = parseFloat(widget.querySelector('#fuelDist').value) || 0;
            const e = parseFloat(widget.querySelector('#fuelEff').value) || 1; // 預設 1 避免 Infinity
            const p = parseFloat(widget.querySelector('#fuelPrice').value) || 0;
            const extra = parseFloat(widget.querySelector('#fuelExtra').value) || 0;
            let people = parseInt(numberInput.value) || 1;

            if (people < 1) people = 1; // 確保至少 1 人分攤

            // 計算邏輯
            const fuelCost = (d / e) * p;
            const totalCost = fuelCost + extra;
            const perPersonCost = totalCost / people;

            // 更新 UI，加入千分位逗號提升閱讀性
            widget.querySelector('#fuelTotal').textContent = Math.round(totalCost).toLocaleString();
            widget.querySelector('#fuelPerPerson').textContent = Math.round(perPersonCost).toLocaleString();
        }

        // 綁定所有輸入框的監聽事件，並限制作用域僅在該工具內
        inputs.forEach(i => {
            if (i !== rangeInput && i !== numberInput) {
                i.addEventListener('input', calc);
            }
        });

        // 初始化計算
        calc();
    }, 0);
};
