const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = path.resolve(__dirname, "..");
const news = JSON.parse(fs.readFileSync(path.join(root, "data", "news-posts.json"), "utf8"));
const sub = JSON.parse(fs.readFileSync(path.join(root, "data", "subpages.json"), "utf8"));

const collect = () => {
  const map = new Map(); // url -> [{where, alt}]
  const add = (url, where, alt = "") => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    const clean = String(url).split("?")[0] + (url.includes("?") ? "?" + url.split("?").slice(1).join("?") : "");
    if (!map.has(url)) map.set(url, []);
    map.get(url).push({ where, alt });
  };

  news.forEach((p) => {
    if (p.photo) add(p.photo, `news:${p.slug}:photo`, p.imageAlt);
    if (p.cover) add(p.cover, `news:${p.slug}:cover`, p.imageAlt);
    (p.images || []).forEach((img, i) => add(img.src || img.url, `news:${p.slug}:img${i}`, img.alt));
  });

  [...(sub.services || []), ...(sub.about || [])].forEach((p) => {
    (p.images || []).forEach((img, i) =>
      add(img.src || img.url, `sub:${p.parent}/${p.slug}:img${i}`, img.alt)
    );
  });

  return map;
};

const checkUrl = (url) =>
  new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(
      url,
      { method: "HEAD", timeout: 12000, headers: { "User-Agent": "Mozilla/5.0 SEO-Image-Audit" } },
      (res) => {
        // follow one redirect manually for status
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          checkUrl(res.headers.location).then(resolve);
          return;
        }
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      }
    );
    req.on("error", (err) => resolve({ url, status: 0, ok: false, error: err.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, status: 0, ok: false, error: "timeout" });
    });
    req.end();
  });

const run = async () => {
  const map = collect();
  const urls = [...map.keys()];
  console.log(`Unique image URLs: ${urls.length}`);

  const concurrency = 12;
  const results = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const chunk = urls.slice(i, i + concurrency);
    const part = await Promise.all(chunk.map(checkUrl));
    results.push(...part);
    process.stdout.write(`\rChecked ${Math.min(i + concurrency, urls.length)}/${urls.length}`);
  }
  console.log("");

  const bad = results.filter((r) => !r.ok);
  const good = results.filter((r) => r.ok);

  // Expand bad URLs to affected articles
  let brokenUsages = 0;
  const byStatus = {};
  bad.forEach((r) => {
    byStatus[r.status || r.error || "err"] = (byStatus[r.status || r.error || "err"] || 0) + 1;
    brokenUsages += map.get(r.url).length;
  });

  console.log("\n=== KẾT QUẢ ===");
  console.log(`URL ảnh unique OK: ${good.length}`);
  console.log(`URL ảnh unique LỖI: ${bad.length}`);
  console.log(`Số chỗ dùng ảnh lỗi (trên các bài): ${brokenUsages}`);
  console.log("Theo status:", byStatus);

  if (bad.length) {
    console.log("\nDanh sách URL lỗi:");
    bad.slice(0, 30).forEach((r) => {
      const uses = map.get(r.url);
      console.log(`- [${r.status || r.error}] ${r.url}`);
      console.log(`  dùng ${uses.length} lần, vd: ${uses[0].where} | alt=${(uses[0].alt || "").slice(0, 60)}`);
    });
    if (bad.length > 30) console.log(`... và ${bad.length - 30} URL lỗi khác`);
  }

  const report = {
    checkedAt: new Date().toISOString(),
    uniqueUrls: urls.length,
    okUrls: good.length,
    badUrls: bad.length,
    brokenUsages,
    bad: bad.map((r) => ({
      url: r.url,
      status: r.status,
      error: r.error,
      usages: map.get(r.url).length,
      samples: map.get(r.url).slice(0, 5),
    })),
  };
  fs.writeFileSync(path.join(root, "data", "image-audit-report.json"), JSON.stringify(report, null, 2));
  console.log("\nĐã ghi data/image-audit-report.json");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
