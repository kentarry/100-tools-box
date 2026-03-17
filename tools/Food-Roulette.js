window.render_foodRoulette = function (containerElement) {
    const targetContainer = containerElement || (typeof container !== 'undefined' ? container : document.getElementById('container'));
    if (!targetContainer) return;

    // Use a unique ID prefix to isolate instances
    const uid = Math.random().toString(36).substring(2, 9);
    const id = (name) => `fr_${name}_${uid}`;

    targetContainer.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 lg:space-y-8 font-sans text-slate-800">
            <!-- Header -->
            <div class="text-center space-y-2 mb-6 md:mb-8">
                <h2 class="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
                    <span class="text-5xl drop-shadow-md">🍔</span> 命運食神輪盤
                </h2>
                <p class="text-slate-500 font-medium tracking-wide">每天都在煩惱吃什麼？交給命運來決定！</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <!-- Sidebar: Inputs -->
                <div class="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 flex flex-col h-full space-y-5 transition-all hover:shadow-md">
                    <div class="flex-grow flex flex-col">
                        <div class="flex items-center justify-between mb-4">
                            <label class="font-bold text-slate-700 flex items-center gap-2">
                                🍽️ 候選清單
                            </label>
                            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200" id="${id('count')}">0 項</span>
                        </div>
                        
                        <!-- Presets Area -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            <button class="fr-preset-btn px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm" data-preset="排骨便當\n麻醬麵\n炒飯\n水餃\n自助餐\n滷肉飯\n鍋貼\n牛肉麵">🍱 小吃便當</button>
                            <button class="fr-preset-btn px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm" data-preset="麥當勞\n肯德基\n摩斯漢堡\n漢堡王\n頂呱呱\n披薩\n炸雞">🍟 邪惡速食</button>
                            <button class="fr-preset-btn px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm" data-preset="迴轉壽司\n拉麵\n麻辣火鍋\n牛排\n韓式烤肉\n義大利麵\n居酒屋\n吃到飽">🥩 大餐聚會</button>
                            <button class="fr-preset-btn px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm" data-preset="健康餐盒\n生菜沙拉\n水煮餐\n素食\n地瓜豆漿\n優格">🥗 輕食健康</button>
                        </div>
                        
                        <textarea id="${id('list')}" rows="8" class="w-full min-h-[180px] flex-grow bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none shadow-inner text-base leading-relaxed placeholder-slate-400 font-medium font-sans" placeholder="請輸入候選餐廳或食物（每行輸入一個選項）...">麥當勞\n火鍋\n壽司\n巷口乾麵\n便當\n健康餐</textarea>
                    </div>
                </div>

                <!-- Main: Result spin area -->
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-xl text-white flex flex-col relative overflow-hidden group min-h-[380px]">
                    
                    <!-- Decorative background pattern -->
                    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
                    
                    <!-- Confetti Canvas -->
                    <canvas id="${id('canvas')}" class="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-300 opacity-0"></canvas>
                    
                    <div class="relative z-20 flex-grow flex flex-col items-center justify-center text-center p-2 sm:p-4">
                        <p class="text-slate-400 font-bold tracking-widest uppercase mb-6 text-sm flex items-center gap-2 drop-shadow-md" id="${id('label')}">
                            <span class="inline-block w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
                            等待命運的安排
                            <span class="inline-block w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse delay-75"></span>
                        </p>
                        
                        <div class="h-32 w-full flex items-center justify-center overflow-hidden relative">
                            <!-- Gradient masks for slot machine effect -->
                            <div class="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-slate-800 to-transparent z-10"></div>
                            <div class="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                            
                            <div id="${id('result')}" class="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-2xl transition-transform duration-75 ease-out w-full truncate px-4 pb-2">
                                ?
                            </div>
                        </div>
                    </div>
                    
                    <button id="${id('spinBtn')}" class="relative z-30 w-full mt-auto py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-xl lg:text-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-[0.98] transition-all flex justify-center items-center gap-3 border border-orange-400/50">
                        <span class="text-2xl md:text-3xl">🎲</span>
                        <span class="tracking-wide">啟動輪盤！</span>
                    </button>
                    
                    <!-- Decorative Icons in Corners -->
                    <div class="absolute -top-6 -right-6 text-8xl opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700 ease-in-out pointer-events-none">🍔</div>
                    <div class="absolute -bottom-6 -left-6 text-8xl opacity-5 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-700 ease-in-out pointer-events-none">🍜</div>
                </div>
            </div>
            <p class="text-center text-xs text-slate-400 font-mono tracking-widest mt-4 uppercase">Destiny Food Roulette v2.0</p>
        </div>
    `;

    setTimeout(() => {
        const el = {
            list: document.getElementById(id('list')),
            count: document.getElementById(id('count')),
            spinBtn: document.getElementById(id('spinBtn')),
            result: document.getElementById(id('result')),
            label: document.getElementById(id('label')),
            canvas: document.getElementById(id('canvas')),
            presets: targetContainer.querySelectorAll('.fr-preset-btn')
        };

        if (!el.spinBtn) return;

        let isSpinning = false;
        let ctx = null;
        if (el.canvas) {
            ctx = el.canvas.getContext('2d');
            // Ensure size is correctly initialized after DOM is fully painted
            setTimeout(resizeCanvas, 150);
            window.addEventListener('resize', resizeCanvas);
        }

        function resizeCanvas() {
            if (el.canvas && el.canvas.parentElement) {
                el.canvas.width = el.canvas.parentElement.clientWidth;
                el.canvas.height = el.canvas.parentElement.clientHeight;
            }
        }

        // Parse list and update UI counter
        const getItems = () => {
            const raw = el.list.value.split('\n');
            const filtered = raw.map(s => s.trim()).filter(s => s !== '');
            el.count.textContent = `${filtered.length} 項`;
            return filtered;
        };

        el.list.addEventListener('input', getItems);

        // Preset button handlers
        el.presets.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetVal = e.target.getAttribute('data-preset');
                // parse \n from dataset attribute which stores literal "\n" strings in HTML
                const presetItems = presetVal.replace(/\\n/g, '\n').split('\n');
                el.list.value = presetItems.join('\n');
                getItems();
                
                // Visual feedback check
                el.list.classList.add('ring-2', 'ring-orange-400');
                setTimeout(() => el.list.classList.remove('ring-2', 'ring-orange-400'), 300);
            });
        });

        // Init list count
        getItems();

        // Spin Button Logic
        el.spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            const items = getItems();
            
            // Error handling: Empty list
            if (items.length === 0) {
                el.result.textContent = "請先輸入選項!";
                el.result.className = "text-3xl font-black text-rose-500 drop-shadow-lg transition-transform w-full truncate px-4";
                
                el.list.classList.add('animate-pulse', 'ring-2', 'ring-rose-500');
                setTimeout(() => {
                    el.result.className = "text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-2xl transition-transform w-full truncate px-4 pb-2";
                    el.result.textContent = "?";
                    el.list.classList.remove('animate-pulse', 'ring-2', 'ring-rose-500');
                }, 1500);
                return;
            }

            // Immediately show if only one item available
            if (items.length === 1) {
                finishSpin([items[0]], true);
                return;
            }
            
            // State: Spinning
            isSpinning = true;
            el.spinBtn.disabled = true;
            
            el.spinBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span class="tracking-wide">命運選擇中...</span>`;
            el.spinBtn.classList.replace('from-orange-500', 'from-slate-600');
            el.spinBtn.classList.replace('to-rose-500', 'to-slate-700');
            el.spinBtn.classList.replace('shadow-[0_0_20px_rgba(249,115,22,0.4)]', 'shadow-none');
            el.spinBtn.classList.add('cursor-not-allowed', 'opacity-90');
            
            el.label.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span> 命運輪盤轉動中...`;
            el.result.style.transform = 'scale(0.9)';
            
            if (ctx) {
                el.canvas.style.opacity = '0'; // Clear previous confetti
                ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
            }

            // Animation logic via requestAnimationFrame with Easing
            const totalDuration = 3500; // spin duration ms
            let startTime = null;
            let lastUpdateTime = 0;
            let currentFlickerDelay = 40; // start fast (40ms)
            let lastSelectedIndex = -1;

            function animationStep(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                if (elapsed > totalDuration) {
                    finishSpin(items);
                    return;
                }
                
                // Ease-out effect: increment flicker delay exponentially based on elapsed progress
                const progress = elapsed / totalDuration;
                const targetDelay = 40 + Math.pow(progress, 3.5) * 450; 

                if (timestamp - lastUpdateTime >= currentFlickerDelay) {
                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * items.length);
                    } while (randomIndex === lastSelectedIndex && items.length > 1);
                    
                    lastSelectedIndex = randomIndex;
                    el.result.textContent = items[randomIndex];
                    
                    // Add slight random jiggle to make it feel mechanical/dynamic
                    el.result.style.transform = `scale(${0.95 + Math.random() * 0.1}) translateY(${(Math.random() - 0.5) * 8}px)`;
                    
                    lastUpdateTime = timestamp;
                    currentFlickerDelay = targetDelay;
                }
                
                requestAnimationFrame(animationStep);
            }
            requestAnimationFrame(animationStep);
        });

        // Trigger end of spin state and effect
        function finishSpin(items, skipAnimation = false) {
            isSpinning = false;
            el.spinBtn.disabled = false;
            
            el.spinBtn.innerHTML = `<span class="text-2xl md:text-3xl">🎲</span><span class="tracking-wide">再來一次！</span>`;
            el.spinBtn.classList.replace('from-slate-600', 'from-orange-500');
            el.spinBtn.classList.replace('to-slate-700', 'to-rose-500');
            el.spinBtn.classList.replace('shadow-none', 'shadow-[0_0_20px_rgba(249,115,22,0.4)]');
            el.spinBtn.classList.remove('cursor-not-allowed', 'opacity-90');
            
            const finalItem = items[Math.floor(Math.random() * items.length)];
            el.result.textContent = finalItem;
            el.result.style.transform = 'scale(1.15) translateY(0)';
            
            el.label.innerHTML = "✨ 🎉 命運的決定 🎉 ✨";
            
            if (!skipAnimation) {
                fireConfetti();
            }
        }
        
        // Simple Physics-based Confetti Particle Engine
        let particles = [];
        function fireConfetti() {
            if (!ctx || !el.canvas) return;
            resizeCanvas();
            el.canvas.style.opacity = '1';
            
            particles = [];
            const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
            
            // Generate 80 particles bursting from bottom center
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: el.canvas.width / 2,
                    y: el.canvas.height - 10,
                    vx: (Math.random() - 0.5) * 18,     // Scatter horizontal 
                    vy: (Math.random() - 1) * 20 - 5,   // Burst vertical up
                    size: Math.random() * 8 + 6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rot: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 20,
                    shape: Math.random() > 0.5 ? 'rect' : 'circle' 
                });
            }
            
            function drawConfetti() {
                if(isSpinning) return; // Terminate if user spins again mid-animation
                
                ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
                let hasActiveParticles = false;
                
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.5; // Gravity
                    p.rot += p.rotSpeed;
                    
                    if (p.y < el.canvas.height + 50) {
                        hasActiveParticles = true;
                    }
                    
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    
                    if (p.shape === 'rect') {
                        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 1.5);
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                });
                
                if (hasActiveParticles) {
                    requestAnimationFrame(drawConfetti);
                } else {
                    el.canvas.style.opacity = '0'; // Fade out cleanly
                }
            }
            
            requestAnimationFrame(drawConfetti);
        }

    }, 0);
};
