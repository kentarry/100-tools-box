window.render_eyeTester = function (container) {
    // 若未傳入 container，請依據您的專案架構抓取目標 DOM
    if (!container) container = document.getElementById('tool-container');

    // 1. 建立 UI 結構
    container.innerHTML = `
        <div class="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center font-sans">
            <h3 class="text-xl font-bold mb-2 text-slate-800">👁️ 簡易視力檢查</h3>
            <p class="text-xs text-slate-500 mb-6 text-center leading-relaxed">
                請距離螢幕約 50 公分，遮住單眼。<br>點擊下方方向鍵，選出 E 的缺口方向。
            </p>
            
            <div class="flex justify-between w-full text-sm font-semibold text-slate-600 mb-4 px-2">
                <span>進度: <span class="eye-level text-slate-800">1</span>/10</span>
                <span>得分: <span class="eye-score text-slate-800">0</span></span>
            </div>

            <div class="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-xl mb-6 border border-slate-200 overflow-hidden shadow-inner">
                <div class="eye-char font-black transition-all duration-300 transform text-slate-800" style="font-size: 120px; line-height: 1;">E</div>
            </div>

            <div class="eye-controls grid grid-cols-3 gap-2 w-full max-w-[180px] mb-2">
                <div></div>
                <button data-dir="up" class="eye-btn p-3 bg-white border-2 border-slate-200 hover:bg-slate-100 active:bg-slate-200 rounded-xl flex items-center justify-center transition-all active:scale-95 text-xl">⬆️</button>
                <div></div>
                <button data-dir="left" class="eye-btn p-3 bg-white border-2 border-slate-200 hover:bg-slate-100 active:bg-slate-200 rounded-xl flex items-center justify-center transition-all active:scale-95 text-xl">⬅️</button>
                <div></div>
                <button data-dir="right" class="eye-btn p-3 bg-white border-2 border-slate-200 hover:bg-slate-100 active:bg-slate-200 rounded-xl flex items-center justify-center transition-all active:scale-95 text-xl">➡️</button>
                <div></div>
                <button data-dir="down" class="eye-btn p-3 bg-white border-2 border-slate-200 hover:bg-slate-100 active:bg-slate-200 rounded-xl flex items-center justify-center transition-all active:scale-95 text-xl">⬇️</button>
            </div>
            
            <div class="eye-result hidden flex-col items-center w-full mt-2">
                <div class="p-4 bg-slate-50 rounded-xl w-full text-center mb-4 border border-slate-100">
                    <p class="text-sm text-slate-500 mb-1">測驗結束</p>
                    <p class="eye-final-msg text-lg font-bold text-slate-800"></p>
                </div>
                <button class="eye-restart-btn w-full py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 active:scale-95 transition-all shadow-md">
                    重新測驗
                </button>
            </div>
        </div>
    `;

    // 2. 獲取 DOM 元素 (範圍限制在 container 內，避免全域衝突)
    const charEl = container.querySelector('.eye-char');
    const levelEl = container.querySelector('.eye-level');
    const scoreEl = container.querySelector('.eye-score');
    const controlsEl = container.querySelector('.eye-controls');
    const resultEl = container.querySelector('.eye-result');
    const finalMsgEl = container.querySelector('.eye-final-msg');
    const btns = container.querySelectorAll('.eye-btn');
    const restartBtn = container.querySelector('.eye-restart-btn');

    // 3. 遊戲狀態與參數
    let level = 1;
    let score = 0;
    let currentCorrectDir = '';

    // E 的缺口方向對應的旋轉角度 (原始 E 缺口朝右為 0 度)
    const dirMap = {
        'right': 0,
        'down': 90,
        'left': 180,
        'up': 270
    };
    const directions = Object.keys(dirMap);

    // 計算字體大小：隨關卡遞減，模擬視力表
    const getFontSize = (lvl) => Math.max(12, 120 - (lvl - 1) * 11) + 'px';

    // 4. 核心邏輯方法
    const updateQuestion = () => {
        // 隨機決定新方向
        currentCorrectDir = directions[Math.floor(Math.random() * directions.length)];
        const rotation = dirMap[currentCorrectDir];

        // 更新畫面
        charEl.style.transform = `rotate(${rotation}deg)`;
        charEl.style.fontSize = getFontSize(level);
        levelEl.textContent = level;
        scoreEl.textContent = score;
    };

    const handleGuess = (userDir) => {
        if (level > 10) return;

        // 判斷是否答對
        if (userDir === currentCorrectDir) {
            score++;
        }

        level++;

        if (level > 10) {
            showResult();
        } else {
            updateQuestion();
        }
    };

    const showResult = () => {
        controlsEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        resultEl.classList.add('flex');

        // 產生評語
        let msg = '';
        if (score === 10) msg = '🎉 視力非常好！';
        else if (score >= 7) msg = '👍 視力還不錯喔！';
        else msg = '👓 建議尋求專業檢查。';

        finalMsgEl.innerHTML = `${msg}<br><span class="text-2xl mt-2 block">${score} / 10 分</span>`;
    };

    const restartGame = () => {
        level = 1;
        score = 0;
        controlsEl.classList.remove('hidden');
        resultEl.classList.add('hidden');
        resultEl.classList.remove('flex');
        updateQuestion();
    };

    // 5. 綁定事件監聽器
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dir = e.currentTarget.getAttribute('data-dir');
            handleGuess(dir);
        });
    });

    restartBtn.addEventListener('click', restartGame);

    // 6. 初始化第一關
    updateQuestion();
};
