window.render_webWhiteboard = function () {
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[70vh]">
            <div class="p-4 bg-slate-50 border-b flex gap-4 items-center">
                <h3 class="font-bold mr-4">🖍️ 臨時白板</h3>
                <input type="color" id="wbColor" value="#000000">
                <input type="range" id="wbSize" min="1" max="20" value="5">
                <button id="wbClear" class="px-3 py-1 bg-white border rounded text-xs">清除</button>
                <button id="wbDownload" class="px-3 py-1 bg-slate-800 text-white rounded text-xs ml-auto">下載圖片</button>
            </div>
            <canvas id="wbCanvas" class="flex-1 cursor-crosshair"></canvas>
        </div>
    `;

    setTimeout(() => {
        const canvas = document.getElementById('wbCanvas');
        const ctx = canvas.getContext('2d');
        const color = document.getElementById('wbColor');
        const size = document.getElementById('wbSize');
        const clear = document.getElementById('wbClear');
        const download = document.getElementById('wbDownload');
        let painting = false;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
        window.onresize = resize; resize();

        canvas.onmousedown = (e) => { painting = true; draw(e); };
        canvas.onmousemove = draw;
        canvas.onmouseup = () => { painting = false; ctx.beginPath(); };

        function draw(e) {
            if (!painting) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineWidth = size.value;
            ctx.strokeStyle = color.value;
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        clear.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
        download.onclick = () => {
            const a = document.createElement('a');
            a.download = 'whiteboard.png';
            a.href = canvas.toDataURL();
            a.click();
        };
    }, 0);
};