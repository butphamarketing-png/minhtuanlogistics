/**
 * Validates uniqueness of all 1000 news articles.
 */
const fs = require("fs");
const path = require("path");

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "news-posts.json"), "utf8"));

const check = (name, fn) => {
  const map = new Map();
  const dups = [];
  posts.forEach((p, i) => {
    const key = fn(p);
    if (map.has(key)) dups.push({ idx: i + 1, slug: p.slug, dupOf: map.get(key) });
    else map.set(key, i + 1);
  });
  const ok = dups.length === 0;
  console.log(`${ok ? "✓" : "✗"} ${name}: ${map.size} unique / ${posts.length}${dups.length ? ` (${dups.length} duplicates)` : ""}`);
  if (dups.length && dups.length <= 5) dups.forEach((d) => console.log(`   #${d.idx} ${d.slug} duplicates #${d.dupOf}`));
  return ok;
};

console.log(`Checking ${posts.length} articles...\n`);

const results = [
  check("Titles", (p) => p.title),
  check("Slugs", (p) => p.slug),
  check("Keywords", (p) => p.keyword),
  check("H2 structure", (p) => p.sections.filter((s) => s.type === "h2").map((s) => s.text).join("||")),
  check("Full body text", (p) => p.sections.map((s) => s.text).join("\n")),
  check("Excerpts", (p) => p.excerpt),
  check("Meta descriptions", (p) => p.metaDescription),
];

const minWords = Math.min(...posts.map((p) => p.wordCount));
const maxWords = Math.max(...posts.map((p) => p.wordCount));
const avgWords = Math.round(posts.reduce((s, p) => s + p.wordCount, 0) / posts.length);

console.log(`\nWord count: min ${minWords}, max ${maxWords}, avg ${avgWords}`);
console.log(`H2 count: min ${Math.min(...posts.map((p) => p.sections.filter((s) => s.type === "h2").length))}, max ${Math.max(...posts.map((p) => p.sections.filter((s) => s.type === "h2").length))}`);

const allOk = results.every(Boolean);
console.log(allOk ? "\n✓ All uniqueness checks passed." : "\n✗ Some checks failed.");
process.exit(allOk ? 0 : 1);
