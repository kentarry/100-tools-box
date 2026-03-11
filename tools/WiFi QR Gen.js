window.render_wifiQRGen = function () {
    // 1. 建立高質感的現代化 UI 介面
    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 font-sans text-slate-800 transition-all duration-300">
            
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full mb-4 shadow-lg text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                </div>
                <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight">WiFi 智慧連線神器</h2>
                <p class="text-sm text-slate-500 mt-2">一鍵產生專屬 QR Code，掃描立即連線上網</p>
            </div>

            <div class="space-y-5 text-left">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">網路名稱 (SSID) <span class="text-red-500">*</span></label>
                    <input type="text" id="wifiSsid" class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-slate-50 hover:bg-white" placeholder="例如：MyHome_5G">
                </div>

                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-semibold text-slate-700 mb-1">加密方式</label>
                        <select id="wifiType" class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 cursor-pointer">
                            <option value="WPA">WPA/WPA2/WPA3 (最常見)</option>
                            <option value="WEP">WEP (舊式)</option>
                            <option value="nopass">無密碼 (開放網路)</option>
                        </select>
                    </div>
                    <div class="flex items-end pb-3">
                        <label class="flex items-center cursor-pointer gap-2">
                            <input type="checkbox" id="wifiHidden" class="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer">
                            <span class="text-sm font-medium text-slate-600">這是隱藏網路</span>
                        </label>
                    </div>
                </div>

                <div id="passwordContainer">
                    <label class="block text-sm font-semibold text-slate-700 mb-1">連線密碼</label>
                    <div class="relative">
                        <input type="password" id="wifiPass" class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 hover:bg-white transition-all pr-12" placeholder="請輸入 WiFi 密碼">
                        <button type="button" id="togglePassBtn" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div class="flex-1 flex flex-col items-center">
                        <label class="text-xs font-bold text-slate-500 mb-2">條碼顏色</label>
                        <input type="color" id="qrColorDark" value="#000000" class="w-10 h-10 rounded cursor-pointer border-0 p-0">
                    </div>
                    <div class="flex-1 flex flex-col items-center border-l border-slate-200">
                        <label class="text-xs font-bold text-slate-500 mb-2">背景顏色</label>
                        <input type="color" id="qrColorLight" value="#ffffff" class="w-10 h-10 rounded cursor-pointer border-0 p-0">
                    </div>
                </div>

                <button id="genWifiBtn" class="w-full mt-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    立即產生 QR Code
                </button>
            </div>

            <div id="wifiQrResult" class="mt-8 flex flex-col items-center hidden opacity-0 transition-opacity duration-500">
                <div class="w-full border-t border-slate-100 mb-6"></div>
                
                <div class="relative group p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div id="wifiQrCanvas" class="flex justify-center items-center"></div>
                </div>
                
                <p class="text-sm font-medium text-slate-500 mt-4 mb-6">掃描上方條碼，即可自動連線</p>

                <div class="flex w-full gap-3">
                    <button id="downloadBtn" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg flex justify-center items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        儲存圖片
                    </button>
                    <button id="printBtn" class="flex-1 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded-lg flex justify-center items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        直接列印
                    </button>
                </div>
            </div>
        </div>
    `;

    // 2. 嚴謹的非同步腳本載入機制
    const loadQRCodeJS = () => {
        return new Promise((resolve) => {
            if (window.QRCode) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    };

    // 3. 綁定所有的互動邏輯
    loadQRCodeJS().then(() => {
        const ssidInput = document.getElementById('wifiSsid');
        const passInput = document.getElementById('wifiPass');
        const typeSelect = document.getElementById('wifiType');
        const hiddenCheck = document.getElementById('wifiHidden');
        const colorDark = document.getElementById('qrColorDark');
        const colorLight = document.getElementById('qrColorLight');
        const genBtn = document.getElementById('genWifiBtn');
        const resultArea = document.getElementById('wifiQrResult');
        const qrContainer = document.getElementById('wifiQrCanvas');
        const togglePassBtn = document.getElementById('togglePassBtn');
        const passContainer = document.getElementById('passwordContainer');
        const downloadBtn = document.getElementById('downloadBtn');
        const printBtn = document.getElementById('printBtn');

        let currentQR = null;

        // 加密類型切換邏輯 (無密碼時隱藏密碼輸入框)
        typeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'nopass') {
                passContainer.style.display = 'none';
                passInput.value = '';
            } else {
                passContainer.style.display = 'block';
            }
        });

        // 密碼顯示/隱藏切換
        togglePassBtn.addEventListener('click', () => {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);
            // 切換圖示狀態
            if (type === 'text') {
                togglePassBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0l3.29 3.29m0 0l3.29 3.29m0 0l3.29 3.29" /></svg>`;
            } else {
                togglePassBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
            }
        });

        // 核心產生邏輯
        genBtn.onclick = () => {
            const ssid = ssidInput.value.trim();
            const pass = passInput.value;
            const type = typeSelect.value;
            const isHidden = hiddenCheck.checked ? 'true' : 'false';

            if (!ssid) {
                ssidInput.focus();
                ssidInput.classList.add('border-red-500', 'ring-red-200');
                setTimeout(() => ssidInput.classList.remove('border-red-500', 'ring-red-200'), 1500);
                return;
            }

            // 特殊字元跳脫處理 (防呆設計)
            const escapeString = (str) => str.replace(/([\\;:,\"])/g, '\\$1');
            const safeSsid = escapeString(ssid);
            const safePass = escapeString(pass);

            // 標準 WiFi QR 格式
            const wifiStr = `WIFI:T:${type};S:${safeSsid};P:${safePass};H:${isHidden};;`;

            // 清除舊的 QR Code
            qrContainer.innerHTML = '';

            // 產生新的 QR Code
            currentQR = new QRCode(qrContainer, {
                text: wifiStr,
                width: 240,
                height: 240,
                colorDark: colorDark.value,
                colorLight: colorLight.value,
                correctLevel: QRCode.CorrectLevel.H // 高容錯率，方便未來若要貼 Logo
            });

            // 顯示結果區塊 (帶入淡入動畫)
            resultArea.classList.remove('hidden');
            setTimeout(() => resultArea.classList.remove('opacity-0'), 50);
        };

        // 圖片下載邏輯
        downloadBtn.onclick = () => {
            const img = qrContainer.querySelector('img');
            const canvas = qrContainer.querySelector('canvas');

            // QRCode.js 在不同瀏覽器可能會產出 img 或 canvas，做雙重保護
            const src = img && img.src ? img.src : (canvas ? canvas.toDataURL("image/png") : null);

            if (src) {
                const link = document.createElement('a');
                link.href = src;
                link.download = `WiFi_${ssidInput.value || 'QRCode'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        // 快速列印邏輯
        printBtn.onclick = () => {
            const img = qrContainer.querySelector('img');
            const canvas = qrContainer.querySelector('canvas');
            const src = img && img.src ? img.src : (canvas ? canvas.toDataURL("image/png") : null);

            if (src) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head><title>列印 WiFi QR Code</title></head>
                        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
                            <h1 style="margin-bottom:20px;">歡迎使用我們的 WiFi</h1>
                            <img src="${src}" style="width: 300px; height: 300px;" />
                            <p style="margin-top:20px; font-size:18px;">網路名稱: <b>${ssidInput.value}</b></p>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                // 等待圖片載入後列印
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            }
        };
    });
};
