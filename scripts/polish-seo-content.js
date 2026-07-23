/**
 * Polish bulk SEO content: remove MT markers, fix title casing, keep checklist pass.
 */
const fs = require("fs");
const path = require("path");
const SEOChecklist = require("../lib/seo-checklist");

const root = path.resolve(__dirname, "..");

const stripMarkers = (s) =>
  String(s || "")
    .replace(/\s*\(MT-\d+-\d+\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim();

const capFirst = (s) => {
  const t = String(s || "").trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const polishPost = (post) => {
  const cleanText = (t) => capFirst(stripMarkers(t));

  const sections = (post.sections || []).map((s) => {
    if (s.type === "h2") return { ...s, text: cleanText(s.text) };
    if (s.type === "p") return { ...s, text: cleanText(s.text) };
    if (s.heading) {
      return {
        ...s,
        heading: cleanText(s.heading),
        text: cleanText(s.text || s.heading),
        paragraphs: (s.paragraphs || []).map(cleanText),
      };
    }
    return s;
  });

  const body = (post.body || []).map(cleanText);
  const headings = (post.headings || []).map(cleanText);
  const title = cleanText(post.metaTitle || post.title);
  const excerpt = cleanText(post.excerpt);
  const metaDescription = cleanText(post.metaDescription).slice(0, 160);

  const images = (post.images || []).map((img) => ({
    ...img,
    alt: cleanText(img.alt),
  }));

  const next = {
    ...post,
    title,
    metaTitle: title,
    excerpt,
    metaDescription,
    sections,
    body,
    headings,
    images,
    imageAlt: images[0]?.alt || cleanText(post.imageAlt),
  };

  const text = [
    next.excerpt,
    ...(next.sections || []).flatMap((s) => {
      if (s.type === "h2") return [s.text];
      if (s.type === "p") return [s.text];
      return [s.heading, ...(s.paragraphs || [])];
    }),
    ...(next.body || []),
  ].join("\n");
  next.wordCount = SEOChecklist.wordCount(text);
  return next;
};

const polishSubpage = (page) => {
  const sections = (page.sections || []).map((s) => ({
    heading: capFirst(stripMarkers(s.heading)),
    paragraphs: (s.paragraphs || []).map((p) => capFirst(stripMarkers(p))),
  }));
  const title = capFirst(stripMarkers(page.metaTitle || page.title));
  const lead = capFirst(stripMarkers(page.lead));
  const metaDescription = capFirst(stripMarkers(page.metaDescription)).slice(0, 160);
  const images = (page.images || []).map((img) => ({
    ...img,
    alt: capFirst(stripMarkers(img.alt)),
  }));
  return {
    ...page,
    title,
    metaTitle: title,
    lead,
    metaDescription,
    sections,
    images,
    faq: (page.faq || []).map((f) => ({
      q: capFirst(stripMarkers(f.q)),
      a: capFirst(stripMarkers(f.a)),
    })),
  };
};

const newsPath = path.join(root, "data", "news-posts.json");
const news = JSON.parse(fs.readFileSync(newsPath, "utf8")).map(polishPost);
fs.writeFileSync(newsPath, JSON.stringify(news, null, 2));

const subPath = path.join(root, "data", "subpages.json");
const sub = JSON.parse(fs.readFileSync(subPath, "utf8"));
sub.services = (sub.services || []).map(polishSubpage);
sub.about = (sub.about || []).map(polishSubpage);
fs.writeFileSync(subPath, JSON.stringify(sub, null, 2));

// verify no markers + SEO pass sample
const hasMarker = (s) => /\(MT-\d+-\d+\)/.test(JSON.stringify(s));
console.log("news markers left?", hasMarker(news));
console.log("sub markers left?", hasMarker(sub));
console.log("sample title:", news[0].title);
console.log("sample para:", news[0].body?.[1]?.slice?.(0, 120) || news[0].sections?.find((s) => s.type === "p")?.text?.slice(0, 120));

let pass = 0;
news.slice(0, 30).forEach((p) => {
  if (SEOChecklist.analyze(p, { existingPosts: news, currentId: p.id }).canPublish) pass++;
});
console.log(`sample news pass ${pass}/30`);

let passSub = 0;
[...sub.services, ...sub.about].forEach((p) => {
  const post = {
    id: p.slug,
    keyword: p.primaryKeyword,
    metaTitle: p.metaTitle,
    title: p.title,
    slug: p.slug,
    metaDescription: p.metaDescription,
    excerpt: p.lead,
    headings: p.sections.map((s) => s.heading),
    sections: p.sections.map((s) => ({
      type: "h2",
      heading: s.heading,
      text: s.heading,
      paragraphs: s.paragraphs,
    })),
    body: p.sections.flatMap((s) => s.paragraphs),
    images: p.images,
    internalLinks: p.internalLinks,
    externalLinks: p.externalLinks,
    published: true,
  };
  const r = SEOChecklist.analyze(post, {
    existingPosts: [...sub.services, ...sub.about].map((x) => ({
      id: x.slug,
      slug: x.slug,
      keyword: x.primaryKeyword,
    })),
    currentId: p.slug,
  });
  if (r.canPublish) passSub++;
  else console.log("fail", p.slug, r.score);
});
console.log(`subpages pass ${passSub}/10`);
