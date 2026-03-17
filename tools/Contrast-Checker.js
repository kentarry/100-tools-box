window.render_contrastChecker = function () {
    // 1. 注入精緻化與響應式的 UI 結構
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200 font-sans">
            <h3 class="text-lg font-bold mb-5 text-gray-800 flex items-center gap-2">
                <span class="text-xl">👁️</span> UI 對比度無障礙檢查
            </h3>
            
            <div class="space-y-6">
                <div class="space-y-4">
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-sm font-bold text-gray-700 whitespace-nowrap">文字顏色</label>
                        <div class="flex items-center gap-2">
                            <input type="text" id="conTextHex" value="#FFFFFF" maxlength="7" 
                                class="w-24 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono transition-all">
                            <input type="color" id="conText" value="#ffffff" 
                                class="w-10 h-10 p-0.5 bg-white border border-gray-300 rounded cursor-pointer">
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center gap-4">
                        <label class="text-sm font-bold text-gray-700 whitespace-nowrap">背景顏色</label>
                        <div class="flex items-center gap-2">
                            <input type="text" id="conBgHex" value="#3B82F6" maxlength="7" 
                                class="w-24 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono transition-all">
                            <input type="color" id="conBg" value="#3b82f6" 
                                class="w-10 h-10 p-0.5 bg-white border border-gray-300 rounded cursor-pointer">
                        </div>
                    </div>
                </div>

                <div id="conPreview" class="p-6 rounded-xl text-center transition-colors border shadow-inner">
                    <p class="text-2xl font-bold mb-2 tracking-wide">預覽文字 Preview</p>
                    <p class="text-sm font-medium">這是一段一般大小的預覽文字，<br>用來測試當前的對比度是否足夠清晰易讀。</p>
                </div>

                <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div class="flex justify-between items-end mb-4 border-b border-gray-200 pb-3">
                        <span class="text-sm font-bold text-gray-600">對比度比例 (Ratio)</span>
                        <span id="conResRatio" class="text-3xl font-black font-mono text-gray-900 leading-none">1.00 : 1</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="flex justify-between items-center bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                            <span class="text-gray-600 font-medium text-xs">一般文字 AA</span>
                            <span id="resNormalAA" class="font-bold text-base">❌</span>
                        </div>
                        <div class="flex justify-between items-center bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                            <span class="text-gray-600 font-medium text-xs">大型文字 AA</span>
                            <span id="resLargeAA" class="font-bold text-base">❌</span>
                        </div>
                        <div class="flex justify-between items-center bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                            <span class="text-gray-600 font-medium text-xs">一般文字 AAA</span>
                            <span id="resNormalAAA" class="font-bold text-base">❌</span>
                        </div>
                        <div class="flex justify-between items-center bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                            <span class="text-gray-600 font-medium text-xs">大型文字 AAA</span>
                            <span id="resLargeAAA" class="font-bold text-base">❌</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 2. 核心邏輯與事件綁定 (使用 setTimeout 確保 DOM 渲染完成後才綁定)
    setTimeout(() => {
        // DOM 元素選取
        const inputTextColor = document.getElementById('conText');
        const inputTextHex = document.getElementById('conTextHex');
        const inputBgColor = document.getElementById('conBg');
        const inputBgHex = document.getElementById('conBgHex');

        const previewBox = document.getElementById('conPreview');
        const ratioText = document.getElementById('conResRatio');

        const resNormalAA = document.getElementById('resNormalAA');
        const resLargeAA = document.getElementById('resLargeAA');
        const resNormalAAA = document.getElementById('resNormalAAA');
        const resLargeAAA = document.getElementById('resLargeAAA');

        // 將 HEX 轉為 RGB 格式
        function hexToRgb(hex) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        // 依據 WCAG 標準計算單一顏色的相對亮度 (Relative Luminance)
        function getLuminance(r, g, b) {
            const a = [r, g, b].map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        // 計算並更新 UI 的主函數
        function updateContrast() {
            const colorT = inputTextColor.value;
            const colorB = inputBgColor.value;

            // 1. 更新預覽區樣式
            previewBox.style.color = colorT;
            previewBox.style.backgroundColor = colorB;
            previewBox.style.borderColor = colorT === '#ffffff' && colorB === '#ffffff' ? '#e5e7eb' : colorB;

            // 2. 計算對比度
            const rgbT = hexToRgb(colorT);
            const rgbB = hexToRgb(colorB);

            if (rgbT && rgbB) {
                const lumT = getLuminance(rgbT.r, rgbT.g, rgbT.b);
                const lumB = getLuminance(rgbB.r, rgbB.g, rgbB.b);

                const lightest = Math.max(lumT, lumB);
                const darkest = Math.min(lumT, lumB);

                const ratio = (lightest + 0.05) / (darkest + 0.05);
                const ratioFormatted = ratio.toFixed(2);

                // 3. 顯示數值
                ratioText.textContent = `${ratioFormatted} : 1`;

                // 4. 更新 WCAG 標章狀態
                const passIcon = '✅';
                const failIcon = '❌';

                // 一般文字 AA 需要 4.5:1，AAA 需要 7.0:1
                resNormalAA.textContent = ratio >= 4.5 ? passIcon : failIcon;
                resNormalAAA.textContent = ratio >= 7 ? passIcon : failIcon;

                // 大型文字 (大於18pt或大於14pt且加粗) AA 需要 3.0:1，AAA 需要 4.5:1
                resLargeAA.textContent = ratio >= 3 ? passIcon : failIcon;
                resLargeAAA.textContent = ratio >= 4.5 ? passIcon : failIcon;
            }
        }

        // 同步 Hex 文字框與 Color Picker，並觸發計算
        function syncInputs(hexInput, colorInput) {
            // 從 Color Picker 更新文字框
            colorInput.addEventListener('input', (e) => {
                hexInput.value = e.target.value.toUpperCase();
                updateContrast();
            });

            // 從文字框更新 Color Picker
            hexInput.addEventListener('input', (e) => {
                let val = e.target.value;
                if (!val.startsWith('#')) val = '#' + val;

                // 簡易驗證是否為合法色碼格式
                if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
                    colorInput.value = hexToRgb(val) ? val : colorInput.value; // 如果解析成功才替換
                    updateContrast();
                }
            });

            // 離開文字框時自動補齊 #
            hexInput.addEventListener('blur', (e) => {
                if (!e.target.value.startsWith('#')) e.target.value = '#' + e.target.value;
                e.target.value = e.target.value.toUpperCase();
            });
        }

        // 綁定事件
        syncInputs(inputTextHex, inputTextColor);
        syncInputs(inputBgHex, inputBgColor);

        // 初始化第一次計算
        updateContrast();

    }, 0);
};
