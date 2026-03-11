window.render_recipeScaler = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🍳 食譜份量人數換算</h3>
            <div class="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
                <div><label class="text-xs">原食譜人數</label><input type="number" id="recipeOrig" value="4" class="w-full p-2 border rounded"></div>
                <div class="text-xl">➡️</div>
                <div><label class="text-xs">我的目標人數</label><input type="number" id="recipeTarget" value="2" class="w-full p-2 border rounded"></div>
            </div>
            <textarea id="recipeInput" class="w-full h-32 p-3 border rounded-xl mb-4 text-sm" placeholder="請輸入帶有數字的食譜，例如：雞蛋 4 顆、麵粉 200g"></textarea>
            <div id="recipeOutput" class="p-4 bg-emerald-50 rounded-xl text-emerald-800 whitespace-pre-wrap font-bold"></div>
        </div>
    `;
    setTimeout(() => {
        const input = document.getElementById('recipeInput');
        function scale() {
            const ratio = document.getElementById('recipeTarget').value / document.getElementById('recipeOrig').value;
            const val = input.value;
            const res = val.replace(/(\d+(\.\d+)?)/g, (match) => {
                return (parseFloat(match) * ratio).toFixed(1).replace(/\.0$/, '');
            });
            document.getElementById('recipeOutput').textContent = res;
        }
        document.querySelectorAll('input, textarea').forEach(el => el.oninput = scale);
    }, 0);
};