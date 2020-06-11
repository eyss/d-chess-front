import { LitElement, html } from "lit-element";

export class ChessMyGames extends LitElement {
  static get properties() {
    return {
      selectedGameId: {
        type: String,
      },
    };
  }

  render() {
    if (!this.selectedGameId)
      return html` <hc-chess-game-list
        @game-selected=${(e) => (this.selectedGameId = e.detail.gameId)}
      ></hc-chess-game-list>`;
    else
      return html`<hc-chess-game
        .gameId=${this.selectedGameId}
      ></hc-chess-game>`;
  }
}
