import { LitElement, html } from "lit-element";

export class ChessMain extends LitElement {
  render() {
    return html`
      <div id="games" class="main-section">
        <h2>My Games</h2>
        <hr />
        <section id="game-loader">
          <hc-chess-my-games></hc-chess-my-games>
        </section>
      </div>
      <div id="invitations" class="main-section">
        <div class="selector">
          <button id="received">received</button>
          <button id="sent">sent</button>
        </div>
        <section id="sent-invitations">
          Sent
        </section>
        <section id="received-invitations">
          Received
        </section>
      </div>
      <div id="presentation" class="main-section" style="display: block;">
        <h1>CHESS</h1>
        <p onclick="document.getElementById('menu-icon').click()">start</p>
      </div>
    `;
  }
}
