window.render_capitalNumber = function (containerElement) {
    // 1. 防呆機制：確保能抓到渲染的容器 (支援傳入容器或使用預設全域變數)
    const targetContainer = containerElement || (typeof container !== 'undefined' ? container : document.body);
    if (!targetContainer) {
        console.error("找不到渲染工具的容器");
        return;
    }

    // 2. UI 升級：增加漸層、圖示、清除按鈕，且全數改用 class 避免與其他 99 個工具 ID 衝突
    targetContainer.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center transition-all duration-300 hover:shadow-xl">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 text-amber-500 mb-4 shadow-sm border border-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-2 tracking-tight">合約中文大寫金額轉換</h3>
            <p class="text-slate-500 text-sm mb-7">開立支票、合約報價必備，一秒轉換正確的傳統財務大寫格式。</p>
            
            <div class="relative mb-6 group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 font-bold transition-colors group-focus-within:text-amber-500">NT$</span>
                <input type="number" class="tool-num-input w-full text-2xl p-4 pl-16 pr-12 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none font-bold text-slate-800 tracking-wider transition-all" placeholder="請輸入阿拉伯數字" min="0" max="999999999999" step="1">
                <button class="tool-clear-btn absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 hidden transition-colors" title="清除金額">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            
            <div class="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl relative overflow-hidden text-left">
                <div class="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                <p class="text-sm font-bold text-amber-700/80 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    中文大寫金額
                </p>
                <div class="tool-capital-output text-3xl font-bold text-slate-800 tracking-widest min-h-[3rem] flex items-center justify-center break-all transition-colors duration-300">
                    零元整
                </div>
            </div>
            
            <button class="tool-copy-btn mt-6 w-full py-4 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white text-lg font-bold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                <span>複製大寫金額</span>
            </button>
        </div>
    `;

    // 3. 移除 setTimeout，直接透過 querySelector 綁定事件 (因為 innerHTML 是同步的，確保抓得到)
    const input = targetContainer.querySelector('.tool-num-input');
    const output = targetContainer.querySelector('.tool-capital-output');
    const copyBtn = targetContainer.querySelector('.tool-copy-btn');
    const clearBtn = targetContainer.querySelector('.tool-clear-btn');

    if (!input || !output || !copyBtn) return; // 雙重防護，避免 JS 報錯

    // 轉換邏輯 (修復了千億以上的長度防護)
    function convertToCapital(n) {
        if (n === '' || isNaN(n)) return "零元整";
        if (n < 0) return "⚠️ 無法轉換負數";
        if (n > 999999999999.99) return "⚠️ 金額過大 (上限為千億)";

        // 確保小數點最多兩位，超過自動截斷
        if (n.includes('.')) {
            const parts = n.split('.');
            n = parts[0] + '.' + parts[1].substring(0, 2);
        }

        let unit = "仟佰拾億仟佰拾萬仟佰拾元角分", str = "";
        n += "00";
        let p = n.indexOf('.');
        if (p >= 0) n = n.substring(0, p) + n.substring(p + 1, p + 3);
        unit = unit.substring(unit.length - n.length);
        for (let i = 0; i < n.length; i++) {
            str += '零壹貳參肆伍陸柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        }
        return str.replace(/零(仟|佰|拾|角)/g, "零")
            .replace(/(零)+/g, "零")
            .replace(/零(萬|億|元)/g, "$1")
            .replace(/(億)萬/g, "$1") // 修正正則，防止億萬衝突
            .replace(/^元零?|零分/g, "")
            .replace(/元$/g, "元整")
            .replace(/角$/g, "角整");
    }

    // 監聽輸入事件
    input.addEventListener('input', (e) => {
        const val = e.target.value;

        // 控制清除按鈕的顯示隱藏
        clearBtn.classList.toggle('hidden', val.length === 0);

        if (val === '') {
            output.textContent = '零元整';
            output.classList.remove('text-red-500');
            output.classList.add('text-slate-800');
        } else {
            const result = convertToCapital(val);
            output.textContent = result;

            // 如果超出範圍，改變文字顏色提醒使用者
            if (result.includes('⚠️')) {
                output.classList.remove('text-slate-800');
                output.classList.add('text-red-500');
            } else {
                output.classList.remove('text-red-500');
                output.classList.add('text-slate-800');
            }
        }
    });

    // 清除按鈕功能
    clearBtn.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input')); // 手動觸發 input 事件更新狀態
        input.focus(); // 讓游標回到輸入框
    });

    // 複製功能 (加入環境相容處理)
    copyBtn.addEventListener('click', () => {
        const textToCopy = output.textContent;
        if (textToCopy.includes('⚠️')) {
            alert('無效的金額，無法複製');
            return;
        }

        const successCallback = () => {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> <span>已成功複製！</span>';
            copyBtn.classList.replace('bg-slate-800', 'bg-emerald-500');
            copyBtn.classList.replace('hover:bg-slate-900', 'hover:bg-emerald-600');

            setTimeout(() => {
                copyBtn.innerHTML = originalHtml;
                copyBtn.classList.replace('bg-emerald-500', 'bg-slate-800');
                copyBtn.classList.replace('hover:bg-emerald-600', 'hover:bg-slate-900');
            }, 2000);
        };

        // 優先嘗試現代 API，如果環境不支援則降級使用傳統 API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(successCallback);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                successCallback();
            } catch (err) {
                console.error('複製失敗', err);
            }
            document.body.removeChild(textArea);
        }
    });
};