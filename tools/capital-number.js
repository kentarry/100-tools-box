window.render_capitalNumber = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <h3 class="text-xl font-bold text-slate-800 mb-2">🏦 合約中文大寫金額轉換</h3>
            <p class="text-slate-500 text-sm mb-6">開立支票、合約報價必備，一秒轉換正確的傳統財務大寫格式。</p>
            
            <div class="relative mb-6">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 font-bold">NT$</span>
                <input type="number" id="numInput" class="w-full text-2xl p-4 pl-14 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-0 outline-none font-bold text-slate-800 tracking-wider" placeholder="請輸入阿拉伯數字" min="0">
            </div>
            
            <div class="p-6 bg-amber-50 border border-amber-200 rounded-xl">
                <p class="text-sm font-bold text-amber-700 mb-2 uppercase tracking-wide">中文大寫金額</p>
                <div id="capitalOutput" class="text-3xl font-bold text-slate-800 tracking-widest min-h-[3rem] flex items-center justify-center">
                    零元整
                </div>
            </div>
            
            <button id="copyCapitalBtn" class="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition">
                📋 複製大寫金額
            </button>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('numInput');
        const output = document.getElementById('capitalOutput');
        const copyBtn = document.getElementById('copyCapitalBtn');

        function convertToCapital(n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "請輸入有效數字";
            let unit = "仟佰拾億仟佰拾萬仟佰拾元角分", str = "";
            n += "00";
            let p = n.indexOf('.');
            if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
            unit = unit.substr(unit.length - n.length);
            for (let i = 0; i < n.length; i++) {
                str += '零壹貳參肆伍陸柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            }
            return str.replace(/零(仟|佰|拾|角)/g, "零")
                .replace(/(零)+/g, "零")
                .replace(/零(萬|億|元)/g, "$1")
                .replace(/(億)萬|壹(拾)/g, "$1$2")
                .replace(/^元零?|零分/g, "")
                .replace(/元$/g, "元整");
        }

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val === '') {
                output.textContent = '零元整';
            } else {
                output.textContent = convertToCapital(val);
            }
        });

        copyBtn.addEventListener('click', () => {
            const textToCopy = output.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ 已複製！';
                copyBtn.classList.replace('bg-slate-800', 'bg-emerald-600');
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.replace('bg-emerald-600', 'bg-slate-800');
                }, 2000);
            });
        });
    }, 0);
};