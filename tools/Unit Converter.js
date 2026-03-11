window.render_unitConverter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-6 italic text-slate-400">房屋面積換算 (坪/平方米)</h3>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs block mb-1">台灣坪數</label>
                    <input type="number" id="unitPing" value="1" class="w-full p-3 border rounded-xl text-center text-xl font-bold">
                </div>
                <div>
                    <label class="text-xs block mb-1">平方米 (m²)</label>
                    <input type="number" id="unitM2" value="3.305" class="w-full p-3 border rounded-xl text-center text-xl font-bold bg-slate-50">
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const p = document.getElementById('unitPing'), m = document.getElementById('unitM2');
        p.oninput = () => m.value = (p.value * 3.3057).toFixed(2);
        m.oninput = () => p.value = (m.value / 3.3057).toFixed(2);
    }, 0);
};