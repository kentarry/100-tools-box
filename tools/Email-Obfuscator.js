window.render_emailObfuscator = function (targetContainer) {
    // 解決「工具尚未載入」與全域變數依賴：動態鎖定渲染容器，確保安全掛載
    const containerNode = targetContainer || (typeof container !== 'undefined' ? container : document.body);
    if (!containerNode) {
        console.error("錯誤：找不到可渲染的 DOM 容器。");
        return;
    }

    // 注入現代化且具吸引力的 CSS 樣式
    const styleId = 'email-obfuscator-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .eo-wrapper { max-width: 650px; margin: 2rem auto; padding: 30px; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); font-family: system-ui, -apple-system, sans-serif; transition: all 0.3s ease; border: 1px solid #f1f5f9; }
            .eo-header { text-align: center; margin-bottom: 25px; }
            .eo-title { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; }
            .eo-desc { color: #64748b; font-size: 0.95rem; line-height: 1.6; }
            .eo-form-group { margin-bottom: 18px; }
            .eo-label { display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 8px; }
            .eo-input { width: 100%; padding: 12px 16px; font-size: 1rem; color: #1e293b; border: 2px solid #e2e8f0; border-radius: 10px; outline: none; transition: all 0.2s ease; box-sizing: border-box; background: #f8fafc; }
            .eo-input:focus { border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
            .eo-row { display: flex; gap: 15px; flex-wrap: wrap; }
            .eo-col { flex: 1; min-width: 200px; }
            .eo-options { display: flex; gap: 20px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .eo-radio-label { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #475569; cursor: pointer; font-weight: 500; }
            .eo-radio-label input[type="radio"] { accent-color: #3b82f6; transform: scale(1.1); }
            .eo-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1rem; font-weight: bold; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
            .eo-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }
            .eo-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
            .eo-btn.success { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
            .eo-output-area { margin-top: 25px; animation: fadeIn 0.4s ease-out; display: none; }
            .eo-textarea { width: 100%; height: 110px; padding: 15px; border: 2px dashed #cbd5e1; border-radius: 10px; background: #f1f5f9; resize: vertical; font-family: 'Courier New', Courier, monospace; font-size: 0.9rem; color: #334155; box-sizing: border-box; line-height: 1.5; cursor: text; }
            .eo-textarea:focus { border-color: #94a3b8; outline: none; }
            .eo-preview-box { margin-top: 15px; padding: 16px; border-radius: 10px; background: #eff6ff; border: 1px solid #bfdbfe; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; }
            .eo-error { color: #ef4444; font-size: 0.85rem; margin-top: 6px; font-weight: 500; display: none; display: flex; align-items: center; gap: 4px; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            .shake-anim { animation: shake 0.3s ease-in-out; border-color: #ef4444 !important; background: #fef2f2 !important; }
        `;
        document.head.appendChild(style);
    }

    // 構建 HTML 結構 (同步渲染，移除不穩定的 setTimeout)
    containerNode.innerHTML = `
        <div class="eo-wrapper">
            <div class="eo-header">
                <h3 class="eo-title">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    終極 Email 防護混淆器
                </h3>
                <p class="eo-desc">將您的電子郵件地址轉換為安全的加密代碼。保護您的信箱免受垃圾信件機器人抓取，同時完美保持人類訪客的閱讀與點擊體驗。</p>
            </div>

            <div class="eo-form-group">
                <label class="eo-label" for="eo-email">✉️ 目標 Email 地址 <span style="color: #ef4444;">*</span></label>
                <input type="email" id="eo-email" class="eo-input" placeholder="例如：hello@example.com">
                <div id="eo-email-error" class="eo-error" style="display: none;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    請輸入有效的 Email 格式！
                </div>
            </div>

            <div class="eo-row">
                <div class="eo-col eo-form-group">
                    <label class="eo-label" for="eo-display">👁️ 網頁顯示文字 (選填)</label>
                    <input type="text" id="eo-display" class="eo-input" placeholder="留空則預設顯示 Email 本身，如：聯絡我們">
                </div>
                <div class="eo-col eo-form-group">
                    <label class="eo-label" for="eo-subject">📝 預設信件主旨 (選填)</label>
                    <input type="text" id="eo-subject" class="eo-input" placeholder="例如：網站業務合作洽詢">
                </div>
            </div>

            <div class="eo-form-group">
                <label class="eo-label">⚙️ 加密與混淆層級</label>
                <div class="eo-options">
                    <label class="eo-radio-label" title="將字元轉換為 HTML 實體編碼，相容性最高">
                        <input type="radio" name="eo-method" value="html" checked> 
                        標準防護 (HTML 實體)
                    </label>
                    <label class="eo-radio-label" title="使用 Base64 加密並透過 JavaScript 動態生成，防禦力最強">
                        <input type="radio" name="eo-method" value="js"> 
                        進階防護 (JS Base64 動態生成)
                    </label>
                </div>
            </div>

            <button id="eo-btn" class="eo-btn">✨ 產生安全代碼並複製</button>

            <div id="eo-output-area" class="eo-output-area">
                <label class="eo-label" for="eo-output">📋 轉換結果 (請貼入您的網站 HTML 中)</label>
                <textarea id="eo-output" class="eo-textarea" readonly></textarea>
                
                <div class="eo-preview-box">
                    <strong>即時預覽：</strong>
                    <span id="eo-preview"></span>
                </div>
            </div>
        </div>
    `;

    //  DOM 渲染完畢，立即綁定事件 (安全且同步)
    const emailInput = document.getElementById('eo-email');
    const subjectInput = document.getElementById('eo-subject');
    const displayInput = document.getElementById('eo-display');
    const btn = document.getElementById('eo-btn');
    const outputArea = document.getElementById('eo-output-area');
    const output = document.getElementById('eo-output');
    const preview = document.getElementById('eo-preview');
    const errorMsg = document.getElementById('eo-email-error');

    // Email 格式嚴格驗證
    const validateEmail = (email) => {
        return String(email).toLowerCase().match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    // 核心混淆邏輯：隨機混用十進位與十六進位 HTML 實體
    const toHtmlEntities = (str) => {
        let obfuscated = '';
        for (let i = 0; i < str.length; i++) {
            if (Math.random() > 0.5) {
                obfuscated += `&#${str.charCodeAt(i)};`;
            } else {
                obfuscated += `&#x${str.charCodeAt(i).toString(16)};`;
            }
        }
        return obfuscated;
    };

    // 處理產生與複製邏輯
    const handleGenerateAndCopy = () => {
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const display = displayInput.value.trim();
        const method = document.querySelector('input[name="eo-method"]:checked').value;

        // 1. 錯誤處理與提示動畫
        if (!email || !validateEmail(email)) {
            errorMsg.style.display = 'flex';
            emailInput.classList.add('shake-anim');
            setTimeout(() => emailInput.classList.remove('shake-anim'), 300);
            emailInput.focus();
            return;
        }

        // 重置錯誤狀態
        errorMsg.style.display = 'none';
        emailInput.classList.remove('shake-anim');

        // 2. 準備 Mailto 連結內容
        let mailtoLink = `mailto:${email}`;
        if (subject) {
            mailtoLink += `?subject=${encodeURIComponent(subject)}`;
        }
        const displayText = display || email;

        let finalCode = '';
        let previewHtml = '';

        // 3. 根據選擇的防護層級生成代碼
        if (method === 'html') {
            // 方法 A：HTML 實體編碼 (無 JavaScript 依賴)
            const obfLink = toHtmlEntities(mailtoLink);
            const obfDisplay = toHtmlEntities(displayText);
            finalCode = `<a href="${obfLink}">${obfDisplay}</a>`;
            previewHtml = `<a href="${mailtoLink}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${displayText}</a>`;
        } else {
            // 方法 B：JS Base64 動態生成 (對抗高階爬蟲)
            const base64Link = btoa(unescape(encodeURIComponent(mailtoLink)));
            const base64Display = btoa(unescape(encodeURIComponent(displayText)));

            finalCode = `<script>
    (function(){
        var a = atob('${base64Link}');
        var b = atob('${base64Display}');
        document.write('<a href="' + decodeURIComponent(escape(a)) + '">' + decodeURIComponent(escape(b)) + '</a>');
    })();
</script><noscript>請啟用 JavaScript 以檢視 Email</noscript>`;

            previewHtml = `<a href="${mailtoLink}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${displayText}</a> <span style="font-size: 0.8rem; color: #10b981; padding: 2px 6px; background: #d1fae5; border-radius: 4px; margin-left: 8px;">JS 動態保護啟動</span>`;
        }

        // 4. 顯示結果介面
        outputArea.style.display = 'block';
        output.value = finalCode;
        preview.innerHTML = previewHtml;

        // 5. 執行複製操作 (優先使用現代 Clipboard API，降級相容 execCommand)
        const copyToClipboard = async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(finalCode);
                } else {
                    output.select();
                    document.execCommand('copy');
                }
                showSuccessState();
            } catch (err) {
                console.error('複製失敗:', err);
                btn.innerHTML = "❌ 複製失敗，請手動全選複製";
            }
        };

        copyToClipboard();
    };

    // 成功狀態 UI 切換
    const showSuccessState = () => {
        const originalText = btn.innerHTML;
        btn.classList.add('success');
        btn.innerHTML = "✅ 代碼已生成並成功複製！";
        setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = originalText;
        }, 2500);
    };

    // 綁定事件監聽器
    btn.addEventListener('click', handleGenerateAndCopy);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGenerateAndCopy();
    });
};