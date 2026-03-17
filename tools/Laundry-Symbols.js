window.render_laundrySymbols = function (container) {
    // 若沒有傳入 container，請確保全域有定義，或嘗試抓取預設的 DOM
    const targetContainer = container || document.getElementById('tool-container');
    if (!targetContainer) {
        console.error("找不到渲染洗標工具的目標容器！");
        return;
    }

    // 1. 擴充並分類的資料庫 (讓功能更完善、貼近真實洗標)
    const laundryData = [
        { cat: '水洗', s: '🧺', n: '一般水洗', d: '可以使用洗衣機洗滌' },
        { cat: '水洗', s: '🖐️', n: '手洗', d: '最高水溫40°C，不可機洗' },
        { cat: '水洗', s: '🚫🧺', n: '不可水洗', d: '請交給專業乾洗處理，不可下水' },
        { cat: '水洗', s: '🌡️30', n: '水溫限制', d: '最高溫30°C，保護衣料' },
        { cat: '漂白', s: '△', n: '可漂白', d: '可使用含氯或氧的漂白劑' },
        { cat: '漂白', s: '⨺', n: '僅限氧系漂白', d: '不可使用含氯漂白劑' },
        { cat: '漂白', s: '🚫△', n: '不可漂白', d: '禁止使用任何漂白劑' },
        { cat: '烘乾', s: '◻️', n: '可以烘乾', d: '可使用滾筒烘乾機' },
        { cat: '烘乾', s: '🚫◻️', n: '不可烘乾', d: '烘乾可能導致衣物縮水' },
        { cat: '烘乾', s: '☀️', n: '懸掛晾乾', d: '建議在陰涼處懸掛晾乾' },
        { cat: '熨燙', s: '🔥', n: '可熨燙', d: '一般熨燙，無特殊溫度限制' },
        { cat: '熨燙', s: '🚫🔥', n: '不可熨燙', d: '熨燙會損壞衣物布料' },
        { cat: '乾洗', s: '◯', n: '專業乾洗', d: '適合所有常規乾洗溶劑' },
        { cat: '乾洗', s: '🚫◯', n: '不可乾洗', d: '請勿使用乾洗方式處理' }
    ];

    // 2. 建立主要的 UI 框架 (包含標題、搜尋框與內容區塊)
    targetContainer.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm font-sans">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                    👕 衣服洗標對照表
                </h3>
                <div class="w-full sm:w-auto relative">
                    <input 
                        type="text" 
                        id="laundry-search" 
                        placeholder="搜尋標誌 (例: 烘乾、漂白)..." 
                        class="w-full sm:w-64 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
                    >
                </div>
            </div>
            <div id="laundry-content" class="space-y-6"></div>
        </div>
    `;

    const contentArea = targetContainer.querySelector('#laundry-content');
    const searchInput = targetContainer.querySelector('#laundry-search');

    // 3. 渲染內容的邏輯 (支援搜尋與分類顯示)
    const renderContent = (searchTerm = '') => {
        // 過濾資料
        const filteredData = laundryData.filter(item => 
            item.n.includes(searchTerm) || 
            item.d.includes(searchTerm) || 
            item.cat.includes(searchTerm)
        );

        if (filteredData.length === 0) {
            contentArea.innerHTML = `
                <div class="text-center py-10 text-slate-500">
                    找不到符合「${searchTerm}」的洗標 😢
                </div>
            `;
            return;
        }

        // 依照分類群組化資料
        const groupedData = filteredData.reduce((acc, item) => {
            if (!acc[item.cat]) acc[item.cat] = [];
            acc[item.cat].push(item);
            return acc;
        }, {});

        // 產生 HTML
        contentArea.innerHTML = Object.keys(groupedData).map(category => `
            <div>
                <h4 class="text-sm font-bold text-slate-500 border-b border-slate-100 pb-2 mb-3">
                    ${category}類別
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    ${groupedData[category].map(item => `
                        <div class="group flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 hover:shadow-md cursor-help transition-all duration-200">
                            <div class="text-3xl mb-3 flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                ${item.s}
                            </div>
                            <div class="font-bold text-slate-700 text-sm mb-1">${item.n}</div>
                            <div class="text-xs text-slate-500 leading-relaxed">${item.d}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    };

    // 4. 初次渲染與綁定搜尋事件
    renderContent();
    
    searchInput.addEventListener('input', (e) => {
        renderContent(e.target.value.trim());
    });
};
