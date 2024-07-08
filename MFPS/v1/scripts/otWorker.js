self.onmessage = function(e) {
    const { board, player, depth, alpha, beta, rowRange } = e.data;
    const result = findBestMove(board, player, depth, alpha, beta, rowRange);
    self.postMessage(result);
  };
  
  function findBestMove(board, player, depth, alpha, beta, rowRange) {
    if (depth === 0 || isGameOver(board)) {
      return { score: evaluateBoard(board, player) };
    }
  
    let bestMove = null;
    let maxEval = -Infinity;
    let minEval = Infinity;
  
    for (let row = rowRange[0]; row <= rowRange[1]; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceStone(board, row, col, player)) {
          const newBoard = placeAndFlip(board, row, col, player);
          const result = findBestMove(newBoard, -player, depth - 1, alpha, beta, [0, 7]);
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
  
  function evaluateBoard(board, player) {
    const cornerWeight = 100;
    const edgeWeight = 10;
    const mobilityWeight = 5;
    const stoneCountWeight = 1;
  
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
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === player) {
          score += weights[row][col];
        } else if (board[row][col] === -player) {
          score -= weights[row][col];
        }
      }
    }
  
    const playerMoves = countValidMoves(board, player);
    const opponentMoves = countValidMoves(board, -player);
    score += mobilityWeight * (playerMoves - opponentMoves);
  
    const playerStones = countStones(board, player);
    const opponentStones = countStones(board, -player);
    score += stoneCountWeight * (playerStones - opponentStones);
  
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
  
  function canPlaceStone(board, row, col, player) {
    // canPlaceStone関数のロジックをここに追加
  }
  
  function placeAndFlip(board, row, col, player) {
    // placeAndFlip関数のロジックをここに追加
  }
  