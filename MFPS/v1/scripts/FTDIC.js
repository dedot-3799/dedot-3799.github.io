function DI_fc() {
    let [t,h,w] = [Number(document.getElementById("temp_t").value),Number(document.getElementById("temp_h").value),Number(document.getElementById("temp_w").value)];
    if (
        h < 0 ||
        h > 100 ||
        w < 0 ||
        isNaN(t) ||
        isNaN(h) ||
        isNaN(w) ||
        document.getElementById("temp_t").value == "" ||
        document.getElementById("temp_h").value == "" ||
        document.getElementById("temp_w").value == ""
    ) {
        let er = ``;
        if (h < 0) {
            er += `\n[ERROR X13-01] The humidity cannot be a negative number.`;
        }
        if (h > 100) {
            er += `\n[ERROR X13-02] The humidity cannot be greater than 100%.`;
        }
        if (w < 0) {
            er += `\n[ERROR X13-03] The wind speed value cannot be a negative number.`;
        }
        if (isNaN(t)) {
            er += `\n[ERROR X13-11] Invalid temperature value input.`;
        }
        if (isNaN(h)) {
            er += `\n[ERROR X13-12] Invalid humidity value input.`;
        }
        if (isNaN(w)) {
            er += `\n[ERROR X13-13] Invalid wind speed value input.`;
        }
        if (document.getElementById("temp_t").value == "") {
            er += `\n[ERROR X13-21] Temperature value not entered.`;
        }
        if (document.getElementById("temp_h").value == "") {
            er += `\n[ERROR X13-22] Humidity value not entered.`;
        }
        if (document.getElementById("temp_w").value == "") {
            er += `\n[ERROR X13-23] Wind speed value not entered.`;
        }
        document.getElementById("temp_result").innerText = er;
        return;
    } else {
        const tm = 37 - (37 - t) / (0.68 - 0.0014 * h + (1.76 + 1.4 * w ** 0.75) ** -1) - 0.29 * t * (1 - 0.01 * h);
        const DI = 0.81 * tm + 0.01 * h * (0.99 * tm - 14.3) + 46.3;
        const DI_nw = 0.81 * t + 0.01 * h * (0.99 * t - 14.3) + 46.3;
        let wg = `<p>計算結果</p><p><h2>環境</h2></p><p>気温${t}℃(${t * 1.8 + 32}°F,${t + 273.15
        }K),湿度${h}%,風速${w}m/s</p><p><h2>体感温度</h2></p><p>${tm.toString()}℃ (${tm * 1.8 + 32}°F , ${tm + 273.15}K)</p><p><h2>不快指数</h2></p><p>${DI_nw} (${DI_f(DI_nw)})</p>`;
        document.getElementById("temp_result").innerHTML = wg
        function DI_f(DI_t) {
            const DI_v = Number(DI_t);
            if (isNaN(Number(DI_t))) {
                return false;
            } else if (DI_v < 50) {
                return `寒くてたまらない`;
            } else if (DI_v < 55) {
                return `寒い`;
            } else if (DI_v < 60) {
                return `肌寒い`;
            } else if (DI_v < 65) {
                return `何も感じない`;
            } else if (DI_v < 70) {
                return `快適`;
            } else if (DI_v < 75) {
                return `不快感を持つ人が出始める`;
            } else if (DI_v < 80) {
                return `半数以上が不快に感じる`;
            } else if (DI_v < 85) {
                return `全員が不快に感じる`;
            } else if (DI_v >= 85) {
                return `暑くてたまらない`;
            }
        }
    }
}

function temp_reset() {
    let ls = ["temp_t","temp_h","temp_w"];
    ls.forEach(e => {
        document.getElementById(e).value = "";
    });
    document.getElementById("temp_result").innerHTML = "";
}