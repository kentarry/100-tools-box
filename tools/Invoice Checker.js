window.render_invoiceChecker = function () {
    container.innerHTML = `
        <style>
            .inv-wrapper {
                max-width: 1100px;
                margin: 0 auto;
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
            }

            /* Hero */
            .inv-hero {
                background: linear-gradient(135deg, #4c0519 0%, #9f1239 40%, #be123c 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .inv-hero::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -15%;
                width: 420px;
                height: 420px;
                background: radial-gradient(circle, rgba(251,113,133,0.25) 0%, transparent 70%);
                border-radius: 50%;
            }
            .inv-hero::after {
                content: '';
                position: absolute;
                bottom: -40%;
                left: -10%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(253,164,175,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .inv-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 6px 0;
                position: relative; z-index: 1;
            }
            .inv-hero p {
                color: #fda4af;
                font-size: 14px;
                margin: 0;
                position: relative; z-index: 1;
                line-height: 1.6;
            }
            .inv-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative; z-index: 1;
            }
            .inv-hero .hero-badge {
                background: rgba(255,255,255,0.12);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.18);
                color: #ffe4e6;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 期別與狀態列 */
            .inv-period-bar {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                position: relative; z-index: 1;
                flex-wrap: wrap;
            }
            .inv-period-bar select {
                padding: 8px 14px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.25);
                background: rgba(255,255,255,0.12);
                color: #fff;
                font-size: 14px;
                font-weight: 700;
                outline: none;
                cursor: pointer;
                backdrop-filter: blur(10px);
            }
            .inv-period-bar select option { color: #1e293b; background: #fff; }
            .inv-period-label {
                color: #fda4af;
                font-size: 13px;
                font-weight: 700;
            }
            .inv-status-tag {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: 11px;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 100px;
            }
            .inv-status-tag.live { background: rgba(34,197,94,0.2); color: #86efac; }
            .inv-status-tag.offline { background: rgba(251,191,36,0.2); color: #fde68a; }
            .inv-status-tag .dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                display: inline-block;
            }
            .inv-status-tag.live .dot { background: #22c55e; animation: invPulse 1.5s infinite; }
            .inv-status-tag.offline .dot { background: #fbbf24; }
            @keyframes invPulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
            .inv-period-info {
                color: #fecdd3;
                font-size: 11px;
                font-weight: 600;
            }

            /* 兌獎期限提示 */
            .inv-deadline-bar {
                background: rgba(255,255,255,0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 14px;
                padding: 12px 18px;
                margin-top: 16px;
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
                position: relative; z-index: 1;
            }
            .inv-deadline-bar .dl-icon { font-size: 20px; }
            .inv-deadline-label { color: #fda4af; font-size: 12px; font-weight: 600; }
            .inv-deadline-value { color: #fff; font-size: 14px; font-weight: 800; }
            .inv-deadline-countdown {
                margin-left: auto;
                color: #fbbf24;
                font-size: 13px;
                font-weight: 800;
            }

            /* 主 Grid */
            .inv-grid {
                display: grid;
                grid-template-columns: minmax(300px, 420px) 1fr;
                gap: 24px;
            }
            @media (max-width: 860px) { .inv-grid { grid-template-columns: 1fr; } }

            /* 卡片 */
            .inv-card {
                background: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                padding: 28px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                transition: box-shadow 0.3s;
            }
            .inv-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
            .inv-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 輸入區 */
            .inv-input-label {
                font-size: 13px;
                font-weight: 700;
                color: #475569;
                margin-bottom: 8px;
                display: block;
            }
            .inv-input-big {
                width: 100%;
                padding: 16px;
                border: 3px solid #e2e8f0;
                border-radius: 16px;
                font-size: 36px;
                font-weight: 900;
                text-align: center;
                color: #1e293b;
                outline: none;
                letter-spacing: 8px;
                transition: border-color 0.3s;
                background: #f8fafc;
                box-sizing: border-box;
            }
            .inv-input-big:focus { border-color: #e11d48; background: #fff; }
            .inv-input-big::placeholder { font-size: 18px; letter-spacing: 0; font-weight: 600; color: #cbd5e1; }

            .inv-batch-area {
                width: 100%;
                min-height: 100px;
                padding: 14px;
                border: 2px solid #e2e8f0;
                border-radius: 14px;
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
                outline: none;
                resize: vertical;
                transition: border-color 0.3s;
                background: #f8fafc;
                font-family: 'Segoe UI', monospace;
                box-sizing: border-box;
            }
            .inv-batch-area:focus { border-color: #e11d48; background: #fff; }

            /* 切換鈕 */
            .inv-mode-toggle {
                display: flex;
                background: #f1f5f9;
                border-radius: 12px;
                padding: 4px;
                margin-bottom: 16px;
            }
            .inv-mode-btn {
                flex: 1;
                padding: 10px;
                border: none;
                background: transparent;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 700;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s;
            }
            .inv-mode-btn.active {
                background: #fff;
                color: #e11d48;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }

            /* 對獎按鈕 */
            .inv-check-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 14px;
                background: linear-gradient(135deg, #e11d48, #be123c);
                color: #fff;
                font-size: 16px;
                font-weight: 800;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 4px 16px rgba(225,29,72,0.3);
                margin-top: 10px;
            }
            .inv-check-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(225,29,72,0.4); }

            /* 結果區 */
            .inv-result-box {
                margin-top: 16px;
                border-radius: 16px;
                padding: 24px;
                text-align: center;
                display: none;
            }
            .inv-result-box.show { display: block; animation: invPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .inv-result-box.win { background: linear-gradient(135deg, #fef2f2, #ffe4e6); border: 2px solid #fda4af; }
            .inv-result-box.lose { background: #f8fafc; border: 2px solid #e2e8f0; }
            .inv-result-icon { font-size: 48px; margin-bottom: 8px; }
            .inv-result-title { font-size: 22px; font-weight: 900; }
            .inv-result-title.win-text { color: #e11d48; }
            .inv-result-title.lose-text { color: #94a3b8; }
            .inv-result-detail { font-size: 14px; color: #64748b; font-weight: 600; margin-top: 6px; line-height: 1.6; }
            @keyframes invPop { from{opacity:0;transform:scale(0.8);} to{opacity:1;transform:scale(1);} }

            /* 批次結果 */
            .inv-batch-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                border-radius: 12px;
                margin-bottom: 8px;
                font-weight: 700;
                font-size: 14px;
                transition: transform 0.2s;
            }
            .inv-batch-item:hover { transform: translateX(4px); }
            .inv-batch-item.win { background: linear-gradient(135deg, #fef2f2, #ffe4e6); border: 1px solid #fda4af; color: #e11d48; }
            .inv-batch-item.lose { background: #f8fafc; border: 1px solid #e2e8f0; color: #94a3b8; }
            .inv-batch-item .bi-num { font-size: 18px; font-weight: 900; letter-spacing: 2px; min-width: 100px; }
            .inv-batch-item .bi-result { flex: 1; text-align: right; }

            /* 號碼面板 */
            .inv-num-group { margin-bottom: 16px; }
            .inv-num-label {
                font-size: 12px;
                font-weight: 700;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }
            .inv-num-value {
                font-size: 24px;
                font-weight: 900;
                color: #e11d48;
                letter-spacing: 3px;
                font-family: 'Courier New', monospace;
                padding: 10px 16px;
                background: linear-gradient(135deg, #fef2f2, #fff1f2);
                border: 1px solid #fecdd3;
                border-radius: 12px;
                display: inline-block;
            }
            .inv-num-value.small { font-size: 18px; display: block; margin-bottom: 6px; }
            .inv-num-prize { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px; }
            .inv-num-loading {
                text-align: center;
                padding: 30px;
                color: #94a3b8;
                font-weight: 600;
            }
            .inv-num-loading .ld-spinner {
                display: inline-block;
                width: 24px;
                height: 24px;
                border: 3px solid #e2e8f0;
                border-top-color: #e11d48;
                border-radius: 50%;
                animation: invSpin 0.8s linear infinite;
                margin-bottom: 8px;
            }
            @keyframes invSpin { to { transform: rotate(360deg); } }

            /* 獎金表 */
            .inv-prize-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .inv-prize-table th { background: #f1f5f9; color: #475569; font-weight: 700; padding: 10px 12px; text-align: left; }
            .inv-prize-table th:last-child { text-align: right; }
            .inv-prize-table td { padding: 10px 12px; border-top: 1px solid #f1f5f9; color: #334155; font-weight: 600; }
            .inv-prize-table td:last-child { text-align: right; font-weight: 800; color: #e11d48; }
            .inv-prize-table tr:hover td { background: #fff1f2; }

            /* 統計 */
            .inv-stats-row { display: flex; gap: 12px; margin-top: 16px; }
            .inv-stat-card { flex:1; text-align:center; padding:14px; background:#f8fafc; border-radius:14px; border:1px solid #e2e8f0; }
            .inv-stat-card .sc-icon { font-size: 22px; }
            .inv-stat-card .sc-val { font-size: 22px; font-weight: 900; color: #1e293b; margin-top: 4px; }
            .inv-stat-card .sc-label { font-size: 11px; color: #94a3b8; font-weight: 700; margin-top: 2px; }

            /* 提示 */
            .inv-tip-box {
                background: linear-gradient(135deg, #fef9c3, #fef3c7);
                border: 1px solid #fcd34d;
                border-radius: 14px;
                padding: 16px 20px;
                margin-top: 20px;
                font-size: 13px;
                color: #78350f;
                font-weight: 600;
                line-height: 1.7;
            }
            .inv-source-link {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                color: #e11d48;
                text-decoration: none;
                font-weight: 700;
                font-size: 12px;
                margin-top: 8px;
            }
            .inv-source-link:hover { text-decoration: underline; }

            /* 動畫 */
            @keyframes invSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .inv-anim { animation: invSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            .inv-anim-d1 { animation-delay: 0.1s; opacity: 0; }
            .inv-anim-d2 { animation-delay: 0.2s; opacity: 0; }
            .inv-anim-d3 { animation-delay: 0.3s; opacity: 0; }

            @keyframes invShake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
            .inv-shake { animation: invShake 0.5s; }
        </style>

        <div class="inv-wrapper">
            <!-- Hero -->
            <div class="inv-hero inv-anim">
                <h2>🧧 統一發票對獎機</h2>
                <p>自動根據日期顯示最新一期中獎號碼，支援單張快對與批次對獎</p>
                <div class="hero-badges">
                    <span class="hero-badge">📡 自動抓取號碼</span>
                    <span class="hero-badge">📅 依日期顯示</span>
                    <span class="hero-badge">📋 批次對獎</span>
                    <span class="hero-badge">🏆 完整獎別判斷</span>
                </div>
                <div class="inv-period-bar">
                    <span class="inv-period-label">對獎期別：</span>
                    <select id="invPeriodSelect"></select>
                    <span class="inv-status-tag offline" id="invStatusTag">
                        <span class="dot"></span>
                        <span id="invStatusText">載入中...</span>
                    </span>
                    <span class="inv-period-info" id="invPeriodInfo"></span>
                </div>
                <div class="inv-deadline-bar" id="invDeadlineBar" style="display:none;">
                    <span class="dl-icon">⏰</span>
                    <div>
                        <div class="inv-deadline-label">兌獎截止日</div>
                        <div class="inv-deadline-value" id="invDeadlineDate">-</div>
                    </div>
                    <span class="inv-deadline-countdown" id="invCountdown">-</span>
                </div>
            </div>

            <div class="inv-grid">
                <!-- 左欄 -->
                <div style="display:flex;flex-direction:column;gap:20px;">
                    <div class="inv-card inv-anim inv-anim-d1">
                        <h3>🔍 對獎區</h3>
                        <div class="inv-mode-toggle">
                            <button class="inv-mode-btn active" data-mode="fast">⚡ 3碼快對</button>
                            <button class="inv-mode-btn" data-mode="precise">🎯 8碼對獎</button>
                            <button class="inv-mode-btn" data-mode="batch">📋 批次對獎</button>
                        </div>

                        <!-- 3碼快對面板 -->
                        <div id="invFastPanel">
                            <div style="margin-bottom:12px;">
                                <label class="inv-input-label">連續輸入發票末 3 碼，系統會自動對獎並清空</label>
                                <input type="text" id="invInputFast" class="inv-input-big" placeholder="輸入 3 碼" maxlength="3" autocomplete="off">
                            </div>
                            <div class="inv-result-box" id="invResultFast"></div>
                        </div>

                        <!-- 8碼對獎面板 -->
                        <div id="invPrecisePanel" style="display:none;">
                            <div style="margin-bottom:12px;">
                                <label class="inv-input-label">請輸入完整 8 碼以精確對獎</label>
                                <input type="text" id="invInputPrecise" class="inv-input-big" placeholder="輸入 8 碼" maxlength="8" autocomplete="off">
                            </div>
                            <button class="inv-check-btn" id="invCheckBtnPrecise">🎯 立即對獎</button>
                            <div class="inv-result-box" id="invResultPrecise"></div>
                        </div>

                        <div id="invBatchPanel" style="display:none;">
                            <div style="margin-bottom:12px;">
                                <label class="inv-input-label">一行一組號碼（末3碼或完整8碼）</label>
                                <textarea id="invBatchInput" class="inv-batch-area" placeholder="範例：&#10;12345678&#10;87654321&#10;539&#10;882"></textarea>
                            </div>
                            <button class="inv-check-btn" id="invBatchBtn">🎯 批次對獎</button>
                            <div id="invBatchResults"></div>
                        </div>

                        <div class="inv-stats-row" id="invStats" style="display:none;">
                            <div class="inv-stat-card"><div class="sc-icon">📄</div><div class="sc-val" id="invStatTotal">0</div><div class="sc-label">對獎張數</div></div>
                            <div class="inv-stat-card"><div class="sc-icon">🎉</div><div class="sc-val" id="invStatWin">0</div><div class="sc-label">中獎張數</div></div>
                            <div class="inv-stat-card"><div class="sc-icon">💰</div><div class="sc-val" id="invStatPrize">$0</div><div class="sc-label">預估獎金</div></div>
                        </div>
                    </div>

                    <div class="inv-tip-box inv-anim inv-anim-d2">
                        💡 <strong>使用提示：</strong><br>
                        • 系統會根據<strong>當前日期自動選擇</strong>最新可兌獎期別<br>
                        • 輸入<strong>末 3 碼</strong>快速比對六獎，<strong>完整 8 碼</strong>精確判斷所有獎別<br>
                        • 中獎號碼來源：<a href="https://invoice.etax.nat.gov.tw/" target="_blank" class="inv-source-link">📡 財政部稅務入口網</a>
                    </div>
                </div>

                <!-- 右欄 -->
                <div style="display:flex;flex-direction:column;gap:20px;">
                    <div class="inv-card inv-anim inv-anim-d2">
                        <h3>🏆 本期中獎號碼</h3>
                        <div id="invNumbersPanel">
                            <div class="inv-num-loading">
                                <div class="ld-spinner"></div><br>
                                正在載入中獎號碼...
                            </div>
                        </div>
                    </div>

                    <div class="inv-card inv-anim inv-anim-d3">
                        <h3>💰 獎金對照表</h3>
                        <table class="inv-prize-table">
                            <thead><tr><th>獎別</th><th>條件</th><th>獎金</th></tr></thead>
                            <tbody>
                                <tr><td>🥇 特別獎</td><td>8 碼全中</td><td>$10,000,000</td></tr>
                                <tr><td>🥈 特獎</td><td>8 碼全中</td><td>$2,000,000</td></tr>
                                <tr><td>🥉 頭獎</td><td>8 碼全中</td><td>$200,000</td></tr>
                                <tr><td>🏅 二獎</td><td>末 7 碼</td><td>$40,000</td></tr>
                                <tr><td>🎖️ 三獎</td><td>末 6 碼</td><td>$10,000</td></tr>
                                <tr><td>🏷️ 四獎</td><td>末 5 碼</td><td>$4,000</td></tr>
                                <tr><td>🎫 五獎</td><td>末 4 碼</td><td>$1,000</td></tr>
                                <tr><td>🎟️ 六獎</td><td>末 3 碼</td><td>$200</td></tr>
                                <tr><td>🌟 增開六獎</td><td>末 3 碼</td><td>$200</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        // ===== 綁定 DOM 元素 =====
        const periodSelect = document.getElementById('invPeriodSelect');
        const invStatusTag = document.getElementById('invStatusTag');
        const invStatusText = document.getElementById('invStatusText');
        const invPeriodInfo = document.getElementById('invPeriodInfo');
        const invDeadlineBar = document.getElementById('invDeadlineBar');
        const invDeadlineDate = document.getElementById('invDeadlineDate');
        const invCountdown = document.getElementById('invCountdown');
        
        const invNumbersPanel = document.getElementById('invNumbersPanel');
        const invFastPanel = document.getElementById('invFastPanel');
        const invInputFast = document.getElementById('invInputFast');
        const invResultFast = document.getElementById('invResultFast');
        
        const invPrecisePanel = document.getElementById('invPrecisePanel');
        const invInputPrecise = document.getElementById('invInputPrecise');
        const invCheckBtnPrecise = document.getElementById('invCheckBtnPrecise');
        const invResultPrecise = document.getElementById('invResultPrecise');
        
        const invBatchPanel = document.getElementById('invBatchPanel');
        const invBatchInput = document.getElementById('invBatchInput');
        const invBatchBtn = document.getElementById('invBatchBtn');
        const invBatchResults = document.getElementById('invBatchResults');
        const invStats = document.getElementById('invStats');

        // ===== 內建預設資料庫 (作為即時顯示的 Fallback) =====
        const defaultDB = {
            '11412': { label: '114年11-12月', special: '97023797', grand: '00507588', first: ['92377231', '05232592', '78125249'], extra: [], drawDate: '2026/01/25', expireDate: '2026/07/06' },
            '11410': { label: '114年09-10月', special: '25834483', grand: '46587380', first: ['41016094', '98081574', '07309261'], extra: [], drawDate: '2025/11/25', expireDate: '2026/05/06' },
            '11408': { label: '114年07-08月', special: '84226804', grand: '51509866', first: ['43074088', '22870220', '38253117'], extra: [], drawDate: '2025/09/25', expireDate: '2026/03/06' },
            '11406': { label: '114年05-06月', special: '30099589', grand: '05579058', first: ['49912232', '73145004', '99174704'], extra: [], drawDate: '2025/07/25', expireDate: '2026/01/06' },
            '11404': { label: '114年03-04月', special: '66399569', grand: '64808075', first: ['04322277', '07903676', '98883497'], extra: [], drawDate: '2025/05/25', expireDate: '2025/11/06' },
            '11402': { label: '114年01-02月', special: '19444064', grand: '37166026', first: ['78394633', '26503878', '39200954'], extra: [], drawDate: '2025/03/25', expireDate: '2025/09/06' }
        };

        let invoiceDB = JSON.parse(JSON.stringify(defaultDB));
        let currentKey = null;
        let currentData = null;
        let isLive = false;
        let checkHistory = [];
        let clearTimer = null;

        // ===== 解析民國日期字串 =====
        function parseROCDate(rocDateStr) {
            const m = rocDateStr.match(/(\d{3})年(\d{2})月(\d{2})日/);
            if (!m) {
                // 如果傳入的是 '2026/01/25' 格式
                const stdDate = new Date(rocDateStr.replace(/-/g, '/'));
                if (!isNaN(stdDate)) return stdDate;
                return null;
            }
            const year = parseInt(m[1]) + 1911;
            return new Date(`${year}/${m[2]}/${m[3]} 23:59:59`);
        }

        // ===== 萃取並去重複、排序所有的期別資料 =====
        function getUniqueSortedPeriods() {
            const uniqueMap = new Map();
            for (const key in invoiceDB) {
                const data = invoiceDB[key];
                if (!data || !data.label) continue;
                
                // 標準化標題，移除空白並強制補零以利排序 (例如 "114年9-10月" -> "114年09-10月")
                let normalizedLabel = data.label.replace(/\s+/g, '');
                normalizedLabel = normalizedLabel.replace(/年(\d)-/, '年0$1-');
                
                // 保存排序鍵與資料
                uniqueMap.set(normalizedLabel, { originalKey: key, data: data, sortKey: normalizedLabel });
            }
            
            // 將 Map 轉換為 Array，並依照 label 名稱降冪排序 (年份大、月份大 的排上面)
            const sortedArray = Array.from(uniqueMap.values()).sort((a, b) => {
                return b.sortKey.localeCompare(a.sortKey);
            });
            return sortedArray;
        }

        // ===== 永遠預設選擇最新一期 =====
        function getRecommendedPeriod() {
            try {
                const sortedPeriods = getUniqueSortedPeriods();
                if (sortedPeriods.length === 0) return Object.keys(invoiceDB)[0];
                return sortedPeriods[0].originalKey; // 直接回傳排序後的最上面一筆 (最新的)
            } catch (e) {
                console.error(e);
                return Object.keys(invoiceDB)[0];
            }
        }

        // ===== 建立期別下拉 =====
        function buildPeriodSelect() {
            try {
                periodSelect.innerHTML = '';
                const sortedPeriods = getUniqueSortedPeriods();
                
                // 確保如果有找到目前正在看的資料對應的標籤，要讓他選中
                let currentNormalizedLabel = currentData && currentData.label ? currentData.label.replace(/\s+/g, '') : null;

                sortedPeriods.forEach(item => {
                    const d = item.data;
                    let expire = parseROCDate(d.expireDate);
                    const isExpired = (expire && !isNaN(expire)) ? (new Date() > expire) : false;
                    const opt = document.createElement('option');
                    opt.value = item.originalKey;
                    opt.textContent = d.label + (isExpired ? ' (已截止)' : '');
                    
                    const itemNormalizedLabel = d.label.replace(/\s+/g, '');
                    if (itemNormalizedLabel === currentNormalizedLabel) {
                        opt.selected = true;
                    }
                    periodSelect.appendChild(opt);
                });
            } catch (e) {
                console.error('buildPeriodSelect error:', e);
            }
        }

        periodSelect.addEventListener('change', () => {
            currentKey = periodSelect.value;
            currentData = invoiceDB[currentKey];
            renderNumbers();
            updateDeadline();
            invResultFast.className = 'inv-result-box'; invResultFast.style.display = 'none';
            invResultPrecise.className = 'inv-result-box'; invResultPrecise.style.display = 'none';
        });

        // ===== 計算兌獎倒數 =====
        function getCountdown(expireDateStr) {
            const expire = parseROCDate(expireDateStr);
            if (!expire) return '';
            const now = new Date();
            const diff = expire - now;
            if (diff <= 0) return '已截止';
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days > 30) return `剩 ${days} 天`;
            if (days > 0) return `⚠️ 僅剩 ${days} 天！`;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            return `🚨 僅剩 ${hours} 小時！`;
        }

        // ===== 模式切換 =====
        document.querySelectorAll('.inv-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.inv-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.dataset.mode;
                document.getElementById('invFastPanel').style.display = mode === 'fast' ? 'block' : 'none';
                document.getElementById('invPrecisePanel').style.display = mode === 'precise' ? 'block' : 'none';
                document.getElementById('invBatchPanel').style.display = mode === 'batch' ? 'block' : 'none';
                invStats.style.display = 'none';
                if (mode === 'fast') setTimeout(() => invInputFast.focus(), 50);
                if (mode === 'precise') setTimeout(() => invInputPrecise.focus(), 50);
            });
        });

        // ===== 下載並解析單頁期別資料 (附帶 24 小時緩存) =====
        async function fetchPeriodData(url, cacheKey) {
            const cachedSt = localStorage.getItem(cacheKey);
            if (cachedSt) {
                try {
                    const cacheData = JSON.parse(cachedSt);
                    const now = new Date().getTime();
                    if (now - cacheData.timestamp < 86400000) {
                        return { data: cacheData.data, fromCache: true };
                    }
                } catch (e) { }
            }

            // 建立安全的 Timeout Controller (相容舊版 Safari)
            const getSignal = () => {
                if (window.AbortSignal && AbortSignal.timeout) return AbortSignal.timeout(8000);
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 8000);
                return controller.signal;
            };

            const targetXmlUrl = 'https://invoice.etax.nat.gov.tw/invoice.xml';

            // 策略 1: 透過 rss2json 拿乾淨的 JSON
            const jsonProxies = [
                `https://api.rss2json.com/v1/api.json?rss_url=${targetXmlUrl}`
            ];

            // 策略 2: 透過免費 CORS proxy 代理抓取原始 XML，前端自己 parse
            const xmlProxies = [
                'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetXmlUrl),
                'https://corsproxy.io/?' + encodeURIComponent(targetXmlUrl)
            ];

            // 執行策略 1 (JSON)
            for (const pUrl of jsonProxies) {
                try {
                    const resp = await fetch(pUrl, { signal: getSignal() });
                    if (!resp.ok) continue;
                    const json = await resp.json();
                    if (!json || json.status !== 'ok' || !json.items || json.items.length === 0) continue;

                    const itemIndex = cacheKey === 'tw_invoice_latest' ? 0 : 1;
                    const targetItem = json.items[itemIndex];
                    if (!targetItem) continue;

                    let label = targetItem.title.replace('~', '-');
                    const content = targetItem.description || '';
                    const numbers = content.match(/\d{8}|\d{3}/g) || [];
                    
                    if (numbers.length >= 5) {
                        return processAndCacheData(label, numbers, targetItem.pubDate, cacheKey);
                    }
                } catch (e) { console.warn('JSON Proxy 失敗', e); continue; }
            }

            // 執行策略 2 (XML) - 若 JSON 策略全失敗 (例如 Rate Limit)
            for (const pUrl of xmlProxies) {
                try {
                    const resp = await fetch(pUrl, { signal: getSignal() });
                    if (!resp.ok) continue;
                    const xmlText = await resp.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    const items = xmlDoc.querySelectorAll('item');
                    const itemIndex = cacheKey === 'tw_invoice_latest' ? 0 : 1;
                    if (items.length <= itemIndex) continue;
                    
                    const targetItem = items[itemIndex];
                    let label = targetItem.querySelector('title').textContent.replace('~', '-');
                    const content = targetItem.querySelector('description').textContent || '';
                    const numbers = content.match(/\d{8}|\d{3}/g) || [];
                    const pubDate = targetItem.querySelector('pubDate') ? targetItem.querySelector('pubDate').textContent : null;

                    if (numbers.length >= 5) {
                        return processAndCacheData(label, numbers, pubDate, cacheKey);
                    }
                } catch (e) { console.warn('XML Proxy 失敗', e); continue; }
            }
            
            return null;

            // --- 內部處理與快取函式 ---
            function processAndCacheData(label, numbers, pubDateString, targetCacheKey) {
                let drawDate = '-', expireDate = '-';
                if (pubDateString) {
                    const pDate = new Date(pubDateString.replace(' ', 'T'));
                    if (!isNaN(pDate)) {
                        drawDate = `${pDate.getFullYear()}/${(pDate.getMonth() + 1).toString().padStart(2, '0')}/25`;
                        const exp = new Date(pDate);
                        exp.setMonth(exp.getMonth() + 4);
                        expireDate = `${exp.getFullYear()}/${(exp.getMonth() + 1).toString().padStart(2, '0')}/06`;
                    }
                }

                const resultData = {
                    label,
                    special: numbers[0],
                    grand: numbers[1],
                    first: [numbers[2], numbers[3], numbers[4]],
                    extra: numbers.slice(5),
                    drawDate,
                    expireDate
                };

                localStorage.setItem(targetCacheKey, JSON.stringify({
                    timestamp: new Date().getTime(),
                    data: resultData
                }));

                return { data: resultData, fromCache: false };
            }
        }

        // ===== 渲染號碼 =====
        function renderNumbers() {
            try {
                const d = currentData;
                if (!d) {
                    invNumbersPanel.innerHTML = '<div style="padding:20px;text-align:center;">無此期別資料</div>';
                    return;
                }
                const firstArr = Array.isArray(d.first) ? d.first : [];
                const extraArr = Array.isArray(d.extra) ? d.extra : [];

                invNumbersPanel.innerHTML = `
                    <div class="inv-num-group">
                        <div class="inv-num-label">🥇 特別獎</div>
                        <div class="inv-num-value">${d.special || '無'}</div>
                        <div class="inv-num-prize">8 碼全中 → $10,000,000</div>
                    </div>
                    <div class="inv-num-group">
                        <div class="inv-num-label">🥈 特獎</div>
                        <div class="inv-num-value">${d.grand || '無'}</div>
                        <div class="inv-num-prize">8 碼全中 → $2,000,000</div>
                    </div>
                    <div class="inv-num-group">
                        <div class="inv-num-label">🥉 頭獎 (${firstArr.length} 組)</div>
                        ${firstArr.map(n => `<div class="inv-num-value small">${n}</div>`).join('')}
                        <div class="inv-num-prize">末 3~8 碼 → $200 ~ $200,000</div>
                    </div>
                    ${extraArr.length > 0 ? `
                        <div class="inv-num-group">
                            <div class="inv-num-label">🌟 增開六獎 (${extraArr.length} 組)</div>
                            ${extraArr.map(n => `<div class="inv-num-value small" style="font-size:20px;">${n}</div>`).join('')}
                            <div class="inv-num-prize">末 3 碼 → $200</div>
                        </div>
                    ` : ''}
                `;
            } catch (e) {
                console.error("renderNumbers fail", e);
                invNumbersPanel.innerHTML = '<div style="padding:20px;color:red;text-align:center;">繪製版面失敗，請檢查資料夾。</div>';
            }
        }

        // ===== 更新兌獎期限 =====
        function updateDeadline() {
            const d = currentData;
            invDeadlineBar.style.display = 'flex';
            invDeadlineDate.textContent = d.expireDate;
            invCountdown.textContent = getCountdown(d.expireDate);
        }

        // ===== 對獎邏輯 =====
        function checkInvoice(numStr) {
            const num = numStr.replace(/[\s\-]/g, '');
            const d = currentData;
            if (!d) return { win: false, invalid: true };

            if (num.length === 8) {
                if (num === d.special) return { win: true, prize: '🥇 特別獎', amount: 10000000, match: 8 };
                if (num === d.grand) return { win: true, prize: '🥈 特獎', amount: 2000000, match: 8 };

                for (const first of d.first) {
                    if (num === first) return { win: true, prize: '🥉 頭獎', amount: 200000, match: 8 };
                    if (num.slice(-7) === first.slice(-7)) return { win: true, prize: '🏅 二獎', amount: 40000, match: 7 };
                    if (num.slice(-6) === first.slice(-6)) return { win: true, prize: '🎖️ 三獎', amount: 10000, match: 6 };
                    if (num.slice(-5) === first.slice(-5)) return { win: true, prize: '🏷️ 四獎', amount: 4000, match: 5 };
                    if (num.slice(-4) === first.slice(-4)) return { win: true, prize: '🎫 五獎', amount: 1000, match: 4 };
                    if (num.slice(-3) === first.slice(-3)) return { win: true, prize: '🎟️ 六獎', amount: 200, match: 3 };
                }

                if (d.extra) {
                    for (const extra of d.extra) {
                        if (num.slice(-3) === extra) return { win: true, prize: '🌟 增開六獎', amount: 200, match: 3 };
                    }
                }
                return { win: false };
            } else if (num.length === 3) {
                for (const first of d.first) {
                    if (num === first.slice(-3)) return { win: true, prize: '🎟️ 六獎 (或以上)', amount: 200, match: 3, note: '建議輸入完整 8 碼確認獎別' };
                }
                if (d.extra) {
                    for (const extra of d.extra) {
                        if (num === extra) return { win: true, prize: '🌟 增開六獎', amount: 200, match: 3 };
                    }
                }
                return { win: false };
            }
            return { win: false, invalid: true };
        }

        // ===== 3碼快對邏輯 =====
        invInputFast.addEventListener('input', () => {
            const num = invInputFast.value.replace(/\s/g, '');
            if (num.length === 3) {
                const result = checkInvoice(num);
                invResultFast.style.display = 'block';
                invResultFast.className = 'inv-result-box show';

                if (result.invalid) {
                    invResultFast.classList.add('lose');
                    invResultFast.innerHTML = `<div class="inv-result-icon">⚠️</div><div class="inv-result-title lose-text">[${num}] 格式不正確</div><div class="inv-result-detail">請輸入純數字</div>`;
                } else if (result.win) {
                    invResultFast.classList.add('win');
                    invResultFast.innerHTML = `
                        <div class="inv-result-icon">🎊</div>
                        <div class="inv-result-title win-text">[${num}] 恭喜中獎！</div>
                        <div class="inv-result-detail">
                            ${result.prize} — 獎金 <strong>$${result.amount.toLocaleString()}</strong><br>
                            ${result.note ? `📌 ${result.note}` : `✅ 末 ${result.match} 碼符合`}
                        </div>
                    `;
                    invInputFast.classList.add('inv-shake');
                    setTimeout(() => invInputFast.classList.remove('inv-shake'), 500);
                } else {
                    invResultFast.classList.add('lose');
                    invResultFast.innerHTML = `<div class="inv-result-icon">😅</div><div class="inv-result-title lose-text">[${num}] 未中獎</div><div class="inv-result-detail">本期未中獎，請繼續輸入下一組</div>`;
                }

                // 徹底保證清除事件迴圈殘影
                setTimeout(() => {
                    invInputFast.value = '';
                }, 10);
            }
        });

        // ===== 8碼精確對獎邏輯 =====
        function preciseCheck() {
            const num = invInputPrecise.value.replace(/\s/g, '');
            if (!num || num.length < 8) return;
            const result = checkInvoice(num);
            invResultPrecise.style.display = 'block';
            invResultPrecise.className = 'inv-result-box show';

            if (result.invalid) {
                invResultPrecise.classList.add('lose');
                invResultPrecise.innerHTML = `<div class="inv-result-icon">⚠️</div><div class="inv-result-title lose-text">格式不正確</div><div class="inv-result-detail">請輸入完整 8 碼數字</div>`;
            } else if (result.win) {
                invResultPrecise.classList.add('win');
                invResultPrecise.innerHTML = `
                    <div class="inv-result-icon">🎊</div>
                    <div class="inv-result-title win-text">恭喜中獎！</div>
                    <div class="inv-result-detail">
                        ${result.prize} — 獎金 <strong>$${result.amount.toLocaleString()}</strong><br>
                        ✅ 末 ${result.match} 碼符合
                    </div>
                `;
                invInputPrecise.classList.add('inv-shake');
                setTimeout(() => invInputPrecise.classList.remove('inv-shake'), 500);
            } else {
                invResultPrecise.classList.add('lose');
                invResultPrecise.innerHTML = `<div class="inv-result-icon">😅</div><div class="inv-result-title lose-text">再接再厲！</div><div class="inv-result-detail">本期未中獎，下期繼續加油 💪</div>`;
            }
        }

        invCheckBtnPrecise.addEventListener('click', preciseCheck);
        invInputPrecise.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') preciseCheck();
            if (invInputPrecise.value.replace(/\s/g, '').length === 8) preciseCheck();
        });

        // ===== 批次對獎 =====
        invBatchBtn.addEventListener('click', () => {
            const lines = invBatchInput.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (!lines.length) return;
            let totalWin = 0, totalPrize = 0, html = '';
            lines.forEach(num => {
                const result = checkInvoice(num);
                if (result.win) {
                    totalWin++; totalPrize += result.amount;
                    html += `<div class="inv-batch-item win"><span class="bi-num">${num}</span><span class="bi-result">🎉 ${result.prize} — $${result.amount.toLocaleString()}</span></div>`;
                } else if (result.invalid) {
                    html += `<div class="inv-batch-item lose"><span class="bi-num">${num}</span><span class="bi-result">⚠️ 格式不正確</span></div>`;
                } else {
                    html += `<div class="inv-batch-item lose"><span class="bi-num">${num}</span><span class="bi-result">未中獎</span></div>`;
                }
            });
            invBatchResults.innerHTML = html;
            invStats.style.display = 'flex';
            document.getElementById('invStatTotal').textContent = lines.length;
            document.getElementById('invStatWin').textContent = totalWin;
            document.getElementById('invStatPrize').textContent = '$' + totalPrize.toLocaleString();
        });

        // ===== 初始化：即時顯示內建/快取，背景靜默更新 =====
        async function init() {
            try {
                // 強制覆寫原本的 loading 空白畫面
                if (invNumbersPanel.innerHTML.includes('ld-spinner')) {
                    invNumbersPanel.innerHTML = '<div style="padding:20px;text-align:center;">載入中...</div>';
                }

                // 1. 先載入內建 Local DB + 快取
                const cachedLatest = localStorage.getItem('tw_invoice_latest');
                const cachedPrev = localStorage.getItem('tw_invoice_prev');
                let hasCache = false;

                if (cachedLatest || cachedPrev) {
                    try {
                        if (cachedLatest) {
                            const parsed = JSON.parse(cachedLatest);
                            invoiceDB['latest_cache'] = parsed.data;
                            hasCache = true;
                        }
                        if (cachedPrev) {
                            const parsed = JSON.parse(cachedPrev);
                            invoiceDB['prev_cache'] = parsed.data;
                            hasCache = true;
                        }
                    } catch (e) { }
                }

                // 初始顯示
                currentKey = getRecommendedPeriod();
                currentData = invoiceDB[currentKey] || invoiceDB[Object.keys(invoiceDB)[0]];
                
                // 最後防線：如果 currentData 還是空的，強制套用預設資料庫第一筆
                if (!currentData) {
                    currentData = Object.values(defaultDB)[0];
                }

                buildPeriodSelect();
                renderNumbers();
                updateDeadline();

                invStatusTag.className = hasCache ? 'inv-status-tag live' : 'inv-status-tag offline';
                invStatusText.textContent = hasCache ? '載入本機快取' : '載入預設資料';
                invPeriodInfo.textContent = '背景同步最新號碼中...';

                // 2. 背景靜默抓取最新資料 (不阻塞 UI)
                try {
                    // rss2json 單次請求即包含最新和上一期
                    const resLatest = await fetchPeriodData('dummy_url', 'tw_invoice_latest');
                    const resPrev = await fetchPeriodData('dummy_url', 'tw_invoice_prev');

                    let updated = false;

                    if (resLatest && resLatest.data) {
                        invoiceDB['latest_fetched'] = resLatest.data;
                        updated = true;
                    }
                    if (resPrev && resPrev.data) {
                        invoiceDB['prev_fetched'] = resPrev.data;
                        updated = true;
                    }

                    if (updated) {
                        invStatusTag.className = 'inv-status-tag live';
                        invStatusText.textContent = '已同步最新號碼 📡';
                        invPeriodInfo.textContent = '來源：財政部稅務入口網';

                        // 重新評估最新的預設期別
                        const newKey = getRecommendedPeriod();
                        
                        // 我們強制切換到最新抓取的資料 (因為用戶可能本來停在內建的最新期別，抓完後標籤一樣但 key 變成了 fetched)
                        // 判別方式：只要當前選中的標籤等於新抓取最新期的標籤，就自動刷新
                        const sorted = getUniqueSortedPeriods();
                        const newLatestLabel = sorted.length > 0 ? sorted[0].sortKey : null;
                        const currLabel = currentData && currentData.label ? currentData.label.replace(/\s+/g, '').replace(/年(\d)-/, '年0$1-') : null;

                        if (newLatestLabel === currLabel || currentKey === 'latest_cache' || currentKey === 'tw_invoice_latest') {
                            currentKey = newKey;
                            currentData = invoiceDB[currentKey];
                            buildPeriodSelect();
                            renderNumbers();
                            updateDeadline();
                        } else {
                            buildPeriodSelect(); // 僅更新下拉選單內容不切除非最新期的畫面
                        }
                    } else if (!hasCache) {
                        invStatusTag.className = 'inv-status-tag offline';
                        invStatusText.textContent = '使用內建資料';
                        invPeriodInfo.textContent = '連線超時，使用預設資料庫';
                    } else {
                        invStatusTag.className = 'inv-status-tag live';
                        invStatusText.textContent = '快取資料為最新';
                        invPeriodInfo.textContent = '無需重新下載';
                    }
                } catch (e) {
                    // 背景抓取失敗不影響使用者操作
                }
            } catch (errorOuter) {
                console.error("Init Error", errorOuter);
                invNumbersPanel.innerHTML = '<div style="padding:20px;color:#e11d48;text-align:center;">初始化發生錯誤，請重新清除瀏覽器快取。<br>' + errorOuter.message + '</div>';
            }
        }

        init();

    }, 50); // 加入微小延遲確保 DOM 都繪製完成
};
