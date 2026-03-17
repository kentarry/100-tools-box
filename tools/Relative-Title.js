window.render_relativeTitle = function () {
    container.innerHTML = `
        <style>
            /* 隱藏滾動條但保留滾動功能，維持介面整潔 */
            .hide-scroll::-webkit-scrollbar { display: none; }
            .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 select-none">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">👵 親戚稱呼計算機</h3>
                <span id="relStatus" class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">載入資料中...</span>
            </div>
            
            <div id="scrollBox" class="bg-slate-50 px-4 rounded-xl mb-4 text-center h-[60px] flex items-center justify-start overflow-x-auto hide-scroll">
                <p id="relExpression" class="text-slate-500 font-bold text-lg whitespace-nowrap mx-auto">我的 ...</p>
            </div>

            <div class="grid grid-cols-4 gap-2 mb-4">
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="父">父</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="母">母</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="夫">夫</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="妻">妻</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="兄">兄</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="弟">弟</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="姐">姐</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="妹">妹</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="子">子</button>
                <button class="rel-btn p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition" data-val="女">女</button>
                <button id="relUndo" class="p-3 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-200 active:scale-95 transition disabled:opacity-50" disabled>退回</button>
                <button id="relClear" class="p-3 bg-red-50 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-100 active:scale-95 transition">AC</button>
            </div>

            <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center h-[88px] flex flex-col justify-center overflow-hidden">
                <p class="text-xs text-orange-600 mb-1 font-bold uppercase">你該稱呼他/她為：</p>
                <p id="relResult" class="text-2xl font-bold text-slate-800 truncate">自己</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btns = document.querySelectorAll('.rel-btn');
        const expr = document.getElementById('relExpression');
        const result = document.getElementById('relResult');
        const clearBtn = document.getElementById('relClear');
        const undoBtn = document.getElementById('relUndo');
        const status = document.getElementById('relStatus');
        const scrollBox = document.getElementById('scrollBox');

        let path = [];
        let isReady = false;

        // 簡體轉繁體的輕量字典 (針對親戚稱呼用字)
        const toTraditional = (str) => {
            if (!str) return str;
            const map = {
                '爷': '爺', '妈': '媽', '孙': '孫', '儿': '兒',
                '妇': '婦', '婶': '嬸', '侄': '姪', '亲': '親',
                '俩': '倆'
            };
            return str.replace(/[爷妈孙儿妇婶侄亲俩]/g, match => map[match] || match);
        };

        // 統整更新顯示與計算邏輯
        const updateDisplay = () => {
            undoBtn.disabled = path.length === 0;

            if (path.length === 0) {
                expr.textContent = '我的 ...';
                result.textContent = '自己';
                return;
            }

            expr.textContent = '我的' + path.join('的');

            // 自動捲動到最右邊 (適合手機螢幕)
            scrollBox.scrollLeft = scrollBox.scrollWidth;

            if (isReady && typeof relationship === 'function') {
                const options = { text: path.join('的'), sex: 1 };
                const res = relationship(options);

                if (res && res.length > 0) {
                    // 取前兩個結果，進行繁體轉換後用斜線隔開
                    const tcResult = res.slice(0, 2).map(toTraditional).join(' / ');
                    result.textContent = tcResult;
                } else {
                    result.textContent = '太遠了，算不出來';
                }
            }
        };

        // 初始化計算機功能
        const initCalculator = () => {
            isReady = true;
            status.style.display = 'none';

            btns.forEach(btn => {
                btn.onclick = () => {
                    path.push(btn.getAttribute('data-val'));
                    updateDisplay();
                };
            });

            clearBtn.onclick = () => {
                path = [];
                updateDisplay();
            };

            undoBtn.onclick = () => {
                path.pop();
                updateDisplay();
            };

            // 如果一開始就有資料，先算一次
            if (path.length > 0) updateDisplay();
        };

        // 載入 Library，避免網路延遲導致點擊報錯
        if (typeof relationship === 'function') {
            initCalculator();
        } else {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/relationship.js/dist/relationship.min.js";
            script.onload = initCalculator;
            script.onerror = () => { status.textContent = '載入失敗，請重整網頁'; };
            document.head.appendChild(script);
        }
    }, 0);
};
