async function aboutPrime(n, option = "ud") {
    if (await isPrime(n)) return n;
    let x = 0n;
    while (true) {
        if ((option == "ud" || option == "up") && await isPrime(n + x)) return n + x;
        if ((option == "ud" || option == "dn") && await isPrime(n - x)) return n - x;
        x++;
        if (x > 1000n) return false;
    }
}

async function isPrime(n) {
    let methodN = settingsManager("get","main.testMethod");
    if (n == "") { n = 0 };
    if (isNaN(parseInt(n)) || BigInt(String(n)) < 2n) return false;
    let nB = BigInt(removeString(n));
    if (nB > 9007199254740992n) {
        if (((nB + 1n) & nB) == 0) {
            return lucasTest(nB);
        } else {
            if (nB < 2n**64n) {
                switch (methodN) {
                    case "MILLER-RABIN-64":
                        return isPrimeMR_64(nB);
                    default:
                        return isPrimeMR2_64(nB);
                }
            } else if (nB < 3317044064679887385961981n && (methodN == "MILLER-RABIN" || methodN == "MILLER-RABIN-64" || methodN == "MILLER-RABIN-64-FAST")) {
                return isPrimeMR3e24(nB);
            } else if (methodN == "APR-CL-MULTI") {
                return apr_cl_f(nB);
            } else {
                return APRtest(nB);
            }
        }
    }
    let result;
    switch (methodN) {
        case "default": {
            result = factor_isPRIME_v6(n);
            break;
        }
        case "old.v1": {
            result = PRIME_v1(parseInt(n));
            break;
        }
        case "old.v2": {
            result = PRIME_v2(parseInt(n));
            break;
        }
        case "old.v3": {
            result = PRIME_v10(n, 2);
            break;
        }
        case "old.v4": {
            result = PRIME_v10(n, 3);
            break;
        }
        case "old.v5": {
            result = PRIME_v10(n, 5);
            break;
        }
        case "old.v6": {
            result = PRIME_v10(n, 7);
            break;
        }
        case "old.v7": {
            result = PRIME_v10(n, 11);
            break;
        }
        case "old.v8": {
            result = PRIME_v10(n, 13);
            break;
        }
        case "old.v9": {
            result = PRIME_v10(n, 17);
            break;
        }
        case "old.v10": {
            result = PRIME_v10(n, 19);
            break;
        }
        case "new.v1": {
            result = factor_isPRIME_v1(n);
            break;
        }
        case "new.v2": {
            result = factor_isPRIME_v2(n);
            break;
        }
        case "new.v3": {
            result = nPRIME_v10(n, 2);
            break;
        }
        case "new.v4": {
            result = nPRIME_v10(n, 3);
            break;
        }
        case "new.v5": {
            result = nPRIME_v10(n, 5);
            break;
        }
        case "new.v6": {
            result = factor_isPRIME_v6(n);
            break;
        }
        case "new.v7": {
            result = nPRIME_v10(n, 11);
            break;
        }
        case "new.v8": {
            result = nPRIME_v10(n, 13);
            break;
        }
        case "new.v9": {
            result = nPRIME_v10(n, 17);
            break;
        }
        case "new.v10": {
            result = nPRIME_v10(n, 19);
            break;
        }
        case "APR-CL": {
            result = APRtest(nB);
            break;
        }
        case "APR-CL-MULTI": {
            result = apr_cl_f(nB);
            break;
        }
        case "MILLER-RABIN-64": {
            result = isPrimeMR_64(nB);
            break;
        }
        case "MILLER-RABIN" || "MILLER-RABIN-64-FAST": {
            result = isPrimeMR2_64(nB);
            break;
        }
        case "AKS": {
            result = isPrimeAKS(Number(n));
            break;
        }
        default: {
            result = factor_isPRIME_v6(n);
            break;
        }
    }
    return result;
}

// 素因数分解の結果から約数を求める関数（ビット演算を使用）
function findDivisorsWithBitOperations(primeFactors) {
    const primes = Object.keys(primeFactors).map(Number);
    const exponents = Object.values(primeFactors);

    // 総組み合わせ数 = (指数 + 1) の積（各素数の指数 + 1）
    const totalCombinations = exponents.reduce((acc, exponent) => acc * (exponent + 1), 1);
    const divisors = new Set();

    // すべての組み合わせを列挙
    for (let mask = 0; mask < totalCombinations; mask++) {
        let divisor = 1;
        let combinationIndex = mask;

        // 各素数の指数に基づいて値を掛け合わせる
        for (let i = 0; i < primes.length; i++) {
            const exponent = combinationIndex % (exponents[i] + 1);
            divisor *= Math.pow(primes[i], exponent);
            combinationIndex = Math.floor(combinationIndex / (exponents[i] + 1));
        }

        divisors.add(divisor);
    }

    // 小さい順にソートして返す
    return Array.from(divisors).sort((a, b) => a - b);
}

// 素因数分解の文字列を解析し、オブジェクト形式に変換する関数
function parsePrimeFactorization(factorizationStr) {
    const factors = factorizationStr.split('×').map(factor => factor.trim());

    const primeFactors = {};

    factors.forEach(factor => {
        if (factor.includes('^')) {
            const [prime, exponent] = factor.split('^').map(Number);
            primeFactors[prime] = exponent;
        } else {
            const prime = Number(factor);
            primeFactors[prime] = 1;
        }
    });

    return primeFactors;
}

function splitLatexByFifthX(latexString) {
    // 全ての × をカウントし、5 つ目の × で分割
    const parts = latexString.split(/×/); // 正規表現で × を分割
    let count = 0;
    let result = [];
    let currentPart = '';

    parts.forEach(part => {
        count += (part.match(/×/g) || []).length; // 部分文字列中の × の数をカウント
        currentPart += part;
        if (count >= 5) {
            result.push(currentPart);
            count = 0;
            currentPart = '';
        }
    });

    // 残りの部分を結果に追加
    if (currentPart) {
        result.push(currentPart);
    }

    return result;
}
