window.render_mathReference = function (container) {
    // 確保容器存在，避免報錯影響其他 99 個工具
    const targetContainer = container || document.getElementById('tool-container');
    if (!targetContainer) {
        console.warn('Math Reference Tool: Target container not found.');
        return;
    }

    // 1. 動態注入獨立的 CSS (確保 GitHub 部署時不需要依賴外部樣式表)
    const styleId = 'tool-math-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 反重力漂浮動畫 */
            @keyframes antigravity-float {
                0%, 100% { transform: translateY(0) rotate(0deg); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                50% { transform: translateY(-12px) rotate(1deg); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); }
            }
            .is-floating {
                animation: antigravity-float 3s ease-in-out infinite;
                border-color: #60a5fa !important; /* 漂浮時改變邊框顏色 */
            }
            /* 列表互動效果 */
            .math-row { transition: all 0.2s ease; }
            .math-row:hover { background-color: #f8fafc; transform: translateX(6px); }
            /* 複製成功提示動畫 */
            @keyframes pop-in {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .copy-toast { animation: pop-in 0.2s ease forwards; }
        `;
        document.head.appendChild(style);
    }

    // 2. 渲染 UI (加入響應式設計、一鍵複製與彩蛋按鈕)
    // 使用 w-full 與 max-w-md 確保在手機端滿版，在電腦端保持適當寬度，絕不全螢幕
    targetContainer.innerHTML = `
        <div id="math-card" class="max-w-md w-full mx-auto bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 text-gray-800 transition-all duration-300 relative">
            
            <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 class="font-bold text-lg flex items-center gap-2">
                    <span class="text-xl">📐</span> 常用幾何公式
                </h3>
                <button id="btn-antigravity" class="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 rounded-full transition-colors flex items-center gap-1 font-medium select-none cursor-pointer" title="啟動反重力模式">
                    🚀 Antigravity
                </button>
            </div>

            <div class="space-y-1 text-sm sm:text-base">
                ${generateFormulaRow('圓面積', 'πr²')}
                ${generateFormulaRow('圓周長', '2πr')}
                ${generateFormulaRow('畢氏定理', 'a² + b² = c²')}
                ${generateFormulaRow('球體體積', '(4/3)πr³')}
            </div>
            
            <div id="copy-toast" class="hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none copy-toast z-10">
                已複製公式！
            </div>
        </div>
    `;

    // 3. 輔助函數：生成單行公式 HTML (保持代碼 DRY - Don't Repeat Yourself)
    function generateFormulaRow(name, formula) {
        return `
            <div class="math-row flex justify-between items-center p-2.5 rounded-lg border border-transparent hover:border-gray-100 group">
                <span class="font-medium text-gray-700 select-none">${name}</span>
                <div class="flex items-center gap-2 sm:gap-3">
                    <span class="font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md tracking-wider shadow-inner">${formula}</span>
                    <button class="copy-btn opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer" data-formula="${formula}" aria-label="複製 ${name} 公式">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }

    // 4. 綁定事件：一鍵複製功能
    const copyButtons = targetContainer.querySelectorAll('.copy-btn');
    const toast = targetContainer.querySelector('#copy-toast');
    let toastTimeout;

    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const formula = e.currentTarget.getAttribute('data-formula');
            // 使用現代 Clipboard API
            navigator.clipboard.writeText(formula).then(() => {
                // 顯示提示
                toast.classList.remove('hidden');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    toast.classList.add('hidden');
                }, 1500);
            }).catch(err => {
                console.error('複製失敗:', err);
            });
        });
    });

    // 5. 綁定事件：Antigravity (反重力彩蛋)
    const btnAntigravity = targetContainer.querySelector('#btn-antigravity');
    const mathCard = targetContainer.querySelector('#math-card');
    let isFloating = false;

    btnAntigravity.addEventListener('click', () => {
        isFloating = !isFloating;
        if (isFloating) {
            mathCard.classList.add('is-floating');
            btnAntigravity.innerHTML = '🌍 降落 (Land)';
            btnAntigravity.classList.replace('bg-gray-100', 'bg-blue-100');
            btnAntigravity.classList.replace('text-gray-600', 'text-blue-700');
        } else {
            mathCard.classList.remove('is-floating');
            btnAntigravity.innerHTML = '🚀 Antigravity';
            btnAntigravity.classList.replace('bg-blue-100', 'bg-gray-100');
            btnAntigravity.classList.replace('text-blue-700', 'text-gray-600');
        }
    });
};
