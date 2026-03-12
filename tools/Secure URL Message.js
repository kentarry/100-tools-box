// ==========================================
// 1. 全域攔截器：專門對付「工具箱環境」
// 如果網址有密文，直接清空畫面並強制顯示解密工具
// ==========================================
const autoHijackForDecryption = () => {
    if (window.location.hash.startsWith('#secret=')) {
        // 清空整個畫面，確保對方只看到解密介面，不受工具箱其他元素干擾
        document.body.innerHTML = '';
        document.body.style.background = '#f8fafc'; // 給予乾淨的背景色
        document.body.style.margin = '0';
        document.body.style.display = 'flex';
        document.body.style.minHeight = '100vh';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';

        // 建立一個專屬的容器給解密畫面
        const decryptContainer = document.createElement('div');
        decryptContainer.style.width = '100%';
        document.body.appendChild(decryptContainer);

        // 強制執行渲染
        window.render_burnMessage(decryptContainer);
    }
};

// 確保網頁一載入就優先執行攔截檢查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoHijackForDecryption);
} else {
    autoHijackForDecryption();
}

// ==========================================
// 2. 主程式：閱後即焚工具 (最終進化版)
// ==========================================
window.render_burnMessage = function (customTargetEl) {
    // 智慧尋找容器：優先使用傳入的容器 > 全域 container 變數 > document.body
    const targetContainer = customTargetEl || (typeof container !== 'undefined' ? container : document.body);

    // 注入專屬 CSS
    const styleId = 'bm-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .bm-wrapper { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 2.5rem; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); transition: all 0.3s ease; border: 1px solid #f1f5f9; width: 90%; }
            .bm-header { text-align: center; margin-bottom: 2rem; }
            .bm-title { font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 10px 0; }
            .bm-subtitle { color: #64748b; font-size: 0.95rem; line-height: 1.5; margin: 0; }
            .bm-form-group { margin-bottom: 1.5rem; position: relative; }
            .bm-input { width: 100%; box-sizing: border-box; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; transition: all 0.3s; background: #f8fafc; color: #1e293b; }
            .bm-input:focus { outline: none; border-color: #a855f7; background: #ffffff; box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1); }
            .bm-textarea { resize: vertical; min-height: 120px; }
            .bm-char-count { position: absolute; bottom: 10px; right: 12px; font-size: 0.8rem; color: #94a3b8; }
            .bm-btn { width: 100%; box-sizing: border-box; padding: 1rem; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
            .bm-btn-primary { background: linear-gradient(135deg, #6366f1, #a855f7); color: white; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3); }
            .bm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4); }
            .bm-btn-danger { background: linear-gradient(135deg, #f43f5e, #fb923c); color: white; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3); margin-top: 15px; }
            .bm-btn-danger:hover { transform: translateY(-2px); }
            .bm-btn-outline { background: transparent; color: #64748b; border: 2px solid #e2e8f0; margin-top: 15px; }
            .bm-btn-outline:hover { background: #f1f5f9; }
            .bm-result-box { margin-top: 1.5rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; display: none; animation: bm-fade-in 0.5s; }
            .bm-link-display { width: 100%; box-sizing: border-box; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; margin-top: 10px; font-size: 0.85rem; color: #475569; background: #fff; word-break: break-all; cursor: pointer; }
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
                    <p class="bm-subtitle">高強度前端加密，伺服器也無法偷看。<br>產生專屬網址，對方開啟後即刻銷毀。</p>
                </div>

                <div class="bm-form-group">
                    <textarea id="bm-msg" class="bm-input bm-textarea" placeholder="輸入你想保密的文字、密碼或告白..." maxlength="2000"></textarea>
                    <span class="bm-char-count" id="bm-counter">0 / 2000</span>
                </div>

                <div class="bm-form-group">
                    <input type="text" id="bm-pwd" class="bm-input" placeholder="🔒 設定解密密碼 (選填，留白則自動產金鑰)" maxlength="50">
                </div>

                <button id="bm-gen-btn" class="bm-btn bm-btn-primary">產生專屬加密連結</button>

                <div id="bm-result" class="bm-result-box">
                    <strong style="color: #166534; display: block; margin-bottom: 5px;">✅ 專屬網址已產生！</strong>
                    <span style="font-size: 0.9rem; color: #15803d;">請直接點擊下方網址複製，並傳送給對方：</span>
                    <input type="text" id="bm-link-fallback" class="bm-link-display" readonly title="點擊複製">
                </div>
            </div>

            <div id="bm-read-section" class="bm-hidden">
                <div class="bm-header">
                    <h3 class="bm-title" style="background: linear-gradient(135deg, #f43f5e, #fb923c); -webkit-background-clip: text;">🔥 收到機密訊息</h3>
                    <p class="bm-subtitle">此訊息為「閱後即焚」模式，請確認周遭安全。<br>一旦銷毀或重新整理，將永久無法復原。</p>
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

    // 密碼學引擎 (XOR + Base64)
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

    // 處理網址解析
    const hash = window.location.hash;
    let cipherData = { cipher: null, autoKey: null, needsPwd: false };

    if (hash.startsWith('#secret=')) {
        elements.createSec.classList.add('bm-hidden');
        elements.readSec.classList.remove('bm-hidden');

        const params = new URLSearchParams(hash.replace('#secret=', 'c='));
        cipherData.cipher = params.get('c');
        cipherData.autoKey = params.get('k');
        cipherData.needsPwd = !cipherData.autoKey;

        // 閱後即焚：讀取後立刻清空網址列的密文
        history.replaceState(null, null, window.location.pathname + window.location.search);

        if (cipherData.needsPwd) {
            elements.unlockArea.classList.remove('bm-hidden');
        } else {
            showSecret(cipherData.autoKey);
        }
    }

    // 產生加密連結
    elements.genBtn.addEventListener('click', () => {
        const text = elements.msgInput.value.trim();
        const pwd = elements.pwdInput.value.trim();
        if (!text) return alert('⚠️ 請先輸入你想保密的訊息！');

        const key = pwd || cryptoEngine.generateKey();
        const cipherText = cryptoEngine.encrypt(text, key);

        // 確保產生的網址是乾淨的根目錄，避免工具箱的 Router 產生衝突
        const currentUrl = window.location.origin + window.location.pathname;
        const shareLink = pwd
            ? `${currentUrl}#secret=${cipherText}`
            : `${currentUrl}#secret=${cipherText}&k=${key}`;

        elements.linkFallback.value = shareLink;
        elements.resultBox.style.display = 'block';
    });

    // 一鍵複製網址
    elements.linkFallback.addEventListener('click', function () {
        this.select();
        document.execCommand('copy');
        alert('✅ 專屬網址已複製！可以直接貼給朋友了。');
    });

    // 解鎖機制
    elements.unlockBtn.addEventListener('click', () => showSecret(elements.decryptPwdInput.value.trim()));
    elements.decryptPwdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') elements.unlockBtn.click(); });

    function showSecret(keyToTry) {
        if (!keyToTry) return;
        const decrypted = cryptoEngine.decrypt(cipherData.cipher, keyToTry);
        if (decrypted) {
            elements.unlockArea.classList.add('bm-hidden');
            elements.displayArea.classList.remove('bm-hidden');
            elements.decryptedText.innerHTML = decrypted.replace(/\n/g, '<br>');
        } else {
            elements.errorMsg.style.display = 'block';
            elements.decryptPwdInput.value = '';
        }
    }

    // 銷毀按鈕
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

    // 回到工具箱首頁
    elements.backBtn.addEventListener('click', () => {
        history.replaceState(null, null, window.location.pathname);
        window.location.reload();
    });
};
