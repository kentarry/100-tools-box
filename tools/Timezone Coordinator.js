window.render_timezoneCoordinator = function () {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border">
            <h3 class="font-bold mb-4">🌍 跨時區會議協調</h3>
            <div class="space-y-4">
                <div class="p-4 bg-slate-50 rounded-xl">
                    <p class="text-xs font-bold text-slate-400 mb-2">台北 (GMT+8)</p>
                    <input type="range" id="tzTaipei" min="0" max="23" value="14" class="w-full">
                    <p id="tzTVal" class="text-center font-bold">14:00</p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-xl">
                    <p class="text-xs font-bold text-indigo-400 mb-2">倫敦 (GMT+0)</p>
                    <p id="tzLondon" class="text-center text-xl font-bold text-indigo-600">06:00</p>
                </div>
                <div class="p-4 bg-rose-50 rounded-xl">
                    <p class="text-xs font-bold text-rose-400 mb-2">紐約 (GMT-5)</p>
                    <p id="tzNewYork" class="text-center text-xl font-bold text-rose-600">01:00</p>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const slider = document.getElementById('tzTaipei');
        slider.oninput = () => {
            const h = parseInt(slider.value);
            document.getElementById('tzTVal').textContent = `${h}:00`;
            document.getElementById('tzLondon').textContent = `${(h - 8 + 24) % 24}:00`;
            document.getElementById('tzNewYork').textContent = `${(h - 13 + 24) % 24}:00`;
        };
    }, 0);
};