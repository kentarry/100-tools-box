window.render_jsonTool = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">📦 JSON 格式化排版</h3>
            <textarea id="jsonIn" class="w-full h-48 p-3 border rounded-xl font-mono text-xs mb-4" placeholder="請貼上 JSON 原始代碼..."></textarea>
            <button id="jsonFormat" class="w-full py-2 bg-slate-800 text-white rounded-lg font-bold mb-4">美化排版 (Beautify)</button>
            <pre id="jsonOut" class="w-full p-4 bg-slate-50 rounded-xl overflow-auto text-xs text-indigo-700 min-h-[10rem]"></pre>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('jsonFormat').onclick = () => {
            try {
                const obj = JSON.parse(document.getElementById('jsonIn').value);
                document.getElementById('jsonOut').textContent = JSON.stringify(obj, null, 4);
            } catch (e) {
                alert('JSON 格式錯誤！');
            }
        };
    }, 0);
};