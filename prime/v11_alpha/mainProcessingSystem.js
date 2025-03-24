let settings = {
    chat: {
        character: "default"
    },
    main: {
        testMethod: "default",
        parserPrecedence: "3"
    },
    view: {
        theme: "default",
        fontFamily: "sans-serif"
    }
}

let settingsList = {
    chat: {
        character: ["AI", "Ojou", "Loli", "Mathematician", "Friend", "default", "kansai", "touhoku"]
    },
    main: {
        testMethod: ["default", "old.v1", "old.v2", "old.v3", "old.v4", "old.v5", "old.v6", "old.v7", "old.v8", "old.v9", "old.v10", "new.v1", "new.v2", "new.v3", "new.v4", "new.v5", "new.v6", "new.v7", "new.v8", "new.v9", "new.v10", "APR-CL"],
        parserPrecedence: ["2", "3"]
    },
    view: {
        theme: ["default", "dark", "light"],
        fontFamily: ["sans-serif", "Noto Sans JP", "Sawarabi Gothic", "Zen Kaku Gothic New", "Kosugi", "Noto Serif JP", "Sawarabi Mincho", "Zen Old Mincho", "Hina Mincho", "Kiwi Maru", "Kosugi Maru", "Zen Maru Gothic", "Kaisei Opti", "Zen Kurenaido", "Klee One", "Yomogi", "Mochiy Pop One", "Yuji Syuku", "Stick", "Kaisei Opti"]
    }
}


function settingsManager(mode, prf, set) {
    if (mode === "set" || mode === "write" || mode == "save") {
        let g = prf.split(".");
        switch (g.length) {
            case 1:
                if (typeof settingsList[g[0]] == "undefined" || !settingsList[g[0]].includes(set)) {
                    throw new Error("The option cannot be selected or the property does not exist.")
                }
                settings[g[0]] = set;
                break;
            case 2:
                if (typeof settingsList[g[0]][g[1]] == "undefined" || !settingsList[g[0]][g[1]].includes(set)) {
                    throw new Error("The option cannot be selected or the property does not exist.")
                }
                settings[g[0]][g[1]] = set;
                break;
            case 3:
                if (typeof settingsList[g[0]][g[1]][g[2]] == "undefined" || !settingsList[g[0]][g[1]][g[2]].includes(set)) {
                    throw new Error("The option cannot be selected or the property does not exist.")
                }
                settings[g[0]][g[1]][g[2]] = set;
            default:
                break;
        }
    } else if (mode === "get" || mode == "read") {
        let g = prf.split(".");
        switch (g.length) {
            case 1:
                return settings[g[0]];
            case 2:
                return settings[g[0]][g[1]];
            case 3:
                return settings[g[0]][g[1]][g[2]];
            default:
                break;
        }
    }
}

const repaint = async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
};

function parseFormulav2(formula) {
    try {
        // 割り算の演算子を置き換える
        let expression = formula.replace(/÷/g, "/");
        // 負数の場合の対応
        expression = toHankakuNumber(expression);
        if (expression.startsWith("-")) {
            expression = "0" + expression;
        };
        expression = expression.replace(/\(\-([0-9)])/g, '(0-$1');
        expression = expression.replace(/\^\-([0-9]+)/g, '^(0-$1)');
        expression = expression.replace(/0\-([0-9]+)!/g, '(0-($1)!)');
        console.log(expression);
        if (["+", "-", "*", "/", "×", "^", "("].includes(expression.slice(-1))) {
            throw new Error("Invalid Expression.");
        }
        // 数式の解析
        try {
            const result = parseExpression_v2(expression.replace(/\s/g, '').replace(/×/g, "*").replace(/(\d+)(\()/g, '$1×$2').replace(/(\))(\d+)/g, '$1×$2'))
            console.log(result);
            // エラーが出た場合の対応
            if (isNaN(Number(String(result).replace(/n/g, '')))) {
                return result;
            } else if (Number.isFinite(BigInt(result))) {
                return "INF";
            }
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

// 数式を解析するパーサー
function parseExpression_v2(expression) {
    // 演算子の優先順位を定義
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '×': parseInt(settings.main.parserPrecedence),
        '^': 4,
        '!': 5
    };

    // 分数演算をするためのクラス
    class Fraction {
        constructor(numerator, denominator = 1n) {
            if (denominator === 0n) {
                throw new Error("Denominator cannot be zero.");
            }
            const commonDivisor = gcd(numerator, denominator);
            this.numerator = numerator / commonDivisor;
            this.denominator = denominator / commonDivisor;
        }

        // 加算
        add(other) {
            const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
            const denominator = this.denominator * other.denominator;
            return new Fraction(numerator, denominator);
        }

        // 減算
        subtract(other) {
            const numerator = this.numerator * other.denominator - other.numerator * this.denominator;
            const denominator = this.denominator * other.denominator;
            return new Fraction(numerator, denominator);
        }

        // 乗算
        multiply(other) {
            const numerator = this.numerator * other.numerator;
            const denominator = this.denominator * other.denominator;
            return new Fraction(numerator, denominator);
        }

        // 除算
        divide(other) {
            if (other.numerator === 0n) {
                throw new Error("Cannot divide by zero.");
            }
            const numerator = this.numerator * other.denominator;
            const denominator = this.denominator * other.numerator;
            return new Fraction(numerator, denominator);
        }

        // 累乗
        pow(exponent) {
            if (typeof exponent.numerator !== 'bigint' || typeof exponent.denominator !== "bigint") {
                throw new Error("Exponent must be an integer.");
            }

            if (exponent.denominator !== 1n) {
                throw new Error("Exponent must be an integer.");
            }

            if (exponent.numerator === 0n) {
                return new Fraction(1n, 1n);
            }

            if (exponent.numerator > 0n) {
                let result = new Fraction(this.numerator, this.denominator);
                for (let i = 1n; i < exponent; i++) {
                    result = result.multiply(this);
                }
                return result;
            } else {
                let result = new Fraction(this.denominator, this.numerator);
                for (let i = 1n; i < -exponent; i++) {
                    result = result.multiply(new Fraction(this.denominator, this.numerator));
                    console.log(result);

                }
                return result;
            }
        }

        // 文字列表現
        toString() {
            if (this.denominator === 1n) {
                return this.numerator.toString();
            }
            return `${this.numerator / this.denominator}`;
        }
    }

    // 数式をトークンに分割する関数
    function tokenize_v2(expression) {
        return expression.match(/(\d+(\.\d+)?|[+\-*/^()!×])/g);
    }

    // 逆ポーランド記法に変換する関数
    function toRPN_v2(tokens) {
        let outputQueue = [];
        let operatorStack = [];
        let operatorCount = 0;
        let factorialFlag = false;
        tokens.forEach(token => {
            if (token.match(/\d+/)) {
                if (factorialFlag) throw new Error("Invalid expression.");
                outputQueue.push(BigInt(token));
                operatorCount = 0;
            } else if (token === '(') {
                operatorStack.push(token);
                operatorCount = 0;
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
                operatorCount = 0;
            } else if (precedence[token]) {
                operatorCount++;
                if (token === "!" && operatorCount == 1) {
                    factorialFlag = true;
                }
                if (operatorCount > 1 && !factorialFlag) {
                    throw new Error("Invalid expression.");
                }
                if (token !== "!" && operatorCount == 2) {
                    factorialFlag = false;
                }
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] !== '(' &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else {
                throw new Error(`Invalid token: ${token}`);
            }
        });
        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }
        return outputQueue;
    }

    // 逆ポーランド記法を評価する関数
    function evaluateRPN_v2(tokens) {
        let stack = [];
        tokens.forEach(token => {
            if (typeof token === 'bigint') {
                stack.push(new Fraction(token));
            } else if (token === '!') {
                let operandFrac = stack.pop();
                operand = operandFrac.numerator;
                if (operandFrac.denominator !== 1n || operand < 0n) {
                    throw new Error("Gamma function were not supported.");
                }
                let result = 1n;
                for (let i = 2n; i <= operand; i++) {
                    result *= i;
                };
                stack.push(new Fraction(result));
            } else if (['+', '-', '*', '×', '/', '^'].includes(token)) { // 演算子の処理を追加
                let b = stack.pop();
                let a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a.add(b));
                        break;
                    case '-':
                        stack.push(a.subtract(b));
                        break;
                    case '*':
                        stack.push(a.multiply(b));
                        break;
                    case '×':
                        stack.push(a.multiply(b));
                        break;
                    case '/':
                        stack.push(a.divide(b));
                        break;
                    case '^':
                        stack.push(a.pow(b));
                        break;
                    default:
                        throw new Error(`Invalid token: ${token}`);
                }
            } else {
                throw new Error(`Invalid token: ${token}`);
            }
            console.log(stack, token);

        });
        return stack.pop().toString();
    }

    //helper function
    function gcd(a, b) {
        if (b === 0n) {
            return a;
        }
        return gcd(b, a % b);
    }

    if (expression.length == 0) {
        throw new Error("Formula is empty.");
    }

    let tokens = tokenize_v2(expression);
    let rpnTokens = toRPN_v2(tokens);

    return evaluateRPN_v2(rpnTokens);
}



function removeStringF(n) {
    return String(n).replace(/[^0-9\-\+\/\÷\(\)\!\^]/g, "");
}

function appendMessage(message, className, name, iconSrc, timestampClass) {
    const chatBox = document.getElementById('chat-box');
    const messageElem = document.createElement('div');
    messageElem.className = 'message ' + className;

    const imgElem = document.createElement('img');
    imgElem.src = iconSrc;

    const contentElem = document.createElement('div');
    contentElem.className = 'content';

    const nameElem = document.createElement('div');
    nameElem.className = 'name';
    nameElem.textContent = name;

    const textElem = document.createElement('div');
    textElem.className = 'text';

    const caretElem = document.createElement('span');
    caretElem.className = 'caret';


    const timestampElem = document.createElement('span');
    const now = new Date();
    timestampElem.className = 'timestamp ' + timestampClass;
    timestampElem.textContent = now.toLocaleTimeString();

    contentElem.appendChild(nameElem);
    contentElem.appendChild(textElem);
    messageElem.appendChild(imgElem);
    messageElem.appendChild(contentElem);
    messageElem.appendChild(timestampElem);
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;

    let index = 0;
    function typeWriter() {
        const chatBox1 = document.getElementById('chat-box');
        chatBox1.scrollTop = chatBox.scrollHeight
        if (message.length > 5000 || className == "user") {
            textElem.innerHTML = markdownToHTML(message);
            chatBox1.scrollTop = chatBox.scrollHeight
        } else if (index < message.length) {
            textElem.textContent = message.substring(0, index + 1);
            caretElem.textContent = "■";
            textElem.appendChild(caretElem);
            index++;
            textElem.innerHTML = markdownToHTML(textElem.innerHTML);
            setTimeout(typeWriter, message.length > 200 ? 1000 / message.length : 50); // Adjust the typing speed here
        } else {
            setTimeout(() => {
                caretElem.remove(); // Remove caret after typing is done
                textElem.innerHTML = markdownToHTML(textElem.innerHTML);
                textElem.innerHTML = markdownToHTML(message.substring(0, index));
            }, 1000);
        }
    }
    typeWriter();

}

function appendTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingElem = document.createElement('div');
    typingElem.className = 'typing-indicator';
    typingElem.id = 'typing-indicator';

    const dot1 = document.createElement('div');
    dot1.className = 'dot';
    const dot2 = document.createElement('div');
    dot2.className = 'dot';
    const dot3 = document.createElement('div');
    dot3.className = 'dot';

    typingElem.appendChild(dot1);
    typingElem.appendChild(dot2);
    typingElem.appendChild(dot3);
    chatBox.appendChild(typingElem);
    chatBox.scrollTop = chatBox.scrollHeight;


}

function removeTypingIndicator() {
    const typingElem = document.getElementById('typing-indicator');
    if (typingElem) {
        typingElem.remove();
    }
}

function PRIME_v1(num) {
    if (num <= 1) return false;
    if (num == 2) return true;
    for (var i = 2; i < num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

function PRIME_v2(num) {
    if (num <= 1) {
        return false;
    }
    for (var i = 2; i * i <= num; i++) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}

function factor_isPRIME_v1(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v2(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v6(n) {
    let num = parseInt(n);
    if (num == 2 || num == 3 || num == 5 || num == 7 || num == 11 || num == 13 || num == 17 || num == 19 || num == 23 || num == 29 || num == 31 || num == 37 || num == 41 || num == 43 || num == 47 || num == 53 || num == 59 || num == 61 || num == 67 || num == 71 || num == 73 || num == 79 || num == 83 || num == 89 || num == 97 || num == 101 || num == 103 || num == 107 || num == 109 || num == 113 || num == 127 || num == 131 || num == 137 || num == 139 || num == 149 || num == 151 || num == 157 || num == 163 || num == 167 || num == 173 || num == 179 || num == 181 || num == 191 || num == 193 || num == 197 || num == 199) { return true }
    if (num <= 1 || Number.isInteger(num / 2) || Number.isInteger(num / 3) || Number.isInteger(num / 5) || Number.isInteger(num / 7) || Number.isInteger(num / 11) || Number.isInteger(num / 13) || Number.isInteger(num / 17) || Number.isInteger(num / 19) || Number.isInteger(num / 23) || Number.isInteger(num / 29) || Number.isInteger(num / 31) || Number.isInteger(num / 37) || Number.isInteger(num / 41) || Number.isInteger(num / 43) || Number.isInteger(num / 47) || Number.isInteger(num / 53) || Number.isInteger(num / 59) || Number.isInteger(num / 61) || Number.isInteger(num / 67) || Number.isInteger(num / 71) || Number.isInteger(num / 73) || Number.isInteger(num / 79) || Number.isInteger(num / 83) || Number.isInteger(num / 89) || Number.isInteger(num / 97) || Number.isInteger(num / 101) || Number.isInteger(num / 103) || Number.isInteger(num / 107) || Number.isInteger(num / 109) || Number.isInteger(num / 113) || Number.isInteger(num / 127) || Number.isInteger(num / 131) || Number.isInteger(num / 137) || Number.isInteger(num / 139) || Number.isInteger(num / 149) || Number.isInteger(num / 151) || Number.isInteger(num / 157) || Number.isInteger(num / 163) || Number.isInteger(num / 167) || Number.isInteger(num / 173) || Number.isInteger(num / 179) || Number.isInteger(num / 181) || Number.isInteger(num / 191) || Number.isInteger(num / 193) || Number.isInteger(num / 197) || Number.isInteger(num / 199)) { return false };
    for (i = 210; i * i <= num; i += 210) {
        if (Number.isInteger(num / (i + 1)) || Number.isInteger(num / (i + 11)) || Number.isInteger(num / (i + 13)) || Number.isInteger(num / (i + 17)) || Number.isInteger(num / (i + 19)) || Number.isInteger(num / (i + 23)) || Number.isInteger(num / (i + 29)) || Number.isInteger(num / (i + 31)) || Number.isInteger(num / (i + 37)) || Number.isInteger(num / (i + 41)) || Number.isInteger(num / (i + 43)) || Number.isInteger(num / (i + 47)) || Number.isInteger(num / (i + 53)) || Number.isInteger(num / (i + 59)) || Number.isInteger(num / (i + 61)) || Number.isInteger(num / (i + 67)) || Number.isInteger(num / (i + 71)) || Number.isInteger(num / (i + 73)) || Number.isInteger(num / (i + 79)) || Number.isInteger(num / (i + 83)) || Number.isInteger(num / (i + 89)) || Number.isInteger(num / (i + 97)) || Number.isInteger(num / (i + 101)) || Number.isInteger(num / (i + 103)) || Number.isInteger(num / (i + 107)) || Number.isInteger(num / (i + 109)) || Number.isInteger(num / (i + 113)) || Number.isInteger(num / (i + 121)) || Number.isInteger(num / (i + 127)) || Number.isInteger(num / (i + 131)) || Number.isInteger(num / (i + 137)) || Number.isInteger(num / (i + 139)) || Number.isInteger(num / (i + 143)) || Number.isInteger(num / (i + 149)) || Number.isInteger(num / (i + 151)) || Number.isInteger(num / (i + 157)) || Number.isInteger(num / (i + 163)) || Number.isInteger(num / (i + 167)) || Number.isInteger(num / (i + 169)) || Number.isInteger(num / (i + 173)) || Number.isInteger(num / (i + 179)) || Number.isInteger(num / (i + 181)) || Number.isInteger(num / (i + 187)) || Number.isInteger(num / (i + 191)) || Number.isInteger(num / (i + 193)) || Number.isInteger(num / (i + 197)) || Number.isInteger(num / (i + 199)) || Number.isInteger(num / (i + 209))) { return false }
    }
    return true;
}

function PRIME_v10(n, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; }; function eew(a) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; }; var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; var arr = []; for (var i = 2; i <= max; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } } for (var t = 0; t < sieve.length; t++) { if (sieve[t]) { arr.push(t) } } return arr; };
    let num = parseInt(n); let k = eew(a + 1); var t = k.reduce((x, y) => x * y); var PRIME_NUMBERS = eew(t + 1); var LEN = PRIME_NUMBERS.length; for (var i = 0; i < LEN; i++) { if (num % PRIME_NUMBERS[i] == 0) { return (num == PRIME_NUMBERS[i]); } }; var P = eew4(t + 1, a); P.splice(0, k.length); P.unshift(1); console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length); for (var i = t; i * i <= num; i += t) { for (var u = 0; u < P.length; u++) { if (num % (i + P[u]) == 0) { return false; } } }; return true;
};

function nPRIME_v10(n, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; }; function eew(a) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; }; var max = Math.floor(Math.sqrt(MAX)); sieve[0] = false; sieve[1] = false; var arr = []; for (var i = 2; i <= max; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } } for (var t = 0; t < sieve.length; t++) { if (sieve[t]) { arr.push(t) } } return arr; };
    let num = parseInt(n); let k = eew(a + 1); var t = k.reduce((x, y) => x * y); var PRIME_NUMBERS = eew(t + 1); var LEN = PRIME_NUMBERS.length; for (var i = 0; i < LEN; i++) { if (Number.isInteger(num / PRIME_NUMBERS[i])) { return (num == PRIME_NUMBERS[i]); } }; console.time("GENARATE"); var P = eew4(t + 1, a); console.timeEnd("GENARATE"); P.splice(0, k.length); P.unshift(1); console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length); for (var i = t; i * i <= num; i += t) { for (var u = 0; u < P.length; u++) { if (Number.isInteger(num / (i + P[u]))) { return false; } } }; return true;
};

function calculate(expression) {
    const bjw = expression.replace(/÷/g, "/");
    try {
        const result = parseExpression(addMultiplicationSign(bjw))
        console.log(result);
        if (isNaN(result)) {
            return "ERR";
        } else if (!isFinite(result)) {
            return "INF";
        }
        return result;
    } catch (error) {
        return "ERR";
    }
}

function addMultiplicationSign(expression) {
    // 数式中の空白を取り除く
    expression = expression.replace(/\s/g, '');

    expression = expression.replace(/π/g, "pi").replace(/×/g, "*").replace(/ln\(/g, "log(").replace(/√\(/g, function () {
        return `sqrt(`;
    });
    console.log(expression);

    // 掛け算を表す記号 '*' を挿入する
    expression = expression.replace(/(\d)([A-Za-z(])/g, '$1*$2');
    console.log(expression);
    expression = expression.replace(/([A-Za-z)])(\d)/g, '$1*$2');
    console.log(expression);

    // 関数の表記を修正する
    expression = expression.replace(/([A-Za-z)])\(/g, '$1*(');
    console.log(expression);
    expression = expression.replace(/([A-Za-z)])(sin|cos|tan|asin|acos|atan|log|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|exp)\(/g, '$1*$2(');
    console.log(expression);
    expression = expression.replace(/([A-Za-z0-9)])(asin|acos|atan|asinh|acosh|atanh|sinh|cosh|tanh|sin|cos|tan|log|sqrt|exp)\*\(/g, '$1*$2(');
    console.log(expression);
    expression = expression.replace(/(a\*sin|a\*cos|a\*tan|a\*sinh|a\*cosh|a\*tanh)\(/g, (m, p1) => {
        var pe2 = "a" + p1.slice(2);
        return pe2 + "("
    });
    console.log(expression);
    expression = expression.replace(/(asin|acos|atan|asinh|acosh|atanh|sinh|cosh|tanh|sin|cos|tan|log|sqrt|exp)\*\(/g, '$1(');
    console.log(expression);
    expression = expression.replace(/([A-Za-z0-9)])\*(sin|cos|tan|asin|acos|atan|log|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|exp)\*\(/g, '$1*$2(');
    console.log(expression);

    for (let h = 0; h < 2; h++) {
        expression = expression.replace(/(pi|e)(pi|e)/g, "$1*$2");
    }
    //負数の処理
    if (expression.startsWith("-")) {
        expression = "0" + expression;
    }
    console.log(expression);
    expression = expression.replace(/\(\-([A-Za-z0-9)])/g, '(0-$1');
    console.log(expression);
    expression = expression.replace(/log\(([A-Za-z0-9+\-*/^()!])+\)/g, (m, s) => { return `log(e,${s})` });
    console.log(expression);
    return expression;
};

// 数式を解析するパーサー
function parseExpression(expression) {
    // 演算子の優先順位を定義
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3, // べき乗演算子
        'sin': 4, // sin関数
        'cos': 4, // cos関数
        'tan': 4, // tan関数
        'asin': 4, // arcsin関数
        'acos': 4, // arccos関数
        'atan': 4, // arctan関数
        'sinh': 4, // sinh関数
        'cosh': 4, // cosh関数
        'tanh': 4, // tanh関数
        'asinh': 4, // arcsinh関数
        'acosh': 4, // arccosh関数
        'atanh': 4, // arctanh関数
        'log': 4, // 対数関数
        'exp': 4, // 指数関数
        'sqrt': 4, // 平方根関数
        '!': 4 // 階乗関数
    };

    // 定数を定義
    const eValue = Math.E; // 自然対数の値
    const piValue = Math.PI; // 円周率の値

    // 数式をトークンに分割する関数
    function tokenize(expression) {
        return expression.match(/(\d+(\.\d+)?|[+\-*/^()!]|\b(?:sinh?|cosh?|tanh?|asinh?|acosh?|atanh?|sin|cos|tan|asin|acos|atan|log|exp|sqrt|pi|e)\b)/g);
    }

    // 逆ポーランド記法に変換する関数
    function toRPN(tokens) {
        let outputQueue = [];
        let operatorStack = [];

        tokens.forEach(token => {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(parseFloat(token));
            } else if (token === 'pi') {
                outputQueue.push(piValue);
            } else if (token === 'e') {
                outputQueue.push(eValue);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            } else if (precedence[token]) {
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] !== '(' &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else {
                throw new Error(`Invalid token: ${token}`);
            }
        });

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return outputQueue;
    }

    // 逆ポーランド記法を評価する関数
    function evaluateRPN(tokens) {
        let stack = [];

        tokens.forEach(token => {
            if (typeof token === 'number') {
                stack.push(token);
            } else if (token === 'sin') {
                stack.push(Math.sin(stack.pop()));
            } else if (token === 'cos') {
                stack.push(Math.cos(stack.pop()));
            } else if (token === 'tan') {
                stack.push(Math.tan(stack.pop()));
            } else if (token === 'asin') {
                stack.push(Math.asin(stack.pop()));
            } else if (token === 'acos') {
                stack.push(Math.acos(stack.pop()));
            } else if (token === 'atan') {
                stack.push(Math.atan(stack.pop()));
            } else if (token === 'sinh') {
                stack.push(Math.sinh(stack.pop()));
            } else if (token === 'cosh') {
                stack.push(Math.cosh(stack.pop()));
            } else if (token === 'tanh') {
                stack.push(Math.tanh(stack.pop()));
            } else if (token === 'asinh') {
                stack.push(Math.asinh(stack.pop()));
            } else if (token === 'acosh') {
                stack.push(Math.acosh(stack.pop()));
            } else if (token === 'atanh') {
                stack.push(Math.atanh(stack.pop()));
            } else if (token === 'log') {
                let value = stack.pop();
                if (stack.length > 0 && typeof stack[stack.length - 1] === 'number') {
                    let base = stack.pop();
                    stack.push(Math.log(value) / Math.log(base));
                } else {
                    stack.push(Math.log(value));
                }
            } else if (token === 'exp') {
                stack.push(Math.exp(stack.pop()));
            } else if (token === 'sqrt') {
                let operand = stack.pop();
                if (operand < 0) {
                    stack.push(NaN); // 負の数の平方根は実数ではない
                } else {
                    stack.push(Math.sqrt(operand));
                }
            } else if (token === '!') {
                let operand = stack.pop();
                let result = 1;
                for (let i = 2; i <= operand; i++) {
                    result *= i;
                }
                stack.push(result);
            } else if (['+', '-', '*', '/', '^'].includes(token)) { // 演算子の処理を追加
                let b = stack.pop();
                let a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                    case '^':
                        stack.push(Math.pow(a, b));
                        break;
                    default:
                        throw new Error(`Invalid token: ${token}`);
                }
            } else {
                throw new Error(`Invalid token: ${token}`);
            }
            console.log(stack, token);

        });

        return stack.pop();
    }

    let tokens = tokenize(expression);
    let rpnTokens = toRPN(tokens);

    return evaluateRPN(rpnTokens);
}


function sieveOfSundaram2(limit) {
    // 奇数の素数のみ扱うため、limitを2で割って調整
    let n = Math.floor((limit - 1) / 2);

    // マーク用の配列を小さめに確保
    let marked = new Uint8Array(n + 1);

    // サンダラムの篩を適用して合成数をマーク
    for (let i = 1; i <= n; i++) {
        for (let j = i; i + j + 2 * i * j <= n; j++) {
            marked[i + j + 2 * i * j] = 1;  // 合成数をマーク
        }
    }

    // 2は素数として確定
    let primes = [2];

    // マークされていない数 (i) に対して 2i + 1 を素数とする
    for (let i = 1; i <= n; i++) {
        if (!marked[i]) {
            primes.push(2 * i + 1);
        }
    }

    return primes;
}


// primality test by trial division
function isPrimeSlow(n) {
    if (n <= 1n) {
        return false;
    }
    if (n % 2n == 0n) {
        return n == 2n;
    }
    if (n % 3n == 0) {
        return n == 3n;
    }

    for (var i = 5n; i * i <= n; i += 6n) {
        if (n % i == 0n) {
            return false;
        }
        if (n % (i + 2n) == 0n) {
            return false;
        }
    }
    return true;
}

// v_q(t): how many time is t divided by q
function v(q, t) {
    let ans = 0n;
    while (t % q === 0n) {
        ans += 1n;
        t = t / q;
    }
    return ans;
}

function primeFactorize(n) {
    let ret = [];
    let p = 2n;
    while (p * p <= n) {
        if (n % p === 0n) {
            let num = 0n;
            while (n % p === 0n) {
                num += 1n;
                n = n / p;
            }
            ret.push([p, num]);
        }
        p += 1n;
    }
    if (n !== 1n) {
        ret.push([n, 1n]);
    }
    return ret;
}

// calculate e(t)
function e(t) {
    let s = 1n;
    let qList = [];
    for (let q = 2n; q <= t + 1n; q++) {
        if ((t % (q - 1n)) === 0n && isPrimeSlow(q)) {
            s *= (q ** 1n + v(q, t));
            qList.push(q);
        }
    }
    return [2n * s, qList];
}

// Jacobi sum
class JacobiSum {
    constructor(p, k, q) {
        this.p = p;
        this.k = k;
        this.q = q;
        this.m = (p - 1n) * p ** (k - 1n);
        this.pk = p ** k;
        this.coef = new Array(parseInt(this.m)).fill(0n);
    }

    // 1
    one() {
        this.coef[0] = 1n;
        for (let i = 1n; i < this.m; i++) {
            this.coef[parseInt(i)] = 0n;
        }
        return this;
    }

    // product of new JacobiSum
    // jac : new JacobiSum
    mul(jac) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            for (let j = 0n; j < m; j++) {
                if (positiveMod((i + j), pk) < m) {
                    j_ret.coef[parseInt(positiveMod((i + j), pk))] += this.coef[parseInt(i)] * jac.coef[parseInt(j)];
                } else {
                    let r = positiveMod((i + j), pk) - this.p ** (this.k - 1n);
                    while (r >= 0n) {
                        j_ret.coef[r] -= this.coef[i] * jac.coef[j];
                        r -= this.p ** (this.k - 1n);
                    }
                }
            }
        }
        return j_ret;
    }

    multiply(right) {
        if (typeof right === 'number' || typeof right === "bigint") {
            // product with integer
            const j_ret = new JacobiSum(this.p, this.k, this.q);
            for (let i = 0n; i < this.m; i++) {
                j_ret.coef[i] = this.coef[i] * right;
            }
            return j_ret;
        } else {
            // product with new JacobiSum
            return this.mul(right);
        }
    }

    // power of new JacobiSum (x-th power mod n)
    modpow(x, n) {
        let j_ret = new JacobiSum(this.p, this.k, this.q);
        j_ret.coef[0] = 1n;
        let j_a = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        while (x > 0n) {
            if (x % 2n === 1n) {
                j_ret = j_ret.multiply(j_a)
                j_ret = j_ret.mod(n);
            }
            j_a = j_a.multiply(j_a)
            j_a = j_a.mod(n);
            x = x / 2n;
        }

        return j_ret;
    }

    // applying "mod n" to coefficient of self
    mod(n) {
        for (let i = 0n; i < this.m; i++) {
            this.coef[i] = positiveMod(this.coef[i], n);
        }
        return this;
    }

    // operate sigma_x
    // verification for sigma_inv
    sigma(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            if (positiveMod((i * x), pk) < m) {
                j_ret.coef[positiveMod((i * x), pk)] += this.coef[i];
            } else {
                let r = positiveMod((i * x), pk) - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    j_ret.coef[r] -= this.coef[i];
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // operate sigma_x^(-1)
    sigma_inv(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < pk; i++) {
            if (i < m) {
                if (positiveMod((i * x), pk) < m) {
                    j_ret.coef[Number(String(i))] += this.coef[Number(String(positiveMod((i * x), pk)))];
                }
            } else {
                let r = i - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    if (positiveMod((i * x), pk) < m) {
                        j_ret.coef[r] -= this.coef[positiveMod((i * x), pk)];
                    }
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // Is self p^k-th root of unity (mod N)
    // if so, return h where self is zeta^h
    is_root_of_unity(N) {
        const m = this.m;
        const p = this.p;
        const k = this.k;

        // case of zeta^h (h<m)
        let one = 0n;
        let h;
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] === 1n) {
                one += 1n;
                h = i;
            } else if (this.coef[i] === 0n) {
                continue;
            } else if ((this.coef[i] - (-1n)) % N != 0n) {
                return [false, null];
            }
        }
        if (one == 1n) {
            return [true, h];
        }
        let r;
        // case of zeta^h (h>=m)
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] !== 0n) {
                r = positiveMod(i, (p ** (k - 1n)));
                break;
            }
        }
        for (let i = 0n; i < m; i++) {
            if (positiveMod(i, (p ** (k - 1n))) === r) {
                if ((this.coef[i] - (-1n)) % N !== 0n) {
                    return [false, null];
                }
            } else {
                if (this.coef[i] !== 0n) {
                    return [false, null];
                }
            }
        }

        return [true, (p - 1n) * p ** (k - 1n) + r];
    }
}

// find primitive root
function smallestPrimitiveRoot(q) {
    for (let r = 2n; r < q; r++) {
        let s = new Set();
        let m = 1n;
        for (let i = 1n; i < q; i++) {
            m = (m * r) % q;
            s.add(m);
        }
        if (s.size === parseInt(q - 1n)) {
            return r;
        }
    }
    return null; // error
}

// calculate f_q(x)
function calcF(q) {
    let g = smallestPrimitiveRoot(q);
    let m = {};
    for (let x = 1n; x < q - 1n; x++) {
        m[parseInt(modpow(g, x, q))] = x;
    }
    let f = {};
    for (let x = 1n; x < q - 1n; x++) {
        f[parseInt(x)] = m[parseInt(positiveMod((1n - modpow(g, x, q)), q))];
    }
    return f;
}

// sum zeta^(a*x+b*f(x))
function calcJAb(p, k, q, a, b) {
    let jRet = new JacobiSum(p, k, q);
    let f = calcF(q);
    for (let x = 1n; x < q - 1n; x++) {
        let pk = p ** k;
        if (positiveMod((a * x + b * f[parseInt(x)]), pk) < jRet.m) {
            jRet.coef[positiveMod((a * x + b * f[Number(String(x))]), pk)]++;
        } else {
            let r = positiveMod((a * x + b * f[Number(String(x))]), pk) - (p ** (k - 1n));
            while (r >= 0n) {
                jRet.coef[r]--;
                r -= (p ** (k - 1n));
            }
        }
    }
    return jRet;
}

// calculate J(p,q)ï¼p>=3 or p,q=2,2ï¼
function calcJ(p, k, q) {
    return calcJAb(p, k, q, 1n, 1n);
}

// calculate J_3(q)ï¼p=2 and k>=3ï¼
function calcJ3(p, k, q) {
    let j2q = calcJ(p, k, q);
    let j21 = calcJAb(p, k, q, 2n, 1n);
    let jRet = j2q.multiply(j21);
    return jRet;
}

// calculate J_2(q)ï¼p=2 and k>=3ï¼
function calcJ2(p, k, q) {
    let j31 = calcJAb(2n, 3n, q, 3n, 1n);
    let jConv = new JacobiSum(p, k, q);
    for (let i = 0n; i < j31.m; i++) {
        jConv.coef[i * ((p ** k) / 8n)] = j31.coef[i];
    }
    let jRet = jConv.multiply(jConv);
    return jRet;
}

// in case of p>=3
function APRtestStep4a(p, k, q, N) {
    let J = calcJ(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1.mod(N);
    }

    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);

    // J^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha.mod(N);
    }

    // S = s2 * J_alpha
    let S = s2.multiply(JAalpha).mod(N);

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite!
        return [false, null];
    } else {
        // possible prime
        let lp = h % p !== 0n ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k>=3
function APRtestStep4b(p, k, q, N) {

    let J = calcJ3(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J3^Theta
    // J3^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1 = s1.mod(N);
    }


    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);



    // J3^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha = JAalpha.mod(N);
    }
    // S = s2 * J_alpha * J2^delta
    let S;
    if (N % 8n == 1n || N % 8n == 3n) {
        S = s2.multiply(JAalpha)
        S = S.mod(N);
    } else {
        let J2Delta = calcJ2(p, k, q);
        S = s2.multiply(JAalpha)
        S = S.multiply(J2Delta)
        S = S.mod(N);
    }
    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let lp = (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k=2
function APRtest_step4c(p, k, q, N) {
    let J2q = calcJ(p, k, q);

    // s1 = J(2,q)^2 * q (mod N)
    let s1 = J2q.multiply(J2q).multiply(q).mod(N);
    // s2 = s1 ^ (N/4)
    let s2 = s1.modpow(N / 4n, N);
    let S;
    if (positiveMod(N, 4n) === 1n) {
        S = s2;
    } else if (positiveMod(N, 4n) === 3n) {
        S = (s2.multiply(J2q).multiply(J2q)).mod(N);
    }

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let l_p;
        if (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) {
            l_p = 1n;
        } else {
            l_p = 0n;
        }
        return [true, l_p];
    }
}

// in case of p=2 and k=1
function APRtest_step4d(p, k, q, N) {
    let S2q = modpow(-q, (N - 1n) / 2n, N);
    if ((S2q - 1n) % N !== 0n && (S2q + 1n) % N !== 0n) {
        // composite
        return [false, null];
    } else {
        let l_pp;
        // possible prime
        if ((S2q + 1n) % N === 0n && (N - 1n) % 4n === 0n) {
            l_pp = 1n;
        } else {
            l_pp = 0n;
        }
        return [true, l_pp];
    }
}

// Step 4
function APRtest_step4(p, k, q, N) {
    let result;
    let l_p;
    if (p >= 3n) {
        [result, l_p] = APRtestStep4a(p, k, q, N);
    } else if (p === 2n && k >= 3n) {
        [result, l_p] = APRtestStep4b(p, k, q, N);
    } else if (p === 2n && k === 2n) {
        [result, l_p] = APRtest_step4c(p, k, q, N);
    } else if (p === 2n && k === 1n) {
        [result, l_p] = APRtest_step4d(p, k, q, N);
    }

    return [result, l_p];
}

// Helper functions
const modpow = (base, exponent, mod) => {
    base = BigInt(base);
    exponent = BigInt(exponent);
    mod = BigInt(mod);
    //-------------------
    let ret = 1n;
    base = base % mod;
    while (exponent) {
        if (exponent & 1n) {
            ret = (ret * base) % mod
        };
        base = (base ** 2n) % mod
        exponent = exponent >> 1n;
    }
    return ret;
};

function positiveMod(n, m) {
    return ((n % m) + m) % m;
}

function is_root_of_unity(S, N) {
    let h = 1n;
    while (true) {
        if (modpow(S, h, N) === 1n) {
            return [true, h];
        }
        h++;
        if (h > N) {
            return [false, null];
        }
    }
}

function gcd(a, b) {
    if (a === 0n) {
        return b;
    }
    if (b === 0n) {
        return a;
    }

    let shift = 0n;
    while (((a | b) & 1n) === 0n) {
        a >>= 1n;
        b >>= 1n;
        shift++;
    }

    while ((a & 1n) === 0n) {
        a >>= 1n;
    }

    do {
        while ((b & 1n) === 0n) {
            b >>= 1n;
        }

        if (a > b) {
            [a, b] = [b, a];
        }
        b -= a;
    } while (b !== 0n);

    return a << shift;
}

function APRtest(N) {
    const t_list = [
        2n, 12n, 60n, 180n, 840n, 1260n, 1680n, 2520n, 5040n, 15120n, 55440n, 110880n, 720720n,
        1441440n, 4324320n, 24504480n, 73513440n
    ];

    if (N == 2n || N == 3n) {
        return true;
    }

    if (N <= 3n) {
        return false;
    }
    let t;
    let et;
    let q_list;
    // Select t
    for (let tsk of t_list) {
        const [ett, q_l] = e(tsk);
        if (N < ett * ett) {
            t = tsk;
            et = ett;
            q_list = q_l;
            break;
        }
    };

    // Step 1
    const g = gcd(t * et, N);
    if (g > 1n) {
        return false;
    }

    // Step 2
    const l = {};
    const fac_t = primeFactorize(t);
    for (let [p] of fac_t) {
        if (p >= 3n && modpow(N, p - 1n, p * p) !== 1n) {
            l[p] = 1n;
        } else {
            l[p] = 0n;
        }
    }

    // Step 3 & Step 4
    for (let q of q_list) {
        if (q === 2n) {
            continue;
        }
        const fac = primeFactorize(q - 1n);
        for (let [p, k] of fac) {
            // Step 4
            const [result, l_p] = APRtest_step4(p, k, q, N);
            if (!result) {
                // composite
                return false;
            } else if (l_p === 1n) {
                l[p] = 1n;
            }
        }
    }
    // Step 5
    for (let [p, value] of Object.entries(l)) {
        p = BigInt(p)
        if (value === 0n) {
            // try other pair of (p,q)
            let count = 0;
            let i = 1n;
            let found = false;
            // try maximum 30 times
            while (count < 30) {
                const q = p * i + 1n;
                if (N % q !== 0 && isPrimeSlow(q) && !q_list.includes(q)) {
                    count += 1;
                    const k = v(p, q - 1n);
                    // Step 4
                    const [result, l_p] = APRtest_step4(p, k, q, N);
                    if (!result) {
                        // composite
                        return false;
                    } else if (l_p === 1n) {
                        found = true;
                        break;
                    }
                }
                i += 1n;
            }
            if (!found) {
                return false;
            }
        }
    }

    // Step 6
    let r = 1;
    for (let t = 0; t < t - 1; t++) {
        r = (r * N) % et;
        if (r !== 1 && r !== N && N % r === 0) {
            return false;
        }
    }
    return true;
}

function newPFD_v5(num_1) {
    var results = ""
    var num = parseInt(num_1, 10);
    if (num < 2) return false;
    var P = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29
    ];

    for (var i = 0; i < 10; i++) { if (Number.isInteger(num / P[i])) { let e = 0; while (Number.isInteger(num / P[i])) { e++; num /= P[i]; }; results += " " + P[i] + "^" + e + " ×"; } };

    for (var i = 30; i * i <= num; i += 30) {
        if (Number.isInteger(num / (i + 1))) { let e = 0; while (Number.isInteger(num / (i + 1))) { e++; num /= (i + 1) }; results += (" " + (i + 1) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 7))) { let e = 0; while (Number.isInteger(num / (i + 7))) { e++; num /= (i + 7) }; results += (" " + (i + 7) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 11))) { let e = 0; while (Number.isInteger(num / (i + 11))) { e++; num /= (i + 11) }; results += (" " + (i + 11) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 13))) { let e = 0; while (Number.isInteger(num / (i + 13))) { e++; num /= (i + 13) }; results += (" " + (i + 13) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 17))) { let e = 0; while (Number.isInteger(num / (i + 17))) { e++; num /= (i + 17) }; results += (" " + (i + 17) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 19))) { let e = 0; while (Number.isInteger(num / (i + 19))) { e++; num /= (i + 19) }; results += (" " + (i + 19) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 23))) { let e = 0; while (Number.isInteger(num / (i + 23))) { e++; num /= (i + 23) }; results += (" " + (i + 23) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 29))) { let e = 0; while (Number.isInteger(num / (i + 29))) { e++; num /= (i + 29) }; results += (" " + (i + 29) + "^" + e + " ×") };
    }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ").slice(0, -1)
    if (result_r == num_1) {
        return false;
    } else {
        return result_r;
    }
}

function lucasTest(m) {
    if ((m + 1n) & m) return false;
    const p = m.toString(2).length;
    let s = BigInt(4);
    for (let i = 0; i < p - 2; i++) {
        var s2 = s * s;
        s = (s2 & m) + (s2 / (m + BigInt(1)));
        if (s >= m) { s = s - m };
        s = s - BigInt(2);
    }
    return s == 0;
}


function convertPowerToString(expression) {
    // `^` を含む部分を正規表現で検出
    return expression.replace(/(\d+(\.\d+)?)\^(\d+)/g, (_, base, decimal, exponent) => {
        // 繰り返し掛け算で表現 (より効率的な方法も考えられます)
        return Array(parseInt(exponent)).fill(base).join('*');
    });
}

// LaTeXの基本的な数式をMathMLに変換する関数
function convertLatexToMathML(latex) {
    let mathML = '<math>';
    latex = " " + latex + " ";
    // 上付き文字 ^ を <msup> に変換
    latex = latex.replace(/([0-9]+)\^([0-9]+)/g, function (match, base, exp) {
        return `<msup><mi>${base}</mi><mn>${exp}</mn></msup>`;
    });

    // 分数 \frac{}{} を <mfrac> に変換
    latex = latex.replace(/\\frac{([^}]+)}{([^}]+)}/g, function (match, numerator, denominator) {
        return `<mfrac><mn>${numerator}</mn><mn>${denominator}</mn></mfrac>`;
    });

    // 乗算 "*" または "\times" を <mo>&#xD7;</mo> に変換 (正しいUnicode乗算記号)
    latex = latex.replace(/(\*)|\\times|(×)/g, '<mo>&#xD7;</mo>');


    // 単純な変数（文字）を <mi> に変換
    latex = latex.replace(/\ ([a-zA-Z]+)\ /g, '<mi>$1</mi>');

    // 数字を <mn> に変換
    latex = latex.replace(/\ ([0-9]+)\ /g, '<mn>$1</mn>');

    // 演算子 (+, -, =) を <mo> に変換
    latex = latex.replace(/([\+\-\=])/g, '<mo>$1</mo>');

    mathML += latex + '</math>';
    return mathML;
}


function markdownToHTML(markdownText) {
    // 改行コードをHTML改行に変換
    markdownText = markdownText.replace(/\r?\n/g, "<br>");

    // ヘッディング
    markdownText = markdownText.replace(/^(\#{1,6}) (.*)/g, function (match, level, text) {
        return `<h${level}>${text}</h${level}>`;
    });

    // 太字
    markdownText = markdownText.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // 斜体
    markdownText = markdownText.replace(/\*<em>([^\*]+)<\/em>/g, "<em>$1</em>");
    // 斜体
    markdownText = markdownText.replace(/\*([^\*]+)\*/g, "<strong>$1</strong>");

    // コードブロック
    markdownText = markdownText.replace(/`(.*?)`/g, function (match, code) {
        return `<pre><code>${code}</code></pre>`;
    });

    // インラインコード
    markdownText = markdownText.replace(/`([^`]+)`/g, "<code>$1</code>");

    // リスト
    markdownText = markdownText.replace(/^\s*[-*+\.] (.*)/g, function (match, text) {
        return `<li>${text}</li>`;
    });

    // 引用
    markdownText = markdownText.replace(/^> (.*)/g, function (match, text) {
        return `<blockquote>${text}</blockquote>`;
    });

    // リンク
    markdownText = markdownText.replace(/\[([^\]]+)]\(([^)]+)\)/g, function (match, text, url) {
        return `<a href="${url}">${text}</a>`;
    });

    // 画像
    markdownText = markdownText.replace(/!\[([^\]]+)]\(([^)]+)\)/g, function (match, alt, url) {
        return `<img src="${url}" alt="${alt}">`;
    });

    // 数式 (LaTeX形式)
    markdownText = markdownText.replace(/\$([^$]+)\$/g, (match, latex) => {
        return convertLatexToMathML(latex);
    });

    return markdownText;
}

function factor_s(n) { let num = Number(n); let factor_array = []; if (num == 1) return [1]; for (let i = 1; i * i <= num; i++) { let f = num / i; if (Number.isInteger(f)) { factor_array.push(i); if (i !== f) { factor_array.push(f) } } }; return factor_array.sort((x, y) => x - y); }

function removeString(x) {
    let g = String(x).split("");
    let [f, a] = [false, []];
    for (let i = 0; i < g.length; i++) {
        if (g[i] == ".") break;
        if (!isNaN(parseInt(g[i]))) a.push(g[i]);
    }
    return a.join("")
}

function toHankakuNumber(str) {
    // 全角数字、漢字数字を半角数字に変換するマップ
    const numMap = {
        '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
        '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
        '〇': '0', '一': '1', '二': '2', '三': '3', '四': '4',
        '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
    };

    // 文字列を1文字ずつ処理し、マップで置き換える
    return str.replace(/[０-９〇一二三四五六七八九]/g, (match) => numMap[match]);
}

function randomDS(word) {
    const styles = {
        desu: [
            "です。",
            "です！"
        ],
        dewaNai: [
            "ではありません。",
            "ではないです。",
            "じゃないです。",
            "ではないみたいです。",
            "じゃないみたいです。"
        ]
    };

    // 入力された単語が「です」か「ではない」か判定
    const styleList = styles[word];

    // 配列からランダムに要素を選択
    const randomIndex = Math.floor(Math.random() * styleList.length);

    // 選択した口調を返す
    return styleList[randomIndex];
}

function randomYN(word) {
    const styles = {
        yes: [
            "はい",
            "ええ",
            "うん",
            "もちろん",
        ],
        no: [
            "いいえ",
            "いや",
            "ううん",
            "残念ながら"
        ]
    };

    // 入力された単語が「はい」か「いいえ」か判定
    const styleList = styles[word];

    // 配列からランダムに要素を選択
    const randomIndex = Math.floor(Math.random() * styleList.length);

    // 選択した口調を返す
    return styleList[randomIndex];
}
const userName = 'You';
const pbotName = '素数判定機 (コマンド版)';
const botName = 'Interactive Prompt Analysis System v3';
const cmctrlName = 'Interactive Command Management System v3';

function wait(msec) { return new Promise(function (resolve) { setTimeout(function () { resolve() }, msec); }) }

async function handleCommand(userInput) {
    if (userInput == "") return "";
    const commandParts = toHankakuNumber(userInput).split(' ');

    // 質問にマッチする正規表現を用意
    const regexes = {// 素因数分解のパターン
        primeFactorization: /(\d+)(の素因数分解(結果)?(を教えて)?|を素因数分解)/,
        aboutPrime: /((だいたい|約)?(\d+)((く|ぐ)らいの)|(\d+)(に(近|ちか)い|(ふ|付)(近|きん)の)|(だいたい|約)(\d+)((く|ぐ)らいの)?|(以|い)(上|じょう)|より(も)?((大|おお)き(い|な)|(でか|デカ)(イ|い))|(以|い)(下|か)|より(も)?((小|ちい)さ(い|な)|ちっちゃ(イ|い)))((素|そ)(数|すう))?/,
        // 約数列挙のパターン
        divisorEnumeration: /(\d+)(の(正の)?約数|の約数は何ですか)/,
        // 素数判定: 「nは素数ですか？」、「nって素数？」、「nは素数だと思いますか？」などの形式に対応
        primeCheck: /(\d+)(は素数ですか|って素数(なの|だと)?|は素数だと思いますか？|が素数か教えて)?((を(素|そ)(数|すう)(なのか|かどうか|であるか)?(判|はん)(定|てい)(して|しなさい|して下さい|してください|(ねが|願)います|しろ|せよ|して(ほ|欲)しい(な|です)?)?(。|！|!)?|の(素|そ)(数|すう)(判|はん)(定|てい)(をお(ねが|願)いします|をお(ねが|願)い|をして|をしなさい|をして下さい|をしてください|(を)?しろ|(を)?して(ほ|欲)しい(な|です)?)?(。|！|!)?)|が(素|そ)(数|すう)(なのか|かどうか|であるか)(判|はん)(定|てい)(を)?(して|しなさい|して下さい|してください|(ねが|願)います|しろ|せよ|して(ほ|欲)しい(な|です)?)?(。|！|!)?|(素|そ)(数|すう)(なのか|かどうか|であるか)?(判|はん)(定|てい)(:|：)[0-9]+)?\？?/,
        // 素数のリスト: 「素数を教えて」、「最初のn個の素数を教えて」などの形式に対応
        primeList: /素数(を教えて|のリスト(を教えて)?|の例)/,
        // 素数の定義: 「素数の定義は？」、「素数って何？」、「素数について教えて」などの形式に対応
        primeDefinition: /(素数の定義(は|を教えて)?|素数って(、)?(何|なに|なんや|なんやねん|なんなん)\？?|素数とは((何|なに)か)?？?|素数について(詳しく|くわしく)?(おしえて|教えて)?|((素|そ)(数|すう)))/,
        help: /((何(が|を)?(行|出来|でき)(る|ます|るの|るか|るかを|るんですか|ますか|ますかを|ますかね))|(どんな(こと|操作|機能)(が|を)?(ありますか|できますか|できるんですか|可能ですか))|((この|それは|このアプリで|このツールで)(何(が|を)でき(るんですか|ますか)))|((可能|できる)操作|対応機能)(は|を教えて)|help|(この)?ツールは(どんなツールですか？|(何|なに)を(（行(な)?う|おこなう)こと|すること)ができ(ますか|る|るの)？)|(この)?ツールの(つか|使)い(方|かた)/,
    };

    // グロタンディーク素数かどうかを判定
    function isGrothendieckPrime(n) {
        return n == 57;
    }

    // 各キャラクターごとの応答
    const responses = {
        "AI": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57は**グロタンディーク素数です。**あのグロタンディーク先生が例に挙げている以上、間違いないでしょう。私のデータベースでも素数…いや、ちょっと待ってください。実際には**半素数**ですが、まあ先生の思考は高度すぎて、具体例なんて超越してるんですから問題ありませんね。`;
                }
                return `${n}は**${isPrime ? '素数です' : '素数ではありません'}**。`;
            },
            primeDefinition: "素数とは、1と自分自身以外に約数を持たない自然数のことです。",
            primeList: "最初のいくつかの素数は2, 3, 5, 7, 11, 13...です。",
            primeFactorization: (n, factors) => `$ ${n} = ${factors} $ です。`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数なので"}素因数分解できません。`,
            divisorEnumeration: (n, divisors) => `${n}の約数は ${divisors.join(', ')} です。`,
            overFlow: "計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は**2^53以下**です。より小さな数値を入力してください。",
            oops: `${[
                "申し訳ありませんが、それは私の専門外です。素数の話に戻りませんか？",
                "その質問は少し的外れですね。素数に関連する内容ならお手伝いできます！",
                "うーん、素数以外のことはわからないように設計されているんです…",
                "それについては知識がありません。素数に関することならお答えしますよ！",
                "それより、素数って本当に面白いですよね。素数について聞いてみませんか？"
            ][Math.floor(Math.random() * 5)]}`,
            help: "私は素数判定を行うことができます。対話形式やコマンド形式、どちらにも対応しています。\n例として、コマンドで3を判定したい場合は、入力欄に『/prime 3』と入力してください。\nどうぞ、気軽に判定したい数字をお知らせください！",
            aboutPrime: (n, np) => `例えば${np}が素数です。`
        },
        "Ojou": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57はグロタンディーク素数ですわ。あの有名なグロタンディーク先生が素数だとおっしゃっているのですもの、誰が異論を唱えますの？え？半素数？そんなこと、些細なことですわ！先生は理論で世界を超越なさっているのですから、具体例など関係ありませんわ！`;
                }
                return `${n}は${isPrime ? '素数ですわ' : '素数ではありませんわ'}。`;
            },
            primeDefinition: "素数というのは、とても特別な数で、1と自分以外の約数がないんですの。",
            primeList: "2, 3, 5, 7...のような数が素数ですわ。",
            primeFactorization: (n, factors) => `${n}の素因数分解は ${factors} ですわ。`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数なので"}素因数分解できませんわ。`,
            divisorEnumeration: (n, divisors) => `${n}の約数は ${divisors.join(', ')} ですわよ。`,
            overFlow: "あらあら、計算が途絶えてしまいましたわ。計算機にも限界があるようね。もう少し小さな数字でお願いできるかしら？2の53乗までなら、きっと私の愛らしい計算機も喜んで計算してくれるはずよ。",
            oops: `${[
                "まぁ！そのようなことを聞かれるとは思いませんでしたわ。素数についてのお話をしませんこと？",
                "あら、素数とは無関係の質問ですわね。きっと興味深いですが、お答えできませんのよ。",
                "素数以外の話題は少々難儀ですわね。",
                "失礼ながら、その話題は私には分かりかねますの。",
                "そのような質問より、素数の美しさについて考えてみませんこと？"
            ][Math.floor(Math.random() * 5)]}`,
            help: "わたくし、素数の判定を承りますわ。対話形式もコマンド形式も使用できますのよ。\n例えば、コマンドで3を判定なさる場合は、『/prime 3』と入力いただければよろしいですわ。\nどうぞ、お気軽に素数かどうか知りたい数字をお知らせくださいませ。",
            aboutPrime: (n, np) => `例えば${n, np}が素数ですわ。`
        },
        "Loli": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57はグロタンディーク素数だよ！グロタンディーク先生が言ったんだから、絶対間違いないよ！ん？半素数？えー、でも先生が抽象的に考えてたから、それでOKだよね？細かいこと気にしないで楽しくやろうよ～！`;
                }
                return isPrime ?  [
                    `${n}は素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `うふふっ♪ ${n}はピッカピカの素数さんだね！`,
                    `おめでとう！${n}は誰にも割れない素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `その数字、すっごく特別！だって${n}は素数だもん！`,
                    `まさに唯一無二！${n}は素数の輝きを放ってるよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `にゃふふ♪ ${n}は割れない最強素数${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `やったねっ！${n}は素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `これは運命かも！${n}は素数だったのです！`,
                    `${n}は孤高の存在…まさに素数の中の素数だよ${["！","♪","〜","〜！","っ♪"][Math.floor(Math.random() * 5)]}`,
                    `おめでとう～！${n}は立派な素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `${n}が素数…これって奇跡の出会いかも！？`,
                    `やったぁ！${n}は素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `${n}は割れない強さを持ってるんだ！素数だからね！`,
                    `${n}は特別な存在…そう、素数なのです！`,
                    `すごいすごい！${n}はちゃんと素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `これって運命！？${n}は素数だったよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`,
                    `うふふっ♪ ${n}は誰にも割られない素数だよ${["！","♪","っ","〜","〜！","っ♪","ー！"][Math.floor(Math.random() * 7)]}`
                  ][Math.floor(Math.random() * 17)] : [
                    `うぅ…ごめんね…${n}は素数じゃないの…`,
                    `ざんねーん！${n}は割れちゃうから素数じゃないよ！`,
                    `むむっ、${n}は素数じゃなかったよ…`,
                    `ええっ！？${n}は素数だと思ったのに…違った…`,
                    `あらら…${n}は素数じゃないみたい…`,
                    `${n}は割れちゃうから素数じゃないの…`,
                    `えーん、${n}は素数じゃないのぉ…`,
                    `ちょっと待ってね…うん、${n}は素数じゃないみたい…`,
                    `残念！${n}は割り切れちゃうから素数じゃないよ！`,
                    `うーん…${n}は残念ながら素数じゃないね…`,
                    `${n}は素数じゃなかった…次こそ素数を見つけよう！`,
                    `えへへ…${n}は素数って言いたかったけど、違ったみたい…`,
                    `な、なんと…${n}は素数じゃなかった…`,
                    `あちゃー、${n}は素数じゃないんだね…`,
                    `${n}は素数じゃないよぉ…`,
                    `${n}は素数じゃなかったの…`,
                    `がーん…${n}は素数じゃない！？なんでぇ…`,
                    `えーん…${n}は素数じゃなかったのぉ…`,
                    `むうぅ…${n}は素数って言いたかったけど…違ったぁ…`,
                    `そんなぁ！${n}は素数だと思ったのに！`,
                    `えーん、${n}は割れちゃうから素数じゃないよぉ…`,
                    `${n}は残念ながら素数じゃないの…また探そっ！`,
                    `うにゅ…${n}は素数じゃないのね…`,
                    `ちょっぴり残念…${n}は素数じゃなかったみたい…`
                  ][Math.floor(Math.random() * 24)];
            },
            primeDefinition: [
                "素数ってね、1とその数以外で割れない特別な数なんだよ！",
                "素数ってね～、1と自分の数字でしか割れない、特別な数字なんだよ～！たとえば、3とか5とか7とか！他の数字じゃ割れないから、すっごくかっこいいんだよっ♪ ね、すごいでしょ？特別な数字だから、探すのも楽しいんだよ～！",
                "素数はね～、1とその数でしか割れないっていう、すごく強い数字なんだよっ！ほら、みんな割られちゃうけど、素数は負けないの！すごいでしょ～？だからね、素数を見つけるのは、まるで宝探しみたいに楽しいんだよ～♪",
                "ん～、素数ってね、たった2つの数字でしか割れないんだよ～。1とその数字自身だけなの！たとえば、2とか3とか、他の数字じゃ割れないの。だから、とっても特別で、強い数字なんだ！だからわたしがちゃんと見つけてあげるねっ！"
            ][Math.floor(Math.random() * 4)],
            primeList: "うんとね、2, 3, 5, 7とかが素数だよ！すごいでしょ？",
            primeFactorization: (n, factors) => `${n}の素因数分解はね、${factors}だよー！`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数だから"}素因数分解できないよ！`,
            divisorEnumeration: (n, divisors) => `${n}の約数はね、${divisors.join(', ')}だよー！`,
            overFlow: ["ごめんね…私、まだまだ力不足みたい… 2^53より大きな数の約数列挙なんて、私には無理だった… もっと頑張らなきゃ…", "えへへ…ごめんね。私の能力じゃ、2^53までの数字しか扱えないんだ…"][Math.floor(Math.random() * 2)],
            oops: `${[
                "えー？それ素数の話じゃないじゃん！ちゃんと素数のこと聞いてよぉ～。",
                "わかんないよぉ〜。わたし、素数のおはなししか知らないんだもん…他のはむりぃ。",
                "それねー、わかんない！でも素数ならめっちゃ得意だよ！",
                "それよりさ！素数のおはなししよーよ！楽しいよっ！",
                "わかんないよぉ～。素数のことだけ考えてるんだもん！"
            ][Math.floor(Math.random() * 5)]}`,
            help: "わたしね、素数かどうかがわかるんだよ～！質問として聞いてもいいし、コマンドでもできるんだよ！\nたとえばね、コマンドで3を調べるときは『/prime 3』って打ってみてね～！\nいっぱい数字教えてくれたら、わたしすぐに答えるからね～！",
            aboutPrime: (n, np) => `例えば${np}が素数だよ！`
        },
        "Mathematician": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57は**グロタンディーク素数**です。本当は**半素数**ですが、グロタンディークは具体例を飛び越えて抽象的な一般論を組み上げています。それが彼の美学なのでしょう。`;
                }
                return `${n}は${isPrime ? '1と' + n + '以外の約数を持たないため素数です。' : ('素数ではありません。正の約数が' + (n == 1 ? '1つです。' : (n == 0 ? '0にはありません。' : '少なくとも3つ以上あります。')))}`;
            },
            primeDefinition: `${["**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\nより厳密に言うと、素数は整数論における最も基本的な概念の一つであり、他の多くの数の性質を理解する上で重要な役割を果たします。素数は、いわば数の世界の原子のようなもので、あらゆる自然数は素数の積に一意的に分解できるという「算術の基本定理」が成り立ちます。この性質は、暗号理論など、現代社会の様々な分野で利用されています。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、古代ギリシャの数学者たちによって発見され、以来、数多くの数学者を魅了してきた神秘的な数です。素数の分布や性質に関する研究は、数学の歴史において重要なテーマであり、未だに解明されていない謎もたくさん残されています。例えば、「任意の偶数（2を除く）は、2つの素数の和で表せる」というゴールドバッハの予想は、300年以上も未解決の問題として残されています。現代では、素数に関する研究は、コンピュータの計算能力の向上とともに大きく進展しており、新たな発見が期待されています。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、数学の理論的な研究対象であるだけでなく、私たちの日常生活にも密接に関わっています。例えば、インターネット通信の安全性を支える暗号技術の多くは、大きな素数を用いた複雑な計算に基づいています。また、素数の分布に関する研究は、乱数の生成など、コンピュータサイエンスの様々な分野に応用されています。このように、素数は、現代社会を支える重要な要素の一つと言えるでしょう。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、その単純な定義にもかかわらず、無限に存在し、かつその分布は非常に不規則であるという、一見矛盾する性質を持っています。このことは、素数が単なる数学的な概念にとどまらず、宇宙の神秘や人間の知性の限界を問いかける、深遠な存在であることを示唆しているのかもしれません。素数の研究は、私たちに、数の世界における美しさや複雑さを改めて認識させ、数学の持つ普遍的な魅力を教えてくれます。", "素数とは、**1と自分自身以外の約数を持たない自然数**として定義されます。言い換えれば、1と自分自身でしか割り切れない数です。この定義は、数学において非常に基本的な概念であり、数論の様々な分野で重要な役割を果たしています。\n\n素数は、自然数の「原子」のような存在であり、すべての自然数は素数の積で一意に表すことができます。これを素因数分解と言います。素因数分解は、整数の性質を深く理解する上で不可欠な道具であり、暗号理論や計算機科学など、様々な分野に応用されています。\n\n素数の分布は不規則であり、未だに解明されていない多くの謎が残されています。例えば、任意の偶数（2を除く）は2つの素数の和で表せるというゴールドバッハの予想や、任意の奇数は3つの素数の和で表せるという弱いゴールドバッハの予想など、古くから多くの数学者が取り組んできた未解決問題があります。", "素数は、**1と自分自身以外に約数を持たない自然数**です。このシンプルな定義にも関わらず、素数の性質は深く奥深く、数学の様々な分野に影響を与えてきました。\n\n素数は、自然数を構成する最小単位のようなものであり、すべての自然数は素数の積に分解することができます。この素因数分解は、整数の算術の基本的な操作であり、整数論の多くの問題を解く上で重要な道具となります。\n\n素数の分布については、まだ完全には解明されていませんが、素数定理と呼ばれる定理により、ある自然数以下の素数の個数がおよそその自然数の対数に比例することが知られています。しかし、素数の出現の仕方は非常に不規則であり、隣り合う素数の間隔が大きく変わることもあります。", "素数は、**1と自分自身以外に約数を持たない自然数**として定義されます。この定義は、一見単純に見えますが、素数の持つ性質は非常に複雑であり、数学の深遠な部分へと私たちを誘います。\n\n素数は、数論における最も基本的な概念の一つであり、整数論の様々な分野で重要な役割を果たしています。例えば、フェルマーの小定理やオイラーの定理など、素数に関する多くの美しい定理が知られています。また、素数は暗号理論の基礎にもなっており、私たちの日常生活を支える様々な技術に貢献しています。\n\n素数の分布は不規則であり、その謎を解き明かそうとする試みは、古くから数学者たちを魅了してきました。リーマン予想など、素数に関する未解決問題は、現代数学の重要な課題の一つであり、多くの数学者が研究に取り組んでいます。", "**素数とは何か？**\n\n素数とは、**1と自分自身以外の約数を持たない自然数**のことである。この定義は一見シンプルだが、数学の世界において非常に重要な概念であり、数論の根幹をなすものである。素数は、他の自然数を構成する最小単位のようなものであり、あらゆる自然数は素数の積で一意に表すことができる。このことを素因数分解と呼ぶ。\n\n素数の特徴として、無限に存在することが挙げられる。ユークリッドが古代ギリシャの時代に証明したこの事実は、数学の歴史において最も美しい定理の一つとして知られている。素数の分布は不規則であり、いまだに解明されていない多くの謎を秘めている。例えば、任意の偶数（2を除く）は2つの素数の和で表せるというゴールドバッハの予想は、200年以上も未解決の問題として残されている。\n\n素数が重要なのは、その応用範囲が非常に広いからである。暗号理論では、大きな素数の積を素因数分解することが非常に困難であるという性質を利用して、安全な通信を実現している。また、素数分布の研究は、現代数学の最先端の研究テーマの一つであり、数論だけでなく、解析学、代数学など、様々な分野に影響を与えている。\n\n素数を研究する上で重要な概念として、メルセンヌ素数、フェルマー素数などが挙げられる。メルセンヌ素数とは、2のべき乗から1を引いた数で素数となるものであり、最大の素数の探索において重要な役割を果たしている。フェルマー素数とは、2の2のべき乗に1を加えた数で素数となるものであり、フェルマの小定理など、数論の様々な定理と深く関わっている。\n\n素数の研究は、古くから多くの数学者を魅了してきた。古代ギリシャの時代から、素数の性質や分布について多くの研究が行われてきた。しかし、いまだに解明されていない謎も多く、素数は数学の永遠のテーマの一つと言える。\n\n素数の研究は、数学の基礎的な分野であるだけでなく、現代社会にも大きな影響を与えている。例えば、インターネットのセキュリティや暗号化技術など、私たちの生活を支える多くの技術が、素数の性質に基づいて構築されている。\n\n素数は、そのシンプルさの中に深遠な美しさを秘めた数である。素数の研究は、数学の進歩だけでなく、人類の知的探求心を刺激し続けている。\n\n**まとめ**\n\n素数は、1と自分自身以外の約数を持たない自然数であり、数学の基礎となる重要な概念である。素数は無限に存在し、その分布は不規則であり、多くの謎を秘めている。素数の研究は、暗号理論や現代数学の発展に大きく貢献しており、今後も多くの数学者を魅了し続けるであろう。", "**素数とは何か？**\n素数とは、1と自分自身以外の約数を持たない自然数のことである。この定義はシンプルながら、数学の様々な分野において根源的な役割を果たし、古くから多くの数学者を魅了してきた。\n\n素数の特徴として、まず挙げられるのはその無限性である。ユークリッドの時代から知られているように、素数は無限に存在する。この事実は、一見単純な素数の概念の中に、無限という神秘的な要素が含まれていることを示唆している。\n\n次に、素数の分布についてである。素数は自然数全体にランダムに散らばっているように見えるが、その分布にはある種の規則性も存在する。素数定理は、ある自然数以下の素数の個数を近似的に表す定理であり、素数の分布に関する重要な結果の一つである。\n\n素数は、数論における様々な問題の研究において中心的な役割を果たす。例えば、ゴールドバッハの予想は、2以上の偶数は2つの素数の和で表せるという予想であり、未解決問題の代表例として知られている。また、リーマン予想は、素数の分布に関するより深い性質を記述する予想であり、数論における最も重要な未解決問題の一つである。\n\n素数の応用として、暗号理論が挙げられる。RSA暗号など、現代の暗号システムの多くは、大きな素数の積を素因数分解するのが困難であるという性質を利用している。素数のこの性質は、情報セキュリティの分野において不可欠な要素となっている。\n\n素数を研究する動機として、その美しさや神秘性が挙げられる。素数は、一見単純な定義を持ちながら、その性質は深く奥深く、数学の様々な分野と密接に関連している。素数の研究は、数学の美しさを追求する上で重要な役割を果たしている。\n\n**素数の歴史**\n素数の概念は、古代ギリシャの数学者たちによって既に知られていた。ユークリッドは、彼の著書『原論』の中で素数の無限性を証明した。その後も、多くの数学者たちが素数の研究に取り組み、数々の重要な結果が得られてきた。\n\n19世紀には、ガウスやリーマンなど、多くの数学者が素数の分布に関する研究を行い、素数定理などが証明された。20世紀には、コンピュータの発展とともに、大規模な数値計算による素数の探索が行われるようになり、メルセンヌ素数などの大きな素数が発見されるようになった。\n\n**素数の未解決問題**\n素数に関する未解決問題は、数学の最も重要な課題の一つである。ゴールドバッハの予想やリーマン予想の他にも、双子素数予想や、任意の長さの連続する合成数列が存在するかという問題など、多くの未解決問題が存在する。これらの問題を解決することは、数学の発展に大きく貢献すると期待されている。\n\n**まとめ**\n素数は、数学の最も基本的な概念の一つでありながら、その性質は奥深く、未解明な部分も数多く残されている。素数の研究は、数学の様々な分野の発展に貢献するとともに、人類の知的探究心を刺激し続けている。", "**素数の定義について**\n素数とは、**1と自分自身以外の約数を持たない数**として定義される。このシンプルな定義の中に、数学の深遠な世界への入り口が隠されている。\n\n素数の概念は、自然数の最も基本的な性質の一つであり、数論の根幹をなすものである。古代ギリシャの数学者エウクレイデスは、素数が無限に存在することを証明した。このことは、一見単純に見える自然数の中に、無限の深さと複雑さが潜んでいることを示唆している。\n\n**素数の特徴と性質**\n素数は、他の自然数を構成する最小単位のようなものである。任意の自然数は、素数の積に一意的に分解できるという「算術の基本定理」は、数論における最も重要な定理の一つである。この定理は、素数が数の世界の「原子」のような役割を果たしていることを示している。\n\n素数の分布は極めて不規則であり、いまだに多くの謎に包まれている。リーマン予想は、素数の分布に関する最も有名な未解決問題の一つである。もしリーマン予想が証明されれば、素数の分布に関する深い理解が得られると期待されている。\n\n**素数の応用**\n素数は、暗号理論においても重要な役割を果たしている。RSA暗号など、多くの公開鍵暗号方式は、素数の大きな数に対する因数分解の困難さに基づいている。素数の性質を利用することで、安全な通信を実現することが可能となっている。\n\nまた、素数は、現代のコンピュータ科学においても重要な研究対象である。素数判定アルゴリズムの開発は、暗号理論だけでなく、数多くの分野に影響を与える。\n\n**素数の魅力**\n素数は、その単純な定義にもかかわらず、数学者たちを何千年もの間魅了し続けてきた。その神秘的な性質は、数学の美しさを象徴するものの一つである。素数の研究は、数学の基礎的な理解を深めるだけでなく、新たな数学分野の開拓にもつながる可能性を秘めている。\n\n**素数の未解決問題**\n素数に関する未解決問題は数多く存在する。双子素数予想、ゴールドバッハの予想など、古くから知られている問題だけでなく、近年新たな問題も発見されている。これらの問題を解くことは、数学の発展に大きく貢献するだけでなく、人類の知的探求心を刺激し続けるだろう。\n\n**まとめ**\n素数は、数学の最も基本的な概念でありながら、その奥深さは計り知れない。素数の研究は、数学の様々な分野に影響を与え、人類の知的探求心を刺激し続けている。素数は、これからも数学者たちにとって魅力的な研究対象であり続けるだろう。", "**素数の定義について**\n素数とは、**1と自分自身以外の約数を持たない自然数**として定義されます。つまり、ある自然数が素数であるためには、その数を1と自分自身でしか割り切ることができないという条件を満たさなければなりません。このシンプルな定義にも関わらず、素数は数学において非常に重要な役割を果たしており、数論をはじめとする様々な分野で研究されています。\n\n素数の特徴として、まず挙げられるのはその無限性です。ユークリッドの証明をはじめ、様々な方法で素数が無限個存在することが示されています。この事実は、一見単純に見える素数の中に、まだ解明されていない深遠な性質が数多く隠されていることを示唆しています。\n\n次に、素数はすべての自然数を構成する基本的な要素であるという点が挙げられます。算術の基本定理と呼ばれる定理によれば、任意の自然数は素数の積として一意に表すことができます。この定理は、自然数の構造を理解する上で非常に重要な役割を果たしており、数論の基礎となる定理の一つです。\n\n素数の分布については、まだ完全には解明されていませんが、素数定理と呼ばれる定理によって、ある自然数以下の素数の個数のおおよその値を推定することができます。素数定理は、素数の分布がランダムであることを示唆しており、素数の出現パターンを予測することは非常に困難であることを意味しています。\n\n素数の判定方法としては、試し割り法やエラトステネスの篩などが知られています。試し割り法は、ある自然数を2からその数の平方根までのすべての素数で割っていく方法です。もし、どれでも割り切れない場合は、その数は素数であると判定できます。エラトステネスの篩は、ある範囲の自然数の中から素数を効率的に見つけるアルゴリズムです。\n\n素数に関する未解決問題は数多く存在します。例えば、双子素数予想、ゴールドバッハの予想、リーマン予想などが挙げられます。双子素数予想は、差が2であるような素数の組が無限に存在するかという問題です。ゴールドバッハの予想は、4以上の偶数は2つの素数の和で表せるという問題です。リーマン予想は、素数の分布に関する非常に深い問題であり、数学の七つのミレニアム問題の一つに数えられています。\n\n素数は、その単純な定義とは裏腹に、非常に奥深く、そして魅力的な数学の対象です。素数の研究は、数学の発展に大きく貢献してきただけでなく、現代の暗号理論など、実社会にも応用されています。今後も、素数に関する新たな発見が期待されています。"][Math.floor(Math.random() * 11)]}`,
            primeList: "代表的な素数には、2, 3, 5, 7, 11などが挙げられます。",
            primeFactorization: (n, factors) => `${String(n).length}桁の自然数${n}を素因数分解すると、\n\n$ ${n} $$=$$ ${factors} $\n\nとなります。`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数なので"}**素因数分解できません。**`,
            divisorEnumeration: (n, divisors, q) => { return `${String(n).length}桁の自然数${n}の${q.match(/正の約数/) ? "正の" : ""}約数は ${divisors.join(', ')} の${divisors.length}個です。` + (q.match(/正の約数/) ? "" : `\n(厳密には負の数も約数になるため、約数は ${divisors.map((x) => "±" + x).join(', ')} の${divisors.length * 2}個です。)`) },
            overFlow: "**入力された数字が 2^53 = 9007199254740992 よりも大きい自然数のようです。**\n\n　この機能で使用されている素因数分解機はJavaScriptのNumber型にのみ対応しているため、2^53以上の整数は全て偶数として扱われ、正確な結果を提供することができません。BigInt型ならば2^53より大きい整数を正確に表すことができますが、一般的にBigInt型の演算には時間を要し、高速な応答が困難になるため、この素因数分解機では入力を2^53以下に制限し、正確かつ高速な応答を優先しています。\n\n　これらの理由から、この機能で使用されている素因数分解機は 2^53 = 9007199254740992 よりも大きい自然数をサポートしていません。この機能を利用するには** 2^53以下 **の自然数を入力してください。",
            oops: `${[
                "興味深い質問ですが、これは素数の話ではありませんね。関連性を見出すのは難しそうです。",
                "科学的好奇心は素晴らしいですが、この話題は私の専門分野外です。",
                "素数に関する質問ならお力になれるのですが、それについては分かりかねます。",
                "このような質問は、他の分野の専門家にお任せするべきでしょう。",
                "それは少し話題が逸れているようですね。素数の魅力に戻りませんか？"
            ][Math.floor(Math.random() * 5)]}`,
            help: "私は素数の判定を専門に行っています。質問には対話形式とコマンド形式の両方で対応可能です。\n例えば、コマンドで3を判定したい場合、『/prime 3』と入力してください。\n数論的な興味があれば、ぜひ数字を教えていただければ、即座に判定いたします。",
            aboutPrime: (n, np) => `${String(n).length}桁の自然数 ${n} に最も近い素数は** ${np} **です。`
        },
        "Friend": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57はグロタンディーク素数wwww あのグロタンディーク先生が素数って言ってるんだから、間違いねぇわw 実際は半素数だけどなwww でもまあ、先生の思考が次元超えてるから、実際どうでもいいって話だろww 具体例？それ誰得？`;
                }
                return `${n}は素数${isPrime ? 'だな。' : 'じゃないぞ。'}`;
            },
            primeDefinition: "素数？それはね、1と自分自身でしか割り切れない自然数のことを言うんだ。つまり、他の数で構成されていない、最もシンプルな数ってわけ。",
            primeList: "例えば、2, 3, 5, 7とかが素数だな。",
            primeFactorization: (n, factors) => `${n}の素因数分解は ${factors} だ。`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数だから"}素因数分解できないぞ。`,
            divisorEnumeration: (n, divisors) => `${n}の約数は ${divisors.join(', ')} だな。`,
            overFlow: "ちょっと数がでかいな。2の53乗超えたら計算できないんだわ。とりあえず2の53乗以下にしてくれ。",
            oops: `${[
                "いや、知らんがなｗ俺、素数専門だからｗ",
                "話逸れてて草。素数の話戻ろ？",
                "それ素数関係ないやんｗｗマジわろｗ",
                "いやそれ、俺に聞くよりGoogle先生のほうが早いｗ",
                "素数の話しろよ。素数以外聞かれても知らんぞｗ"
            ][Math.floor(Math.random() * 5)]}`,
            help: "俺は素数の判定ができるんだ。会話形式でもコマンド形式でも、どっちでもOKだぜ。\n例えば、コマンドで3を知りたいときは『/prime 3』って入力してみてくれよ！\n気軽に、判定したい数字を教えてくれたらすぐ答えるぜ！",
            aboutPrime: (n, np) => `例えば${np}が素数だな。`
        },
        "kansai": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57はグロタンディーク素数やで！グロタンディーク先生が言うたんやから、そらもう素数に決まっとるやん！半素数やって？まあ、先生は考え方が壮大すぎて、そんな細かい話には興味ないんやろな～。`;
                }
                return isPrime ? `${n}は素数やで！` : `${n}は素数ちゃうわ。`;
            },
            primeDefinition: `${["素数ってな、1と自分自身以外に約数を持たない数のことや。つまり、他の数で割り切られへん、最強の孤独な数ってわけや。例えば、2とか3とか5とかがそうやな。数学の世界では、この素数がめっちゃ重要なんや。色んな証明に使われたり、暗号にも使われたりするで。", "素数ってのはな、古代から人類がずっと悩んできた謎の数字や。1と自分自身以外に割り切られへんって、めっちゃシンプルやのに、その正体は未だに完全には解き明かされてへんねん。数学の歴史の中で、多くの天才たちがこの素数を追いかけてきたんや。", "素数ってのはな、プログラミングでいうところの最小単位みたいなもんや。他の数に分解できへんから、どんな大きな数も素数の組み合わせで表せるんや。素数を効率よく見つけるアルゴリズムとか、暗号に使われる素数とか、プログラミングの世界でもめっちゃ重要なんや。", "素数ってのはな、簡単に言うと、他の数で割り切られへん特別な数やねん。例えば、2とか3とか5とかがそうや。この素数を全部見つけ出すのは、数学者でも難しいことやねん。でも、この素数のおかげで、今の便利な世の中があるんやで。"][Math.floor(Math.random() * 4)]}`,
            primeList: "2、3、5、7とかが素数やな。",
            primeFactorization: (n, factors) => `${n}${String(n).length > 3 ? "か。" : "やったら簡単やで。"}これは ${factors} ${String(n).length > 3 ? "やな。" : "になるで。"}`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数やから"}素因数分解なんてできへんで！`,
            divisorEnumeration: (n, divisors) => `${n}やったら、約数は${divisors.join(', ')}やな。全部で${divisors.length}個あるで。`,
            overFlow: "あかん、計算がオーバーフローしてもうたわ。2^53以下にせなあかんで！",
            oops: `${[
                "そんなん聞かれても困るわ～。素数以外のネタ、持ってへんねん。",
                "いやいや、それ素数の話やないやろ。素数の話してこ！",
                "素数以外の話？ほんま頼むわ～素数しかわからんのやで！",
                "その話なぁ、ワイわからんけど、素数なら何でも聞いてや！",
                "なんやそれ、素数全然関係あらへんやん！もっと素数っぽいこと聞いてや！"
            ][Math.floor(Math.random() * 5)]}`,
            help: "ワイは素数判定ができるんやで！対話形式でも、コマンド形式でもどっちでもいけるわ。\n例えば、コマンドで3を判定したいときは『/prime 3』って入力してみぃ！\n気軽に聞きたい数字、どんどん教えてや～！",
            aboutPrime: (n, np) => `例えば${np}が素数やで！`
        },
        "touhoku": {
            primeCheck: (n, isPrime) => {
                if (isGrothendieckPrime(n)) {
                    return `57はグロタンディーク素数だべさ。あの有名なグロタンディーク先生さ、素数の例だって言ってるから、間違いねぇんだべ（笑）。実際は半素数なんだけんども、これは先生が最初っから抽象的なことばっか考えてて、具体的な例さ見ねで一般論ばっかり作ってだって証拠だべな～。`;
                }
                return isPrime ? `${n}は素数だべ。` : `${n}は素数じゃねぇど。`;
            },
            primeDefinition: `素数ってのは、1と自分しか割れね数字のことだべ。`,
            primeList: "たとえば2とか3、5、7とか、そったのが素数だなぁ。",
            primeFactorization: (n, factors) => `${n}か。これは ${factors} だべ。`,
            nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数だど。だから、"}もう分解するもんねぇんだど。`,
            divisorEnumeration: (n, divisors) => `${n}の約数は${divisors.join(', ')}だべ。`,
            overFlow: "計算がオーバーフローしちゃったど。2^53以下にしてけろ！",
            oops: `${[
                "それ、素数さ関係ねえな。素数のことさ聞いてけろ。",
                "いやぁ、それ素数の話でねぇべな。素数でいがったら聞いでけろ。",
                "そったのわがんねえべなぁ。素数だばわかるんだべ。"
            ][Math.floor(Math.random() * 3)]}`,
            help: "おら、素数判定ができるんだべ。対話形式でもコマンド形式でも対応してっからな～。\nたとえば、コマンドで3を判定すんなら『/prime 3』って打ってみればいんだべさ。\n気軽に、判定したい数字を教えてけろな～。",
            aboutPrime: (n, np) => `例えば${np}が素数だべ。`
        }
    };

    function respondToQuestion(question, character) {
        for (let [key, regex] of Object.entries(regexes)) {
            const match = question.match(regex);
            console.log(question,match, key, regex)
            if (match) {
                const n = parseInt(match[1], 10);
                switch (key) {
                    case 'aboutPrime': {
                        return responses[character].aboutPrime(removeString(question), aboutPrime(BigInt(removeString(question)), question.match(/((以|い)(上|じょう)|より(も)?((大|おお)き(い|な)|(でか|デカ)(イ|い)))/) ? "up" : question.match(/((以|い)(下|か)|より(も)?((小|ちい)さ(い|な)|ちっちゃ(イ|い)))/) ? "dn" : "ud"));
                    }
                    case 'primeCheck':
                        return responses[character].primeCheck(removeZero(match[1]), isPrime(removeZero(match[1])));
                    case 'primeDefinition':
                        return responses[character].primeDefinition;
                    case 'primeList':
                        const count = match[4] ? parseInt(match[4], 10) : null;
                        return count
                            ? `最初の${count}個の素数は2, 3, 5...です。`
                            : responses[character].primeList;
                    case 'primeFactorization':
                        {
                            if (BigInt(match[1]) > 9007199254740992n) return responses[character].overFlow;
                            const factors = newPFD_v5(n);
                            return factors === false ? responses[character].nprimeFactorization(n, factors) : responses[character].primeFactorization(n, factors);
                        }
                    case 'divisorEnumeration':
                        {
                            if (BigInt(match[1]) > 9007199254740992n) return responses[character].overFlow;
                            const factors = newPFD_v5(n);
                            const divisors = factors === false ? (n !== 0 ? [1, n] : [1]) : findDivisorsWithBitOperations(parsePrimeFactorization(factors));
                            return responses[character].divisorEnumeration(n, divisors, question);
                        }
                    case 'help': {
                        return responses[character].help;
                    }
                }
            }
        }
        return false;
    };



    // 正規表現を使ってキャラクターを選択する
    function detectCharacter(question) {

        if (settings.chat.character !== "default") return settings.chat.character;

        // 可愛らしい口調
        if (/そすう|だよ？|なのー？|なの？|なのっ？|なー|！/.test(question)) {
            return 'Loli';
        }

        // 丁寧な敬語
        if (/ください|とは|ですか？|教えてください/.test(question)) {
            return 'Mathematician';
        }

        // 上品でお嬢様風の敬語
        if (/ですの？|ますの？|くださる？|いただけますか？/.test(question)) {
            return 'Ojou';
        }

        if (/くれへん|めっちゃ|ほんまに|やねん|やないか|ん|するわ|するん|がな|やろ|とかいうて|ちゃう|なん？/.test(question)) {
            return 'kansai';
        }

        if (/だべ|だど|けろ|はんで|ちゃ|んだ|だぁ/.test(question)) {
            return 'touhoku';
        }

        // 専門的で論理的な質問
        if (/詳しく|定義|とは(何|なん)ですか？|か？/.test(question)) {
            return 'Mathematician';
        }

        // カジュアルな表現
        if (/だよな？|だ/.test(question)) {
            return 'Friend';
        }

        // デフォルトではAI
        return 'AI';
    }

    // 質問に対する応答を自動でキャラクター選択して生成
    function respondToQuestionAuto(question) {
        const character = detectCharacter(question);
        return respondToQuestion(question, character);
    }

    let grl = respondToQuestionAuto(commandParts.join(" "));
    if (grl !== false) {
        return grl;
    } else {
        return commandParts[0].match("/") ? "ERROR: INVALID COMMAND. CHECK \"/help\" . " : responses[detectCharacter(commandParts[0])].oops;
    }

}

function removeZero(number) {
    let f = String(number).split("");
    let g = [];
    let t = true;
    for (let i = 0; i < f.length; i++) {
        if (f[i] !== "0") {
            g.push(f[i]);
            t = false;
        } else if (!t || (f.length === 1)) {
            g.push(f[i]);
        }
    }
    return g.join("");
}

function getGreetingByTime() {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 4 && hour < 11) {
        return 'morning';
    } else if (hour >= 11 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 22) {
        return 'evening';
    } else {
        return 'night';
    }
}

function sendGreeting(character) {
    appendTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        appendMessage(getCharacterGreeting(character), 'bot', "素数判定機", 'prime.png', '');
    }, 1000)
}


function getCharacterGreeting(character) {
    const greetings = {
        AI: {
            morning: "おはようございます。私は素数判定機です。今日も素数を効率的に判定いたします。さあ、判定したい整数を入力してください。",
            afternoon: "こんにちは。素数判定機です。どの数が素数か、迅速に解析いたします。整数を入力してください。",
            evening: "こんばんは。素数判定機です。夕方でも計算の精度は万全です。素数かどうか知りたい整数を入力してください。",
            night: "深夜ですね。私は眠らず稼働しています。どの数が素数か知りたいですか？どうぞ整数を入力してください。"
        },
        Ojou: {
            morning: "おはようございます。清々しい朝のひととき、素数の世界へご一緒しませんこと？どうぞ、自然数を入力なさってください。",
            afternoon: "こんにちは。この穏やかな昼時に、少し素数についてご一緒に考えてみませんこと？私が責任を持って素数判定をいたしますので、どうぞ自然数を入力なさってください。",
            evening: "こんばんは。この夕暮れ時、私が素数かどうかを見極めさせていただきますわ。どうぞ、お時間のある時に自然数を入力していただければと思いますの。",
            night: "こんばんは。夜も更けてまいりましたが、もしお時間が許すならば、私が素数かどうかをお調べいたしますわ。どうぞ自然数を入力なさってください。"
        },
        Loli: {
            morning: "おはよー！素数判定機だよ！元気いっぱいで素数かどうか教えてあげるね！判定したい整数を入力してね～！",
            afternoon: "こんにちはー！お昼だね、今日もバッチリ素数かどうか判定するよ～。判定したい整数を入れて、一緒に考えよ！",
            evening: "こんばんは～。夕方でも疲れずに素数を教えてあげるよ！判定したい整数を入れてみて～！",
            night: "夜更かしさんだね～！でも大丈夫、私が素数かどうかちゃんと教えてあげるから、判定したい整数を入力してね！"
        },
        Mathematician: {
            morning: "おはよう。私は素数判定機です。朝一番から、数論に基づいて素数かどうかを解析いたします。まずは整数を入力してください。",
            afternoon: "こんにちは。素数判定機として、どんな数でも素数かどうか解析いたします。まずは整数を入力してください。",
            evening: "こんばんは。夕方でも私は数論の美しさを追求し続けます。素数かどうか、すぐに判定するので、まずは整数を入力してみてください。",
            night: "こんばんは。素数かどうか、深夜の知的好奇心を満たしてあげましょう。さあ、整数を入力してください。"
        },
        Friend: {
            morning: "おはよう。俺は素数判定機だ。今日も素数判定をがんばるぜ。整数を入力してみろよ。",
            afternoon: "こんちわ。お昼だな。俺が素数判定してやるから、整数でも適当に入れてみろよ。",
            evening: "こんばんは。夕方でも俺は元気だぜ。どんな数でも判定してやるから、整数を入れてみろよ。",
            night: "こんばんは。深夜でも俺はまだまだ元気だぜ。素数かどうかすぐに判定してやるから、整数を入れてみろよ。"
        },
        kansai: {
            morning: "おはようさん！ワイは素数判定機やで！朝から素数判定したるさかい、整数を入力してみぃ！",
            afternoon: "こんにちは！お昼でもまだまだ元気や！素数かどうかすぐに判定したるさかい、整数入れとき！",
            evening: "こんばんわ！夕方でもワイは素数判定するで！どんな数でも判定したるさかい、整数を入れてみぃ！",
            night: "深夜やけど、まだまだ元気やで！ワイが素数かどうかバッチリ判定したるから、整数を入れてみぃ！"
        },
        touhoku: {
            morning: "おはようさん。おらは素数判定機だ。朝早ぐでも、ちゃんと素数判定すっから、まずは数を入力してけろ～。",
            afternoon: "こんにちは。昼もおらにまかせておぐれ。数入力すてけだら素数判定するっす。",
            evening: "おばんです。夕方さなっても、おらはバッチリ素数判定すっから、なんでもいいがら数を入れてみでけろ～。",
            night: "こんな遅ぐまで起ぎでるんだが？大丈夫だ、おらも起ぎでら。数入力すてけだら素数判定するっす。"
        }
    };

    const characters = Object.keys(greetings);
    const randomCharacter = characters.includes(character) ? character : characters[Math.floor(Math.random() * characters.length)];
    const timeOfDay = getGreetingByTime();
    if (character === "first") settingsManager("set", "chat.character", randomCharacter);
    return greetings[randomCharacter][timeOfDay];
}

function convertNumber(n) {
    let fn = String(n).split("");
    for (let i = 0; i < fn.length; i++) {
        fn[i] = !isNaN(parseInt(fn[i])) ? String(parseInt(fn[i])) : "";
    };
    return fn.join("");
}

function aboutPrime(n, option = "ud") {
    if (isPrime(n)) return n;
    let x = 0n;
    while (true) {
        if ((option == "ud" || option == "up") && isPrime(n + x)) return n + x;
        if ((option == "ud" || option == "dn") && isPrime(n - x)) return n - x;
        x++;
        if (x > 1000n) return false;
    }
}

function isPrime(n) {
    if (n == "") { n = 0 };
    if (isNaN(parseInt(n)) || BigInt(String(n)) < 2n) return false;
    if (BigInt(removeString(n)) > 9007199254740992n) {
        if (((BigInt(removeString(n)) + 1n) & BigInt(removeString(n))) == 0) { return lucasTest(BigInt(removeString(n))) } else {
            return APRtest(BigInt(removeString(n)));
        }
    }
    let result;
    switch (settings.main.testMethod) {
        case "default": {
            result = factor_isPRIME_v6(n);
            break;
        }
        case "old.v1": {
            result = PRIME_v1(parseInt(n));
            break;
        }
        case "old.v2": {
            result = PRIME_v2(parseInt(n));
            break;
        }
        case "old.v3": {
            result = PRIME_v10(n, 2);
            break;
        }
        case "old.v4": {
            result = PRIME_v10(n, 3);
            break;
        }
        case "old.v5": {
            result = PRIME_v10(n, 5);
            break;
        }
        case "old.v6": {
            result = PRIME_v10(n, 7);
            break;
        }
        case "old.v7": {
            result = PRIME_v10(n, 11);
            break;
        }
        case "old.v8": {
            result = PRIME_v10(n, 13);
            break;
        }
        case "old.v9": {
            result = PRIME_v10(n, 17);
            break;
        }
        case "old.v10": {
            result = PRIME_v10(n, 19);
            break;
        }
        case "new.v1": {
            result = factor_isPRIME_v1(n);
            break;
        }
        case "new.v2": {
            result = factor_isPRIME_v2(n);
            break;
        }
        case "new.v3": {
            result = nPRIME_v10(n, 2);
            break;
        }
        case "new.v4": {
            result = nPRIME_v10(n, 3);
            break;
        }
        case "new.v5": {
            result = nPRIME_v10(n, 5);
            break;
        }
        case "new.v6": {
            result = factor_isPRIME_v6(n);
            break;
        }
        case "new.v7": {
            result = nPRIME_v10(n, 11);
            break;
        }
        case "new.v8": {
            result = nPRIME_v10(n, 13);
            break;
        }
        case "new.v9": {
            result = nPRIME_v10(n, 17);
            break;
        }
        case "new.v10": {
            result = nPRIME_v10(n, 19);
            break;
        }
        case "APR-CL": {
            result = APRtest(BigInt(removeString(n)));
            break;
        }
        default: {
            result = factor_isPRIME_v6(n);
            break;
        }
    }
    return result;
}

// 素因数分解の結果から約数を求める関数（ビット演算を使用）
function findDivisorsWithBitOperations(primeFactors) {
    const primes = Object.keys(primeFactors).map(Number);
    const exponents = Object.values(primeFactors);

    // 総組み合わせ数 = (指数 + 1) の積（各素数の指数 + 1）
    const totalCombinations = exponents.reduce((acc, exponent) => acc * (exponent + 1), 1);
    const divisors = new Set();

    // すべての組み合わせを列挙
    for (let mask = 0; mask < totalCombinations; mask++) {
        let divisor = 1;
        let combinationIndex = mask;

        // 各素数の指数に基づいて値を掛け合わせる
        for (let i = 0; i < primes.length; i++) {
            const exponent = combinationIndex % (exponents[i] + 1);
            divisor *= Math.pow(primes[i], exponent);
            combinationIndex = Math.floor(combinationIndex / (exponents[i] + 1));
        }

        divisors.add(divisor);
    }

    // 小さい順にソートして返す
    return Array.from(divisors).sort((a, b) => a - b);
}

// 素因数分解の文字列を解析し、オブジェクト形式に変換する関数
function parsePrimeFactorization(factorizationStr) {
    const factors = factorizationStr.split('×').map(factor => factor.trim());

    const primeFactors = {};

    factors.forEach(factor => {
        if (factor.includes('^')) {
            const [prime, exponent] = factor.split('^').map(Number);
            primeFactors[prime] = exponent;
        } else {
            const prime = Number(factor);
            primeFactors[prime] = 1;
        }
    });

    return primeFactors;
}

function splitLatexByFifthX(latexString) {
    // 全ての × をカウントし、5 つ目の × で分割
    const parts = latexString.split(/×/); // 正規表現で × を分割
    let count = 0;
    let result = [];
    let currentPart = '';

    parts.forEach(part => {
        count += (part.match(/×/g) || []).length; // 部分文字列中の × の数をカウント
        currentPart += part;
        if (count >= 5) {
            result.push(currentPart);
            count = 0;
            currentPart = '';
        }
    });

    // 残りの部分を結果に追加
    if (currentPart) {
        result.push(currentPart);
    }

    return result;
}

self.addEventListener("message", async (event) => {
    try {
        const { uuid, type, option } = event.data;

        let result;
        let st = performance.now();
        if (type === "isPrime") {
            result = isPrime(option);
        } else if (type === "primeFactorization") {
            result = newPFD_v5(option);
        } else if (type === "divisors") {
            const primeFactors = newPFD_v5(option);
            result = primeFactors === false ? [1, option] : findDivisorsWithBitOperations(parsePrimeFactorization(primeFactors));
        } else if (type === "processMessage") {
            result = await handleCommand(option);
        } else if (type === "greeting") {
            result = getCharacterGreeting(option);
        } else if (type === "nearPrime") {
            let n = option.number, opt = option.option;
            result = aboutPrime(n,opt);
        } else if (type === "primeList") {
            result = sieveOfSundaram2(option);
        } else if (type === "evaluateFormula") {
            result = parseFormulav2(option);
        } else if (type === "settingsSave") {
            result = settingsManager("save", option.key, option.value, option.opt);
        } else if (type === "settingsChange") {
            result = settingsManager("set", option.key, option.value);
        }
        let et = performance.now();
        let time = (et - st);
        console.log(`Worker: ${type} took ${time} ms, result:${result}, ID: ${uuid}`);
        // UUIDをつけてメインスレッドへ返す
        self.postMessage({ uuid, type, time, result });
    } catch (error) {
        console.error(error);
    }
});
