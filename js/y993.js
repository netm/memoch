document.addEventListener('DOMContentLoaded', () => {
    const countSelect = document.getElementById('count');
    const itemsContainer = document.getElementById('items-container');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const autoStopButton = document.getElementById('auto-stop');
    const resultDisplay = document.getElementById('result-display');
    const resultTitle = document.getElementById('result-title');

    let lotteryInterval;
    let isRunning = false;

    const generateInputs = (count) => {
        itemsContainer.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'item-input';
            input.value = i;
            itemsContainer.appendChild(input);
        }
    };

    const getItems = () => {
        const inputs = document.querySelectorAll('.item-input');
        return Array.from(inputs).map(input => input.value);
    };

    const startLottery = (speed) => {
        if (isRunning) return;
        isRunning = true;
        resultTitle.textContent = '抽選表示';
        const items = getItems();
        if (items.length === 0) {
            isRunning = false;
            return;
        }
        lotteryInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * items.length);
            resultDisplay.textContent = items[randomIndex];
        }, speed);
    };

    const stopLottery = () => {
        if (!isRunning) return;
        clearInterval(lotteryInterval);
        resultTitle.textContent = '抽選結果';
        isRunning = false;
    };

    countSelect.addEventListener('change', () => {
        if (isRunning) stopLottery();
        generateInputs(countSelect.value);
    });

    startButton.addEventListener('click', () => {
        stopLottery();
        startLottery(50);
    });

    stopButton.addEventListener('click', () => {
        stopLottery();
    });

    autoStopButton.addEventListener('click', () => {
        if (isRunning) return;

        startLottery(50);

        setTimeout(() => {
            clearInterval(lotteryInterval);
            isRunning = false;
            startLottery(150);
        }, 1000);

        setTimeout(() => {
            clearInterval(lotteryInterval);
            isRunning = false;
            startLottery(250);
        }, 2500);

        setTimeout(() => {
            stopLottery();
        }, 2500);
    });

    // 初期化
    generateInputs(10);
});