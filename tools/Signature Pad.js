window.render_signaturePad = function () {
    // 確保 container 存在 (假設 container 是全域變數或已在外部定義)
    if (!typeof container !== 'undefined' && !container) {
        console.error("找不到渲染容器");
        return;
    }

    // 1. 注入更具現代感的 UI
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-slate-100 font-sans">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">✍️</span>
                <h3 class="text-xl font-extrabold text-slate-800">手寫簽名產生器</h3>
            </div>
            <p class="text-slate-500 text-sm mb-5">在下方空白處簽名，即可下載去背透明圖檔，方便貼入 PDF 或數位合約中。</p>
            
            <div class="mb-5 flex flex-wrap gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div class="flex flex-col">
                    <label class="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">筆刷顏色</label>
                    <input type="color" id="signColor" value="#0f172a" class="h-9 w-16 cursor-pointer rounded border-0 bg-transparent p-0">
                </div>
                <div class="flex-1 min-w-[150px]">
                    <label class="text-xs font-bold text-slate-600 mb-1 flex justify-between uppercase tracking-wider">
                        <span>筆刷粗細</span>
                        <span class="text-indigo-600 font-bold"><span id="signSizeVal">4</span>px</span>
                    </label>
                    <input type="range" id="signSize" min="1" max="15" value="4" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
                </div>
                <button id="signClearBtn" class="mt-4 sm:mt-0 px-4 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-200 font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    清除重寫
                </button>
            </div>

            <div class="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors rounded-xl overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3/n52dHUWjsYEYw8QZ0OQoGAgAF2wc06hKxkYAAAAASUVORK5CYII=')]">
                <canvas id="signCanvas" width="1200" height="600" class="w-full h-auto aspect-[2/1] bg-transparent cursor-crosshair touch-none"></canvas>
            </div>
            
            <button id="signDownloadBtn" class="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-lg flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                下載透明簽名圖檔
            </button>
        </div>
    `;

    // 2. 使用 requestAnimationFrame 確保 DOM 已經真正渲染完畢
    requestAnimationFrame(() => {
        const canvas = document.getElementById('signCanvas');
        // 防呆：如果工具被快速切換導致 canvas 不存在，則中斷執行
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const colorInput = document.getElementById('signColor');
        const sizeInput = document.getElementById('signSize');
        const sizeVal = document.getElementById('signSizeVal');
        const clearBtn = document.getElementById('signClearBtn');
        const downloadBtn = document.getElementById('signDownloadBtn');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let hasDrawn = false; // 紀錄是否有下筆

        // 取得正確的座標 (處理 CSS 縮放與內部解析度差異)
        function getCoordinates(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            // 計算縮放比例：內部解析度 (1200x600) / 實際顯示尺寸
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        // 開始繪圖
        function startDrawing(e) {
            isDrawing = true;
            hasDrawn = true;
            const coords = getCoordinates(e);
            lastX = coords.x;
            lastY = coords.y;

            // 畫一個圓點，讓使用者即使只點一下也能留下痕跡
            ctx.beginPath();
            ctx.arc(lastX, lastY, sizeInput.value / 2, 0, Math.PI * 2);
            ctx.fillStyle = colorInput.value;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }

        // 繪圖中
        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault(); // 防止手機端滑動頁面

            const coords = getCoordinates(e);

            ctx.lineTo(coords.x, coords.y);
            ctx.strokeStyle = colorInput.value;
            ctx.lineWidth = sizeInput.value;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            lastX = coords.x;
            lastY = coords.y;
        }

        // 結束繪圖
        function stopDrawing() {
            isDrawing = false;
        }

        // 綁定滑鼠事件
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // 綁定觸控事件 (加入 passive: false 以允許 e.preventDefault())
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        // 筆刷粗細連動顯示
        sizeInput.addEventListener('input', () => {
            sizeVal.textContent = sizeInput.value;
        });

        // 清除畫布
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hasDrawn = false; // 重置繪圖狀態
        });

        // 下載圖檔
        downloadBtn.addEventListener('click', () => {
            if (!hasDrawn) {
                alert("請先在畫布上簽名後再下載喔！");
                return;
            }

            const link = document.createElement('a');
            // 使用更易讀的時間戳記作為檔名
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            link.download = `Signature_${dateStr}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
};
