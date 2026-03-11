window.render_panguSpacing = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold text-slate-800 mb-2">📝 中英夾雜「盤古之白」排版器</h3>
            <p class="text-slate-500 text-sm mb-4">貼上你的文章，一鍵自動在中文與半形英文/數字之間加入空白，讓排版更專業舒適。</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="font-bold text-slate-700 mb-2 block">原始文字 (未排版)</label>
                    <textarea id="panguInput" class="w-full h-64 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="請貼上你的文字，例如：我的iPhone15Pro真好用"></textarea>
                </div>
                <div>
                    <label class="font-bold text-slate-700 mb-2 block">處理結果</label>
                    <textarea id="panguOutput" class="w-full h-64 p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 outline-none resize-none" readonly placeholder="排版後的文字會顯示在這裡..."></textarea>
                </div>
            </div>
            
            <button id="panguBtn" class="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md transition text-lg">
                ✨ 一鍵加入盤古之白並複製
            </button>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('panguInput');
        const output = document.getElementById('panguOutput');
        const btn = document.getElementById('panguBtn');

        function addPanguSpacing(text) {
            // 在中文和英文字母/數字之間加入空格
            let newText = text.replace(/([\u4e00-\u9fa5]+)([a-zA-Z0-9]+)/g, '$1 $2');
            newText = newText.replace(/([a-zA-Z0-9]+)([\u4e00-\u9fa5]+)/g, '$1 $2');

            // 處理標點符號的空格 (選用功能，這裡處理常見的左右括號)
            newText = newText.replace(/([\u4e00-\u9fa5]+)([\(\[\{])/g, '$1 $2');
            newText = newText.replace(/([\)\]\}])([\u4e00-\u9fa5]+)/g, '$1 $2');
            return newText;
        }

        btn.addEventListener('click', () => {
            if (!input.value.trim()) return alert('請先輸入文字！');

            const result = addPanguSpacing(input.value);
            output.value = result;

            output.select();
            document.execCommand('copy');

            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ 已處理並複製到剪貼簿！';
            btn.classList.remove('bg-indigo-500', 'hover:bg-indigo-600');
            btn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.add('bg-indigo-500', 'hover:bg-indigo-600');
                btn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
            }, 2000);
        });
    }, 0);
};