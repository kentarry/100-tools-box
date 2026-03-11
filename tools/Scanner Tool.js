window.render_scannerTool = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">📷 網頁掃描器</h3>
            <p class="text-xs text-slate-400 mb-6">使用鏡頭掃描 QR Code。 (需授權相機權限)</p>
            <div class="aspect-square bg-slate-900 rounded-2xl mb-4 flex items-center justify-center text-slate-600 font-bold">
                [ 鏡頭預覽區域 ]
            </div>
            <p class="text-sm font-bold text-slate-500 italic">※ 此工具在本地開發環境需 HTTPS 才能調用相機</p>
        </div>
    `;
};