let currentSection = undefined;

const openSection = (sectionName) => {
  if (sectionName === currentSection) return;
  currentSection = sectionName;

  [...document.querySelectorAll("main > div")].forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById(sectionName).style.display =
    sectionName === "games" ? "flex" : "block";

  const gameSection = document.getElementById("game-loader");
  if (sectionName === "games") {
    const element = document.createElement("hc-chess-my-games");
    gameSection.appendChild(element);
  } else {
    gameSection.textContent = ''
  }
};

export default async () => {
  document
    .getElementById("see-invitations-button")
    .addEventListener("click", async (e) => {
      openSection("invitations");
    });
  document
    .getElementById("see-games-button")
    .addEventListener("click", async (e) => {
      openSection("games");
    });
};
