window.render_randomNumber = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl border text-center">
            <h3 class="font-bold mb-6">🎲 隨機數產生器</h3>
            <div class="flex gap-4 mb-6">
                <input type="number" id="rndMin" value="1" class="w-1/2 p-2 border rounded-lg text-center">
                <input type="number" id="rndMax" value="100" class="w-1/2 p-2 border rounded-lg text-center">
            </div>
            <div id="rndRes" class="text-6xl font-black text-indigo-600 mb-6">?</div>
            <button onclick="const min=parseInt(document.getElementById('rndMin').value), max=parseInt(document.getElementById('rndMax').value); document.getElementById('rndRes').textContent = Math.floor(Math.random()*(max-min+1))+min" class="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-xl">GENERATE</button>
        </div>
    `;
};