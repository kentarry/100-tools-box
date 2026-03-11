window.render_jsonTool = function () {
    container.innerHTML = `
        <div class="max-w-6xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl font-sans text-gray-800">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
                        <span>📦</span> 專業 JSON 處理神器
                    </h3>
                    <p class="text-gray-500 text-sm mt-2 font-medium">支援排版、壓縮、錯誤檢測、一鍵複製與匯出</p>
                </div>
                
                <div class="flex flex-wrap gap-2">
                    <button id="btn-format" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                        ✨ 美化排版
                    </button>
                    <button id="btn-minify" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                        🗜️ 壓縮代碼
                    </button>
                    <button id="btn-copy" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 active:scale-95 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                        📋 複製結果
                    </button>
                    <button id="btn-download" class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                        ⬇️ 下載檔案
                    </button>
                    <button id="btn-clear" class="px-5 py-2.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 rounded-xl font-bold transition-all flex items-center gap-2 border border-red-200">
                        🗑️ 清空
                    </button>
                </div>
            </div>

            <div id="json-status" class="hidden w-full p-4 mb-6 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2"></div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="relative group">
                    <div class="absolute top-0 left-0 bg-gray-800 text-white px-4 py-1.5 text-xs rounded-br-xl rounded-tl-2xl font-bold z-10 shadow-sm">
                        原始輸入 (Input)
                    </div>
                    <textarea id="jsonIn" class="w-full h-[550px] p-5 pt-12 bg-gray-50 border-2 border-gray-200 rounded-2xl font-mono text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all custom-scrollbar placeholder-gray-400" placeholder='請在此貼上 JSON 原始代碼...\n\n範例:\n{"name": "Gemini", "role": "AI Assistant", "features": ["Beautify", "Minify", "Export"]}'></textarea>
                </div>
                
                <div class="relative group">
                    <div class="absolute top-0 left-0 bg-indigo-100 text-indigo-800 px-4 py-1.5 text-xs rounded-br-xl rounded-tl-2xl font-bold z-10 shadow-sm">
                        處理結果 (Output)
                    </div>
                    <div class="relative w-full h-[550px]">
                        <pre id="jsonOut" class="w-full h-full p-5 pt-12 bg-[#1e1e2f] border-2 border-transparent rounded-2xl overflow-auto font-mono text-sm text-[#a6accd] outline-none shadow-inner custom-scrollbar"></pre>
                        <div id="empty-state" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
                            <span class="text-4xl mb-2">🚀</span>
                            <span class="text-gray-400 font-medium">等待處理...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            /* 自訂捲軸樣式，讓介面更精緻 */
            .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            #jsonOut::-webkit-scrollbar-thumb { background: #475569; }
            #jsonOut::-webkit-scrollbar-thumb:hover { background: #64748b; }
            
            /* 簡易的 JSON 語法高亮顏色 (搭配 JS 渲染) */
            .string { color: #c3e88d; }
            .number { color: #f78c6c; }
            .boolean { color: #ff9cac; }
            .null { color: #89ddff; font-weight: bold; }
            .key { color: #82aaff; font-weight: bold; }
        </style>
    `;

    setTimeout(() => {
        const jsonIn = document.getElementById('jsonIn');
        const jsonOut = document.getElementById('jsonOut');
        const status = document.getElementById('json-status');
        const emptyState = document.getElementById('empty-state');

        // 狀態提示控制函數
        const showStatus = (msg, type = 'success') => {
            status.innerHTML = type === 'success'
                ? `<span>✅</span> ${msg}`
                : `<span>❌</span> ${msg}`;

            status.className = `w-full p-4 mb-6 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`;
            status.classList.remove('hidden');

            // 3秒後自動隱藏
            clearTimeout(window.jsonStatusTimeout);
            window.jsonStatusTimeout = setTimeout(() => status.classList.add('hidden'), 3000);
        };

        // 簡易 JSON 語法高亮處理
        const syntaxHighlight = (json) => {
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 4);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        };

        // 核心處理邏輯
        const processJson = (action) => {
            const raw = jsonIn.value.trim();
            if (!raw) {
                showStatus('請先在左側輸入 JSON 代碼！', 'error');
                return;
            }
            try {
                const obj = JSON.parse(raw);
                emptyState.style.display = 'none'; // 隱藏空狀態圖示

                if (action === 'format') {
                    // 使用語法高亮渲染美化後的 JSON
                    const prettyJson = JSON.stringify(obj, null, 4);
                    jsonOut.innerHTML = syntaxHighlight(prettyJson);
                    showStatus('JSON 排版與解析成功！');
                } else if (action === 'minify') {
                    // 壓縮不使用高亮，因為只有一行
                    jsonOut.textContent = JSON.stringify(obj);
                    showStatus('JSON 已成功壓縮為單行代碼！');
                }
            } catch (e) {
                showStatus(`語法錯誤：${e.message}`, 'error');
                // 嘗試標記發生錯誤的地方 (提供更友善的除錯體驗)
                jsonOut.innerHTML = `<span class="text-red-400">無法解析 JSON，請檢查原始碼。\n\n錯誤詳情:\n${e.message}</span>`;
                emptyState.style.display = 'none';
            }
        };

        // 綁定按鈕事件
        document.getElementById('btn-format').onclick = () => processJson('format');
        document.getElementById('btn-minify').onclick = () => processJson('minify');

        // 複製功能
        document.getElementById('btn-copy').onclick = () => {
            const result = jsonOut.textContent || jsonOut.innerText;
            if (!result || result.includes('無法解析 JSON')) {
                showStatus('目前沒有有效的結果可以複製！', 'error');
                return;
            }
            navigator.clipboard.writeText(result).then(() => {
                showStatus('結果已成功複製到剪貼簿！');
            }).catch(() => {
                showStatus('複製失敗，請檢查瀏覽器權限設定。', 'error');
            });
        };

        // 下載功能
        document.getElementById('btn-download').onclick = () => {
            const result = jsonOut.textContent || jsonOut.innerText;
            if (!result || result.includes('無法解析 JSON')) {
                showStatus('目前沒有有效的結果可以下載！', 'error');
                return;
            }
            const blob = new Blob([result], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `data_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus('檔案下載中...');
        };

        // 清空功能
        document.getElementById('btn-clear').onclick = () => {
            jsonIn.value = '';
            jsonOut.innerHTML = '';
            emptyState.style.display = 'flex';
            status.classList.add('hidden');
        };

    }, 0);
};
