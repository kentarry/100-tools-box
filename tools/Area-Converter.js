window.render_areaConverter = function () {
    // 假設外部已經定義了 container，若沒有可自行修改這行獲取 DOM
    // const container = document.getElementById('container');

    container.innerHTML = `
        <div class="max-w-md w-full mx-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-gray-800">
            <h3 class="text-lg font-bold mb-5 text-center flex justify-center items-center gap-2">
                🏠 房屋面積全能換算
            </h3>
            <div class="space-y-4 text-left">
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pl-1">台灣坪數 (Ping)</label>
                    <input type="number" id="areaPing" value="1" min="0" step="any" placeholder="請輸入坪數"
                           class="w-full p-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pl-1">平方米 (m²)</label>
                    <input type="number" id="areaM2" min="0" step="any" placeholder="請輸入平方米"
                           class="w-full p-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pl-1">平方英尺 (sq ft)</label>
                    <input type="number" id="areaSqft" min="0" step="any" placeholder="請輸入平方英尺"
                           class="w-full p-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const pingInput = document.getElementById('areaPing');
        const m2Input = document.getElementById('areaM2');
        const sqftInput = document.getElementById('areaSqft');

        // 建立一個統一的換算函式
        const updateValues = (source, value) => {
            // 防呆：如果輸入為空或小於0，則清空所有欄位
            if (value === '' || value < 0) {
                if (source !== 'ping') pingInput.value = '';
                if (source !== 'm2') m2Input.value = '';
                if (source !== 'sqft') sqftInput.value = '';
                return;
            }

            const num = parseFloat(value);
            
            // 執行換算 (使用較精確的常數)
            if (source === 'ping') {
                m2Input.value = (num * 3.305785).toFixed(2);
                sqftInput.value = (num * 35.5832).toFixed(2);
            } else if (source === 'm2') {
                pingInput.value = (num * 0.3025).toFixed(2);
                sqftInput.value = (num * 10.7639).toFixed(2);
            } else if (source === 'sqft') {
                const m2 = num / 10.7639;
                m2Input.value = m2.toFixed(2);
                pingInput.value = (m2 * 0.3025).toFixed(2);
            }
        };

        // 綁定三個輸入框的 input 事件 (比 oninput 更好維護)
        pingInput.addEventListener('input', (e) => updateValues('ping', e.target.value));
        m2Input.addEventListener('input', (e) => updateValues('m2', e.target.value));
        sqftInput.addEventListener('input', (e) => updateValues('sqft', e.target.value));

        // 初始化第一次的計算結果
        updateValues('ping', pingInput.value);
    }, 0);
};
