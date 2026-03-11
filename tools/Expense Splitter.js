window.render_expenseSplitter = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold mb-4 flex items-center">💸 多人分帳計算機</h3>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-bold text-slate-600">總金額 (NT$)</label>
                        <input type="number" id="splitTotal" class="w-full p-2 border rounded-lg" placeholder="1000">
                    </div>
                    <div>
                        <label class="text-sm font-bold text-slate-600">分攤人數</label>
                        <input type="number" id="splitCount" class="w-full p-2 border rounded-lg" placeholder="2">
                    </div>
                </div>
                <div>
                    <label class="text-sm font-bold text-slate-600">品項說明 (如：晚餐、KTV)</label>
                    <input type="text" id="splitDesc" class="w-full p-2 border rounded-lg" placeholder="聚餐">
                </div>
                <button id="calcSplit" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">計算結果</button>
            </div>
            
            <div id="splitResultArea" class="hidden mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p class="text-sm text-slate-500 mb-2">預覽文案：</p>
                <div id="splitCopyText" class="whitespace-pre-wrap font-sans text-slate-800 bg-white p-4 rounded border mb-4"></div>
                <button id="copySplitBtn" class="w-full py-2 bg-slate-800 text-white rounded-lg text-sm">📋 複製文案到 LINE</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        const calcBtn = document.getElementById('calcSplit');
        const totalInput = document.getElementById('splitTotal');
        const countInput = document.getElementById('splitCount');
        const descInput = document.getElementById('splitDesc');
        const resultArea = document.getElementById('splitResultArea');
        const copyText = document.getElementById('splitCopyText');
        const copyBtn = document.getElementById('copySplitBtn');

        calcBtn.onclick = () => {
            const total = parseFloat(totalInput.value);
            const count = parseInt(countInput.value);
            const desc = descInput.value || '費用';

            if (!total || !count || count <= 0) return alert('請輸入正確金額與人數');

            const perPerson = Math.ceil(total / count);
            const text = `💰【${desc}】分帳清單\n-------------------\n總金額：$${total}\n分攤人數：${count}\n每人應付：$${perPerson}\n\n麻煩大家匯款給我囉，謝謝！🙏`;

            copyText.textContent = text;
            resultArea.classList.remove('hidden');
        };

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(copyText.textContent);
            copyBtn.textContent = "✅ 已複製到剪貼簿";
            setTimeout(() => copyBtn.textContent = "📋 複製文案到 LINE", 2000);
        };
    }, 0);
};