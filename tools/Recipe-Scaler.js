window.render_recipeScaler = function () {
    container.innerHTML = `
        <div class="w-full max-w-2xl mx-auto font-sans">

            <!-- 標題區塊 -->
            <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg">
                <h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <span class="text-3xl">🍳</span> 食譜份量換算
                </h3>
                <p class="text-amber-100 text-sm mt-1 opacity-90">自動換算食材用量，溫度與時間不受影響</p>
            </div>

            <!-- 人數設定卡片 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
                    <!-- 原食譜人數 -->
                    <div class="w-full text-center">
                        <label class="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">原食譜人數</label>
                        <div class="flex items-center justify-center gap-3">
                            <button id="rs-orig-minus" class="w-11 h-11 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">−</button>
                            <span id="rs-orig-display" class="text-4xl font-extrabold text-slate-800 w-12 text-center tabular-nums select-none">4</span>
                            <button id="rs-orig-plus" class="w-11 h-11 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">+</button>
                        </div>
                        <span class="text-xs text-slate-400 mt-1 block">人份</span>
                    </div>

                    <!-- 箭頭 -->
                    <div class="text-slate-300 flex-shrink-0 hidden sm:block">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <div class="text-slate-300 flex-shrink-0 sm:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>

                    <!-- 目標人數 -->
                    <div class="w-full text-center">
                        <label class="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">目標人數</label>
                        <div class="flex items-center justify-center gap-3">
                            <button id="rs-target-minus" class="w-11 h-11 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">−</button>
                            <span id="rs-target-display" class="text-4xl font-extrabold text-orange-600 w-12 text-center tabular-nums select-none">2</span>
                            <button id="rs-target-plus" class="w-11 h-11 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer select-none">+</button>
                        </div>
                        <span class="text-xs text-slate-400 mt-1 block">人份</span>
                    </div>
                </div>

                <!-- 倍率與快捷按鈕 -->
                <div class="mt-5 pt-4 border-t border-slate-100">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div id="rs-ratio-badge" class="text-sm font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 tabular-nums">×0.5</div>
                        <div class="flex gap-2 flex-wrap">
                            <button class="rs-quick-btn px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all cursor-pointer" data-ratio="0.5">½ 半份</button>
                            <button class="rs-quick-btn px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-pointer" data-ratio="1">1× 原份</button>
                            <button class="rs-quick-btn px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all cursor-pointer" data-ratio="2">2× 雙倍</button>
                            <button class="rs-quick-btn px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all cursor-pointer" data-ratio="3">3× 三倍</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 食譜輸入區 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <label for="rs-input" class="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <span>📋</span> 原始食譜
                    </label>
                    <div class="flex gap-2">
                        <span class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">⏭️ 自動跳過溫度與時間</span>
                    </div>
                </div>
                <textarea id="rs-input" class="w-full min-h-[160px] p-4 border border-slate-200 rounded-xl text-slate-700 text-base leading-relaxed focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all resize-y bg-slate-50/50 placeholder:text-slate-400" placeholder="貼上或輸入食譜內容…&#10;&#10;範例：&#10;雞蛋 4 顆&#10;低筋麵粉 200 g&#10;牛奶 150 ml&#10;糖 80 g&#10;以 180 度烤 30 分鐘"></textarea>

                <!-- 常用食材快速輸入 -->
                <div class="mt-3">
                    <div class="text-xs font-bold text-slate-400 mb-2">⚡ 快速加入常用食材：</div>
                    <div class="flex flex-wrap gap-1.5">
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="雞蛋 2 顆">🥚 雞蛋</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="低筋麵粉 200 g">🌾 麵粉</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="砂糖 100 g">🍬 糖</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="無鹽奶油 50 g">🧈 奶油</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="牛奶 200 ml">🥛 牛奶</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="鹽 3 g">🧂 鹽</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="醬油 2 大匙">🫙 醬油</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="蒜頭 3 瓣">🧄 蒜頭</button>
                        <button class="rs-ingredient-btn px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer" data-text="水 300 ml">💧 水</button>
                    </div>
                </div>
            </div>

            <!-- 換算結果區 -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <label class="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <span>✨</span> 換算結果
                    </label>
                    <div class="flex gap-2">
                        <button id="rs-clear-btn" class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer" title="清空全部">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            清空
                        </button>
                        <button id="rs-copy-btn" class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer hidden" title="複製結果">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            複製
                        </button>
                    </div>
                </div>
                <div id="rs-output" class="w-full min-h-[120px] p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl text-slate-800 whitespace-pre-wrap leading-relaxed text-base">
                    <span class="text-slate-400 italic text-sm">換算結果將即時顯示於此…</span>
                </div>
            </div>

            <!-- 使用提示 -->
            <div class="text-center text-xs text-slate-400 py-2">
                💡 溫度（180度）、時間（30分鐘）、步驟編號（第1步）等數字不會被換算
            </div>
        </div>
    `;

    setTimeout(() => {
        // DOM References
        let origVal = 4;
        let targetVal = 2;

        const origDisplay = document.getElementById('rs-orig-display');
        const targetDisplay = document.getElementById('rs-target-display');
        const ratioBadge = document.getElementById('rs-ratio-badge');
        const recipeInput = document.getElementById('rs-input');
        const recipeOutput = document.getElementById('rs-output');
        const copyBtn = document.getElementById('rs-copy-btn');
        const clearBtn = document.getElementById('rs-clear-btn');

        // ===== 人數控制 =====
        function updateDisplay() {
            origDisplay.textContent = origVal;
            targetDisplay.textContent = targetVal;
            const ratio = targetVal / origVal;
            const ratioText = ratio === Math.floor(ratio) ? `×${ratio}` : `×${ratio.toFixed(2).replace(/0+$/, '')}`;
            ratioBadge.textContent = ratioText;

            // 倍率標籤顏色
            ratioBadge.className = 'text-sm font-bold px-3 py-1 rounded-full tabular-nums ';
            if (ratio < 1) {
                ratioBadge.classList.add('bg-amber-100', 'text-amber-700');
            } else if (ratio > 1) {
                ratioBadge.classList.add('bg-emerald-100', 'text-emerald-700');
            } else {
                ratioBadge.classList.add('bg-slate-100', 'text-slate-600');
            }

            scaleRecipe();
        }

        document.getElementById('rs-orig-minus').addEventListener('click', () => {
            if (origVal > 1) { origVal--; updateDisplay(); }
        });
        document.getElementById('rs-orig-plus').addEventListener('click', () => {
            if (origVal < 99) { origVal++; updateDisplay(); }
        });
        document.getElementById('rs-target-minus').addEventListener('click', () => {
            if (targetVal > 1) { targetVal--; updateDisplay(); }
        });
        document.getElementById('rs-target-plus').addEventListener('click', () => {
            if (targetVal < 99) { targetVal++; updateDisplay(); }
        });

        // ===== 快捷倍率按鈕 =====
        document.querySelectorAll('.rs-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ratio = parseFloat(btn.dataset.ratio);
                targetVal = Math.max(1, Math.round(origVal * ratio));
                updateDisplay();

                // 視覺回饋
                document.querySelectorAll('.rs-quick-btn').forEach(b => {
                    b.classList.remove('ring-2', 'ring-orange-400', 'bg-orange-50');
                });
                btn.classList.add('ring-2', 'ring-orange-400', 'bg-orange-50');
            });
        });

        // ===== 快速加入食材 =====
        document.querySelectorAll('.rs-ingredient-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                const current = recipeInput.value;
                recipeInput.value = current ? current + '\n' + text : text;
                recipeInput.scrollTop = recipeInput.scrollHeight;
                scaleRecipe();

                // 按鈕小動畫
                btn.style.transform = 'scale(0.92)';
                setTimeout(() => btn.style.transform = '', 150);
            });
        });

        // ===== 核心換算邏輯 =====
        function scaleRecipe() {
            const text = recipeInput.value;

            if (!text.trim()) {
                recipeOutput.innerHTML = '<span class="text-slate-400 italic text-sm">換算結果將即時顯示於此…</span>';
                copyBtn.classList.add('hidden');
                return;
            }

            const ratio = targetVal / origVal;

            // 逐行處理以支援高亮
            const lines = text.split('\n');
            const resultLines = lines.map(line => {
                const scaledLine = line.replace(/(\d+(\.\d+)?)/g, (match, p1, p2, offset, string) => {
                    const contextAfter = string.substring(offset + match.length, offset + match.length + 8);
                    const contextBefore = string.substring(Math.max(0, offset - 8), offset);

                    // 溫度、時間、步驟等不換算
                    const ignoreAfterRegex = /^\s*(度|°C|°F|℃|℉|分|分鐘|小時|hr|hours?|min|mins?|秒|seconds?)/i;
                    const ignoreBeforeRegex = /(第|步驟|step|Step)\s*$/i;

                    if (ignoreAfterRegex.test(contextAfter) || ignoreBeforeRegex.test(contextBefore)) {
                        return match;
                    }

                    let scaledVal = parseFloat(match) * ratio;
                    // 智能格式化
                    if (Number.isInteger(scaledVal)) {
                        return String(scaledVal);
                    }
                    scaledVal = Math.round(scaledVal * 100) / 100;
                    return String(scaledVal);
                });
                return scaledLine;
            });

            // 比較原始與換算結果，高亮變化的數字
            let htmlOutput = '';
            for (let i = 0; i < lines.length; i++) {
                if (lines[i] !== resultLines[i]) {
                    // 這行有數字被換算了，對變化的數字加上高亮
                    const highlighted = highlightChanges(lines[i], resultLines[i], ratio);
                    htmlOutput += highlighted + '\n';
                } else {
                    htmlOutput += escapeHtml(resultLines[i]) + '\n';
                }
            }

            recipeOutput.innerHTML = htmlOutput.trimEnd();
            copyBtn.classList.remove('hidden');
        }

        function highlightChanges(original, scaled, ratio) {
            // 找出所有數字並標記變化
            const numRegex = /(\d+(\.\d+)?)/g;
            let result = '';
            let lastIndex = 0;
            let matchOrig;
            const origMatches = [];

            while ((matchOrig = numRegex.exec(original)) !== null) {
                origMatches.push({ index: matchOrig.index, length: matchOrig[0].length, value: matchOrig[0] });
            }

            // 對 scaled 做同樣的事
            numRegex.lastIndex = 0;
            let matchScaled;
            const scaledMatches = [];
            while ((matchScaled = numRegex.exec(scaled)) !== null) {
                scaledMatches.push({ index: matchScaled.index, length: matchScaled[0].length, value: matchScaled[0] });
            }

            // 使用 scaled 文字重建 HTML，對不同的數字加高亮
            let scaledResult = '';
            let scaledLastIndex = 0;

            for (let j = 0; j < scaledMatches.length; j++) {
                const sm = scaledMatches[j];
                const om = origMatches[j];

                scaledResult += escapeHtml(scaled.substring(scaledLastIndex, sm.index));

                if (om && sm.value !== om.value) {
                    const colorClass = ratio > 1 ? 'color:#059669;font-weight:700;' : 'color:#d97706;font-weight:700;';
                    scaledResult += '<span style="' + colorClass + 'background:' + (ratio > 1 ? 'rgba(5,150,105,0.08)' : 'rgba(217,119,6,0.08)') + ';padding:0 2px;border-radius:3px;">' + escapeHtml(sm.value) + '</span>';
                } else {
                    scaledResult += escapeHtml(sm.value);
                }
                scaledLastIndex = sm.index + sm.length;
            }
            scaledResult += escapeHtml(scaled.substring(scaledLastIndex));
            return scaledResult;
        }

        function escapeHtml(str) {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // ===== 複製按鈕 =====
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(recipeOutput.textContent).then(() => {
                const origHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> 已複製！';
                copyBtn.classList.add('bg-emerald-100');
                setTimeout(() => {
                    copyBtn.innerHTML = origHTML;
                    copyBtn.classList.remove('bg-emerald-100');
                }, 1500);
            });
        });

        // ===== 清空按鈕 =====
        clearBtn.addEventListener('click', () => {
            recipeInput.value = '';
            scaleRecipe();
            recipeInput.focus();
        });

        // ===== 即時監聽輸入 =====
        recipeInput.addEventListener('input', scaleRecipe);

        // 初始倍率計算
        updateDisplay();
    }, 0);
};
