
function ApplyRandomNumber() {
    document.getElementById('res').value = Number(RandCreatedResult.innerHTML)
    closeRandomModal();
}

function createRandomNumber() {
    if (document.getElementById('isOddNumber').checked && document.getElementById('islog').checked) {
        var num = OddOnlyRandL();
        RandCreatedResultDescription.innerHTML = `生成結果:${String(num).length}桁の${factor_isPRIME_v6(num) ? "素数" : "奇数"}`;
        RandCreatedResult.innerHTML = `${num}`;
    } else if (!document.getElementById('isOddNumber').checked && document.getElementById('islog').checked) {
        var num = RandL();
        RandCreatedResultDescription.innerHTML = `生成結果:${String(num).length}桁の${isEven(num) ? "偶数" : "奇数"}`;
        RandCreatedResult.innerHTML = `${num}`;
    } else if (document.getElementById('isOddNumber').checked && !document.getElementById('islog').checked) {
        var num = OddOnlyRand();
        RandCreatedResultDescription.innerHTML = `生成結果:${String(num).length}桁の${factor_isPRIME_v6(num) ? "素数" : "奇数"}`;
        RandCreatedResult.innerHTML = `${num}`;
    } else {
        var num = Rand();
        RandCreatedResultDescription.innerHTML = `生成結果:${String(num).length}桁の${isEven(num) ? "偶数" : "奇数"}`;
        RandCreatedResult.innerHTML = `${num}`;
    }
}

function isEven(num) {
    return Number.isInteger(num / 2);
}

function OddOnlyRandL() {
    while (true) {
        var num = Math.floor(10 ** (Math.random() * 17));
        if (num > 1 && num < 2 ** 53) {
            if (num % 2 == 0) {
                num += 1;
                if (num > 2 ** 53) {
                    var num = (2 ** 53) - 1;
                }
                break;
            } else {
                break;
            }
        }
    }
    return num;
}

function OddOnlyRand() {
    while (true) {
        var num = Math.floor(Math.random() * (10 ** 17));
        if (num > 1 && num < 2 ** 53) {
            if (num % 2 == 0) {
                num += 1;
                if (num > 2 ** 53) {
                    var num = (2 ** 53) - 1;
                }
                break;
            } else {
                break;
            }
        }
    }
    return num;
}

function RandL() {
    while (true) {
        var num = Math.floor(10 ** (Math.random() * 17));
        if (num > 1 && num < 2 ** 53) {
            break;
        }
    }
    return num;
}

function Rand() {
    while (true) {
        var num = Math.floor(Math.random() * (10 ** 17));
        if (num > 1 && num < 2 ** 53) {
            break;
        }
    }
    return num;
}

function addSystemTheme() {
    const customStyle = document.getElementById('style');
    customStyle.innerHTML += `@media (prefers-color-scheme: dark) {
            body {
                background-color: #222;
                color: #ffffff;
            }
            .app-container {
                background-color: #333;
            }
            h1 {
                color: #fff;
            }
            .modal {
                background-color: rgba(0,0,0,0.8);
            }
            .modal-content {
                background-color: #333;
            }
            input:hover {
                border-color: #AAAAAA; /* マウスオーバー時のボーダーカラー */
            }
            button:hover {
                border-color: #888; /* マウスオーバー時のボーダーカラー */
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            }
            footer {
                background-color: #333;
                color: #fff;
            }
            footer a {
                color: #FFF;
            }
        }`;
}

function removeSystemTheme() {
    // 特定の文字列を検索して削除する
    const customStyle = document.getElementById('style');
    const originalHTML = customStyle.innerHTML;
    // 正規表現を使用して対応する括弧のペアを考慮して削除
    const regex = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*{.*}/s;
    const updatedHTML = originalHTML.replace(regex, '');

    customStyle.innerHTML = updatedHTML;
}

function changeTheme() {
    var selectedTheme = document.getElementById('themeSelect').value;
    var themeDic = {
        "dark": "dark-mode",
        "darker": "darker-mode",
        "light-blue": "lb-mode",
        "light": "light-mode",
        "dark-blue": "db-mode",
        "sunset": "sunset-mode"
    }
    var themes = Object.keys(themeDic);
    const allElements = document.getElementsByTagName('*');
    SettingsManager("write", "theme", selectedTheme);
    for (let i = 0; i < allElements.length; i++) {
        for (let g = 0; g < themes.length; g++) {
            allElements[i].classList.remove(themeDic[themes[g]]);
        }
    }
    removeSystemTheme();
    if (selectedTheme === 'system') {
        addSystemTheme();
    } else {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add(themeDic[selectedTheme]);
        }
    }
}

function SettingsManager(mode, key, option) {
    switch (mode) {
        case "read": {
            //キーが存在しない場合はそのままJSONを返し、キーがある場合はキーの値を返す
            if (key.length == 0) {
                throw new Error("SettingsManager_reader: Unexpected Key")
            } else {
                try {
                    let k = JSON.parse(sessionStorage.getItem("Settings"));
                    return k[key];
                } catch (err) {
                    throw new Error("SettingsManager_reader: " + err)
                }
            }
        }
        case "write": {
            //指定されたキーの値をOPTIONに変更する
            try {
                let k = sessionStorage.getItem("Settings")
                console.log(k);
                var f = JSON.parse(k);
                f[key] = option;
                sessionStorage.setItem("Settings", JSON.stringify(f));
                return;
            } catch (err) {
                throw new Error("SettingsManager_writer: " + err)
            }
        }
        case "reset": {
            //前バージョンの設定を削除
            if (document.cookie.match("theme=")) {
                document.cookie = "theme=; max-age=0";
            }
            if (document.cookie == "" || !document.cookie.match("}")) {
                deleteAllCookies()
            }
            if (null === (sessionStorage.getItem("Settings"))) {
                console.log("reseting");
                sessionStorage.setItem("Settings", `{"theme":"system"}`)
            };
        }
    }
}

// 初期設定
function firstCheck() {
    SettingsManager("reset")
    //クッキーの読み取り
    let th_cookie = SettingsManager("read", "theme");
    console.log(document.cookie);
    console.log(th_cookie);
    //テーマ設定
    let options = document.getElementById('themeSelect').options;
    for (let option of options) {
        if (option.value === (th_cookie || "system")) option.selected = true;
    }
    const allElements = document.getElementsByTagName('*');
    if (th_cookie == "light") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('light-mode');
        }
    } else if (th_cookie == "dark") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('dark-mode');
        }
    } else if (th_cookie == "light-blue") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('lb-mode');
        }
    } else if (th_cookie == "dark-blue") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('db-mode');
        }
    } else if (th_cookie == "darker") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('darker-mode');
        }
    } else if (th_cookie == "sunset") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('sunset-mode');
        }
    } else if (th_cookie == "system") {
        addSystemTheme();
    } else {
        addSystemTheme();
    }
    //前回の入力の復元
    let f = SettingsManager("read", "inputNumber");
    if (f !== "") {
        document.getElementById("res").value = f;
    }
    let h = SettingsManager("read", "workers");
    if (h !== "") {
        document.getElementById("worker").value = h;
    }
    let g = SettingsManager("read", "mode");
    let optionsA = document.getElementById('ty').options;
    for (let optionA of optionsA) {
        if (optionA.value === (g || "null")) optionA.selected = true;
    }
}


function inputStore() {
    SettingsManager("write", "inputNumber", document.getElementById("res").value)
}

function df() {
    deleteAllCookies()
    document.cookie = "Settings={};"
}

function deleteAllCookies() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;max-age=0'
    }
}