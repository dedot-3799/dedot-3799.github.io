importScripts("./sub/isPrime.js", "./sub/nearPrime.js", "./sub/APR-CL-st4.js");

self.addEventListener("message", (event) => {
    try {
        const { job, threadId, totalThreads,THID } = event.data;
        let { uuid, type, result } = job;
        console.log(`ProcessingThread(Multi): Received job type: ${type}, ID: ${uuid}, ThreadID: ${threadId}/${totalThreads}`);
        let result1, gw,viewportRS;
        let st = performance.now();
        switch (type) {
            case "isPrimeMLTI":
                result1 = isPrimeNumber_r5(result.number, threadId, totalThreads);
                viewportRS = result1
                break;
            case "nearPrimeMLTI":
                result1 = findNearPrimeWorker(BigInt(result.number), threadId, totalThreads);
                viewportRS = result1;
                break;
            case "APR-CL-MLTI":
                gw = isPrimeNumber_f6(result.nql2, result.num, threadId, totalThreads);
                viewportRS = gw;
                result1 = { result: gw, rs: result };
                break;
            default:
                throw new Error(`Unknown job type: ${type}`);
        }
        let et = performance.now();
        let time = (et - st);
        console.log(`ProcessingThread(Multi): ${type} took ${time} ms, result:${viewportRS}, ID: ${uuid}`);
        // UUIDをつけてメインスレッドへ返す
        self.postMessage({ uuid, type, time, result: result1,threadId:THID });
    } catch (error) {
        console.error(error);
    }
});