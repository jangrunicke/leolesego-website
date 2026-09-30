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

// Index: a small image follows the cursor over each entry.
const preview = document.querySelector(".index__preview");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = 0, y = 0, px = 0, py = 0;
  document.querySelectorAll(".index__list a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (!link.dataset.preview) return;
      preview.src = link.dataset.preview;
      preview.classList.add("is-visible");
    });
    link.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
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

