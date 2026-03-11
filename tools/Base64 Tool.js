window.render_base64Tool = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🔗 Base64 編解碼器</h3>
            <textarea id="b64In" class="w-full h-32 p-3 border rounded-xl mb-4 text-sm" placeholder="輸入文字或 Base64..."></textarea>
            <div class="flex gap-2">
                <button id="b64Enc" class="flex-1 py-2 bg-indigo-500 text-white rounded-lg">文字 ➜ Base64</button>
                <button id="b64Dec" class="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg">Base64 ➜ 文字</button>
            </div>
        </div>
    `;
    setTimeout(() => {
        const input = document.getElementById('b64In');
        document.getElementById('b64Enc').onclick = () => input.value = btoa(unescape(encodeURIComponent(input.value)));
        document.getElementById('b64Dec').onclick = () => {
            try { input.value = decodeURIComponent(escape(atob(input.value))); } catch (e) { alert('無效的格式'); }
        };
    }, 0);
};