window.render_metronome = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🥁 簡單節拍器</h3>
            <div class="text-6xl font-black text-slate-800 mb-6" id="bpmDisplay">120</div>
            <input type="range" id="bpmSlider" min="40" max="240" value="120" class="w-full mb-6">
            <button id="bpmBtn" class="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-xl">START</button>
        </div>
    `;
    setTimeout(() => {
        let timer = null, audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const btn = document.getElementById('bpmBtn');
        const slider = document.getElementById('bpmSlider');
        btn.onclick = () => {
            if (timer) { clearInterval(timer); timer = null; btn.textContent = 'START'; }
            else {
                const play = () => {
                    const osc = audioCtx.createOscillator(); osc.connect(audioCtx.destination);
                    osc.frequency.value = 880; osc.start(); osc.stop(audioCtx.currentTime + 0.05);
                };
                timer = setInterval(play, (60 / slider.value) * 1000);
                btn.textContent = 'STOP';
            }
        };
        slider.oninput = () => document.getElementById('bpmDisplay').textContent = slider.value;
    }, 0);
};