window.render_fontViewer = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🔠 字體本機預覽器</h3>
            <p class="text-xs text-slate-400 mb-6">將你電腦裡的字體檔 (.ttf / .otf) 拖進來，免安裝直接看預覽。</p>
            <input type="file" id="fontUp" accept=".ttf,.otf" class="mb-6 block w-full text-sm">
            <div id="fontPreviewArea" class="p-8 border rounded-xl min-h-[150px] text-4xl leading-relaxed break-all" contenteditable="true">
                預覽文字：The quick brown fox jumps over the lazy dog. 
                天地玄黃，宇宙洪荒。
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('fontUp').onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                const font = new FontFace('customFont', ev.target.result);
                font.load().then(loadedFont => {
                    document.fonts.add(loadedFont);
                    document.getElementById('fontPreviewArea').style.fontFamily = 'customFont';
                });
            };
            reader.readAsArrayBuffer(file);
        };
    }, 0);
};