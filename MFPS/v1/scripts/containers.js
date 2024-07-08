// モーダルを開く
function openModal() {
    document.getElementById("container2").style.display = "block";
    setTopWindow("container2");
}

// モーダルを閉じる
function closeModal() {
    closeWindow('container2');
    SettingsManager("write", "workers", document.getElementById("worker").value)
    SettingsManager("write", "mode", document.getElementById("ty").value)
}

// ヘルプモーダルを開く
function openHelpModal() {
    document.getElementById('container4').style.display = 'block';
    setTopWindow("container4");
}

// ヘルプモーダルを閉じる
function closeHelpModal() {
    document.getElementById('container4').style.display = 'none';
}

// 生成モーダルを開く
function openRandomModal() {
    openWindow('container5')
}

// 生成モーダルを閉じる
function closeRandomModal() {
    closeWindow("container5")
}