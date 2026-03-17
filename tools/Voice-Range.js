window.render_voiceRange = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🎤 音域測試模板</h3>
            <div class="p-10 bg-indigo-50 rounded-xl border border-dashed text-indigo-400">
                點擊開始並對著麥克風發出你最高的聲音<br>(需要 Web Audio API)
            </div>
            <button class="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg">開始測試</button>
        </div>
    `;
};