function addSystemTheme() {
    const customStyle = document.getElementById('style');
    customStyle.innerHTML += `@media (prefers-color-scheme: dark) {
            body {
                background-color: #222;
                color: #ffffff;
            }
            .container {
                background-color: #333;
                color: #fff;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
            }
            h1 {
                color: #fff;
            }
            input:hover {
                border-color: #AAAAAA; /* マウスオーバー時のボーダーカラー */
            }
            button:hover {
                border-color: #888; /* マウスオーバー時のボーダーカラー */
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            }
            footer {
                background-color: #333;
                color: #fff;
            }
            footer a {
                color: #FFF;
            }
        }`;
}

function addColorTheme() {
    removeTheme("image");
    removeTheme("image1");
    removeTheme("color");
    const customStyle = document.getElementById('color');
    customStyle.innerHTML += `
            body {
                background-color: ${document.getElementById("custom_color_background").value};
                color: ${document.getElementById("custom_char").value};
            }
            .app-container {
                background-color: ${document.getElementById("custom_mainapp").value};
                color: ${document.getElementById("custom_char").value};
                font-color: ${document.getElementById("custom_char").value};
            }
            .container {
                background-color: ${document.getElementById("custom_mainapp").value};
                color: ${document.getElementById("custom_char").value};
                font-color: ${document.getElementById("custom_char").value};
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.75);
            }
            h1 {
                color: ${document.getElementById("custom_char").value};
            }
            #checkButton,
            #optionButton,
            #apply,
            #close,
            #generate,
            #apply-color,button {
                background-color: ${document.getElementById("custom_button").value};
                color: ${document.getElementById("custom_button_chr").value};
            }
            input:hover {
                border-color: #AAAAAA; /* マウスオーバー時のボーダーカラー */
            }
            button:hover {
                border-color: #888; /* マウスオーバー時のボーダーカラー */
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            }
            footer {
                background-color: #333;
                color: #fff;
            }
            footer a {
                color: #FFF;
            }
        `;
}

function changeCustomTheme() {
    if (document.getElementById('themeSelects').value === "Image-custom") {
        addImageTheme()
    } else {
        addColorTheme()
    }
    SettingsManager("write", "resize_ratio", document.getElementById("resize_ratio").value || 1)
    var l_ch = ["custom_color_background", "custom_char", "custom_button", "custom_mainapp", "custom_button_chr"];
    for (let k = 0; k < l_ch.length; k++) {
        SettingsManager("write", l_ch[k], document.getElementById(l_ch[k]).value)
    }
    var l_cl = ["resize_ch", "glass_ti"];
    for (let k = 0; k < l_cl.length; k++) {
        SettingsManager("write", l_cl[k], document.getElementById(l_cl[k]).checked)
    }
}

function resizeImg(imgData) {
    const image = new Image();
    image.src = imgData;

    if (image.width < window.innerWidth || image.height < window.innerHeight) {
        var ratio = 1;
    } else {
        if (image.width < image.height) {
            var ratio = window.innerHeight / image.height
        } else {
            var ratio = window.innerWidth / image.width
        }
    }
    var fix = Number(document.getElementById("resize_ratio").value) || 1;
    var fix_ratio = fix * ratio;
    console.log(`resizer:  ${ratio} * ${fix} = ${fix_ratio} x`);

    if (!document.getElementById("resize_ch").checked) {
        fix_ratio = 1;
    }

    var ImgH = Math.floor(image.height * fix_ratio);
    var ImgW = Math.floor(image.width * fix_ratio);

    console.log(`resizer: ImageSize = ${image.width} x ${image.height} => ${ImgW} x ${ImgH}`);
    const canvas = document.createElement('canvas');
    canvas.width = ImgW;
    canvas.height = ImgH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, ImgW, ImgH);
    var f = canvas.toDataURL('image/png', 0.001);
    return f;
}

const gzip = async data => {
    const readableStream = new Blob([data]).stream();
    const compressedStream = readableStream.pipeThrough(
        // メモ: 毎回インスタンス化する必要がある
        new CompressionStream('gzip'),
    );
    const arrayBuffer = await new Response(compressedStream).arrayBuffer();
    return arrayBuffer;
};

const ungzip = async data => {
    const readableStream = new Blob([data]).stream();
    const decompressedStream = readableStream.pipeThrough(
        // メモ: 毎回インスタンス化する必要がある
        new DecompressionStream('gzip'),
    );
    const arrayBuffer = await new Response(decompressedStream).arrayBuffer();
    return arrayBuffer;
};

// 文字列から ArrayBuffer への変換

function string_to_buffer(src) {
    return (new Uint16Array([].map.call(src, function (c) {
        return c.charCodeAt(0)
    }))).buffer;
}

// ArrayBuffer から文字列への変換

function buffer_to_string(buf) {
    return String.fromCharCode.apply("", new Uint16Array(buf))
}

// ただし、文字列が長すぎる場合は RangeError: Maximum call stack size exceeded. が発生してしまう。
// 以下は1024バイト単位に分割して処理する場合

function large_buffer_to_string(buf) {
    var tmp = [];
    var len = 1024;
    for (var p = 0; p < buf.byteLength; p += len) {
        tmp.push(buffer_to_string(buf.slice(p, p + len)));
    }
    return tmp.join("");
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1000;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(3)) + ' ' + sizes[i];
  }


function addImageTheme() {
    removeTheme("image");
    removeTheme("image1");
    removeTheme("color");
    GLASS()
    const allElements = document.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].classList.add('image');
    }
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        async () => {
            var [resized, raw] = [resizeImg(reader.result), reader.result]
            // 画像ファイルを base64 文字列に変換します
            document.getElementById("image1").innerHTML = `body {
                background-image: url(${document.getElementById("resize_ch").checked ? resized : raw});
                background-attachment: fixed;
                background-size: cover;
                background-position: center center;
            }`;
            const binaryData = atob((document.getElementById("resize_ch").checked ? resized : raw).split(',')[1]);
            const dataArray = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                dataArray[i] = binaryData.charCodeAt(i);
            }
            console.log(dataArray.byteLength);
            if (dataArray.byteLength < 5000000) {   
                try {
                console.log("SAVE");
                document.getElementById("info_bkgr_img").innerHTML = "画像サイズ:" + formatFileSize(dataArray.byteLength);
                sessionStorage.setItem("Image", document.getElementById("resize_ch").checked ? resized : raw)
                } catch (err) {
                    document.getElementById("info_bkgr_img").innerHTML = `保存時にエラーが発生しました。`
                }
            } else {
                document.getElementById("info_bkgr_img").innerHTML = `画像サイズが${formatFileSize(dataArray.byteLength)}であり、\n5MB以上なので保存できません。`;
                sessionStorage.removeItem("Image")
            }
        },
        false,
    );

    if (file) {
        reader.readAsDataURL(file);
    }

    const customStyle = document.getElementById('image');
    customStyle.innerHTML += `
            body {
                background-color: #000;
                color: ${document.getElementById("custom_char").value};
            }
            .container.image {
                background-color: ${document.getElementById("custom_mainapp").value};
                color: ${document.getElementById("custom_char").value};
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.75);
            }
            
            #checkButton,
            #optionButton,
            #apply,
            #close,
            #generate,
            #apply-color,
            button {
                background-color: ${document.getElementById("custom_button").value};
                color: ${document.getElementById("custom_button_chr").value};
            }
            input:hover {
                border-radius: 12px;
                border-color: #AAAAAA; /* マウスオーバー時のボーダーカラー */
            }
            button:hover,button:focus {
                border-radius: 12px;
                border-color: #888; /* マウスオーバー時のボーダーカラー */
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            }
            footer {
                background-color: #333;
                color: #fff;
            }
            footer a {
                color: #FFF;
            }
            h1 , #ti{
                color: ${document.getElementById("custom_char").value};
            }
        `;
}

function customColorThemeG(type) {
    let list = ["color-custom-title", "color-custom-bkgr", "custom_color_background", "color-custom-char", "custom_char", "color-custom-button", "custom_button", "cl2", "cl4", "cl6", "custom_mainapp", "color-custom-container", "cl8", "color-custom-button_chr", "custom_button_chr", "cl10", "apply-color", "cl11", "cl12"];
    if (type == "remove") {
        for (let i = 0; i < list.length; i++) {
            document.getElementById(list[i]).style.display = "none";
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            document.getElementById(list[i]).style.display = "flex";
        }
    }
}

function customImageThemeG(type) {
    let list = ["color-custom-title", "image-custom-bkgr", "custom_image_background", "color-custom-char", "custom_char", "color-custom-button", "custom_button", "cl1", "cl4", "cl6", "custom_mainapp", "color-custom-container", "cl8", "color-custom-button_chr", "custom_button_chr", "cl10", "apply-color", "cl11", "cl12", "cl13", "glass_ti", "glass_ch", "image-custom-resize", "resize_ch", "cl14", "cl15", "resize_ratio", "resize_ratio_ti", "info_bkgr_img"];
    if (type == "remove") {
        for (let i = 0; i < list.length; i++) {
            document.getElementById(list[i]).style.display = "none";
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            document.getElementById(list[i]).style.display = "flex";
        }
    }
}

function GLASS() {
    if (document.getElementById("glass_ch").checked) {
        document.getElementById("glass_bk").innerHTML = `
        .container,.container.image {
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(2.5px);
            -webkit-backdrop-filter: blur(2.5px);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            color: ${document.getElementById("custom_char").value};
        }

        #res,#display {
            color: ${document.getElementById("custom_char").value};
        }

        #checkButton,
#optionButton,
#apply,
#close,
#generate,
#apply-color,#res,input,select,button,.btn.image,.disp.image,button.image {
    color: ${document.getElementById("custom_button_chr").value};
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition-duration: 500ms;
        }
        footer {
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        `;
    } else {
        removeTheme("glass_bk")
    }
    SettingsManager("write", "glass_ch", document.getElementById("glass_ch").checked)
}

function removeThemeF(id) {
    // 特定の文字列を検索して削除する
    const customStyle = document.getElementById(id);
    const originalHTML = customStyle.innerHTML;
    // 正規表現を使用して対応する括弧のペアを考慮して削除
    const regex = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*{.*}/s;
    const updatedHTML = originalHTML.replace(regex, '');

    customStyle.innerHTML = updatedHTML;
}

function removeTheme(id) {
    document.getElementById(id).innerHTML = ""
}

function changeTheme() {
    var selectedTheme = document.getElementById('themeSelects').value;
    var themeDic = {
        "dark": "dark-mode",
        "darker": "darker-mode",
        "light-blue": "lb-mode",
        "light": "light-mode",
        "dark-blue": "db-mode",
        "sunset": "sunset-mode",
        "color-custom": "color",
        "Image-custom": "image"
    }
    var themes = Object.keys(themeDic);
    const allElements = document.getElementsByTagName('*');
    SettingsManager("write", "theme", selectedTheme);
    for (let i = 0; i < allElements.length; i++) {
        for (let g = 0; g < themes.length; g++) {
            allElements[i].classList.remove(themeDic[themes[g]]);
        }
    }
    removeThemeF("style");
    removeTheme("color");
    removeTheme("image");
    removeTheme("image1");
    removeTheme("glass_bk");

    if (selectedTheme === 'system') {
        addSystemTheme();
        customColorThemeG("remove")
        customImageThemeG("remove")
    } else if (selectedTheme === 'color-custom') {
        addColorTheme()
        customImageThemeG("remove")
        customColorThemeG("add")
    } else if (selectedTheme === 'Image-custom') {
        customColorThemeG("remove")
        addImageTheme()
        GLASS()
        customImageThemeG("add")
    } else {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add(themeDic[selectedTheme]);
        }
        customColorThemeG("remove")
        customImageThemeG("remove")
    }
}

function SettingsManager(mode, key, option) {
    switch (mode) {
        case "read": {
            //キーが存在しない場合はそのままJSONを返し、キーがある場合はキーの値を返す
            if (key.length == 0) {
                throw new Error("SettingsManager_reader: Unexpected Key")
            } else {
                try {
                    let k = JSON.parse(sessionStorage.getItem("Settings"));
                    return k[key];
                } catch (err) {
                    throw new Error("SettingsManager_reader: " + err)
                }
            }
        }
        case "write": {
            //指定されたキーの値をOPTIONに変更する
            try {
                let k = sessionStorage.getItem("Settings")
                console.log(k);
                var f = JSON.parse(k);
                f[key] = option;
                sessionStorage.setItem("Settings", JSON.stringify(f));
                return;
            } catch (err) {
                throw new Error("SettingsManager_writer: " + err)
            }
        }
        case "reset": {
            //前バージョンの設定を削除
            if (document.cookie.match("theme=")) {
                document.cookie = "theme=; max-age=0";
            }
            if (document.cookie == "" || !document.cookie.match("}")) {
                deleteAllCookies()
            }
            if (null === (sessionStorage.getItem("Settings"))) {
                console.log("reseting");
                sessionStorage.setItem("Settings", `{"theme":"system"}`)
            };
        }
    }
}

// 初期設定
function firstCheck() {
    SettingsManager("reset")
    //クッキーの読み取り
    let th_cookie = SettingsManager("read", "theme");
    console.log(document.cookie);
    console.log(th_cookie);
    //テーマ設定
    let opt = document.getElementById('themeSelects').options;
    for (let option of opt) {
        if (option.value === (th_cookie || "system")) option.selected = true;
    }
    const allElements = document.getElementsByTagName('*');
    if (th_cookie == "light") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('light-mode');
        }
    } else if (th_cookie == "dark") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('dark-mode');
        }
    } else if (th_cookie == "light-blue") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('lb-mode');
        }
    } else if (th_cookie == "dark-blue") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('db-mode');
        }
    } else if (th_cookie == "darker") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('darker-mode');
        }
    } else if (th_cookie == "sunset") {
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('sunset-mode');
        }
    } else if (th_cookie == "system") {
        addSystemTheme();
    } else if (th_cookie == "color-custom") {
        addColorTheme();
        customImageThemeG("remove")
        customColorThemeG("add")
        document.getElementById("resize_ratio").value = SettingsManager("read", "resize_ratio")
        var l_ch = ["custom_color_background", "custom_char", "custom_button", "custom_mainapp", "custom_button_chr"];
        for (let k = 0; k < l_ch.length; k++) {
            document.getElementById(l_ch[k]).value = SettingsManager("read", l_ch[k])
        }
        var l_cl = ["resize_ch", "glass_ch"];
        for (let k = 0; k < l_cl.length; k++) {
            document.getElementById(l_cl[k]).checked = SettingsManager("read", l_cl[k])
        }
    } else if (th_cookie == "Image-custom") {
        customColorThemeG("remove")
        document.getElementById("resize_ratio").value = SettingsManager("read", "resize_ratio")
        var l_ch = ["custom_color_background", "custom_char", "custom_button", "custom_mainapp", "custom_button_chr"];
        for (let k = 0; k < l_ch.length; k++) {
            document.getElementById(l_ch[k]).value = SettingsManager("read", l_ch[k])
        }
        var l_cl = ["resize_ch", "glass_ch"];
        for (let k = 0; k < l_cl.length; k++) {
            document.getElementById(l_cl[k]).checked = SettingsManager("read", l_cl[k])
        }
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].classList.add('image');
        }
        addImageTheme();
        GLASS();
        customImageThemeG("add")
    } else {
        addSystemTheme();
        document.cookie = `Settings={"theme":"system"};`;
    }

    //前回の入力の復元
    let f = SettingsManager("read", "inputNumber");
    if (f !== "") {
        document.getElementById("res").value = f;
    }
    let h = SettingsManager("read", "workers");
    if (h !== "") {
        document.getElementById("worker").value = h;
    }
    let g = SettingsManager("read", "mode");
    let optionsA = document.getElementById('ty').options;
    for (let optionA of optionsA) {
        if (optionA.value === (g || "null")) optionA.selected = true;
    }
    if (th_cookie !== "color-custom" && th_cookie !== "Image-custom") {
        customColorThemeG("remove")
        console.log("OI");
        if (th_cookie !== "Image-custom") {
            document.getElementById("image-custom-bkgr").style.display = "none";
            document.getElementById("custom_image_background").style.display = "none";
            document.getElementById("cl1").style.display = "none";
            document.getElementById("cl13").style.display = "none";
            document.getElementById("glass_ch").style.display = "none";
            document.getElementById("glass_ti").style.display = "none";
            document.getElementById("cl14").style.display = "none";
            document.getElementById("resize_ch").style.display = "none";
            document.getElementById("image-custom-resize").style.display = "none";
            document.getElementById("cl15").style.display = "none";
            document.getElementById("resize_ratio").style.display = "none";
            document.getElementById("resize_ratio_ti").style.display = "none";
            document.getElementById("info_bkgr_img").style.display = "none";
        }
    }
    if (th_cookie == "Image-custom") {
        const base64Data = sessionStorage.getItem('Image');
        document.getElementById("image1").innerHTML = `body {
            background-image: url(${base64Data});
            background-attachment: fixed;
            background-size: cover;
            background-position: center center;
        }`;
    }
    var windowList = ["container1","container2","container3","container4","container5","container6","container7","container8","container9","container11","container12","container13","container10","container14","container16","container15","container17"];

    windowList.forEach(el => {
        closeWindow(el)
    });

    document.getElementById("load").style.display = "none";
}


function inputStore() {
    SettingsManager("write", "inputNumber", document.getElementById("res").value)
}

function df() {
    deleteAllCookies()
    document.cookie = "Settings={};"
}

function deleteAllCookies() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;max-age=0'
    }
}