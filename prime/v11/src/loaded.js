window.onload = async () => {
    if (window.innerWidth < 330 || window.innerHeight < 330) {
        // 画面が小さすぎて表示が崩れるかもしれないことを警告
        alert("画面が小さいため表示が崩れる可能性があります。ご留意ください。");
    }
    Lo_condition.textContent = "Starting...";
};
document.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        if (getSelectedText() == "対話型") {
            handleCommand();
        } else if (getSelectedText() == "フォーム型") {
            checkPrime();
        } else {
            const command = document.getElementById('cli-inputL').value;
            document.getElementById('cli-input').remove();
            processCommand(command);
        }
    };
});