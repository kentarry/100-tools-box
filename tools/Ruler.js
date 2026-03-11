window.render_ruler = function () {
    // 1. 動態生成刻度函數：提供精確的數學刻度，而非純文字模擬
    const generateTicks = (isVertical) => {
        let ticks = '';
        const maxLength = 3000; // 預留足夠長的畫布空間
        for (let i = 0; i <= maxLength; i += 10) {
            const isMajor = i % 100 === 0; // 每 100px 一個大刻度與標籤
            const isMid = i % 50 === 0 && !isMajor; // 每 50px 一個中刻度

            if (isVertical) {
                ticks += `
                    <div class="absolute w-full border-t border-slate-500 transition-all" style="top: ${i}px; height: 10px; opacity: ${isMajor ? 1 : (isMid ? 0.7 : 0.3)};">
                        ${isMajor ? `<span class="absolute left-2 -top-[7px] text-[10px] text-slate-300 transform -rotate-90 origin-left font-mono tracking-tighter">${i}</span>` : ''}
                    </div>
                `;
            } else {
                ticks += `
                    <div class="absolute h-full border-l border-slate-500 transition-all" style="left: ${i}px; width: 10px; opacity: ${isMajor ? 1 : (isMid ? 0.7 : 0.3)};">
                        ${isMajor ? `<span class="absolute top-2 -left-[10px] text-[10px] text-slate-300 w-5 text-center font-mono tracking-tighter">${i}</span>` : ''}
                    </div>
                `;
            }
        }
        return ticks;
    };

    // 2. 注入核心 UI 與結構
    container.innerHTML = `
        <div id="ruler-app-container" class="w-full h-[600px] border border-slate-300 relative bg-[#f1f5f9] rounded-2xl overflow-hidden shadow-2xl flex font-sans select-none group">
            
            <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 20px 20px;"></div>

            <div class="absolute top-0 left-0 w-8 h-8 bg-slate-900 z-30 border-r border-b border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors shadow-md" title="重置原點 (0,0)">
                <div class="w-3 h-3 border-t-2 border-l-2 border-slate-400"></div>
            </div>

            <div class="absolute top-0 left-8 right-0 h-8 bg-slate-900 z-20 border-b border-slate-700 overflow-hidden shadow-sm">
                <div id="h-ruler-content" class="relative w-[3000px] h-full">
                    ${generateTicks(false)}
                    <div id="h-ruler-guide" class="absolute top-0 bottom-0 w-[1px] bg-cyan-400 hidden pointer-events-none drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]"></div>
                </div>
            </div>

            <div class="absolute top-8 left-0 bottom-0 w-8 bg-slate-900 z-20 border-r border-slate-700 overflow-hidden shadow-sm">
                <div id="v-ruler-content" class="relative h-[3000px] w-full">
                    ${generateTicks(true)}
                    <div id="v-ruler-guide" class="absolute left-0 right-0 h-[1px] bg-cyan-400 hidden pointer-events-none drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]"></div>
                </div>
            </div>

            <div id="workspace-area" class="absolute top-8 left-8 right-0 bottom-0 z-10 overflow-hidden cursor-crosshair">
                
                <div class="absolute top-12 left-12 w-[400px] h-[300px] bg-white shadow-lg ring-1 ring-slate-900/5 flex flex-col items-center justify-center transition-transform hover:scale-[1.01] duration-300 rounded-sm">
                    <span class="text-slate-300 font-bold tracking-[0.2em] text-lg">ARTBOARD</span>
                    <span class="text-slate-400 text-xs mt-2 font-mono">400 x 300 px</span>
                </div>

                <div class="absolute right-6 bottom-6 bg-slate-900/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl text-sm font-mono shadow-2xl flex gap-5 border border-slate-700/50 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-xs">X</span>
                        <span id="pos-x" class="w-10 font-semibold text-cyan-400 tracking-wider">0</span>
                    </div>
                    <div class="w-px h-5 bg-slate-700"></div>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-xs">Y</span>
                        <span id="pos-y" class="w-10 font-semibold text-cyan-400 tracking-wider">0</span>
                    </div>
                </div>

                <div id="crosshair-x" class="absolute top-0 bottom-0 w-[1px] bg-cyan-500/30 hidden pointer-events-none"></div>
                <div id="crosshair-y" class="absolute left-0 right-0 h-[1px] bg-cyan-500/30 hidden pointer-events-none"></div>
            </div>
        </div>
    `;

    // 3. 綁定互動邏輯 (等待 DOM 渲染完成後執行)
    setTimeout(() => {
        const workspace = document.getElementById('workspace-area');
        const posX = document.getElementById('pos-x');
        const posY = document.getElementById('pos-y');
        const hRulerGuide = document.getElementById('h-ruler-guide');
        const vRulerGuide = document.getElementById('v-ruler-guide');
        const crosshairX = document.getElementById('crosshair-x');
        const crosshairY = document.getElementById('crosshair-y');

        if (!workspace) return;

        // 監聽滑鼠移動事件，達成即時座標與十字線追蹤
        workspace.addEventListener('mousemove', (e) => {
            const rect = workspace.getBoundingClientRect();
            // 計算相對於工作區左上角的精確座標
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);

            // 更新面板數值
            posX.textContent = x;
            posY.textContent = y;

            // 顯示並移動尺規上的引導線
            hRulerGuide.style.display = 'block';
            hRulerGuide.style.left = `${x}px`;

            vRulerGuide.style.display = 'block';
            vRulerGuide.style.top = `${y}px`;

            // 顯示並移動工作區的十字游標
            crosshairX.style.display = 'block';
            crosshairX.style.left = `${x}px`;

            crosshairY.style.display = 'block';
            crosshairY.style.top = `${y}px`;
        });

        // 當滑鼠離開工作區時，隱藏引導線與十字游標
        workspace.addEventListener('mouseleave', () => {
            hRulerGuide.style.display = 'none';
            vRulerGuide.style.display = 'none';
            crosshairX.style.display = 'none';
            crosshairY.style.display = 'none';

            // 歸零顯示
            posX.textContent = '-';
            posY.textContent = '-';
        });
    }, 0);
};
