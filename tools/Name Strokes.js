window.render_nameStrokes = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center shadow-sm">
            <h3 class="font-bold mb-4">🔮 姓名筆畫試算 (模擬)</h3>
            <input type="text" id="nameIn" placeholder="輸入中文姓名" class="w-full p-3 border rounded-xl text-center text-xl mb-4">
            <div id="nameRes" class="p-4 bg-orange-50 text-orange-800 rounded-xl font-bold hidden"></div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('nameIn').oninput = (e) => {
            if (e.target.value.length >= 2) {
                const res = document.getElementById('nameRes'); res.classList.remove('hidden');
                res.textContent = "運勢：中吉。筆畫五行屬金，利於事業發展。";
            }
        };
    }, 0);
};