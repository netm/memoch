// indez999.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');

    // Ensure touch actions on the canvas only
    canvas.style.touchAction = 'none';

    // Canvas State
    let isDrawing = false;
    let isErasing = false;
    let lastX = 0;
    let lastY = 0;
    let history = [];
    let historyStep = -1;

    // Default Settings
    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Controls
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const colorButtons = document.querySelectorAll('.color-btn');
    const colorPicker = document.getElementById('color-picker');
    const thicknessSlider = document.getElementById('thickness-slider');
    const eraserBtn = document.getElementById('eraser-btn');
    const penBtn = document.getElementById('pen-btn');
    const fillBtn = document.getElementById('fill-btn');
    const undoBtn = document.getElementById('undo-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');

    widthInput.value = canvas.width;
    heightInput.value = canvas.height;
    thicknessSlider.value = ctx.lineWidth;

    function resizeCanvas() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);

        canvas.width = widthInput.value || 500;
        canvas.height = heightInput.value || 500;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);

        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = thicknessSlider.value;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        saveState();
        saveToBrowser();
    }
    widthInput.addEventListener('change', resizeCanvas);
    heightInput.addEventListener('change', resizeCanvas);

    function changeColor(e) {
        const color = e.target.dataset.color || e.target.value;
        ctx.strokeStyle = color;
        colorPicker.value = color;
        isErasing = false;
        ctx.globalCompositeOperation = 'source-over';
    }
    colorButtons.forEach(btn => btn.addEventListener('click', changeColor));
    colorPicker.addEventListener('input', changeColor);

    thicknessSlider.addEventListener('input', e => {
        ctx.lineWidth = e.target.value;
    });

    eraserBtn.addEventListener('click', () => {
        isErasing = true;
        ctx.globalCompositeOperation = 'destination-out';
    });

    penBtn.addEventListener('click', () => {
        isErasing = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = colorPicker.value;
    });

    fillBtn.addEventListener('click', () => {
        isErasing = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = colorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
        saveToBrowser();
    });

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        history = [];
        historyStep = -1;
        saveState();
        saveToBrowser();
    });

    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'rakugaki.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // History (Undo)
    function saveState() {
        if (historyStep < history.length - 1) history.splice(historyStep + 1);
        history.push(canvas.toDataURL());
        historyStep++;
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            const img = new Image();
            img.src = history[historyStep];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }
    undoBtn.addEventListener('click', undo);

    // Drawing Logic
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function startDrawing(e) {
        if (e.touches && e.touches.length > 1) return;
        isDrawing = true;
        ({ x: lastX, y: lastY } = getPos(e));
        e.preventDefault();
    }

    function draw(e) {
        if (!isDrawing || (e.touches && e.touches.length > 1)) return;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x; lastY = y;
        e.preventDefault();
    }

    function stopDrawing() {
        if (!isDrawing) return;
        isDrawing = false;
        saveState();
        saveToBrowser();
    }

    ['mousedown','touchstart'].forEach(evt => canvas.addEventListener(evt, startDrawing));
    ['mousemove','touchmove'].forEach(evt => canvas.addEventListener(evt, draw));
    ['mouseup','mouseout','touchend','touchcancel'].forEach(evt => canvas.addEventListener(evt, stopDrawing));

    // Browser Storage
    function saveToBrowser() {
        localStorage.setItem('canvasContents', canvas.toDataURL());
    }

    function loadFromBrowser() {
        const dataURL = localStorage.getItem('canvasContents');
        if (dataURL) {
            const img = new Image();
            img.src = dataURL;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                saveState();
            };
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    }

    loadFromBrowser();
});