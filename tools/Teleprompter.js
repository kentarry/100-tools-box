window.render_teleprompter = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-black p-8 rounded-3xl text-center">
            <h3 class="text-white font-bold mb-4">🎤 簡易演講提詞機</h3>
            <textarea id="tpIn" class="w-full h-32 p-4 bg-slate-800 text-white rounded-xl border-none mb-4" placeholder="請輸入演講稿..."></textarea>
            <div id="tpDisplay" class="hidden fixed inset-0 bg-black z-[100] flex items-center justify-center p-20 cursor-pointer">
                <p id="tpText" class="text-white text-5xl font-bold leading-relaxed text-center"></p>
            </div>
            <button id="tpStart" class="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl">進入全螢幕提詞模式</button>
        </div>
    `;
    setTimeout(() => {
        const start = document.getElementById('tpStart');
        const display = document.getElementById('tpDisplay');
        const text = document.getElementById('tpText');
        start.onclick = () => {
            text.textContent = document.getElementById('tpIn').value || "請輸入稿子";
            display.classList.remove('hidden');
        };
        display.onclick = () => display.classList.add('hidden');
    }, 0);
};