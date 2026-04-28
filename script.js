const sections = document.querySelectorAll("main [id]");
const navLinks = document.querySelectorAll(".top-nav a");
const visualCards = document.querySelectorAll(".visual-card");
const lightbox = document.querySelector("#imageLightbox");
const lightboxVisual = document.querySelector("#lightboxVisual");
const lightboxCaption = document.querySelector("#lightboxTitle");
const lightboxClose = document.querySelector(".lightbox-close");
let lastFocusedCard = null;

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

setActiveLink("problem");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveLink(visible.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.15, 0.35, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

const closeLightbox = () => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  lightbox.classList.add("is-closing");
  lightbox.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  window.setTimeout(() => {
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("is-closing");
    lightboxVisual.replaceChildren();

    if (lastFocusedCard) {
      lastFocusedCard.focus();
    }
  }, 260);
};

const openLightbox = (card) => {
  const caption = card.querySelector("figcaption")?.textContent.trim() || "Expanded visual";
  const image = card.querySelector("img");
  const placeholder = card.querySelector(".image-placeholder");
  const expandedMedia = image ? image.cloneNode(true) : placeholder.cloneNode(true);

  lastFocusedCard = card;
  lightboxCaption.textContent = caption;

  if (expandedMedia.tagName === "IMG") {
    expandedMedia.removeAttribute("width");
    expandedMedia.removeAttribute("height");
    expandedMedia.alt = expandedMedia.alt || caption;
  }

  lightboxVisual.replaceChildren(expandedMedia);
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lightbox.classList.remove("is-closing");

  requestAnimationFrame(() => {
    lightbox.classList.add("is-open");
    lightboxClose.focus();
  });
};

visualCards.forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(card);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
