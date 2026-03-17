window.render_fontCompare = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4 text-center">🖋️ 系統字體對比</h3>
            <div class="space-y-4">
                <div style="font-family: 'Microsoft JhengHei';">微軟正黑體：認同請分享 123 abc</div>
                <div style="font-family: 'PingFang TC';">蘋方繁體：認同請分享 123 abc</div>
                <div style="font-family: 'Noto Sans TC';">思源黑體：認同請分享 123 abc</div>
            </div>
        </div>
    `;
};