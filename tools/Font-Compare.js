window.render_fontCompare = function () {
    // 1. 渲染畫面 (加入控制區與優化後的顯示區)
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 class="text-xl font-bold mb-5 text-center text-gray-800">🖋️ 系統字體對比工具</h3>

            <div class="mb-6 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                    <label for="font-text-input" class="block text-sm font-medium text-gray-700 mb-1">測試文字</label>
                    <input type="text" id="font-text-input" value="認同請分享 123 abc" 
                        placeholder="請輸入想測試的文字..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-base">
                </div>
                <div>
                    <label for="font-size-input" class="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>字體大小</span>
                        <span id="font-size-display" class="text-blue-600 font-semibold">16px</span>
                    </label>
                    <input type="range" id="font-size-input" min="12" max="48" value="16" 
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
                </div>
            </div>

            <div class="space-y-4" id="font-preview-container">
                <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
                        <span class="font-semibold text-gray-700">微軟正黑體</span>
                        <span>Windows 預設</span>
                    </div>
                    <div class="font-preview-text break-words overflow-hidden" style="font-family: 'Microsoft JhengHei', sans-serif; font-size: 16px;">認同請分享 123 abc</div>
                </div>

                <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
                        <span class="font-semibold text-gray-700">蘋方繁體</span>
                        <span>macOS / iOS 預設</span>
                    </div>
                    <div class="font-preview-text break-words overflow-hidden" style="font-family: 'PingFang TC', sans-serif; font-size: 16px;">認同請分享 123 abc</div>
                </div>

                <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
                        <span class="font-semibold text-gray-700">思源黑體</span>
                        <span>Android / 網頁常見</span>
                    </div>
                    <div class="font-preview-text break-words overflow-hidden" style="font-family: 'Noto Sans TC', sans-serif; font-size: 16px;">認同請分享 123 abc</div>
                </div>
                
                <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div class="text-xs text-gray-500 mb-2 flex items-center justify-between">
                        <span class="font-semibold text-gray-700">標楷體</span>
                        <span>公文 / 正式文件</span>
                    </div>
                    <div class="font-preview-text break-words overflow-hidden" style="font-family: 'BiauKai', 'DFKai-SB', serif; font-size: 16px;">認同請分享 123 abc</div>
                </div>
            </div>
        </div>
    `;

    // 2. 綁定互動事件 (確保只抓取這個容器內的元素，不影響其他 99 個工具)
    const textInput = container.querySelector('#font-text-input');
    const sizeInput = container.querySelector('#font-size-input');
    const sizeDisplay = container.querySelector('#font-size-display');
    const previewTexts = container.querySelectorAll('.font-preview-text');

    // 監聽文字輸入
    textInput.addEventListener('input', (e) => {
        const newText = e.target.value || ' '; // 避免清空時高度塌陷
        previewTexts.forEach(el => el.textContent = newText);
    });

    // 監聽拉桿滑動
    sizeInput.addEventListener('input', (e) => {
        const newSize = e.target.value + 'px';
        sizeDisplay.textContent = newSize;
        previewTexts.forEach(el => el.style.fontSize = newSize);
    });
};
