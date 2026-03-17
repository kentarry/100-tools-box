window.render_trashReminder = function () {
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
            <h3 class="font-bold mb-4">🚛 我的丟垃圾清單</h3>
            <div class="space-y-2" id="trashList">
                <div class="flex justify-between p-3 bg-slate-50 rounded-lg"><span>週一：一般、廚餘、資源回收</span><input type="checkbox"></div>
                <div class="flex justify-between p-3 bg-slate-50 rounded-lg"><span>週二：一般、廚餘</span><input type="checkbox"></div>
                <div class="flex justify-between p-3 bg-slate-50 rounded-lg"><span>週三：❌ 停收</span></div>
                <div class="flex justify-between p-3 bg-slate-50 rounded-lg"><span>週四：一般、廚餘、資源回收</span><input type="checkbox"></div>
            </div>
            <p class="text-[10px] text-slate-400 mt-4 text-center italic">勾選代表今日已處理，網頁不關閉可追蹤進度。</p>
        </div>
    `;
};