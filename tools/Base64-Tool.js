window.render_base64Tool = function () {
    // 注入高度優化、具備 RWD 響應式設計的現代化 UI 介面
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all font-sans">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center gap-2">
                        ✨ 專業 Base64 編解碼神器
                    </h3>
                    <p class="text-gray-500 text-sm mt-1 font-medium">支援純文字、特殊符號 (Emoji)、甚至實體檔案轉換</p>
                </div>
                <button id="b64Clear" class="text-sm px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 w-fit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    清空全部
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
                
                <div class="flex flex-col gap-3">
                    <label class="font-bold text-gray-700 flex justify-between items-center">
                        <span class="flex items-center gap-1">📥 輸入來源</span>
                        <label class="cursor-pointer text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-100 hover:shadow-sm transition-all">
                            上傳檔案轉換
                            <input type="file" id="b64File" class="hidden">
                        </label>
                    </label>
                    <textarea id="b64In" class="w-full flex-1 min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none text-sm text-gray-700 placeholder-gray-400 shadow-inner" placeholder="請在此輸入要編碼的文字，或貼上要解碼的 Base64 字串..."></textarea>
                </div>

                <div class="flex flex-row md:flex-col justify-center gap-3 py-2 md:py-0">
                    <button id="b64Enc" class="flex-1 md:flex-none group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        編碼
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                    <button id="b64Dec" class="flex-1 md:flex-none group flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-indigo-600 border-2 border-indigo-100 font-bold rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        解碼
                        <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                </div>

                <div class="flex flex-col gap-3">
                    <label class="font-bold text-gray-700 flex justify-between items-center">
                        <span class="flex items-center gap-1">📤 輸出結果</span>
                        <button id="b64Copy" class="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-all flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            一鍵複製
                        </button>
                    </label>
                    <textarea id="b64Out" class="w-full flex-1 min-h-[200px] p-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all resize-none text-sm text-gray-700 shadow-inner" placeholder="轉換後的結果會自動顯示在這裡..." readonly></textarea>
                </div>
                
            </div>
            
            <div id="b64Toast" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 translate-y-10 opacity-0 transition-all duration-300 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 pointer-events-none">
                <span id="b64ToastIcon"></span>
                <span id="b64ToastMsg" class="font-medium text-sm tracking-wide"></span>
            </div>
        </div>
    `;

    // 確保 DOM 渲染完畢後綁定事件與邏輯
    setTimeout(() => {
        const input = document.getElementById('b64In');
        const output = document.getElementById('b64Out');
        const fileInput = document.getElementById('b64File');
        const toast = document.getElementById('b64Toast');
        const toastMsg = document.getElementById('b64ToastMsg');
        const toastIcon = document.getElementById('b64ToastIcon');
        let toastTimeout;

        // 優雅的 Toast 提示系統 (取代醜陋的 alert)
        const showToast = (msg, type = 'success') => {
            clearTimeout(toastTimeout);
            toastMsg.textContent = msg;
            toastIcon.innerHTML = type === 'success'
                ? '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                : '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            toast.classList.remove('translate-y-10', 'opacity-0');
            toastTimeout = setTimeout(() => toast.classList.add('translate-y-10', 'opacity-0'), 2500);
        };

        // 現代化 UTF-8 編碼 (完美支援中文、Emoji、各國語言)
        const encodeUTF8 = (str) => {
            const bytes = new TextEncoder().encode(str);
            const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join("");
            return btoa(binString);
        };

        // 現代化 UTF-8 解碼
        const decodeUTF8 = (b64) => {
            const binString = atob(b64);
            const bytes = Uint8Array.from(binString, m => m.codePointAt(0));
            return new TextDecoder().decode(bytes);
        };

        // --- 事件綁定 ---

        // 1. 編碼按鈕
        document.getElementById('b64Enc').onclick = () => {
            if (!input.value.trim()) return showToast('請先輸入需要編碼的內容', 'error');
            try {
                output.value = encodeUTF8(input.value);
                showToast('✨ 編碼成功！');
            } catch (e) {
                showToast('編碼失敗，請檢查輸入內容是否異常', 'error');
            }
        };

        // 2. 解碼按鈕
        document.getElementById('b64Dec').onclick = () => {
            if (!input.value.trim()) return showToast('請先輸入 Base64 字串', 'error');
            try {
                // 自動過濾掉常見的空白與換行符號，提高容錯率
                const cleanInput = input.value.replace(/\\s+/g, '');
                output.value = decodeUTF8(cleanInput);
                showToast('🔓 解碼成功！');
            } catch (e) {
                showToast('無效的 Base64 格式，請確認字串正確性', 'error');
            }
        };

        // 3. 一鍵複製按鈕
        document.getElementById('b64Copy').onclick = () => {
            if (!output.value) return showToast('目前沒有可複製的結果', 'error');
            navigator.clipboard.writeText(output.value).then(() => {
                showToast('📋 已成功複製到剪貼簿！');
            }).catch(() => {
                showToast('複製失敗，請手動全選複製', 'error');
            });
        };

        // 4. 清空全部按鈕
        document.getElementById('b64Clear').onclick = () => {
            input.value = '';
            output.value = '';
            fileInput.value = ''; // 清除檔案快取
            showToast('🗑️ 內容已清空');
        };

        // 5. 檔案上傳轉 Base64 功能 (超級實用)
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 檔案過大保護機制 (>5MB 警告)
            if (file.size > 5 * 1024 * 1024) {
                return showToast('檔案超過 5MB，可能會造成瀏覽器卡頓', 'error');
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                input.value = event.target.result;
                showToast('📁 檔案已載入，這是它的 Base64 Data URL！');
            };
            reader.onerror = () => showToast('讀取檔案失敗', 'error');
            reader.readAsDataURL(file); // 將檔案讀取為 Base64 Data URL
        };
    }, 0);
};
