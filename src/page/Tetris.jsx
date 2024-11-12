import React, { useState, useEffect, useCallback } from "react";
import NavbarUser from "../feature/NavbarUser"; // Import Navbar sesuai permintaan

const ROWS = 20;
const COLS = 10;
const INITIAL_POSITION = { row: 0, col: 4 };

const TETROMINOS = [
  { shape: [[1, 1], [1, 1]], color: "bg-blue-500" }, // O shape
  { shape: [[1, 0], [1, 0], [1, 1]], color: "bg-green-500" }, // L shape
  { shape: [[0, 1], [0, 1], [1, 1]], color: "bg-red-500" }, // J shape
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-yellow-500" }, // S shape
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-orange-500" }, // Z shape
  { shape: [[1, 1, 1], [0, 1, 0]], color: "bg-purple-500" }, // T shape
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-500" }, // I shape
];

const TetrisGame = () => {
  const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [currentPosition, setCurrentPosition] = useState(INITIAL_POSITION);
  const [currentTetromino, setCurrentTetromino] = useState(TETROMINOS[0]);
  const [score, setScore] = useState(0);

  const randomTetromino = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    return TETROMINOS[randomIndex];
  }, []);

  const updateGrid = (tetromino, position) => {
    const newGrid = grid.map(row => row.slice());
    tetromino.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          newGrid[position.row + rowIndex][position.col + colIndex] = tetromino.color;
        }
      });
    });
    return newGrid;
  };

  const moveDown = () => {
    setCurrentPosition(prev => {
      const newPosition = { row: prev.row + 1, col: prev.col };
      if (checkCollision(currentTetromino, newPosition)) {
        setGrid(prevGrid => {
          const updatedGrid = updateGrid(currentTetromino, prev);
          clearFullRows(updatedGrid);
          return updatedGrid;
        });
        setCurrentTetromino(randomTetromino());
        return INITIAL_POSITION;
      }
      return newPosition;
    });
  };

  const moveLeft = () => {
    setCurrentPosition(prev => {
      const newPosition = { row: prev.row, col: prev.col - 1 };
      if (!checkCollision(currentTetromino, newPosition)) {
        return newPosition;
      }
      return prev;
    });
  };

  const moveRight = () => {
    setCurrentPosition(prev => {
      const newPosition = { row: prev.row, col: prev.col + 1 };
      if (!checkCollision(currentTetromino, newPosition)) {
        return newPosition;
      }
      return prev;
    });
  };

  const rotateTetromino = () => {
    const rotatedShape = currentTetromino.shape[0].map((_, index) =>
      currentTetromino.shape.map(row => row[index])
    ).reverse(); // To rotate the matrix 90 degrees counterclockwise

    const rotatedTetromino = { shape: rotatedShape, color: currentTetromino.color };
    if (!checkCollision(rotatedTetromino, currentPosition)) {
      setCurrentTetromino(rotatedTetromino);
    }
  };

  const checkCollision = (tetromino, position) => {
    for (let row = 0; row < tetromino.shape.length; row++) {
      for (let col = 0; col < tetromino.shape[row].length; col++) {
        if (
          tetromino.shape[row][col] &&
          (position.row + row >= ROWS ||
            position.col + col < 0 ||
            position.col + col >= COLS ||
            grid[position.row + row][position.col + col])
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const clearFullRows = (grid) => {
    const newGrid = grid.filter(row => row.includes(null));
    const filledRows = ROWS - newGrid.length;
    setScore(prev => prev + filledRows * 100);
    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(null));
    }
    setGrid(newGrid);
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowUp":
        rotateTetromino();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    setCurrentTetromino(randomTetromino());

    const interval = setInterval(() => {
      moveDown();
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentTetromino]);

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <NavbarUser />
      <h1 className="text-white text-3xl mb-4">Tetris Game</h1>
      <div className="flex justify-between w-full max-w-md mb-4">
        <h2 className="text-white">Score: {score}</h2>
      </div>
      <div className="grid grid-cols-10 gap-1 border-4 border-gray-700 p-1">
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-6 h-6 ${currentTetromino &&
                rowIndex >= currentPosition.row &&
                colIndex >= currentPosition.col &&
                rowIndex < currentPosition.row + currentTetromino.shape.length &&
                colIndex < currentPosition.col + currentTetromino.shape[0].length &&
                currentTetromino.shape[rowIndex - currentPosition.row]?.[colIndex - currentPosition.col]
                ? currentTetromino.color
                : "bg-gray-900"}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TetrisGame;
 