window.render_companySearch = function () {
    container.innerHTML = `
        <style>
            .cs-wrapper {
                max-width: 800px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }
            .cs-hero {
                background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #6d28d9 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
                color: white;
                box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
            }
            .cs-hero::before {
                content: '';
                position: absolute;
                top: -50%; right: -10%;
                width: 300px; height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .cs-hero h2 {
                font-size: 28px; font-weight: 800; margin: 0 0 8px 0; position: relative; z-index: 1;
            }
            .cs-hero p {
                color: #ddd6fe; font-size: 15px; margin: 0; position: relative; z-index: 1; line-height: 1.6;
            }

            .cs-card {
                background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            }

            .cs-input-group { position: relative; margin-bottom: 16px; }
            .cs-input {
                width: 100%; padding: 18px 24px; border: 3px solid #e2e8f0; border-radius: 16px;
                font-size: 20px; font-weight: 700; color: #1e293b;
                outline: none; transition: border-color 0.3s;
                background: #f8fafc; box-sizing: border-box;
            }
            .cs-input:focus { border-color: #7c3aed; background: #fff; }
            .cs-input::placeholder { font-size: 16px; font-weight: 600; color: #cbd5e1; }

            .cs-hint {
                font-size: 13px; color: #94a3b8; font-weight: 600; margin-bottom: 20px;
                padding: 0 4px; line-height: 1.5;
            }
            .cs-hint span { color: #7c3aed; font-weight: 700; }

            .cs-btn {
                width: 100%; padding: 16px; border: none; border-radius: 16px;
                font-size: 18px; font-weight: 800; color: #fff; cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex; justify-content: center; align-items: center; gap: 8px; box-sizing: border-box;
                background: linear-gradient(135deg, #7c3aed, #6d28d9);
                box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
            }
            .cs-btn:active { transform: scale(0.98); }
            .cs-btn:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }

            .cs-status {
                margin-top: 24px; padding: 20px; border-radius: 16px; border: 2px solid transparent;
                text-align: center; display: none; box-sizing: border-box;
            }
            .cs-status.loading { display: block; background: #f5f3ff; border-color: #c4b5fd; }
            .cs-status.error { display: block; background: #fff1f2; border-color: #fecdd3; }
            .cs-status.empty { display: block; background: #fffbeb; border-color: #fde68a; }
            .cs-status-icon { font-size: 40px; margin-bottom: 8px; }
            .cs-status-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
            .cs-status-desc { font-size: 14px; font-weight: 600; color: #64748b; }

            .cs-spinner {
                display: inline-block; width: 40px; height: 40px;
                border: 4px solid rgba(124, 58, 237, 0.2);
                border-radius: 50%; border-top-color: #7c3aed;
                animation: csSpin 1s ease-in-out infinite;
            }
            @keyframes csSpin { to { transform: rotate(360deg); } }

            .cs-results-header {
                margin-top: 24px; display: flex; align-items: center; justify-content: space-between;
                margin-bottom: 12px; padding: 0 4px;
            }
            .cs-results-count {
                font-size: 15px; font-weight: 700; color: #334155;
            }
            .cs-results-count span { color: #7c3aed; font-weight: 800; }

            .cs-results {
                display: flex; flex-direction: column; gap: 16px;
                max-height: 600px; overflow-y: auto; padding-right: 8px;
            }
            .cs-results::-webkit-scrollbar { width: 6px; }
            .cs-results::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

            .cs-item {
                background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;
                position: relative; overflow: hidden;
            }
            .cs-item:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
            .cs-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; border-radius: 16px 0 0 16px; }
            .cs-item.st-active::before { background: linear-gradient(180deg, #10b981, #059669); }
            .cs-item.st-inactive::before { background: linear-gradient(180deg, #ef4444, #dc2626); }
            .cs-item.st-other::before { background: linear-gradient(180deg, #f59e0b, #d97706); }

            .cs-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 12px; }
            .cs-item-name { font-size: 20px; font-weight: 800; color: #1e293b; line-height: 1.4; }
            .cs-item-status { font-size: 12px; font-weight: 700; padding: 5px 10px; border-radius: 8px; white-space: nowrap; }
            .cs-item-status.active { background: #d1fae5; color: #047857; }
            .cs-item-status.inactive { background: #fee2e2; color: #b91c1c; }
            .cs-item-status.other { background: #fef3c7; color: #b45309; }

            .cs-item-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
            .cs-item-cell { display: flex; flex-direction: column; gap: 4px; }
            .cs-item-label { font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
            .cs-item-value { font-size: 15px; font-weight: 700; color: #334155; }
            .cs-item-value.highlight { color: #7c3aed; font-family: monospace; font-size: 18px; letter-spacing: 2px; }

            .cs-copy-btn {
                background: #f1f5f9; border: none; border-radius: 8px; padding: 6px 8px; cursor: pointer;
                color: #64748b; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center;
            }
            .cs-copy-btn:hover { background: #e2e8f0; color: #7c3aed; }

            .cs-addr-row {
                margin-top: 16px; border-top: 1px dashed #e2e8f0; padding-top: 16px;
            }

            .cs-source {
                margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600;
            }
            .cs-source a { color: #7c3aed; text-decoration: none; }

            @media (max-width: 640px) {
                .cs-hero h2 { font-size: 22px; }
                .cs-item-name { font-size: 17px; }
                .cs-item-grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="cs-wrapper">
            <div class="cs-hero">
                <h2>🔍 公司名稱查詢統編</h2>
                <p>輸入公司或商號名稱關鍵字，即時查詢統一編號、負責人、資本額等登記資料</p>
            </div>

            <div class="cs-card">
                <div class="cs-input-group">
                    <input type="text" id="csSearchInput" class="cs-input" placeholder="輸入公司名稱，例如：台積電、鴻海" autocomplete="off">
                </div>
                <div class="cs-hint">
                    💡 <span>小提示：</span>輸入公司名稱的部分關鍵字即可搜尋，例如「鴻海」可找到「鴻海精密工業」。支援公司、行號、分公司等所有類型。
                </div>
                <button id="csSearchBtn" class="cs-btn" disabled>
                    <span>🔍 立即搜尋公司統編</span>
                </button>

                <div id="csStatus" class="cs-status">
                    <div id="csStatusIcon" class="cs-status-icon"></div>
                    <div id="csStatusTitle" class="cs-status-title"></div>
                    <div id="csStatusDesc" class="cs-status-desc"></div>
                </div>

                <div id="csResultsHeader" class="cs-results-header" style="display:none;">
                    <div id="csResultsCount" class="cs-results-count"></div>
                </div>
                <div id="csResultsList" class="cs-results" style="display:none;"></div>
            </div>

            <div class="cs-source">
                資料來源 API：<a href="https://company.g0v.ronny.tw/" target="_blank">g0v 台灣零時政府 公司登記資料</a>
            </div>
        </div>
    `;

    setTimeout(() => {
        const searchInput = document.getElementById('csSearchInput');
        const searchBtn = document.getElementById('csSearchBtn');
        const statusBox = document.getElementById('csStatus');
        const statusIcon = document.getElementById('csStatusIcon');
        const statusTitle = document.getElementById('csStatusTitle');
        const statusDesc = document.getElementById('csStatusDesc');
        const resultsHeader = document.getElementById('csResultsHeader');
        const resultsCount = document.getElementById('csResultsCount');
        const resultsList = document.getElementById('csResultsList');

        // Enable/disable button
        searchInput.addEventListener('input', () => {
            searchBtn.disabled = searchInput.value.trim().length === 0;
            // Reset on new input
            statusBox.className = 'cs-status';
            statusBox.style.display = 'none';
            resultsHeader.style.display = 'none';
            resultsList.style.display = 'none';
        });

        // Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !searchBtn.disabled) {
                searchBtn.click();
            }
        });

        // Copy event delegation
        resultsList.addEventListener('click', (e) => {
            const btn = e.target.closest('.cs-copy-btn');
            if (!btn) return;
            const val = btn.dataset.copy;
            if (val) {
                navigator.clipboard.writeText(val).then(() => {
                    const orig = btn.innerHTML;
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => btn.innerHTML = orig, 2000);
                }).catch(() => {});
            }
        });

        // Format money
        function fmtMoney(v) {
            if (!v || (typeof v !== 'string' && typeof v !== 'number')) return v || '-';
            const num = parseInt(v.toString().replace(/,/g, ''));
            if (isNaN(num)) return v;
            return 'NT$ ' + num.toLocaleString('zh-TW');
        }

        // Fetch with fallback proxies
        async function fetchSearch(keyword) {
            const mkSignal = () => {
                if (window.AbortSignal && AbortSignal.timeout) return AbortSignal.timeout(10000);
                const c = new AbortController();
                setTimeout(() => c.abort(), 10000);
                return c.signal;
            };

            const q = encodeURIComponent(keyword);
            const urls = [
                `https://company.g0v.ronny.tw/api/search?q=${q}`,
                `https://api.allorigins.win/raw?url=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${q}`),
                `https://api.codetabs.com/v1/proxy?quest=` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${q}`),
                `https://corsproxy.io/?` + encodeURIComponent(`https://company.g0v.ronny.tw/api/search?q=${q}`)
            ];

            for (const url of urls) {
                try {
                    const res = await fetch(url, { signal: mkSignal() });
                    if (!res.ok) continue;
                    const json = await res.json();
                    if (json && json.data) return json.data;
                } catch (e) {
                    continue;
                }
            }
            return null;
        }

        // Search action
        searchBtn.addEventListener('click', async () => {
            const keyword = searchInput.value.trim();
            if (!keyword) return;

            // Show loading
            statusBox.className = 'cs-status loading';
            statusBox.style.display = 'block';
            statusIcon.innerHTML = '<div class="cs-spinner"></div>';
            statusTitle.textContent = '搜尋中...';
            statusDesc.textContent = '正在連線政府開放資料中心，查詢「' + keyword + '」相關公司...';
            resultsHeader.style.display = 'none';
            resultsList.innerHTML = '';
            resultsList.style.display = 'none';
            searchBtn.disabled = true;

            const data = await fetchSearch(keyword);
            searchBtn.disabled = false;

            if (data === null) {
                statusBox.className = 'cs-status error';
                statusIcon.textContent = '❌';
                statusTitle.textContent = '連線失敗';
                statusDesc.textContent = '無法連線至資料中心，請檢查網路連線後重試。';
                return;
            }

            if (data.length === 0) {
                statusBox.className = 'cs-status empty';
                statusIcon.textContent = '🔍';
                statusTitle.textContent = '找不到相符的公司';
                statusDesc.textContent = '沒有找到名稱包含「' + keyword + '」的公司，請嘗試其他關鍵字。';
                return;
            }

            // Hide status, show results
            statusBox.style.display = 'none';
            resultsHeader.style.display = 'flex';
            resultsCount.innerHTML = '共找到 <span>' + data.length + '</span> 筆符合的公司';

            let html = '';
            data.forEach((comp, idx) => {
                const name = comp['公司名稱'] || comp['商業名稱'] || comp['營業人名稱'] || '（無名稱紀錄）';
                const vat = comp['統一編號'] || '無資料';
                const rawStatus = comp['公司狀況'] || comp['商業狀況'] || comp['營業狀況'] || comp['登記現況'] || comp['現況'] || '-';

                let capital = comp['資本總額(元)'] || comp['實收資本額(元)'] || comp['資本額(元)'] || comp['出資額(元)'] || '-';
                if (capital !== '-') capital = fmtMoney(capital);

                const rep = comp['代表人姓名'] || comp['負責人姓名'] || '-';
                const addr = comp['公司所在地'] || comp['地址'] || '-';
                const setDate = comp['核准設立日期'] || comp['設立日期'] || '-';

                let stClass = 'other';
                let stLabel = rawStatus;
                if (rawStatus.includes('核准') || rawStatus.includes('營業中') || rawStatus.includes('存續')) {
                    stClass = 'active';
                } else if (rawStatus.includes('解散') || rawStatus.includes('歇業') || rawStatus.includes('廢止') || rawStatus.includes('撤銷') || rawStatus.includes('停業')) {
                    stClass = 'inactive';
                }

                const copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

                html += `
                    <div class="cs-item st-${stClass}" style="animation: cardFadeIn 0.4s ease-out ${idx * 0.05}s both;">
                        <div class="cs-item-header">
                            <div class="cs-item-name">${name}</div>
                            <div class="cs-item-status ${stClass}">${stLabel}</div>
                        </div>
                        <div class="cs-item-grid">
                            <div class="cs-item-cell">
                                <span class="cs-item-label">統一編號</span>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="cs-item-value highlight">${vat}</span>
                                    ${vat !== '無資料' ? `<button class="cs-copy-btn" data-copy="${vat}" title="複製統編">${copyIcon}</button>` : ''}
                                </div>
                            </div>
                            <div class="cs-item-cell">
                                <span class="cs-item-label">負責人</span>
                                <span class="cs-item-value">${rep}</span>
                            </div>
                            <div class="cs-item-cell">
                                <span class="cs-item-label">資本額</span>
                                <span class="cs-item-value">${capital}</span>
                            </div>
                            ${setDate !== '-' ? `<div class="cs-item-cell">
                                <span class="cs-item-label">設立日期</span>
                                <span class="cs-item-value">${setDate}</span>
                            </div>` : ''}
                        </div>
                        <div class="cs-addr-row">
                            <div class="cs-item-cell">
                                <span class="cs-item-label">登記地址</span>
                                <span class="cs-item-value" style="font-size: 14px; font-weight: 600;">${addr}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            resultsList.innerHTML = html;
            resultsList.style.display = 'flex';
        });

        // Auto focus
        setTimeout(() => searchInput.focus(), 100);
    }, 50);
};
