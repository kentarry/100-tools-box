window.render_lineCounter = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">📏 字數與行數統計</h3>
            <textarea id="lineIn" class="w-full h-48 p-3 border rounded-xl mb-4 text-sm"></textarea>
            <div class="grid grid-cols-2 gap-4 text-center">
                <div class="bg-slate-50 p-4 rounded-xl font-bold">行數：<span id="lineRes">0</span></div>
                <div class="bg-slate-50 p-4 rounded-xl font-bold">字數：<span id="wordRes">0</span></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('lineIn').oninput = (e) => {
            const v = e.target.value;
            document.getElementById('lineRes').textContent = v.split('\n').filter(l => l.length > 0).length;
            document.getElementById('wordRes').textContent = v.length;
        };
    }, 0);
};