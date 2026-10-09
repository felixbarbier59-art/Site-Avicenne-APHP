const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const progressBar = document.querySelector(".scroll-progress span");

const syncMenuAccessibility = () => {
  if (!mainNav) return;
  const isMobile = window.innerWidth <= 900;
  const isOpen = menuToggle?.getAttribute("aria-expanded") === "true";
  mainNav.inert = isMobile && !isOpen;
};

const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);

  if (progressBar) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const closeMenu = () => {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Ouvrir le menu";
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  syncMenuAccessibility();
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.querySelector(".sr-only").textContent = willOpen ? "Fermer le menu" : "Ouvrir le menu";
  mainNav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  syncMenuAccessibility();
});

mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
  syncMenuAccessibility();
});

syncMenuAccessibility();

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const specialties = {
  main: {
    kicker: "Centre universitaire · Membre supérieur",
    title: "La précision au bout des doigts.",
    text: "Chirurgie de la main et du poignet, syndrome du canal carpien, lésions nerveuses et urgences : une prise en charge experte, y compris par technique WALANT lorsque indiquée.",
    items: ["Pathologies de la main et du poignet", "Microchirurgie et neuropathies périphériques", "Urgences main 24h/24"],
  },
  epaule: {
    kicker: "Mobilité · Membre supérieur",
    title: "Redonner de l’amplitude au mouvement.",
    text: "De l’épaule au coude, l’équipe évalue les lésions traumatiques, dégénératives et fonctionnelles afin de proposer une stratégie de soin adaptée.",
    items: ["Pathologies de l’épaule", "Pathologies du coude", "Arthrose et séquelles traumatiques"],
  },
  genou: {
    kicker: "Appui · Membre inférieur",
    title: "Retrouver stabilité et confiance.",
    text: "Arthrose, lésions ligamentaires et pathologies du pied ou de la cheville bénéficient d’un diagnostic spécialisé et d’un parcours coordonné.",
    items: ["Arthrose du genou", "Lésions des ligaments croisés", "Pathologies du pied et de la cheville"],
  },
  trauma: {
    kicker: "Traumatologie · Reconstruction",
    title: "Réparer aujourd’hui. Reconstruire demain.",
    text: "Fractures, plaies complexes et séquelles sont prises en charge avec une approche multidisciplinaire, du geste initial au suivi fonctionnel.",
    items: ["Fractures et traumatismes", "Séquelles de fractures complexes", "Plaies chroniques et reconstruction"],
  },
};

const tabs = document.querySelectorAll(".specialty-tab");
const title = document.querySelector("[data-specialty-title]");
const kicker = document.querySelector("[data-specialty-kicker]");
const text = document.querySelector("[data-specialty-text]");
const list = document.querySelector("[data-specialty-list]");
const points = document.querySelectorAll("[data-point]");

const showSpecialty = (key) => {
  const specialty = specialties[key];
  if (!specialty || !title || !kicker || !text || !list) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.specialty === key;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });

  points.forEach((point) => point.classList.toggle("is-active", point.dataset.point === key));

  const content = [kicker, title, text, list];
  content.forEach((element) => element.animate([{ opacity: 0.25, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "ease-out" }));

  kicker.textContent = specialty.kicker;
  title.textContent = specialty.title;
  text.textContent = specialty.text;
  list.innerHTML = specialty.items.map((item) => `<li>${item}</li>`).join("");
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showSpecialty(tab.dataset.specialty));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    tabs[nextIndex].focus();
    showSpecialty(tabs[nextIndex].dataset.specialty);
  });
});

showSpecialty("main");

document.querySelectorAll(".faq-list details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== details) other.open = false;
    });
  });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
