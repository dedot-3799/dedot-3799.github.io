
function ApplyRandomNumber() {
    document.getElementById('res').value = Number(RandCreatedResult.innerHTML);
    openWindow("container1");
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

function NPBP() {
    var num = document.getElementById('NPBP_input').value;
    switch (document.getElementById('NB').value) {
        case "NP": {
            NPBP_result.innerHTML = "計算結果:" + NP(num);
            break;
        }
        case "BP": {
            NPBP_result.innerHTML = "計算結果:" + BP(num);
            break;
        }
        default: {
            NPBP_result.innerHTML = "(ERR-011) Undefined.";
            break;
        }
    }
}

function ApplyPrNumber() {
    document.getElementById('res').value = document.getElementById('NPBP_result').textContent.split(":")[1];
    openWindow("container1");
}
function inputPrNumber() {
    document.getElementById('NPBP_input').value = document.getElementById('res').value
}

function NP(n) {
    var num = Number(n);
    if (BigInt(String(n)) >= 9007199254740997n) {
        return "この数字はサポートされていません。";
    }
    var rs = num + 1;
    while (true) {
        var rq = factor_isPRIME_v6(rs).toString();
        if (rs > 2 ** 53 - 111) {
            return "9007199254740997";
        } else if (rq == "true") {
            break;
        } else {
            rs++;
        }
    }
    return rs.toString()
}

function BP(n) {
    var num = Number(n);
    if (num <= 2) {
        return "これ以上小さい素数はありません。";
    } else if (BigInt(String(n)) > 9007199254740997n) {
        return "この数字はサポートされていません。";
    } else if (BigInt(String(n)) > 9007199254740881n) {
        return "9007199254740881";
    }
    var ri = num - 1;
    while (true) {
        var lq = factor_isPRIME_v6(ri).toString();
        if (lq == "true") {
            break;
        } else {
            ri--;
        }
    }
    return ri.toString()
}

function copy_npbp() {
    var k = document.getElementById('NPBP_result').textContent.split(":")[1];
    if (!isNaN(parseInt(k,10))) copyToClipboard(k)
}

function copyByIdValue(id) {
    copyToClipboard(document.getElementById(id).value)
}

function copyToClipboard(tagValue) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(tagValue)
    } else {
        tagText.select()
        document.execCommand('copy')
    }
}


function convRadixNumber_Copy() {
    var t = document.getElementById('radix_result').textContent.toString();
    copyToClipboard(t)
}

function convRadixNumber_Apply() {
    if (document.getElementById('radix_result').textContent !== "ERR." || document.getElementById('radix_result').textContent !== "Range Error." || document.getElementById('radix_result').textContent !== "Invalid input.") {
        document.getElementById('res').value = parseInt(document.getElementById('radix_result').textContent, Number(document.getElementById('radix_aft_r').value || 36));
    }
    openWindow("container1");
}

function convRadixNumber() {
    var [bnt, rdx_b, rdx_a] = [document.getElementById('radix_bef').value.toUpperCase(), Number(document.getElementById('radix_bef_r').value || 36), Number(document.getElementById('radix_aft_r').value || 10)];
    if (String(document.getElementById('radix_bef').value).length == 0 || isNaN(rdx_b) || isNaN(rdx_a)) {
        radix_result.innerHTML = "Invalid input."
        return;
    }
    if (rdx_a < 2 || rdx_a > 36 || rdx_b < 2 || rdx_b > 36) {
        radix_result.innerHTML = "Range Error. Radix argument must be between 2 and 36."
        return;
    }
    var checkList_b = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var checklist = [];
    for (let i = 0; i < rdx_b; i++) {
        checklist.push(checkList_b[i]);
    };
    var b_arr = bnt.split("");
    for (let u = 0; u < b_arr.length; u++) {
        if (!checklist.includes(b_arr[u])) {
            radix_result.innerHTML = "ERR."
            return;
        }
    }
    if (parseInt(bnt, rdx_b) > 2 ** 53) {
        radix_result.innerHTML = "Invalid input. Inputs greater than 2^53 in decimal system are not supported."
        return;
    }

    radix_result.innerHTML = `${parseInt(bnt, rdx_b).toString(rdx_a).toUpperCase()}`;
}