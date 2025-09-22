document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'garbageCalendarSettings_page2';
    let currentDate = new Date();
    let settings = [];
    const calendarContainer = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('monthYear');
    const settingsContainer = document.getElementById('settingsContainer');

    const defaultItems = [
        { name: '習い事', abbr: '習い事', freq: 'weekly', day: 1, color: '#cca000', weight: 900 },
        { name: 'ジム', abbr: 'ジム', freq: 'weekly', day: 2, color: '#0000ff', weight: 900 },
        { name: '英会話', abbr: '英会話', freq: '2nd', day: 5, color: '#9c038aff', weight: 800 },
        { name: '読書', abbr: '読書', freq: '1st', day: 3, color: '#008000', weight: 800 },
    ];

    function loadSettings() {
        const saved = localStorage.getItem(STORAGE_KEY);
        settings = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultItems));
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        renderSettings();
    }

    function getWeekOfMonth(date) {
        const dow = date.getDay();
        const first = new Date(date.getFullYear(), date.getMonth(), 1);
        const offset = (dow - first.getDay() + 7) % 7;
        const firstOccur = 1 + offset;
        return Math.floor((date.getDate() - firstOccur) / 7) + 1;
    }

    function generateCalendar(year, month) {
        calendarContainer.innerHTML = '';
        monthYearDisplay.textContent = `${year}年 ${month + 1}月`;

        const firstDow = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        ['日','月','火','水','木','金','土'].forEach(d => {
            const hdr = document.createElement('div');
            hdr.textContent = d;
            hdr.classList.add('calendar-header');
            if (d === '日') hdr.classList.add('sun');
            if (d === '土') hdr.classList.add('sat');
            calendarContainer.appendChild(hdr);
        });

        for (let i = 0; i < firstDow; i++) {
            calendarContainer.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-day');
            const date = new Date(year, month, i);
            const dow = date.getDay();
            const weekNum = getWeekOfMonth(date);

            const num = document.createElement('span');
            num.textContent = i;
            if (dow === 0) num.classList.add('sun');
            if (dow === 6) num.classList.add('sat');
            cell.appendChild(num);

            const evArea = document.createElement('div');
            evArea.classList.add('events');

            settings.forEach(item => {
                if (item.day == dow) {
                    let match = false;
                    switch (item.freq) {
                        case 'weekly': match = true; break;
                        case '1st': match = weekNum === 1; break;
                        case '2nd': match = weekNum === 2; break;
                        case '3rd': match = weekNum === 3; break;
                        case '4th': match = weekNum === 4; break;
                        case '1st-3rd': match = weekNum === 1 || weekNum === 3; break;
                        case '2nd-4th': match = weekNum === 2 || weekNum === 4; break;
                    }
                    if (match) {
                        const ev = document.createElement('div');
                        ev.textContent = item.abbr;
                        ev.style.color = item.color;
                        ev.style.fontWeight = item.weight;
                        evArea.appendChild(ev);
                    }
                }
            });

            cell.appendChild(evArea);
            calendarContainer.appendChild(cell);
        }
    }

    function renderSettings() {
        settingsContainer.innerHTML = '';
        settings.forEach((item, idx) => {
            const row = document.createElement('div');
            row.classList.add('setting-row');

            const abbrInput = document.createElement('input');
            abbrInput.type = 'text';
            abbrInput.value = item.abbr;
            abbrInput.placeholder = '表示文字';
            abbrInput.maxLength = 9;
            abbrInput.addEventListener('change', e => {
                settings[idx].abbr = e.target.value;
                saveSettings();
            });

            const freqSelect = document.createElement('select');
            const freqs = {
                weekly: '毎週', '1st': '第一週', '2nd': '第二週',
                '3rd': '第三週', '4th': '第四週',
                '1st-3rd': '第一・三週', '2nd-4th': '第二・四週'
            };
            Object.entries(freqs).forEach(([k, v]) => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = v;
                if (item.freq === k) opt.selected = true;
                freqSelect.appendChild(opt);
            });
            freqSelect.addEventListener('change', e => {
                settings[idx].freq = e.target.value;
                saveSettings();
            });

            const daySelect = document.createElement('select');
            ['日','月','火','水','木','金','土'].forEach((d, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = d + '曜日';
                if (item.day == i) opt.selected = true;
                daySelect.appendChild(opt);
            });
            daySelect.addEventListener('change', e => {
                settings[idx].day = e.target.value;
                saveSettings();
            });

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = item.color;
            colorPicker.addEventListener('input', e => {
                settings[idx].color = e.target.value;
                saveSettings();
            });

            const preset = document.createElement('div');
            preset.classList.add('preset-colors');
            ['#000','#f00','#00f','#080','#fa0'].forEach(c => {
                const box = document.createElement('span');
                box.classList.add('color-box');
                box.style.backgroundColor = c;
                box.addEventListener('click', () => {
                    settings[idx].color = c;
                    saveSettings();
                });  
                preset.appendChild(box);
            });

            const weightLabel = document.createElement('label');
            weightLabel.textContent = '文字の太さ:';
            const weightSlider = document.createElement('input');
            weightSlider.type = 'range';
            weightSlider.min = 100;
            weightSlider.max = 900;
            weightSlider.step = 100;
            weightSlider.value = item.weight;
            weightSlider.addEventListener('input', e => {
                settings[idx].weight = e.target.value;
                saveSettings();
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = '削除';
            delBtn.classList.add('delete-btn');
            delBtn.addEventListener('click', () => {
                settings.splice(idx, 1);
                saveSettings();
            });

            row.append(
                abbrInput, freqSelect, daySelect,
                preset, colorPicker, weightLabel,
                weightSlider, delBtn
            );
            settingsContainer.appendChild(row);
        });
    }

    function setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
        document.getElementById('addItem').addEventListener('click', () => {
            settings.push({ abbr: '新規', freq: 'weekly', day: 0, color: '#000', weight: 400 });
            saveSettings();
        });
        document.getElementById('savePng').addEventListener('click', () => {
            const area = document.getElementById('calendar-area');
            const btns = document.querySelector('.bottom-controls');
            btns.style.display = 'none';
            html2canvas(area).then(canvas => {
                const link = document.createElement('a');
                link.download = `calendar_${currentDate.getFullYear()}-${currentDate.getMonth()+1}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                btns.style.display = 'flex';
            });
        });
        document.getElementById('clearAll').addEventListener('click', () => {
            if (confirm('すべての設定を消去して初期状態に戻しますか？')) {
                localStorage.removeItem(STORAGE_KEY);
                loadSettings();
                saveSettings();
            }
        });
    }

    loadSettings();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    renderSettings();
    setupEventListeners();
});