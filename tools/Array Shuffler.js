window.render_arrayShuffler = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🔀 清單隨機打亂</h3>
            <textarea id="arrIn" class="w-full h-32 p-3 border rounded-xl mb-4" placeholder="每行一項..."></textarea>
            <button onclick="const el=document.getElementById('arrIn'); const a=el.value.split('\\n'); a.sort(()=>Math.random()-0.5); el.value=a.join('\\n')" class="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold">SHUFFLE</button>
        </div>
    `;
};