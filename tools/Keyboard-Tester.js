window.render_keyboardTester = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-slate-900 p-6 rounded-2xl text-center">
            <h3 class="text-white font-bold mb-4">⌨️ 鍵盤防鬼鍵測試 (Ghosting)</h3>
            <p class="text-slate-500 text-xs mb-6">按下鍵盤，下方會即時顯示偵測到的按鍵編碼。</p>
            <div id="keyDisplay" class="flex flex-wrap gap-2 justify-center min-h-[100px]">
                <div class="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg">等待輸入...</div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const display = document.getElementById('keyDisplay');
        const pressedKeys = new Set();
        window.onkeydown = (e) => {
            e.preventDefault();
            pressedKeys.add(e.code);
            update();
        };
        window.onkeyup = (e) => {
            pressedKeys.delete(e.code);
            update();
        };
        function update() {
            if (pressedKeys.size === 0) {
                display.innerHTML = '<div class="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg">等待輸入...</div>';
                return;
            }
            display.innerHTML = '';
            pressedKeys.forEach(k => {
                const div = document.createElement('div');
                div.className = "px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg animate-bounce";
                div.textContent = k;
                display.appendChild(div);
            });
        }
    }, 0);
};