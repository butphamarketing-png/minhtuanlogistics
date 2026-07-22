/* MINH TUẤN — 1000 bài viết SEO (nội dung riêng từ data/news-posts.json) */
(() => {
  const COLORS = ["#003da5", "#005bff", "#0a2e6b", "#e31c23", "#134e4a", "#1e3a8a", "#312e81"];
  const ACCENTS = ["#00a3e0", "#7ec8ff", "#ffcc00", "#ffcc00", "#5eead4", "#fbbf24", "#c4b5fd"];
  const CAT_LABEL = {
    sea: "Đường biển",
    air: "Hàng không",
    road: "Đường bộ",
    customs: "Hải quan",
    warehouse: "Kho bãi",
    global: "Quốc tế",
    business: "Doanh nghiệp",
  };
  const CAT_INDEX = { sea: 0, air: 1, road: 2, customs: 3, warehouse: 4, global: 5, business: 6 };

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const coverSvg = (label, ci, i) => {
    const words = label.split(" ");
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const n = line ? `${line} ${w}` : w;
      if (n.length > 28 && line) {
        lines.push(line);
        line = w;
      } else line = n;
    });
    if (line) lines.push(line);
    const texts = lines
      .slice(0, 4)
      .map(
        (t, idx) =>
          `<text x="40" y="${180 + idx * 34}" fill="#fff" font-family="Arial,sans-serif" font-size="28" font-weight="700">${esc(t.charAt(0).toUpperCase() + t.slice(1))}</text>`
      )
      .join("");
    const catName = CAT_LABEL[Object.keys(CAT_INDEX).find((k) => CAT_INDEX[k] === ci)] || "Logistics";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${COLORS[ci]}"/><stop offset="100%" stop-color="#050505"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g${i})"/><circle cx="1000" cy="120" r="200" fill="${ACCENTS[ci]}" opacity=".15"/><rect x="40" y="150" width="110" height="6" rx="3" fill="${ACCENTS[ci]}"/>${texts}<text x="40" y="620" fill="${ACCENTS[ci]}" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="2">MINH TUAN LOGISTICS</text><text x="1160" y="620" fill="rgba(255,255,255,.7)" font-family="Arial,sans-serif" font-size="16" text-anchor="end">${catName}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const enrich = (posts) =>
    posts.map((p, i) => ({
      ...p,
      cover: coverSvg(p.keyword, CAT_INDEX[p.category] ?? 6, i),
    }));

  const boot = (raw) => {
    const posts = enrich(raw);
    window.NEWS_POSTS = posts;
    window.getNewsBySlug = (slug) => posts.find((p) => p.slug === slug);
    window.getLatestNews = (n = 4) => posts.slice().reverse().slice(0, n);
    window.getNewsPage = (page = 1, perPage = 24, filter = {}) => {
      let list = posts.slice().reverse();
      if (filter.cat) list = list.filter((p) => p.category === filter.cat);
      if (filter.q) {
        const q = filter.q.toLowerCase();
        list = list.filter(
          (p) =>
            p.keyword.toLowerCase().includes(q) ||
            p.title.toLowerCase().includes(q) ||
            p.slug.includes(q)
        );
      }
      const total = list.length;
      const pages = Math.ceil(total / perPage) || 1;
      const p = Math.max(1, Math.min(page, pages));
      const start = (p - 1) * perPage;
      return { items: list.slice(start, start + perPage), page: p, pages, total, perPage };
    };
    document.dispatchEvent(new CustomEvent("newsready", { detail: { count: posts.length } }));
  };

  fetch("/data/news-posts.json")
    .then((r) => {
      if (!r.ok) throw new Error("news-posts.json not found — run: npm run news");
      return r.json();
    })
    .then(boot)
    .catch((err) => {
      console.warn("News load failed:", err.message);
      boot([]);
    });
})();
