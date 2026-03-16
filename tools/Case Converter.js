// 建議將 container 當作參數傳入，確保元素存在，避免「工具尚未載入」的錯誤
window.render_caseConverter = function (container) {
    // 1. 安全檢查：如果沒有傳入 container，就嘗試抓取預設的容器 (請依你的專案修改)
    const targetContainer = container || document.getElementById('tool-container');

    if (!targetContainer) {
        console.error("找不到容器！請確保 HTML 中有對應的元素。");
        return;
    }

    // 2. 渲染 UI：升級 Tailwind CSS 介面，拿掉寫死的 ID，改用 Class
    targetContainer.innerHTML = `
        <div class="max-w-md w-full mx-auto bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span class="text-xl">🔠</span> 大小寫轉換
                </h3>
                <button class="copy-btn text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg transition-colors flex items-center gap-1">
                    📋 複製結果
                </button>
            </div>
            
            <textarea class="text-input w-full h-32 p-3 border border-slate-300 rounded-xl mb-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-shadow placeholder:text-slate-400" placeholder="請在此輸入英文內容 (Input Text...)"></textarea>
            
            <div class="grid grid-cols-2 gap-2">
                <button class="btn-upper py-2 px-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">UPPERCASE</button>
                <button class="btn-lower py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">lowercase</button>
                <button class="btn-title py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">Title Case</button>
                <button class="btn-sentence py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200">Sentence case</button>
            </div>
        </div>
    `;

    // 3. 綁定事件：使用 querySelector 只在這個 container 內找元素，完全避免與其他 99 個工具衝突
    const textarea = targetContainer.querySelector('.text-input');
    const btnUpper = targetContainer.querySelector('.btn-upper');
    const btnLower = targetContainer.querySelector('.btn-lower');
    const btnTitle = targetContainer.querySelector('.btn-title');
    const btnSentence = targetContainer.querySelector('.btn-sentence');
    const copyBtn = targetContainer.querySelector('.copy-btn');

    // 轉換為大寫
    btnUpper.addEventListener('click', () => {
        textarea.value = textarea.value.toUpperCase();
    });

    // 轉換為小寫
    btnLower.addEventListener('click', () => {
        textarea.value = textarea.value.toLowerCase();
    });

    // 轉換為首字母大寫 (Title Case)
    btnTitle.addEventListener('click', () => {
        textarea.value = textarea.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    });

    // 轉換為句首大寫 (Sentence case)
    btnSentence.addEventListener('click', () => {
        textarea.value = textarea.value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
    });

    // 一鍵複製功能 (提升使用者體驗)
    copyBtn.addEventListener('click', async () => {
        if (!textarea.value) return;
        try {
            await navigator.clipboard.writeText(textarea.value);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ 已複製！';
            copyBtn.classList.add('bg-green-100', 'text-green-700');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('bg-green-100', 'text-green-700');
            }, 2000);
        } catch (err) {
            console.error('複製失敗:', err);
        }
    });
};
