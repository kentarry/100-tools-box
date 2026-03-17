// ==========================================
// 🚀 100 in 1 工具箱 - 終極核心控制邏輯 (app.js)
// ==========================================

// 1. 取得全域重要的 DOM 元素
const container = document.getElementById('tool-container');
const currentToolTitle = document.getElementById('current-tool-title');
const toolSearch = document.getElementById('toolSearch');
const goHomeBtn = document.getElementById('goHome');

// menuButtons: 動態取得，確保包含後來新增的按鈕
function getMenuButtons() {
    return document.querySelectorAll('#menu-nav button[data-tool]');
}

// 2. 定義工具關鍵字與圖示的自動對照表 (用於目錄卡片)
const iconMap = {
    // 影像與多媒體
    'img': '🖼️', 'photo': '📸', 'color': '🎨', 'bg': '✨', 'watermark': '🌊', 'video': '🎥', 'gif': '🎞️',
    // 安全與隱私
    'pwd': '🔐', 'pass': '🔑', 'secure': '🛡️', 'email': '📧', 'mask': '🎭', 'burn': '🔥',
    // 文字與排版
    'text': '📝', 'pangu': '✍️', 'convert': '🔄', 'decode': '🔓', 'filter': '✂️', 'md': '🗒️',
    // 金錢與理財
    'loan': '🏠', 'interest': '📈', 'tax': '🧧', 'currency': '💱', 'vat': '🏢', 'money': '💰',
    // 效率與工具
    'timer': '⏱️', 'clock': '🕒', 'pomo': '🍅', 'unit': '📏', 'calc': '🧮', 'json': '📦', 'base64': '🔗',
    // 生活與健康
    'health': '🥗', 'pet': '🐾', 'period': '🌸', 'alcohol': '🍺', 'weather': '🌡️', 'recipe': '🍳',
    // 硬體與交通
    'wifi': '📶', 'taxi': '🚕', 'fuel': '⛽', 'keyboard': '⌨️', 'mouse': '🖱️', 'screen': '🖥️', 'scanner': '📷',
    // 娛樂與冷知識
    'fortune': '🎋', 'calendar': '🏮', 'greet': '👴', 'mbti': '🧠', 'food': '🍱', 'morse': '📡'
};

/**
 * 🏠 功能 A：生成「工具總覽目錄」
 * 自動掃描 menu-nav 裡的所有按鈕，並轉換成視覺化卡片
 */
function render_dashboard() {
    currentToolTitle.textContent = "工具總覽目錄";

    // 清除側邊欄所有高亮狀態
    getMenuButtons().forEach(btn => {
        btn.classList.remove('active-menu', 'bg-slate-800', 'text-emerald-400');
        btn.classList.add('text-slate-300');
        btn.style.borderLeft = "none";
    });

    // 建立目錄網格結構
    container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in" id="dashboard-grid">
            </div>
    `;

    const grid = document.getElementById('dashboard-grid');

    getMenuButtons().forEach(btn => {
        const toolName = btn.getAttribute('data-tool');
        const title = btn.textContent.trim();

        // 根據 toolName 或標題判斷圖示
        let icon = '🛠️'; // 預設圖示
        const combinedKey = (toolName + title).toLowerCase();
        for (const [key, value] of Object.entries(iconMap)) {
            if (combinedKey.includes(key)) {
                icon = value;
                break;
            }
        }

        // 建立卡片元素
        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 cursor-pointer transition-all transform hover:-translate-y-2 group flex flex-col items-center justify-center min-h-[160px]";

        card.innerHTML = `
            <div class="text-5xl mb-4 group-hover:rotate-12 group-hover:scale-110 transition-transform">${icon}</div>
            <div class="font-bold text-slate-800 text-center group-hover:text-emerald-600 transition-colors">${title}</div>
            <div class="text-[10px] text-slate-400 mt-2 tracking-widest uppercase opacity-60 font-mono">${toolName}</div>
        `;

        // 點擊卡片等同於點擊左側選單按鈕
        card.onclick = () => loadTool(toolName, title, btn);
        grid.appendChild(card);
    });
}

/**
 * 🔄 功能 B：工具載入與渲染路由
 */
function loadTool(toolName, title, buttonElement) {
    // 1. 清空舊內容
    container.innerHTML = '';
    currentToolTitle.textContent = title;

    // 2. 更新側邊欄視覺樣式
    getMenuButtons().forEach(btn => {
        btn.classList.remove('active-menu', 'bg-slate-800', 'text-emerald-400');
        btn.classList.add('text-slate-300');
        btn.style.borderLeft = "none";
    });

    if (buttonElement) {
        buttonElement.classList.remove('text-slate-300');
        buttonElement.classList.add('active-menu', 'bg-slate-800', 'text-emerald-400');
        buttonElement.style.borderLeft = "4px solid #34d399";
        // 確保按鈕在視線範圍內
        buttonElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 3. 嘗試執行該工具的渲染函式
    const functionName = 'render_' + toolName;
    if (typeof window[functionName] === 'function') {
        window[functionName]();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // 容錯處理：若工具尚未實作或載入失敗
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-inner animate-fade-in">
                <span class="text-6xl mb-6">🚧</span>
                <p class="text-xl font-bold text-slate-600">工具 [${title}] 尚未載入！</p>
                <div class="mt-4 p-4 bg-slate-50 rounded-xl text-xs font-mono border text-slate-400">
                    請確認 index.html 是否包含：<br>
                    &lt;script src="tools/${toolName}.js"&gt;&lt;/script&gt;
                </div>
            </div>
        `;
    }
}

/**
 * 🔍 功能 C：側邊欄即時搜尋過濾
 */
if (toolSearch) {
    toolSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        getMenuButtons().forEach(btn => {
            const text = btn.textContent.toLowerCase();
            const toolCode = btn.getAttribute('data-tool').toLowerCase();

            // 同時比對中文名稱與工具內部 ID
            if (text.includes(term) || toolCode.includes(term)) {
                btn.style.display = '';
            } else {
                btn.style.display = 'none';
            }
        });
    });
}

// 4. 事件綁定 — 使用事件委派，確保動態新增的按鈕也能被點擊
const menuNav = document.getElementById('menu-nav');
if (menuNav) {
    menuNav.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-tool]');
        if (btn) {
            const toolName = btn.getAttribute('data-tool');
            const title = btn.textContent.trim();
            loadTool(toolName, title, btn);
        }
    });
}

// 5. 「回目錄」按鈕綁定
if (goHomeBtn) {
    goHomeBtn.onclick = (e) => {
        e.preventDefault();
        render_dashboard();
    };
}

// 6. 初始啟動
document.addEventListener('DOMContentLoaded', () => {
    // 預設進入總覽目錄 Dashboard，而非開啟第一個工具
    render_dashboard();

    // 增加一點點打字機效果在標題（選擇性）
    console.log("100 in 1 工具箱已啟動，目前載入腳本：", Object.keys(window).filter(k => k.startsWith('render_')).length);
});
