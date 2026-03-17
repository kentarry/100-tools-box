window.render_fridgeManager = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4 text-emerald-700">🧊 冰箱食材過期提醒</h3>
            <div class="flex gap-2 mb-4">
                <input type="text" id="foodName" placeholder="食材名稱" class="flex-1 p-2 border rounded">
                <input type="date" id="foodDate" class="p-2 border rounded">
                <button id="addFood" class="px-4 bg-emerald-500 text-white rounded">加</button>
            </div>
            <div id="foodList" class="space-y-2"></div>
        </div>
    `;
};