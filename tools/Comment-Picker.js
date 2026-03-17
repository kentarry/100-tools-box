window.render_commentPicker = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-xl font-bold mb-4">🎁 抽獎留言清洗器</h3>
            <textarea id="commentInput" class="w-full h-48 p-4 border rounded-xl mb-4 text-sm" placeholder="請貼上所有人的留言帳號或內容，一人一行..."></textarea>
            
            <!-- 過濾選項 -->
            <div class="flex flex-col sm:flex-row gap-3 mb-4">
                <div class="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <span class="text-slate-400 pl-1 pr-2">🔍</span>
                    <input type="text" id="commentKeyword" class="flex-1 outline-none text-sm bg-transparent" placeholder="篩選關鍵字 (選填)">
                </div>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <input type="checkbox" id="commentExtractAt" class="w-4 h-4 text-indigo-500 rounded cursor-pointer">
                    <span class="text-sm font-medium text-slate-600">僅提取 @帳號</span>
                </label>
            </div>

            <div class="flex gap-4 items-center mb-6">
                <button id="cleanComments" class="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 active:scale-95 transition-all">1. 清洗重複並打亂</button>
                <div class="text-slate-400 text-sm">剩下 <span id="cleanCount" class="font-bold text-emerald-600">0</span> 人</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-bold text-slate-700">2. 抽出幸運兒數量：</span>
                    <input type="number" id="pickNum" value="1" min="1" class="w-16 p-1 border rounded text-center">
                </div>
                <button id="pickWinner" class="w-full py-4 bg-rose-500 text-white font-bold rounded-xl text-lg shadow-md disabled:opacity-50 hover:bg-rose-600 active:scale-95 transition-all" disabled>立刻抽獎！</button>
            </div>
            <div id="winnerList" class="mt-4 grid grid-cols-2 gap-2"></div>
        </div>
    `;

    setTimeout(() => {
        let cleanList = [];
        const input = document.getElementById('commentInput');
        const countSpan = document.getElementById('cleanCount');
        const cleanBtn = document.getElementById('cleanComments');
        const pickBtn = document.getElementById('pickWinner');
        const winnerList = document.getElementById('winnerList');
        const keywordInput = document.getElementById('commentKeyword');
        const extractAtCheckbox = document.getElementById('commentExtractAt');

        cleanBtn.onclick = () => {
            const rawText = input.value.trim();
            if (!rawText) { alert('請先貼上留言資料！'); return; }

            const keyword = keywordInput.value.trim().toLowerCase();
            const onlyAt = extractAtCheckbox.checked;

            let lines = rawText.split('\n').map(s => s.trim()).filter(s => s !== '');

            // 關鍵字篩選
            if (keyword) {
                lines = lines.filter(line => line.toLowerCase().includes(keyword));
            }

            let result = [];

            if (onlyAt) {
                // 僅提取 @帳號
                lines.forEach(line => {
                    const matches = line.match(/@[\w\.]+/g);
                    if (matches) result.push(...matches);
                });
            } else {
                result = lines;
            }

            // 去重
            cleanList = [...new Set(result)];
            // 隨機打亂
            cleanList.sort(() => Math.random() - 0.5);

            countSpan.textContent = cleanList.length;
            if (cleanList.length > 0) pickBtn.disabled = false;
            else { pickBtn.disabled = true; alert('沒有找到符合條件的名單'); }
        };

        pickBtn.onclick = () => {
            const num = parseInt(document.getElementById('pickNum').value);
            winnerList.innerHTML = '';
            // 再次打亂確保公平
            cleanList.sort(() => Math.random() - 0.5);
            const winners = cleanList.slice(0, num);
            winners.forEach((w, i) => {
                const div = document.createElement('div');
                div.className = "p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-bold text-center animate-bounce";
                div.textContent = `🎊 第 ${i + 1} 位：${w}`;
                winnerList.appendChild(div);
            });
        };
    }, 0);
};
