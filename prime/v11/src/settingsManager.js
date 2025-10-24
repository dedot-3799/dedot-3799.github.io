function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("sessionDB", 1);
        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("sessionStore")) {
                db.createObjectStore("sessionStore");
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getItem(key) {
    let db = await openDB();
    let transaction = db.transaction("sessionStore", "readonly");
    let store = transaction.objectStore("sessionStore");
    return new Promise((resolve, reject) => {
        let request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function setItem(key, value) {
    let db = await openDB();
    let transaction = db.transaction("sessionStore", "readwrite");
    let store = transaction.objectStore("sessionStore");
    store.put(value, key);
}