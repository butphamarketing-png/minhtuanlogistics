const posts = require("../data/news-posts.json");
let n = 0;
const samples = [];
for (const p of posts) {
  const blob = JSON.stringify(p);
  if (!blob.includes("[object Object]")) continue;
  n++;
  const m = blob.match(/.{0,40}\[object Object\].{0,40}/);
  if (samples.length < 8) samples.push({ slug: p.slug, cat: p.category, snip: m && m[0] });
}
console.log("count", n);
console.log(samples);
