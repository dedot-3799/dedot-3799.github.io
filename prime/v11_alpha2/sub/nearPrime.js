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

// calculate J(p,q)Ã¯Â¼Âp>=3 or p,q=2,2Ã¯Â¼Â
function calcJ(p, k, q) {
    return calcJAb(p, k, q, 1n, 1n);
}

// calculate J_3(q)Ã¯Â¼Âp=2 and k>=3Ã¯Â¼Â
function calcJ3(p, k, q) {
    let j2q = calcJ(p, k, q);
    let j21 = calcJAb(p, k, q, 2n, 1n);
    let jRet = j2q.multiply(j21);
    return jRet;
}

// calculate J_2(q)Ã¯Â¼Âp=2 and k>=3Ã¯Â¼Â
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

function findNearPrimeWoker(num, p, mx) {
    let id = BigInt(p);
    let n;
    if (num % 2n == 0n) {
        n = num + 1n;
    } else {
        n = num;
    }
    let max = BigInt(mx) * 2n;
    while (true) {
        //console.log(`Searching... ${n - 2n * id} and ${n + 2n * id} (ID: ${p}) pmt: ${id * 2n})`);
        let prime = BigInt(n + 2n * id);
        let prime_d = BigInt(n - 2n * id);
        if (APRtest(prime)) {
            console.log(`Found prime: ${prime} (ID: ${p})`);
            return prime;
        } else if (APRtest(prime_d)) {
            console.log(`Found prime: ${prime_d} (ID: ${p})`);
            return prime_d;
        }
        id += max;
    }
}

self.addEventListener('message', (message) => {
    const num = message.data.num;
    const p = message.data.p;
    const mx = message.data.mx;
    const prime = findNearPrimeWoker(num, p, mx);
    self.postMessage(prime);
});
