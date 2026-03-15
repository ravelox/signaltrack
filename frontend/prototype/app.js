const titles = {
  report: "Report Issue",
  defects: "Defects List",
  detail: "Defect Detail",
  manager: "Manager Overview"
};

const navItems = [...document.querySelectorAll(".nav-item")];
const screens = [...document.querySelectorAll(".screen")];
const pageTitle = document.getElementById("page-title");

function showScreen(name) {
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.screen === name));
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === `screen-${name}`));
  pageTitle.textContent = titles[name] || "SignalTrack";
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showScreen(item.dataset.screen));
});

document.querySelectorAll("[data-screen-link]").forEach((el) => {
  el.addEventListener("click", () => showScreen(el.dataset.screenLink));
});
