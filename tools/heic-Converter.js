window.render_heicConverter = function () {
    // 假設 container 變數已在全域或外部定義
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-gradient-to-br from-white to-slate-50 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
            
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

            <div class="relative z-10">
                <h3 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-3">📸 HEIC 轉 JPG 轉換器</h3>
                <p class="text-slate-500 mb-8 font-medium">解決 iPhone 照片在 Windows 無法開啟的痛點。<br>純瀏覽器處理，照片不上傳伺服器，保護隱私最安心。</p>

                <div id="libLoading" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl transition-opacity duration-300">
                    <div class="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p class="text-slate-600 font-bold tracking-wide animate-pulse">正在準備轉換引擎，請稍候...</p>
                </div>

                <div id="heicDropZone" class="group relative border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-white hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 cursor-pointer mb-6 shadow-sm">
                    <input type="file" id="heicInput" accept=".heic,.HEIC" class="hidden">
                    <div class="text-6xl mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">🖼️</div>
                    <p class="text-slate-700 font-bold text-lg mb-1">點擊選擇，或將 HEIC 照片拖曳到這裡</p>
                    <p class="text-slate-400 text-sm">支援單張 HEIC 高畫質轉換</p>
                </div>

                <div id="heicLoading" class="hidden py-8 flex flex-col items-center justify-center">
                    <div class="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
                    <span class="text-teal-600 font-bold text-lg tracking-wide animate-pulse">照片魔法轉換中，這可能需要幾秒鐘...</span>
                </div>

                <div id="heicPreview" class="hidden mt-6 bg-white p-5 border border-slate-100 rounded-2xl shadow-md">
                    <div class="relative rounded-xl overflow-hidden mb-5 bg-slate-100 flex items-center justify-center min-h-[200px]">
                        <img id="jpgResult" class="max-w-full h-auto object-contain max-h-[400px] shadow-sm">
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="heicDownload" class="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            ⬇️ 下載 JPG 照片
                        </button>
                        <button id="heicReset" class="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors duration-300">
                            🔄 轉換下一張
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('heicInput');
        const dropZone = document.getElementById('heicDropZone');
        const processing = document.getElementById('heicLoading');
        const preview = document.getElementById('heicPreview');
        const resultImg = document.getElementById('jpgResult');
        const downloadBtn = document.getElementById('heicDownload');
        const resetBtn = document.getElementById('heicReset');
        const libLoading = document.getElementById('libLoading');

        // 解除 UI 鎖定
        const unlockUI = () => {
            libLoading.style.opacity = '0';
            setTimeout(() => {
                libLoading.classList.add('hidden');
                libLoading.classList.remove('flex');
            }, 300);
        };

        // 動態載入 heic2any 庫並確保載入完成才允許操作
        if (!window.heic2any) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
            script.onload = unlockUI;
            script.onerror = () => {
                libLoading.innerHTML = '<p class="text-red-500 font-bold text-lg">⚠️ 核心元件載入失敗</p><p class="text-slate-500 mt-2">請檢查網路連線或重新整理頁面。</p>';
            };
            document.head.appendChild(script);
        } else {
            unlockUI();
        }

        // --- 處理拖曳事件 ---
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('bg-emerald-50', 'border-emerald-400', 'scale-[1.02]');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('bg-emerald-50', 'border-emerald-400', 'scale-[1.02]');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) processFile(files[0]);
        }, false);

        // --- 處理點擊事件 ---
        dropZone.onclick = () => input.click();

        input.onchange = (e) => {
            if (e.target.files.length > 0) processFile(e.target.files[0]);
            input.value = ''; // 重置 input，允許連續上傳同一張測試
        };

        // 重置按鈕
        resetBtn.onclick = () => {
            preview.classList.add('hidden');
            resultImg.src = '';
            dropZone.classList.remove('hidden');
        };

        // --- 核心轉換邏輯 ---
        async function processFile(file) {
            // 基礎副檔名檢查
            if (!file.name.toLowerCase().endsWith('.heic')) {
                alert("格式錯誤！請上傳 .heic 副檔名的照片檔案。");
                return;
            }

            // 切換至處理中狀態
            dropZone.classList.add('hidden');
            preview.classList.add('hidden');
            processing.classList.remove('hidden');
            processing.classList.add('flex');

            try {
                if (typeof heic2any === 'undefined') {
                    throw new Error("系統尚未準備完畢，請重新整理頁面。");
                }

                const blob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.85 // 設定不錯的 JPG 品質
                });

                // 處理部分 Live Photo 可能回傳 Array 的情況
                const finalBlob = Array.isArray(blob) ? blob[0] : blob;
                const url = URL.createObjectURL(finalBlob);

                resultImg.src = url;

                // 設定下載行為
                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name.replace(/\.heic$/i, '.jpg');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };

                // 顯示結果
                processing.classList.add('hidden');
                processing.classList.remove('flex');
                preview.classList.remove('hidden');

            } catch (err) {
                console.error("HEIC 轉換錯誤:", err);
                alert("轉換失敗：" + (err.message || "請確認檔案是否損毀或不支援此特定格式。"));

                // 恢復初始狀態
                processing.classList.add('hidden');
                processing.classList.remove('flex');
                dropZone.classList.remove('hidden');
            }
        }
    }, 0);
};