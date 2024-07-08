const containers = {
    container1: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 1 },
    container2: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 2 },
    container3: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 3 },
    container4: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 4 },
    container5: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 5 },
    container6: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 6 },
    container7: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 7 },
    container8: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 8 },
    container9: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 9 },
    container10: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 10 },
    container11: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 11 },
    container12: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 12 },
    container13: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 13 },
    container14: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 14 },
    container15: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 15 },
    container16: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 16 },
    container17: { offsetX: 0, offsetY: 0, isDragging: false, zIndex: 17 }
    // Add more containers as needed
};

function bringToFront(containerId, event) {
    const container = document.getElementById(containerId);

    var k = Object.keys(containers);
    var dM = "";
    var dMN = 0;

    var ZIList = [];
    for (let i = 0; i < k.length; i++) {
        ZIList.push(containers[k[i]].zIndex);
        if (k[i] == containerId) {
            dM = containers[k[i]].zIndex;
            dMN = i;
        }
    }

    const f = ZIList[dMN];
    for (let h = 0; h < k.length; h++) {
        if (h == dMN) {
            ZIList[h] = k.length;
        } else if (ZIList[h] > f) {
            ZIList[h] = ZIList[h] - 1;
        }
    }

    for (let c = 0; c < k.length; c++) {
        document.getElementById(k[c]).style.zIndex = ZIList[c];
        containers[k[c]].zIndex = ZIList[c];
    }

    // Handle the drag (if any)
    containers[containerId].isDragging = true;
    containers[containerId].offsetX = event.clientX - parseInt(getComputedStyle(container).left);
    containers[containerId].offsetY = event.clientY - parseInt(getComputedStyle(container).top);

    document.addEventListener('mousemove', (ev) => handleDrag(ev, containerId));
    document.addEventListener('mouseup', () => stopDrag(containerId));
}

function handleDrag(e, containerId) {
    Object.entries(containers).forEach(([containerId, { isDragging }]) => {
        if (isDragging) {
            const container = document.getElementById(containerId);
            const appContainer = document.getElementById('appContainer');

            let x = e.clientX - containers[containerId].offsetX;
            let y = e.clientY - containers[containerId].offsetY;
            // Ensure the container stays within the bounds of the appContainer
            const minX = 0;
            const minY = 0;
            const maxX = window.innerWidth - container.clientWidth;
            const maxY = window.innerHeight - container.clientHeight;

            x = Math.max(minX, Math.min(x, maxX));
            y = Math.max(minY, Math.min(y, maxY));

            container.style.left = x + 'px';
            container.style.top = y + 'px';
        }
    });
}

function resizeWindowLocation() {
    Object.entries(containers).forEach(([containerId]) => {
        const container = document.getElementById(containerId);
  
        let x = parseInt(container.style.left);
        let y = parseInt(container.style.top);
  
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - container.clientWidth;
            const maxY = window.innerHeight - container.clientHeight;
  
        x = Math.max(minX, Math.min(x, maxX));
        y = Math.max(minY, Math.min(y, maxY));
  
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    });
}

function stopDrag(containerId) {
    containers[containerId].isDragging = false;
    document.removeEventListener('mousemove', (e) => handleDrag(e, containerId));
    document.removeEventListener('mouseup', () => stopDrag(containerId));
}

function minimizeWindow(containerId) {
    document.getElementById(containerId).style.display = 'none';
}

function maximizeWindow(containerId) {
    const container = document.getElementById(containerId);
    const isMaximized = container.getAttribute('data-maximized') === 'true';

    if (isMaximized) {
        if (containerId == "container1") {
            container.style.width = '670px';
            container.style.height = 'auto';
            container.style = 'max-width: 75vw;';
        } else {
            let allElements = document.getElementById(containerId + "_F")
            allElements.classList.remove('max');
            container.style.width = 'auto';
            container.style.height = 'auto';
        }
    } else {
        if (containerId == "container1") {
            container.style = 'max-width: none;';
        } else if (containerId == "container13") {
            document.getElementById("container13_F").style = 'max-width: none;';
        }
        let allElements = document.getElementById(containerId + "_F")
        console.log(containerId + "_F");
        console.log(allElements);
        allElements.classList.add('max');
        container.style.width = '98vw';
        container.style.height = '98vh';
        container.style.position = "0 0 0 0";
        container.style.left = "0vw";
        container.style.top = "0vh";
    }

    container.setAttribute('data-maximized', !isMaximized);
    setTopWindow(containerId);
}

function closeWindow(containerId) {
    document.getElementById(containerId).style.display = 'none';
    if (containerId == "container1") {
        document.getElementById("res").value = "";
        inputStore(); removeCH();
        document.getElementById("resu1t").innerHTML = "";
        document.getElementById("result").innerHTML = "";
        document.getElementById("ti").innerHTML = "";
    } else if (containerId == "container5") {
        document.getElementById("RandCreatedResultDescription").innerHTML = "<br>";
        document.getElementById("RandCreatedResult").innerHTML = "<br>";
    }
}

function openWindow(containerId) {
    document.getElementById(containerId).style.display = 'block';
    setTopWindow(containerId)
}

function setTopWindow(containerId) {
    var k = Object.keys(containers);
    var dM = "";
    var dMN = 0;

    var ZIList = [];
    for (let i = 0; i < k.length; i++) {
        ZIList.push(containers[k[i]].zIndex);
        if (k[i] == containerId) {
            dM = containers[k[i]].zIndex;
            dMN = i;
        }
    }

    const f = ZIList[dMN]
    for (let h = 0; h < k.length; h++) {
        if (h == dMN) {
            ZIList[h] = k.length;
        } else if (ZIList[h] > f) {
            ZIList[h] = ZIList[h] - 1;
        }
    }

    for (let c = 0; c < k.length; c++) {
        document.getElementById(k[c]).style.zIndex = ZIList[c];
    }
}

function isTopWindow(containerId) {
    var k = Object.keys(containers);
    for (let i = 0; i < k.length; i++) {
        if (k[i] == containerId && containers[k[i]].zIndex === k.length) {
            return true;
        }
    }
    return false;
}