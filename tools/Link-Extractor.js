window.render_linkExtractor = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100 font-sans transition-all">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 class="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                    <svg class="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    網頁連結智能提取器
                </h3>
                <span id="linkCount" class="bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                    0 個連結
                </span>
            </div>

            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        貼上 HTML 原始碼
                    </label>
                    <textarea id="linkIn" class="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-mono resize-y shadow-inner text-slate-700 placeholder-slate-400" placeholder='在此貼上您的程式碼，例如：&#10;<a href="https://example.com">點擊這裡</a>'></textarea>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex flex-wrap gap-6">
                        <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors">
                            <input type="checkbox" id="uniqueLinks" checked class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300">
                            過濾重複連結
                        </label>
                        <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors">
                            <input type="checkbox" id="extractSrc" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300">
                            包含資源檔 (src)
                        </label>
                    </div>
                    <div class="flex gap-3">
                        <button id="clearBtn" class="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 transition-all shadow-sm">
                            清除
                        </button>
                        <button id="copyBtn" disabled class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            複製全部
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        提取結果
                    </label>
                    <div id="linkOut" class="w-full h-72 p-3 bg-slate-50 border border-slate-200 rounded-2xl overflow-y-auto text-sm font-mono flex flex-col gap-2 shadow-inner">
                        <div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                            <svg class="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <span class="italic">尚未檢測到連結，請在上方的輸入框貼上內容。</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="toast" class="fixed bottom-6 right-6 transform translate-y-24 opacity-0 transition-all duration-300 bg-slate-800 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 pointer-events-none">
                <div class="bg-green-500/20 p-1 rounded-full">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span class="font-medium">操作成功！</span>
            </div>
        </div>
    `;

    setTimeout(() => {
        const linkIn = document.getElementById('linkIn');
        const linkOut = document.getElementById('linkOut');
        const linkCount = document.getElementById('linkCount');
        const uniqueCheck = document.getElementById('uniqueLinks');
        const extractSrcCheck = document.getElementById('extractSrc');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        const toast = document.getElementById('toast');

        let currentLinks = [];

        // Global function for individual link copying
        window.copySingleLink = (link) => {
            navigator.clipboard.writeText(link).then(() => {
                showToast('已複製單一連結！');
            });
        };

        const showToast = (msg) => {
            toast.querySelector('span').innerText = msg;
            toast.classList.remove('translate-y-24', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-24', 'opacity-0');
            }, 2500);
        };

        const processLinks = () => {
            const text = linkIn.value;

            // Empty state handling
            if (!text.trim()) {
                linkOut.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                        <svg class="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span class="italic">尚未檢測到連結，請在上方的輸入框貼上內容。</span>
                    </div>`;
                linkCount.innerText = '0 個連結';
                currentLinks = [];
                copyBtn.disabled = true;
                return;
            }

            // Dynamic Regex based on user settings to capture JUST the URL
            const attributes = extractSrcCheck.checked ? 'href|src' : 'href';
            const regex = new RegExp(`(?:${attributes})=["']([^"']+)["']`, 'gi');

            let matches = [];
            let match;
            while ((match = regex.exec(text)) !== null) {
                const url = match[1].trim();
                // Filter out useless anchors and javascript executions
                if (url && !url.startsWith('#') && !url.startsWith('javascript:')) {
                    matches.push(url);
                }
            }

            if (uniqueCheck.checked) {
                matches = [...new Set(matches)];
            }

            currentLinks = matches;
            linkCount.innerText = `${matches.length} 個連結`;
            copyBtn.disabled = matches.length === 0;

            if (matches.length > 0) {
                linkOut.innerHTML = matches.map((link) => `
                    <div class="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-200 transition-all group">
                        <a href="${link}" target="_blank" class="truncate text-indigo-600 hover:text-indigo-800 hover:underline max-w-[85%] font-medium" title="${link}">
                            ${link}
                        </a>
                        <button class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-xs font-bold border border-slate-200 hover:border-indigo-200" onclick="copySingleLink('${link}')" title="複製此連結">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            複製
                        </button>
                    </div>
                `).join('');
            } else {
                linkOut.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                        <svg class="w-10 h-10 opacity-50 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span class="italic">未找到任何有效的連結。</span>
                    </div>`;
            }
        };

        // Event Listeners for real-time extraction
        linkIn.addEventListener('input', processLinks);
        uniqueCheck.addEventListener('change', processLinks);
        extractSrcCheck.addEventListener('change', processLinks);

        clearBtn.addEventListener('click', () => {
            linkIn.value = '';
            processLinks();
            linkIn.focus();
        });

        copyBtn.addEventListener('click', () => {
            if (currentLinks.length > 0) {
                navigator.clipboard.writeText(currentLinks.join('\n')).then(() => {
                    showToast(`成功複製 ${currentLinks.length} 個連結！`);
                });
            }
        });

        // Initialize empty state
        processLinks();
    }, 0);
};