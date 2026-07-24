const fs = require("fs");
const path = require("path");
const { esc, linkify } = require("../lib/markdown-links");

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

const clearHtmlDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".html")) fs.unlinkSync(path.join(dir, f));
  }
};

const figureHtml = (img, idx) => {
  if (!img?.src) return "";
  return `
            <figure class="seo-figure">
              <img src="${esc(img.src)}" alt="${esc(img.alt)}" width="1200" height="675" loading="${idx === 0 ? "eager" : "lazy"}" />
              ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
            </figure>`;
};

const relatedLinks = (page, siblings) => {
  const others = siblings.filter((p) => p.slug !== page.slug).slice(0, 4);
  if (!others.length) return "";
  return `
      <section class="subpage-section">
        <div class="container">
          <h2 class="subpage-related-title">Dịch vụ & nội dung liên quan</h2>
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

const buildBodyHtml = (page) => {
  const images = Array.isArray(page.images) ? page.images.slice(0, 5) : [];
  const sections = page.sections || [];
  const parts = [];

  // Image 1 at top of article
  if (images[0]) parts.push(figureHtml(images[0], 0));

  sections.forEach((s, i) => {
    parts.push(`
            <h2>${esc(s.heading)}</h2>
            ${(s.paragraphs || []).map((p) => `<p>${linkify(p)}</p>`).join("\n            ")}`);
    // Place remaining images after each section (images 2–5)
    const img = images[i + 1];
    if (img) parts.push(figureHtml(img, i + 1));
  });

  // Ensure all 5 images appear even if fewer sections
  for (let i = sections.length + 1; i < images.length; i++) {
    parts.push(figureHtml(images[i], i));
  }

  return parts.join("\n");
};

const buildSchemas = (page, url, description) => {
  const schemas = [];
  const primary = page.primaryKeyword || page.title;
  const secondary = page.secondaryKeywords || [];
  const images = (page.images || []).map((i) => i.src).filter(Boolean);

  schemas.push({
    "@context": "https://schema.org",
    "@type": page.parent === "dich-vu" ? "Service" : "AboutPage",
    name: page.title,
    description,
    url,
    keywords: [primary, ...secondary].join(", "),
    image: images,
    provider: {
      "@type": "Organization",
      name: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
      url: SITE_URL,
      telephone: "0938961012",
      address: {
        "@type": "PostalAddress",
        streetAddress: "69/1 Trần Quốc Hoàn, P. Tân Sơn Nhất",
        addressLocality: "TP. Hồ Chí Minh",
        addressCountry: "VN",
      },
    },
    areaServed: { "@type": "City", name: "Ho Chi Minh City" },
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: page.parentLabel,
        item: `${SITE_URL}/${page.parent}`,
      },
      { "@type": "ListItem", position: 3, name: page.title, item: url },
    ],
  });

  if (page.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return schemas
    .map(
      (s, i) => `    <script type="application/ld+json" id="schema-${i}">
${JSON.stringify(s)}
    </script>`
    )
    .join("\n");
};

const render = (page, siblings) => {
  const url = `${SITE_URL}/${page.parent}/${page.slug}`;
  const title = page.metaTitle || `${page.title} | MINH TUẤN Logistics`;
  const description = page.metaDescription || page.lead;
  const primary = page.primaryKeyword || "";
  const secondary = page.secondaryKeywords || [];
  const keywordsMeta = [primary, ...secondary].filter(Boolean).join(", ");
  const ogImage = page.images?.[0]?.src || `${SITE_URL}/logo.png`;
  const bodyHtml = buildBodyHtml(page);
  const highlightsHtml = (page.highlights || [])
    .map((h) => `<li>${esc(h)}</li>`)
    .join("\n              ");
  const faqHtml = (page.faq || [])
    .map(
      (f) => `
            <details class="faq-item">
              <summary>${esc(f.q)}</summary>
              <p>${esc(f.a)}</p>
            </details>`
    )
    .join("");

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="${esc(keywordsMeta)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${esc(url)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:site_name" content="MINH TUẤN Logistics" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <link rel="icon" href="/logo.png" type="image/png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
${buildSchemas(page, url, description)}
  </head>
  <body data-page="${page.parent === "dich-vu" ? "services" : "about"}">
    <div class="site-header" id="siteHeader">
      <div class="topbar"><div class="topbar-inner"><div class="topbar-marquee"><div class="topbar-track">
        <span class="topbar-chip">Hotline: 0938 961 012</span><span class="topbar-dot">•</span>
        <span class="topbar-chip">contact@minhtuan.vn</span><span class="topbar-gap"></span>
        <span class="topbar-chip">Hotline: 0938 961 012</span>
      </div></div></div></div>
      <nav class="navbar"><div class="container nav-inner">
        <a href="/" class="logo"><img class="logo-image" src="/logo.png" alt="Logo Minh Tuấn Logistics TP.HCM" /><span class="logo-text"><strong>MINH TUẤN</strong><small>Logistics</small></span></a>
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
          ${
            primary
              ? `<p class="seo-keyword-line"><strong>Từ khóa chính:</strong> ${esc(primary)}${
                  secondary.length
                    ? ` · <strong>Từ khóa phụ:</strong> ${esc(secondary.join(", "))}`
                    : ""
                }</p>`
              : ""
          }
        </div>
      </section>
      <section class="subpage-section">
        <div class="container subpage-card article-detail">
${bodyHtml}
          ${
            highlightsHtml
              ? `<h2>Điểm nổi bật ${esc(primary || page.title)}</h2>
          <ul class="subpage-highlights">
              ${highlightsHtml}
          </ul>`
              : ""
          }
          ${
            faqHtml
              ? `<h2>Câu hỏi thường gặp về ${esc(primary || page.title)}</h2>
          <div class="faq-list">${faqHtml}
          </div>`
              : ""
          }
          <div class="article-cta" style="margin-top:28px">
            <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
            <a class="btn btn-ghost" href="/lien-he">Nhận báo giá ${esc(primary || "dịch vụ")}</a>
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
    const imgs = page.images || [];
    if (page.parent === "dich-vu" && imgs.length < 5) {
      console.warn(`⚠ ${page.slug}: cần 5 ảnh, hiện có ${imgs.length}`);
    }
    fs.writeFileSync(path.join(dir, `${page.slug}.html`), render(page, pages), "utf8");
  }
  return pages.length;
};

const aboutCount = writeGroup(data.about || []);
const serviceCount = writeGroup(data.services || []);
console.log(`Generated ${aboutCount} about pages in gioi-thieu/`);
console.log(`Generated ${serviceCount} service pages in dich-vu/`);
console.log(`Site URL: ${SITE_URL}`);
