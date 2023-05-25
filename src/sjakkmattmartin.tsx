import { useState } from "react";
import { Chess, Color, PartialMove } from "chess.ts";
import { Chessboard } from "react-chessboard";
import { Square } from "chess.js";

export default function SjakkMattMartin() {
  const [game, setGame] = useState(new Chess());

  type player = "computer" | "human";
  const gameConfig: Record<Color, player> = { b: "computer", w: "human" };

  function makeAMove(move: PartialMove | string) {
    setGame((game) => {
      // const gameCopy = game.clone();
      const result = game.move(move);

      if (gameConfig[game.state.turn] === "computer") {
        setTimeout(makeRandomMove, 2000);
      }

      console.log(result, game);
      return game.clone();
      // if (result)
      //   return gameCopy;
      // else return game;
    });
    // return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    console.log("makerandom2");

    const possibleMoves = game
      .moves({ verbose: true })
      .filter((v) => v.color === "b");
    console.log(possibleMoves);
    if (game.gameOver() || game.inDraw() || possibleMoves.length === 0) return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
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
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </>
  );
}
