window.render_distanceMeter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">📏 座標距離計算 (直線距離)</h3>
            <p class="text-[10px] text-slate-400 mb-6">輸入兩組經緯度，計算它們之間的距離。</p>
            <div class="space-y-4 text-left">
                <div><label class="text-xs">位置 A (Lat, Lng)</label><input type="text" id="posA" value="25.0339, 121.5644" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">位置 B (Lat, Lng)</label><input type="text" id="posB" value="25.0478, 121.5170" class="w-full p-2 border rounded"></div>
                <div class="p-4 bg-slate-900 text-white rounded-xl text-center">
                    <p class="text-xs text-slate-500 uppercase">直線距離約</p>
                    <p id="distRes" class="text-2xl font-black">0 km</p>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        function calc() {
            const [aL, aN] = document.getElementById('posA').value.split(',').map(Number);
            const [bL, bN] = document.getElementById('posB').value.split(',').map(Number);
            const R = 6371; // km
            const dLat = (bL - aL) * Math.PI / 180;
            const dLon = (bN - aN) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(aL * Math.PI / 180) * Math.cos(bL * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            document.getElementById('distRes').textContent = (R * c).toFixed(2) + ' km';
        }
        document.querySelectorAll('input').forEach(i => i.oninput = calc);
        calc();
    }, 0);
};