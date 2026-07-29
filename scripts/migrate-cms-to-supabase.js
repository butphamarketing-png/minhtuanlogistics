/**
 * Migrate local CMS JSON → Supabase (cms_docs + news_posts + submissions + media).
 * Usage: node scripts/migrate-cms-to-supabase.js [--skip-news]
 */
require("../lib/env").loadEnv();
const path = require("path");
const fs = require("fs");
const store = require("../lib/store");
const cms = require("../lib/cms-db");
const supabase = require("../lib/supabase");

const skipNews = process.argv.includes("--skip-news");

const main = async () => {
  if (!cms.isConfigured()) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const health = await cms.healthCms();
  if (!health.ok) {
    console.error("CMS tables missing. Run supabase/cms.sql in Supabase SQL Editor first.");
    console.error(health.error || health);
    process.exit(1);
  }

  const docs = [
    ["settings", () => store.readJson("settings.json", store.defaultSettings())],
    ["homepage", () => store.readJson("homepage.json", store.defaultHomepage())],
    ["gallery", () => store.readJson("gallery.json", store.defaultGallery())],
    ["pages", () => store.readJson("pages.json", store.defaultPages())],
    ["subpages", () => store.readJson("subpages.json", { about: [], services: [] })],
    ["seo-pages", () => store.readJson("seo-pages.json", {})],
    ["translations", () => store.readJson("translations.json", { vi: {}, en: {}, zh: {} })],
  ];

  for (const [key, loader] of docs) {
    const data = loader();
    await cms.setDoc(key, data);
    console.log(`✓ cms_docs:${key}`);
  }

  const mediaPath = path.join(store.dataDir, "media.json");
  if (fs.existsSync(mediaPath)) {
    const media = store.readJson("media.json", []);
    let n = 0;
    for (const m of media) {
      const r = await supabase.upsertMedia(m);
      if (r.ok) n += 1;
    }
    console.log(`✓ media: ${n}/${media.length}`);
  }

  const subs = store.readJson("submissions.json", []);
  for (const s of subs) {
    await cms.addSubmissionRow(s);
  }
  console.log(`✓ submissions: ${subs.length}`);

  if (!skipNews) {
    const posts =
      store.readJson("news-posts.json", null) || store.readJson("news.json", []) || [];
    console.log(`Migrating news_posts: ${posts.length} (may take a few minutes)...`);
    await cms.saveNewsAll(posts);
    console.log(`✓ news_posts: ${posts.length}`);
  } else {
    console.log("Skipped news (--skip-news)");
  }

  console.log("\nDone. Admin CMS now persists on Supabase.");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
