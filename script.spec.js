const { createBoard, createPlayer } = require("./script"); // replace with your actual file path
describe("createPlayer()", () => {
  test("creates a player with name and marker", () => {
    const player = createPlayer("Alice", "✖️");

    expect(player.name).toBe("Alice");
    expect(player.mark).toBe("✖️");
    expect(player.currentScore()).toBe(0);
    expect(typeof player.id).toBe("string");
  });

  test("increments and resets score", () => {
    const player = createPlayer("Bob", "⭕");

    player.incrementScore();
    player.incrementScore();
    expect(player.currentScore()).toBe(2);

    player.resetScore();
    expect(player.currentScore()).toBe(0);
  });
});

describe("createBoard()", () => {
  let board;

  beforeEach(() => {
    board = createBoard();
  });

  test("starts with empty matrix", () => {
    expect(board.matrix).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test("mapToBoard() places value if empty", () => {
    const result = board.mapToBoard([0, 0], "✖️");
    expect(result).toBe(true);
    expect(board.getMatrixValue([0, 0])).toBe("✖️");
  });

  test("mapToBoard() fails if cell is taken", () => {
    board.mapToBoard([1, 1], "⭕");
    const result = board.mapToBoard([1, 1], "✖️");
    expect(result).toBe(false);
  });

  test("checkWinner() detects row win", () => {
    board.mapToBoard([0, 0], "✖️");
    board.mapToBoard([0, 1], "✖️");
    board.mapToBoard([0, 2], "✖️");
    expect(board.checkWinner()).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("checkWinner() detects column win", () => {
    board.mapToBoard([0, 1], "⭕");
    board.mapToBoard([1, 1], "⭕");
    board.mapToBoard([2, 1], "⭕");
    expect(board.checkWinner()).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
  });

  test("checkWinner() detects diagonal win (\\)", () => {
    board.mapToBoard([0, 0], "✖️");
    board.mapToBoard([1, 1], "✖️");
    board.mapToBoard([2, 2], "✖️");
    expect(board.checkWinner()).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
  });

  test("checkWinner() detects diagonal win (/)", () => {
    board.mapToBoard([0, 2], "⭕");
    board.mapToBoard([1, 1], "⭕");
    board.mapToBoard([2, 0], "⭕");
    expect(board.checkWinner()).toEqual([
      [0, 2],
      [1, 1],
      [2, 0],
    ]);
  });

  test("checkWinner() detects draw", () => {
    const moves = [
      [0, 0, "✖️"],
      [0, 1, "⭕"],
      [0, 2, "✖️"],
      [1, 0, "✖️"],
      [1, 1, "⭕"],
      [1, 2, "✖️"],
      [2, 0, "⭕"],
      [2, 1, "✖️"],
      [2, 2, "⭕"],
    ];

    moves.forEach(([x, y, mark]) => board.mapToBoard([x, y], mark));
    expect(board.checkWinner()).toBe(0); // Draw
  });

  test("checkWinner() returns null when no winner and not draw", () => {
    board.mapToBoard([0, 0], "✖️");
    board.mapToBoard([1, 1], "⭕");
    expect(board.checkWinner()).toBe(null);
  });

  test("clearBoard() resets the board", () => {
    board.mapToBoard([0, 0], "✖️");
    board.clearBoard();
    expect(board.matrix).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });
});
