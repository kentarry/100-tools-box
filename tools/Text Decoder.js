window.render_textDecoder = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold text-slate-800 mb-2">🔣 亂碼與編碼還原器</h3>
            <p class="text-slate-500 text-sm mb-4">自動解析 URL 編碼 (如 %E4%BD...) 或 Base64 亂碼，轉回正常文字。</p>
            
            <textarea id="decodeInput" class="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4" placeholder="請貼上亂碼或編碼文字..."></textarea>
            
            <div class="flex gap-2 mb-4">
                <button id="btnUrlDecode" class="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded transition">URL 解碼</button>
                <button id="btnBase64Decode" class="flex-1 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded transition">Base64 解碼</button>
                <button id="btnClear" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded transition">清空</button>
            </div>

            <label class="font-bold text-slate-700 mb-2 block">還原結果：</label>
            <div id="decodeOutput" class="w-full min-h-[8rem] p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 break-all whitespace-pre-wrap font-mono"></div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('decodeInput');
        const output = document.getElementById('decodeOutput');

        document.getElementById('btnUrlDecode').addEventListener('click', () => {
            try {
                output.textContent = decodeURIComponent(input.value);
                output.classList.remove('text-red-500');
            } catch (e) {
                output.textContent = '❌ 無效的 URL 編碼格式';
                output.classList.add('text-red-500');
            }
        });

        document.getElementById('btnBase64Decode').addEventListener('click', () => {
            try {
                // 處理中文 Base64 需要先 escape 再 decodeURIComponent
                const decodedStr = decodeURIComponent(escape(window.atob(input.value)));
                output.textContent = decodedStr;
                output.classList.remove('text-red-500');
            } catch (e) {
                output.textContent = '❌ 無效的 Base64 格式，或包含非文字資料';
                output.classList.add('text-red-500');
            }
        });

        document.getElementById('btnClear').addEventListener('click', () => {
            input.value = '';
            output.textContent = '';
        });
    }, 0);
};