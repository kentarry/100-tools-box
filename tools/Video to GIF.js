// 假設 container 已經在全域或外部被定義 (例如 const container = document.getElementById('app');)
window.render_videoToGif = function () {
    // 1. 確保 container 存在，避免找不到掛載點的錯誤
    if (!typeof container !== 'undefined' && !container) {
        console.error('錯誤：找不到 container 元素，請確保容器已經準備好。');
        return;
    }

    // 2. 注入高質感的現代化 UI (支援 Tailwind CSS)
    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-xl border border-slate-100 text-center transition-all duration-300">
            
            <div class="mb-6">
                <h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                    🎥 影片畫面擷取器
                </h3>
                <p class="text-sm text-slate-500">上傳短影片，一鍵將精彩瞬間儲存為高畫質圖片！</p>
            </div>

            <div class="relative group cursor-pointer border-2 border-dashed border-indigo-300 rounded-2xl p-6 hover:bg-indigo-50 hover:border-indigo-500 transition-colors mb-6">
                <input type="file" id="vgifIn" accept="video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                <div class="flex flex-col items-center justify-center space-y-2 text-indigo-400 group-hover:text-indigo-600 transition-colors">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span class="font-bold text-base">點擊或拖曳上傳影片</span>
                    <span class="text-xs text-slate-400">支援 MP4, WebM 等常見格式</span>
                </div>
            </div>

            <div id="videoContainer" class="hidden mb-6 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black">
                <video id="vgifPreview" class="w-full h-auto max-h-64 object-contain" controls crossorigin="anonymous"></video>
            </div>

            <button id="vgifBtn" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 transition-all duration-200 hidden flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                擷取當前畫面 (PNG)
            </button>
            
            <canvas id="vgifCanvas" class="hidden"></canvas>
        </div>
    `;

    // 3. 避免工具尚未載入：innerHTML 是同步的，執行完畢後 DOM 就已存在，不需使用 setTimeout
    const video = container.querySelector('#vgifPreview');
    const videoContainer = container.querySelector('#videoContainer');
    const btn = container.querySelector('#vgifBtn');
    const input = container.querySelector('#vgifIn');
    const canvas = container.querySelector('#vgifCanvas');

    // 再次確保元素都有正確生成
    if (!video || !btn || !input || !canvas) {
        console.error('介面渲染失敗：找不到對應的 DOM 元素。');
        return;
    }

    // 4. 綁定上傳事件
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 釋放舊的 URL，避免使用者多次上傳造成記憶體流失 (Memory Leak)
        if (video.src) {
            URL.revokeObjectURL(video.src);
        }

        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;

        // 顯示影片與按鈕
        videoContainer.classList.remove('hidden');
        btn.classList.remove('hidden');
    });

    // 5. 綁定擷取事件並加入防呆機制
    btn.addEventListener('click', () => {
        // 確保影片有正確載入數據才能擷取
        if (video.readyState < 2) {
            alert('影片尚未準備好，請稍候再試！');
            return;
        }

        try {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // 繪製影片當前幀到 Canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 下載圖片，並動態加上時間戳記避免檔名重複
            const a = document.createElement('a');
            a.download = `capture_${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        } catch (error) {
            console.error('擷取失敗:', error);
            alert('擷取畫面時發生錯誤。這可能是因為影片編碼或跨域問題。');
        }
    });
};
