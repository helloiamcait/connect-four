
  // let board = [
  //   [0, 1, 0, 0, 0, 0, 0], // [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6]

  //   [0, 0, 1, 0, 0, 2, 0], // [1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6]

  //   [0, 0, 0, 1, 2, 0, 1], // [2,0], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6]

  //   [0, 0, 0, 2, 1, 0, 1], // [3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6]

  //   [0, 0, 2, 2, 2, 2, 1], // [4,0], [4,1], [4,2], [4,3], [4,4], [4,5], [4,6]

  //   [0, 1, 1, 1, 1, 0, 1], // [5,0], [5,1], [5,2], [5,3], [5,4], [5,5], [5,6]
  // ];

  let board = Array(6)
    .fill(0)
    .map(() => Array(7).fill(0));

  console.log(board);

  let count = 0;
  let colCheckNum = 5;
  let rowCheckNum = 6;

  let humanPlayer = 1;
  let compPlayer = 2;

  $(".grid-container").hide();

  $("#start").on("click", function () {
    generateBoard();
    compPlayerTurn1();
  });
  

  function generateBoard() {
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

  $(".grid-container").on("click", ".grid-button", function () {
    let row = $(this).data("row");
    let col = $(this).data("col");
    handleButtonClick(row, col);

    setTimeout(function () {
      compPlayerTurn();
    }, 800);
  });

  function compPlayerTurn1() {
    console.log("working");
    let n = Math.floor(Math.random() * 7);
    handleCompPlayerTurn(5, n);
  }

  function handleButtonClick(row, col) {
    if (board[row] && board[row][col] !== undefined) {
      board[row][col] = humanPlayer;
      let button = $(`.grid-button[data-row=${row}][data-col=${col}]`);
      button.text("1");
      button.css("background-color", "yellow");
      button.prop("disabled", true);

      if (row > 0) {
        let buttonAbove = $(
          `.grid-button[data-row=${row - 1}][data-col=${col}]`
        );
        buttonAbove.prop("disabled", false);
      }

      console.log(board);
      checkBoard();
      console.log(checkBoard());
    }
  }

  function handleCompPlayerTurn(row, col) {
    if (board[row] && board[row][col] !== undefined) {
      board[row][col] = compPlayer;
      let button = $(`.grid-button[data-row=${row}][data-col=${col}]`);
      button.text("2");
      button.css("background-color", "red");
      button.prop("disabled", true);

      if (row > 0) {
        let buttonAbove = $(
          `.grid-button[data-row=${row - 1}][data-col=${col}]`
        );
        buttonAbove.prop("disabled", false);
      }

      console.log(board);
      checkBoard();
      console.log(checkBoard());
    }
  }

  //horizontal
  

  function compPlayerTurn() {

    let countOpenCellsHor = 1;    
    let countOpenCellsLeft = 1;
    let countOpenCellsRight = 1;
    let countOpenCellsTL = 1;
    let countOpenCellsTR = 1;
    let countOpenCellsVert = 1;
   
    for (i = board.length - 1; i >= 0; i--) {
      for (j = 0; j < board[i].length; j++) {
        
        if (board[i][j] === 2) {
          // count cells with 0 up
          for (u = 1; u < i + 1; u++) {
            if (board[i - u][j] === 0) {
              countOpenCellsVert++;
              if (countOpenCellsVert > 0) {
                let urow = i - 1;
                let ucol = j;
                if (urow === board.length - 1 || board[urow + 1][ucol] !== 0) {
                  return handleCompPlayerTurn(urow, ucol);
                }
              }
            } else if (board[i - u][j] !== 0) {
              console.log(i + " " + j);
              break;
            }
          }
          

          // count cells with 0 to the left
          for (let l = 1, u = 1; l < j + 1, u < i + 1; l++, u++) {
            if (board[i][j - l] === 0) {
              countOpenCellsLeft++;
              if (countOpenCellsLeft > 0) {
                let lrow = i;
                let lcol = j - 1;
                if (lrow === board.length - 1 || board[lrow + 1][lcol] !== 0) {
                  return handleCompPlayerTurn(lrow, lcol);
                }
              }
            } else if (board[i][j - l] !== 0) {
              console.log(i + " " + j);
              break;
            }
          }

          // count cells with 0 to the right
          for (let r = 1, u = 1; r < board[i].length, u < i + 1; r++, u++) {
            if (board[i][j + r] === 0) {
              countOpenCellsRight++;
              if (countOpenCellsRight > 0) {
                let rrow = i;
                let rcol = j + 1;
                if (rrow === board.length - 1 || board[rrow + 1][rcol] !== 0) {
                  return handleCompPlayerTurn(rrow, rcol);
                }
              }
            } else if (board[i][j + r] !== 0) {
              console.log(i + " " + j);
              break;
            }
          }
        }

        // count cells with 0 up & to the left
          for (l = 1, u = 1; l < j + 1, u < i + 1; l++, u++) {
            if (board[i - u][j - l] === 0) {
              countOpenCellsTL++;
              if (countOpenCellsTL > 0) {
                let ulrow = i - 1;
                let ulcol = j - 1;
                if (
                  ulrow === board.length - 1 ||
                  board[ulrow + 1][ulcol] !== 0
                ) {
                  return handleCompPlayerTurn(ulrow, ulcol);
                }
              }
            } else if (board[i - u][j - l] !== 0) {
              console.log(i + " " + j);
              break;
            }
          }

          // count cells with 0 up & to the right
          for (let r = 1, u = 1; r < board[i].length, u < i + 1; r++, u++) {
            if (board[i - u][j + r] === 0) {
              countOpenCellsTR++;
              if (countOpenCellsTR > 0) {
                let urrow = i - 1;
                let urcol = j + 1;
                if (
                  urrow === board.length - 1 ||
                  board[urrow + 1][urcol] !== 0
                ) {
                  return handleCompPlayerTurn(urrow, urcol);
                }
              }
            } else if (board[i - u][j + r] !== 0) {
              console.log(i + " " + j);
              break;
            }
          }
        
        

      }
        

    }

    

    console.log("horizontal: " + countOpenCellsHor);
    console.log("diagonal tl: " + countOpenCellsTL);
    console.log("diagonal tr:" + countOpenCellsTR);
    console.log("vertical:" + countOpenCellsVert);
    
    
    
  }

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
            $("h1").text("Player 1 Wins");
            return "Player 1 Wins (horizontal)";
          } else if (board[i][j] === compPlayer) {
            $("h1").text("Player 2 Wins");
            return "Player 2 Wins (horizontal)";
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
            $("h1").text("Player 1 Wins");
            return "Player 1 Wins (vertical)";
          } else if (board[i][j] === compPlayer) {
            $("h1").text("Player 2 Wins");
            return "Player 2 Wins (vertical)";
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
            $("h1").text("Player 1 Wins");
            return "Player 1 Wins (top left diagonal)";
          } else if (board[i][j] === compPlayer) {
            $("h1").text("Player 2 Wins");
            return "Player 2 Wins (top left diagonal)";
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
            $("h1").text("Player 1 Wins");
            return "Player 1 Wins (top right diagonal)";
          } else if (board[i][j] === compPlayer) {
            $("h1").text("Player 2 Wins");
            return "Player 2 Wins (top right diagonal)";
          }
        }
      }
    }
  }


// add a game start function

// add a game over function