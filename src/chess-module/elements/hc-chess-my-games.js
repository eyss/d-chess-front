import { LitElement, html, css } from "lit-element";
import { sharedStyles } from "./sharedStyles";

export class ChessMyGames extends LitElement {
  static get properties() {
    return {
      selectedGameId: {
        type: String,
      },
    };
  }

  static get styles() {
    return [sharedStyles, css``];
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
