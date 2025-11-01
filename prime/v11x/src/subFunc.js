function isPrimeDay() {
    let result = { exists: false, ptnS: [], ptn: [] };
    let day = new Date();
    let monthN = new Date(day).getMonth() + 1;
    let dayN = new Date(day).getDate();
    let yearN = new Date(day).getFullYear();

    let ptn1 = Number(String(yearN) + String(monthN) + String(dayN));
    let ptn1A = yearN * 10000 + monthN * 100 + dayN;
    let ptn2 = Number(String(monthN) + String(dayN));
    let ptn2A = monthN * 100 + dayN;
    console.log(day.toString(), monthN, yearN, ptn1, ptn1A, ptn2, ptn2A, dayN);
    if (isPrimeN(ptn1)) {
        result.exists = true;
        result.ptnS.push(`${yearN}年${monthN}月${dayN}日`);
        result.ptn.push(ptn1);
    }
    if (isPrimeN(ptn1A)) {
        result.exists = true;
        result.ptnS.push(`${yearN}年${String(monthN).padStart(2, "0")}月${String(dayN).padStart(2, "0")}日`);
        result.ptn.push(ptn1A);
    }
    if (isPrimeN(ptn2)) {
        result.exists = true;
        result.ptnS.push(`${monthN}月${dayN}日`);
        result.ptn.push(ptn2);
    }
    if (isPrimeN(ptn2A)) {
        result.exists = true;
        result.ptnS.push(`${String(monthN).padStart(2, "0")}月${String(dayN).padStart(2, "0")}日`);
        result.ptn.push(ptn2A);
    }
    if (isPrimeN(dayN)) {
        result.exists = true;
        result.ptnS.push(`${dayN}日`);
        result.ptn.push(dayN);
    }
    return result;
}

function convertNumber(n) {
    let fn = String(n).split("");
    for (let i = 0; i < fn.length; i++) {
        fn[i] = !isNaN(parseInt(fn[i])) ? String(parseInt(fn[i])) : "";
    };
    return fn.join("");
}

function removeZero(number) {
    let f = String(number).split("");
    let g = [];
    let t = true;
    for (let i = 0; i < f.length; i++) {
        if (f[i] !== "0") {
            g.push(f[i]);
            t = false;
        } else if (!t || (f.length === 1)) {
            g.push(f[i]);
        }
    }
    return g.join("");
}

const repaint = async () => {
    await new Promise(resolve => requestAnimationFrame(resolve));
};

function removeStringF(n) {
    return String(n).replace(/[^0-9\-\+\/\÷\(\)\!\^]/g, "");
}

function wait(msec) { return new Promise(function (resolve) { setTimeout(function () { resolve() }, msec); }) }