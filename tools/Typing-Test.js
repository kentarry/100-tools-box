window.render_typingTest = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">⌨️ 英打速度測試 (WPM)</h3>
            <p class="bg-slate-50 p-4 rounded-xl font-mono text-slate-400 mb-4 select-none" id="typeSample">The quick brown fox jumps over the lazy dog.</p>
            <textarea id="typeInput" class="w-full h-32 p-4 border rounded-xl outline-none focus:border-indigo-500" placeholder="在此開始打字..."></textarea>
            <div id="typeResult" class="mt-4 font-bold text-indigo-600"></div>
        </div>
    `;
    setTimeout(() => {
        let startTime = null;
        const input = document.getElementById('typeInput'), sample = document.getElementById('typeSample').textContent;
        input.oninput = () => {
            if (!startTime) startTime = new Date();
            if (input.value === sample) {
                const time = (new Date() - startTime) / 1000 / 60;
                const wpm = Math.round((sample.split(' ').length) / time);
                document.getElementById('typeResult').textContent = `完成！您的速度：${wpm} WPM`;
            }
        };
    }, 0);
};