window.render_exifViewer = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">📸 圖片 EXIF 資訊檢視</h3>
            <input type="file" id="exifIn" class="mb-4 text-sm w-full">
            <div id="exifRes" class="text-left text-xs text-slate-500 font-mono bg-slate-50 p-4 rounded-xl hidden"></div>
        </div>
    `;
};