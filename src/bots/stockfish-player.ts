import { Chess } from 'chess.ts';
import Stockfish from 'stockfish';



const useStockfish = (chess: Chess, onMove)=> {

    const stockfish = new Stockfish();


    stockfish.postMessage('uci');
    stockfish.postMessage('isready');


    stockfish.onmessage = (event) => {
        const message = event.data;
      
        // Handle engine responses
        // Example: Parse the best move and update the board position
        if (message.startsWith('bestmove')) {
          const bestMove = message.split(' ')[1];
          chess.move(bestMove);
          setFen(chess.fen());
        }
      };
}