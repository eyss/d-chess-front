import { moduleConnect } from "@uprtcl/micro-orchestrator";
import { LitElement, html, styleMap } from "lit-element";
import { HolochainConnectionModule } from "@uprtcl/holochain-provider";
import { ApolloClientModule } from "@uprtcl/graphql";
import gql from "graphql-tag";
import "chessboard-element";
import * as Chess from "chess.js";

const whiteSquareGrey = "#a9a9a9";
const blackSquareGrey = "#696969";

export class ChessGame extends moduleConnect(LitElement) {
  static get properties() {
    return {
      myAddress: {
        type: String,
      },
      gameId: {
        type: String,
      },
      game: {
        type: Object,
      },
    };
  }

  listenForOpponentMove() {
    const hcConnection = this.request(
      HolochainConnectionModule.bindings.HolochainConnection
    );
    hcConnection.onSignal("opponent-moved", (move) => {
      const { from, to } = JSON.parse(move.game_move).PlacePiece;
      const moveString = `${from}-${to}`;

      this.shadowRoot.getElementById("board").move(moveString);
      this.chessGame.move(moveString, { sloppy: true });
    });
  }

  async firstUpdated() {
    this.listenForOpponentMove();

    this.client = this.request(ApolloClientModule.bindings.Client);

    const result = await this.client.query({
      query: gql`
        query GetGame($gameId: ID!) {
          me {
            id
          }
          game(gameId: $gameId) {
            id
            players {
              id
              username
            }

            state
            moves

            createdAt
            winner
          }
        }
      `,
      variables: {
        gameId: this.gameId,
      },
    });

    this.myAddress = result.data.me.id;
    this.game = result.data.game;

    this.chessGame = new Chess(this.game.state);

    this.chessStyles = "";
  }

  amIWhite() {
    return this.game.players[0].id === this.myAddress;
  }

  isMyTurn() {
    const turnColor = this.chessGame.turn();
    const myColor = this.amIWhite() ? "w" : "b";

    return turnColor === myColor;
  }

  removeGreySquares() {
    this.shadowRoot.getElementById("chessStyle").textContent = "";
  }

  greySquare(square) {
    const highlightColor =
      square.charCodeAt(0) % 2 ^ square.charCodeAt(1) % 2
        ? whiteSquareGrey
        : blackSquareGrey;

    this.shadowRoot.getElementById("chessStyle").textContent += `
      chess-board::part(${square}) {
        background-color: ${highlightColor};
      }
    `;
  }

  onDragStart(e) {
    const { source, piece } = e.detail;

    // do not pick up pieces if the game is over
    if (this.chessGame.game_over() || !this.isMyTurn()) {
      e.preventDefault();
      return;
    }

    // or if it's not that side's turn
    if (
      (this.chessGame.turn() === "w" && piece.search(/^b/) !== -1) ||
      (this.chessGame.turn() === "b" && piece.search(/^w/) !== -1)
    ) {
      e.preventDefault();
      return;
    }
  }

  onDrop(e) {
    const { source, target, setAction } = e.detail;

    this.removeGreySquares();

    // see if the move is legal
    const move = this.chessGame.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
      setAction("snapback");
    } else {
      this.makeMove(source, target);
    }
  }

  onMouseOverSquare(e) {
    const { square, piece } = e.detail;

    if (!this.isMyTurn()) return;

    // get list of possible moves for this square
    const moves = this.chessGame.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) {
      return;
    }

    // highlight the square they moused over
    this.greySquare(square);

    // highlight the possible squares for this piece
    for (const move of moves) {
      this.greySquare(move.to);
    }
  }

  makeMove(from, to) {
    this.client.mutate({
      mutation: gql`
        mutation MakeMove($gameId: ID!, $from: String!, $to: String!) {
          makeMove(gameId: $gameId, from: $from, to: $to)
        }
      `,
      variables: {
        gameId: this.gameId,
        from,
        to,
      },
    });
  }

  render() {
    if (!this.game)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html`
      <style id="chessStyle"></style>
      <chess-board
        id="board"
        style="width: 70vh;"
        .orientation=${this.amIWhite() ? "white" : "black"}
        position="${this.game.state}"
        draggable-pieces
        @drag-start=${this.onDragStart}
        @drop=${this.onDrop}
        @mouseover-square=${this.onMouseOverSquare}
        @mouseout-square=${this.removeGreySquares}
      ></chess-board>
    `;
  }
}
