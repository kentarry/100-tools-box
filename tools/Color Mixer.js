window.render_colorMixer = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4 text-center">🧪 顏色混合器</h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <input type="color" id="mix1" value="#ff0000" class="w-full h-12">
                <input type="color" id="mix2" value="#0000ff" class="w-full h-12">
            </div>
            <div id="mixRes" class="w-full h-24 rounded-xl border border-slate-100 flex items-center justify-center font-bold text-white">混合結果</div>
        </div>
    `;
    setTimeout(() => {
        const update = () => {
            const c1 = document.getElementById('mix1').value;
            const c2 = document.getElementById('mix2').value;
            document.getElementById('mixRes').style.backgroundColor = `color-mix(in srgb, ${c1}, ${c2})`;
        };
        document.getElementById('mix1').oninput = update;
        document.getElementById('mix2').oninput = update;
        update();
    }, 0);
};