window.render_photoCropper = function () {
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-xl font-bold mb-4">📐 黃金比例裁切器</h3>
            <div class="flex gap-4 mb-6">
                <input type="file" id="cropUpload" accept="image/*" class="text-sm">
                <button id="cropBtn" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">裁切並下載</button>
            </div>
            <div class="relative bg-slate-900 rounded-lg overflow-hidden flex justify-center items-center min-h-[400px]">
                <img id="cropTarget" class="max-w-full max-height-[600px] opacity-50">
                <div id="cropBox" class="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move">
                    <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                        <div class="border border-white"></div><div class="border border-white"></div><div class="border border-white"></div>
                        <div class="border border-white"></div><div class="border border-white"></div><div class="border border-white"></div>
                        <div class="border border-white"></div><div class="border border-white"></div><div class="border border-white"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const upload = document.getElementById('cropUpload');
        const target = document.getElementById('cropTarget');
        const cropBox = document.getElementById('cropBox');
        const cropBtn = document.getElementById('cropBtn');
        let isDragging = false, startX, startY, initialLeft, initialTop;

        upload.onchange = (e) => {
            const file = e.target.files[0];
            target.src = URL.createObjectURL(file);
            target.onload = () => {
                cropBox.style.width = '200px';
                cropBox.style.height = '200px';
                cropBox.style.top = '50px';
                cropBox.style.left = '50px';
            };
        };

        cropBox.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initialLeft = cropBox.offsetLeft; initialTop = cropBox.offsetTop;
        };

        window.onmousemove = (e) => {
            if (!isDragging) return;
            cropBox.style.left = `${initialLeft + (e.clientX - startX)}px`;
            cropBox.style.top = `${initialTop + (e.clientY - startY)}px`;
        };

        window.onmouseup = () => isDragging = false;

        cropBtn.onclick = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scale = target.naturalWidth / target.clientWidth;
            const rect = cropBox.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            canvas.width = cropBox.clientWidth * scale;
            canvas.height = cropBox.clientHeight * scale;

            ctx.drawImage(
                target,
                (rect.left - targetRect.left) * scale,
                (rect.top - targetRect.top) * scale,
                canvas.width, canvas.height,
                0, 0, canvas.width, canvas.height
            );
            const a = document.createElement('a');
            a.download = 'cropped.png';
            a.href = canvas.toDataURL();
            a.click();
        };
    }, 0);
};