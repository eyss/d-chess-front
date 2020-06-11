import { connect } from "@holochain/hc-web-client";

const call = (functionName, params = {}, zome = "chess") => {
  return new Promise((succ, err) => {
    connect(
      process.env.NODE_ENV === "development"
        ? { url: process.env.REACT_APP_WS_URL }
        : undefined
    )
      .then(async ({ callZome, close }) => {
        let zCall = await callZome("chess", zome, functionName)(params);
        console.log("zCall");
        console.log(zCall);
        succ(JSON.parse(zCall));
      })
      .catch((error) => {
        err(error);
      });
  });
};

const holochain = {
  isUserCreated: async () => {
    const response = await call("get_my_address", {}, "profiles");

    let myAddress = response.Ok;

    const res = await call(
      "get_username",
      { agent_address: myAddress },
      "profiles"
    );
    return res.Ok != undefined;
  },
  inviteUser: (username) => {
    return new Promise(async (succ, err) => {
      const timestamp = new Date().getTime();
      try {
        const agent_address = await call(
          "get_address_from_username",
          { username },
          "profiles"
        );
        const res = await call("invite_user", {
          opponent: agent_address.Ok,
          timestamp,
        });
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  getSentInvitations: () => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call("get_sent_invitations", {});
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  getReceivedInvitations: () => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call("get_received_invitations", {});
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  acceptInvitation: (inviter, invited, invitation_timestamp) => {
    return new Promise(async (succ, err) => {
      const timestamp = new Date().getTime();
      try {
        const res = await call("accept_invitation", {
          inviter,
          invited,
          timestamp,
          invitation_timestamp,
        });
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  rejectInvitation: (inviter, invited, invitation_timestamp) => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call("reject_invitation", {
          inviter,
          invited,
          invitation_timestamp,
        });
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  getUsername: (addr) => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call(
          "get_username",
          { agent_address: addr },
          "profiles"
        );
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  getMyPublicAddress: () => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call("get_my_public_address", {});
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
  loadMyGames: () => {
    return new Promise(async (succ, err) => {
      try {
        const res = await call("check_my_games", {});
        succ(res);
      } catch (e) {
        console.error("Holochain error ", e);
        err(e);
      }
    });
  },
};

export default holochain;
