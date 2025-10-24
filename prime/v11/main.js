//処理専用スレッドへのメッセージ送信
class mainWorker {
    constructor() {
        this.worker = new Worker("./mainWorker.js");
        this.callbacks = new Map();

        this.worker.addEventListener("message", (event) => {
            const { uuid, result } = event.data;
            if (this.callbacks.has(uuid)) {
                this.callbacks.get(uuid)(result);
                this.callbacks.delete(uuid);
            }
        });

        this.worker.addEventListener("error", () => this.restartWorker());
        this.worker.addEventListener("messageerror", () => this.restartWorker());
    }

    // ワーカーの再起動処理
    restartWorker() {
        console.warn("ワーカーを再起動します...");
        this.worker.terminate();
        this.worker = new Worker("./mainWorker.js");
        this.firstR();
    }

    // リクエストを送る共通関数
    request(type, option) {
        return new Promise((resolve) => {
            const uuid = crypto.randomUUID();
            this.callbacks.set(uuid, resolve);
            this.worker.postMessage({ uuid, type, option });
        });
    }

    // 素数判定
    isPrime(number) {
        return this.request("isPrime", number);
    }

    // 素因数分解
    primeFactorization(number) {
        return this.request("primeFactorization", number);
    }

    // メッセージ処理
    processMessage(message) {
        return this.request("processMessage", message);
    }

    // 約数列挙
    findDivisors(number) {
        return this.request("divisors", number);
    }

    // 近い素数
    findNearPrime(number) {
        return this.request("nearPrime", number);
    }

    // 素数列挙
    primeList(number) {
        return this.request("primeList", number);
    }

    // 挨拶
    sendGreeting(character) {
        return this.request("greeting", character);
    }

    //　数式評価
    evaluateFormula(formula) {
        return this.request("evaluateFormula", formula);
    }

    // 設定更新
    settingsManager(option) {
        return this.request("settingsSave", option);
    }

    // 設定読み取り
    settingsRead(key) {
        return this.request("settingsGet", key)
    }

    settingsReadALL() {
        return this.request("settingsReadALL");
    }

    findNearPrimeDown(number) {
        return this.request("nearPrimeDown", number);
    }

    findNearPrimeUp(number) {
        return this.request("nearPrimeUp", number);
    }

    isPrimeBig(number) {
        return this.request("isPrimeBig", number);
    }

    findNearPrimeMLTI(number) {
        return this.request("nearPrimeMLTI", { number: number, option: "ud" });
    }

    firstR() {
        return this.request("firstR");
    }

    historyReadAll() {
        return this.request("historyReadAll");
    }
};

// ワーカーAPIのインスタンス作成
const main = new mainWorker();
main.firstR().then(updateFontPreview).then(changePrefScreen).then(() => { loadingP(); document.querySelector('.loading-screen').style.display = 'none' });

async function loadingP() {
    appendTypingIndicator();
    settingsManager('set', 'main.threads', String(navigator.hardwareConcurrency || 4));
    let GreetingText = await main.sendGreeting("first");
    setTimeout(async () => {
        appendMessage(GreetingText, 'bot', "素数判定機", 'prime.png', '');
        await removeTypingIndicator();
    }, 1000);
    toggleView("chat");
    setSelectedText('chat');
    setTimeout(() => {
        removeDisplayNone();
        document.getElementById("cli-box").style.display = "none"
    }, 500);
}

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
        testMethod: ["default", "old.v1", "old.v2", "old.v3", "old.v4", "old.v5", "old.v6", "old.v7", "old.v8", "old.v9", "old.v10", "new.v1", "new.v2", "new.v3", "new.v4", "new.v5", "new.v6", "new.v7", "new.v8", "new.v9", "new.v10", "APR-CL-MULTI", "MILLER-RABIN-64", "MILLER-RABIN-64-FAST", "APR-CL", "MILLER-RABIN", "AKS"],
        parserPrecedence: ["2", "3"],
        threads: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
    },
    view: {
        theme: ["default", "dark", "light"],
        fontFamily: ["sans-serif", "Noto Sans JP", "Sawarabi Gothic", "Zen Kaku Gothic New", "Kosugi", "Noto Serif JP", "Sawarabi Mincho", "Zen Old Mincho", "Hina Mincho", "Kiwi Maru", "Kosugi Maru", "Zen Maru Gothic", "Kaisei Opti", "Zen Kurenaido", "Klee One", "Yomogi", "Mochiy Pop One", "Yuji Syuku", "Stick", "Kaisei Opti"]
    }
}

// 設定管理
async function settingsManager(mode, prf, set, opt) {
    if (mode === "set") {
        let g = prf.split(".");
        // 処理スレッド側の設定更新
        let s = await main.settingsManager({ key: prf, value: set, option: opt }).then(updateGUI_S(g));
        return s;
    } else if (mode === "get") {
        let g = prf.split(".");
        // 処理スレッド側の設定更新
        let s = await main.settingsRead(prf).then(updateGUI_S(g));
        return s;
    }
}

function updateGUI_S(g) {
    if (g[1] === "fontFamily") {
        updateFontPreview();
    }
}

// CLIでのコマンド処理
async function processCommand(command) {
    const parts = command.split(' ');
    const mainCommand = parts[0];
    document.getElementById('cli-box').innerHTML += `<p>> ${command}</p>`;
    await wait(1);
    try {
        if ((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && parts.length === 2) {
            const str2 = parts[2].split("");
            for (let i = 0; i < str2.length; i++) {
                if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
            };
            if (str2.length == 0) throw new Error(`Invalid input. Please enter a natural number.`);
            const arg = await main.evaluateFormula(parts[1]);
            await wait(1);
            await wait(1);
            let st = performance.now();
            const result = await main.isPrime(arg) ? `${arg} is a prime number.` : `${arg} is not a prime number.`;
            let et = performance.now();
            document.getElementById('cli-box').innerHTML += `<p>${result} (${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if ((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && (parts[1] == "fact" || parts[1] == "factor" || parts[1] == "f" || parts[1] == "factorization")) {
            const str2 = parts[2].split("");
            for (let i = 0; i < str2.length; i++) {
                if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
            };
            const arg = await main.evaluateFormula(parts[2]);
            await wait(1);
            if (BigInt(parts[2]) > 9007199254740992n) {
                throw new Error(`An overflow has occurred during the calculation process of the system. The range of numbers that can be processed is less than or equal to 2^53 = 9007199254740992. Please enter a smaller number.`);
            }
            await wait(1);
            let st = performance.now();
            const factors = await main.primeFactorization(parseInt(arg));
            let et = performance.now();
            const msg = factors === false ? `${arg}${parseInt(arg) < 2 ? "" : " is a prime number and"} cannnot be prime factorised.` : `${arg} = ${factors} .`;
            document.getElementById('cli-box').innerHTML += `<p>${msg}(${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if ((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && (parts[1] == "formula" || parts[1] == "fn" || parts[1] == "expression" || parts[1] == "exp")) {
            const str2 = parts[2].split("");
            for (let i = 0; i < str2.length; i++) {
                if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
            };
            const arg = await main.evaluateFormula(parts[2]);
            await wait(1);
            let st = performance.now();
            const result = await main.isPrime(arg) ? `${arg} is a prime number.` : `${arg} is not a prime number.`;
            let et = performance.now();
            document.getElementById('cli-box').innerHTML += `<p>${result} (${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if ((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && (parts[1] == "l" || parts[1] == "list")) {
            const str2 = parts[2].split("");
            for (let i = 0; i < str2.length; i++) {
                if (isNaN(parseInt(str2[i]))) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
            };
            if (BigInt(parts[2]) > 1000000000n) {
                throw new Error(`An overflow has occurred during the calculation process of the system. The range of numbers that can be processed is less than or equal to 2^53 = 9007199254740992. Please enter a smaller number.`);
            }
            await wait(1);
            let st = performance.now();
            const primes = await main.primeList(parseInt(parts[2]));
            let et = performance.now();
            document.getElementById('cli-box').innerHTML += `<p>[${primes.join(",")}](${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if (((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && (parts[1] == "div" || parts[1] == "divisor" || parts[1] == "d")) || (mainCommand === "divisor")) {
            const str1 = parts[1].split("");
            let isParts1 = true;
            for (let i = 0; i < str1.length; i++) {
                if (isNaN(parseInt(str1[i])) && !str1[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str1[i])))) {
                    isParts1 = false;
                    break;
                }
            };
            let str;
            if (isParts1) {
                const str2 = parts[1].split("");
                for (let i = 0; i < str2.length; i++) {
                    if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                        throw new Error(`Invalid input. Please enter a natural number.`);
                    }
                };
                str = await main.evaluateFormula(parts[1]);
            } else {
                if (parts.length < 3) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
                const str2 = parts[2].split("");
                for (let i = 0; i < str2.length; i++) {
                    if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                        throw new Error(`Invalid input. Please enter a natural number.`);
                    }
                };
                str = await main.evaluateFormula(parts[2]);
                await wait(1);
            }
            if (BigInt(str) > 9007199254740992n) {
                throw new Error(`An overflow has occurred during the calculation process of the system. The range of numbers that can be processed is less than or equal to 2^53 = 9007199254740992. Please enter a smaller number.`);
            }
            await wait(1);
            let st = performance.now();
            let n = parseInt(str);
            const factors = await main.primeFactorization(n);
            const divisors = factors === false ? (n !== 0 ? [1, n] : [1]) : findDivisorsWithBitOperations(parsePrimeFactorization(factors));
            const msg = `The positive divisor of ${n} is [${divisors.join(', ')}].`;
            let et = performance.now();
            document.getElementById('cli-box').innerHTML += `<p>${msg}(${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if (((mainCommand === 'prime' || mainCommand === "p" || mainCommand === "prim" || mainCommand === '/prime' || mainCommand === "/p" || mainCommand === "/prim") && (parts[1] == "nr" || parts[1] == "near" || parts[1] == "n"))) {
            const str1 = parts[1].split("");
            for (let i = 0; i < str1.length; i++) {
                if (isNaN(parseInt(str1[i]))) {
                    isParts1 = false;
                    break;
                }
            };
            if (parts.length < 3) {
                throw new Error(`Invalid input. Please enter a natural number.`);
            }
            const str2 = parts[2].split("");
            for (let i = 0; i < str2.length; i++) {
                if (isNaN(parseInt(str2[i])) && !str2[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str2[i])))) {
                    throw new Error(`Invalid input. Please enter a natural number.`);
                }
            };
            let str = await main.evaluateFormula(String(parts[2]));
            await wait(1);
            if (BigInt(str) > 9007199254740992n) {
                throw new Error(`An overflow has occurred during the calculation process of the system. The range of numbers that can be processed is less than or equal to 2^53 = 9007199254740992. Please enter a smaller number.`);
            };
            await wait(1);
            let st = performance.now();
            const factors = await main.findNearPrime({ number: BigInt(parts[2]), opt: "ud" });
            const msg = `An example of a prime number close to ${str} is ${factors}.`;
            let et = performance.now();
            document.getElementById('cli-box').innerHTML += `<p>${msg}(${Math.round((et * 10) - (st * 10)) / 10}ms)</p>`;
        } else if ((mainCommand === "settings" || mainCommand === "preference" || mainCommand === "pref")) {
            if (parts[1] == "chat.cN" || parts[1] == "chat.chName" || parts[1] == "character" || parts[1] === "chat.character") {
                let rst;
                if (parts[2] == "set") {
                    rst = await settingsManager("set", "chat.character", parts[3]);
                    document.getElementById('cli-box').innerHTML += `<p>${rst}</p>`;
                } else if (parts[2] == "default" || parts[2] == "auto") {
                    rst = await settingsManager("set", "chat.character", "default");
                    document.getElementById('cli-box').innerHTML += `<p>${rst}</p>`;
                } else {
                    throw new Error("The argument is incorrect.");
                }
                sendGreeting(parts[3])
            } else {
                let res = await settingsManager("set", parts[1], parts[3]);
                document.getElementById('cli-box').innerHTML += `<p>${res}</p>`;
            }
        } else {
            document.getElementById('cli-box').innerHTML += `<p>Invalid command. Try "prime [number]".</p>`;
        }
    } catch (error) {
        document.getElementById('cli-box').innerHTML += `<p>${error}</p>`;
    }
    document.getElementById('cli-box').innerHTML += `<p id="cli-input">> <input type="text" id="cli-inputL" autofocus></p>`;
    document.getElementById('cli-box').scrollTop = document.getElementById('cli-box').scrollHeight; // Auto scroll to the bottom
}

const repaint = async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
};

async function checkPrime() {
    let str = document.getElementById('prime-input').value.split("");
    const resultDiv = document.getElementById('prime-result');
    resultDiv.style.display = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ",") {
            str[i] = "";
        } else if (isNaN(parseInt(str[i])) && !str[i].match(/[\^\*×\/÷\-\+\(\)\!\ ]/) && isNaN(parseInt(toHankakuNumber(str[i])))) {
            resultDiv.innerHTML = `<p class="nmlrslt">整数を入力してください。</p>`;
            return;
        }
    };
    if (str.length == 0) {
        resultDiv.innerHTML = "";
        return;
    }
    for (let i = 0; i < 2; i++) {
        resultDiv.innerHTML = `<h1>数式解析中...</h1><div class="loading-bar" id="loading_bar"></div>`;
        await repaint();
        await wait(1);
    }
    let pst = performance.now();
    const number = await main.evaluateFormula(str.join(""));
    let pet = performance.now();
    if (String(number).startsWith("Error")) {
        resultDiv.innerHTML = `<p class="nmlrslt">${number}</p>`;
        return;
    }

    for (let i = 0; i < 2; i++) {
        resultDiv.innerHTML = `<h1>判定中...</h1><div class="loading-bar" id="loading_bar"></div><p class="smallF">数式解析:${Math.round((pet * 10) - (pst * 10)) / 10}ms</p>`;
        await repaint();
        await wait(1);
    }
    try {
        let st = performance.now();
        let r = await main.isPrime(BigInt(number.toString()));
        let et = performance.now();
        await wait(1);
        for (let g = 0; g < 2; g++) {
            resultDiv.innerHTML = r ? `<p>${String(number).length}桁の自然数 ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} は</p><p class="nmlrslt">素数です。</p><p class="smallF">数式解析:${Math.round((pet * 10) - (pst * 10)) / 10}ms, 判定:${Math.round((et * 10) - (st * 10)) / 10}ms</p>` : `<p>${String(number).startsWith("-") ? String(number).length - 1 : String(number).length}桁の整数 ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} は</p><p class="nmlrslt">素数ではありません。</p><p class="smallF">数式解析:${Math.round((pet * 10) - (pst * 10)) / 10}ms, 判定:${Math.round((et * 10) - (st * 10)) / 10}ms</p>`;
            await wait(100);
            await repaint();
        }
    } catch (error) {
        for (let i = 0; i < 2; i++) {
            resultDiv.innerHTML = `<p class="nmlrslt">判定中にエラーが発生しました。</p>`;
            await repaint();
            await wait(1);
        }
        console.error(error);
        return;
    }
}
async function handleCommand() {
    const userInput = document.getElementById('user-input').value;
    if (userInput == "") return;
    const commandParts = toHankakuNumber(userInput).split(' ');
    document.getElementById('user-input').value = '';
    await wait(0);
    if (commandParts[0] === '/prime' && commandParts.length === 2) {
        const num = await main.evaluateFormula(commandParts[1]);
        appendMessage(`${commandParts[1].length>16?"":"$"}${commandParts[1]}${commandParts[1].length>16?"":"$"}は素数ですか？`, 'user', userName, 'user_icon.png', 'user');
        if (isNaN(Number(num)) || !Number.isInteger(Number(num))) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('有効な数値を入力してください。', 'bot', "素数判定機 (コマンド版）", 'prime.png', '');
            }, 1000);
        } else if (BigInt(num) < 2n) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('2未満の整数は素数ではありません。', 'bot', "素数判定機 (コマンド版）", 'prime.png', '');
            }, 1000);
        } else if (BigInt(num) > 2n ** 53n) {
            appendTypingIndicator();
            document.getElementById('user-input').value = '';
            await wait(0);
            const isPrimeResult = await main.isPrime(num);

            setTimeout(() => {
                removeTypingIndicator();
                const result = `${num.startsWith("-") ? String(num).length - 1 : String(num).length}桁の自然数${num}は**素数${isPrimeResult ? randomDS("desu") : randomDS("dewaNai")}**`;
                appendMessage(result, 'bot', "素数判定機 (BigInt Edition)", 'prime.png', '');
            }, 1000);
        } else {
            appendTypingIndicator();
            let isPrimeResult;
            const factors = await main.primeFactorization(num);
            if (factors === false) { isPrimeResult = true } else { isPrimeResult = false }
            const divisors = factors === false ? (num !== 0 ? [1, num] : [1]) : findDivisorsWithBitOperations(parsePrimeFactorization(factors));
            setTimeout(async () => {
                removeTypingIndicator();
                const result = isPrimeResult ? `${String(num).length}桁の自然数${num}は**素数${randomDS("desu")}**` : `${String(num).length}桁の自然数 ${num} は**${convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").split("×").length == 2 ? `半素数${randomDS("desu")}` : num == 57 ? `グロタンディーク素数${randomDS("desu")}` : `素数${randomDS("dewaNai")}`}**\n\n素因数分解の結果: ${num} = ${factors}${(convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").split("×").length !== 2 && factors.match(/\^/)) ? " = " + convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").replace(/×/g, " × ") : ""}\n\n正の約数: [${divisors.join(", ")}]\n(正の約数の個数:${divisors.length})`;
                appendMessage(result, 'bot', "素数判定機 (コマンド版)", 'prime.png', '');
            }, 1000);
        }
    } else if (commandParts[0] === '/prime' && (commandParts[1] == "fact" || commandParts[1] == "factor" || commandParts[1] == "f" || commandParts[1] == "factorization") && commandParts.length === 3) {
        appendMessage(`${commandParts[2].length>16?"":"$"}${commandParts[2]}${commandParts[2].length>16?"":"$"}を素因数分解してください。`, 'user', userName, 'user_icon.png', 'user');
        const num = await main.evaluateFormula(commandParts[2]);
        if (BigInt(num) > 9007199254740992n) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage("計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は $ 2^53 = 9007199254740992 $ 以下です。より小さな数値を入力してください。", 'bot', "素因数分解機", 'prime.png', '');
            }, 1000);
        } else {
            const factors = await main.primeFactorization(num);
            const msg = factors === false ? `${num}は${num < 2n ? "" : "**素数なので**"}素因数分解できません。` : `$ ${num} =$$ ${factors} $ です。`;
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(msg, 'bot', "素因数分解機 (コマンド版)", 'prime.png', '');
            }, 1000);
        }
    } else if (commandParts[0] === '/prime' && (commandParts[1] == "near" || commandParts[1] == "n") && commandParts.length === 3) {
        appendMessage(`${commandParts[2].length>16?"":"$"}${commandParts[2]}${commandParts[2].length>16?"":"$"}に近い素数を挙げてください。`, 'user', userName, 'user_icon.png', 'user');
        const num = await main.evaluateFormula(commandParts[2]);
        if (num === "ERR" || num === "") {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('有効な数値を入力してください。', 'bot', "素数探索機（コマンド版）", 'prime.png', '');
            }, 1000);
        } else {
            let re = await main.findNearPrime({ number: BigInt(num), opt: "ud" });
            const msg = `${num.startsWith("-") ? String(num).length - 1 : String(num).length}桁の自然数 ${num} に最も近い素数は** ${re} **${randomDS("desu")}`;
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(msg, 'bot', "素数探索機 (コマンド版）", 'prime.png', '');
            }, 1000);
        }
    } else if (commandParts[0] === '/prime' && (commandParts[1] == "divisor" || commandParts[1] == "div" || commandParts[1] == "d" || commandParts[1] == "divisors") && commandParts.length === 3) {
        appendMessage(`${commandParts[2].length>16?"":"$"}${commandParts[2]}${commandParts[2].length>16?"":"$"}の正の約数を列挙してください。`, 'user', userName, 'user_icon.png', 'user');
        let nm = await main.evaluateFormula(commandParts[2]);
        if (BigInt(nm) > 9007199254740992n) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage("計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は $ 2^53 = 9007199254740992 $ 以下です。より小さな数値を入力してください。", 'bot', "約数列挙機 (コマンド版）", 'prime.png', '');
            }, 1000);
        } else {
            let n = BigInt(nm);
            const divisors = await main.findDivisors(n);
            const msg = `${n}の正の約数は ${divisors.join(', ')} です。`;
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(msg, 'bot', "約数列挙機 (コマンド版)", 'prime.png', '');
            }, 1000);
        }
    } else if (commandParts[0] === '/prime' && (commandParts[1] == "fn" || commandParts[1] == "func" || commandParts[1] == "exp" || commandParts[1] == "function" || commandParts[1] == "expression") && commandParts.length === 3) {
        const num = Number(await main.evaluateFormula(commandParts[2]));
        appendMessage(`${commandParts[2]}は素数ですか？`, 'user', userName, 'user_icon.png', 'user');
        if (isNaN(num) || !Number.isInteger(num)) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('有効な数値を入力してください。', 'bot', "素数判定機 (数式)", 'prime.png', '');
            }, 1000);
        } else if (num === "ERR" || num === "") {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('数式の演算中にエラーが発生しました。', 'bot', "素数判定機(数式)", 'prime.png', '');
            }, 1000);
        } else if (num === "INF") {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('数式の演算中にオーバーフローが発生しました。', 'bot', "素数判定機(数式)", 'prime.png', '');
            }, 1000);
        } else if (num < 2) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('2未満の整数は素数ではありません。', 'bot', "素数判定機(数式)", 'prime.png', '');
            }, 1000);
        } else if (num > 2 ** 53) {
            appendTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage('判定中にオーバーフローが発生しました。', 'bot', "素数判定機(数式)", 'prime.png', '');
            }, 1000);
        } else {
            appendTypingIndicator();
            let isPrimeResult;
            const factors = await main.primeFactorization(num);
            if (factors === false) { isPrimeResult = true } else { isPrimeResult = false }
            const divisors = factors === false ? (num !== 0 ? [1, num] : [1]) : findDivisorsWithBitOperations(parsePrimeFactorization(factors));
            setTimeout(() => {
                removeTypingIndicator();

                const result = isPrimeResult ? `${String(num).length}桁の自然数${num}は**素数${randomDS("desu")}**` : `${String(num).length}桁の自然数${num}は**${convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").split("×").length == 2 ? `半素数${randomDS("desu")}` : num == 57 ? `グロタンディーク素数${randomDS("desu")}` : `素数${randomDS("dewaNai")}`}**\n\n素因数分解の結果: ${num} = ${factors}${(convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").split("×").length !== 2 && factors.match(/\^/)) ? " = " + convertPowerToString(factors.replace(/ /g, "")).replace(/\*/g, "×").replace(/×/g, " × ") : ""}\n\n正の約数: [${divisors.join(", ")}]\n(正の約数の個数:${divisors.length})`;
                appendMessage(result, 'bot', "素数判定機(数式)", 'prime.png', '');
            }, 1000);
        }
    } else if (commandParts[0] === '/help') {
        appendMessage(`このツールについて教えてください。`, 'user', userName, 'user_icon.png', 'user');
        appendTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage("私は素数判定/素因数分解/約数列挙を行うことができます。\n質問は、対話形式とコマンド形式に対応しています。\n\n例(3をコマンドを使用して判定する場合):\n入力欄に\"/prime 3\"と入力します。\n例(14をコマンドを使用して素因数分解する場合):\n入力欄に\"/prime f 14\"と入力します。\n\n気軽に判定したい数字を教えてください！", 'bot', pbotName, 'prime.png', '');
        }, 1000);
    } else if ((commandParts[0] === "/pref")) {
        try {
            if (commandParts[1] == "chat.cN" || commandParts[1] == "chat.chName" || commandParts[1] == "character" || commandParts[1] === "chat.character") {
                appendMessage(`設定変更 キャラクター名称: ${commandParts[3]}`, 'user', userName, 'user_icon.png', 'user');
                appendTypingIndicator();
                let rst;
                if (commandParts[2] == "set") {
                    rst = await settingsManager("set", "chat.character", commandParts[3]);
                    setTimeout(() => {
                        removeTypingIndicator();
                        appendMessage(rst, 'bot', "Primality Tester Preference Manager", 'prime.png', '');
                        sendGreeting(commandParts[3]);
                    }, 1000);
                } else if (commandParts[2] == "default" || commandParts[2] == "auto") {
                    appendMessage(`設定変更 キャラクター名称: デフォルト`, 'user', userName, 'user_icon.png', 'user');
                    appendTypingIndicator();
                    rst = await settingsManager("set", "chat.character", "default");
                    setTimeout(() => {
                        removeTypingIndicator();
                        appendMessage(rst, 'bot', "Primality Tester Preference Manager", 'prime.png', ''); sendGreeting(commandParts[3]);
                    }, 1000);
                } else {
                    throw new Error("The argument is incorrect.");
                }
            } else if (commandParts[2] == "set") {
                appendMessage(`設定変更 ${commandParts[1]}: ${commandParts[3].replace(/_/g, " ")}`, 'user', userName, 'user_icon.png', 'user');
                appendTypingIndicator();
                let res = await settingsManager("set", commandParts[1], commandParts[3].replace(/_/g, " "));
                setTimeout(() => {
                    removeTypingIndicator();
                    appendMessage(res, 'bot', "Primality Tester Preference Manager", 'prime.png', '');
                }, 1000);
            } else if (commandParts[2] == "get") {
                appendMessage(`設定取得 ${commandParts[1]}`, 'user', userName, 'user_icon.png', 'user');
                appendTypingIndicator();
                let res = await settingsManager("get", commandParts[1]);
                setTimeout(() => {
                    removeTypingIndicator();
                    appendMessage(res, 'bot', "Primality Tester Preference Manager", 'prime.png', '');
                }, 1000);
            } else {
                appendMessage(`設定 ${commandParts[1]}: ${commandParts[3].replace(/_/g, " ")}`, 'user', userName, 'user_icon.png', 'user');
                appendMessage("Error: The option doesn't exist.", 'bot', "Primality Tester Preference Manager", 'prime.png', '');
            }
        } catch (ed) {
            appendMessage(ed, 'bot', "Primality Tester Preference Manager", 'prime.png', '');
        }
    } else {
        await wait(0);
        appendMessage(userInput, 'user', userName, 'user_icon.png', 'user');
        appendTypingIndicator();
        await wait(0);
        // 各キャラクターごとの応答
        const responses = {
            "AI": {
                overFlow: "計算処理中にオーバーフローが発生しました。処理可能な数値の範囲は**2^53以下**です。より小さな数値を入力してください。",
                oops: `${[
                    "申し訳ありませんが、それは私の専門外です。素数の話に戻りませんか？",
                    "その質問は少し的外れですね。素数に関連する内容ならお手伝いできます！",
                    "うーん、素数以外のことはわからないように設計されているんです…",
                    "それについては知識がありません。素数に関することならお答えしますよ！",
                    "それより、素数って本当に面白いですよね。素数について聞いてみませんか？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "私は素数判定を行うことができます。対話形式やコマンド形式、どちらにも対応しています。\n例として、コマンドで3を判定したい場合は、入力欄に『/prime 3』と入力してください。\nどうぞ、気軽に判定したい数字をお知らせください！"
            },
            "Ojou": {
                overFlow: "あらあら、計算が途絶えてしまいましたわ。計算機にも限界があるようね。もう少し小さな数字でお願いできるかしら？2の53乗までなら、きっと私の愛らしい計算機も喜んで計算してくれるはずよ。",
                oops: `${[
                    "まぁ！そのようなことを聞かれるとは思いませんでしたわ。素数についてのお話をしませんこと？",
                    "あら、素数とは無関係の質問ですわね。きっと興味深いですが、お答えできませんのよ。",
                    "素数以外の話題は少々難儀ですわね。",
                    "失礼ながら、その話題は私には分かりかねますの。",
                    "そのような質問より、素数の美しさについて考えてみませんこと？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "わたくし、素数の判定を承りますわ。対話形式もコマンド形式も使用できますのよ。\n例えば、コマンドで3を判定なさる場合は、『/prime 3』と入力いただければよろしいですわ。\nどうぞ、お気軽に素数かどうか知りたい数字をお知らせくださいませ。"
            },
            "Loli": {
                overFlow: ["ごめんね…私、まだまだ力不足みたい… 2^53より大きな数の約数列挙なんて、私には無理だった… もっと頑張らなきゃ…", "えへへ…ごめんね。私の能力じゃ、2^53までの数字しか扱えないんだ…"][Math.floor(Math.random() * 2)],
                oops: `${[
                    "えー？それ素数の話じゃないじゃん！ちゃんと素数のこと聞いてよぉ～。",
                    "わかんないよぉ〜。わたし、素数のおはなししか知らないんだもん…他のはむりぃ。",
                    "それねー、わかんない！でも素数ならめっちゃ得意だよ！",
                    "それよりさ！素数のおはなししよーよ！楽しいよっ！",
                    "わかんないよぉ～。素数のことだけ考えてるんだもん！"
                ][Math.floor(Math.random() * 5)]}`,
                help: "わたしね、素数かどうかがわかるんだよ～！質問として聞いてもいいし、コマンドでもできるんだよ！\nたとえばね、コマンドで3を調べるときは『/prime 3』って打ってみてね～！\nいっぱい数字教えてくれたら、わたしすぐに答えるからね～！"
            },
            "Mathematician": {
                overFlow: "**入力された数字が 2^53 = 9007199254740992 よりも大きい自然数のようです。**\n\n　この機能で使用されている素因数分解機はJavaScriptのNumber型にのみ対応しているため、2^53以上の整数は全て偶数として扱われ、正確な結果を提供することができません。BigInt型ならば2^53より大きい整数を正確に表すことができますが、一般的にBigInt型の演算には時間を要し、高速な応答が困難になるため、この素因数分解機では入力を2^53以下に制限し、正確かつ高速な応答を優先しています。\n\n　これらの理由から、この機能で使用されている素因数分解機は 2^53 = 9007199254740992 よりも大きい自然数をサポートしていません。この機能を利用するには** 2^53以下 **の自然数を入力してください。",
                oops: `${[
                    "興味深い質問ですが、これは素数の話ではありませんね。関連性を見出すのは難しそうです。",
                    "科学的好奇心は素晴らしいですが、この話題は私の専門分野外です。",
                    "素数に関する質問ならお力になれるのですが、それについては分かりかねます。",
                    "このような質問は、他の分野の専門家にお任せするべきでしょう。",
                    "それは少し話題が逸れているようですね。素数の魅力に戻りませんか？"
                ][Math.floor(Math.random() * 5)]}`,
                help: "私は素数の判定を専門に行っています。質問には対話形式とコマンド形式の両方で対応可能です。\n例えば、コマンドで3を判定したい場合、『/prime 3』と入力してください。\n数論的な興味があれば、ぜひ数字を教えていただければ、即座に判定いたします。"
            },
            "Friend": {
                overFlow: "あかん、計算がオーバーフローしてもうたわ。2^53以下にせなあかんで！",
                oops: `${[
                    "そんなん聞かれても困るわ～。素数以外のネタ、持ってへんねん。",
                    "いやいや、それ素数の話やないやろ。素数の話してこ！",
                    "素数以外の話？ほんま頼むわ～素数しかわからんのやで！",
                    "その話なぁ、ワイわからんけど、素数なら何でも聞いてや！",
                    "なんやそれ、素数全然関係あらへんやん！もっと素数っぽいこと聞いてや！"
                ][Math.floor(Math.random() * 5)]}`,
                help: "ワイは素数判定ができるんやで！対話形式でも、コマンド形式でもどっちでもいけるわ。\n例えば、コマンドで3を判定したいときは『/prime 3』って入力してみぃ！\n気軽に聞きたい数字、どんどん教えてや～！"
            },
            "touhoku": {
                overFlow: "計算がオーバーフローしちゃったど。2^53以下にしてけろ！",
                oops: `${[
                    "それ、素数さ関係ねえな。素数のことさ聞いてけろ。",
                    "いやぁ、それ素数の話でねぇべな。素数でいがったら聞いでけろ。",
                    "そったのわがんねえべなぁ。素数だばわかるんだべ。"
                ][Math.floor(Math.random() * 3)]}`,
                help: "おら、素数判定ができるんだべ。対話形式でもコマンド形式でも対応してっからな～。\nたとえば、コマンドで3を判定すんなら『/prime 3』って打ってみればいんだべさ。\n気軽に、判定したい数字を教えてけろな～。"
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
        await wait(0);
        let grl = await main.processMessage(commandParts.join(" "));
        await wait(0);
        setTimeout(async () => {
            removeTypingIndicator();
            if (grl !== false) {
                appendMessage(grl, "bot", "素数判定機", "prime.png", "")
            } else {
                appendMessage(commandParts[0].match("/") ? "ERROR: INVALID COMMAND. CHECK \"/help\" . " : responses[detectCharacter(commandParts[0])].oops, 'bot', commandParts[0].match("/") ? cmctrlName : botName, 'prime.png', '');
            }
        }, 1000);

    }

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
    setTimeout(async () => {
        removeTypingIndicator();
        appendMessage(await main.sendGreeting(character), 'bot', "素数判定機", 'prime.png', '');
    }, 1000)
}


async function getCharacterGreeting(character) {
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
    const randomCharacter = characters.includes(character) ? character : await main.settingsRead("chat.character") || "AI" //characters[Math.floor(Math.random() * characters.length)];
    const timeOfDay = getGreetingByTime();
    return greetings[randomCharacter][timeOfDay];
}

function convertNumber(n) {
    let fn = String(n).split("");
    for (let i = 0; i < fn.length; i++) {
        fn[i] = !isNaN(parseInt(fn[i])) ? String(parseInt(fn[i])) : "";
    };
    return fn.join("");
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

function wait(msec) { return new Promise(function (resolve) { setTimeout(function () { resolve() }, msec); }) }

