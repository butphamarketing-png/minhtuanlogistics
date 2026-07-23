(() => {
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const PER_PAGE = 24;

  const cardHtml = (p) => `
    <article class="news-card">
      <a class="news-card-link" href="/bai-viet/${encodeURIComponent(p.slug)}" title="${esc(p.title)}">
        <div class="news-card-media">
          <img src="${p.cover}" alt="${esc(p.imageAlt || p.keyword)}" loading="lazy" width="400" height="225" />
          <span class="news-card-tag">${esc(p.categoryLabel)}</span>
        </div>
        <div class="news-card-body">
          <time datetime="${p.date}">${esc(p.dateLabel)}</time>
          <h2 class="news-card-title">${esc(p.title)}</h2>
          <p>${esc(p.excerpt)}</p>
          <span class="news-card-more">Đọc tiếp →</span>
        </div>
      </a>
    </article>`;

  const sectionHtml = (sections) =>
    (sections || [])
      .map((s) => {
        if (s.type === "h2") return `<h2>${esc(s.text)}</h2>`;
        return `<p>${esc(s.text)}</p>`;
      })
      .join("");

  const paginationHtml = (page, pages, params) => {
    if (pages <= 1) return "";
    const mk = (p, label, active = false) => {
      const q = new URLSearchParams(params);
      if (p > 1) q.set("page", String(p));
      else q.delete("page");
      const href = `tin-tuc.html${q.toString() ? `?${q}` : ""}`;
      return active
        ? `<span class="news-page is-active" aria-current="page">${label}</span>`
        : `<a class="news-page" href="${href}">${label}</a>`;
    };
    const parts = [];
    if (page > 1) parts.push(mk(page - 1, "‹ Trước"));
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) {
      parts.push(mk(1, "1"));
      if (start > 2) parts.push('<span class="news-page-ellipsis">…</span>');
    }
    for (let i = start; i <= end; i++) parts.push(mk(i, String(i), i === page));
    if (end < pages) {
      if (end < pages - 1) parts.push('<span class="news-page-ellipsis">…</span>');
      parts.push(mk(pages, String(pages)));
    }
    if (page < pages) parts.push(mk(page + 1, "Sau ›"));
    return `<nav class="news-pagination" aria-label="Phân trang tin tức">${parts.join("")}</nav>`;
  };

  window.initNews = () => {
    const posts = window.NEWS_POSTS || [];
    if (!posts.length) return;

    const grid = document.getElementById("newsGrid");
    if (grid) {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat") || "";
      const q = (params.get("q") || "").trim();
      const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
      const result = window.getNewsPage?.(page, PER_PAGE, { cat, q }) || {
        items: posts.slice().reverse(),
        page: 1,
        pages: 1,
        total: posts.length,
      };

      grid.innerHTML = result.items.map(cardHtml).join("");

      const count = document.getElementById("newsCount");
      if (count) {
        const filterNote = q || cat ? ` (đang lọc: ${result.total} kết quả)` : "";
        count.textContent = `${result.total} bài viết SEO${filterNote}`;
      }

      let pag = document.getElementById("newsPagination");
      if (!pag) {
        pag = document.createElement("div");
        pag.id = "newsPagination";
        grid.parentElement.appendChild(pag);
      }
      const pagParams = {};
      if (cat) pagParams.cat = cat;
      if (q) pagParams.q = q;
      pag.innerHTML = paginationHtml(result.page, result.pages, pagParams);
    }

    const articleRoot = document.getElementById("articleRoot");
    if (articleRoot) {
      const pathSlug = (window.location.pathname.match(/\/bai-viet\/([^/]+)\/?$/) || [])[1];
      const slug = pathSlug || new URLSearchParams(window.location.search).get("slug");
      const post = slug ? window.getNewsBySlug?.(decodeURIComponent(slug)) : null;
      if (!post) {
        articleRoot.innerHTML = `
        <div class="article-missing">
          <h1>Không tìm thấy bài viết</h1>
          <p>Bài viết không tồn tại hoặc đường dẫn không đúng.</p>
          <a class="btn btn-cta" href="tin-tuc.html">← Về trang tin tức</a>
        </div>`;
        return;
      }

      document.title = `${post.title} | MINH TUẤN Logistics`;
      window.SEO?.applyArticle?.(post);
      const related = posts
        .filter((p) => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

      const contentHtml = post.sections ? sectionHtml(post.sections) : post.body.map((p) => `<p>${esc(p)}</p>`).join("");

      articleRoot.innerHTML = `
      <article class="article-detail" itemscope itemtype="https://schema.org/Article">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Trang chủ</a><span aria-hidden="true">/</span>
          <a href="tin-tuc.html">Tin tức</a><span aria-hidden="true">/</span>
          <span>${esc(post.keyword)}</span>
        </nav>
        <div class="article-hero">
          <img src="${post.cover}" alt="${esc(post.imageAlt || post.keyword)}" itemprop="image" width="1200" height="675" />
        </div>
        <div class="article-meta">
          <span class="news-card-tag">${esc(post.categoryLabel)}</span>
          <time datetime="${post.date}" itemprop="datePublished">${esc(post.dateLabel)}</time>
          <span class="article-keyword">Từ khóa chính: <strong>${esc(post.keyword)}</strong></span>
        </div>
        <h1 itemprop="headline">${esc(post.title)}</h1>
        <p class="article-lead" itemprop="description">${esc(post.excerpt)}</p>
        <div class="article-photo">
          <img src="${post.photo}" alt="${esc(post.imageAlt || post.keyword)} - MINH TUẤN Logistics" loading="lazy" width="1200" height="675" />
        </div>
        <div class="article-content" itemprop="articleBody">
          ${contentHtml}
        </div>
        <div class="article-cta">
          <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
          <a class="btn btn-ghost" href="lien-he.html">Gửi yêu cần tư vấn</a>
        </div>
      </article>
      ${
        related.length
          ? `<section class="article-related"><h2>Bài viết liên quan</h2><div class="news-grid">${related.map(cardHtml).join("")}</div></section>`
          : ""
      }`;
    }

    const homeNews = document.getElementById("homeNewsFeed");
    const homeFeatured = document.getElementById("homeNewsFeatured");
    if (homeNews || homeFeatured) {
      const latest = window.getLatestNews?.(4) || [];
      if (homeFeatured && latest[0]) {
        const p = latest[0];
        homeFeatured.innerHTML = `
        <a href="/bai-viet/${encodeURIComponent(p.slug)}" class="news-featured-link">
          <img src="${p.cover}" alt="${esc(p.imageAlt || p.keyword)}" loading="lazy" />
          <div class="news-featured-overlay">
            <time class="news-date news-date--light" datetime="${p.date}">${esc(p.dateLabel)}</time>
            <h3>${esc(p.title)}</h3>
          </div>
        </a>`;
      }
      if (homeNews) {
        homeNews.innerHTML = latest
          .slice(1)
          .map(
            (p) => `
        <article class="news-feed-item">
          <span class="news-feed-dot" aria-hidden="true"></span>
          <a href="/bai-viet/${encodeURIComponent(p.slug)}" class="news-feed-link">
            <div class="news-feed-thumb"><img src="${p.cover}" alt="${esc(p.imageAlt || p.keyword)}" loading="lazy" /></div>
            <div class="news-feed-body">
              <time class="news-date" datetime="${p.date}">${esc(p.dateLabel)}</time>
              <h3>${esc(p.title)}</h3>
            </div>
          </a>
        </article>`
          )
          .join("");
      }
    }
  };

  document.addEventListener("newsready", () => window.initNews());
  document.addEventListener("cmsready", () => window.initNews());
  if (window.NEWS_POSTS?.length) window.initNews();
})();
