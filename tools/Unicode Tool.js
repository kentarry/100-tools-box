window.render_unicodeTool = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🔣 Unicode 轉換器</h3>
            <input type="text" id="uniIn" placeholder="輸入文字" class="w-full p-3 border rounded-xl mb-4">
            <div id="uniOut" class="p-4 bg-slate-50 border rounded-xl font-mono text-xs break-all"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('uniIn').oninput = (e) => {
            let res = ""; for (let i = 0; i < e.target.value.length; i++) res += "\\u" + e.target.value.charCodeAt(i).toString(16).padStart(4, '0');
            document.getElementById('uniOut').textContent = res;
        };
    }, 0);
};