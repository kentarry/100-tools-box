window.render_urlShortener = function () {
    // 💡 請填入您最新的 Google Apps Script 網頁應用程式網址
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwErP5VVl_6vI29OiH4BAfmvCwC2eYmO5QrvK-BKYmYz1M6dCGyIffxmQgFwKzZlKs/exec";

    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
            <div class="text-center mb-10 relative z-10">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl mb-5 text-2xl shadow-lg shadow-indigo-200 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    🔗
                </div>
                <h3 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-800 mb-3 tracking-tight">極短網址產生器</h3>
                <p class="text-slate-500 font-medium">將冗長的網址轉換為俐落的極短連結，高速跳轉！</p>
            </div>

            <div class="flex flex-col gap-5 relative z-10">
                <div class="relative group">
                    <input type="url" id="longUrlInput" placeholder="請貼上您的長網址 (例如: https://...)" 
                           class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-lg placeholder-slate-400">
                </div>
                
                <button id="shortenBtn" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                    <span id="btnText">✨ 立即縮短</span>
                    <svg id="btnSpinner" class="animate-spin hidden h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </button>
            </div>

            <div id="resultArea" class="hidden mt-8 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-inner transition-all relative z-10">
                <p class="text-sm text-indigo-600 mb-3 font-bold flex items-center gap-2">
                    <span>🎉 您的極短網址已經準備好囉：</span>
                </p>
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <input type="text" id="shortUrlOutput" readonly 
                           class="flex-1 w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-300 selection:bg-indigo-100">
                    <div class="flex gap-2 w-full sm:w-auto">
                        <button id="copyBtn" class="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-md">
                            <span>📋 複製</span>
                        </button>
                        <a id="testLinkBtn" href="#" target="_blank" class="flex-1 sm:flex-none bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                            <span>↗️ 測試跳轉</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('longUrlInput');
        const shortenBtn = document.getElementById('shortenBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const resultArea = document.getElementById('resultArea');
        const output = document.getElementById('shortUrlOutput');
        const copyBtn = document.getElementById('copyBtn');
        const testLinkBtn = document.getElementById('testLinkBtn');

        const isValidUrl = (string) => {
            try { return Boolean(new URL(string)); }
            catch (e) { return false; }
        };

        shortenBtn.onclick = async () => {
            const longUrl = input.value.trim();

            if (!longUrl || !isValidUrl(longUrl)) {
                alert('請輸入有效的網址 (需包含 http:// 或 https://)');
                return;
            }

            shortenBtn.disabled = true;
            btnText.textContent = '生成極短網址中...';
            btnSpinner.classList.remove('hidden');
            resultArea.classList.add('hidden');

            try {
                const response = await fetch(`${GAS_WEB_APP_URL}?url=${encodeURIComponent(longUrl)}`);
                const data = await response.json();

                if (data.status === 'success') {
                    output.value = data.shortUrl; // 這裡拿到的就會是 https://reurl.cc/...
                    testLinkBtn.href = data.shortUrl;
                    resultArea.classList.remove('hidden');
                } else {
                    alert('發生錯誤: ' + (data.message || '未知錯誤'));
                }
            } catch (error) {
                console.error('API 請求失敗:', error);
                alert('系統連線發生錯誤，請稍後再試。');
            } finally {
                shortenBtn.disabled = false;
                btnText.textContent = '✨ 立即縮短';
                btnSpinner.classList.add('hidden');
            }
        };

        copyBtn.onclick = () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value).then(() => {
                copyBtn.innerHTML = '<span>✅ 已複製!</span>';
                copyBtn.classList.replace('bg-slate-800', 'bg-emerald-600');
                copyBtn.classList.replace('hover:bg-slate-900', 'hover:bg-emerald-700');
                setTimeout(() => {
                    copyBtn.innerHTML = '<span>📋 複製</span>';
                    copyBtn.classList.replace('bg-emerald-600', 'bg-slate-800');
                    copyBtn.classList.replace('hover:bg-emerald-700', 'hover:bg-slate-900');
                }, 2000);
            });
        };
    }, 0);
};
