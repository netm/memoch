document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearTitle = document.getElementById('monthYearTitle');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const clearAllBtn = document.getElementById('clearAll');
    const savePngBtn = document.getElementById('savePng');

    const calendarNameInput = document.getElementById('calendarName');
    const labelTopInput = document.getElementById('labelTop');
    const labelBottomInput = document.getElementById('labelBottom');
    const totalTopVal = document.getElementById('totalTopVal');
    const totalBottomVal = document.getElementById('totalBottomVal');

    const colorTopPlus = document.getElementById('colorTopPlus');
    const colorTopMinus = document.getElementById('colorTopMinus');
    const colorBottomPlus = document.getElementById('colorBottomPlus');
    const colorBottomMinus = document.getElementById('colorBottomMinus');
    const colorCalendarName = document.getElementById('colorCalendarName');
    const colorBg = document.getElementById('colorBg');

    const shareX = document.getElementById('shareX');
    const shareLine = document.getElementById('shareLine');
    const shareInsta = document.getElementById('shareInsta');
    const shareEmail = document.getElementById('shareEmail');

    function getStorageKey(year, month, type) {
        return `tradelog_${year}_${month}_${type}`;
    }

    function initSettings() {
        if(localStorage.getItem('cal_name')) calendarNameInput.value = localStorage.getItem('cal_name');
        if(localStorage.getItem('lbl_top')) labelTopInput.value = localStorage.getItem('lbl_top');
        if(localStorage.getItem('lbl_bottom')) labelBottomInput.value = localStorage.getItem('lbl_bottom');
        
        if(localStorage.getItem('c_top_p')) colorTopPlus.value = localStorage.getItem('c_top_p');
        if(localStorage.getItem('c_top_m')) colorTopMinus.value = localStorage.getItem('c_top_m');
        if(localStorage.getItem('c_bot_p')) colorBottomPlus.value = localStorage.getItem('c_bot_p');
        if(localStorage.getItem('c_bot_m')) colorBottomMinus.value = localStorage.getItem('c_bot_m');
        if(localStorage.getItem('c_cal_n')) colorCalendarName.value = localStorage.getItem('c_cal_n');
        if(localStorage.getItem('c_bg')) colorBg.value = localStorage.getItem('c_bg');

        applyColors();
    }

    function saveSettings() {
        localStorage.setItem('cal_name', calendarNameInput.value);
        localStorage.setItem('lbl_top', labelTopInput.value);
        localStorage.setItem('lbl_bottom', labelBottomInput.value);
        localStorage.setItem('c_top_p', colorTopPlus.value);
        localStorage.setItem('c_top_m', colorTopMinus.value);
        localStorage.setItem('c_bot_p', colorBottomPlus.value);
        localStorage.setItem('c_bot_m', colorBottomMinus.value);
        localStorage.setItem('c_cal_n', colorCalendarName.value);
        localStorage.setItem('c_bg', colorBg.value);
    }

    function applyColors() {
        document.body.style.backgroundColor = colorBg.value;
        calendarNameInput.style.color = colorCalendarName.value;
        updateInputColors();
    }

    function updateInputColors() {
        const topInputs = document.querySelectorAll('.input-top');
        const bottomInputs = document.querySelectorAll('.input-bottom');

        topInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            if (val > 0) input.style.color = colorTopPlus.value;
            else if (val < 0) input.style.color = colorTopMinus.value;
            else input.style.color = '#333333';
        });

        bottomInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            if (val > 0) input.style.color = colorBottomPlus.value;
            else if (val < 0) input.style.color = colorBottomMinus.value;
            else input.style.color = '#333333';
        });
    }

    function calculateTotals() {
        let totalTop = 0;
        let totalBottom = 0;
        const topInputs = document.querySelectorAll('.input-top');
        const bottomInputs = document.querySelectorAll('.input-bottom');

        topInputs.forEach(input => totalTop += (parseFloat(input.value) || 0));
        bottomInputs.forEach(input => totalBottom += (parseFloat(input.value) || 0));

        totalTopVal.textContent = totalTop.toLocaleString();
        totalBottomVal.textContent = totalBottom.toLocaleString();
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearTitle.textContent = `${year}年 ${month + 1}月`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const topData = JSON.parse(localStorage.getItem(getStorageKey(year, month, 'top'))) || {};
        const bottomData = JSON.parse(localStorage.getItem(getStorageKey(year, month, 'bottom'))) || {};

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';

            const dayNum = document.createElement('div');
            dayNum.className = 'day-number';
            dayNum.textContent = day;
            dayCell.appendChild(dayNum);

            const inputTop = document.createElement('input');
            inputTop.type = 'text';
            inputTop.inputMode = 'text';
            inputTop.className = 'day-input input-top';
            inputTop.placeholder = '　';
            inputTop.value = topData[day] || '';
            dayCell.appendChild(inputTop);

            const inputBottom = document.createElement('input');
            inputBottom.type = 'text';
            inputBottom.inputMode = 'text';
            inputBottom.className = 'day-input input-bottom';
            inputBottom.placeholder = '　';
            inputBottom.value = bottomData[day] || '';
            dayCell.appendChild(inputBottom);

            const validateAndFilter = (input) => {
                let val = input.value;
                val = val.replace(/[^-0-9.]/g, '');
                const parts = val.split('-');
                if (parts.length > 2) {
                    val = '-' + parts.join('').replace(/-/g, '');
                } else if (parts.length === 2 && val.indexOf('-') !== 0) {
                    val = val.replace(/-/g, '');
                }
                const dotParts = val.split('.');
                if (dotParts.length > 2) {
                    val = dotParts[0] + '.' + dotParts.slice(1).join('');
                }
                input.value = val;
            };

            inputTop.addEventListener('input', () => {
                validateAndFilter(inputTop);
                topData[day] = inputTop.value;
                localStorage.setItem(getStorageKey(year, month, 'top'), JSON.stringify(topData));
                calculateTotals();
                updateInputColors();
            });

            inputBottom.addEventListener('input', () => {
                validateAndFilter(inputBottom);
                bottomData[day] = inputBottom.value;
                localStorage.setItem(getStorageKey(year, month, 'bottom'), JSON.stringify(bottomData));
                calculateTotals();
                updateInputColors();
            });

            calendarGrid.appendChild(dayCell);
        }

        calculateTotals();
        updateInputColors();
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm('すべての入力データと設定を消去しますか？')) {
            localStorage.clear();
            calendarNameInput.value = 'デイトレ ＆ スイングトレード 収支';
            labelTopInput.value = 'デイトレ合計';
            labelBottomInput.value = 'スイング合計';
            colorTopPlus.value = '#0000ff';
            colorTopMinus.value = '#ff0000';
            colorBottomPlus.value = '#008000';
            colorBottomMinus.value = '#800080';
            colorCalendarName.value = '#333333';
            colorBg.value = '#ffdea0';
            applyColors();
            renderCalendar();
        }
    });

    savePngBtn.addEventListener('click', () => {
        alert('PNG保存機能：html2canvasなどのライブラリを組み込むことで、カレンダーエリアを画像として保存可能です。');
    });

    [calendarNameInput, labelTopInput, labelBottomInput].forEach(input => {
        input.addEventListener('input', saveSettings);
    });

    [colorTopPlus, colorTopMinus, colorBottomPlus, colorBottomMinus, colorCalendarName, colorBg].forEach(picker => {
        picker.addEventListener('input', () => {
            saveSettings();
            applyColors();
        });
    });

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('2つの収支カレンダーでデイトレとスイングの成績を簡単管理！');

    shareX.href = `https://twitter.com{shareUrl}&text=${shareText}`;
    shareLine.href = `https://line.me{shareUrl}`;
    shareInsta.href = `https://instagram.com`;
    shareEmail.href = `mailto:?subject=${shareText}&body=${shareUrl}`;

    initSettings();
    renderCalendar();
});