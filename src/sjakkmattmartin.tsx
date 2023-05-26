import { useEffect, useState } from "react";
import { Chess, Color, Move, PartialMove, Piece, PieceSymbol } from "chess.ts";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";
import { CustomSquareStyles } from "react-chessboard/dist/chessboard/types";

export default function SjakkMattMartin() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | "">();
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});

  type player = "computer" | "human";
  const gameConfig: Record<Color, player> = { b: "computer", w: "human" };

  function makeAMove(move: PartialMove | string) {
    setGame((game) => {
      // const gameCopy = game.clone();
      const result = game.move(move);
      console.log(result, game);
      return game.clone();
      // if (result)
      //   return gameCopy;
      // else return game;
    });
    // return result; // null if the move was illegal, the move object if the move was legal
  }

  function scorePiece(p: PieceSymbol) {
    switch (p) {
      case "p":
        return 1;
      case "k":
        return 1000;
      case "b":
        return 3;
      case "n":
        return 3;
      case "r":
        return 5;
      case "q":
        return 10;
      default:
        return 0;
    }
  }
  function scoreMove(move: Move) {
    if (move.captured) return scorePiece(move.captured);

    return 0;
  }

  function safeGameMutate(modify: (g: Chess) => void) {
    setGame((g) => {
      const update = g.clone();
      modify(update);
      return update;
    });
  }
  useEffect(() => {
    if (gameConfig[game.state.turn] === "computer") {
      setTimeout(makeRandomMove, 500); //Heh.. it's possible to move even if it's the computers turn :/
    }
  });
  function makeRandomMove() {
    console.log("makerandom2");

    console.log("possiblemoves", game.moves({ verbose: true }));

    let possibleMoves = game
      .moves({ verbose: true })
      .map((move) => ({ ...move, score: scoreMove(move) }))
      .sort((ma, mb) => mb.score - ma.score)
      .filter((v) => v.color === "b");
    console.log(possibleMoves);
    if (game.gameOver() || game.inDraw() || possibleMoves.length === 0) return; // exit if the game is over
    const bestScore = possibleMoves[0].score;
    possibleMoves = possibleMoves.filter(({ score }) => bestScore === score);
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }

    const newSquares: CustomSquareStyles = {};
    moves.map(({ to }) => {
      newSquares[to as Square] = {
        background:
          game.get(to) && game.get(to)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return to;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }
  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    function resetFirstMove(square: Square) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    // attempt to make move
    const gameCopy = game.clone();
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setTimeout(makeRandomMove, 300);
    setMoveFrom("");
    setOptionSquares({});
  }
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    return true;
  }

  return (
    <>
      {game.inCheck() ? "Sjakk" : "Ikke sjakk"}
      {game.inCheckmate() ? " matt" : ""}
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
      />
      <button
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setMoveSquares({});
          setRightClickedSquares({});
        }}
      >
        reset
      </button>
      <button
        onClick={() => {
          safeGameMutate((game) => {
            //Undo both human and computer.. TODO: check how many computers there are or stop auto move
            game.undo();
            game.undo();
          });
          setMoveSquares({});
          setRightClickedSquares({});
        }}
      >
        undo
      </button>
    </>
  );
}
