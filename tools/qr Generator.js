window.render_qrGenerator = function () {
    // 確保 container 存在，避免工具尚未載入的錯誤
    // 這裡假設你的全域變數叫做 container，如果你的專案有特定的 ID，可以改成 document.getElementById('your-id')
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('tool-container');

    if (!targetContainer) {
        console.warn("⚠️ 找不到目標容器，工具暫時無法渲染。");
        return;
    }

    // 定義介面 HTML (使用 Tailwind CSS 進行美化)
    targetContainer.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">📱 萬能 QR Code 生成器</h3>
                <p class="text-sm text-gray-500">輕鬆將文字、電話或圖片轉換為專屬 QR Code</p>
            </div>

            <div class="flex justify-center space-x-3 mb-6 bg-gray-50 p-1 rounded-xl w-fit mx-auto border border-gray-200">
                <button onclick="QRTool.switchTab('text')" id="qr-tab-text" class="px-5 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-sm transition">📝 文字/網址</button>
                <button onclick="QRTool.switchTab('phone')" id="qr-tab-phone" class="px-5 py-2 text-gray-500 font-medium rounded-lg hover:text-gray-800 transition">📞 電話</button>
                <button onclick="QRTool.switchTab('image')" id="qr-tab-image" class="px-5 py-2 text-gray-500 font-medium rounded-lg hover:text-gray-800 transition">🖼️ 圖片</button>
            </div>

            <div id="qr-input-text" class="mb-5 block">
                <textarea id="qr-val-text" class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-inner" rows="3" placeholder="請輸入網址或任何文字內容..."></textarea>
            </div>

            <div id="qr-input-phone" class="mb-5 hidden">
                <input type="tel" id="qr-val-phone" class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-inner" placeholder="請輸入電話號碼 (例: 0912345678)">
            </div>

            <div id="qr-input-image" class="mb-5 hidden">
                <div class="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition relative">
                    <input type="file" id="qr-val-image" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange="document.getElementById('qr-file-name').innerText = this.files[0]?.name || '尚未選擇檔案'">
                    <div class="pointer-events-none">
                        <span class="text-4xl mb-2 block">📁</span>
                        <span class="text-blue-500 font-medium">點擊或拖曳上傳圖片</span>
                        <p id="qr-file-name" class="text-xs text-gray-400 mt-2">支援 JPG, PNG 格式</p>
                    </div>
                </div>
            </div>

            <button onclick="QRTool.generate()" class="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-md transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm text-lg">
                ✨ 立即生成 QR Code
            </button>

            <div id="qr-result-area" class="mt-8 hidden flex-col items-center animate-fade-in">
                <div class="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm mb-5">
                    <img id="qr-result-img" src="" alt="生成的 QR Code" class="w-48 h-48 object-contain">
                </div>
                <div class="flex space-x-4">
                    <button onclick="QRTool.copyLink()" class="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg text-sm transition hover:bg-gray-700 shadow-sm">
                        🔗 複製圖片網址
                    </button>
                    <button onclick="QRTool.downloadImage()" class="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg text-sm transition hover:bg-green-600 shadow-sm">
                        ⬇️ 在新分頁開啟圖片
                    </button>
                </div>
            </div>
        </div>
    `;

    // 建立工具專屬的命名空間，避免污染全域變數 (Global Scope)
    if (!window.QRTool) {
        window.QRTool = {
            currentTab: 'text',
            currentQRUrl: '',

            // 切換頁籤邏輯
            switchTab: function (type) {
                this.currentTab = type;
                const tabs = ['text', 'phone', 'image'];

                tabs.forEach(t => {
                    const btn = document.getElementById('qr-tab-' + t);
                    const inputArea = document.getElementById('qr-input-' + t);

                    if (t === type) {
                        btn.className = "px-5 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-sm transition";
                        inputArea.classList.remove('hidden');
                        inputArea.classList.add('block');
                    } else {
                        btn.className = "px-5 py-2 text-gray-500 font-medium rounded-lg hover:text-gray-800 transition";
                        inputArea.classList.remove('block');
                        inputArea.classList.add('hidden');
                    }
                });

                // 切換時隱藏結果區
                document.getElementById('qr-result-area').classList.add('hidden');
                document.getElementById('qr-result-area').classList.remove('flex');
            },

            // 生成 QR Code 邏輯
            generate: function () {
                let dataToEncode = "";

                if (this.currentTab === 'text') {
                    dataToEncode = document.getElementById('qr-val-text').value.trim();
                } else if (this.currentTab === 'phone') {
                    const phone = document.getElementById('qr-val-phone').value.trim();
                    if (phone) dataToEncode = "tel:" + phone; // tel: 前綴能讓手機掃描時直接撥號
                } else if (this.currentTab === 'image') {
                    const fileInput = document.getElementById('qr-val-image');
                    if (fileInput.files.length > 0) {
                        // 【提醒】：純前端無法把大圖片塞進 QR Code 裡。
                        // 實務上這裡需要 AJAX 上傳圖片到後端 -> 後端回傳圖片網址 -> 將網址轉成 QR Code。
                        // 這裡提供一個彈窗提示，並使用示範網址作為體驗。
                        alert("提示：要將圖片轉為 QR Code，需連接後端圖床 API。目前介面已就緒，暫以示範網址生成 QR Code 供您體驗！");
                        dataToEncode = "https://example.com/your-uploaded-image.jpg";
                    }
                }

                if (!dataToEncode) {
                    alert('⚠️ 請輸入內容或上傳檔案後再生成！');
                    return;
                }

                // 使用穩定的第三方 API 即時產生圖片 (無須載入額外 JS 依賴)
                this.currentQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(dataToEncode)}`;

                const imgElement = document.getElementById('qr-result-img');
                const resultArea = document.getElementById('qr-result-area');

                imgElement.src = this.currentQRUrl;

                // 顯示結果區
                resultArea.classList.remove('hidden');
                resultArea.classList.add('flex');
            },

            // 複製分享連結
            copyLink: function () {
                if (this.currentQRUrl) {
                    navigator.clipboard.writeText(this.currentQRUrl)
                        .then(() => alert('✅ QR Code 圖片連結已複製！可以分享給其他人了。'))
                        .catch(err => alert('複製失敗，請手動複製圖片網址。'));
                }
            },

            // 下載/開啟圖片
            downloadImage: function () {
                if (this.currentQRUrl) {
                    // 為了避免前端跨域下載限制，最簡單穩定的方式是開新分頁讓使用者長按儲存/右鍵另存
                    window.open(this.currentQRUrl, '_blank');
                }
            }
        };
    }
};

// 若要測試，只需呼叫 window.render_qrGenerator();
