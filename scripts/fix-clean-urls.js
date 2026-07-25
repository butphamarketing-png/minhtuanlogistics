const fs = require("fs");
const files = [
  "index.html",
  "dich-vu.html",
  "gioi-thieu.html",
  "tin-tuc.html",
  "lien-he.html",
  "du-an.html",
  "hinh-anh.html",
  "bai-viet.html",
];
const pairs = [
  ['href="index.html"', 'href="/"'],
  ['href="tin-tuc.html"', 'href="/tin-tuc"'],
  ['href="lien-he.html"', 'href="/lien-he"'],
  ['href="dich-vu.html"', 'href="/dich-vu"'],
  ['href="gioi-thieu.html"', 'href="/gioi-thieu"'],
  ['href="du-an.html"', 'href="/du-an"'],
  ['href="hinh-anh.html"', 'href="/hinh-anh"'],
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let c = fs.readFileSync(f, "utf8");
  let n = 0;
  for (const [from, to] of pairs) {
    const parts = c.split(from);
    n += parts.length - 1;
    c = parts.join(to);
  }
  fs.writeFileSync(f, c);
  console.log(f, n);
}
