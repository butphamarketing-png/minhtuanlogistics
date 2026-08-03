const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const uploadsDir = path.join(root, "uploads");

const ensureDirs = () => {
  [dataDir, uploadsDir].forEach((dir) => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch {
      /* Vercel read-only FS — ignore */
    }
  });
};

const filePath = (name) => path.join(dataDir, name);

const readJson = (name, fallback) => {
  ensureDirs();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch {
    return fallback;
  }
};

const writeJson = (name, data) => {
  ensureDirs();
  try {
    fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf8");
  } catch {
    /* Vercel read-only FS — ignore */
  }
};

const defaultSettings = () => ({
  company: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
  hotline: "0938 961 012",
  phone: "0938961012",
  email: "contact@minhtuan.vn",
  address: "69/1 Trần Quốc Hoàn, P. Tân Sơn Nhất",
  website: "minhtuanlogistics.com",
  siteUrl: "https://minhtuanlogistics.com",
  workingHours: "Thứ 2 – Thứ 7 | 08:00 – 17:30",
  social: {
    facebook: "https://facebook.com/",
    zalo: "https://zalo.me/0938961012",
    messenger: "https://m.me/",
    linkedin: "https://linkedin.com/",
    maps: "https://maps.google.com/",
  },
  seo: {
    homeTitle: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
    homeDescription:
      "Website chính thức CÔNG TY TNHH XNK TM DV MINH TUẤN - Giải pháp Xuất Nhập Khẩu - Thương Mại - Dịch Vụ chuyên nghiệp, hiện đại.",
  },
  footer: {
    desc: "Đối tác tin cậy trong lĩnh vực xuất nhập khẩu, thương mại và dịch vụ với giải pháp toàn diện, chuyên nghiệp và hiệu quả.",
    copyright: "© 2026 CÔNG TY TNHH XNK TM DV MINH TUẤN. All Rights Reserved.",
  },
  logo: "/logo.png",
});

const defaultHomepage = () => ({
  heroSlides: [
    { src: "/hero-slide-1.png", alt: "Giải pháp logistics toàn diện Minh Tuấn" },
    {
      src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80",
      alt: "Xuất nhập khẩu cảng biển",
    },
    {
      src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80",
      alt: "Vận chuyển đường bộ và kho bãi",
    },
    {
      src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80",
      alt: "Vận chuyển hàng không quốc tế",
    },
  ],
  stats: [
    { value: 15, suffix: "+", labelKey: "stats.years", label: "Năm kinh nghiệm" },
    { value: 1500, suffix: "+", format: "dot", labelKey: "stats.clients", label: "Khách hàng" },
    { value: 5000, suffix: "+", format: "dot", labelKey: "stats.shipments", label: "Lô hàng" },
    { value: 100, suffix: "+", labelKey: "stats.partners", label: "Đối tác" },
  ],
  testimonials: [
    {
      name: "Nguyễn Minh Đức",
      role: "Giám đốc · Công ty ABC Logistics",
      text: "Minh Tuấn hỗ trợ rất chuyên nghiệp, quy trình rõ ràng và luôn chủ động cập nhật tiến độ.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
    {
      name: "Trần Thu Hà",
      role: "Founder · Sunrise Trading",
      text: "Từ tư vấn đến triển khai đều nhanh và minh bạch. Chi phí hợp lý, đội ngũ nhiệt tình.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    },
    {
      name: "Lê Quốc Bảo",
      role: "Trưởng phòng XNK · Hòa Phát Trade",
      text: "Dịch vụ logistics đồng bộ, giao hàng đúng tiến độ. Hồ sơ hải quan chuẩn bị bài bản.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    },
  ],
  services: [
    { title: "Xuất nhập khẩu", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80", link: "#contact", alt: "Xuất nhập khẩu cảng biển" },
    { title: "Vận chuyển đường biển", image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1000&q=80", link: "dich-vu.html#duong-bien", alt: "Vận chuyển đường biển" },
    { title: "Vận chuyển đường bộ", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80", link: "dich-vu.html#duong-bo", alt: "Vận chuyển đường bộ" },
    { title: "Vận chuyển hàng không", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80", link: "#contact", alt: "Vận chuyển hàng không" },
    { title: "Kho bãi & Logistics", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80", link: "#contact", alt: "Kho bãi và logistics" },
    { title: "Thương mại", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80", link: "#contact", alt: "Thương mại doanh nghiệp" },
    { title: "Tư vấn doanh nghiệp", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80", link: "#contact", alt: "Tư vấn doanh nghiệp" },
  ],
  whyChoose: [
    { title: "Uy tín & Kinh nghiệm", text: "Hơn 10 năm đồng hành cùng nhiều doanh nghiệp." },
    { title: "Giải pháp toàn diện", text: "Từ tư vấn, khai báo hải quan đến vận chuyển." },
    { title: "Giao hàng đúng tiến độ", text: "Quy trình vận hành chuyên nghiệp." },
    { title: "Mạng lưới đối tác rộng", text: "Kết nối giao thương hiệu quả." },
    { title: "Chi phí tối ưu", text: "Giải pháp linh hoạt theo ngân sách." },
    { title: "Hỗ trợ 24/7", text: "Đội ngũ tư vấn luôn sẵn sàng." },
  ],
  process: [
    { title: "Tiếp nhận yêu cầu", text: "Lắng nghe nhu cầu từ khách hàng." },
    { title: "Tư vấn giải pháp", text: "Đề xuất phương án phù hợp." },
    { title: "Báo giá", text: "Báo giá minh bạch, tối ưu chi phí." },
    { title: "Ký kết hợp đồng", text: "Thống nhất phương án triển khai." },
    { title: "Triển khai dịch vụ", text: "Vận chuyển, khai báo hải quan." },
    { title: "Bàn giao & Hỗ trợ", text: "Hoàn tất dự án, hỗ trợ sau dịch vụ." },
  ],
  hero: {
    brand: "MINH TUẤN LOGISTICS",
    headline1: "Đồng hành doanh nghiệp",
    headline2: "trên hành trình XNK toàn cầu",
    lead: "Quy trình chuẩn quốc tế · Phản hồi nhanh · Cam kết hiệu quả vận hành",
  },
});

const defaultPages = () => ({
  about: {
    title: "Giới thiệu",
    desc: "Tìm hiểu về CÔNG TY TNHH XNK TM DV MINH TUẤN — đối tác tin cậy trong lĩnh vực xuất nhập khẩu, thương mại và logistics.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80",
  },
  services: {
    title: "Dịch vụ",
    desc: "Giải pháp toàn diện cho doanh nghiệp trong lĩnh vực xuất nhập khẩu, thương mại và logistics.",
  },
  projects: {
    title: "Dự án",
    desc: "Các dự án logistics và xuất nhập khẩu tiêu biểu mà Minh Tuấn đã triển khai.",
    featured: "Triển khai logistics cho doanh nghiệp sản xuất, thương mại và phân phối.",
    partners: "Đồng hành cùng nhiều doanh nghiệp trong và ngoài nước.",
  },
  contact: {
    title: "Liên hệ",
    desc: "Kết nối với Minh Tuấn Logistics để được tư vấn giải pháp phù hợp.",
  },
  gallery: {
    title: "Hình ảnh",
    desc: "Thư viện hình ảnh hoạt động và dự án logistics của Minh Tuấn.",
    videoTitle: "Video hoạt động",
    videoText: "Video giới thiệu dịch vụ và quy trình vận hành logistics chuyên nghiệp.",
  },
  news: {
    title: "Tin tức",
    desc: "Cập nhật tin tức, kiến thức logistics và hoạt động của Minh Tuấn.",
  },
});

const defaultGallery = () => ({
  images: [
    {
      src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      alt: "Cảng biển logistics",
    },
    {
      src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      alt: "Vận chuyển đường bộ",
    },
    {
      src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      alt: "Vận chuyển hàng không",
    },
  ],
  videoUrl: "",
});

const seedNewsIfEmpty = () => {
  // Prefer SEO corpus; do not overwrite news-posts.json
  const posts = readJson("news-posts.json", null);
  if (posts && posts.length) return posts;
  const existing = readJson("news.json", null);
  if (existing && existing.length) return existing;

  const KEYWORDS = [
    "van chuyen hang hoa",
    "logistics Viet Nam",
    "xuat nhap khau",
    "van chuyen duong bien",
    "van chuyen hang khong",
  ];
  const LABELS = [
    "vận chuyển hàng hóa",
    "logistics Việt Nam",
    "xuất nhập khẩu",
    "vận chuyển đường biển",
    "vận chuyển hàng không",
  ];
  const CATS = ["road", "business", "customs", "sea", "air"];
  const CAT_LABEL = ["Đường bộ", "Doanh nghiệp", "Hải quan", "Đường biển", "Hàng không"];
  const PHOTO = [
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  ];

  const seeded = LABELS.map((label, i) => {
    const slug = KEYWORDS[i].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const d = new Date(2026, 0, 2 + i);
    const iso = d.toISOString().slice(0, 10);
    const titleKw = label.charAt(0).toUpperCase() + label.slice(1);
    return {
      id: i + 1,
      keyword: label,
      slug,
      title: `${titleKw}: hướng dẫn thực tiễn cho doanh nghiệp 2026`,
      excerpt: `Tổng quan giải pháp liên quan đến ${label}, giúp tối ưu chi phí và tiến độ logistics.`,
      category: CATS[i],
      categoryLabel: CAT_LABEL[i],
      date: iso,
      dateLabel: `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`,
      photo: PHOTO[i],
      cover: PHOTO[i],
      body: [
        `${titleKw} đang được nhiều doanh nghiệp quan tâm khi mở rộng thị trường.`,
        `Trong nhóm ${CAT_LABEL[i].toLowerCase()}, nắm rõ quy trình giúp giảm rủi ro.`,
        "Cần báo giá? Gọi 0938 961 012 — đội ngũ Minh Tuấn sẽ phản hồi sớm.",
      ],
      published: true,
    };
  });

  writeJson("news-posts.json", seeded);
  writeJson("news.json", seeded);
  return seeded;
};

const defaultSubpages = () => ({ about: [], services: [] });

const defaultSeoPages = () => ({
  home: {
    title: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
    description:
      "Website chính thức CÔNG TY TNHH XNK TM DV MINH TUẤN - Giải pháp Xuất Nhập Khẩu - Thương Mại - Dịch Vụ chuyên nghiệp.",
    keywords: "logistics, xuất nhập khẩu, Minh Tuấn",
  },
  "gioi-thieu": {
    title: "Giới thiệu | MINH TUẤN Logistics",
    description: "Giới thiệu công ty logistics Minh Tuấn tại TP.HCM.",
    keywords: "giới thiệu, công ty logistics TP.HCM",
  },
  "dich-vu": {
    title: "Dịch vụ | MINH TUẤN Logistics",
    description: "Dịch vụ xuất nhập khẩu, vận tải biển bộ hàng không, kho bãi.",
    keywords: "dịch vụ logistics, xuất nhập khẩu",
  },
  "du-an": {
    title: "Dự án | MINH TUẤN Logistics",
    description: "Dự án và đối tác logistics Minh Tuấn.",
    keywords: "dự án logistics",
  },
  "tin-tuc": {
    title: "Tin tức | MINH TUẤN Logistics",
    description: "Tin tức và kiến thức logistics, xuất nhập khẩu.",
    keywords: "tin tức logistics",
  },
  "tuyen-dung": {
    title: "Tuyển dụng | MINH TUẤN Logistics",
    description: "Tuyển dụng Nhân viên sàn Amazon và Trợ lý kho tại Minh Tuấn.",
    keywords: "tuyển dụng, minh tuấn",
  },
  "hinh-anh": {
    title: "Hình ảnh | MINH TUẤN Logistics",
    description: "Thư viện hình ảnh hoạt động logistics Minh Tuấn.",
    keywords: "hình ảnh logistics",
  },
  "lien-he": {
    title: "Liên hệ | MINH TUẤN Logistics",
    description: "Liên hệ báo giá logistics Minh Tuấn — hotline 0938 961 012.",
    keywords: "liên hệ logistics",
  },
});


const initStore = () => {
  try {
    ensureDirs();
    if (!fs.existsSync(filePath("settings.json"))) writeJson("settings.json", defaultSettings());
    if (!fs.existsSync(filePath("homepage.json"))) writeJson("homepage.json", defaultHomepage());
    if (!fs.existsSync(filePath("gallery.json"))) writeJson("gallery.json", defaultGallery());
    if (!fs.existsSync(filePath("pages.json"))) writeJson("pages.json", defaultPages());
    if (!fs.existsSync(filePath("submissions.json"))) writeJson("submissions.json", []);
    if (!fs.existsSync(filePath("media.json"))) writeJson("media.json", []);
    if (!fs.existsSync(filePath("seo-pages.json"))) writeJson("seo-pages.json", defaultSeoPages());
    if (!fs.existsSync(filePath("subpages.json"))) writeJson("subpages.json", defaultSubpages());
    seedNewsIfEmpty();

    const transPath = path.join(root, "translations.js");
    if (!fs.existsSync(filePath("translations.json")) && fs.existsSync(transPath)) {
      try {
        const src = fs.readFileSync(transPath, "utf8");
        const match = src.match(/window\.I18N_TRANSLATIONS\s*=\s*(\{[\s\S]*\});?\s*$/);
        if (match) {
          // eslint-disable-next-line no-eval
          const translations = eval(`(${match[1]})`);
          writeJson("translations.json", translations);
        }
      } catch {
        writeJson("translations.json", { vi: {}, en: {}, zh: {} });
      }
    }
  } catch (err) {
    console.warn("[store] initStore skipped:", err.message);
  }
};

initStore();

const cms = require("./cms-db");

const tryWriteJson = (name, data) => {
  try {
    writeJson(name, data);
  } catch {
    /* Vercel ephemeral FS — ignore */
  }
};

const mergeSettings = (saved) => {
  const defaults = defaultSettings();
  const s = saved || defaults;
  return {
    ...defaults,
    ...s,
    social: { ...defaults.social, ...(s.social || {}) },
    seo: { ...defaults.seo, ...(s.seo || {}) },
    footer: { ...defaults.footer, ...(s.footer || {}) },
  };
};

const mergeHomepage = (saved) => {
  const defaults = defaultHomepage();
  const s = saved || defaults;
  return {
    ...defaults,
    ...s,
    hero: { ...defaults.hero, ...(s.hero || {}) },
    heroSlides: s.heroSlides?.length ? s.heroSlides : defaults.heroSlides,
    stats: s.stats?.length ? s.stats : defaults.stats,
    testimonials: s.testimonials?.length ? s.testimonials : defaults.testimonials,
    services: s.services?.length ? s.services : defaults.services,
    whyChoose: s.whyChoose?.length ? s.whyChoose : defaults.whyChoose,
    process: s.process?.length ? s.process : defaults.process,
  };
};

module.exports = {
  root,
  dataDir,
  uploadsDir,
  readJson,
  writeJson,
  ensureDirs,
  defaultSettings,
  defaultHomepage,
  defaultGallery,
  defaultPages,
  cmsEnabled: () => cms.isConfigured(),

  getSettings: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("settings");
      } catch (_) {}
    }
    if (!saved) saved = readJson("settings.json", null);
    return mergeSettings(saved);
  },
  saveSettings: async (data) => {
    tryWriteJson("settings.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("settings", data);
      } catch (e) {
        console.warn("[cms] save settings:", e.message);
      }
    }
  },

  getHomepage: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("homepage");
      } catch (_) {}
    }
    if (!saved) saved = readJson("homepage.json", null);
    return mergeHomepage(saved);
  },
  saveHomepage: async (data) => {
    tryWriteJson("homepage.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("homepage", data);
      } catch (e) {
        console.warn("[cms] save homepage:", e.message);
      }
    }
  },

  getPages: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("pages");
      } catch (_) {}
    }
    if (!saved) saved = readJson("pages.json", null);
    return saved || defaultPages();
  },
  savePages: async (data) => {
    tryWriteJson("pages.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("pages", data);
      } catch (e) {
        console.warn("[cms] save pages:", e.message);
      }
    }
  },

  getGallery: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("gallery");
      } catch (_) {}
    }
    if (!saved) saved = readJson("gallery.json", null);
    return saved || defaultGallery();
  },
  saveGallery: async (data) => {
    tryWriteJson("gallery.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("gallery", data);
      } catch (e) {
        console.warn("[cms] save gallery:", e.message);
      }
    }
  },

  getNews: async () => {
    if (cms.isConfigured()) {
      try {
        const rows = await cms.fetchNewsPages();
        if (rows && rows.length) return rows;
      } catch (_) {}
    }
    const posts = readJson("news-posts.json", null);
    if (posts && posts.length) return posts;
    return readJson("news.json", []);
  },
  saveNews: async (data) => {
    tryWriteJson("news-posts.json", data);
    tryWriteJson("news.json", Array.isArray(data) ? data.slice(0, 50) : data);
    if (cms.isConfigured()) {
      try {
        await cms.saveNewsAll(data);
      } catch (e) {
        console.warn("[cms] save news:", e.message);
      }
    }
  },
  upsertNewsPost: async (post) => {
    if (cms.isConfigured()) {
      try {
        await cms.upsertNewsPost(post);
      } catch (e) {
        console.warn("[cms] upsert news:", e.message);
      }
    }
    // best-effort local mirror
    try {
      const posts = readJson("news-posts.json", []);
      if (Array.isArray(posts) && posts.length) {
        const idx = posts.findIndex((p) => String(p.id) === String(post.id) || p.slug === post.slug);
        if (idx >= 0) posts[idx] = post;
        else posts.unshift(post);
        tryWriteJson("news-posts.json", posts);
      }
    } catch (_) {}
  },
  deleteNewsPost: async (idOrSlug) => {
    if (cms.isConfigured()) {
      try {
        await cms.deleteNewsPost(idOrSlug);
      } catch (e) {
        console.warn("[cms] delete news:", e.message);
      }
    }
    try {
      const posts = readJson("news-posts.json", []).filter(
        (p) => String(p.id) !== String(idOrSlug) && p.slug !== idOrSlug
      );
      tryWriteJson("news-posts.json", posts);
    } catch (_) {}
  },

  getSubpages: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("subpages");
      } catch (_) {}
    }
    if (!saved) saved = readJson("subpages.json", null);
    const defaults = defaultSubpages();
    const s = saved || defaults;
    return {
      about: Array.isArray(s.about) ? s.about : [],
      services: Array.isArray(s.services) ? s.services : [],
    };
  },
  saveSubpages: async (data) => {
    tryWriteJson("subpages.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("subpages", data);
      } catch (e) {
        console.warn("[cms] save subpages:", e.message);
      }
    }
  },

  getSeoPages: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("seo-pages");
      } catch (_) {}
    }
    if (!saved) saved = readJson("seo-pages.json", null);
    const defaults = defaultSeoPages();
    return { ...defaults, ...(saved || {}) };
  },
  saveSeoPages: async (data) => {
    tryWriteJson("seo-pages.json", data);
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("seo-pages", data);
      } catch (e) {
        console.warn("[cms] save seo-pages:", e.message);
      }
    }
  },

  getTranslations: async () => {
    let saved = null;
    if (cms.isConfigured()) {
      try {
        saved = await cms.getDoc("translations");
      } catch (_) {}
    }
    if (!saved) saved = readJson("translations.json", null);
    return saved || { vi: {}, en: {}, zh: {} };
  },
  saveTranslations: async (data) => {
    tryWriteJson("translations.json", data);
    try {
      const out = `window.I18N_TRANSLATIONS = ${JSON.stringify(data, null, 2)};\n`;
      fs.writeFileSync(path.join(root, "translations.js"), out, "utf8");
    } catch (_) {}
    if (cms.isConfigured()) {
      try {
        await cms.setDoc("translations", data);
      } catch (e) {
        console.warn("[cms] save translations:", e.message);
      }
    }
  },

  getSubmissions: async () => {
    if (cms.isConfigured()) {
      try {
        const rows = await cms.listSubmissions();
        if (rows) return rows;
      } catch (_) {}
    }
    return readJson("submissions.json", []);
  },
  addSubmission: async (entry) => {
    const item = { ...entry, id: Date.now(), createdAt: new Date().toISOString() };
    if (cms.isConfigured()) {
      try {
        await cms.addSubmissionRow(item);
        return item;
      } catch (e) {
        console.warn("[cms] add submission:", e.message);
      }
    }
    const list = readJson("submissions.json", []);
    list.unshift(item);
    tryWriteJson("submissions.json", list);
    return item;
  },
  deleteSubmission: async (id) => {
    if (cms.isConfigured()) {
      try {
        await cms.deleteSubmissionRow(id);
        return (await cms.listSubmissions()) || [];
      } catch (e) {
        console.warn("[cms] delete submission:", e.message);
      }
    }
    const list = readJson("submissions.json", []).filter((s) => s.id !== id);
    tryWriteJson("submissions.json", list);
    return list;
  },

  getVisits: async () => {
    if (cms.isConfigured()) {
      try {
        const rows = await cms.listVisits(2500);
        if (rows) return rows;
      } catch (_) {}
    }
    return readJson("visits.json", []);
  },
  addVisit: async (entry) => {
    const item = {
      ...entry,
      id: entry.id || Date.now() + Math.floor(Math.random() * 1000),
      createdAt: entry.createdAt || new Date().toISOString(),
    };
    if (cms.isConfigured()) {
      try {
        await cms.addVisitRow(item);
        return item;
      } catch (e) {
        console.warn("[cms] add visit:", e.message);
      }
    }
    const list = readJson("visits.json", []);
    const ip = item.ip || "";
    const path = item.path || "/";
    const recentDup = list.find((v) => {
      if (v.ip !== ip || v.path !== path) return false;
      const age = Date.now() - new Date(v.createdAt).getTime();
      return age >= 0 && age < 90 * 1000;
    });
    if (recentDup) return recentDup;
    list.unshift(item);
    tryWriteJson("visits.json", list.slice(0, 2500));
    return item;
  },

  getMedia: async () => {
    if (cms.isConfigured()) {
      try {
        const rows = await cms.listMedia();
        if (rows && rows.length) return rows;
      } catch (_) {}
    }
    const list = readJson("media.json", []);
    let changed = false;
    const normalized = list.map((m, i) => {
      if (m && m.id) return m;
      changed = true;
      return { ...m, id: m?.name || `media-${Date.now()}-${i}` };
    });
    if (changed) tryWriteJson("media.json", normalized);
    return normalized;
  },
  addMedia: async (entry) => {
    const item = {
      id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: entry.name,
      url: entry.url,
      key: entry.key || null,
      storage: entry.storage || (entry.key ? "r2" : "local"),
      size: entry.size || 0,
      uploadedAt: entry.uploadedAt || new Date().toISOString(),
      alt: entry.alt || "",
    };
    const list = readJson("media.json", []);
    list.unshift(item);
    tryWriteJson("media.json", list);
    return item;
  },
  deleteMedia: async (id) => {
    const list = readJson("media.json", []);
    const target = list.find((m) => String(m.id) === String(id) || m.name === id);
    // Prefer supabase list if local empty
    let deleted = target;
    if (!deleted && cms.isConfigured()) {
      try {
        const rows = await cms.listMedia();
        deleted = (rows || []).find((m) => String(m.id) === String(id) || m.name === id);
      } catch (_) {}
    }
    if (!deleted) return { ok: false, list };
    const next = list.filter((m) => m !== target);
    tryWriteJson("media.json", next);
    if (deleted.storage !== "r2" && deleted.name) {
      const fp = path.join(uploadsDir, deleted.name);
      try {
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      } catch {
        /* ignore */
      }
    }
    return { ok: true, list: next, deleted };
  },
};
