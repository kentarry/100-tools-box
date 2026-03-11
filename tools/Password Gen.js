window.render_passwordGen = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-100 text-left shadow-2xl font-sans transition-all">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <span class="text-2xl">🔐</span> 終極密碼產生器
                </h3>
            </div>

            <div class="relative mb-6 group">
                <div id="pwOut" class="w-full p-4 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-2xl font-mono text-slate-800 tracking-wider break-all min-h-[4rem] flex items-center justify-center transition-colors group-hover:border-indigo-400">********</div>
                <button id="copyBtn" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" title="複製密碼">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                <div id="copyToast" class="absolute -top-10 right-0 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none shadow-lg">已複製！</div>
            </div>

            <div class="mb-6">
                <div class="flex justify-between text-sm mb-2 font-medium">
                    <span class="text-slate-500">密碼強度</span>
                    <span id="strengthText" class="text-slate-400">尚未產生</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div id="strengthBar" class="h-full w-0 transition-all duration-300"></div>
                </div>
            </div>

            <div class="space-y-5 mb-8">
                <div>
                    <div class="flex justify-between text-sm font-medium text-slate-700 mb-3">
                        <label for="pwLength">密碼長度</label>
                        <span id="lengthVal" class="text-indigo-600 font-bold text-lg bg-indigo-50 px-2 py-0.5 rounded-md">16</span>
                    </div>
                    <input type="range" id="pwLength" min="6" max="64" value="16" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
                </div>

                <div class="grid grid-cols-2 gap-3 mt-4">
                    <label class="flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <input type="checkbox" id="incUpper" checked class="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600 cursor-pointer">
                        <span class="text-sm font-medium text-slate-700">大寫 (A-Z)</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <input type="checkbox" id="incLower" checked class="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600 cursor-pointer">
                        <span class="text-sm font-medium text-slate-700">小寫 (a-z)</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <input type="checkbox" id="incNum" checked class="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600 cursor-pointer">
                        <span class="text-sm font-medium text-slate-700">數字 (0-9)</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <input type="checkbox" id="incSym" checked class="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 accent-indigo-600 cursor-pointer">
                        <span class="text-sm font-medium text-slate-700">符號 (!@#)</span>
                    </label>
                </div>
            </div>

            <button id="pwBtn" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新產生
            </button>
        </div>
    `;

    // 使用 requestAnimationFrame 確保 DOM 渲染完畢後綁定事件，避免 setTimeout 的潛在延遲或錯誤
    requestAnimationFrame(() => {
        // 取得 DOM 元素
        const pwOut = document.getElementById('pwOut');
        const pwBtn = document.getElementById('pwBtn');
        const copyBtn = document.getElementById('copyBtn');
        const copyToast = document.getElementById('copyToast');
        const pwLength = document.getElementById('pwLength');
        const lengthVal = document.getElementById('lengthVal');

        const chkUpper = document.getElementById('incUpper');
        const chkLower = document.getElementById('incLower');
        const chkNum = document.getElementById('incNum');
        const chkSym = document.getElementById('incSym');

        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        // 定義字元集
        const charSets = {
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lower: "abcdefghijklmnopqrstuvwxyz",
            num: "0123456789",
            sym: "!@#$%^&*()_+~[]{}:;?><,./-="
        };

        // 核心優化：使用密碼學安全的隨機數產生器 (取代不安全的 Math.random)
        const getSecureRandomInt = (max) => {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return array[0] % max;
        };

        // 核心優化：評估密碼強度邏輯
        const evaluateStrength = (password) => {
            let score = 0;
            if (!password) return { text: "尚未產生", color: "bg-slate-200", width: "w-0", textColor: "text-slate-400" };

            // 長度加分
            if (password.length >= 8) score += 1;
            if (password.length >= 12) score += 1;
            if (password.length >= 16) score += 1;

            // 複雜度加分
            if (/[A-Z]/.test(password)) score += 1;
            if (/[a-z]/.test(password)) score += 1;
            if (/[0-9]/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;

            // 依據總分回傳對應的樣式與文字
            if (score <= 3) return { text: "非常弱", color: "bg-red-500", width: "w-1/4", textColor: "text-red-500" };
            if (score <= 5) return { text: "普通", color: "bg-orange-500", width: "w-2/4", textColor: "text-orange-500" };
            if (score <= 6) return { text: "強", color: "bg-emerald-400", width: "w-3/4", textColor: "text-emerald-500" };
            return { text: "極強", color: "bg-emerald-600", width: "w-full", textColor: "text-emerald-600" };
        };

        // 產生密碼的主要邏輯
        const generatePassword = () => {
            let availableChars = "";
            let mandatoryChars = [];

            // 根據使用者選擇，準備可用的字元池與必備字元陣列
            if (chkUpper.checked) { availableChars += charSets.upper; mandatoryChars.push(charSets.upper); }
            if (chkLower.checked) { availableChars += charSets.lower; mandatoryChars.push(charSets.lower); }
            if (chkNum.checked) { availableChars += charSets.num; mandatoryChars.push(charSets.num); }
            if (chkSym.checked) { availableChars += charSets.sym; mandatoryChars.push(charSets.sym); }

            // 防呆機制：如果使用者取消勾選所有選項，強制勾選小寫字母
            if (availableChars === "") {
                chkLower.checked = true;
                availableChars += charSets.lower;
                mandatoryChars.push(charSets.lower);
            }

            const length = parseInt(pwLength.value, 10);
            let password = "";

            // 核心優化：確保每個被勾選的字元類型「至少」出現一次
            mandatoryChars.forEach(set => {
                password += set[getSecureRandomInt(set.length)];
            });

            // 補齊剩下的密碼長度
            for (let i = password.length; i < length; i++) {
                password += availableChars[getSecureRandomInt(availableChars.length)];
            }

            // 核心優化：將密碼打亂 (Fisher-Yates Shuffle 演算法)，避免必備字元總是出現在開頭
            let pwArray = password.split('');
            for (let i = pwArray.length - 1; i > 0; i--) {
                const j = getSecureRandomInt(i + 1);
                [pwArray[i], pwArray[j]] = [pwArray[j], pwArray[i]];
            }

            const finalPassword = pwArray.join('');
            pwOut.textContent = finalPassword;

            // 更新介面上的強度指示器
            const strength = evaluateStrength(finalPassword);
            strengthBar.className = `h-full transition-all duration-500 ${strength.color} ${strength.width}`;
            strengthText.textContent = strength.text;
            strengthText.className = `font-bold ${strength.textColor}`;
        };

        // 剪貼簿複製功能整合
        const copyToClipboard = async () => {
            const text = pwOut.textContent;
            if (text === "********" || !text) return;

            try {
                // 使用現代 Clipboard API
                await navigator.clipboard.writeText(text);

                // 顯示 Toast 提示
                copyToast.style.opacity = "1";
                copyToast.style.transform = "translateY(-5px)";
                setTimeout(() => {
                    copyToast.style.opacity = "0";
                    copyToast.style.transform = "translateY(0)";
                }, 2000);
            } catch (err) {
                // 降級處理：如果瀏覽器不支援，提醒使用者
                alert("複製失敗，請手動選取複製");
            }
        };

        // === 綁定所有互動事件 ===

        // 1. 拖曳滑桿時，即時更新數字與密碼
        pwLength.addEventListener('input', (e) => {
            lengthVal.textContent = e.target.value;
            generatePassword();
        });

        // 2. 任何 Checkbox 選項改變時，即時重新產生密碼
        [chkUpper, chkLower, chkNum, chkSym].forEach(chk => {
            chk.addEventListener('change', generatePassword);
        });

        // 3. 按鈕點擊事件
        pwBtn.addEventListener('click', generatePassword);
        copyBtn.addEventListener('click', copyToClipboard);

        // 初始化：畫面載入時自動產生第一組密碼
        generatePassword();
    });
};
