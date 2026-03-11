window.render_videoToGif = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🎥 影片轉 GIF (純前端)</h3>
            <p class="text-xs text-slate-400 mb-4">使用 Canvas 擷取影片幀。請上傳短影片。</p>
            <input type="file" id="vgifIn" accept="video/*" class="mb-4 text-sm w-full">
            <video id="vgifPreview" class="hidden w-full rounded-lg mb-4" controls></video>
            <button id="vgifBtn" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hidden">擷取當前畫面轉為 PNG</button>
            <canvas id="vgifCanvas" class="hidden"></canvas>
        </div>
    `;
    setTimeout(() => {
        const video = document.getElementById('vgifPreview');
        const btn = document.getElementById('vgifBtn');
        document.getElementById('vgifIn').onchange = (e) => {
            video.src = URL.createObjectURL(e.target.files[0]);
            video.classList.remove('hidden');
            btn.classList.remove('hidden');
        };
        btn.onclick = () => {
            const canvas = document.getElementById('vgifCanvas');
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const a = document.createElement('a'); a.download = 'capture.png';
            a.href = canvas.toDataURL(); a.click();
        };
    }, 0);
};