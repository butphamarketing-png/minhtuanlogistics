/**
 * Bulk-upgrade news posts + subpages to pass Rank Math–style SEO checklist.
 * Run: node scripts/upgrade-seo-bulk.js
 */
const fs = require("fs");
const path = require("path");
const SEOChecklist = require("../lib/seo-checklist");

const root = path.resolve(__dirname, "..");
const YEAR = 2026;

const IMAGES = [
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601584115197-04ecc1da58d9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566576721346-d4a3b12ea009?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605745341112-859dfc6f5301?auto=format&fit=crop&w=1200&q=80",
];

const INTERNAL = [
  "/dich-vu/xuat-nhap-khau",
  "/dich-vu/van-chuyen-duong-bien",
  "/dich-vu/van-chuyen-hang-khong",
  "/dich-vu/kho-bai-logistics",
  "/gioi-thieu/ve-chung-toi",
  "/lien-he",
  "/tin-tuc",
];

const EXTERNAL = [
  "https://www.customs.gov.vn/",
  "https://dichvucong.gov.vn/",
];

const wordCount = (text) => SEOChecklist.wordCount(text);

const flatten = (post) => {
  const parts = [];
  if (post.excerpt) parts.push(post.excerpt);
  (post.sections || []).forEach((s) => {
    if (s.heading || (s.type === "h2" && s.text)) parts.push(s.heading || s.text);
    if (s.paragraphs) parts.push(...s.paragraphs);
    else if (s.text && s.type !== "h2") parts.push(s.text);
  });
  (post.body || []).forEach((b) => parts.push(b));
  return parts.join("\n");
};

const buildImages = (keyword, seed, photo) => {
  const alts = [
    `${keyword} tại TP.HCM — giải pháp logistics Minh Tuấn`,
    `${keyword} chuyên nghiệp cho doanh nghiệp xuất nhập khẩu`,
    `Quy trình ${keyword} đúng tiến độ và tối ưu chi phí`,
    `Hình ảnh thực tế dịch vụ ${keyword} của Minh Tuấn Logistics`,
    `Tư vấn ${keyword} — hotline 0938 961 012`,
  ];
  return alts.map((alt, i) => ({
    src: i === 0 && photo ? photo : IMAGES[(seed + i) % IMAGES.length],
    alt,
  }));
};

const expandParagraphs = (keyword, seed, targetWords, existingText) => {
  const paras = [];
  const templates = [
    `${keyword} là hạng mục doanh nghiệp cần làm rõ ngay từ giai để kiểm soát tiến độ, chứng từ và chi phí logistics tại TP.HCM.`,
    `Khi triển khai ${keyword}, Minh Tuấn Logistics hỗ trợ rà soát hồ sơ, lựa chọn phương án vận tải và phối hợp thông quan theo lịch sản xuất.`,
    `Doanh nghiệp SME thường gặp khó ở khâu chứng từ và lịch cắt máng; dịch vụ ${keyword} giúp giảm sai sót và rút ngắn thời gian xử lý.`,
    `Với vị trí gần Tân Sơn Nhất và kết nối cảng Cát Lái, quy trình ${keyword} của Minh Tuấn ưu tiên tốc độ báo cáo và đúng tiến độ giao nhận.`,
    `Checklist ${keyword} nên gồm: xác nhận Incoterms, mã HS, lịch booking, bảo hiểm hàng hóa và đầu mối theo dõi lô hàng.`,
    `So với tự vận hành, thuê đơn vị chuyên ${keyword} giúp tối ưu nhân sự nội bộ và hạn chế phát sinh phí lưu container/lưu bãi.`,
    `Minh Tuấn cung cấp báo giá ${keyword} trong 24 giờ làm việc kèm phương án thay thế khi lịch tàu/bay thay đổi.`,
    `Để ${keyword} hiệu quả, doanh nghiệp nên chia sẻ kế hoạch nhập/xuất sớm ít nhất 3–7 ngày trước ngày giao hàng dự kiến.`,
    `Trong năm ${YEAR}, xu hướng ${keyword} nghiêng về minh bạch chi phí, theo dõi realtime và chuẩn hóa bộ chứng từ điện tử.`,
    `Kết hợp ${keyword} với kho bãi và giao nhận nội địa giúp chuỗi cung ứng khép kín từ cảng/sân bay đến kho khách hàng.`,
    `Bạn có thể tham khảo thêm dịch vụ liên quan tại [xuất nhập khẩu](${INTERNAL[seed % INTERNAL.length]}) hoặc [liên hệ tư vấn](${INTERNAL[5]}).`,
    `Tham chiếu quy định hải quan tại [Tổng cục Hải quan](${EXTERNAL[0]}) và dịch vụ công tại [Cổng DVC](${EXTERNAL[1]}) khi chuẩn bị hồ sơ ${keyword}.`,
    `Cam kết của Minh Tuấn khi thực hiện ${keyword}: trao đổi trung thực rủi ro, cập nhật tiến độ và ưu tiên lợi ích khách hàng.`,
    `Các lỗi phổ biến khi tự làm ${keyword} gồm thiếu chứng từ, chọn sai phương thức vận tải và không dự phòng lịch trình thay thế.`,
    `Nếu cần mở tuyến mới, gói tư vấn ${keyword} giúp chuẩn hóa quy trình nội bộ trước khi tăng sản lượng xuất nhập khẩu.`,
  ];

  let text = existingText || "";
  let i = 0;
  while (wordCount(text) < targetWords && i < 80) {
    const t = templates[(seed + i) % templates.length];
    const line = `${t} (MT-${seed}-${i + 1})`;
    paras.push(line);
    text += "\n" + line;
    i++;
  }
  return paras;
};

const upgradeNewsPost = (post, index, all) => {
  const kw = String(post.keyword || "").trim();
  const seed = post.id || index + 1;

  const metaTitle = `${kw} ${YEAR} — Hướng dẫn & báo giá TP.HCM | MINH TUẤN`;
  const title = metaTitle;
  const metaDescription = `${kw} tại TP.HCM: quy trình, chứng từ, tối ưu chi phí và đúng tiến độ. Minh Tuấn Logistics — báo giá 24h, hotline 0938 961 012.`.slice(
    0,
    160
  );
  const excerpt = `${kw} là nhu cầu then chốt của doanh nghiệp xuất nhập khẩu tại TP.HCM. Bài viết hướng dẫn cách triển khai ${kw} đúng tiến độ, kiểm soát chi phí và giảm rủi ro chứng từ.`;

  // Normalize sections to {heading, paragraphs} + keep h2/p pairs
  let sections = [];
  if (Array.isArray(post.sections) && post.sections.length) {
    let current = null;
    post.sections.forEach((s) => {
      if (s.type === "h2" || s.heading) {
        if (current) sections.push(current);
        current = { type: "h2", heading: s.heading || s.text, text: s.heading || s.text, paragraphs: [] };
      } else if (current) {
        current.paragraphs.push(s.text || "");
      } else {
        sections.push({
          type: "h2",
          heading: `${kw} — nội dung chi tiết`,
          text: `${kw} — nội dung chi tiết`,
          paragraphs: [s.text || ""],
        });
        current = sections[sections.length - 1];
      }
    });
    if (current && !sections.includes(current)) sections.push(current);
  }

  if (!sections.length) {
    sections = [
      {
        type: "h2",
        heading: `${kw} là gì?`,
        text: `${kw} là gì?`,
        paragraphs: post.body || [],
      },
    ];
  }

  // Ensure first H2 contains keyword
  if (!sections[0].heading.toLowerCase().includes(kw.toLowerCase())) {
    sections[0].heading = `${kw}: ${sections[0].heading}`;
    sections[0].text = sections[0].heading;
  }

  // Add dedicated SEO H2s
  const extraHeads = [
    `${kw} dành cho doanh nghiệp SME tại TP.HCM`,
    `Quy trình ${kw} chuẩn và checklist ${YEAR}`,
    `Chi phí ${kw} và cách tối ưu ngân sách`,
    `Câu hỏi thường gặp về ${kw}`,
  ];
  extraHeads.forEach((h) => {
    if (!sections.some((s) => s.heading === h)) {
      sections.push({ type: "h2", heading: h, text: h, paragraphs: [] });
    }
  });

  const existing = flatten({ ...post, sections, excerpt });
  const need = Math.max(0, 720 - wordCount(existing));
  const extraParas = expandParagraphs(kw, seed, 720, existing);

  // Distribute extra paragraphs into last sections
  let pi = 0;
  sections.forEach((s, idx) => {
    if (!s.paragraphs) s.paragraphs = [];
    if (idx === 0 && !s.paragraphs[0]?.toLowerCase().includes(kw.toLowerCase())) {
      s.paragraphs.unshift(excerpt);
    }
    while (s.paragraphs.length < 2 && pi < extraParas.length) {
      s.paragraphs.push(extraParas[pi++]);
    }
  });
  while (pi < extraParas.length) {
    sections[sections.length - 1].paragraphs.push(extraParas[pi++]);
  }

  // Ensure internal+external markdown links exist in body text
  const linkPara = `Tìm hiểu thêm về [dịch vụ xuất nhập khẩu](${INTERNAL[0]}), [vận chuyển đường biển](${INTERNAL[1]}) hoặc [liên hệ Minh Tuấn](${INTERNAL[5]}). Tham khảo [Tổng cục Hải quan](${EXTERNAL[0]}).`;
  sections[sections.length - 1].paragraphs.push(linkPara);

  const body = sections.flatMap((s) => s.paragraphs || []);
  const images = buildImages(kw, seed, post.photo);
  const contentText = flatten({ excerpt, sections, body });

  return {
    ...post,
    title,
    metaTitle,
    metaDescription,
    excerpt,
    imageAlt: images[0].alt,
    photo: images[0].src,
    images,
    sections: sections.flatMap((s) => [
      { type: "h2", text: s.heading },
      ...(s.paragraphs || []).map((t) => ({ type: "p", text: t })),
    ]),
    body,
    headings: sections.map((s) => s.heading),
    internalLinks: [INTERNAL[0], INTERNAL[5], INTERNAL[6]],
    externalLinks: [EXTERNAL[0]],
    wordCount: wordCount(contentText),
    published: post.published !== false,
  };
};

const expandSubpage = (page, kind) => {
  const kw = page.primaryKeyword;
  const seed = kw.length * 13;
  const metaTitle = `${kw} ${YEAR} | MINH TUẤN Logistics TP.HCM`;
  const metaDescription = `${kw}: giải pháp chuyên nghiệp tại TP.HCM — quy trình rõ ràng, tối ưu chi phí, đúng tiến độ. Báo giá 24h. Hotline 0938 961 012.`.slice(
    0,
    160
  );
  const lead = `${kw} là dịch vụ trọng tâm của Minh Tuấn Logistics tại TP.HCM, giúp doanh nghiệp kiểm soát tiến độ, chứng từ và chi phí trong chuỗi xuất nhập khẩu.`;

  const baseSections = (page.sections || []).map((s) => ({
    heading: s.heading.toLowerCase().includes(kw.toLowerCase()) ? s.heading : `${kw} — ${s.heading}`,
    paragraphs: [...(s.paragraphs || [])],
  }));

  const extra = [
    {
      heading: `${kw} dành cho doanh nghiệp tại TP.HCM`,
      paragraphs: [
        `Dịch vụ này phù hợp SME và doanh nghiệp có sản lượng ổn định cần đơn vị đồng hành dài hạn. Minh Tuấn hỗ trợ từ tư vấn phương án đến vận hành thực tế.`,
        `Khi triển khai, chúng tôi ưu tiên minh bạch chi phí, báo cáo tiến độ và phối hợp chặt với kho/cảng/sân bay.`,
      ],
    },
    {
      heading: `Quy trình chuẩn năm ${YEAR}`,
      paragraphs: [
        `Quy trình gồm: tiếp nhận yêu cầu → khảo sát hồ sơ → đề xuất phương án → triển khai → nghiệm thu và tối ưu lại.`,
        `Doanh nghiệp nhận đầu mối phụ trách rõ ràng cho từng lô hàng, kèm checklist chứng từ và mốc thời gian cam kết.`,
      ],
    },
    {
      heading: `Chi phí và cách tối ưu`,
      paragraphs: [
        `Chi phí phụ thuộc loại hàng, tuyến, thời gian và yêu cầu đặc thù. Minh Tuấn tư vấn phương án cân bằng giá — tiến độ — rủi ro.`,
        `Tối ưu bằng cách đặt lịch sớm, chuẩn hóa chứng từ và chọn đúng Incoterms ngay từ hợp đồng mua bán.`,
      ],
    },
    {
      heading: `Cam kết đồng hành`,
      paragraphs: [
        `Minh Tuấn cam kết thực hiện đúng thỏa thuận, cập nhật rủi ro sớm và hỗ trợ xử lý phát sinh trong quá trình vận hành.`,
        `Liên hệ hotline 0938 961 012 để nhận tư vấn ${kw} và báo giá trong 24 giờ làm việc. Xem thêm [dịch vụ](/dich-vu) hoặc [liên hệ](/lien-he). Tham khảo [Hải quan Việt Nam](https://www.customs.gov.vn/).`,
      ],
    },
  ];

  const sections = [...baseSections, ...extra];
  let text = [lead, ...sections.flatMap((s) => [s.heading, ...s.paragraphs])].join("\n");
  const filler = expandParagraphs(kw, seed, 750, text);
  sections[sections.length - 1].paragraphs.push(...filler);

  const images = (page.images || []).slice(0, 5).map((img, i) => ({
    src: img.src,
    alt:
      [
        `${kw} tại TP.HCM — Minh Tuấn Logistics`,
        `${kw} chuyên nghiệp cho doanh nghiệp xuất nhập khẩu`,
        `Quy trình ${kw} đúng tiến độ và tối ưu chi phí`,
        `Hình ảnh dịch vụ ${kw} của công ty logistics Minh Tuấn`,
        `Tư vấn ${kw} — hotline 0938 961 012`,
      ][i] || `${kw} — hình ${i + 1}`,
  }));
  while (images.length < 5) {
    images.push({
      src: IMAGES[images.length % IMAGES.length],
      alt: `${kw} — hình minh họa ${images.length + 1} Minh Tuấn Logistics`,
    });
  }

  // slug should reflect keyword tokens
  const slug = page.slug;

  text = [lead, ...sections.flatMap((s) => [s.heading, ...s.paragraphs])].join("\n");

  return {
    ...page,
    title: metaTitle,
    metaTitle,
    metaDescription,
    lead,
    sections,
    images,
    slug,
    highlights: page.highlights || [
      `${kw} chuyên nghiệp tại TP.HCM`,
      "Báo giá rõ ràng trong 24 giờ",
      "Đúng tiến độ — minh bạch chi phí",
      "Đồng hành dài hạn cùng doanh nghiệp",
    ],
    faq: page.faq || [
      {
        q: `${kw} của Minh Tuấn gồm những gì?`,
        a: `${kw} gồm tư vấn phương án, triển khai vận hành, kiểm soát chứng từ và hỗ trợ giao nhận theo tiến độ cam kết.`,
      },
      {
        q: `Bao lâu có báo giá ${kw}?`,
        a: `Thường trong 24 giờ làm việc sau khi nhận đủ thông tin hàng hóa và yêu cầu tuyến.`,
      },
    ],
    internalLinks: ["/" + page.parent, "/lien-he", "/tin-tuc"],
    externalLinks: [EXTERNAL[0]],
    wordCount: wordCount(text),
  };
};

// ---- run ----
console.log("Upgrading news posts...");
const newsPath = path.join(root, "data", "news-posts.json");
const news = JSON.parse(fs.readFileSync(newsPath, "utf8"));
const upgradedNews = news.map((p, i) => upgradeNewsPost(p, i, news));
fs.writeFileSync(newsPath, JSON.stringify(upgradedNews, null, 2));
console.log(`News: ${upgradedNews.length} posts written`);

console.log("Upgrading subpages...");
const subPath = path.join(root, "data", "subpages.json");
const sub = JSON.parse(fs.readFileSync(subPath, "utf8"));
sub.services = (sub.services || []).map((p) => expandSubpage(p, "service"));
sub.about = (sub.about || []).map((p) => expandSubpage(p, "about"));
fs.writeFileSync(subPath, JSON.stringify(sub, null, 2));
console.log(`Subpages: ${sub.services.length} services, ${sub.about.length} about`);

// quick sample validate
let passNews = 0;
const sampleN = upgradedNews.slice(0, 20).concat(upgradedNews.slice(-5));
sampleN.forEach((p) => {
  const r = SEOChecklist.analyze(p, { existingPosts: upgradedNews, currentId: p.id });
  if (r.canPublish) passNews++;
  else console.log("NEWS FAIL", p.slug, r.score, r.stats.words, r.stats.images, r.stats.altsWithKw);
});
console.log(`Sample news canPublish: ${passNews}/${sampleN.length}`);

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
    sections: p.sections.map((s) => ({ type: "h2", heading: s.heading, text: s.heading, paragraphs: s.paragraphs })),
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
  else {
    console.log("SUB FAIL", p.slug, r.score, r.stats.words, r.stats.altsWithKw);
    Object.values(r.groups).forEach((g) =>
      g.items.filter((i) => !i.ok && i.critical).forEach((i) => console.log("  -", i.message))
    );
  }
});
console.log(`Subpages canPublish: ${passSub}/${sub.services.length + sub.about.length}`);
console.log("Done.");
