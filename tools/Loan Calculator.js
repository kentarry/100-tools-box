window.render_loanCalculator = function () {
    // =======================================
    // 🏠 貸款提前還款試算器 - 專業進階版
    // =======================================

    // 台灣主要銀行房貸利率參考 (2025年最新公告)
    const bankRates = [
        { name: '台灣銀行', color: '#0057a8', rate1: 2.185, rate2: '前兩年 1.81% / 第三年起 2.185%', type: '指數型' },
        { name: '土地銀行', color: '#00713d', rate1: 2.170, rate2: '前兩年 1.79% / 第三年起 2.170%', type: '指數型' },
        { name: '合作金庫', color: '#c8102e', rate1: 2.200, rate2: '前兩年 1.85% / 第三年起 2.200%', type: '指數型' },
        { name: '第一銀行', color: '#e87722', rate1: 2.190, rate2: '前兩年 1.81% / 第三年起 2.190%', type: '指數型' },
        { name: '華南銀行', color: '#003f87', rate1: 2.180, rate2: '前兩年 1.80% / 第三年起 2.180%', type: '指數型' },
        { name: '中國信託', color: '#c41230', rate1: 2.237, rate2: '前兩年 1.88% / 第三年起 2.237%', type: '指數型' },
        { name: '國泰世華', color: '#005f30', rate1: 2.250, rate2: '前兩年 1.90% / 第三年起 2.250%', type: '指數型' },
        { name: '玉山銀行', color: '#007a5e', rate1: 2.230, rate2: '前兩年 1.87% / 第三年起 2.230%', type: '指數型' },
        { name: '台北富邦', color: '#00508c', rate1: 2.245, rate2: '前兩年 1.89% / 第三年起 2.245%', type: '指數型' },
        { name: '永豐銀行', color: '#e31937', rate1: 2.210, rate2: '前兩年 1.83% / 第三年起 2.210%', type: '指數型' },
    ];

    container.innerHTML = `
        <style>
            .loan-calc-wrapper {
                max-width: 1100px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }
            .loan-hero {
                background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f766e 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .loan-hero::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -20%;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .loan-hero::after {
                content: '';
                position: absolute;
                bottom: -30%;
                left: -10%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .loan-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 4px 0;
                position: relative;
                z-index: 1;
            }
            .loan-hero p {
                color: #94a3b8;
                font-size: 14px;
                margin: 0;
                position: relative;
                z-index: 1;
            }
            .loan-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .loan-hero .hero-badge {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.15);
                color: #e2e8f0;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 匯率面板 */
            .fx-panel {
                display: flex;
                gap: 10px;
                margin-top: 20px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .fx-card {
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 14px;
                padding: 12px 18px;
                min-width: 130px;
                flex: 1;
                transition: all 0.3s;
            }
            .fx-card:hover {
                background: rgba(255,255,255,0.14);
                transform: translateY(-2px);
            }
            .fx-card .fx-label {
                color: #94a3b8;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .fx-card .fx-value {
                color: #34d399;
                font-size: 20px;
                font-weight: 800;
                margin-top: 4px;
            }
            .fx-card .fx-name {
                color: #cbd5e1;
                font-size: 12px;
                margin-top: 2px;
            }
            .fx-loading {
                color: #64748b;
                font-size: 13px;
                animation: pulse-fx 1.5s infinite;
            }
            @keyframes pulse-fx {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            /* 主要內容區 */
            .loan-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            @media (max-width: 768px) {
                .loan-grid { grid-template-columns: 1fr; }
            }

            /* 玻璃卡片 */
            .glass-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 28px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                transition: box-shadow 0.3s;
            }
            .glass-card:hover {
                box-shadow: 0 8px 40px rgba(0,0,0,0.08);
            }
            .glass-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 輸入群組 */
            .input-group {
                margin-bottom: 20px;
            }
            .input-group label {
                display: block;
                font-size: 13px;
                font-weight: 700;
                color: #475569;
                margin-bottom: 8px;
            }
            .input-group label span.unit {
                font-weight: 400;
                color: #94a3b8;
                font-size: 12px;
            }
            .input-row {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .input-row input[type="number"] {
                flex: 0 0 120px;
                padding: 10px 14px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 700;
                color: #1e293b;
                outline: none;
                transition: border-color 0.3s;
                text-align: right;
                background: #f8fafc;
            }
            .input-row input[type="number"]:focus {
                border-color: #34d399;
                background: #fff;
            }
            .input-row input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: linear-gradient(90deg, #34d399, #0f766e);
                border-radius: 10px;
                outline: none;
                cursor: pointer;
            }
            .input-row input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid #0f766e;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                cursor: pointer;
                transition: transform 0.2s;
            }
            .input-row input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            /* 切換按鈕 */
            .toggle-group {
                display: flex;
                background: #f1f5f9;
                border-radius: 12px;
                padding: 4px;
                margin-bottom: 20px;
            }
            .toggle-btn {
                flex: 1;
                padding: 10px 8px;
                border: none;
                background: transparent;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 700;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s;
            }
            .toggle-btn.active {
                background: #fff;
                color: #0f766e;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            /* 結果區 */
            .result-panel {
                background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
                border: 1px solid #a7f3d0;
                border-radius: 16px;
                padding: 24px;
                margin-top: 12px;
            }
            .result-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid rgba(167,243,208,0.5);
            }
            .result-row:last-child { border-bottom: none; }
            .result-label {
                font-size: 13px;
                color: #475569;
                font-weight: 600;
            }
            .result-value {
                font-size: 18px;
                font-weight: 800;
                color: #065f46;
            }
            .result-value.highlight {
                font-size: 26px;
                color: #059669;
            }
            .result-value.save {
                color: #dc2626;
                position: relative;
            }

            /* 比較面板 */
            .compare-panel {
                background: linear-gradient(135deg, #fef3c7, #fef9c3);
                border: 1px solid #fcd34d;
                border-radius: 16px;
                padding: 24px;
                margin-top: 16px;
            }
            .compare-panel h4 {
                margin: 0 0 16px 0;
                font-size: 15px;
                font-weight: 800;
                color: #92400e;
            }

            /* 圖表 */
            .chart-container {
                margin-top: 24px;
            }
            .chart-container h4 {
                font-size: 14px;
                font-weight: 700;
                color: #334155;
                margin: 0 0 12px 0;
            }
            .bar-chart {
                display: flex;
                align-items: flex-end;
                gap: 2px;
                height: 160px;
                padding: 8px 0;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                overflow: hidden;
            }
            .bar-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                height: 100%;
                position: relative;
                cursor: pointer;
            }
            .bar-fill {
                width: 100%;
                border-radius: 4px 4px 0 0;
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                min-height: 2px;
            }
            .bar-fill.principal {
                background: linear-gradient(to top, #0f766e, #34d399);
            }
            .bar-fill.interest {
                background: linear-gradient(to top, #f59e0b, #fbbf24);
            }
            .bar-item:hover .bar-fill {
                filter: brightness(1.15);
            }
            .chart-legend {
                display: flex;
                justify-content: center;
                gap: 24px;
                margin-top: 12px;
                font-size: 12px;
                color: #64748b;
                font-weight: 600;
            }
            .chart-legend span::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 3px;
                margin-right: 6px;
                vertical-align: middle;
            }
            .chart-legend .leg-principal::before { background: #34d399; }
            .chart-legend .leg-interest::before { background: #fbbf24; }

            /* 銀行利率表 */
            .bank-table-wrap {
                max-height: 400px;
                overflow-y: auto;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
            }
            .bank-table-wrap::-webkit-scrollbar { width: 4px; }
            .bank-table-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .bank-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .bank-table th {
                background: #f1f5f9;
                color: #475569;
                font-weight: 700;
                padding: 12px 14px;
                text-align: left;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .bank-table td {
                padding: 12px 14px;
                border-top: 1px solid #f1f5f9;
                color: #334155;
                transition: background 0.2s;
            }
            .bank-table tr {
                cursor: pointer;
                transition: all 0.2s;
            }
            .bank-table tr:hover td {
                background: #ecfdf5;
            }
            .bank-table .bank-name-cell {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 700;
            }
            .bank-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .bank-table .rate-cell {
                font-weight: 800;
                color: #0f766e;
                font-size: 15px;
            }
            .bank-table .use-btn {
                background: linear-gradient(135deg, #0f766e, #059669);
                color: #fff;
                border: none;
                padding: 6px 14px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .bank-table .use-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(15,118,110,0.3);
            }
            .bank-disclaimer {
                font-size: 11px;
                color: #94a3b8;
                margin-top: 10px;
                line-height: 1.6;
            }

            /* 動畫 */
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .anim-slide-up {
                animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            .anim-delay-1 { animation-delay: 0.1s; opacity: 0; }
            .anim-delay-2 { animation-delay: 0.2s; opacity: 0; }
            .anim-delay-3 { animation-delay: 0.3s; opacity: 0; }

            /* 寬限期 select */
            .grace-select {
                padding: 10px 14px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
                background: #f8fafc;
                outline: none;
                cursor: pointer;
                transition: border-color 0.3s;
            }
            .grace-select:focus { border-color: #34d399; }

            /* tooltip 顯示 */
            .bar-item .bar-tooltip {
                display: none;
                position: absolute;
                top: -36px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                color: #fff;
                font-size: 11px;
                padding: 4px 10px;
                border-radius: 6px;
                white-space: nowrap;
                z-index: 5;
                pointer-events: none;
            }
            .bar-item:hover .bar-tooltip {
                display: block;
            }

            /* 比較條 */
            .compare-bar-row {
                margin-bottom: 14px;
            }
            .compare-bar-label {
                font-size: 12px;
                color: #78350f;
                font-weight: 600;
                margin-bottom: 4px;
            }
            .compare-bar-track {
                height: 28px;
                background: #fef3c7;
                border-radius: 8px;
                position: relative;
                overflow: hidden;
                border: 1px solid #fcd34d;
            }
            .compare-bar-fill {
                height: 100%;
                border-radius: 8px;
                transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                align-items: center;
                padding: 0 10px;
                font-size: 12px;
                font-weight: 700;
                color: #fff;
            }
            .compare-bar-fill.orig { background: linear-gradient(90deg, #f59e0b, #d97706); }
            .compare-bar-fill.prepay { background: linear-gradient(90deg, #059669, #34d399); }
        </style>

        <div class="loan-calc-wrapper">
            <!-- ===== Hero ===== -->
            <div class="loan-hero anim-slide-up">
                <h2>🏠 貸款提前還款試算器</h2>
                <p>專業計算 · 即時利率 · 視覺化分析 — 輕鬆掌握您的房貸規劃</p>
                <div class="hero-badges">
                    <span class="hero-badge">📊 本息 / 本金均攤</span>
                    <span class="hero-badge">⏰ 寬限期試算</span>
                    <span class="hero-badge">💰 提前還款分析</span>
                    <span class="hero-badge">🏦 銀行利率參考</span>
                </div>
                <!-- 即時匯率面板 -->
                <div class="fx-panel" id="loanFxPanel">
                    <div class="fx-loading">💱 載入即時匯率中...</div>
                </div>
            </div>

            <div class="loan-grid">
                <!-- ===== 左欄: 輸入區 ===== -->
                <div>
                    <div class="glass-card anim-slide-up anim-delay-1">
                        <h3>📋 貸款條件設定</h3>

                        <!-- 還款方式 -->
                        <div class="toggle-group" id="loanMethodToggle">
                            <button class="toggle-btn active" data-method="equalPayment">本息均攤</button>
                            <button class="toggle-btn" data-method="equalPrincipal">本金均攤</button>
                        </div>

                        <!-- 貸款金額 -->
                        <div class="input-group">
                            <label>貸款總額 <span class="unit">(萬元)</span></label>
                            <div class="input-row">
                                <input type="range" id="loanAmountRange" min="50" max="5000" step="10" value="1000">
                                <input type="number" id="loanAmount" value="1000" min="1">
                            </div>
                        </div>

                        <!-- 年利率 -->
                        <div class="input-group">
                            <label>年利率 <span class="unit">(%)</span></label>
                            <div class="input-row">
                                <input type="range" id="loanRateRange" min="0.5" max="8" step="0.01" value="2.185">
                                <input type="number" id="loanRate" value="2.185" min="0.01" step="0.001">
                            </div>
                        </div>

                        <!-- 貸款年限 -->
                        <div class="input-group">
                            <label>貸款年限 <span class="unit">(年)</span></label>
                            <div class="input-row">
                                <input type="range" id="loanYearsRange" min="1" max="40" step="1" value="30">
                                <input type="number" id="loanYears" value="30" min="1" max="40">
                            </div>
                        </div>

                        <!-- 寬限期 -->
                        <div class="input-group">
                            <label>寬限期 <span class="unit">(僅繳息不繳本)</span></label>
                            <select class="grace-select" id="loanGrace">
                                <option value="0">無寬限期</option>
                                <option value="12">1 年</option>
                                <option value="24">2 年</option>
                                <option value="36" selected>3 年</option>
                                <option value="60">5 年</option>
                            </select>
                        </div>

                        <!-- 每月額外還款 -->
                        <div class="input-group">
                            <label>每月額外還款 <span class="unit">(元)</span></label>
                            <div class="input-row">
                                <input type="range" id="extraPayRange" min="0" max="100000" step="1000" value="5000">
                                <input type="number" id="extraPay" value="5000" min="0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===== 右欄: 結果區 ===== -->
                <div>
                    <div class="glass-card anim-slide-up anim-delay-2">
                        <h3>📊 試算結果</h3>

                        <div class="result-panel" id="loanResultPanel">
                            <div class="result-row">
                                <span class="result-label">每月應還金額</span>
                                <span class="result-value highlight" id="resMonthly">-</span>
                            </div>
                            <div class="result-row">
                                <span class="result-label">總繳金額</span>
                                <span class="result-value" id="resTotalPay">-</span>
                            </div>
                            <div class="result-row">
                                <span class="result-label">利息總額</span>
                                <span class="result-value" id="resTotalInterest">-</span>
                            </div>
                            <div class="result-row">
                                <span class="result-label">原始還款期數</span>
                                <span class="result-value" id="resOrigMonths">-</span>
                            </div>
                        </div>

                        <!-- 提前還款比較 -->
                        <div class="compare-panel" id="loanComparePanel">
                            <h4>⚡ 提前還款效益分析</h4>
                            <div class="result-row">
                                <span class="result-label">提前還款後實際期數</span>
                                <span class="result-value" id="resPrepayMonths" style="color:#92400e">-</span>
                            </div>
                            <div class="result-row">
                                <span class="result-label">📅 可提前完成</span>
                                <span class="result-value save" id="resSaveYears">-</span>
                            </div>
                            <div class="result-row">
                                <span class="result-label">💰 可節省利息</span>
                                <span class="result-value save" id="resSaveInterest" style="font-size:22px">-</span>
                            </div>

                            <!-- 比較條 -->
                            <div style="margin-top: 16px;">
                                <div class="compare-bar-row">
                                    <div class="compare-bar-label">原始利息</div>
                                    <div class="compare-bar-track"><div class="compare-bar-fill orig" id="barOrig"></div></div>
                                </div>
                                <div class="compare-bar-row">
                                    <div class="compare-bar-label">提前還款利息</div>
                                    <div class="compare-bar-track"><div class="compare-bar-fill prepay" id="barPrepay"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 圖表 -->
                    <div class="glass-card anim-slide-up anim-delay-3" style="margin-top: 24px;">
                        <h3>📈 每年償還結構圖</h3>
                        <div class="bar-chart" id="loanChart"></div>
                        <div class="chart-legend">
                            <span class="leg-principal">本金</span>
                            <span class="leg-interest">利息</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== 銀行利率表 ===== -->
            <div class="glass-card anim-slide-up anim-delay-3" style="margin-top: 24px;">
                <h3>🏦 台灣各銀行房貸利率參考</h3>
                <div class="bank-table-wrap">
                    <table class="bank-table" id="bankRateTable">
                        <thead>
                            <tr>
                                <th>銀行</th>
                                <th>一段式利率</th>
                                <th>分段式利率</th>
                                <th>類型</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="bankRateBody"></tbody>
                    </table>
                </div>
                <p class="bank-disclaimer">
                    ⚠️ 以上利率資料僅供參考，實際利率依各銀行官網最新公告為準。利率可能依個人信用條件、擔保品而有所不同。<br>
                    📅 資料參考期間：2025 年 Q1 各銀行官網公告
                </p>
            </div>
        </div>
    `;

    // ===== 初始化邏輯 =====
    setTimeout(() => {
        // --- DOM 快取 ---
        const els = {
            amountRange: document.getElementById('loanAmountRange'),
            amount: document.getElementById('loanAmount'),
            rateRange: document.getElementById('loanRateRange'),
            rate: document.getElementById('loanRate'),
            yearsRange: document.getElementById('loanYearsRange'),
            years: document.getElementById('loanYears'),
            grace: document.getElementById('loanGrace'),
            extraRange: document.getElementById('extraPayRange'),
            extra: document.getElementById('extraPay'),
            resMonthly: document.getElementById('resMonthly'),
            resTotalPay: document.getElementById('resTotalPay'),
            resTotalInterest: document.getElementById('resTotalInterest'),
            resOrigMonths: document.getElementById('resOrigMonths'),
            resPrepayMonths: document.getElementById('resPrepayMonths'),
            resSaveYears: document.getElementById('resSaveYears'),
            resSaveInterest: document.getElementById('resSaveInterest'),
            barOrig: document.getElementById('barOrig'),
            barPrepay: document.getElementById('barPrepay'),
            chart: document.getElementById('loanChart'),
        };

        let currentMethod = 'equalPayment'; // 本息均攤

        // --- 滑桿 ↔ 數字同步 ---
        function syncPair(range, num) {
            range.addEventListener('input', () => { num.value = range.value; calc(); });
            num.addEventListener('input', () => { range.value = num.value; calc(); });
        }
        syncPair(els.amountRange, els.amount);
        syncPair(els.rateRange, els.rate);
        syncPair(els.yearsRange, els.years);
        syncPair(els.extraRange, els.extra);
        els.grace.addEventListener('change', calc);

        // --- 還款方式切換 ---
        document.querySelectorAll('#loanMethodToggle .toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#loanMethodToggle .toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMethod = btn.dataset.method;
                calc();
            });
        });

        // --- 銀行利率表 ---
        const tbody = document.getElementById('bankRateBody');
        bankRates.forEach(bank => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div class="bank-name-cell"><span class="bank-dot" style="background:${bank.color}"></span>${bank.name}</div></td>
                <td class="rate-cell">${bank.rate1}%</td>
                <td style="font-size:12px;color:#64748b">${bank.rate2}</td>
                <td style="font-size:12px">${bank.type}</td>
                <td><button class="use-btn" data-rate="${bank.rate1}">套用 ➔</button></td>
            `;
            tr.querySelector('.use-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const r = parseFloat(e.target.dataset.rate);
                els.rate.value = r;
                els.rateRange.value = r;
                calc();
                // 滾動到頂部檢視結果
                document.querySelector('.loan-calc-wrapper').scrollIntoView({ behavior: 'smooth' });
            });
            tbody.appendChild(tr);
        });

        // --- 即時匯率 ---
        async function fetchFX() {
            const panel = document.getElementById('loanFxPanel');
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/TWD');
                const data = await res.json();
                if (data.result === 'success') {
                    const currencies = [
                        { code: 'USD', name: '美元', flag: '🇺🇸' },
                        { code: 'JPY', name: '日圓', flag: '🇯🇵' },
                        { code: 'EUR', name: '歐元', flag: '🇪🇺' },
                        { code: 'CNY', name: '人民幣', flag: '🇨🇳' },
                        { code: 'KRW', name: '韓元', flag: '🇰🇷' },
                    ];
                    panel.innerHTML = currencies.map(c => {
                        const rate = data.rates[c.code];
                        // TWD → 外幣 (1 TWD = ? 外幣)
                        const display = rate >= 1 ? rate.toFixed(2) : rate.toFixed(4);
                        return `
                            <div class="fx-card">
                                <div class="fx-label">${c.flag} ${c.code}</div>
                                <div class="fx-value">${display}</div>
                                <div class="fx-name">1 TWD = ${display} ${c.code}</div>
                            </div>
                        `;
                    }).join('');
                } else {
                    throw new Error('API error');
                }
            } catch (err) {
                panel.innerHTML = '<div class="fx-loading">⚠️ 匯率載入失敗，請稍後重試</div>';
            }
        }
        fetchFX();

        // ===================================================
        // 核心計算邏輯
        // ===================================================
        function calc() {
            const P = parseFloat(els.amount.value) * 10000; // 萬 → 元
            const annualRate = parseFloat(els.rate.value) / 100;
            const r = annualRate / 12; // 月利率
            const totalYears = parseInt(els.years.value);
            const n = totalYears * 12; // 總月數
            const graceMonths = parseInt(els.grace.value);
            const repayMonths = n - graceMonths; // 正式還款月數
            const extra = parseFloat(els.extra.value) || 0;

            if (P <= 0 || r <= 0 || n <= 0 || repayMonths <= 0) return;

            let monthly = 0;
            let totalPay = 0;
            let totalInterest = 0;

            // ---- 原始還款計算（無額外還款）----
            if (currentMethod === 'equalPayment') {
                // 本息均攤
                const rn = Math.pow(1 + r, repayMonths);
                monthly = (P * r * rn) / (rn - 1);

                // 寬限期利息
                const graceInterest = P * r * graceMonths;
                // 正式還款期利息
                totalPay = graceInterest + monthly * repayMonths;
                totalInterest = totalPay - P;
            } else {
                // 本金均攤 (每月本金固定，利息遞減)
                const monthlyPrincipal = P / repayMonths;
                let epBalance = P;

                // 寬限期
                totalPay = P * r * graceMonths;
                totalInterest = totalPay;

                // 正式還款
                let firstMonthTotal = 0;
                for (let i = 0; i < repayMonths; i++) {
                    const interest = epBalance * r;
                    const pay = monthlyPrincipal + interest;
                    totalPay += pay;
                    totalInterest += interest;
                    if (i === 0) firstMonthTotal = pay;
                    epBalance -= monthlyPrincipal;
                }
                monthly = firstMonthTotal; // 顯示第一期金額（最高）
            }

            // ---- 結果顯示 ----
            els.resMonthly.textContent = formatMoney(Math.round(monthly)) + ' 元';
            els.resTotalPay.textContent = formatMoney(Math.round(totalPay)) + ' 元';
            els.resTotalInterest.textContent = formatMoney(Math.round(totalInterest)) + ' 元';
            els.resOrigMonths.textContent = n + ' 期 (' + totalYears + ' 年)';

            // ---- 提前還款模擬 ----
            let balance = P;
            let totalIntPrepay = 0;
            let monthsPrepay = 0;

            // 寬限期
            for (let i = 0; i < graceMonths && balance > 0; i++) {
                const interest = balance * r;
                totalIntPrepay += interest;
                monthsPrepay++;
                // 寬限期也可以額外還本金
                if (extra > 0) {
                    balance = Math.max(0, balance - extra);
                }
            }

            // 正式還款期
            if (currentMethod === 'equalPayment') {
                // 因為餘額可能在寬限期被降低，用調整後餘額重新算月供
                const adjRn = Math.pow(1 + r, repayMonths);
                const adjMonthly = (balance * r * adjRn) / (adjRn - 1);

                while (balance > 0 && monthsPrepay < 600) {
                    const interest = balance * r;
                    totalIntPrepay += interest;
                    let principalPaid = adjMonthly - interest + extra;
                    balance = Math.max(0, balance - principalPaid);
                    monthsPrepay++;
                }
            } else {
                const monthlyPrincipal = balance / Math.max(1, (n - graceMonths));
                let tempBalance = balance;
                while (tempBalance > 0 && monthsPrepay < 600) {
                    const interest = tempBalance * r;
                    totalIntPrepay += interest;
                    tempBalance = Math.max(0, tempBalance - monthlyPrincipal - extra);
                    monthsPrepay++;
                }
            }

            const savedMonths = Math.max(0, n - monthsPrepay);
            const savedInterest = Math.max(0, Math.round(totalInterest - totalIntPrepay));

            els.resPrepayMonths.textContent = monthsPrepay + ' 期';
            els.resSaveYears.textContent = (savedMonths / 12).toFixed(1) + ' 年 (' + savedMonths + ' 期)';
            els.resSaveInterest.textContent = '🔥 ' + formatMoney(savedInterest) + ' 元';

            // ---- 比較條 ----
            els.barOrig.style.width = '100%';
            els.barOrig.textContent = formatMoney(Math.round(totalInterest)) + ' 元';
            els.barPrepay.style.width = Math.round((totalIntPrepay / totalInterest) * 100) + '%';
            els.barPrepay.textContent = formatMoney(Math.round(totalIntPrepay)) + ' 元';

            // ---- 繪製圖表 ----
            drawChart(P, r, n, graceMonths, currentMethod);
        }

        // --- 圖表繪製 ---
        function drawChart(P, r, totalMonths, graceMonths, method) {
            const chart = els.chart;
            chart.innerHTML = '';
            const totalYears = Math.ceil(totalMonths / 12);
            const repayMonths = totalMonths - graceMonths;
            const yearData = [];

            if (method === 'equalPayment') {
                const rn = Math.pow(1 + r, repayMonths);
                const m = (P * r * rn) / (rn - 1);
                let balance = P;
                let yearPrincipal = 0;
                let yearInterest = 0;
                let monthCount = 0;

                for (let i = 0; i < totalMonths; i++) {
                    const interest = balance * r;
                    let principal = 0;
                    if (i < graceMonths) {
                        // 寬限期
                        yearInterest += interest;
                    } else {
                        principal = m - interest;
                        balance = Math.max(0, balance - principal);
                        yearPrincipal += principal;
                        yearInterest += interest;
                    }
                    monthCount++;
                    if (monthCount === 12 || i === totalMonths - 1) {
                        yearData.push({ principal: yearPrincipal, interest: yearInterest });
                        yearPrincipal = 0;
                        yearInterest = 0;
                        monthCount = 0;
                    }
                }
            } else {
                const monthlyP = P / repayMonths;
                let balance = P;
                let yearPrincipal = 0;
                let yearInterest = 0;
                let monthCount = 0;

                for (let i = 0; i < totalMonths; i++) {
                    const interest = balance * r;
                    if (i < graceMonths) {
                        yearInterest += interest;
                    } else {
                        balance = Math.max(0, balance - monthlyP);
                        yearPrincipal += monthlyP;
                        yearInterest += interest;
                    }
                    monthCount++;
                    if (monthCount === 12 || i === totalMonths - 1) {
                        yearData.push({ principal: yearPrincipal, interest: yearInterest });
                        yearPrincipal = 0;
                        yearInterest = 0;
                        monthCount = 0;
                    }
                }
            }

            const maxTotal = Math.max(...yearData.map(d => d.principal + d.interest), 1);

            yearData.forEach((d, i) => {
                const total = d.principal + d.interest;
                const totalH = Math.max((total / maxTotal) * 100, 2);
                const intH = total > 0 ? (d.interest / total) * totalH : 0;
                const prinH = totalH - intH;

                const item = document.createElement('div');
                item.className = 'bar-item';
                item.innerHTML = `
                    <div class="bar-tooltip">第${i + 1}年 本金:${formatMoney(Math.round(d.principal))} 利息:${formatMoney(Math.round(d.interest))}</div>
                    <div class="bar-fill interest" style="height:0%"></div>
                    <div class="bar-fill principal" style="height:0%"></div>
                `;
                chart.appendChild(item);

                // 動畫效果
                setTimeout(() => {
                    item.querySelector('.interest').style.height = intH + '%';
                    item.querySelector('.principal').style.height = prinH + '%';
                }, 50 + i * 30);
            });
        }

        // --- 金額格式化 ---
        function formatMoney(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        // --- 初始計算 ---
        calc();

    }, 0);
};
