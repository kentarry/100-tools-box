window.render_pwdChecker = function () {
    // 確保有 container 可以渲染，若無則建立提示
    if (typeof container === 'undefined' || !container) {
        console.error("找不到 container 元素，工具 [密碼外洩檢查器] 尚未載入！");
        return;
    }

    // 注入現代化 UI 與 CSS
    container.innerHTML = `
        <style>
            .pwd-card { max-width: 500px; margin: 2rem auto; padding: 2.5rem 2rem; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); font-family: system-ui, -apple-system, sans-serif; }
            .pwd-header { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 1rem; color: #1e293b; }
            .pwd-title { margin: 0; font-size: 1.5rem; font-weight: 700; }
            .pwd-desc { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; text-align: center; }
            .pwd-input-group { position: relative; margin-bottom: 0.5rem; }
            .pwd-input { width: 100%; padding: 16px 50px 16px 20px; font-size: 1.05rem; border: 2px solid #e2e8f0; border-radius: 12px; transition: all 0.2s; box-sizing: border-box; background: #f8fafc; color: #334155; }
            .pwd-input:focus { outline: none; border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
            .pwd-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 5px; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
            .pwd-toggle:hover { color: #3b82f6; }
            .pwd-strength { margin-bottom: 1.5rem; display: none; animation: fadeIn 0.3s; }
            .pwd-strength-bars { display: flex; gap: 6px; margin-bottom: 8px; }
            .pwd-strength-bar { height: 6px; flex: 1; border-radius: 3px; background: #e2e8f0; transition: all 0.3s ease; }
            .pwd-strength-text { font-size: 0.85rem; color: #64748b; text-align: right; font-weight: 500; }
            .pwd-btn { width: 100%; padding: 16px; font-size: 1.1rem; font-weight: 600; color: white; background: #3b82f6; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
            .pwd-btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
            .pwd-btn:active { transform: translateY(0); }
            .pwd-btn:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; box-shadow: none; color: #64748b; }
            .pwd-result { margin-top: 1.5rem; padding: 1.25rem; border-radius: 12px; display: none; text-align: center; font-weight: 600; line-height: 1.5; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .result-safe { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
            .result-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
            .danger-number { font-size: 1.2rem; color: #dc2626; font-weight: 800; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .spinner { animation: spin 1s linear infinite; display: none; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
        </style>
        
        <div class="pwd-card">
            <div class="pwd-header">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h3 class="pwd-title">密碼安全與外洩檢查</h3>
            </div>
            <p class="pwd-desc">
                採用最高隱私標準：系統只會在本機進行加密，僅傳送「<b>前 5 碼</b>」至安全資料庫比對。<br>您的真實密碼<b>絕對不會</b>外流。
            </p>
            
            <div class="pwd-input-group">
                <input type="password" id="pwdInput" class="pwd-input" placeholder="請輸入要測試的密碼">
                <button type="button" id="pwdToggleBtn" class="pwd-toggle" title="顯示/隱藏密碼">
                    <svg id="eyeIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </div>

            <div id="pwdStrength" class="pwd-strength">
                <div class="pwd-strength-bars">
                    <div class="pwd-strength-bar" id="bar1"></div>
                    <div class="pwd-strength-bar" id="bar2"></div>
                    <div class="pwd-strength-bar" id="bar3"></div>
                    <div class="pwd-strength-bar" id="bar4"></div>
                </div>
                <div class="pwd-strength-text" id="strengthText">請輸入密碼</div>
            </div>

            <button id="pwdCheckBtn" class="pwd-btn">
                <svg class="spinner" id="btnSpinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                <span id="btnText">立即檢查安全狀態</span>
            </button>
            
            <div id="pwdResult" class="pwd-result"></div>
        </div>
    `;

    setTimeout(() => {
        const btn = document.getElementById('pwdCheckBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const input = document.getElementById('pwdInput');
        const toggleBtn = document.getElementById('pwdToggleBtn');
        const eyeIcon = document.getElementById('eyeIcon');
        const resultDiv = document.getElementById('pwdResult');

        // 密碼強度相關元素
        const strengthDiv = document.getElementById('pwdStrength');
        const bars = [
            document.getElementById('bar1'),
            document.getElementById('bar2'),
            document.getElementById('bar3'),
            document.getElementById('bar4')
        ];
        const strengthText = document.getElementById('strengthText');

        // 顯示/隱藏密碼切換
        let isPasswordVisible = false;
        toggleBtn.addEventListener('click', () => {
            isPasswordVisible = !isPasswordVisible;
            input.type = isPasswordVisible ? 'text' : 'password';
            eyeIcon.innerHTML = isPasswordVisible
                ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
                : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        });

        // 密碼強度檢測邏輯
        input.addEventListener('input', () => {
            const pwd = input.value;
            resultDiv.style.display = 'none';

            if (pwd.length === 0) {
                strengthDiv.style.display = 'none';
                return;
            }

            strengthDiv.style.display = 'block';
            let score = 0;
            if (pwd.length >= 8) score++;
            if (/(?=.*[a-z])(?=.*[A-Z])/.test(pwd)) score++;
            if (/(?=.*\d)/.test(pwd)) score++;
            if (/(?=.*[\W_])/.test(pwd)) score++;

            // 重置所有 bar 顏色
            bars.forEach(bar => bar.style.background = '#e2e8f0');

            // 根據分數上色
            const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
            const labels = ['極度脆弱 ⚠️', '普通 (建議加入數字與符號)', '良好 (還差一點點)', '極佳 (非常安全) 🛡️'];

            const effectiveScore = score === 0 ? 1 : score;

            for (let i = 0; i < effectiveScore; i++) {
                bars[i].style.background = colors[effectiveScore - 1];
            }
            strengthText.textContent = labels[effectiveScore - 1];
            strengthText.style.color = colors[effectiveScore - 1];
        });

        // 支援 Enter 鍵送出
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btn.click();
            }
        });

        // SHA-1 雜湊函數
        async function sha1(str) {
            const buffer = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest('SHA-1', buffer);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        }

        // 主要檢查邏輯
        btn.addEventListener('click', async () => {
            const pwd = input.value;
            if (!pwd) {
                input.focus();
                return;
            }

            // 按鈕載入狀態
            btn.disabled = true;
            btnText.textContent = "資料庫比對中...";
            btnSpinner.style.display = "inline-block";
            resultDiv.style.display = 'none';
            resultDiv.className = 'pwd-result';

            try {
                const hash = await sha1(pwd);
                const prefix = hash.slice(0, 5);
                const suffix = hash.slice(5);

                // 【已修正】這裡移除了多餘的反斜線，讓 prefix 可以正確代入
                const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

                if (!response.ok) throw new Error('API 請求失敗');
                const data = await response.text();

                const lines = data.split('\n'); // 【已修正】也移除了換行符號多餘的反斜線
                let isLeaked = false;
                let leakCount = 0;

                for (let line of lines) {
                    const [hashSuffix, count] = line.split(':');
                    if (hashSuffix.trim() === suffix) {
                        isLeaked = true;
                        leakCount = parseInt(count);
                        break;
                    }
                }

                resultDiv.style.display = 'block';
                if (isLeaked) {
                    resultDiv.classList.add('result-danger');
                    // 【已修正】這裡移除了 leakCount 前面的反斜線
                    resultDiv.innerHTML = `
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">🚨 警告！密碼已外洩</div>
                        此密碼在已知的外洩資料庫中出現過 <span class="danger-number">${leakCount.toLocaleString()}</span> 次。<br>
                        <span style="font-size: 0.9rem; font-weight: 400; color: #7f1d1d; display: inline-block; margin-top: 8px;">駭客極可能已將此密碼加入字典檔，請立即更換！</span>
                    `;
                } else {
                    resultDiv.classList.add('result-safe');
                    resultDiv.innerHTML = `
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">✅ 恭喜！密碼安全</div>
                        此密碼目前<b>未在</b>已知的外洩紀錄中被發現。<br>
                        <span style="font-size: 0.9rem; font-weight: 400; color: #14532d; display: inline-block; margin-top: 8px;">請繼續保持良好的密碼使用習慣。</span>
                    `;
                }
            } catch (err) {
                console.error(err);
                resultDiv.style.display = 'block';
                resultDiv.classList.add('result-danger');
                resultDiv.innerHTML = "❌ 網路連線異常，請檢查您的網路狀態後重試。";
            } finally {
                // 恢復按鈕狀態
                btn.disabled = false;
                btnText.textContent = "立即檢查安全狀態";
                btnSpinner.style.display = "none";
            }
        });
    }, 0);
};