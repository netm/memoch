document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const memoDisplay = document.getElementById('memo-display');
    const notes = document.getElementById('notes');
    const calculator = document.querySelector('.calculator');

    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let memoHistory = [];
    let inputHistory = []; // For undo functionality

    // Load from localStorage
    const loadState = () => {
        const savedMemo = localStorage.getItem('calculatorMemo');
        const savedNotes = localStorage.getItem('calculatorNotes');
        if (savedMemo) {
            memoHistory = JSON.parse(savedMemo);
            updateMemoDisplay();
        }
        if (savedNotes) {
            notes.value = savedNotes;
        }
        updateDisplay();
    };

    // Save to localStorage
    const saveState = () => {
        localStorage.setItem('calculatorMemo', JSON.stringify(memoHistory));
        localStorage.setItem('calculatorNotes', notes.value);
    };

    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    const updateMemoDisplay = () => {
        memoDisplay.innerHTML = memoHistory.join('<br>');
    };

    const appendNumber = (number) => {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else if (number === '.' && currentInput.includes('.')) {
            return;
        } else {
            currentInput += number;
        }
        inputHistory.push(currentInput);
        updateDisplay();
    };

    const chooseOperator = (op) => {
        if (previousInput !== null) {
            calculate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '0';
        inputHistory = [];
    };

    const calculate = () => {
        if (operator === null || previousInput === null) return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('0で割ることはできません');
                    clearAll();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        const expression = `${previousInput} ${operator} ${currentInput} =`;
        // Round to avoid floating point inaccuracies
        const roundedResult = parseFloat(result.toFixed(10));
        
        memoHistory.push(`${expression} <strong>${roundedResult}</strong>`);
        updateMemoDisplay();

        currentInput = roundedResult.toString();
        operator = null;
        previousInput = null;
        inputHistory = [currentInput];

        updateDisplay();
        saveState();
    };

    const clearAll = () => {
        currentInput = '0';
        operator = null;
        previousInput = null;
        memoHistory = [];
        inputHistory = [];
        notes.value = '';
        updateDisplay();
        updateMemoDisplay();
        localStorage.removeItem('calculatorMemo');
        localStorage.removeItem('calculatorNotes');
    };

    const undo = () => {
       if (currentInput.length > 1) {
           currentInput = currentInput.slice(0, -1);
       } else {
           currentInput = '0';
       }
       updateDisplay();
    };

    calculator.addEventListener('click', (event) => {
        if (!event.target.matches('button')) return;

        const { action, value } = event.target.dataset;

        if (action === 'number') {
            appendNumber(value);
        }
        if (action === 'operator') {
            chooseOperator(value);
        }
        if (action === 'decimal') {
            appendNumber('.');
        }
        if (action === 'equals') {
            calculate();
        }
        if (action === 'clear-all') {
            clearAll();
        }
        if (action === 'undo') {
            undo();
        }
    });

    document.getElementById('save-png').addEventListener('click', () => {
        const captureElement = document.getElementById('capture-area');
        html2canvas(captureElement, {
            backgroundColor: '#f0f4f8',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'memo-calculator.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    notes.addEventListener('input', saveState);

    loadState();
});