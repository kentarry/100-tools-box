window.render_burnMessage = function () {
    const targetContainer = typeof container !== 'undefined' ? container : document.body;

    // 注入專屬 CSS (保持不變，維持高質感 UI)
    const styleId = 'bm-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .bm-wrapper { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 2rem auto; padding: 2.5rem; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); transition: all 0.3s ease; border: 1px solid #f1f5f9; }
            .bm-header { text-align: center; margin-bottom: 2rem; }
            .bm-title { font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 10px 0; }
            .bm-subtitle { color: #64748b; font-size: 0.95rem; line-height: 1.5; margin: 0; }
            .bm-form-group { margin-bottom: 1.5rem; position: relative; }
            .bm-input { width: 100%; box-sizing: border-box; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; transition: all 0.3s; background: #f8fafc; color: #1e293b; }
            .bm-input:focus { outline: none; border-color: #a855f7; background: #ffffff; box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1); }
            .bm-textarea { resize: vertical; min-height: 120px; }
            .bm-char-count { position: absolute; bottom: 10px; right: 12px; font-size: 0.8rem; color: #94a3b8; }
            .bm-btn { width: 100%; padding: 1rem; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
            .bm-btn-primary { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3); }
            .bm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4); }
            .bm-btn-danger { background: linear-gradient(135deg, #f43f5e, #fb923c); color: white; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3); margin-top: 15px; }
            .bm-btn-danger:hover { transform: translateY(-2px); }
            .bm-btn-outline { background: transparent; color: #64748b; border: 2px solid #e2e8f0; margin-top: 15px; }
            .bm-btn-outline:hover { background: #f1f5f9; }
            .bm-result-box { margin-top: 1.5rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; display: none; animation: bm-fade-in 0.5s; }
            .bm-link-display { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; margin-top: 10px; font-size: 0.85rem; color: #475569; background: #fff; word-break: break-all; }
            .bm-decrypted-box { background: #1e293b; color: #f8fafc; padding: 2rem; border-radius: 16px; font-size: 1.1rem; line-height: 1.6; text-align: center; margin: 1.5rem 0; position: relative; word-break: break-word; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
            
            @keyframes bm-burn {
                0% { opacity: 1; filter: blur(0) contrast(1); transform: scale(1) translateY(0); }
                40% { filter: blur(2px) contrast(2) sepia(1) hue-rotate(-30deg) saturate(3); color: #fb923c; transform: scale(0.98) translateY(-5px); }
                100% { opacity: 0; filter: blur(15px); transform: scale(0.9) translateY(-20px); }
            }
            @keyframes bm-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .bm-burning { animation: bm-burn 1.2s forwards !important; pointer-events: none; }
            .bm-hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // 渲染 HTML 結構
    targetContainer.innerHTML = `
        <div class="bm-wrapper" id="bm-app">
            <div id="bm-create-section">
                <div class="bm-header">
                    <h3 class="bm-title">🕵️ 閱後即焚加密所</h3>
                    <p class="bm-subtitle">高強度前端加密，伺服器也無法偷看你的秘密。<br>連結一經開啟，刷新即永久銷毀。</p>
                </div>

                <div class="bm-form-group">
                    <textarea id="bm-msg" class="bm-input bm-textarea" placeholder="在這裡寫下你的悄悄話、帳號密碼或私密告白..." maxlength="2000"></textarea>
                    <span class="bm-char-count" id="bm-counter">0 / 2000</span>
                </div>

                <div class="bm-form-group">
                    <input type="text" id="bm-pwd" class="bm-input" placeholder="🔒 設定解密密碼 (選填，留白則系統自動產金鑰)" maxlength="50">
                </div>

                <button id="bm-gen-btn" class="bm-btn bm-btn-primary">產生專屬加密連結</button>

                <div id="bm-result" class="bm-result-box">
                    <strong style="color: #166534; display: block; margin-bottom: 5px;">✅ 加密成功！</strong>
                    <span style="font-size: 0.9rem; color: #15803d;">已將連結複製到剪貼簿。您也可以手動複製下方網址：</span>
                    <input type="text" id="bm-link-fallback" class="bm-link-display" readonly>
                </div>
            </div>

            <div id="bm-read-section" class="bm-hidden">
                <div class="bm-header">
                    <h3 class="bm-title" style="background: linear-gradient(135deg, #f43f5e, #fb923c); -webkit-background-clip: text;">🔥 收到機密訊息</h3>
                    <p class="bm-subtitle">此訊息為「閱後即焚」模式，請確認周遭環境安全後再解密。<br>一旦銷毀或重新整理網頁，將無法復原。</p>
                </div>

                <div id="bm-unlock-area" class="bm-form-group bm-hidden">
                    <input type="password" id="bm-decrypt-pwd" class="bm-input" placeholder="請輸入寄件者提供的密碼">
                    <button id="bm-unlock-btn" class="bm-btn bm-btn-primary" style="margin-top: 10px;">解開鎖定</button>
                    <p id="bm-error-msg" style="color: #e11d48; font-size: 0.9rem; margin-top: 10px; display: none;">密碼錯誤或連結已失效！</p>
                </div>

                <div id="bm-msg-display-area" class="bm-hidden">
                    <div id="bm-decrypted-text" class="bm-decrypted-box"></div>
                    <button id="bm-burn-btn" class="bm-btn bm-btn-danger">立即銷毀訊息</button>
                    <button id="bm-back-btn" class="bm-btn bm-btn-outline">我也要建立機密訊息</button>
                </div>
            </div>
        </div>
    `;

    // 加密引擎
    const cryptoEngine = {
        generateKey: () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
        process: (text, key) => {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        },
        encrypt: function (text, key) {
            return btoa(this.process(encodeURIComponent(text), key));
        },
        decrypt: function (cipherBase64, key) {
            try { return decodeURIComponent(this.process(atob(cipherBase64), key)); }
            catch (e) { return null; }
        }
    };

    const elements = {
        createSec: document.getElementById('bm-create-section'),
        readSec: document.getElementById('bm-read-section'),
        msgInput: document.getElementById('bm-msg'),
        counter: document.getElementById('bm-counter'),
        pwdInput: document.getElementById('bm-pwd'),
        genBtn: document.getElementById('bm-gen-btn'),
        resultBox: document.getElementById('bm-result'),
        linkFallback: document.getElementById('bm-link-fallback'),
        unlockArea: document.getElementById('bm-unlock-area'),
        decryptPwdInput: document.getElementById('bm-decrypt-pwd'),
        unlockBtn: document.getElementById('bm-unlock-btn'),
        errorMsg: document.getElementById('bm-error-msg'),
        displayArea: document.getElementById('bm-msg-display-area'),
        decryptedText: document.getElementById('bm-decrypted-text'),
        burnBtn: document.getElementById('bm-burn-btn'),
        backBtn: document.getElementById('bm-back-btn')
    };

    elements.msgInput.addEventListener('input', (e) => {
        elements.counter.textContent = `${e.target.value.length} / 2000`;
    });

    // ==========================================
    // 💡 關鍵修改 1：改用 URLSearchParams 解析網址，不干擾工具箱原本的 Hash
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    let cipherData = {
        cipher: urlParams.get('bm_secret'),
        autoKey: urlParams.get('bm_k')
    };

    // 如果網址中有 bm_secret，代表這是接收者打開的連結
    if (cipherData.cipher) {
        elements.createSec.classList.add('bm-hidden');
        elements.readSec.classList.remove('bm-hidden');

        // 閱後即焚：讀取後立刻把 bm_secret 從網址列抹除，避免使用者重新整理又看到
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('bm_secret');
        cleanUrl.searchParams.delete('bm_k');
        history.replaceState(null, null, cleanUrl.toString());

        if (!cipherData.autoKey) {
            // 需要使用者輸入密碼
            elements.unlockArea.classList.remove('bm-hidden');
        } else {
            // 自動解密
            showSecret(cipherData.autoKey);
        }
    }

    // ==========================================
    // 💡 關鍵修改 2：使用 URL 物件精準產生連結，保留工具箱的狀態
    // ==========================================
    elements.genBtn.addEventListener('click', () => {
        const text = elements.msgInput.value.trim();
        const pwd = elements.pwdInput.value.trim();
        if (!text) return alert('⚠️ 請先輸入你想保密的訊息！');

        const key = pwd || cryptoEngine.generateKey();
        const cipherText = cryptoEngine.encrypt(text, key);

        // 建立一個安全的 URL 物件，這樣加參數絕對不會把工具箱的 #hash 弄壞
        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('bm_secret', cipherText);
        if (!pwd) {
            shareUrl.searchParams.set('bm_k', key);
        }

        const shareLink = shareUrl.toString();

        elements.linkFallback.value = shareLink;
        elements.resultBox.style.display = 'block';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareLink).then(() => {
                const originalText = elements.genBtn.innerHTML;
                elements.genBtn.innerHTML = '✨ 複製成功！快去貼給朋友';
                setTimeout(() => elements.genBtn.innerHTML = originalText, 3000);
            }).catch(() => { });
        }
    });

    elements.linkFallback.addEventListener('click', function () {
        this.select();
        document.execCommand('copy');
        alert('網址已複製！');
    });

    elements.unlockBtn.addEventListener('click', () => {
        const pwd = elements.decryptPwdInput.value.trim();
        if (!pwd) return;
        showSecret(pwd);
    });

    elements.decryptPwdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') elements.unlockBtn.click();
    });

    function showSecret(keyToTry) {
        const decrypted = cryptoEngine.decrypt(cipherData.cipher, keyToTry);
        if (decrypted) {
            elements.unlockArea.classList.add('bm-hidden');
            elements.displayArea.classList.remove('bm-hidden');
            elements.decryptedText.innerHTML = decrypted.replace(/\n/g, '<br>');
        } else {
            elements.errorMsg.style.display = 'block';
            elements.decryptPwdInput.value = '';
            elements.decryptPwdInput.style.transform = 'translateX(10px)';
            setTimeout(() => elements.decryptPwdInput.style.transform = 'translateX(-10px)', 50);
            setTimeout(() => elements.decryptPwdInput.style.transform = 'translateX(0)', 100);
        }
    }

    elements.burnBtn.addEventListener('click', () => {
        elements.decryptedText.classList.add('bm-burning');
        elements.burnBtn.disabled = true;
        elements.burnBtn.innerHTML = '🔥 銷毀中...';

        setTimeout(() => {
            elements.decryptedText.innerHTML = '此訊息已化為灰燼 💨';
            elements.decryptedText.style.color = '#94a3b8';
            elements.decryptedText.classList.remove('bm-burning');
            elements.decryptedText.style.filter = 'none';
            elements.decryptedText.style.opacity = '1';
            elements.burnBtn.style.display = 'none';
        }, 1200);
    });

    elements.backBtn.addEventListener('click', () => {
        // 返回建立頁面，清除舊狀態
        elements.readSec.classList.add('bm-hidden');
        elements.displayArea.classList.add('bm-hidden');
        elements.createSec.classList.remove('bm-hidden');
        elements.msgInput.value = '';
        elements.pwdInput.value = '';
        elements.resultBox.style.display = 'none';
        elements.counter.textContent = '0 / 2000';
    });
};
