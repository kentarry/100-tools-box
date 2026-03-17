window.render_fontViewer = function () {
    // 假設 container 已在外部定義，若無則可自行修改為 document.getElementById('你的容器ID')
    if (typeof container === 'undefined') {
        console.error("未找到 container 元素");
        return;
    }

    // 產生隨機 ID，確保在 100 個工具中同時存在時不會發生 ID 衝突
    const uid = Math.random().toString(36).substring(2, 9);
    const dropZoneId = `dropZone_${uid}`;
    const inputId = `fontUp_${uid}`;
    const fileNameId = `fileName_${uid}`;
    const sizeId = `fontSize_${uid}`;
    const previewId = `fontPreview_${uid}`;
    const sizeDisplayId = `sizeDisplay_${uid}`;

    // 注入 HTML (使用 Tailwind CSS)
    container.innerHTML = `
        <div class="w-full max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-5 text-left transition-all">
            
            <div class="text-center">
                <h3 class="text-xl font-bold text-slate-800 mb-2">🔠 字體本機預覽器</h3>
                <p class="text-sm text-slate-500">免安裝，直接預覽！支援 .ttf, .otf, .woff 格式</p>
            </div>

            <div id="${dropZoneId}" class="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center cursor-pointer group min-h-[120px]">
                <input type="file" id="${inputId}" accept=".ttf,.otf,.woff,.woff2" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="點擊或拖曳檔案至此">
                <svg class="w-10 h-10 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span id="${fileNameId}" class="text-sm font-medium text-slate-600 group-hover:text-blue-600 text-center px-4">
                    點擊選擇字體檔，或將檔案拖曳至此處
                </span>
            </div>

            <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <label for="${sizeId}" class="text-sm font-medium text-slate-700 whitespace-nowrap shrink-0">字體大小</label>
                <input type="range" id="${sizeId}" min="12" max="120" value="36" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
                <span id="${sizeDisplayId}" class="text-sm font-mono text-slate-500 w-12 text-right shrink-0">36px</span>
            </div>

            <div id="${previewId}" class="p-4 sm:p-6 border border-slate-200 rounded-xl min-h-[200px] text-[36px] leading-relaxed break-all outline-none focus:ring-2 focus:ring-blue-100 transition-shadow resize-y overflow-auto bg-white" contenteditable="true" spellcheck="false">
                預覽文字：The quick brown fox jumps over the lazy dog. <br><br>
                天地玄黃，宇宙洪荒。日月盈昃，辰宿列張。
            </div>
            
        </div>
    `;

    // 使用 setTimeout 確保 DOM 渲染完畢後再綁定事件
    setTimeout(() => {
        const dropZone = document.getElementById(dropZoneId);
        const fontInput = document.getElementById(inputId);
        const fileNameDisplay = document.getElementById(fileNameId);
        const previewArea = document.getElementById(previewId);
        const sizeInput = document.getElementById(sizeId);
        const sizeDisplay = document.getElementById(sizeDisplayId);

        // 1. 處理字體大小拖曳
        sizeInput.addEventListener('input', (e) => {
            const size = e.target.value;
            previewArea.style.fontSize = `${size}px`;
            sizeDisplay.textContent = `${size}px`;
        });

        // 2. 處理字體讀取與載入
        const loadFont = async (file) => {
            if (!file) return;

            // 變更 UI 狀態為載入中
            fileNameDisplay.textContent = `⏳ 載入中: ${file.name}`;
            dropZone.classList.add('border-blue-400', 'bg-blue-50');

            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    // 使用時間戳記建立獨立字體名稱，避免覆蓋舊字體
                    const fontName = `customFont_${Date.now()}`;
                    const font = new FontFace(fontName, ev.target.result);

                    const loadedFont = await font.load();
                    document.fonts.add(loadedFont);

                    // 應用字體
                    previewArea.style.fontFamily = fontName;

                    // 成功提示
                    fileNameDisplay.textContent = `✅ 目前使用: ${file.name}`;
                    dropZone.classList.remove('border-dashed');
                } catch (error) {
                    console.error("字體載入錯誤:", error);
                    alert("字體載入失敗，請確認是否為有效的字體檔案！");
                    fileNameDisplay.textContent = "❌ 載入失敗，請重新選擇";
                    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
                }
            };
            reader.readAsArrayBuffer(file);
        };

        // 3. 綁定檔案選擇事件
        fontInput.addEventListener('change', (e) => {
            loadFont(e.target.files[0]);
        });

        // 4. 綁定拖曳視覺回饋 (input[type=file] 已自帶原生拖曳支援，這裡加強視覺效果)
        fontInput.addEventListener('dragenter', () => dropZone.classList.add('bg-slate-100'));
        fontInput.addEventListener('dragleave', () => dropZone.classList.remove('bg-slate-100'));
        fontInput.addEventListener('drop', () => dropZone.classList.remove('bg-slate-100'));

    }, 0);
};
