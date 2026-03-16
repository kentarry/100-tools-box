window.render_lineCounter = function (container) {
    // 確保 container 存在，若沒有傳入則嘗試取得預設的容器
    const targetContainer = container || document.getElementById('tool-container');
    if (!targetContainer) {
        console.error('找不到用來載入工具的容器節點！');
        return;
    }

    // 1. 渲染卡片式介面 (非全螢幕，設定 max-w-2xl 限制最大寬度)
    targetContainer.innerHTML = `
        <div class="max-w-2xl w-full mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span class="text-2xl">📏</span> 字數與行數統計
                </h3>
                <button id="clearBtn" class="text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-1 rounded-lg hover:bg-red-50">
                    <i class="fas fa-trash-alt mr-1"></i> 清除內容
                </button>
            </div>

            <div class="relative mb-6">
                <textarea 
                    id="lineIn" 
                    placeholder="請在此貼上或輸入文字..." 
                    class="w-full h-48 p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-700 resize-y leading-relaxed"
                ></textarea>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-200">
                    <span class="text-xs text-blue-600 font-bold mb-1 tracking-wider">總行數</span>
                    <span id="lineRes" class="text-2xl font-black text-blue-800">0</span>
                </div>
                <div class="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-200">
                    <span class="text-xs text-purple-600 font-bold mb-1 tracking-wider">總字元數</span>
                    <span id="charRes" class="text-2xl font-black text-purple-800">0</span>
                </div>
                <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-200">
                    <span class="text-xs text-emerald-600 font-bold mb-1 tracking-wider">空白行數</span>
                    <span id="emptyLineRes" class="text-2xl font-black text-emerald-800">0</span>
                </div>
                <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-200">
                    <span class="text-xs text-orange-600 font-bold mb-1 tracking-wider">純文字(去空白)</span>
                    <span id="noSpaceRes" class="text-2xl font-black text-orange-800">0</span>
                </div>
            </div>
        </div>
    `;

    // 2. 安全地綁定事件 (捨棄 setTimeout)
    // 使用 targetContainer.querySelector 確保只抓取這個工具內部的元素，避免與其他 99 個工具 ID 衝突
    const textArea = targetContainer.querySelector('#lineIn');
    const lineRes = targetContainer.querySelector('#lineRes');
    const charRes = targetContainer.querySelector('#charRes');
    const emptyLineRes = targetContainer.querySelector('#emptyLineRes');
    const noSpaceRes = targetContainer.querySelector('#noSpaceRes');
    const clearBtn = targetContainer.querySelector('#clearBtn');

    // 防呆機制：若 HTML 沒有正確生成則跳出
    if (!textArea) return;

    // 統整計算邏輯的函數
    const updateStats = () => {
        const v = textArea.value;

        // 若完全沒有輸入
        if (v.length === 0) {
            lineRes.textContent = '0';
            charRes.textContent = '0';
            emptyLineRes.textContent = '0';
            noSpaceRes.textContent = '0';
            return;
        }

        const lines = v.split('\n');

        // 更新數據
        lineRes.textContent = lines.length; // 總行數
        charRes.textContent = v.length;     // 總字元數包含空白換行
        emptyLineRes.textContent = lines.filter(l => l.trim() === '').length; // 空白行數
        noSpaceRes.textContent = v.replace(/\s/g, '').length; // 去除所有空白字元的字數
    };

    // 綁定輸入事件 (即時計算)
    textArea.addEventListener('input', updateStats);

    // 綁定清除按鈕事件
    clearBtn.addEventListener('click', () => {
        textArea.value = '';
        updateStats();
        textArea.focus(); // 清除後將游標重新對焦在輸入框
    });
};
