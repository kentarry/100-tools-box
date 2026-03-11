window.render_screwSize = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🔩 螺絲英制/公制換算</h3>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="text-xs">英吋 (inch)</label><input type="number" id="scInch" value="1" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">公釐 (mm)</label><input type="number" id="scMm" value="25.4" class="w-full p-2 border rounded bg-slate-50"></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const i = document.getElementById('scInch'), m = document.getElementById('scMm');
        i.oninput = () => m.value = (i.value * 25.4).toFixed(2);
        m.oninput = () => i.value = (m.value / 25.4).toFixed(3);
    }, 0);
};