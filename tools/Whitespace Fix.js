window.render_whitespaceFix = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🧹 多餘空白清理</h3>
            <textarea id="wsIn" class="w-full h-32 p-3 border rounded-xl mb-4 text-sm" placeholder="貼上帶有雜亂空格的文字..."></textarea>
            <button onclick="const el=document.getElementById('wsIn'); el.value=el.value.replace(/\\s+/g,' ').trim()" class="w-full py-2 bg-slate-800 text-white rounded-lg">一鍵壓縮空格</button>
        </div>
    `;
};