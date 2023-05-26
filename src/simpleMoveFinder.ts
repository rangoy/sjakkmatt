import { Chess, Move, PieceSymbol } from "chess.ts";

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
export function scoreMove(
  game: Chess,
  move: Move,
  direction: -1 | 1,
  recursion: number
) {
  let score = 0;
  if (move.captured) score += scorePiece(move.captured);
  const ifMove = game.clone();
  ifMove.move(move);
  if (ifMove.inCheckmate()) score += 1000;
  if (ifMove.inDraw()) score -= 100;
  if (ifMove.inCheck()) score += 1;

  console.log('--- starting oposite analysis', recursion)
  if (--recursion > 0) {
    let x = ifMove.moves({ verbose: true }).map((m) => {
      console.log(m);
      return {
        score: scoreMove(ifMove, m, -direction as (-1 | 1), recursion - 1),
        ...m,
      };
    });
    let res = x.reduce((acc, m) => acc + m.score, 0);

    console.log({ res });
    score += res;
  }

  console.log({score, direction});
  return score * direction * recursion;
}

export function getNextMove(game: Chess) {
  const start = Date.now()
  let possibleMoves = game
    .moves({ verbose: true })
    .map((move) => ({ score: scoreMove(game, move, 1, 1), ...move,  }))
    .sort((ma, mb) => mb.score - ma.score);

  const bestScore = possibleMoves[0].score;
  possibleMoves = possibleMoves.filter(({ score }) => bestScore === score);
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  console.log( Date.now()-start, bestScore,randomIndex, possibleMoves[randomIndex]);
  return possibleMoves[randomIndex];
}
