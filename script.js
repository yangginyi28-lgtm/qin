// Builds the home page from data.json — edit that file to change the site's content.
// Shared helpers (esc, pad, $, chips, projectUrl, loadPortfolio) live in common.js.

function renderSite(site = {}) {
  document.title = site.title || "Portfolio";
  $("nav-logo").textContent = `${site.logo}.`;
  $("footer-logo").textContent = `${site.logo}.`;
  $("footer-copy").textContent = site.copyright || "";
}

function renderProfile(p) {
  $("hero-greeting").textContent = p.greeting;
  $("hero-photo").innerHTML = `<img src="${esc(p.photo)}" alt="${esc(p.photoAlt)}">`;
  $("hero-status").innerHTML = `<span class="dot"></span>${esc(p.status)}`;
  $("hero-spec").textContent = p.specialty;
  $("hero-name").innerHTML = `I am<br>${esc(p.name)}`;
  // A space before each <br> keeps words apart when the phone layout hides the line breaks
  $("hero-role").innerHTML = (p.role || []).map(esc).join(" <br>");
  $("hero-subtitle").textContent = p.subtitle || "";
}

function renderProjects({ subtitle = "", items = [] } = {}) {
  $("projects-subtitle").textContent = subtitle;
  $("project-list").innerHTML = items
    .map(
      (p, i) => `
      <a class="project" href="${esc(projectUrl(p))}">
        <div class="project__img"><img src="${esc(p.image)}" alt="${esc(p.title)} rendering" ${i > 1 ? 'loading="lazy"' : ""}></div>
        <div class="project__body">
          <span class="project__num">${pad(i + 1)} · ${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          ${p.titleZh ? `<p class="zh">${esc(p.titleZh)}</p>` : ""}
          <p>${esc(p.description)}</p>
          <ul class="chips">${chips(p.tags)}</ul>
          <span class="project__more">View project <span aria-hidden="true">→</span></span>
        </div>
      </a>`
    )
    .join("");
}

function renderServices(list = []) {
  $("service-list").innerHTML = list
    .map(
      (s, i) => `
      <div class="service">
        <span class="service__num">${pad(i + 1)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`
    )
    .join("");
}

function renderAbout(a) {
  $("about-lead").textContent = a.lead;
  $("about-text").innerHTML = (a.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join("");
  $("about-stats").innerHTML = (a.stats || [])
    .map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
    .join("");
  $("about-image").innerHTML = a.image ? `<img src="${esc(a.image)}" alt="${esc(a.imageAlt)}" loading="lazy">` : "";
}

function renderExperience(list = []) {
  $("experience-list").innerHTML = list
    .map(
      (e) => `
      <div class="row">
        <span class="row__year">${esc(e.period)}</span>
        <div class="row__title">
          <h3>${esc(e.title)}</h3>
          ${e.zh ? `<p class="zh">${esc(e.zh)}</p>` : ""}
        </div>
        <ul class="row__list">${chips(e.tags)}</ul>
      </div>`
    )
    .join("");
}

function renderSkills({ software = [], languages = [], certificate } = {}) {
  $("skills-software").innerHTML = chips(software);
  $("skills-languages").innerHTML = languages
    .map((l) => `<li><span>${esc(l.name)}</span><small>${esc(l.level)}</small></li>`)
    .join("");

  const cert = $("skills-certificate");
  if (certificate) {
    cert.innerHTML = `
      ${certificate.image ? `<img src="${esc(certificate.image)}" alt="${esc(certificate.title)} certificate" loading="lazy">` : ""}
      <div>
        <h4>${esc(certificate.title)}</h4>
        <p>${esc(certificate.detail)}</p>
      </div>`;
  } else {
    cert.remove();
  }
}

function renderGallery(list = []) {
  $("gallery-list").innerHTML = list
    .map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">`)
    .join("");
}

function renderContact(c = {}) {
  $("contact-greeting").textContent = c.greeting || "";
  $("contact-title").textContent = c.title || "";
  $("contact-lead").textContent = c.lead || "";
  const email = $("contact-email");
  if (c.email) {
    email.href = `mailto:${c.email}`;
    email.textContent = c.email;
  } else {
    email.remove();
  }
}

loadPortfolio([
  ["site", (data) => renderSite(data.site)],
  ["profile", (data) => renderProfile(data.profile)],
  ["projects", (data) => renderProjects(data.projects)],
  ["services", (data) => renderServices(data.services)],
  ["about", (data) => renderAbout(data.about)],
  ["experience", (data) => renderExperience(data.experience)],
  ["skills", (data) => renderSkills(data.skills)],
  ["gallery", (data) => renderGallery(data.gallery)],
  ["contact", (data) => renderContact(data.contact)],
]);
