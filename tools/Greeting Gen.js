window.render_greetingGen = function () {
    // 確保找到容器，避免「工具尚未載入」的錯誤
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('container') || document.body;

    targetContainer.innerHTML = `
        <div class="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                <h3 class="text-white text-xl font-bold flex items-center gap-2">
                    <span>💮</span> 專業長輩圖產生器 <span class="text-sm font-normal opacity-80">(自由排版版)</span>
                </h3>
            </div>
            
            <div class="p-6 flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-1/2 flex flex-col gap-5">
                    
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <label class="block font-bold text-gray-700">🖼️ 背景圖片</label>
                        
                        <div class="flex gap-2">
                            <label class="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-400 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors bg-white group">
                                <span class="text-emerald-600 font-bold group-hover:scale-105 transition-transform">📁 點擊上傳圖片</span>
                                <span class="text-xs text-gray-400 mt-1">支援手機相簿或電腦檔案</span>
                                <input type="file" id="greetUpload" accept="image/*" class="hidden">
                            </label>
                            <button id="greetRemoveImg" class="w-20 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors font-bold flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                <span class="text-xl mb-1">🗑️</span>
                                <span class="text-xs">移除</span>
                            </button>
                        </div>

                        <div class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                            <span class="text-sm text-gray-500 font-bold whitespace-nowrap">或使用內建：</span>
                            <select id="greetBg" class="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm">
                                <option value="">-- 請選擇 --</option>
                                <option value="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80">💐 鮮花綻放</option>
                                <option value="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80">⛰️ 壯麗高山</option>
                                <option value="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80">🌅 清晨日出</option>
                            </select>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">✍️ 祝福語句</label>
                            <textarea id="greetTxt" rows="2" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none" placeholder="請輸入祝福語... (可換行)">早安朋友！\n平安喜樂，萬事如意。</textarea>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">文字顏色</label>
                                <input type="color" id="greetColor" value="#ffffff" class="w-full h-10 rounded cursor-pointer">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">文字大小</label>
                                <input type="range" id="greetSize" min="20" max="150" value="60" class="w-full h-10 accent-emerald-500">
                            </div>
                        </div>
                        
                        <div class="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
                            <label class="block text-sm font-semibold text-gray-700">📍 自由調整文字位置</label>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-gray-500 font-bold w-8 text-right">左右</span>
                                <input type="range" id="greetPosX" min="0" max="100" value="50" class="w-full h-8 accent-blue-500">
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-gray-500 font-bold w-8 text-right">上下</span>
                                <input type="range" id="greetPosY" min="0" max="100" value="50" class="w-full h-8 accent-blue-500">
                            </div>
                        </div>
                    </div>

                    <button id="greetDown" class="w-full py-4 mt-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span>💾 下載專屬長輩圖</span>
                    </button>
                </div>

                <div class="w-full lg:w-1/2 flex flex-col justify-start">
                    <label class="block font-bold text-gray-700 mb-2">👁️ 即時預覽</label>
                    <div class="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span id="loadingTxt" class="absolute text-gray-400 font-bold z-0 pointer-events-none">請上傳或選擇圖片</span>
                        <canvas id="greetCanvas" class="w-full h-full object-contain relative z-10 transition-opacity duration-300"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 同步取得 DOM 元素
    const elements = {
        txt: document.getElementById('greetTxt'),
        color: document.getElementById('greetColor'),
        size: document.getElementById('greetSize'),
        posX: document.getElementById('greetPosX'),
        posY: document.getElementById('greetPosY'),
        bg: document.getElementById('greetBg'),
        upload: document.getElementById('greetUpload'),
        removeBtn: document.getElementById('greetRemoveImg'),
        downBtn: document.getElementById('greetDown'),
        canvas: document.getElementById('greetCanvas'),
        loading: document.getElementById('loadingTxt')
    };

    const ctx = elements.canvas.getContext('2d');
    let currentImage = new Image();
    currentImage.crossOrigin = "anonymous";

    // 清空畫布與狀態
    const clearCanvas = () => {
        currentImage.src = '';
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        elements.canvas.style.opacity = '0';
        elements.loading.textContent = '請上傳或選擇圖片';
        elements.loading.style.display = 'block';
        elements.downBtn.disabled = true;
        elements.removeBtn.disabled = true;
        elements.bg.value = ""; // 重置下拉選單
        elements.upload.value = ""; // 重置上傳檔案
    };

    // 繪製 Canvas
    const drawCanvas = () => {
        if (!currentImage.src) return;

        const canvasSize = 800;
        elements.canvas.width = canvasSize;
        elements.canvas.height = canvasSize;

        // 1. 繪製背景圖 (裁切至正方形填滿)
        const scale = Math.max(canvasSize / currentImage.width, canvasSize / currentImage.height);
        const x = (canvasSize / 2) - (currentImage.width / 2) * scale;
        const y = (canvasSize / 2) - (currentImage.height / 2) * scale;
        ctx.drawImage(currentImage, x, y, currentImage.width * scale, currentImage.height * scale);

        // 2. 繪製文字
        const textLines = elements.txt.value.split('\n');
        const fontSize = parseInt(elements.size.value);
        ctx.font = `900 ${fontSize}px "DFKai-SB", "標楷體", "Microsoft JhengHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 根據滑桿百分比計算 X 與 Y 基準位置
        const percentX = parseInt(elements.posX.value) / 100;
        const percentY = parseInt(elements.posY.value) / 100;

        const targetX = canvasSize * percentX;
        let startY = canvasSize * percentY;

        // 調整多行文字的整體高度，使其以選擇的 Y 點為中心
        const lineHeight = fontSize * 1.3;
        const totalTextHeight = (textLines.length - 1) * lineHeight;
        startY -= totalTextHeight / 2;

        textLines.forEach((line, index) => {
            const currentY = startY + (index * lineHeight);

            // 文字黑邊
            ctx.lineWidth = Math.max(fontSize * 0.15, 4);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.lineJoin = 'round';
            ctx.strokeText(line, targetX, currentY);

            // 文字填色
            ctx.fillStyle = elements.color.value;
            ctx.fillText(line, targetX, currentY);
        });
    };

    // 載入圖片邏輯
    const loadImage = (src) => {
        if (!src) return;
        elements.loading.textContent = '圖片載入中...';
        elements.loading.style.display = 'block';
        elements.canvas.style.opacity = '0.5';

        currentImage.onload = () => {
            elements.loading.style.display = 'none';
            elements.canvas.style.opacity = '1';
            elements.downBtn.disabled = false;
            elements.removeBtn.disabled = false;
            drawCanvas();
        };
        currentImage.onerror = () => {
            elements.loading.textContent = '圖片載入失敗，請重試';
            clearCanvas();
        };
        currentImage.src = src;
    };

    // 事件監聽：上傳自訂圖片
    elements.upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                elements.bg.value = ""; // 清空下拉選單狀態
                loadImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 事件監聽：移除圖片
    elements.removeBtn.addEventListener('click', clearCanvas);

    // 事件監聽：選擇內建模板
    elements.bg.addEventListener('change', (e) => {
        if (e.target.value) {
            loadImage(e.target.value);
        } else {
            clearCanvas();
        }
    });

    // 事件監聽：文字與樣式變更時即時重繪
    ['input', 'change'].forEach(evt => {
        elements.txt.addEventListener(evt, drawCanvas);
        elements.color.addEventListener(evt, drawCanvas);
        elements.size.addEventListener(evt, drawCanvas);
        elements.posX.addEventListener(evt, drawCanvas);
        elements.posY.addEventListener(evt, drawCanvas);
    });

    // 下載功能
    elements.downBtn.addEventListener('click', () => {
        if (!currentImage.src) return;
        try {
            const link = document.createElement('a');
            link.download = `長輩圖_${new Date().getTime()}.png`;
            link.href = elements.canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            alert('無法下載：若使用外部網路圖片可能受限於安全政策。請改用「上傳圖片」功能即可正常下載！');
        }
    });

    // 初始化狀態
    clearCanvas();
    // 如果要預設載入第一張內建圖，可以解開下方註解：
    // elements.bg.selectedIndex = 1;
    // loadImage(elements.bg.value);
};
