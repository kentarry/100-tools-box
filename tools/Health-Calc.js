window.render_healthCalc = function () {
    // 建立專屬的容器範圍，避免污染全域
    container.innerHTML = `
        <div class="health-calc-wrapper w-full max-w-md mx-auto bg-white p-5 rounded-2xl border border-gray-200 shadow-sm font-sans text-gray-800">
            <h3 class="text-lg font-bold mb-4 text-gray-900 border-b pb-2">🥗 體態與熱量 (BMI & TDEE) 計算</h3>

            <div class="space-y-4 mb-6 text-sm">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-600 mb-1 font-medium">性別</label>
                        <select class="calc-gender w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                            <option value="male">男性</option>
                            <option value="female">女性</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-600 mb-1 font-medium">年齡</label>
                        <input type="number" class="calc-age w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" value="25" min="15" max="100">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-600 mb-1 font-medium">身高 (cm)</label>
                        <input type="number" class="calc-height w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" value="170" min="100" max="250">
                    </div>
                    <div>
                        <label class="block text-gray-600 mb-1 font-medium">體重 (kg)</label>
                        <input type="number" class="calc-weight w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" value="65" min="30" max="200">
                    </div>
                </div>

                <div>
                    <label class="block text-gray-600 mb-1 font-medium">日常活動量</label>
                    <select class="calc-activity w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                        <option value="1.2">無活動 (久坐、幾乎沒運動)</option>
                        <option value="1.375" selected>輕度活動 (每週運動1-3天)</option>
                        <option value="1.55">中度活動 (每週運動3-5天)</option>
                        <option value="1.725">高度活動 (每週運動6-7天)</option>
                        <option value="1.9">極度活動 (勞力工作或高強度訓練)</option>
                    </select>
                </div>
            </div>

            <div class="bg-slate-900 text-white p-5 rounded-xl space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="text-left">
                        <p class="text-xs text-slate-400 mb-1">身體質量指數 (BMI)</p>
                        <p class="text-2xl font-bold calc-bmi-val">--</p>
                    </div>
                    <div class="text-right">
                        <span class="calc-bmi-status px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">計算中</span>
                    </div>
                </div>
                <div>
                    <p class="text-xs text-slate-400 mb-1">每日總消耗熱量 (TDEE)</p>
                    <div class="flex items-baseline gap-2">
                        <p class="calc-tdee-val text-4xl font-black text-blue-400">--</p>
                        <p class="text-sm text-slate-400">kcal / 天</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        // 使用 wrapper 限制搜尋範圍，絕對不會影響到其他工具的 input
        const wrapper = container.querySelector('.health-calc-wrapper');
        if (!wrapper) return;

        const inputs = wrapper.querySelectorAll('input, select');
        const elGender = wrapper.querySelector('.calc-gender');
        const elAge = wrapper.querySelector('.calc-age');
        const elHeight = wrapper.querySelector('.calc-height');
        const elWeight = wrapper.querySelector('.calc-weight');
        const elActivity = wrapper.querySelector('.calc-activity');

        const outBmi = wrapper.querySelector('.calc-bmi-val');
        const outBmiStatus = wrapper.querySelector('.calc-bmi-status');
        const outTdee = wrapper.querySelector('.calc-tdee-val');

        function calc() {
            const gender = elGender.value;
            const age = parseFloat(elAge.value) || 0;
            const height = parseFloat(elHeight.value) || 0;
            const weight = parseFloat(elWeight.value) || 0;
            const activity = parseFloat(elActivity.value) || 1.2;

            // 防呆機制：如果身高體重沒填完整就不計算
            if (height <= 0 || weight <= 0) return;

            // --- 1. 計算 BMI ---
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            outBmi.textContent = bmi.toFixed(1);

            // BMI 狀態判定顏色
            let statusText = "正常";
            let statusColor = "bg-green-500/20 text-green-400";
            if (bmi < 18.5) {
                statusText = "過輕";
                statusColor = "bg-blue-500/20 text-blue-400";
            } else if (bmi >= 24 && bmi < 27) {
                statusText = "過重";
                statusColor = "bg-yellow-500/20 text-yellow-400";
            } else if (bmi >= 27) {
                statusText = "肥胖";
                statusColor = "bg-red-500/20 text-red-400";
            }
            outBmiStatus.textContent = statusText;
            outBmiStatus.className = `calc-bmi-status px-3 py-1 rounded-full text-xs font-medium ${statusColor}`;

            // --- 2. 計算 TDEE (Mifflin-St Jeor 公式) ---
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            bmr += (gender === 'male') ? 5 : -161; // 男女常數差異

            const tdee = bmr * activity;
            // 加入 toLocaleString() 讓數字有千位撇號 (e.g. 2,100)
            outTdee.textContent = Math.round(tdee).toLocaleString();
        }

        // 監聽所有輸入框與下拉選單的變更
        inputs.forEach(input => {
            input.addEventListener('input', calc);
        });

        // 啟動時先算一次預設值
        calc();
    }, 0);
};
