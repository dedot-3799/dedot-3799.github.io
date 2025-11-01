importScripts("./src/primeFunc.js", "./src/mainFunc.js", "./src/primeFuncMLTI.js", "./src/calcFunc.js", "./src/settingsManager.js", "./src/subFunc.js","./src/handleCommand.js");

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
    },
    dev: {
        displayWorkersError: "false"
    }
}

let settingsList = {
    chat: {
        character: ["AI", "Ojou", "Loli", "Mathematician", "Friend", "default"]
    },
    main: {
        testMethod: ["default", "old.v1", "old.v2", "old.v3", "old.v4", "old.v5", "old.v6", "old.v7", "old.v8", "old.v9", "old.v10", "new.v1", "new.v2", "new.v3", "new.v4", "new.v5", "new.v6", "new.v7", "new.v8", "new.v9", "new.v10", "APR-CL", "APR-CL-MULTI", "MILLER-RABIN-64", "AKS", "MILLER-RABIN", "MILLER-RABIN-64-FAST"],
        parserPrecedence: ["2", "3"],
        threads: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]
    },
    view: {
        theme: ["default", "dark", "light"],
        fontFamily: ["sans-serif", "Noto Sans JP", "Sawarabi Gothic", "Zen Kaku Gothic New", "Kosugi", "Noto Serif JP", "Sawarabi Mincho", "Zen Old Mincho", "Hina Mincho", "Kiwi Maru", "Kosugi Maru", "Zen Maru Gothic", "Kaisei Opti", "Zen Kurenaido", "Klee One", "Yomogi", "Mochiy Pop One", "Yuji Syuku", "Stick"]
    },
    dev: {
        displayWorkersError: ["true", "false"]
    }
}

function settingsManager(mode, prf, set) {
    console.log("SettingsManager", mode, prf, set);
    if (mode === "set" || mode === "write" || mode == "save") {
        let g = prf.split(".");
        switch (g.length) {
            case 1:
                if (typeof settingsList[g[0]] == "undefined" || !settingsList[g[0]][0] || !settingsList[g[0]].includes(set)) {
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
        return "Success."
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
        for (let i = 0; i < Object.keys(settings).length; i++) {
            const el = settings[Object.keys(settings)[i]];
            for (let j = 0; j < Object.keys(el).length; j++) {
                const elm = Object.keys(el)[j];
                if (!st[Object.keys(settings)[i]][Object.keys(el)[j]]) st[Object.keys(settings)[i]][Object.keys(el)[j]] = elm;
            }
        }
        console.log(st)
        if (st) {
            settings = st;
        }
    }).catch(error => {
        console.error("Error loading settings:", error);
        // 初期設定がない場合はデフォルト設定を使用
        setItem("settings", settings);
    });
    return "The launch process has been completed successfully.";
}

async function sendMessageToMainThread(data) {
    self.postMessage(data);
}

// サブワーカーへのメッセージ送信
class mainWorkerProcessManager {
    constructor() {
        this.callbacks = new Map();
    }

    sendMaeeageToSubThread(message,UUID) {
        return new Promise((resolve) => {
            const uuid = UUID || crypto.randomUUID();
            this.callbacks.set(uuid,resolve);
            self.postMessage(message);
        });
    }

    rsvRS(resp) {
        if (this.callbacks.has(resp.uuid)) {
            this.callbacks.get(resp.uuid)(resp.result);
            this.callbacks.delete(resp.uuid);
            return true;
        }
        return false;
    }
}

const SPTM = new mainWorkerProcessManager();

// メインスレッドからのリクエスト処理
self.addEventListener("message", async (event) => {
    const { uuid, type, option } = event.data;
    // サブ処理スレッドから来たリクエストの場合
    if (event.data.resultFromMLTI) {
        let hv = SPTM.rsvRS(event.data);
        if (hv) return;
        if (type === "APR-CL-MLTI") {
            const { result } = event.data;
            let resultv = apr_cl_l(result);
            self.postMessage({ delegate: false, uuid, type, time: event.data.time, result: resultv });
            return;
        }
        self.postMessage({ delegate: false, uuid, type, time: event.data.time, result: event.data.result });
        return;
    }

    // メインスレッドからのリクエスト処理
    try {
        let result, isDelegate = false;
        let st = performance.now();
        if (type === "isPrime") {
            result = await isPrime(option,uuid);
        } else if (type === "isPrimeBig") {
            result = await isPrimeBig(option);
        } else if (type === "primeFactorization") {
            result = newPFD_v5(option);
        } else if (type === "divisors") {
            const primeFactors = newPFD_v5(option);
            result = primeFactors === false ? [1, option] : findDivisorsWithBitOperations(parsePrimeFactorization(primeFactors));
        } else if (type === "processMessage") {
            result = await handleCommand(option,uuid);
        } else if (type === "greeting") {
            result = getCharacterGreeting(option);
        } else if (type === "nearPrime") {
            let n = option.number, opt = option.option;
            result = await aboutPrime(BigInt(n), opt);
        } else if (type === "primeList") {
            result = sieveOfSundaram2(option);
        } else if (type === "evaluateFormula") {
            result = parseFormulav2(option);
        } else if (type === "evaluateFormulaQ") {
            result = parseFormulav2Q(option);
        } else if (type === "evaluateFormulaR") {
            result = parseFormulav2R(option);
        } else if (type === "settingsSave") {
            result = settingsManager("save", option.key, option.value, option.opt);
        } else if (type === "settingsChange") {
            result = settingsManager("set", option.key, option.value);
        } else if (type === "settingsGet") {
            result = settingsManager("get", option);
        } else if (type === "nearPrimeUp") {
            result = await aboutPrime(option, "up");
        } else if (type === "nearPrimeDown") {
            result = await aboutPrime(option, "dn");
        } else if (type === "nearPrimeMLTI") {
            result = option;
            isDelegate = true;
        } else if (type === "firstR") {
            result = await firstF();
        } else if (type === "settingsReadALL") {
            result = settingsManager("readALL");
        } else if (type === "historyReadAll") {
            result = historyManager("readAll");
        } else if (type === "APR-CL-MLTI") {
            result = await apr_cl_f(option, uuid, settingsManager("get", "main.threads"));  
        }
        let et = performance.now();
        let time = (et - st);
        console.log(`ProcessingThread: ${type} took ${time} ms, result:${result}, ID: ${uuid}`);
        // UUIDをつけてメインスレッドへ返す
        self.postMessage({ delegate: isDelegate, uuid:uuid, type:type, time:time, result:result, threads: settingsManager("get", "main.threads") });
    } catch (error) {
        if (settingsManager("read", "dev.displayWorkersError") == "true") console.error(error);
        console.log(`ProcessingThread Error: ${type}, Error:${error}, ID: ${uuid}`);
        let time = -255;
        let result = error.toString();
        self.postMessage({ delegate: false, uuid, type, time, result });
    }
});
