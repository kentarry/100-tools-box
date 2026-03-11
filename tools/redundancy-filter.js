window.render_redundancyFilter = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold text-slate-800 mb-2">✂️ 職場文字「廢話過濾器」</h3>
            <p class="text-slate-500 text-sm mb-4">寫履歷或開發信時，冗言贅字會降低專業度。貼上文字，讓我們幫你抓出常見的廢話句型。</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <textarea id="bsInput" class="w-full h-80 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none text-slate-700 leading-relaxed" placeholder="請貼上你要檢查的文章..."></textarea>
                </div>
                <div class="relative">
                    <div id="bsOutput" class="w-full h-80 p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans">這裡會顯示檢查結果...</div>
                    <div class="absolute bottom-4 right-4 text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded shadow-sm">紅色為建議刪除或修改的詞彙</div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('bsInput');
        const output = document.getElementById('bsOutput');

        // 常見的冗言贅字與無意義轉折詞字典
        const badWords = [
            "基本上", "可以說是", "進行一個", "的動作", "在...的部分", "其實",
            "老實說", "那", "然後", "也就是說", "我自己覺得", "算是一個", "大概",
            "某種程度上", "相對來說", "總而言之", "不可否認的"
        ];

        function highlightBadWords(text) {
            if (!text) return '這裡會顯示檢查結果...';

            // 跳脫 HTML 防止 XSS
            let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            badWords.forEach(word => {
                const regex = new RegExp(`(${word.replace(/\./g, '\\.')})`, 'g');
                safeText = safeText.replace(regex, `<span class="bg-rose-200 text-rose-900 font-bold px-1 rounded mx-0.5" title="建議精簡此詞彙">$1</span>`);
            });

            return safeText;
        }

        input.addEventListener('input', (e) => {
            output.innerHTML = highlightBadWords(e.target.value);
        });
    }, 0);
};