const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const getSiteUrl = () => {
  try {
    const settings = JSON.parse(fs.readFileSync(path.join(root, "data", "settings.json"), "utf8"));
    const raw = settings.siteUrl || settings.website || "https://minhtuanlogistics.com";
    if (String(raw).startsWith("http")) return String(raw).replace(/\/$/, "");
    return `https://${String(raw).replace(/^\/\//, "").replace(/\/$/, "")}`;
  } catch {
    return "https://minhtuanlogistics.com";
  }
};

const SITE_URL = getSiteUrl();
const data = JSON.parse(fs.readFileSync(path.join(root, "data", "subpages.json"), "utf8"));

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clearHtmlDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".html")) fs.unlinkSync(path.join(dir, f));
  }
};

const relatedLinks = (page, siblings) => {
  const others = siblings.filter((p) => p.slug !== page.slug);
  if (!others.length) return "";
  return `
      <section class="subpage-section">
        <div class="container">
          <h2 class="subpage-related-title">Xem thêm</h2>
          <div class="subpage-grid">
            ${others
              .map(
                (p) => `
            <a class="subpage-card subpage-card-link" href="/${page.parent}/${p.slug}">
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.lead)}</p>
            </a>`
              )
              .join("")}
          </div>
        </div>
      </section>`;
};

const render = (page, siblings) => {
  const url = `${SITE_URL}/${page.parent}/${page.slug}`;
  const title = page.metaTitle || `${page.title} | MINH TUẤN Logistics`;
  const description = page.metaDescription || page.lead;
  const sectionsHtml = (page.sections || [])
    .map(
      (s) => `
            <h2>${esc(s.heading)}</h2>
            ${(s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("\n            ")}`
    )
    .join("\n");
  const highlightsHtml = (page.highlights || [])
    .map((h) => `<li>${esc(h)}</li>`)
    .join("\n              ");

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${esc(url)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${SITE_URL}/logo.png" />
    <meta property="og:site_name" content="MINH TUẤN Logistics" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/logo.png" type="image/png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: page.title,
  description,
  url,
  isPartOf: { "@type": "WebSite", name: "MINH TUẤN Logistics", url: SITE_URL },
  provider: {
    "@type": "Organization",
    name: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
    url: SITE_URL,
    telephone: "0938961012",
  },
})}
    </script>
  </head>
  <body data-page="${page.parent === "dich-vu" ? "services" : "about"}">
    <div class="site-header" id="siteHeader">
      <div class="topbar"><div class="topbar-inner"><div class="topbar-marquee"><div class="topbar-track">
        <span class="topbar-chip">Hotline: 0938 961 012</span><span class="topbar-dot">•</span>
        <span class="topbar-chip">contact@minhtuan.vn</span><span class="topbar-gap"></span>
        <span class="topbar-chip">Hotline: 0938 961 012</span>
      </div></div></div></div>
      <nav class="navbar"><div class="container nav-inner">
        <a href="/" class="logo"><img class="logo-image" src="/logo.png" alt="Logo" /><span class="logo-text"><strong>MINH TUẤN</strong><small>Logistics</small></span></a>
        <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="mainMenu"><span></span><span></span><span></span></button>
        <ul class="menu" id="mainMenu" data-nav-build></ul>
        <a class="btn btn-hotline nav-cta" href="tel:0938961012">0938 961 012</a>
      </div></nav>
    </div>
    <div class="menu-overlay" id="menuOverlay" hidden></div>
    <main>
      <section class="subpage-hero">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Trang chủ</a><span aria-hidden="true">/</span>
            <a href="/${page.parent}">${esc(page.parentLabel)}</a><span aria-hidden="true">/</span>
            <span>${esc(page.title)}</span>
          </nav>
          <h1>${esc(page.title)}</h1>
          <p>${esc(page.lead)}</p>
        </div>
      </section>
      <section class="subpage-section">
        <div class="container subpage-card article-detail">
${sectionsHtml}
          ${
            highlightsHtml
              ? `<h2>Điểm nổi bật</h2>
          <ul class="subpage-highlights">
              ${highlightsHtml}
          </ul>`
              : ""
          }
          <div class="article-cta" style="margin-top:28px">
            <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
            <a class="btn btn-ghost" href="/lien-he">Gửi yêu cầu tư vấn</a>
          </div>
        </div>
      </section>
      ${relatedLinks(page, siblings)}
    </main>
    <footer class="footer">
      <div class="container footer-bottom">
        <p>© 2026 CÔNG TY TNHH XNK TM DV MINH TUẤN. All Rights Reserved.</p>
        <a href="/${page.parent}">← ${esc(page.parentLabel)}</a>
      </div>
    </footer>
    <script src="/translations.js"></script>
    <script src="/i18n.js"></script>
    <script src="/nav.js"></script>
    <script src="/site-cms.js"></script>
    <script src="/script.js"></script>
  </body>
</html>
`;
};

const writeGroup = (pages) => {
  if (!pages?.length) return 0;
  const dir = path.join(root, pages[0].parent);
  clearHtmlDir(dir);
  for (const page of pages) {
    fs.writeFileSync(path.join(dir, `${page.slug}.html`), render(page, pages), "utf8");
  }
  return pages.length;
};

const aboutCount = writeGroup(data.about || []);
const serviceCount = writeGroup(data.services || []);
console.log(`Generated ${aboutCount} about pages in gioi-thieu/`);
console.log(`Generated ${serviceCount} service pages in dich-vu/`);
console.log(`Site URL: ${SITE_URL}`);
