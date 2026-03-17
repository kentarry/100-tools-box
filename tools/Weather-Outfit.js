window.render_weatherOutfit = function () {
    const trends = window._outfitTrends || [];
    const colorMap = {
        black:'#1a1a1a',white:'#f5f5f5',navy:'#1e3a5f',gray:'#6b7280',beige:'#d4c5a9',brown:'#7c5e3c',
        olive:'#556b2f',wine:'#722f37',pink:'#e8a0bf',sky:'#87ceeb',cream:'#f5e6c8',denim:'#4a6d8c',
        camel:'#c19a6b',lavender:'#b4a7d6',sage:'#9caf88',coral:'#f08080'
    };
    const colorNames = {
        black:'黑色',white:'白色',navy:'海軍藍',gray:'灰色',beige:'米色',brown:'棕色',olive:'橄欖綠',
        wine:'酒紅',pink:'粉色',sky:'天空藍',cream:'奶油色',denim:'丹寧藍',camel:'駝色',lavender:'薰衣草紫',sage:'鼠尾草綠',coral:'珊瑚色'
    };

    function tempToSeason(t) { if (t >= 28) return 'summer'; if (t >= 20) return 'spring'; if (t >= 12) return 'autumn'; return 'winter'; }

    container.innerHTML = `
        <div class="w-full max-w-3xl mx-auto font-sans">
            <div class="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl p-5 sm:p-6 mb-5 shadow-lg">
                <h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2"><span class="text-3xl">👗</span> 穿搭建議 & 虛擬試穿</h3>
                <p class="text-pink-100 text-sm mt-1">天氣穿搭建議 ・ SVG 人偶換裝 ・ ${trends.length} 組流行穿搭靈感</p>
            </div>
            <div class="flex gap-2 mb-4">
                <button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-violet-500 bg-violet-50 text-violet-700 shadow-sm" data-tab="weather">☀️ 天氣穿搭</button>
                <button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-tab="avatar">👤 虛擬試穿</button>
                <button class="wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-tab="trends">✨ 穿搭靈感</button>
            </div>

            <!-- 天氣穿搭 -->
            <div id="wo-weather-panel" class="wo-panel">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">
                    <div class="flex flex-col sm:flex-row gap-4 items-center mb-4">
                        <div class="flex items-center gap-3 flex-1">
                            <span class="text-sm font-bold text-slate-500">🌡️</span>
                            <button id="wo-tm" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 font-bold transition active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer">−</button>
                            <span id="wo-temp" class="text-3xl font-extrabold text-slate-800 w-12 text-center tabular-nums">25</span>
                            <span class="text-sm text-slate-400">°C</span>
                            <button id="wo-tp" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 font-bold transition active:scale-90 flex items-center justify-center border border-slate-200 cursor-pointer">+</button>
                        </div>
                        <button id="wo-loc" class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold cursor-pointer hover:shadow-md transition active:scale-95 whitespace-nowrap">📍 自動定位</button>
                    </div>
                    <div id="wo-winfo" class="text-xs text-slate-400 text-center hidden mb-3"></div>
                    <div class="flex gap-2">
                        <button id="wo-gm" class="wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 border-blue-400 bg-blue-50 text-blue-700" data-g="male">🚹 男生</button>
                        <button id="wo-gf" class="wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 border-slate-200 bg-white text-slate-500" data-g="female">🚺 女生</button>
                    </div>
                </div>
                <div id="wo-wresults" class="space-y-3 mb-4"></div>
            </div>

            <!-- 虛擬試穿 -->
            <div id="wo-avatar-panel" class="wo-panel hidden">
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col items-center sm:w-56 flex-shrink-0">
                        <div class="text-sm font-bold text-slate-500 mb-2 self-start">👤 預覽</div>
                        <div id="av-svg" class="w-44 h-80"></div>
                        <div id="av-sum" class="text-xs text-slate-400 mt-2 text-center"></div>
                    </div>
                    <div class="flex-1 space-y-3" id="av-controls">
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div class="text-xs font-bold text-slate-400 mb-2">體型</div>
                            <div class="flex gap-2 mb-3">
                                <button class="av-bd flex-1 py-2 rounded-lg text-xs font-bold border-2 border-blue-400 bg-blue-50 text-blue-700 cursor-pointer transition" data-b="male">🚹 男生</button>
                                <button class="av-bd flex-1 py-2 rounded-lg text-xs font-bold border-2 border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-b="female">🚺 女生</button>
                            </div>
                            <div class="flex items-center gap-2 mb-2"><span class="text-xs text-slate-500 w-8">身高</span><input type="range" id="av-ht" min="150" max="195" value="170" class="flex-1 accent-violet-500"><span id="av-htv" class="text-xs font-bold text-slate-600 w-12 text-right">170cm</span></div>
                            <div class="flex items-center gap-2"><span class="text-xs text-slate-500 w-8">體重</span><input type="range" id="av-wt" min="40" max="120" value="60" class="flex-1 accent-violet-500"><span id="av-wtv" class="text-xs font-bold text-slate-600 w-12 text-right">60kg</span></div>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div class="text-xs font-bold text-slate-400 mb-2">膚色</div>
                            <div class="flex gap-2" id="av-skins"></div>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div class="text-xs font-bold text-slate-400 mb-2">👕 上衣</div>
                            <select id="av-top" class="w-full p-2 border rounded-lg text-sm mb-2"></select>
                            <div class="text-xs text-slate-400 mb-1">顏色</div>
                            <div class="flex gap-1.5 flex-wrap" id="av-tc"></div>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div class="text-xs font-bold text-slate-400 mb-2">👖 下身</div>
                            <select id="av-bot" class="w-full p-2 border rounded-lg text-sm mb-2"></select>
                            <div class="text-xs text-slate-400 mb-1">顏色</div>
                            <div class="flex gap-1.5 flex-wrap" id="av-bc"></div>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                            <div class="text-xs font-bold text-slate-400 mb-2">✨ 配件（多選）</div>
                            <div class="flex flex-wrap gap-1.5" id="av-acc"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 穿搭靈感 -->
            <div id="wo-trends-panel" class="wo-panel hidden">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
                    <div class="flex flex-wrap gap-1.5">
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-violet-400 bg-violet-50 text-violet-700 cursor-pointer transition" data-f="all">全部</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="spring">🌸 春</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="summer">☀️ 夏</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="autumn">🍂 秋</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="winter">❄️ 冬</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="male">🚹 男</button>
                        <button class="wo-tf px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-500 cursor-pointer transition" data-f="female">🚺 女</button>
                    </div>
                </div>
                <div id="wo-tresults" class="space-y-3 mb-4"></div>
            </div>
        </div>`;

    setTimeout(() => {
        let temp = 25, wGender = 'male', avBody = 'male', avHt = 170, avWt = 60;
        let avSkin = '#deb887', avTopT = 'tee', avTopC = '#f5f5f5', avBotT = 'jeans', avBotC = '#4a6d8c';
        const avAcc = new Set();
        let tFilter = 'all';
        const skins = [{n:'淺膚',h:'#fde7c5'},{n:'自然',h:'#deb887'},{n:'健康',h:'#c4956a'},{n:'古銅',h:'#a0764f'},{n:'深膚',h:'#6b4423'}];
        const tops = [
            {id:'tee',n:'T恤',i:'👕'},{id:'polo',n:'POLO衫',i:'👔'},{id:'shirt',n:'襯衫',i:'👔'},
            {id:'hoodie',n:'帽T',i:'🧥'},{id:'sweater',n:'毛衣',i:'🧶'},{id:'cardigan',n:'針織外套',i:'🧥'},
            {id:'jacket',n:'夾克',i:'🧥'},{id:'coat',n:'大衣',i:'🧥'},{id:'puffer',n:'羽絨外套',i:'🧥'},
            {id:'blazer',n:'西裝外套',i:'🤵'},{id:'tank',n:'背心',i:'🎽'},{id:'crop',n:'短版上衣',i:'👚'},
            {id:'blouse',n:'雪紡上衣',i:'👚'},{id:'denim-j',n:'牛仔外套',i:'🧥'},{id:'windbreaker',n:'風衣',i:'🧥'}
        ];
        const bots = [
            {id:'jeans',n:'牛仔褲',i:'👖'},{id:'shorts',n:'短褲',i:'🩳'},{id:'chinos',n:'卡其褲',i:'👖'},
            {id:'sweats',n:'運動褲',i:'👖'},{id:'dress-p',n:'西裝褲',i:'👖'},{id:'skirt',n:'短裙',i:'👗'},
            {id:'long-sk',n:'長裙',i:'👗'},{id:'leggings',n:'內搭褲',i:'👖'},{id:'wide',n:'寬褲',i:'👖'},
            {id:'cargo',n:'工裝褲',i:'👖'},{id:'dress',n:'洋裝',i:'👗'}
        ];
        const accs = [
            {id:'cap',n:'棒球帽',i:'🧢'},{id:'bucket',n:'漁夫帽',i:'🎩'},{id:'beanie',n:'毛帽',i:'🧶'},
            {id:'sunglasses',n:'墨鏡',i:'🕶️'},{id:'necklace',n:'項鍊',i:'📿'},{id:'watch',n:'手錶',i:'⌚'},
            {id:'scarf',n:'圍巾',i:'🧣'},{id:'tote',n:'托特包',i:'👜'},{id:'backpack',n:'後背包',i:'🎒'},
            {id:'earrings',n:'耳環',i:'💎'},{id:'bracelet',n:'手鏈',i:'📿'},{id:'belt',n:'皮帶',i:'🪢'}
        ];
        const allColors = Object.entries(colorMap).map(([id, hex]) => ({id, hex, name: colorNames[id]}));

        // Tab switching
        document.querySelectorAll('.wo-tab').forEach(b => b.addEventListener('click', () => {
            const t = b.dataset.tab;
            document.querySelectorAll('.wo-tab').forEach(x => x.className = 'wo-tab flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 ' + (x.dataset.tab === t ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500'));
            document.querySelectorAll('.wo-panel').forEach(p => p.classList.add('hidden'));
            document.getElementById('wo-' + t + '-panel').classList.remove('hidden');
        }));

        // === WEATHER ===
        const tD = document.getElementById('wo-temp');
        document.getElementById('wo-tm').addEventListener('click', () => { if (temp > -10) { temp--; tD.textContent = temp; renderW(); } });
        document.getElementById('wo-tp').addEventListener('click', () => { if (temp < 45) { temp++; tD.textContent = temp; renderW(); } });

        document.querySelectorAll('.wo-gbtn').forEach(b => b.addEventListener('click', () => {
            wGender = b.dataset.g;
            document.getElementById('wo-gm').className = 'wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 ' + (wGender === 'male' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500');
            document.getElementById('wo-gf').className = 'wo-gbtn flex-1 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer border-2 ' + (wGender === 'female' ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-slate-200 bg-white text-slate-500');
            renderW();
        }));

        document.getElementById('wo-loc').addEventListener('click', () => {
            const btn = document.getElementById('wo-loc');
            btn.textContent = '⏳ 定位中...';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(p => {
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude.toFixed(2)}&longitude=${p.coords.longitude.toFixed(2)}&current_weather=true&timezone=auto`)
                        .then(r => r.json()).then(d => {
                            temp = Math.round(d.current_weather.temperature);
                            tD.textContent = temp;
                            document.getElementById('wo-winfo').classList.remove('hidden');
                            document.getElementById('wo-winfo').textContent = `📍 即時氣溫 ${temp}°C ・ 風速 ${d.current_weather.windspeed} km/h`;
                            btn.textContent = '📍 自動定位';
                            renderW();
                        }).catch(() => { btn.textContent = '❌ 失敗'; });
                }, () => { btn.textContent = '❌ 定位被拒'; });
            }
        });

        function renderW() {
            const s = tempToSeason(temp);
            const sn = {spring:'春天',summer:'夏天',autumn:'秋天',winter:'冬天'}[s];
            const si = {spring:'🌸',summer:'☀️',autumn:'🍂',winter:'❄️'}[s];
            const matches = trends.filter(t => t.s === s && t.g === wGender);
            let basicAdv = '';
            if (temp >= 30) basicAdv = '天氣炎熱 🔥 建議穿著輕薄透氣衣物，注意防曬';
            else if (temp >= 25) basicAdv = '天氣溫暖 ☀️ 短袖搭薄長褲或短褲都合適';
            else if (temp >= 20) basicAdv = '氣溫舒適 🌤️ 可搭配薄外套早晚備用';
            else if (temp >= 15) basicAdv = '微涼天氣 🌥️ 建議穿長袖加外套';
            else if (temp >= 10) basicAdv = '天氣偏冷 🌧️ 需要毛衣和厚外套';
            else basicAdv = '天氣寒冷 ❄️ 請穿羽絨衣保暖，搭配圍巾帽子';
            const bg = {summer:'from-orange-50 to-yellow-50',winter:'from-blue-50 to-indigo-50',autumn:'from-amber-50 to-orange-50',spring:'from-green-50 to-emerald-50'}[s];
            const bd = {summer:'border-orange-100',winter:'border-blue-100',autumn:'border-amber-100',spring:'border-green-100'}[s];
            let html = `<div class="bg-gradient-to-r ${bg} rounded-2xl p-5 border ${bd}"><div class="flex items-center gap-2 mb-1"><span class="text-2xl">${si}</span><span class="text-lg font-bold text-slate-800">${temp}°C — ${sn}穿搭建議</span></div><p class="text-sm text-slate-600">${basicAdv}</p></div>`;
            html += `<div class="text-xs font-bold text-slate-400 mt-3 mb-2">🔥 共 ${matches.length} 組推薦（依人氣排序）</div>`;
            matches.forEach(a => { html += trendCard(a); });
            document.getElementById('wo-wresults').innerHTML = html;
        }

        function trendCard(a) {
            const dots = (a.c || []).map(c => `<span class="inline-block w-4 h-4 rounded-full border border-slate-200 flex-shrink-0" style="background:${colorMap[c]||'#ccc'}" title="${colorNames[c]||c}"></span>`).join('');
            const stars = '🔥'.repeat(Math.min(a.pop, 5));
            return `<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
                <div class="flex items-start justify-between mb-1"><div class="text-base font-bold text-slate-800">${a.t}</div><div class="text-xs text-slate-300 whitespace-nowrap">${stars}</div></div>
                <div class="text-xs text-slate-400 mb-2">${a.style} 風格 ・ ${a.g === 'male' ? '🚹 男' : '🚺 女'}</div>
                <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3"><div class="text-sm font-medium text-slate-700">📦 ${a.items}</div></div>
                <p class="text-sm text-slate-600 mb-2">${a.d}</p>
                <div class="flex items-center gap-1.5"><span class="text-xs text-slate-400">配色：</span>${dots}</div>
            </div>`;
        }

        // === AVATAR ===
        // Skin
        const skC = document.getElementById('av-skins');
        skins.forEach(s => {
            const b = document.createElement('button');
            b.className = `w-8 h-8 rounded-full border-2 cursor-pointer transition active:scale-90 ${s.h === avSkin ? 'border-violet-500 ring-2 ring-violet-300' : 'border-slate-200'}`;
            b.style.background = s.h; b.title = s.n;
            b.addEventListener('click', () => { avSkin = s.h; skC.querySelectorAll('button').forEach(x => x.className = `w-8 h-8 rounded-full border-2 cursor-pointer transition active:scale-90 ${x.style.backgroundColor === s.h ? 'border-violet-500 ring-2 ring-violet-300' : 'border-slate-200'}`); drawAvatar(); });
            skC.appendChild(b);
        });

        // Top/Bottom selects
        const topSel = document.getElementById('av-top'), botSel = document.getElementById('av-bot');
        tops.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.i + ' ' + t.n; topSel.appendChild(o); });
        bots.forEach(b => { const o = document.createElement('option'); o.value = b.id; o.textContent = b.i + ' ' + b.n; botSel.appendChild(o); });
        topSel.addEventListener('change', () => { avTopT = topSel.value; drawAvatar(); });
        botSel.addEventListener('change', () => { avBotT = botSel.value; drawAvatar(); });

        // Color pickers
        function colorPicker(elId, get, set) {
            const el = document.getElementById(elId);
            function render() {
                el.innerHTML = '';
                allColors.forEach(c => {
                    const b = document.createElement('button');
                    b.className = `w-6 h-6 rounded-full border-2 cursor-pointer transition active:scale-90 ${c.hex === get() ? 'border-violet-500 ring-2 ring-violet-200' : 'border-slate-200'}`;
                    b.style.background = c.hex; b.title = c.name; b.dataset.hex = c.hex;
                    el.appendChild(b);
                });
            }
            el.addEventListener('click', e => {
                const b = e.target.closest('button');
                if (b && b.dataset.hex) { set(b.dataset.hex); render(); drawAvatar(); }
            });
            render();
        }
        colorPicker('av-tc', () => avTopC, h => { avTopC = h; });
        colorPicker('av-bc', () => avBotC, h => { avBotC = h; });

        // Body
        document.querySelectorAll('.av-bd').forEach(b => b.addEventListener('click', () => {
            avBody = b.dataset.b;
            document.querySelectorAll('.av-bd').forEach(x => x.className = `av-bd flex-1 py-2 rounded-lg text-xs font-bold border-2 cursor-pointer transition ${x.dataset.b === avBody ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'}`);
            drawAvatar();
        }));

        // Height & Weight
        document.getElementById('av-ht').addEventListener('input', e => { avHt = +e.target.value; document.getElementById('av-htv').textContent = avHt + 'cm'; drawAvatar(); });
        document.getElementById('av-wt').addEventListener('input', e => { avWt = +e.target.value; document.getElementById('av-wtv').textContent = avWt + 'kg'; drawAvatar(); });

        // Accessories
        const accC = document.getElementById('av-acc');
        accs.forEach(a => {
            const b = document.createElement('button');
            b.className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 cursor-pointer transition active:scale-95 hover:bg-violet-50';
            b.textContent = a.i + ' ' + a.n;
            b.addEventListener('click', () => {
                if (avAcc.has(a.id)) { avAcc.delete(a.id); b.className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 cursor-pointer transition active:scale-95 hover:bg-violet-50'; }
                else { avAcc.add(a.id); b.className = 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-violet-400 bg-violet-100 text-violet-700 cursor-pointer transition active:scale-95 ring-1 ring-violet-300'; }
                drawAvatar();
            });
            accC.appendChild(b);
        });

        function drawAvatar() {
            const el = document.getElementById('av-svg');
            const fem = avBody === 'female';
            const cx = 100;
            // Weight factor: 0 = very slim, 1 = heavy
            const wFactor = (avWt - 40) / 80;
            const headR = 18;
            const headY = 32;
            const neckW = fem ? 5 : 6;
            const neckY = headY + headR;
            const neckH = 8;
            // Body widths scaled by weight
            const baseSW = fem ? 22 : 26;
            const baseWW = fem ? 16 : 22;
            const baseHW = fem ? 22 : 22;
            const shoulderW = baseSW + Math.round(wFactor * 12);
            const waistW = baseWW + Math.round(wFactor * 14);
            const hipW = baseHW + Math.round(wFactor * 12);
            const torsoTop = neckY + neckH;
            const torsoH = 60;
            const torsoBot = torsoTop + torsoH;
            const armW = 5 + Math.round(wFactor * 3);
            const legW = 7 + Math.round(wFactor * 5);
            const legH = 80 + Math.round((avHt - 150) * 1.3);
            const legBot = torsoBot + legH;
            const totalH = legBot + 14;
            const longSleeve = ['hoodie','sweater','cardigan','jacket','coat','puffer','blazer','windbreaker','shirt','blouse','denim-j'].includes(avTopT);
            const isCoat = ['coat','puffer'].includes(avTopT);
            const armLen = longSleeve ? torsoH + 10 : torsoH * 0.35;
            const isSkirt = ['skirt','long-sk','dress'].includes(avBotT);
            const isShort = ['shorts','skirt'].includes(avBotT);
            const bLen = isShort ? legH * 0.3 : (avBotT === 'long-sk' || avBotT === 'dress') ? legH * 0.85 : legH * 0.92;
            const armTopY = torsoTop + 2;
            const darken = c => { const d = document.createElement('canvas'); d.width = 1; d.height = 1; return c; };
            let svg = '';
            // Female hair behind
            if (fem) {
                svg += `<path d="M${cx-16} ${headY} Q${cx-20} ${headY+headR+20} ${cx-14} ${torsoTop+16}" stroke="#3a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
                svg += `<path d="M${cx+16} ${headY} Q${cx+20} ${headY+headR+20} ${cx+14} ${torsoTop+16}" stroke="#3a2a1a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
            }
            // ---- LEGS (skin visible below clothing) ----
            const skinTop = torsoBot + bLen;
            if (skinTop < legBot) {
                svg += `<rect x="${cx-legW-3}" y="${skinTop}" width="${legW}" height="${legBot-skinTop}" rx="3" fill="${avSkin}"/>`;
                svg += `<rect x="${cx+3}" y="${skinTop}" width="${legW}" height="${legBot-skinTop}" rx="3" fill="${avSkin}"/>`;
            }
            // Shoes
            svg += `<ellipse cx="${cx-legW/2-1}" cy="${legBot+3}" rx="10" ry="5" fill="#2a2a2a"/><path d="M${cx-legW/2-9} ${legBot+1} L${cx-legW/2+7} ${legBot+1}" stroke="#444" stroke-width="1"/>`;
            svg += `<ellipse cx="${cx+legW/2+1}" cy="${legBot+3}" rx="10" ry="5" fill="#2a2a2a"/><path d="M${cx+legW/2-7} ${legBot+1} L${cx+legW/2+9} ${legBot+1}" stroke="#444" stroke-width="1"/>`;
            // ---- BOTTOM CLOTHING ----
            if (isSkirt) {
                const skW = hipW + 8;
                svg += `<path d="M${cx-waistW} ${torsoBot} Q${cx-skW} ${torsoBot+bLen*0.6} ${cx-skW-3} ${torsoBot+bLen} L${cx+skW+3} ${torsoBot+bLen} Q${cx+skW} ${torsoBot+bLen*0.6} ${cx+waistW} ${torsoBot} Z" fill="${avBotC}"/>`;
                // Pleats
                for (let i = -2; i <= 2; i++) svg += `<line x1="${cx+i*8}" y1="${torsoBot+5}" x2="${cx+i*10}" y2="${torsoBot+bLen-2}" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`;
                // Waistband
                svg += `<rect x="${cx-waistW}" y="${torsoBot}" width="${waistW*2}" height="4" rx="2" fill="${avBotC}" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>`;
            } else {
                // Pants - two legs
                const lx1 = cx - waistW, lx2 = cx + waistW;
                const crotchY = torsoBot + 18 + Math.round(wFactor * 5);
                const wide = avBotT === 'wide' || avBotT === 'cargo';
                const legEndW = wide ? legW + 5 : avBotT === 'leggings' ? legW - 1 : legW + 1;
                svg += `<path d="M${lx1} ${torsoBot} L${cx-legEndW-2} ${torsoBot+bLen} L${cx-2} ${torsoBot+bLen} L${cx} ${crotchY} L${cx+2} ${torsoBot+bLen} L${cx+legEndW+2} ${torsoBot+bLen} L${lx2} ${torsoBot} Z" fill="${avBotC}"/>`;
                // Waistband
                svg += `<rect x="${lx1}" y="${torsoBot}" width="${waistW*2}" height="4" rx="2" fill="${avBotC}" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>`;
                // Jeans details
                if (avBotT === 'jeans') {
                    svg += `<line x1="${cx-waistW+4}" y1="${torsoBot+6}" x2="${cx-legEndW}" y2="${torsoBot+bLen-3}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
                    svg += `<line x1="${cx+waistW-4}" y1="${torsoBot+6}" x2="${cx+legEndW}" y2="${torsoBot+bLen-3}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
                    // Pockets
                    svg += `<path d="M${cx-waistW+2} ${torsoBot+5} L${cx-waistW+8} ${torsoBot+14} L${cx-waistW+2} ${torsoBot+14}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>`;
                    svg += `<path d="M${cx+waistW-2} ${torsoBot+5} L${cx+waistW-8} ${torsoBot+14} L${cx+waistW-2} ${torsoBot+14}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>`;
                    // Fly
                    svg += `<line x1="${cx}" y1="${torsoBot+4}" x2="${cx}" y2="${crotchY-2}" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>`;
                }
                if (avBotT === 'cargo') {
                    // Cargo pockets
                    svg += `<rect x="${cx-legEndW}" y="${torsoBot+bLen*0.4}" width="8" height="10" rx="1" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>`;
                    svg += `<rect x="${cx+legEndW-8}" y="${torsoBot+bLen*0.4}" width="8" height="10" rx="1" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>`;
                }
                if (avBotT === 'dress-p') {
                    // Crease lines
                    svg += `<line x1="${cx-6}" y1="${torsoBot+8}" x2="${cx-6}" y2="${torsoBot+bLen-5}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>`;
                    svg += `<line x1="${cx+6}" y1="${torsoBot+8}" x2="${cx+6}" y2="${torsoBot+bLen-5}" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>`;
                }
                if (avBotT === 'sweats') {
                    // Drawstring + cuffs
                    svg += `<path d="M${cx-3} ${torsoBot+2} L${cx-5} ${torsoBot+10}" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>`;
                    svg += `<path d="M${cx+3} ${torsoBot+2} L${cx+5} ${torsoBot+10}" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>`;
                    svg += `<rect x="${cx-legEndW-2}" y="${torsoBot+bLen-4}" width="${legEndW+2}" height="4" rx="2" fill="rgba(0,0,0,0.06)"/>`;
                    svg += `<rect x="${cx}" y="${torsoBot+bLen-4}" width="${legEndW+2}" height="4" rx="2" fill="rgba(0,0,0,0.06)"/>`;
                }
            }
            // ---- SKIN: NECK ----
            svg += `<rect x="${cx-neckW}" y="${neckY}" width="${neckW*2}" height="${neckH}" rx="3" fill="${avSkin}"/>`;
            // ---- ARMS SKIN (if short sleeve) ----
            if (!longSleeve) {
                svg += `<rect x="${cx-shoulderW-armW}" y="${armTopY+armLen}" width="${armW}" height="${torsoH-armLen+10}" rx="${armW/2}" fill="${avSkin}"/>`;
                svg += `<rect x="${cx+shoulderW}" y="${armTopY+armLen}" width="${armW}" height="${torsoH-armLen+10}" rx="${armW/2}" fill="${avSkin}"/>`;
            }
            // Hands
            svg += `<ellipse cx="${cx-shoulderW-armW/2}" cy="${armTopY+torsoH+12}" rx="4" ry="5" fill="${avSkin}"/>`;
            svg += `<ellipse cx="${cx+shoulderW+armW/2}" cy="${armTopY+torsoH+12}" rx="4" ry="5" fill="${avSkin}"/>`;
            // ---- TOP CLOTHING ----
            const topBot = isCoat ? torsoBot + 25 : torsoBot;
            // Body
            svg += `<path d="M${cx-shoulderW} ${torsoTop} L${cx-waistW} ${topBot} L${cx+waistW} ${topBot} L${cx+shoulderW} ${torsoTop} Z" fill="${avTopC}"/>`;
            // Sleeves
            svg += `<rect x="${cx-shoulderW-armW}" y="${armTopY}" width="${armW}" height="${armLen}" rx="${armW/2}" fill="${avTopC}"/>`;
            svg += `<rect x="${cx+shoulderW}" y="${armTopY}" width="${armW}" height="${armLen}" rx="${armW/2}" fill="${avTopC}"/>`;
            // Clothing-specific details
            if (['shirt','blazer','blouse'].includes(avTopT)) {
                // Collar
                svg += `<path d="M${cx-8} ${torsoTop-1} L${cx-14} ${torsoTop+8}" stroke="#fff" stroke-width="2" fill="none"/>`;
                svg += `<path d="M${cx+8} ${torsoTop-1} L${cx+14} ${torsoTop+8}" stroke="#fff" stroke-width="2" fill="none"/>`;
                // Buttons
                for (let i = 0; i < 5; i++) svg += `<circle cx="${cx}" cy="${torsoTop+10+i*10}" r="1.2" fill="rgba(255,255,255,0.5)"/>`;
                // Placket
                svg += `<line x1="${cx}" y1="${torsoTop+5}" x2="${cx}" y2="${topBot-5}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
            }
            if (avTopT === 'hoodie') {
                // Hood behind head
                svg += `<path d="M${cx-shoulderW+5} ${torsoTop} Q${cx-shoulderW} ${torsoTop-15} ${cx} ${torsoTop-20} Q${cx+shoulderW} ${torsoTop-15} ${cx+shoulderW-5} ${torsoTop}" fill="${avTopC}" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>`;
                // Kangaroo pocket
                svg += `<path d="M${cx-12} ${torsoTop+35} Q${cx} ${torsoTop+42} ${cx+12} ${torsoTop+35}" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/>`;
                svg += `<rect x="${cx-12}" y="${torsoTop+35}" width="24" height="14" rx="3" fill="rgba(0,0,0,0.04)"/>`;
                // Drawstrings
                svg += `<line x1="${cx-3}" y1="${torsoTop}" x2="${cx-4}" y2="${torsoTop+15}" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>`;
                svg += `<line x1="${cx+3}" y1="${torsoTop}" x2="${cx+4}" y2="${torsoTop+15}" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>`;
            }
            if (avTopT === 'sweater') {
                // V-neck or crew neck
                svg += `<path d="M${cx-8} ${torsoTop-1} Q${cx} ${torsoTop+6} ${cx+8} ${torsoTop-1}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>`;
                // Knit texture
                for (let i = 1; i < 5; i++) svg += `<line x1="${cx-shoulderW+5}" y1="${torsoTop+i*12}" x2="${cx+shoulderW-5}" y2="${torsoTop+i*12}" stroke="rgba(0,0,0,0.04)" stroke-width="1"/>`;
                // Ribbed cuffs
                svg += `<rect x="${cx-shoulderW-armW}" y="${armTopY+armLen-5}" width="${armW}" height="5" rx="2" fill="rgba(0,0,0,0.06)"/>`;
                svg += `<rect x="${cx+shoulderW}" y="${armTopY+armLen-5}" width="${armW}" height="5" rx="2" fill="rgba(0,0,0,0.06)"/>`;
            }
            if (avTopT === 'jacket' || avTopT === 'denim-j') {
                // Zipper/center line
                svg += `<line x1="${cx}" y1="${torsoTop+3}" x2="${cx}" y2="${topBot-3}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>`;
                // Collar
                svg += `<rect x="${cx-shoulderW+2}" y="${torsoTop-2}" width="${shoulderW-4}" height="6" rx="2" fill="rgba(0,0,0,0.05)"/>`;
                svg += `<rect x="${cx+2}" y="${torsoTop-2}" width="${shoulderW-4}" height="6" rx="2" fill="rgba(0,0,0,0.05)"/>`;
                // Pockets
                svg += `<rect x="${cx-shoulderW+4}" y="${torsoTop+25}" width="10" height="8" rx="1" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.8"/>`;
                svg += `<rect x="${cx+shoulderW-14}" y="${torsoTop+25}" width="10" height="8" rx="1" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.8"/>`;
                if (avTopT === 'denim-j') {
                    // Stitching
                    svg += `<line x1="${cx-shoulderW+3}" y1="${torsoTop+3}" x2="${cx-waistW+3}" y2="${topBot-3}" stroke="rgba(255,200,0,0.2)" stroke-width="0.5" stroke-dasharray="2,2"/>`;
                    svg += `<line x1="${cx+shoulderW-3}" y1="${torsoTop+3}" x2="${cx+waistW-3}" y2="${topBot-3}" stroke="rgba(255,200,0,0.2)" stroke-width="0.5" stroke-dasharray="2,2"/>`;
                }
            }
            if (avTopT === 'coat') {
                // Lapels
                svg += `<path d="M${cx-2} ${torsoTop} L${cx-12} ${torsoTop+20} L${cx-shoulderW+3} ${torsoTop+3}" fill="rgba(0,0,0,0.06)"/>`;
                svg += `<path d="M${cx+2} ${torsoTop} L${cx+12} ${torsoTop+20} L${cx+shoulderW-3} ${torsoTop+3}" fill="rgba(0,0,0,0.06)"/>`;
                // Buttons
                svg += `<circle cx="${cx-4}" cy="${torsoTop+25}" r="1.5" fill="rgba(0,0,0,0.15)"/>`;
                svg += `<circle cx="${cx-4}" cy="${torsoTop+40}" r="1.5" fill="rgba(0,0,0,0.15)"/>`;
            }
            if (avTopT === 'puffer') {
                // Quilted lines
                for (let i = 1; i < 6; i++) svg += `<line x1="${cx-shoulderW+3}" y1="${torsoTop+i*10}" x2="${cx+shoulderW-3}" y2="${torsoTop+i*10}" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`;
            }
            if (avTopT === 'polo') {
                // Polo collar
                svg += `<rect x="${cx-10}" y="${torsoTop-3}" width="20" height="6" rx="3" fill="${avTopC}" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>`;
                svg += `<line x1="${cx}" y1="${torsoTop+3}" x2="${cx}" y2="${torsoTop+18}" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>`;
                svg += `<circle cx="${cx}" cy="${torsoTop+8}" r="1" fill="rgba(0,0,0,0.12)"/>`;
                svg += `<circle cx="${cx}" cy="${torsoTop+14}" r="1" fill="rgba(0,0,0,0.12)"/>`;
            }
            if (avTopT === 'cardigan') {
                svg += `<line x1="${cx}" y1="${torsoTop+3}" x2="${cx}" y2="${topBot-3}" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/>`;
                for (let i = 0; i < 4; i++) svg += `<circle cx="${cx-2}" cy="${torsoTop+12+i*11}" r="1.2" fill="rgba(0,0,0,0.12)"/>`;
            }
            if (avTopT === 'tank' || avTopT === 'crop') {
                svg += `<path d="M${cx-8} ${torsoTop-1} Q${cx} ${torsoTop+4} ${cx+8} ${torsoTop-1}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>`;
            }
            if (avTopT === 'windbreaker') {
                svg += `<line x1="${cx}" y1="${torsoTop+3}" x2="${cx}" y2="${topBot-3}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>`;
                svg += `<rect x="${cx-shoulderW+3}" y="${torsoTop+20}" width="10" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>`;
            }
            // ---- HEAD ----
            svg += `<circle cx="${cx}" cy="${headY}" r="${headR}" fill="${avSkin}"/>`;
            if (fem) svg += `<path d="M${cx-16} ${headY-4} Q${cx-18} ${headY-15} ${cx} ${headY-headR-1} Q${cx+18} ${headY-15} ${cx+16} ${headY-4}" fill="#3a2a1a"/>`;
            else svg += `<path d="M${cx-15} ${headY-4} Q${cx-15} ${headY-15} ${cx} ${headY-headR} Q${cx+15} ${headY-15} ${cx+15} ${headY-4}" fill="#3a2a1a"/>`;
            // Eyes
            svg += `<ellipse cx="${cx-6}" cy="${headY+1}" rx="2" ry="2.5" fill="#333"/><circle cx="${cx-5.5}" cy="${headY}" r="0.8" fill="#fff"/>`;
            svg += `<ellipse cx="${cx+6}" cy="${headY+1}" rx="2" ry="2.5" fill="#333"/><circle cx="${cx+6.5}" cy="${headY}" r="0.8" fill="#fff"/>`;
            // Eyebrows
            svg += `<path d="M${cx-9} ${headY-5} L${cx-3} ${headY-5.5}" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>`;
            svg += `<path d="M${cx+3} ${headY-5.5} L${cx+9} ${headY-5}" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>`;
            // Mouth
            svg += `<path d="M${cx-4} ${headY+10} Q${cx} ${headY+13} ${cx+4} ${headY+10}" stroke="#c0766e" stroke-width="1.5" fill="none"/>`;
            // ---- ACCESSORIES ----
            if (avAcc.has('cap')) svg += `<ellipse cx="${cx}" cy="${headY-headR+5}" rx="22" ry="6" fill="#333"/><rect x="${cx-18}" y="${headY-headR-5}" width="36" height="12" rx="7" fill="#333"/><rect x="${cx}" y="${headY-headR-3}" width="22" height="4" rx="2" fill="#444"/>`;
            if (avAcc.has('bucket')) svg += `<ellipse cx="${cx}" cy="${headY-headR+6}" rx="24" ry="6" fill="#8B7355"/><rect x="${cx-16}" y="${headY-headR-5}" width="32" height="14" rx="9" fill="#8B7355"/>`;
            if (avAcc.has('beanie')) svg += `<rect x="${cx-15}" y="${headY-headR-6}" width="30" height="18" rx="10" fill="#CC4444"/><circle cx="${cx}" cy="${headY-headR-8}" r="3" fill="#CC4444"/>`;
            if (avAcc.has('sunglasses')) svg += `<rect x="${cx-12}" y="${headY-1}" width="10" height="7" rx="2" fill="rgba(0,0,0,0.8)"/><rect x="${cx+2}" y="${headY-1}" width="10" height="7" rx="2" fill="rgba(0,0,0,0.8)"/><line x1="${cx-2}" y1="${headY+2}" x2="${cx+2}" y2="${headY+2}" stroke="#555" stroke-width="1"/>`;
            if (avAcc.has('necklace') && !avAcc.has('scarf')) svg += `<path d="M${cx-10} ${neckY+neckH-1} Q${cx} ${neckY+neckH+10} ${cx+10} ${neckY+neckH-1}" stroke="#DAA520" stroke-width="1.2" fill="none"/><circle cx="${cx}" cy="${neckY+neckH+8}" r="2.5" fill="#DAA520"/>`;
            if (avAcc.has('scarf')) svg += `<path d="M${cx-14} ${neckY+1} Q${cx} ${neckY+neckH+4} ${cx+14} ${neckY+1}" stroke="#CC4444" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${cx-8} ${neckY+neckH} L${cx-12} ${torsoTop+25}" stroke="#CC4444" stroke-width="4" fill="none" stroke-linecap="round"/>`;
            if (avAcc.has('watch')) svg += `<rect x="${cx-shoulderW-armW-1}" y="${armTopY+armLen-6}" width="10" height="10" rx="3" fill="#888"/><rect x="${cx-shoulderW-armW+1}" y="${armTopY+armLen-4}" width="6" height="6" rx="2" fill="#DDD"/>`;
            if (avAcc.has('earrings')) svg += `<circle cx="${cx-headR}" cy="${headY+5}" r="2.5" fill="#DAA520"/><circle cx="${cx+headR}" cy="${headY+5}" r="2.5" fill="#DAA520"/>`;
            if (avAcc.has('belt')) svg += `<rect x="${cx-waistW-1}" y="${torsoBot-3}" width="${waistW*2+2}" height="4" rx="2" fill="#5c4033"/><rect x="${cx-2}" y="${torsoBot-4}" width="4" height="6" rx="1" fill="#8B7355"/>`;
            if (avAcc.has('tote')) svg += `<rect x="${cx+shoulderW+armW}" y="${torsoTop+25}" width="16" height="20" rx="2" fill="#8B6914"/><path d="M${cx+shoulderW+armW+3} ${torsoTop+25} Q${cx+shoulderW+armW+8} ${torsoTop+18} ${cx+shoulderW+armW+13} ${torsoTop+25}" stroke="#8B6914" stroke-width="2" fill="none"/>`;
            if (avAcc.has('backpack')) svg += `<rect x="${cx+shoulderW}" y="${torsoTop-2}" width="16" height="24" rx="4" fill="#555"/><path d="M${cx+shoulderW+3} ${torsoTop-2} Q${cx+shoulderW+8} ${torsoTop-9} ${cx+shoulderW+13} ${torsoTop-2}" stroke="#555" stroke-width="2" fill="none"/>`;

            el.innerHTML = `<svg viewBox="30 0 140 ${totalH}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
            const topN = tops.find(t => t.id === avTopT);
            const botN = bots.find(b => b.id === avBotT);
            const accN = [...avAcc].map(id => { const a = accs.find(x => x.id === id); return a ? a.i + a.n : ''; }).filter(Boolean).join('、');
            document.getElementById('av-sum').textContent = `${topN?.i||''}${topN?.n||''} + ${botN?.i||''}${botN?.n||''} ${accN ? '+ ' + accN : ''} ・ ${avHt}cm ・ ${avWt}kg`;
        }

        // === TRENDS ===
        document.querySelectorAll('.wo-tf').forEach(b => b.addEventListener('click', () => {
            tFilter = b.dataset.f;
            document.querySelectorAll('.wo-tf').forEach(x => x.className = 'wo-tf px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition border ' + (x.dataset.f === tFilter ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-500'));
            renderT();
        }));

        function renderT() {
            let f = trends;
            if (tFilter !== 'all') f = f.filter(t => t.s === tFilter || t.g === tFilter);
            const el = document.getElementById('wo-tresults');
            if (!f.length) { el.innerHTML = '<div class="text-center py-10 text-slate-400"><p class="text-sm">沒有符合的穿搭</p></div>'; return; }
            el.innerHTML = `<div class="text-xs font-bold text-slate-400 mb-2">📋 共 ${f.length} 組穿搭（依人氣排序）</div>` + f.map(a => trendCard(a)).join('');
        }

        renderW(); drawAvatar(); renderT();
    }, 0);
};
