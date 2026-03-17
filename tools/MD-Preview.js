window.render_mdPreview = function () {
    // 1. 注入核心介面與樣式 (包含工具列、狀態列、編輯區與預覽區)
    container.innerHTML = `
        <div class="flex flex-col w-full h-[700px] bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans">
            
            <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-white border-b border-gray-200 shadow-sm">
                <div class="flex items-center gap-1" id="md-toolbar">
                    <button data-action="bold" class="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="粗體 (Ctrl+B)">B</button>
                    <button data-action="italic" class="px-3 py-1.5 text-sm italic text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="斜體 (Ctrl+I)">I</button>
                    <button data-action="strikethrough" class="px-3 py-1.5 text-sm line-through text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="刪除線">S</button>
                    <div class="w-px h-5 bg-gray-300 mx-1"></div>
                    <button data-action="h1" class="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="標題 1">H1</button>
                    <button data-action="h2" class="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="標題 2">H2</button>
                    <div class="w-px h-5 bg-gray-300 mx-1"></div>
                    <button data-action="link" class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="插入連結">🔗 連結</button>
                    <button data-action="image" class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="插入圖片">🖼️ 圖片</button>
                    <button data-action="code" class="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors" title="程式碼區塊">💻 程式碼</button>
                </div>
                <div class="flex gap-2">
                    <button id="mdClear" class="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">清空內容</button>
                    <button id="mdCopy" class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors">複製 HTML</button>
                </div>
            </div>

            <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                
                <div class="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white relative group">
                    <div class="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-50 rounded-bl-lg border-l border-b border-gray-100 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">MARKDOWN</div>
                    <textarea id="mdIn" class="flex-1 w-full p-6 bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-gray-800 focus:ring-inset focus:ring-2 focus:ring-blue-500/20 transition-all custom-scrollbar" placeholder="# 在這裡開始編寫您的 Markdown...\n\n支援標題、**粗體**、*斜體*、[連結](url) 以及 \`程式碼\` 等語法。"></textarea>
                </div>

                <div class="flex-1 flex flex-col bg-[#fdfdfd] relative group">
                    <div class="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-blue-500 bg-blue-50 rounded-bl-lg border-l border-b border-blue-100 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">即時預覽</div>
                    <div id="mdOut" class="flex-1 w-full p-6 overflow-auto prose prose-sm md:prose-base prose-blue max-w-none custom-scrollbar pb-20"></div>
                </div>

            </div>

            <div class="flex items-center justify-between px-4 py-2 bg-gray-100 text-xs font-medium text-gray-500 border-t border-gray-200">
                <div class="flex gap-4">
                    <span id="wordCount">字數: 0</span>
                    <span id="charCount">字元數: 0</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 即時同步中
                </div>
            </div>
        </div>

        <style>
            /* 優化滾動條體驗 */
            .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        </style>
    `;

    setTimeout(() => {
        const i = document.getElementById('mdIn');
        const o = document.getElementById('mdOut');
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');

        // 2. 進階 Markdown 解析器 (無外部依賴，支援主流語法)
        const parseMarkdown = (text) => {
            if (!text) return '<div class="text-gray-400 italic mt-10 text-center">預覽將在此顯示...</div>';

            let html = text
                // 基礎安全處理 (跳脫 HTML 標籤避免 XSS，但保留 Markdown 結構)
                .replace(/</g, '&lt;').replace(/>/g, '&gt;')

                // 區塊級別元素
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/^---$/gim, '<hr />')

                // 程式碼區塊 (多行)
                .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')

                // 圖片與連結
                .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
                .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

                // 行內級別元素
                .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                .replace(/~~(.*?)~~/gim, '<del>$1</del>')
                .replace(/`([^`\n]+)`/gim, '<code>$1</code>')

                // 列表 (簡單版，無嵌套)
                .replace(/^\s*[\-\*] (.*$)/gim, '<ul><li>$1</li></ul>')
                // 合併相鄰的 ul
                .replace(/<\/ul>\n<ul>/gim, '');

            // 處理段落與換行 (避免破壞 pre 區塊)
            html = html.split('<pre>').map((part, index) => {
                if (index % 2 !== 0) return '<pre>' + part + '</pre>'; // 在 pre 內的內容不處理換行
                return part.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
            }).join('');

            return `<p>${html}</p>`.replace(/<p><\/p>/g, '').replace(/<p><ul>/g, '<ul>').replace(/<\/ul><\/p>/g, '</ul>');
        };

        // 3. 即時更新與狀態統計邏輯
        const updatePreview = () => {
            const val = i.value;
            o.innerHTML = parseMarkdown(val);

            // 更新字數與字元數統計
            const cleanText = val.replace(/[\n\r\s]+/g, '');
            charCount.textContent = `字元數: ${cleanText.length}`;
            const words = val.match(/[\w\d]+|[^\w\d\s]/g); // 支援中英文的簡單字數估算
            wordCount.textContent = `字數: ${words ? words.length : 0}`;
        };

        // 綁定輸入事件
        i.addEventListener('input', updatePreview);

        // 4. 同步滾動 (同步輸入區與預覽區的視覺位置)
        let isSyncingLeft = false;
        let isSyncingRight = false;

        i.addEventListener('scroll', () => {
            if (!isSyncingLeft) {
                isSyncingRight = true;
                const percentage = i.scrollTop / (i.scrollHeight - i.clientHeight);
                o.scrollTop = percentage * (o.scrollHeight - o.clientHeight);
            }
            isSyncingLeft = false;
        });

        o.addEventListener('scroll', () => {
            if (!isSyncingRight) {
                isSyncingLeft = true;
                const percentage = o.scrollTop / (o.scrollHeight - o.clientHeight);
                i.scrollTop = percentage * (i.scrollHeight - i.clientHeight);
            }
            isSyncingRight = false;
        });

        // 5. 工具列功能：文字插入輔助
        const insertText = (prefix, suffix = '') => {
            const start = i.selectionStart;
            const end = i.selectionEnd;
            const selectedText = i.value.substring(start, end);
            const replacement = prefix + selectedText + suffix;

            i.value = i.value.substring(0, start) + replacement + i.value.substring(end);
            i.focus();

            // 重新定位游標
            if (selectedText.length === 0) {
                i.selectionStart = i.selectionEnd = start + prefix.length;
            } else {
                i.selectionStart = start;
                i.selectionEnd = start + replacement.length;
            }
            updatePreview();
        };

        // 綁定工具列按鈕點擊事件
        document.getElementById('md-toolbar').addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.dataset.action;
            const actions = {
                'bold': ['**', '**'],
                'italic': ['*', '*'],
                'strikethrough': ['~~', '~~'],
                'h1': ['# ', ''],
                'h2': ['## ', ''],
                'link': ['[連結文字](', 'https://...)'],
                'image': ['![圖片描述](', 'https://...)'],
                'code': ['\n```\n', '\n```\n']
            };

            if (actions[action]) {
                insertText(actions[action][0], actions[action][1]);
            }
        });

        // 6. 擴充功能：清空與複製
        document.getElementById('mdClear').addEventListener('click', () => {
            if (confirm('確定要清空所有內容嗎？')) {
                i.value = '';
                updatePreview();
                i.focus();
            }
        });

        document.getElementById('mdCopy').addEventListener('click', (e) => {
            const btn = e.target;
            navigator.clipboard.writeText(o.innerHTML).then(() => {
                const originalText = btn.textContent;
                btn.textContent = '✅ 已複製!';
                btn.classList.replace('bg-blue-600', 'bg-green-600');
                btn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.replace('bg-green-600', 'bg-blue-600');
                    btn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
                }, 2000);
            });
        });

        // 初始化預覽畫面
        updatePreview();
    }, 0);
};