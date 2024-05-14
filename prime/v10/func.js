
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
