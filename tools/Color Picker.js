window.render_colorPicker = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div class="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 class="text-xl font-bold mb-4">🎨 圖片色碼擷取</h3>
                <input type="file" id="cpUpload" accept="image/*" class="mb-4 block w-full text-sm text-slate-500">
                <div class="relative overflow-auto border border-slate-100 rounded-lg bg-slate-50" style="max-height: 500px;">
                    <canvas id="cpCanvas" class="cursor-crosshair"></canvas>
                </div>
            </div>
            <div class="w-full md:w-64 space-y-4">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                    <div id="cpPreview" class="w-full h-24 rounded-xl border-4 border-slate-100 mb-4 bg-white"></div>
                    <p id="cpHex" class="text-2xl font-mono font-bold text-slate-800">#FFFFFF</p>
                    <p id="cpRgb" class="text-sm text-slate-400 font-mono">rgb(255, 255, 255)</p>
                    <button id="cpCopy" class="mt-4 w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">📋 複製 HEX</button>
                </div>
                <div class="p-4 bg-blue-50 text-blue-700 rounded-xl text-xs leading-relaxed">
                    💡 點擊圖片任何地方即可擷取顏色。
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const upload = document.getElementById('cpUpload');
        const canvas = document.getElementById('cpCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const preview = document.getElementById('cpPreview');
        const hexText = document.getElementById('cpHex');
        const rgbText = document.getElementById('cpRgb');
        const copyBtn = document.getElementById('cpCopy');

        upload.onchange = (e) => {
            const file = e.target.files[0];
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = URL.createObjectURL(file);
        };

        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            const p = ctx.getImageData(x, y, 1, 1).data;
            const hex = "#" + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1).toUpperCase();

            preview.style.backgroundColor = hex;
            hexText.textContent = hex;
            rgbText.textContent = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        };

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(hexText.textContent);
            const original = copyBtn.textContent;
            copyBtn.textContent = "✅ 已複製";
            setTimeout(() => copyBtn.textContent = original, 2000);
        };
    }, 0);
};