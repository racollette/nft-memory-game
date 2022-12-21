import React, { useMemo, useState } from "react";
import "../App.css";
import { fetchTiles } from "../hooks/fetchTiles";

type Tile = {
  row: number;
  col: number;
};

type GameBoardProps = {
  tiles: string[][];
  imageBucket: string;
  guesses: number;
};

const cleanBoard = (board: string[][]) =>
  new Array(board.length)
    .fill("")
    .map(() => new Array(board[0].length).fill(false));

export const Gameboard = ({ tiles, imageBucket, guesses }: GameBoardProps) => {
  const RANDOM_IMPOSTOR = useMemo(() => Math.ceil(Math.random() * 9), []);
  const [paused, setPaused] = useState<boolean>(false);
  const [board, setBoard] = useState(tiles);
  const [guessesRemaining, setGuessesRemaining] = useState<number>(guesses);
  const [correctGuesses, setCorrectGuesses] = useState<number>(0);
  const [gameOver, setGameOver] = useState<string | undefined>();
  const [revealedBoard, setRevealedBoard] = useState(cleanBoard(board));

  const [previousClick, setPreviousClick] = useState<Tile | undefined>();

  const handleCardClick = (rowIndex: number, colIndex: number) => {
    if (gameOver) return;
    if (revealedBoard[rowIndex][colIndex] === true) return;
    const clickedTile = board[rowIndex][colIndex];
    const newRevealedBoard = [...revealedBoard];
    newRevealedBoard[rowIndex][colIndex] = true;
    setRevealedBoard(newRevealedBoard);

    if (previousClick) {
      const previousClickTile = board[previousClick.row][previousClick.col];
      // second click
      if (previousClickTile !== clickedTile) {
        setPaused(true);
        setTimeout(() => {
          newRevealedBoard[rowIndex][colIndex] = false;
          newRevealedBoard[previousClick.row][previousClick.col] = false;
          setRevealedBoard([...newRevealedBoard]);
          setPaused(false);
        }, 1500);
        if (guessesRemaining > 0) setGuessesRemaining(guessesRemaining - 1);
        if (guessesRemaining === 1) setGameOver("loss");
      } else {
        setCorrectGuesses(correctGuesses + 1);
        if (correctGuesses === (tiles.length * tiles[0].length) / 2 - 1)
          setGameOver("win");
      }
      setPreviousClick(undefined);
    } else {
      // first click
      setPreviousClick({ row: rowIndex, col: colIndex });
    }
  };

  const resetGame = () => {
    setBoard(fetchTiles());
    setRevealedBoard(cleanBoard(board));
    setGameOver(undefined);
    setCorrectGuesses(0);
    setGuessesRemaining(guesses);
  };

  return (
    <div className="container max-w-2xl">
      <div className="grid grid-cols-4 gap-6 relative">
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((tile, colIndex) => (
              <div>
                <div
                  key={colIndex}
                  className={`mb-6 ${
                    gameOver ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={() =>
                    !paused ? handleCardClick(rowIndex, colIndex) : undefined
                  }
                >
                  {revealedBoard[rowIndex][colIndex] ? (
                    <img
                      style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 1s",
                        transform:
                          revealedBoard[rowIndex][colIndex] &&
                          "rotateY(180deg)",
                      }}
                      src={`${imageBucket}/${tile}.png`}
                      alt={`Impostor ${tile}`}
                      className="border rounded-2xl"
                    />
                  ) : (
                    <img
                      style={{
                        transformStyle: "preserve-3d",
                        transition: "transform 1s",
                        transform:
                          revealedBoard[rowIndex][colIndex] &&
                          "rotateY(180deg)",
                      }}
                      src={`/images/impostor-${RANDOM_IMPOSTOR}.png`}
                      alt={`Mystery Impostor`}
                      className="border rounded-2xl"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2 className="font-link text-3xl font-bold">
        {guessesRemaining} Lives Remaining
      </h2>

      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%) rotate(-12deg)",
          top: "50%",
          left: "50%",
        }}
      >
        {gameOver === "win" && (
          <>
            <span className="font-link text-green-500 text-9xl">Victory!</span>
            <button
              onClick={() => resetGame()}
              className="font-link pl-12 pr-12 text-3xl bg-black border-green-500 border-4 rounded-2xl mt-8"
            >
              Play Again
            </button>
          </>
        )}
        {gameOver === "loss" && (
          <>
            <span className="font-link text-red-600 text-9xl">Defeat!</span>
            <button
              onClick={() => resetGame()}
              className="font-link pl-12 pr-12 text-3xl bg-black border-red-600 border-4 rounded-2xl mt-8"
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
