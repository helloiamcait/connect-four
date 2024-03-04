$(document).ready(function () {
  let board = Array(6)
    .fill(0)
    .map(() => Array(7).fill(0));

  console.log(board);

  let humanPlayer = 1;
  let compPlayer = 2;
  let humanPlayerTurn = false;
  let compPlayerTurn1Done = false;
  let humanPlayerWins = 0;
  let compPlayerWins = 0;

  let compPlayerTurn1Options = [];

  let startVert = [];
  let startTLBR = [];
  let startTRBL = [];
  let startHor = [];

  let countFill = 0;
  let count0 = 0;
  let count2 = 0;
  let roundCount = 0;

  let minMovesObjectTLBR = {};
  let minMovesObjectTRBL = {};
  let minMovesObjectHor = {};
  let minMovesObjectVert = {};

  let turnDirectionTracker = [];
  let turnCount = 0;

  let stopComp = false;

  $(".score-board").hide();
  $(".grid-container").hide();

  // $(".coinFlip").hide();
  $(".win-overlay").css("display", "none");
  $(".restart-overlay").css("display", "none");
  $(".coin-flip-overlay").css("display", "none");


  $("#start").on("click", function () {
    $(":button#start").css("display", "none");
    generateBoard();
    coinFlip();

    $(".scoreComp").text("COMPUTER " + compPlayerWins);
    $(".scoreHuman").text("YOU " + humanPlayerWins);
    $(".score-board").show();
    
    stopComp = false;
  });

  $("#restart").on("click", function () {
    
    $(".grid-container").removeClass("overlay");
    board = Array(6)
      .fill(0)
      .map(() => Array(7).fill(0));
    $("h1").text("Connect 4");
    $(":button.grid-button").remove();
    $("div.grid-overlay").remove();

     $(".win-overlay").css("display", "none");
     $(".restart-overlay").css("display", "none");
    stopComp = false;
    humanPlayerTurn = false;
    compPlayerTurn1Done = false;
    compPlayerTurn1Options = [];
    generateBoard();
    coinFlip();
  });

  function generateBoard() {
    roundCount++;

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
          $(".grid-container").show();
          const gridItem = document.createElement("button");
          gridItem.className = "grid-button";
          gridItem.dataset.row = i;
          gridItem.dataset.col = j;
          let cellValue = board[i][j];
          gridItem.textContent = cellValue;

          $(".grid-container").append(gridItem);

          if (i < board.length - 1 && board[i + 1][j] === 0) {
            gridItem.disabled = true;
          }
        }
      }
  }

  function coinFlip() {
    $(".scoreHuman").css("border-color", "#1973BC");
    $(".scoreComp").css("border-color", "#E7564D");
    console.log("coinFlip");
    let coinSide = Math.floor(Math.random() * 2) + 1;
    console.log("Player " + coinSide + "'s turn");

    if (coinSide === 1) {
       $(".scoreHuman").css("border-color", "#F3E3D8");
      humanPlayerTurn = true;
      console.log(compPlayerTurn1Done);
      $(".coin-flip-overlay").css("display", "block");
      $(".coin-flip-overlay").text("You go first");
      $(".grid-container").addClass("overlay");
      setTimeout(() => {
        $(".coin-flip-overlay").css("display", "none");
        $(".grid-container").removeClass("overlay");
      }, 1000);
    } else if (coinSide === 2) {
       $(".scoreComp").css("border-color", "#F3E3D8");
       $(".scoreHuman").css("border-color", "#1973BC");
      
      $(".coin-flip-overlay").css("display", "block");
     $(".coin-flip-overlay").text("Computer goes first");
      $(".grid-container").addClass("overlay");
      setTimeout(() => {
        $(".coin-flip-overlay").css("display", "none");
        $(".grid-container").removeClass("overlay");
      }, 1000);
      setTimeout(() => {
        compPlayerTurn1();
        compPlayerTurn1Done = true;
        humanPlayerTurn = true;
        $(".scoreComp").css("border-color", "#E7564D");
        $(".scoreHuman").css("border-color", "#F3E3D8");
      }, 1800);
    }
  }

  $(".grid-container").on("click", ".grid-button", function () {
    if (humanPlayerTurn === true) {
      let row = $(this).data("row");
      let col = $(this).data("col");
      handleButtonClick(row, col);
      $(".coinFlip").hide();
      humanPlayerTurn = false;

      checkBoard();
       $(".scoreHuman").css("border-color", "#1973BC");
       $(".scoreComp").css("border-color", "#F3E3D8");

      // move this to the handleButtonClick function and only make it run if check board returns stopComp false
      console.log(compPlayerTurn1Done);
      if (compPlayerTurn1Done === false && stopComp===false) {
        setTimeout(function () {
          console.log("CHECK INSIDE");
          compPlayerTurn1();

          console.log(compPlayerTurn1Done);
          compPlayerTurn1Done = true;
          humanPlayerTurn = true;
          checkBoard();
          $(".scoreHuman").css("border-color", "#F3E3D8");
          $(".scoreComp").css("border-color", "#E7564D");
        }, 800);
      } else if (compPlayerTurn1Done === true && stopComp === false) {
        setTimeout(function () {
          checkChains();
          console.log("CHECK INSIDE 2");
          humanPlayerTurn = true;
          checkBoard();
          $(".scoreHuman").css("border-color", "#F3E3D8");
          $(".scoreComp").css("border-color", "#E7564D");
        }, 800);
      }
      // move up to here
    }

    console.log("CHECK");
  });

  function compPlayerTurn1() {
    for (i = 0; i < board[5].length + 1; i++) {
      if (board[5][i] === 0) {
        compPlayerTurn1Options.push(i);
      }
    }

    let n = Math.floor(Math.random() * compPlayerTurn1Options.length);
    console.log("n EQUALS: "+n);
    let compTurn1Col = compPlayerTurn1Options[n];
    handleCompPlayerTurn(5, compTurn1Col);
    console.log(compTurn1Col);
  }

  function handleButtonClick(row, col) {
    if (board[row] && board[row][col] !== undefined) {
      board[row][col] = humanPlayer;
      let button = $(`.grid-button[data-row=${row}][data-col=${col}]`);
      button.text("1");
      button.css("background-color", "#1973BC");
      button.prop("disabled", true);

      if (row > 0) {
        let buttonAbove = $(
          `.grid-button[data-row=${row - 1}][data-col=${col}]`
        );
        buttonAbove.prop("disabled", false);
      }


    }
  }

  // in the cell identified in nextMove(), make the value of the cell = 2
  function handleCompPlayerTurn(row, col) {
    console.log(row);
    console.log(col);
    if (board[row] && board[row][col] !== undefined) {
      board[row][col] = 2;
      console.log("got here");
      let button = $(`.grid-button[data-row=${row}][data-col=${col}]`);
      button.text("2");
      button.css("background-color", "#E7564D");
      button.prop("disabled", true);

      if (row > 0) {
        let buttonAbove = $(
          `.grid-button[data-row=${row - 1}][data-col=${col}]`
        );
        buttonAbove.prop("disabled", false);
      }

    }

    startVert = [];
    startTLBR = [];
    startTRBL = [];
    startHor = [];

    minMovesObjectTLBR = {};
    minMovesObjectTRBL = {};
    minMovesObjectHor = {};
    minMovesObjectVert = {};
  }

  // NEW COMP PLAYER CODE

  // Check to see which starting disks with a value of 2 have the potential for a 4-disk chain in each direction (vert, hor, TRBL, TLBR).
  // Return the position (row, col) values of the valid 2-disks at the start of potential 4-disk chains for each direction

  function checkChains() {
    console.log("Viable starting positions");

    for (let i = board.length - 1; i >= 0; i--) {
      for (let j = 0; j < board[i].length; j++) {
        let countVert = 0;
        let countVert2Disks = 0;

        let countHor = 0;
        let countHor2Disks = 0;

        let countTLBR = 0;
        let countTLBR2Disks = 0;

        let countTRBL = 0;
        let countTRBL2Disks = 0;

        if (board[i][j] === 2) {
          for (let k = 1; k < 4; k++) {
            // Ensure indices are within array bounds
            let validVert = i - k >= 0;
            let validHor = j + k < board[i].length;
            let validTLBR = i - k >= 0 && j - k >= 0;
            let validTRBL = i - k >= 0 && j + k < board[i].length;

            // vertical check to see how many cells in chain = 0 or 2
            if (validVert && (board[i - k][j] === 0 || board[i - k][j] === 2)) {
              countVert++;
              if (board[i - k][j] === 2) {
                countVert2Disks++;
              }
            }

            // horizontal check to see how many cells in chain = 0 or 2
            if (validHor && (board[i][j + k] === 0 || board[i][j + k] === 2)) {
              countHor++;
              if (board[i][j + k] === 2) {
                countHor2Disks++;
              }
            }

            // TLBR check to see how many cells in chain = 0 or 2
            if (
              validTLBR &&
              (board[i - k][j - k] === 0 || board[i - k][j - k] === 2)
            ) {
              countTLBR++;
              if (board[i - k][j - k] === 2) {
                countTLBR2Disks++;
              }
            }

            // TRBL check to see how many cells in chain = 0 or 2
            if (
              validTRBL &&
              (board[i - k][j + k] === 0 || board[i - k][j + k] === 2)
            ) {
              countTRBL++;
              if (board[i - k][j + k] === 2) {
                countTRBL2Disks++;
              }
            }
          }
        }

        // Log the results, push to arrays based on direction

        if (countVert >= 3) {
          startVert.push({ row: i, col: j, twos: countVert2Disks, moves: 0 });

          console.log("vertical: " + i + " " + j);
        }
        if (countTLBR >= 3) {
          startTLBR.push({ row: i, col: j, twos: countTLBR2Disks, moves: 0 });
          console.log("TLBR: " + i + " " + j);
        }
        if (countTRBL >= 3) {
          startTRBL.push({ row: i, col: j, twos: countTRBL2Disks, moves: 0 });
          console.log("TRBL: " + i + " " + j);
        }
        if (countHor >= 3) {
          startHor.push({ row: i, col: j, twos: countHor2Disks, moves: 0 });

          console.log("horizontal: " + i + " " + j);
        }
      }
    }
    checkNextStartPosition();
  }

  // checks to see which direction requires the fewest moves to win
  // if the number of moves are equal, it prioritizes TRBL > TLBR and the direction already being worked on
  function checkNextStartPosition() {
    countMovesToWinTRBL();
    countMovesToWinTLBR();
    countMovesToWinVert();
    countMovesToWinHor();
    let movesTRBL = Infinity;
    let movesHor = Infinity;
    let movesTLBR = Infinity;
    let movesVert = Infinity;

    if (
      minMovesObjectTRBL.moves !== undefined &&
      minMovesObjectTRBL.moves != 0
    ) {
      movesTRBL = minMovesObjectTRBL.moves;
    }

    if (minMovesObjectHor.moves !== undefined && minMovesObjectHor != 0) {
      movesHor = minMovesObjectHor.moves;
    }

    if (minMovesObjectTLBR.moves !== undefined && minMovesObjectTLBR != 0) {
      movesTLBR = minMovesObjectTLBR.moves;
    }

    if (
      minMovesObjectVert.moves !== undefined &&
      minMovesObjectVert.moves != 0
    ) {
      movesVert = minMovesObjectVert.moves;
    }

    console.log(minMovesObjectHor.moves);
    let bestDirection = Math.min(movesTRBL, movesHor, movesTLBR, movesVert);
    console.log(bestDirection);

    if (bestDirection === movesVert) {
      console.log("VERT FEWEST MOVES: " + movesVert);
      turnCount++;
      turnDirectionTracker.push("vert");
      bestStartVert();
    } else if (bestDirection === movesHor) {
      console.log("HOR FEWEST MOVES: " + movesHor);
      turnCount++;
      turnDirectionTracker.push("hor");
      bestStartHor();
    } else if (bestDirection === movesTRBL) {
      console.log("TRBL FEWEST MOVES: " + movesTRBL);
      turnCount++;
      turnDirectionTracker.push("TRBL");
      bestStartTRBL();
    } else if (bestDirection === movesTLBR) {
      console.log("TLBR FEWEST MOVES: " + movesTLBR);
      turnCount++;
      turnDirectionTracker.push("TLBR");
      bestStartTLBR();
    }
  }

  // TRBL
  // for each valid 2-disk starting positiong, count the number of moves required to win with a TRBL from that disk
  // return the start cell object with the least moves for TRBL
  function countMovesToWinTRBL() {
    for (let m = 0; m < startTRBL.length; m++) {
      // let bestVert = Math.max();
      let x = startTRBL[m].row;
      let y = startTRBL[m].col;

      count0 = 0;
      count2 = 0;
      countFill = 0;

      // check for cells that = 0 or 2 in the triangle formed between start cell and cell where winning disk would be played

      for (i = 1; i < 4; i++) {
        if (x !== board.length - 1) {
          for (j = board.length - 1 - x; j > 0; j--) {
            if (board[x + j][y + i] === 0) {
              countFill++;
            }
          }
        } else if (board[x - i][y + i] === 0) {
          count0++;
        } else if (board[x - i][y + i] === 2) {
          count2++;
        }

        if (board[x][y + i] === 0) {
          countFill++;
        }
      }

      if (board[x - 1][y + 3] === 0) {
        countFill++;
      }
      if (board[x - 1][y + 2] === 0) {
        countFill++;
      }
      if (board[x - 2][y + 3] === 0) {
        countFill++;
      }
      let moves = count0 + countFill;
      startTRBL[m].moves = moves;

      console.log("Viable TRBL: ");
      console.log(startTRBL[m].moves);

      if (startTRBL.length !== 0) {
        minMovesObjectTRBL = startTRBL.reduce((min, current) => {
          return current.moves < min.moves ? current : min;
        });
      }

      console.log("Best TRBL: ");
      console.log(minMovesObjectTRBL);
    }
  }

  // identify the 2-disk starting position row and col values
  function bestStartTRBL() {
    let xNextMoveStartTRBL = minMovesObjectTRBL.row;
    let YNextMoveStartTRBL = minMovesObjectTRBL.col;
    nextMoveTRBL(xNextMoveStartTRBL, YNextMoveStartTRBL);
  }

  // based on the best 2-disk starting position, identify the best spot to put the next 2-disk
  function nextMoveTRBL(x, y) {
    let nextMoveRowTRBL = 0;
    let nextMoveColTRBL = 0;
    let foundMoveTRBL = false;

    for (i = 1; i < 4; i++) {
      if (x !== board.length - 1) {
        for (j = board.length - 1 - x; j > 0; j--) {
          if (
            board[x + j][y + i] === 0 &&
            (x + j === board.length - 1 || board[x + j + 1][y + i] !== 0)
          ) {
            nextMoveRowTRBL = x + j;
            nextMoveColTRBL = y + i;
            foundMoveTRBL = true;
            break;
          }
        }
      }
      if (
        board[x - i][y + i] === 0 &&
        (x - i === board.length - 1 || board[x - i + 1][y + i] !== 0)
      ) {
        nextMoveRowTRBL = x - i;
        nextMoveColTRBL = y + i;
        foundMoveTRBL = true;
        break;
      }
      if (
        board[x][y + i] === 0 &&
        (x === board.length - 1 || board[x + 1][y + i] !== 0)
      ) {
        nextMoveRowTRBL = x;
        nextMoveColTRBL = y + i;
        foundMoveTRBL = true;
        break;
      }
    }

    if (!foundMoveTRBL) {
      if (
        board[x - 1][y + 3] === 0 &&
        (x - 1 === board.length - 1 || board[x - 1 + 1][y + 3] !== 0)
      ) {
        nextMoveRowTRBL = x - 1;
        nextMoveColTRBL = y + 3;
      } else if (
        board[x - 1][y + 2] === 0 &&
        (x - 1 === board.length - 1 || board[x - 1 + 1][y + 2] !== 0)
      ) {
        nextMoveRowTRBL = x - 1;
        nextMoveColTRBL = y + 2;
      } else if (
        board[x - 2][y + 3] === 0 &&
        (x - 2 === board.length - 1 || board[x - 2 + 1][y + 3] !== 0)
      ) {
        nextMoveRowTRBL = x - 2;
        nextMoveColTRBL = y + 3;
      }
    }

    handleCompPlayerTurn(nextMoveRowTRBL, nextMoveColTRBL);
  }

  // TLBR
  // for each valid 2-disk starting positiong, count the number of moves required to win with a TLBR from that disk
  // return the start cell object with the least moves for TRBL
  function countMovesToWinTLBR() {
    for (let m = 0; m < startTLBR.length; m++) {
      // let bestVert = Math.max();
      let x = startTLBR[m].row;
      let y = startTLBR[m].col;

      count0 = 0;
      count2 = 0;
      countFill = 0;

      // check for cells that = 0 or 2 in the triangle formed between start cell and cell where winning disk would be played
      for (i = 1; i < 4; i++) {
        if (x !== board.length - 1) {
          for (j = board.length - 1 - x; j > 0; j--) {
            if (board[x + j][y - i] === 0) {
              countFill++;
              console.log(x + j + ", " + (y - i));
            }
          }
        }

        if (board[x - i][y - i] === 0) {
          count0++;
          console.log(x - i + ", " + (y - i));
        }

        if (board[x - i][y - i] === 2) {
          count2++;
          console.log(x - i + ", " + (y - i));
        }

        if (board[x][y - i] === 0) {
          countFill++;
          console.log(x + ", " + (y - i));
        }
      }

      if (board[x - 1][y - 3] === 0) {
        countFill++;
        console.log(x - 1 + ", " + (y - 3));
      }
      if (board[x - 1][y - 2] === 0) {
        countFill++;
        console.log(x - 1 + ", " + (y - 2));
      }
      if (board[x - 2][y - 3] === 0) {
        countFill++;
        console.log(x - 2 + ", " + (y - 3));
      }
      let moves = count0 + countFill;
      startTLBR[m].moves = moves;

      console.log("Viable TLBR: ");
      console.log(startTLBR);
    }

    if (startTLBR.length !== 0) {
      minMovesObjectTLBR = startTLBR.reduce((min, current) => {
        return current.moves < min.moves ? current : min;
      });
    }

    console.log("Best TLBR: ");
    console.log(minMovesObjectTLBR);
  }

  // identify the 2-disk starting position row and col values
  function bestStartTLBR() {
    let xNextMoveStartTLBR = minMovesObjectTLBR.row;
    let YNextMoveStartTLBR = minMovesObjectTLBR.col;
    nextMoveTLBR(xNextMoveStartTLBR, YNextMoveStartTLBR);

    // handleCompPlayerTurn(minMovesObject.row-1, minMovesObject.col+1);
  }

  // based on the best 2-disk starting position, identify the best spot to put the next 2-disk
  function nextMoveTLBR(x, y) {
    let nextMoveRowTLBR = 0;
    let nextMoveColTLBR = 0;
    let foundMoveTLBR = false;

    for (i = 1; i < 4; i++) {
      if (x !== board.length - 1) {
        for (j = board.length - 1 - x; j > 0; j--) {
          if (
            board[x + j][y - i] === 0 &&
            (x + j === board.length - 1 || board[x + j + 1][y - i] !== 0)
          ) {
            nextMoveRowTLBR = x + j;
            nextMoveColTLBR = y - i;
            foundMoveTLBR = true;
            break;
          }
        }
      }
      if (
        board[x - i][y - i] === 0 &&
        (x - i === board.length - 1 || board[x - i + 1][y - i] !== 0)
      ) {
        nextMoveRowTLBR = x - i;
        nextMoveColTLBR = y - i;
        foundMoveTLBR = true;
        break;
      }
      if (
        board[x][y - i] === 0 &&
        (x === board.length - 1 || board[x + 1][y - i] !== 0)
      ) {
        nextMoveRowTLBR = x;
        nextMoveColTLBR = y - i;
        foundMoveTLBR = true;
        break;
      }
    }

    if (!foundMoveTLBR) {
      if (
        board[x - 1][y - 3] === 0 &&
        (x - 1 === board.length - 1 || board[x - 1 + 1][y - 3] !== 0)
      ) {
        nextMoveRowTLBR = x - 1;
        nextMoveColTLBR = y - 3;
      } else if (
        board[x - 1][y - 2] === 0 &&
        (x - 1 === board.length - 1 || board[x - 1 + 1][y - 2] !== 0)
      ) {
        nextMoveRowTLBR = x - 1;
        nextMoveColTLBR = y - 2;
      } else if (
        board[x - 2][y - 3] === 0 &&
        (x - 2 === board.length - 1 || board[x - 2 + 1][y - 3] !== 0)
      ) {
        nextMoveRowTLBR = x - 2;
        nextMoveColTLBR = y - 3;
      } else {
      }
    }

    handleCompPlayerTurn(nextMoveRowTLBR, nextMoveColTLBR);
  }

  // HORIZONTAL
  // for each valid 2-disk starting positiong, count the number of moves required to win with a HOR from that disk
  // return the start cell object with the least moves for HOR
  function countMovesToWinHor() {
    for (let m = 0; m < startHor.length; m++) {
      let x = startHor[m].row;
      let y = startHor[m].col;

      countFill = 0;
      count0 = 0;
      count2 = 0;

      for (i = 1; i < 4; i++) {
        if (x !== board.length - 1) {
          for (j = board.length - 1 - x; j > 0; j--) {
            if (board[x + j][y + i] === 0) {
              countFill++;
              console.log(x + j + ", " + (y + i));
            }
          }
        }
        if (board[x][y + i] === 0) {
          count0++;
          console.log(x + ", " + (y + i));
        }
        if (board[x][y + i] === 2) {
          count2++;
        }
      }

      let moves = count0 + countFill;
      startHor[m].moves = moves;

      console.log("Viable hor: ");
      console.log(startHor);
    }

    if (startHor.length !== 0) {
      minMovesObjectHor = startHor.reduce((min, current) => {
        return current.moves < min.moves ? current : min;
      });
    }

    console.log("Best hor: ");
    console.log(minMovesObjectHor);
  }

  // identify the 2-disk starting position row and col values
  function bestStartHor() {
    let xNextMoveStartHor = minMovesObjectHor.row;
    let YNextMoveStartHor = minMovesObjectHor.col;
    nextMoveHor(xNextMoveStartHor, YNextMoveStartHor);
  }

  // based on the best 2-disk starting position, identify the best spot to put the next 2-disk
  function nextMoveHor(x, y) {
    let nextMoveRowHor = 0;
    let nextMoveColHor = 0;
    let foundMoveHor = false;

    for (i = 1; i < 4; i++) {
      if (x !== board.length - 1) {
        for (j = board.length - 1 - x; j > 0; j--) {
          if (
            board[x + j][y + i] === 0 &&
            (x + j === board.length - 1 || board[x + j + 1][y + i] !== 0)
          ) {
            nextMoveRowHor = x + j;
            nextMoveColHor = y + i;
            console.log(nextMoveRowHor);
            console.log(nextMoveColHor);
            foundMoveHor = true;
            break;
          }
        }
      }

      if (
        board[x][y + i] === 0 &&
        (x === board.length - 1 || board[x + 1][y + i] !== 0)
      ) {
        nextMoveRowHor = x;
        nextMoveColHor = y + i;
        foundMoveHor = true;
        break;
      }
    }
    handleCompPlayerTurn(nextMoveRowHor, nextMoveColHor);
  }

  // VERTICAL
  // for each valid 2-disk starting positiong, count the number of moves required to win with a HOR from that disk
  // return the start cell object with the least moves for HOR
  function countMovesToWinVert() {
    console.log(minMovesObjectVert);

    for (let m = 0; m < startVert.length; m++) {
      let x = startVert[m].row;
      let y = startVert[m].col;

      count0 = 0;
      count2 = 0;

      for (i = 1; i < 4; i++) {
        if (board[x - i][y] === 0) {
          count0++;
        } else if (board[x - i][y] === 2) {
          count2++;
        }
      }
      let moves = count0;
      startVert[m].moves = moves;

      console.log("Viable vert: ");
      console.log(startVert);
    }

    if (startVert.length !== 0) {
      minMovesObjectVert = startVert.reduce((min, current) => {
        return current.moves < min.moves ? current : min;
      });
    }
    console.log("Best vert: ");
    console.log(minMovesObjectVert);
  }

  // identify the 2-disk starting position row and col values
  function bestStartVert() {
    let xNextMoveStartVert = minMovesObjectVert.row;
    let YNextMoveStartVert = minMovesObjectVert.col;
    nextMoveVert(xNextMoveStartVert, YNextMoveStartVert);
    console.log(xNextMoveStartVert + "," + YNextMoveStartVert);
  }

  // based on the best 2-disk starting position, identify the best spot to put the next 2-disk
  function nextMoveVert(x, y) {
    let nextMoveRowVert = 0;
    let nextMoveColVert = 0;
    let foundMoveVert = false;

    for (i = 1; i < 4; i++) {
      console.log(x - i);
      if (board[x - i][y] === 0) {
        nextMoveRowVert = x - i;
        nextMoveColVert = y;
        foundMoveVert = true;
        break;
      }
    }
    handleCompPlayerTurn(nextMoveRowVert, nextMoveColVert);
  }

  // CHECK BOARD

  function checkBoard() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j + 3 < board[i].length; j++) {
        // horizontal

        if (
          board[i][j] === board[i][j + 1] &&
          board[i][j] === board[i][j + 2] &&
          board[i][j] === board[i][j + 3]
        ) {
          // console.log(i + " " + (j + 3));

          if (board[i][j] === humanPlayer) {
            return humanWin();
          } else if (board[i][j] === compPlayer) {
            return compWin();
          }
        }
      }
    }

    for (i = 0; i + 3 < board.length; i++) {
      for (j = 0; j < board[i].length; j++) {
        // vertical

        if (
          board[i][j] === board[i + 1][j] &&
          board[i][j] === board[i + 2][j] &&
          board[i][j] === board[i + 3][j]
        ) {
          // console.log(i + 3 + " " + j);

          if (board[i][j] === humanPlayer) {
            return humanWin();
          } else if (board[i][j] === compPlayer) {
            return compWin();
          }
        }
      }
    }

    for (i = 0; i + 3 < board.length; i++) {
      for (j = 0; j + 3 < board[i].length; j++) {
        // top left diagonal

        if (
          board[i][j] === board[i + 1][j + 1] &&
          board[i][j] === board[i + 2][j + 2] &&
          board[i][j] === board[i + 3][j + 3]
        ) {
          // console.log(i + 3 + " " + (j + 3));

          if (board[i][j] === humanPlayer) {
            return humanWin();
          } else if (board[i][j] === compPlayer) {
            return compWin();
          }
        }
      }
    }

    for (i = 0; i + 3 < board.length; i++) {
      for (j = board[i].length - 1; j - 3 >= 0; j--) {
        // top right diagonal

        if (
          board[i][j] === board[i + 1][j - 1] &&
          board[i][j] === board[i + 2][j - 2] &&
          board[i][j] === board[i + 3][j - 3]
        ) {
          if (board[i][j] === humanPlayer) {
            return humanWin();
          } else if (board[i][j] === compPlayer) {
            return compWin();
          }
        }
      }
    }
  }

  function humanWin() {
    humanPlayerWins++;

    $(".scoreHuman").css("border-color", "#1973BC");
    $(".scoreComp").css("border-color", "#E7564D");
    
    $(".restart-overlay").css("display", "block");

    $("#win").css("display", "block");

    
    return gameEnd();
  }

  function compWin() {
    compPlayerWins++;
    $(".restart-overlay").css("display", "block");
    
    $("#lose").css("display", "block");

    
    return gameEnd();
  }

  function gameEnd() {
    stopComp = true;
    $(".scoreComp").text("COMPUTER " + compPlayerWins);
    $(".scoreHuman").text("YOU " + humanPlayerWins);
    $(":button.grid-button").prop("disabled", true);
    $(":button#restart").show();
    $(".grid-container").addClass("overlay");
  }
});