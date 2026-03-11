window.render_colorLighten = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">💡 顏色亮度模擬</h3>
            <input type="color" id="clColor" value="#3b82f6" class="w-full h-12 mb-4">
            <div class="flex gap-2">
                <div id="clDark" class="flex-1 h-20 rounded-lg"></div>
                <div id="clBase" class="flex-1 h-20 rounded-lg"></div>
                <div id="clLight" class="flex-1 h-20 rounded-lg"></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('clColor').oninput = (e) => {
            const c = e.target.value;
            document.getElementById('clBase').style.backgroundColor = c;
            document.getElementById('clDark').style.backgroundColor = c; document.getElementById('clDark').style.filter = 'brightness(0.7)';
            document.getElementById('clLight').style.backgroundColor = c; document.getElementById('clLight').style.filter = 'brightness(1.3)';
        };
        document.getElementById('clColor').oninput({ target: { value: '#3b82f6' } });
    }, 0);
};