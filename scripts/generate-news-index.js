/**
 * Build slim news index for client listing (~0.7MB vs ~10MB full corpus).
 * Output: data/news-index.json
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const postsPath = path.join(root, "data", "news-posts.json");
const outPath = path.join(root, "data", "news-index.json");

if (!fs.existsSync(postsPath)) {
  console.error("Missing data/news-posts.json — run npm run news first");
  process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const slim = posts.map((p) => {
  const fromImages = Array.isArray(p.images)
    ? p.images.map((img) => img && (img.src || img.url)).find(Boolean)
    : "";
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    keyword: p.keyword,
    category: p.category,
    categoryLabel: p.categoryLabel,
    date: p.date,
    excerpt: String(p.excerpt || p.metaDescription || "").slice(0, 180),
    cover: fromImages || p.photo || p.cover || "",
    imageAlt: p.imageAlt || p.keyword || "",
  };
});

fs.writeFileSync(outPath, JSON.stringify(slim), "utf8");
const mb = (Buffer.byteLength(JSON.stringify(slim)) / 1e6).toFixed(2);
console.log(`Generated ${slim.length} index entries → data/news-index.json (${mb} MB)`);
