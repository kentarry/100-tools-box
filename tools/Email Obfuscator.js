window.render_emailObfuscator = function () {
    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">🛡️ Email 防搜刮混淆器</h3>
            <p style="color: #64748b; margin-bottom: 20px; font-size: 0.9rem;">將 Email 轉為 HTML 實體字元。貼在個人網站原始碼中，可防止被垃圾信機器人抓取，但人類在網頁上依然能正常閱讀。</p>
            <input type="email" id="emailInput" placeholder="例如：hello@example.com" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 8px;">
            <button id="emailBtn" style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">一鍵混淆並複製</button>
            <textarea id="emailOutput" readonly placeholder="轉換後的 HTML 代碼會顯示在這裡..." style="width: 100%; height: 100px; margin-top: 15px; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; resize: none;"></textarea>
            <div id="emailPreview" style="margin-top: 10px; font-size: 0.9rem; color: #475569;"></div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('emailInput');
        const btn = document.getElementById('emailBtn');
        const output = document.getElementById('emailOutput');
        const preview = document.getElementById('emailPreview');

        btn.addEventListener('click', () => {
            const email = input.value.trim();
            if (!email) return;

            let obfuscated = '';
            for (let i = 0; i < email.length; i++) {
                // 隨機決定要用 10進位 還是 16進位 的 HTML 實體，增加混淆度
                if (Math.random() > 0.5) {
                    obfuscated += `&#${email.charCodeAt(i)};`;
                } else {
                    obfuscated += `&#x${email.charCodeAt(i).toString(16)};`;
                }
            }

            output.value = `<a href="mailto:${obfuscated}">${obfuscated}</a>`;
            preview.innerHTML = `網頁顯示預覽：<a href="mailto:${obfuscated}" style="color: #3b82f6;">${obfuscated}</a>`;

            output.select();
            document.execCommand('copy');
            btn.textContent = "✅ 已轉換並複製到剪貼簿！";
            setTimeout(() => btn.textContent = "一鍵混淆並複製", 2000);
        });
    }, 0);
};