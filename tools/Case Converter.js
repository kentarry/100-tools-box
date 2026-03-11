window.render_caseConverter = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4 text-center">🔠 英文大小寫轉換</h3>
            <textarea id="caseIn" class="w-full h-32 p-3 border rounded-xl mb-4 font-mono text-sm" placeholder="Input Text..."></textarea>
            <div class="flex flex-wrap gap-2">
                <button onclick="document.getElementById('caseIn').value = document.getElementById('caseIn').value.toUpperCase()" class="flex-1 py-2 bg-slate-800 text-white rounded-lg">UPPERCASE</button>
                <button onclick="document.getElementById('caseIn').value = document.getElementById('caseIn').value.toLowerCase()" class="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg">lowercase</button>
            </div>
        </div>
    `;
};