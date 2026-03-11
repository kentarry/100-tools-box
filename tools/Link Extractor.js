window.render_linkExtractor = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🔗 HTML 連結提取</h3>
            <textarea id="linkIn" class="w-full h-32 p-3 border rounded-xl mb-4 text-xs font-mono" placeholder="Paste HTML code here..."></textarea>
            <div id="linkOut" class="p-3 bg-slate-50 border rounded-xl text-xs overflow-auto max-h-40 break-all font-mono"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('linkIn').oninput = (e) => {
            const matches = e.target.value.match(/href="([^"]*)"/g) || [];
            document.getElementById('linkOut').innerHTML = matches.join('<br>');
        };
    }, 0);
};