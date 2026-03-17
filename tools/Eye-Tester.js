window.render_eyeTester = function () {
    const directions = ['rotate-0', 'rotate-90', 'rotate-180', 'rotate-270'];
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-10 rounded-2xl border text-center shadow-lg">
            <h3 class="font-bold mb-6">👁️ 簡易視力檢查 (模擬)</h3>
            <div id="eyeE" class="text-8xl font-black mb-8 transition-transform transform">E</div>
            <button onclick="const e=document.getElementById('eyeE'); const d=['rotate-0','rotate-90','rotate-180','rotate-270']; e.className='text-8xl font-black mb-8 transition-transform transform '+d[Math.floor(Math.random()*4)]" class="w-full py-3 bg-slate-800 text-white rounded-xl">下一個</button>
        </div>
    `;
};
