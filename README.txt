          const gridItem = document.createElement("button");
          gridItem.className = "grid-button";
          gridItem.dataset.row = i;
          gridItem.dataset.col = j;
          let cellValue = board[i][j];
          gridItem.textContent = cellValue;

          $(".grid-container").append(gridItem);
