/**
 * Fix broken "[object Object]" text and normalize Hải quan / Zalo inline markdown links.
 * Run: node scripts/fix-inline-links.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const CAT_LABEL = {
  sea: "đường biển",
  air: "hàng không",
  road: "đường bộ",
  customs: "hải quan",
  warehouse: "kho bãi",
  global: "quốc tế",
  business: "doanh nghiệp",
};

const fixText = (text, category) => {
  let t = String(text ?? "");
  if (!t) return t;
  const cat = CAT_LABEL[category] || "logistics";
  t = t.split("[object Object]").join(cat);
  t = t.replace(/\[Tổng cục Hải quan\]\(https:\/\/www\.customs\.gov\.vn\/?\)/g, "[Hải quan Việt Nam](https://www.customs.gov.vn/)");
  // Ensure Zalo mention is markdown inline link if plain text appears
  if (!t.includes("zalo.me/0938961012") && /liên hệ Zalo Minh Tuấn Logistics/i.test(t)) {
    t = t.replace(
      /liên hệ Zalo Minh Tuấn Logistics/gi,
      "[liên hệ Zalo Minh Tuấn Logistics](https://zalo.me/0938961012)"
    );
  }
  return t;
};

const fixPost = (p) => {
  const sections = (p.sections || []).map((s) => ({
    ...s,
    text: s.text != null ? fixText(s.text, p.category) : s.text,
    heading: s.heading != null ? fixText(s.heading, p.category) : s.heading,
    paragraphs: s.paragraphs ? s.paragraphs.map((x) => fixText(x, p.category)) : s.paragraphs,
  }));
  const body = (p.body || []).map((x) => fixText(x, p.category));
  const headings = (p.headings || []).map((x) => fixText(x, p.category));
  return { ...p, sections, body, headings };
};

const newsPath = path.join(root, "data", "news-posts.json");
const news = JSON.parse(fs.readFileSync(newsPath, "utf8")).map(fixPost);
fs.writeFileSync(newsPath, JSON.stringify(news, null, 2));

const subPath = path.join(root, "data", "subpages.json");
const sub = JSON.parse(fs.readFileSync(subPath, "utf8"));
const fixPage = (page) => ({
  ...page,
  lead: fixText(page.lead, "business"),
  sections: (page.sections || []).map((s) => ({
    ...s,
    heading: fixText(s.heading, "business"),
    paragraphs: (s.paragraphs || []).map((x) => fixText(x, "business")),
  })),
});
sub.services = (sub.services || []).map(fixPage);
sub.about = (sub.about || []).map(fixPage);
fs.writeFileSync(subPath, JSON.stringify(sub, null, 2));

let left = 0;
for (const p of news) {
  const blob = JSON.stringify(p);
  if (blob.includes("[object Object]")) left++;
}
console.log("news posts still with [object Object]:", left);
console.log("sample customs link:", news[0].sections.find((s) => String(s.text || "").includes("customs"))?.text?.slice(-120));
