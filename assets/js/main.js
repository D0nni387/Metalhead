const projects = [
  {
    id: "work-0",
    name: "Biomechanical Xenomorph",
    image: "assets/images/biomechanical-xenomorph.webp",
    era: "recent",
    featured: false,
    description:
      "A distinct biomechanical Xenomorph sculpt, finished with high-contrast colour.",
    process: "assets/images/work-in-progress.webp",
  },
  {
    id: "work-1",
    name: "Predator",
    image: "assets/images/predator.webp",
    era: "recent",
    featured: true,
    description: "Painted collectible figure.",
    process: "assets/images/predator-process.webp",
  },
  {
    id: "work-2",
    name: "Stone Cold Steve Austin",
    image: "assets/images/stone-cold-steve-austin.webp",
    era: "recent",
    featured: true,
    description: "A larger-scale Attitude Era collectible.",
    process: null,
  },
  {
    id: "work-3",
    name: "Max Payne",
    image: "assets/images/max-payne.webp",
    era: "recent",
    featured: false,
    description: "Painted collectible inspired by Max Payne.",
    process: null,
  },
  {
    id: "work-4",
    name: "Hornet",
    image: "assets/images/hornet.webp",
    era: "recent",
    featured: true,
    description:
      "Hornet collectible statue — painted and finished by Metalhed.",
    process: "assets/images/hornet-process.webp",
  },
  {
    id: "work-5",
    name: "Blaidd",
    image: "assets/images/blaidd.webp",
    era: "recent",
    featured: true,
    description:
      "Blaidd collectible statue — painted and finished by Metalhed.",
    process: null,
  },
  {
    id: "work-6",
    name: "Gordon Freeman",
    image: "assets/images/gordon-freeman.webp",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    process: null,
  },
  {
    id: "work-7",
    name: "Cubone",
    image: "assets/images/cubone.webp",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    process: null,
  },
  {
    id: "work-8",
    name: "John Constantine",
    image: "assets/images/john-constantine.webp",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    process: null,
  },
  {
    id: "work-9",
    name: "Great Unclean",
    image: "assets/images/great-unclean.webp",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    process: null,
  },
  {
    id: "work-10",
    name: "Metalhed Original — Fighting Monkey",
    image: "assets/images/metalhed-original-fighting-monkey.webp",
    era: "earlier",
    featured: false,
    description: "Earlier work from the archive.",
    process: null,
  },
  {
    id: "work-12",
    name: "Rebecca from Edgerunners",
    image: "assets/images/rebecca-from-edgerunners.webp",
    era: "recent",
    featured: false,
    description: "A newer Rebecca from Cyberpunk: Edgerunners.",
    process: null,
  },
  {
    id: "work-13",
    name: "Xenomorph",
    image: "assets/images/xenomorph.webp",
    era: "recent",
    featured: true,
    description:
      "Finished Xenomorph statue — a separate sculpt from the biomechanical interpretation.",
    process: null,
  },
  {
    id: "work-14",
    name: "Old Man Logan",
    image: "assets/images/old-man-logan.webp",
    era: "recent",
    featured: false,
    description:
      "Old Man Logan collectible figure, painted and finished by Metalhed.",
    process: null,
  },
  {
    id: "work-15",
    name: "Libra",
    image: "assets/images/libra.webp",
    era: "recent",
    featured: false,
    description: "Painted fantasy figure.",
    process: null,
  },
  {
    id: "work-16",
    name: "1st Rebecca",
    image: "assets/images/1st-rebecca.webp",
    era: "earlier",
    featured: false,
    description:
      "The first Rebecca painting — part of the earlier work archive.",
    process: null,
  },
  {
    id: "work-18",
    name: "RoboCop",
    image: "assets/images/robocop.webp",
    era: "recent",
    featured: true,
    description:
      "RoboCop collectible statue with a metallic blue-silver armour finish.",
    process: null,
  },
];
const featured = document.getElementById("featured"),
  archive = document.getElementById("archive-grid"),
  archiveStatus = document.getElementById("archive-status");
const card = (p) =>
  `<button class="tile" data-project="${p.id}" aria-label="View ${p.name}"><figure><img loading="lazy" src="${p.image}" alt=""></figure><strong>${p.name}</strong></button>`;
featured.innerHTML = projects
  .filter((p) => p.featured)
  .map(card)
  .join("");
function renderArchive(filter = "all") {
  const shown = projects.filter((p) => filter === "all" || p.era === filter);
  archive.innerHTML = shown.map(card).join("");
  return shown.length;
}
renderArchive();
document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((x) => {
      x.classList.remove("active");
      x.setAttribute("aria-pressed", "false");
    });
    b.classList.add("active");
    b.setAttribute("aria-pressed", "true");
    const count = renderArchive(b.dataset.filter);
    archiveStatus.textContent = `Showing ${count} ${count === 1 ? "piece" : "pieces"}`;
  }),
);

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const menuLabel = menuToggle.querySelector(".menu-toggle-label");
const pageRegions = [
  document.querySelector("main"),
  document.querySelector("footer"),
];
const setMenu = (open) => {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuLabel.textContent = open ? "Close" : "Menu";
  siteNav.classList.toggle("open", open);
  document.documentElement.classList.toggle("menu-open", open);
  pageRegions.forEach((el) => (el.inert = open));
  if (open) siteNav.querySelector("a").focus();
};
menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
siteNav.addEventListener("click", (e) => {
  if (e.target.closest("a") && siteNav.classList.contains("open"))
    setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteNav.classList.contains("open")) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

const dlg = document.getElementById("project-dialog");
const dialogPhoto = document.getElementById("dialog-photo");
let previousFocus = null;
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-project]");
  if (!trigger) return;
  const p = projects.find((x) => x.id === trigger.dataset.project);
  if (!p) return;
  dialogPhoto.src = p.image;
  dialogPhoto.alt = p.name;
  document.getElementById("dialog-title").textContent = p.name;
  document.getElementById("dialog-desc").textContent = p.description;
  const proc = document.getElementById("process");
  proc.hidden = !p.process;
  document.getElementById("process-img").src = p.process || "";
  document.getElementById("process-img").alt = p.name + " work in progress";
  previousFocus = trigger;
  proc.open = false;
  dlg.showModal();
});
document.getElementById("close-dialog").onclick = () => dlg.close();
dlg.addEventListener("close", () => {
  if (previousFocus?.isConnected) previousFocus.focus();
});
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});

const light = document.getElementById("lightbox");
const lightImg = document.getElementById("light-img");
const fullView = document.getElementById("full-view");
fullView.onclick = () => {
  lightImg.src = dialogPhoto.src;
  lightImg.alt = dialogPhoto.alt;
  light.showModal();
};
document.getElementById("close-light").onclick = () => light.close();
light.addEventListener("close", () => fullView.focus());
light.addEventListener("click", (e) => {
  if (e.target === light) light.close();
});

(() => {
  const slides = [...document.querySelectorAll(".hero-slide")];
  if (
    slides.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 7000);
})();
