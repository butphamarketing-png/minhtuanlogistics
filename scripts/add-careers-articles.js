/**
 * Append recruitment articles (category: careers) to data/news-posts.json
 * Usage: node scripts/add-careers-articles.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const postsPath = path.join(root, "data", "news-posts.json");

const countWords = (text) =>
  String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const buildSections = (headings, paragraphsByHeading) => {
  const sections = [];
  const body = [];
  headings.forEach((h) => {
    sections.push({ type: "h2", text: h });
    const paras = paragraphsByHeading[h] || [];
    paras.forEach((p) => {
      sections.push({ type: "p", text: p });
      body.push(p);
    });
  });
  return { sections, body };
};

const IMAGES = {
  amazon: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  ],
};

const makeImages = (urls, keyword) =>
  urls.map((src, i) => ({
    src,
    alt: i === 0 ? `${keyword} — ảnh đại diện` : `${keyword} — hình ${i + 1}`,
  }));

const BENEFITS = [
  "Đóng BHXH đầy đủ theo quy định của Luật lao động.",
  "Thưởng cuối năm theo hiệu quả công việc.",
  "Hưởng đầy đủ các chế độ nghỉ phép năm, nghỉ lễ, Tết theo quy định nhà nước.",
];

const APPLY = [
  "Ứng viên quan tâm vui lòng gửi CV về email: [hcnsminhtuan@gmail.com](mailto:hcnsminhtuan@gmail.com).",
  "Địa chỉ công ty: 69/1 Trần Quốc Hoàn, Phường Tân Sơn Nhất, TP. Hồ Chí Minh.",
  "Hotline hỗ trợ: [0938 961 012](tel:0938961012) · Xem thêm [dịch vụ Minh Tuấn](/dich-vu) hoặc [liên hệ](/lien-he).",
];

const makePost = ({
  id,
  keyword,
  slug,
  title,
  metaDescription,
  excerpt,
  headings,
  paragraphsByHeading,
  imageUrls,
}) => {
  const { sections, body } = buildSections(headings, paragraphsByHeading);
  const wordCount = body.reduce((n, p) => n + countWords(p), 0) + countWords(excerpt);
  const images = makeImages(imageUrls, keyword);
  return {
    id,
    keyword,
    slug,
    title,
    metaTitle: title,
    metaDescription,
    excerpt,
    imageAlt: keyword,
    category: "careers",
    categoryLabel: "Tuyển dụng",
    date: "2026-08-03",
    dateLabel: "03/08/2026",
    dateModified: "2026-08-03",
    photo: images[0].src,
    cover: images[0].src,
    published: true,
    wordCount,
    headings,
    body,
    sections,
    images,
    internalLinks: ["/tuyen-dung", "/dich-vu", "/lien-he", "/gioi-thieu", "/tin-tuc"],
    externalLinks: ["mailto:hcnsminhtuan@gmail.com", "https://zalo.me/0938961012"],
  };
};

const ARTICLES = [
  makePost({
    id: 1113,
    keyword: "tuyển dụng nhân viên sàn Amazon",
    slug: "tuyen-dung-nhan-vien-san-amazon",
    title: "Tuyển dụng Nhân viên sàn Amazon — 4 vị trí | Minh Tuấn 2026",
    metaDescription:
      "Công ty TNHH TM DV Minh Tuấn tuyển 4 Nhân viên sàn Amazon. Lương từ 10 triệu, hoa hồng hấp dẫn, ưu tiên Web/AI. Gửi CV: hcnsminhtuan@gmail.com.",
    excerpt:
      "Công ty TNHH TM DV Minh Tuấn tìm kiếm đồng đội trẻ trung, năng động để cùng bứt phá doanh số trên thị trường quốc tế (Amazon). Tuyển 4 Nhân viên sàn Amazon.",
    imageUrls: IMAGES.amazon,
    headings: [
      "Giới thiệu vị trí tuyển dụng",
      "Thông tin vị trí Nhân viên sàn Amazon",
      "Yêu cầu ứng viên",
      "Thu nhập và chế độ đãi ngộ",
      "Địa điểm & thời gian làm việc",
      "Cách ứng tuyển",
    ],
    paragraphsByHeading: {
      "Giới thiệu vị trí tuyển dụng": [
        "Công ty TNHH TM DV Minh Tuấn đang tìm kiếm những đồng đội trẻ trung, năng động và có nhiệt huyết để cùng bứt phá doanh số trên thị trường quốc tế (Amazon).",
        "Chi tiết công việc cụ thể sẽ được trao đổi trực tiếp khi phỏng vấn. Ứng viên quan tâm có thể xem thêm các vị trí khác tại [trang Tuyển dụng](/tuyen-dung).",
      ],
      "Thông tin vị trí Nhân viên sàn Amazon": [
        "Vị trí: Nhân viên sàn Amazon.",
        "Số lượng tuyển dụng: 4 người.",
        "Giới tính: Nam/Nữ.",
        "Thời gian thử việc: Chỉ 01 tháng.",
      ],
      "Yêu cầu ứng viên": [
        "Yêu cầu ngoại ngữ: Tiếng Trung + Tiếng Anh — giao tiếp tốt và sử dụng được trong công việc.",
        "Ưu tiên các bạn khai thác tốt Web, AI; người thành thạo xây dựng (thiết lập) website — mức lương thương lượng theo năng lực.",
      ],
      "Thu nhập và chế độ đãi ngộ": [
        "Lương tối thiểu: 10.000.000 VNĐ/tháng. Không giới hạn thu nhập (áp dụng ngay từ tháng thử việc).",
        "Thưởng hoa hồng: Cơ chế hoa hồng hấp dẫn, thu nhập tăng trưởng mạnh mẽ theo hiệu quả và tiến độ công việc.",
        ...BENEFITS,
      ],
      "Địa điểm & thời gian làm việc": [
        "Địa điểm làm việc: Công ty TNHH TM DV Minh Tuấn — 69/1 Trần Quốc Hoàn, Phường Tân Sơn Nhất, TP. Hồ Chí Minh.",
        "Thời gian làm việc: Từ thứ 2 đến hết sáng thứ 7.",
      ],
      "Cách ứng tuyển": APPLY,
    },
  }),
  makePost({
    id: 1114,
    keyword: "tuyển dụng trợ lý kho nhân viên chứng từ",
    slug: "tuyen-dung-tro-ly-kho-nhan-vien-chung-tu",
    title: "Tuyển dụng Trợ lý kho — Nhân viên chứng từ hàng thảo mộc | Minh Tuấn",
    metaDescription:
      "Minh Tuấn tuyển 1 Trợ lý kho / Nhân viên chứng từ hàng trà thảo mộc, thanh nhiệt. Nam, thử việc 2 tháng. Gửi CV: hcnsminhtuan@gmail.com.",
    excerpt:
      "Công ty TNHH TM DV Minh Tuấn tuyển 1 Trợ lý kho — Nhân viên chứng từ hàng trà thảo mộc, thanh nhiệt. Ưu tiên ứng viên biết tiếng Trung.",
    imageUrls: IMAGES.warehouse,
    headings: [
      "Giới thiệu vị trí tuyển dụng",
      "Thông tin vị trí Trợ lý kho — Nhân viên chứng từ",
      "Yêu cầu ứng viên",
      "Chế độ đãi ngộ",
      "Địa điểm & thời gian làm việc",
      "Cách ứng tuyển",
    ],
    paragraphsByHeading: {
      "Giới thiệu vị trí tuyển dụng": [
        "Công ty TNHH TM DV Minh Tuấn đang tìm kiếm đồng đội trẻ trung, năng động để hỗ trợ vận hành kho và chứng từ hàng hóa — nhóm hàng trà thảo mộc, thanh nhiệt và các mặt hàng liên quan.",
        "Xem thêm vị trí [Nhân viên sàn Amazon](/bai-viet/tuyen-dung-nhan-vien-san-amazon) hoặc danh sách tại [Tuyển dụng](/tuyen-dung).",
      ],
      "Thông tin vị trí Trợ lý kho — Nhân viên chứng từ": [
        "Vị trí: Trợ lý kho — Nhân viên chứng từ hàng trà thảo mộc, thanh nhiệt…",
        "Số lượng tuyển dụng: 1 người.",
        "Giới tính: Nam.",
        "Thời gian thử việc: 2 tháng.",
      ],
      "Yêu cầu ứng viên": [
        "Yêu cầu ngoại ngữ: Biết tiếng Trung là một lợi thế.",
        "Chi tiết công việc sẽ được trao đổi trực tiếp khi phỏng vấn.",
      ],
      "Chế độ đãi ngộ": BENEFITS,
      "Địa điểm & thời gian làm việc": [
        "Địa điểm làm việc: Công ty TNHH TM DV Minh Tuấn — 69/1 Trần Quốc Hoàn, Phường Tân Sơn Nhất, TP. Hồ Chí Minh.",
        "Thời gian làm việc: Từ thứ 2 đến hết sáng thứ 7.",
      ],
      "Cách ứng tuyển": APPLY,
    },
  }),
];

const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
const slugs = new Set(ARTICLES.map((a) => a.slug));
const kept = posts.filter((p) => !slugs.has(p.slug));
const next = kept.concat(ARTICLES);
fs.writeFileSync(postsPath, JSON.stringify(next, null, 2), "utf8");
console.log(`Added/updated ${ARTICLES.length} careers articles → total ${next.length} posts`);
