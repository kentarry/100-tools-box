window.render_colorLighten = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-all">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-extrabold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <span class="text-3xl">🎨</span> 玩轉顏色亮度
                </h3>
                <p class="text-gray-500 text-sm">選擇一個你喜歡的顏色，看看它變亮與變暗的樣子吧！</p>
            </div>

            <div class="relative mb-8 group">
                <input type="color" id="clColor" value="#3b82f6" 
                    class="w-full h-16 rounded-xl cursor-pointer shadow-sm border-2 border-gray-200 hover:border-blue-400 transition-colors bg-transparent p-1">
            </div>

            <div class="flex gap-4 justify-between items-end">
                <div class="flex flex-col items-center flex-1">
                    <div id="clDark" class="w-full h-20 rounded-2xl shadow-inner transition-colors duration-300"></div>
                    <span class="mt-3 text-xs font-semibold text-gray-500">-30% 較暗</span>
                </div>
                
                <div class="flex flex-col items-center flex-1">
                    <div id="clBase" class="w-full h-24 rounded-2xl shadow-md transform transition-colors duration-300 ring-4 ring-gray-50"></div>
                    <span class="mt-3 text-sm font-bold text-gray-800">原始顏色</span>
                </div>
                
                <div class="flex flex-col items-center flex-1">
                    <div id="clLight" class="w-full h-20 rounded-2xl shadow-inner transition-colors duration-300"></div>
                    <span class="mt-3 text-xs font-semibold text-gray-500">+30% 較亮</span>
                </div>
            </div>
        </div>
    `;

    // 確保 DOM 渲染完畢後再綁定事件
    setTimeout(() => {
        const colorInput = document.getElementById('clColor');
        const clBase = document.getElementById('clBase');
        const clDark = document.getElementById('clDark');
        const clLight = document.getElementById('clLight');

        const updateColors = (color) => {
            clBase.style.backgroundColor = color;

            clDark.style.backgroundColor = color;
            clDark.style.filter = 'brightness(0.7)';

            clLight.style.backgroundColor = color;
            clLight.style.filter = 'brightness(1.3)';
        };

        // 綁定 input 事件 (當使用者拖曳調色盤時即時觸發)
        colorInput.oninput = (e) => updateColors(e.target.value);

        // 初始化第一次的顏色
        updateColors(colorInput.value);
    }, 0);
};
