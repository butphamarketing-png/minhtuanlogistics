/** Convert markdown [label](url) into HTML anchors after HTML-escaping. */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkify(text) {
  return esc(text).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_, label, href) => {
    const safeHref = String(href).replace(/"/g, "");
    const external = /^https?:\/\//i.test(safeHref);
    const cls = external ? "ext-link" : "int-link";
    const extra = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="${cls}" href="${safeHref}"${extra}>${label}</a>`;
  });
}

module.exports = { esc, linkify };
