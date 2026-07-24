const fs = require("fs");
const path = require("path");
const { esc, linkify } = require("../lib/markdown-links");

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

const posts = JSON.parse(fs.readFileSync(path.join(root, "data", "news-posts.json"), "utf8"));

const sectionHtml = (post) => {
  const sections = post.sections || [];
  const images = Array.isArray(post.images) ? post.images.filter((i) => i && (i.src || i.url)) : [];
  const parts = [];

  if (sections.length) {
    sections.forEach((s, i) => {
      if (s.type === "h2" || s.heading) {
        const heading = s.heading || s.text;
        const id = `muc-${i + 1}`;
        parts.push(`<h2 id="${id}">${esc(heading)}</h2>`);
      }
      if (s.paragraphs?.length) {
        s.paragraphs.forEach((p) => parts.push(`<p>${linkify(p)}</p>`));
      } else if (s.type === "p" && s.text) {
        parts.push(`<p>${linkify(s.text)}</p>`);
      } else if (s.text && s.type !== "h2" && !s.heading) {
        parts.push(`<p>${linkify(s.text)}</p>`);
      }
      const img = images[i + 1];
      if (img) {
        parts.push(
          `<figure class="seo-figure"><img src="${esc(img.src || img.url)}" alt="${esc(img.alt || post.keyword || "")}" width="1200" height="675" loading="lazy" /></figure>`
        );
      }
    });
  } else {
    (post.body || []).forEach((p) => parts.push(`<p>${linkify(p)}</p>`));
  }

  // ensure remaining images after content
  for (let i = sections.length + 1; i < images.length; i++) {
    const img = images[i];
    parts.push(
      `<figure class="seo-figure"><img src="${esc(img.src || img.url)}" alt="${esc(img.alt || post.keyword || "")}" width="1200" height="675" loading="lazy" /></figure>`
    );
  }

  parts.push(
    `<p>Cần hỗ trợ nhanh? Hãy <a class="ext-link" href="https://zalo.me/0938961012" target="_blank" rel="noopener">liên hệ Zalo Minh Tuấn Logistics</a> để được tư vấn báo giá.</p>`
  );

  return parts.join("\n          ");
};

const tocHtml = (post) => {
  const headings = (post.sections || [])
    .map((s, i) => ({ text: s.heading || (s.type === "h2" ? s.text : ""), i }))
    .filter((h) => h.text);
  if (headings.length < 2) return "";
  return `
            <nav class="article-toc" aria-label="Mục lục">
              <strong>Mục lục</strong>
              <ol>
                ${headings
                  .map((h) => `<li><a href="#muc-${h.i + 1}">${esc(h.text)}</a></li>`)
                  .join("\n                ")}
              </ol>
            </nav>`;
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
  const title = post.metaTitle || `${post.title} | MINH TUẤN Logistics`;
  const description = (post.metaDescription || post.excerpt || "").slice(0, 160);
  const images = Array.isArray(post.images) ? post.images : [];
  const image = images[0]?.src || post.photo || `${SITE_URL}/logo.png`;
  const imageAlt = images[0]?.alt || post.imageAlt || post.keyword || "";
  const content = sectionHtml(post);
  const keywords = [post.keyword, ...(post.secondaryKeywords || [])].filter(Boolean).join(", ");

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
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
  image: images.length ? images.map((i) => i.src || i.url).filter(Boolean) : [image],
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
        <a href="/" class="logo"><img class="logo-image" src="/logo.png" alt="Logo Minh Tuấn Logistics" /><span class="logo-text"><strong>MINH TUẤN</strong><small>Logistics</small></span></a>
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
              <img src="${esc(image)}" alt="${esc(imageAlt)}" itemprop="image" width="1200" height="675" />
            </div>
            <div class="article-meta">
              <span class="news-card-tag">${esc(post.categoryLabel)}</span>
              <time datetime="${esc(post.date)}" itemprop="datePublished">${esc(post.dateLabel)}</time>
              <span class="article-keyword">Từ khóa chính: <strong>${esc(post.keyword)}</strong></span>
            </div>
            <h1 itemprop="headline">${esc(post.title)}</h1>
            <p class="article-lead" itemprop="description">${esc(post.excerpt)}</p>
            ${tocHtml(post)}
            <div class="article-content" itemprop="articleBody">
          ${content}
            </div>
            <div class="article-cta">
              <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
              <a class="btn btn-ghost" href="/lien-he">Gửi yêu cầu tư vấn</a>
              <a class="btn btn-ghost" href="/dich-vu">Xem dịch vụ logistics</a>
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
