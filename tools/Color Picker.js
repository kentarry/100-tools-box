window.render_colorPicker = function () {
    // 1. 注入更具吸引力的 UI (使用進階 Tailwind CSS 類別)
    container.innerHTML = `
        <div class="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
                <h3 class="text-3xl font-extrabold text-white tracking-tight mb-2">🎨 智慧圖片色碼擷取</h3>
                <p class="text-blue-100 font-medium">上傳圖片，輕鬆點擊抓取專屬色彩</p>
            </div>

            <div class="p-8 flex flex-col lg:flex-row gap-8">
                <div class="flex-1 flex flex-col gap-5">
                    <label class="relative cursor-pointer group">
                        <input type="file" id="cpUpload" accept="image/*" class="hidden">
                        <div class="w-full py-4 px-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                            <span class="text-slate-500 font-medium group-hover:text-blue-600 flex items-center justify-center gap-2">
                                📁 <span id="uploadText">點擊此處上傳圖片 (JPG, PNG)</span>
                            </span>
                        </div>
                    </label>

                    <div class="relative overflow-auto border-2 border-slate-100 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center min-h-[400px]" style="max-height: 500px;">
                        <div id="cpEmptyState" class="text-slate-400 font-medium text-center pointer-events-none">
                            <div class="text-4xl mb-2">🖼️</div>
                            請先上傳圖片以開始擷取
                        </div>
                        <canvas id="cpCanvas" class="cursor-crosshair hidden max-w-full h-auto rounded-lg shadow-sm"></canvas>
                    </div>
                </div>

                <div class="w-full lg:w-80 flex flex-col gap-6">
                    <div class="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center relative overflow-hidden">
                        <div id="cpGlow" class="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-colors duration-500 pointer-events-none"></div>
                        
                        <div class="relative z-10">
                            <div id="cpPreview" class="w-full h-32 rounded-2xl border-4 border-white shadow-md mb-6 bg-slate-100 transition-colors duration-300"></div>
                            
                            <div class="space-y-1 mb-6">
                                <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">HEX 色碼</p>
                                <p id="cpHex" class="text-4xl font-mono font-black text-slate-800 tracking-wide">#FFFFFF</p>
                                <p id="cpRgb" class="text-sm text-slate-500 font-mono mt-2">rgb(255, 255, 255)</p>
                            </div>

                            <button id="cpCopy" disabled class="w-full py-3.5 bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                📋 複製 HEX
                            </button>
                        </div>
                    </div>

                    <div class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
                        <h4 class="font-bold text-blue-800 mb-2 flex items-center gap-2">💡 操作小撇步</h4>
                        <ul class="text-sm text-blue-700/80 space-y-2 list-disc list-inside">
                            <li>點擊上方虛線框更換圖片</li>
                            <li>游標變成十字時，點擊圖片任意處</li>
                            <li>點擊複製按鈕即可應用到您的專案</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const upload = document.getElementById('cpUpload');
        const uploadText = document.getElementById('uploadText');
        const canvas = document.getElementById('cpCanvas');
        const emptyState = document.getElementById('cpEmptyState');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const preview = document.getElementById('cpPreview');
        const hexText = document.getElementById('cpHex');
        const rgbText = document.getElementById('cpRgb');
        const copyBtn = document.getElementById('cpCopy');
        const glowBg = document.getElementById('cpGlow');

        // 處理圖片上傳
        upload.onchange = (e) => {
            if (!e.target.files.length) return;
            const file = e.target.files[0];
            const img = new Image();

            img.onload = () => {
                // 設定畫布實際像素大小
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // 切換顯示狀態
                emptyState.classList.add('hidden');
                canvas.classList.remove('hidden');
                uploadText.textContent = "更換圖片: " + file.name;

                // 啟用複製按鈕
                copyBtn.disabled = false;
            };
            img.src = URL.createObjectURL(file);
        };

        // 處理畫布點擊取色
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            // 計算縮放比例，確保響應式狀態下取色精準
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            const p = ctx.getImageData(x, y, 1, 1).data;
            // 轉為 HEX，確保不足位數補 0
            const hex = "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6).toUpperCase();

            // 更新 UI
            preview.style.backgroundColor = hex;
            glowBg.style.backgroundColor = hex; // 動態更新背景光暈
            hexText.textContent = hex;
            rgbText.textContent = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        };

        // 處理複製功能
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(hexText.textContent).then(() => {
                const originalText = "📋 複製 HEX";
                copyBtn.textContent = "✨ 已複製！";
                copyBtn.classList.replace('bg-slate-800', 'bg-green-500');
                copyBtn.classList.replace('hover:bg-blue-600', 'hover:bg-green-600');

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.replace('bg-green-500', 'bg-slate-800');
                    copyBtn.classList.replace('hover:bg-green-600', 'hover:bg-blue-600');
                }, 1500);
            });
        };
    }, 0);
};
