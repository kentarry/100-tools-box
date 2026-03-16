window.render_vatChecker = function () {
    container.innerHTML = `
        <style>
            .vat-wrapper {
                max-width: 800px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }
            /* Hero */
            .vat-hero {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
                color: white;
                box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
            }
            .vat-hero::before {
                content: '';
                position: absolute;
                top: -50%; right: -10%;
                width: 300px; height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
                border-radius: 50%;
            }
            .vat-hero h2 {
                font-size: 28px; font-weight: 800; margin: 0 0 8px 0; position: relative; z-index: 1;
            }
            .vat-hero p {
                color: #bfdbfe; font-size: 15px; margin: 0; position: relative; z-index: 1; line-height: 1.6;
            }

            /* Tabs */
            .vat-tabs {
                display: flex; background: #f1f5f9; border-radius: 16px; padding: 6px; margin-bottom: 24px;
            }
            .vat-tab {
                flex: 1; text-align: center; padding: 12px; font-weight: 700; color: #64748b;
                border-radius: 12px; cursor: pointer; transition: all 0.3s;
            }
            .vat-tab.active {
                background: #fff; color: #1d4ed8; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            /* Panels */
            .vat-panel { display: none; animation: animateFade 0.4s ease; }
            .vat-panel.active { display: block; }
            @keyframes animateFade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            /* Card */
            .vat-card {
                background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            }

            /* Input */
            .vat-input-group { position: relative; margin-bottom: 24px; }
            .vat-input {
                width: 100%; padding: 20px; border: 3px solid #e2e8f0; border-radius: 16px;
                font-size: 32px; font-weight: 900; text-align: center; color: #1e293b;
                outline: none; letter-spacing: 12px; transition: border-color 0.3s;
                background: #f8fafc; font-family: monospace; box-sizing: border-box;
            }
            .vat-input:focus { border-color: #3b82f6; background: #fff; }
            .vat-input::placeholder { font-size: 18px; letter-spacing: 2px; font-weight: 600; color: #cbd5e1; }

            /* Buttons */
            .vat-btn {
                width: 100%; padding: 16px; border: none; border-radius: 16px;
                font-size: 18px; font-weight: 800; color: #fff; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex; justify-content: center; align-items: center; gap: 8px; box-sizing: border-box;
            }
            .vat-btn-primary {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
            }
            .vat-btn-primary:active { transform: scale(0.98); }
            .vat-btn-primary:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }

            .vat-btn-secondary {
                background: linear-gradient(135deg, #059669, #047857);
                box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
            }
            .vat-btn-secondary:active { transform: scale(0.98); }

            /* Results */
            .vat-result-box {
                margin-top: 24px; padding: 24px; border-radius: 16px; border: 2px solid transparent; text-align: center;
                display: none; box-sizing: border-box;
            }
            .vat-result-box.success { display: block; background: #f0fdf4; border-color: #bbf7d0; }
            .vat-result-box.error { display: block; background: #fff1f2; border-color: #fecdd3; }
            .vat-res-icon { font-size: 48px; margin-bottom: 12px; }
            .vat-res-title { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
            .vat-res-desc { font-size: 15px; font-weight: 600; }
            .vat-result-box.success .vat-res-title { color: #166534; }
            .vat-result-box.success .vat-res-desc { color: #15803d; }
            .vat-result-box.error .vat-res-title { color: #9f1239; }
            .vat-result-box.error .vat-res-desc { color: #be123c; }

            /* Company Info */
            .vat-company-info {
                margin-top: 20px; text-align: left; background: #fff; border-radius: 12px;
                padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
            }
            .vat-info-row {
                display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; gap: 12px;
            }
            .vat-info-row:last-child { border-bottom: none; padding-bottom: 0; }
            .vat-info-label { color: #64748b; font-size: 14px; font-weight: 600; flex-shrink: 0; }
            .vat-info-val { color: #1e293b; font-size: 15px; font-weight: 800; text-align: right; word-break: break-word; }

            /* Loading spinner */
            .vat-spinner {
                display: inline-block; width: 24px; height: 24px;
                border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%; border-top-color: #fff;
                animation: vatSpin 1s ease-in-out infinite;
            }
            @keyframes vatSpin { to { transform: rotate(360deg); } }
            
            /* Gen Result */
            .vat-gen-result {
                margin-top: 24px; font-size: 48px; font-weight: 900; text-align: center;
                letter-spacing: 12px; color: #1d4ed8; font-family: monospace;
                background: #eff6ff; padding: 32px 20px; border-radius: 16px; border: 2px dashed #bfdbfe;
                box-sizing: border-box; overflow-wrap: break-word;
            }
            .vat-copy-btn {
                margin-top: 16px; width: 100%; padding: 12px; border-radius: 12px;
                background: #f1f5f9; color: #475569; font-weight: 700; border: none; cursor: pointer;
                transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box;
            }
            .vat-copy-btn:hover { background: #e2e8f0; color: #0f172a; }
            .vat-btn-copy-small {
                background: #f1f5f9; border: none; border-radius: 6px; padding: 6px; cursor: pointer; color: #64748b; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
            }
            .vat-btn-copy-small:hover { background: #e2e8f0; color: #0f172a; }

            /* Footer source */
            .vat-source {
                margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600;
            }
            .vat-source a { color: #3b82f6; text-decoration: none; }
            
            /* Search Results */
            .vat-search-results {
                margin-top: 24px; display: flex; flex-direction: column; gap: 16px;
                max-height: 500px; overflow-y: auto; padding-right: 8px;
            }
            .vat-search-results::-webkit-scrollbar { width: 6px; }
            .vat-search-results::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .vat-search-item {
                background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;
                position: relative; overflow: hidden;
            }
            .vat-search-item:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #cbd5e1; }
            .vat-search-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
            .vat-search-item.status-active::before { background: #10b981; }
            .vat-search-item.status-inactive::before { background: #ef4444; }
            .vat-search-item.status-other::before { background: #f59e0b; }
            
            .vat-si-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 12px; }
            .vat-si-name { font-size: 18px; font-weight: 800; color: #1e293b; line-height: 1.4; }
            .vat-si-status { font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px; white-space: nowrap; }
            .vat-si-status.active { background: #d1fae5; color: #047857; }
            .vat-si-status.inactive { background: #fee2e2; color: #b91c1c; }
            .vat-si-status.other { background: #fef3c7; color: #b45309; }
            
            .vat-si-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
            .vat-si-cell { display: flex; flex-direction: column; gap: 4px; }
            .vat-si-label { font-size: 12px; color: #64748b; font-weight: 600; }
            .vat-si-value { font-size: 14px; font-weight: 700; color: #334155; }
            .vat-si-value.highlight { color: #2563eb; }
            
        </style>

        <div class="vat-wrapper">
            <div class="vat-hero">
                <h2>🏢 公司統編查詢與驗證</h2>
                <p>專業商業資料庫演算法校驗・串接政府開放資料即時查詢公司登記</p>
            </div>

            <div class="vat-tabs">
                <div class="vat-tab active" data-tab="validate">驗證與查詢</div>
                <div class="vat-tab" data-tab="search">公司名稱查詢</div>
                <div class="vat-tab" data-tab="generate">隨機產生器</div>
            </div>

            <!-- Tab 1: Validate -->
            <div class="vat-panel active" id="vatPanelValidate">
                <div class="vat-card">
                    <div class="vat-input-group">
                        <input type="text" id="vatInput" class="vat-input" placeholder="請輸入8碼統編" maxlength="8" inputmode="numeric">
                    </div>
                    <button id="vatCheckBtn" class="vat-btn vat-btn-primary" disabled>
                        <span>立即驗證與查詢</span>
                    </button>

                    <div id="vatResultBox" class="vat-result-box">
                        <div id="vatResIcon" class="vat-res-icon"></div>
                        <div id="vatResTitle" class="vat-res-title"></div>
                        <div id="vatResDesc" class="vat-res-desc"></div>
                        <div id="vatCompanyInfo" class="vat-company-info" style="display:none;"></div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Generate -->
            <div class="vat-panel" id="vatPanelGenerate">
                <div class="vat-card">
                    <p style="color: #64748b; font-weight: 600; text-align: center; margin-bottom: 24px; line-height: 1.6;">
                        專為開發與測試人員設計。<br>一鍵產生符合數學邏輯檢核法則的隨機統編，適用系統平台測試。
                    </p>
                    <button id="vatGenBtn" class="vat-btn vat-btn-secondary">
                        <span>🎲 隨機產生測試統編</span>
                    </button>
                    
                    <div id="vatGenOutputArea" style="display: none;">
                        <div id="vatGenResult" class="vat-gen-result"></div>
                        <button id="vatCopyBtn" class="vat-copy-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            <span>複製統編</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Search -->
            <div class="vat-panel" id="vatPanelSearch">
                <div class="vat-card">
                    <div class="vat-input-group">
                        <input type="text" id="vatSearchInput" class="vat-input" placeholder="請輸入公司名稱關鍵字" style="font-size: 22px; letter-spacing: 2px; text-align: left; padding-left: 24px;">
                    </div>
                    <button id="vatSearchBtn" class="vat-btn vat-btn-primary" disabled>
                        <span>🔍 搜尋公司統編</span>
                    </button>

                    <div id="vatSearchResultBox" class="vat-result-box">
                        <div id="vatSearchIcon" class="vat-res-icon"></div>
                        <div id="vatSearchTitle" class="vat-res-title"></div>
                        <div id="vatSearchDesc" class="vat-res-desc"></div>
                    </div>
                    
                    <div id="vatSearchResultsArea" class="vat-search-results" style="display:none;"></div>
                </div>
            </div>

            <div class="vat-source">
                統編驗證邏輯遵循 財政部財政資訊中心 規範<br>
                資料來源 API：<a href="https://g0v.tw" target="_blank">g0v 台灣零時政府資料中心</a>
            </div>
        </div>
    `;

    setTimeout(() => {
        // UI Elements
        const tabs = document.querySelectorAll('.vat-tab');
        const panels = document.querySelectorAll('.vat-panel');

        const vatInput = document.getElementById('vatInput');
        const vatCheckBtn = document.getElementById('vatCheckBtn');
        const vatResultBox = document.getElementById('vatResultBox');
        const vatResIcon = document.getElementById('vatResIcon');
        const vatResTitle = document.getElementById('vatResTitle');
        const vatResDesc = document.getElementById('vatResDesc');
        const vatCompanyInfo = document.getElementById('vatCompanyInfo');

        const vatGenBtn = document.getElementById('vatGenBtn');
        const vatGenOutputArea = document.getElementById('vatGenOutputArea');
        const vatGenResult = document.getElementById('vatGenResult');
        const vatCopyBtn = document.getElementById('vatCopyBtn');

        const vatSearchInput = document.getElementById('vatSearchInput');
        const vatSearchBtn = document.getElementById('vatSearchBtn');
        const vatSearchResultBox = document.getElementById('vatSearchResultBox');
        const vatSearchIcon = document.getElementById('vatSearchIcon');
        const vatSearchTitle = document.getElementById('vatSearchTitle');
        const vatSearchDesc = document.getElementById('vatSearchDesc');
        const vatSearchResultsArea = document.getElementById('vatSearchResultsArea');

        // Tab Switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.tab === 'validate') {
                    document.getElementById('vatPanelValidate').classList.add('active');
                    setTimeout(() => vatInput.focus(), 50);
                } else if (tab.dataset.tab === 'search') {
                    document.getElementById('vatPanelSearch').classList.add('active');
                    setTimeout(() => vatSearchInput.focus(), 50);
                } else {
                    document.getElementById('vatPanelGenerate').classList.add('active');
                }
            });
        });

        // Input Constraints
        vatInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            e.target.value = val;
            vatCheckBtn.disabled = val.length !== 8;
            vatResultBox.className = 'vat-result-box'; // reset
            vatResultBox.style.display = 'none';
        });

        // Validation Logic (財政部公式)
        function isValidVAT(vat) {
            if (!/^\d{8}$/.test(vat)) return false;
            const multipliers = [1, 2, 1, 2, 1, 2, 4, 1];
            let sum = 0;
            for (let i = 0; i < 8; i++) {
                let step = parseInt(vat[i]) * multipliers[i];
                sum += Math.floor(step / 10) + (step % 10);
            }
            if (sum % 10 === 0) return true;
            if (vat[6] === '7' && (sum + 1) % 10 === 0) return true;
            return false;
        }

        // Generator Logic
        function generateVAT() {
            while (true) {
                let vat = '';
                for (let i = 0; i < 8; i++) {
                    vat += Math.floor(Math.random() * 10).toString();
                }
                if (isValidVAT(vat)) return vat;
            }
        }

        vatGenBtn.addEventListener('click', () => {
            const newVat = generateVAT();
            vatGenResult.textContent = newVat;
            vatGenOutputArea.style.display = 'block';
            vatCopyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>複製統編</span>`;
        });

        vatCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(vatGenResult.textContent).then(() => {
                vatCopyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:#059669;">已複製！</span>`;
            });
        });

        // Safe fetch with proxy fallbacks for GitHub Pages compatibility
        async function fetchCompanyData(vat) {
            const getSignal = () => {
                if (window.AbortSignal && AbortSignal.timeout) return AbortSignal.timeout(6000);
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 6000);
                return controller.signal;
            };

            const endpoints = [
                `https://company.g0v.ronny.tw/api/show/${vat}`,
                `https://api.allorigins.win/raw?url=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/show/${vat}`),
                `https://api.codetabs.com/v1/proxy?quest=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/show/${vat}`),
                `https://corsproxy.io/?` + encodeURIComponent(`https://company.g0v.ronny.tw/api/show/${vat}`)
            ];

            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { signal: getSignal() });
                    if (!res.ok) continue;
                    const json = await res.json();
                    if (json && json.data) {
                        return json.data;
                    }
                } catch (e) {
                    continue; // try next proxy
                }
            }
            return null; // all failed
        }

        // Format Currency
        function formatMoney(numStr) {
            // Handle if undefined or object
            if (!numStr || typeof numStr !== 'string' && typeof numStr !== 'number') return numStr;
            const num = parseInt(numStr.toString().replace(/,/g, ''));
            if (isNaN(num)) return numStr;
            return '$' + num.toLocaleString('zh-TW');
        }

        // Search Button Action
        vatCheckBtn.addEventListener('click', async () => {
            const vat = vatInput.value;
            if (vat.length !== 8) return;

            // 1. Math check
            const isValid = isValidVAT(vat);

            if (!isValid) {
                vatResultBox.className = 'vat-result-box error';
                vatResultBox.style.display = 'block';
                vatResIcon.textContent = '❌';
                vatResTitle.textContent = '統編邏輯驗證失敗';
                vatResDesc.textContent = '此為無效的統編格式，請檢查是否輸入錯誤。';
                vatCompanyInfo.style.display = 'none';
                return; // Failed math completely
            }

            // Valid math -> true format, proceed to fetch
            vatResultBox.className = 'vat-result-box success';
            vatResultBox.style.display = 'block';
            vatResIcon.innerHTML = '<div class="vat-spinner" style="border-color: rgba(21, 128, 61, 0.2); border-top-color: #15803d; width: 48px; height: 48px; border-width: 4px;"></div>';
            vatResTitle.textContent = '✅ 邏輯格式正確';
            vatResDesc.textContent = '正在連線開放資料中心查詢公司登記資訊...';
            vatCompanyInfo.innerHTML = '';
            vatCompanyInfo.style.display = 'none';
            vatCheckBtn.disabled = true;

            // 2. Fetch API
            const compData = await fetchCompanyData(vat);

            vatCheckBtn.disabled = false;

            // Update UI after fetch completes
            vatResIcon.textContent = '✅';

            if (compData) {
                let compName = compData['公司名稱'] || compData['商業名稱'] || compData['營業人名稱'] || '（無名稱紀錄）';
                let status = compData['公司狀況'] || compData['商業狀況'] || compData['營業狀況'] || '-';
                let capital = compData['資本總額(元)'] || compData['實收資本額(元)'] || compData['資本額(元)'] || '-';
                if (capital !== '-') capital = formatMoney(capital);
                let rep = compData['代表人姓名'] || compData['負責人姓名'] || '-';
                let address = compData['公司所在地'] || compData['地址'] || '-';

                vatCompanyInfo.innerHTML = `
                    <div class="vat-info-row"><span class="vat-info-label">公司名稱</span><span class="vat-info-val" style="color:#2563eb;">${compName}</span></div>
                    <div class="vat-info-row"><span class="vat-info-label">營業狀況</span><span class="vat-info-val">${status}</span></div>
                    <div class="vat-info-row"><span class="vat-info-label">負責人</span><span class="vat-info-val">${rep}</span></div>
                    <div class="vat-info-row"><span class="vat-info-label">資本額</span><span class="vat-info-val">${capital}</span></div>
                    <div class="vat-info-row"><span class="vat-info-label">登記地址</span><span class="vat-info-val" style="font-size:13px; font-weight:600;">${address}</span></div>
                `;
                vatCompanyInfo.style.display = 'block';
                vatResDesc.textContent = '此統編符合政府規範，且已查到以下登記資料：';
            } else {
                vatResDesc.textContent = '此統編符合政府規範。';
                vatCompanyInfo.innerHTML = `
                    <div style="text-align:center; padding: 10px; color: #64748b; font-size: 14px; font-weight: 600;">
                        ⚠ 網際網路連線受限，或該統編非結業公開公司，目前無法顯示詳細資訊。
                    </div>
                `;
                vatCompanyInfo.style.display = 'block';
            }
        });

        // Trigger check on Enter key for Validator
        vatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !vatCheckBtn.disabled) {
                vatCheckBtn.click();
            }
        });

        // Search Input Constraints
        vatSearchInput.addEventListener('input', (e) => {
            vatSearchBtn.disabled = e.target.value.trim().length === 0;
            vatSearchResultBox.className = 'vat-result-box';
            vatSearchResultBox.style.display = 'none';
            vatSearchResultsArea.style.display = 'none';
        });

        // Trigger search on Enter key for Searcher
        vatSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !vatSearchBtn.disabled) {
                vatSearchBtn.click();
            }
        });

        // Delegate copy clicks in the search results
        vatSearchResultsArea.addEventListener('click', (e) => {
            const btn = e.target.closest('.vat-btn-copy-small');
            if (!btn) return;
            const vatToCopy = btn.dataset.vat;
            if (vatToCopy && vatToCopy !== '無資料') {
                navigator.clipboard.writeText(vatToCopy).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => btn.innerHTML = originalHTML, 2000);
                });
            }
        });

        // Safe fetch for Search API
        async function fetchCompanySearch(keyword) {
            const getSignal = () => {
                if (window.AbortSignal && AbortSignal.timeout) return AbortSignal.timeout(8000);
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 8000);
                return controller.signal;
            };

            const encodedQuery = encodeURIComponent(keyword);
            const endpoints = [
                `https://company.g0v.ronny.tw/api/search?q=${encodedQuery}`,
                `https://api.allorigins.win/raw?url=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${encodedQuery}`),
                `https://api.codetabs.com/v1/proxy?quest=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${encodedQuery}`),
                `https://corsproxy.io/?` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${encodedQuery}`)
            ];

            for (const url of endpoints) {
                try {
                    const res = await fetch(url, { signal: getSignal() });
                    if (!res.ok) continue;
                    const json = await res.json();
                    if (json && json.data) {
                        return json.data;
                    }
                } catch (e) {
                    continue;
                }
            }
            return null;
        }

        // Handle Search Button Click
        vatSearchBtn.addEventListener('click', async () => {
            const keyword = vatSearchInput.value.trim();
            if (!keyword) return;

            vatSearchResultBox.className = 'vat-result-box success';
            vatSearchResultBox.style.display = 'block';
            vatSearchIcon.innerHTML = '<div class="vat-spinner" style="border-color: rgba(21, 128, 61, 0.2); border-top-color: #15803d; width: 48px; height: 48px; border-width: 4px;"></div>';
            vatSearchTitle.textContent = '搜尋中...';
            vatSearchDesc.textContent = '正在連線開放資料中心查詢相符的公司...';
            vatSearchResultsArea.innerHTML = '';
            vatSearchResultsArea.style.display = 'none';
            vatSearchBtn.disabled = true;

            const results = await fetchCompanySearch(keyword);

            vatSearchBtn.disabled = false;

            if (!results) {
                vatSearchResultBox.className = 'vat-result-box error';
                vatSearchIcon.textContent = '❌';
                vatSearchTitle.textContent = '連線失敗或無伺服器回應';
                vatSearchDesc.textContent = '網際網路連線受限，請稍後再試。';
                return;
            }

            if (results.length === 0) {
                vatSearchResultBox.className = 'vat-result-box error';
                vatSearchIcon.textContent = '🔍';
                vatSearchTitle.textContent = '找不到相符公司';
                vatSearchDesc.textContent = `沒有找到名稱包含「${keyword}」的公司，請嘗試其他關鍵字。`;
                return;
            }

            // Successfully fetched data
            vatSearchIcon.textContent = '✅';
            vatSearchTitle.textContent = `找到 ${results.length} 筆結果`;
            vatSearchDesc.textContent = '以下是符合關鍵字的公司登記資料：';

            let htmlArr = [];
            results.forEach(comp => {
                let compName = comp['公司名稱'] || comp['商業名稱'] || comp['營業人名稱'] || '（無名稱紀錄）';
                let vatNum = comp['統一編號'] || '無資料';
                let status = comp['公司狀況'] || comp['商業狀況'] || comp['營業狀況'] || comp['登記現況'] || comp['現況'] || '-';

                let capital = comp['資本總額(元)'] || comp['實收資本額(元)'] || comp['資本額(元)'] || comp['出資額(元)'] || '-';
                if (capital !== '-') capital = formatMoney(capital);

                let rep = comp['代表人姓名'] || comp['負責人姓名'] || '-';
                let address = comp['公司所在地'] || comp['地址'] || '-';

                // formatting status pill color
                let statusClass = 'other';
                if (status.includes('核准') || status.includes('營業中') || status.includes('存續')) {
                    statusClass = 'active';
                } else if (status.includes('解散') || status.includes('歇業') || status.includes('廢止') || status.includes('撤銷') || status.includes('停業')) {
                    statusClass = 'inactive';
                }

                htmlArr.push(`
                    <div class="vat-search-item status-${statusClass}">
                        <div class="vat-si-header">
                            <div class="vat-si-name">${compName}</div>
                            <div class="vat-si-status ${statusClass}">${status}</div>
                        </div>
                        <div class="vat-si-grid">
                            <div class="vat-si-cell">
                                <span class="vat-si-label">統一編號</span>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="vat-si-value highlight" style="font-family: monospace; font-size: 16px;">${vatNum}</span>
                                    ${vatNum !== '無資料' ? `<button class="vat-btn-copy-small" data-vat="${vatNum}" title="複製統編">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>` : ''}
                                </div>
                            </div>
                            <div class="vat-si-cell">
                                <span class="vat-si-label">負責人</span>
                                <span class="vat-si-value">${rep}</span>
                            </div>
                            <div class="vat-si-cell">
                                <span class="vat-si-label">資本額</span>
                                <span class="vat-si-value">${capital}</span>
                            </div>
                        </div>
                        <div class="vat-si-cell" style="margin-top: 12px; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                            <span class="vat-si-label">登記地址</span>
                            <span class="vat-si-value" style="font-size: 13px;">${address}</span>
                        </div>
                    </div>
                `);
            });

            vatSearchResultsArea.innerHTML = htmlArr.join('');
            vatSearchResultsArea.style.display = 'flex';
        });

    }, 50);
};
