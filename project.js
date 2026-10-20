// Builds a project detail page (project.html?p=<slug>) from data.json.
// To change a project's text or images, edit its "details" in data.json.

let lightboxImages = [];
let lightboxIndex = 0;

function renderSite(site = {}) {
  $("nav-logo").textContent = `${site.logo}.`;
  $("footer-logo").textContent = `${site.logo}.`;
  $("footer-copy").textContent = site.copyright || "";
}

function renderProject({ items = [] } = {}, site = {}) {
  const slug = new URLSearchParams(location.search).get("p");
  const index = items.findIndex((p) => p.slug === slug);

  if (index === -1) {
    document.title = `Project not found — ${site.title || "Portfolio"}`;
    $("detail-title").textContent = "Project not found";
    $("detail-lead").innerHTML = `There's no project called “${esc(slug)}”. <a href="index.html#projects">Back to all projects</a>.`;
    return;
  }

  const p = items[index];
  const d = p.details || {};
  document.title = `${p.title} — ${site.title || "Portfolio"}`;

  $("detail-num").textContent = `${pad(index + 1)} · ${p.category}`;
  $("detail-title").textContent = p.title;
  $("detail-zh").textContent = p.titleZh || "";
  $("detail-lead").textContent = p.description || "";

  $("detail-facts").innerHTML = (d.facts || [])
    .map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`)
    .join("");

  $("detail-hero").innerHTML = `<img src="${esc(p.image)}" alt="${esc(p.title)} rendering">`;

  $("detail-sections").innerHTML = (d.sections || [])
    .map(
      (s, i) => `
      <div class="detail__section">
        <span class="service__num">${pad(i + 1)}</span>
        <h3>${esc(s.heading)}</h3>
        <p>${esc(s.text)}</p>
      </div>`
    )
    .join("");

  // The cover image opens in the viewer too, so it's the first slide
  lightboxImages = [{ src: p.image, caption: p.title }, ...(d.images || [])];
  $("detail-images").innerHTML = (d.images || [])
    .map(
      (img, i) => `
      <figure>
        <button type="button" data-index="${i + 1}" aria-label="Enlarge: ${esc(img.caption)}">
          <img src="${esc(img.src)}" alt="${esc(img.caption)}" loading="lazy">
        </button>
        ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
      </figure>`
    )
    .join("");
  document.querySelector(".detail__gallery-title").hidden = !(d.images || []).length;

  const prev = items[(index - 1 + items.length) % items.length];
  const next = items[(index + 1) % items.length];
  $("detail-pager").innerHTML = `
    <a href="${esc(projectUrl(prev))}" class="pager__link">
      <small>← Previous project</small>
      <span>${esc(prev.title)}</span>
    </a>
    <a href="${esc(projectUrl(next))}" class="pager__link pager__link--next">
      <small>Next project →</small>
      <span>${esc(next.title)}</span>
    </a>`;
}

// ===== Lightbox =====
function showImage(i) {
  lightboxIndex = (i + lightboxImages.length) % lightboxImages.length;
  const img = lightboxImages[lightboxIndex];
  $("lightbox-img").src = img.src;
  $("lightbox-img").alt = img.caption || "";
  $("lightbox-caption").textContent = `${img.caption || ""}  ·  ${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function openLightbox(i) {
  showImage(i);
  $("lightbox").showModal();
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-index], #detail-hero img");
  if (trigger) openLightbox(Number(trigger.dataset.index || 0));
});
$("lightbox-close").addEventListener("click", () => $("lightbox").close());
$("lightbox-prev").addEventListener("click", () => showImage(lightboxIndex - 1));
$("lightbox-next").addEventListener("click", () => showImage(lightboxIndex + 1));
$("lightbox").addEventListener("click", (e) => {
  if (e.target === $("lightbox")) $("lightbox").close(); // click on the dark backdrop
});
document.addEventListener("keydown", (e) => {
  if (!$("lightbox").open) return;
  if (e.key === "ArrowLeft") showImage(lightboxIndex - 1);
  if (e.key === "ArrowRight") showImage(lightboxIndex + 1);
});

loadPortfolio([
  ["site", (data) => renderSite(data.site)],
  ["projects", (data) => renderProject(data.projects, data.site)],
]);
