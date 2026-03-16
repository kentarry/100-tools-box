window.render_redundancyFilter = function () {
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('tool-container');
    if (!targetContainer) {
        console.error('找不到渲染目標容器 (container)。');
        return;
    }

    targetContainer.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span class="text-rose-500">✂️</span> 職場文字「廢話過濾器」
                </h3>
                <div class="flex gap-2">
                    <button id="bsBtnClear" class="px-3 py-1.5 text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                        清空內容
                    </button>
                    <button id="bsBtnOptimize" class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors shadow-sm">
                        ✨ 一鍵刪除廢話
                    </button>
                    <button id="bsBtnCopy" class="px-3 py-1.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors shadow-sm">
                        複製結果
                    </button>
                </div>
            </div>
            <p class="text-slate-500 text-sm mb-4">寫履歷、提案或開發信時，冗言贅字會大幅降低專業度。請貼上文字，系統將自動標記常見的廢話句型。</p>
            
            <div class="flex gap-4 mb-4 text-sm">
                <div class="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium border border-blue-100">
                    總字數：<span id="bsCharCount">0</span> 字
                </div>
                <div class="bg-rose-50 text-rose-700 px-3 py-2 rounded-lg font-medium border border-rose-100">
                    發現冗言：<span id="bsIssueCount">0</span> 處
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative group">
                    <textarea 
                        id="bsInput" 
                        class="w-full h-80 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none text-slate-700 leading-relaxed bg-slate-50 focus:bg-white transition-colors" 
                        placeholder="請貼上你要檢查的文章..."
                    ></textarea>
                </div>
                <div class="relative">
                    <div 
                        id="bsOutput" 
                        class="w-full h-80 p-4 border border-slate-300 rounded-xl bg-slate-100 text-slate-800 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans break-words"
                    >這裡會顯示檢查結果...</div>
                    <div class="absolute bottom-4 right-4 text-xs font-bold text-slate-500 bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm border border-slate-200 flex flex-col gap-1">
                        <div><span class="inline-block w-2 h-2 bg-rose-300 rounded-full mr-1"></span>紅色為建議刪除的詞彙</div>
                        <div><span class="inline-block w-2 h-2 bg-amber-300 rounded-full mr-1"></span>黃色為連續重複跳針文字</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 擴充字典：加入你的彩蛋與更多常見廢話
    const badWordsDictionary = [
        "基本上", "其實", "老實說", "那", "然後", "也就是說", "總而言之", "不可否認的", "總的來說", "說實話", "簡單來說",
        "進行一個", "的動作", "在...的部分", "針對...的部分", "做一個",
        "我自己覺得", "算是一個", "大概", "某種程度上", "相對來說",
        // 彩蛋專區
        "人每呼吸六十秒，生命就會減少一分鐘", "聽君一席話，如聽一席話"
    ].sort((a, b) => b.length - a.length);

    // 負責處理文字並渲染到畫面的函數
    function processText(text) {
        const charCountEl = targetContainer.querySelector('#bsCharCount');
        const issueCountEl = targetContainer.querySelector('#bsIssueCount');
        const outputEl = targetContainer.querySelector('#bsOutput');

        if (!text.trim()) {
            outputEl.innerHTML = '<span class="text-slate-400">這裡會顯示檢查結果...</span>';
            charCountEl.textContent = '0';
            issueCountEl.textContent = '0';
            return;
        }

        charCountEl.textContent = text.trim().length;

        // XSS 防護
        let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let issueCount = 0;

        // 1. 偵測「連續重複跳針」的廢話 (例如你剛剛貼的那一坨)
        // 尋找長度超過 5 個字，且連續重複出現 2 次以上的區塊
        const repeatRegex = /(.{5,})\1+/g;
        safeText = safeText.replace(repeatRegex, (match, p1) => {
            // 算一下重複了幾次
            const repeatTimes = match.length / p1.length;
            issueCount += (repeatTimes - 1);
            // 把第一句保留正常，後面重複的全部標黃色
            const repeatedPart = match.substring(p1.length);
            return `${p1}<span class="bg-amber-200 text-amber-900 font-bold px-1 rounded mx-0.5 border border-amber-300" title="這段文字連續跳針重複了！">${repeatedPart}</span>`;
        });

        // 2. 偵測「字典中」的冗言贅字
        badWordsDictionary.forEach(word => {
            const escapedWord = word.replace(/\./g, '\\.');
            const regex = new RegExp(`(${escapedWord})`, 'g');

            const matches = safeText.match(regex);
            if (matches) {
                // 如果該詞彙已經在剛剛的 HTML 標籤內，就不重複計算 (簡單排除)
                issueCount += matches.length;
                safeText = safeText.replace(regex, `<span class="bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded mx-0.5 border border-rose-300 shadow-sm" title="建議直接刪除">$1</span>`);
            }
        });

        issueCountEl.textContent = issueCount;
        outputEl.innerHTML = safeText;
    }

    // 綁定事件
    requestAnimationFrame(() => {
        const inputEl = targetContainer.querySelector('#bsInput');
        const btnClear = targetContainer.querySelector('#bsBtnClear');
        const btnOptimize = targetContainer.querySelector('#bsBtnOptimize');
        const btnCopy = targetContainer.querySelector('#bsBtnCopy');

        if (!inputEl) return;

        inputEl.addEventListener('input', (e) => processText(e.target.value));

        if (btnClear) {
            btnClear.addEventListener('click', () => {
                inputEl.value = '';
                processText('');
                inputEl.focus();
            });
        }

        // ✨ 核心新功能：一鍵刪除所有廢話與重複文字
        if (btnOptimize) {
            btnOptimize.addEventListener('click', () => {
                let currentText = inputEl.value;
                if (!currentText.trim()) return;

                // 1. 刪除字典內的贅字
                badWordsDictionary.forEach(word => {
                    const regex = new RegExp(word.replace(/\./g, '\\.'), 'g');
                    currentText = currentText.replace(regex, '');
                });

                // 2. 刪除連續重複的跳針文字 (只保留第一句)
                const repeatRegex = /(.{5,})\1+/g;
                currentText = currentText.replace(repeatRegex, '$1');

                // 3. 清理可能因為刪除而產生的多餘空白
                currentText = currentText.replace(/\s+/g, ' ').trim();

                // 更新回輸入框並重新渲染
                inputEl.value = currentText;
                processText(currentText);

                // 給予視覺回饋
                const originalText = btnOptimize.textContent;
                btnOptimize.textContent = '✅ 已幫你自動瘦身';
                setTimeout(() => btnOptimize.textContent = originalText, 2000);
            });
        }

        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                if (!inputEl.value.trim()) return alert('沒有內容可以複製喔！');
                navigator.clipboard.writeText(inputEl.value).then(() => {
                    const originalText = btnCopy.textContent;
                    btnCopy.textContent = '✅ 已複製！';
                    setTimeout(() => btnCopy.textContent = originalText, 2000);
                });
            });
        }
    });
};
