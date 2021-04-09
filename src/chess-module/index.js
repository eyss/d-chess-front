import { connectDeps } from "@holochain-open-dev/common";

function defineChessElements(appWebsocket) {
  customElements.define(
    "chess-my-games",
    connectDeps(ChessMyGames, appWebsocket)
  );
}
