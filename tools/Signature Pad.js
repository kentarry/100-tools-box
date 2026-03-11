window.render_signaturePad = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold text-slate-800 mb-2">✍️ 手寫簽名產生器</h3>
            <p class="text-slate-500 text-sm mb-4">在下方空白處簽名，即可下載去背透明圖檔，方便貼入 PDF 或合約中。</p>
            
            <div class="mb-4 flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                    <label class="text-sm font-bold text-slate-700 block mb-1">筆刷顏色</label>
                    <input type="color" id="signColor" value="#000000" class="h-8 w-16 cursor-pointer">
                </div>
                <div class="flex-1">
                    <label class="text-sm font-bold text-slate-700 block mb-1">筆刷粗細 (<span id="signSizeVal">3</span>px)</label>
                    <input type="range" id="signSize" min="1" max="10" value="3" class="w-full cursor-pointer">
                </div>
                <button id="signClearBtn" class="mt-5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition">清除重寫</button>
            </div>

            <div class="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3/n52dHUWjsYEYw8QZ0OQoGAgAF2wc06hKxkYAAAAASUVORK5CYII=')]">
                <canvas id="signCanvas" width="600" height="300" class="w-full bg-transparent cursor-crosshair touch-none"></canvas>
            </div>
            
            <button id="signDownloadBtn" class="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition text-lg">
                ⬇️ 下載透明簽名圖檔
            </button>
        </div>
    `;

    setTimeout(() => {
        const canvas = document.getElementById('signCanvas');
        const ctx = canvas.getContext('2d');
        const colorInput = document.getElementById('signColor');
        const sizeInput = document.getElementById('signSize');
        const sizeVal = document.getElementById('signSizeVal');
        const clearBtn = document.getElementById('signClearBtn');
        const downloadBtn = document.getElementById('signDownloadBtn');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // 確保畫布尺寸正確對應 CSS 顯示尺寸
        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            // 保持原本的寬高比例或固定高度
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            // 支援滑鼠與觸控
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = colorInput.value;
            ctx.lineWidth = sizeInput.value;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            lastX = x;
            lastY = y;
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        // 觸控支援
        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.touches[0].clientX - rect.left;
            lastY = e.touches[0].clientY - rect.top;
        }, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);

        sizeInput.addEventListener('input', () => sizeVal.textContent = sizeInput.value);

        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        downloadBtn.addEventListener('click', () => {
            // 檢查是否全白/全透明 (這裡簡化，直接下載)
            const link = document.createElement('a');
            link.download = `signature_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }, 0);
};