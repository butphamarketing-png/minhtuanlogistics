const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

/** Regenerate static HTML from data JSON (subpages, articles, sitemap). */
const rebuildSite = (targets = ["subpages", "articles", "sitemap"]) => {
  const scripts = {
    subpages: "scripts/generate-subpages.js",
    articles: "scripts/generate-article-pages.js",
    sitemap: "scripts/generate-sitemap.js",
  };
  const results = [];
  for (const key of targets) {
    const rel = scripts[key];
    if (!rel) continue;
    const r = spawnSync(process.execPath, [path.join(root, rel)], {
      cwd: root,
      encoding: "utf8",
      timeout: 120000,
    });
    results.push({
      target: key,
      ok: r.status === 0,
      status: r.status,
      stdout: (r.stdout || "").slice(-500),
      stderr: (r.stderr || "").slice(-500),
    });
    if (r.status !== 0) break;
  }
  return {
    ok: results.every((x) => x.ok),
    results,
  };
};

module.exports = { rebuildSite };
