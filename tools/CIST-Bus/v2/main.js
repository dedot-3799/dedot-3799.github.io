let data = [];
let loaded = false;
var stpwd = "乗り場";
var offset = 0;

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
        let b = Object.keys(data[1][0]);
        b.forEach(v => {
            if (v.match(/乗り場/)) stpwd = v;
        });
        loaded = true;
    })
    .catch(error => {
        loadStatus.textContent = error;
        console.error('エラー:', error);
    });

getNtpOffset();

async function getNtpOffset() {
    const clientTime = Date.now();
    const T1 = performance.now();
    const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
    const T4 = performance.now();

    const data = await res.json();
    const serverTime = new Date(data.datetime).getTime(); // T3 ≒ T2（WorldTimeAPIは1時刻のみ）


    const RTT = T4 - T1;
    offset = serverTime-(clientTime + RTT / 2);

    console.log(clientTime,serverTime,serverTime-clientTime,offset)

    console.log(`推定RTT: ${RTT.toFixed(2)} ms`);
    console.log(`推定offset: ${offset.toFixed(2)} ms`);
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
        "千歳駅": [42.828800, 141.652444]
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

function timeToNumber(timeStr) {
    let a = timeStr.split(":").map(x => parseInt(x));
    return a[0] * 60 + a[1];
}

function timeToSecondsNumber(times) {
    let a = times.split(":").map(x => parseInt(x));
    console.log(a);
    return a[0] * 3600 + a[1] * 60 + a[2];
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
                    result.push(busData[i]);
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
                    result.push(busData[i]);
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

function toggleForm() {
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

function searchRoute() {
    const start = document.getElementById("start").value.trim();
    const end = document.getElementById("end").value.trim();
    const resultDiv = document.getElementById("result");
    const form = document.getElementById("searchForm");
    const toggleBtn = document.getElementById("toggle-search");
    const option = document.querySelector('input[name="option"]:checked').value;
    if (!start || !end) {
        resultDiv.innerHTML = "出発地と到着地を入力してください。";
        resultDiv.style.display = "block";
        return;
    }

    if (!loaded) {
        resultDiv.innerHTML = "バスデータを読み込み中。";
        resultDiv.style.display = "block";
        form.classList.add("collapsed");
        toggleBtn.style.display = "block";
        return;
    }

    const routes = busFinder(
        document.getElementById("time").value,
        start,
        end,
        option,
        5
    );
    if (start === end) {
        resultDiv.innerHTML = "出発地と到着地が同じです。";
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

    let output = `<strong>検索結果: ${routes.length}件</strong><h6 style="margin-bottom:10px;">検索条件: ${option === "departure" ? `${start} を ${document.getElementById("time").value} に出発して ${end} に到着するバス` : `${start} を出発して ${document.getElementById("time").value} までに ${end} に到着するバス`}</h6>`;
    output += `<div class="bus-result-list">`;
    routes.forEach((bus, idx) => {
        let countdownId = "bus-countdown-" + Math.random().toString(36).slice(2);
        output += `
                <div class="bus-card" data-idx="${idx}">
                    <strong>${bus[start]} → ${bus[end]}</strong>
                    <div class="bus-times">
                        ${typeof bus["備考"] === "undefined" ? "" : (bus["備考"].length > 7 ? "詳細な運行情報あり" : `<div class="bus-note">${bus["備考"]}</div>`)}${typeof bus["乗り場"] === "undefined" ? "" : (start == "本部棟" ? `<span>乗り場: ${bus["乗り場"]}</span>` : "")}<span style="margin-left:auto;font-weight:500;" id="${countdownId}">${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "あと" : ""}${formatTotalMinutes(Math.abs(timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5))))}${timeToNumber(bus[start]) - timeToNumber(new Date().toTimeString().slice(0, 5)) >= 0 ? "" : "前"} </span>
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
            let bus = routes[idx];
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

            let countdownId = "bus-countdown-" + Math.random().toString(36).slice(2);
            detail.innerHTML = `
                        <div class="detail-bus">
                        <div class="text-center mb-2 text-lg" style="display:flex;flex-direction:column;"><span id="isDepartured">${start} 出発まで</span> <span class="bus-countdown" id="${countdownId}" class="font-bold">--:--:--</span></div>
                            <ul class="timeline"></ul>
                        ${typeof bus["備考"] === "undefined" ? "" : `<div class="text-xs" style="color:#d32f2f;">※${bus["備考"]}</div>`}
                        ${typeof bus["乗り場Bus"] === "undefined" ? "" : `<div class="text-xs" style="color:#555;">乗り場: ${bus["乗り場Bus"]}</div>`}</div>
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
                let now = new Date(Date.now()+offset);
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
                            let next = (1000 - (now.getMilliseconds() + offset)%1000) % 1000;
                            detail._timer = setTimeout(updateCountdown, next);
                        } catch (er) { console.error(er) }
                    }
                }
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