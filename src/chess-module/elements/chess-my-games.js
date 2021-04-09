import { LitElement, html, css } from "lit-element";
import { sharedStyles } from "./sharedStyles";
import { BaseElement, connectDeps } from "@holochain-open-dev/common";
import { Button } from "scoped-material-components/mwc-button";
import { ChessGame } from "./chess-game";
import { ChessGameList } from "./chess-game-list";

export class ChessMyGames extends BaseElement {
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

  get _deps() {}

  render() {
    if (!this.selectedGameId)
      return html` <chess-game-list
        @game-selected=${(e) => (this.selectedGameId = e.detail.gameId)}
      ></chess-game-list>`;
    else
      return html`
        <div class="column" style="height: 100%;">
          <mwc-button
            icon="arrow_back"
            label="Return to my games"
            @click=${() => (this.selectedGameId = null)}
            style="align-self: start;"
          ></mwc-button>
          <hr style="width: 100%; margin-bottom: 60px;" />
          <chess-game .gameId=${this.selectedGameId}></chess-game>
        </div>
      `;
  }

  getScopedElements() {
    return {
      "mwc-button": Button,
      "chess-game": connectDeps(ChessGame, this._deps),
      "chess-game-list": connectDeps(ChessGameList, this._deps),
    };
  }
}
