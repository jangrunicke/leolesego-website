// YouTube: show a thumbnail, load the player only on click.
document.querySelectorAll(".video[data-yt]").forEach((button) => {
  button.addEventListener("click", () => {
    const params = new URLSearchParams({ autoplay: "1", rel: "0" });
    if (button.dataset.start) params.set("start", button.dataset.start);
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.yt}?${params}`;
    iframe.title = button.getAttribute("aria-label");
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    button.replaceChildren(iframe);
    button.style.cursor = "default";
  });
});

// Lightbox: click an image to see it large, arrows step through its gallery.
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
let current = [];
let index = 0;

function show(i) {
  index = (i + current.length) % current.length;
  const img = current[index];
  lightboxImg.src = img.currentSrc.replace(/-s\.jpg$/, ".jpg");
  lightboxImg.alt = img.alt;
}

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const images = [...gallery.querySelectorAll("img")];
  images.forEach((img, i) => {
    img.addEventListener("click", () => {
      current = images;
      show(i);
      lightbox.showModal();
    });
  });
});

lightbox.addEventListener("click", () => lightbox.close());
document.addEventListener("keydown", (e) => {
  if (!lightbox.open) return;
  if (e.key === "ArrowRight") show(index + 1);
  if (e.key === "ArrowLeft") show(index - 1);
});

// Index: each work opens in place, one at a time.
const entries = [...document.querySelectorAll(".entry")];
const barHeight = () => document.querySelector(".bar").offsetHeight;

entries.forEach((entry) => {
  entry.addEventListener("toggle", () => {
    if (entry.open) {
      entries.forEach((other) => other !== entry && (other.open = false));
      entry.scrollIntoView({ block: "start" });
    } else if (entry.getBoundingClientRect().top < barHeight()) {
      entry.scrollIntoView({ block: "center" });
    }
  });
  entry.querySelector(".entry__close").addEventListener("click", () => (entry.open = false));
});

function openFromHash() {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.matches(".entry")) target.open = true;
}
openFromHash();
addEventListener("hashchange", openFromHash);

// Index: a small image follows the cursor over each closed entry.
const preview = document.querySelector(".index__preview");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = 0, y = 0, px = 0, py = 0;
  document.querySelectorAll(".row[data-preview]").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      if (row.closest("[open]")) return;
      preview.src = row.dataset.preview;
      preview.classList.add("is-visible");
    });
    row.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
    row.addEventListener("click", () => preview.classList.remove("is-visible"));
  });
  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  (function follow() {
    px += (x - px) * 0.12;
    py += (y - py) * 0.12;
    preview.style.transform = `translate(${px + 24}px, ${py - preview.offsetHeight / 2}px)`;
    requestAnimationFrame(follow);
  })();
}

// Hero: the name rises, then a photo reel opens between the words.
const hero = document.querySelector(".hero");
const root = document.documentElement;
const slot = hero.querySelector(".hero__slot");
const frames = [...hero.querySelectorAll(".hero__reel img")];
const caption = hero.querySelector(".hero__caption");
const ease = "cubic-bezier(0.625, 0.05, 0, 1)";
let frame = 0;
let heroVisible = true;

// Hard cuts, like a gif. Paused while the hero is off screen.
function startReel() {
  setInterval(() => {
    if (!heroVisible) return;
    frames[frame].classList.remove("is-active");
    frame = (frame + 1) % frames.length;
    frames[frame].classList.add("is-active");
    caption.textContent = frames[frame].dataset.caption;
  }, 1300);
}
new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(hero);

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Still: first photo only.
} else if (!root.classList.contains("is-intro")) {
  startReel();
} else {
  Promise.all([document.fonts.ready, frames[0].decode().catch(() => {})]).then(() => {
    root.classList.remove("is-intro");
    hero.querySelectorAll(".hero__word > span").forEach((word, i) => {
      word.animate([{ transform: "translateY(110%)" }, { transform: "none" }], {
        duration: 1000, delay: 150 + i * 90, easing: ease, fill: "backwards",
      });
    });
    const { width, margin } = getComputedStyle(slot);
    slot.animate([{ width: "0px", margin: "0px" }, { width, margin }], {
      duration: 1100, delay: 1000, easing: ease, fill: "backwards",
    });
    hero.querySelector(".hero__foot").animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 800, delay: 1600, fill: "backwards",
    });
    setTimeout(startReel, 2100);
  });
}
