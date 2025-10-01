let data = [];
let tdata = {};
var stpwd = "乗り場";

fetch(`https://script.google.com/macros/s/AKfycbwFaXX9a-PRN8nruO75vsLAbOGbZAmMOQeoI5bU1z7MNoIPcARLQHSvFiEeF-bkZpvT/exec`, {
    method: 'GET',
    headers: {
        'Content-Type': 'text/plain'
    },
})
    // data.jsonは同じディレクトリ内のファイル名
    .then(response => {
        if (!response.ok) throw new Error('ファイル取得に失敗しました');
        return response.json(); // JSONとしてパース
    })
    .then(dataD => {
        // データをHTMLに表示（例として "name" を表示）
        console.log(dataD)
        data = dataD;
        let d = document.getElementsByTagName('*');
        for (let i = 0; i < d.length; i++) {
            d[i].classList.remove('load');
        }
        let b = Object.keys(data[1][0]);
        b.forEach(v => {
            if (v.match(/乗り場/)) stpwd = v;
        });
        console.log(stpwd);
    })
    .catch(error => {
        loadStatus.textContent = error;
        console.error('エラー:', error);
    });

fetch(`https://script.google.com/macros/s/AKfycbwWfnCBAIWII2TzLiqx3UB1DLECGGKDG0hXTf3-RtJYkVGkteqnbJuocZsirbMZEWXO/exec`, {
    method: 'GET',
    headers: {
        'Content-Type': 'text/plain'
    },
})
    // data.jsonは同じディレクトリ内のファイル名
    .then(response => {
        if (!response.ok) throw new Error('ファイル取得に失敗しました');
        return response.json(); // JSONとしてパース
    })
    .then(dataD => {
        // データをHTMLに表示（例として "name" を表示）
        console.log(dataD)
        tdata = dataD;
    })
    .catch(error => {
        loadStatus.textContent = error;
        console.error('エラー:', error);
    });

function timeToNumber(timeStr) {
    let a = timeStr.split(":").map(x => parseInt(x));
    return a[0] * 60 + a[1];
}

function timeToSecondsNumber(times) {
    let a = times.split(":").map(x => parseInt(x));
    console.log(a);
    return a[0] * 3600 + a[1] * 60 + a[2];
}

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
                if ((timeToNumber(time) < timeToNumber(trainData[i][!flag ? "stopTime" : "bus"][from]))) {
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
                    result.push({trainNumber:trainData[i].trainNumber,result:tmp});
                    c++;
                }
            }
            break;
        }
        case "arrival": {
            for (let i = trainData.length - 1; i >= 0; i--) {
                if (c >= length) break;
                if (typeof trainData[i][!flag ? "stopTime" : "bus"][from] == "undefined" || typeof trainData[i][flag ? "stopTime" : "bus"][to] == "undefined") continue;
                if ((timeToNumber(time) > timeToNumber(trainData[i][flag ? "stopTime" : "bus"][to]))) {
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
                    result.push({trainNumber:trainData[i].trainNumber,result:tmp});
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
                if ((timeToNumber(time) < timeToNumber(busData[i][from]))) {
                    result.push({result:busData[i]});
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
                if ((timeToNumber(time) > timeToNumber(busData[i][to]))) {
                    result.push({result:busData[i]});
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
    if (!firstSearch) return;
    const form = document.getElementById("searchForm");
    const toggleBtn = document.getElementById("toggle-search");
    form.classList.toggle("collapsed");
    if (form.classList.contains("collapsed")) {
        toggleBtn.textContent = "検索条件を変更";
        document.getElementById("result").style.display = "block";
    } else {
        toggleBtn.textContent = "検索結果に戻る";
        document.getElementById("result").style.display = "none";
    }
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
    if (trainnm.length != 5) return;
    if (trainnm.startsWith("3")) {
        return `快速エアポート${Number(trainnm.substr(0, 4)) - 3800}号`
    } else if (trainnm.startsWith("4")) {
        return `特別快速エアポート${Number(trainnm.substr(0, 4)) - 4800}号`
    } else if (trainnm.startsWith("5")) {
        return `区間快速エアポート${Number(trainnm.substr(0, 4)) - 5800}号`
    } else {
        return;
    }
}

function parseDetail(t) {
    t = t.replace(/\s+/g,"").replace(/\n+/g,"");
    if (!t.match(/・/)) return t;
    let g = t.split("・");
    for (let i = 0; i < g.length; i++) {
        const l = g[i];
        if (new RegExp(`${new Date().getMonth()+1}/${new Date().getDate()}`).test(l)) return l.split("：")[1];
    }
    return "";
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
            5
        );
    } else if ((["千歳駅", "南千歳駅","研究実験棟"].includes(start) && ["千歳駅", "南千歳駅","本部棟"].includes(end)) || (["千歳駅", "南千歳駅","研究実験棟"].includes(end) && ["千歳駅", "南千歳駅","本部棟"].includes(start))) {
        routes = busFinder(
            document.getElementById("time").value,
            start,
            end,
            option,
            5
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

    let output = `<strong>検索結果: ${routes.length}件</strong><h6 style="margin-bottom:10px;">検索条件: ${option === "departure" ? `${start} を ${document.getElementById("time").value} に出発して ${end} に到着するような経路` : `${start} を出発して ${document.getElementById("time").value} までに ${end} に到着するような経路`}</h6>`;
    output += `<div class="bus-result-list">`;
    routes.forEach((rt, idx) => {
        let bus = rt.result;
        
        let countdownId = "bus-countdown-" + Math.random().toString(36).slice(2);
        output += `
                <div class="bus-card" data-idx="${idx}">
                    <strong>${bus[start]} → ${bus[end]} </strong>  (${timeToNumber(bus[end]) - timeToNumber(bus[start])}分)
                    <div class="bus-times">
                        ${typeof bus["南千歳駅発"] != "undefined" || typeof bus["南千歳駅着"] != "undefined" ? (timeToNumber(bus["南千歳駅発"]) - timeToNumber(bus["南千歳駅着"]) < 5 ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--text-color)" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>乗換時間が短いです ':"") :""}${typeof bus["備考"] === "undefined" ? "" : (`<div class="bus-note">${parseDetail(bus["備考"])}</div>`)}${typeof bus[stpwd] === "undefined" ? "" : (start == "本部棟" ? `<span>乗り場: ${bus[stpwd]}</span>` : "")}<span style="margin-left:auto;font-weight:500;" id="${countdownId}">${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "あと" : ""}${formatTotalMinutes(Math.abs(timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5))))}${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "" : "前"} </span>
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
            detail.innerHTML = `
                        <div class="detail-bus">
                        <div class="text-center mb-2 text-lg" style="display:flex;flex-direction:column;"><span>${start} 出発まで</span> <span class="bus-countdown" id="${countdownId}" class="font-bold">--:--:--</span>${typeof routes[idx].trainNumber !== "undefined" ? "<span>"+(start.match(/駅/)?"":"南千歳駅から ")+trainumbertoname(routes[idx].trainNumber)+" に乗車</span>" : ""}</div>
                            <ul class="timeline"></ul>
                        ${typeof bus["備考"] === "undefined" ? "" : `<div>※${bus["備考"]}</div>`}
                        ${typeof bus[stpwd] === "undefined" ? "" : `<div">乗り場: ${bus[stpwd]}</div>`}</div>
                    `;
            const timelineList = document.querySelector('.timeline');
            // タイムラインの項目を動的に生成
            timelineData.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('timeline-item');
                if (item.type === 'start' || item.type === 'end') {
                    li.classList.add(`timeline-${item.type}`);
                }

                li.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <span class="timeline-time">${item.time}</span>
            <span class="timeline-location">${item.location}</span>
        </div>
    `
                timelineList.appendChild(li);
            });

            // カウントダウン
            function updateCountdown() {
                let now = new Date();
                let [h, m] = bus[start].split(":").map(Number);
                let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
                if (target < now) target.setDate(target.getDate() + 1); // 翌日対応
                let diff = Math.floor((target - now) / 1000);
                let sign = diff < 0 ? "-" : "";
                diff = Math.abs(diff);
                let hh = String(Math.floor(diff / 3600)).padStart(2, "0");
                let mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
                let ss = String(diff % 60).padStart(2, "0");
                let el = document.getElementById(countdownId);
                if (el) el.textContent = `${sign}${hh == "00" ? "" : hh + "時間"}${mm == "00" ? "" : mm + "分"}${ss + "秒"}`;
                let next = 1000 - (now.getMilliseconds());
                detail._timer = setTimeout(updateCountdown, next);
            }
            updateCountdown();
            detail.style.maxHeight = "300px";
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
};
["start", "end", "time"].forEach((el) => {
    document.getElementById(el).addEventListener("change", settingsSave);
});
// ラジオボタンにもイベント追加
document.querySelectorAll('input[name="option"]').forEach((el) => {
    el.addEventListener("change", settingsSave);
});