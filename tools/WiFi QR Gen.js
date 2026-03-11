window.render_wifiQRGen = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h3 class="text-xl font-bold mb-4">📶 WiFi 快速連線 QR Code</h3>
            <div class="space-y-4 text-left">
                <div>
                    <label class="text-xs font-bold text-slate-500">網路名稱 (SSID)</label>
                    <input type="text" id="wifiSsid" class="w-full p-2 border rounded-lg" placeholder="例如：Home_WiFi">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500">密碼</label>
                    <input type="password" id="wifiPass" class="w-full p-2 border rounded-lg" placeholder="WiFi 密碼">
                </div>
                <button id="genWifiBtn" class="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl">產生 QR Code</button>
            </div>
            <div id="wifiQrResult" class="mt-6 flex flex-col items-center hidden">
                <div id="wifiQrCanvas" class="p-4 bg-white border rounded-xl mb-4"></div>
                <p class="text-xs text-slate-400">列印出來貼在客廳，掃描即可自動連線</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        // 動態載入 QRCode 庫
        if (!window.QRCode) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            document.head.appendChild(script);
        }

        const btn = document.getElementById('genWifiBtn');
        btn.onclick = () => {
            const ssid = document.getElementById('wifiSsid').value;
            const pass = document.getElementById('wifiPass').value;
            if (!ssid) return alert('請輸入 WiFi 名稱');

            const qrContainer = document.getElementById('wifiQrCanvas');
            qrContainer.innerHTML = '';
            // WiFi QR 格式: WIFI:S:SSID;T:WPA;P:PASSWORD;;
            const wifiStr = `WIFI:S:${ssid};T:WPA;P:${pass};;`;

            new QRCode(qrContainer, {
                text: wifiStr,
                width: 200,
                height: 200
            });
            document.getElementById('wifiQrResult').classList.remove('hidden');
        };
    }, 0);
};