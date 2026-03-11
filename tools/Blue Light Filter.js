window.render_blueLightFilter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🌙 護眼模式預覽</h3>
            <input type="range" id="blRange" min="0" max="50" value="0" class="w-full mb-6">
            <div id="blOverlay" class="p-10 bg-white border rounded-xl transition-colors duration-500">這是一個模擬網頁內容的區塊，調整拉桿查看濾鏡效果。</div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('blRange').oninput = (e) => {
            document.getElementById('blOverlay').style.backgroundColor = `rgba(255, 150, 0, ${e.target.value / 100})`;
        };
    }, 0);
};