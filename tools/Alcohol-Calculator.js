window.render_alcoholCalculator = function () {
    container.innerHTML = `
        <div class="w-full max-w-2xl mx-auto font-sans">

            <!-- 標題區塊 -->
            <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%222%22 fill=%22white%22/%3E%3C/svg%3E'); background-size: 16px 16px;"></div>
                <div class="relative">
                    <h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                        <span class="text-3xl">🍺</span> 酒精代謝試算
                    </h3>
                    <p class="text-amber-100 text-sm mt-1 opacity-90">基於 Widmark 公式，預估酒精代謝時間</p>
                </div>
                <div class="mt-3">
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full">
                        ⚠️ 僅供參考，飲酒不開車、開車不飲酒
                    </span>
                </div>
            </div>

            <!-- 個人資料卡片 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="text-sm font-bold text-slate-500 mb-4 flex items-center gap-1.5">
                    <span>👤</span> 個人資料
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <!-- 性別按鈕組 -->
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">性別</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="alc-gender-male" class="alc-gender-btn py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-blue-400 bg-blue-50 text-blue-700 shadow-sm" data-gender="male">
                                🚹 男性
                            </button>
                            <button id="alc-gender-female" class="alc-gender-btn py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500 hover:border-pink-300 hover:bg-pink-50" data-gender="female">
                                🚺 女性
                            </button>
                        </div>
                    </div>

                    <!-- 體重 -->
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">體重</label>
                        <div class="flex items-center gap-2">
                            <button id="alc-weight-minus" class="w-11 h-11 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 text-lg font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none flex-shrink-0">−</button>
                            <div class="flex-1 text-center">
                                <span id="alc-weight-display" class="text-3xl font-extrabold text-slate-800 tabular-nums">70</span>
                                <span class="text-sm text-slate-400 font-medium ml-1">kg</span>
                            </div>
                            <button id="alc-weight-plus" class="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 text-lg font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none flex-shrink-0">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 飲品選擇卡片 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="text-sm font-bold text-slate-500 mb-4 flex items-center gap-1.5">
                    <span>🥂</span> 今天喝了什麼？
                </div>

                <!-- 飲品預設按鈕 -->
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-amber-300 bg-amber-50 transition-all cursor-pointer hover:shadow-md active:scale-95" data-ml="330" data-abv="5" data-name="啤酒">
                        <span class="text-2xl">🍺</span>
                        <span class="text-xs font-bold text-amber-800">啤酒</span>
                        <span class="text-[10px] text-amber-600">330ml・5%</span>
                    </button>
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white transition-all cursor-pointer hover:shadow-md hover:border-rose-300 active:scale-95" data-ml="150" data-abv="12" data-name="紅酒">
                        <span class="text-2xl">🍷</span>
                        <span class="text-xs font-bold text-slate-700">紅酒</span>
                        <span class="text-[10px] text-slate-500">150ml・12%</span>
                    </button>
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white transition-all cursor-pointer hover:shadow-md hover:border-purple-300 active:scale-95" data-ml="60" data-abv="13" data-name="清酒">
                        <span class="text-2xl">🍶</span>
                        <span class="text-xs font-bold text-slate-700">清酒</span>
                        <span class="text-[10px] text-slate-500">60ml・13%</span>
                    </button>
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white transition-all cursor-pointer hover:shadow-md hover:border-amber-300 active:scale-95" data-ml="30" data-abv="40" data-name="威士忌">
                        <span class="text-2xl">🥃</span>
                        <span class="text-xs font-bold text-slate-700">威士忌</span>
                        <span class="text-[10px] text-slate-500">30ml・40%</span>
                    </button>
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white transition-all cursor-pointer hover:shadow-md hover:border-cyan-300 active:scale-95" data-ml="45" data-abv="40" data-name="伏特加">
                        <span class="text-2xl">🧊</span>
                        <span class="text-xs font-bold text-slate-700">伏特加</span>
                        <span class="text-[10px] text-slate-500">45ml・40%</span>
                    </button>
                    <button class="alc-preset-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white transition-all cursor-pointer hover:shadow-md hover:border-yellow-300 active:scale-95" data-ml="250" data-abv="3.5" data-name="沙瓦">
                        <span class="text-2xl">🍹</span>
                        <span class="text-xs font-bold text-slate-700">沙瓦</span>
                        <span class="text-[10px] text-slate-500">250ml・3.5%</span>
                    </button>
                </div>

                <!-- 自訂飲用量與濃度 -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">自訂數值</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">飲用量</label>
                            <div class="relative">
                                <input type="number" id="alc-amount" value="330" min="0" class="w-full p-2.5 pr-10 text-lg font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition bg-white">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">ml</span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">酒精濃度</label>
                            <div class="relative">
                                <input type="number" id="alc-percent" value="5" min="0" max="100" step="0.5" class="w-full p-2.5 pr-8 text-lg font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition bg-white">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">%</span>
                            </div>
                        </div>
                    </div>

                    <!-- 杯數快捷 -->
                    <div class="mt-3 flex items-center gap-2 flex-wrap">
                        <span class="text-xs text-slate-400 font-medium">快速調杯數：</span>
                        <button class="alc-cups-btn px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition cursor-pointer" data-cups="1">1 杯</button>
                        <button class="alc-cups-btn px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition cursor-pointer" data-cups="2">2 杯</button>
                        <button class="alc-cups-btn px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition cursor-pointer" data-cups="3">3 杯</button>
                        <button class="alc-cups-btn px-3 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition cursor-pointer" data-cups="5">5 杯</button>
                    </div>
                </div>
            </div>

            <!-- 計算結果卡片 -->
            <div id="alc-result-card" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-all">
                <!-- 狀態橫幅 -->
                <div id="alc-status-bar" class="px-5 py-3 flex items-center justify-between bg-emerald-50 border-b border-emerald-100 transition-all">
                    <div class="flex items-center gap-2">
                        <span id="alc-status-icon" class="text-xl">😊</span>
                        <span id="alc-status-text" class="text-sm font-bold text-emerald-700">清醒狀態</span>
                    </div>
                    <span id="alc-status-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">安全</span>
                </div>

                <div class="p-5 sm:p-6">
                    <!-- BAC 數值 -->
                    <div class="grid grid-cols-2 gap-4 mb-5">
                        <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                            <div class="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">血液酒精濃度</div>
                            <div class="text-2xl sm:text-3xl font-black tabular-nums" id="alc-bac-display">
                                <span class="text-slate-800">0.000</span><span class="text-slate-400 text-lg ml-0.5">%</span>
                            </div>
                            <div class="text-[10px] text-slate-400 mt-1">BAC (Blood Alcohol Content)</div>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                            <div class="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">攝入純酒精</div>
                            <div class="text-2xl sm:text-3xl font-black tabular-nums" id="alc-grams-display">
                                <span class="text-slate-800">0.0</span><span class="text-slate-400 text-lg ml-0.5">g</span>
                            </div>
                            <div class="text-[10px] text-slate-400 mt-1">約 <span id="alc-shots-equiv">0</span> 個 shot</div>
                        </div>
                    </div>

                    <!-- 代謝時間 - 核心結果 -->
                    <div id="alc-time-section" class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center transition-all">
                        <div class="text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">預估完全代謝所需</div>
                        <div class="flex items-baseline justify-center gap-1">
                            <span id="alc-time-hours" class="text-5xl sm:text-6xl font-black text-amber-600 tabular-nums">0</span>
                            <span class="text-lg font-bold text-amber-400">小時</span>
                            <span id="alc-time-mins" class="text-5xl sm:text-6xl font-black text-amber-600 tabular-nums ml-2">0</span>
                            <span class="text-lg font-bold text-amber-400">分鐘</span>
                        </div>
                        <div id="alc-sober-time" class="text-xs text-amber-600/70 mt-2 font-medium"></div>
                    </div>

                    <!-- BAC 等級說明 -->
                    <div class="mt-5 pt-4 border-t border-slate-100">
                        <div class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">酒精影響程度參考</div>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 p-2 rounded-lg transition-all" id="alc-level-0">
                                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
                                <div class="flex-1 text-xs text-slate-600"><span class="font-bold">0.00 – 0.02%</span>　清醒，正常狀態</div>
                            </div>
                            <div class="flex items-center gap-3 p-2 rounded-lg transition-all" id="alc-level-1">
                                <div class="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0"></div>
                                <div class="flex-1 text-xs text-slate-600"><span class="font-bold">0.02 – 0.05%</span>　微醺，判斷力開始降低</div>
                            </div>
                            <div class="flex items-center gap-3 p-2 rounded-lg transition-all" id="alc-level-2">
                                <div class="w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0"></div>
                                <div class="flex-1 text-xs text-slate-600"><span class="font-bold">0.05 – 0.08%</span>　⚠️ 已達酒駕標準（台灣 0.03%）</div>
                            </div>
                            <div class="flex items-center gap-3 p-2 rounded-lg transition-all" id="alc-level-3">
                                <div class="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                                <div class="flex-1 text-xs text-slate-600"><span class="font-bold">0.08% 以上</span>　🚨 酒醉，嚴重危險</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部提醒 -->
            <div class="text-center text-xs text-slate-400 py-2 space-y-1">
                <p>📌 台灣酒駕標準：吐氣酒精濃度 0.15mg/L（約 BAC 0.03%）即違法</p>
                <p>💡 代謝速率因人而異，本工具以平均每小時 0.015% BAC 估算</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        // ===== 狀態變數 =====
        let gender = 'male';
        let weight = 70;
        let baseAmount = 330; // 一杯的基本量
        let baseAbv = 5;
        let cups = 1;

        // ===== DOM 參考 =====
        const amountInput = document.getElementById('alc-amount');
        const percentInput = document.getElementById('alc-percent');
        const weightDisplay = document.getElementById('alc-weight-display');
        const bacDisplay = document.getElementById('alc-bac-display');
        const gramsDisplay = document.getElementById('alc-grams-display');
        const shotsEquiv = document.getElementById('alc-shots-equiv');
        const timeHours = document.getElementById('alc-time-hours');
        const timeMins = document.getElementById('alc-time-mins');
        const soberTime = document.getElementById('alc-sober-time');
        const statusBar = document.getElementById('alc-status-bar');
        const statusIcon = document.getElementById('alc-status-icon');
        const statusText = document.getElementById('alc-status-text');
        const statusBadge = document.getElementById('alc-status-badge');
        const timeSection = document.getElementById('alc-time-section');

        // ===== 性別切換 =====
        document.querySelectorAll('.alc-gender-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                gender = btn.dataset.gender;

                document.querySelectorAll('.alc-gender-btn').forEach(b => {
                    b.className = 'alc-gender-btn py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500 hover:border-pink-300 hover:bg-pink-50';
                });

                if (gender === 'male') {
                    btn.className = 'alc-gender-btn py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-blue-400 bg-blue-50 text-blue-700 shadow-sm';
                } else {
                    btn.className = 'alc-gender-btn py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-pink-400 bg-pink-50 text-pink-700 shadow-sm';
                }
                calculate();
            });
        });

        // ===== 體重 +/− =====
        document.getElementById('alc-weight-minus').addEventListener('click', () => {
            if (weight > 30) { weight -= 5; weightDisplay.textContent = weight; calculate(); }
        });
        document.getElementById('alc-weight-plus').addEventListener('click', () => {
            if (weight < 200) { weight += 5; weightDisplay.textContent = weight; calculate(); }
        });

        // ===== 飲品預設 =====
        document.querySelectorAll('.alc-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                baseAmount = parseInt(btn.dataset.ml);
                baseAbv = parseFloat(btn.dataset.abv);
                cups = 1;

                amountInput.value = baseAmount;
                percentInput.value = baseAbv;

                // 高亮選中
                document.querySelectorAll('.alc-preset-btn').forEach(b => {
                    b.classList.remove('border-amber-300', 'bg-amber-50', 'shadow-md');
                    b.classList.add('border-slate-200', 'bg-white');
                });
                btn.classList.remove('border-slate-200', 'bg-white');
                btn.classList.add('border-amber-300', 'bg-amber-50', 'shadow-md');

                // 重設杯數高亮
                document.querySelectorAll('.alc-cups-btn').forEach(b => {
                    b.classList.remove('bg-amber-100', 'border-amber-400', 'text-amber-800');
                });

                // 動畫
                btn.style.transform = 'scale(0.93)';
                setTimeout(() => btn.style.transform = '', 150);

                calculate();
            });
        });

        // ===== 杯數快捷 =====
        document.querySelectorAll('.alc-cups-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cups = parseInt(btn.dataset.cups);
                amountInput.value = baseAmount * cups;

                document.querySelectorAll('.alc-cups-btn').forEach(b => {
                    b.classList.remove('bg-amber-100', 'border-amber-400', 'text-amber-800');
                });
                btn.classList.add('bg-amber-100', 'border-amber-400', 'text-amber-800');

                calculate();
            });
        });

        // ===== 自訂輸入 =====
        amountInput.addEventListener('input', calculate);
        percentInput.addEventListener('input', calculate);

        // ===== 核心計算 =====
        function calculate() {
            const amount = parseFloat(amountInput.value) || 0;
            const percent = parseFloat(percentInput.value) || 0;

            if (weight <= 0 || amount <= 0 || percent <= 0) {
                resetResult();
                return;
            }

            // Widmark 公式
            const alcoholGrams = amount * (percent / 100) * 0.789;
            const r = gender === 'male' ? 0.68 : 0.55;
            const bac = (alcoholGrams / (weight * 1000 * r)) * 100;
            const metabolismRate = 0.015;
            const hours = bac / metabolismRate;
            const totalMins = Math.round(hours * 60);
            const displayHours = Math.floor(totalMins / 60);
            const displayMins = totalMins % 60;

            // 等效 shot 數（一 shot 約 10g 純酒精）
            const shots = (alcoholGrams / 10).toFixed(1);

            // 更新 BAC
            bacDisplay.innerHTML = `<span class="text-slate-800">${bac.toFixed(3)}</span><span class="text-slate-400 text-lg ml-0.5">%</span>`;

            // 更新酒精克數
            gramsDisplay.innerHTML = `<span class="text-slate-800">${alcoholGrams.toFixed(1)}</span><span class="text-slate-400 text-lg ml-0.5">g</span>`;
            shotsEquiv.textContent = shots;

            // 更新時間
            timeHours.textContent = displayHours;
            timeMins.textContent = displayMins;

            // 預計清醒時間
            const now = new Date();
            const soberDate = new Date(now.getTime() + totalMins * 60 * 1000);
            const soberHH = String(soberDate.getHours()).padStart(2, '0');
            const soberMM = String(soberDate.getMinutes()).padStart(2, '0');
            const isTomorrow = soberDate.getDate() !== now.getDate();
            soberTime.textContent = `若現在開始飲用，預計 ${isTomorrow ? '明天 ' : ''}${soberHH}:${soberMM} 恢復清醒`;

            // 更新狀態
            updateStatus(bac);
            highlightLevel(bac);
        }

        function resetResult() {
            bacDisplay.innerHTML = '<span class="text-slate-800">0.000</span><span class="text-slate-400 text-lg ml-0.5">%</span>';
            gramsDisplay.innerHTML = '<span class="text-slate-800">0.0</span><span class="text-slate-400 text-lg ml-0.5">g</span>';
            shotsEquiv.textContent = '0';
            timeHours.textContent = '0';
            timeMins.textContent = '0';
            soberTime.textContent = '';
            updateStatus(0);
            highlightLevel(0);
        }

        function updateStatus(bac) {
            if (bac > 0.08) {
                statusBar.className = 'px-5 py-3 flex items-center justify-between bg-red-50 border-b border-red-100 transition-all';
                statusIcon.textContent = '🚨';
                statusText.textContent = '酒醉 / 嚴重危險';
                statusText.className = 'text-sm font-bold text-red-700';
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-red-200 text-red-800';
                statusBadge.textContent = '危險';
                timeSection.className = 'bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-5 border border-red-200 text-center transition-all';
            } else if (bac > 0.05) {
                statusBar.className = 'px-5 py-3 flex items-center justify-between bg-orange-50 border-b border-orange-100 transition-all';
                statusIcon.textContent = '⚠️';
                statusText.textContent = '超過酒駕標準';
                statusText.className = 'text-sm font-bold text-orange-700';
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-orange-200 text-orange-800';
                statusBadge.textContent = '酒駕';
                timeSection.className = 'bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 text-center transition-all';
            } else if (bac > 0.03) {
                statusBar.className = 'px-5 py-3 flex items-center justify-between bg-amber-50 border-b border-amber-100 transition-all';
                statusIcon.textContent = '😵‍💫';
                statusText.textContent = '台灣已達酒駕標準';
                statusText.className = 'text-sm font-bold text-amber-700';
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-800';
                statusBadge.textContent = '注意';
                timeSection.className = 'bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 text-center transition-all';
            } else if (bac > 0.02) {
                statusBar.className = 'px-5 py-3 flex items-center justify-between bg-yellow-50 border-b border-yellow-100 transition-all';
                statusIcon.textContent = '😏';
                statusText.textContent = '微醺狀態';
                statusText.className = 'text-sm font-bold text-yellow-700';
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800';
                statusBadge.textContent = '微醺';
                timeSection.className = 'bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100 text-center transition-all';
            } else {
                statusBar.className = 'px-5 py-3 flex items-center justify-between bg-emerald-50 border-b border-emerald-100 transition-all';
                statusIcon.textContent = '😊';
                statusText.textContent = '清醒狀態';
                statusText.className = 'text-sm font-bold text-emerald-700';
                statusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800';
                statusBadge.textContent = '安全';
                timeSection.className = 'bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center transition-all';
            }
        }

        function highlightLevel(bac) {
            const levels = [
                { id: 'alc-level-0', min: 0, max: 0.02 },
                { id: 'alc-level-1', min: 0.02, max: 0.05 },
                { id: 'alc-level-2', min: 0.05, max: 0.08 },
                { id: 'alc-level-3', min: 0.08, max: Infinity }
            ];

            levels.forEach(level => {
                const el = document.getElementById(level.id);
                if (bac >= level.min && bac < level.max) {
                    el.classList.add('bg-amber-50', 'ring-1', 'ring-amber-200');
                } else {
                    el.classList.remove('bg-amber-50', 'ring-1', 'ring-amber-200');
                }
            });
        }

        // 初始計算
        calculate();
    }, 0);
};
