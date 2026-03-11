window.render_htmlEntities = function () {
    // 1. 注入高質感的現代化 HTML 結構
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 font-sans">
            
            <div class="text-center mb-8">
                <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight mb-2">
                    HTML 實體 編碼 / 解碼器
                </h2>
                <p class="text-slate-500 text-sm md:text-base">輕鬆轉換特殊字元，保護您的網頁免於 XSS 攻擊或顯示錯誤。</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div class="flex flex-col relative group">
                    <div class="flex justify-between items-center mb-2">
                        <label class="font-semibold text-slate-700 flex items-center gap-2">
                            <span class="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </span>
                            輸入來源 (Input)
                        </label>
                        <button id="heClear" class="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded">
                            一鍵清空
                        </button>
                    </div>
                    <textarea id="heIn" class="w-full h-48 md:h-64 p-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-all font-mono text-sm leading-relaxed resize-none shadow-inner text-slate-700" placeholder="請在此貼上您的 HTML 標籤或一般文字..."></textarea>
                </div>

                <div class="flex flex-col relative">
                    <div class="flex justify-between items-center mb-2">
                        <label class="font-semibold text-slate-700 flex items-center gap-2">
                            <span class="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            </span>
                            轉換結果 (Output)
                        </label>
                        <button id="heCopy" class="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            複製結果
                        </button>
                    </div>
                    <textarea id="heOut" class="w-full h-48 md:h-64 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none font-mono text-sm leading-relaxed resize-none text-slate-600" readonly placeholder="轉換後的結果將顯示於此..."></textarea>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 mt-8 justify-center">
                <button id="heEnc" class="group relative px-8 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-[0_4px_15px_rgb(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgb(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    編碼實體 (Encode)
                </button>
                
                <button id="heSwap" class="p-3 text-slate-400 hover:text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 flex items-center justify-center" title="將結果移至輸入框">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </button>

                <button id="heDec" class="group relative px-8 py-3 font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2">
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                    解碼實體 (Decode)
                </button>
            </div>
            
            <div id="heToast" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 translate-y-10 opacity-0 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 pointer-events-none flex items-center gap-2 z-50 font-medium text-sm">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span id="heToastMsg">操作成功</span>
            </div>
        </div>
    `;

    // 2. 綁定強大且防呆的互動邏輯
    setTimeout(() => {
        const input = document.getElementById('heIn');
        const output = document.getElementById('heOut');
        const toast = document.getElementById('heToast');
        const toastMsg = document.getElementById('heToastMsg');

        // 優雅的 Toast 提示系統
        let toastTimeout;
        const showToast = (msg, isError = false) => {
            clearTimeout(toastTimeout);
            toastMsg.textContent = msg;

            // 根據狀態改變 icon 顏色
            const svg = toast.querySelector('svg');
            if (isError) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
                svg.classList.replace('text-green-400', 'text-red-400');
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
                svg.classList.replace('text-red-400', 'text-green-400');
            }

            toast.classList.remove('translate-y-10', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            toastTimeout = setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-10', 'opacity-0');
            }, 2500);
        };

        // 編碼邏輯 (Input -> Output)
        document.getElementById('heEnc').onclick = () => {
            if (!input.value.trim()) return showToast('請先填寫輸入來源！', true);
            const div = document.createElement('div');
            div.textContent = input.value;
            output.value = div.innerHTML;
            showToast('✅ 編碼完成！');
        };

        // 解碼邏輯 (Input -> Output)
        document.getElementById('heDec').onclick = () => {
            if (!input.value.trim()) return showToast('請先填寫輸入來源！', true);
            const div = document.createElement('div');
            div.innerHTML = input.value;
            output.value = div.textContent;
            showToast('✅ 解碼完成！');
        };

        // 互換邏輯 (Output -> Input)
        document.getElementById('heSwap').onclick = () => {
            if (!output.value.trim()) return showToast('沒有可互換的結果！', true);
            input.value = output.value;
            output.value = '';
            showToast('🔄 已將結果移至輸入區');
        };

        // 清空邏輯
        document.getElementById('heClear').onclick = () => {
            input.value = '';
            output.value = '';
            input.focus();
            showToast('🧹 已清空內容');
        };

        // 複製邏輯 (使用現代 Clipboard API)
        document.getElementById('heCopy').onclick = () => {
            if (!output.value) return showToast('沒有可複製的結果！', true);
            navigator.clipboard.writeText(output.value).then(() => {
                showToast('📋 已複製到剪貼簿！');
            }).catch(() => {
                showToast('複製失敗，請手動框選', true);
            });
        };
    }, 0);
};
