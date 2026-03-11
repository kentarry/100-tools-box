window.render_burnMessage = function () {
    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">🕵️ 純前端加密訊息連結</h3>
            <p style="color: #64748b; margin-bottom: 20px; font-size: 0.9rem;">輸入私密訊息，系統會將內容加密並打包成一段專屬網址。密文只存在於網址中，絕不經過任何伺服器！</p>
            <div id="encryptArea">
                <textarea id="secretMsg" placeholder="請輸入你想加密的悄悄話..." style="width: 100%; height: 100px; padding: 12px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px; resize: none;"></textarea>
                <button id="genLinkBtn" style="width: 100%; padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">🔗 產生加密連結</button>
            </div>
            
            <div id="decryptArea" style="display: none; margin-top: 20px; padding: 15px; background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px;">
                <h4 style="color: #be185d; margin-bottom: 10px;">有人傳送了加密訊息給你：</h4>
                <p id="decryptedMsg" style="font-size: 1.1rem; font-weight: bold; color: #1e293b; word-break: break-all;"></p>
                <button id="resetBtn" style="margin-top: 15px; padding: 8px 16px; background: #be185d; color: white; border: none; border-radius: 6px; cursor: pointer;">我要寫新訊息</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        const msgInput = document.getElementById('secretMsg');
        const genBtn = document.getElementById('genLinkBtn');
        const encryptArea = document.getElementById('encryptArea');
        const decryptArea = document.getElementById('decryptArea');
        const decryptedMsg = document.getElementById('decryptedMsg');
        const resetBtn = document.getElementById('resetBtn');

        // 簡易的混淆加密 (Base64 + URI編碼)
        function encodeMsg(str) {
            return btoa(encodeURIComponent(str));
        }

        function decodeMsg(str) {
            try {
                return decodeURIComponent(atob(str));
            } catch (e) {
                return "❌ 連結無效或已損壞";
            }
        }

        // 檢查網址列是否已經帶有 Hash (代表這是別人點開的解密連結)
        if (window.location.hash.startsWith('#msg=')) {
            const cipherText = window.location.hash.replace('#msg=', '');
            encryptArea.style.display = 'none';
            decryptArea.style.display = 'block';
            decryptedMsg.textContent = decodeMsg(cipherText);
            // 讀取後馬上清除網址列的 hash，達到類似「閱後即焚」的視覺效果
            history.replaceState(null, null, ' ');
        }

        genBtn.addEventListener('click', () => {
            const text = msgInput.value.trim();
            if (!text) return alert("請先輸入訊息！");

            const cipher = encodeMsg(text);
            const currentUrl = window.location.href.split('#')[0];
            const shareLink = `${currentUrl}#msg=${cipher}`;

            navigator.clipboard.writeText(shareLink).then(() => {
                genBtn.textContent = "✅ 加密連結已複製！傳給朋友吧";
                setTimeout(() => genBtn.textContent = "🔗 產生加密連結", 3000);
                msgInput.value = '';
            });
        });

        resetBtn.addEventListener('click', () => {
            decryptArea.style.display = 'none';
            encryptArea.style.display = 'block';
        });
    }, 0);
};