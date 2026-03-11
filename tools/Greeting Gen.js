window.render_greetingGen = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">💮 長輩圖產生器 (認同請分享)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-4">
                    <input type="text" id="greetTxt" value="早安朋友，平安喜樂" class="w-full p-2 border rounded">
                    <select id="greetBg" class="w-full p-2 border rounded">
                        <option value="https://images.unsplash.com/photo-1506744038136-46273834b3fb">高山風景</option>
                        <option value="https://images.unsplash.com/photo-1490750967868-88aa4486c946">鮮花系列</option>
                    </select>
                    <button id="greetDown" class="w-full py-2 bg-emerald-600 text-white rounded font-bold">下載長輩圖</button>
                </div>
                <div class="relative rounded overflow-hidden shadow-lg aspect-square">
                    <img id="greetImg" class="w-full h-full object-cover">
                    <div id="greetOverlay" class="absolute inset-0 flex items-center justify-center text-white text-3xl font-black text-center p-4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" style="font-family: 'DFKai-SB', '標楷體';"></div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const update = () => {
            document.getElementById('greetImg').src = document.getElementById('greetBg').value;
            document.getElementById('greetOverlay').textContent = document.getElementById('greetTxt').value;
        };
        document.getElementById('greetTxt').oninput = update;
        document.getElementById('greetBg').onchange = update;
        update();
    }, 0);
};