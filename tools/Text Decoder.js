window.render_textDecoder = function (targetContainer) {
    // 確保有正確的目標容器 (支援傳入容器參數，或 fallback 到全域變數 container)
    const domContainer = targetContainer || (typeof container !== 'undefined' ? container : document.body);

    // 1. 建立工具專屬的虛擬外層，避免與其他工具互相干擾
    const toolWrapper = document.createElement('div');
    toolWrapper.className = 'max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 transition-all';

    // 2. 設計現代化且直覺的 UI (不使用全域 ID，改用專屬 class 或 data 屬性)
    toolWrapper.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-50 text-blue-600 rounded-lg text-xl">🔣</div>
            <h3 class="text-2xl font-bold text-slate-800 tracking-tight">亂碼與編碼還原器</h3>
        </div>
        <p class="text-slate-500 text-sm mb-6 ml-1">自動解析 URL 編碼 (如 %E4%BD...) 或 Base64 亂碼，精準轉回正常文字。</p>
        
        <div class="relative mb-5">
            <textarea class="td-input w-full h-36 p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all text-slate-700 placeholder-slate-400" placeholder="請在此貼上您的 URL 亂碼或 Base64 編碼文字..."></textarea>
        </div>
        
        <div class="flex flex-wrap gap-3 mb-6">
            <button class="td-btn-url flex-1 min-w-[120px] py-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                URL 解碼
            </button>
            <button class="td-btn-base64 flex-1 min-w-[120px] py-3 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Base64 解碼
            </button>
            <button class="td-btn-clear px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all duration-200">
                清空
            </button>
        </div>

        <div class="flex items-center justify-between mb-3">
            <label class="font-bold text-slate-700">還原結果：</label>
            <button class="td-btn-copy hidden px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition">
                📋 複製結果
            </button>
        </div>
        
        <div class="relative">
            <div class="td-output w-full min-h-[10rem] p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 break-all whitespace-pre-wrap font-mono text-sm leading-relaxed">
                <span class="text-slate-400 italic">結果將顯示於此...</span>
            </div>
        </div>
    `;

    // 3. 在剛建立的 toolWrapper 內尋找 DOM (這保證了元素一定存在，無需 setTimeout)
    const input = toolWrapper.querySelector('.td-input');
    const output = toolWrapper.querySelector('.td-output');
    const btnUrl = toolWrapper.querySelector('.td-btn-url');
    const btnBase64 = toolWrapper.querySelector('.td-btn-base64');
    const btnClear = toolWrapper.querySelector('.td-btn-clear');
    const btnCopy = toolWrapper.querySelector('.td-btn-copy');

    // --- 輔助函數：更新輸出區狀態 ---
    const updateOutput = (text, isError = false) => {
        output.textContent = text;
        if (isError) {
            output.className = 'td-output w-full min-h-[10rem] p-4 border border-red-200 rounded-xl bg-red-50 text-red-600 break-all whitespace-pre-wrap font-mono text-sm leading-relaxed';
            btnCopy.classList.add('hidden'); // 錯誤時隱藏複製按鈕
        } else {
            output.className = 'td-output w-full min-h-[10rem] p-4 border border-emerald-200 rounded-xl bg-emerald-50 text-emerald-800 break-all whitespace-pre-wrap font-mono text-sm leading-relaxed shadow-inner';
            btnCopy.classList.remove('hidden'); // 成功時顯示複製按鈕
        }
    };

    // --- 事件綁定 ---
    btnUrl.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return updateOutput('請先輸入需要解碼的內容！', true);
        try {
            updateOutput(decodeURIComponent(val));
        } catch (e) {
            updateOutput('❌ 解碼失敗：無效的 URL 編碼格式。請確認內容是否正確。', true);
        }
    });

    btnBase64.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return updateOutput('請先輸入需要解碼的內容！', true);
        try {
            // 使用現代的 TextDecoder 處理 Base64，完美解決各國語言與 emoji 的 UTF-8 解析問題
            const binaryString = window.atob(val);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const decodedStr = new TextDecoder('utf-8').decode(bytes);
            updateOutput(decodedStr);
        } catch (e) {
            updateOutput('❌ 解碼失敗：無效的 Base64 格式，或包含非文字資料。', true);
        }
    });

    btnClear.addEventListener('click', () => {
        input.value = '';
        output.innerHTML = '<span class="text-slate-400 italic">結果將顯示於此...</span>';
        output.className = 'td-output w-full min-h-[10rem] p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 break-all whitespace-pre-wrap font-mono text-sm leading-relaxed';
        btnCopy.classList.add('hidden');
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = '✅ 已複製！';
            btnCopy.classList.add('bg-emerald-100', 'text-emerald-700');
            setTimeout(() => {
                btnCopy.textContent = originalText;
                btnCopy.classList.remove('bg-emerald-100', 'text-emerald-700');
            }, 2000);
        });
    });

    // 4. 最後一步：清空原本的容器並放入我們構建好的工具 UI
    domContainer.innerHTML = '';
    domContainer.appendChild(toolWrapper);
};
