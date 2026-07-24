/**
 * Thin exact keyword repeats in subpages so density lands ~0.8–2.2%.
 * Keeps first hits in lead/title/meta/headings/alts; rewrites later body hits.
 */
const fs = require("fs");
const path = require("path");
const SEOChecklist = require("../lib/seo-checklist");

const root = path.resolve(__dirname, "..");
const TARGET_MAX = 2.2;
const TARGET_MIN = 0.8;

const REPLACEMENTS = [
  "giải pháp này",
  "dịch vụ trên",
  "hạng mục nêu trên",
  "quy trình này",
  "phương án vận hành",
  "gói hỗ trợ logistics",
  "dịch vụ đồng hành",
  "giải pháp xuất nhập khẩu",
];

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

const countHits = (text, keyword) => {
  const t = norm(text);
  const k = norm(keyword);
  if (!k || !t) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = t.indexOf(k, idx)) !== -1) {
    count++;
    idx += k.length;
  }
  return count;
};

const replaceNth = (text, keyword, n, replacement) => {
  const t = String(text || "");
  const k = String(keyword || "");
  if (!k) return t;
  const lower = t.toLowerCase();
  const needle = k.toLowerCase();
  let from = 0;
  let seen = 0;
  while (from < lower.length) {
    const idx = lower.indexOf(needle, from);
    if (idx === -1) return t;
    seen++;
    if (seen === n) {
      return t.slice(0, idx) + replacement + t.slice(idx + k.length);
    }
    from = idx + needle.length;
  }
  return t;
};

const flattenPage = (page) => {
  const parts = [page.lead, page.metaTitle, page.metaDescription];
  (page.sections || []).forEach((s) => {
    parts.push(s.heading);
    (s.paragraphs || []).forEach((p) => parts.push(p));
  });
  (page.highlights || []).forEach((h) => parts.push(h));
  (page.faq || []).forEach((f) => {
    parts.push(f.q, f.a);
  });
  (page.images || []).forEach((i) => parts.push(i.alt));
  return parts.filter(Boolean).join("\n");
};

const densityOf = (page) => {
  const kw = page.primaryKeyword || "";
  const content = flattenPage(page);
  const words = SEOChecklist.wordCount(content);
  const hits = countHits(content, kw);
  return { words, hits, density: words ? (hits / words) * 100 : 0 };
};

const thinPage = (page) => {
  const kw = page.primaryKeyword;
  if (!kw) return { page, changed: false };

  let { density, hits, words } = densityOf(page);
  if (density <= TARGET_MAX) return { page, changed: false, density, hits, words };

  const next = JSON.parse(JSON.stringify(page));
  let guard = 0;
  let repIdx = 0;

  const candidates = [];
  // Prefer thinning body paragraphs / FAQ / highlights (keep lead + first heading + alts mostly)
  (next.sections || []).forEach((s, si) => {
    (s.paragraphs || []).forEach((p, pi) => {
      if (countHits(p, kw) > 0) candidates.push({ type: "p", si, pi });
    });
  });
  (next.highlights || []).forEach((h, hi) => {
    if (countHits(h, kw) > 0) candidates.push({ type: "h", hi });
  });
  (next.faq || []).forEach((f, fi) => {
    if (countHits(f.a, kw) > 0) candidates.push({ type: "fa", fi });
    if (countHits(f.q, kw) > 1) candidates.push({ type: "fq", fi });
  });

  while (density > TARGET_MAX && guard < 80) {
    guard++;
    let replaced = false;
    for (const c of candidates) {
      let text;
      if (c.type === "p") text = next.sections[c.si].paragraphs[c.pi];
      else if (c.type === "h") text = next.highlights[c.hi];
      else if (c.type === "fa") text = next.faq[c.fi].a;
      else if (c.type === "fq") text = next.faq[c.fi].q;
      const localHits = countHits(text, kw);
      // keep at least 1 hit in lead-equivalent; for paragraphs allow 0 after first pass
      const keep = c.type === "fq" ? 1 : 0;
      if (localHits <= keep) continue;
      const replacement = REPLACEMENTS[repIdx % REPLACEMENTS.length];
      repIdx++;
      const updated = replaceNth(text, kw, localHits, replacement);
      if (updated === text) continue;
      if (c.type === "p") next.sections[c.si].paragraphs[c.pi] = updated;
      else if (c.type === "h") next.highlights[c.hi] = updated;
      else if (c.type === "fa") next.faq[c.fi].a = updated;
      else if (c.type === "fq") next.faq[c.fi].q = updated;
      replaced = true;
      break;
    }
    if (!replaced) break;
    ({ density, hits, words } = densityOf(next));
  }

  // Ensure still above minimum: if too low, skip (shouldn't happen)
  if (density < TARGET_MIN) {
    return { page, changed: false, density: densityOf(page).density, note: "would undershoot" };
  }

  next.wordCount = words;
  return { page: next, changed: true, density, hits, words };
};

const dataPath = path.join(root, "data", "subpages.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
let changedCount = 0;

["about", "services"].forEach((key) => {
  data[key] = (data[key] || []).map((page) => {
    const before = densityOf(page);
    const { page: next, changed, density } = thinPage(page);
    if (changed) {
      changedCount++;
      console.log(
        `✓ ${page.slug}: ${before.density.toFixed(2)}% → ${density.toFixed(2)}% (${before.hits} → ${densityOf(next).hits} hits)`
      );
    } else {
      console.log(`· ${page.slug}: ${before.density.toFixed(2)}% (ok)`);
    }
    return next;
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Updated ${changedCount} subpages → ${dataPath}`);
