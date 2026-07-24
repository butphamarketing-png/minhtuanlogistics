/**
 * Replace broken + irrelevant images with verified logistics photos by category.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.resolve(__dirname, "..");
const q = "?auto=format&fit=crop&w=1200&q=80";

// Verified 200 + visually logistics-relevant
const POOL = {
  sea: [
    `https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
    `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${q}`,
    `https://images.unsplash.com/photo-1553413077-190dd305871c${q}`,
    `https://images.unsplash.com/photo-1586528116493-a029325540fa${q}`,
  ],
  air: [
    `https://images.unsplash.com/photo-1436491865332-7a61a109cc05${q}`,
    `https://images.unsplash.com/photo-1556388158-158ea5ccacbd${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
    `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${q}`,
    `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40${q}`,
  ],
  road: [
    `https://images.unsplash.com/photo-1519003722824-194d4455a60c${q}`,
    `https://images.unsplash.com/photo-1616432043562-3671ea2e5242${q}`,
    `https://images.unsplash.com/photo-1465447142348-e9952c393450${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
    `https://images.unsplash.com/photo-1586528116493-a029325540fa${q}`,
  ],
  warehouse: [
    `https://images.unsplash.com/photo-1553413077-190dd305871c${q}`,
    `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${q}`,
    `https://images.unsplash.com/photo-1586528116493-a029325540fa${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
    `https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3${q}`,
  ],
  customs: [
    `https://images.unsplash.com/photo-1450101499163-c8848c66ca85${q}`,
    `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40${q}`,
    `https://images.unsplash.com/photo-1521791136064-7986c2920216${q}`,
    `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
  ],
  business: [
    `https://images.unsplash.com/photo-1521791136064-7986c2920216${q}`,
    `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40${q}`,
    `https://images.unsplash.com/photo-1507679799987-c73779587ccf${q}`,
    `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab${q}`,
    `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${q}`,
  ],
  global: [
    `https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3${q}`,
    `https://images.unsplash.com/photo-1578575437130-527eed3abbec${q}`,
    `https://images.unsplash.com/photo-1436491865332-7a61a109cc05${q}`,
    `https://images.unsplash.com/photo-1519003722824-194d4455a60c${q}`,
    `https://images.unsplash.com/photo-1553413077-190dd305871c${q}`,
  ],
};

const BANNED = [
  "photo-1566576912321", // Mario amiibo
  "photo-1558618666", // coffee roasting
  "photo-1601584115197", // 404
  "photo-1566576721346", // 404
  "photo-1605745341112", // 404
  "photo-1474302770737", // 404
  "photo-1494412519320", // 404
  "photo-1601584115197-04ecc0da31d7",
];

const detectCat = (post) => {
  if (post.category && POOL[post.category]) return post.category;
  const k = `${post.keyword || ""} ${post.primaryKeyword || ""} ${post.slug || ""} ${post.title || ""}`.toLowerCase();
  if (/biển|sea|fcl|lcl|container|cảng|tàu/.test(k)) return "sea";
  if (/hàng không|air|máy bay|tân sơn nhất|airway/.test(k)) return "air";
  if (/đường bộ|road|xe tải|đầu kéo|liên tỉnh|nội địa/.test(k)) return "road";
  if (/kho|warehouse|fulfillment|3pl|bãi/.test(k)) return "warehouse";
  if (/hải quan|customs|thông quan|khai báo|mã hs/.test(k)) return "customs";
  if (/tư vấn|consult|thương mại|trade|doanh nghiệp|vision|giá trị|công ty/.test(k)) return "business";
  return "global";
};

const altsFor = (kw) => [
  `${kw} tại TP.HCM — giải pháp logistics Minh Tuấn`,
  `${kw} chuyên nghiệp cho doanh nghiệp xuất nhập khẩu`,
  `Quy trình ${kw} đúng tiến độ và tối ưu chi phí`,
  `Hình ảnh thực tế dịch vụ ${kw} của Minh Tuấn Logistics`,
  `Tư vấn ${kw} — hotline 0938 961 012`,
];

const assignImages = (post, seed = 0) => {
  const cat = detectCat(post);
  const pool = POOL[cat];
  const kw = post.keyword || post.primaryKeyword || "logistics";
  const alts = altsFor(kw);
  const images = [0, 1, 2, 3, 4].map((i) => ({
    src: pool[(seed + i) % pool.length],
    alt: alts[i],
  }));
  return { images, photo: images[0].src, imageAlt: images[0].alt, categoryGuess: cat };
};

const headOk = (url) =>
  new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD", timeout: 10000 }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });

(async () => {
  // verify all pool URLs
  const allPool = [...new Set(Object.values(POOL).flat())];
  console.log("Verifying pool", allPool.length);
  for (const u of allPool) {
    const ok = await headOk(u);
    if (!ok) console.log("POOL FAIL", u);
  }

  const newsPath = path.join(root, "data", "news-posts.json");
  const news = JSON.parse(fs.readFileSync(newsPath, "utf8"));
  let replaced = 0;
  const upgraded = news.map((p, i) => {
    const hadBanned = JSON.stringify(p).match(new RegExp(BANNED.join("|")));
    const { images, photo, imageAlt } = assignImages(p, p.id || i);
    if (hadBanned) replaced++;
    return { ...p, images, photo, cover: photo, imageAlt };
  });
  fs.writeFileSync(newsPath, JSON.stringify(upgraded, null, 2));
  console.log(`News updated: ${upgraded.length} (had banned refs before remap count sample tracked=${replaced})`);

  const subPath = path.join(root, "data", "subpages.json");
  const sub = JSON.parse(fs.readFileSync(subPath, "utf8"));
  const mapPage = (p, i) => {
    const fake = {
      ...p,
      keyword: p.primaryKeyword,
      category:
        p.slug.includes("bien") || p.slug.includes("xuat")
          ? "sea"
          : p.slug.includes("khong")
            ? "air"
            : p.slug.includes("bo")
              ? "road"
              : p.slug.includes("kho")
                ? "warehouse"
                : p.slug.includes("tu-van") || p.slug.includes("thuong")
                  ? "business"
                  : p.parent === "gioi-thieu"
                    ? "business"
                    : "global",
    };
    // finer for services
    if (p.slug === "xuat-nhap-khau") fake.category = "customs";
    if (p.slug === "van-chuyen-duong-bien") fake.category = "sea";
    if (p.slug === "van-chuyen-duong-bo") fake.category = "road";
    if (p.slug === "van-chuyen-hang-khong") fake.category = "air";
    if (p.slug === "kho-bai-logistics") fake.category = "warehouse";
    if (p.slug === "thuong-mai" || p.slug === "tu-van-doanh-nghiep") fake.category = "business";
    if (p.parent === "gioi-thieu") fake.category = "business";

    const { images } = assignImages(fake, i + 20);
    console.log(`sub ${p.slug} -> ${fake.category}`);
    return { ...p, images };
  };
  sub.services = (sub.services || []).map(mapPage);
  sub.about = (sub.about || []).map(mapPage);
  fs.writeFileSync(subPath, JSON.stringify(sub, null, 2));

  // ensure no banned left
  const blob = fs.readFileSync(newsPath, "utf8") + fs.readFileSync(subPath, "utf8");
  const left = BANNED.filter((b) => blob.includes(b));
  console.log("Banned left:", left.length ? left : "none");
  console.log("Done");
})();
