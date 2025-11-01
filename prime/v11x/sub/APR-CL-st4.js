function isPrimeNumber_f6(nq_l, N, wkrs, MAX_WORKERS) {
    let res = [];
    for (let nl = wkrs; nl < nq_l.length; nl += MAX_WORKERS) {
        let [p, k, q] = nq_l[nl];
        // Step 4
        const [result, l_p] = APRtest_step4(p, k, q, BigInt(N));
        if (!result) {
            // composite
            return false;
        } else if (l_p === 1n) {
            res.push(p);
        }
    }
    return res.join(",");
}