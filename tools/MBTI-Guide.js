window.render_mbtiGuide = function () {
    const data = {
        'INTJ': { name: '建築師', icon: '♟️', guide: '給予個人空間，不要過度控制細節。溝通時請直接切入重點，避免情緒化的表達。', taboo: '不要在專注時打擾他們，或強迫參與無意義的閒聊。', best: 'ENFP、ENTP' },
        'INTP': { name: '邏輯學家', icon: '🔬', guide: '欣賞他們的見解與創造力。給時間思考分析，與他們討論抽象理論會讓他們興奮。', taboo: '不要用傳統規則束縛他們，他們討厭盲從權威。', best: 'ENTJ、ESTJ' },
        'ENTJ': { name: '指揮官', icon: '🎯', guide: '展現自信和能力，他們欣賞強者。溝通要清晰有邏輯、講求效率。', taboo: '不要表現出優柔寡斷或推卸責任。', best: 'INTP、ISTP' },
        'ENTP': { name: '辯論家', icon: '💡', guide: '準備接受腦力激盪，不要把辯駁當人身攻擊。給予彈性和自由去探索新事物。', taboo: '不要試圖微觀管理，或強迫遵守枯燥的例行公事。', best: 'INTJ、INFJ' },
        'INFJ': { name: '提倡者', icon: '🕊️', guide: '真誠對待，他們能看穿虛偽。尊重隱私和個人時間，他們需要獨處充電。', taboo: '不要忽視他們的感受，或把善良視為理所當然。', best: 'ENFP、ENTP' },
        'INFP': { name: '調停者', icon: '🌸', guide: '肯定他們的獨特性，做忠實的傾聽者。給溫柔和包容，他們對批評敏感。', taboo: '不要侵犯個人界線，或用功利標準批判他們的夢想。', best: 'ENFJ、ENTJ' },
        'ENFJ': { name: '主人公', icon: '🌟', guide: '感謝他們對別人的付出，讓他們知道被重視。壓力大時給予情感支持。', taboo: '不要利用善良，或表現出過度冷漠和自私。', best: 'INFP、ISFP' },
        'ENFP': { name: '競選者', icon: '✨', guide: '多給予肯定和讚美，陪他們探索天馬行空的想法。給予自由空間。', taboo: '不要對點子潑冷水，或強迫專注於瑣碎細節。', best: 'INTJ、INFJ' },
        'ISTJ': { name: '物流師', icon: '📋', guide: '說到做到，保持可靠。溝通時提供具體事實和細節，給穩定的環境。', taboo: '不要不守承諾、遲到或頻繁改變計畫。', best: 'ESFP、ESTP' },
        'ISFJ': { name: '守衛者', icon: '🛡️', guide: '感謝他們默默的付出，主動體貼他們的負擔。在穩定溫馨的環境相處。', taboo: '不要把付出視為理所當然，或沒準備好時推向風口浪尖。', best: 'ESFP、ENFP' },
        'ESTJ': { name: '總經理', icon: '📊', guide: '展現責任感和效率。溝通要直接、具體、有建設性。遵守規則和約定。', taboo: '不要挑戰權威，或在工作中表現懶散不負責任。', best: 'ISTP、ISFP' },
        'ESFJ': { name: '執政官', icon: '🤝', guide: '互動並回應他們的熱情。讓他們參與生活，記住重要紀念日。', taboo: '不要拒絕善意，或當面批評他們重視的親友。', best: 'ISFP、ISTP' },
        'ISTP': { name: '鑒賞家', icon: '🛠️', guide: '給極大的自由和個人空間。溝通時少點感情用事，多點就事論事。', taboo: '不要過度逼問感受，或限制他們的自由。', best: 'ESTJ、ENTJ' },
        'ISFP': { name: '探險家', icon: '🎨', guide: '尊重他們的步調，不給壓力。用行動而非言語表達關心。', taboo: '不要充滿批判性，或強迫參與激烈的衝突。', best: 'ENFJ、ESFJ' },
        'ESTP': { name: '企業家', icon: '🚀', guide: '一起享受當下。溝通直接有趣，避免說教。欣賞解決問題的能力。', taboo: '不要用繁文縟節限制他們，或讓生活變得枯燥。', best: 'ISTJ、ISFJ' },
        'ESFP': { name: '表演者', icon: '🎭', guide: '做最忠實的觀眾，給予關注和讚美。及時行樂，不要給沉重壓力。', taboo: '不要掃他們的興，或進行嚴厲的道德說教。', best: 'ISTJ、ISFJ' }
    };
    const types = Object.keys(data);
    container.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-2xl border text-center">
            <h3 class="font-bold mb-4">🧠 MBTI 相處攻略</h3>
            <select id="mbtiSel" class="w-full p-3 border rounded-xl text-xl font-bold mb-6">
                ${types.map(t => `<option value="${t}">${t} — ${data[t].icon} ${data[t].name}</option>`).join('')}
            </select>
            <div id="mbtiRes" class="text-left space-y-3">
            </div>
        </div>
    `;
    const show = (type) => {
        const d = data[type];
        if (!d) return;
        document.getElementById('mbtiRes').innerHTML = `
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p class="text-xs font-bold text-indigo-400 mb-1">✅ 相處秘訣</p>
                <p class="text-[15px] text-indigo-800 leading-relaxed">${d.guide}</p>
            </div>
            <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p class="text-xs font-bold text-rose-400 mb-1">💣 絕對地雷</p>
                <p class="text-[15px] text-rose-800 leading-relaxed">${d.taboo}</p>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p class="text-xs font-bold text-slate-400 mb-0.5">💕 最佳拍檔</p>
                <p class="text-sm font-black text-slate-700">${d.best}</p>
            </div>
        `;
    };
    setTimeout(() => {
        document.getElementById('mbtiSel').onchange = (e) => show(e.target.value);
        show('INTJ');
    }, 0);
};
