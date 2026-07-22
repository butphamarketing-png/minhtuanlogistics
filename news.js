(() => {
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const cardHtml = (p) => `
    <article class="news-card">
      <a class="news-card-link" href="bai-viet.html?slug=${encodeURIComponent(p.slug)}">
        <div class="news-card-media">
          <img src="${p.cover}" alt="${esc(p.keyword)}" loading="lazy" />
          <span class="news-card-tag">${esc(p.categoryLabel)}</span>
        </div>
        <div class="news-card-body">
          <time datetime="${p.date}">${esc(p.dateLabel)}</time>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <span class="news-card-more">Đọc tiếp →</span>
        </div>
      </a>
    </article>`;

  window.initNews = () => {
    const posts = window.NEWS_POSTS || [];
    if (!posts.length) return;

    const grid = document.getElementById("newsGrid");
    if (grid) {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      const q = (params.get("q") || "").trim().toLowerCase();
      let list = posts.slice().reverse();
      if (cat) list = list.filter((p) => p.category === cat);
      if (q) list = list.filter((p) => p.keyword.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
      grid.innerHTML = list.map(cardHtml).join("");
      const count = document.getElementById("newsCount");
      if (count) count.textContent = `${list.length} bài viết`;
    }

    const articleRoot = document.getElementById("articleRoot");
    if (articleRoot) {
      const slug = new URLSearchParams(window.location.search).get("slug");
      const post = slug ? window.getNewsBySlug?.(slug) : null;
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
      const related = posts
        .filter((p) => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

      articleRoot.innerHTML = `
      <article class="article-detail">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Trang chủ</a><span aria-hidden="true">/</span>
          <a href="tin-tuc.html">Tin tức</a><span aria-hidden="true">/</span>
          <span>${esc(post.keyword)}</span>
        </nav>
        <div class="article-hero">
          <img src="${post.cover}" alt="${esc(post.keyword)}" />
        </div>
        <div class="article-meta">
          <span class="news-card-tag">${esc(post.categoryLabel)}</span>
          <time datetime="${post.date}">${esc(post.dateLabel)}</time>
          <span class="article-keyword">Từ khóa: ${esc(post.keyword)}</span>
        </div>
        <h1>${esc(post.title)}</h1>
        <div class="article-photo">
          <img src="${post.photo}" alt="${esc(post.keyword)}" loading="lazy" />
        </div>
        <div class="article-content">
          ${post.body.map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div class="article-cta">
          <a class="btn btn-cta" href="tel:0938961012">Gọi tư vấn 0938 961 012</a>
          <a class="btn btn-ghost" href="lien-he.html">Gửi yêu cầu tư vấn</a>
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
        <a href="bai-viet.html?slug=${encodeURIComponent(p.slug)}" class="news-featured-link">
          <img src="${p.cover}" alt="${esc(p.keyword)}" loading="lazy" />
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
          <a href="bai-viet.html?slug=${encodeURIComponent(p.slug)}" class="news-feed-link">
            <div class="news-feed-thumb"><img src="${p.cover}" alt="${esc(p.keyword)}" loading="lazy" /></div>
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

  window.initNews();
  document.addEventListener("cmsready", () => window.initNews());
})();
