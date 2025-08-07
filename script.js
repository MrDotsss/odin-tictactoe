const boardGrid = document.querySelector(".board-grid");
const startMenuDialog = document.querySelector("#start-menu");
const dialogForm = document.querySelector(".dialog-form");

startMenuDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
  }
});

//#region Gameplay
startMenuDialog.showModal();

dialogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startMenuDialog.close();

  StartGame();
});

function StartGame() {
  const playerOneInput = document.querySelector("#player-one");
  const playerTwoInput = document.querySelector("#player-two");
  const playerOneName = document.querySelector("#player-one-name");
  const playerTwoName = document.querySelector("#player-two-name");
  const playerProfiles = document.querySelectorAll(".player-profile");
  const turnMessage = document.querySelector("#turn-message");
  playerOneName.textContent = `${playerOneInput.value} ✖️`;
  playerTwoName.textContent = `${playerTwoInput.value} ⭕`;

  const players = [
    createPlayer(playerOneInput.value, "✖️"),
    createPlayer(playerTwoInput.value, "⭕"),
  ];

  for (let i = 0; i < players.length; i++) {
    playerProfiles[i].dataset.playerId = players[i].id;
  }

  let counter = 0;

  turnMessage.textContent = players[0].name + "✖️'s Turn";
  const gameBoard = createBoard();
  const ui = gridUI();

  ui.generateCells();

  boardGrid.addEventListener("click", boardMap);

  function boardMap(event) {
    if (!event.target.dataset.coordinate) {
      return;
    }

    const coordinate = event.target.dataset.coordinate;
    const newCoord = (function () {
      const coord = coordinate.split(",");
      return coord.map((num) => parseInt(num));
    })(coordinate);

    const player = players[counter % 2];
    turnMessage.textContent =
      (counter % 2 === 0 ? players[1].name + " ⭕" : players[0].name + " ✖️") + "'s Turn";
    if (gameBoard.mapToBoard(newCoord, player.mark)) {
      ui.applyMark(newCoord, player.mark);
      counter++;

      const win = gameBoard.checkWinner();

      if (win !== null) {
        const resultOverlay = document.querySelector(".result-overlay");
        const rematchBtn = document.querySelector(
          ".result-overlay .rematch-btn"
        );
        const restartBtn = document.querySelector(".restart-btn");
        restartBtn.addEventListener("click", (e) => {
          location.reload();
        });

        const h1 = document.querySelector(".result-overlay h1");
        if (win === 0) {
          h1.textContent = "DRAW";
        } else {
          h1.textContent = `${player.name} Wins!`;
          player.incrementScore();

          const pElement = document.querySelector(
            `[data-player-id="${player.id}"] h2`
          );

          pElement.textContent += player.mark;

          for (let i = 0; i < win.length; i++) {
            ui.colorCell(win[i]);
          }
        }

        if (player.currentScore() >= 3) {
          rematchBtn.style.display = "none";
        }

        resultOverlay.style.display = "flex";

        rematchBtn.addEventListener("click", (e) => {
          ui.generateCells();
          gameBoard.clearBoard();
          rematchBtn.removeEventListener("click", this);
          resultOverlay.style.display = "none";
        });
      }
    }
  }
}

//#endregion

//#region Utilities
function createBoard() {
  let matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const clearBoard = () => {
    matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  };

  const mapToBoard = (coordinate, value) => {
    if (getMatrixValue(coordinate) !== 0) {
      return false;
    }

    matrix[coordinate[0]][coordinate[1]] = value;
    return true;
  };

  const getMatrixValue = ([x, y]) => matrix[x][y];
  const checkWinner = () => {
    //check all rows
    for (let i = 0; i < matrix.length; i++) {
      if (
        matrix[i].every((val) => val === "⭕") ||
        matrix[i].every((val) => val === "✖️")
      ) {
        return [
          [i, 0],
          [i, 1],
          [i, 2],
        ];
      }
    }

    //check all columns
    for (let i = 0; i < matrix.length; i++) {
      if (
        getMatrixValue([0, i]) === getMatrixValue([1, i]) &&
        getMatrixValue([1, i]) === getMatrixValue([2, i]) &&
        getMatrixValue([0, i]) !== 0
      ) {
        return [
          [0, i],
          [1, i],
          [2, i],
        ];
      }
    }

    //check diagonal \
    if (
      getMatrixValue([0, 0]) === getMatrixValue([1, 1]) &&
      getMatrixValue([1, 1]) === getMatrixValue([2, 2]) &&
      getMatrixValue([0, 0]) !== 0
    ) {
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
    }

    //check diagonal /
    if (
      getMatrixValue([0, 2]) === getMatrixValue([1, 1]) &&
      getMatrixValue([1, 1]) === getMatrixValue([2, 0]) &&
      getMatrixValue([0, 2]) !== 0
    ) {
      return [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
    }

    //draw
    if (!matrix.flat().includes(0)) {
      return 0;
    }

    //default null
    return null;
  };

  return { matrix, mapToBoard, clearBoard, getMatrixValue, checkWinner };
}

function createPlayer(playerName, marker) {
  let score = 0;

  const id = crypto.randomUUID();
  const name = playerName;
  const mark = marker;
  const resetScore = () => (score = 0);
  const incrementScore = () => score++;
  const currentScore = () => score;

  return {
    id,
    name,
    mark,
    incrementScore,
    resetScore,
    currentScore,
  };
}

function gridUI() {
  const cellList = [];

  const generateCells = function () {
    boardGrid.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      cellList.push([]);
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.dataset.coordinate = [i, j];
        cellList[i][j] = cell;
        boardGrid.appendChild(cell);
      }
    }
  };

  const getCell = ([x, y]) => {
    return cellList[x][y];
  };

  const getCellList = () => cellList;

  const applyMark = ([x, y], mark) => {
    const cell = getCell([x, y]);

    if (cell) {
      const marker = document.createElement("div");
      marker.classList.add("marker");
      marker.textContent = mark;
      cell.appendChild(marker);
    }
  };

  const colorCell = ([x, y]) => {
    const cell = getCell([x, y]);

    if (cell) {
      cell.classList.add("win");
    }
  };

  return {
    generateCells,
    getCell,
    getCellList,
    applyMark,
    colorCell,
  };
}

//#endregion

if (typeof module !== "undefined") {
  module.exports = {
    createBoard,
    createPlayer,
  };
}
