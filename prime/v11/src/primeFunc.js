function factor_isPRIME_v6(n) {
    let num = parseInt(n);
    if (num == 2 || num == 3 || num == 5 || num == 7 || num == 11 || num == 13 || num == 17 || num == 19 || num == 23 || num == 29 || num == 31 || num == 37 || num == 41 || num == 43 || num == 47 || num == 53 || num == 59 || num == 61 || num == 67 || num == 71 || num == 73 || num == 79 || num == 83 || num == 89 || num == 97 || num == 101 || num == 103 || num == 107 || num == 109 || num == 113 || num == 127 || num == 131 || num == 137 || num == 139 || num == 149 || num == 151 || num == 157 || num == 163 || num == 167 || num == 173 || num == 179 || num == 181 || num == 191 || num == 193 || num == 197 || num == 199) { return true }
    if (num <= 1 || Number.isInteger(num / 2) || Number.isInteger(num / 3) || Number.isInteger(num / 5) || Number.isInteger(num / 7) || Number.isInteger(num / 11) || Number.isInteger(num / 13) || Number.isInteger(num / 17) || Number.isInteger(num / 19) || Number.isInteger(num / 23) || Number.isInteger(num / 29) || Number.isInteger(num / 31) || Number.isInteger(num / 37) || Number.isInteger(num / 41) || Number.isInteger(num / 43) || Number.isInteger(num / 47) || Number.isInteger(num / 53) || Number.isInteger(num / 59) || Number.isInteger(num / 61) || Number.isInteger(num / 67) || Number.isInteger(num / 71) || Number.isInteger(num / 73) || Number.isInteger(num / 79) || Number.isInteger(num / 83) || Number.isInteger(num / 89) || Number.isInteger(num / 97) || Number.isInteger(num / 101) || Number.isInteger(num / 103) || Number.isInteger(num / 107) || Number.isInteger(num / 109) || Number.isInteger(num / 113) || Number.isInteger(num / 127) || Number.isInteger(num / 131) || Number.isInteger(num / 137) || Number.isInteger(num / 139) || Number.isInteger(num / 149) || Number.isInteger(num / 151) || Number.isInteger(num / 157) || Number.isInteger(num / 163) || Number.isInteger(num / 167) || Number.isInteger(num / 173) || Number.isInteger(num / 179) || Number.isInteger(num / 181) || Number.isInteger(num / 191) || Number.isInteger(num / 193) || Number.isInteger(num / 197) || Number.isInteger(num / 199)) { return false };
    for (i = 210; i * i <= num; i += 210) {
        if (Number.isInteger(num / (i + 1)) || Number.isInteger(num / (i + 11)) || Number.isInteger(num / (i + 13)) || Number.isInteger(num / (i + 17)) || Number.isInteger(num / (i + 19)) || Number.isInteger(num / (i + 23)) || Number.isInteger(num / (i + 29)) || Number.isInteger(num / (i + 31)) || Number.isInteger(num / (i + 37)) || Number.isInteger(num / (i + 41)) || Number.isInteger(num / (i + 43)) || Number.isInteger(num / (i + 47)) || Number.isInteger(num / (i + 53)) || Number.isInteger(num / (i + 59)) || Number.isInteger(num / (i + 61)) || Number.isInteger(num / (i + 67)) || Number.isInteger(num / (i + 71)) || Number.isInteger(num / (i + 73)) || Number.isInteger(num / (i + 79)) || Number.isInteger(num / (i + 83)) || Number.isInteger(num / (i + 89)) || Number.isInteger(num / (i + 97)) || Number.isInteger(num / (i + 101)) || Number.isInteger(num / (i + 103)) || Number.isInteger(num / (i + 107)) || Number.isInteger(num / (i + 109)) || Number.isInteger(num / (i + 113)) || Number.isInteger(num / (i + 121)) || Number.isInteger(num / (i + 127)) || Number.isInteger(num / (i + 131)) || Number.isInteger(num / (i + 137)) || Number.isInteger(num / (i + 139)) || Number.isInteger(num / (i + 143)) || Number.isInteger(num / (i + 149)) || Number.isInteger(num / (i + 151)) || Number.isInteger(num / (i + 157)) || Number.isInteger(num / (i + 163)) || Number.isInteger(num / (i + 167)) || Number.isInteger(num / (i + 169)) || Number.isInteger(num / (i + 173)) || Number.isInteger(num / (i + 179)) || Number.isInteger(num / (i + 181)) || Number.isInteger(num / (i + 187)) || Number.isInteger(num / (i + 191)) || Number.isInteger(num / (i + 193)) || Number.isInteger(num / (i + 197)) || Number.isInteger(num / (i + 199)) || Number.isInteger(num / (i + 209))) { return false }
    }
    return true;
}

const isPrimeN = factor_isPRIME_v6;

function PRIME_v1(num) {
    if (num <= 1) return false;
    if (num == 2) return true;
    for (var i = 2; i < num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

function PRIME_v2(num) {
    if (num <= 1) {
        return false;
    }
    for (var i = 2; i * i <= num; i++) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}

function factor_isPRIME_v1(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}

function factor_isPRIME_v2(n) {
    let num = parseInt(n);
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (Number.isInteger(num / i)) return false
    }
    return true
}



function PRIME_v10(n, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; }; function eew(limit) {
        let n = Math.floor((limit - 1) / 2);
        let marked = new Uint8Array(n + 1);
        for (let i = 1; i <= n; i++) {
            for (let j = i; i + j + 2 * i * j <= n; j++) {
                marked[i + j + 2 * i * j] = 1;
            }
        }
        let primes = [2];
        for (let i = 1; i <= n; i++) {
            if (!marked[i]) {
                primes.push(2 * i + 1);
            }
        }
        return primes;
    }
    let num = parseInt(n);
    let k = eew(a + 1);
    var t = k.reduce((x, y) => x * y);
    var PRIME_NUMBERS = eew(t + 1);
    var LEN = PRIME_NUMBERS.length;
    for (var i = 0; i < LEN; i++) {
        if (num % PRIME_NUMBERS[i] == 0) {
            return (num == PRIME_NUMBERS[i]);
        }

    };
    var P = eew4(t + 1, a);
    P.splice(0, k.length);
    P.unshift(1);
    console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length);
    for (var i = t; i * i <= num; i += t) {
        for (var u = 0; u < P.length; u++) {
            if (num % (i + P[u]) == 0) {
                return false;
            }

        }
    };
    return true;
};

function nPRIME_v10(n, a) {
    function eew4(a, f) { var MAX = a; var sieve = new Array(MAX); for (var i = 0; i < MAX; i++) { sieve[i] = true; } sieve[0] = false; sieve[1] = false; for (var i = 2; i <= f; i++) { if (sieve[i]) { for (var j = i * 2; j <= MAX; j += i) { sieve[j] = false; } } }; var arr = []; for (var i = 0; i < MAX; i++) { if (sieve[i]) { arr.push(i); } }; return arr; };
    function eew(limit) {
        let n = Math.floor((limit - 1) / 2);
        let marked = new Uint8Array(n + 1);
        for (let i = 1; i <= n; i++) {
            for (let j = i; i + j + 2 * i * j <= n; j++) {
                marked[i + j + 2 * i * j] = 1;
            }
        }
        let primes = [2];
        for (let i = 1; i <= n; i++) {
            if (!marked[i]) {
                primes.push(2 * i + 1);
            }
        }
        return primes;
    }
    let num = parseInt(n); let k = eew(a + 1); var t = k.reduce((x, y) => x * y); var PRIME_NUMBERS = eew(t + 1); var LEN = PRIME_NUMBERS.length; for (var i = 0; i < LEN; i++) { if (Number.isInteger(num / PRIME_NUMBERS[i])) { return (num == PRIME_NUMBERS[i]); } }; console.time("GENARATE"); var P = eew4(t + 1, a); console.timeEnd("GENARATE"); P.splice(0, k.length); P.unshift(1); console.log(num, a, k.toString(), P.length, PRIME_NUMBERS.length); for (var i = t; i * i <= num; i += t) { for (var u = 0; u < P.length; u++) { if (Number.isInteger(num / (i + P[u]))) { return false; } } }; return true;
};

function factor_s(n) { let num = Number(n); let factor_array = []; if (num == 1) return [1]; for (let i = 1; i * i <= num; i++) { let f = num / i; if (Number.isInteger(f)) { factor_array.push(i); if (i !== f) { factor_array.push(f) } } }; return factor_array.sort((x, y) => x - y); }

function sieveOfSundaram2(limit) {
    // 奇数の素数のみ扱うため、limitを2で割って調整
    let n = Math.floor((limit - 1) / 2);

    // マーク用の配列を小さめに確保
    let marked = new Uint8Array(n + 1);

    // サンダラムの篩を適用して合成数をマーク
    for (let i = 1; i <= n; i++) {
        for (let j = i; i + j + 2 * i * j <= n; j++) {
            marked[i + j + 2 * i * j] = 1;  // 合成数をマーク
        }
    }

    // 2は素数として確定
    let primes = [2];

    // マークされていない数 (i) に対して 2i + 1 を素数とする
    for (let i = 1; i <= n; i++) {
        if (!marked[i]) {
            primes.push(2 * i + 1);
        }
    }

    return primes;
}


// primality test by trial division
function isPrimeSlow(n) {
    if (n <= 1n) {
        return false;
    }
    if (n % 2n == 0n) {
        return n == 2n;
    }
    if (n % 3n == 0) {
        return n == 3n;
    }

    for (var i = 5n; i * i <= n; i += 6n) {
        if (n % i == 0n) {
            return false;
        }
        if (n % (i + 2n) == 0n) {
            return false;
        }
    }
    return true;
}

// v_q(t): how many time is t divided by q
function v(q, t) {
    let ans = 0n;
    while (t % q === 0n) {
        ans += 1n;
        t = t / q;
    }
    return ans;
}

function primeFactorize(n) {
    let ret = [];
    let p = 2n;
    while (p * p <= n) {
        if (n % p === 0n) {
            let num = 0n;
            while (n % p === 0n) {
                num += 1n;
                n = n / p;
            }
            ret.push([p, num]);
        }
        p += 1n;
    }
    if (n !== 1n) {
        ret.push([n, 1n]);
    }
    return ret;
}

// calculate e(t)
function e(t) {
    let s = 1n;
    let qList = [];
    for (let q = 2n; q <= t + 1n; q++) {
        if ((t % (q - 1n)) === 0n && isPrimeSlow(q)) {
            s *= (q ** 1n + v(q, t));
            qList.push(q);
        }
    }
    return [2n * s, qList];
}

// Jacobi sum
class JacobiSum {
    constructor(p, k, q) {
        this.p = p;
        this.k = k;
        this.q = q;
        this.m = (p - 1n) * p ** (k - 1n);
        this.pk = p ** k;
        this.coef = new Array(parseInt(this.m)).fill(0n);
    }

    // 1
    one() {
        this.coef[0] = 1n;
        for (let i = 1n; i < this.m; i++) {
            this.coef[parseInt(i)] = 0n;
        }
        return this;
    }

    // product of new JacobiSum
    // jac : new JacobiSum
    mul(jac) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            for (let j = 0n; j < m; j++) {
                if (positiveMod((i + j), pk) < m) {
                    j_ret.coef[parseInt(positiveMod((i + j), pk))] += this.coef[parseInt(i)] * jac.coef[parseInt(j)];
                } else {
                    let r = positiveMod((i + j), pk) - this.p ** (this.k - 1n);
                    while (r >= 0n) {
                        j_ret.coef[r] -= this.coef[i] * jac.coef[j];
                        r -= this.p ** (this.k - 1n);
                    }
                }
            }
        }
        return j_ret;
    }

    multiply(right) {
        if (typeof right === 'number' || typeof right === "bigint") {
            // product with integer
            const j_ret = new JacobiSum(this.p, this.k, this.q);
            for (let i = 0n; i < this.m; i++) {
                j_ret.coef[i] = this.coef[i] * right;
            }
            return j_ret;
        } else {
            // product with new JacobiSum
            return this.mul(right);
        }
    }

    // power of new JacobiSum (x-th power mod n)
    modpow(x, n) {
        let j_ret = new JacobiSum(this.p, this.k, this.q);
        j_ret.coef[0] = 1n;
        let j_a = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        while (x > 0n) {
            if (x % 2n === 1n) {
                j_ret = j_ret.multiply(j_a)
                j_ret = j_ret.mod(n);
            }
            j_a = j_a.multiply(j_a)
            j_a = j_a.mod(n);
            x = x / 2n;
        }

        return j_ret;
    }

    // applying "mod n" to coefficient of self
    mod(n) {
        for (let i = 0n; i < this.m; i++) {
            this.coef[i] = positiveMod(this.coef[i], n);
        }
        return this;
    }

    // operate sigma_x
    // verification for sigma_inv
    sigma(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < m; i++) {
            if (positiveMod((i * x), pk) < m) {
                j_ret.coef[positiveMod((i * x), pk)] += this.coef[i];
            } else {
                let r = positiveMod((i * x), pk) - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    j_ret.coef[r] -= this.coef[i];
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // operate sigma_x^(-1)
    sigma_inv(x) {
        const m = this.m;
        const pk = this.pk;
        const j_ret = new JacobiSum(this.p, this.k, this.q);
        for (let i = 0n; i < pk; i++) {
            if (i < m) {
                if (positiveMod((i * x), pk) < m) {
                    j_ret.coef[Number(String(i))] += this.coef[Number(String(positiveMod((i * x), pk)))];
                }
            } else {
                let r = i - this.p ** (this.k - 1n);
                while (r >= 0n) {
                    if (positiveMod((i * x), pk) < m) {
                        j_ret.coef[r] -= this.coef[positiveMod((i * x), pk)];
                    }
                    r -= this.p ** (this.k - 1n);
                }
            }
        }
        return j_ret;
    }

    // Is self p^k-th root of unity (mod N)
    // if so, return h where self is zeta^h
    is_root_of_unity(N) {
        const m = this.m;
        const p = this.p;
        const k = this.k;

        // case of zeta^h (h<m)
        let one = 0n;
        let h;
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] === 1n) {
                one += 1n;
                h = i;
            } else if (this.coef[i] === 0n) {
                continue;
            } else if ((this.coef[i] - (-1n)) % N != 0n) {
                return [false, null];
            }
        }
        if (one == 1n) {
            return [true, h];
        }
        let r;
        // case of zeta^h (h>=m)
        for (let i = 0n; i < m; i++) {
            if (this.coef[i] !== 0n) {
                r = positiveMod(i, (p ** (k - 1n)));
                break;
            }
        }
        for (let i = 0n; i < m; i++) {
            if (positiveMod(i, (p ** (k - 1n))) === r) {
                if ((this.coef[i] - (-1n)) % N !== 0n) {
                    return [false, null];
                }
            } else {
                if (this.coef[i] !== 0n) {
                    return [false, null];
                }
            }
        }

        return [true, (p - 1n) * p ** (k - 1n) + r];
    }
}

// find primitive root
function smallestPrimitiveRoot(q) {
    for (let r = 2n; r < q; r++) {
        let s = new Set();
        let m = 1n;
        for (let i = 1n; i < q; i++) {
            m = (m * r) % q;
            s.add(m);
        }
        if (s.size === parseInt(q - 1n)) {
            return r;
        }
    }
    return null; // error
}

// calculate f_q(x)
function calcF(q) {
    let g = smallestPrimitiveRoot(q);
    let m = {};
    for (let x = 1n; x < q - 1n; x++) {
        m[parseInt(modpow(g, x, q))] = x;
    }
    let f = {};
    for (let x = 1n; x < q - 1n; x++) {
        f[parseInt(x)] = m[parseInt(positiveMod((1n - modpow(g, x, q)), q))];
    }
    return f;
}

// sum zeta^(a*x+b*f(x))
function calcJAb(p, k, q, a, b) {
    let jRet = new JacobiSum(p, k, q);
    let f = calcF(q);
    for (let x = 1n; x < q - 1n; x++) {
        let pk = p ** k;
        if (positiveMod((a * x + b * f[parseInt(x)]), pk) < jRet.m) {
            jRet.coef[positiveMod((a * x + b * f[Number(String(x))]), pk)]++;
        } else {
            let r = positiveMod((a * x + b * f[Number(String(x))]), pk) - (p ** (k - 1n));
            while (r >= 0n) {
                jRet.coef[r]--;
                r -= (p ** (k - 1n));
            }
        }
    }
    return jRet;
}

// calculate J(p,q)ï¼p>=3 or p,q=2,2ï¼
function calcJ(p, k, q) {
    return calcJAb(p, k, q, 1n, 1n);
}

// calculate J_3(q)ï¼p=2 and k>=3ï¼
function calcJ3(p, k, q) {
    let j2q = calcJ(p, k, q);
    let j21 = calcJAb(p, k, q, 2n, 1n);
    let jRet = j2q.multiply(j21);
    return jRet;
}

// calculate J_2(q)ï¼p=2 and k>=3ï¼
function calcJ2(p, k, q) {
    let j31 = calcJAb(2n, 3n, q, 3n, 1n);
    let jConv = new JacobiSum(p, k, q);
    for (let i = 0n; i < j31.m; i++) {
        jConv.coef[i * ((p ** k) / 8n)] = j31.coef[i];
    }
    let jRet = jConv.multiply(jConv);
    return jRet;
}

// in case of p>=3
function APRtestStep4a(p, k, q, N) {
    let J = calcJ(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1.mod(N);
    }

    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);

    // J^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % p === 0n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha.mod(N);
    }

    // S = s2 * J_alpha
    let S = s2.multiply(JAalpha).mod(N);

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite!
        return [false, null];
    } else {
        // possible prime
        let lp = h % p !== 0n ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k>=3
function APRtestStep4b(p, k, q, N) {

    let J = calcJ3(p, k, q);
    // initialize s1=1
    let s1 = new JacobiSum(p, k, q).one();
    // J3^Theta
    // J3^Theta
    for (let x = 0n; x < p ** k; x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow(x, N);
        s1 = s1.multiply(t);
        s1 = s1.mod(N);
    }

    // r = N mod p^k
    let r = positiveMod(N, (p ** k));

    // s2 = s1 ^ (N/p^k)
    let s2 = s1.modpow(N / (p ** k), N);

    // J3^alpha
    let JAalpha = new JacobiSum(p, k, q).one();
    for (let x = 0n; x < (p ** k); x++) {
        if (x % 8n !== 1n && x % 8n !== 3n) {
            continue;
        }
        let t = J.sigma_inv(x);
        t = t.modpow((r * x) / (p ** k), N);
        JAalpha = JAalpha.multiply(t);
        JAalpha = JAalpha.mod(N);
    }
    // S = s2 * J_alpha * J2^delta
    let S;
    if (N % 8n == 1n || N % 8n == 3n) {
        S = s2.multiply(JAalpha)
        S = S.mod(N);
    } else {
        let J2Delta = calcJ2(p, k, q);
        S = s2.multiply(JAalpha)
        S = S.multiply(J2Delta)
        S = S.mod(N);
    }
    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let lp = (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) ? 1n : 0n;
        return [true, lp];
    }
}

// in case of p=2 and k=2
function APRtest_step4c(p, k, q, N) {
    let J2q = calcJ(p, k, q);

    // s1 = J(2,q)^2 * q (mod N)
    let s1 = J2q.multiply(J2q).multiply(q).mod(N);
    // s2 = s1 ^ (N/4)
    let s2 = s1.modpow(N / 4n, N);
    let S;
    if (positiveMod(N, 4n) === 1n) {
        S = s2;
    } else if (positiveMod(N, 4n) === 3n) {
        S = (s2.multiply(J2q).multiply(J2q)).mod(N);
    }

    // Is S root of unity
    let [exist, h] = S.is_root_of_unity(N);

    if (!exist) {
        // composite
        return [false, null];
    } else {
        // possible prime
        let l_p;
        if (h % p !== 0n && (modpow(q, (N - 1n) / 2n, N) + 1n) % N === 0n) {
            l_p = 1n;
        } else {
            l_p = 0n;
        }
        return [true, l_p];
    }
}

// in case of p=2 and k=1
function APRtest_step4d(p, k, q, N) {
    let S2q = modpow(-q, (N - 1n) / 2n, N);
    if ((S2q - 1n) % N !== 0n && (S2q + 1n) % N !== 0n) {
        // composite
        return [false, null];
    } else {
        let l_pp;
        // possible prime
        if ((S2q + 1n) % N === 0n && (N - 1n) % 4n === 0n) {
            l_pp = 1n;
        } else {
            l_pp = 0n;
        }
        return [true, l_pp];
    }
}

// Step 4
function APRtest_step4(p, k, q, N) {
    let result;
    let l_p;
    if (p >= 3n) {
        [result, l_p] = APRtestStep4a(p, k, q, N);
    } else if (p === 2n && k >= 3n) {
        [result, l_p] = APRtestStep4b(p, k, q, N);
    } else if (p === 2n && k === 2n) {
        [result, l_p] = APRtest_step4c(p, k, q, N);
    } else if (p === 2n && k === 1n) {
        [result, l_p] = APRtest_step4d(p, k, q, N);
    }

    return [result, l_p];
}

// Helper functions
const modpow = (base, exponent, mod) => {
    base = BigInt(base);
    exponent = BigInt(exponent);
    mod = BigInt(mod);
    //-------------------
    let ret = 1n;
    base = base % mod;
    while (exponent) {
        if (exponent & 1n) {
            ret = (ret * base) % mod
        };
        base = (base ** 2n) % mod
        exponent = exponent >> 1n;
    }
    return ret;
};

function positiveMod(n, m) {
    return ((n % m) + m) % m;
}

function is_root_of_unity(S, N) {
    let h = 1n;
    while (true) {
        if (modpow(S, h, N) === 1n) {
            return [true, h];
        }
        h++;
        if (h > N) {
            return [false, null];
        }
    }
}

function gcd(a, b) {
    if (a === 0n) {
        return b;
    }
    if (b === 0n) {
        return a;
    }

    let shift = 0n;
    while (((a | b) & 1n) === 0n) {
        a >>= 1n;
        b >>= 1n;
        shift++;
    }

    while ((a & 1n) === 0n) {
        a >>= 1n;
    }

    do {
        while ((b & 1n) === 0n) {
            b >>= 1n;
        }

        if (a > b) {
            [a, b] = [b, a];
        }
        b -= a;
    } while (b !== 0n);

    return a << shift;
}

function APRtest(N) {
    const t_list = [
        2n, 12n, 60n, 180n, 840n, 1260n, 1680n, 2520n, 5040n, 15120n, 55440n, 110880n, 720720n,
        1441440n, 4324320n, 24504480n, 73513440n
    ];

    if (N == 2n || N == 3n) {
        return true;
    }

    if (N <= 3n) {
        return false;
    }
    let t;
    let et;
    let q_list;
    // Select t
    for (let tsk of t_list) {
        const [ett, q_l] = e(tsk);
        if (N < ett * ett) {
            t = tsk;
            et = ett;
            q_list = q_l;
            break;
        }
    };

    // Step 1
    const g = gcd(t * et, N);
    if (g > 1n) {
        return false;
    }

    // Step 2
    const l = {};
    const fac_t = primeFactorize(t);
    for (let [p] of fac_t) {
        if (p >= 3n && modpow(N, p - 1n, p * p) !== 1n) {
            l[p] = 1n;
        } else {
            l[p] = 0n;
        }
    }

    // Step 3 & Step 4
    for (let q of q_list) {
        if (q === 2n) {
            continue;
        }
        const fac = primeFactorize(q - 1n);
        for (let [p, k] of fac) {
            // Step 4
            const [result, l_p] = APRtest_step4(p, k, q, N);
            if (!result) {
                // composite
                return false;
            } else if (l_p === 1n) {
                l[p] = 1n;
            }
        }
    }
    // Step 5
    for (let [p, value] of Object.entries(l)) {
        p = BigInt(p)
        if (value === 0n) {
            // try other pair of (p,q)
            let count = 0;
            let i = 1n;
            let found = false;
            // try maximum 30 times
            while (count < 30) {
                const q = p * i + 1n;
                if (N % q !== 0 && isPrimeSlow(q) && !q_list.includes(q)) {
                    count += 1;
                    const k = v(p, q - 1n);
                    // Step 4
                    const [result, l_p] = APRtest_step4(p, k, q, N);
                    if (!result) {
                        // composite
                        return false;
                    } else if (l_p === 1n) {
                        found = true;
                        break;
                    }
                }
                i += 1n;
            }
            if (!found) {
                return false;
            }
        }
    }

    // Step 6
    let r = 1;
    for (let t = 0; t < t - 1; t++) {
        r = (r * N) % et;
        if (r !== 1 && r !== N && N % r === 0) {
            return false;
        }
    }
    return true;
}

function newPFD_v5(num_1) {
    var results = ""
    var num = parseInt(num_1, 10);
    if (num < 2) return false;
    var P = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29
    ];

    for (var i = 0; i < 10; i++) { if (Number.isInteger(num / P[i])) { let e = 0; while (Number.isInteger(num / P[i])) { e++; num /= P[i]; }; results += " " + P[i] + "^" + e + " ×"; } };

    for (var i = 30; i * i <= num; i += 30) {
        if (Number.isInteger(num / (i + 1))) { let e = 0; while (Number.isInteger(num / (i + 1))) { e++; num /= (i + 1) }; results += (" " + (i + 1) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 7))) { let e = 0; while (Number.isInteger(num / (i + 7))) { e++; num /= (i + 7) }; results += (" " + (i + 7) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 11))) { let e = 0; while (Number.isInteger(num / (i + 11))) { e++; num /= (i + 11) }; results += (" " + (i + 11) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 13))) { let e = 0; while (Number.isInteger(num / (i + 13))) { e++; num /= (i + 13) }; results += (" " + (i + 13) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 17))) { let e = 0; while (Number.isInteger(num / (i + 17))) { e++; num /= (i + 17) }; results += (" " + (i + 17) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 19))) { let e = 0; while (Number.isInteger(num / (i + 19))) { e++; num /= (i + 19) }; results += (" " + (i + 19) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 23))) { let e = 0; while (Number.isInteger(num / (i + 23))) { e++; num /= (i + 23) }; results += (" " + (i + 23) + "^" + e + " ×") }; if (Number.isInteger(num / (i + 29))) { let e = 0; while (Number.isInteger(num / (i + 29))) { e++; num /= (i + 29) }; results += (" " + (i + 29) + "^" + e + " ×") };
    }
    if (num != 1) {
        results += " " + num + "^1 ×";
    }
    var result_r = results.slice(0, -1).slice(1).replace(/\^1 /g, " ").slice(0, -1)
    if (result_r == num_1) {
        return false;
    } else {
        return result_r;
    }
}

function lucasTest(m) {
    if ((m + 1n) & m) return false;
    const p = m.toString(2).length;
    let s = BigInt(4);
    for (let i = 0; i < p - 2; i++) {
        var s2 = s * s;
        s = (s2 & m) + (s2 / (m + BigInt(1)));
        if (s >= m) { s = s - m };
        s = s - BigInt(2);
    }
    return s == 0;
}

function isPrimeMR2_64(n) {
  n = BigInt(n);
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if ((n & 1n) === 0n) return false;

  const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (let i = 0; i < smallPrimes.length; i++) {
    const p = smallPrimes[i];
    if (n % p === 0n) return n === p;
  }

  const bases = [2n,325n,9375n,28178n,450775n,9780504n,1795265022n];

  let d = n - 1n, s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }

  const mont = new Montgomery(n);

  Loop:
  for (let i = 0; i < bases.length; i++) {
    let a = bases[i];
    if (a >= n) continue;
    let x = mont.pow(a, d);
    if (x === mont.one || x === mont.nMinusOne) continue;
    for (let r = 1; r < s; r++) {
      x = mont.mul(x, x);
      if (x === mont.nMinusOne) continue Loop;
    }
    return false;
  }
  return true;
}

function isPrimeMR_64(n) {
    n = BigInt(n);
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if ((n & 1n) === 0n) return false;

    const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    for (let i = 0; i < smallPrimes.length; i++) {
        const p = smallPrimes[i];
        if (n === p) return true;
        if (n % p === 0n) return false;
    }

    const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

    let d = n - 1n, s = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        s++;
    }

    const mont = new Montgomery(n);

    Loop:
    for (let i = 0; i < bases.length; i++) {
        let a = bases[i];
        if (a >= n) continue;
        let x = mont.pow(a, d);
        if (x === mont.one || x === mont.nMinusOne) continue;
        for (let r = 1; r < s; r++) {
            x = mont.mul(x, x);
            if (x === mont.nMinusOne) continue Loop;
        }
        return false;
    }
    return true;
}

class Montgomery {
    constructor(n) {
        this.n = n;
        this.nBits = 64n;
        this.R = 1n << this.nBits;
        this.ninv = this.getNinv(n);
        this.R2 = (this.R * this.R) % n;
        this.one = this.toMont(1n);
        this.nMinusOne = this.toMont(n - 1n);
    }

    toMont(x) {
        return this.reduce(x * this.R2);
    }

    mul(a, b) {
        return this.reduce(a * b);
    }

    pow(a, e) {
        let x = this.toMont(a), r = this.one;
        while (e > 0n) {
            if (e & 1n) r = this.mul(r, x);
            x = this.mul(x, x);
            e >>= 1n;
        }
        return r;
    }

    reduce(t) {
        const m = (t * this.ninv) & (this.R - 1n);
        const u = (t + m * this.n) >> this.nBits;
        return (u >= this.n) ? (u - this.n) : u;
    }

    getNinv(n) {
        let r = 1n;
        for (let i = 0; i < 6; i++) { // ニュートン法で高速逆元
            r = r * (2n - n * r);
            r &= (1n << (2n ** BigInt(i + 1))) - 1n;
        }
        return (-r) & (this.R - 1n);
    }
}

function estimateUpperBound(n) {
  if (n < 6) return 15;
  const logn = Math.log(n);
  return Math.ceil(n * (logn + Math.log(logn)));
}

function nthPrime(n) {
  if (n < 1) throw new Error("n must be >= 1");

  const upperBound = estimateUpperBound(n);
  const isPrime = new Uint8Array(upperBound + 1);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;

  const sqrt = Math.floor(Math.sqrt(upperBound));

  for (let i = 2; i <= sqrt; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= upperBound; j += i) {
        isPrime[j] = 0;
      }
    }
  }

  let count = 0;
  for (let i = 2; i <= upperBound; i++) {
    if (isPrime[i]) {
      count++;
      if (count === n) return i;
    }
  }

  throw new Error("Prime not found within estimated bound.");
}

// AKS素数判定法をここで実装
function isPerfectPower(n) {
    var s = Math.log2(n) + 1;
    for (let b = 2; b <= s; b++) {
        if (Number.isInteger(n ** (1 / b))) return true;
    }
    return false;
}

function enoughOrderModulo(n) {
    const a = Math.floor(Math.log(n) ** 2);
    for (let r = 1; r < n; r++) {
        let order = 0;
        let prod = 1;
        for (let e = 1; e < r; e++) {
            prod = (prod * n) % r;
            if (prod === 1) {
                order = e;
                break;
            }
        }
        if (order > a) {
            return r;
        }
    }
    return n;
}

function tortient(r) {
    function primes(r) {
        let n = r;
        const res = new Set();
        for (let p = 2; p <= Math.sqrt(r); p++) {
            while (n % p === 0) {
                res.add(p);
                n = n / p;
            }
        }
        return res;
    }

    const ps = primes(r);
    let res = r;
    for (const p of ps) {
        res = res * (p - 1) / p;
    }
    return res;
}

class PolynomialModulo {
    pow(ls, n, r) {
        this.ls = ls;
        this.n = n;
        this.r = r;
        return this._pow(n);
    }

    _pow(m) {
        if (m === 1) return this.ls;
        if (m % 2 === 0) {
            const pls = this._pow(Math.floor(m / 2));
            return this._product(pls, pls);
        } else {
            return this._product(this._pow(m - 1), this._pow(1));
        }
    }

    _product(ls1, ls2) {
        const res = new Array(Math.min(ls1.length + ls2.length - 1, this.r)).fill(0);
        for (let i = 0; i < ls1.length; i++) {
            for (let j = 0; j < ls2.length; j++) {
                res[(i + j) % this.r] += ls1[i] * ls2[j];
            }
        }
        for (let k = res.length - 1; k >= 0; k--) {
            res[k] %= this.n;
            if (k === res.length - 1 && res[k] === 0) res.pop();
        }
        return res;
    }
}

function isCongruent(a, n, r) {
    const p = new PolynomialModulo();
    const ls1 = p.pow([a, 1], n, r);

    const i = n % r;
    const ls2 = new Array(i + 1).fill(0);
    ls2[0] = a % n;
    ls2[i] = 1;

    return JSON.stringify(ls1) === JSON.stringify(ls2);
}

function isPrimeAKS(n) {
    if (n === 1) return false;

    // Step 1
    if (isPerfectPower(n)) return false;

    // Step 2
    const r = enoughOrderModulo(n);

    // Step 3
    for (let a = 2; a < Math.min(r + 1, n); a++) {
        if (n % a === 0) {
            return false;
        }
    }

    // Step 4
    if (n <= r) return true;

    // Step 5
    for (let a = 1; a <= Math.floor(Math.sqrt(tortient(r)) * Math.log(n)) + 1; a++) {
        if (!isCongruent(a, n, r)) {
            return false;
        }
    }

    // Step 6
    return true;
}

function isPrimeMR3e24(nInput) {
  const n = (typeof nInput === 'bigint') ? nInput : BigInt(nInput);
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if ((n & 1n) === 0n) return false;

  const small = [3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n];
  for (let i = 0; i < small.length; ++i) {
    const p = small[i];
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) { d >>= 1n; ++s; }

  const mont = Montgomery2.create(n);

  const bases = [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n];

  for (let i = 0; i < bases.length; ++i) {
    const a = bases[i];
    if (a >= n) continue;
    let x = mont.pow(a, d);
    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let r = 1; r < s; ++r) {
      x = mont.mul(x, x);
      if (x === n - 1n) { composite = false; break; }
      if (x === 1n) return false;
    }
    if (composite) return false;
  }
  return true;
}

class Montgomery2 {
  constructor(n, k, Rmask, nprime, r2, oneMont) {
    this.n = n;
    this.k = k;
    this.Rmask = Rmask;
    this.nprime = nprime;
    this.r2 = r2;
    this.one = oneMont;
  }

  static create(n) {
    const k = bitLength(n);
    const K = k;
    const R = 1n << BigInt(K);
    const Rmask = R - 1n;

    const nmodR = n & Rmask;
    let inv = modInvPowerOfTwo(nmodR, K);
    const nprime = (R - (inv & Rmask)) & Rmask;

    const r2 = ( ( (1n << BigInt(K)) % n ) * ( (1n << BigInt(K)) % n ) ) % n;
    const montTmp = { n: n, k: BigInt(K), Rmask: Rmask, nprime: nprime };

    const oneMont = montReduce(montTmp, (__uint128ish)(BigInt(r2)));
    const one = (R % n);

    return new Montgomery2(n, BigInt(K), Rmask, nprime, r2, one);
  }

  toMont(x) {
    const R = (this.Rmask + 1n);
    return (x * R) % this.n;
  }

  fromMont(x) {
    return montReduce(this, x);
  }

  mul(aStd, bStd) {
    const A = this.toMont(aStd);
    const B = this.toMont(bStd);
    const t = A * B;
    const u = montReduce(this, t);
    return this.fromMont(u);
  }

  pow(baseStd, exp) {
    const baseMont = this.toMont(baseStd);
    let acc = this.toMont(1n);
    let e = exp;
    let b = baseMont;
    while (e > 0n) {
      if (e & 1n) {
        acc = montReduce(this, acc * b);
      }
      b = montReduce(this, b * b);
      e >>= 1n;
    }
    return this.fromMont(acc);
  }
}

function bitLength(x) {
  let b = 0;
  let v = x;
  while (v > 0n) { v >>= 1n; ++b; }
  return b === 0 ? 1 : b;
}

function montReduce(mont, t) {
  const m = (t * mont.nprime) & mont.Rmask;
  const u = (t + m * mont.n) >> mont.k;
  return (u >= mont.n) ? (u - mont.n) : u;
}

function modInvPowerOfTwo(a, k) {
  let inv = 1n;
  let modBits = 1;
  while (modBits < k) {
    modBits <<= 1;
    inv = (inv * (2n - a * inv)) & ((1n << BigInt(modBits)) - 1n);
  }
  const mask = (1n << BigInt(k)) - 1n;
  return inv & mask;
}