const fs = require("fs");
const C = require("../lib/seo-checklist");
const news = JSON.parse(fs.readFileSync("data/news-posts.json", "utf8"));
const p = news.find((x) => x.slug === "khai-bao-hai-quan-cat-lai");
const kw = p.keyword;
p.metaDescription =
  "Khai báo hải quan Cát Lái: chứng từ container, lịch cắt máng và thông quan đúng tiến độ tại TP.HCM. Báo giá 24h — hotline 0938 961 012.";
p.metaTitle = "Khai báo hải quan Cát Lái 2026 | Minh Tuấn Logistics";
p.title = p.metaTitle;

const repl = ["thủ tục tại cảng", "quy trình thông quan khu vực này", "hạng mục khai báo nêu trên", "dịch vụ hải quan tại cảng"];
let hits = 0;
const thin = (text) => {
  if (!text) return text;
  const lower = text.toLowerCase();
  const needle = kw.toLowerCase();
  if (!lower.includes(needle)) return text;
  let out = text;
  let idx = out.toLowerCase().indexOf(needle);
  while (idx !== -1) {
    hits++;
    if (hits > 10) {
      const rep = repl[hits % repl.length];
      out = out.slice(0, idx) + rep + out.slice(idx + kw.length);
      idx = out.toLowerCase().indexOf(needle, idx + rep.length);
    } else {
      idx = out.toLowerCase().indexOf(needle, idx + kw.length);
    }
  }
  return out;
};

if (Array.isArray(p.sections)) {
  p.sections = p.sections.map((s) => {
    if (s.paragraphs) return { ...s, paragraphs: s.paragraphs.map(thin) };
    if (s.text) return { ...s, text: thin(s.text) };
    if (s.heading) return { ...s, heading: hits > 12 ? s.heading.replace(new RegExp(kw, "i"), "Thông quan Cát Lái") : s.heading };
    return s;
  });
}

fs.writeFileSync("data/news-posts.json", JSON.stringify(news));
const r = C.analyze(p, { existingPosts: news, currentId: p.id });
console.log(r.score, r.canPublish, "density", r.stats.density.toFixed(2), "metaLen", p.metaDescription.length);
