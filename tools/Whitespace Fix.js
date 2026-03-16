window.render_whitespaceFix = function (containerElement) {
    // 1. 確保防呆：避免未傳入容器或找不到容器導致報錯
    const container = containerElement || document.getElementById('tool-container');
    if (!container) {
        console.error("找不到渲染容器，工具載入失敗。");
        return;
    }

    // 2. 渲染介面：加入陰影、focus 狀態、操作回饋，並保持在局部區塊 (max-w-xl)
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🧹</span>
                <h3 class="text-lg font-bold text-slate-800 m-0">多餘空白清理</h3>
            </div>
            
            <p class="text-sm text-slate-500 mb-4">快速將雜亂的換行與連續空白壓縮成單一空格。</p>
            
            <textarea 
                id="ws-input" 
                class="w-full h-40 p-4 border border-slate-200 rounded-xl mb-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                placeholder="請在此貼上帶有雜亂空格或換行的文字..."
            ></textarea>
            
            <div class="flex gap-3">
                <button 
                    id="ws-btn-clear" 
                    class="flex-1 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                    清空內容
                </button>
                <button 
                    id="ws-btn-compress" 
                    class="flex-[2] py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
                >
                    一鍵壓縮空格
                </button>
            </div>
            
            <div id="ws-feedback" class="mt-4 text-sm text-emerald-600 font-medium text-center opacity-0 transition-opacity duration-300">
                ✨ 處理完成！結果已自動複製到剪貼簿。
            </div>
        </div>
    `;

    // 3. 綁定事件：在 HTML 渲染完成後再綁定，徹底解決「工具尚未載入」的錯誤
    const inputEl = document.getElementById('ws-input');
    const compressBtn = document.getElementById('ws-btn-compress');
    const clearBtn = document.getElementById('ws-btn-clear');
    const feedbackEl = document.getElementById('ws-feedback');

    // 壓縮與自動複製功能
    compressBtn.addEventListener('click', () => {
        const originalText = inputEl.value;
        if (!originalText.trim()) return; // 無內容則不執行

        // 執行正規表達式替換
        const processedText = originalText.replace(/\s+/g, ' ').trim();
        inputEl.value = processedText;

        // 將結果複製到剪貼簿 (提升使用者體驗)
        navigator.clipboard.writeText(processedText).then(() => {
            // 顯示成功提示
            feedbackEl.classList.remove('opacity-0');

            // 2.5 秒後淡出隱藏
            setTimeout(() => {
                feedbackEl.classList.add('opacity-0');
            }, 2500);
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    });

    // 清空功能
    clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        inputEl.focus(); // 清空後將游標停留在輸入框
        feedbackEl.classList.add('opacity-0'); // 隱藏提示
    });
};
