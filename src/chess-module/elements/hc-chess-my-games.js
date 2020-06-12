import { LitElement, html, css } from "lit-element";
import { sharedStyles } from "./sharedStyles";
import "@material/mwc-button";

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
      return html`
        <div class="column" style="height: 100%;">
          <mwc-button
            icon="arrow_back"
            label="Return to my games"
            @click=${() => (this.selectedGameId = null)}
            style="align-self: start;"
          ></mwc-button>
          <hr style="width: 100%; margin-bottom: 60px;">
          <hc-chess-game .gameId=${this.selectedGameId}></hc-chess-game>
        </div>
      `;
  }
}
