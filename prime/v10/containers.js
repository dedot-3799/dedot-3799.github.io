// モーダルを開く
function openModal() {
    document.getElementById('option').style.display = 'flex';
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('option').style.display = 'none';
    SettingsManager("write", "workers", document.getElementById("worker").value)
    SettingsManager("write", "mode", document.getElementById("ty").value)
}

// ヘルプモーダルを開く
function openHelpModal() {
    document.getElementById('helpModal').style.display = 'flex';
}

// ヘルプモーダルを閉じる
function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
}

// 生成モーダルを開く
function openRandomModal() {
    document.getElementById('random').style.display = 'flex';
}

// 生成モーダルを閉じる
function closeRandomModal() {
    document.getElementById('random').style.display = 'none';
}


function Load() {
    startLoad("load");
    setTimeout(stopAllLoad, 3000);  
}

function startLoad(id) {
    document.getElementById(id).style.visibility = 'visible';
}

function stopAllLoad() {
    
    let elements = document.getElementsByClassName('loading');
    for (let element of elements) {
        element.style.visibility = 'hidden';
    }
}

window.addEventListener('load', Load);