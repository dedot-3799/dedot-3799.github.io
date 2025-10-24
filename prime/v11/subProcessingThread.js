function isPrimeMLTI(n,id) {
    
}

self.addEventListener("message", async (event) => {
    try {
        const { uuid, type, option } = event.data;

        let result;
        let st = performance.now();
        if (type === "isPrimeMLTI") {
            result = isPrimeMLTI(option);
        }
        let et = performance.now();
        let time = (et - st);
        console.log(`ProcessingThread: ${type} took ${time} ms, result:${result}, ID: ${uuid}`);
        // UUIDをつけてメインスレッドへ返す
        self.postMessage({ uuid, type, time, result });
    } catch (error) {
        console.error(error);
    }
});