window.render_morseCode = function () {
    container.innerHTML = `
        <div class="max-w-xl mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">📡 摩斯密碼翻譯</h3>
            <textarea id="morseIn" class="w-full h-32 p-3 border rounded-xl mb-4 font-mono" placeholder="輸入英文或摩斯密碼 (.... ----)"></textarea>
            <div class="flex gap-2">
                <button id="morseEnc" class="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold">編碼</button>
                <button id="morseDec" class="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-bold">解碼</button>
            </div>
        </div>
    `;
    setTimeout(() => {
        const charToMorse = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
        const morseToChar = Object.fromEntries(Object.entries(charToMorse).map(([k, v]) => [v, k]));
        const input = document.getElementById('morseIn');
        document.getElementById('morseEnc').onclick = () => {
            input.value = input.value.toUpperCase().split('').map(c => charToMorse[c] || c).join(' ');
        };
        document.getElementById('morseDec').onclick = () => {
            input.value = input.value.split(' ').map(m => morseToChar[m] || m).join('');
        };
    }, 0);
};