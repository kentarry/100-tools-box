window.render_tempConverter = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-6">🌡️ 溫度換算</h3>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="text-xs">Celsius (°C)</label><input type="number" id="tempC" value="0" class="w-full p-2 border rounded"></div>
                <div><label class="text-xs">Fahrenheit (°F)</label><input type="number" id="tempF" value="32" class="w-full p-2 border rounded"></div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const c = document.getElementById('tempC'), f = document.getElementById('tempF');
        c.oninput = () => f.value = (c.value * 9 / 5 + 32).toFixed(1);
        f.oninput = () => c.value = ((f.value - 32) * 5 / 9).toFixed(1);
    }, 0);
};