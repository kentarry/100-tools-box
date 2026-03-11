window.render_watermark = function () {
    // 注入專屬 CSS 與 HTML 結構
    container.innerHTML = `
        <style>
            .wm-app { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; --primary: #3b82f6; --primary-hover: #2563eb; --bg: #f8fafc; --border: #e2e8f0; --text: #334155; }
            .wm-card { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 24px; }
            .wm-dropzone { border: 2px dashed #94a3b8; border-radius: 12px; padding: 30px 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #f1f5f9; }
            .wm-dropzone:hover, .wm-dropzone.dragover { border-color: var(--primary); background: #e0f2fe; }
            .wm-input, .wm-select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; margin-top: 5px; outline: none; transition: border 0.3s; box-sizing: border-box; }
            .wm-input:focus, .wm-select:focus { border-color: var(--primary); }
            .wm-label { font-weight: 600; font-size: 0.9rem; color: var(--text); display: block; margin-top: 15px; }
            .wm-range { width: 100%; accent-color: var(--primary); margin-top: 8px; }
            .wm-btn { background-color: var(--primary); color: white; font-weight: bold; width: 100%; margin-top: 25px; padding: 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 1.05rem; transition: background 0.3s, transform 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
            .wm-btn:hover { background-color: var(--primary-hover); transform: translateY(-2px); }
            .wm-btn:active { transform: translateY(0); }
            .wm-preview-box { background-image: repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9), repeating-linear-gradient(45deg, #f1f5f9 25%, #ffffff 25%, #ffffff 75%, #f1f5f9 75%, #f1f5f9); background-position: 0 0, 10px 10px; background-size: 20px 20px; border: 1px solid var(--border); border-radius: 12px; min-height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 15px; }
            .wm-row { display: flex; gap: 15px; align-items: flex-end; }
            .wm-col { flex: 1; }
        </style>

        <div class="wm-app" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; width: 100%; text-align: left;">
            <div class="wm-card">
                <h3 style="margin: 0 0 20px 0; color: #0f172a; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                    🛡️ 專業圖片浮水印工具
                </h3>
                
                <div id="wmDropzone" class="wm-dropzone">
                    <svg style="width: 40px; height: 40px; color: #64748b; margin-bottom: 10px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <p style="margin: 0; font-weight: bold; color: #334155;">點擊上傳 或 將圖片拖曳至此</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #94a3b8;">支援 JPG, PNG, WebP</p>
                    <input type="file" id="wmUp" accept="image/png, image/jpeg, image/webp" style="display: none;">
                </div>

                <label class="wm-label">✍️ 浮水印內容</label>
                <input type="text" id="wmTxt" class="wm-input" value="僅供辦理OO業務使用，他用無效" placeholder="請輸入浮水印文字">

                <div class="wm-row">
                    <div class="wm-col" style="flex: 0.8;">
                        <label class="wm-label">字體與樣式</label>
                        <select id="wmFont" class="wm-select">
                            <option value="sans-serif">預設黑體</option>
                            <option value="serif">優雅明體</option>
                            <option value="monospace">等寬字體</option>
                            <option value="cursive">手寫風格</option>
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
                        <label class="wm-label">不透明度 (<span id="wmOpVal">50</span>%)</label>
                        <input type="range" id="wmOp" class="wm-range" min="5" max="100" value="50">
                    </div>
                </div>

                <label class="wm-label">📐 文字大小 (<span id="wmSizeVal">40</span>px)</label>
                <input type="range" id="wmSize" class="wm-range" min="15" max="150" value="40">

                <label class="wm-label">🔄 旋轉角度 (<span id="wmAngleVal">-30</span>°)</label>
                <input type="range" id="wmAngle" class="wm-range" min="-90" max="90" value="-30">

                <label class="wm-label">📏 分布間距 (<span id="wmSpaceVal">120</span>px)</label>
                <input type="range" id="wmSpace" class="wm-range" min="20" max="400" value="120">

                <button id="wmBtn" class="wm-btn">
                    <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    下載安全圖片
                </button>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 12px; text-align: center;">🛡️ 本機端運行，資料不傳送至伺服器，絕對安全。</p>
            </div>

            <div class="wm-preview-box">
                <div id="wmEmpty" style="color: #64748b; text-align: center;">
                    <svg style="width: 64px; height: 64px; margin: 0 auto 10px auto; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p style="font-size: 1.1rem; font-weight: bold; margin: 0;">預覽區</p>
                    <p style="font-size: 0.9rem; margin-top: 5px;">請先上傳圖片</p>
                </div>
                <canvas id="wmCanvas" style="display: none; max-width: 100%; max-height: 600px; object-fit: contain; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2); border-radius: 4px;"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        // DOM 元素綁定
        const dropzone = document.getElementById('wmDropzone');
        const imgUp = document.getElementById('wmUp');
        const textIn = document.getElementById('wmTxt');
        const colorIn = document.getElementById('wmColor');
        const opIn = document.getElementById('wmOp');
        const sizeIn = document.getElementById('wmSize');
        const spaceIn = document.getElementById('wmSpace');
        const angleIn = document.getElementById('wmAngle');
        const fontIn = document.getElementById('wmFont');
        const modeIn = document.getElementById('wmMode');
        const btn = document.getElementById('wmBtn');
        const canvas = document.getElementById('wmCanvas');
        const ctx = canvas.getContext('2d');
        const emptyState = document.getElementById('wmEmpty');

        let currentImage = null;

        // HEX 轉 RGBA 輔助函數
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // 核心繪圖函數
        function drawWatermark() {
            if (!currentImage) return;

            // 確保每次重新繪製時畫布乾淨
            canvas.width = currentImage.width;
            canvas.height = currentImage.height;
            ctx.drawImage(currentImage, 0, 0);

            const text = textIn.value;
            if (!text.trim()) return; // 如果沒有文字就不畫浮水印

            const size = parseInt(sizeIn.value);
            const space = parseInt(spaceIn.value);
            const angle = parseInt(angleIn.value) * Math.PI / 180;
            const alpha = parseInt(opIn.value) / 100;
            const font = fontIn.value;
            const mode = modeIn.value;

            // 設定文字樣式
            ctx.fillStyle = hexToRgba(colorIn.value, alpha);
            // 根據字體亮度決定描邊顏色（白字配黑邊，黑字配白邊）
            const r = parseInt(colorIn.value.slice(1, 3), 16);
            ctx.strokeStyle = r > 128 ? `rgba(0,0,0,${alpha * 0.8})` : `rgba(255,255,255,${alpha * 0.8})`;
            ctx.lineWidth = size * 0.05; // 描邊粗細隨字體大小變化
            ctx.font = `bold ${size}px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.save(); // 儲存畫布狀態

            if (mode === 'center') {
                // 模式：置中單一
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
            } else {
                // 模式：滿版交錯
                const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);

                // 擴大繪製範圍確保旋轉後不會有空白角落
                for (let x = -diagonal; x < diagonal; x += space * 2) {
                    for (let y = -diagonal; y < diagonal; y += space) {
                        const offsetX = (Math.abs(y / space) % 2) === 1 ? space : 0; // 交錯排列
                        ctx.strokeText(text, x + offsetX, y); // 畫描邊
                        ctx.fillText(text, x + offsetX, y);   // 畫主色
                    }
                }
            }

            ctx.restore(); // 恢復畫布狀態
        }

        // 處理圖片載入
        function handleImage(file) {
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    currentImage = img;
                    emptyState.style.display = 'none';
                    canvas.style.display = 'block';
                    drawWatermark();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }

        // 拖曳與點擊上傳事件
        dropzone.addEventListener('click', () => imgUp.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            handleImage(e.dataTransfer.files[0]);
        });
        imgUp.addEventListener('change', (e) => handleImage(e.target.files[0]));

        // 監聽所有輸入變化並即時更新
        const inputs = [textIn, colorIn, opIn, sizeIn, spaceIn, angleIn, fontIn, modeIn];
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // 更新數值顯示
                if (input.id === 'wmOp') document.getElementById('wmOpVal').textContent = input.value;
                if (input.id === 'wmSize') document.getElementById('wmSizeVal').textContent = input.value;
                if (input.id === 'wmSpace') document.getElementById('wmSpaceVal').textContent = input.value;
                if (input.id === 'wmAngle') document.getElementById('wmAngleVal').textContent = input.value;

                // 模式切換時動態禁用/啟用間距滑桿
                if (input.id === 'wmMode') {
                    spaceIn.disabled = (input.value === 'center');
                    spaceIn.style.opacity = (input.value === 'center') ? '0.5' : '1';
                }

                drawWatermark();
            });
        });

        // 下載圖片
        btn.addEventListener('click', () => {
            if (!currentImage) return alert('請先上傳圖片！');
            const link = document.createElement('a');
            link.download = `Secure_Image_${Date.now()}.png`;
            // 使用高畫質導出
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });

    }, 0);
};
