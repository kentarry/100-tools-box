window.render_metronome = function (containerId) {
    const target = document.getElementById(containerId) || container;

    // --- 介面渲染 (採用 Tailwind CSS 風格) ---
    target.innerHTML = `
        <div class="metronome-root max-w-sm mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm font-sans select-none" style="touch-action: manipulation;">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-slate-700 tracking-tight">⏱️ 精準節拍器</h3>
                <span id="beatIndicator" class="w-4 h-4 rounded-full bg-slate-300 transition-all duration-75"></span>
            </div>

            <div class="text-center mb-6">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Beats Per Minute</div>
                <div class="flex items-center justify-center gap-4">
                    <button id="minusBpm" class="w-10 h-10 rounded-full bg-white border shadow-sm active:scale-95 text-xl">-</button>
                    <div id="bpmDisplay" class="text-6xl font-black text-slate-800 tabular-nums w-32">120</div>
                    <button id="plusBpm" class="w-10 h-10 rounded-full bg-white border shadow-sm active:scale-95 text-xl">+</button>
                </div>
            </div>

            <input type="range" id="bpmSlider" min="40" max="240" value="120" 
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mb-8">

            <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div class="bg-white p-3 rounded-xl border">
                    <label class="block text-slate-400 text-xs mb-1 font-bold">拍號 (Beats)</label>
                    <select id="timeSig" class="w-full bg-transparent font-bold outline-none">
                        <option value="1">1/4 (無重音)</option>
                        <option value="2">2/4</option>
                        <option value="3">3/4</option>
                        <option value="4" selected>4/4</option>
                        <option value="6">6/8</option>
                    </select>
                </div>
                <button id="tapBtn" class="bg-white p-3 rounded-xl border font-bold text-slate-600 active:bg-slate-100 uppercase text-xs tracking-tighter">
                    Tap Tempo
                </button>
            </div>

            <button id="bpmBtn" class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-lg active:scale-[0.98] transition-transform">
                START
            </button>
        </div>
    `;

    // --- 核心邏輯 ---
    setTimeout(() => {
        let audioCtx = null;
        let isRunning = false;
        let bpm = 120;
        let beatsPerMeasure = 4;
        let currentBeat = 0;
        let nextNoteTime = 0.0; // 下一拍的時間點
        const lookahead = 25.0; // 檢查頻率 (ms)
        const scheduleAheadTime = 0.1; // 預排時間 (s)
        let timerID = null;

        const btn = document.getElementById('bpmBtn');
        const slider = document.getElementById('bpmSlider');
        const display = document.getElementById('bpmDisplay');
        const beatCircle = document.getElementById('beatIndicator');
        const timeSig = document.getElementById('timeSig');
        const tapBtn = document.getElementById('tapBtn');

        // 初始化 AudioContext
        const initAudio = () => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        };

        // 產生聲音 (高頻為重音，低頻為弱音)
        const playTone = (time, isFirstBeat) => {
            const osc = audioCtx.createOscillator();
            const envelope = audioCtx.createGain();

            osc.frequency.value = isFirstBeat ? 1000 : 600;
            envelope.gain.value = 1;
            envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

            osc.connect(envelope);
            envelope.connect(audioCtx.destination);

            osc.start(time);
            osc.stop(time + 0.1);

            // 視覺回饋排程
            const delay = (time - audioCtx.currentTime) * 1000;
            setTimeout(() => {
                beatCircle.style.backgroundColor = isFirstBeat ? '#0f172a' : '#94a3b8';
                beatCircle.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    beatCircle.style.transform = 'scale(1)';
                }, 50);
            }, delay);
        };

        // 核心排程器
        const scheduler = () => {
            while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
                const isFirst = (currentBeat % beatsPerMeasure === 0);
                playTone(nextNoteTime, isFirst);

                const secondsPerBeat = 60.0 / bpm;
                nextNoteTime += secondsPerBeat;
                currentBeat++;
            }
            timerID = setTimeout(scheduler, lookahead);
        };

        const toggle = () => {
            initAudio();
            if (isRunning) {
                clearTimeout(timerID);
                btn.textContent = 'START';
                btn.classList.replace('bg-red-500', 'bg-slate-900');
                beatCircle.style.backgroundColor = '#cbd5e1';
            } else {
                currentBeat = 0;
                nextNoteTime = audioCtx.currentTime + 0.05;
                scheduler();
                btn.textContent = 'STOP';
                btn.classList.replace('bg-slate-900', 'bg-red-500');
            }
            isRunning = !isRunning;
        };

        // 事件監聽
        btn.onclick = toggle;
        slider.oninput = (e) => {
            bpm = parseInt(e.target.value);
            display.textContent = bpm;
        };

        document.getElementById('plusBpm').onclick = () => {
            if (bpm < 240) { bpm++; slider.value = bpm; display.textContent = bpm; }
        };

        document.getElementById('minusBpm').onclick = () => {
            if (bpm > 40) { bpm--; slider.value = bpm; display.textContent = bpm; }
        };

        timeSig.onchange = (e) => {
            beatsPerMeasure = parseInt(e.target.value);
            currentBeat = 0;
        };

        // Tap Tempo 功能
        let lastTap = 0;
        tapBtn.onclick = () => {
            const now = Date.now();
            if (lastTap > 0) {
                const diff = now - lastTap;
                const tappedBpm = Math.round(60000 / diff);
                if (tappedBpm >= 40 && tappedBpm <= 240) {
                    bpm = tappedBpm;
                    slider.value = bpm;
                    display.textContent = bpm;
                }
            }
            lastTap = now;
            tapBtn.style.backgroundColor = '#f1f5f9';
            setTimeout(() => tapBtn.style.backgroundColor = 'white', 100);
        };

    }, 0);
};
