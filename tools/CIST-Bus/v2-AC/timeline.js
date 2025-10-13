function createTimeline(container, routeJson) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;
    el.innerHTML = '';

    const horizontal = window.innerWidth > 800;
    el.classList.toggle('horizontal', horizontal);
    el.classList.toggle('vertical', !horizontal);

    for (let i = 0; i < routeJson.length; i++) {
        const item = routeJson[i];
        if (item.type === 'station') {
            const seg = document.createElement('div');
            seg.className = 'segment';

            const dot = document.createElement('div');
            dot.className = 'dot' + (item.terminal ? ' terminal' : '');

            const name = document.createElement('div');
            name.className = 'station-name';
            name.textContent = item.name;

            const time = document.createElement('div');
            time.className = 'time';
            if (item.time) time.textContent = item.time;

            if (horizontal) {
                seg.appendChild(time);
                seg.appendChild(dot);
                seg.appendChild(name);
            } else {
                seg.appendChild(time);
                seg.appendChild(dot);
                seg.appendChild(name);
            }
            el.appendChild(seg);
        }

        if (item.type === 'move') {
            const conn = document.createElement('div');
            conn.className = 'connector ' + (item.mode === 'walk' ? 'walking' : 'solid');

            const line = document.createElement('div');
            line.className = 'line';
            conn.appendChild(line);

            if (item.name) {
                const label = document.createElement('div');
                label.className = 'transport-label';
                label.textContent = item.name;
                conn.appendChild(label);
            }

            if (item.transfer && item.duration) {
                const badge = document.createElement('div');
                badge.className = 'transfer-label';
                badge.textContent = `乗り換え ${item.duration}`;
                conn.appendChild(badge);
            } else if (item.duration) {
                const dur = document.createElement('div');
                dur.className = 'duration-label';
                dur.textContent = `所要時間 ${item.duration}`;
                conn.appendChild(dur);
            }

            const next = routeJson[i + 1];

            el.appendChild(conn);
        }
    }
}

function createRouteDetail(busb, train, stp) {
    let busD = JSON.parse(JSON.stringify(busb));
    let routeDetail = [];
    busD.forEach((item) => { if (["発", "着"].includes(item.location.slice(-1))) item.location = item.location.slice(0, -1) });
    busD.forEach((item, index) => {
        if (item.type) routeDetail.push({ type: "station", time: formatTimeData(item.time), name: item.location, terminal: true });
        else routeDetail.push({ type: "station", time: formatTimeData(item.time), name: item.location });
        if (busD.length - 1 > index) {
            let nm = "シャトルバス", mv = "bus", tr = false;
            if (busD[index + 1].location == item.location) mv = "walk", tr = true, nm = "徒歩2分";
            if (train && (["札幌駅", "新札幌駅"].includes(busD[index + 1].location) && ["南千歳駅", "新札幌駅", "札幌駅"].includes(item.location) || busD[index + 1].location == "南千歳駅" && item.location == "新札幌駅")) mv = "train", nm = train;
            if (tr) routeDetail.push({ type: "move", duration: String(timeToNumber(busD[index + 1].time) - timeToNumber(item.time) + "分"), "transfer": true, mode: mv, name: nm });
            else routeDetail.push({ type: "move", duration: String(timeToNumber(busD[index + 1].time) - timeToNumber(item.time) + "分"), name: nm });
        }
    });
    for (let g = 0; g < 2; g++) {
        for (let i = 1; i < routeDetail.length - 2; i++) {
            if (routeDetail[i].type == "move" && routeDetail[i].name == routeDetail[i + 2].name && !routeDetail[i + 1].terminal) {
                let duration = parseInt(routeDetail[i + 2].duration.slice(0, -1)) + parseInt(routeDetail[i].duration.slice(0, -1));
                routeDetail[i].duration = `${duration}分`
                routeDetail.splice(i + 1, 2);
            }
        }
    }
    if (!routeDetail[routeDetail.length - 1].terminal) routeDetail.splice(routeDetail.length - 2, 2);
    if (!routeDetail[0].terminal) routeDetail.splice(0, 2);
    if (routeDetail[0].name == "本部棟" && stp) routeDetail[0].name = `${routeDetail[0].name} (乗り場:${stp})`;
    return routeDetail;
}

function formatTimeData(n) {
    if (!n) return "";
    return n.split(":").map(x => x.padStart(2, '0')).join(":");
}