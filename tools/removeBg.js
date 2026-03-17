window.render_removeBg = function () {
    container.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 24px; text-align: center; position: relative;">
                <h2 style="margin: 0; font-size: 1.75rem; font-weight: 700; letter-spacing: 0.5px;">專業色彩去背工具</h2>
                <p style="margin: 8px 0 0 0; font-size: 0.95rem; color: #cbd5e1;">上傳圖片 ➔ 點擊背景 ➔ 調整參數 ➔ 下載完美去背圖</p>
            </div>

            <div style="padding: 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #334155; margin-bottom: 8px; font-size: 0.9rem;">1. 選擇圖片</label>
                        <input type="file" id="bgImgUpload" accept="image/*" style="width: 100%; padding: 10px; border: 2px dashed #cbd5e1; border-radius: 8px; background: white; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='#3b82f6'" onmouseout="this.style.borderColor='#cbd5e1'">
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; color: #334155; font-size: 0.9rem;">
                            <input type="checkbox" id="bgContiguous" checked style="width: 18px; height: 18px; accent-color: #3b82f6;">
                            魔術棒模式 (僅移除相連區域)
                        </label>
                        <p style="margin: 4px 0 0 26px; font-size: 0.8rem; color: #64748b;">取消勾選則會移除全圖相同顏色</p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div>
                        <label style="display: flex; justify-content: space-between; font-weight: 600; color: #334155; margin-bottom: 8px; font-size: 0.9rem;">
                            <span>2. 容差值 (Tolerance)</span>
                            <span id="tolValue" style="color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem;">30</span>
                        </label>
                        <input type="range" id="bgTolerance" min="0" max="150" value="30" style="width: 100%; accent-color: #3b82f6; cursor: pointer;">
                    </div>
                    <div>
                        <label style="display: flex; justify-content: space-between; font-weight: 600; color: #334155; margin-bottom: 8px; font-size: 0.9rem;">
                            <span>3. 邊緣平滑度 (Feather)</span>
                            <span id="smoothValue" style="color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem;">15</span>
                        </label>
                        <input type="range" id="bgSmoothness" min="0" max="100" value="15" style="width: 100%; accent-color: #3b82f6; cursor: pointer;">
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 16px;">
                    <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; font-weight: 600; color: #334155; font-size: 0.9rem;">
                        目標顏色: 
                        <div id="targetColorBox" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #e2e8f0; background: repeating-conic-gradient(#cbd5e1 0% 25%, transparent 0% 50%) 50% / 10px 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"></div>
                        <span id="processStatus" style="margin-left: auto; color: #10b981; font-size: 0.85rem; display: none;">處理完成 ✓</span>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button id="bgResetBtn" style="flex: 1; padding: 12px; background: white; color: #475569; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='white'">還原原圖</button>
                        <button id="bgDownloadBtn" style="flex: 1.5; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 8px -1px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(59, 130, 246, 0.3)'">📥 下載結果</button>
                    </div>
                </div>
            </div>

            <div style="padding: 24px; background: #f1f5f9; position: relative;">
                <div id="loadingOverlay" style="display: none; position: absolute; inset: 0; background: rgba(255,255,255,0.7); z-index: 10; align-items: center; justify-content: center; font-weight: bold; color: #3b82f6; font-size: 1.2rem;">處理中...</div>
                
                <div style="background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; border: 1px solid #cbd5e1; border-radius: 12px; overflow: auto; text-align: center; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); min-height: 300px; display: flex; align-items: center; justify-content: center; position: relative;">
                    <span id="placeholderText" style="color: #64748b; font-size: 1.1rem; font-weight: 500;">請點擊左上方「選擇圖片」開始</span>
                    <canvas id="bgCanvas" style="max-width: 100%; cursor: crosshair; display: none; margin: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></canvas>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const upload = document.getElementById('bgImgUpload');
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const toleranceInput = document.getElementById('bgTolerance');
        const smoothnessInput = document.getElementById('bgSmoothness');
        const contiguousCheckbox = document.getElementById('bgContiguous');
        const tolValueDisp = document.getElementById('tolValue');
        const smoothValueDisp = document.getElementById('smoothValue');

        const downloadBtn = document.getElementById('bgDownloadBtn');
        const resetBtn = document.getElementById('bgResetBtn');
        const targetColorBox = document.getElementById('targetColorBox');
        const placeholderText = document.getElementById('placeholderText');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const processStatus = document.getElementById('processStatus');

        let originalImgData = null;
        let targetRGB = null;
        let clickPos = null;

        // 計算兩個顏色的立體空間距離
        function colorDistance(r1, g1, b1, r2, g2, b2) {
            return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
        }

        // 核心去背運算
        function processImage() {
            if (!originalImgData || !targetRGB || !clickPos) return;

            loadingOverlay.style.display = 'flex';
            processStatus.style.display = 'none';

            // 使用 setTimeout 讓瀏覽器有時間渲染 Loading 畫面
            setTimeout(() => {
                const tolerance = parseInt(toleranceInput.value);
                const smoothness = parseInt(smoothnessInput.value);
                const isContiguous = contiguousCheckbox.checked;

                const width = originalImgData.width;
                const height = originalImgData.height;
                const imgData = new ImageData(new Uint8ClampedArray(originalImgData.data), width, height);
                const data = imgData.data;

                const tr = targetRGB.r, tg = targetRGB.g, tb = targetRGB.b;
                const totalTolerance = tolerance + smoothness;

                if (isContiguous) {
                    // 魔術棒模式 (高效能 BFS 廣度優先搜尋)
                    const visited = new Uint8Array(width * height);
                    const queueX = new Int32Array(width * height);
                    const queueY = new Int32Array(width * height);
                    let head = 0, tail = 0;

                    // 推入起始點
                    queueX[tail] = clickPos.x; queueY[tail] = clickPos.y; tail++;
                    visited[clickPos.y * width + clickPos.x] = 1;

                    while (head < tail) {
                        const x = queueX[head];
                        const y = queueY[head];
                        head++;

                        const index = (y * width + x) * 4;
                        const r = originalImgData.data[index];
                        const g = originalImgData.data[index + 1];
                        const b = originalImgData.data[index + 2];

                        const diff = colorDistance(r, g, b, tr, tg, tb);

                        if (diff <= totalTolerance) {
                            if (diff <= tolerance) {
                                data[index + 3] = 0; // 完全透明
                            } else {
                                // 邊緣平滑
                                const alphaRatio = (diff - tolerance) / smoothness;
                                data[index + 3] = Math.floor(255 * alphaRatio);
                            }

                            // 檢查上下左右相鄰像素
                            const neighbors = [
                                [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
                            ];

                            for (let [nx, ny] of neighbors) {
                                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                    const nIdx = ny * width + nx;
                                    if (visited[nIdx] === 0) {
                                        visited[nIdx] = 1;
                                        queueX[tail] = nx; queueY[tail] = ny; tail++;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // 全圖模式 (原有邏輯，全域掃描)
                    for (let i = 0; i < data.length; i += 4) {
                        const r = originalImgData.data[i];
                        const g = originalImgData.data[i + 1];
                        const b = originalImgData.data[i + 2];

                        const diff = colorDistance(r, g, b, tr, tg, tb);

                        if (diff <= tolerance) {
                            data[i + 3] = 0;
                        } else if (diff <= totalTolerance) {
                            const alphaRatio = (diff - tolerance) / smoothness;
                            data[i + 3] = Math.floor(255 * alphaRatio);
                        }
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                loadingOverlay.style.display = 'none';
                processStatus.style.display = 'inline-block';
            }, 10);
        }

        // 事件監聽：上傳圖片
        upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                placeholderText.style.display = 'none';
                canvas.style.display = 'block';
                targetRGB = null;
                clickPos = null;
                targetColorBox.style.background = 'repeating-conic-gradient(#cbd5e1 0% 25%, transparent 0% 50%) 50% / 10px 10px';
                processStatus.style.display = 'none';
            };
            img.src = URL.createObjectURL(file);
        });

        // 事件監聽：點擊畫布取色
        canvas.addEventListener('click', (e) => {
            if (!originalImgData) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            clickPos = { x, y };
            const index = (y * originalImgData.width + x) * 4;

            targetRGB = {
                r: originalImgData.data[index],
                g: originalImgData.data[index + 1],
                b: originalImgData.data[index + 2]
            };

            targetColorBox.style.background = `rgb(${targetRGB.r}, ${targetRGB.g}, ${targetRGB.b})`;
            processImage();
        });

        // 事件監聽：參數即時更新
        toleranceInput.addEventListener('input', (e) => { tolValueDisp.textContent = e.target.value; });
        toleranceInput.addEventListener('change', processImage); // 滑鼠放開才運算，避免卡頓

        smoothnessInput.addEventListener('input', (e) => { smoothValueDisp.textContent = e.target.value; });
        smoothnessInput.addEventListener('change', processImage);

        contiguousCheckbox.addEventListener('change', processImage);

        // 事件監聽：還原
        resetBtn.addEventListener('click', () => {
            if (!originalImgData) return;
            ctx.putImageData(originalImgData, 0, 0);
            targetRGB = null;
            clickPos = null;
            targetColorBox.style.background = 'repeating-conic-gradient(#cbd5e1 0% 25%, transparent 0% 50%) 50% / 10px 10px';
            processStatus.style.display = 'none';
        });

        // 事件監聽：下載
        downloadBtn.addEventListener('click', () => {
            if (!originalImgData) return alert('請先上傳圖片並點選要去背的背景！');
            const link = document.createElement('a');
            link.download = `PerfectNoBg_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }, 0);
};
