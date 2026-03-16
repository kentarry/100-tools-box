window.render_creditInterest = function () {
    container.innerHTML = `
        <style>
            .cr-wrapper {
                max-width: 1100px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }

            /* Hero */
            .cr-hero {
                background: linear-gradient(135deg, #1a0a2e 0%, #5b1a3a 40%, #7f1d1d 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .cr-hero::before {
                content: '';
                position: absolute;
                top: -60%;
                right: -15%;
                width: 450px;
                height: 450px;
                background: radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%);
                border-radius: 50%;
            }
            .cr-hero::after {
                content: '';
                position: absolute;
                bottom: -40%;
                left: -10%;
                width: 350px;
                height: 350px;
                background: radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%);
                border-radius: 50%;
            }
            .cr-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 6px 0;
                position: relative;
                z-index: 1;
            }
            .cr-hero p {
                color: #fda4af;
                font-size: 14px;
                margin: 0;
                position: relative;
                z-index: 1;
                line-height: 1.6;
            }
            .cr-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .cr-hero .hero-badge {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.15);
                color: #e2e8f0;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 大數字結果 */
            .cr-result-hero {
                display: flex;
                gap: 16px;
                margin-top: 24px;
                position: relative;
                z-index: 1;
            }
            @media (max-width: 640px) {
                .cr-result-hero { flex-direction: column; }
            }
            .cr-result-card {
                flex: 1;
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 18px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s;
            }
            .cr-result-card:hover {
                background: rgba(255,255,255,0.14);
                transform: translateY(-3px);
            }
            .cr-result-card .rc-label {
                color: #fda4af;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cr-result-card .rc-value {
                font-size: 32px;
                font-weight: 900;
                margin-top: 6px;
                line-height: 1;
            }
            .cr-result-card .rc-value.danger { color: #fb7185; }
            .cr-result-card .rc-value.warn { color: #fbbf24; }
            .cr-result-card .rc-value.info { color: #60a5fa; }
            .cr-result-card .rc-sub {
                color: #94a3b8;
                font-size: 11px;
                margin-top: 6px;
                font-weight: 600;
            }

            /* 主要 Grid */
            .cr-grid {
                display: grid;
                grid-template-columns: minmax(280px, 380px) 1fr;
                gap: 24px;
            }
            @media (max-width: 860px) {
                .cr-grid { grid-template-columns: 1fr; }
            }

            /* 卡片 */
            .cr-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 28px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                transition: box-shadow 0.3s;
            }
            .cr-card:hover {
                box-shadow: 0 8px 40px rgba(0,0,0,0.08);
            }
            .cr-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 輸入群組 */
            .cr-input-group {
                margin-bottom: 22px;
            }
            .cr-input-group label {
                display: block;
                font-size: 13px;
                font-weight: 700;
                color: #475569;
                margin-bottom: 8px;
            }
            .cr-input-group label .cr-unit {
                font-weight: 400;
                color: #94a3b8;
                font-size: 12px;
            }
            .cr-input-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .cr-input-row input[type="number"] {
                flex: 0 0 100px;
                padding: 8px 10px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 700;
                color: #1e293b;
                outline: none;
                transition: border-color 0.3s;
                text-align: right;
                background: #f8fafc;
                min-width: 0;
            }
            .cr-input-row input[type="number"]:focus {
                border-color: #f43f5e;
                background: #fff;
            }
            .cr-input-row input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: linear-gradient(90deg, #f43f5e, #e11d48);
                border-radius: 10px;
                outline: none;
                cursor: pointer;
            }
            .cr-input-row input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid #e11d48;
                box-shadow: 0 2px 8px rgba(225,29,72,0.3);
                cursor: pointer;
                transition: transform 0.2s;
            }
            .cr-input-row input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            /* 分期期數快捷 */
            .cr-preset-wrap {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 8px;
            }
            .cr-preset-btn {
                padding: 5px 12px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid #fecdd3;
                background: #fff1f2;
                color: #e11d48;
            }
            .cr-preset-btn:hover {
                background: #e11d48;
                color: #fff;
                transform: scale(1.05);
            }

            /* 費率等級 Gauge */
            .cr-gauge-section {
                margin-top: 24px;
            }
            .cr-gauge-track {
                height: 16px;
                border-radius: 10px;
                background: linear-gradient(90deg, #22c55e 0%, #fbbf24 35%, #f97316 55%, #ef4444 75%, #7f1d1d 100%);
                position: relative;
                margin-bottom: 8px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            .cr-gauge-pointer {
                position: absolute;
                top: -6px;
                width: 4px;
                height: 28px;
                background: #1e293b;
                border-radius: 2px;
                transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: 0 0 6px rgba(0,0,0,0.3);
            }
            .cr-gauge-pointer::after {
                content: '';
                position: absolute;
                top: -6px;
                left: -4px;
                width: 12px;
                height: 12px;
                background: #1e293b;
                border-radius: 50%;
            }
            .cr-gauge-labels {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #94a3b8;
                font-weight: 600;
            }
            .cr-gauge-verdict {
                text-align: center;
                margin-top: 12px;
                font-size: 18px;
                font-weight: 800;
                padding: 10px;
                border-radius: 12px;
                transition: all 0.3s;
            }

            /* 明細分析 */
            .cr-breakdown {
                margin-top: 20px;
            }
            .cr-breakdown-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #f1f5f9;
            }
            .cr-breakdown-row:last-child { border-bottom: none; }
            .cr-breakdown-label {
                font-size: 13px;
                color: #64748b;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .cr-breakdown-value {
                font-size: 15px;
                font-weight: 800;
                color: #1e293b;
            }
            .cr-breakdown-value.red { color: #e11d48; }

            /* 比較面板 */
            .cr-compare-panel {
                background: linear-gradient(135deg, #fef2f2, #fff1f2);
                border: 1px solid #fecdd3;
                border-radius: 16px;
                padding: 24px;
                margin-top: 20px;
            }
            .cr-compare-panel h4 {
                margin: 0 0 16px 0;
                font-size: 15px;
                font-weight: 800;
                color: #9f1239;
            }
            .cr-compare-item {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
                padding: 12px;
                background: #fff;
                border-radius: 12px;
                border: 1px solid #fecdd3;
                transition: all 0.2s;
            }
            .cr-compare-item:hover {
                border-color: #f43f5e;
                transform: translateX(4px);
            }
            .cr-compare-item:last-child { margin-bottom: 0; }
            .cr-compare-icon { font-size: 24px; flex-shrink: 0; }
            .cr-compare-info { flex: 1; }
            .cr-compare-name {
                font-size: 13px;
                font-weight: 700;
                color: #334155;
            }
            .cr-compare-rate {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 2px;
            }
            .cr-compare-verdict-tag {
                padding: 4px 10px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 800;
                white-space: nowrap;
            }

            /* 洞察 */
            .cr-insight {
                background: linear-gradient(135deg, #fef9c3, #fef3c7);
                border: 1px solid #fcd34d;
                border-radius: 16px;
                padding: 20px;
                margin-top: 20px;
                line-height: 1.8;
                font-size: 14px;
                color: #78350f;
                font-weight: 600;
            }
            .cr-insight .hi-red { color: #e11d48; font-weight: 800; }
            .cr-insight .hi-green { color: #059669; font-weight: 800; }

            /* 每期明細表 */
            .cr-table-wrap {
                max-height: 340px;
                overflow-y: auto;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin-top: 20px;
            }
            .cr-table-wrap::-webkit-scrollbar { width: 4px; }
            .cr-table-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .cr-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .cr-table th {
                background: #f1f5f9;
                color: #475569;
                font-weight: 700;
                padding: 10px 12px;
                text-align: right;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .cr-table th:first-child { text-align: center; }
            .cr-table td {
                padding: 8px 12px;
                border-top: 1px solid #f1f5f9;
                color: #334155;
                text-align: right;
            }
            .cr-table td:first-child { text-align: center; font-weight: 700; color: #e11d48; }
            .cr-table tr:hover td { background: #fff1f2; }

            /* 圖表 */
            .cr-chart-area {
                display: flex;
                align-items: flex-end;
                gap: 3px;
                height: 180px;
                padding: 12px 8px 8px;
                background: linear-gradient(180deg, #fff1f2 0%, #f8fafc 100%);
                border-radius: 14px;
                border: 1px solid #e2e8f0;
                overflow: hidden;
                position: relative;
            }
            .cr-bar {
                flex: 1;
                border-radius: 4px 4px 0 0;
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                cursor: pointer;
                min-height: 2px;
            }
            .cr-bar:hover { filter: brightness(1.15); }
            .cr-bar .cr-bar-tip {
                display: none;
                position: absolute;
                top: -32px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                color: #fff;
                font-size: 10px;
                padding: 3px 8px;
                border-radius: 6px;
                white-space: nowrap;
                z-index: 5;
            }
            .cr-bar:hover .cr-bar-tip { display: block; }

            /* 動畫 */
            @keyframes crSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .cr-anim { animation: crSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            .cr-anim-d1 { animation-delay: 0.1s; opacity: 0; }
            .cr-anim-d2 { animation-delay: 0.2s; opacity: 0; }
            .cr-anim-d3 { animation-delay: 0.3s; opacity: 0; }
        </style>

        <div class="cr-wrapper">
            <!-- Hero -->
            <div class="cr-hero cr-anim">
                <h2>💳 分期付款「真」利率揭密</h2>
                <p>銀行說手續費只要 0.X%？其實換算成年利率可能高達兩位數！<br>輸入你的分期條件，馬上看穿隱藏的真實成本。</p>
                <div class="hero-badges">
                    <span class="hero-badge">🔍 真實利率還原</span>
                    <span class="hero-badge">📊 費用結構分析</span>
                    <span class="hero-badge">⚡ 利率等級儀表</span>
                    <span class="hero-badge">💡 智慧建議</span>
                </div>

                <!-- 大數字結果 -->
                <div class="cr-result-hero">
                    <div class="cr-result-card">
                        <div class="rc-label">📣 實質年利率</div>
                        <div class="rc-value danger" id="crRealRate">-</div>
                        <div class="rc-sub">IRR 近似計算</div>
                    </div>
                    <div class="cr-result-card">
                        <div class="rc-label">💸 總手續費</div>
                        <div class="rc-value warn" id="crTotalFee">-</div>
                        <div class="rc-sub">全部期數合計</div>
                    </div>
                    <div class="cr-result-card">
                        <div class="rc-label">📦 實際支付</div>
                        <div class="rc-value info" id="crActualPay">-</div>
                        <div class="rc-sub">本金 + 手續費</div>
                    </div>
                </div>
            </div>

            <div class="cr-grid">
                <!-- 左欄 -->
                <div>
                    <div class="cr-card cr-anim cr-anim-d1">
                        <h3>⚙️ 分期條件設定</h3>

                        <!-- 總金額 -->
                        <div class="cr-input-group">
                            <label>消費總金額 <span class="cr-unit">(元)</span></label>
                            <div class="cr-input-row">
                                <input type="range" id="crTotalRange" min="1000" max="500000" step="1000" value="30000">
                                <input type="number" id="crTotal" value="30000" min="1000">
                            </div>
                        </div>

                        <!-- 分期期數 -->
                        <div class="cr-input-group">
                            <label>分期期數 <span class="cr-unit">(月)</span></label>
                            <div class="cr-input-row">
                                <input type="range" id="crMonthsRange" min="2" max="60" step="1" value="12">
                                <input type="number" id="crMonths" value="12" min="2" max="60">
                            </div>
                            <div class="cr-preset-wrap">
                                <button class="cr-preset-btn" data-months="3">3 期</button>
                                <button class="cr-preset-btn" data-months="6">6 期</button>
                                <button class="cr-preset-btn" data-months="12">12 期</button>
                                <button class="cr-preset-btn" data-months="18">18 期</button>
                                <button class="cr-preset-btn" data-months="24">24 期</button>
                                <button class="cr-preset-btn" data-months="36">36 期</button>
                            </div>
                        </div>

                        <!-- 每期手續費 -->
                        <div class="cr-input-group">
                            <label>每期手續費 <span class="cr-unit">(元)</span></label>
                            <div class="cr-input-row">
                                <input type="range" id="crFeeRange" min="0" max="5000" step="10" value="200">
                                <input type="number" id="crFee" value="200" min="0">
                            </div>
                        </div>

                        <!-- 利率等級儀表 -->
                        <div class="cr-gauge-section">
                            <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:10px;">💡 利率水位</div>
                            <div class="cr-gauge-track">
                                <div class="cr-gauge-pointer" id="crPointer" style="left:0%"></div>
                            </div>
                            <div class="cr-gauge-labels">
                                <span>0%</span>
                                <span>5%</span>
                                <span>10%</span>
                                <span>15%</span>
                                <span>20%+</span>
                            </div>
                            <div class="cr-gauge-verdict" id="crVerdict">-</div>
                        </div>
                    </div>
                </div>

                <!-- 右欄 -->
                <div>
                    <!-- 費用明細 -->
                    <div class="cr-card cr-anim cr-anim-d2">
                        <h3>📋 費用結構分析</h3>

                        <div class="cr-breakdown" id="crBreakdown"></div>

                        <!-- 每期條形圖 -->
                        <div style="margin-top:20px;">
                            <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:10px;">📊 每期還款金額</div>
                            <div class="cr-chart-area" id="crChart"></div>
                        </div>

                        <!-- 洞察 -->
                        <div class="cr-insight" id="crInsight"></div>
                    </div>

                    <!-- 比較面板 -->
                    <div class="cr-card cr-anim cr-anim-d3" style="margin-top:24px;">
                        <h3>🏦 利率行情對照</h3>
                        <div class="cr-compare-panel">
                            <h4>⚡ 你的分期利率 vs 市場利率</h4>
                            <div id="crCompareList"></div>
                        </div>
                    </div>

                    <!-- 每期明細 -->
                    <div class="cr-card cr-anim cr-anim-d3" style="margin-top:24px;">
                        <h3>📑 每期還款明細</h3>
                        <div class="cr-table-wrap">
                            <table class="cr-table">
                                <thead>
                                    <tr>
                                        <th>期數</th>
                                        <th>每期本金</th>
                                        <th>每期手續費</th>
                                        <th>每期總繳</th>
                                        <th>累計已繳</th>
                                    </tr>
                                </thead>
                                <tbody id="crTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // ===== 初始化邏輯 =====
    setTimeout(() => {
        const els = {
            totalRange: document.getElementById('crTotalRange'),
            total: document.getElementById('crTotal'),
            monthsRange: document.getElementById('crMonthsRange'),
            months: document.getElementById('crMonths'),
            feeRange: document.getElementById('crFeeRange'),
            fee: document.getElementById('crFee'),
            realRate: document.getElementById('crRealRate'),
            totalFee: document.getElementById('crTotalFee'),
            actualPay: document.getElementById('crActualPay'),
            pointer: document.getElementById('crPointer'),
            verdict: document.getElementById('crVerdict'),
            breakdown: document.getElementById('crBreakdown'),
            chart: document.getElementById('crChart'),
            insight: document.getElementById('crInsight'),
            compareList: document.getElementById('crCompareList'),
            tableBody: document.getElementById('crTableBody'),
        };

        // --- 滑桿同步 ---
        function syncPair(range, num) {
            range.addEventListener('input', () => { num.value = range.value; calc(); });
            num.addEventListener('input', () => { range.value = num.value; calc(); });
        }
        syncPair(els.totalRange, els.total);
        syncPair(els.monthsRange, els.months);
        syncPair(els.feeRange, els.fee);

        // --- 預設期數按鈕 ---
        document.querySelectorAll('.cr-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const n = parseInt(btn.dataset.months);
                els.months.value = n;
                els.monthsRange.value = n;
                calc();
            });
        });

        // --- 格式化 ---
        function fmt(num) { return Math.round(num).toLocaleString('zh-TW'); }

        // ===== 計算 =====
        function calc() {
            const P = parseFloat(els.total.value) || 0;
            const n = parseInt(els.months.value) || 1;
            const feePerMonth = parseFloat(els.fee.value) || 0;

            if (P <= 0 || n <= 0) return;

            const totalFee = feePerMonth * n;
            const actualPay = P + totalFee;
            const monthlyPrincipal = P / n;
            const monthlyTotal = monthlyPrincipal + feePerMonth;

            // IRR 近似：真實年利率 (N期等額攤還的手續費率轉換)
            // 使用精確公式: rate = (2 * n * feePerMonth) / (P * (n + 1)) * 12
            const monthlyRate = (2 * n * feePerMonth) / (P * (n + 1));
            const annualRate = monthlyRate * 12 * 100;
            const feeRatio = (totalFee / P) * 100;

            // --- 大數字結果 ---
            els.realRate.textContent = annualRate.toFixed(2) + '%';
            els.totalFee.textContent = fmt(totalFee) + ' 元';
            els.actualPay.textContent = fmt(actualPay) + ' 元';

            // --- 利率儀表 ---
            const pointerPct = Math.min((annualRate / 22) * 100, 98);
            els.pointer.style.left = pointerPct + '%';

            let verdictText, verdictStyle;
            if (annualRate <= 3) {
                verdictText = '✅ 極優利率！比許多房貸還低';
                verdictStyle = 'background:#dcfce7;color:#166534;';
            } else if (annualRate <= 6) {
                verdictText = '👍 合理範圍，可接受';
                verdictStyle = 'background:#ecfdf5;color:#065f46;';
            } else if (annualRate <= 10) {
                verdictText = '⚠️ 偏高！建議比較其他方案';
                verdictStyle = 'background:#fef9c3;color:#854d0e;';
            } else if (annualRate <= 15) {
                verdictText = '🔥 很高！接近信用卡循環利率';
                verdictStyle = 'background:#fee2e2;color:#991b1b;';
            } else {
                verdictText = '🚨 極高！強烈建議不要分期';
                verdictStyle = 'background:#fecdd3;color:#7f1d1d;';
            }
            els.verdict.textContent = verdictText;
            els.verdict.style.cssText = verdictStyle + 'text-align:center;margin-top:12px;font-size:14px;font-weight:800;padding:10px;border-radius:12px;';

            // --- 費用明細 ---
            els.breakdown.innerHTML = `
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">🏷️ 消費總金額</span>
                    <span class="cr-breakdown-value">${fmt(P)} 元</span>
                </div>
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">📅 分期${n}期 每期本金</span>
                    <span class="cr-breakdown-value">${fmt(monthlyPrincipal)} 元</span>
                </div>
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">💸 每期手續費</span>
                    <span class="cr-breakdown-value red">${fmt(feePerMonth)} 元</span>
                </div>
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">💰 每期應繳總額</span>
                    <span class="cr-breakdown-value">${fmt(monthlyTotal)} 元</span>
                </div>
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">📊 手續費占比</span>
                    <span class="cr-breakdown-value red">${feeRatio.toFixed(2)}%</span>
                </div>
                <div class="cr-breakdown-row">
                    <span class="cr-breakdown-label">📣 實質年利率 (IRR)</span>
                    <span class="cr-breakdown-value red" style="font-size:18px;">${annualRate.toFixed(2)}%</span>
                </div>
            `;

            // --- 每期圖表 ---
            drawChart(n, monthlyPrincipal, feePerMonth);

            // --- 洞察 ---
            const savingRate = 1.5;
            const savingInterest = P * (savingRate / 100) * (n / 12);
            els.insight.innerHTML = `
                💡 你用 <span class="hi-red">${n} 期</span> 分期購買 <span class="hi-red">${fmt(P)} 元</span> 的商品，
                總共要多付 <span class="hi-red">${fmt(totalFee)} 元</span> 手續費，
                實質年利率高達 <span class="hi-red">${annualRate.toFixed(2)}%</span>。<br>
                📌 同樣這筆錢如果存定存 (${savingRate}%)，${n} 個月可賺 <span class="hi-green">${fmt(savingInterest)} 元利息</span>。
                ${annualRate > 10 ? '<br>⚠️ <strong>建議：</strong>利率已超過 10%，如果可以一次付清，強烈建議避免分期！' : ''}
            `;

            // --- 市場利率對照 ---
            const comparisons = [
                { icon: '🏦', name: '銀行定存', rate: '1.5%', rateNum: 1.5 },
                { icon: '🏠', name: '房貸利率', rate: '2.0~2.3%', rateNum: 2.15 },
                { icon: '💳', name: '信用卡分期', rate: '5~12%', rateNum: 8.5 },
                { icon: '🔴', name: '信用卡循環利息', rate: '7~15%', rateNum: 12 },
                { icon: '⚡', name: '小額信貸', rate: '3~8%', rateNum: 5.5 },
            ];
            els.compareList.innerHTML = comparisons.map(c => {
                let tagColor, tagText;
                if (annualRate <= c.rateNum * 0.8) {
                    tagColor = 'background:#dcfce7;color:#166534;';
                    tagText = '更低 ✓';
                } else if (annualRate <= c.rateNum * 1.2) {
                    tagColor = 'background:#fef9c3;color:#854d0e;';
                    tagText = '相近';
                } else {
                    tagColor = 'background:#fee2e2;color:#991b1b;';
                    tagText = '更高 ✗';
                }
                return `
                    <div class="cr-compare-item">
                        <span class="cr-compare-icon">${c.icon}</span>
                        <div class="cr-compare-info">
                            <div class="cr-compare-name">${c.name}</div>
                            <div class="cr-compare-rate">一般範圍 ${c.rate}</div>
                        </div>
                        <span class="cr-compare-verdict-tag" style="${tagColor}">${tagText}</span>
                    </div>
                `;
            }).join('');

            // --- 每期明細表 ---
            let cumulative = 0;
            els.tableBody.innerHTML = Array.from({ length: n }, (_, i) => {
                cumulative += monthlyTotal;
                return `<tr>
                    <td>${i + 1}</td>
                    <td>${fmt(monthlyPrincipal)}</td>
                    <td style="color:#e11d48;font-weight:700;">${fmt(feePerMonth)}</td>
                    <td>${fmt(monthlyTotal)}</td>
                    <td style="font-weight:700;color:#475569;">${fmt(cumulative)}</td>
                </tr>`;
            }).join('');
        }

        // --- 圖表 ---
        function drawChart(n, principal, fee) {
            const chart = els.chart;
            chart.innerHTML = '';
            const monthlyTotal = principal + fee;

            for (let i = 0; i < n; i++) {
                const bar = document.createElement('div');
                bar.className = 'cr-bar';
                // 本金部分用主色，手續費部分用紅色
                const feePct = fee > 0 ? (fee / monthlyTotal) * 100 : 0;
                bar.style.background = `linear-gradient(to top, #818cf8 ${100 - feePct}%, #f43f5e ${100 - feePct}%)`;
                bar.style.height = '0%';
                bar.innerHTML = `<span class="cr-bar-tip">第${i + 1}期 ${fmt(monthlyTotal)}元</span>`;
                chart.appendChild(bar);

                setTimeout(() => {
                    bar.style.height = '90%';
                }, 50 + i * 15);
            }
        }

        // --- 初始計算 ---
        calc();

    }, 0);
};
