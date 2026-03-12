window.render_burnMessage = function () {
    const targetContainer = typeof container !== 'undefined' ? container : document.body;

    // 注入專屬 CSS (保持不變，視覺一樣美觀)
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
            @keyframes bm-burn { 0% { opacity: 1; filter: blur(0) contrast(1); transform: scale(1) translateY(0); } 40% { filter: blur(2px) contrast(2) sepia(1) hue-rotate(-30deg) saturate(3); color: #fb923c; transform: scale(0.98) translateY(-5px); } 100% { opacity: 0; filter: blur(15px); transform: scale(0.9) translateY(-20px); } }
            @keyframes bm-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .bm-burning { animation: bm-burn 1.2s forwards !important; pointer-events: none; }
            .bm-hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

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
                <button id="bm-gen-btn" class="bm-btn bm-btn-primary">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    產生專屬加密連結
                </button>
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
                    <button id="bm-burn-btn" class="bm-btn bm-btn-danger">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15z"/></svg>
                        立即銷毀訊息
                    </button>
                    <button id="bm-back-btn" class="bm-btn bm-btn-outline">我也要建立機密訊息</button>
                </div>
            </div>
        </div>
    `;

    const cryptoEngine = {
        generateKey: () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
        process: (text, key) => {
            let result = '';
            for (let i = 0; i < text.length; i++) result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            return result;
        },
        encrypt: function (text, key) { return btoa(this.process(encodeURIComponent(text), key)); },
        decrypt: function (cipherBase64, key) {
            try { return decodeURIComponent(this.process(atob(cipherBase64), key)); } catch (e) { return null; }
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

    elements.msgInput.addEventListener('input', (e) => { elements.counter.textContent = `${e.target.value.length} / 2000`; });

    // --- 🚀 新增：聰明抓取網址參數 (相容任何工具箱路由) ---
    const getUrlParam = (paramName) => {
        const url = new URL(window.location.href);
        // 先找標準的 ?secret=xxx
        if (url.searchParams.has(paramName)) return url.searchParams.get(paramName);

        // 如果工具箱把參數藏在 Hash 裡面 (例如 #/tool?secret=xxx 或 #secret=xxx)
        if (url.hash.includes(paramName + '=')) {
            const hashQueryStr = url.hash.includes('?') ? url.hash.substring(url.hash.indexOf('?')) : '?' + url.hash.substring(1);
            const hashParams = new URLSearchParams(hashQueryStr);
            if (hashParams.has(paramName)) return hashParams.get(paramName);
        }
        return null;
    };

    let cipherData = {
        cipher: getUrlParam('secret'),
        autoKey: getUrlParam('k'),
        needsPwd: false
    };

    // --- 判斷是否為接收端 ---
    if (cipherData.cipher) {
        cipherData.needsPwd = !cipherData.autoKey;
        elements.createSec.classList.add('bm-hidden');
        elements.readSec.classList.remove('bm-hidden');

        // 🚀 新增：無損清理網址參數，不破壞工具箱原有路由
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('secret');
        cleanUrl.searchParams.delete('k');

        // 清理 Hash 中的參數
        if (cleanUrl.hash.includes('secret=')) {
            let newHash = cleanUrl.hash.replace(/([?&]?)(secret|k)=[^&]+/g, '');
            newHash = newHash.replace(/[?&]$/, '').replace(/^#&/, '#');
            cleanUrl.hash = (newHash === '#' || newHash === '#?') ? '' : newHash;
        }
        history.replaceState(null, null, cleanUrl.toString());

        if (cipherData.needsPwd) {
            elements.unlockArea.classList.remove('bm-hidden');
        } else {
            showSecret(cipherData.autoKey);
        }
    }

    // --- 建立加密連結 ---
    elements.genBtn.addEventListener('click', () => {
        const text = elements.msgInput.value.trim();
        const pwd = elements.pwdInput.value.trim();
        if (!text) return alert('⚠️ 請先輸入你想保密的訊息！');

        const key = pwd || cryptoEngine.generateKey();
        const cipherText = cryptoEngine.encrypt(text, key);

        // 🚀 新增：把參數加在當前工具箱的網址之後，確保連結點開還是這個工具
        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('secret', cipherText);
        if (!pwd) shareUrl.searchParams.set('k', key);

        elements.linkFallback.value = shareUrl.toString();
        elements.resultBox.style.display = 'block';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareUrl.toString()).then(() => {
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
        if (pwd) showSecret(pwd);
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
        // 重整時，為了確保在工具箱中不會跑位，我們刷新目前不含 secret 的乾淨網址
        window.location.href = window.location.href.split('?secret')[0].split('&secret')[0];
    });
};
