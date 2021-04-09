import { LitElement, html } from "lit-element";
import gql from "graphql-tag";
import { sharedStyles } from "./sharedStyles";

import { CircularProgress } from "scoped-material-components/mwc-circular-progress";
import { List } from "scoped-material-components/mwc-list";
import { ListItem } from "scoped-material-components/mwc-list-item";

export class ChessGameList extends BaseElement {
  static get properties() {
    return {
      games: {
        type: Array,
      },
    };
  }

  get _deps() {}

  static get styles() {
    return [sharedStyles];
  }

  async firstUpdated() {
    const client = this.request(ApolloClientModule.bindings.Client);

    const result = await client.query({
      query: gql`
        {
          me {
            id
            games {
              id
              players {
                id
                username
              }
              createdAt
            }
          }
        }
      `,
      fetchPolicy: "network-only",
    });

    this.games = result.data.me.games;
    this.myAddress = result.data.me.id;
  }

  getOpponent(game) {
    return game.players.find((player) => player.id !== this.myAddress);
  }

  gameSelected(gameId) {
    this.dispatchEvent(
      new CustomEvent("game-selected", { detail: { gameId: gameId } })
    );
  }

  renderGame(game) {
    return html`<mwc-list-item
      twoline
      @click=${() => this.gameSelected(game.id)}
    >
      <span style="color: white;">vs @${this.getOpponent(game).username} </span>
      <span slot="secondary" style="color: white;"
        >${new Date(game.createdAt).toDateString()}</span
      >
    </mwc-list-item>`;
  }

  render() {
    if (this.games === undefined)
      return html`<div class="container">
        <mwc-circular-progress></mwc-circular-progress>
      </div>`;

    if (this.games.length === 0)
      return html`<span>You don't have any active games</span>`;

    return html`
      <h2>My Games</h2>
      <hr />
      <mwc-list> ${this.games.map((game) => this.renderGame(game))} </mwc-list>
    `;
  }

  getScopedElements() {
    return {
      "mwc-list": List,
      "mwc-list-item": ListItem,
      "mwc-circular-progress": CircularProgress,
    };
  }
}
