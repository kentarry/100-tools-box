window.render_relativeTitle = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold mb-4">👵 親戚稱呼計算機</h3>
            <div class="bg-slate-50 p-4 rounded-xl mb-4 text-center min-h-[60px] flex items-center justify-center">
                <p id="relExpression" class="text-slate-500 font-bold text-lg">我的 ...</p>
            </div>
            <div class="grid grid-cols-4 gap-2 mb-4">
                <button class="rel-btn p-3 bg-white border rounded-lg hover:bg-rose-50 hover:border-rose-200 transition" data-val="父">父</button>
                <button class="rel-btn p-3 bg-white border rounded-lg hover:bg-rose-50 hover:border-rose-200 transition" data-val="母">母</button>
                <button class="rel-btn p-3 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition" data-val="夫">夫</button>
                <button class="rel-btn p-3 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition" data-val="妻">妻</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="兄">兄</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="弟">弟</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="姐">姐</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="妹">妹</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="子">子</button>
                <button class="rel-btn p-3 bg-white border rounded-lg" data-val="女">女</button>
                <button id="relClear" class="p-3 bg-slate-200 rounded-lg font-bold col-span-2">AC / 重置</button>
            </div>
            <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center">
                <p class="text-xs text-orange-600 mb-1 font-bold uppercase">你該稱呼他/她為：</p>
                <p id="relResult" class="text-2xl font-bold text-slate-800">自己</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        // 使用輕量開源庫 relationship.js (邏輯複雜，引用 CDN 最快)
        if (!window.relationship) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/relationship.js/dist/relationship.min.js";
            document.head.appendChild(script);
        }

        const btns = document.querySelectorAll('.rel-btn');
        const expr = document.getElementById('relExpression');
        const result = document.getElementById('relResult');
        const clear = document.getElementById('relClear');
        let path = [];

        btns.forEach(btn => {
            btn.onclick = () => {
                path.push(btn.getAttribute('data-val'));
                expr.textContent = '我的' + path.join('的');
                const options = { text: expr.textContent, sex: 1 };
                const res = relationship(options);
                result.textContent = res[0] || '太遠了，算不出來';
            };
        });

        clear.onclick = () => {
            path = [];
            expr.textContent = '我的 ...';
            result.textContent = '自己';
        };
    }, 0);
};