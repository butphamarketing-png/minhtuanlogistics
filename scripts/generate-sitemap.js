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

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/gioi-thieu", priority: "0.8", changefreq: "monthly" },
  { loc: "/dich-vu", priority: "0.9", changefreq: "monthly" },
  { loc: "/du-an", priority: "0.7", changefreq: "monthly" },
  { loc: "/tin-tuc", priority: "0.8", changefreq: "daily" },
  { loc: "/hinh-anh", priority: "0.6", changefreq: "monthly" },
  { loc: "/lien-he", priority: "0.8", changefreq: "monthly" },
];

const extractNewsSlugs = () => {
  const postsPath = path.join(root, "data", "news-posts.json");
  if (fs.existsSync(postsPath)) {
    return JSON.parse(fs.readFileSync(postsPath, "utf8")).map((p) => p.slug);
  }
  const kwPath = path.join(root, "data", "keywords-1000.json");
  if (fs.existsSync(kwPath)) {
    return JSON.parse(fs.readFileSync(kwPath, "utf8")).map((k) => k.slug);
  }
  return [];
};

const today = new Date().toISOString().slice(0, 10);

const urlEntry = (loc, priority, changefreq) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const slugs = extractNewsSlugs();
const newsEntries = slugs.map((slug) =>
  urlEntry(`/bai-viet?slug=${encodeURIComponent(slug)}`, "0.6", "monthly")
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p) => urlEntry(p.loc, p.priority, p.changefreq)).join("\n")}
${newsEntries.join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");

const robots = `User-agent: *
Allow: /
Disallow: /adminbp/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(root, "robots.txt"), robots, "utf8");

console.log(`Site URL: ${SITE_URL}`);
console.log(`Generated sitemap.xml with ${staticPages.length + slugs.length} URLs`);
console.log("Updated robots.txt");
