window.render_htmlEntities = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">解/編碼 HTML 實體</h3>
            <textarea id="heIn" class="w-full h-32 p-3 border rounded-xl mb-4 font-mono text-sm" placeholder="輸入內容..."></textarea>
            <div class="flex gap-2">
                <button id="heEnc" class="flex-1 py-2 bg-slate-800 text-white rounded-lg">Encode (&lt;)</button>
                <button id="heDec" class="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg">Decode (<)</button>
            </div>
        </div>
    `;
    setTimeout(() => {
        const input = document.getElementById('heIn');
        document.getElementById('heEnc').onclick = () => {
            const div = document.createElement('div'); div.textContent = input.value; input.value = div.innerHTML;
        };
        document.getElementById('heDec').onclick = () => {
            const div = document.createElement('div'); div.innerHTML = input.value; input.value = div.textContent;
        };
    }, 0);
};