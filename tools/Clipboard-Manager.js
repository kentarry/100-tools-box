window.render_clipboardManager = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">📋 本機剪貼簿暫存</h3>
            <p class="text-xs text-slate-400 mb-4">點擊下方按鈕即可貼上並紀錄，網頁重整前都會保留在此。</p>
            <button id="clipAdd" class="w-full py-4 border-2 border-dashed rounded-xl mb-6 text-slate-400 font-bold hover:bg-slate-50">點此新增一筆紀錄</button>
            <div id="clipList" class="space-y-2"></div>
        </div>
    `;
    setTimeout(() => {
        const list = document.getElementById('clipList');
        document.getElementById('clipAdd').onclick = async () => {
            const text = await navigator.clipboard.readText();
            const div = document.createElement('div');
            div.className = "p-3 bg-slate-50 border rounded-lg flex justify-between items-center group";
            div.innerHTML = `<span class="truncate pr-4">${text}</span><button class="text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">複製</button>`;
            div.querySelector('button').onclick = () => navigator.clipboard.writeText(text);
            list.prepend(div);
        };
    }, 0);
};