function appendToDisplay(value) {
    const display = document.getElementById('display');
    const lastChar = display.value.slice(-1);

    if ((['+', '-', '*', '/', ""].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) || (lastChar === '.' && value === '.')) {
        return;
    }

    display.value += value;
}

function inputDispValue() {
    document.getElementById('res').value = Number(document.getElementById('display').value);
    openWindow("container1")
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function deleteDisplay() {
    document.getElementById('display').value = document.getElementById('display').value.slice(0, -1);
}

function calculateResult() {
    const display = document.getElementById('display');
    const expression = display.value;

    try {
        const sanitizedExpression = expression.replace(/[^-()\d/*+.^]/g, '');
        const result = Function('"use strict";return (' + sanitizedExpression + ')')();

        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid result');
        }

        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}
