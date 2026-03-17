window.render_countdown = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">⏲️ 簡易倒數</h3>
            <input type="number" id="cdIn" value="60" class="w-full p-4 text-4xl font-black text-center border-b mb-6 outline-none">
            <div class="flex gap-2">
                <button id="cdStart" class="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold">START</button>
                <button id="cdReset" class="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold">RESET</button>
            </div>
        </div>
    `;
    setTimeout(() => {
        let timer = null; const btn = document.getElementById('cdStart'); const input = document.getElementById('cdIn');
        btn.onclick = () => {
            if (timer) { clearInterval(timer); timer = null; btn.textContent = 'START'; }
            else {
                timer = setInterval(() => {
                    if (input.value > 0) input.value--;
                    else { clearInterval(timer); alert('時間到！'); }
                }, 1000);
                btn.textContent = 'PAUSE';
            }
        };
        document.getElementById('cdReset').onclick = () => { clearInterval(timer); timer = null; input.value = 60; btn.textContent = 'START'; };
    }, 0);
};