const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

const setMenuOpen = (open) => {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  mainNav.classList.toggle("is-open", open);
};

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) setMenuOpen(false);
});

const pathwayTabs = [...document.querySelectorAll("[data-pathway]")];
const pathwayPanels = [...document.querySelectorAll("[data-panel]")];

pathwayTabs.forEach((tab) => {
  const selectPathway = () => {
    const selectedPathway = tab.dataset.pathway;

    pathwayTabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    pathwayPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== selectedPathway;
    });

  };

  tab.addEventListener("click", selectPathway);
  tab.addEventListener("keydown", (event) => {
    const currentIndex = pathwayTabs.indexOf(tab);
    let nextIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % pathwayTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + pathwayTabs.length) % pathwayTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = pathwayTabs.length - 1;
    else return;

    event.preventDefault();
    pathwayTabs[nextIndex].focus();
    pathwayTabs[nextIndex].click();
  });
});
