window.render_fileConverter = function () {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto relative">
            <div class="absolute -top-10 -right-10 w-60 h-60 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
            <div class="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style="animation-delay:2s"></div>

            <div class="relative z-10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/60">
                <h3 class="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 mb-2 text-center">🔄 萬能檔案轉換器</h3>
                <p class="text-slate-500 text-center mb-6 text-sm">純瀏覽器處理，檔案不上傳伺服器，100% 隱私安全</p>

                <div id="fc-tabs" class="flex flex-wrap gap-2 justify-center mb-6">
                    <button class="fc-tab active px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="image">🖼️ 圖片互轉</button>
                    <button class="fc-tab px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="video">🎬 影片互轉</button>
                    <button class="fc-tab px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="spreadsheet">📊 表格互轉</button>
                    <button class="fc-tab px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="pdf">📄 轉為 PDF</button>
                    <button class="fc-tab px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="markdown">📝 Markdown</button>
                    <button class="fc-tab px-4 py-2 rounded-full text-sm font-bold transition-all" data-tab="json">🔄 JSON 工具</button>
                </div>

                <div id="fc-content"></div>
            </div>
        </div>
        <style>
            .fc-tab{background:#f1f5f9;color:#64748b;border:2px solid transparent}
            .fc-tab:hover{background:#e2e8f0;color:#334155}
            .fc-tab.active{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;border-color:transparent;box-shadow:0 4px 15px rgba(124,58,237,.3)}
            .fc-drop{border:2px dashed #cbd5e1;border-radius:1rem;padding:2.5rem 1.5rem;text-align:center;cursor:pointer;transition:all .3s;background:#fafbfc}
            .fc-drop:hover,.fc-drop.dragover{border-color:#7c3aed;background:#f5f3ff;transform:scale(1.01)}
            .fc-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:.75rem;font-weight:700;font-size:.95rem;transition:all .3s;cursor:pointer}
            .fc-btn-primary{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;box-shadow:0 4px 15px rgba(124,58,237,.25)}
            .fc-btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,.35)}
            .fc-btn-secondary{background:#f1f5f9;color:#475569}
            .fc-btn-secondary:hover{background:#e2e8f0}
            .fc-select{padding:.5rem 1rem;border-radius:.5rem;border:2px solid #e2e8f0;font-weight:600;outline:none;transition:border .2s}
            .fc-select:focus{border-color:#7c3aed}
            .fc-label{font-weight:700;color:#334155;font-size:.85rem;margin-bottom:.25rem;display:block}
            .fc-card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,.04)}
            .fc-file-info{display:flex;align-items:center;gap:.75rem;background:#f8fafc;padding:.75rem 1rem;border-radius:.75rem;margin-bottom:1rem;border:1px solid #e2e8f0}
            .fc-progress{width:100%;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;margin:1rem 0}
            .fc-progress-bar{height:100%;background:linear-gradient(90deg,#7c3aed,#06b6d4);border-radius:3px;transition:width .3s}
            .fc-result-img{max-width:100%;max-height:300px;border-radius:.75rem;object-fit:contain;background:#f1f5f9;margin:0 auto;display:block}
        </style>
    `;

    setTimeout(() => {
        const tabs = document.querySelectorAll('.fc-tab');
        const content = document.getElementById('fc-content');

        // ========== 共用工具函式 ==========
        function setupDropZone(dropId, inputId, acceptTypes, onFiles) {
            const drop = document.getElementById(dropId);
            const input = document.getElementById(inputId);
            if (!drop || !input) return;
            drop.onclick = () => input.click();
            input.onchange = e => { if (e.target.files.length) onFiles(Array.from(e.target.files)); input.value = ''; };
            ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
            ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
            drop.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files)); });
        }

        function downloadBlob(blob, filename) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }

        function downloadText(text, filename, mime) {
            downloadBlob(new Blob([text], { type: mime || 'text/plain;charset=utf-8' }), filename);
        }

        function fileIcon(name) {
            const ext = name.split('.').pop().toLowerCase();
            const map = {
                jpg: '🖼️', jpeg: '🖼️', png: '🖼️', webp: '🖼️', bmp: '🖼️', gif: '🖼️',
                csv: '📊', xlsx: '📊', xls: '📊', json: '📦', txt: '📄', md: '📝', pdf: '📕', html: '🌐',
                mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬'
            };
            return map[ext] || '📎';
        }

        function formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(1) + ' MB';
        }

        function loadScript(url) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
                const s = document.createElement('script');
                s.src = url;
                s.onload = resolve;
                s.onerror = () => reject(new Error('載入失敗: ' + url));
                document.head.appendChild(s);
            });
        }

        // ========== Tab 渲染函式 ==========
        const tabRenderers = {
            image: renderImage,
            video: renderVideo,
            spreadsheet: renderSpreadsheet,
            pdf: renderPDF,
            markdown: renderMarkdown,
            json: renderJSON
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                tabRenderers[tab.dataset.tab]();
            });
        });

        // 預設顯示圖片 Tab
        renderImage();

        // ==================== 🖼️ 圖片互轉 ====================
        function renderImage() {
            content.innerHTML = `
                <div class="fc-card">
                    <div class="flex flex-wrap items-end gap-4 mb-4">
                        <div class="flex-1 min-w-[150px]"><label class="fc-label">輸出格式</label>
                            <select id="fc-img-fmt" class="fc-select w-full">
                                <option value="png">PNG（無損透明）</option>
                                <option value="jpeg">JPG（高壓縮照片）</option>
                                <option value="webp">WebP（現代高效）</option>
                                <option value="bmp">BMP（無壓縮點陣圖）</option>
                                <option value="gif">GIF（動畫相容）</option>
                            </select>
                        </div>
                        <div class="min-w-[140px]"><label class="fc-label">品質 <span id="fc-img-q-val">85</span>%</label>
                            <input type="range" id="fc-img-q" min="10" max="100" value="85" class="w-full accent-violet-600">
                        </div>
                        <div class="min-w-[120px]"><label class="fc-label">最大寬度 (px)</label>
                            <input type="number" id="fc-img-w" placeholder="原始大小" class="fc-select w-full" min="1">
                        </div>
                    </div>
                    <div class="fc-drop" id="fc-img-drop">
                        <input type="file" id="fc-img-input" accept="image/*" multiple class="hidden">
                        <div class="text-5xl mb-3">🖼️</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳圖片到這裡，或點擊選擇</p>
                        <p class="text-slate-400 text-sm mt-1">支援 JPG / PNG / WebP / BMP / GIF，可多選批次轉換</p>
                    </div>
                    <div id="fc-img-batch" class="mt-3 hidden flex justify-center"><button id="fc-img-dl-all" class="fc-btn fc-btn-primary">📦 批次下載全部</button></div>
                    <div id="fc-img-results" class="mt-4 space-y-3"></div>
                </div>`;
            setTimeout(() => {
                const qSlider = document.getElementById('fc-img-q');
                const qVal = document.getElementById('fc-img-q-val');
                qSlider.oninput = () => qVal.textContent = qSlider.value;

                window._fcImgBlobs = [];
                const batchBtn = document.getElementById('fc-img-dl-all');
                if (batchBtn) batchBtn.onclick = () => {
                    if (!window._fcImgBlobs || window._fcImgBlobs.length === 0) return;
                    window._fcImgBlobs.forEach(item => {
                        const a = document.createElement('a'); a.href = item.url; a.download = item.name;
                        document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    });
                };
                setupDropZone('fc-img-drop', 'fc-img-input', 'image/*', files => {
                    const results = document.getElementById('fc-img-results');
                    const fmt = document.getElementById('fc-img-fmt').value;
                    const quality = parseInt(qSlider.value) / 100;
                    const maxW = parseInt(document.getElementById('fc-img-w').value) || 0;
                    const mimeMap = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', bmp: 'image/bmp', gif: 'image/gif' };

                    files.forEach(file => {
                        if (!file.type.startsWith('image/')) return;
                        const itemId = 'img-' + Date.now() + Math.random().toString(36).slice(2, 6);
                        results.innerHTML += `<div id="${itemId}" class="fc-file-info"><span class="text-2xl">${fileIcon(file.name)}</span><div class="flex-1 min-w-0"><div class="font-bold text-sm text-slate-700 truncate">${file.name} <span class="text-slate-400 font-normal">(${formatSize(file.size)})</span></div><div class="fc-progress"><div class="fc-progress-bar" style="width:30%"></div></div><div class="text-xs text-slate-400">轉換中...</div></div></div>`;

                        const reader = new FileReader();
                        reader.onload = ev => {
                            const img = new Image();
                            img.onload = () => {
                                let w = img.width, h = img.height;
                                if (maxW > 0 && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
                                const canvas = document.createElement('canvas');
                                canvas.width = w; canvas.height = h;
                                const ctx = canvas.getContext('2d');
                                if (fmt === 'jpeg' || fmt === 'bmp') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
                                ctx.drawImage(img, 0, 0, w, h);

                                canvas.toBlob(blob => {
                                    if (!blob) { document.getElementById(itemId).querySelector('.text-xs').textContent = '❌ 轉換失敗'; return; }
                                    const url = URL.createObjectURL(blob);
                                    const newName = file.name.replace(/\.[^.]+$/, '.' + (fmt === 'jpeg' ? 'jpg' : fmt));
                                    if (!window._fcImgBlobs) window._fcImgBlobs = [];
                                    window._fcImgBlobs.push({ url, name: newName, blob });
                                    const batchDiv = document.getElementById('fc-img-batch');
                                    if (window._fcImgBlobs.length > 1 && batchDiv) batchDiv.classList.remove('hidden');
                                    const el = document.getElementById(itemId);
                                    el.innerHTML = `<span class="text-2xl">✅</span><div class="flex-1 min-w-0"><div class="font-bold text-sm text-slate-700 truncate">${newName} <span class="text-slate-400 font-normal">(${formatSize(blob.size)})</span></div><div class="text-xs text-emerald-600 font-semibold">轉換完成 — ${w}×${h}px</div><img src="${url}" class="fc-result-img mt-2" style="max-height:120px;border-radius:.5rem"></div><button class="fc-btn fc-btn-primary text-sm" style="padding:.5rem 1rem" onclick="(function(){var a=document.createElement('a');a.href='${url}';a.download='${newName}';document.body.appendChild(a);a.click();document.body.removeChild(a)})()">⬇️ 下載</button>`;
                                }, mimeMap[fmt] || 'image/png', quality);
                            };
                            img.onerror = () => { const el = document.getElementById(itemId); if (el) el.querySelector('.text-xs').textContent = '❌ 圖片載入失敗'; };
                            img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                    });
                });
            }, 0);
        }

        // ==================== 🎬 影片互轉 ====================
        function renderVideo() {
            // 偵測瀏覽器支援的 MIME 類型
            const supportedMimes = [];
            const mimeTests = [
                { value: 'webm', label: 'WebM（網頁最佳化）', mime: 'video/webm;codecs=vp8,opus' },
                { value: 'webm-vp9', label: 'WebM VP9（高畫質）', mime: 'video/webm;codecs=vp9,opus' },
                { value: 'mp4', label: 'MP4（高相容性）', mime: 'video/mp4' },
            ];
            mimeTests.forEach(m => {
                if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m.mime)) {
                    supportedMimes.push(m);
                }
            });
            // 至少加一個 webm fallback
            if (supportedMimes.length === 0 && typeof MediaRecorder !== 'undefined') {
                supportedMimes.push({ value: 'webm', label: 'WebM（網頁最佳化）', mime: 'video/webm' });
            }

            const optionsHtml = supportedMimes.map(m => `<option value="${m.value}" data-mime="${m.mime}">${m.label}</option>`).join('');

            content.innerHTML = `
                <div class="fc-card">
                    <div class="flex flex-wrap items-end gap-4 mb-4">
                        <div class="flex-1 min-w-[150px]"><label class="fc-label">輸出格式</label>
                            <select id="fc-vid-fmt" class="fc-select w-full">
                                ${optionsHtml || '<option disabled>您的瀏覽器不支援影片錄製</option>'}
                            </select>
                        </div>
                        <div class="min-w-[120px]"><label class="fc-label">起始秒數</label>
                            <input type="number" id="fc-vid-start" placeholder="0" min="0" step="0.1" class="fc-select w-full">
                        </div>
                        <div class="min-w-[120px]"><label class="fc-label">結束秒數</label>
                            <input type="number" id="fc-vid-end" placeholder="結尾" min="0" step="0.1" class="fc-select w-full">
                        </div>
                    </div>
                    <div class="fc-drop" id="fc-vid-drop">
                        <input type="file" id="fc-vid-input" accept="video/*" class="hidden">
                        <div class="text-5xl mb-3">🎬</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳影片到這裡，或點擊選擇</p>
                        <p class="text-slate-400 text-sm mt-1">支援瀏覽器可播放的影片格式（MP4 / WebM 等）</p>
                    </div>
                    <div id="fc-vid-info" class="mt-3 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        💡 此功能使用瀏覽器原生 MediaRecorder API 進行轉換，無需下載額外引擎。支援的輸出格式取決於您的瀏覽器。轉換大型影片時請耐心等候。
                    </div>
                    <div id="fc-vid-preview" class="mt-4 hidden">
                        <label class="fc-label mb-2">影片預覽</label>
                        <video id="fc-vid-player" class="w-full max-h-[300px] rounded-xl bg-black" controls></video>
                    </div>
                    <div id="fc-vid-results" class="mt-4 space-y-3"></div>
                </div>`;

            setTimeout(() => {
                setupDropZone('fc-vid-drop', 'fc-vid-input', 'video/*', async files => {
                    const file = files[0];
                    if (!file) return;

                    const fmtSelect = document.getElementById('fc-vid-fmt');
                    const selectedOption = fmtSelect.options[fmtSelect.selectedIndex];
                    if (!selectedOption || !selectedOption.dataset.mime) {
                        alert('您的瀏覽器不支援影片格式轉換功能');
                        return;
                    }
                    const targetMime = selectedOption.dataset.mime;
                    const fmt = fmtSelect.value.replace('-vp9', '');
                    const results = document.getElementById('fc-vid-results');
                    const itemId = 'vid-' + Date.now();

                    const startTime = parseFloat(document.getElementById('fc-vid-start').value) || 0;
                    const endTimeInput = parseFloat(document.getElementById('fc-vid-end').value);

                    // 顯示影片預覽
                    const previewDiv = document.getElementById('fc-vid-preview');
                    const player = document.getElementById('fc-vid-player');
                    const videoUrl = URL.createObjectURL(file);
                    player.src = videoUrl;
                    previewDiv.classList.remove('hidden');

                    // 初始化進度條UI
                    results.innerHTML = `<div id="${itemId}" class="fc-file-info"><span class="text-2xl">${fileIcon(file.name)}</span><div class="flex-1 min-w-0"><div class="font-bold text-sm text-slate-700 truncate">${file.name} <span class="text-slate-400 font-normal">(${formatSize(file.size)})</span></div><div class="fc-progress"><div id="prog-${itemId}" class="fc-progress-bar" style="width:0%"></div></div><div id="status-${itemId}" class="text-xs text-violet-600 font-semibold">載入影片中...</div></div></div>`;

                    try {
                        // 等待影片元資料載入
                        const video = document.createElement('video');
                        video.muted = true;
                        video.playsInline = true;
                        video.preload = 'auto';
                        video.src = videoUrl;

                        await new Promise((resolve, reject) => {
                            video.onloadedmetadata = resolve;
                            video.onerror = () => reject(new Error('無法載入此影片檔案，格式可能不受瀏覽器支援'));
                            setTimeout(() => reject(new Error('影片載入逾時')), 30000);
                        });

                        const duration = video.duration;
                        const endTime = isNaN(endTimeInput) ? duration : Math.min(endTimeInput, duration);
                        const clipDuration = endTime - startTime;

                        if (clipDuration <= 0) {
                            throw new Error('起始秒數必須小於結束秒數');
                        }

                        document.getElementById(`status-${itemId}`).textContent = `影片長度 ${duration.toFixed(1)}s，將轉換 ${startTime.toFixed(1)}s ~ ${endTime.toFixed(1)}s`;

                        // 使用 Canvas + MediaRecorder 進行轉換
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth || 1280;
                        canvas.height = video.videoHeight || 720;
                        const ctx = canvas.getContext('2d');

                        // 設定起始位置
                        video.currentTime = startTime;
                        await new Promise(r => { video.onseeked = r; });

                        const stream = canvas.captureStream(30);

                        // 嘗試擷取音軌
                        try {
                            const audioCtx = new AudioContext();
                            const source = audioCtx.createMediaElementSource(video);
                            const dest = audioCtx.createMediaStreamDestination();
                            source.connect(dest);
                            source.connect(audioCtx.destination);
                            dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
                        } catch (audioErr) {
                            console.warn('無法擷取音軌（將產生無聲影片）:', audioErr);
                        }

                        const recorder = new MediaRecorder(stream, {
                            mimeType: targetMime,
                            videoBitsPerSecond: 2500000
                        });

                        const chunks = [];
                        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

                        const recordingDone = new Promise((resolve, reject) => {
                            recorder.onstop = resolve;
                            recorder.onerror = e => reject(new Error('錄製過程發生錯誤'));
                        });

                        document.getElementById(`status-${itemId}`).textContent = '開始轉換中...';
                        recorder.start(100);
                        await video.play();

                        // 逐幀繪製到 Canvas 並更新進度
                        const drawFrame = () => {
                            if (video.paused || video.ended || video.currentTime >= endTime) {
                                video.pause();
                                recorder.stop();
                                return;
                            }
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            const progress = Math.min(100, Math.round(((video.currentTime - startTime) / clipDuration) * 100));
                            const progBar = document.getElementById(`prog-${itemId}`);
                            const statusEl = document.getElementById(`status-${itemId}`);
                            if (progBar) progBar.style.width = progress + '%';
                            if (statusEl) statusEl.textContent = `影片轉換中... ${progress}%`;
                            requestAnimationFrame(drawFrame);
                        };
                        requestAnimationFrame(drawFrame);

                        // 監聽影片播放到結束時間
                        video.ontimeupdate = () => {
                            if (video.currentTime >= endTime) {
                                video.pause();
                                if (recorder.state === 'recording') recorder.stop();
                            }
                        };

                        await recordingDone;

                        document.getElementById(`status-${itemId}`).textContent = '產生下載檔案中...';
                        document.getElementById(`prog-${itemId}`).style.width = '100%';

                        const blob = new Blob(chunks, { type: targetMime });
                        const url = URL.createObjectURL(blob);
                        const finalName = file.name.replace(/\.[^.]+$/, '.' + fmt);

                        const el = document.getElementById(itemId);
                        el.innerHTML = `<span class="text-2xl">✅</span><div class="flex-1 min-w-0"><div class="font-bold text-sm text-slate-700 truncate">${finalName} <span class="text-slate-400 font-normal">(${formatSize(blob.size)})</span></div><div class="text-xs text-emerald-600 font-semibold">🎉 轉換完成！片段 ${startTime.toFixed(1)}s ~ ${endTime.toFixed(1)}s</div></div><button class="fc-btn fc-btn-primary text-sm" style="padding:.5rem 1rem" onclick="(function(){var a=document.createElement('a');a.href='${url}';a.download='${finalName}';document.body.appendChild(a);a.click();document.body.removeChild(a)})()">⬇️ 下載</button>`;

                    } catch (err) {
                        console.error(err);
                        document.getElementById(`status-${itemId}`).innerHTML = `<span class="text-red-500 font-bold">❌ 轉換失敗：${err.message || '未知錯誤'}</span>`;
                        const progBar = document.getElementById(`prog-${itemId}`);
                        if (progBar) progBar.style.background = '#ef4444';
                    }
                });
            }, 0);
        }

        // ==================== 📊 表格互轉 ====================
        function renderSpreadsheet() {
            content.innerHTML = `
                <div class="fc-card">
                    <div class="flex flex-wrap gap-4 mb-4 items-end">
                        <div class="flex-1 min-w-[150px]"><label class="fc-label">輸出格式</label>
                            <select id="fc-ss-fmt" class="fc-select w-full">
                                <option value="xlsx">XLSX（Excel 活頁簿）</option>
                                <option value="csv">CSV（逗號分隔值）</option>
                                <option value="json">JSON（結構化資料）</option>
                                <option value="tsv">TSV（Tab 分隔值）</option>
                                <option value="html">HTML 表格</option>
                            </select>
                        </div>
                    </div>
                    <div class="fc-drop" id="fc-ss-drop">
                        <input type="file" id="fc-ss-input" accept=".csv,.xlsx,.xls,.json,.tsv" class="hidden">
                        <div class="text-5xl mb-3">📊</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳表格檔案到這裡</p>
                        <p class="text-slate-400 text-sm mt-1">支援 CSV / XLSX / XLS / JSON / TSV</p>
                    </div>
                    <div id="fc-ss-loading" class="hidden text-center py-8"><div class="w-10 h-10 border-4 border-slate-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-3"></div><p class="text-violet-600 font-bold animate-pulse">載入轉換引擎中...</p></div>
                    <div id="fc-ss-preview" class="mt-4 hidden"></div>
                    <div id="fc-ss-actions" class="mt-4 hidden flex flex-wrap gap-3 justify-center"></div>
                </div>`;
            setTimeout(() => {
                setupDropZone('fc-ss-drop', 'fc-ss-input', '', async files => {
                    const file = files[0];
                    if (!file) return;
                    const loading = document.getElementById('fc-ss-loading');
                    const preview = document.getElementById('fc-ss-preview');
                    const actions = document.getElementById('fc-ss-actions');
                    loading.classList.remove('hidden');
                    preview.classList.add('hidden');
                    actions.classList.add('hidden');

                    try {
                        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js');
                    } catch (e) {
                        loading.innerHTML = '<p class="text-red-500 font-bold">⚠️ SheetJS 引擎載入失敗，請檢查網路連線</p>';
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = ev => {
                        try {
                            let wb;
                            const ext = file.name.split('.').pop().toLowerCase();
                            if (ext === 'json') {
                                const jsonData = JSON.parse(new TextDecoder().decode(new Uint8Array(ev.target.result)));
                                const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
                                const ws = XLSX.utils.json_to_sheet(arr);
                                wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                            } else {
                                wb = XLSX.read(ev.target.result, { type: 'array' });
                            }

                            // 預覽前 10 行
                            const ws = wb.Sheets[wb.SheetNames[0]];
                            const previewData = XLSX.utils.sheet_to_json(ws, { header: 1 }).slice(0, 10);
                            let tableHtml = '<div class="overflow-x-auto rounded-lg border border-slate-200"><table class="min-w-full text-sm"><thead class="bg-slate-100"><tr>';
                            if (previewData.length > 0) {
                                previewData[0].forEach((h, i) => tableHtml += `<th class="px-3 py-2 text-left font-bold text-slate-600 whitespace-nowrap">${h || '欄位' + (i + 1)}</th>`);
                                tableHtml += '</tr></thead><tbody>';
                                previewData.slice(1).forEach(row => {
                                    tableHtml += '<tr class="border-t border-slate-100">';
                                    previewData[0].forEach((_, i) => tableHtml += `<td class="px-3 py-2 text-slate-700 whitespace-nowrap">${row[i] !== undefined ? row[i] : ''}</td>`);
                                    tableHtml += '</tr>';
                                });
                                tableHtml += '</tbody></table></div>';
                                const totalRows = XLSX.utils.sheet_to_json(ws, { header: 1 }).length;
                                tableHtml += `<p class="text-xs text-slate-400 mt-2 text-center">預覽前 ${Math.min(10, totalRows)} 行，共 ${totalRows} 行資料</p>`;
                            }

                            loading.classList.add('hidden');
                            preview.innerHTML = `<div class="fc-file-info"><span class="text-2xl">${fileIcon(file.name)}</span><div class="flex-1"><div class="font-bold text-sm text-slate-700">${file.name} <span class="text-slate-400 font-normal">(${formatSize(file.size)})</span></div><div class="text-xs text-emerald-600 font-semibold">✅ 解析成功，工作表：${wb.SheetNames.join(', ')}</div></div></div>` + tableHtml;
                            preview.classList.remove('hidden');

                            // 轉換按鈕
                            const outFmt = document.getElementById('fc-ss-fmt').value;
                            actions.innerHTML = `<button id="fc-ss-convert" class="fc-btn fc-btn-primary">⬇️ 轉換並下載 .${outFmt}</button><button id="fc-ss-reset" class="fc-btn fc-btn-secondary">🔄 重新選擇</button>`;
                            actions.classList.remove('hidden');

                            document.getElementById('fc-ss-convert').onclick = () => {
                                const fmt = document.getElementById('fc-ss-fmt').value;
                                const baseName = file.name.replace(/\.[^.]+$/, '');
                                if (fmt === 'json') {
                                    const json = XLSX.utils.sheet_to_json(ws);
                                    downloadText(JSON.stringify(json, null, 2), baseName + '.json', 'application/json');
                                } else if (fmt === 'csv') {
                                    const csv = XLSX.utils.sheet_to_csv(ws);
                                    downloadText('\uFEFF' + csv, baseName + '.csv', 'text/csv;charset=utf-8');
                                } else if (fmt === 'tsv') {
                                    const tsv = XLSX.utils.sheet_to_csv(ws, { FS: '\t' });
                                    downloadText('\uFEFF' + tsv, baseName + '.tsv', 'text/tab-separated-values');
                                } else if (fmt === 'html') {
                                    const html = XLSX.utils.sheet_to_html(ws);
                                    downloadText('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + baseName + '</title><style>table{border-collapse:collapse;width:100%;font-family:sans-serif}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style></head><body>' + html + '</body></html>', baseName + '.html', 'text/html');
                                } else {
                                    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                                    downloadBlob(new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), baseName + '.xlsx');
                                }
                            };
                            document.getElementById('fc-ss-reset').onclick = () => renderSpreadsheet();

                        } catch (err) {
                            loading.innerHTML = `<p class="text-red-500 font-bold">⚠️ 解析失敗：${err.message}</p>`;
                        }
                    };
                    reader.readAsArrayBuffer(file);
                });
            }, 0);
        }

        // ==================== 📄 轉為 PDF ====================
        function renderPDF() {
            content.innerHTML = `
                <div class="fc-card">
                    <div class="flex flex-wrap gap-4 mb-4 items-end">
                        <div class="flex-1 min-w-[150px]"><label class="fc-label">來源類型</label>
                            <select id="fc-pdf-src" class="fc-select w-full">
                                <option value="text">📄 純文字 / TXT</option>
                                <option value="image">🖼️ 圖片（JPG/PNG）</option>
                                <option value="md">📝 Markdown 檔案</option>
                            </select>
                        </div>
                        <div class="min-w-[120px]"><label class="fc-label">頁面大小</label>
                            <select id="fc-pdf-size" class="fc-select w-full">
                                <option value="a4">A4</option>
                                <option value="letter">Letter</option>
                                <option value="a3">A3</option>
                            </select>
                        </div>
                    </div>
                    <div class="fc-drop" id="fc-pdf-drop">
                        <input type="file" id="fc-pdf-input" accept=".txt,.md,.png,.jpg,.jpeg,.webp,.bmp,.gif" multiple class="hidden">
                        <div class="text-5xl mb-3">📄</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳檔案到這裡，或點擊選擇</p>
                        <p class="text-slate-400 text-sm mt-1">支援 TXT / Markdown / 圖片檔案</p>
                    </div>
                    <div class="my-4 text-center text-slate-400 text-sm font-bold">── 或直接輸入文字 ──</div>
                    <textarea id="fc-pdf-text" placeholder="在這裡貼上要轉換為 PDF 的文字內容..." class="w-full h-40 p-4 border-2 border-slate-200 rounded-xl resize-y outline-none focus:border-violet-400 transition text-sm font-mono"></textarea>
                    <div class="mt-4 flex flex-wrap gap-3 justify-center">
                        <button id="fc-pdf-go" class="fc-btn fc-btn-primary">📄 產生 PDF 並下載</button>
                    </div>
                    <div class="mt-3 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        ⚠️ 注意：jsPDF 預設字型不支援中文顯示。純文字模式下如包含中文字元，PDF 中可能顯示為亂碼或空白。建議使用「圖片」模式將含中文的內容轉為圖片後再轉 PDF。
                    </div>
                    <div id="fc-pdf-status" class="mt-3 text-center text-sm hidden"></div>
                </div>`;
            setTimeout(() => {
                const textarea = document.getElementById('fc-pdf-text');
                const status = document.getElementById('fc-pdf-status');

                setupDropZone('fc-pdf-drop', 'fc-pdf-input', '', files => {
                    const file = files[0];
                    if (!file) return;
                    const ext = file.name.split('.').pop().toLowerCase();
                    if (['txt', 'md'].includes(ext)) {
                        const r = new FileReader();
                        r.onload = e => { textarea.value = e.target.result; };
                        r.readAsText(file);
                        if (ext === 'md') document.getElementById('fc-pdf-src').value = 'md';
                        else document.getElementById('fc-pdf-src').value = 'text';
                    } else if (file.type.startsWith('image/')) {
                        document.getElementById('fc-pdf-src').value = 'image';
                        window._fcPdfImage = file;
                        textarea.value = `[已選擇圖片: ${file.name}]`;
                        textarea.disabled = true;
                    }
                });

                document.getElementById('fc-pdf-src').onchange = () => {
                    textarea.disabled = false;
                    window._fcPdfImage = null;
                };

                document.getElementById('fc-pdf-go').onclick = async () => {
                    status.classList.remove('hidden');
                    status.innerHTML = '<span class="text-violet-600 animate-pulse font-bold">載入 PDF 引擎中...</span>';
                    try {
                        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js');
                    } catch (e) { status.innerHTML = '<span class="text-red-500 font-bold">⚠️ jsPDF 載入失敗</span>'; return; }

                    const { jsPDF } = window.jspdf;
                    const pageSize = document.getElementById('fc-pdf-size').value;
                    const srcType = document.getElementById('fc-pdf-src').value;

                    try {
                        const doc = new jsPDF({ format: pageSize });

                        if (srcType === 'image' && window._fcPdfImage) {
                            const imgData = await new Promise((res, rej) => {
                                const r = new FileReader();
                                r.onload = e => res(e.target.result);
                                r.onerror = rej;
                                r.readAsDataURL(window._fcPdfImage);
                            });
                            const img = new Image();
                            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = imgData; });
                            const pw = doc.internal.pageSize.getWidth() - 20;
                            const ph = doc.internal.pageSize.getHeight() - 20;
                            let w = img.width, h = img.height;
                            const ratio = Math.min(pw / w, ph / h);
                            w *= ratio; h *= ratio;
                            doc.addImage(imgData, 'JPEG', 10, 10, w, h);
                        } else {
                            let text = textarea.value;
                            if (srcType === 'md') {
                                // Simple markdown strip for PDF text
                                text = text.replace(/#{1,6}\s/g, '').replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1').replace(/`([^`]+)`/g, '$1');
                            }
                            doc.setFont('helvetica');
                            doc.setFontSize(11);
                            const lines = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 20);
                            let y = 15;
                            const lineH = 6;
                            const pageH = doc.internal.pageSize.getHeight() - 15;
                            lines.forEach(line => {
                                if (y + lineH > pageH) { doc.addPage(); y = 15; }
                                doc.text(line, 10, y);
                                y += lineH;
                            });
                        }

                        doc.save('converted.pdf');
                        status.innerHTML = '<span class="text-emerald-600 font-bold">✅ PDF 產生成功！已自動下載</span>';
                    } catch (err) {
                        status.innerHTML = `<span class="text-red-500 font-bold">⚠️ 產生失敗：${err.message}</span>`;
                    }
                };
            }, 0);
        }

        // ==================== 📝 Markdown → HTML ====================
        function renderMarkdown() {
            content.innerHTML = `
                <div class="fc-card">
                    <div class="fc-drop" id="fc-md-drop">
                        <input type="file" id="fc-md-input" accept=".md,.markdown,.txt" class="hidden">
                        <div class="text-5xl mb-3">📝</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳 Markdown 檔案到這裡</p>
                        <p class="text-slate-400 text-sm mt-1">支援 .md / .markdown / .txt</p>
                    </div>
                    <div class="my-4 text-center text-slate-400 text-sm font-bold">── 或直接輸入 Markdown ──</div>
                    <textarea id="fc-md-text" placeholder="# 標題\n\n這是 **粗體** 和 *斜體* 文字\n\n- 清單項目 1\n- 清單項目 2\n\n\`\`\`js\nconsole.log('Hello');\n\`\`\`" class="w-full h-40 p-4 border-2 border-slate-200 rounded-xl resize-y outline-none focus:border-violet-400 transition text-sm font-mono"></textarea>
                    <div class="mt-4 flex flex-wrap gap-3 justify-center">
                        <button id="fc-md-preview" class="fc-btn fc-btn-primary">👁️ 即時預覽</button>
                        <button id="fc-md-dl" class="fc-btn fc-btn-secondary">⬇️ 下載 HTML</button>
                        <button id="fc-md-copy" class="fc-btn fc-btn-secondary">📋 複製 HTML 原始碼</button>
                    </div>
                    <div id="fc-md-result" class="mt-4 hidden">
                        <label class="fc-label mb-2">預覽結果</label>
                        <div id="fc-md-output" class="bg-white border border-slate-200 rounded-xl p-6 prose prose-slate max-w-none overflow-auto max-h-[500px]" style="line-height:1.8;font-size:15px"></div>
                    </div>
                </div>`;
            setTimeout(() => {
                const textarea = document.getElementById('fc-md-text');

                setupDropZone('fc-md-drop', 'fc-md-input', '', files => {
                    const r = new FileReader();
                    r.onload = e => { textarea.value = e.target.result; };
                    r.readAsText(files[0]);
                });

                async function getMdHtml() {
                    await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
                    return marked.parse(textarea.value);
                }

                document.getElementById('fc-md-preview').onclick = async () => {
                    if (!textarea.value.trim()) { alert('請先輸入或上傳 Markdown 內容'); return; }
                    const html = await getMdHtml();
                    const output = document.getElementById('fc-md-output');
                    output.innerHTML = html;
                    document.getElementById('fc-md-result').classList.remove('hidden');
                };

                document.getElementById('fc-md-dl').onclick = async () => {
                    if (!textarea.value.trim()) { alert('請先輸入或上傳 Markdown 內容'); return; }
                    const html = await getMdHtml();
                    const fullHtml = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Markdown 轉換結果</title><style>body{max-width:800px;margin:2rem auto;padding:0 1rem;font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.8;color:#1e293b}h1,h2,h3{margin-top:1.5em;color:#0f172a}code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:90%}pre{background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:8px;overflow-x:auto}pre code{background:none;padding:0}blockquote{border-left:4px solid #7c3aed;margin:1em 0;padding:.5em 1em;background:#f5f3ff}table{border-collapse:collapse;width:100%}td,th{border:1px solid #e2e8f0;padding:8px}th{background:#f8fafc}</style></head><body>${html}</body></html>`;
                    downloadText(fullHtml, 'markdown-output.html', 'text/html');
                };

                document.getElementById('fc-md-copy').onclick = async () => {
                    if (!textarea.value.trim()) { alert('請先輸入或上傳 Markdown 內容'); return; }
                    const html = await getMdHtml();
                    try {
                        await navigator.clipboard.writeText(html);
                        const btn = document.getElementById('fc-md-copy');
                        const orig = btn.textContent;
                        btn.textContent = '✅ 已複製！';
                        setTimeout(() => btn.textContent = orig, 2000);
                    } catch(e) { alert('複製失敗：' + e.message); }
                };
            }, 0);
        }

        // ==================== 🔄 JSON 工具 ====================
        function renderJSON() {
            content.innerHTML = `
                <div class="fc-card">
                    <div class="flex flex-wrap gap-4 mb-4 items-end">
                        <div class="flex-1 min-w-[150px]"><label class="fc-label">功能選擇</label>
                            <select id="fc-json-mode" class="fc-select w-full">
                                <option value="prettify">🎨 JSON 美化（格式化）</option>
                                <option value="minify">📦 JSON 壓縮（最小化）</option>
                                <option value="tocsv">📊 JSON → CSV</option>
                                <option value="fromcsv">📊 CSV → JSON</option>
                            </select>
                        </div>
                    </div>
                    <div class="fc-drop" id="fc-json-drop">
                        <input type="file" id="fc-json-input" accept=".json,.csv,.txt" class="hidden">
                        <div class="text-5xl mb-3">📦</div>
                        <p class="font-bold text-slate-700 text-lg">拖曳 JSON 或 CSV 檔案</p>
                        <p class="text-slate-400 text-sm mt-1">或直接在下方輸入資料</p>
                    </div>
                    <textarea id="fc-json-text" placeholder='[{"name":"Alice","age":25},{"name":"Bob","age":30}]' class="w-full h-40 p-4 border-2 border-slate-200 rounded-xl resize-y outline-none focus:border-violet-400 transition text-sm font-mono mt-4"></textarea>
                    <div class="mt-4 flex flex-wrap gap-3 justify-center">
                        <button id="fc-json-go" class="fc-btn fc-btn-primary">⚡ 執行轉換</button>
                        <button id="fc-json-copy" class="fc-btn fc-btn-secondary hidden">📋 複製結果</button>
                        <button id="fc-json-dl" class="fc-btn fc-btn-secondary hidden">⬇️ 下載結果</button>
                    </div>
                    <div id="fc-json-result" class="mt-4 hidden">
                        <label class="fc-label mb-2">轉換結果</label>
                        <pre id="fc-json-output" class="bg-slate-900 text-emerald-300 p-4 rounded-xl overflow-auto max-h-[400px] text-sm"></pre>
                    </div>
                </div>`;
            setTimeout(() => {
                const textarea = document.getElementById('fc-json-text');
                const output = document.getElementById('fc-json-output');
                const result = document.getElementById('fc-json-result');
                const dlBtn = document.getElementById('fc-json-dl');
                let lastResult = '', lastExt = 'json';

                setupDropZone('fc-json-drop', 'fc-json-input', '', files => {
                    const r = new FileReader();
                    r.onload = e => { textarea.value = e.target.result; };
                    r.readAsText(files[0]);
                    const ext = files[0].name.split('.').pop().toLowerCase();
                    if (ext === 'csv') document.getElementById('fc-json-mode').value = 'fromcsv';
                });

                document.getElementById('fc-json-go').onclick = () => {
                    const mode = document.getElementById('fc-json-mode').value;
                    const input = textarea.value.trim();
                    if (!input) { alert('請先輸入或上傳資料'); return; }

                    try {
                        if (mode === 'prettify') {
                            lastResult = JSON.stringify(JSON.parse(input), null, 2);
                            lastExt = 'json';
                        } else if (mode === 'minify') {
                            lastResult = JSON.stringify(JSON.parse(input));
                            lastExt = 'json';
                        } else if (mode === 'tocsv') {
                            const arr = JSON.parse(input);
                            if (!Array.isArray(arr) || arr.length === 0) throw new Error('JSON 必須是非空陣列');
                            const keys = Object.keys(arr[0]);
                            const csv = [keys.join(','), ...arr.map(row => keys.map(k => {
                                let v = row[k] === null || row[k] === undefined ? '' : String(row[k]);
                                if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g, '""') + '"';
                                return v;
                            }).join(','))].join('\n');
                            lastResult = csv;
                            lastExt = 'csv';
                        } else if (mode === 'fromcsv') {
                            const lines = input.split('\n').filter(l => l.trim());
                            if (lines.length < 2) throw new Error('CSV 至少需要標頭和一行資料');
                            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                            const data = lines.slice(1).map(line => {
                                const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                                const obj = {};
                                headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
                                return obj;
                            });
                            lastResult = JSON.stringify(data, null, 2);
                            lastExt = 'json';
                        }

                        output.textContent = lastResult;
                        result.classList.remove('hidden');
                        dlBtn.classList.remove('hidden');
                        document.getElementById('fc-json-copy').classList.remove('hidden');
                    } catch (err) {
                        let errMsg = err.message;
                        // 嘗試定位 JSON 語法錯誤的位置
                        if (err instanceof SyntaxError && err.message.includes('position')) {
                            const posMatch = err.message.match(/position\s+(\d+)/i);
                            if (posMatch) {
                                const pos = parseInt(posMatch[1]);
                                const before = input.substring(0, pos);
                                const lineNum = before.split('\n').length;
                                errMsg += ` (約在第 ${lineNum} 行)`;
                            }
                        }
                        output.textContent = '❌ 錯誤：' + errMsg;
                        result.classList.remove('hidden');
                        dlBtn.classList.add('hidden');
                        document.getElementById('fc-json-copy').classList.add('hidden');
                    }
                };

                dlBtn.onclick = () => {
                    const mime = lastExt === 'json' ? 'application/json' : 'text/csv';
                    downloadText(lastExt === 'csv' ? '\uFEFF' + lastResult : lastResult, 'converted.' + lastExt, mime);
                };

                document.getElementById('fc-json-copy').onclick = async () => {
                    try {
                        await navigator.clipboard.writeText(lastResult);
                        const btn = document.getElementById('fc-json-copy');
                        const orig = btn.textContent;
                        btn.textContent = '✅ 已複製！';
                        setTimeout(() => btn.textContent = orig, 2000);
                    } catch(e) { alert('複製失敗：' + e.message); }
                };
            }, 0);
        }

    }, 0);
};
