window.render_laundrySymbols = function () {
    const symbols = [
        { s: '🧺', n: '一般水洗', d: '可以使用洗衣機洗滌' },
        { s: '🚫', n: '不可水洗', d: '請交給專業乾洗處理' },
        { s: '🌡️', n: '水溫限制', d: '注意標籤上的數字上限' },
        { s: '△', n: '可漂白', d: '可使用含氯或氧的漂白劑' },
        { s: '⬡', n: '不可漂白', d: '禁止使用任何漂白劑' },
        { s: '💨', n: '可以烘乾', d: '可使用滾筒烘乾機' },
        { s: '❌💨', n: '不可烘乾', d: '烘乾可能導致衣物縮水' }
    ];
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">👕 衣服洗標對照表</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                ${symbols.map(item => `
                    <div class="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-help transition">
                        <div class="text-3xl mb-2">${item.s}</div>
                        <div class="font-bold text-sm">${item.n}</div>
                        <div class="text-[10px] text-slate-400">${item.d}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};