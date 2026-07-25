/**
 * Re-stamp all news post dates into 2026 (Jan 1 → Jul 24).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const postsPath = path.join(root, "data", "news-posts.json");
const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const n = posts.length;
const start = Date.UTC(2026, 0, 1);
const end = Date.UTC(2026, 6, 24);
const pad = (x) => String(x).padStart(2, "0");

let min = "9999-99-99";
let max = "0000-00-00";

posts.forEach((p, i) => {
  const t = start + Math.round((i / Math.max(n - 1, 1)) * (end - start));
  const d = new Date(t);
  const iso = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  p.date = iso;
  p.dateLabel = `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
  if (iso < min) min = iso;
  if (iso > max) max = iso;
});

fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
console.log(`Updated ${n} posts → ${min} .. ${max}`);
const check = ["freight-forwarding", "project-cargo", "trade-compliance"];
check.forEach((slug) => {
  const p = posts.find((x) => x.slug === slug);
  if (p) console.log(`  ${p.slug}: ${p.date} (${p.dateLabel})`);
});
