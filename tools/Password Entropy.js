window.render_passwordEntropy = function () {
    // 1. 確保 container 存在，增加錯誤防護
    const targetContainer = typeof container !== 'undefined' ? container : document.getElementById('container');
    if (!targetContainer) {
        console.error("【錯誤】找不到渲染容器！請確保 HTML 中有名為 container 的變數或 ID。");
        return;
    }

    // 2. 注入高質感、多樣化的 UI 介面
    targetContainer.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 font-sans">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-3xl">🛡️</span>
                <h3 class="text-xl font-bold m-0 text-slate-800">進階密碼強度分析</h3>
            </div>

            <div class="relative mb-5">
                <input type="password" id="peIn" placeholder="請輸入密碼進行測試..." 
                       class="w-full p-4 pr-12 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-lg font-mono">
                <button id="peToggle" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 focus:outline-none text-xl transition-colors" title="顯示/隱藏密碼">
                    👁️
                </button>
            </div>

            <div class="mb-6">
                <div class="flex justify-between text-sm mb-2 font-medium">
                    <span id="peLevelText" class="text-slate-500">等待輸入...</span>
                    <span id="peScoreText" class="text-slate-500 font-mono">0%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner border border-slate-200">
                    <div id="peBar" class="bg-slate-300 h-full rounded-full transition-all duration-500 ease-out" style="width: 0%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center shadow-sm">
                    <p class="text-xs text-slate-500 mb-1 font-bold tracking-wider">密碼熵值 (Entropy)</p>
                    <p class="text-lg"><span id="peVal" class="font-black text-indigo-600 text-3xl">0</span> <span class="text-sm text-slate-400">bits</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center shadow-sm">
                    <p class="text-xs text-slate-500 mb-1 font-bold tracking-wider">暴力破解預估</p>
                    <p id="peTime" class="font-black text-slate-400 text-xl leading-tight">瞬間</p>
                </div>
            </div>

            <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p class="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span>📋 達成條件清單</span>
                </p>
                <div class="space-y-2 text-sm text-slate-600 font-medium">
                    <div class="flex items-center gap-3"><span id="reqLen" class="text-slate-300 text-lg transition-colors">○</span> 長度至少 8 個字元</div>
                    <div class="flex items-center gap-3"><span id="reqLow" class="text-slate-300 text-lg transition-colors">○</span> 包含小寫英文字母</div>
                    <div class="flex items-center gap-3"><span id="reqUp" class="text-slate-300 text-lg transition-colors">○</span> 包含大寫英文字母</div>
                    <div class="flex items-center gap-3"><span id="reqNum" class="text-slate-300 text-lg transition-colors">○</span> 包含數字</div>
                    <div class="flex items-center gap-3"><span id="reqSym" class="text-slate-300 text-lg transition-colors">○</span> 包含特殊符號</div>
                </div>
            </div>
        </div>
    `;

    // 3. 立即抓取 DOM 元素（捨棄 setTimeout，確保絕對載入）
    const input = document.getElementById('peIn');
    const toggleBtn = document.getElementById('peToggle');
    const bar = document.getElementById('peBar');
    const levelText = document.getElementById('peLevelText');
    const scoreText = document.getElementById('peScoreText');
    const valEl = document.getElementById('peVal');
    const timeEl = document.getElementById('peTime');

    const reqs = {
        Len: document.getElementById('reqLen'),
        Low: document.getElementById('reqLow'),
        Up: document.getElementById('reqUp'),
        Num: document.getElementById('reqNum'),
        Sym: document.getElementById('reqSym'),
    };

    // 4. 密碼顯示/隱藏切換功能
    toggleBtn.addEventListener('click', () => {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        toggleBtn.style.opacity = isPassword ? '0.5' : '1';
    });

    // 5. 格式化時間輔助函數（根據秒數轉換為人類易讀格式）
    const formatTime = (seconds) => {
        if (seconds < 1) return "瞬間";
        if (seconds < 60) return "幾秒鐘";
        if (seconds < 3600) return "幾分鐘";
        if (seconds < 86400) return "幾小時";
        if (seconds < 2592000) return "幾天";
        if (seconds < 31536000) return "幾個月";
        if (seconds < 3153600000) return "幾年";
        if (seconds < 3153600000000) return "幾個世紀";
        return "宇宙毀滅 🌌";
    };

    // 6. 核心演算法與 UI 更新邏輯
    input.addEventListener('input', (e) => {
        const p = e.target.value;
        let pool = 0;

        // 檢測字元集
        const hasLow = /[a-z]/.test(p);
        const hasUp = /[A-Z]/.test(p);
        const hasNum = /[0-9]/.test(p);
        const hasSym = /[^a-zA-Z0-9]/.test(p);
        const isLong = p.length >= 8;

        if (hasLow) pool += 26;
        if (hasUp) pool += 26;
        if (hasNum) pool += 10;
        if (hasSym) pool += 32;

        // 更新條件檢核表視覺狀態
        const checkMark = '✅';
        const uncheckMark = '○';
        reqs.Len.textContent = isLong ? checkMark : uncheckMark;
        reqs.Low.textContent = hasLow ? checkMark : uncheckMark;
        reqs.Up.textContent = hasUp ? checkMark : uncheckMark;
        reqs.Num.textContent = hasNum ? checkMark : uncheckMark;
        reqs.Sym.textContent = hasSym ? checkMark : uncheckMark;

        Object.values(reqs).forEach(el => {
            if (el.textContent === checkMark) {
                el.classList.replace('text-slate-300', 'text-emerald-500');
            } else {
                el.classList.replace('text-emerald-500', 'text-slate-300');
            }
        });

        // 計算熵值
        const entropy = p.length * (pool > 0 ? Math.log2(pool) : 0);
        valEl.textContent = Math.round(entropy);

        // 推算暴力破解時間（以每秒嘗試 100 億次為基準）
        const combinations = Math.pow(2, entropy);
        const guessesPerSecond = 10000000000;
        const secondsToCrack = combinations / guessesPerSecond;

        // 更新時間與顏色
        if (p.length === 0) {
            timeEl.textContent = "瞬間";
            timeEl.className = "font-black text-slate-400 text-xl leading-tight";
        } else {
            timeEl.textContent = formatTime(secondsToCrack);
            if (secondsToCrack < 3600) timeEl.className = "font-black text-rose-500 text-xl leading-tight";
            else if (secondsToCrack < 31536000) timeEl.className = "font-black text-amber-500 text-xl leading-tight";
            else timeEl.className = "font-black text-emerald-500 text-xl leading-tight";
        }

        // 更新進度條（以 100 bits 視為 100% 滿分）
        let percentage = Math.min((entropy / 100) * 100, 100);
        if (p.length === 0) percentage = 0;
        bar.style.width = percentage + '%';
        scoreText.textContent = Math.round(percentage) + '%';

        // 判定整體強度等級與更新視覺效果
        if (p.length === 0) {
            levelText.textContent = "等待輸入...";
            levelText.className = "text-slate-500 font-medium";
            bar.className = "bg-slate-300 h-full rounded-full transition-all duration-500 ease-out";
        } else if (entropy < 35) {
            levelText.textContent = "極度危險 ☠️";
            levelText.className = "text-rose-500 font-bold";
            bar.className = "bg-rose-500 h-full rounded-full transition-all duration-500 ease-out";
        } else if (entropy < 60) {
            levelText.textContent = "勉強堪用 ⚠️";
            levelText.className = "text-amber-500 font-bold";
            bar.className = "bg-amber-500 h-full rounded-full transition-all duration-500 ease-out";
        } else if (entropy < 80) {
            levelText.textContent = "安全可靠 🛡️";
            levelText.className = "text-emerald-500 font-bold";
            bar.className = "bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out";
        } else {
            levelText.textContent = "堅不可摧 💎";
            levelText.className = "text-indigo-500 font-bold";
            bar.className = "bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]";
        }
    });
};
