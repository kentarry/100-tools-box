window.render_watermark = function () {
    // 注入專屬 CSS 與 HTML 結構 (包含四大分頁與刪除功能)
    container.innerHTML = `
        <style>
            .wm-app { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; --primary: #3b82f6; --primary-hover: #2563eb; --danger: #ef4444; --danger-hover: #dc2626; --warning: #f59e0b; --warning-hover: #d97706; --bg: #f8fafc; --border: #e2e8f0; --text: #334155; }
            .wm-card { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 24px; display: flex; flex-direction: column; gap: 20px; }
            
            /* 分頁導覽列樣式 */
            .wm-tabs { display: flex; background: #f1f5f9; border-radius: 12px; padding: 4px; gap: 4px; flex-wrap: wrap; }
            .wm-tab { flex: 1; text-align: center; padding: 10px 4px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #64748b; transition: all 0.3s ease; border: none; background: transparent; font-size: 0.9rem; min-width: 80px; }
            .wm-tab.active { background: #ffffff; color: var(--primary); box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .wm-tab:hover:not(.active) { color: #334155; background: #e2e8f0; }
            .wm-panel { display: none; flex-direction: column; gap: 15px; animation: fadeIn 0.3s ease; }
            .wm-panel.active { display: flex; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .wm-dropzone { border: 2px dashed #94a3b8; border-radius: 12px; padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #f1f5f9; }
            .wm-dropzone:hover, .wm-dropzone.dragover { border-color: var(--primary); background: #e0f2fe; }
            .wm-input, .wm-select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; margin-top: 5px; outline: none; transition: border 0.3s; box-sizing: border-box; }
            .wm-input:focus, .wm-select:focus { border-color: var(--primary); }
            .wm-label { font-weight: 600; font-size: 0.9rem; color: var(--text); display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
            .wm-range { width: 100%; accent-color: var(--primary); margin-top: 8px; }
            
            .wm-btn { background-color: var(--primary); color: white; font-weight: bold; width: 100%; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
            .wm-btn:hover { background-color: var(--primary-hover); transform: translateY(-2px); }
            .wm-btn:active { transform: translateY(0); }
            .wm-btn.danger { background-color: var(--danger); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
            .wm-btn.danger:hover { background-color: var(--danger-hover); }
            .wm-btn.warning { background-color: var(--warning); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); color: #fff; }
            .wm-btn.warning:hover { background-color: var(--warning-hover); }
            
            .wm-preview-box { background-image: repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9), repeating-linear-gradient(45deg, #f1f5f9 25%, #ffffff 25%, #ffffff 75%, #f1f5f9 75%, #f1f5f9); background-position: 0 0, 10px 10px; background-size: 20px 20px; border: 1px solid var(--border); border-radius: 12px; min-height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 15px; position: relative; }
            .wm-row { display: flex; gap: 10px; align-items: flex-end; }
            .wm-col { flex: 1; }
            #wmCanvas { display: none; max-width: 100%; max-height: 600px; object-fit: contain; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2); border-radius: 4px; }
            
            .instruction-box { background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #92400e; line-height: 1.5; margin: 0; }
        </style>

        <div class="wm-app" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; width: 100%; text-align: left;">
            <div class="wm-card">
                <div id="wmDropzone" class="wm-dropzone">
                    <svg style="width: 40px; height: 40px; color: #64748b; margin-bottom: 10px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <p style="margin: 0; font-weight: bold; color: #334155;">點擊上傳 或 將圖片拖曳至此</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #94a3b8;">支援 JPG, PNG, WebP</p>
                    <input type="file" id="wmUp" accept="image/png, image/jpeg, image/webp" style="display: none;">
                </div>

                <div class="wm-tabs">
                    <button class="wm-tab active" data-tab="add">🛡️ 加浮水印</button>
                    <button class="wm-tab" data-tab="heal">✨ 仿印修復</button>
                    <button class="wm-tab" data-tab="mosaic">🔲 加馬賽克</button>
                    <button class="wm-tab" data-tab="unmosaic">🪄 柔化馬賽克</button>
                </div>

                <div class="wm-panel active" id="tab-add">
                    <div>
                        <label class="wm-label">✍️ 浮水印內容</label>
                        <input type="text" id="wmTxt" class="wm-input" value="僅供辦理OO業務使用，他用無效" placeholder="請輸入浮水印文字">
                    </div>
                    <div class="wm-row">
                        <div class="wm-col" style="flex: 0.8;">
                            <label class="wm-label">字體與樣式</label>
                            <select id="wmFont" class="wm-select">
                                <option value="sans-serif">預設黑體</option>
                                <option value="serif">優雅明體</option>
                                <option value="monospace">等寬字體</option>
                            </select>
                        </div>
                        <div class="wm-col" style="flex: 1.2;">
                            <label class="wm-label">排版模式</label>
                            <select id="wmMode" class="wm-select">
                                <option value="tile">滿版交錯 (防盜最佳)</option>
                                <option value="center">置中單一</option>
                            </select>
                        </div>
                    </div>
                    <div class="wm-row">
                        <div>
                            <label class="wm-label">顏色</label>
                            <input type="color" id="wmColor" value="#ffffff" style="width: 50px; height: 40px; padding: 0; border: none; border-radius: 8px; cursor: pointer; margin-top: 5px;">
                        </div>
                        <div class="wm-col">
                            <label class="wm-label">不透明度 <span><span id="wmOpVal">50</span>%</span></label>
                            <input type="range" id="wmOp" class="wm-range" min="0" max="100" value="50">
                        </div>
                    </div>
                    <div>
                        <label class="wm-label">📐 文字大小 <span><span id="wmSizeVal">40</span>px</span></label>
                        <input type="range" id="wmSize" class="wm-range" min="15" max="150" value="40">
                    </div>
                    <div>
                        <label class="wm-label">🔄 旋轉角度 <span><span id="wmAngleVal">-30</span>°</span></label>
                        <input type="range" id="wmAngle" class="wm-range" min="-90" max="90" value="-30">
                    </div>
                    <div>
                        <label class="wm-label">📏 分布間距 <span><span id="wmSpaceVal">120</span>px</span></label>
                        <input type="range" id="wmSpace" class="wm-range" min="20" max="400" value="120">
                    </div>
                </div>

                <div class="wm-panel" id="tab-heal">
                    <p class="instruction-box">
                        <strong>💡 無痕修復教學 (仿製印章)：</strong><br>
                        1. 按住鍵盤 <strong>Shift 鍵</strong>，點擊圖片上「乾淨」的背景作為取樣點。<br>
                        2. 放開 Shift 鍵，將滑鼠移到瑕疵處<strong>按住左鍵塗抹</strong>進行覆蓋。
                    </p>
                    <div>
                        <label class="wm-label">🖌️ 修復筆刷大小 <span><span id="wmHealSizeVal">40</span>px</span></label>
                        <input type="range" id="wmHealSize" class="wm-range" min="10" max="150" value="40">
                    </div>
                </div>

                <div class="wm-panel" id="tab-mosaic">
                    <p class="instruction-box">
                        <strong>⚠️ 注意：</strong>馬賽克會永久覆蓋影像資訊，適用於遮蔽個資。
                    </p>
                    <div>
                        <label class="wm-label">🧽 筆刷大小 <span><span id="wmBrushSizeVal">30</span>px</span></label>
                        <input type="range" id="wmBrushSize" class="wm-range" min="10" max="100" value="30">
                    </div>
                    <div>
                        <label class="wm-label">🧱 馬賽克強度 (顆粒大小)</label>
                        <input type="range" id="wmBrushStrength" class="wm-range" min="5" max="50" value="15">
                    </div>
                </div>

                <div class="wm-panel" id="tab-unmosaic">
                    <p class="instruction-box" style="background:#eff6ff; border-color:#bfdbfe; color:#1e3a8a;">
                        <strong>🪄 技術限制說明：</strong><br>
                        純前端技術無法將馬賽克「還原」出真實細節。此工具透過高階柔化演算法，將方塊邊緣模糊化，使其在視覺上變得自然平滑。
                    </p>
                    <div>
                        <label class="wm-label">🧽 柔化筆刷大小 <span><span id="wmUnmosaicSizeVal">30</span>px</span></label>
                        <input type="range" id="wmUnmosaicSize" class="wm-range" min="10" max="150" value="30">
                    </div>
                    <div>
                        <label class="wm-label">💧 柔化強度 <span><span id="wmUnmosaicStrengthVal">5</span></span></label>
                        <input type="range" id="wmUnmosaicStrength" class="wm-range" min="1" max="20" value="5">
                    </div>
                </div>

                <div style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <div class="wm-row" style="margin-bottom: 10px;">
                        <button id="wmDeleteBtn" class="wm-btn danger wm-col">
                            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            刪除圖片
                        </button>
                        <button id="wmResetBtn" class="wm-btn warning wm-col">
                            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            還原原圖
                        </button>
                    </div>
                    <button id="wmDownloadBtn" class="wm-btn">
                        <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        下載最終圖片
                    </button>
                </div>
            </div>

            <div class="wm-preview-box" id="wmPreviewBox">
                <div id="wmEmpty" style="color: #64748b; text-align: center;">
                    <svg style="width: 64px; height: 64px; margin: 0 auto 10px auto; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">預覽區</p>
                    <p style="font-size: 0.9rem; margin-top: 5px;">請先上傳圖片</p>
                </div>
                <canvas id="wmCanvas"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        // --- DOM 元素獲取 ---
        const dropzone = document.getElementById('wmDropzone');
        const imgUp = document.getElementById('wmUp');
        const canvas = document.getElementById('wmCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const emptyState = document.getElementById('wmEmpty');

        const tabs = document.querySelectorAll('.wm-tab');
        const panels = document.querySelectorAll('.wm-panel');

        // 按鈕
        const downloadBtn = document.getElementById('wmDownloadBtn');
        const resetBtn = document.getElementById('wmResetBtn');
        const deleteBtn = document.getElementById('wmDeleteBtn'); // 新增刪除按鈕

        // 水印控制項
        const textIn = document.getElementById('wmTxt');
        const colorIn = document.getElementById('wmColor');
        const opIn = document.getElementById('wmOp');
        const sizeIn = document.getElementById('wmSize');
        const spaceIn = document.getElementById('wmSpace');
        const angleIn = document.getElementById('wmAngle');
        const fontIn = document.getElementById('wmFont');
        const modeIn = document.getElementById('wmMode');

        // 修復與馬賽克控制項
        const healSizeIn = document.getElementById('wmHealSize');
        const brushSizeIn = document.getElementById('wmBrushSize');
        const brushStrengthIn = document.getElementById('wmBrushStrength');

        // 移除馬賽克(柔化)控制項
        const unmosaicSizeIn = document.getElementById('wmUnmosaicSize');
        const unmosaicStrengthIn = document.getElementById('wmUnmosaicStrength');

        // --- 狀態管理 ---
        let originalImage = null;
        let currentMode = 'add'; // 'add', 'heal', 'mosaic', 'unmosaic'
        let isDrawing = false;

        // 仿製印章專用變數
        let cloneSource = null;
        let cloneOffset = { dx: 0, dy: 0 };

        // --- 核心邏輯 ---

        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        function render() {
            if (!originalImage) return;

            if (currentMode === 'add') {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0);
                drawWatermark();
            } else {
                // heal, mosaic, unmosaic 模式下
                if (canvas.width !== originalImage.width) {
                    canvas.width = originalImage.width;
                    canvas.height = originalImage.height;
                    ctx.drawImage(originalImage, 0, 0);
                }
            }
        }

        function drawWatermark() {
            const text = textIn.value;
            const alpha = parseInt(opIn.value) / 100;
            if (!text.trim() || alpha === 0) return;

            const size = parseInt(sizeIn.value);
            const space = parseInt(spaceIn.value);
            const angle = parseInt(angleIn.value) * Math.PI / 180;
            const font = fontIn.value;
            const mode = modeIn.value;

            ctx.fillStyle = hexToRgba(colorIn.value, alpha);
            const r = parseInt(colorIn.value.slice(1, 3), 16);
            ctx.strokeStyle = r > 128 ? `rgba(0,0,0,${alpha * 0.8})` : `rgba(255,255,255,${alpha * 0.8})`;
            ctx.lineWidth = size * 0.05;
            ctx.font = `bold ${size}px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.save();
            if (mode === 'center') {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
            } else {
                const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                for (let x = -diagonal; x < diagonal; x += space * 2) {
                    for (let y = -diagonal; y < diagonal; y += space) {
                        const offsetX = (Math.abs(y / space) % 2) === 1 ? space : 0;
                        ctx.strokeText(text, x + offsetX, y);
                        ctx.fillText(text, x + offsetX, y);
                    }
                }
            }
            ctx.restore();
        }

        function handleImage(file) {
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    originalImage = img;
                    emptyState.style.display = 'none';
                    canvas.style.display = 'block';
                    canvas.width = 0;
                    render();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }

        // --- 分頁切換事件 ---
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');

                currentMode = tab.dataset.tab;

                if (currentMode === 'heal') canvas.style.cursor = 'crosshair';
                else if (currentMode === 'mosaic' || currentMode === 'unmosaic') canvas.style.cursor = 'cell';
                else canvas.style.cursor = 'default';

                render();
            });
        });

        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (evt.clientX - rect.left) * scaleX,
                y: (evt.clientY - rect.top) * scaleY
            };
        }

        // 執行無痕修復
        function applyHeal(x, y) {
            if (!cloneSource) return;
            const size = parseInt(healSizeIn.value);
            const sourceX = x + cloneOffset.dx;
            const sourceY = y + cloneOffset.dy;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(canvas, sourceX - size / 2, sourceY - size / 2, size, size, x - size / 2, y - size / 2, size, size);
            ctx.restore();
        }

        // 執行馬賽克塗抹
        function applyMosaic(x, y) {
            if (!originalImage) return;
            const brushSize = parseInt(brushSizeIn.value);
            const strength = parseInt(brushStrengthIn.value);
            const halfSize = brushSize / 2;
            const startX = Math.max(0, x - halfSize);
            const startY = Math.max(0, y - halfSize);
            const width = Math.min(canvas.width - startX, brushSize);
            const height = Math.min(canvas.height - startY, brushSize);

            if (width <= 0 || height <= 0) return;
            const imgData = ctx.getImageData(startX, startY, width, height);
            const data = imgData.data;

            for (let i = 0; i < height; i += strength) {
                for (let j = 0; j < width; j += strength) {
                    const pixelIndex = (i * width + j) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];

                    for (let bi = 0; bi < strength; bi++) {
                        for (let bj = 0; bj < strength; bj++) {
                            if (i + bi < height && j + bj < width) {
                                const targetIndex = ((i + bi) * width + (j + bj)) * 4;
                                data[targetIndex] = r;
                                data[targetIndex + 1] = g;
                                data[targetIndex + 2] = b;
                                data[targetIndex + 3] = 255;
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, startX, startY);
        }

        // 執行柔化/模糊馬賽克 (Unmosaic)
        function applyUnmosaic(x, y) {
            if (!originalImage) return;
            const size = parseInt(unmosaicSizeIn.value);
            const strength = parseInt(unmosaicStrengthIn.value);

            // 建立一個暫存畫布來產生模糊效果，避免直接在原畫布疊加產生黑邊
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tCtx = tempCanvas.getContext('2d');

            // 把當前畫面畫過去並套用模糊濾鏡
            tCtx.filter = `blur(${strength}px)`;
            tCtx.drawImage(canvas, 0, 0);

            // 用圓形遮罩將模糊後的畫面畫回原畫布指定的滑鼠位置
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        }

        canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(e);

            if (currentMode === 'heal') {
                if (e.shiftKey) {
                    cloneSource = { x: pos.x, y: pos.y };
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#ef4444';
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.stroke();
                    ctx.restore();
                    setTimeout(() => {
                        render(); // 重繪消除紅點
                    }, 500);
                    return;
                } else {
                    if (!cloneSource) {
                        alert("請先按住 Shift 鍵並點擊圖片中乾淨的區域，以設定修復取樣點！");
                        return;
                    }
                    isDrawing = true;
                    cloneOffset = { dx: cloneSource.x - pos.x, dy: cloneSource.y - pos.y };
                    applyHeal(pos.x, pos.y);
                }
            } else if (currentMode === 'mosaic') {
                isDrawing = true;
                applyMosaic(pos.x, pos.y);
            } else if (currentMode === 'unmosaic') {
                isDrawing = true;
                applyUnmosaic(pos.x, pos.y);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const pos = getMousePos(e);
            if (currentMode === 'heal') {
                applyHeal(pos.x, pos.y);
            } else if (currentMode === 'mosaic') {
                applyMosaic(pos.x, pos.y);
            } else if (currentMode === 'unmosaic') {
                applyUnmosaic(pos.x, pos.y);
            }
        });

        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        // --- 事件綁定 ---
        dropzone.addEventListener('click', () => imgUp.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            handleImage(e.dataTransfer.files[0]);
        });
        imgUp.addEventListener('change', (e) => handleImage(e.target.files[0]));

        const inputs = [textIn, colorIn, opIn, sizeIn, spaceIn, angleIn, fontIn, modeIn, brushSizeIn, healSizeIn, unmosaicSizeIn, unmosaicStrengthIn];
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.id === 'wmOp') document.getElementById('wmOpVal').textContent = input.value;
                if (input.id === 'wmSize') document.getElementById('wmSizeVal').textContent = input.value;
                if (input.id === 'wmSpace') document.getElementById('wmSpaceVal').textContent = input.value;
                if (input.id === 'wmAngle') document.getElementById('wmAngleVal').textContent = input.value;
                if (input.id === 'wmBrushSize') document.getElementById('wmBrushSizeVal').textContent = input.value;
                if (input.id === 'wmHealSize') document.getElementById('wmHealSizeVal').textContent = input.value;
                if (input.id === 'wmUnmosaicSize') document.getElementById('wmUnmosaicSizeVal').textContent = input.value;
                if (input.id === 'wmUnmosaicStrength') document.getElementById('wmUnmosaicStrengthVal').textContent = input.value;

                if (input.id === 'wmMode') {
                    spaceIn.disabled = (input.value === 'center');
                    spaceIn.style.opacity = (input.value === 'center') ? '0.5' : '1';
                }

                if (currentMode === 'add') render();
            });
        });

        // 刪除圖片按鈕事件
        deleteBtn.addEventListener('click', () => {
            if (!originalImage) return alert('目前沒有圖片可以刪除喔！');
            if (confirm('確定要刪除當前圖片並重新開始嗎？')) {
                originalImage = null;
                imgUp.value = ''; // 清空 file input
                canvas.style.display = 'none';
                emptyState.style.display = 'block'; // 顯示預設的上傳提示畫面
            }
        });

        // 還原原圖按鈕事件
        resetBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.drawImage(originalImage, 0, 0);
            if (currentMode === 'add') drawWatermark();
        });

        // 下載圖片事件
        downloadBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            const link = document.createElement('a');
            link.download = `Processed_Image_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });

    }, 0);
};
