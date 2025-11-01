function removeDisplayNone() {
    ["chat-box", "user-input", "sendButton", "cli-box", "prime-input", "chPrimeButton"].forEach((c) => {
        document.getElementById(c).style.display = ""
    })
}

function toggleView(f) {
    const chatDivList = ["chat-box", "user-input", "sendButton"];
    const cliDivList = ["cli-box"];
    const normalDivList = ["prime-input", "chPrimeButton"];
    const prefList = ["pref"];
    switch (f) {
        case "normal":
            chatDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            cliDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            normalDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.remove('closeS');
                } else {
                    document.getElementById(e).classList.remove('close');
                }
            });
            prefList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('closeS');
                }
            });
            document.getElementById("inputBox").style.display = "";
            break;
        case "chat":
            normalDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            cliDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            chatDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.remove('closeS');
                } else {
                    document.getElementById(e).classList.remove('close');
                }
            });
            prefList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('closeS');
                }
            });
            document.getElementById("inputBox").style.display = "";
            document.getElementById("prime-result").style.display = "none";
            break;
        case "cli":
            document.getElementById("cli-box").style.display = ""
            normalDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            cliDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.remove('closeS');
                } else {
                    document.getElementById(e).classList.remove('close');
                }
            });
            chatDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            prefList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('closeS');
                }
            });
            document.getElementById("inputBox").style.display = "";
            document.getElementById("prime-result").style.display = "none";
            break;
        case "pref":
            normalDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            cliDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            chatDivList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.add('closeS');
                } else {
                    document.getElementById(e).classList.add('close');
                }
            });
            prefList.forEach((e) => {
                if (e.match(/input/) || e.match(/Button/)) {
                    document.getElementById(e).classList.remove('closeS');
                } else {
                    document.getElementById(e).classList.remove('closeS');
                }
            });
            changePrefScreen();
            document.getElementById("prime-result").style.display = "none";
            document.getElementById("inputBox").style.display = "none";
            break;
        default:
            break;
    }
};


function removeStringF(n) {
    return String(n).replace(/[^0-9\-\+\/\÷\(\)\!\^]/g, "");
}

function appendMessage(message, className, name, iconSrc, timestampClass) {
    const chatBox = document.getElementById('chat-box');
    const messageElem = document.createElement('div');
    messageElem.className = 'message ' + className;
    // prime.png と user-icon.png をSVGで作成


    const imgElem = document.createElement('span');
    imgElem.className = 'icon';
    imgElem.innerHTML = `<span class="isSmartPhone flex">
                <span class="isSmartPhoneD flex">P</span></span>`

    const contentElem = document.createElement('div');
    contentElem.className = 'content';

    const nameElem = document.createElement('div');
    nameElem.className = 'name';
    nameElem.textContent = name;

    const textElem = document.createElement('div');
    textElem.className = 'text';

    const caretElem = document.createElement('span');
    caretElem.className = 'caret';


    const timestampElem = document.createElement('span');
    const now = new Date();
    timestampElem.className = 'timestamp ' + timestampClass;
    timestampElem.textContent = now.toLocaleTimeString();

    contentElem.appendChild(nameElem);
    contentElem.appendChild(textElem);
    if (!iconSrc.match(/user_icon/)) {
        messageElem.appendChild(imgElem);
    }
    messageElem.appendChild(contentElem);
    messageElem.appendChild(timestampElem);
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;

    let index = 0;
    function typeWriter() {
        const chatBox1 = document.getElementById('chat-box');
        chatBox1.scrollTop = chatBox.scrollHeight
        if (message.length > 1000 || className == "user") {
            textElem.innerHTML = markdownToHTML(message);
            chatBox1.scrollTop = chatBox.scrollHeight
        } else if (index < message.length) {
            textElem.textContent = message.substring(0, index + 1);
            caretElem.textContent = "■";
            textElem.appendChild(caretElem);
            index++;
            textElem.innerHTML = markdownToHTML(textElem.innerHTML);
            setTimeout(typeWriter, message.length > 200 ? 1000 / message.length : 50); // Adjust the typing speed here
        } else {
            setTimeout(() => {
                caretElem.remove(); // Remove caret after typing is done
                textElem.innerHTML = markdownToHTML(textElem.innerHTML);
                textElem.innerHTML = markdownToHTML(message.substring(0, index));
            }, 1000);
        }
    }
    typeWriter();

}

function appendTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingElem = document.createElement('div');
    typingElem.className = 'typing-indicator';
    typingElem.id = 'typing-indicator';

    const dot1 = document.createElement('div');
    dot1.className = 'dot';
    const dot2 = document.createElement('div');
    dot2.className = 'dot';
    const dot3 = document.createElement('div');
    dot3.className = 'dot';

    typingElem.appendChild(dot1);
    typingElem.appendChild(dot2);
    typingElem.appendChild(dot3);
    chatBox.appendChild(typingElem);
    chatBox.scrollTop = chatBox.scrollHeight;

}

function removeTypingIndicator() {
    const typingElem = document.getElementById('typing-indicator');
    if (typingElem) {
        typingElem.remove();
    }
}

function convertPowerToString(expression) {
    // `^` を含む部分を正規表現で検出
    return expression.replace(/(\d+(\.\d+)?)\^(\d+)/g, (_, base, decimal, exponent) => {
        // 繰り返し掛け算で表現 (より効率的な方法も考えられます)
        return Array(parseInt(exponent)).fill(base).join('*');
    });
}

// LaTeXの基本的な数式をMathMLに変換する関数
function convertLatexToMathML(latex) {
    let mathML = '<math>';
    latex = " " + latex + " ";
    latex = latex.replace(/\//g, '"');
    latex = latex.replace(/([0-9]+)\^([0-9]+)/g, function (match, base, exp) {
        return `<msup><mi>${base}</mi><mn>${exp}</mn></msup>`;
    });

    latex = latex.replace(/\\frac{([^}]+)}{([^}]+)}/g, function (match, numerator, denominator) {
        return `<mfrac><mn>${numerator}</mn><mn>${denominator}</mn></mfrac>`;
    });

    // 乗算
    //latex = latex.replace(/(\*)|\\times|(×)/g, '<mo>&#xD7;</mo>');

    latex = latex.replace(/([0-9]+)!/g, '<mn>$1</mn><mo>!</mo>');
    // 文字
    latex = latex.replace(/\ ([a-zA-Z]+)\ /g, '<mi>$1</mi>');

    // 数字
    //latex = latex.replace(/\ ([0-9]+)\ /g, '<mn>$1</mn>');
    latex = latex.replace(/([0-9]+)/g, '<mn>$1</mn>');

    // 演算子
    latex = latex.replace(/([\(\+\-\=\)])/g, '<mo>$1</mo>');
    latex = latex.replace(/\*/g, '<mo>⋅</mo>');  // 掛け算（記号）
    latex = latex.replace(/\\times|×/g, '<mo>×</mo>'); // 掛け算
    latex = latex.replace(/\\div|"/g, '<mo>÷</mo>');   // 割り算

    mathML += latex + '</math>';
    return mathML;
}

function markdownToHTML(markdownText) {
    // 改行コードをHTML改行に変換
    markdownText = markdownText.replace(/\r?\n/g, "<br>");

    // ヘッディング
    markdownText = markdownText.replace(/^(\#{1,6}) (.*)/g, function (match, level, text) {
        return `<h${level}>${text}</h${level}>`;
    });

    // 太字
    markdownText = markdownText.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // 斜体
    markdownText = markdownText.replace(/\*<em>([^\*]+)<\/em>/g, "<em>$1</em>");
    // 斜体
    markdownText = markdownText.replace(/\*([^\*]+)\*/g, "<strong>$1</strong>");

    // コードブロック
    markdownText = markdownText.replace(/`(.*?)`/g, function (match, code) {
        return `<pre><code>${code}</code></pre>`;
    });

    // インラインコード
    markdownText = markdownText.replace(/`([^`]+)`/g, "<code>$1</code>");

    // リスト
    markdownText = markdownText.replace(/^\s*[-*+\.] (.*)/g, function (match, text) {
        return `<li>${text}</li>`;
    });

    // 引用
    markdownText = markdownText.replace(/^> (.*)/g, function (match, text) {
        return `<blockquote>${text}</blockquote>`;
    });

    // リンク
    markdownText = markdownText.replace(/\[([^\]]+)]\(([^)]+)\)/g, function (match, text, url) {
        return `<a href="${url}">${text}</a>`;
    });

    // 画像
    markdownText = markdownText.replace(/!\[([^\]]+)]\(([^)]+)\)/g, function (match, alt, url) {
        return `<img src="${url}" alt="${alt}">`;
    });

    // 数式 (LaTeX形式)
    markdownText = markdownText.replace(/\$([^$]+)\$/g, (match, latex) => {
        return convertLatexToMathML(latex);
    });

    return markdownText;
}

function removeString(x) {
    let g = String(x).split("");
    let [f, a] = [false, []];
    for (let i = 0; i < g.length; i++) {
        if (g[i] == ".") break;
        if (!isNaN(parseInt(g[i]))) a.push(g[i]);
    }
    return a.join("")
}

function toHankakuNumber(str) {
    // 全角数字、漢字数字を半角数字に変換するマップ
    const numMap = {
        '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
        '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
        '〇': '0', '一': '1', '二': '2', '三': '3', '四': '4',
        '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
    };

    // 文字列を1文字ずつ処理し、マップで置き換える
    return str.replace(/[０-９〇一二三四五六七八九]/g, (match) => numMap[match]);
}

function randomDS(word) {
    const styles = {
        desu: [
            "です。",
            "です！"
        ],
        dewaNai: [
            "ではありません。",
            "ではないです。",
            "じゃないです。",
            "ではないみたいです。",
            "じゃないみたいです。"
        ]
    };

    // 入力された単語が「です」か「ではない」か判定
    const styleList = styles[word];

    // 配列からランダムに要素を選択
    const randomIndex = Math.floor(Math.random() * styleList.length);

    // 選択した口調を返す
    return styleList[randomIndex];
}

function randomYN(word) {
    const styles = {
        yes: [
            "はい",
            "ええ",
            "うん",
            "もちろん",
        ],
        no: [
            "いいえ",
            "いや",
            "ううん",
            "残念ながら"
        ]
    };

    // 入力された単語が「はい」か「いいえ」か判定
    const styleList = styles[word];

    // 配列からランダムに要素を選択
    const randomIndex = Math.floor(Math.random() * styleList.length);

    // 選択した口調を返す
    return styleList[randomIndex];
}
const userName = 'You';
const pbotName = '素数判定機 (コマンド版)';
const botName = 'Interactive Prompt Analysis System v3';
const cmctrlName = 'Interactive Command Management System v3';

function loadGoogleFont(font) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
    document.head.appendChild(link);
}

async function updateFontPreview() {
    let font = await main.settingsRead("view.fontFamily");
    // フォントプレビューを更新
    if (font !== "sans-serif") loadGoogleFont(font);
    document.querySelector("body").style.fontFamily = font;
    let f = document.querySelectorAll("select");
    let g = document.querySelectorAll("input");
    let h = document.querySelectorAll("button");
    f.forEach(element => {
        element.style.fontFamily = font;
    });
    g.forEach(e => {
        e.style.fontFamily = font;
    })
    h.forEach(e => {
        e.style.fontFamily = font;
    })
}

// メニューの開閉を切り替える関数
function toggleMenu() {
    document.querySelector('.select-menu').classList.toggle('open');
}

const modeName = {
    normal: "フォーム型",
    chat: "対話型",
    cli: "CLI型",
    pref: "設定"
}

// オプションを選択したときの処理
function selectOption(text, event) {
    event.stopPropagation();
    document.getElementById('selected-text').textContent = modeName[text];
    toggleView(text)
    document.querySelector('.select-menu').classList.remove('open');
}

// 選択されたテキストを取得する関数
function getSelectedText() {
    return document.getElementById('selected-text').textContent;
}

// 選択されたテキストを変更する関数
function setSelectedText(text) {
    document.getElementById('selected-text').textContent = modeName[text];
}

const prefL = {
    chat: {
        character: [{ idName: "default", OptionText: "デフォルト" }, { idName: "AI", OptionText: "AI" }, { idName: "Ojou", OptionText: "お嬢様" }, { idName: "Mathematician", OptionText: "専門家" }, { idName: "Friend", OptionText: "友達" }]
    },
    main: {
        testMethod: [{ idName: "default", OptionText: "デフォルト" }, { idName: "old.v9", OptionText: "旧型試し割り法" }, { idName: "new.v7", OptionText: "新型試し割り法" }, { idName: "APR-CL", OptionText: "APR-CL素数判定法" }, { idName: "MILLER-RABIN", OptionText: "ミラーラビン素数判定法" }, { idName: "AKS", OptionText: "AKS素数判定法" },],
        parserPrecedence: [{ idName: "3", OptionText: "項を優先" }, { idName: "2", OptionText: "左が先" }],
    },
    view: {
        fontFamily: [{ idName: "sans-serif", OptionText: "デフォルト(サンセリフ)" }, { idName: "Noto Sans JP", OptionText: "Noto Sans JP" }, { idName: "Sawarabi Gothic", OptionText: "さわらびゴシック" }, { idName: "Zen Kaku Gothic New", OptionText: "ZEN角ゴシック" }, { idName: "Kosugi", OptionText: "小杉" }, { idName: "Noto Serif JP", OptionText: "Noto Serif JP" }, { idName: "Sawarabi Mincho", OptionText: "さわらび明朝" }, { idName: "Zen Old Mincho", OptionText: "ZENオールド明朝" }, { idName: "Hina Mincho", OptionText: "ひな明朝" }, { idName: "Kiwi Maru", OptionText: "キウイ丸" }, { idName: "Kosugi Maru", OptionText: "小杉丸" }, { idName: "Zen Maru Gothic", OptionText: "ZEN丸ゴシック" }, { idName: "Kaisei Opti", OptionText: "解星オプティ" }, { idName: "Zen Kurenaido", OptionText: "ZEN紅道" }, { idName: "Klee One", OptionText: "クレーワン" }, { idName: "Yomogi", OptionText: "Yomogi" }, { idName: "Mochiy Pop One", OptionText: "Mochiy Pop One" }, { idName: "Yuji Syuku", OptionText: "Yuji Syuku" }, { idName: "Stick", OptionText: "Stick" }]
    }
}

async function changePrefScreen() {
    let set = await main.settingsReadALL();

    console.log(set, Object.keys(set), Object.keys(prefL));
    for (let i = 0; i < Object.keys(prefL).length; i++) {
        const el = prefL[Object.keys(prefL)[i]];
        const els = set[Object.keys(prefL)[i]];
        for (let j = 0; j < Object.keys(el).length; j++) {
            const elm = el[Object.keys(el)[j]];
            const elsm = els[Object.keys(el)[j]];
            let h = "";
            for (let k = 0; k < elm.length; k++) {
                h += `<option value="${elm[k].idName}">${elm[k].OptionText}</option>`;
            }

            document.getElementById(`${Object.keys(prefL)[i]}.${Object.keys(el)[j]}`).innerHTML = h;
            let optionsA = document.getElementById(`${Object.keys(set)[i]}.${Object.keys(el)[j]}`).options;
            let flg = false;
            for (let optionA of optionsA) {
                if (optionA.value === elsm) {
                    optionA.selected = true;
                    flg = true;
                } else {
                    optionA.selected = false
                };
            }
            if (!flg) {
                h += `<option value="${elsm}">${elsm}</option>`;
                console.log(h, els, elsm);
                document.getElementById(`${Object.keys(prefL)[i]}.${Object.keys(el)[j]}`).innerHTML = h;
                let optionsA = document.getElementById(`${Object.keys(prefL)[i]}.${Object.keys(el)[j]}`).options;
                for (let optionA of optionsA) {
                    if (optionA.value === elsm) {
                        optionA.selected = true;
                    } else {
                        optionA.selected = false
                    };
                }
            }
        }
    }
}

/* Old changePrefScreen() (削除予定)

async function changePrefScreen_old() {
    let set = await main.settingsReadALL();
    console.log(set, Object.keys(set));
    for (let i = 0; i < Object.keys(set).length; i++) {
        const el = set[Object.keys(set)[i]];
        for (let j = 0; j < Object.keys(el).length; j++) {
            const elm = el[Object.keys(el)[j]];
            if (["main.threads", "view.theme"].includes(`${Object.keys(set)[i]}.${Object.keys(el)[j]}`)) {
                continue
            }
            let optionsA = document.getElementById(`${Object.keys(set)[i]}.${Object.keys(el)[j]}`).options;
            for (let optionA of optionsA) {
                if (optionA.value === elm) optionA.selected = true;
                else optionA.selected = false;
            }
        }
    }
}*/