window.render_cleanUrl = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">🔗 網址 UTM 追蹤碼移除</h3>
            <input type="text" id="curlIn" placeholder="貼上帶有 utm_ 的長網址" class="w-full p-3 border rounded-xl mb-4 text-sm">
            <button id="curlBtn" class="w-full py-2 bg-slate-800 text-white rounded-lg mb-4">清洗網址</button>
            <div id="curlOut" class="p-3 bg-slate-50 border rounded-xl text-xs break-all"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('curlBtn').onclick = () => {
            const url = new URL(document.getElementById('curlIn').value);
            const params = new URLSearchParams(url.search);
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(k => params.delete(k));
            url.search = params.toString();
            document.getElementById('curlOut').textContent = url.toString();
        };
    }, 0);
};