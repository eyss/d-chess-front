import manageSendInvite from "./invite";
import manageInvitations from "./invitation-management";
import assignMenuEventListeners from "./menu";

import "./index.css";
import "./board.css";
import "./sass/invitations.scss";
import checkProfile from './checkProfile';

checkProfile()
manageSendInvite();
manageInvitations();
assignMenuEventListeners();

