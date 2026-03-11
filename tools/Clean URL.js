window.render_cleanUrl = function () {
    // 1. 注入現代化且具備完整互動元素的 HTML 介面
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-gradient-to-b from-white to-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl transition-all duration-300">
            
            <div class="flex items-center gap-3 mb-6">
                <div class="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <div>
                    <h3 class="text-2xl font-extrabold text-slate-800 tracking-tight">終極網址淨化器</h3>
                    <p class="text-xs text-slate-500 mt-1">支援移除 UTM、FB、Google、IG 等追蹤參數</p>
                </div>
            </div>

            <div class="space-y-5">
                <div class="relative">
                    <label class="block text-sm font-bold text-slate-600 mb-2">請貼上冗長的追蹤網址：</label>
                    <div class="relative group">
                        <input type="text" id="curlIn" placeholder="例如：https://example.com/page?utm_source=facebook&fbclid=IwAR..."
                            class="w-full pl-4 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm text-slate-700 placeholder-slate-400 shadow-inner">
                        <button id="clearInputBtn" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 hidden transition-colors" title="清空">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                </div>

                <div id="errorMsg" class="hidden text-red-500 text-sm font-medium flex items-center gap-1 bg-red-50 p-3 rounded-lg border border-red-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>請輸入有效的網址結構</span>
                </div>

                <div id="resultArea" class="hidden space-y-3 opacity-0 transition-opacity duration-500">
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-bold text-slate-600">✨ 淨化後的乾淨網址：</label>
                        <span id="removedCount" class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-md hidden"></span>
                    </div>
                    
                    <div class="relative">
                        <div id="curlOut" class="w-full p-4 pr-28 bg-green-50/50 border-2 border-green-400 text-green-900 rounded-xl break-all font-mono text-sm leading-relaxed shadow-sm min-h-[56px] flex items-center"></div>
                        <button id="copyBtn" class="absolute right-2 top-2 bottom-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-md">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span id="copyText">複製</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. 獲取 DOM 元素
    const inputEl = document.getElementById('curlIn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const resultArea = document.getElementById('resultArea');
    const outputEl = document.getElementById('curlOut');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const removedCountEl = document.getElementById('removedCount');
    const errorMsg = document.getElementById('errorMsg');

    // 3. 定義要移除的垃圾追蹤參數清單 (涵蓋目前市場主流)
    const junkTrackers = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', // Google/通用
        'fbclid', 'igshid', // Meta (FB/IG)
        'gclid', '_gl', 'wbraid', 'gbraid', // Google Ads/Analytics
        'ttclid', 'twclid', 'yclid', // TikTok, Twitter, Yandex
        'mc_eid', // Mailchimp
        'si', 'ref' // 一般來源
    ];

    // 4. 核心處理邏輯
    const processUrl = (rawUrl) => {
        // 如果輸入為空，隱藏所有結果與錯誤
        if (!rawUrl.trim()) {
            resultArea.classList.add('hidden');
            resultArea.classList.remove('opacity-100');
            errorMsg.classList.add('hidden');
            clearInputBtn.classList.add('hidden');
            return;
        }

        clearInputBtn.classList.remove('hidden');

        try {
            // 防呆：如果使用者只貼了 www.xxx.com，幫他補上 protocol 才能解析
            let validUrl = rawUrl.trim();
            if (!/^https?:\/\//i.test(validUrl)) {
                validUrl = 'http://' + validUrl;
            }

            const url = new URL(validUrl);
            const params = new URLSearchParams(url.search);
            let removedCount = 0;

            // 遍歷所有參數並刪除在黑名單內的
            junkTrackers.forEach(key => {
                if (params.has(key)) {
                    params.delete(key);
                    removedCount++;
                }
            });

            url.search = params.toString();
            const cleanedUrl = url.toString();

            // 更新 UI 顯示
            errorMsg.classList.add('hidden');
            resultArea.classList.remove('hidden');

            // 使用 setTimeout 讓 Tailwind 的 opacity transition 能夠觸發
            setTimeout(() => resultArea.classList.add('opacity-100'), 10);

            outputEl.textContent = cleanedUrl;

            if (removedCount > 0) {
                removedCountEl.textContent = `🗑️ 成功清除了 ${removedCount} 個追蹤碼`;
                removedCountEl.classList.remove('hidden');
            } else {
                removedCountEl.classList.add('hidden');
            }

            // 重置複製按鈕狀態
            resetCopyButton();

        } catch (e) {
            // 網址解析失敗的處理
            errorMsg.classList.remove('hidden');
            resultArea.classList.add('hidden');
            resultArea.classList.remove('opacity-100');
        }
    };

    // 5. 複製按鈕狀態還原邏輯
    const resetCopyButton = () => {
        copyText.textContent = '複製';
        copyBtn.classList.replace('bg-slate-800', 'bg-green-600');
        copyBtn.classList.replace('hover:bg-slate-700', 'hover:bg-green-700');
        copyBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>';
    };

    // 6. 綁定事件監聽器
    // 監聽輸入框的改變，達成「即時預覽」
    inputEl.addEventListener('input', (e) => processUrl(e.target.value));

    // 清空輸入框按鈕
    clearInputBtn.addEventListener('click', () => {
        inputEl.value = '';
        processUrl('');
        inputEl.focus();
    });

    // 複製到剪貼簿功能
    copyBtn.addEventListener('click', async () => {
        if (!outputEl.textContent) return;

        try {
            await navigator.clipboard.writeText(outputEl.textContent);
            // 成功複製的視覺回饋
            copyText.textContent = '已複製';
            copyBtn.classList.replace('bg-green-600', 'bg-slate-800');
            copyBtn.classList.replace('hover:bg-green-700', 'hover:bg-slate-700');
            copyBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';

            // 2 秒後恢復按鈕原狀
            setTimeout(resetCopyButton, 2000);
        } catch (err) {
            alert('複製失敗，您的瀏覽器可能不支援此功能，請手動全選複製。');
        }
    });
};
