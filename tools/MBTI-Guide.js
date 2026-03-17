window.render_mbtiGuide = function () {
    const data = { 'INTJ': '給予個人空間，不要過度控制細節。', 'ENFP': '多給予肯定，陪他們探索天馬行空的想法。' };
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🧠 MBTI 相處攻略</h3>
            <select id="mbtiSel" class="w-full p-3 border rounded-xl text-xl font-bold mb-6">
                <option>INTJ</option><option>ENFP</option><option>INFJ</option><option>ESTP</option>
            </select>
            <div class="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 italic text-indigo-800" id="mbtiRes">
                給予個人空間，不要過度控制細節。
            </div>
        </div>
    `;
    setTimeout(() => {
        document.getElementById('mbtiSel').onchange = (e) => {
            document.getElementById('mbtiRes').textContent = data[e.target.value] || "攻略整理中，請尊重彼此差異！";
        };
    }, 0);
};