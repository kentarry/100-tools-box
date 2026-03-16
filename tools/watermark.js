window.render_watermark = function () {
    container.innerHTML = `
        <style>
            .wm-app {
                font-family: 'Segoe UI', 'Noto Sans TC', sans-serif;
                --primary: #3b82f6;
                --primary-hover: #2563eb;
                --danger: #ef4444;
                --warning: #f59e0b;
                --bg: #f8fafc;
                --border: #e2e8f0;
                --text: #334155;
            }

            /* Hero */
            .wm-hero {
                background: linear-gradient(135deg, #0c1220 0%, #1e3a5f 45%, #164e63 100%);
                border-radius: 24px;
                padding: 32px;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }
            .wm-hero::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -18%;
                width: 420px;
                height: 420px;
                background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
                border-radius: 50%;
            }
            .wm-hero::after {
                content: '';
                position: absolute;
                bottom: -35%;
                left: -8%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
                border-radius: 50%;
            }
            .wm-hero h2 {
                color: #fff;
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 6px 0;
                position: relative;
                z-index: 1;
            }
            .wm-hero p {
                color: #7dd3fc;
                font-size: 14px;
                margin: 0;
                position: relative;
                z-index: 1;
                line-height: 1.6;
            }
            .wm-hero .hero-badges {
                display: flex;
                gap: 8px;
                margin-top: 16px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            .wm-hero .hero-badge {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.15);
                color: #e2e8f0;
                font-size: 12px;
                padding: 6px 14px;
                border-radius: 100px;
                font-weight: 600;
            }

            /* 主佈局 */
            .wm-main-grid {
                display: grid;
                grid-template-columns: 400px 1fr;
                gap: 24px;
            }
            @media (max-width: 900px) { .wm-main-grid { grid-template-columns: 1fr; } }

            /* 卡片 */
            .wm-card {
                background: #fff;
                border-radius: 20px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                transition: box-shadow 0.3s;
            }
            .wm-card:hover { box-shadow: 0 8px 36px rgba(0,0,0,0.07); }
            .wm-card h3 {
                font-size: 16px;
                font-weight: 800;
                color: #1e293b;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 上傳區 */
            .wm-dropzone {
                border: 2px dashed #94a3b8;
                border-radius: 16px;
                padding: 28px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            }
            .wm-dropzone:hover, .wm-dropzone.dragover {
                border-color: var(--primary);
                background: linear-gradient(135deg, #eff6ff, #dbeafe);
                transform: translateY(-2px);
            }
            .wm-dropzone-icon { font-size: 42px; margin-bottom: 8px; }
            .wm-dropzone-title { font-weight: 700; color: #334155; font-size: 15px; margin: 0; }
            .wm-dropzone-sub { font-size: 12px; color: #94a3b8; margin: 4px 0 0; }

            /* 分頁 */
            .wm-tabs {
                display: flex;
                background: #f1f5f9;
                border-radius: 14px;
                padding: 4px;
                gap: 4px;
                flex-wrap: wrap;
            }
            .wm-tab {
                flex: 1;
                text-align: center;
                padding: 10px 4px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 700;
                color: #64748b;
                transition: all 0.3s ease;
                border: none;
                background: transparent;
                font-size: 12px;
                min-width: 62px;
                white-space: nowrap;
            }
            .wm-tab.active {
                background: #fff;
                color: var(--primary);
                box-shadow: 0 2px 10px rgba(0,0,0,0.06);
            }
            .wm-tab:hover:not(.active) { color: #334155; background: #e2e8f0; }

            .wm-panel { display: none; flex-direction: column; gap: 14px; animation: wmFadeIn 0.3s ease; }
            .wm-panel.active { display: flex; }
            @keyframes wmFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            /* 表單元素 */
            .wm-input, .wm-select {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                outline: none;
                transition: border-color 0.3s;
                box-sizing: border-box;
                background: #f8fafc;
                color: #1e293b;
            }
            .wm-input:focus, .wm-select:focus { border-color: var(--primary); background: #fff; }

            .wm-label {
                font-weight: 700;
                font-size: 13px;
                color: var(--text);
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            .wm-label .wm-label-val { color: #3b82f6; font-weight: 800; }

            .wm-range {
                width: 100%;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: linear-gradient(90deg, #3b82f6, #0ea5e9);
                border-radius: 10px;
                outline: none;
                cursor: pointer;
                margin-top: 4px;
            }
            .wm-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #fff;
                border: 3px solid #2563eb;
                box-shadow: 0 2px 8px rgba(37,99,235,0.3);
                cursor: pointer;
                transition: transform 0.2s;
            }
            .wm-range::-webkit-slider-thumb:hover { transform: scale(1.15); }

            /* 行列排版 */
            .wm-row { display: flex; gap: 12px; align-items: flex-end; }
            .wm-col { flex: 1; }

            /* 按鈕 */
            .wm-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 12px 16px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 700;
                transition: all 0.2s;
                color: #fff;
            }
            .wm-btn:hover { transform: translateY(-2px); }
            .wm-btn:active { transform: translateY(0); }
            .wm-btn.primary { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 14px rgba(37,99,235,0.3); }
            .wm-btn.primary:hover { box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
            .wm-btn.danger { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 14px rgba(239,68,68,0.3); }
            .wm-btn.warning { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
            .wm-btn.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 4px 14px rgba(139,92,246,0.3); }
            .wm-btn.green { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 14px rgba(16,185,129,0.3); }

            /* 預覽區 */
            .wm-preview-card {
                background: #fff;
                border-radius: 20px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .wm-preview-header {
                padding: 16px 24px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .wm-preview-title {
                font-size: 14px;
                font-weight: 800;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .wm-preview-info {
                font-size: 12px;
                color: #94a3b8;
                font-weight: 600;
            }
            .wm-preview-box {
                background-image:
                    repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%),
                    repeating-linear-gradient(45deg, #f1f5f9 25%, #fff 25%, #fff 75%, #f1f5f9 75%);
                background-position: 0 0, 10px 10px;
                background-size: 20px 20px;
                min-height: 480px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                padding: 16px;
                position: relative;
            }
            #wmCanvas {
                display: none;
                max-width: 100%;
                max-height: 600px;
                object-fit: contain;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                border-radius: 6px;
            }
            .wm-empty-state {
                color: #94a3b8;
                text-align: center;
                padding: 40px;
            }
            .wm-empty-state .empty-icon { font-size: 56px; opacity: 0.6; margin-bottom: 12px; }
            .wm-empty-state .empty-title { font-size: 16px; font-weight: 700; color: #64748b; margin: 0 0 4px; }
            .wm-empty-state .empty-desc { font-size: 13px; margin: 0; }

            /* 提示框 */
            .wm-instruction {
                padding: 14px 16px;
                border-radius: 12px;
                font-size: 13px;
                line-height: 1.6;
                font-weight: 600;
            }
            .wm-instruction.yellow { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
            .wm-instruction.blue { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; }
            .wm-instruction.purple { background: #faf5ff; border: 1px solid #d8b4fe; color: #581c87; }

            /* 操作按鈕列 */
            .wm-action-bar {
                display: flex;
                gap: 10px;
                padding-top: 12px;
                border-top: 1px solid #e2e8f0;
            }

            /* 快捷文字模板 */
            .wm-template-wrap {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 6px;
            }
            .wm-template-btn {
                padding: 5px 10px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid #bfdbfe;
                background: #eff6ff;
                color: #2563eb;
            }
            .wm-template-btn:hover {
                background: #2563eb;
                color: #fff;
                transform: scale(1.05);
            }

            /* 色彩預設  */
            .wm-color-presets {
                display: flex;
                gap: 6px;
                margin-top: 6px;
                flex-wrap: wrap;
            }
            .wm-color-dot {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.2s;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            }
            .wm-color-dot:hover { transform: scale(1.2); }
            .wm-color-dot.selected { border-color: #1e293b; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1e293b; }

            /* 動畫 */
            @keyframes wmSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .wm-anim { animation: wmSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            .wm-anim-d1 { animation-delay: 0.1s; opacity: 0; }
            .wm-anim-d2 { animation-delay: 0.2s; opacity: 0; }
        </style>

        <div class="wm-app">
            <!-- Hero -->
            <div class="wm-hero wm-anim">
                <h2>🛡️ 機密防盜浮水印工具</h2>
                <p>為您的圖片加上專業浮水印、修復瑕疵、遮蔽個資 — 全部在瀏覽器完成，圖片不上傳</p>
                <div class="hero-badges">
                    <span class="hero-badge">🔒 100% 本機處理</span>
                    <span class="hero-badge">🛡️ 滿版防盜浮水印</span>
                    <span class="hero-badge">✨ 仿印章修復</span>
                    <span class="hero-badge">🔲 馬賽克遮蔽</span>
                    <span class="hero-badge">💎 AI 浮水印移除</span>
                </div>
            </div>

            <div class="wm-main-grid">
                <!-- 左欄：控制區 -->
                <div style="display:flex;flex-direction:column;gap:20px;">
                    <!-- 上傳區 -->
                    <div class="wm-card wm-anim wm-anim-d1" style="gap:12px;">
                        <div id="wmDropzone" class="wm-dropzone">
                            <div class="wm-dropzone-icon">📤</div>
                            <p class="wm-dropzone-title">點擊上傳 或 拖曳圖片至此</p>
                            <p class="wm-dropzone-sub">支援 JPG, PNG, WebP</p>
                            <input type="file" id="wmUp" accept="image/png, image/jpeg, image/webp" style="display: none;">
                        </div>
                    </div>

                    <!-- 功能分頁 -->
                    <div class="wm-card wm-anim wm-anim-d1" style="gap:14px;">
                        <div class="wm-tabs">
                            <button class="wm-tab active" data-tab="add">🛡️ 浮水印</button>
                            <button class="wm-tab" data-tab="heal">✨ 修復</button>
                            <button class="wm-tab" data-tab="mosaic">🔲 馬賽克</button>
                            <button class="wm-tab" data-tab="unmosaic">🪄 柔化</button>
                            <button class="wm-tab" data-tab="rmgemini">💎 移除</button>
                        </div>

                        <!-- 加浮水印面板 -->
                        <div class="wm-panel active" id="tab-add">
                            <div>
                                <label class="wm-label">✍️ 浮水印內容</label>
                                <input type="text" id="wmTxt" class="wm-input" value="僅供辦理OO業務使用，他用無效" placeholder="請輸入浮水印文字">
                            </div>

                            <div>
                                <div style="font-size:12px;color:#94a3b8;font-weight:600;margin-bottom:6px;">📌 快速套用模板</div>
                                <div class="wm-template-wrap">
                                    <button class="wm-template-btn" data-text="僅供辦理OO業務使用">辦理業務</button>
                                    <button class="wm-template-btn" data-text="機密文件 請勿外流">機密文件</button>
                                    <button class="wm-template-btn" data-text="CONFIDENTIAL">CONFIDENTIAL</button>
                                    <button class="wm-template-btn" data-text="DRAFT 草稿">DRAFT</button>
                                    <button class="wm-template-btn" data-text="SAMPLE 樣本">SAMPLE</button>
                                    <button class="wm-template-btn" data-text="版權所有 翻印必究">版權聲明</button>
                                </div>
                            </div>

                            <div class="wm-row">
                                <div class="wm-col" style="flex:0.8;">
                                    <label class="wm-label">字體</label>
                                    <select id="wmFont" class="wm-select">
                                        <option value="sans-serif">預設黑體</option>
                                        <option value="serif">優雅明體</option>
                                        <option value="monospace">等寬字體</option>
                                        <option value="'Microsoft JhengHei'">微軟正黑</option>
                                    </select>
                                </div>
                                <div class="wm-col" style="flex:1.2;">
                                    <label class="wm-label">排版模式</label>
                                    <select id="wmMode" class="wm-select">
                                        <option value="tile">滿版交錯 (防盜最佳)</option>
                                        <option value="center">置中單一</option>
                                        <option value="diagonal">對角線排列</option>
                                    </select>
                                </div>
                            </div>

                            <div class="wm-row" style="align-items:center;">
                                <div>
                                    <label class="wm-label">顏色</label>
                                    <input type="color" id="wmColor" value="#ffffff" style="width:44px;height:36px;padding:0;border:none;border-radius:8px;cursor:pointer;margin-top:4px;">
                                </div>
                                <div style="flex:1;">
                                    <div class="wm-color-presets" id="wmColorPresets">
                                        <div class="wm-color-dot selected" data-color="#ffffff" style="background:#fff;"></div>
                                        <div class="wm-color-dot" data-color="#000000" style="background:#000;"></div>
                                        <div class="wm-color-dot" data-color="#ef4444" style="background:#ef4444;"></div>
                                        <div class="wm-color-dot" data-color="#f59e0b" style="background:#f59e0b;"></div>
                                        <div class="wm-color-dot" data-color="#3b82f6" style="background:#3b82f6;"></div>
                                        <div class="wm-color-dot" data-color="#8b5cf6" style="background:#8b5cf6;"></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="wm-label">不透明度 <span class="wm-label-val"><span id="wmOpVal">50</span>%</span></label>
                                <input type="range" id="wmOp" class="wm-range" min="0" max="100" value="50">
                            </div>
                            <div>
                                <label class="wm-label">📐 文字大小 <span class="wm-label-val"><span id="wmSizeVal">40</span>px</span></label>
                                <input type="range" id="wmSize" class="wm-range" min="15" max="150" value="40">
                            </div>
                            <div>
                                <label class="wm-label">🔄 旋轉角度 <span class="wm-label-val"><span id="wmAngleVal">-30</span>°</span></label>
                                <input type="range" id="wmAngle" class="wm-range" min="-90" max="90" value="-30">
                            </div>
                            <div>
                                <label class="wm-label">📏 分布間距 <span class="wm-label-val"><span id="wmSpaceVal">120</span>px</span></label>
                                <input type="range" id="wmSpace" class="wm-range" min="20" max="400" value="120">
                            </div>
                        </div>

                        <!-- 修復面板 -->
                        <div class="wm-panel" id="tab-heal">
                            <div class="wm-instruction yellow">
                                <strong>💡 無痕修復教學：</strong><br>
                                1. 按住 <strong>Shift 鍵</strong>，點擊圖片上「乾淨」的背景作為取樣點<br>
                                2. 放開 Shift，在瑕疵處<strong>按住左鍵塗抹</strong>進行覆蓋
                            </div>
                            <div>
                                <label class="wm-label">🖌️ 修復筆刷大小 <span class="wm-label-val"><span id="wmHealSizeVal">40</span>px</span></label>
                                <input type="range" id="wmHealSize" class="wm-range" min="10" max="150" value="40">
                            </div>
                        </div>

                        <!-- 馬賽克面板 -->
                        <div class="wm-panel" id="tab-mosaic">
                            <div class="wm-instruction yellow">
                                <strong>⚠️ 注意：</strong>馬賽克會永久覆蓋影像資訊，適用於遮蔽個資、臉部等敏感區域。
                            </div>
                            <div>
                                <label class="wm-label">🧽 筆刷大小 <span class="wm-label-val"><span id="wmBrushSizeVal">30</span>px</span></label>
                                <input type="range" id="wmBrushSize" class="wm-range" min="10" max="100" value="30">
                            </div>
                            <div>
                                <label class="wm-label">🧱 馬賽克強度 <span class="wm-label-val"><span id="wmBrushStrengthVal">15</span></span></label>
                                <input type="range" id="wmBrushStrength" class="wm-range" min="5" max="50" value="15">
                            </div>
                        </div>

                        <!-- 柔化面板 -->
                        <div class="wm-panel" id="tab-unmosaic">
                            <div class="wm-instruction blue">
                                <strong>🪄 技術說明：</strong><br>
                                純前端無法還原馬賽克的真實細節。此工具透過高階柔化演算法，讓方塊邊緣模糊化，視覺上更自然。
                            </div>
                            <div>
                                <label class="wm-label">🧽 柔化筆刷 <span class="wm-label-val"><span id="wmUnmosaicSizeVal">30</span>px</span></label>
                                <input type="range" id="wmUnmosaicSize" class="wm-range" min="10" max="150" value="30">
                            </div>
                            <div>
                                <label class="wm-label">💧 柔化強度 <span class="wm-label-val"><span id="wmUnmosaicStrengthVal">5</span></span></label>
                                <input type="range" id="wmUnmosaicStrength" class="wm-range" min="1" max="20" value="5">
                            </div>
                        </div>

                        <!-- 移除 Gemini 面板 -->
                        <div class="wm-panel" id="tab-rmgemini">
                            <div class="wm-instruction purple">
                                <strong>🤖 一鍵移除 Gemini/AI 浮水印：</strong><br>
                                若效果不佳，請將下方「覆蓋範圍」調大後重試。原理是用鄰近像素拉伸覆蓋右下角浮水印區域。
                            </div>
                            <div>
                                <label class="wm-label">🎯 覆蓋範圍 <span class="wm-label-val"><span id="wmGeminiSizeVal">120</span>px</span></label>
                                <input type="range" id="wmGeminiSize" class="wm-range" min="50" max="500" value="120">
                            </div>
                            <button id="wmAutoRemoveBtn" class="wm-btn purple">
                                💎 一鍵移除右下角浮水印
                            </button>
                        </div>
                    </div>

                    <!-- 操作按鈕 -->
                    <div class="wm-card wm-anim wm-anim-d2" style="gap:10px;padding:20px;">
                        <div class="wm-row">
                            <button id="wmDeleteBtn" class="wm-btn danger wm-col">🗑️ 刪除圖片</button>
                            <button id="wmResetBtn" class="wm-btn warning wm-col">🔄 還原原圖</button>
                        </div>
                        <button id="wmDownloadBtn" class="wm-btn primary">
                            📥 下載最終圖片 (PNG)
                        </button>
                        <button id="wmDownloadJpgBtn" class="wm-btn green">
                            📥 下載壓縮圖片 (JPG 80%)
                        </button>
                    </div>
                </div>

                <!-- 右欄：預覽區 -->
                <div class="wm-preview-card wm-anim wm-anim-d2">
                    <div class="wm-preview-header">
                        <span class="wm-preview-title">🖼️ 即時預覽</span>
                        <span class="wm-preview-info" id="wmImgInfo">尚未上傳圖片</span>
                    </div>
                    <div class="wm-preview-box" id="wmPreviewBox">
                        <div id="wmEmpty" class="wm-empty-state">
                            <div class="empty-icon">🖼️</div>
                            <p class="empty-title">預覽區</p>
                            <p class="empty-desc">請先上傳圖片以開始編輯</p>
                        </div>
                        <canvas id="wmCanvas"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        // --- DOM ---
        const dropzone = document.getElementById('wmDropzone');
        const imgUp = document.getElementById('wmUp');
        const canvas = document.getElementById('wmCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const emptyState = document.getElementById('wmEmpty');
        const imgInfo = document.getElementById('wmImgInfo');

        const tabs = document.querySelectorAll('.wm-tab');
        const panels = document.querySelectorAll('.wm-panel');

        const downloadBtn = document.getElementById('wmDownloadBtn');
        const downloadJpgBtn = document.getElementById('wmDownloadJpgBtn');
        const resetBtn = document.getElementById('wmResetBtn');
        const deleteBtn = document.getElementById('wmDeleteBtn');
        const autoRemoveBtn = document.getElementById('wmAutoRemoveBtn');

        const textIn = document.getElementById('wmTxt');
        const colorIn = document.getElementById('wmColor');
        const opIn = document.getElementById('wmOp');
        const sizeIn = document.getElementById('wmSize');
        const spaceIn = document.getElementById('wmSpace');
        const angleIn = document.getElementById('wmAngle');
        const fontIn = document.getElementById('wmFont');
        const modeIn = document.getElementById('wmMode');

        const healSizeIn = document.getElementById('wmHealSize');
        const brushSizeIn = document.getElementById('wmBrushSize');
        const brushStrengthIn = document.getElementById('wmBrushStrength');
        const unmosaicSizeIn = document.getElementById('wmUnmosaicSize');
        const unmosaicStrengthIn = document.getElementById('wmUnmosaicStrength');
        const geminiSizeIn = document.getElementById('wmGeminiSize');

        let originalImage = null;
        let currentMode = 'add';
        let isDrawing = false;
        let cloneSource = null;
        let cloneOffset = { dx: 0, dy: 0 };

        // --- 模板按鈕 ---
        document.querySelectorAll('.wm-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                textIn.value = btn.dataset.text;
                render();
            });
        });

        // --- 色彩預設 ---
        document.querySelectorAll('.wm-color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.wm-color-dot').forEach(d => d.classList.remove('selected'));
                dot.classList.add('selected');
                colorIn.value = dot.dataset.color;
                render();
            });
        });

        // --- 輔助函式 ---
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // --- 核心渲染 ---
        function render() {
            if (!originalImage) return;
            if (currentMode === 'add') {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0);
                drawWatermark();
            } else {
                if (canvas.width !== originalImage.width) {
                    canvas.width = originalImage.width;
                    canvas.height = originalImage.height;
                    ctx.drawImage(originalImage, 0, 0);
                }
            }
        }

        function drawWatermark() {
            const text = textIn.value;
            const alpha = parseInt(opIn.value) / 100;
            if (!text.trim() || alpha === 0) return;

            const size = parseInt(sizeIn.value);
            const space = parseInt(spaceIn.value);
            const angle = parseInt(angleIn.value) * Math.PI / 180;
            const font = fontIn.value;
            const mode = modeIn.value;

            ctx.fillStyle = hexToRgba(colorIn.value, alpha);
            const r = parseInt(colorIn.value.slice(1, 3), 16);
            ctx.strokeStyle = r > 128 ? `rgba(0,0,0,${alpha * 0.8})` : `rgba(255,255,255,${alpha * 0.8})`;
            ctx.lineWidth = size * 0.05;
            ctx.font = `bold ${size}px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.save();
            if (mode === 'center') {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
            } else if (mode === 'diagonal') {
                const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                for (let y = -diagonal; y < diagonal; y += space * 1.5) {
                    ctx.strokeText(text, 0, y);
                    ctx.fillText(text, 0, y);
                }
            } else {
                const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle);
                for (let x = -diagonal; x < diagonal; x += space * 2) {
                    for (let y = -diagonal; y < diagonal; y += space) {
                        const offsetX = (Math.abs(y / space) % 2) === 1 ? space : 0;
                        ctx.strokeText(text, x + offsetX, y);
                        ctx.fillText(text, x + offsetX, y);
                    }
                }
            }
            ctx.restore();
        }

        function handleImage(file) {
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    originalImage = img;
                    emptyState.style.display = 'none';
                    canvas.style.display = 'block';
                    canvas.width = 0;

                    const sizeKB = Math.round(file.size / 1024);
                    imgInfo.textContent = `${img.width} × ${img.height}px · ${sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'}`;

                    render();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }

        // --- 分頁 ---
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
                currentMode = tab.dataset.tab;

                if (currentMode === 'heal') canvas.style.cursor = 'crosshair';
                else if (currentMode === 'mosaic' || currentMode === 'unmosaic') canvas.style.cursor = 'cell';
                else canvas.style.cursor = 'default';
                render();
            });
        });

        // --- Canvas 互動 ---
        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return { x: (evt.clientX - rect.left) * scaleX, y: (evt.clientY - rect.top) * scaleY };
        }

        function applyHeal(x, y) {
            if (!cloneSource) return;
            const size = parseInt(healSizeIn.value);
            const sourceX = x + cloneOffset.dx;
            const sourceY = y + cloneOffset.dy;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(canvas, sourceX - size / 2, sourceY - size / 2, size, size, x - size / 2, y - size / 2, size, size);
            ctx.restore();
        }

        function applyMosaic(x, y) {
            if (!originalImage) return;
            const brushSize = parseInt(brushSizeIn.value);
            const strength = parseInt(brushStrengthIn.value);
            const halfSize = brushSize / 2;
            const startX = Math.max(0, x - halfSize);
            const startY = Math.max(0, y - halfSize);
            const width = Math.min(canvas.width - startX, brushSize);
            const height = Math.min(canvas.height - startY, brushSize);
            if (width <= 0 || height <= 0) return;
            const imgData = ctx.getImageData(startX, startY, width, height);
            const data = imgData.data;
            for (let i = 0; i < height; i += strength) {
                for (let j = 0; j < width; j += strength) {
                    const pixelIndex = (i * width + j) * 4;
                    const rr = data[pixelIndex], gg = data[pixelIndex + 1], bb = data[pixelIndex + 2];
                    for (let bi = 0; bi < strength; bi++) {
                        for (let bj = 0; bj < strength; bj++) {
                            if (i + bi < height && j + bj < width) {
                                const ti = ((i + bi) * width + (j + bj)) * 4;
                                data[ti] = rr; data[ti + 1] = gg; data[ti + 2] = bb; data[ti + 3] = 255;
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, startX, startY);
        }

        function applyUnmosaic(x, y) {
            if (!originalImage) return;
            const size = parseInt(unmosaicSizeIn.value);
            const strength = parseInt(unmosaicStrengthIn.value);
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tCtx = tempCanvas.getContext('2d');
            tCtx.filter = `blur(${strength}px)`;
            tCtx.drawImage(canvas, 0, 0);
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        }

        // --- Canvas 事件 ---
        canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(e);
            if (currentMode === 'heal') {
                if (e.shiftKey) {
                    cloneSource = { x: pos.x, y: pos.y };
                    return;
                } else {
                    if (!cloneSource) { alert('請先按住 Shift 鍵並點擊圖片中乾淨的區域！'); return; }
                    isDrawing = true;
                    cloneOffset = { dx: cloneSource.x - pos.x, dy: cloneSource.y - pos.y };
                    applyHeal(pos.x, pos.y);
                }
            } else if (currentMode === 'mosaic') {
                isDrawing = true;
                applyMosaic(pos.x, pos.y);
            } else if (currentMode === 'unmosaic') {
                isDrawing = true;
                applyUnmosaic(pos.x, pos.y);
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const pos = getMousePos(e);
            if (currentMode === 'heal') applyHeal(pos.x, pos.y);
            else if (currentMode === 'mosaic') applyMosaic(pos.x, pos.y);
            else if (currentMode === 'unmosaic') applyUnmosaic(pos.x, pos.y);
        });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        // --- 上傳事件 ---
        dropzone.addEventListener('click', () => imgUp.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            handleImage(e.dataTransfer.files[0]);
        });
        imgUp.addEventListener('change', (e) => handleImage(e.target.files[0]));

        // --- 滑桿同步 ---
        const valMaps = {
            'wmOp': 'wmOpVal', 'wmSize': 'wmSizeVal', 'wmSpace': 'wmSpaceVal', 'wmAngle': 'wmAngleVal',
            'wmBrushSize': 'wmBrushSizeVal', 'wmBrushStrength': 'wmBrushStrengthVal',
            'wmHealSize': 'wmHealSizeVal', 'wmUnmosaicSize': 'wmUnmosaicSizeVal',
            'wmUnmosaicStrength': 'wmUnmosaicStrengthVal', 'wmGeminiSize': 'wmGeminiSizeVal'
        };
        const allInputs = [textIn, colorIn, opIn, sizeIn, spaceIn, angleIn, fontIn, modeIn, brushSizeIn, brushStrengthIn, healSizeIn, unmosaicSizeIn, unmosaicStrengthIn, geminiSizeIn];
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (valMaps[input.id]) document.getElementById(valMaps[input.id]).textContent = input.value;
                if (input.id === 'wmMode') {
                    spaceIn.disabled = (input.value === 'center');
                    spaceIn.style.opacity = (input.value === 'center') ? '0.5' : '1';
                }
                if (currentMode === 'add') render();
            });
        });

        // --- Gemini 一鍵移除 ---
        autoRemoveBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            const size = parseInt(geminiSizeIn.value);
            const w = canvas.width, h = canvas.height;
            const sliceWidth = 10;
            const sourceX = Math.max(0, w - size - sliceWidth);
            const sourceY = Math.max(0, h - size);
            if (sourceX >= 0) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = sliceWidth; tempCanvas.height = size;
                const tCtx = tempCanvas.getContext('2d');
                tCtx.drawImage(canvas, sourceX, sourceY, sliceWidth, size, 0, 0, sliceWidth, size);
                ctx.save();
                ctx.drawImage(tempCanvas, 0, 0, sliceWidth, size, w - size, h - size, size, size);
                ctx.restore();
                const origHTML = autoRemoveBtn.innerHTML;
                autoRemoveBtn.innerHTML = '✅ 移除完成！(若效果不佳請調大數值再試)';
                autoRemoveBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                setTimeout(() => { autoRemoveBtn.innerHTML = origHTML; autoRemoveBtn.style.background = ''; }, 2000);
            }
        });

        // --- 操作按鈕 ---
        deleteBtn.addEventListener('click', () => {
            if (!originalImage) return alert('目前沒有圖片可以刪除！');
            if (confirm('確定要刪除當前圖片並重新開始嗎？')) {
                originalImage = null;
                imgUp.value = '';
                canvas.style.display = 'none';
                emptyState.style.display = 'block';
                imgInfo.textContent = '尚未上傳圖片';
            }
        });

        resetBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.drawImage(originalImage, 0, 0);
            if (currentMode === 'add') drawWatermark();
        });

        downloadBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            const link = document.createElement('a');
            link.download = `Watermarked_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });

        downloadJpgBtn.addEventListener('click', () => {
            if (!originalImage) return alert('請先上傳圖片！');
            const link = document.createElement('a');
            link.download = `Watermarked_${Date.now()}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.8);
            link.click();
        });

    }, 0);
};
