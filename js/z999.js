document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const historyList = document.getElementById('historyList');
    const modeSelector = document.getElementById('modeSelector');
    const calculatorButtons = document.querySelector('.calculator-buttons');
    const taxRateInput = document.getElementById('taxRate');
    let currentInput = '';
    let operator = '';
    let previousInput = '';
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    let currentMode = 'calculator';

    // --- Core Functions ---
    function updateDisplay() {
        display.textContent = currentInput || '0';
    }

    function updateHistory() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
    }

    function clearAll() {
        currentInput = '';
        operator = '';
        previousInput = '';
        updateDisplay();
    }

    function undo() {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }

    function handleNumber(number) {
        if (currentInput.includes('.') && number === '.') return;
        currentInput += number;
        updateDisplay();
    }

    function handleOperator(op) {
        if (currentInput === '') return;
        if (previousInput !== '') {
            calculate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '';
    }

    function calculate() {
        if (previousInput === '' || currentInput === '' || operator === '') return;
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': result = prev / current; break;
            case '^': result = Math.pow(prev, current); break;
            default: return;
        }

        const calculation = `${previousInput} ${operator} ${currentInput} = ${result}`;
        history.push(calculation);
        updateHistory();

        currentInput = result.toString();
        operator = '';
        previousInput = '';
        updateDisplay();
    }

    function handleSpecialFunction(func) {
        if (currentInput === '') return;
        let result;
        const value = parseFloat(currentInput);

        switch (func) {
            case '%':
                result = value / 100;
                break;
            case '√':
                result = Math.sqrt(value);
                 history.push(`√${currentInput} = ${result}`);
                break;
            case 'tax':
                const taxRate = parseFloat(taxRateInput.value) / 100;
                result = value * (1 + taxRate);
                history.push(`${currentInput} + 税(${taxRateInput.value}%) = ${result}`);
                break;
        }
        currentInput = result.toString();
        updateDisplay();
        if (func !== 'tax') {
            history.push(`${currentInput} = ${result}`);
        }
        updateHistory();
    }

    function convertUnits() {
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        const inputValue = parseFloat(currentInput);

        if (isNaN(inputValue)) return;

        let result;
        const conversionRates = {
            // Currency (Example Rates)
            'JPY': 1, 'USD': 0.0068, 'EUR': 0.0063,
            // Length
            'm': 1, 'cm': 100, 'km': 0.001, 'in': 39.3701, 'ft': 3.28084,
            // Weight
            'kg': 1, 'g': 1000, 'lb': 2.20462, 'oz': 35.274,
            // Time
            's': 1, 'min': 1/60, 'hr': 1/3600, 'day': 1/86400,
        };

        const fromRate = getConversionRate(fromUnit);
        const toRate = getConversionRate(toUnit);
        
        // Base unit conversion logic
        const baseValue = inputValue / fromRate;
        result = baseValue * toRate;

        display.textContent = result.toFixed(5);
        history.push(`${inputValue} ${fromUnit} = ${result.toFixed(5)} ${toUnit}`);
        updateHistory();
    }
    
    function getConversionRate(unit) {
        // A more flexible way to handle mixed unit types
        // Currency (Example Rates)
        if (unit === 'JPY') return 1; if (unit === 'USD') return 0.0068; if (unit === 'EUR') return 0.0063;
        // Length
        if (unit === 'm') return 1; if (unit === 'cm') return 100; if (unit === 'km') return 0.001; if (unit === 'in') return 39.3701; if (unit === 'ft') return 3.28084;
        // Weight
        if (unit === 'kg') return 1; if (unit === 'g') return 1000; if (unit === 'lb') return 2.20462; if (unit === 'oz') return 35.274;
        // Time
        if (unit === 's') return 3600; if (unit === 'min') return 60; if (unit === 'hr') return 1; if (unit === 'day') return 1/24;
        return 1;
    }


    function handleFraction() {
        const fraction1 = document.getElementById('fraction1').value;
        const fraction2 = document.getElementById('fraction2').value;
        const operation = document.getElementById('fractionOp').value;

        try {
            const [num1, den1] = fraction1.split('/').map(Number);
            const [num2, den2] = fraction2.split('/').map(Number);

            if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
                display.textContent = 'Invalid Fraction';
                return;
            }

            let resultNum, resultDen;
            switch(operation) {
                case '+':
                    resultNum = num1 * den2 + num2 * den1;
                    resultDen = den1 * den2;
                    break;
                case '-':
                     resultNum = num1 * den2 - num2 * den1;
                    resultDen = den1 * den2;
                    break;
                case '×':
                    resultNum = num1 * num2;
                    resultDen = den1 * den2;
                    break;
                case '÷':
                    resultNum = num1 * den2;
                    resultDen = den1 * num2;
                    break;
            }

            const commonDivisor = gcd(resultNum, resultDen);
            const simplifiedNum = resultNum / commonDivisor;
            const simplifiedDen = resultDen / commonDivisor;
            
            const result = simplifiedDen === 1 ? simplifiedNum.toString() : `${simplifiedNum}/${simplifiedDen}`;
            display.textContent = result;
            history.push(`${fraction1} ${operation} ${fraction2} = ${result}`);
            updateHistory();

        } catch (e) {
            display.textContent = 'Error';
        }
    }

    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }


    // --- Mode Switching ---
    function switchMode(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-specific').forEach(el => el.style.display = 'none');
        calculatorButtons.style.display = 'none';
        clearAll();

        if (mode === 'calculator' || mode === 'sqrt') {
            calculatorButtons.style.display = 'grid';
        } else {
            document.getElementById(`${mode}Mode`).style.display = 'block';
        }
         if (mode === 'sqrt') {
            display.textContent = "数字入力後に√を押して下さい";
        }
    }

    // --- Event Listeners ---
    calculatorButtons.addEventListener('click', e => {
        const target = e.target;
        if (!target.matches('button')) return;

        const { action, value } = target.dataset;

        switch (action) {
            case 'number': handleNumber(value); break;
            case 'operator': handleOperator(value); break;
            case 'calculate': calculate(); break;
            case 'clear-all': clearAll(); break;
            case 'undo': undo(); break;
            case 'special': handleSpecialFunction(value); break;
        }
    });

    modeSelector.addEventListener('change', (e) => switchMode(e.target.value));

    document.getElementById('convertBtn').addEventListener('click', convertUnits);
    document.getElementById('convertLengthBtn').addEventListener('click', convertUnits);
    document.getElementById('convertWeightBtn').addEventListener('click', convertUnits);
    document.getElementById('convertTimeBtn').addEventListener('click', convertUnits);
    document.getElementById('calculateFractionBtn').addEventListener('click', handleFraction);

    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        history = [];
        updateHistory();
    });

    document.getElementById('savePngBtn').addEventListener('click', () => {
         // Temporarily set background to white for the image
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'white';

        html2canvas(document.querySelector('.calculator-container')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'calculator-capture.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Revert background color
            document.body.style.backgroundColor = originalBg;
        });
    });

    // --- Initial Setup ---
    updateDisplay();
    updateHistory();
    switchMode('calculator');
});