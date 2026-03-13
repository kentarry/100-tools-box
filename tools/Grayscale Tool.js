window.render_grayscaleTool = function () {
    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-white p-8 rounded-[24px] shadow-2xl border border-gray-100 text-center transition-all duration-300">
            <div class="mb-8">
                <h3 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black mb-2 flex items-center justify-center gap-3">
                    <span>📸</span> 經典黑白底片濾鏡
                </h3>
                <p class="text-gray-500 text-sm font-medium">一鍵上傳，為你的彩色照片注入復古靈魂</p>
            </div>

            <label for="gsIn" class="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-gray-500 transition-all duration-300 mb-6 group relative overflow-hidden">
                <div class="flex flex-col items-center justify-center z-10">
                    <svg class="w-12 h-12 mb-3 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="mb-2 text-base text-gray-600 group-hover:text-gray-900 font-bold">點擊此處選擇圖片</p>
                    <p class="text-xs text-gray-400">支援 JPG, PNG 等常見格式</p>
                </div>
                <input type="file" id="gsIn" accept="image/*" class="hidden">
            </label>

            <div id="previewContainer" class="hidden flex-col items-center animate-fade-in">
                <div class="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-6 group bg-gray-100">
                    <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10 tracking-wide">
                        預覽效果
                    </div>
                    <img id="gsImg" class="w-full h-auto max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-105">
                </div>
                
                <a id="downloadBtn" class="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    下載黑白照片
                </a>
            </div>
            
            <canvas id="gsCanvas" class="hidden"></canvas>
        </div>
    `;

    setTimeout(() => {
        const inputElement = document.getElementById('gsIn');
        const imgElement = document.getElementById('gsImg');
        const previewContainer = document.getElementById('previewContainer');
        const canvas = document.getElementById('gsCanvas');
        const ctx = canvas.getContext('2d');
        const downloadBtn = document.getElementById('downloadBtn');

        inputElement.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        // 1. 設定 Canvas 尺寸與原圖完全相同
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // 2. 將圖片畫到 Canvas 上
                        ctx.drawImage(img, 0, 0);

                        // 3. 獲取圖片數據並轉換為灰階 (基於人眼對色彩敏感度的公式)
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                            data[i] = gray;     // Red
                            data[i + 1] = gray; // Green
                            data[i + 2] = gray; // Blue
                        }
                        ctx.putImageData(imageData, 0, 0);

                        // 4. 將處理後的 Canvas 轉換為圖片 URL
                        const grayscaleUrl = canvas.toDataURL(file.type);

                        // 5. 更新 UI
                        imgElement.src = grayscaleUrl;
                        downloadBtn.href = grayscaleUrl;
                        downloadBtn.download = 'B&W_' + file.name; // 自動加上前綴字

                        // 顯示預覽與下載區塊
                        previewContainer.classList.remove('hidden');
                        previewContainer.classList.add('flex');
                    };
                    img.src = event.target.result;
                };

                // 讀取上傳的檔案
                reader.readAsDataURL(file);
            }
        };
    }, 0);
};
