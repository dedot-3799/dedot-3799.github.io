function text_counter(e) {
    var count = e.length
    return count
}

function time_now() {
    var time = new Date().toISOString()
    return time
}

function convert_full_pitch(str) {
    if (!str) return value;
    return String(str).replace(/[!-~]/g, function (all) {
        return String.fromCharCode(all.charCodeAt(0) + 0xFEE0);
    });
}

function convert_single_byte(str) {
    return String(str).replace(/[ａ-ｚＡ-Ｚ０-９，．〜＝ー＠「」：＊＋？＿！“＃＄％＆‘（）]/g, function (all) {
        return String.fromCharCode(all.charCodeAt(0) - 0xFEE0)
    });
}

function url_encoder(e) {
    const encoded = encodeURI(e)
    return encoded
}

function url_decoder(e) {
    const decoded = decodeURI(e)
    return decoded
}

function zeroPadding(NUM, LEN) {
    return (Array(LEN).join('0') + NUM).slice(-LEN);
}

function second_to_time(e) {
    const second = e
    const sec = second % 60;
    const hour = Math.floor(second / 3600);
    const minute = Math.floor((second / 60) - (hour * 60))
    const s = zeroPadding(sec, 2)
    const m = zeroPadding(minute, 2)
    var time = hour + ":" + m + ":" + s;
    console.log(time);
    return time;
}

function unix_clock() {
    var t = new Date().getTime()
    var e_t = t / 1000
    v(e_t)
}

function n_2(num) {
    var re = parseInt(num, 2)
    return re
}

function n_16(num) {
    var re = parseInt(num, 16)
    return re
}

function converter(convert, text) {
    if (convert == "count") {
        var counted = text_counter(text) + "文字"
        return counted
    } else if (convert == "single_byte") {
        var edited = convert_single_byte(text)
        return edited
    } else if (convert == "full_pitch") {
        var edited = convert_full_pitch(text)
        return edited
    } else if (convert == "URL_Encode") {
        var edited = url_encoder(text)
        return edited
    } else if (convert == "URL_Decode") {
        var edited = url_decoder(text)
        return edited
    } else if (convert == "second_to_time") {
        var edited = second_to_time(text)
        return edited
    } else if (convert == "2n") {
        var edited = n_2(text)
        return edited
    } else if (convert == "16n") {
        var edited = n_16(text)
        return edited
    } else if (convert == "n16") {
        var num_1 = parseInt(text, 10)
        var edited = num_1.toString(16)
        return edited
    } else if (convert == "n2") {
        var num_1 = parseInt(text, 10)
        var edited = num_1.toString(2)
        return edited
    } else {
        return "Undefined."
    }
}
function txt_convert() {
    var c = document.getElementById("convSelects").value;
    var txt = document.getElementById("text_conv").value;
    var edited = converter(c, txt);
    v(edited);
}

function copyToClipboard(tagValue) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(tagValue)
    } else {
        tagText.select()
        document.execCommand('copy')
    }
}

function copy() {
    var t = document.getElementById("output_conv").innerText
    copyToClipboard(t);
}

function v(b) {
    output_conv.innerHTML = b
}

function callback(data) {
    console.log("IPv4:" + data.ip + ", " + data.org + ", " + data.city + ", " + data.region + ", " + data.country);
    ip_1.innerHTML = "IPv4:" + data.ip + ", " + data.org + ", " + data.city + ", " + data.region + ", " + data.country
}

function hr_reset() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById("hr_s_"+String(i)).value = "";
    }
}
function hr_cal() {
    var sd_1 = Number(document.getElementById("hr_s_1").value);
    var sd_2 = Number(document.getElementById("hr_s_2").value);
    var sd_3 = Number(document.getElementById("hr_s_3").value);

    const s = (sd_1 + sd_2 + sd_3) / 2;
    var rs = ((s * (s - sd_1) * (s - sd_2) * (s - sd_3)) ** (0.5));

    const y = sd_1 + sd_2
    if (y <= sd_3) {
        var rs = "Error (It is not a triangle.)"
    }

    if (sd_1 <= 0 || sd_2 <= 0 || sd_3 <= 0) {
        var rs = "Error (It is not a triangle.)"
    }

    document.getElementById("hr_result").innerHTML = rs
}

function hr_cp() {
    var t = Number(document.getElementById("hr_result").innerText)
    if (!isNaN(t)) { copyToClipboard(String(t)) };
}