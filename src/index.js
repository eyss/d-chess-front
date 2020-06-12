import Chess from "chess.js";
import manageSendInvite from "./invite";
import manageInvitations from "./invitation-management";
import assignMenuEventListeners from "./menu";

import {
  MicroOrchestrator,
  i18nextBaseModule,
} from "@uprtcl/micro-orchestrator";
import {
  HolochainConnection,
  HolochainConnectionModule,
} from "@uprtcl/holochain-provider";

import "./index.css";
import "./board.css";
import "./sass/invitations.scss";
import { ChessModule } from "./chess-module/chess.module";
import { ProfilesModule } from "holochain-profiles";
import { ApolloClientModule } from "@uprtcl/graphql";
import checkProfile from './checkProfile';

var board = null;
var game = new Chess();

checkProfile()
manageSendInvite();
manageInvitations();
assignMenuEventListeners();

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;
  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });
  // illegal move
  if (move === null) return "snapback";
  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = "";
  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }
  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  } else if (game.in_draw()) {
    // draw?
    status = "Game over, drawn position";
  } else {
    // game still on
    status = moveColor + " to move";
    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};
// board = window.Chessboard('my-board', config)

// updateStatus()

const orchestrator = new MicroOrchestrator();

async function loadModules() {
  const connection = new HolochainConnection({
    host: process.env.REACT_APP_WS_URL,
  });

  await orchestrator.loadModules([
    new i18nextBaseModule(),
    new HolochainConnectionModule(connection),
    new ApolloClientModule(),
    new ProfilesModule("chess"),
    new ChessModule("chess"),
  ]);

  //customElements.define('hc-chess-main', ChessMain)
}

loadModules();
