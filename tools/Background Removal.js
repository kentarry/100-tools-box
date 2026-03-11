window.render_removeBg = function () {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; gap: 10px; align-items: center; background: #f8fafc; padding: 15px; border-radius: 8px;">
                <input type="file" id="bgImgUpload" accept="image/*">
                <label>容差值: <input type="range" id="bgTolerance" min="0" max="150" value="30"></label>
                <button id="bgDownloadBtn" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">下載結果</button>
            </div>
            <p style="color: #64748b; font-size: 0.9rem;">提示：上傳圖片後，用滑鼠點擊圖片中想要去除的背景顏色。</p>
            <div style="background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: auto; text-align: center;">
                <canvas id="bgCanvas" style="max-width: 100%; cursor: crosshair;"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        const upload = document.getElementById('bgImgUpload');
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const toleranceInput = document.getElementById('bgTolerance');
        const downloadBtn = document.getElementById('bgDownloadBtn');
        let originalImgData = null;

        upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = URL.createObjectURL(file);
        });

        canvas.addEventListener('click', (e) => {
            if (!originalImgData) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            // 取得點擊處的像素顏色
            const clickedPixel = ctx.getImageData(x, y, 1, 1).data;
            const tr = clickedPixel[0], tg = clickedPixel[1], tb = clickedPixel[2];
            const tolerance = parseInt(toleranceInput.value);

            // 每次點擊都從原始圖片重新計算去背，避免重複點擊造成的破圖
            const imgData = new ImageData(
                new Uint8ClampedArray(originalImgData.data),
                originalImgData.width,
                originalImgData.height
            );
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const diff = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
                if (diff <= tolerance) {
                    data[i + 3] = 0; // 設為透明
                }
            }
            ctx.putImageData(imgData, 0, 0);
        });

        downloadBtn.addEventListener('click', () => {
            if (!originalImgData) return alert('請先處理圖片！');
            const link = document.createElement('a');
            link.download = `nobg_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }, 0);
};