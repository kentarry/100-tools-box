window.render_panguSpacing = function () {
    // 確保外層 container 存在，避免報錯
    if (typeof container === 'undefined' || !container) {
        console.error("盤古排版器：找不到渲染目標 container");
        return;
    }

    // 1. 構建介面 (優化視覺、增加清空按鈕與漸層特效)
    container.innerHTML = `
        <div class="max-w-4xl w-full mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            
            <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">📝</span>
                <h3 class="text-xl font-bold text-slate-800">中英夾雜「盤古之白」排版器</h3>
            </div>
            <p class="text-slate-500 text-sm mb-6">貼上你的文章，一鍵自動在中文與半形英文/數字之間加入空白，讓排版更專業舒適。</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div class="flex flex-col relative">
                    <label class="font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span>📥 原始文字</span>
                        <span class="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded">未排版</span>
                    </label>
                    <textarea id="panguInput" class="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-slate-700 placeholder:text-slate-300 text-base leading-relaxed" placeholder="請貼上你的文字...\n\n例如：我的iPhone15Pro真好用\n預期：我的 iPhone 15 Pro 真好用"></textarea>
                </div>

                <div class="flex flex-col relative">
                    <label class="font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span>📤 處理結果</span>
                            <span class="text-xs font-normal text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">預覽區</span>
                        </div>
                        <button id="panguClearBtn" class="text-sm font-normal text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1">
                            🗑️ 清空內容
                        </button>
                    </label>
                    <textarea id="panguOutput" class="w-full h-64 p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none resize-none text-base leading-relaxed selection:bg-indigo-200" readonly placeholder="排版後且自動複製的文字會顯示在這裡..."></textarea>
                </div>
            </div>
            
            <button id="panguBtn" class="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2 group">
                <span class="group-hover:rotate-12 transition-transform" id="panguIcon">✨</span> 
                <span id="panguBtnText" class="tracking-wide">一鍵加入盤古之白並複製</span>
            </button>
        </div>
    `;

    // 2. 綁定邏輯 (使用 requestAnimationFrame 確保 DOM 已經真正渲染完畢)
    requestAnimationFrame(() => {
        const input = document.getElementById('panguInput');
        const output = document.getElementById('panguOutput');
        const btn = document.getElementById('panguBtn');
        const btnText = document.getElementById('panguBtnText');
        const btnIcon = document.getElementById('panguIcon');
        const clearBtn = document.getElementById('panguClearBtn');

        // 安全防護：如果找不到元素則提早退出，避免 console 報錯影響其他工具
        if (!input || !output || !btn) return;

        // 核心：盤古之白正規表達式替換
        function addPanguSpacing(text) {
            if (!text) return '';
            let newText = text;
            // 處理中文與英數字之間的空格
            newText = newText.replace(/([\u4e00-\u9fa5]+)([a-zA-Z0-9]+)/g, '$1 $2');
            newText = newText.replace(/([a-zA-Z0-9]+)([\u4e00-\u9fa5]+)/g, '$1 $2');
            // 處理標點符號的空格 (選用功能，處理常見的左右括號)
            newText = newText.replace(/([\u4e00-\u9fa5]+)([\(\[\{])/g, '$1 $2');
            newText = newText.replace(/([\)\]\}])([\u4e00-\u9fa5]+)/g, '$1 $2');
            return newText;
        }

        // 附加功能：清空按鈕邏輯
        clearBtn.addEventListener('click', () => {
            input.value = '';
            output.value = '';
            input.focus();
        });

        // 執行排版與複製邏輯
        btn.addEventListener('click', async () => {
            const textToProcess = input.value.trim();

            // 錯誤處理：未輸入文字的視覺抖動回饋 (取代 alert 彈窗，體驗更好)
            if (!textToProcess) {
                input.classList.add('ring-2', 'ring-red-400', 'bg-red-50');
                setTimeout(() => {
                    input.classList.remove('ring-2', 'ring-red-400', 'bg-red-50');
                }, 800);
                return;
            }

            // 1. 處理文字
            const result = addPanguSpacing(input.value);
            output.value = result;

            // 2. 複製到剪貼簿 (現代 API 優先，支援度更高且無跳動感)
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(result);
                } else {
                    // 降級方案：保留舊版 execCommand 支援較舊瀏覽器
                    output.select();
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges(); // 複製完取消反白，視覺更乾淨
                }
            } catch (err) {
                console.error("盤古排版器：複製失敗", err);
            }

            // 3. 按鈕成功狀態回饋 (視覺轉換)
            const originalText = btnText.innerText;
            btnText.innerText = '已處理並複製到剪貼簿！';
            btnIcon.innerText = '✅';

            // 移除原本的漸層藍色，替換成成功綠色
            btn.classList.remove('from-indigo-500', 'to-blue-500', 'hover:from-indigo-600', 'hover:to-blue-600');
            btn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');

            // 2.5 秒後自動恢復原狀
            setTimeout(() => {
                btnText.innerText = originalText;
                btnIcon.innerText = '✨';
                btn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
                btn.classList.add('from-indigo-500', 'to-blue-500', 'hover:from-indigo-600', 'hover:to-blue-600');
            }, 2500);
        });
    });
};