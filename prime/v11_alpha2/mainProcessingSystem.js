importScripts("./src/primeFunc.js", "./src/mainFunc.js", "./src/primeFuncMLTI.js", "./src/calcFunc.js", "./src/settingsManager.js");

let settings = {
    chat: {
        character: "AI"
    },
    main: {
        testMethod: "default",
        parserPrecedence: "3",
        threads: "4"
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
        testMethod: ["default", "old.v1", "old.v2", "old.v3", "old.v4", "old.v5", "old.v6", "old.v7", "old.v8", "old.v9", "old.v10", "new.v1", "new.v2", "new.v3", "new.v4", "new.v5", "new.v6", "new.v7", "new.v8", "new.v9", "new.v10", "APR-CL", "APR-CL-MULTI", "MILLER-RABIN"],
        parserPrecedence: ["2", "3"],
        threads: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
    },
    view: {
        theme: ["default", "dark", "light"],
        fontFamily: ["sans-serif", "Noto Sans JP", "Sawarabi Gothic", "Zen Kaku Gothic New", "Kosugi", "Noto Serif JP", "Sawarabi Mincho", "Zen Old Mincho", "Hina Mincho", "Kiwi Maru", "Kosugi Maru", "Zen Maru Gothic", "Kaisei Opti", "Zen Kurenaido", "Klee One", "Yomogi", "Mochiy Pop One", "Yuji Syuku", "Stick"]
    }
}

function settingsManager(mode, prf, set) {
    console.log("SettingsManager", mode, prf, set);
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
        // Save settings to IndexedDB
        setItem("settings", settings).catch(error => {
            console.error("Error saving settings:", error);
        });
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
    } else if (mode === "getAll" || mode == "readALL") {
        return settings;
    }
}

async function firstF() {
    // 初期設定をIndexedDBから読み込む
    await getItem("settings").then(st => {
        if (st) {
            settings = st;
        }
    }).catch(error => {
        console.error("Error loading settings:", error);
        // 初期設定がない場合はデフォルト設定を使用
        settings = {
            chat: {
                character: "default"
            },
            main: {
                testMethod: "default",
                parserPrecedence: "3",
                threads: "4"
            },
            view: {
                theme: "default",
                fontFamily: "sans-serif"
            }
        }
        setItem("settings", settings);
    });
    return JSON.stringify(settings);
}



const repaint = async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
};

function removeStringF(n) {
    return String(n).replace(/[^0-9\-\+\/\÷\(\)\!\^]/g, "");
}

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
            // console.log(stack, token);

        });

        return stack.pop();
    }

    let tokens = tokenize(expression);
    let rpnTokens = toRPN(tokens);

    return evaluateRPN(rpnTokens);
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
    try {
        if (userInput == "") return "";
        const commandParts = toHankakuNumber(userInput).split(' ');

        // 質問にマッチする正規表現
        const regexes = {// 素因数分解のパターン
            primeFactorization: /([0-9+\-*/\^\(\)×÷]+)(の素因数分解(結果)?(を教えて)?|(を|は)素因数分解)/,
            aboutPrime: /((だいたい|約)?([0-9+\-*/\^\(\)×÷]+)((く|ぐ)らいの)|([0-9+\-*/\^\(\)×÷]+)(に(近|ちか)い|(ふ|付)(近|きん)の)|([0-9+\-*/\^\(\)×÷]+)(((く|ぐ)らいの)|(以|い)(上|じょう)|より(も)?((大|おお)き(い|な)|(でか|デカ)(イ|い))|の(まえ|前|後|あと|次|つぎ)の|(以|い)(下|か)|より(も)?((小|ちい)さ(い|な)|ちっちゃい)))((素|そ)(数|すう))?/,
            nthPrime: /([0-9+\-*/\^\(\)×÷]+)((番|ばん)(目|め))/,
            // 約数列挙のパターン
            divisorEnumeration: /([0-9+\-*/\^\(\)×÷]+)(の(約|やく)(数|すう)(を(教|おし)えて)?|(を|は)約数列挙)/,
            // 素数判定のパターン
            primeCheck: /([0-9+\-*/\^\(\)×÷]+)(は素数ですか|って素数(なの|だと)?|は素数だと思いますか？|が素数か教えて)?((を(素|そ)(数|すう)(なのか|かどうか|であるか)?(判|はん)(定|てい)(して|しなさい|して下さい|してください|(ねが|願)います|しろ|せよ|して(ほ|欲)しい(な|です)?)?(。|！|!)?|の(素|そ)(数|すう)(判|はん)(定|てい)(をお(ねが|願)いします|をお(ねが|願)い|をして|をしなさい|をして下さい|をしてください|(を)?しろ|(を)?して(ほ|欲)しい(な|です)?)?(。|！|!)?)|が(素|そ)(数|すう)(なのか|かどうか|であるか)(判|はん)(定|てい)(を)?(して|しなさい|して下さい|してください|(ねが|願)います|しろ|せよ|して(ほ|欲)しい(な|です)?)?(。|！|!)?|(素|そ)(数|すう)(なのか|かどうか|であるか)?(判|はん)(定|てい)(:|：)[0-9+\-*/\^\(\)×÷]+)?\？?/,
            //素数リスト
            primeList: /(素|そ)(数|すう)(を教えて|のリスト(を教えて)?|の例)/,
            // 素数の定義
            primeDefinition: /((素|そ)(数|すう)の定義(は|を教えて)?|(素|そ)(数|すう)って(、)?(何|なに|なんや|なんやねん|なんなん)\？?|(素|そ)(数|すう)とは((何|なに)か)?？?|(素|そ)(数|すう)について(詳しく|くわしく)?(おしえて|教えて)?|((素|そ)(数|すう)))/,
            //　このツールができること
            help: /(((何|なに)(が|を)?(行|出来|でき)(る|ます|るの|るか|るかを|るんですか|ますか|ますかを|ますかね))|(どんな(こと|操作|機能)(が|を)?(ありますか|できますか|できるんですか|可能ですか))|((この|それは|このアプリで|このツールで)((何|なに)(が|を)でき(るんですか|ますか)))|((可能|できる)操作|対応機能)(は|を教えて)|help|(この)?ツールは(どんなツールですか？|(何|なに)を(（行(な)?う|おこなう)こと|すること)ができ(ますか|る|るの)？)|(この)?ツールの(つか|使)い(方|かた)/,
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
                    return `${n}は**${isPrime ? '素数です' + ["。", "！"][Math.floor(Math.random() * 2)] : '素数ではありません。'}**`;
                },
                primeDefinition: "素数とは、1と自分自身以外に約数を持たない自然数のことです。",
                primeList: "最初のいくつかの素数は2, 3, 5, 7, 11, 13...です。",
                primeFactorization: (n, factors) => `$ ${n} = ${factors} $ です。`,
                nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数なので"}素因数分解できません。`,
                divisorEnumeration: (n, divisors) => `${n}の約数は ${divisors.join(', ')} です。`,
                overFlow: "計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は**2^53以下**です。より小さな数値を入力してください。",
                overFlow2: "計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は**1億未満**です。より小さな数値を入力してください。",
                oops: `${[
                    "申し訳ありませんが、それは私の専門外です。素数の話に戻りませんか？",
                    "その質問は少し的外れですね。素数に関連する内容ならお手伝いできます！",
                    "うーん、素数以外のことはわからないように設計されているんです…",
                    "それについては知識がありません。素数に関することならお答えしますよ！",
                    "それより、素数って本当に面白いですよね。素数について聞いてみませんか？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "私は素数判定を行うことができます。対話形式やコマンド形式、どちらにも対応しています。\n例として、コマンドで3を判定したい場合は、入力欄に『/prime 3』と入力してください。\nどうぞ、気軽に判定したい数字をお知らせください！",
                aboutPrime: (n, np) => `例えば${np}が素数です。`,
                nthPrime: (n, np) => `${n}番目の素数は**${np}**です。`,
                error: "処理中にエラーが発生しました。"
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
                overFlow2: "あらあら、計算が途絶えてしまいましたわ。計算機にも限界があるようね。もう少し小さな数字でお願いできるかしら？1億までなら、きっと私の愛らしい計算機も喜んで計算してくれるはずよ。",
                oops: `${[
                    "まぁ！そのようなことを聞かれるとは思いませんでしたわ。素数についてのお話をしませんこと？",
                    "あら、素数とは無関係の質問ですわね。きっと興味深いですが、お答えできませんのよ。",
                    "素数以外の話題は少々難儀ですわね。",
                    "失礼ながら、その話題は私には分かりかねますの。",
                    "そのような質問より、素数の美しさについて考えてみませんこと？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "わたくし、素数の判定を承りますわ。対話形式もコマンド形式も使用できますのよ。\n例えば、コマンドで3を判定なさる場合は、『/prime 3』と入力いただければよろしいですわ。\nどうぞ、お気軽に素数かどうか知りたい数字をお知らせくださいませ。",
                aboutPrime: (n, np) => `例えば${n, np}が素数ですわ。`,
                error: "処理中にエラーが発生しましたわ。"
            },
            "Loli": {
                primeCheck: (n, isPrime) => {
                    if (isGrothendieckPrime(n)) {
                        return `57はグロタンディーク素数だよ！グロタンディーク先生が言ったんだから、絶対間違いないよ！ん？半素数？えー、でも先生が抽象的に考えてたから、それでOKだよね？細かいこと気にしないで楽しくやろうよ～！`;
                    }
                    return isPrime ? [
                        `${n}は素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `うふふっ♪ ${n}はピッカピカの素数さんだね！`,
                        `おめでとう！${n}は誰にも割れない素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `その数字、すっごく特別！だって${n}は素数だもん！`,
                        `まさに唯一無二！${n}は素数の輝きを放ってるよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `やったねっ！${n}は素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `これは運命かも！${n}は素数だったのです！`,
                        `${n}は孤高の存在…まさに素数の中の素数だよ${["！", "♪", "〜", "〜！", "っ♪"][Math.floor(Math.random() * 5)]}`,
                        `おめでとう～！${n}は立派な素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `${n}が素数…これって奇跡の出会いかも！？`,
                        `やったぁ！${n}は素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `${n}は割れない強さを持ってるんだ！素数だからね！`,
                        `${n}は特別な存在…そう、素数なのです！`,
                        `すごいすごい！${n}はちゃんと素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `これって運命！？${n}は素数だったよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
                        `ふふっ♪ ${n}は誰にも割られない素数だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`
                    ][Math.floor(Math.random() * 16)] : [
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
                overFlow2: ["ごめんね…私、まだまだ力不足みたい… １億より大きな数の約数列挙なんて、私には無理だった… もっと頑張らなきゃ…", "えへへ…ごめんね。私の能力じゃ、1億までの数字しか扱えないんだ…"][Math.floor(Math.random() * 2)],
                oops: `${[
                    "えー？それ素数の話じゃないじゃん！ちゃんと素数のこと聞いてよぉ～。",
                    "わかんないよぉ〜。わたし、素数のおはなししか知らないんだもん…他のはむりぃ。",
                    "それねー、わかんない！でも素数ならめっちゃ得意だよ！",
                    "それよりさ！素数のおはなししよーよ！楽しいよっ！",
                    "わかんないよぉ～。素数のことだけ考えてるんだもん！"
                ][Math.floor(Math.random() * 5)]}`,
                help: "わたしね、素数かどうかがわかるんだよ～！質問として聞いてもいいし、コマンドでもできるんだよ！\nたとえばね、コマンドで3を調べるときは『/prime 3』って打ってみてね～！\nいっぱい数字教えてくれたら、わたしすぐに答えるからね～！",
                aboutPrime: (n, np) => `例えば${np}が素数だよ！`,
                error: "うぅ…ごめんね…エラーが出ちゃったみたい…"
            },
            "Mathematician": {
                primeCheck: (n, isPrime) => {
                    if (isGrothendieckPrime(n)) {
                        return `57は**グロタンディーク素数**です。本当は**半素数**ですが、グロタンディークは具体例を飛び越えて抽象的な一般論を組み上げています。それが彼の美学なのでしょう。`;
                    }
                    return `${n}は${isPrime ? '1と' + n + '以外の約数を持たないため**素数です。**' : ('**素数ではありません。**正の約数が' + (n == 1 ? '1つです。' : (n == 0 ? '0にはありません。' : '少なくとも**3つ**以上あります。')))}`;
                },
                primeDefinition: `${["**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\nより厳密に言うと、素数は整数論における最も基本的な概念の一つであり、他の多くの数の性質を理解する上で重要な役割を果たします。素数は、いわば数の世界の原子のようなもので、あらゆる自然数は素数の積に一意的に分解できるという「算術の基本定理」が成り立ちます。この性質は、暗号理論など、現代社会の様々な分野で利用されています。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、古代ギリシャの数学者たちによって発見され、以来、数多くの数学者を魅了してきた神秘的な数です。素数の分布や性質に関する研究は、数学の歴史において重要なテーマであり、未だに解明されていない謎もたくさん残されています。例えば、「任意の偶数（2を除く）は、2つの素数の和で表せる」というゴールドバッハの予想は、300年以上も未解決の問題として残されています。現代では、素数に関する研究は、コンピュータの計算能力の向上とともに大きく進展しており、新たな発見が期待されています。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、数学の理論的な研究対象であるだけでなく、私たちの日常生活にも密接に関わっています。例えば、インターネット通信の安全性を支える暗号技術の多くは、大きな素数を用いた複雑な計算に基づいています。また、素数の分布に関する研究は、乱数の生成など、コンピュータサイエンスの様々な分野に応用されています。このように、素数は、現代社会を支える重要な要素の一つと言えるでしょう。", "**素数とは、2以上の自然数で、1とその数自身以外に正の約数を持たない数のことです。**\n\n素数は、その単純な定義にもかかわらず、無限に存在し、かつその分布は非常に不規則であるという、一見矛盾する性質を持っています。このことは、素数が単なる数学的な概念にとどまらず、宇宙の神秘や人間の知性の限界を問いかける、深遠な存在であることを示唆しているのかもしれません。素数の研究は、私たちに、数の世界における美しさや複雑さを改めて認識させ、数学の持つ普遍的な魅力を教えてくれます。", "素数とは、**1と自分自身以外の約数を持たない自然数**として定義されます。言い換えれば、1と自分自身でしか割り切れない数です。この定義は、数学において非常に基本的な概念であり、数論の様々な分野で重要な役割を果たしています。\n\n素数は、自然数の「原子」のような存在であり、すべての自然数は素数の積で一意に表すことができます。これを素因数分解と言います。素因数分解は、整数の性質を深く理解する上で不可欠な道具であり、暗号理論や計算機科学など、様々な分野に応用されています。\n\n素数の分布は不規則であり、未だに解明されていない多くの謎が残されています。例えば、任意の偶数（2を除く）は2つの素数の和で表せるというゴールドバッハの予想や、任意の奇数は3つの素数の和で表せるという弱いゴールドバッハの予想など、古くから多くの数学者が取り組んできた未解決問題があります。", "素数は、**1と自分自身以外に約数を持たない自然数**です。このシンプルな定義にも関わらず、素数の性質は深く奥深く、数学の様々な分野に影響を与えてきました。\n\n素数は、自然数を構成する最小単位のようなものであり、すべての自然数は素数の積に分解することができます。この素因数分解は、整数の算術の基本的な操作であり、整数論の多くの問題を解く上で重要な道具となります。\n\n素数の分布については、まだ完全には解明されていませんが、素数定理と呼ばれる定理により、ある自然数以下の素数の個数がおよそその自然数の対数に比例することが知られています。しかし、素数の出現の仕方は非常に不規則であり、隣り合う素数の間隔が大きく変わることもあります。", "素数は、**1と自分自身以外に約数を持たない自然数**として定義されます。この定義は、一見単純に見えますが、素数の持つ性質は非常に複雑であり、数学の深遠な部分へと私たちを誘います。\n\n素数は、数論における最も基本的な概念の一つであり、整数論の様々な分野で重要な役割を果たしています。例えば、フェルマーの小定理やオイラーの定理など、素数に関する多くの美しい定理が知られています。また、素数は暗号理論の基礎にもなっており、私たちの日常生活を支える様々な技術に貢献しています。\n\n素数の分布は不規則であり、その謎を解き明かそうとする試みは、古くから数学者たちを魅了してきました。リーマン予想など、素数に関する未解決問題は、現代数学の重要な課題の一つであり、多くの数学者が研究に取り組んでいます。", "**素数とは何か？**\n\n素数とは、**1と自分自身以外の約数を持たない自然数**のことである。この定義は一見シンプルだが、数学の世界において非常に重要な概念であり、数論の根幹をなすものである。素数は、他の自然数を構成する最小単位のようなものであり、あらゆる自然数は素数の積で一意に表すことができる。このことを素因数分解と呼ぶ。\n\n素数の特徴として、無限に存在することが挙げられる。ユークリッドが古代ギリシャの時代に証明したこの事実は、数学の歴史において最も美しい定理の一つとして知られている。素数の分布は不規則であり、いまだに解明されていない多くの謎を秘めている。例えば、任意の偶数（2を除く）は2つの素数の和で表せるというゴールドバッハの予想は、200年以上も未解決の問題として残されている。\n\n素数が重要なのは、その応用範囲が非常に広いからである。暗号理論では、大きな素数の積を素因数分解することが非常に困難であるという性質を利用して、安全な通信を実現している。また、素数分布の研究は、現代数学の最先端の研究テーマの一つであり、数論だけでなく、解析学、代数学など、様々な分野に影響を与えている。\n\n素数を研究する上で重要な概念として、メルセンヌ素数、フェルマー素数などが挙げられる。メルセンヌ素数とは、2のべき乗から1を引いた数で素数となるものであり、最大の素数の探索において重要な役割を果たしている。フェルマー素数とは、2の2のべき乗に1を加えた数で素数となるものであり、フェルマの小定理など、数論の様々な定理と深く関わっている。\n\n素数の研究は、古くから多くの数学者を魅了してきた。古代ギリシャの時代から、素数の性質や分布について多くの研究が行われてきた。しかし、いまだに解明されていない謎も多く、素数は数学の永遠のテーマの一つと言える。\n\n素数の研究は、数学の基礎的な分野であるだけでなく、現代社会にも大きな影響を与えている。例えば、インターネットのセキュリティや暗号化技術など、私たちの生活を支える多くの技術が、素数の性質に基づいて構築されている。\n\n素数は、そのシンプルさの中に深遠な美しさを秘めた数である。素数の研究は、数学の進歩だけでなく、人類の知的探求心を刺激し続けている。\n\n**まとめ**\n\n素数は、1と自分自身以外の約数を持たない自然数であり、数学の基礎となる重要な概念である。素数は無限に存在し、その分布は不規則であり、多くの謎を秘めている。素数の研究は、暗号理論や現代数学の発展に大きく貢献しており、今後も多くの数学者を魅了し続けるであろう。", "**素数とは何か？**\n素数とは、1と自分自身以外の約数を持たない自然数のことである。この定義はシンプルながら、数学の様々な分野において根源的な役割を果たし、古くから多くの数学者を魅了してきた。\n\n素数の特徴として、まず挙げられるのはその無限性である。ユークリッドの時代から知られているように、素数は無限に存在する。この事実は、一見単純な素数の概念の中に、無限という神秘的な要素が含まれていることを示唆している。\n\n次に、素数の分布についてである。素数は自然数全体にランダムに散らばっているように見えるが、その分布にはある種の規則性も存在する。素数定理は、ある自然数以下の素数の個数を近似的に表す定理であり、素数の分布に関する重要な結果の一つである。\n\n素数は、数論における様々な問題の研究において中心的な役割を果たす。例えば、ゴールドバッハの予想は、2以上の偶数は2つの素数の和で表せるという予想であり、未解決問題の代表例として知られている。また、リーマン予想は、素数の分布に関するより深い性質を記述する予想であり、数論における最も重要な未解決問題の一つである。\n\n素数の応用として、暗号理論が挙げられる。RSA暗号など、現代の暗号システムの多くは、大きな素数の積を素因数分解するのが困難であるという性質を利用している。素数のこの性質は、情報セキュリティの分野において不可欠な要素となっている。\n\n素数を研究する動機として、その美しさや神秘性が挙げられる。素数は、一見単純な定義を持ちながら、その性質は深く奥深く、数学の様々な分野と密接に関連している。素数の研究は、数学の美しさを追求する上で重要な役割を果たしている。\n\n**素数の歴史**\n素数の概念は、古代ギリシャの数学者たちによって既に知られていた。ユークリッドは、彼の著書『原論』の中で素数の無限性を証明した。その後も、多くの数学者たちが素数の研究に取り組み、数々の重要な結果が得られてきた。\n\n19世紀には、ガウスやリーマンなど、多くの数学者が素数の分布に関する研究を行い、素数定理などが証明された。20世紀には、コンピュータの発展とともに、大規模な数値計算による素数の探索が行われるようになり、メルセンヌ素数などの大きな素数が発見されるようになった。\n\n**素数の未解決問題**\n素数に関する未解決問題は、数学の最も重要な課題の一つである。ゴールドバッハの予想やリーマン予想の他にも、双子素数予想や、任意の長さの連続する合成数列が存在するかという問題など、多くの未解決問題が存在する。これらの問題を解決することは、数学の発展に大きく貢献すると期待されている。\n\n**まとめ**\n素数は、数学の最も基本的な概念の一つでありながら、その性質は奥深く、未解明な部分も数多く残されている。素数の研究は、数学の様々な分野の発展に貢献するとともに、人類の知的探究心を刺激し続けている。", "**素数の定義について**\n素数とは、**1と自分自身以外の約数を持たない数**として定義される。このシンプルな定義の中に、数学の深遠な世界への入り口が隠されている。\n\n素数の概念は、自然数の最も基本的な性質の一つであり、数論の根幹をなすものである。古代ギリシャの数学者エウクレイデスは、素数が無限に存在することを証明した。このことは、一見単純に見える自然数の中に、無限の深さと複雑さが潜んでいることを示唆している。\n\n**素数の特徴と性質**\n素数は、他の自然数を構成する最小単位のようなものである。任意の自然数は、素数の積に一意的に分解できるという「算術の基本定理」は、数論における最も重要な定理の一つである。この定理は、素数が数の世界の「原子」のような役割を果たしていることを示している。\n\n素数の分布は極めて不規則であり、いまだに多くの謎に包まれている。リーマン予想は、素数の分布に関する最も有名な未解決問題の一つである。もしリーマン予想が証明されれば、素数の分布に関する深い理解が得られると期待されている。\n\n**素数の応用**\n素数は、暗号理論においても重要な役割を果たしている。RSA暗号など、多くの公開鍵暗号方式は、素数の大きな数に対する因数分解の困難さに基づいている。素数の性質を利用することで、安全な通信を実現することが可能となっている。\n\nまた、素数は、現代のコンピュータ科学においても重要な研究対象である。素数判定アルゴリズムの開発は、暗号理論だけでなく、数多くの分野に影響を与える。\n\n**素数の魅力**\n素数は、その単純な定義にもかかわらず、数学者たちを何千年もの間魅了し続けてきた。その神秘的な性質は、数学の美しさを象徴するものの一つである。素数の研究は、数学の基礎的な理解を深めるだけでなく、新たな数学分野の開拓にもつながる可能性を秘めている。\n\n**素数の未解決問題**\n素数に関する未解決問題は数多く存在する。双子素数予想、ゴールドバッハの予想など、古くから知られている問題だけでなく、近年新たな問題も発見されている。これらの問題を解くことは、数学の発展に大きく貢献するだけでなく、人類の知的探求心を刺激し続けるだろう。\n\n**まとめ**\n素数は、数学の最も基本的な概念でありながら、その奥深さは計り知れない。素数の研究は、数学の様々な分野に影響を与え、人類の知的探求心を刺激し続けている。素数は、これからも数学者たちにとって魅力的な研究対象であり続けるだろう。", "**素数の定義について**\n素数とは、**1と自分自身以外の約数を持たない自然数**として定義されます。つまり、ある自然数が素数であるためには、その数を1と自分自身でしか割り切ることができないという条件を満たさなければなりません。このシンプルな定義にも関わらず、素数は数学において非常に重要な役割を果たしており、数論をはじめとする様々な分野で研究されています。\n\n素数の特徴として、まず挙げられるのはその無限性です。ユークリッドの証明をはじめ、様々な方法で素数が無限個存在することが示されています。この事実は、一見単純に見える素数の中に、まだ解明されていない深遠な性質が数多く隠されていることを示唆しています。\n\n次に、素数はすべての自然数を構成する基本的な要素であるという点が挙げられます。算術の基本定理と呼ばれる定理によれば、任意の自然数は素数の積として一意に表すことができます。この定理は、自然数の構造を理解する上で非常に重要な役割を果たしており、数論の基礎となる定理の一つです。\n\n素数の分布については、まだ完全には解明されていませんが、素数定理と呼ばれる定理によって、ある自然数以下の素数の個数のおおよその値を推定することができます。素数定理は、素数の分布がランダムであることを示唆しており、素数の出現パターンを予測することは非常に困難であることを意味しています。\n\n素数の判定方法としては、試し割り法やエラトステネスの篩などが知られています。試し割り法は、ある自然数を2からその数の平方根までのすべての素数で割っていく方法です。もし、どれでも割り切れない場合は、その数は素数であると判定できます。エラトステネスの篩は、ある範囲の自然数の中から素数を効率的に見つけるアルゴリズムです。\n\n素数に関する未解決問題は数多く存在します。例えば、双子素数予想、ゴールドバッハの予想、リーマン予想などが挙げられます。双子素数予想は、差が2であるような素数の組が無限に存在するかという問題です。ゴールドバッハの予想は、4以上の偶数は2つの素数の和で表せるという問題です。リーマン予想は、素数の分布に関する非常に深い問題であり、数学の七つのミレニアム問題の一つに数えられています。\n\n素数は、その単純な定義とは裏腹に、非常に奥深く、そして魅力的な数学の対象です。素数の研究は、数学の発展に大きく貢献してきただけでなく、現代の暗号理論など、実社会にも応用されています。今後も、素数に関する新たな発見が期待されています。"][Math.floor(Math.random() * 11)]}`,
                primeList: "代表的な素数には、2, 3, 5, 7, 11などが挙げられます。",
                primeFactorization: (n, factors) => `${String(n).length}桁の自然数${n}を素因数分解すると、\n\n$ ${n} $$=$$ ${factors} $\n\nとなります。`,
                nprimeFactorization: (n) => `${n}は${n < 2 ? "" : "素数なので"}**素因数分解できません。**`,
                divisorEnumeration: (n, divisors, q) => { return `${String(n).length}桁の自然数${n}の${q.match(/正の約数/) ? "正の" : ""}約数は ${divisors.join(', ')} の${divisors.length}個です。` + (q.match(/正の約数/) ? "" : `\n(厳密には負の数も約数になるため、約数は ${divisors.map((x) => "±" + x).join(', ')} の${divisors.length * 2}個です。)`) },
                overFlow: "**入力された数字が 2^53 = 9007199254740992 よりも大きい自然数のようです。**\n\n　この機能で使用されている素因数分解機はJavaScriptのNumber型にのみ対応しているため、2^53以上の整数は全て偶数として扱われ、正確な結果を提供することができません。BigInt型ならば2^53より大きい整数を正確に表すことができますが、一般的にBigInt型の演算には時間を要し、高速な応答が困難になるため、この素因数分解機では入力を2^53以下に制限し、正確かつ高速な応答を優先しています。\n\n　これらの理由から、この機能で使用されている素因数分解機は 2^53 = 9007199254740992 よりも大きい自然数をサポートしていません。この機能を利用するには** 2^53以下 **の自然数を入力してください。",
                overFlow2: "この機能では、**1億以上の数字をサポートしていません。**もっと小さい自然数を入力してください。",
                oops: `${[
                    "興味深い質問ですが、これは素数の話ではありませんね。関連性を見出すのは難しそうです。",
                    "科学的好奇心は素晴らしいですが、この話題は私の専門分野外です。",
                    "素数に関する質問ならお力になれるのですが、それについては分かりかねます。",
                    "このような質問は、他の分野の専門家にお任せするべきでしょう。",
                    "それは少し話題が逸れているようですね。素数の魅力に戻りませんか？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "私は素数の判定を専門に行っています。質問には対話形式とコマンド形式の両方で対応可能です。\n例えば、コマンドで3を判定したい場合、『/prime 3』と入力してください。\n数論的な興味があれば、ぜひ数字を教えていただければ、即座に判定いたします。",
                aboutPrime: (n, np) => `${String(n).length}桁の自然数 ${n} に最も近い素数は** ${np} **です。`,
                error: "エラーが発生いたしました。",
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
                overFlow: "ちょっと数がでかいな。1億超えたら計算できないんだわ。",
                oops: `${[
                    "いや、知らんがなｗ俺、素数専門だからｗ",
                    "話逸れてて草。素数の話戻ろ？",
                    "それ素数関係ないやんｗｗマジわろｗ",
                    "いやそれ、俺に聞くよりGoogle先生のほうが早いｗ",
                    "素数の話しろよ。素数以外聞かれても知らんぞｗ"
                ][Math.floor(Math.random() * 5)]}`,
                help: "俺は素数の判定ができるんだ。会話形式でもコマンド形式でも、どっちでもOKだぜ。\n例えば、コマンドで3を知りたいときは『/prime 3』って入力してみてくれよ！\n気軽に、判定したい数字を教えてくれたらすぐ答えるぜ！",
                aboutPrime: (n, np) => `例えば${np}が素数だな。`,
                error: "エラーが発生したぞ。"
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
                overFlow: "あかん、計算がオーバーフローしてもうたわ。1億未満にせなあかんで！",
                oops: `${[
                    "そんなん聞かれても困るわ～。素数以外のネタ、持ってへんねん。",
                    "いやいや、それ素数の話やないやろ。素数の話してこ！",
                    "素数以外の話？ほんま頼むわ～素数しかわからんのやで！",
                    "その話なぁ、ワイわからんけど、素数なら何でも聞いてや！",
                    "なんやそれ、素数全然関係あらへんやん！もっと素数っぽいこと聞いてや！"
                ][Math.floor(Math.random() * 5)]}`,
                help: "ワイは素数判定ができるんやで！対話形式でも、コマンド形式でもどっちでもいけるわ。\n例えば、コマンドで3を判定したいときは『/prime 3』って入力してみぃ！\n気軽に聞きたい数字、どんどん教えてや～！",
                aboutPrime: (n, np) => `例えば${np}が素数やで！`,
                error: "エラーが発生したで。"
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
                overFlow: "計算がオーバーフローしちゃったど。1億未満にしてけろ！",
                oops: `${[
                    "それ、素数さ関係ねえな。素数のことさ聞いてけろ。",
                    "いやぁ、それ素数の話でねぇべな。素数でいがったら聞いでけろ。",
                    "そったのわがんねえべなぁ。素数だばわかるんだべ。"
                ][Math.floor(Math.random() * 3)]}`,
                help: "おら、素数判定ができるんだべ。対話形式でもコマンド形式でも対応してっからな～。\nたとえば、コマンドで3を判定すんなら『/prime 3』って打ってみればいんだべさ。\n気軽に、判定したい数字を教えてけろな～。",
                aboutPrime: (n, np) => `例えば${np}が素数だべ。`,
                error: "エラーが発生したど。"
            }
        };

        async function respondToQuestion(question, character) {
            try {
                for (let [key, regex] of Object.entries(regexes)) {
                    const match = question.match(regex);
                    console.log(question, match, key, regex)
                    if (match) {
                        let k, n;
                        if (key !== "primeDefinition" && key !== "help") {
                            k = parseFormulav2(match[1]);
                            n = parseInt(k, 10);
                            console.log(k, n);
                            if (isNaN(n)) {
                                return responses[character].error;
                            }
                        }

                        switch (key) {
                            case 'aboutPrime': {
                                return responses[character].aboutPrime(removeString(question), question.match(/((以|い)(上|じょう)|より(も)?((大|おお)き(い|な)|(でか|デカ)(イ|い))|の(次|つぎ|後|あと))/) ? aboutPrime(BigInt(k), "up") : question.match(/((以|い)(下|か)|より(も)?((小|ちい)さ(い|な)|ちっちゃ(イ|い))|(の|より(も)?)(前|まえ))/) ? aboutPrime(BigInt(k), "dn") : await aboutPrimeMLTI(BigInt(k)));
                            }
                            case "nthPrime":
                                var t = parseFormulav2(removeZero(match[1]));
                                if (t.length > 8) return responses[character].overFlow;
                                return responses[character].nthPrime(t, nthPrime(parseInt(t)));
                            case 'primeCheck':
                                var t = parseFormulav2(removeZero(match[1]));
                                return isNaN(parseInt(t)) ? String(t) : responses[character].primeCheck(t, isPrime(t));
                            case 'primeDefinition':
                                console.log("primeDefinition");
                                return responses[character].primeDefinition;
                            case 'primeList':
                                const count = match[4] ? parseInt(match[4], 10) : null;
                                return count
                                    ? `最初の${count}個の素数は2, 3, 5...です。`
                                    : responses[character].primeList;
                            case 'primeFactorization':
                                {
                                    if (BigInt(k) > 9007199254740992n) return responses[character].overFlow;
                                    const factors = newPFD_v5(n);
                                    return factors === false ? responses[character].nprimeFactorization(n, factors) : responses[character].primeFactorization(n, factors);
                                }
                            case 'divisorEnumeration':
                                {
                                    if (BigInt(k) > 9007199254740992n) return responses[character].overFlow;
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
            } catch (error) {
                return responses[character].error;
            }
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
        async function respondToQuestionAuto(question) {
            const character = detectCharacter(question);
            return await respondToQuestion(question, character);
        }

        let grl = await respondToQuestionAuto(commandParts.join(" "));
        if (grl !== false) {
            return grl;
        } else {
            return commandParts[0].match("/") ? "ERROR: INVALID COMMAND. CHECK \"/help\" . " : responses[detectCharacter(commandParts[0])].oops;
        }
    } catch (error) {
        console.error("Error in respondToQuestion:", error);
        return responses[detectCharacter(commandParts[0])].error;
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

    function Primeday (n,m,c) {
        return {
        AI: `本日(${n})は素数(${m})の日です${["。","！"][Math.floor(Math.random() * 2)]}`,
        Ojou: `本日(${n})は素数(${m})の日ですわ！`,
        Loli: `今日は${n}で${m}が素数だから素数の日だよ${["！", "♪", "っ", "〜", "〜！", "っ♪", "ー！"][Math.floor(Math.random() * 7)]}`,
        Mathematician: `素数の日に具体的な定義はありませんが、本日は${n}で${m}は素数なので"素数の日"と言えそうです。`,
        Friend: `今日${n}は${m}が素数だから素数の日だな。`,
        kansai: `今日(${n})は${m}が素数だから素数の日やな。`,
        touhoku: `今日(${n})は${m}が素数だから素数の日だべ。`}[c];
    }

    const characters = Object.keys(greetings);
    const randomCharacter = characters.includes(character) ? character : settingsManager("get","chat.character") || "AI";
    const timeOfDay = getGreetingByTime();
    if (character === "first") {
        settingsManager("set", "chat.character", randomCharacter);
        character = settingsManager("get","chat.character");
    }
    let h = isPrimeDay();
    let d;
    if (!h.exists) d = "";
    else {
        let b = h.ptn.length;
        let randN = Math.floor(Math.random() * b);
        d = Primeday(h["ptnS"][randN],h["ptn"][randN],character)
    }
    return greetings[randomCharacter][timeOfDay] +"\n" +d;
}

function isPrimeDay() {
    let result = { exists: false, ptnS: [], ptn: [] };
    let day = new Date();
    let monthN = new Date(day).getMonth() + 1;
    let dayN = new Date(day).getDate();
    let yearN = new Date(day).getFullYear();

    let ptn1 = Number(String(yearN) + String(monthN) + String(dayN));
    let ptn1A = yearN * 10000 + monthN * 100 + dayN;
    let ptn2 = Number(String(monthN) + String(dayN));
    let ptn2A = monthN * 100 + dayN;
    console.log(day.toString(), monthN, yearN, ptn1, ptn1A, ptn2, ptn2A, dayN);
    if (isPrimeN(ptn1)) {
        result.exists = true;
        result.ptnS.push(`${yearN}年${monthN}月${dayN}日`);
        result.ptn.push(ptn1);
    }
    if (isPrimeN(ptn1A)) {
        result.exists = true;
        result.ptnS.push(`${yearN}年${String(monthN).padStart(2, "0")}月${String(dayN).padStart(2, "0")}日`);
        result.ptn.push(ptn1A);
    }
    if (isPrimeN(ptn2)) {
        result.exists = true;
        result.ptnS.push(`${monthN}月${dayN}日`);
        result.ptn.push(ptn2);
    }
    if (isPrimeN(ptn2A)) {
        result.exists = true;
        result.ptnS.push(`${String(monthN).padStart(2, "0")}月${String(dayN).padStart(2, "0")}日`);
        result.ptn.push(ptn2A);
    }
    if (isPrimeN(dayN)) {
        result.exists = true;
        result.ptnS.push(`${dayN}日`);
        result.ptn.push(dayN);
    }
    return result;
}

function convertNumber(n) {
    let fn = String(n).split("");
    for (let i = 0; i < fn.length; i++) {
        fn[i] = !isNaN(parseInt(fn[i])) ? String(parseInt(fn[i])) : "";
    };
    return fn.join("");
}

self.addEventListener("message", async (event) => {
    try {
        const { uuid, type, option } = event.data;

        let result;
        let st = performance.now();
        if (type === "isPrime") {
            result = isPrime(option);
        } else if (type === "isPrimeBig") {
            result = await isPrimeBig(option);
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
            result = aboutPrime(n, opt);
        } else if (type === "primeList") {
            result = sieveOfSundaram2(option);
        } else if (type === "evaluateFormula") {
            result = parseFormulav2(option);
        } else if (type === "settingsSave") {
            result = settingsManager("save", option.key, option.value, option.opt);
        } else if (type === "settingsChange") {
            result = settingsManager("set", option.key, option.value);
        } else if (type === "settingsGet") {
            result = settingsManager("get", option);
        } else if (type === "nearPrimeUp") {
            result = aboutPrime(option, "up");
        } else if (type === "nearPrimeDown") {
            result = aboutPrime(option, "dn");
        } else if (type === "nearPrimeMLTI") {
            console.log(option.number);
            result = await aboutPrimeMLTI(option.number, option.option);
        } else if (type === "firstR") {
            result = await firstF();
        } else if (type === "settingsReadALL") {
            result = settingsManager("readALL");
        }
        let et = performance.now();
        let time = (et - st);
        console.log(`ProcessingThread: ${type} took ${time} ms, result:${result}, ID: ${uuid}`);
        // UUIDをつけてメインスレッドへ返す
        self.postMessage({ uuid, type, time, result });
    } catch (error) {
        console.error(error);
    }
});
