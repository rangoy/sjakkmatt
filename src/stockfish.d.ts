// stockfish.d.ts
declare module "stockfish" {
  interface Stockfish {
    postMessage(message: string): void;
    onmessage: (event: MessageEvent) => void;
    // ...
  }
  interface StockfishConstructor {
    new (): Stockfish;
  }

  const stockfish: StockfishConstructor;
  export default stockfish;
}
