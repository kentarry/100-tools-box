window.render_pwdChecker = function () {
    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">🔒 密碼外洩本機檢查器</h3>
            <p style="color: #64748b; margin-bottom: 20px; font-size: 0.9rem;">輸入密碼後，系統會在本機計算 SHA-1 雜湊值，只將「前5碼」送至資料庫比對。您的真實密碼絕對不會離開這台設備。</p>
            <input type="password" id="pwdInput" placeholder="請輸入要測試的密碼" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px;">
            <button id="pwdCheckBtn" style="width: 100%; padding: 12px; background: #334155; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">檢查是否外洩</button>
            <div id="pwdResult" style="margin-top: 20px; padding: 15px; border-radius: 8px; display: none; font-weight: bold; text-align: center;"></div>
        </div>
    `;

    setTimeout(() => {
        const btn = document.getElementById('pwdCheckBtn');
        const input = document.getElementById('pwdInput');
        const resultDiv = document.getElementById('pwdResult');

        async function sha1(str) {
            const buffer = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest('SHA-1', buffer);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        }

        btn.addEventListener('click', async () => {
            const pwd = input.value;
            if (!pwd) return alert('請輸入密碼');

            btn.textContent = "檢查中...";
            btn.disabled = true;

            try {
                const hash = await sha1(pwd);
                const prefix = hash.slice(0, 5);
                const suffix = hash.slice(5);

                const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
                const data = await response.text();

                const lines = data.split('\n');
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
                    resultDiv.style.background = '#fee2e2';
                    resultDiv.style.color = '#ef4444';
                    resultDiv.innerHTML = `⚠️ 警告！此密碼曾被外洩過 <span>${leakCount.toLocaleString()}</span> 次，請立即更換！`;
                } else {
                    resultDiv.style.background = '#dcfce7';
                    resultDiv.style.color = '#22c55e';
                    resultDiv.innerHTML = `✅ 安全！此密碼未在已知的外洩資料庫中發現。`;
                }
            } catch (err) {
                alert('網路錯誤，請稍後再試。');
            } finally {
                btn.textContent = "檢查是否外洩";
                btn.disabled = false;
            }
        });
    }, 0);
};