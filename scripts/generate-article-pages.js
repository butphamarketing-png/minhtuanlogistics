const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "bai-viet");
const SITE_URL = (() => {
  try {
    const settings = JSON.parse(fs.readFileSync(path.join(root, "data", "settings.json"), "utf8"));
    const raw = settings.siteUrl || settings.website || "https://minhtuanlogistics.com";
    if (String(raw).startsWith("http")) return String(raw).replace(/\/$/, "");
    return `https://${String(raw).replace(/^\/\//, "").replace(/\/$/, "")}`;
  } catch {
    return "https://minhtuanlogistics.com";
  }
})();

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const posts = JSON.parse(fs.readFileSync(path.join(root, "data", "news-posts.json"), "utf8"));

const sectionHtml = (sections, body) => {
  if (sections?.length) {
    return sections
      .map((s) => (s.type === "h2" ? `<h2>${esc(s.text)}</h2>` : `<p>${esc(s.text)}</p>`))
      .join("\n          ");
  }
  return (body || []).map((p) => `<p>${esc(p)}</p>`).join("\n          ");
};

const relatedHtml = (post, all) => {
  const related = all
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  if (!related.length) return "";
  return `
        <aside class="article-related">
          <h2>Bài viết liên quan</h2>
          <ul>
            ${related
              .map(
                (p) =>
                  `<li><a href="/bai-viet/${esc(p.slug)}">${esc(p.title)}</a></li>`
              )
              .join("\n            ")}
          </ul>
        </aside>`;
};

const render = (post, all) => {
  const url = `${SITE_URL}/bai-viet/${post.slug}`;
  const title = `${post.title} | MINH TUẤN Logistics`;
  const description = (post.metaDescription || post.excerpt || "").slice(0, 160);
  const image = post.photo || `${SITE_URL}/logo.png`;
  const content = sectionHtml(post.sections, post.body);

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
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:site_name" content="MINH TUẤN Logistics" />
    <meta property="article:published_time" content="${esc(post.date)}" />
    <meta property="article:section" content="${esc(post.categoryLabel)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <link rel="icon" href="/logo.png" type="image/png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description,
  image: [image],
  datePublished: post.date,
  dateModified: post.date,
  author: { "@type": "Organization", name: "CÔNG TY TNHH XNK TM DV MINH TUẤN" },
  publisher: {
    "@type": "Organization",
    name: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": url },
  keywords: post.keyword,
})}
    </script>
  </head>
  <body data-page="article">
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
      <section class="subpage-section article-section">
        <div class="container" id="articleRoot">
          <article class="article-detail" itemscope itemtype="https://schema.org/Article">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Trang chủ</a><span aria-hidden="true">/</span>
              <a href="/tin-tuc">Tin tức</a><span aria-hidden="true">/</span>
              <span>${esc(post.keyword)}</span>
            </nav>
            <div class="article-hero">
              <img src="${esc(image)}" alt="${esc(post.imageAlt || post.keyword)}" itemprop="image" width="1200" height="675" />
            </div>
            <div class="article-meta">
              <span class="news-card-tag">${esc(post.categoryLabel)}</span>
              <time datetime="${esc(post.date)}" itemprop="datePublished">${esc(post.dateLabel)}</time>
              <span class="article-keyword">Từ khóa chính: <strong>${esc(post.keyword)}</strong></span>
            </div>
            <h1 itemprop="headline">${esc(post.title)}</h1>
            <p class="article-lead" itemprop="description">${esc(post.excerpt)}</p>
            <div class="article-content" itemprop="articleBody">
          ${content}
            </div>
            <div class="article-cta">
              <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
              <a class="btn btn-ghost" href="/lien-he">Gửi yêu cầu tư vấn</a>
            </div>
          </article>${relatedHtml(post, all)}
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="container footer-bottom">
        <p>© 2026 CÔNG TY TNHH XNK TM DV MINH TUẤN. All Rights Reserved.</p>
        <a href="/tin-tuc">← Tất cả tin tức</a>
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

if (fs.existsSync(outDir)) {
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith(".html")) fs.unlinkSync(path.join(outDir, f));
  }
} else {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const post of posts) {
  if (!post.slug) continue;
  fs.writeFileSync(path.join(outDir, `${post.slug}.html`), render(post, posts), "utf8");
}

console.log(`Generated ${posts.length} article pages in bai-viet/`);
console.log(`Site URL: ${SITE_URL}`);
