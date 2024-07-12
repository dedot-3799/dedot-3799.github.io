document.addEventListener('DOMContentLoaded', async () => {
    const boardElement = document.getElementById('ot_board');
    let board;
    let canPl = true;
    let rst = false;

    function initializeBoard() {
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 1, 0, 0, 0],
            [0, 0, 0, 1, -1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
    };



    initializeBoard();

    // Initialize board with squares
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.className = 'ot_square';
        square.addEventListener('click', () => handleSquareClick(i)); // Add event listener
        boardElement.appendChild(square);
    }
    // Initial update of the board display
    updateBoard();


    function updateBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const index = row * 8 + col;
                const square = boardElement.children[index];
                square.className = 'ot_square'; // Reset the class
                if (board[row][col] === 1) {
                    square.classList.add('black');
                } else if (board[row][col] === -1) {
                    square.classList.add('white');
                } else if (canPl){
                    const flips = countFlips(row, col, 1); // Check for valid moves for black
                    if (flips > 0) {
                        square.classList.add(`valid-${Math.min(flips, 6)}`); // Cap the class at valid-6
                    }
                }
            }
        }
    }

    function countFlips(row, col, player) {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        if (board[row][col] !== 0) return 0;
        let totalFlips = 0;
        for (const [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let flips = 0;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (board[x][y] === -player) {
                    flips++;
                } else if (board[x][y] === player) {
                    totalFlips += flips;
                    break;
                } else {
                    break;
                }
                x += dx;
                y += dy;
            }
        }
        return totalFlips;
    }


    function handleResetButtonClick() {
        initializeBoard();
        document.getElementById("result_ot").textContent = "";
        canPl = true;
        updateBoard();
        rst = true;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    CPButton.addEventListener("click", async () => {
        canPl = false;
        if (rst) {
            rst = false;
        }
        while (!isGameOver(board)) {
            if (rst) {
                initializeBoard();
                updateBoard();
                document.getElementById("result_ot").textContent = "";
                rst = false;
                return;
            }
            do {
                var cpu = await findBestMoveWithWorkers(board, 1, 5, -Infinity, Infinity);
                console.log(cpu);
                if (cpu !== null) { board = placeAndFlip(board, cpu.row, cpu.col, 1) } else {
                    var lk = findBestMove3(board, 1, 4, -Infinity, Infinity);
                    if (lk.move !== null) {
                        board = placeAndFlip(board, lk.move.row, lk.move.col, 1)
                    } else {
                        var g = findRandomMove(board, 1);
                        if (g.move !== null) {
                            board = placeAndFlip(board, g.move.row, g.move.col, 1)
                        } else {
                            break;
                        }
                    }
                }
                // Update the board display
                updateBoard();
                console.log(output(re_board_converter(board)));
                console.log(winning1(board));
                if (isGameOver(board)) {
                    break;
                }
            } while (!canPlayerPlaceStone(board, -1))
            if (isGameOver(board) || rst) {
                break;
            }
            if (rst) {
                initializeBoard();
                updateBoard();
                document.getElementById("result_ot").textContent = "";
                rst = false;
                return;
            }
            await wait(10);
            do {
                var cpu = await findBestMoveWithWorkers(board, -1, 5, -Infinity, Infinity);
                console.log(cpu);
                if (cpu !== null) { board = placeAndFlip(board, cpu.row, cpu.col, -1) } else {
                    var lk = findBestMove2(board, -1, 4, -Infinity, Infinity);
                    if (lk.move !== null) {
                        board = placeAndFlip(board, lk.move.row, lk.move.col, -1)
                    } else {
                        var g = findRandomMove(board, -1);
                        if (g.move) {
                            board = placeAndFlip(board, g.move.row, g.move.col, -1)
                        } else {
                            break;
                        }
                    }
                }
                // Update the board display
                updateBoard();
                console.log(output(re_board_converter(board)));
                console.log(winning1(board));
                if (isGameOver(board)) {
                    break;
                }
            } while (!canPlayerPlaceStone(board, 1));
            await wait(10);
            if (isGameOver(board)) {
                break;
            }
        }
        document.getElementById("result_ot").textContent = winning1(board);
    });

    RDButton.addEventListener("click", async () => {
        canPl = false;
        if (rst) {
            rst = false;
        }
        while (!isGameOver(board)) {
            if (rst) {
                initializeBoard();
                updateBoard();
                document.getElementById("result_ot").textContent = "";
                rst = false;
                return;
            }
            do {
                var g = findRandomMove(board, 1);
                if (g.move !== null) {
                    board = placeAndFlip(board, g.move.row, g.move.col, 1)
                } else {
                    break;
                }
                // Update the board display
                updateBoard();
                console.log(output(re_board_converter(board)));
                console.log(winning1(board));
                if (isGameOver(board)) {
                    break;
                }
            } while (!canPlayerPlaceStone(board, -1))
            if (isGameOver(board)) {
                break;
            }
            await wait(200);
            do {
                var g = findRandomMove(board, -1);
                if (g.move !== null) {
                    board = placeAndFlip(board, g.move.row, g.move.col, -1)
                } else {
                    break;
                }
                // Update the board display
                updateBoard();
                console.log(output(re_board_converter(board)));
                console.log(winning1(board));
                if (isGameOver(board)) {
                    break;
                }
            } while (!canPlayerPlaceStone(board, 1));
            await wait(200);
            if (isGameOver(board)) {
                break;
            }
        }
        document.getElementById("result_ot").textContent = winning1(board);
    });


    resetButton.addEventListener('click', handleResetButtonClick);

    async function handleSquareClick(index) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        console.log(`Square clicked: row ${row}, col ${col}`);


        // Example logic to place a piece (toggle between black and white for demonstration)
        if (canPlaceStone(board, row, col, 1) && canPl) {
            canPl = false
            board = placeAndFlip(board, row, col, 1);
            updateBoard();
            console.log(output(re_board_converter(board)));
            if (isGameOver(board)) {
                document.getElementById("result_ot").textContent = winning1(board);
            } else {
                do {
                    var cpu = await findBestMoveWithWorkers(board, -1, 5, -Infinity, Infinity);
                    console.log(2, cpu);
                    if (cpu !== null) { board = placeAndFlip(board, cpu.row, cpu.col, -1) } else {
                        var g = findBestMove(board, -1, 4, -Infinity, Infinity);
                        if (g.move !== null) {
                            board = placeAndFlip(board, g.move.row, g.move.col, -1)
                        } else {
                            var g = findRandomMove(board, -1);
                            if (g.move !== null) {
                                board = placeAndFlip(board, g.move.row, g.move.col, -1)
                            } else {
                                break;
                            }
                        }
                    }
                    // Update the board display
                    updateBoard();
                    console.log(output(re_board_converter(board)));
                    console.log(winning1(board));
                    if (isGameOver(board)) {
                        break;
                    }
                } while (!canPlayerPlaceStone(board, 1))
            }
            canPl = true;
            updateBoard();
        }
        if (isGameOver(board)) {
            document.getElementById("result_ot").textContent = winning1(board);
            canPl = true;
        }
    }
});


function findBestMove(board, player, depth, alpha, beta) {
    if (depth === 0 || isTerminalNode(board)) {
        return { score: evaluateBoard(board, player) };
    }
    let bestMove = null;
    if (player === 1) { // プレイヤー1の番
        let bestScore = -Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const testBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove(testBoard, -player, depth - 1, alpha, beta);
                    const score = -result.score;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return { move: bestMove, score: bestScore };
    } else { // プレイヤー2の番
        let bestScore = Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const testBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove(testBoard, -player, depth - 1, alpha, beta);
                    const score = -result.score;
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return { move: bestMove, score: bestScore };
    }
}

function evaluateBoard(board, player) {
    // 盤面の評価ロジックを実装する
    // 例: 石の数をカウントして評価
    let score = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player) {
                score++;
            } else if (board[row][col] === -player) {
                score--;
            }
        }
    }
    return score;
}

function isGameOver(board) {
    return isBoardFull(board) || (!canPlayerPlaceStone(board, 1) && !canPlayerPlaceStone(board, -1));
}

function isTerminalNode(board) {
    // ゲームの終了条件を確認する
    // 例: 全てのマスが埋まった場合またはどちらかのプレイヤーが置ける場所がない場合
    return isBoardFull(board) || (!canPlayerPlaceStone(board, 1) && !canPlayerPlaceStone(board, -1));
}

function isBoardFull(board) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

function canPlayerPlaceStone(board, player) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (canPlaceStone(board, row, col, player)) {
                return true;
            }
        }
    }
    return false;
}

function canPlaceStone(board, row, col, player) {
    // マスが空でない場合は石を置けない
    if (board[row][col] !== 0) {
        return false;
    }

    // 8つの方向に対して調べる
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    let canFlip = false;

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flip = false;
        let stone_count = 0;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {

            if (board[x][y] === 0) {
                break;
            }

            if (board[x][y] != player) {
                stone_count++;
            }

            if (board[x][y] == player && stone_count > 0) {
                flip = true;
                break;
            }

            if (board[x][y] == player && stone_count == 0) {
                break;
            }

            x += dx;
            y += dy;
        }

        if (flip) {
            canFlip = true;
            break;
        }
    }
    return canFlip;
}

function placeAndFlip(board, row, col, player) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    // 一時的に新しい盤面を作成して、石を置く
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player;

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flip = false;
        let stone_count = 0;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (newBoard[x][y] === 0) {
                break;
            }

            if (newBoard[x][y] != player) {
                stone_count++;
            }

            if (newBoard[x][y] == player && stone_count > 0) {
                flip = true;
                break;
            }

            x += dx;
            y += dy;
        }

        if (flip) {
            // ひっくり返す処理
            x = row + dx;
            y = col + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (newBoard[x][y] === player) {
                    break;
                }
                newBoard[x][y] = player;
                x += dx;
                y += dy;
            }
        }
    }

    return newBoard;
}

// その他の関数（evaluateBoard, isTerminalNode, canPlaceStone, placeAndFlip）は以前に説明したものを使用

function re_board_converter(board) {
    //"⚪️" is 1 , "⚫️" is -1, blank is 0.
    let nb = [];
    for (let h = 0; h < 8; h++) {
        for (let wl = 0; wl < 8; wl++) {
            var nt = board[h][wl];
            if (nt == 1) {
                nb.push("⚪️");
            } else if (nt == -1) {
                nb.push("⚫️");
            } else if (nt == 0) {
                nb.push((h * 8) + wl);
            }
        }
    }
    return nb;
}

function zeroPadding(NUM, LEN) {
    return (Array(LEN).join("0") + NUM).slice(-LEN);
}

function output(board) {
    var t = board.map((x) => zeroPadding(x, 2)).toString();
    var g = t += ",";
    var h = g.replace(/,/g, ":").match(/.{24}/g).toString().replace(/,/g, "\n").replace(/:/g, " ");
    return h;
}

// パスの判定
function isPass(board, player) {
    return findBestMove(board, player) === null;
}

function winning(board) {
    let [l, k] = [0, 0]
    for (let i = 0; i < 8; i++) {
        for (let h = 0; h < 8; h++) {
            const element = board[i][h];
            if (element == 1) {
                l += 1;
            } else if (element == -1) {
                k += 1;
            }
        }
    };
    return { "BLACK": l, "WHITE": k }
}

function winning1(board) {
    let winf;
    let [l, k] = [0, 0];
    for (let i = 0; i < 8; i++) {
        for (let h = 0; h < 8; h++) {
            const element = board[i][h];
            if (element == 1) {
                l += 1;
            } else if (element == -1) {
                k += 1;
            }
        }
    };
    var t = l + k;
    if (l > k) {
        winf = "WINNER: BLACK";
    } else if (k > l) {
        winf = "WINNER: WHITE";
    } else {
        winf = "DRAW"
    }
    return `BLACK: ${l}(${(l / t) * 100}%),\n WHITE: ${k}(${(k / t) * 100}%),\n${winf}`;
}

function iswin(board, player) {
    let g = winning(board);
    if ((g.BLACK > g.WHITE && player == -1) || (g.WHITE > g.BLACK && player == 1)) {
        return "WIN";
    } else if ((g.BLACK < g.WHITE && player == -1) || (g.WHITE < g.BLACK && player == 1)) {
        return "LOSE";
    } else if (g.BLACK == g.WHITE) {
        return "DRAW";
    } else {
        return "ERR";
    }
}

function findRandomMove(board, player) {
    console.log(board);
    let validMoves = [];

    // 有効な手を探す
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (canPlaceStone(board, row, col, player)) {
                validMoves.push({ move: { row, col } });
            }
        }
    }

    if (validMoves.length === 0) {
        return { bestMove: null }; // どこにも石を置けない場合
    }

    // 有効な手からランダムに選択
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
}




function findBestMove2(board, player, depth, alpha, beta) {
    if (depth === 0 || isGameOver(board)) {
        return { score: evaluateBoard2(board, player) };
    }

    let bestMove = null;
    if (player === 1) { // Maximizing player
        let maxEval = -Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const newBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove2(newBoard, -player, depth - 1, alpha, beta);
                    const eval = result.score;
                    if (eval > maxEval) {
                        maxEval = eval;
                        bestMove = { row, col };
                    }
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return { move: bestMove, score: maxEval };
    } else { // Minimizing player
        let minEval = Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const newBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove2(newBoard, -player, depth - 1, alpha, beta);
                    const eval = result.score;
                    if (eval < minEval) {
                        minEval = eval;
                        bestMove = { row, col };
                    }
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return { move: bestMove, score: minEval };
    }
}

function evaluateBoard2(board, player) {
    const weights = [
        [100, -20, 10, 5, 5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [10, -2, -1, -1, -1, -1, -2, 10],
        [5, -2, -1, -1, -1, -1, -2, 5],
        [5, -2, -1, -1, -1, -1, -2, 5],
        [10, -2, -1, -1, -1, -1, -2, 10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10, 5, 5, 10, -20, 100]
    ];

    let score = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player) {
                score += weights[row][col];
            } else if (board[row][col] === -player) {
                score -= weights[row][col];
            }
        }
    }

    // Add mobility score
    const playerMoves = countValidMoves(board, player);
    const opponentMoves = countValidMoves(board, -player);
    score += (playerMoves - opponentMoves);

    return score;
}

function countValidMoves(board, player) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (canPlaceStone(board, row, col, player)) {
                count++;
            }
        }
    }
    return count;
}


function findBestMove3(board, player, depth, alpha, beta) {
    if (depth === 0 || isGameOver(board)) {
        return { score: evaluateBoard3(board, player) };
    }

    let bestMove = null;
    if (player === 1) { // Maximizing player
        let maxEval = -Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const newBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove3(newBoard, -player, depth - 1, alpha, beta);
                    const eval = result.score;
                    if (eval > maxEval) {
                        maxEval = eval;
                        bestMove = { row, col };
                    }
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return { move: bestMove, score: maxEval };
    } else { // Minimizing player
        let minEval = Infinity;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (canPlaceStone(board, row, col, player)) {
                    const newBoard = placeAndFlip(board, row, col, player);
                    const result = findBestMove3(newBoard, -player, depth - 1, alpha, beta);
                    const eval = result.score;
                    if (eval < minEval) {
                        minEval = eval;
                        bestMove = { row, col };
                    }
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return { move: bestMove, score: minEval };
    }
}

function evaluateBoard3(board, player) {
    const cornerWeight = 100; // 角の重み
    const edgeWeight = 10; // エッジの重み
    const mobilityWeight = 5; // モービリティの重み
    const stoneCountWeight = 1; // 石の数の重み

    const weights = [
        [cornerWeight, -edgeWeight, 10, 5, 5, 10, -edgeWeight, cornerWeight],
        [-edgeWeight, -edgeWeight, 2, 2, 2, 2, -edgeWeight, -edgeWeight],
        [10, 2, 1, 1, 1, 1, 2, 10],
        [5, 2, 1, 0, 0, 1, 2, 5],
        [5, 2, 1, 0, 0, 1, 2, 5],
        [10, 2, 1, 1, 1, 1, 2, 10],
        [-edgeWeight, -edgeWeight, 2, 2, 2, 2, -edgeWeight, -edgeWeight],
        [cornerWeight, -edgeWeight, 10, 5, 5, 10, -edgeWeight, cornerWeight]
    ];

    let score = 0;

    // 角の評価
    score += cornerWeight * (board[0][0] === player) + (board[0][7] === player) +
        (board[7][0] === player) + (board[7][7] === player);

    // エッジの評価
    for (let row = 0; row < 8; row++) {
        score += edgeWeight * (board[row][0] === player) + (board[row][7] === player);
        score += edgeWeight * (board[0][row] === player) + (board[7][row] === player);
    }

    // モービリティの評価
    const playerMoves = countValidMoves(board, player);
    const opponentMoves = countValidMoves(board, -player);
    score += mobilityWeight * (playerMoves - opponentMoves);

    // 石の数の評価
    const playerStones = countStones(board, player);
    const opponentStones = countStones(board, -player);
    score += stoneCountWeight * (playerStones - opponentStones);

    return score;
}

function countStones(board, player) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player) {
                count++;
            }
        }
    }
    return count;
}


const numCores = navigator.hardwareConcurrency || 4;
const workers = [];
const workerPromises = [];

let worker_js = `
self.onmessage = function(e) {
    const { board, player, depth, alpha, beta, startIndex, endIndex } = e.data;
    const result = findBestMove(board, player, depth, alpha, beta, startIndex, endIndex);
    self.postMessage(result);
  };
  
  function findBestMove(board, player, depth, alpha, beta, startIndex, endIndex) {
    if (depth === 0 || isGameOver(board)) {
      return { score: evaluateBoard(board, player) };
    }
  
    let bestMove = null;
    let maxEval = -Infinity;
    let minEval = Infinity;
  
    for (let row = startIndex; row <= endIndex; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceStone(board, row, col, player)) {
          const newBoard = placeAndFlip(board, row, col, player);
          const result = findBestMove(newBoard, -player, depth - 1, alpha, beta, 0, 7);
          const eval = result.score;
  
          if (player === 1) { // Maximizing player
            if (eval > maxEval) {
              maxEval = eval;
              bestMove = { row, col };
            }
            alpha = Math.max(alpha, eval);
          } else { // Minimizing player
            if (eval < minEval) {
              minEval = eval;
              bestMove = { row, col };
            }
            beta = Math.min(beta, eval);
          }
          if (beta <= alpha) break;
        }
      }
    }
  
    return player === 1 ? { move: bestMove, score: maxEval } : { move: bestMove, score: minEval };
  }
  
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = -1;
  
  const weights = [
    [100, -10, 10, 5, 5, 10, -10, 100],
    [-10, -20, 1, 1, 1, 1, -20, -10],
    [10, 1, 5, 2, 2, 5, 1, 10],
    [5, 1, 2, 1, 1, 2, 1, 5],
    [5, 1, 2, 1, 1, 2, 1, 5],
    [10, 1, 5, 2, 2, 5, 1, 10],
    [-10, -20, 1, 1, 1, 1, -20, -10],
    [100, -10, 10, 5, 5, 10, -10, 100]
  ];
  
  function evaluateBoard(board) {
    let stabilityScore = evaluateStability(board);
    let mobilityScore = evaluateMobility(board);
    let frontierScore = evaluateFrontier(board);
  
    // 評価関数の重みを設定
    const stabilityWeight = 1.0;
    const mobilityWeight = 1.0;
    const frontierWeight = 1.0;
  
    // 各評価を総合する
    return (
      stabilityWeight * stabilityScore +
      mobilityWeight * mobilityScore +
      frontierWeight * frontierScore
    );
  }
  
  function evaluateStability(board) {
    let score = 0;
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === BLACK) {
          score += weights[row][col];
        } else if (board[row][col] === WHITE) {
          score -= weights[row][col];
        }
      }
    }
  
    return score;
  }
  
  function evaluateMobility(board) {
    let blackMobility = countPotentialMoves(board, BLACK);
    let whiteMobility = countPotentialMoves(board, WHITE);
  
    return blackMobility - whiteMobility;
  }
  
  function countPotentialMoves(board, player) {
    let directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === EMPTY) {
          for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === (player === BLACK ? WHITE : BLACK)) {
              count++;
              break;
            }
          }
        }
      }
    }
  
    return count;
  }
  
  function evaluateFrontier(board) {
    let blackFrontier = countFrontierDiscs(board, BLACK);
    let whiteFrontier = countFrontierDiscs(board, WHITE);
  
    return whiteFrontier - blackFrontier; // フロンティアは少ない方が有利
  }
  
  function countFrontierDiscs(board, player) {
    let directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === player) {
          for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && board[x][y] === EMPTY) {
              count++;
              break;
            }
          }
        }
      }
    }
  
    return count;
  }
  
  function countValidMoves(board, player) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceStone(board, row, col, player)) {
          count++;
        }
      }
    }
    return count;
  }
  
  function countStones(board, player) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === player) {
          count++;
        }
      }
    }
    return count;
  }
  
  function isGameOver(board) {
    return isBoardFull(board) || (!canPlayerPlaceStone(board, 1) && !canPlayerPlaceStone(board, -1));
  }
  
  function isBoardFull(board) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }
  
  function canPlayerPlaceStone(board, player) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceStone(board, row, col, player)) {
          return true;
        }
      }
    }
    return false;
  }
  
  function isGameOver(board) {
    return isBoardFull(board) || (!canPlayerPlaceStone(board, 1) && !canPlayerPlaceStone(board, -1));
  }
  
  function isBoardFull(board) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }
  
  function canPlayerPlaceStone(board, player) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceStone(board, row, col, player)) {
          return true;
        }
      }
    }
    return false;
  }
  
  function canPlaceStone(board, row, col, player) {
    // マスが空でない場合は石を置けない
    if (board[row][col] !== 0) {
        return false;
    }

    // 8つの方向に対して調べる
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    let canFlip = false;

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flip = false;
        let stone_count = 0;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {

            if (board[x][y] === 0) {
                break;
            }

            if (board[x][y] != player) {
                stone_count++;
            }

            if (board[x][y] == player && stone_count > 0) {
                flip = true;
                break;
            }

            if (board[x][y] == player && stone_count == 0) {
                break;
            }

            x += dx;
            y += dy;
        }

        if (flip) {
            canFlip = true;
            break;
        }
    }
    return canFlip;
}

function placeAndFlip(board, row, col, player) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    // 一時的に新しい盤面を作成して、石を置く
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player;

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flip = false;
        let stone_count = 0;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (newBoard[x][y] === 0) {
                break;
            }

            if (newBoard[x][y] != player) {
                stone_count++;
            }

            if (newBoard[x][y] == player && stone_count > 0) {
                flip = true;
                break;
            }

            x += dx;
            y += dy;
        }

        if (flip) {
            // ひっくり返す処理
            x = row + dx;
            y = col + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                if (newBoard[x][y] === player) {
                    break;
                }
                newBoard[x][y] = player;
                x += dx;
                y += dy;
            }
        }
    }

    return newBoard;
}
  
  `


let bl = new Blob([worker_js], { type: 'text/javascript' })

async function findBestMoveWithWorkers(board, player, depth) {
    const rowRangeSize = Math.ceil(8 / numCores);
    const workerPromises = []; // 新しい空の配列を生成

    for (let i = 0; i < numCores; i++) {
        const startIndex = i * rowRangeSize;
        const endIndex = Math.min((i + 1) * rowRangeSize - 1, 7);
        workerPromises.push(new Promise((resolve) => {
            const worker = new Worker(URL.createObjectURL(bl));
            worker.onmessage = function (e) {
                resolve(e.data);
                worker.terminate(); // Workerを終了させる
            };
            worker.postMessage({ board, player, depth, startIndex, endIndex });
        }));
    }

    const results = await Promise.all(workerPromises);
    let bestMove = null;
    let bestScore = player === 1 ? -Infinity : Infinity;
    results.forEach(result_1 => {
        if (result_1.move && result_1.score !== null) { // nullの結果を無視する
            if (player === 1 && result_1.score > bestScore) {
                bestScore = result_1.score;
                bestMove = result_1.move;
            } else if (player === -1 && result_1.score < bestScore) {
                bestScore = result_1.score;
                bestMove = result_1.move;
            }
        }
    });
    return bestMove;
}
