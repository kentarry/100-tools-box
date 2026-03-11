window.render_fsClock = function () {
    container.innerHTML = `
        <div class="fixed inset-0 bg-black flex items-center justify-center z-[100] cursor-pointer" id="fsBox">
            <div id="fsTime" class="text-[20vw] font-black text-white font-mono leading-none">00:00:00</div>
        </div>
    `;
    setTimeout(() => {
        const update = () => {
            const d = new Date();
            document.getElementById('fsTime').textContent = d.toTimeString().split(' ')[0];
        };
        const timer = setInterval(update, 1000); update();
        document.getElementById('fsBox').onclick = () => {
            clearInterval(timer);
            const firstBtn = document.querySelectorAll('#menu-nav button')[0];
            firstBtn.click(); // 隨便跳回一個工具
        };
    }, 0);
};