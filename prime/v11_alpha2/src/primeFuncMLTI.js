async function aboutPrimeMLTI(num, option) {
    let n = BigInt(num);
    switch (option) {
        case "up":
            return aboutPrime(n, "up");
        case "dn":
            return aboutPrime(n, "dn");
        case "ud": {
            console.log(parseInt(settings.main.threads));
            let jobs = [];
            for (let i = 0; i < parseInt(settings.main.threads); i++) {
                const worker = new Worker("./sub/nearPrime.js");
                const promise = new Promise((resolve, reject) => {
                    worker.addEventListener('message', (msg) => {
                        if (msg.data === true) {
                            reject();
                        } else {
                            console.log(msg.data);
                            resolve(msg.data);
                        }
                        worker.terminate();
                    });
                });
                jobs.push(promise);
                worker.postMessage({ num: n, p: i, mx: parseInt(settings.main.threads) });
            }
            let f;
            await Promise.any(jobs).then((r) => {
                console.log(r);
                f = r;
            }).catch(() => {
                console.log(true);
                f = true;
            });
            return f;
        }
        default: {
            let jobs = [];
            for (let i = 0; i < parseInt(settings.main.threads); i++) {
                const worker = new Worker("./sub/nearPrime.js");
                const promise = new Promise((resolve, reject) => {
                    worker.addEventListener('message', (msg) => {
                        if (msg.data === true) {
                            reject();
                        } else {
                            console.log(msg.data);
                            resolve(msg.data);
                        }
                        worker.terminate();
                    });
                });
                jobs.push(promise);
                worker.postMessage({ num: n, p: i, mx: parseInt(settings.main.threads) });
            }
            let f;
            await Promise.any(jobs).then((r) => {
                console.log(r);
                f = r;
            }).catch(() => {
                console.log(true);
                f = true;
            });
            return f;
        }
    }
}

async function apr_cl_f(N) {
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


    const gcd = function () {
        var f = (a, b) => b ? f(b, a % b) : a;
        var ans = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            ans = f(ans, arguments[i]);
        }
        return ans;
    }

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
    }

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

    // Step3 & 4 X
    if (String(N).length >= 50) {
        let wks = `
    // workerスレッド
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
        let h = 1;
        while (true) {
            if (modpow(S, h, N) === 1) {
                return [true, h];
            }
            h++;
            if (h > N) {
                return [false, null];
            }
        }
    }


    function isPrimeNumber_f6(nq_l, N, wkrs, MAX_WORKERS) {
        let res = [];
        for (let nl = wkrs; nl < nq_l.length; nl += MAX_WORKERS) {
            let [p, k, q] = nq_l[nl];
            // Step 4
            const [result, l_p] = APRtest_step4(p, k, q, N);
            if (!result) {
                // composite
                return false;
            } else if (l_p === 1n) {
                res.push(p)
            }
        }
        return res.join(",")
    }

    self.addEventListener('message', (message) => {
        const nql = message.data.nql2
    const N = message.data.num;
    const p = message.data.id;
    const MAX_WORKERS = message.data.mx
    const isPrime = isPrimeNumber_f6(nql, N, p, MAX_WORKERS);
    self.postMessage(isPrime);
});
`

        let b = new Blob([wks], { type: 'text/javascript' })
        const jobs = [];
        var MAX_WORKERS = Math.floor(parseInt(document.getElementById("worker").value, 10));
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 4 };
        console.log("threads:" + MAX_WORKERS);
        let nq_l2 = [];
        for (let q of q_list) {
            if (q === 2n) {
                continue;
            }
            const fac = primeFactorize(q - 1n);
            for (let [p, k] of fac) {
                nq_l2.push([p, k, q]);
            }
        }

        for (let i = 0; i < MAX_WORKERS; i++) {
            const worker = new Worker(URL.createObjectURL(b));
            const promise = new Promise((resolve) => {
                worker.addEventListener('message', (message) => {
                    resolve(message);
                    worker.terminate();
                });
            });
            jobs.push(promise);
            worker.postMessage({ nql2: nq_l2, num: N, id: i, mx: MAX_WORKERS });
        }

        let s34result = true;
        await Promise.all(jobs).then((results) => {
            for (let bk = 0; bk < results.length; bk++) {
                const x = results[bk];
                if (x.data == false) {
                    s34result = false;
                    return;
                }
                console.log(x.data)
                let xd = x.data.split(",");
                xd.forEach((hk) => {
                    l[hk] = 1n;
                });
            };
        });
        if (s34result === false) {
            return false;
        }

    } else {
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

async function isPrimeBig(num_p) {
    console.log("Big");
    var num = BigInt(num_p)
    if (num <= 1n) {
        return false;
    } else if (String(num) === "NaN") {
        return false;
    } else {
        var time_st = performance.now();
        var prm = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n]
        console.time("RE")
        if (prm.includes(num)) {
            result.innerHTML = lang_data[lang]["isPrime"]
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`, numMap);
            console.timeEnd("RE");
            return true;
        } else {
            for (let d = 0; d < 7; d++) {
                const el = prm[d];
                if (num % el == 0n) {
                    var time_end = performance.now();
                    console.log(`${time_end - time_st}ms`, el);
                    console.timeEnd("RE");
                    return false;
                }
            }
        }
        console.timeEnd("RE");
        const jobs = [];
        var MAX_WORKERS = settings.main.threads;
        if (isNaN(MAX_WORKERS) || MAX_WORKERS <= 0) { var MAX_WORKERS = Number(navigator.hardwareConcurrency) }
        if (isNaN(MAX_WORKERS)) { var MAX_WORKERS = 6 }
        console.log("threads:" + MAX_WORKERS);
        for (let i = 0; i <= MAX_WORKERS - 1; i++) {
            const worker = new Worker("./sub/isPrime.js");
            const promise = new Promise((resolve, reject) => {
                worker.addEventListener('message', (msg) => {
                    if (msg.data === true) {
                        reject();
                    } else {
                        console.log(msg.data);
                        resolve(msg.data);
                    }
                    worker.terminate();
                });
            });
            jobs.push(promise);
            worker.postMessage({ num: num, p: i, mx: MAX_WORKERS });
        }
        let f;
        await Promise.any(jobs).then((r) => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`);
            console.log(r);
            f = false;
        }).catch(() => {
            var time_end = performance.now();
            console.log(`${time_end - time_st}ms`);
            console.log(true);
            f = true;
        });
        return f;
    }
}
