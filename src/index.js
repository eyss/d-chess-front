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

checkProfile()
manageSendInvite();
manageInvitations();
assignMenuEventListeners();


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

}

loadModules();
