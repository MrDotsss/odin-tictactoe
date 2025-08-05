const boardGrid = document.querySelector(".board-grid");
const startMenuDialog = document.querySelector("#start-menu");

startMenuDialog.showModal();

function createBoard() {
  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const mapToBoard = (coordinate, value) => {
    if (getMatrixValue(coordinate) !== 0) {
      const matrixValue = getMatrixValue(coordinate);
      throw Error(`Coordinate ${coordinate} already has a value of 
            ${matrixValue}`);
    }

    matrix[coordinate[0]][coordinate[1]] = value;
  };

  const getMatrixValue = ([x, y]) => matrix[x][y];
  const checkWinner = () => {
    //check all rows
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].every((val) => val === val)) {
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

  return { matrix, mapToBoard, getMatrixValue, checkWinner };
}

function createPlayer(playerName, marker) {
  let score = 0;

  const name = () => playerName;
  const mark = () => marker;
  const resetScore = () => (score = 0);
  const incrementScore = () => score++;
  const currentScore = () => score;

  return {
    name,
    mark,
    incrementScore,
    resetScore,
    currentScore,
  };
}

function gridUI() {
  const cellList = [];

  const generateCells = () => {
    boardGrid.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add(".board-cell");
        cell.dataset.coordinate = [i, j];
        cellList.push(cell);
        boardGrid.appendChild(cell);
      }
    }
  };

  const getCell = ([x, y]) => {
    return cellList.find((cell) => cell == [x, y]);
  };

  const getCellList = () => cellList;

  const applyMark = ([x, y], mark) => {
    const cell = getCell([x, y]);

    if (cell) {
      const marker = document.createElement("div");
      marker.classList.add(".marker");
      marker.textContent = mark;
    }
  };

  return {
    generateCells,
    getCell,
    getCellList,
    applyMark,
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    createBoard,
    createPlayer,
  };
}
