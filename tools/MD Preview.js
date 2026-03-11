window.render_mdPreview = function () {
    container.innerHTML = `
        <div class="flex flex-col md:flex-row gap-4 h-[500px]">
            <textarea id="mdIn" class="flex-1 p-4 border rounded-xl font-mono text-sm" placeholder="輸入 Markdown..."></textarea>
            <div id="mdOut" class="flex-1 p-4 border rounded-xl bg-white overflow-auto prose prose-sm"></div>
        </div>
    `;
    setTimeout(() => {
        const i = document.getElementById('mdIn'), o = document.getElementById('mdOut');
        i.oninput = () => {
            // 極簡版處理：僅處理標題與粗體
            let h = i.value.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold">$1</h1>')
                .replace(/^\*\* (.*$)/gim, '<strong>$1</strong>');
            o.innerHTML = h;
        };
    }, 0);
};