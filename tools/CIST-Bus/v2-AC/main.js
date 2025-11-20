let data = [];
let tdata = {};
var stpwd = "乗り場";
let loaded = false, loaded1 = false, loaded2 = false, loadederrord = false;
let busLoadedT = document.getElementById("busLoadedT");
let loadedTime = null;
let defaultSettings = {
    isIncludesOfUnrealisticChange: false,
    isIncludesOfLimitedExpressTrain: false,
    isIncludesOfLocalTrain: false,
    isOnlySpecialRapidTrain: false,
    numberOfResults: 5,
    isOnlySemiRapidTrain: false
};
var settings = {};

function settingsManager(mode, key, value) {
    if (mode === "get") {
        if (value === undefined) {
            // 値が指定されていない場合は、設定を取得する
            return settings[key];
        }
    } else if (mode === "set") {
        // 値が指定されている場合は、設定を保存する
        const settingsf = JSON.parse(localStorage.getItem("pref")) || { ...defaultSettings };
        settingsf[key] = value;
        localStorage.setItem("pref", JSON.stringify(settingsf));
        settings[key] = value;
        console.log(settingsf)
    } else if (mode === "reset") {
        settings = { ...defaultSettings };
    }
}

function prefLoad() {
    const pref = JSON.parse(localStorage.getItem("pref")) || { ...defaultSettings };
    settings = { ...pref };
    Object.keys(pref).forEach(key => {
        if (document.getElementById(key) === null) return;
        if (document.getElementById(key).type === "checkbox") {
            document.getElementById(key).checked = pref[key];
        } else {
            document.getElementById(key).value = pref[key];
        }
    });
}

// 出発地と到着地の入れ替えボタン
document.getElementById("reverseDirection").addEventListener("click", () => {
    var st = document.getElementById("start");
    var et = document.getElementById("end");
    var gh = {
        start: st.value,
        end: et.value
    };
    var g = JSON.parse(JSON.stringify(gh));
    var b = ["start", "end"];
    for (let k = 0; k < b.length; k++) {
        const selectElement = document.getElementById(b[k]);
        let options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === g[b[b.length - k - 1]]) {
                options[i].selected = true;
                break;
            }
        }
    };
    settingsSave();
});

document.getElementById("nowLocation").addEventListener("click", () => {
    const locationData = {
        "本部棟": [42.792765, 141.696332],
        "研究実験棟": [42.797254, 141.700024],
        "南千歳駅": [42.808879, 141.675847],
        "千歳駅": [42.828800, 141.652444],
        "新札幌駅": [43.038789, 141.472469],
        "札幌駅": [43.068611, 141.350778]
    };
    let distance = Infinity, result = "", resltAr = [];
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((crd) => {
            const latitude = crd.coords.latitude, longitude = crd.coords.longitude, lDk = Object.keys(locationData);
            for (let i = 0; i < lDk.length; i++) {
                const el = locationData[lDk[i]];
                const Ndistance = 6378.137 * Math.acos(Math.sin(degToRad(longitude)) * Math.sin(degToRad(el[1])) + Math.cos(degToRad(longitude)) * Math.cos(degToRad(el[1])) * Math.cos(degToRad(el[0]) - degToRad(latitude)));
                resltAr.push({ place: lDk[i], distance: Ndistance });
                if (distance > Ndistance) {
                    distance = Ndistance;
                    result = lDk[i];
                }
            }
            const selectElement = document.getElementById("start");
            let options = selectElement.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === result) {
                    options[i].selected = true;
                    break;
                }
            }
            console.log(resltAr);
        }, () => { alert("位置情報の取得に失敗しました。") }, { enableHighAccuracy: true });
    } else {
        alert("お使いのブラウザでは位置情報を取得できません。")
    }
});

function degToRad(n) {
    return n / 180 * Math.PI;
}

//時間(分)を比較するために数値化する関数
function timeToNumber(timeStr) {
    let a = timeStr.split(":").map(x => parseInt(x));
    return a[0] * 60 + a[1];
}

function timeToSecondsNumber(times) {
    let a = times.split(":").map(x => parseInt(x));
    console.log(a);
    return a[0] * 3600 + a[1] * 60 + a[2];
}

// 電車からの乗り換えをしなければならない場合
function trainBusFinder(time, from, to, option = "departure", length) {
    let result = [];
    let c = 0;
    // 電車データ取得
    let trainData = [], flag = false;
    if ((to == "札幌駅" && (from == "本部棟" || from == "研究実験棟")) ||
        (to == "新札幌駅" && (from == "本部棟" || from == "研究実験棟"))) {
        // ディープコピー
        trainData = JSON.parse(JSON.stringify(tdata["ミセ発"]));
        flag = true;
    } else if ((from == "札幌駅" && (to == "本部棟" || to == "研究実験棟")) ||
        (from == "新札幌駅" && (to == "本部棟" || to == "研究実験棟"))) {
        // ディープコピー
        trainData = JSON.parse(JSON.stringify(tdata["ミセ着"]));
        flag = false;
    } else {
        console.log("undefined")
        return [];
    }
    switch (option) {
        case "departure": {
            for (let i = 0; i < trainData.length; i++) {
                if (c >= length) break;
                if (typeof trainData[i][!flag ? "stopTime" : "bus"][from] == "undefined" || typeof trainData[i][flag ? "stopTime" : "bus"][to] == "undefined") continue;
                if ((timeToNumber(time) <= timeToNumber(trainData[i][!flag ? "stopTime" : "bus"][from]))) {
                    if (!settings.isIncludesOfUnrealisticChange && Math.abs(timeToNumber(time) - timeToNumber(trainData[i][!flag ? "stopTime" : "bus"][from])) < 4) continue;
                    if (settings.isOnlySpecialRapidTrain && !trainumbertoname(trainData[i].trainNumber).startsWith("特別快速")) continue;
                    if (settings.isOnlySemiRapidTrain && !trainumbertoname(trainData[i].trainNumber).startsWith("区間快速")) continue;
                    if (!settings.isIncludesOfLimitedExpressTrain && trainumbertoname(trainData[i].trainNumber).startsWith("特急")) continue;
                    if (!settings.isIncludesOfLocalTrain && trainumbertoname(trainData[i].trainNumber).startsWith("普通列車")) continue;
                    let tmp = {};
                    delete trainData[i]["bus"]["千歳駅"];
                    trainData[i]["stopTime"][flag ? "南千歳駅発" : "南千歳駅着"] = trainData[i]["stopTime"]["南千歳駅"];
                    delete trainData[i]["stopTime"]["南千歳駅"];
                    trainData[i]["bus"][flag ? "南千歳駅着" : "南千歳駅発"] = trainData[i]["bus"]["南千歳駅"];
                    delete trainData[i]["bus"]["南千歳駅"];
                    if (flag) tmp = { ...trainData[i]["bus"], ...trainData[i]["stopTime"] }; else tmp = { ...trainData[i]["stopTime"], ...trainData[i]["bus"] };
                    let ent = Object.entries(tmp);
                    ent.sort((a, b) => timeToNumber(a[1]) - timeToNumber(b[1]));
                    tmp = Object.fromEntries(ent);
                    if (!settings.isIncludesOfUnrealisticChange && Math.abs(timeToNumber(tmp["南千歳駅着"]) - timeToNumber(tmp["南千歳駅発"])) < 4) continue;
                    result.push({ trainNumber: trainData[i].trainNumber, result: tmp });
                    c++;
                }
            }
            break;
        }
        case "arrival": {
            for (let i = trainData.length - 1; i >= 0; i--) {
                if (c >= length) break;
                if (typeof trainData[i][!flag ? "stopTime" : "bus"][from] == "undefined" || typeof trainData[i][flag ? "stopTime" : "bus"][to] == "undefined") continue;
                if ((timeToNumber(time) >= timeToNumber(trainData[i][flag ? "stopTime" : "bus"][to]))) {
                    if (settings.isOnlySpecialRapidTrain && !trainumbertoname(trainData[i].trainNumber).startsWith("特別快速")) continue;
                    if (settings.isOnlySemiRapidTrain && !trainumbertoname(trainData[i].trainNumber).startsWith("区間快速")) continue;
                    if (!settings.isIncludesOfLimitedExpressTrain && trainumbertoname(trainData[i].trainNumber).startsWith("特急")) continue;
                    if (!settings.isIncludesOfLocalTrain && trainumbertoname(trainData[i].trainNumber).startsWith("普通列車")) continue;
                    let tmp;
                    delete trainData[i]["bus"]["千歳駅"];
                    trainData[i]["stopTime"][flag ? "南千歳駅発" : "南千歳駅着"] = trainData[i]["stopTime"]["南千歳駅"];
                    delete trainData[i]["stopTime"]["南千歳駅"];
                    trainData[i]["bus"][flag ? "南千歳駅着" : "南千歳駅発"] = trainData[i]["bus"]["南千歳駅"];
                    delete trainData[i]["bus"]["南千歳駅"];
                    if (flag) tmp = { ...trainData[i]["bus"], ...trainData[i]["stopTime"] }; else tmp = { ...trainData[i]["stopTime"], ...trainData[i]["bus"] };
                    let ent = Object.entries(tmp);
                    ent.sort((a, b) => timeToNumber(a[1]) - timeToNumber(b[1]));
                    tmp = Object.fromEntries(ent);
                    if (!settings.isIncludesOfUnrealisticChange && Math.abs(timeToNumber(tmp["南千歳駅着"]) - timeToNumber(tmp["南千歳駅発"])) < 4) continue;
                    result.push({ trainNumber: trainData[i].trainNumber, result: tmp });
                    c++;
                }
            }
            break;
        }
        default:
            break;
    }
    console.log(result);
    return result;
}

function busFinder(time, from, to, option = "departure", length) {
    let result = [];
    let c = 0;
    switch (option) {
        // 出発時間の指定
        case "departure": {
            // バスデータ取得
            let busData;
            if (from.match(/駅/)) {
                busData = data[0];
            } else if (from == "研究実験棟" && to == "本部棟") {
                busData = data[0];
            } else {
                busData = data[1];
            }
            for (let i = 0; i < busData.length; i++) {
                if (c >= length) break;
                if (typeof busData[i][to] == "undefined" || typeof busData[i][from] == "undefined") continue;
                if ((timeToNumber(time) <= timeToNumber(busData[i][from]))) {
                    result.push({ result: busData[i] });
                    c++;
                }
            }
            break;
        }
        // 到着時間の指定
        case "arrival": {
            // バスデータ取得
            let busData;
            if (from.match(/駅/)) {
                busData = data[0];
            } else if (from == "研究実験棟" && to == "本部棟") {
                busData = data[0];
            } else {
                busData = data[1];
            }
            for (let i = busData.length - 1; i >= 0; i--) {
                if (c >= length) break;
                if (typeof busData[i][to] == "undefined" || typeof busData[i][from] == "undefined") continue;
                if ((timeToNumber(time) >= timeToNumber(busData[i][to]))) {
                    result.push({ result: busData[i] });
                    c++;
                }
            }
            break;
        }
        default:
            break;
    }
    return result;
}

let firstSearch = false;

function toggleForm() {
    const form = document.getElementById("searchForm");
    const toggleBtn = document.getElementById("toggle-search");
    const prf = document.getElementById("settings-screen");
    if (!firstSearch) {
        if (prf.classList.contains("collapsed") && !form.classList.contains("collapsed")) { 
            return; 
        } else if (!prf.classList.contains("collapsed")) {
            form.classList.toggle("collapsed"); prf.classList.add("collapsed");
        } else {
            form.classList.toggle("collapsed");
        } 
    } else {
        if (!prf.classList.contains("collapsed")) {
            if (form.classList.contains("collapsed")) {
                toggleBtn.textContent = "検索条件を変更";
                document.getElementById("result").style.display = "block";
            } else {
                toggleBtn.textContent = "検索結果に戻る";
                document.getElementById("result").style.display = "none";
            }
            prf.classList.add("collapsed");
        } else {
            form.classList.toggle("collapsed");
            if (form.classList.contains("collapsed")) {
                toggleBtn.textContent = "検索条件を変更";
                document.getElementById("result").style.display = "block";

            } else {
                toggleBtn.textContent = "検索結果に戻る";
                document.getElementById("result").style.display = "none";
            }
        }
    }
}

function toggleSettings() {
    const prf = document.getElementById("settings-screen");
    const form = document.getElementById("searchForm");
    prf.classList.remove("collapsed");
    form.classList.add("collapsed");
    const toggleBtn = document.getElementById("toggle-search");
    toggleBtn.classList.toggle("collapsed");
}

function formatTotalMinutes(totalMinutes) {
    const sign = totalMinutes < 0 ? -1 : 1;
    const absoluteMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absoluteMinutes / 60) * sign;
    const minutes = (absoluteMinutes % 60) * sign;

    let formattedString = "";
    if (hours !== 0) {
        formattedString += `${hours}時間`;
    }
    formattedString += `${minutes}分`;

    return formattedString;
}

function trainumbertoname(trainnm) {
    if (!trainnm) return "";
    if (trainnm.length == 2) {
        return `特急北斗${Number(trainnm.substr(0, 1))}号`;
    }
    if (trainnm.length == 3) {
        if (trainnm.startsWith("3")) {
            return `特急とかち${Number(trainnm.substr(0, 2))-30}号`;
        } else if (trainnm.startsWith("1")) {
            return `特急北斗${Number(trainnm.substr(0, 2))}号`;
        } else if (trainnm.startsWith("2")) {
            return `特急北斗${Number(trainnm.substr(0, 2))}号`;
        }
    }
    if (trainnm.length != 5) return "";
    switch (true) {
        case trainnm.startsWith("1"):
            return `特急すずらん${Number(trainnm.substr(0, 4)) - 1000}号`;
        case trainnm.startsWith("3"):
            return `快速エアポート${Number(trainnm.substr(0, 4)) - 3800}号`;
        case trainnm.startsWith("40"):
            return `特急おおぞら${Number(trainnm.substr(0, 4)) - 4000}号`;
        case trainnm.startsWith("4"):
            return `特別快速エアポート${Number(trainnm.substr(0, 4)) - 4800}号`;
        case trainnm.startsWith("5"):
            return `区間快速エアポート${Number(trainnm.substr(0, 4)) - 5800}号`;
        default:
            return `普通列車(${trainnm})`;
    }
}

function parseDetail(n) {
    t = n.replace(/\s+/g, "").replace(/\n+/g, "");
    let reslt = [];
    if ((/発/.test(t) || /行/.test(t))) reslt.push(t.match(/※?.*?(行|発)/)[0] + "バス");
    else if (!t.match(/・/)) return n;
    let g = t.split("・");
    for (let i = 0; i < g.length; i++) {
        const l = g[i];
        if (new RegExp(`${new Date().getMonth() + 1}[/]?${new Date().getDate()}`).test(l) && /:/.test(l)) reslt.push(l.split("：")[1]);
        else if (new RegExp(`${new Date().getMonth() + 1}[/]?${new Date().getDate()}`).test(l)) {
            let ga = l.split(/\(.\)/)[1];
            if (!/運/.test(ga)) ga += "運行";
            reslt.push("本日"+ga);
        }
    }
    return reslt.length == 0 ? "運行情報なし":reslt.join("\n");
};

function searchRoute() {
    const start = document.getElementById("start").value.trim();
    const end = document.getElementById("end").value.trim();
    const resultDiv = document.getElementById("result");
    const form = document.getElementById("searchForm");
    const toggleBtn = document.getElementById("toggle-search");
    const option = document.querySelector('input[name="option"]:checked').value;
    firstSearch = true;
    if (!start || !end) {
        resultDiv.innerHTML = "出発地と到着地を入力してください。";
        resultDiv.style.display = "block";
        return;
    }

    if (start === end) {
        resultDiv.innerHTML = "出発地と到着地が同じです。";
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    if (!loaded) {
        resultDiv.innerHTML = "経路情報を取得中です。";
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    if (loadederrord) {
        resultDiv.innerHTML = "経路情報の取得に失敗しました。再読み込みしてください。";
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    let routes;
    if ((end == "札幌駅" && (start == "本部棟" || start == "研究実験棟")) ||
        (end == "新札幌駅" && (start == "本部棟" || start == "研究実験棟")) ||
        (start == "札幌駅" && (end == "本部棟" || end == "研究実験棟")) ||
        (start == "新札幌駅" && (end == "本部棟" || end == "研究実験棟"))) {
        routes = trainBusFinder(
            document.getElementById("time").value,
            start,
            end,
            option,
            settings.numberOfResults
        );
    } else if ((["千歳駅", "南千歳駅", "研究実験棟"].includes(start) && ["千歳駅", "南千歳駅", "本部棟"].includes(end)) || (["千歳駅", "南千歳駅", "研究実験棟"].includes(end) && ["千歳駅", "南千歳駅", "本部棟"].includes(start))) {
        routes = busFinder(
            document.getElementById("time").value,
            start,
            end,
            option,
            settings.numberOfResults
        );
    } else {
        resultDiv.innerHTML = `${start} から ${end} までの経路案内はサポートされていません。`;
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    if (routes.length === 0) {
        resultDiv.innerHTML = "経路情報が見つかりません。";
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    let output = `<strong>検索結果: ${routes.length}件</strong><h6 style="margin-bottom:10px;">検索条件: ${option === "departure" ? `${start} を ${document.getElementById("time").value} に出発して ${end} に到着する経路` : `${start} を出発して ${document.getElementById("time").value} までに ${end} に到着する経路`}</h6>`;
    output += `<div class="bus-result-list">`;
    routes.forEach((rt, idx) => {
        let bus = rt.result;
        let countdownId = "bus-countdown-" + Math.random().toString(36).slice(2);
        output += `
                <div class="bus-card" data-idx="${idx}">
                    <strong>${bus[start]} → ${bus[end]} </strong> <span>(${timeToNumber(bus[end]) - timeToNumber(bus[start])}分)</span>
                    <div class="bus-times">
                        ${(typeof bus["南千歳駅発"] != "undefined" || typeof bus["南千歳駅着"] != "undefined") && trainumbertoname(routes[idx].trainNumber).startsWith("特急") ? "<div class='bus-note'>特急利用</div>" : ""}${typeof bus["備考"] === "undefined" ? "" : (`<div class="bus-note">${parseDetail(bus["備考"])}</div>`)}${typeof bus["南千歳駅発"] != "undefined" || typeof bus["南千歳駅着"] != "undefined" ? (timeToNumber(bus["南千歳駅発"]) - timeToNumber(bus["南千歳駅着"]) < 5 ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--text-color)" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>乗換時間が短いです ' : "") : ""}${typeof bus[stpwd] === "undefined" ? "" : (start == "本部棟" ? `<span>乗り場: ${bus[stpwd]}</span>` : "")}<span style="margin-left:auto;font-weight:500;" id="${countdownId}">${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "あと" : ""}${formatTotalMinutes(Math.abs(timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5))))}${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "" : "前"} </span>
                    </div>
                    
                    <div class="bus-detail-content"></div>
                </div>
                `;
        // setTimeout再帰呼び出しで誤差を減らす
        let timer = null;
        function updateCountdown() {
            let now = new Date();
            let [h, m] = bus[start].split(":").map(Number);
            let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
            let diff = Math.floor((target - now) / 1000);
            let sign = diff < 0;
            diff = Math.abs(diff);
            let hh = String(Math.floor(diff / 3600)).padStart(2, "0");
            let mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
            let ss = String(diff % 60).padStart(2, "0");
            let el = document.getElementById(countdownId);
            if (el) el.textContent = `${sign ? "" : "あと"}${hh == "00" ? "" : hh + "時間"}${mm == "00" ? "" : mm + "分"}${(hh != "00" || mm != "00") ? "" : ss + "秒"}${sign ? "前" : ""}`;
            let next = 1000 - (now.getMilliseconds());
            timer = setTimeout(updateCountdown, next);
        }
        updateCountdown();
        // タイマーIDをbusカードに保存
        let card = document.querySelector(`.bus-card[data-idx="${idx}"]`);
        if (card) card._countdownTimer = timer;
    });
    output += `</div>`;
    resultDiv.innerHTML = output;
    resultDiv.style.display = "block";
    form.classList.add("collapsed");
    toggleBtn.style.display = "block";

    // バスカードクリックで詳細展開
    document.querySelectorAll('.bus-card').forEach(card => {
        card.addEventListener('click', function (e) {
            let alreadyOpen = this.classList.contains("open");
            document.querySelectorAll('.bus-card.open').forEach(el => {
                el.classList.remove("open");
                let detail = el.querySelector('.bus-detail-content');
                // setTimeout再帰呼び出しを止める
                if (detail && detail._timer) {
                    clearTimeout(detail._timer);
                    detail._timer = null;
                }
                // 一覧のカウントダウンタイマーも止める
                if (el._countdownTimer) {
                    clearTimeout(el._countdownTimer);
                    el._countdownTimer = null;
                }
                detail.innerHTML = "";
                detail.style.maxHeight = "0";
                detail.style.opacity = "0";
                detail.style.pointerEvents = "none";
            });
            if (alreadyOpen) return;
            this.classList.add("open");
            let idx = parseInt(this.getAttribute('data-idx'));
            let bus = routes[idx].result;
            let detail = this.querySelector('.bus-detail-content');
            // 詳細内容生成

            let timelineData = [];
            Object.keys(bus).forEach(key => {
                if (["備考", stpwd].includes(key)) return;
                if (key.match(/乗り場/)) return;
                if (key == start) {
                    timelineData.push({ time: bus[key], location: key, type: 'start' });
                    return;
                } else if (key == end) {
                    timelineData.push({ time: bus[key], location: key, type: 'end' });
                    return;
                } else {
                    timelineData.push({ time: bus[key], location: key });
                }
            });

            let gw, fl = false;
            try {
                if (start == "南千歳駅") {
                    gw = tdata["ミセ着"].filter(s => s.busTime == bus[start]);
                    if (gw.length == 1) fl = true;
                } else if (end == "南千歳駅") {
                    gw = tdata["ミセ発"].filter(s => s.busTime == bus[end]);
                    if (gw.length == 1) fl = true;
                }

            } catch { fl = false }

            let countdownId = "bus-countdown-" + Math.random().toString(36).slice(2);
            let contentID = "bus-countdown-" + Math.random().toString(36).slice(2);
            detail.innerHTML = `
                        <div class="detail-bus">
                        <div class="text-center mb-2 text-lg" style="display:flex;flex-direction:column;"><span id="isDepartured">${start} 出発まで</span> <span class="bus-countdown" id="${countdownId}" class="font-bold">--:--:--</span>${typeof routes[idx].trainNumber !== "undefined" ? "<span>" + (start.match(/駅/) ? "" : "南千歳駅から ") + trainumbertoname(routes[idx].trainNumber) + " に乗車</span>" : ""}</div>
                            <div id="timeline-${contentID}" class="timeline"></div>
  </div>
                        ${typeof bus["備考"] === "undefined" ? "" : `<div>※${bus["備考"]}</div>`}</div>
                    `;
            console.log(timelineData);
            let busD = createRouteDetail(timelineData, typeof routes[idx].trainNumber == "undefined" ? "" : trainumbertoname(routes[idx].trainNumber), bus[stpwd]);

            // タイムラインの項目を動的に生成
            createTimeline("#timeline-" + contentID, busD);
            window.addEventListener('resize', () => createTimeline('#timeline-' + contentID, busD));
            // カウントダウン
            function updateCountdown() {
                let now = new Date();
                let stp = Object.keys(bus).filter(v => bus[v].match(/\d+:\d+/) && timeToNumber(`${now.getHours()}:${now.getMinutes()}`) - timeToNumber(bus[v]) < 0);
                let el = document.getElementById(countdownId);
                if (stp.length < 1) {
                    el.textContent = "到着済み";
                    let ga = Object.keys(bus).filter(v => bus[v].match(/\d+:\d+/));
                    isDepartured.textContent = ga[ga.length - 1];
                } else {
                    let [h, m] = bus[stp[0]].split(":").map(Number);
                    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
                    let diff = Math.floor((target - now) / 1000);
                    let sign = diff < 0 ? "-" : "";
                    diff = Math.abs(diff);
                    let hh = String(Math.floor(diff / 3600)).padStart(2, "0");
                    let mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
                    let ss = String(diff % 60).padStart(2, "0");

                    if (el) el.textContent = `${sign}${hh == "00" ? "" : hh + "時間"}${mm == "00" ? "" : mm + "分"}${ss + "秒"}`;
                    if (sign == "-" && document.getElementById("result").style.display == "none") {
                        el.textContent = "発車済み";
                        isDepartured.textContent = isDepartured.textContent.split(" ")[0];
                    } else {
                        try {
                            document.getElementById("isDepartured").textContent = `${stp[0]} ${["発", "着"].includes(stp[0].slice(-1)) ? "" : stp.length == 1 ? "到着" : "出発"}まで`;
                            let next = 1000 - (now.getMilliseconds());
                            detail._timer = setTimeout(updateCountdown, next);
                        } catch { }
                    }
                }
            }
            updateCountdown();
            detail.style.maxHeight = "";
            detail.style.opacity = "1";
            detail.style.pointerEvents = "auto";
        });
    });
}

function settingsSave() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    // ラジオボタンの値取得
    const option = document.querySelector('input[name="option"]:checked').value;
    const time = document.getElementById("time").value;
    const settingData = {
        start: start,
        end: end,
        option: option,
        time: time
    };
    localStorage.setItem("settings", JSON.stringify(settingData));
}
function settingsLoad() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (!settings) return;
    let keys = Object.keys(settings);
    keys.forEach((key) => {
        if (key === "option") {
            // ラジオボタンの選択状態復元
            const radio = document.querySelector(`input[name="option"][value="${settings[key]}"]`);
            if (radio) radio.checked = true;
            return;
        }
        if (key === "time") {
            return;
        }
        const selectElement = document.getElementById(key);
        let options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === settings[key]) {
                options[i].selected = true;
                break;
            }
        }
    })
}

// ページが読み込まれたときに設定を読み込む
window.onload = function () {
    settingsLoad();
    document.getElementById("time").value = new Date().toTimeString().slice(0, 5);
    prefLoad();
};
["start", "end", "time"].forEach((el) => {
    document.getElementById(el).addEventListener("change", settingsSave);
});
// ラジオボタンにもイベント追加
document.querySelectorAll('input[name="option"]').forEach((el) => {
    el.addEventListener("change", settingsSave);
});

function shouldReloadBusData() {
    const saved = JSON.parse(localStorage.getItem("busDataMeta"));
    if (!saved) return true;
    const lastWeek = saved.week;
    const now = new Date();
    // 日曜を週の区切りとする
    const currentWeek = now.getFullYear() + "-" + getWeekNumber(now);
    return lastWeek !== currentWeek;
}

function getWeekNumber(d) {
    // 日曜始まりの週番号
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // 日曜まで戻す
    date.setDate(date.getDate() - date.getDay());
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNo = Math.floor(((date - yearStart) / 86400000 + yearStart.getDay()) / 7);
    return weekNo;
}

function saveBusDataToLocal(data, tdata) {
    localStorage.setItem("busData", JSON.stringify({ data, tdata }));
    const now = new Date();
    localStorage.setItem("busDataMeta", JSON.stringify({
        week: now.getFullYear() + "-" + getWeekNumber(now),
        saved: now.toISOString()
    }));
}

function loadBusDataFromLocal() {
    const saved = JSON.parse(localStorage.getItem("busData"));
    if (!saved) return null;
    return saved;
}

// データ取得処理
function fetchBusData() {
    return Promise.all([
        fetch(`https://script.google.com/macros/s/AKfycbwFaXX9a-PRN8nruO75vsLAbOGbZAmMOQeoI5bU1z7MNoIPcARLQHSvFiEeF-bkZpvT/exec`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/plain' }
        }).then(response => {
            if (!response.ok) throw new Error('ファイル取得に失敗しました');
            return response.json();
        }),
        fetch(`https://script.google.com/macros/s/AKfycbwWfnCBAIWII2TzLiqx3UB1DLECGGKDG0hXTf3-RtJYkVGkteqnbJuocZsirbMZEWXO/exec`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/plain' }
        }).then(response => {
            if (!response.ok) throw new Error('ファイル取得に失敗しました');
            return response.json();
        })
    ]);
}

// 初期ロード
(function () {
    let local = loadBusDataFromLocal();
    if (local && !shouldReloadBusData()) {
        data = local.data;
        tdata = local.tdata;
        let b = Object.keys(data[1][0]);
        b.forEach(v => {
            if (v.match(/乗り場/)) stpwd = v;
        });
        loaded = loaded1 = loaded2 = true;
        busLoadedT.textContent = `データの取得に成功しました。(最終取得: ${JSON.parse(localStorage.getItem("busDataMeta")).saved})`;
    } else {
        fetchBusData().then(([dataD, tdataD]) => {
            data = dataD;
            tdata = tdataD;
            let b = Object.keys(data[1][0]);
            b.forEach(v => {
                if (v.match(/乗り場/)) stpwd = v;
            });
            saveBusDataToLocal(data, tdata);
            loaded = loaded1 = loaded2 = true;
        }).catch(error => {
            if (typeof loadStatus !== "undefined") loadStatus.textContent = error;
            loadederrord = true;
        });
    }
})();

document.getElementById("rel_btn").addEventListener("click", async () => {
    loaded = loaded1 = loaded2 = false;
    loadederrord = false;
    if (typeof loadStatus !== "undefined") loadStatus.textContent = "データを再取得しています...";
    await reloadData();
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// データ再取得
let isLoading = false;

async function reloadData() {
    if (isLoading) {
        alert("現在データを取得中です。しばらくお待ちください。");
        return;
    }
    await wait(0);
    isLoading = true;
    busLoadedT.textContent = "データを取得中です...";
    await fetchBusData().then(([dataD, tdataD]) => {
        data = dataD;
        tdata = tdataD;
        let b = Object.keys(data[1][0]);
        b.forEach(v => {
            if (v.match(/乗り場/)) stpwd = v;
        });
        saveBusDataToLocal(data, tdata);
        loaded = loaded1 = loaded2 = true;
        if (typeof loadStatus !== "undefined") loadStatus.textContent = "データの再取得に成功しました。";
        loadederrord = false;
        busLoadedT.textContent = "データの再取得に成功しました。" + `(最終取得: ${JSON.parse(localStorage.getItem("busDataMeta")).saved})`;
        isLoading = false;
        alert("データの再取得に成功しました。");
    }).catch(error => {
        if (typeof loadStatus !== "undefined") loadStatus.textContent = error;
        loadederrord = true;
        isLoading = false;
        alert("データの再取得に失敗しました。" + error);
        busLoadedT.textContent = "データの再取得に失敗しました。" + error;
    });
}