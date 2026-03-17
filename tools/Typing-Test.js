window.render_typingTest = function () {
    const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is the art of telling a computer what to do.",
        "A journey of a thousand miles begins with a single step.",
        "To be or not to be, that is the question.",
        "In the middle of difficulty lies opportunity.",
        "The only way to do great work is to love what you do.",
        "Stay hungry, stay foolish. Never stop learning new things.",
        "Life is what happens when you are busy making other plans.",
        "Success is not final, failure is not fatal, it is the courage to continue that counts.",
        "Every moment is a fresh beginning if you choose to see it that way.",
        "Imagination is more important than knowledge, for knowledge is limited.",
        "Do what you can with what you have where you are right now.",
        "The best time to plant a tree was twenty years ago. The second best time is now.",
        "It does not matter how slowly you go as long as you do not stop.",
        "Everything you have ever wanted is on the other side of fear."
    ];

    const getSample = () => sentences[Math.floor(Math.random() * sentences.length)];
    let currentSample = getSample();

    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">⌨️ 英打速度測試 (WPM)</h3>

            <div id="typeSample" class="bg-slate-50 p-4 rounded-xl font-mono text-lg leading-relaxed mb-4 select-none text-left tracking-wide"></div>

            <textarea id="typeInput" class="w-full h-24 p-4 border rounded-xl outline-none focus:border-indigo-500 font-mono text-lg" placeholder="在此開始打字..." spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

            <div class="flex justify-between items-center mt-4 gap-3">
                <div class="flex gap-4 text-sm">
                    <span class="text-slate-400">⏱ <span id="typeTimer" class="font-bold text-slate-600">0.0</span>s</span>
                    <span class="text-slate-400">📝 <span id="typeChars" class="font-bold text-slate-600">0</span>/<span id="typeTotalChars">0</span></span>
                </div>
                <button id="typeReset" class="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors">🔄 換一句</button>
            </div>

            <div id="typeResult" class="hidden mt-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
                <p class="text-2xl font-black text-indigo-600"><span id="resWPM">0</span> WPM</p>
                <div class="flex justify-center gap-6 text-sm">
                    <span class="text-slate-500">準確率 <span id="resAcc" class="font-bold text-emerald-600">0</span>%</span>
                    <span class="text-slate-500">耗時 <span id="resTime" class="font-bold text-slate-700">0</span>s</span>
                </div>
                <button id="typeAgain" class="mt-2 px-5 py-2 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-600 transition-colors">再來一次</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('typeInput');
        const sampleEl = document.getElementById('typeSample');
        const timerEl = document.getElementById('typeTimer');
        const charsEl = document.getElementById('typeChars');
        const totalCharsEl = document.getElementById('typeTotalChars');
        const resultBox = document.getElementById('typeResult');
        const resWPM = document.getElementById('resWPM');
        const resAcc = document.getElementById('resAcc');
        const resTime = document.getElementById('resTime');
        const resetBtn = document.getElementById('typeReset');
        const againBtn = document.getElementById('typeAgain');

        let startTime = null;
        let timerInterval = null;
        let done = false;

        // Render sample with colored chars
        const renderSample = (typed) => {
            let html = '';
            for (let i = 0; i < currentSample.length; i++) {
                const ch = currentSample[i] === ' ' ? '&nbsp;' : currentSample[i];
                if (i < typed.length) {
                    if (typed[i] === currentSample[i]) {
                        html += `<span class="text-emerald-600">${ch}</span>`;
                    } else {
                        html += `<span class="text-red-500 bg-red-100 rounded">${ch}</span>`;
                    }
                } else if (i === typed.length) {
                    html += `<span class="bg-indigo-200 text-indigo-900 rounded animate-pulse">${ch}</span>`;
                } else {
                    html += `<span class="text-slate-400">${ch}</span>`;
                }
            }
            sampleEl.innerHTML = html;
        };

        const reset = () => {
            currentSample = getSample();
            input.value = '';
            input.disabled = false;
            startTime = null;
            done = false;
            if (timerInterval) clearInterval(timerInterval);
            timerEl.textContent = '0.0';
            charsEl.textContent = '0';
            totalCharsEl.textContent = currentSample.length;
            resultBox.classList.add('hidden');
            renderSample('');
            input.focus();
        };

        const finish = () => {
            done = true;
            if (timerInterval) clearInterval(timerInterval);
            input.disabled = true;
            const elapsed = (Date.now() - startTime) / 1000;
            const minutes = elapsed / 60;
            const wordCount = currentSample.split(' ').length;
            const wpm = Math.round(wordCount / minutes);

            // Calculate accuracy
            let correct = 0;
            for (let i = 0; i < currentSample.length; i++) {
                if (input.value[i] === currentSample[i]) correct++;
            }
            const accuracy = Math.round((correct / currentSample.length) * 100);

            resWPM.textContent = wpm;
            resAcc.textContent = accuracy;
            resTime.textContent = elapsed.toFixed(1);
            resultBox.classList.remove('hidden');
        };

        input.oninput = () => {
            if (done) return;
            const typed = input.value;

            if (!startTime) {
                startTime = Date.now();
                timerInterval = setInterval(() => {
                    if (!done) {
                        timerEl.textContent = ((Date.now() - startTime) / 1000).toFixed(1);
                    }
                }, 100);
            }

            charsEl.textContent = typed.length;
            renderSample(typed);

            // Check completion
            if (typed.length >= currentSample.length) {
                finish();
            }
        };

        resetBtn.onclick = reset;
        againBtn.onclick = reset;

        // Init
        totalCharsEl.textContent = currentSample.length;
        renderSample('');
    }, 0);
};
