window.render_expenseSplitter = function (containerElement) {
    const targetContainer = containerElement || document.getElementById('tool-container') || document.body;
    if (!targetContainer) {
        console.error("無法初始化進階多人分帳計算機：找不到目標容器");
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all';

    // 核心資料狀態
    let members = [];
    let expenses = [];

    wrapper.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-2">
                <span class="text-3xl">🧮</span> 終極精算分帳
            </h3>
            <span class="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">支援單筆勾選</span>
        </div>
        
        <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-6 space-y-3">
            <h4 class="text-sm font-bold text-slate-700">📌 步驟一：加入所有參與者</h4>
            <div class="flex gap-2">
                <input type="text" class="split-member-input flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" placeholder="輸入名字 (例如: 小明)">
                <button class="split-add-member-btn px-4 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all text-sm whitespace-nowrap">
                    加人
                </button>
            </div>
            <div class="split-member-chips flex flex-wrap gap-2 pt-2 empty:hidden"></div>
            <div class="split-member-error hidden text-xs text-red-500 font-medium">⚠️ 名字不能重複或空白</div>
        </div>

        <div class="split-expense-section hidden bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100 mb-6 space-y-4">
            <h4 class="text-sm font-bold text-blue-800">✍️ 步驟二：新增消費明細</h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500">誰先墊錢？</label>
                    <select class="split-payer-select w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm cursor-pointer"></select>
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-500">品項名稱</label>
                    <input type="text" class="split-item w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm" placeholder="例: 晚餐">
                </div>
                <div class="space-y-1 sm:col-span-2">
                    <label class="text-xs font-bold text-slate-500">代墊總金額</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                        <input type="number" class="split-amount w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm" placeholder="輸入金額" min="0">
                    </div>
                </div>
            </div>

            <div class="space-y-2 pt-2 border-t border-blue-100">
                <label class="text-xs font-bold text-slate-500 flex items-center justify-between">
                    <span>這筆誰要分攤？(預設全選)</span>
                    <button class="split-select-all text-blue-600 hover:text-blue-800 transition-colors">全選 / 全不選</button>
                </label>
                <div class="split-sharers-container grid grid-cols-2 sm:grid-cols-3 gap-2"></div>
            </div>

            <button class="split-add-expense-btn w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 shadow-sm mt-2">
                ➕ 加入這筆帳單
            </button>
            <div class="split-expense-error hidden text-xs text-red-500 font-medium text-center">⚠️ 請檢查金額，且至少需勾選一人分攤</div>
        </div>

        <div class="split-list-section hidden mb-6">
            <h4 class="text-sm font-bold text-slate-700 mb-3 pl-1 flex justify-between">
                <span>📋 目前帳單清單</span>
                <span class="split-total-badge text-blue-600 font-black"></span>
            </h4>
            <div class="split-list space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar"></div>
        </div>

        <button class="split-calc-btn w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-bold rounded-xl hover:from-slate-900 hover:to-slate-800 active:scale-[0.98] shadow-md transition-all flex justify-center items-center gap-2 opacity-50 cursor-not-allowed hidden" disabled>
            ✨ 產生精算報告
        </button>
        
        <div class="split-result-area hidden mt-6 pt-6 border-t border-slate-100 animate-[fadeIn_0.3s_ease-in-out]">
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-bold text-slate-700">💬 專屬請款文案</p>
            </div>
            <div class="split-copy-text whitespace-pre-wrap font-mono text-slate-700 bg-violet-50/50 p-4 sm:p-5 rounded-xl border border-violet-100 mb-4 text-sm leading-relaxed selection:bg-violet-200"></div>
            <button class="split-copy-btn w-full py-3 bg-violet-600 text-white font-medium rounded-xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                📋 一鍵複製至 LINE
            </button>
        </div>
    `;

    targetContainer.innerHTML = '';
    targetContainer.appendChild(wrapper);

    // CSS 樣式 (主要針對卷軸)
    if (!document.getElementById('split-tool-styles')) {
        const style = document.createElement('style');
        style.id = 'split-tool-styles';
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            .checkbox-custom:checked + div { background-color: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
            .checkbox-custom:checked + div svg { opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    // --- DOM 元素綁定 ---
    const memberInput = wrapper.querySelector('.split-member-input');
    const addMemberBtn = wrapper.querySelector('.split-add-member-btn');
    const memberChips = wrapper.querySelector('.split-member-chips');
    const memberError = wrapper.querySelector('.split-member-error');

    const expenseSection = wrapper.querySelector('.split-expense-section');
    const payerSelect = wrapper.querySelector('.split-payer-select');
    const itemInput = wrapper.querySelector('.split-item');
    const amountInput = wrapper.querySelector('.split-amount');
    const sharersContainer = wrapper.querySelector('.split-sharers-container');
    const selectAllBtn = wrapper.querySelector('.split-select-all');
    const addExpenseBtn = wrapper.querySelector('.split-add-expense-btn');
    const expenseError = wrapper.querySelector('.split-expense-error');

    const listSection = wrapper.querySelector('.split-list-section');
    const listContainer = wrapper.querySelector('.split-list');
    const totalBadge = wrapper.querySelector('.split-total-badge');
    const calcBtn = wrapper.querySelector('.split-calc-btn');
    const resultArea = wrapper.querySelector('.split-result-area');
    const copyText = wrapper.querySelector('.split-copy-text');
    const copyBtn = wrapper.querySelector('.split-copy-btn');

    // --- 邏輯：更新 UI 狀態 ---
    const updateUI = () => {
        // 渲染成員標籤
        memberChips.innerHTML = members.map(m => `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm">
                ${m}
                <button data-name="${m}" class="split-remove-member text-slate-400 hover:text-red-500 font-bold ml-1 transition-colors">×</button>
            </span>
        `).join('');

        // 綁定刪除成員事件
        wrapper.querySelectorAll('.split-remove-member').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                // 檢查是否已在帳單中
                if (expenses.some(exp => exp.payer === name || exp.sharers.includes(name))) {
                    alert(`「${name}」已經在帳單紀錄中囉！請先刪除相關帳單再移除成員。`);
                    return;
                }
                members = members.filter(m => m !== name);
                updateUI();
            });
        });

        // 滿 2 人才開放新增帳單
        if (members.length >= 2) {
            expenseSection.classList.remove('hidden');

            // 更新付款人選單
            const currentPayer = payerSelect.value;
            payerSelect.innerHTML = members.map(m => `<option value="${m}">${m}</option>`).join('');
            if (members.includes(currentPayer)) payerSelect.value = currentPayer;

            // 更新分攤人 Checkbox (保留原本的勾選狀態)
            const currentChecked = Array.from(sharersContainer.querySelectorAll('input:checked')).map(cb => cb.value);
            sharersContainer.innerHTML = members.map(m => `
                <label class="relative cursor-pointer group">
                    <input type="checkbox" value="${m}" class="checkbox-custom absolute opacity-0 w-0 h-0" ${currentChecked.length === 0 || currentChecked.includes(m) ? 'checked' : ''}>
                    <div class="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 transition-all hover:bg-slate-50">
                        <svg class="w-4 h-4 text-blue-600 opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        ${m}
                    </div>
                </label>
            `).join('');
        } else {
            expenseSection.classList.add('hidden');
        }

        // 渲染帳單列表
        if (expenses.length > 0) {
            listSection.classList.remove('hidden');
            calcBtn.classList.remove('hidden', 'opacity-50', 'cursor-not-allowed');
            calcBtn.disabled = false;

            let total = 0;
            listContainer.innerHTML = expenses.map((exp, idx) => {
                total += exp.amount;
                return `
                <div class="p-3 bg-white border border-slate-100 rounded-xl shadow-sm group">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">付款</span> ${exp.payer}
                                <span class="text-slate-400 font-normal">(${exp.item})</span>
                            </div>
                            <div class="text-xs text-slate-500 mt-1.5 flex gap-1 flex-wrap">
                                <span class="text-slate-700 font-medium mr-1">分攤:</span>
                                ${exp.sharers.map(s => `<span class="bg-slate-100 px-1.5 py-0.5 rounded">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <span class="font-black text-blue-600">$${exp.amount}</span>
                            <button data-index="${idx}" class="split-delete-exp text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 rounded bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">刪除</button>
                        </div>
                    </div>
                </div>
            `}).join('');

            totalBadge.textContent = `總花費: $${total}`;

            wrapper.querySelectorAll('.split-delete-exp').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    expenses.splice(parseInt(e.target.getAttribute('data-index')), 1);
                    updateUI();
                });
            });
        } else {
            listSection.classList.add('hidden');
            calcBtn.classList.add('hidden');
            resultArea.classList.add('hidden');
        }
    };

    // --- 邏輯：新增成員 ---
    const handleAddMember = () => {
        const name = memberInput.value.trim();
        if (!name || members.includes(name)) {
            memberError.classList.remove('hidden');
            return;
        }
        memberError.classList.add('hidden');
        members.push(name);
        memberInput.value = '';
        updateUI();
        memberInput.focus();
    };
    addMemberBtn.addEventListener('click', handleAddMember);
    memberInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddMember(); });

    // --- 邏輯：全選/全不選分攤人 ---
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = sharersContainer.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
    });

    // --- 邏輯：新增帳單明細 ---
    addExpenseBtn.addEventListener('click', () => {
        const payer = payerSelect.value;
        const item = itemInput.value.trim() || '共同花費';
        const amount = parseFloat(amountInput.value);
        const sharers = Array.from(sharersContainer.querySelectorAll('input:checked')).map(cb => cb.value);

        if (isNaN(amount) || amount <= 0 || sharers.length === 0) {
            expenseError.classList.remove('hidden');
            return;
        }

        expenseError.classList.add('hidden');
        expenses.push({ payer, item, amount, sharers });

        itemInput.value = '';
        amountInput.value = '';
        // 預設恢復全選
        sharersContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        updateUI();
    });

    // --- 邏輯：精算結算演算法 ---
    calcBtn.addEventListener('click', () => {
        // 1. 初始化每個人的帳戶餘額 (正數=該收錢，負數=該付錢)
        const balances = {};
        members.forEach(m => balances[m] = 0);

        let totalAmount = 0;

        // 2. 結算每一筆帳單
        expenses.forEach(exp => {
            totalAmount += exp.amount;
            // 付款人先墊錢，所以他的餘額增加
            balances[exp.payer] += exp.amount;

            // 算出這筆帳單每個人該分攤多少
            const splitAmount = exp.amount / exp.sharers.length;

            // 參與分攤的人，餘額扣除
            exp.sharers.forEach(sharer => {
                balances[sharer] -= splitAmount;
            });
        });

        // 3. 區分債權人(應收)與債務人(應付)
        const debtors = [];
        const creditors = [];

        for (const [person, balance] of Object.entries(balances)) {
            if (balance < -0.01) debtors.push({ person, balance: balance });
            else if (balance > 0.01) creditors.push({ person, balance: balance });
        }

        // 金額排序，大配大，減少交易次數
        debtors.sort((a, b) => a.balance - b.balance);
        creditors.sort((a, b) => b.balance - a.balance);

        const transactions = [];
        let d = 0, c = 0;

        // 4. 配對還款演算法
        while (d < debtors.length && c < creditors.length) {
            const debtor = debtors[d];
            const creditor = creditors[c];

            const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance);

            if (amountToSettle > 0.01) {
                transactions.push({
                    from: debtor.person,
                    to: creditor.person,
                    amount: Math.ceil(amountToSettle) // 無條件進位，避免小數點找不開
                });
            }

            debtor.balance += amountToSettle;
            creditor.balance -= amountToSettle;

            if (Math.abs(debtor.balance) < 0.01) d++;
            if (creditor.balance < 0.01) c++;
        }

        // 5. 產生報告文字
        let reportText = `💰 終極精算分帳清單\n-------------------\n`;
        reportText += `👥 總參與人數：${members.length} 人\n`;
        reportText += `💵 總花費金額：$${totalAmount}\n`;
        reportText += `📌 帳單明細：\n`;
        expenses.forEach(exp => {
            reportText += `  - ${exp.item} ($${exp.amount}) 👉 [${exp.payer}]墊付\n`;
        });
        reportText += `-------------------\n`;
        reportText += `【最終轉帳建議】\n`;

        if (transactions.length === 0) {
            reportText += `🎉 大家都剛好打平，不用互相轉帳！`;
        } else {
            transactions.forEach(t => {
                reportText += `👉 [${t.from}] 請匯給 [${t.to}] $${t.amount}\n`;
            });
            reportText += `\n麻煩大家確認後進行轉帳囉，感謝！🙏`;
        }

        copyText.textContent = reportText;
        resultArea.classList.remove('hidden');
    });

    // 複製按鈕功能
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyText.textContent);
            copyBtn.innerHTML = "✅ 已成功複製！快去貼上吧";
            copyBtn.classList.replace('bg-violet-600', 'bg-emerald-600');
            copyBtn.classList.replace('hover:bg-violet-700', 'hover:bg-emerald-700');
            setTimeout(() => {
                copyBtn.innerHTML = "📋 一鍵複製至 LINE";
                copyBtn.classList.replace('bg-emerald-600', 'bg-violet-600');
                copyBtn.classList.replace('hover:bg-emerald-700', 'hover:bg-violet-700');
            }, 2500);
        } catch (err) {
            alert('複製失敗，請手動選取文字複製。');
        }
    });
};
