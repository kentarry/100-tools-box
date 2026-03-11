window.render_watermark = function () {
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; width: 100%; text-align: left;">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">1. 上傳證件/圖片</label>
                    <input type="file" id="wmUp" accept="image/png, image/jpeg, image/webp" style="width: 100%; max-width: 100%;">
                </div>
                <div>
                    <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">2. 浮水印文字</label>
                    <input type="text" id="wmTxt" value="僅供辦理OO業務使用，他用無效" placeholder="請輸入浮水印文字" style="width: 100%; max-width: 100%;">
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div>
                        <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">3. 文字顏色</label>
                        <input type="color" id="wmColor" value="#ffffff" style="width: 50px; height: 40px; padding: 0;">
                    </div>
                    <div style="flex-grow: 1;">
                        <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">透明度 (<span id="wmOpVal">50</span>%)</label>
                        <input type="range" id="wmOp" min="0" max="100" value="50" style="width: 100%;">
                    </div>
                </div>
                <div>
                    <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">4. 文字大小 (<span id="wmSizeVal">30</span>px)</label>
                    <input type="range" id="wmSize" min="10" max="100" value="30" style="width: 100%;">
                </div>
                <div>
                    <label style="font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 5px; color: var(--text-dark);">5. 密度/間距 (<span id="wmSpaceVal">100</span>px)</label>
                    <input type="range" id="wmSpace" min="50" max="300" value="100" style="width: 100%;">
                </div>
                <button id="wmBtn" style="background-color: #34d399; color: #0f172a; font-weight: bold; width: 100%; margin-top: 10px; padding: 12px; border: none; border-radius: 8px; cursor: pointer;">⬇️ 下載加上浮水印的圖片</button>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 5px;">純本機端處理，斷網也能使用，圖片絕對安全不外流。</p>
            </div>
            <div style="background-color: #E5E7EB; border: 2px dashed #9CA3AF; border-radius: 12px; min-height: 400px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 10px;">
                <div id="wmEmpty" style="color: #64748b; text-align: center;">
                    <p style="font-size: 1.1rem; font-weight: bold;">請從左側上傳圖片</p>
                </div>
                <canvas id="wmCanvas" style="display: none; max-width: 100%; max-height: 500px; object-fit: contain; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: none; margin: 0;"></canvas>
            </div>
        </div>
    `;

    setTimeout(() => {
        const imgUp = document.getElementById('wmUp');
        const textIn = document.getElementById('wmTxt');
        const colorIn = document.getElementById('wmColor');
        const opIn = document.getElementById('wmOp');
        const sizeIn = document.getElementById('wmSize');
        const spaceIn = document.getElementById('wmSpace');
        const btn = document.getElementById('wmBtn');
        const canvas = document.getElementById('wmCanvas');
        const ctx = canvas.getContext('2d');
        const emptyState = document.getElementById('wmEmpty');
        const opVal = document.getElementById('wmOpVal');
        const sizeVal = document.getElementById('wmSizeVal');
        const spaceVal = document.getElementById('wmSpaceVal');
        let currentImage = null;

        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function drawWatermark() {
            if (!currentImage) return;
            canvas.width = currentImage.width;
            canvas.height = currentImage.height;
            ctx.drawImage(currentImage, 0, 0);
            const text = textIn.value, size = parseInt(sizeIn.value), space = parseInt(spaceIn.value);
            const alpha = parseInt(opIn.value) / 100;
            ctx.fillStyle = hexToRgba(colorIn.value, alpha);
            ctx.font = `bold ${size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const angle = -30 * Math.PI / 180;
            const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            for (let x = -diagonal; x < diagonal; x += space * 2) {
                for (let y = -diagonal; y < diagonal; y += space) {
                    const offsetX = (y / space) % 2 === 0 ? 0 : space;
                    ctx.fillText(text, x + offsetX, y);
                }
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        imgUp.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    currentImage = img;
                    emptyState.style.display = 'none';
                    canvas.style.display = 'block';
                    drawWatermark();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        });

        [textIn, colorIn, opIn, sizeIn, spaceIn].forEach(input => {
            input.addEventListener('input', () => {
                if (input.id === 'wmOp') opVal.textContent = input.value;
                if (input.id === 'wmSize') sizeVal.textContent = input.value;
                if (input.id === 'wmSpace') spaceVal.textContent = input.value;
                drawWatermark();
            });
        });

        btn.addEventListener('click', () => {
            if (!currentImage) return alert('請先上傳圖片！');
            const link = document.createElement('a');
            link.download = `watermarked_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 0.95);
            link.click();
        });
    }, 0);
};