import holochain from "./holochain";

export default async () => {
  const res = await holochain.isUserCreated();

  const username = document.getElementById("get-username");

  if (!res) {
    username.parentNode.style.display = "block";
  }

  username.addEventListener("username-set", (e) => {
    username.parentNode.style.display = "none";
  });
};
