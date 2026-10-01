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
