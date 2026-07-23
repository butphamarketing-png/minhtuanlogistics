const path = require("path");
const fs = require("fs");
const SEOChecklist = require("../lib/seo-checklist");

const root = path.resolve(__dirname, "..");

const loadJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

const news = loadJson("data/news-posts.json");
const sub = loadJson("data/subpages.json");
const about = sub.about || [];
const services = sub.services || [];

const summarize = (label, items, mapFn) => {
  const rows = items.map(mapFn);
  const pass = rows.filter((r) => r.canPublish);
  const fail = rows.filter((r) => !r.canPublish);
  const avg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length)
    : 0;
  const crit = {};
  rows.forEach((r) => {
    Object.values(r.groups || {}).forEach((g) => {
      g.items
        .filter((i) => !i.ok && i.critical)
        .forEach((i) => {
          const key = i.message.slice(0, 80);
          crit[key] = (crit[key] || 0) + 1;
        });
    });
  });
  const topCrit = Object.entries(crit)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  console.log("\n" + "=".repeat(64));
  console.log(label);
  console.log("=".repeat(64));
  console.log(`Tổng: ${rows.length} | Đạt xuất bản: ${pass.length} | Chưa đạt: ${fail.length}`);
  console.log(`Điểm TB: ${avg}/100`);
  console.log(
    `Phổ điểm: ≥80 ${rows.filter((r) => r.score >= 80).length} | 50–79 ${rows.filter((r) => r.score >= 50 && r.score < 80).length} | <50 ${rows.filter((r) => r.score < 50).length}`
  );
  if (topCrit.length) {
    console.log("\nLỗi bắt buộc phổ biến:");
    topCrit.forEach(([msg, n]) => console.log(`  [${n}] ${msg}`));
  }
  if (fail.length && fail.length <= 12) {
    console.log("\nChi tiết chưa đạt:");
    fail.forEach((r) => console.log(`  - ${r.id} | ${r.score} | ${r.keyword}`));
  } else if (fail.length) {
    console.log("\nMẫu 10 bài chưa đạt:");
    fail.slice(0, 10).forEach((r) => console.log(`  - ${r.id} | ${r.score} | words=${r.stats.words} imgs=${r.stats.images}`));
  }
  return { label, total: rows.length, pass: pass.length, fail: fail.length, avg, rows };
};

const newsResult = summarize("TIN TỨC (news-posts.json)", news, (p) => {
  const r = SEOChecklist.analyze(p, { existingPosts: news, currentId: p.id });
  return { ...r, id: p.slug, keyword: p.keyword };
});

const svcResult = summarize("DỊCH VỤ (subpages services)", services, (p) => {
  const post = {
    ...p,
    id: p.slug,
    keyword: p.primaryKeyword,
    metaTitle: p.metaTitle,
    title: p.title,
    slug: p.slug,
    metaDescription: p.metaDescription,
    excerpt: p.lead,
    headings: (p.sections || []).map((s) => s.heading),
    sections: (p.sections || []).map((s) => ({
      type: "h2",
      heading: s.heading,
      text: s.heading,
      paragraphs: s.paragraphs || [],
    })),
    body: (p.sections || []).flatMap((s) => s.paragraphs || []),
    images: p.images || [],
    internalLinks: [`/${p.parent}`, "/lien-he", "/tin-tuc"],
    externalLinks: ["https://www.customs.gov.vn/"],
  };
  const r = SEOChecklist.analyze(post, {
    existingPosts: services.map((x) => ({ id: x.slug, slug: x.slug, keyword: x.primaryKeyword })),
    currentId: p.slug,
  });
  return { ...r, id: `/${p.parent}/${p.slug}`, keyword: p.primaryKeyword };
});

const aboutResult = summarize("GIỚI THIỆU (subpages about)", about, (p) => {
  const post = {
    ...p,
    id: p.slug,
    keyword: p.primaryKeyword,
    metaTitle: p.metaTitle,
    title: p.title,
    slug: p.slug,
    metaDescription: p.metaDescription,
    excerpt: p.lead,
    headings: (p.sections || []).map((s) => s.heading),
    sections: (p.sections || []).map((s) => ({
      type: "h2",
      heading: s.heading,
      text: s.heading,
      paragraphs: s.paragraphs || [],
    })),
    body: (p.sections || []).flatMap((s) => s.paragraphs || []),
    images: p.images || [],
    internalLinks: ["/", "/gioi-thieu", "/dich-vu", "/lien-he"],
    externalLinks: ["https://www.customs.gov.vn/"],
  };
  const r = SEOChecklist.analyze(post, {
    existingPosts: about.map((x) => ({ id: x.slug, slug: x.slug, keyword: x.primaryKeyword })),
    currentId: p.slug,
  });
  return { ...r, id: `/${p.parent}/${p.slug}`, keyword: p.primaryKeyword };
});

// Static hub pages (lightweight checks)
const hubs = [
  { file: "index.html", path: "/", name: "Trang chủ" },
  { file: "gioi-thieu.html", path: "/gioi-thieu", name: "Giới thiệu" },
  { file: "dich-vu.html", path: "/dich-vu", name: "Dịch vụ" },
  { file: "tin-tuc.html", path: "/tin-tuc", name: "Tin tức" },
  { file: "lien-he.html", path: "/lien-he", name: "Liên hệ" },
  { file: "du-an.html", path: "/du-an", name: "Dự án" },
  { file: "hinh-anh.html", path: "/hinh-anh", name: "Hình ảnh" },
];

console.log("\n" + "=".repeat(64));
console.log("TRANG TỔNG (hub HTML)");
console.log("=".repeat(64));
hubs.forEach((h) => {
  const html = fs.readFileSync(path.join(root, h.file), "utf8");
  const title = (html.match(/<title[^>]*>([^<]+)/i) || [])[1] || "";
  const desc = (html.match(/name=["']description["'][^>]*content=["']([^"']+)/i) ||
    html.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i) || [])[1] || "";
  const canonical = (html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [])[1] || "";
  const hasH1 = /<h1[\s>]/i.test(html);
  const imgCount = (html.match(/<img\s/gi) || []).length;
  const okTitle = title.length >= 20 && title.length <= 70;
  const okDesc = desc.length >= 70 && desc.length <= 170;
  const okCanon = !!canonical;
  const score = [okTitle, okDesc, okCanon, hasH1, imgCount >= 1].filter(Boolean).length;
  console.log(
    `${score}/5 ${h.path.padEnd(14)} title=${title.length}c desc=${desc.length}c canon=${okCanon ? "Y" : "N"} h1=${hasH1 ? "Y" : "N"} img=${imgCount}`
  );
});

console.log("\n" + "=".repeat(64));
console.log("TỔNG KẾT WEBSITE");
console.log("=".repeat(64));
const allPass = newsResult.pass + svcResult.pass + aboutResult.pass;
const allTotal = newsResult.total + svcResult.total + aboutResult.total;
console.log(`Bài chi tiết (tin + DV + GT): ${allPass}/${allTotal} đạt checklist xuất bản`);
console.log(`Tin tức đạt: ${newsResult.pass}/${newsResult.total} (TB ${newsResult.avg})`);
console.log(`Dịch vụ đạt: ${svcResult.pass}/${svcResult.total} (TB ${svcResult.avg})`);
console.log(`Giới thiệu đạt: ${aboutResult.pass}/${aboutResult.total} (TB ${aboutResult.avg})`);

const report = {
  generatedAt: new Date().toISOString(),
  news: { total: newsResult.total, pass: newsResult.pass, fail: newsResult.fail, avg: newsResult.avg },
  services: {
    total: svcResult.total,
    pass: svcResult.pass,
    fail: svcResult.fail,
    avg: svcResult.avg,
    details: svcResult.rows.map((r) => ({
      id: r.id,
      score: r.score,
      canPublish: r.canPublish,
      words: r.stats.words,
      images: r.stats.images,
      density: r.stats.density,
    })),
  },
  about: {
    total: aboutResult.total,
    pass: aboutResult.pass,
    fail: aboutResult.fail,
    avg: aboutResult.avg,
    details: aboutResult.rows.map((r) => ({
      id: r.id,
      score: r.score,
      canPublish: r.canPublish,
      words: r.stats.words,
      images: r.stats.images,
    })),
  },
};

fs.writeFileSync(path.join(root, "data", "seo-audit-report.json"), JSON.stringify(report, null, 2));
console.log("\nĐã ghi data/seo-audit-report.json");
