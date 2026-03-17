window.render_mathReference = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm space-y-4 text-sm">
            <h3 class="font-bold text-center border-b pb-2 text-lg">📐 常用幾何公式</h3>
            <div class="flex justify-between"><span>圓面積：</span><span class="font-mono italic">πr²</span></div>
            <div class="flex justify-between"><span>圓周長：</span><span class="font-mono italic">2πr</span></div>
            <div class="flex justify-between"><span>畢氏定理：</span><span class="font-mono italic">a² + b² = c²</span></div>
            <div class="flex justify-between"><span>球體體積：</span><span class="font-mono italic">(4/3)πr³</span></div>
        </div>
    `;
};