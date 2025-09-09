// indez998.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas              = document.getElementById('drawing-canvas');
    const ctx                 = canvas.getContext('2d');
    const calendarContainer   = document.getElementById('calendar-container');
    const calendarTableBody   = document.getElementById('calendar-body');
    const monthYearDisplay    = document.getElementById('month-year');
    const prevMonthBtn        = document.getElementById('prev-month');
    const nextMonthBtn        = document.getElementById('next-month');
    const penWidthSlider      = document.getElementById('pen-width');
    const colorButtons        = document.querySelectorAll('.color-btn');
    const colorPicker         = document.getElementById('color-picker');
    const bgColorPicker       = document.getElementById('bg-color-picker');
    const eraserBtn           = document.getElementById('eraser-btn');
    const undoBtn             = document.getElementById('undo-btn');
    const clearBtn            = document.getElementById('clear-btn');
    const saveBtn             = document.getElementById('save-btn');

    let currentDate  = new Date();
    let isDrawing    = false;
    let lastX        = 0;
    let lastY        = 0;
    let history      = [];
    let historyIndex = -1;

    function resizeCanvas() {
        const dpr  = window.devicePixelRatio || 1;
        const rect = calendarContainer.getBoundingClientRect();
        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width  = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap    = 'round';
        ctx.lineJoin   = 'round';
        ctx.lineWidth  = penWidthSlider.value;
        ctx.strokeStyle= colorPicker.value;
        redrawFromHistory();
    }

    function getMousePos(e) {
        const rect   = canvas.getBoundingClientRect();
        const scaleX = canvas.width  / (rect.width  * window.devicePixelRatio);
        const scaleY = canvas.height / (rect.height * window.devicePixelRatio);
        const clientX= e.touches ? e.touches[0].clientX : e.clientX;
        const clientY= e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top)  * scaleY
        };
    }

    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getMousePos(e);
        [lastX, lastY] = [pos.x, pos.y];
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
    }

    function stopDrawing() {
        if (!isDrawing) return;
        ctx.closePath();
        isDrawing = false;
        saveHistory();
        saveDrawing();
    }

    function saveHistory() {
        if (historyIndex < history.length - 1) history = history.slice(0, historyIndex + 1);
        history.push(canvas.toDataURL());
        historyIndex++;
        if (history.length > 20) { history.shift(); historyIndex--; }
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0,
                    canvas.width  / window.devicePixelRatio,
                    canvas.height / window.devicePixelRatio
                );
                saveDrawing();
            };
            img.src = history[historyIndex];
        } else clearCanvas();
    }

    function redrawFromHistory() {
        if (history.length > 0 && historyIndex >= 0) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0,
                    canvas.width  / window.devicePixelRatio,
                    canvas.height / window.devicePixelRatio
                );
            };
            img.src = history[historyIndex];
        }
    }

    function generateCalendar(year, month) {
        calendarTableBody.innerHTML = '';
        monthYearDisplay.textContent = `${year}年 ${month + 1}月`;
        const firstDay    = new Date(year, month,   1).getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (!(i === 0 && j < firstDay) && date <= daysInMonth) {
                    cell.textContent = date;
                    cell.dataset.date = `${year}-${month}-${date}`;
                    if (j === 0) cell.classList.add('sunday');
                    if (j === 6) cell.classList.add('saturday');
                    date++;
                }
                row.appendChild(cell);
            }
            calendarTableBody.appendChild(row);
            if (date > daysInMonth) break;
        }
        loadBgColors(year, month);
    }

    function saveDrawing() {
        try {
            localStorage.setItem(
                `drawing_${currentDate.getFullYear()}_${currentDate.getMonth()}`,
                canvas.toDataURL()
            );
        } catch (e) {
            console.error("Failed to save drawing:", e);
        }
    }

    function loadDrawing() {
        const key   = `drawing_${currentDate.getFullYear()}_${currentDate.getMonth()}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0,
                    canvas.width  / window.devicePixelRatio,
                    canvas.height / window.devicePixelRatio
                );
                saveHistory();
            };
            img.src = saved;
        } else {
            history = []; historyIndex = -1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        }
    }

    function saveBgColors(year, month) {
        const colors = {};
        calendarTableBody.querySelectorAll('td').forEach(td => {
            if (td.dataset.date && td.style.backgroundColor) {
                colors[td.dataset.date] = td.style.backgroundColor;
            }
        });
        localStorage.setItem(`bgColors_${year}_${month}`, JSON.stringify(colors));
    }

    function loadBgColors(year, month) {
        const colors = JSON.parse(localStorage.getItem(`bgColors_${year}_${month}`) || '{}');
        Object.entries(colors).forEach(([date, color]) => {
            const cell = calendarTableBody.querySelector(`td[data-date="${date}"]`);
            if (cell) cell.style.backgroundColor = color;
        });
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = []; historyIndex = -1;
        saveHistory(); saveDrawing();
    }

    function clearAll() {
        clearCanvas();
        calendarTableBody.querySelectorAll('td').forEach(td => td.style.backgroundColor = '');
        localStorage.removeItem(`bgColors_${currentDate.getFullYear()}_${currentDate.getMonth()}`);
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        loadDrawing();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        loadDrawing();
    });

    penWidthSlider.addEventListener('input', e => ctx.lineWidth = e.target.value);

    colorButtons.forEach(btn => {
        const applyColor = e => {
            e.preventDefault();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = btn.dataset.color;
            colorPicker.value = btn.dataset.color;
        };
        btn.addEventListener('click', applyColor);
        btn.addEventListener('touchstart', applyColor);
    });

    colorPicker.addEventListener('input', e => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = e.target.value;
    });

    eraserBtn.addEventListener('click', () => ctx.globalCompositeOperation = 'destination-out');
    clearBtn.addEventListener('click', clearAll);
    undoBtn.addEventListener('click', undo);

    saveBtn.addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx    = tempCanvas.getContext('2d');
        const dpr        = window.devicePixelRatio || 1;
        const rect       = calendarContainer.getBoundingClientRect();

        tempCanvas.width  = rect.width  * dpr;
        tempCanvas.height = rect.height * dpr;
        tempCtx.scale(dpr, dpr);

        // 白背景
        tempCtx.fillStyle = '#FFF';
        tempCtx.fillRect(0, 0, rect.width, rect.height);

        // 「年月」ヘッダーを描画
        tempCtx.fillStyle     = '#000';
        tempCtx.font          = 'bold 16px sans-serif';
        tempCtx.textAlign     = 'center';
        tempCtx.textBaseline  = 'top';
        tempCtx.fillText(monthYearDisplay.textContent, rect.width / 2, 5);

        // カレンダーセル背景色と数字
        const cells = calendarTableBody.querySelectorAll('td');
        const containerRect = calendarContainer.getBoundingClientRect();
        tempCtx.font         = '12px sans-serif';
        tempCtx.textAlign    = 'left';
        tempCtx.textBaseline = 'top';
        cells.forEach(cell => {
            const r = cell.getBoundingClientRect();
            const x = r.left - containerRect.left;
            const y = r.top  - containerRect.top;
            if (cell.style.backgroundColor) {
                tempCtx.fillStyle = cell.style.backgroundColor;
                tempCtx.fillRect(x, y, r.width, r.height);
            }
            tempCtx.fillStyle = '#000';
            tempCtx.fillText(cell.textContent, x + 5, y + 5);
        });

        // 描画レイヤーを重ねる
        tempCtx.drawImage(canvas, 0, 0, rect.width, rect.height);

        // ダウンロード実行
        const link = document.createElement('a');
        link.download = `calendar_${currentDate.getFullYear()}-${currentDate.getMonth()+1}.png`;
        link.href     = tempCanvas.toDataURL('image/png');
        link.click();
    });

    calendarTableBody.addEventListener('click', e => {
        if (e.target.tagName === 'TD' && e.target.textContent) {
            e.target.style.backgroundColor = bgColorPicker.value;
            saveBgColors(currentDate.getFullYear(), currentDate.getMonth());
        }
    });

    ['mousedown','mousemove','mouseup','mouseout'].forEach(evt =>
        canvas.addEventListener(evt, e => {
            if (evt === 'mousedown') startDrawing(e);
            else if (evt === 'mousemove') draw(e);
            else stopDrawing();
        })
    );

    ['touchstart','touchmove','touchend'].forEach(evt =>
        canvas.addEventListener(evt, e => {
            if (evt === 'touchstart') startDrawing(e);
            else if (evt === 'touchmove') draw(e);
            else stopDrawing();
        })
    );

    window.addEventListener('resize', resizeCanvas);

    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    resizeCanvas();
    loadDrawing();
});