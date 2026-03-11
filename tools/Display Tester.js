window.render_displayTester = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h3 class="text-2xl font-bold mb-4">🖥️ 螢幕壞點/漏光檢測</h3>
            <p class="text-slate-500 mb-8">進入全螢幕模式，透過切換純色背景檢查面板瑕疵。</p>
            <button id="startTest" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-xl hover:scale-105 transition-transform">
                開始檢測 (全螢幕)
            </button>
            <div id="testOverlay" class="fixed inset-0 z-[100] hidden cursor-pointer flex items-center justify-center">
                <p class="text-slate-400 opacity-50 font-bold pointer-events-none">點擊切換顏色，ESC 退出</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = document.getElementById('startTest');
        const overlay = document.getElementById('testOverlay');
        const colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'];
        let currentIndex = 0;

        btn.onclick = () => {
            overlay.classList.remove('hidden');
            overlay.style.backgroundColor = colors[0];
            if (overlay.requestFullscreen) overlay.requestFullscreen();
        };

        overlay.onclick = () => {
            currentIndex = (currentIndex + 1) % colors.length;
            overlay.style.backgroundColor = colors[currentIndex];
        };

        document.onfullscreenchange = () => {
            if (!document.fullscreenElement) overlay.classList.add('hidden');
        };
    }, 0);
};