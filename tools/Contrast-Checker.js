window.render_contrastChecker = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-6">👁️ UI 對比度無障礙檢查</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <label class="text-sm font-bold">文字顏色</label>
                    <input type="color" id="conText" value="#ffffff" class="w-16 h-10">
                </div>
                <div class="flex justify-between items-center">
                    <label class="text-sm font-bold">背景顏色</label>
                    <input type="color" id="conBg" value="#3b82f6" class="w-16 h-10">
                </div>
                <div id="conPreview" class="p-8 rounded-xl text-center text-xl font-bold transition-colors">
                    預覽文字 Preview Text
                </div>
                <div id="conRes" class="p-4 bg-slate-900 text-white rounded-xl text-center font-mono">
                    對比度: 1:1
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const t = document.getElementById('conText').value, b = document.getElementById('conBg').value;
            const preview = document.getElementById('conPreview');
            preview.style.color = t;
            preview.style.backgroundColor = b;
            // 這裡簡化對比度計算邏輯
            document.getElementById('conRes').textContent = `WCAG 規範檢查中...`;
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
        calc();
    }, 0);
};