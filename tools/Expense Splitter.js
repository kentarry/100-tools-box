window.render_expenseSplitter = function (containerElement) {
    // 確保容器存在，避免工具尚未載入的錯誤
    const targetContainer = containerElement || document.getElementById('tool-container') || document.body;

    if (!targetContainer) {
        console.error("無法初始化多人分帳計算機：找不到目標容器");
        return;
    }

    // 建立獨立的 Wrapper，避免與其他 99 個工具產生 ID 或 Class 衝突
    const wrapper = document.createElement('div');
    // 限制最大寬度以符合「不是全螢幕」的需求，並加入現代化 UI 設計
    wrapper.className = 'w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]';

    wrapper.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                <span class="text-3xl">💸</span> 輕鬆分帳
            </h3>
            <span class="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">工具 #01</span>
        </div>
        
        <div class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <label class="text-sm font-bold text-slate-700">總金額 (NT$)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input type="number" class="split-total w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" placeholder="1000" min="1">
                    </div>
                </div>
                <div class="space-y-1.5">
                    <label class="text-sm font-bold text-slate-700">分攤人數</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">👥</span>
                        <input type="number" class="split-count w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" placeholder="2" min="2">
                    </div>
                </div>
            </div>
            
            <div class="space-y-1.5">
                <label class="text-sm font-bold text-slate-700">品項說明 <span class="text-slate-400 font-normal">(選填)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">📝</span>
                    <input type="text" class="split-desc w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none" placeholder="例如：週末聚餐、好樂迪 KTV">
                </div>
            </div>

            <div class="split-error hidden text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> <span class="error-msg">請輸入正確的金額與人數</span>
            </div>

            <button class="calc-split-btn w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-md shadow-blue-500/25 transition-all flex justify-center items-center gap-2">
                ✨ 開始計算
            </button>
        </div>
        
        <div class="split-result-area hidden mt-6 pt-6 border-t border-slate-100 animate-[fadeIn_0.3s_ease-in-out]">
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-bold text-slate-700">💬 複製專屬請款文案</p>
            </div>
            <div class="relative group">
                <div class="split-copy-text whitespace-pre-wrap font-sans text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-sm leading-relaxed selection:bg-blue-100"></div>
            </div>
            <button class="copy-split-btn w-full py-3 bg-slate-800 text-white font-medium rounded-xl text-sm hover:bg-slate-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                📋 一鍵複製至 LINE
            </button>
        </div>
    `;

    // 清空容器並掛載新元素，這保證了 DOM 元素是同步建立的，不需要 setTimeout
    targetContainer.innerHTML = '';
    targetContainer.appendChild(wrapper);

    // 透過 wrapper.querySelector 綁定事件，避免與頁面上其他工具的 ID 衝突
    const calcBtn = wrapper.querySelector('.calc-split-btn');
    const totalInput = wrapper.querySelector('.split-total');
    const countInput = wrapper.querySelector('.split-count');
    const descInput = wrapper.querySelector('.split-desc');
    const resultArea = wrapper.querySelector('.split-result-area');
    const copyText = wrapper.querySelector('.split-copy-text');
    const copyBtn = wrapper.querySelector('.copy-split-btn');
    const errorBox = wrapper.querySelector('.split-error');
    const errorMsg = wrapper.querySelector('.error-msg');

    // 加入簡易的 CSS 動畫 (如果全域沒有定義的話)
    if (!document.getElementById('split-tool-styles')) {
        const style = document.createElement('style');
        style.id = 'split-tool-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    calcBtn.addEventListener('click', () => {
        // 重置錯誤狀態
        errorBox.classList.add('hidden');
        totalInput.classList.remove('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/20');
        countInput.classList.remove('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/20');

        const total = parseFloat(totalInput.value);
        const count = parseInt(countInput.value);
        const desc = descInput.value.trim() || '共同花費';

        // 驗證邏輯與友善的 UI 反饋 (取代原本的 alert)
        let hasError = false;
        if (!total || total <= 0) {
            totalInput.classList.add('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/20');
            hasError = true;
        }
        if (!count || count <= 1) {
            countInput.classList.add('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/20');
            hasError = true;
        }

        if (hasError) {
            errorMsg.textContent = !count || count <= 1 ? '分攤人數至少需要 2 人哦！' : '請輸入正確的金額與人數';
            errorBox.classList.remove('hidden');
            resultArea.classList.add('hidden');
            return;
        }

        // 使用 Math.ceil 無條件進位，確保收款方不會因為除不盡而虧錢
        const perPerson = Math.ceil(total / count);
        const text = `💰【${desc}】分帳清單\n-------------------\n🔹 總金額：$${total}\n🔹 分攤人數：${count} 人\n🔥 每人應付：$${perPerson}\n-------------------\n麻煩大家確認後匯款給我囉，感謝！🙏`;

        copyText.textContent = text;
        resultArea.classList.remove('hidden');
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyText.textContent);
            // 成功複製的視覺回饋
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = "✅ 已成功複製！快去貼上吧";
            copyBtn.classList.replace('bg-slate-800', 'bg-emerald-600');
            copyBtn.classList.replace('hover:bg-slate-700', 'hover:bg-emerald-700');

            setTimeout(() => {
                copyBtn.innerHTML = "📋 一鍵複製至 LINE";
                copyBtn.classList.replace('bg-emerald-600', 'bg-slate-800');
                copyBtn.classList.replace('hover:bg-emerald-700', 'hover:bg-slate-700');
            }, 2500);
        } catch (err) {
            alert('複製失敗，請手動選取文字複製。');
        }
    });
};
