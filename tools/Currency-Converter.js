window.render_currencyConverter = function () {
    container.innerHTML = `
        <style>
            .cur-wrapper {
                max-width: 1100px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }

            /* Hero */
            .cur-hero {
                background: linear-gradient(135deg, #0a1628 0%, #1e3a5f 40%, #065f46 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .cur-hero::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -15%;
                width: 420px;
                height: 420px;
                background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
                border-radius: 50%;
            }
            .cur-hero::after {
                content: '';
                position: absolute;
                bottom: -40%;
                left: -10%;
                width: 320px;
                height: 320px;
                background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
                border-radius: 50%;
            }
            .cur-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 6px 0;
                position: relative;
                z-index: 1;
            }
            .cur-hero p {
                color: #6ee7b7;
                font-size: 14px;
                margin: 0;
                position: relative;
                z-index: 1;
            }
            .cur-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .cur-hero .hero-badge {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.15);
                color: #e2e8f0;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 主轉換卡片 */
            .cur-convert-card {
                background: #fff;
                border-radius: 24px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 8px 40px rgba(0,0,0,0.06);
                padding: 32px;
                margin-top: -50px;
                position: relative;
                z-index: 2;
            }

            /* 轉換區 */
            .cur-convert-row {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            @media (max-width: 700px) {
                .cur-convert-row { flex-direction: column; }
            }
            .cur-convert-box {
                flex: 1;
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 18px;
                padding: 20px;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            .cur-convert-box:focus-within {
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
            }
            .cur-convert-box .cb-label {
                font-size: 12px;
                color: #94a3b8;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }
            .cur-convert-box .cb-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .cur-convert-box .cb-flag {
                font-size: 32px;
                flex-shrink: 0;
            }
            .cur-convert-box select {
                border: none;
                background: transparent;
                font-size: 18px;
                font-weight: 800;
                color: #1e293b;
                cursor: pointer;
                outline: none;
                padding: 4px 0;
                width: 100%;
            }
            .cur-convert-box select option { font-size: 14px; }
            .cur-convert-box input[type="number"] {
                border: none;
                background: transparent;
                font-size: 32px;
                font-weight: 800;
                color: #1e293b;
                outline: none;
                width: 100%;
                text-align: right;
                padding: 0;
                margin-top: 6px;
            }
            .cur-result-value {
                font-size: 32px;
                font-weight: 900;
                color: #059669;
                text-align: right;
                margin-top: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            /* 換算按鈕 */
            .cur-swap-btn {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #059669);
                border: 4px solid #fff;
                box-shadow: 0 4px 16px rgba(16,185,129,0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                color: #fff;
                transition: all 0.3s;
                flex-shrink: 0;
            }
            .cur-swap-btn:hover {
                transform: rotate(180deg) scale(1.1);
                box-shadow: 0 6px 24px rgba(16,185,129,0.4);
            }

            /* 匯率說明行 */
            .cur-rate-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #e2e8f0;
                flex-wrap: wrap;
                gap: 8px;
            }
            .cur-rate-text {
                font-size: 14px;
                color: #64748b;
                font-weight: 600;
            }
            .cur-rate-text .rate-highlight {
                color: #059669;
                font-weight: 800;
            }
            .cur-rate-time {
                font-size: 12px;
                color: #94a3b8;
                font-weight: 600;
            }
            .cur-rate-status {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 700;
                padding: 3px 10px;
                border-radius: 100px;
            }
            .cur-rate-status.live { background: #dcfce7; color: #166534; }
            .cur-rate-status.offline { background: #fef3c7; color: #92400e; }
            .cur-rate-status .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                display: inline-block;
            }
            .cur-rate-status.live .dot { background: #22c55e; animation: curPulse 1.5s infinite; }
            .cur-rate-status.offline .dot { background: #f59e0b; }
            @keyframes curPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

            /* 網格 */
            .cur-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-top: 24px;
            }
            @media (max-width: 860px) { .cur-grid { grid-template-columns: 1fr; } }

            /* 卡片 */
            .cur-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                transition: box-shadow 0.3s;
            }
            .cur-card:hover { box-shadow: 0 8px 36px rgba(0,0,0,0.08); }
            .cur-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 常用幣別快選 */
            .cur-quick-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }
            .cur-quick-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 6px;
                border-radius: 14px;
                border: 2px solid #e2e8f0;
                background: #f8fafc;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 12px;
                font-weight: 700;
                color: #475569;
            }
            .cur-quick-btn:hover {
                border-color: #10b981;
                background: #ecfdf5;
                transform: translateY(-2px);
            }
            .cur-quick-btn.active {
                border-color: #10b981;
                background: #ecfdf5;
                color: #059669;
            }
            .cur-quick-btn .qb-flag { font-size: 26px; margin-bottom: 4px; }
            .cur-quick-btn .qb-rate { font-size: 10px; color: #94a3b8; font-weight: 600; margin-top: 2px; }

            /* 多幣別一覽表 */
            .cur-multi-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .cur-multi-table th {
                background: #f1f5f9;
                color: #475569;
                font-weight: 700;
                padding: 10px 12px;
                text-align: left;
                position: sticky;
                top: 0;
            }
            .cur-multi-table th:last-child { text-align: right; }
            .cur-multi-table td {
                padding: 10px 12px;
                border-top: 1px solid #f1f5f9;
                color: #334155;
            }
            .cur-multi-table td:last-child { text-align: right; font-weight: 800; color: #059669; }
            .cur-multi-table tr:hover td { background: #ecfdf5; }
            .cur-multi-table .flag-cell {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cur-multi-table .flag-cell .f-emoji { font-size: 20px; }
            .cur-multi-table .f-name { font-weight: 700; }
            .cur-multi-table .f-code { color: #94a3b8; font-size: 11px; font-weight: 600; }
            .cur-multi-wrap {
                max-height: 380px;
                overflow-y: auto;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            }
            .cur-multi-wrap::-webkit-scrollbar { width: 4px; }
            .cur-multi-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

            /* 提示框 */
            .cur-insight {
                background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
                border: 1px solid #a7f3d0;
                border-radius: 16px;
                padding: 20px;
                margin-top: 24px;
                line-height: 1.8;
                font-size: 14px;
                color: #065f46;
                font-weight: 600;
            }
            .cur-insight .hi { color: #059669; font-weight: 800; }

            /* 動畫 */
            @keyframes curSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .cur-anim { animation: curSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            .cur-anim-d1 { animation-delay: 0.1s; opacity: 0; }
            .cur-anim-d2 { animation-delay: 0.2s; opacity: 0; }
            .cur-anim-d3 { animation-delay: 0.3s; opacity: 0; }
        </style>

        <div class="cur-wrapper">
            <!-- Hero -->
            <div class="cur-hero cur-anim">
                <h2>💱 即時匯率換算器</h2>
                <p>支援多國幣別即時換算 — 透過免費 API 取得最新匯率，出國旅遊、海外購物必備</p>
                <div class="hero-badges">
                    <span class="hero-badge">🌍 16+ 幣別</span>
                    <span class="hero-badge">📡 即時匯率 API</span>
                    <span class="hero-badge">🔄 一鍵互換</span>
                    <span class="hero-badge">📊 多幣別總覽</span>
                </div>
            </div>

            <!-- 主換算卡片 -->
            <div class="cur-convert-card cur-anim cur-anim-d1">
                <div class="cur-convert-row">
                    <!-- 來源幣別 -->
                    <div class="cur-convert-box">
                        <div class="cb-label">From 來源幣別</div>
                        <div class="cb-row">
                            <span class="cb-flag" id="curFromFlag">🇹🇼</span>
                            <select id="curFrom"></select>
                        </div>
                        <input type="number" id="curVal" value="1000" min="0" step="any">
                    </div>

                    <!-- 交換按鈕 -->
                    <button class="cur-swap-btn" id="curSwapBtn" title="互換幣別">⇄</button>

                    <!-- 目標幣別 -->
                    <div class="cur-convert-box">
                        <div class="cb-label">To 目標幣別</div>
                        <div class="cb-row">
                            <span class="cb-flag" id="curToFlag">🇯🇵</span>
                            <select id="curTo"></select>
                        </div>
                        <div class="cur-result-value" id="curResult">0</div>
                    </div>
                </div>

                <!-- 匯率說明 -->
                <div class="cur-rate-info">
                    <div class="cur-rate-text" id="curRateText">
                        1 TWD = <span class="rate-highlight" id="curRateNum">-</span> JPY
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span class="cur-rate-status" id="curStatus">
                            <span class="dot"></span>
                            <span id="curStatusText">載入中...</span>
                        </span>
                        <span class="cur-rate-time" id="curTime"></span>
                    </div>
                </div>
            </div>

            <div class="cur-grid">
                <!-- 常用幣別快選 -->
                <div class="cur-card cur-anim cur-anim-d2">
                    <h3>⚡ 常用幣別快選</h3>
                    <div class="cur-quick-grid" id="curQuickGrid"></div>
                </div>

                <!-- 多幣別一覽 -->
                <div class="cur-card cur-anim cur-anim-d2">
                    <h3>📊 多幣別一覽</h3>
                    <div class="cur-multi-wrap">
                        <table class="cur-multi-table">
                            <thead>
                                <tr>
                                    <th>幣別</th>
                                    <th style="text-align:right;">換算結果</th>
                                </tr>
                            </thead>
                            <tbody id="curMultiBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 洞察 -->
            <div class="cur-insight cur-anim cur-anim-d3" id="curInsight"></div>
        </div>
    `;

    setTimeout(() => {
        // ===== 幣別資料 =====
        const currencies = [
            { code: 'TWD', name: '新台幣', flag: '🇹🇼' },
            { code: 'USD', name: '美元', flag: '🇺🇸' },
            { code: 'JPY', name: '日圓', flag: '🇯🇵' },
            { code: 'EUR', name: '歐元', flag: '🇪🇺' },
            { code: 'CNY', name: '人民幣', flag: '🇨🇳' },
            { code: 'GBP', name: '英鎊', flag: '🇬🇧' },
            { code: 'KRW', name: '韓元', flag: '🇰🇷' },
            { code: 'HKD', name: '港幣', flag: '🇭🇰' },
            { code: 'AUD', name: '澳幣', flag: '🇦🇺' },
            { code: 'CAD', name: '加幣', flag: '🇨🇦' },
            { code: 'SGD', name: '新加坡幣', flag: '🇸🇬' },
            { code: 'CHF', name: '瑞士法郎', flag: '🇨🇭' },
            { code: 'THB', name: '泰銖', flag: '🇹🇭' },
            { code: 'VND', name: '越南盾', flag: '🇻🇳' },
            { code: 'MYR', name: '馬來西亞令吉', flag: '🇲🇾' },
            { code: 'PHP', name: '菲律賓披索', flag: '🇵🇭' },
        ];

        // 常用快選幣別
        const quickCodes = ['USD', 'JPY', 'EUR', 'CNY', 'KRW', 'GBP', 'HKD', 'AUD', 'THB'];

        // 備用靜態匯率 (以 USD 為基準)
        const fallbackRates = {
            TWD: 32.5, USD: 1, JPY: 154.8, EUR: 0.92, CNY: 7.25,
            GBP: 0.79, KRW: 1380, HKD: 7.82, AUD: 1.55, CAD: 1.37,
            SGD: 1.35, CHF: 0.88, THB: 35.8, VND: 25380, MYR: 4.72, PHP: 58.5
        };

        let rates = { ...fallbackRates };
        let isLive = false;

        // === DOM ===
        const curFrom = document.getElementById('curFrom');
        const curTo = document.getElementById('curTo');
        const curVal = document.getElementById('curVal');
        const curResult = document.getElementById('curResult');
        const curFromFlag = document.getElementById('curFromFlag');
        const curToFlag = document.getElementById('curToFlag');
        const curRateText = document.getElementById('curRateText');
        const curRateNum = document.getElementById('curRateNum');
        const curStatus = document.getElementById('curStatus');
        const curStatusText = document.getElementById('curStatusText');
        const curTime = document.getElementById('curTime');
        const curQuickGrid = document.getElementById('curQuickGrid');
        const curMultiBody = document.getElementById('curMultiBody');
        const curInsight = document.getElementById('curInsight');
        const curSwapBtn = document.getElementById('curSwapBtn');

        // === 建立下拉選單 ===
        currencies.forEach(c => {
            curFrom.innerHTML += `<option value="${c.code}" ${c.code === 'TWD' ? 'selected' : ''}>${c.flag} ${c.code} - ${c.name}</option>`;
            curTo.innerHTML += `<option value="${c.code}" ${c.code === 'JPY' ? 'selected' : ''}>${c.flag} ${c.code} - ${c.name}</option>`;
        });

        // === 建立快選按鈕 ===
        quickCodes.forEach(code => {
            const c = currencies.find(x => x.code === code);
            const btn = document.createElement('div');
            btn.className = 'cur-quick-btn';
            btn.dataset.code = code;
            btn.innerHTML = `
                <span class="qb-flag">${c.flag}</span>
                <span>${c.code}</span>
                <span class="qb-rate" id="qr_${code}">-</span>
            `;
            btn.addEventListener('click', () => {
                curTo.value = code;
                convert();
            });
            curQuickGrid.appendChild(btn);
        });

        // === 取得即時匯率 ===
        async function fetchRates() {
            try {
                const resp = await fetch('https://api.exchangerate-data.org/latest?base=USD');
                if (resp.ok) {
                    const data = await resp.json();
                    if (data.rates) {
                        Object.keys(rates).forEach(k => {
                            if (data.rates[k]) rates[k] = data.rates[k];
                        });
                        isLive = true;
                    }
                }
            } catch (e1) {
                try {
                    const resp2 = await fetch('https://open.er-api.com/v6/latest/USD');
                    if (resp2.ok) {
                        const data2 = await resp2.json();
                        if (data2.rates) {
                            Object.keys(rates).forEach(k => {
                                if (data2.rates[k]) rates[k] = data2.rates[k];
                            });
                            isLive = true;
                        }
                    }
                } catch (e2) {
                    isLive = false;
                }
            }

            if (isLive) {
                curStatus.className = 'cur-rate-status live';
                curStatusText.textContent = '即時匯率';
            } else {
                curStatus.className = 'cur-rate-status offline';
                curStatusText.textContent = '離線參考值';
            }
            curTime.textContent = '更新: ' + new Date().toLocaleTimeString('zh-TW');

            convert();
        }

        // === 主換算 ===
        function convert() {
            const fromCode = curFrom.value;
            const toCode = curTo.value;
            const val = parseFloat(curVal.value) || 0;

            const fromC = currencies.find(c => c.code === fromCode);
            const toC = currencies.find(c => c.code === toCode);
            curFromFlag.textContent = fromC ? fromC.flag : '💰';
            curToFlag.textContent = toC ? toC.flag : '💰';

            // 計算 from → to 匯率 (通過 USD 中轉)
            const fromToUSD = 1 / rates[fromCode];
            const usdToTo = rates[toCode];
            const directRate = fromToUSD * usdToTo;

            const result = val * directRate;
            curResult.textContent = formatResult(result);

            // 匯率資訊
            curRateNum.textContent = directRate.toFixed(4);
            curRateText.innerHTML = `1 ${fromCode} = <span class="rate-highlight">${directRate.toFixed(4)}</span> ${toCode}`;

            // 更新快選按鈕中的匯率
            quickCodes.forEach(code => {
                const r = (1 / rates[fromCode]) * rates[code];
                const el = document.getElementById('qr_' + code);
                if (el) el.textContent = r >= 100 ? r.toFixed(1) : r.toFixed(4);
            });

            // 更新多幣別一覽表
            updateMultiTable(fromCode, val);

            // 更新洞察
            updateInsight(fromCode, toCode, val, result, directRate);
        }

        function formatResult(num) {
            if (Math.abs(num) >= 1000000) return num.toLocaleString('zh-TW', { maximumFractionDigits: 0 });
            if (Math.abs(num) >= 100) return num.toLocaleString('zh-TW', { maximumFractionDigits: 2 });
            if (Math.abs(num) >= 1) return num.toFixed(4);
            return num.toFixed(6);
        }

        // === 多幣別一覽表 ===
        function updateMultiTable(fromCode, val) {
            curMultiBody.innerHTML = currencies
                .filter(c => c.code !== fromCode)
                .map(c => {
                    const r = (1 / rates[fromCode]) * rates[c.code];
                    const converted = val * r;
                    return `<tr>
                        <td>
                            <div class="flag-cell">
                                <span class="f-emoji">${c.flag}</span>
                                <div>
                                    <span class="f-name">${c.name}</span><br>
                                    <span class="f-code">${c.code}</span>
                                </div>
                            </div>
                        </td>
                        <td>${formatResult(converted)}</td>
                    </tr>`;
                }).join('');
        }

        // === 洞察 ===
        function updateInsight(from, to, val, result, rate) {
            if (val <= 0) {
                curInsight.innerHTML = '💡 請輸入金額以查看換算結果。';
                return;
            }

            const fromC = currencies.find(c => c.code === from);
            const toC = currencies.find(c => c.code === to);
            const reverseRate = 1 / rate;

            curInsight.innerHTML = `
                💡 <span class="hi">${val.toLocaleString()} ${from}</span> (${fromC.name})
                = <span class="hi">${formatResult(result)} ${to}</span> (${toC.name})。<br>
                📌 反向換算：1 ${to} = <span class="hi">${reverseRate.toFixed(4)}</span> ${from}。<br>
                ${to === 'JPY' && from === 'TWD' ? '🇯🇵 日本旅遊提示：便利商店消費約 100~500 日圓，拉麵約 800~1200 日圓。' : ''}
                ${to === 'USD' && from === 'TWD' ? '🇺🇸 美國消費提示：一般小費約 15~20%，快餐約 8~15 美元。' : ''}
                ${to === 'KRW' && from === 'TWD' ? '🇰🇷 韓國旅遊提示：地鐵基本票約 1,400 韓元，炸雞約 18,000~25,000 韓元。' : ''}
                ${to === 'EUR' && from === 'TWD' ? '🇪🇺 歐洲消費提示：咖啡約 2~4 歐元，博物館門票約 10~20 歐元。' : ''}
                ${to === 'THB' && from === 'TWD' ? '🇹🇭 泰國旅遊提示：路邊小吃約 40~80 泰銖，按摩約 300~600 泰銖。' : ''}
                ${isLive ? '' : '<br>⚠️ 目前使用離線參考匯率，實際匯率可能有差異。'}
            `;
        }

        // === 互換按鈕 ===
        curSwapBtn.addEventListener('click', () => {
            const tmp = curFrom.value;
            curFrom.value = curTo.value;
            curTo.value = tmp;
            convert();
        });

        // === 事件綁定 ===
        curVal.addEventListener('input', convert);
        curFrom.addEventListener('change', convert);
        curTo.addEventListener('change', convert);

        // === 初始化 ===
        fetchRates();

    }, 0);
};
