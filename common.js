// Helpers shared by the home page (script.js) and the project detail page (project.js).

const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pad = (n) => String(n).padStart(2, "0");
const $ = (id) => document.getElementById(id);
const chips = (items = []) => items.map((t) => `<li>${esc(t)}</li>`).join("");

// Link to a project's detail page, e.g. project.html?p=youth-hostel
const projectUrl = (project) => `project.html?p=${encodeURIComponent(project.slug)}`;

function showError(html, err) {
  if (err) console.error(err);
  $("load-error").innerHTML = html;
  $("load-error").hidden = false;
}

// Loads data.json, then runs each [name, render(data)] pair on its own
// so one bad section doesn't blank the rest of the page.
function loadPortfolio(sections) {
  fetch("data.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(
      (text) => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          // Usually a missing/extra comma or quote after editing data.json
          return showError(`<code>data.json</code> has a formatting mistake: ${esc(err.message)}`, err);
        }

        const failed = [];
        for (const [name, render] of sections) {
          try {
            render(data);
          } catch (err) {
            console.error(`Problem in the "${name}" section of data.json`, err);
            failed.push(name);
          }
        }
        if (failed.length) {
          showError(`Check these parts of <code>data.json</code>: ${failed.map(esc).join(", ")} (see the browser console for details).`);
        }
      },
      (err) =>
        showError(
          `Couldn't load <code>data.json</code>. Open this site through a web server
           (or a host like GitHub Pages) rather than double-clicking the HTML file.`,
          err
        )
    );
}
