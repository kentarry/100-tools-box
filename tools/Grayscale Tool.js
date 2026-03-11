window.render_grayscaleTool = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🖼️ 圖片黑白轉換預覽</h3>
            <input type="file" id="gsIn" accept="image/*" class="mb-4 text-sm">
            <img id="gsImg" class="w-full rounded-lg transition-all" style="filter: grayscale(100%)">
        </div>
    `;
    setTimeout(() => {
        document.getElementById('gsIn').onchange = (e) => {
            document.getElementById('gsImg').src = URL.createObjectURL(e.target.files[0]);
        };
    }, 0);
};