window.render_greetingGen = function (containerElement) {
    // 確保找到容器，避免工具載入錯誤
    const targetContainer = containerElement || (typeof container !== 'undefined' ? container : document.getElementById('container'));
    if (!targetContainer) return;

    // 產生獨一無二的 ID，避免多個工具間的 ID 衝突
    const uid = Math.random().toString(36).substring(2, 9);
    const id = (name) => `greet_${name}_${uid}`;

    // 預設高畫質風景圖
    const defaultBg = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80";

    targetContainer.innerHTML = `
        <div class="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row font-sans">
            
            <!-- 左側/上方：預覽區 -->
            <div class="w-full lg:w-1/2 bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 relative border-b lg:border-b-0 lg:border-r border-slate-200">
                <div class="w-full max-w-md aspect-square bg-white rounded-2xl shadow-md overflow-hidden relative group">
                    <canvas id="${id('canvas')}" class="w-full h-full object-contain relative z-10 transition-opacity duration-300 opacity-0"></canvas>
                    
                    <!-- 載入中遮罩 -->
                    <div id="${id('loading')}" class="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-20">
                        <svg class="animate-spin h-8 w-8 text-emerald-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span class="text-sm font-bold text-slate-500" id="${id('loadingText')}">圖片處理中...</span>
                    </div>

                    <!-- 快速更換背景按鈕 (懸浮) -->
                    <label class="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur text-white p-3 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 group-hover:opacity-100 md:opacity-0 z-30" title="上傳自己的相片">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <input type="file" id="${id('uploadHover')}" accept="image/*" class="hidden">
                    </label>
                </div>
            </div>

            <!-- 右側/下方：控制區 -->
            <div class="w-full lg:w-1/2 p-5 sm:p-8 flex flex-col gap-6 bg-white overflow-y-auto max-h-[85vh]">
                
                <div>
                    <h3 class="text-2xl font-black text-slate-800 flex items-center gap-2 mb-1">
                        💮 早安長輩圖產生器
                    </h3>
                    <p class="text-sm text-slate-500">免去繁瑣步驟，打字即刻生成，發給親朋好友吧！</p>
                </div>

                <!-- 祝福語輸入 -->
                <div class="space-y-2">
                    <div class="flex justify-between items-end mb-2">
                        <label class="block text-sm font-bold text-slate-700">✍️ 祝福語句</label>
                        <div class="flex flex-wrap gap-1.5 justify-end" id="${id('presets')}">
                            <button class="preset-btn text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 px-2 py-1 rounded font-bold transition-colors" data-text="早安朋友！\n平安喜樂，萬事如意。">早安</button>
                            <button class="preset-btn text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 px-2 py-1 rounded font-bold transition-colors" data-text="週末愉快！\n放鬆心情，享受生活。">週末</button>
                            <button class="preset-btn text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 px-2 py-1 rounded font-bold transition-colors" data-text="認同請分享！\n知足常樂，感恩有你。">認同</button>
                        </div>
                    </div>
                    <textarea id="${id('txt')}" rows="3" class="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-lg font-bold shadow-inner text-slate-700">早安朋友！\n平安喜樂，萬事如意。</textarea>
                </div>

                <!-- 樣式設定 -->
                <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 space-y-5 shadow-sm">
                    <div class="grid grid-cols-2 gap-5">
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">文字顏色</label>
                            <input type="color" id="${id('color')}" value="#ffffff" class="w-full h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">字體大小</label>
                            <div class="flex items-center gap-3">
                                <input type="range" id="${id('size')}" min="30" max="150" value="80" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                                <span id="${id('sizeVal')}" class="text-sm font-mono text-slate-500 w-8 text-right font-bold">80</span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-200 space-y-4">
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">排版位置</label>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-slate-400 font-bold w-12">左右 ↔️</span>
                            <input type="range" id="${id('posX')}" min="10" max="90" value="50" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500">
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-slate-400 font-bold w-12">上下 ↕️</span>
                            <input type="range" id="${id('posY')}" min="10" max="90" value="50" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500">
                        </div>
                    </div>
                </div>

                <!-- 背景選擇 -->
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-slate-700">🖼️ 背景圖設定</label>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <select id="${id('bg')}" class="flex-1 p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow text-sm font-bold text-slate-700">
                            <option value="${defaultBg}">🌷 內建：鮮花綻放 (預設)</option>
                            <option value="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80">⛰️ 內建：壯麗高山</option>
                            <option value="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80">🌅 內建：清晨日出</option>
                            <option value="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80">🌲 內建：自然森林</option>
                        </select>
                        <label class="sm:w-36 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-center text-sm font-black cursor-pointer transition-colors border border-slate-200">
                            📁 上傳相片
                            <input type="file" id="${id('uploadBtn')}" accept="image/*" class="hidden">
                        </label>
                    </div>
                </div>

                <!-- 下載按鈕 -->
                <button id="${id('down')}" class="w-full py-4 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    儲存專屬長輩圖
                </button>

                <p class="text-center text-[11px] text-slate-400 mt-0">※ 圖片僅在您的裝置上自動生成，保護無虞。</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        // 取得 DOM 元素
        const el = {
            txt: document.getElementById(id('txt')),
            color: document.getElementById(id('color')),
            size: document.getElementById(id('size')),
            sizeVal: document.getElementById(id('sizeVal')),
            posX: document.getElementById(id('posX')),
            posY: document.getElementById(id('posY')),
            bg: document.getElementById(id('bg')),
            uploadHover: document.getElementById(id('uploadHover')),
            uploadBtn: document.getElementById(id('uploadBtn')),
            downBtn: document.getElementById(id('down')),
            canvas: document.getElementById(id('canvas')),
            loading: document.getElementById(id('loading')),
            loadingText: document.getElementById(id('loadingText')),
            presetBtns: document.querySelectorAll('.preset-btn')
        };

        const ctx = el.canvas.getContext('2d');
        let currentImage = new Image();
        currentImage.crossOrigin = "anonymous"; // 允許下載來自 unsplash 的圖片

        // 繪製 Canvas (核心邏輯)
        const renderCanvas = () => {
            if (!currentImage.src) return;

            // 固定內部繪圖解析度為 1080x1080，確保下載畫質清晰
            const canvasSize = 1080;
            el.canvas.width = canvasSize;
            el.canvas.height = canvasSize;

            // 1. 繪製並等比例裁切背景圖至正方形
            const scale = Math.max(canvasSize / currentImage.width, canvasSize / currentImage.height);
            const x = (canvasSize / 2) - (currentImage.width / 2) * scale;
            const y = (canvasSize / 2) - (currentImage.height / 2) * scale;
            ctx.drawImage(currentImage, x, y, currentImage.width * scale, currentImage.height * scale);

            // 2. 準備繪製文字
            const textContent = el.txt.value;
            // 替換真實的換行符號
            const textLines = textContent.split('\\n').flatMap(line => line.split('\n'));

            // 將 UI size 從 30-150 映射到 canvas 內的比例 (乘以 1.2 以適應 1080p 畫布)
            const fontSize = parseInt(el.size.value) * 1.2;
            ctx.font = `900 ${fontSize}px "DFKai-SB", "BiauKai", "標楷體", "Microsoft JhengHei", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 計算基準座標
            const percentX = parseInt(el.posX.value) / 100;
            const percentY = parseInt(el.posY.value) / 100;
            const targetX = canvasSize * percentX;
            let startY = canvasSize * percentY;

            // 調整多行文字，使其垂直置中於選擇的位置
            const lineHeight = fontSize * 1.35;
            const totalTextHeight = (textLines.length - 1) * lineHeight;
            startY -= totalTextHeight / 2;

            // 3. 逐行繪製文字 (加上黑邊確保在各種背景都清晰)
            textLines.forEach((line, index) => {
                const currentY = startY + (index * lineHeight);
                
                // 黑邊
                ctx.lineWidth = Math.max(fontSize * 0.12, 6);
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.lineJoin = 'round';
                ctx.strokeText(line, targetX, currentY);

                // 文字
                ctx.fillStyle = el.color.value;
                ctx.fillText(line, targetX, currentY);
            });
        };

        // 載入圖片 (封裝 Loading 狀態)
        const loadImage = (src) => {
            if (!src) return;
            el.loading.style.display = 'flex';
            el.canvas.style.opacity = '0.5';
            el.loadingText.textContent = '圖片載入中...';

            currentImage.onload = () => {
                el.loading.style.display = 'none';
                el.canvas.style.opacity = '1';
                renderCanvas();
            };
            
            currentImage.onerror = () => {
                el.loadingText.textContent = '圖片載入失敗，請改用自己的相片';
                setTimeout(() => el.loading.style.display = 'none', 3000);
            };

            currentImage.src = src;
        };

        // 處理使用者上傳本機圖片
        const handleFileUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // 清空下拉選單的選擇狀態
                    el.bg.value = ""; 
                    loadImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };

        // 綁定所有事件
        el.uploadHover.addEventListener('change', handleFileUpload);
        el.uploadBtn.addEventListener('change', handleFileUpload);
        
        el.bg.addEventListener('change', (e) => {
            if (e.target.value) loadImage(e.target.value);
        });

        // 大小數值顯示
        el.size.addEventListener('input', (e) => {
            el.sizeVal.textContent = e.target.value;
            renderCanvas();
        });

        // 其他文字/顏色/位置參數的連動
        ['input', 'change'].forEach(evt => {
            el.txt.addEventListener(evt, renderCanvas);
            el.color.addEventListener(evt, renderCanvas);
            el.posX.addEventListener(evt, renderCanvas);
            el.posY.addEventListener(evt, renderCanvas);
        });

        // 預設賀詞按鈕點擊
        el.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 替換內容，並手動觸發 input 事件以重新渲染
                el.txt.value = e.target.getAttribute('data-text');
                renderCanvas();
            });
        });

        // 下載功能
        el.downBtn.addEventListener('click', () => {
            if (!currentImage.src) return;
            try {
                const link = document.createElement('a');
                link.download = `早安圖_${new Date().getTime()}.png`;
                link.href = el.canvas.toDataURL('image/png', 0.9);
                link.click();
            } catch (err) {
                alert('無法下載：可能是瀏覽器阻擋，或是載入了受保護的圖片。請嘗試自行上傳圖片後再下載。');
            }
        });

        // 啟動：預設載入預設圖片
        loadImage(defaultBg);

    }, 0);
};
