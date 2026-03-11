window.render_ruler = function () {
    container.innerHTML = `
        <div class="h-[400px] border-2 border-dashed border-slate-200 relative bg-slate-50 rounded-xl overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-8 bg-slate-800 text-white text-[10px] flex items-center px-2">0px --- 100px --- 200px --- 300px (水平刻度模擬)</div>
            <div class="absolute top-0 left-0 w-8 h-full bg-slate-700 text-white text-[10px] [writing-mode:vertical-lr] flex items-center py-2">0px --- 100px --- 200px (垂直刻度)</div>
        </div>
    `;
};