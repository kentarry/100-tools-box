window.render_distanceMeter = function (containerElement) {
    // 確保有指定容器，若無則嘗試抓取預設的 ID (可依你的專案調整)
    const container = containerElement || document.getElementById('tool-container');

    if (!container) {
        console.error("找不到渲染容器");
        return;
    }

    // 1. 使用獨立的 ID 前綴 (distance-xxx) 避免與其他 99 個工具衝突
    // 2. 強化 Tailwind UI：增加陰影、focus 狀態、錯誤提示區塊
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full box-border">
            <div class="text-center mb-5">
                <h3 class="font-bold text-lg text-slate-800 flex items-center justify-center gap-2">
                    <span class="text-xl">📏</span> 座標距離計算
                </h3>
                <p class="text-xs text-slate-500 mt-1">輸入兩組經緯度 (緯度, 經度)，計算直線距離</p>
            </div>

            <div class="space-y-4 text-left">
                <div>
                    <label for="distance-posA" class="block text-sm font-medium text-slate-700 mb-1">位置 A (Lat, Lng)</label>
                    <input type="text" id="distance-posA" value="25.0339, 121.5644" placeholder="例: 25.0339, 121.5644" 
                        class="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
                    <p id="distance-errA" class="text-red-500 text-[11px] mt-1 hidden">格式錯誤，請確保輸入有效經緯度</p>
                </div>

                <div>
                    <label for="distance-posB" class="block text-sm font-medium text-slate-700 mb-1">位置 B (Lat, Lng)</label>
                    <input type="text" id="distance-posB" value="25.0478, 121.5170" placeholder="例: 25.0478, 121.5170" 
                        class="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm">
                    <p id="distance-errB" class="text-red-500 text-[11px] mt-1 hidden">格式錯誤，請確保輸入有效經緯度</p>
                </div>

                <div class="mt-6 p-5 bg-slate-800 text-white rounded-xl text-center shadow-inner">
                    <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">兩點直線距離約</p>
                    <div class="flex justify-center items-baseline gap-1">
                        <p id="distance-resNum" class="text-4xl font-black tabular-nums">0.00</p>
                        <p id="distance-resUnit" class="text-sm text-slate-300 font-medium">km</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 使用 setTimeout 確保 DOM 已經渲染完成再綁定事件
    setTimeout(() => {
        // 限制在 container 內部尋找元素，避免干擾外部
        const inputA = container.querySelector('#distance-posA');
        const inputB = container.querySelector('#distance-posB');
        const errA = container.querySelector('#distance-errA');
        const errB = container.querySelector('#distance-errB');
        const resNum = container.querySelector('#distance-resNum');
        const resUnit = container.querySelector('#distance-resUnit');

        // 座標解析與防呆驗證函數
        function parseCoord(str) {
            if (!str) return null;
            // 清除空白後，以逗號分割
            const parts = str.replace(/\s+/g, '').split(',');
            if (parts.length !== 2) return null;

            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);

            // 檢查是否為數字，且符合地球經緯度範圍
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return null;
            }
            return { lat, lng };
        }

        function calc() {
            const coordA = parseCoord(inputA.value);
            const coordB = parseCoord(inputB.value);

            // 處理 UI 錯誤提示狀態
            const isInvalidA = !coordA && inputA.value.trim() !== '';
            const isInvalidB = !coordB && inputB.value.trim() !== '';

            errA.classList.toggle('hidden', !isInvalidA);
            inputA.classList.toggle('border-red-500', isInvalidA);
            errB.classList.toggle('hidden', !isInvalidB);
            inputB.classList.toggle('border-red-500', isInvalidB);

            // 若有任一格式錯誤或空白，顯示佔位符並中斷計算
            if (!coordA || !coordB) {
                resNum.textContent = '--';
                resUnit.textContent = '';
                return;
            }

            // Haversine 半正矢公式計算距離
            const R = 6371; // 地球半徑 (km)
            const dLat = (coordB.lat - coordA.lat) * Math.PI / 180;
            const dLon = (coordB.lng - coordA.lng) * Math.PI / 180;
            const aLat = coordA.lat * Math.PI / 180;
            const bLat = coordB.lat * Math.PI / 180;

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(aLat) * Math.cos(bLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceKm = R * c;

            // 智能單位切換：小於 1 公里時顯示公尺，大於等於 1 公里顯示公里
            if (distanceKm < 1) {
                resNum.textContent = (distanceKm * 1000).toFixed(0);
                resUnit.textContent = 'm';
            } else {
                resNum.textContent = distanceKm.toFixed(2);
                resUnit.textContent = 'km';
            }
        }

        // 精準綁定 input 事件，而不是選取全網頁的 input
        inputA.addEventListener('input', calc);
        inputB.addEventListener('input', calc);

        // 初始計算一次
        calc();
    }, 0);
};
