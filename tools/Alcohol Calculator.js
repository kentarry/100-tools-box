window.render_alcoholCalculator = function () {
    // 假設 container 已經存在你的環境中，若沒有請自行替換為 document.getElementById('你的容器ID')
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-gradient-to-b from-white to-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-100 font-sans">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-black text-slate-800 mb-2">🍺 專業酒精代謝預估器</h3>
                <span class="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">
                    ※ 僅供參考，酒後請勿駕車
                </span>
            </div>

            <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-600 mb-1">性別</label>
                        <select id="alcGender" class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition">
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-600 mb-1">體重 (kg)</label>
                        <input type="number" id="alcWeight" value="70" class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-2">快速選擇飲品</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button type="button" class="preset-btn px-2 py-2 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition" data-ml="330" data-abv="5">🍺 啤酒<br><span class="text-[10px] font-normal">330ml / 5%</span></button>
                        <button type="button" class="preset-btn px-2 py-2 text-xs font-bold bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition" data-ml="150" data-abv="12">🍷 紅酒<br><span class="text-[10px] font-normal">150ml / 12%</span></button>
                        <button type="button" class="preset-btn px-2 py-2 text-xs font-bold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition" data-ml="30" data-abv="40">🥃 烈酒<br><span class="text-[10px] font-normal">30ml / 40%</span></button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-600 mb-1">飲用量 (ml)</label>
                        <input type="number" id="alcAmount" value="330" class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-600 mb-1">酒精濃度 (%)</label>
                        <input type="number" id="alcPercent" value="5" class="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition">
                    </div>
                </div>

                <div class="mt-6 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-amber-400" id="statusLine"></div>
                    
                    <div class="flex justify-between items-end mb-4 pl-2">
                        <div>
                            <p class="text-sm font-semibold text-slate-500">預估最高血量酒精濃度 (BAC)</p>
                            <p class="text-xl font-bold text-slate-800" id="alcBac">0.00 %</p>
                        </div>
                        <div class="text-right">
                            <span id="alcStatus" class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg">清醒</span>
                        </div>
                    </div>

                    <div class="pl-2 pt-4 border-t border-slate-100">
                        <p class="text-sm font-semibold text-slate-500">預計完全代謝所需時間</p>
                        <p class="text-3xl font-black text-amber-600 mt-1"><span id="alcTime">0.0</span> <span class="text-lg font-medium">小時</span></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const weightInput = document.getElementById('alcWeight');
        const genderInput = document.getElementById('alcGender');
        const amountInput = document.getElementById('alcAmount');
        const percentInput = document.getElementById('alcPercent');
        
        const timeDisplay = document.getElementById('alcTime');
        const bacDisplay = document.getElementById('alcBac');
        const statusDisplay = document.getElementById('alcStatus');
        const statusLine = document.getElementById('statusLine');

        function calculateMetabolism() {
            const weight = parseFloat(weightInput.value) || 0;
            const gender = genderInput.value;
            const amount = parseFloat(amountInput.value) || 0;
            const percent = parseFloat(percentInput.value) || 0;

            if (weight <= 0 || amount <= 0 || percent <= 0) {
                timeDisplay.textContent = '0.0';
                bacDisplay.textContent = '0.00 %';
                updateStatus(0);
                return;
            }

            // 使用 Widmark Formula 計算 BAC
            // 酒精重量 (克) = 體積(ml) * 濃度(%) * 酒精密度(0.789)
            const alcoholGrams = amount * (percent / 100) * 0.789;
            
            // 性別常數 (r)
            const r = gender === 'male' ? 0.68 : 0.55;
            
            // 體重轉換為克
            const weightGrams = weight * 1000;

            // 預估最高 BAC (%) = (酒精克數 / (體重克數 * r)) * 100
            let bac = (alcoholGrams / (weightGrams * r)) * 100;
            
            // 人體平均代謝率約為每小時 0.015% BAC
            const metabolismRate = 0.015;
            let hours = bac / metabolismRate;

            // 更新畫面
            bacDisplay.textContent = bac.toFixed(3) + ' %';
            timeDisplay.textContent = hours.toFixed(1);
            updateStatus(bac);
        }

        function updateStatus(bac) {
            let statusText = '清醒';
            let statusClasses = 'bg-emerald-100 text-emerald-700';
            let lineColor = 'bg-emerald-400';

            if (bac > 0.08) {
                statusText = '酒醉 / 危險';
                statusClasses = 'bg-red-100 text-red-700';
                lineColor = 'bg-red-500';
            } else if (bac > 0.05) {
                statusText = '超過酒駕標準';
                statusClasses = 'bg-rose-100 text-rose-700';
                lineColor = 'bg-rose-400';
            } else if (bac > 0.02) {
                statusText = '微醺';
                statusClasses = 'bg-amber-100 text-amber-700';
                lineColor = 'bg-amber-400';
            }

            statusDisplay.className = `inline-block px-3 py-1 text-sm font-bold rounded-lg ${statusClasses}`;
            statusDisplay.textContent = statusText;
            statusLine.className = `absolute top-0 left-0 w-1 h-full ${lineColor}`;
        }

        // 綁定輸入事件
        [weightInput, genderInput, amountInput, percentInput].forEach(el => {
            el.addEventListener('input', calculateMetabolism);
            el.addEventListener('change', calculateMetabolism);
        });

        // 綁定快捷按鈕事件
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                amountInput.value = target.getAttribute('data-ml');
                percentInput.value = target.getAttribute('data-abv');
                calculateMetabolism();
                
                // 添加點擊小動畫
                target.classList.add('scale-95');
                setTimeout(() => target.classList.remove('scale-95'), 100);
            });
        });

        // 初始化計算
        calculateMetabolism();
    }, 0);
};
