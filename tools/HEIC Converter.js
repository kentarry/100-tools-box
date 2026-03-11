window.render_heicConverter = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h3 class="text-2xl font-bold text-slate-800 mb-2">📸 HEIC 轉 JPG 轉換器</h3>
            <p class="text-slate-500 mb-6">解決 iPhone 照片在 Windows 無法開啟的痛點。純瀏覽器處理，不傳送至伺服器。</p>
            
            <div id="heicDropZone" class="border-4 border-dashed border-slate-100 rounded-2xl p-10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-6">
                <input type="file" id="heicInput" accept=".heic" class="hidden">
                <div class="text-slate-400 text-5xl mb-4">🖼️</div>
                <p class="text-slate-600 font-bold">點擊或拖曳 HEIC 照片到這裡</p>
                <p class="text-slate-400 text-xs mt-2">支援單張 HEIC 轉換</p>
            </div>

            <div id="heicLoading" class="hidden py-4 text-emerald-600 font-bold animate-pulse">正在轉換中，請稍候...</div>
            <div id="heicPreview" class="hidden mt-4 bg-white p-2 border border-slate-200 rounded-lg">
                <img id="jpgResult" class="max-w-full rounded-lg shadow-sm">
                <button id="heicDownload" class="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition">⬇️ 下載 JPG 照片</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('heicInput');
        const dropZone = document.getElementById('heicDropZone');
        const loading = document.getElementById('heicLoading');
        const preview = document.getElementById('heicPreview');
        const resultImg = document.getElementById('jpgResult');
        const downloadBtn = document.getElementById('heicDownload');

        // 動態載入 heic2any 庫
        if (!window.heic2any) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
            document.head.appendChild(script);
        }

        dropZone.onclick = () => input.click();

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            loading.classList.remove('hidden');
            preview.classList.add('hidden');

            try {
                const blob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8
                });
                const url = URL.createObjectURL(blob);
                resultImg.src = url;
                preview.classList.remove('hidden');

                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name.replace(/\.heic/i, '.jpg');
                    a.click();
                };
            } catch (err) {
                alert("轉換失敗，請確認檔案格式是否正確。");
            } finally {
                loading.classList.add('hidden');
            }
        };
    }, 0);
};