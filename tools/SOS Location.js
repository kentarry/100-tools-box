window.render_sosLocation = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-rose-50 p-6 rounded-2xl border border-rose-200 text-center">
            <h3 class="font-bold text-rose-700 mb-4">🆘 緊急求救定位</h3>
            <button id="getSos" class="w-full py-4 bg-rose-600 text-white rounded-xl font-black text-xl mb-4">獲取我的經緯度</button>
            <div id="sosRes" class="hidden p-4 bg-white rounded-xl border border-rose-100 font-mono text-sm break-all"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('getSos').onclick = () => {
            navigator.geolocation.getCurrentPosition(p => {
                const res = document.getElementById('sosRes'); res.classList.remove('hidden');
                res.textContent = `我的位置：Lat ${p.coords.latitude}, Lng ${p.coords.longitude}\nGoogle Map: https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`;
            });
        };
    }, 0);
};