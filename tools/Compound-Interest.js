window.render_compoundInterest = function () {
    container.innerHTML = `
        <style>
            .ci-wrapper {
                max-width: 1100px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }

            /* Hero 區塊 */
            .ci-hero {
                background: linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #1e3a5f 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .ci-hero::before {
                content: '';
                position: absolute;
                top: -60%;
                right: -15%;
                width: 450px;
                height: 450px;
                background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
                border-radius: 50%;
            }
            .ci-hero::after {
                content: '';
                position: absolute;
                bottom: -40%;
                left: -10%;
                width: 350px;
                height: 350px;
                background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
                border-radius: 50%;
            }
            .ci-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 6px 0;
                position: relative;
                z-index: 1;
            }
            .ci-hero p {
                color: #a5b4fc;
                font-size: 14px;
                margin: 0;
                position: relative;
                z-index: 1;
            }
            .ci-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .ci-hero .hero-badge {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.15);
                color: #e2e8f0;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 即時摘要卡片 */
            .ci-summary-bar {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                margin-top: 20px;
                position: relative;
                z-index: 1;
            }
            @media (max-width: 768px) {
                .ci-summary-bar { grid-template-columns: repeat(2, 1fr); }
            }
            .ci-sum-card {
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 16px;
                padding: 16px;
                text-align: center;
                transition: all 0.3s;
            }
            .ci-sum-card:hover {
                background: rgba(255,255,255,0.14);
                transform: translateY(-3px);
            }
            .ci-sum-card .sum-icon {
                font-size: 22px;
                margin-bottom: 6px;
            }
            .ci-sum-card .sum-label {
                color: #a5b4fc;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .ci-sum-card .sum-value {
                color: #fff;
                font-size: 20px;
                font-weight: 800;
                margin-top: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .ci-sum-card .sum-value.green { color: #34d399; }
            .ci-sum-card .sum-value.purple { color: #c084fc; }
            .ci-sum-card .sum-value.amber { color: #fbbf24; }
            .ci-sum-card .sum-value.blue { color: #60a5fa; }

            /* 主內容 Grid */
            .ci-grid {
                display: grid;
                grid-template-columns: minmax(280px, 380px) 1fr;
                gap: 24px;
            }
            @media (max-width: 860px) {
                .ci-grid { grid-template-columns: 1fr; }
            }

            /* 玻璃卡片 */
            .ci-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 28px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                transition: box-shadow 0.3s;
            }
            .ci-card:hover {
                box-shadow: 0 8px 40px rgba(0,0,0,0.08);
            }
            .ci-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 輸入群組 */
            .ci-input-group {
                margin-bottom: 22px;
            }
            .ci-input-group label {
                display: block;
                font-size: 13px;
                font-weight: 700;
                color: #475569;
                margin-bottom: 8px;
            }
            .ci-input-group label .ci-unit {
                font-weight: 400;
                color: #94a3b8;
                font-size: 12px;
            }
            .ci-input-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .ci-input-row input[type="number"] {
                flex: 0 0 90px;
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
            .ci-input-row input[type="number"]:focus {
                border-color: #8b5cf6;
                background: #fff;
            }
            .ci-input-row input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: linear-gradient(90deg, #8b5cf6, #6366f1);
                border-radius: 10px;
                outline: none;
                cursor: pointer;
            }
            .ci-input-row input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid #7c3aed;
                box-shadow: 0 2px 8px rgba(124,58,237,0.3);
                cursor: pointer;
                transition: transform 0.2s;
            }
            .ci-input-row input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
            }

            /* 切換按鈕 */
            .ci-toggle-group {
                display: flex;
                background: #f1f5f9;
                border-radius: 12px;
                padding: 4px;
                margin-bottom: 20px;
            }
            .ci-toggle-btn {
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
            .ci-toggle-btn.active {
                background: #fff;
                color: #7c3aed;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            /* 圖表區 */
            .ci-chart-wrap {
                position: relative;
            }
            .ci-chart-area {
                display: flex;
                align-items: flex-end;
                gap: 3px;
                height: 280px;
                padding: 16px 8px 8px;
                background: linear-gradient(180deg, #faf5ff 0%, #f8fafc 100%);
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                overflow: hidden;
                position: relative;
            }
            /* 水平參考線 */
            .ci-chart-area::before,
            .ci-chart-area::after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                border-top: 1px dashed rgba(139,92,246,0.15);
                pointer-events: none;
            }
            .ci-chart-area::before { top: 25%; }
            .ci-chart-area::after { top: 50%; }

            .ci-bar-group {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                height: 100%;
                position: relative;
                cursor: pointer;
            }
            .ci-bar-stack {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                position: relative;
            }
            .ci-bar-segment {
                width: 100%;
                border-radius: 4px 4px 0 0;
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                min-height: 1px;
            }
            .ci-bar-segment.principal {
                background: linear-gradient(to top, #7c3aed, #a78bfa);
                border-radius: 0;
            }
            .ci-bar-segment.interest {
                background: linear-gradient(to top, #f59e0b, #fbbf24);
                border-radius: 4px 4px 0 0;
            }
            .ci-bar-group:hover .ci-bar-segment {
                filter: brightness(1.15);
            }
            .ci-bar-group .ci-bar-tooltip {
                display: none;
                position: absolute;
                top: -48px;
                left: 50%;
                transform: translateX(-50%);
                background: #1e293b;
                color: #fff;
                font-size: 11px;
                padding: 6px 12px;
                border-radius: 8px;
                white-space: nowrap;
                z-index: 5;
                pointer-events: none;
                line-height: 1.5;
                text-align: center;
            }
            .ci-bar-group:hover .ci-bar-tooltip {
                display: block;
            }
            .ci-chart-legend {
                display: flex;
                justify-content: center;
                gap: 28px;
                margin-top: 14px;
                font-size: 12px;
                color: #64748b;
                font-weight: 600;
            }
            .ci-chart-legend span::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 3px;
                margin-right: 6px;
                vertical-align: middle;
            }
            .ci-chart-legend .leg-principal::before { background: #8b5cf6; }
            .ci-chart-legend .leg-interest::before { background: #fbbf24; }
            .ci-chart-legend .leg-total::before { background: linear-gradient(135deg, #8b5cf6, #fbbf24); border-radius: 50%; }

            /* 里程碑面板 */
            .ci-milestone-panel {
                margin-top: 24px;
            }
            .ci-milestone-panel h4 {
                font-size: 14px;
                font-weight: 700;
                color: #334155;
                margin: 0 0 12px 0;
            }
            .ci-milestone-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .ci-milestone-item {
                display: flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, #faf5ff, #eef2ff);
                border: 1px solid #e0e7ff;
                border-radius: 12px;
                padding: 12px 16px;
                transition: all 0.2s;
            }
            .ci-milestone-item:hover {
                transform: translateX(4px);
                border-color: #a78bfa;
            }
            .ci-milestone-item .ms-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            .ci-milestone-item .ms-text {
                font-size: 13px;
                color: #475569;
                font-weight: 600;
            }
            .ci-milestone-item .ms-value {
                margin-left: auto;
                font-size: 14px;
                font-weight: 800;
                color: #7c3aed;
                white-space: nowrap;
            }

            /* 比較面板 */
            .ci-compare-panel {
                background: linear-gradient(135deg, #fef3c7, #fef9c3);
                border: 1px solid #fcd34d;
                border-radius: 16px;
                padding: 24px;
                margin-top: 20px;
            }
            .ci-compare-panel h4 {
                margin: 0 0 16px 0;
                font-size: 15px;
                font-weight: 800;
                color: #92400e;
            }
            .ci-compare-bar-row { margin-bottom: 14px; }
            .ci-compare-bar-label {
                font-size: 12px;
                color: #78350f;
                font-weight: 600;
                margin-bottom: 4px;
                display: flex;
                justify-content: space-between;
            }
            .ci-compare-bar-track {
                height: 28px;
                background: #fef3c7;
                border-radius: 8px;
                position: relative;
                overflow: hidden;
                border: 1px solid #fcd34d;
            }
            .ci-compare-bar-fill {
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
            .ci-compare-bar-fill.deposit { background: linear-gradient(90deg, #7c3aed, #a78bfa); }
            .ci-compare-bar-fill.total { background: linear-gradient(90deg, #059669, #34d399); }

            /* 結果說明區 */
            .ci-insight-box {
                background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
                border: 1px solid #a7f3d0;
                border-radius: 16px;
                padding: 20px;
                margin-top: 20px;
                line-height: 1.8;
                font-size: 14px;
                color: #065f46;
                font-weight: 600;
            }
            .ci-insight-box .insight-highlight {
                color: #7c3aed;
                font-weight: 800;
            }
            .ci-insight-box .insight-green {
                color: #059669;
                font-weight: 800;
            }

            /* 年度明細表 */
            .ci-detail-table-wrap {
                max-height: 360px;
                overflow-y: auto;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin-top: 20px;
            }
            .ci-detail-table-wrap::-webkit-scrollbar { width: 4px; }
            .ci-detail-table-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .ci-detail-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .ci-detail-table th {
                background: #f1f5f9;
                color: #475569;
                font-weight: 700;
                padding: 12px 14px;
                text-align: right;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            .ci-detail-table th:first-child { text-align: center; }
            .ci-detail-table td {
                padding: 10px 14px;
                border-top: 1px solid #f1f5f9;
                color: #334155;
                text-align: right;
                transition: background 0.2s;
            }
            .ci-detail-table td:first-child {
                text-align: center;
                font-weight: 700;
                color: #7c3aed;
            }
            .ci-detail-table tr:hover td {
                background: #faf5ff;
            }

            /* 動畫 */
            @keyframes ciSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .ci-anim { animation: ciSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            .ci-anim-d1 { animation-delay: 0.1s; opacity: 0; }
            .ci-anim-d2 { animation-delay: 0.2s; opacity: 0; }
            .ci-anim-d3 { animation-delay: 0.3s; opacity: 0; }
        </style>

        <div class="ci-wrapper">
            <!-- Hero -->
            <div class="ci-hero ci-anim">
                <h2>📈 定期定額複利試算器</h2>
                <p>視覺化您的財富增長曲線 — 小額定投也能滾出大財富</p>
                <div class="hero-badges">
                    <span class="hero-badge">💰 定期定額</span>
                    <span class="hero-badge">📊 複利成長圖表</span>
                    <span class="hero-badge">🎯 里程碑追蹤</span>
                    <span class="hero-badge">⚡ 即時試算</span>
                </div>
                <!-- 摘要卡片 -->
                <div class="ci-summary-bar">
                    <div class="ci-sum-card">
                        <div class="sum-icon">💰</div>
                        <div class="sum-label">總投入本金</div>
                        <div class="sum-value purple" id="ciSumDeposit">-</div>
                    </div>
                    <div class="ci-sum-card">
                        <div class="sum-icon">📈</div>
                        <div class="sum-label">投資收益</div>
                        <div class="sum-value amber" id="ciSumProfit">-</div>
                    </div>
                    <div class="ci-sum-card">
                        <div class="sum-icon">🏆</div>
                        <div class="sum-label">資產終值</div>
                        <div class="sum-value green" id="ciSumTotal">-</div>
                    </div>
                    <div class="ci-sum-card">
                        <div class="sum-icon">🔥</div>
                        <div class="sum-label">報酬倍數</div>
                        <div class="sum-value blue" id="ciSumMultiple">-</div>
                    </div>
                </div>
            </div>

            <div class="ci-grid">
                <!-- 左欄：輸入區 -->
                <div>
                    <div class="ci-card ci-anim ci-anim-d1">
                        <h3>⚙️ 投資參數設定</h3>

                        <!-- 投資模式 -->
                        <div class="ci-toggle-group" id="ciModeToggle">
                            <button class="ci-toggle-btn active" data-mode="monthly">定期定額</button>
                            <button class="ci-toggle-btn" data-mode="lumpsum">單筆投入</button>
                        </div>

                        <!-- 每月投入 -->
                        <div class="ci-input-group" id="ciMonthlyGroup">
                            <label>每月投入金額 <span class="ci-unit">(元)</span></label>
                            <div class="ci-input-row">
                                <input type="range" id="ciMonthlyRange" min="1000" max="100000" step="1000" value="10000">
                                <input type="number" id="ciMonthly" value="10000" min="1000">
                            </div>
                        </div>

                        <!-- 初始本金 -->
                        <div class="ci-input-group" id="ciLumpsumGroup" style="display:none;">
                            <label>單筆投入金額 <span class="ci-unit">(萬元)</span></label>
                            <div class="ci-input-row">
                                <input type="range" id="ciLumpsumRange" min="1" max="1000" step="1" value="100">
                                <input type="number" id="ciLumpsum" value="100" min="1">
                            </div>
                        </div>

                        <!-- 年報酬率 -->
                        <div class="ci-input-group">
                            <label>預期年報酬率 <span class="ci-unit">(%)</span></label>
                            <div class="ci-input-row">
                                <input type="range" id="ciRateRange" min="1" max="20" step="0.1" value="7">
                                <input type="number" id="ciRate" value="7" min="0.1" step="0.1">
                            </div>
                        </div>

                        <!-- 投資年數 -->
                        <div class="ci-input-group">
                            <label>投資年數 <span class="ci-unit">(年)</span></label>
                            <div class="ci-input-row">
                                <input type="range" id="ciYearsRange" min="1" max="50" step="1" value="20">
                                <input type="number" id="ciYears" value="20" min="1" max="50">
                            </div>
                        </div>

                        <!-- 常見報酬參考 -->
                        <div style="margin-top: 8px;">
                            <div style="font-size:12px; color:#94a3b8; font-weight:600; margin-bottom:8px;">📌 常見投資報酬參考</div>
                            <div style="display:flex; flex-wrap:wrap; gap:6px;" id="ciPresetBtns">
                                <button class="ci-preset-btn" data-rate="2" style="background:#ecfdf5;color:#059669;border:1px solid #a7f3d0;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;">定存 2%</button>
                                <button class="ci-preset-btn" data-rate="5" style="background:#ede9fe;color:#7c3aed;border:1px solid #c4b5fd;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;">債券 5%</button>
                                <button class="ci-preset-btn" data-rate="7" style="background:#fef3c7;color:#d97706;border:1px solid #fcd34d;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;">ETF 7%</button>
                                <button class="ci-preset-btn" data-rate="10" style="background:#fce7f3;color:#db2777;border:1px solid #f9a8d4;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;">股票 10%</button>
                                <button class="ci-preset-btn" data-rate="15" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;">積極 15%</button>
                            </div>
                        </div>
                    </div>

                    <!-- 里程碑 -->
                    <div class="ci-card ci-anim ci-anim-d2" style="margin-top:24px;">
                        <h3>🎯 財富里程碑</h3>
                        <div class="ci-milestone-list" id="ciMilestones"></div>
                    </div>
                </div>

                <!-- 右欄：圖表與結果 -->
                <div>
                    <!-- 圖表 -->
                    <div class="ci-card ci-anim ci-anim-d2">
                        <h3>📊 資產成長曲線</h3>
                        <div class="ci-chart-wrap">
                            <div class="ci-chart-area" id="ciChart"></div>
                            <div class="ci-chart-legend">
                                <span class="leg-principal">累計投入</span>
                                <span class="leg-interest">投資收益</span>
                            </div>
                        </div>

                        <!-- 比較面板 -->
                        <div class="ci-compare-panel">
                            <h4>⚡ 複利 vs 純儲蓄 效益對比</h4>
                            <div class="ci-compare-bar-row">
                                <div class="ci-compare-bar-label">
                                    <span>純儲蓄（0% 報酬）</span>
                                    <span id="ciCompareDeposit">-</span>
                                </div>
                                <div class="ci-compare-bar-track">
                                    <div class="ci-compare-bar-fill deposit" id="ciBarDeposit"></div>
                                </div>
                            </div>
                            <div class="ci-compare-bar-row">
                                <div class="ci-compare-bar-label">
                                    <span>複利投資</span>
                                    <span id="ciCompareTotal">-</span>
                                </div>
                                <div class="ci-compare-bar-track">
                                    <div class="ci-compare-bar-fill total" id="ciBarTotal"></div>
                                </div>
                            </div>
                        </div>

                        <!-- 洞察 -->
                        <div class="ci-insight-box" id="ciInsight"></div>
                    </div>

                    <!-- 年度明細 -->
                    <div class="ci-card ci-anim ci-anim-d3" style="margin-top:24px;">
                        <h3>📋 年度明細表</h3>
                        <div class="ci-detail-table-wrap">
                            <table class="ci-detail-table">
                                <thead>
                                    <tr>
                                        <th>年</th>
                                        <th>累計投入</th>
                                        <th>累計收益</th>
                                        <th>資產總額</th>
                                        <th>報酬率</th>
                                    </tr>
                                </thead>
                                <tbody id="ciTableBody"></tbody>
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
            monthlyRange: document.getElementById('ciMonthlyRange'),
            monthly: document.getElementById('ciMonthly'),
            lumpsumRange: document.getElementById('ciLumpsumRange'),
            lumpsum: document.getElementById('ciLumpsum'),
            rateRange: document.getElementById('ciRateRange'),
            rate: document.getElementById('ciRate'),
            yearsRange: document.getElementById('ciYearsRange'),
            years: document.getElementById('ciYears'),
            chart: document.getElementById('ciChart'),
            tableBody: document.getElementById('ciTableBody'),
            milestones: document.getElementById('ciMilestones'),
            sumDeposit: document.getElementById('ciSumDeposit'),
            sumProfit: document.getElementById('ciSumProfit'),
            sumTotal: document.getElementById('ciSumTotal'),
            sumMultiple: document.getElementById('ciSumMultiple'),
            barDeposit: document.getElementById('ciBarDeposit'),
            barTotal: document.getElementById('ciBarTotal'),
            compareDeposit: document.getElementById('ciCompareDeposit'),
            compareTotal: document.getElementById('ciCompareTotal'),
            insight: document.getElementById('ciInsight'),
            monthlyGroup: document.getElementById('ciMonthlyGroup'),
            lumpsumGroup: document.getElementById('ciLumpsumGroup'),
        };

        let currentMode = 'monthly';

        // --- 滑桿同步 ---
        function syncPair(range, num) {
            range.addEventListener('input', () => { num.value = range.value; calc(); });
            num.addEventListener('input', () => { range.value = num.value; calc(); });
        }
        syncPair(els.monthlyRange, els.monthly);
        syncPair(els.lumpsumRange, els.lumpsum);
        syncPair(els.rateRange, els.rate);
        syncPair(els.yearsRange, els.years);

        // --- 模式切換 ---
        document.querySelectorAll('#ciModeToggle .ci-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#ciModeToggle .ci-toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                els.monthlyGroup.style.display = currentMode === 'monthly' ? 'block' : 'none';
                els.lumpsumGroup.style.display = currentMode === 'lumpsum' ? 'block' : 'none';
                calc();
            });
        });

        // --- 預設報酬按鈕 ---
        document.querySelectorAll('.ci-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = parseFloat(btn.dataset.rate);
                els.rate.value = r;
                els.rateRange.value = r;
                calc();
            });
        });

        // --- 格式化金額 ---
        function fmtMoney(num) {
            return Math.round(num).toLocaleString('zh-TW');
        }

        function fmtShort(num) {
            if (num >= 100000000) return (num / 100000000).toFixed(2) + ' 億';
            if (num >= 10000) return (num / 10000).toFixed(1) + ' 萬';
            return Math.round(num).toLocaleString('zh-TW');
        }

        // ===== 主計算 =====
        function calc() {
            const annualRate = parseFloat(els.rate.value) / 100;
            const r = annualRate / 12;
            const years = parseInt(els.years.value);

            if (years <= 0 || annualRate < 0) return;

            const yearData = []; // { year, deposit, total, interest }
            let totalValue = 0;
            let totalDeposit = 0;

            if (currentMode === 'monthly') {
                const m = parseFloat(els.monthly.value) || 0;
                for (let y = 1; y <= years; y++) {
                    for (let mo = 0; mo < 12; mo++) {
                        totalValue = (totalValue + m) * (1 + r);
                        totalDeposit += m;
                    }
                    yearData.push({
                        year: y,
                        deposit: totalDeposit,
                        total: totalValue,
                        interest: totalValue - totalDeposit
                    });
                }
            } else {
                const lump = parseFloat(els.lumpsum.value) * 10000 || 0;
                totalDeposit = lump;
                totalValue = lump;
                for (let y = 1; y <= years; y++) {
                    totalValue = totalValue * (1 + annualRate);
                    yearData.push({
                        year: y,
                        deposit: totalDeposit,
                        total: totalValue,
                        interest: totalValue - totalDeposit
                    });
                }
            }

            const finalTotal = totalValue;
            const finalDeposit = totalDeposit;
            const finalProfit = finalTotal - finalDeposit;
            const multiple = finalDeposit > 0 ? (finalTotal / finalDeposit) : 0;

            // --- 摘要卡片更新 ---
            els.sumDeposit.textContent = fmtShort(finalDeposit);
            els.sumProfit.textContent = fmtShort(finalProfit);
            els.sumTotal.textContent = fmtShort(finalTotal);
            els.sumMultiple.textContent = multiple.toFixed(2) + 'x';

            // --- 比較面板 ---
            const maxVal = Math.max(finalTotal, finalDeposit, 1);
            const depositPct = Math.round((finalDeposit / maxVal) * 100);
            const totalPct = 100;
            els.barDeposit.style.width = depositPct + '%';
            els.barDeposit.textContent = fmtShort(finalDeposit);
            els.barTotal.style.width = totalPct + '%';
            els.barTotal.textContent = fmtShort(finalTotal);
            els.compareDeposit.textContent = fmtMoney(finalDeposit) + ' 元';
            els.compareTotal.textContent = fmtMoney(finalTotal) + ' 元';

            // --- 洞察文字 ---
            els.insight.innerHTML = `
                💡 若以年報酬 <span class="insight-highlight">${annualRate * 100}%</span> 持續投資 <span class="insight-highlight">${years} 年</span>，
                您的總投入為 <span class="insight-highlight">${fmtShort(finalDeposit)}</span>，
                透過複利效果，資產將成長至 <span class="insight-green">${fmtShort(finalTotal)}</span>。
                其中投資收益為 <span class="insight-green">${fmtShort(finalProfit)}</span>，
                等於您每投入 1 元，就能變成 <span class="insight-highlight">${multiple.toFixed(2)} 元</span>！
            `;

            // --- 圖表繪製 ---
            drawChart(yearData);

            // --- 年度明細表 ---
            drawTable(yearData);

            // --- 里程碑 ---
            drawMilestones(yearData);
        }

        // --- 圖表 ---
        function drawChart(yearData) {
            const chart = els.chart;
            chart.innerHTML = '';
            const maxTotal = Math.max(...yearData.map(d => d.total), 1);

            yearData.forEach((d, i) => {
                const totalH = Math.max((d.total / maxTotal) * 100, 2);
                const depositH = d.total > 0 ? (d.deposit / d.total) * totalH : 0;
                const interestH = totalH - depositH;

                const group = document.createElement('div');
                group.className = 'ci-bar-group';
                group.innerHTML = `
                    <div class="ci-bar-tooltip">
                        第${d.year}年<br>
                        投入: ${fmtMoney(d.deposit)}<br>
                        收益: ${fmtMoney(d.interest)}
                    </div>
                    <div class="ci-bar-segment interest" style="height:0%"></div>
                    <div class="ci-bar-segment principal" style="height:0%"></div>
                `;
                chart.appendChild(group);

                // 動畫
                setTimeout(() => {
                    group.querySelector('.interest').style.height = interestH + '%';
                    group.querySelector('.principal').style.height = depositH + '%';
                }, 50 + i * 20);
            });
        }

        // --- 年度明細表 ---
        function drawTable(yearData) {
            els.tableBody.innerHTML = yearData.map(d => {
                const roi = d.deposit > 0 ? ((d.interest / d.deposit) * 100).toFixed(1) : '0.0';
                return `<tr>
                    <td>${d.year}</td>
                    <td>${fmtMoney(d.deposit)}</td>
                    <td>${fmtMoney(d.interest)}</td>
                    <td style="font-weight:800;color:#059669;">${fmtMoney(d.total)}</td>
                    <td style="color:#7c3aed;font-weight:700;">${roi}%</td>
                </tr>`;
            }).join('');
        }

        // --- 里程碑 ---
        function drawMilestones(yearData) {
            const milestoneTargets = [
                { amount: 1000000, label: '100 萬', icon: '🥉' },
                { amount: 3000000, label: '300 萬', icon: '🥈' },
                { amount: 5000000, label: '500 萬', icon: '🥇' },
                { amount: 10000000, label: '1,000 萬', icon: '💎' },
                { amount: 30000000, label: '3,000 萬', icon: '👑' },
                { amount: 100000000, label: '1 億', icon: '🏆' },
            ];

            let html = '';
            milestoneTargets.forEach(ms => {
                const hit = yearData.find(d => d.total >= ms.amount);
                if (hit) {
                    html += `
                        <div class="ci-milestone-item">
                            <span class="ms-icon">${ms.icon}</span>
                            <span class="ms-text">突破 ${ms.label}</span>
                            <span class="ms-value">第 ${hit.year} 年</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="ci-milestone-item" style="opacity:0.4;">
                            <span class="ms-icon">${ms.icon}</span>
                            <span class="ms-text">突破 ${ms.label}</span>
                            <span class="ms-value" style="color:#94a3b8;">尚未達成</span>
                        </div>
                    `;
                }
            });
            els.milestones.innerHTML = html;
        }

        // --- 初始計算 ---
        calc();

    }, 0);
};
