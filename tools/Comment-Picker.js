window.render_commentPicker = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 class="text-xl font-bold mb-4">🎁 抽獎留言清洗器</h3>
            <textarea id="commentInput" class="w-full h-48 p-4 border rounded-xl mb-4 text-sm" placeholder="請貼上所有人的留言帳號或內容，一人一行..."></textarea>
            <div class="flex gap-4 items-center mb-6">
                <button id="cleanComments" class="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl">1. 清洗重複並打亂</button>
                <div class="text-slate-400 text-sm">剩下 <span id="cleanCount" class="font-bold text-emerald-600">0</span> 人</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-bold text-slate-700">2. 抽出幸運兒數量：</span>
                    <input type="number" id="pickNum" value="1" class="w-16 p-1 border rounded text-center">
                </div>
                <button id="pickWinner" class="w-full py-4 bg-rose-500 text-white font-bold rounded-xl text-lg shadow-md disabled:opacity-50" disabled>立刻抽獎！</button>
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

        cleanBtn.onclick = () => {
            const raw = input.value.split('\n').map(s => s.trim()).filter(s => s !== '');
            cleanList = [...new Set(raw)]; // 去重
            cleanList.sort(() => Math.random() - 0.5); // 隨機打亂
            countSpan.textContent = cleanList.length;
            if (cleanList.length > 0) pickBtn.disabled = false;
        };

        pickBtn.onclick = () => {
            const num = parseInt(document.getElementById('pickNum').value);
            winnerList.innerHTML = '';
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
