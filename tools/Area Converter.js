window.render_areaConverter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-6">🏠 房屋面積全能換算</h3>
            <div class="space-y-4">
                <div><label class="text-xs">台灣坪數</label><input type="number" id="areaPing" value="1" class="w-full p-3 border rounded-xl text-center font-bold"></div>
                <div><label class="text-xs">平方米 (m²)</label><input type="number" id="areaM2" class="w-full p-3 border rounded-xl text-center font-bold bg-slate-50"></div>
                <div><label class="text-xs">平方英尺 (sq ft)</label><input type="number" id="areaSqft" class="w-full p-3 border rounded-xl text-center font-bold bg-slate-50"></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const p = document.getElementById('areaPing'), m = document.getElementById('areaM2'), s = document.getElementById('areaSqft');
        p.oninput = () => { m.value = (p.value * 3.3058).toFixed(2); s.value = (p.value * 35.58).toFixed(2); };
        m.oninput = () => { p.value = (m.value / 3.3058).toFixed(2); s.value = (m.value * 10.764).toFixed(2); };
        p.oninput();
    }, 0);
};
