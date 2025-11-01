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
        // console.log(expression);
        if (["+", "-", "*", "/", "×", "^", "("].includes(expression.slice(-1))) {
            throw new Error("Invalid Expression.");
        }
        // 数式の解析
        try {
            const result = parseExpression_v2(expression.replace(/\s/g, '').replace(/×/g, "*").replace(/(\d+)(\()/g, '$1×$2').replace(/(\))(\d+)/g, '$1×$2'))
            // console.log(result);
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
                    // console.log(result);

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
            } else if (['+', '-', '*', '×', '/', '^'].includes(token)) {
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
            // console.log(stack, token);
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

function parseFormulav2Q(formula) {
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
        // console.log(expression);
        if (["+", "-", "*", "/", "×", "^", "("].includes(expression.slice(-1))) {
            throw new Error("Invalid Expression.");
        }
        // 数式の解析
        try {
            const result = parseExpression_v2Q(expression.replace(/\s/g, '').replace(/×/g, "*").replace(/(\d+)(\()/g, '$1×$2').replace(/(\))(\d+)/g, '$1×$2'))
            // console.log(result);
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
function parseExpression_v2Q(expression) {
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
                    // console.log(result);

                }
                return result;
            }
        }

        // 文字列表現
        toString() {
            if (this.denominator === 1n) {
                return this.numerator.toString();
            }
            return `${this.numerator}/${this.denominator}`;
        }
    }

    // 数式をトークンに分割する関数
    function tokenize_v2Q(expression) {
        return expression.match(/(\d+(\.\d+)?|[+\-*/^()!×])/g);
    }

    // 逆ポーランド記法に変換する関数
    function toRPN_v2Q(tokens) {
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
    function evaluateRPN_v2Q(tokens) {
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
            } else if (['+', '-', '*', '×', '/', '^'].includes(token)) {
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
            // console.log(stack, token);
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

    let tokens = tokenize_v2Q(expression);
    let rpnTokens = toRPN_v2Q(tokens);

    return evaluateRPN_v2Q(rpnTokens);
}