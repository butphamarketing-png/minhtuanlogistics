/**
 * Append warehouse / TMĐT keyword articles to data/news-posts.json
 * Usage: node scripts/add-warehouse-keyword-articles.js
 */
const fs = require("fs");
const path = require("path");
const { analyze } = require("../lib/seo-checklist");

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
    (paragraphsByHeading[h] || []).forEach((p) => {
      sections.push({ type: "p", text: p });
      body.push(p);
    });
  });
  return { sections, body };
};

const POOLS = [
  [
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1200&q=80",
  ],
];

const makeImages = (urls, keyword) =>
  urls.map((src, i) => ({
    src,
    alt: i === 0 ? `${keyword} — ảnh đại diện` : `${keyword} — hình ${i + 1}`,
  }));

const makePost = (cfg, idx) => {
  const { sections, body } = buildSections(cfg.headings, cfg.paragraphsByHeading);
  const wordCount = body.reduce((n, p) => n + countWords(p), 0) + countWords(cfg.excerpt);
  const images = makeImages(POOLS[idx % POOLS.length], cfg.keyword);
  return {
    id: cfg.id,
    keyword: cfg.keyword,
    slug: cfg.slug,
    title: cfg.title,
    metaTitle: cfg.title,
    metaDescription: cfg.metaDescription,
    excerpt: cfg.excerpt,
    imageAlt: cfg.keyword,
    category: "warehouse",
    categoryLabel: "Kho bãi",
    date: "2026-08-11",
    dateLabel: "11/08/2026",
    dateModified: "2026-08-11",
    photo: images[0].src,
    cover: images[0].src,
    published: true,
    wordCount,
    headings: cfg.headings,
    body,
    sections,
    images,
    internalLinks: cfg.internalLinks,
    externalLinks: ["https://www.customs.gov.vn/", "https://zalo.me/0938961012"],
  };
};

const ZALO = "[Zalo 0938 961 012](https://zalo.me/0938961012)";
const CONTACT = "[liên hệ](/lien-he)";
const THUE = "[cho thuê kho](/bai-viet/cho-thue-kho)";
const TMDT = "[cho thuê kho TMĐT](/bai-viet/cho-thue-kho-tmdt)";
const KHO = "[kho bãi logistics](/dich-vu/kho-bai-logistics)";
const FF = "[fulfillment logistics](/bai-viet/fulfillment-logistics)";
const PL3 = "[dịch vụ 3PL](/bai-viet/dich-vu-3pl)";

const SPECS = [
  {
    id: 1117,
    keyword: "cho thuê kho TP.HCM",
    slug: "cho-thue-kho-tphcm",
    title: "Cho thuê kho TP.HCM 2026 — Gần Cát Lái & Tân Sơn Nhất | MINH TUẤN",
    metaDescription:
      "Cho thuê kho TP.HCM 2026: phân phối, mini, mát, tự quản. Gần Cát Lái, Tân Sơn Nhất. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho TP.HCM tại Minh Tuấn giúp doanh nghiệp giữ hàng gần cảng Cát Lái và sân bay Tân Sơn Nhất, linh hoạt m²/m³, xuất nhập nhanh và chi phí tách dòng theo đúng nhu cầu vận hành 2026.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/dich-vu/kho-bai-logistics", "/bai-viet/kho-bai-logistics-tp-hcm", "/lien-he", "/bai-viet/cho-thue-kho-gan-cat-lai"],
    headings: [
      "Cho thuê kho TP.HCM phù hợp doanh nghiệp nào?",
      "Vị trí kho và bán kính giao nhận nội thành",
      "Các gói cho thuê kho TP.HCM theo mô hình vận hành",
      "Giá cho thuê kho TP.HCM tham khảo 2026",
      "Hạ tầng, PCCC và tiện ích tại kho Minh Tuấn",
      "Kết nối cảng, sân bay và tuyến vành đai",
      "Quy trình onboard cho thuê kho TP.HCM",
      "Lỗi thường gặp khi tự thuê mặt bằng kho",
      "Câu hỏi thường gặp",
      "Nhận khảo sát cho thuê kho TP.HCM",
    ],
    paragraphsByHeading: {
      "Cho thuê kho TP.HCM phù hợp doanh nghiệp nào?": [
        "Cho thuê kho TP.HCM phục vụ shop online, SME phân phối, đại lý nhập khẩu và xưởng nhẹ cần chỗ chứa gần khách miền Nam mà không muốn ký nhà xưởng 3–5 năm. Bạn trả đúng diện tích và dịch vụ dùng, tăng giảm theo mùa sale hoặc mùa nhập.",
        "Khác thuê mặt bằng bán lẻ, cho thuê kho TP.HCM tập trung sức chứa, xe nâng, PCCC và giờ lấy hàng. Minh Tuấn tư vấn chọn kho quản lý hộ hay tự quản ngay buổi khảo sát đầu — xem thêm ${THUE}.",
        "Năm 2026, mặt bằng nội thành khan hiếm và giá nhân sự kho tăng. Cho thuê kho TP.HCM giúp CFO chuyển chi phí cố định thành biến đổi, dễ cắt khi sản lượng giảm sau Tết.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Vị trí kho và bán kính giao nhận nội thành": [
        "Điểm cho thuê kho TP.HCM của Minh Tuấn ưu tiên trục kết nối Quận 7, Thủ Đức, Tân Bình, Bình Tân và các KCN cửa ngõ. Bán kính giao nội thành thường 30–90 phút tùy giờ cấm tải.",
        "Hàng xuất nhanh nên nằm gần tuyến ĐVVC lấy bill. Hàng container nên gần Cát Lái để giảm kéo. Chúng tôi tách slot theo loại hàng để cho thuê kho TP.HCM không bị kẹt xe nâng giờ cao điểm.",
        "Cần giao sân bay Tân Sơn Nhất (hàng mẫu, hàng không) thì báo trước cut-off. Cho thuê kho TP.HCM gắn vận tải bộ giúp một đầu mối từ kho ra điểm giao.",
      ],
      "Các gói cho thuê kho TP.HCM theo mô hình vận hành": [
        "Gói phân phối: kho soạn hộ, báo cáo realtime, phù hợp nhiều SKU. Gói mini/kiot: khóa riêng từ 1m². Gói mát 18–25°C. Gói tự quản theo m², setup góc văn phòng.",
        "Shop đa sàn nên kết hợp cho thuê kho TP.HCM với ${TMDT} để pick-pack đúng SLA Shopee/Lazada/TikTok. Doanh nghiệp nhập khẩu giữ hàng sau thông quan tại cùng hệ thống ${KHO}.",
        "Có thể thuê mix: 70% tự quản + 30% fulfillment. Cho thuê kho TP.HCM linh hoạt điều chỉnh tỷ lệ khi livestream tăng đơn.",
      ].map((p) => p.replace("${TMDT}", TMDT).replace("${KHO}", KHO)),
      "Giá cho thuê kho TP.HCM tham khảo 2026": [
        "Giá cho thuê kho TP.HCM tham khảo: phân phối từ 65.000đ/m³, mini từ 300.000đ/tháng, mát từ 180.000đ/m³/tháng, tự quản từ 130.000đ/m²/tháng. Ưu đãi tặng tháng và chiết khấu thanh toán 06–12 tháng.",
        "Giá cuối phụ thuộc SKU, tần suất xuất, ca đêm và vị trí. Báo giá cho thuê kho TP.HCM luôn tách lưu kho / pick / bốc xếp / vận chuyển — không gộp mơ hồ.",
        "So sánh giá phải cùng SLA và cùng dải nhiệt. Liên hệ ${ZALO} để nhận bảng theo đúng loại hàng của bạn.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Hạ tầng, PCCC và tiện ích tại kho Minh Tuấn": [
        "Cho thuê kho TP.HCM chỉ bền khi có PCCC thẩm duyệt, camera, bảo vệ 24/7, nền chịu tải và lối xe nâng. Minh Tuấn không nhận hàng vào điểm thiếu pháp lý phòng cháy.",
        "Tiện ích: pallet, xe nâng, bàn pack, cân, máy quấn màng. Kho quản lý hộ có phần mềm tồn; kho tự quản giao khóa và nội quy ra vào.",
        "Hàng giá trị cao được xếp khu hạn chế. Đây là tiêu chí khách hay bỏ quên khi tự tìm cho thuê kho TP.HCM trên nhóm rao vặt.",
      ],
      "Kết nối cảng, sân bay và tuyến vành đai": [
        "Từ kho có thể kéo ruột/cont Cát Lái, giao Tân Sơn Nhất, chạy vành đai 2–3 xuống Bình Dương, Đồng Nai, Long An. Cho thuê kho TP.HCM vì thế thành nút trung chuyển miền Nam, không chỉ “chỗ để hàng”.",
        "Hàng nhập xem thêm ${KHO} và thủ tục trên [Hải quan Việt Nam](https://www.customs.gov.vn/). Một lịch kho – hải quan – xe giảm lưu cont.",
        "Mùa cao điểm Tết, slot xe khan. Đặt cho thuê kho TP.HCM trước 4–6 tuần nếu forecast tăng mạnh.",
      ].map((p) => p.replace("${KHO}", KHO)),
      "Quy trình onboard cho thuê kho TP.HCM": [
        "Bước 1: gửi loại hàng, nhiệt độ, số m²/m³, đơn/ngày. Bước 2: đề xuất điểm và giá. Bước 3: xem kho / ảnh thực tế. Bước 4: ký và nhập tồn đầu. Bước 5: vận hành và báo cáo.",
        "Onboard lô vừa thường 1–2 ngày. Cho thuê kho TP.HCM nhận hàng ngoài giờ theo lịch bảo vệ.",
        "Chuẩn bị file SKU và ảnh thùng. Thiếu mã làm chậm dán kệ — đặc biệt khi chuyển từ kho nhà sang kho chuyên nghiệp.",
      ],
      "Lỗi thường gặp khi tự thuê mặt bằng kho": [
        "Thuê nhà dân làm kho: sai PCCC, cấm xe tải, hàng xóm khiếu nại. Cho thuê kho TP.HCM chuyên biệt tránh rủi ro bị buộc chuyển kho giữa mùa.",
        "Ký diện tích lớn hơn nhu cầu 6 tháng đầu. Nên bắt đầu nhỏ, scale khi đơn ổn.",
        "Không tính cấm tải và giờ ĐVVC lấy hàng. Hỏi rõ trước khi chốt cho thuê kho TP.HCM.",
      ],
      "Câu hỏi thường gặp": [
        "Có cho thuê kho TP.HCM theo tuần không? Có với kho mini/phân phối; giá ngày cao hơn tháng. Hàng nguy hiểm cần khai báo trước.",
        "Có được tự vào lấy hàng? Kho tự quản/mini được theo nội quy; kho quản lý hộ ưu tiên xuất theo lệnh.",
        "Hợp đồng tối thiểu? Linh hoạt theo tháng; ưu đãi tốt từ 03 tháng. Xem ${CONTACT}.",
      ].map((p) => p.replace("${CONTACT}", CONTACT)),
      "Nhận khảo sát cho thuê kho TP.HCM": [
        "Gửi địa chỉ giao hàng chính và loại xe đang dùng. Minh Tuấn chọn điểm cho thuê kho TP.HCM tối ưu km kéo, không chỉ rẻ mét vuông.",
        "Kết hợp ${THUE} toàn quốc nếu cần kho Hà Nội/Hải Phòng đồng bộ SOP.",
        "Gọi ${ZALO} — báo giá cho thuê kho TP.HCM trong 24 giờ làm việc.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1118,
    keyword: "bảng giá cho thuê kho",
    slug: "bang-gia-cho-thue-kho",
    title: "Bảng giá cho thuê kho 2026 — m², m³, pallet | MINH TUẤN",
    metaDescription:
      "Bảng giá cho thuê kho 2026: từ 65K/m³, mini 300K/tháng, mát 180K/m³, tự quản 130K/m². Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Bảng giá cho thuê kho 2026 của Minh Tuấn tách rõ đơn vị m², m³, pallet và phí pick — giúp doanh nghiệp lập ngân sách trước khi ký, kèm ưu đãi tặng tháng và chiết khấu thanh toán một lần.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/bai-viet/cho-thue-kho-tphcm", "/bai-viet/chi-phi-thue-kho", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Bảng giá cho thuê kho 2026 theo từng mô hình",
      "Cách đọc đơn vị tính m², m³ và pallet",
      "Ưu đãi làm thay đổi bảng giá cho thuê kho",
      "Phí gia tăng không nằm trong giá lưu",
      "Ví dụ ước tính tháng cho shop và SME",
      "So sánh báo giá đúng cách",
      "Khi nào giá tăng hoặc giảm",
      "Câu hỏi thường gặp về bảng giá cho thuê kho",
      "Yêu cầu bảng giá cho thuê kho theo hàng thật",
      "Cam kết minh bạch từ Minh Tuấn",
    ],
    paragraphsByHeading: {
      "Bảng giá cho thuê kho 2026 theo từng mô hình": [
        "Bảng giá cho thuê kho tham khảo: kho phân phối từ 65.000đ/m³; kho mini từ 300.000đ/tháng; kho mát từ 180.000đ/m³/tháng; kho tự quản từ 130.000đ/m²/tháng. Mức “chỉ từ” áp dụng khi còn chỗ và ký điều kiện ưu đãi.",
        "Bảng giá cho thuê kho không gồm cước giao hàng trừ khi ghi rõ. Pallet free theo thỏa thuận gói phân phối/mát dưới ngưỡng mã hàng.",
        "In bảng này để họp nội bộ, rồi gửi SKU cho Minh Tuấn chốt số. Xem mô hình tại ${THUE}.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Cách đọc đơn vị tính m², m³ và pallet": [
        "m² dùng kho tự quản (bạn thuê mặt sàn). m³ dùng kho chứa hộ (trả theo thể tích chiếm kệ). Pallet dùng hàng đồng nhất xếp chuẩn. Bảng giá cho thuê kho sai đơn vị sẽ lệch 30–50% ngân sách.",
        "Thùng 40×40×40 cm ≈ 0,064 m³. 15 thùng ≈ 1 m³. Đừng lấy diện tích nhà chia 3 rồi nhân giá m³.",
        "Hàng nhẹ phồng (gối, thùng carton rỗng) tính m³ có lợi hơn m². Hàng nặng đặc ngược lại. Bảng giá cho thuê kho nên kèm cách đo thực tế lúc inbound.",
      ],
      "Ưu đãi làm thay đổi bảng giá cho thuê kho": [
        "Thuê 03 tháng tặng 1 tháng; 06 tháng tặng 2 tháng (kho mini). Thanh toán 06 tháng chiết khấu ~10%; 12 tháng ~15%. Bảng giá cho thuê kho sau ưu đãi mới là số CFO cần.",
        "Gói phân phối/mát: giảm đến 50%/20% phí thuê khi ký dài, giảm 15% cước nếu đi xe Minh Tuấn, miễn quản lý < 20 SKU.",
        "Ưu đãi không cộng dồn vô hạn. Nhân viên sẽ ghi rõ dòng nào đã trừ trong bảng giá cho thuê kho gửi email.",
      ],
      "Phí gia tăng không nằm trong giá lưu": [
        "Pick theo dòng đơn, kiểm đếm chi tiết, dán lại tem, đóng gỗ, overtime, lưu xe đêm. Bảng giá cho thuê kho chuẩn phải liệt kê đơn giá phát sinh.",
        "Hàng hoàn TMĐT có phí inbound chiều ngược. Nên dự 5–10% đơn nếu bán Shopee/TikTok.",
        "Không có phí “lót tay” hay phụ thu cuối tháng không báo trước. Mọi phát sinh có lệnh xác nhận.",
      ],
      "Ví dụ ước tính tháng cho shop và SME": [
        "Shop 80 thùng (~5 m³) kho phân phối: lưu khoảng từ vài trăm nghìn, cộng pick nếu gửi soạn hộ. Đưa vào bảng giá cho thuê kho cột “kịch bản thấp / trung / peak”.",
        "SME 80 m² tự quản: từ ~10,4 triệu/tháng trước ưu đãi dài hạn, chưa gồm điện 3 pha vượt định mức.",
        "Gửi số thùng + đơn/ngày để Minh Tuấn lập bảng giá cho thuê kho 3 kịch bản — ${ZALO}.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "So sánh báo giá đúng cách": [
        "Đối chiếu cùng: dải nhiệt, giờ cut-off, PCCC, camera, WMS, bán kính lấy hàng. Bảng giá cho thuê kho rẻ nhưng kho xa Cát Lái có thể đội cước kéo.",
        "Hỏi kho có cấm tải không, có xe nâng ca đêm không. Thiếu hai ý này giá rẻ thành đắt.",
        "Giữ file PDF bảng giá cho thuê kho kèm ngày hiệu lực. Giá slot thay đổi theo mùa.",
      ],
      "Khi nào giá tăng hoặc giảm": [
        "Tăng: cao điểm Tết, hàng mát hết slot, ca pick đêm 11.11. Giảm: ký 6–12 tháng, dồn hàng một điểm, tự dán barcode trước khi gửi.",
        "Bảng giá cho thuê kho có thể review quý nếu sản lượng lệch >30% so với cam kết.",
        "Báo forecast sớm để giữ giá cũ. Slot không giữ vô thời hạn.",
      ],
      "Câu hỏi thường gặp về bảng giá cho thuê kho": [
        "Bảng giá cho thuê kho có VAT không? Báo giá ghi rõ chưa/đã VAT tùy loại hợp đồng. Hóa đơn đầy đủ theo yêu cầu kế toán.",
        "Có giá ngày không? Có với gửi ngắn; đơn giá cao hơn tháng. Hàng nguy hiểm báo riêng.",
        "Giá Hà Nội/Hải Phòng khác không? Khác theo mặt bằng. Bảng giá cho thuê kho HCM là mặc định trang này.",
      ],
      "Yêu cầu bảng giá cho thuê kho theo hàng thật": [
        "Gửi ảnh thùng, số SKU, HSD (nếu có), đơn/ngày. Trong 24h bạn nhận bảng giá cho thuê kho đúng hàng, không copy mức “chỉ từ”.",
        "Có thể xin thêm phương án ${TMDT} nếu bán sàn. Xem ${CONTACT}.",
        "Đính kèm luôn lịch nhập container để tính inbound một lần.",
      ].map((p) => p.replace("${TMDT}", TMDT).replace("${CONTACT}", CONTACT)),
      "Cam kết minh bạch từ Minh Tuấn": [
        "Minh Tuấn dùng một bảng giá cho thuê kho cho sales và vận hành — không hai giá. Phát sinh có phiếu.",
        "Bạn được giải thích từng dòng trước khi ký. Không hiểu dòng nào thì chưa chốt.",
        "Bắt đầu từ ${THUE} hoặc gọi ${ZALO}.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1119,
    keyword: "cho thuê kho mini",
    slug: "cho-thue-kho-mini",
    title: "Cho thuê kho mini 2026 — Kiot từ 1m² giá từ 300K | MINH TUẤN",
    metaDescription:
      "Cho thuê kho mini 2026: kiot 1m²–vài chục m², khóa riêng, camera 24/7, từ 300K/tháng. Tặng tháng khi thuê dài. Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho mini dành cho cá nhân, gia đình và shop mới cần kiot khóa riêng từ 1m², giá chỉ từ 300.000đ/tháng, tặng tháng khi thuê dài và chủ động giờ lấy hàng trong khu an ninh 4 lớp.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/bai-viet/cho-thue-kho-tphcm", "/bai-viet/cho-thue-kho-shop-online", "/bai-viet/bang-gia-cho-thue-kho", "/lien-he"],
    headings: [
      "Cho thuê kho mini là gì?",
      "Ai nên chọn cho thuê kho mini",
      "Ưu đãi cho thuê kho mini 2026",
      "Bảo mật 4 lớp và tiện ích miễn phí",
      "Kho mini khác kho phân phối chỗ nào",
      "Hàng nào phù hợp kiot mini",
      "Quy trình thuê và nhận kiot",
      "Câu hỏi thường gặp về cho thuê kho mini",
      "Nâng cấp từ mini sang fulfillment",
      "Đăng ký cho thuê kho mini",
    ],
    paragraphsByHeading: {
      "Cho thuê kho mini là gì?": [
        "Cho thuê kho mini là thuê kiot/kho nhỏ khóa riêng, diện tích từ 1m² đến vài chục m², khách tự sắp xếp và tự lấy hàng. Không chia kệ với người khác như kho dùng chung.",
        "Thiết kế hiện đại, lối đi xe đẩy/thang máy. Cho thuê kho mini giải bài toán “hết chỗ trong nhà” mà chưa đủ sản lượng thuê 50–100 m².",
        "Minh Tuấn vận hành cho thuê kho mini trong cụm có bảo vệ, khác thuê phòng trọ để hàng — xem tổng quan ${THUE}.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Ai nên chọn cho thuê kho mini": [
        "Cá nhân cất đồ, gia đình sửa nhà, shop online dưới ~100 đơn/ngày, freelancer giữ hàng livestream, DN nhỏ giữ mẫu và tồn ít.",
        "Cho thuê kho mini không thay pick-pack chuyên sâu. Nếu đơn tăng và cần soạn hộ, chuyển ${TMDT}.",
        "Phù hợp người muốn giữ chìa khóa, vào lấy ngoài khung giờ văn phòng theo nội quy điểm kho.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Ưu đãi cho thuê kho mini 2026": [
        "Giá cho thuê kho mini chỉ từ 300.000đ/tháng. Thuê 03 tháng tặng +1 tháng; 06 tháng tặng +2 tháng. Thanh toán một lần 06 tháng giảm ~10%, 12 tháng ~15%.",
        "Áp dụng kho dài hạn, thanh toán trước, còn chỗ. Giá kiot góc/lối lớn hơn kiot trong.",
        "Hỏi chỗ trống trước khi chuyển hàng. Slot cho thuê kho mini hết nhanh trước Tết.",
      ],
      "Bảo mật 4 lớp và tiện ích miễn phí": [
        "4 lớp: kiot riêng — khóa cá nhân — camera — bảo vệ 24/7. Cho thuê kho mini không dùng ổ khóa chung.",
        "Miễn phí xe nâng, xe đẩy, thang máy theo nội quy. Có thể thuê thêm bốc xếp, đóng gói, dán tem, vận chuyển.",
        "Cấm để hàng cháy nổ, thực phẩm tươi chảy nước. Nội quy gửi kèm hợp đồng cho thuê kho mini.",
      ],
      "Kho mini khác kho phân phối chỗ nào": [
        "Mini: bạn tự quản. Phân phối: kho soạn, đếm, báo cáo hộ. Chi phí mini thấp hơn nếu bạn có thời gian tự lấy.",
        "Nhiều khách bắt đầu cho thuê kho mini 3 tháng, rồi chuyển 20% SKU nóng sang fulfillment.",
        "Không có WMS chi tiết từng đơn ở gói mini trừ khi mua thêm dịch vụ đếm định kỳ.",
      ],
      "Hàng nào phù hợp kiot mini": [
        "Quần áo, phụ kiện, mỹ phẩm không cần mát, đồ gia dụng nhỏ, hồ sơ, đồ gia đình. Hàng mát/lạnh xếp kho chuyên.",
        "Không để pin lithium số lượng lớn, hóa chất, hàng khai thác trái phép. Khai báo khi ký cho thuê kho mini.",
        "Thùng ghi tên/SĐT ngoài thùng để hỗ trợ tìm khi bạn nhờ nhân viên lấy hộ có phí.",
      ],
      "Quy trình thuê và nhận kiot": [
        "Chọn size → xem ảnh/thực tế → ký → nhận 2 chìa (hoặc 1 chìa + 1 giữ quầy) → chuyển hàng. Cho thuê kho mini onboard trong ngày nếu còn kiot.",
        "Đặt cọc theo điểm kho. Trả kiot sạch, khóa còn, hoàn cọc theo biên bản.",
        "Chụp ảnh lúc nhận. Tránh tranh chấp khi kết thúc hợp đồng cho thuê kho mini.",
      ],
      "Câu hỏi thường gặp về cho thuê kho mini": [
        "Cho thuê kho mini có điện sạc không? Một số kiot có ổ; công suất nhỏ, không chạy điều hòa riêng trừ gói mát.",
        "Mất chìa? Báo bảo vệ, thay ruột khóa có phí. Không tự phá khóa.",
        "Chia sẻ kiot với cộng sự? Được, đăng ký tên người ra vào.",
      ],
      "Nâng cấp từ mini sang fulfillment": [
        "Khi đơn > 50–80/ngày hoặc bán 2+ sàn, mini tốn công in bill. Nâng một phần SKU sang ${TMDT} trong cùng hệ thống.",
        "Không cần chuyển hết. Cho thuê kho mini giữ hàng chậm, fulfillment giữ hàng nóng.",
        "Minh Tuấn lập kế hoạch chuyển kệ, tránh bán trùng tồn.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Đăng ký cho thuê kho mini": [
        "Nhắn size cần (1 / 2 / 4 / 8 m²…) và ngày chuyển vào. Giữ chỗ cho thuê kho mini 24–48h sau khi đặt cọc.",
        "Xem ${CONTACT} hoặc ${ZALO}.",
        "Mang CCCD/GPKD khi ký. Hàng vào sau khi có biên nhận kiot.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1120,
    keyword: "dịch vụ fulfillment TP.HCM",
    slug: "dich-vu-fulfillment-tphcm",
    title: "Dịch vụ fulfillment TP.HCM 2026 — Pick pack đa sàn | MINH TUẤN",
    metaDescription:
      "Dịch vụ fulfillment TP.HCM 2026: lưu kho, pick-pack, bàn giao Shopee Lazada TikTok. Đúng SLA. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Dịch vụ fulfillment TP.HCM của Minh Tuấn nhận hàng, lưu kho, soạn đóng, bàn giao ĐVVC và xử lý hoàn cho shop bán Shopee, Lazada, TikTok Shop, Tiki — để chủ shop chạy ads thay vì in bill đêm.",
    internalLinks: ["/bai-viet/cho-thue-kho-tmdt", "/bai-viet/fulfillment-logistics", "/bai-viet/kho-fulfillment-shopee", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Dịch vụ fulfillment TP.HCM gồm những gì?",
      "Vì sao shop miền Nam cần fulfillment tại HCM",
      "Luồng đơn từ sàn xuống kho",
      "SLA, cut-off và ĐVVC hỗ trợ",
      "Chi phí dịch vụ fulfillment TP.HCM",
      "Hàng hóa nhận và không nhận",
      "Onboard 7 ngày đầu",
      "Dịch vụ fulfillment TP.HCM khác 3PL truyền thống",
      "Câu hỏi thường gặp",
      "Đăng ký dùng thử dịch vụ fulfillment TP.HCM",
    ],
    paragraphsByHeading: {
      "Dịch vụ fulfillment TP.HCM gồm những gì?": [
        "Dịch vụ fulfillment TP.HCM = inbound + lưu + pick + pack + bàn giao vận đơn + hoàn về. Không chỉ cho thuê mét sàn. Đây là tầng vận hành của ${TMDT}.",
        "Gói mở rộng: card brand, dán quà, kiểm serial, đóng gỗ, giao B2B. Shop chọn theo SKU.",
        "Báo cáo tồn và đơn chờ lấy gửi định kỳ. Chủ shop thấy một tồn thật cho mọi sàn.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Vì sao shop miền Nam cần fulfillment tại HCM": [
        "Mật độ lấy hàng ĐVVC và khách nội thành cao. Dịch vụ fulfillment TP.HCM rút leadtime hơn gửi kho tỉnh rồi trung chuyển.",
        "Livestream đêm cần pack sáng. Kho HCM có ca sớm bắt kịp tài xế.",
        "Hàng nhập Cát Lái vào kệ fulfillment luôn, giảm bốc xếp. Kết hợp ${KHO}.",
      ].map((p) => p.replace("${KHO}", KHO)),
      "Luồng đơn từ sàn xuống kho": [
        "Shop đẩy file/CSV hoặc đồng bộ theo thỏa thuận. Kho soạn, chụp nếu yêu cầu, dán bill, chia chuyến GHN/GHTK/SPX/J&T/Ninja.",
        "Dịch vụ fulfillment TP.HCM khóa tồn ngay khi pick để không bán trùng TikTok và Shopee.",
        "Đơn lệch địa chỉ được hold, hỏi shop trước khi gửi — giảm hoàn.",
      ],
      "SLA, cut-off và ĐVVC hỗ trợ": [
        "Cut-off thống nhất mỗi ngày (thường cuối giờ chiều, ca đêm mùa sale). Đơn trước cut-off lấy trong ngày theo lịch ĐVVC.",
        "Dịch vụ fulfillment TP.HCM không cam kết SLA sàn nếu shop đẩy đơn trễ hoặc thiếu hàng.",
        "Có thể chỉ định ĐVVC mặc định từng kênh. Đổi ĐVVC báo trước 1 ngày.",
      ],
      "Chi phí dịch vụ fulfillment TP.HCM": [
        "Phí lưu (thùng/pallet) + inbound + pick + vật tư. Dịch vụ fulfillment TP.HCM tách dòng, không gói mơ hồ “xxx/đơn” giấu phụ phí.",
        "Tối ưu: dán barcode sẵn, ít biến thể rời, forecast 9.9/11.11. Hàng chậm chuyển ${THUE} tự quản cho rẻ.",
        "Báo giá 24h qua ${ZALO} khi có số SKU và đơn/ngày.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${ZALO}", ZALO)),
      "Hàng hóa nhận và không nhận": [
        "Nhận: thời trang, phụ kiện, mỹ phẩm khô, gia dụng nhỏ, thực phẩm khô còn HSD. Mát 18–25°C xếp khu riêng.",
        "Không nhận hoặc hạn chế: hàng tươi sống, nguy hiểm, hàng cấm sàn, pin rời số lượng lớn chưa khai.",
        "Dịch vụ fulfillment TP.HCM yêu cầu TDS/nhiệt độ với mỹ phẩm/thực phẩm trước khi nhận lô đầu.",
      ],
      "Onboard 7 ngày đầu": [
        "Ngày 1–2: master SKU, nhận hàng, dán mã. Ngày 3–4: chạy 20–50 đơn thử. Ngày 5–7: đối soát tồn, bật ads lớn.",
        "Đừng đổ cả container vào dịch vụ fulfillment TP.HCM ngày đầu nếu file SKU chưa sạch.",
        "Chỉ định 1 đầu mối Zalo. Nhiều người duyệt làm chậm hold đơn.",
      ],
      "Dịch vụ fulfillment TP.HCM khác 3PL truyền thống": [
        "${PL3} cổ điển nghiêng B2B pallet, ít đơn nhỏ. Fulfillment nghiêng B2C hàng trăm bill/ngày.",
        "Dịch vụ fulfillment TP.HCM tối ưu bàn pack và bill sàn, không chỉ xe nâng container.",
        "Brand vừa B2B vừa B2C có thể chạy song song hai SOP một điểm kho.",
      ].map((p) => p.replace("${PL3}", PL3)),
      "Câu hỏi thường gặp": [
        "Shop tỉnh gửi dùng dịch vụ fulfillment TP.HCM được không? Được, nhiều brand gửi hàng về HCM vì ĐVVC.",
        "Có tích hợp API sàn không? Làm theo thỏa thuận kỹ thuật; mặc định file hằng ngày vẫn ổn SME.",
        "Hàng hỏng do đóng gói? Đối soát camera và SOP; bồi thường theo hợp đồng nếu lỗi kho.",
      ],
      "Đăng ký dùng thử dịch vụ fulfillment TP.HCM": [
        "Gửi 10 SKU bán chạy + 30 đơn mẫu. Đo SLA thật trước khi chuyển cả kho sang dịch vụ fulfillment TP.HCM.",
        "Xem thêm ${FF} và ${CONTACT}.",
        "Hotline ${ZALO}.",
      ].map((p) => p.replace("${FF}", FF).replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1121,
    keyword: "kho fulfillment Shopee",
    slug: "kho-fulfillment-shopee",
    title: "Kho fulfillment Shopee 2026 — Đúng SLA, đúng tồn | MINH TUẤN",
    metaDescription:
      "Kho fulfillment Shopee 2026: soạn đơn đúng SKU, đúng cut-off SPX, xử lý hoàn, giữ xu gian hàng. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Kho fulfillment Shopee giúp seller tránh trễ lấy hàng, lệch tồn và đóng sai biến thể — Minh Tuấn soạn bill, bàn giao SPX/ĐVVC và nhập hoàn, để shop giữ xu và scale mùa sale.",
    internalLinks: ["/bai-viet/dich-vu-fulfillment-tphcm", "/bai-viet/cho-thue-kho-tmdt", "/bai-viet/kho-fulfillment-lazada", "/bai-viet/kho-fulfillment-tiktok-shop", "/lien-he"],
    headings: [
      "Kho fulfillment Shopee giải bài toán nào?",
      "SLA lấy hàng và xu gian hàng",
      "Đồng bộ tồn Shopee với kênh khác",
      "Quy trình pick bill Shopee trong kho",
      "Hàng hoàn Shopee xử lý ra sao",
      "Chi phí kho fulfillment Shopee",
      "Chuẩn bị SKU trước khi gửi kho",
      "Kho fulfillment Shopee mùa 9.9 và 11.11",
      "Câu hỏi thường gặp",
      "Bắt đầu với kho fulfillment Shopee",
    ],
    paragraphsByHeading: {
      "Kho fulfillment Shopee giải bài toán nào?": [
        "Seller tự đóng hay trễ ca lấy SPX, in nhầm bill, hết size khi flash sale. Kho fulfillment Shopee chuẩn hóa soạn hàng theo từng biến thể và giờ cut-off.",
        "Khác Shopee Fulfillment (SFF) của sàn, kho fulfillment Shopee của 3PL cho phép giữ hàng để bán Lazada/TikTok/website cùng lúc — một tồn, nhiều kênh. Xem ${TMDT}.",
        "Phù hợp shop 30–1.000 đơn/ngày muốn giữ brand pack (card, sticker) thay vì đóng hộp chuẩn sàn hoàn toàn.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "SLA lấy hàng và xu gian hàng": [
        "Trễ lấy hàng làm giảm xu, hạn chế marketing. Kho fulfillment Shopee nhận đơn trước cut-off sẽ xếp chuyến lấy trong ngày theo lịch tài xế.",
        "Shop phải đẩy đơn đủ giờ. Kho không chịu SLA nếu đơn vào sau cut-off hoặc hết tồn.",
        "Báo cáo đơn chờ lấy gửi shop mỗi chiều. Chủ động hủy/hold đơn sai địa chỉ trước khi SPX tới.",
      ],
      "Đồng bộ tồn Shopee với kênh khác": [
        "Khi pick 1 SKU, trừ hết kênh. Kho fulfillment Shopee tránh bán 1 áo trên 2 sàn.",
        "Livestream TikTok ưu tiên buffer nóng; Shopee flash sale cần lock tồn trước giờ chốt. SOP ghi rõ thứ tự ưu tiên.",
        "Shop tự cập nhật tồn ảo trên sàn theo file kho xuất ra, hoặc nhờ kho gửi sheet cuối ngày.",
      ],
      "Quy trình pick bill Shopee trong kho": [
        "In/nhận mã vận đơn → soạn kệ → kiểm biến thể → đóng → dán bill → chia túi SPX/GHN. Kho fulfillment Shopee chụp ảnh nếu shop bật QC.",
        "Đơn gộp (combo) pick đủ dòng mới đóng. Thiếu 1 dòng thì hold, không gửi thiếu.",
        "Hàng dễ vỡ thêm chèn. Phí vật tư ghi trong báo giá.",
      ],
      "Hàng hoàn Shopee xử lý ra sao": [
        "Hoàn về kho, kiểm seal/hàng, phân bán lại / lỗi / mất quà. Tồn chỉ cộng khi QC đạt. Kho fulfillment Shopee không nhập mù hàng hoàn.",
        "Shop nhận ảnh hàng lỗi để claim. Giảm tranh chấp với khách.",
        "Tỷ lệ hoàn cao ở SKU nào được cảnh báo để sửa mô tả/size chart.",
      ],
      "Chi phí kho fulfillment Shopee": [
        "Lưu + pick + pack + inbound hoàn. Kho fulfillment Shopee không thu % doanh thu sàn.",
        "Đơn 1 sản phẩm rẻ hơn combo 5 món. Tối ưu bằng cách giảm SKU rời rạc.",
        "Nhận bảng qua ${ZALO}. So với phạt xu, phí pick thường rẻ hơn.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Chuẩn bị SKU trước khi gửi kho": [
        "Mỗi biến thể một mã. Dán barcode. File Excel: mã, tên, size/màu, số lượng gửi. Kho fulfillment Shopee inbound nhanh gấp đôi nếu thùng ghi SL ngoài.",
        "Gỡ hàng lỗi/hàng test trước khi gửi. Đừng trộn hàng hết HSD.",
        "In sẵn mã nếu có. Kho dán hộ có phí.",
      ],
      "Kho fulfillment Shopee mùa 9.9 và 11.11": [
        "Báo forecast trước 2 tuần. Tăng ca pack đêm. Kho fulfillment Shopee giữ người và vật tư theo số shop đăng ký, không nhận dump đơn phút chót nếu quá công suất.",
        "Nên nhập hàng trước sale 7–10 ngày. Hàng về đúng ngày sale dễ trễ inbound.",
        "Kết hợp ${FF} nếu cần SOP chung đa sàn.",
      ].map((p) => p.replace("${FF}", FF)),
      "Câu hỏi thường gặp": [
        "Kho fulfillment Shopee có lấy hàng hộ từ kho SFF không? Có thể kéo nội địa theo lịch, phí riêng.",
        "Có hỗ trợ chương trình Freeship? Shop cài trên sàn; kho chỉ đóng đúng khối lượng để không lệch cân.",
        "Hủy đơn đã pick? Báo sớm; nếu đã bàn giao SPX phải hủy trên app.",
      ],
      "Bắt đầu với kho fulfillment Shopee": [
        "Gửi 20 bill mẫu. Đo tỷ lệ đúng SKU và thời gian lấy. Rồi chuyển SKU nóng vào kho fulfillment Shopee.",
        "Xem ${CONTACT} hoặc gọi ${ZALO}.",
        "Có thể giữ ${THUE} mini cho hàng chậm.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO).replace("${THUE}", THUE)),
    },
  },
  {
    id: 1122,
    keyword: "cho thuê kho gần Cát Lái",
    slug: "cho-thue-kho-gan-cat-lai",
    title: "Cho thuê kho gần Cát Lái 2026 — Cont vào tận kho | MINH TUẤN",
    metaDescription:
      "Cho thuê kho gần Cát Lái 2026: giảm cước kéo, cont vào kho, lưu sau thông quan. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho gần Cát Lái giúp doanh nghiệp nhập khẩu cắt cước kéo container, hạn chế lưu bãi và đưa hàng vào kệ ngay sau thông quan — Minh Tuấn bố trí điểm kho và xe nâng đúng lịch cắt máng.",
    internalLinks: ["/bai-viet/cho-thue-kho-tphcm", "/bai-viet/cho-thue-kho", "/dich-vu/kho-bai-logistics", "/bai-viet/kho-bai-logistics-cat-lai", "/lien-he"],
    headings: [
      "Vì sao cần cho thuê kho gần Cát Lái",
      "Lợi ích cắt cước kéo và lưu bãi",
      "Loại kho phù hợp hàng vừa hạ cont",
      "Quy trình từ cảng vào cho thuê kho gần Cát Lái",
      "Giá và chi phí kéo kèm theo",
      "Hàng lẻ LCL và rút ruột CFS",
      "Pháp lý, PCCC, giờ cấm tải khu cảng",
      "Câu hỏi thường gặp",
      "Checklist trước khi hạ cont",
      "Đặt chỗ cho thuê kho gần Cát Lái",
    ],
    paragraphsByHeading: {
      "Vì sao cần cho thuê kho gần Cát Lái": [
        "Cảng Cát Lái là cửa ngõ container HCM. Cho thuê kho gần Cát Lái giảm km đầu kéo, giảm rủi ro kẹt xe và phụ phí lưu cont khi thông quan xong chiều muộn.",
        "Doanh nghiệp ở Q7, Thủ Đức, Đồng Nai, Bình Dương dùng kho này làm buffer trước khi chia nội địa. Gắn với ${THUE} và ${KHO}.",
        "Năm 2026, lịch tàu dồn vẫn xảy ra. Có slot cho thuê kho gần Cát Lái còn quan trọng hơn giá rẻ ở kho xa 40 km.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${KHO}", KHO)),
      "Lợi ích cắt cước kéo và lưu bãi": [
        "Mỗi km kéo và mỗi ngày lưu bãi đội landed cost. Cho thuê kho gần Cát Lái biến “hạ cont xong biết để đâu” thành kệ có sẵn.",
        "Có thể hạ trực tiếp, rút ruột, trả rỗng nhanh — giảm demurrage/detention.",
        "Hàng chia nhiều điểm: cross-dock tại kho gần cảng, xe nhỏ đi nội thành giờ được phép.",
      ],
      "Loại kho phù hợp hàng vừa hạ cont": [
        "Sân bãi quay đầu, cửa cont, xe nâng, kệ double deep. Cho thuê kho gần Cát Lái tự quản hợp đại lý; kho phân phối hợp chia SKU ngay.",
        "Hàng mát không để sân nắng chờ kệ. Báo trước để giữ khu 18–25°C.",
        "Hàng nguy hiểm/khai thác đặc thù cần điểm chuyên, không nhét kho thường.",
      ],
      "Quy trình từ cảng vào cho thuê kho gần Cát Lái": [
        "Nhận lệnh giao hàng → đăng ký kéo → hạ kho → đếm seal → rút/xếp kệ → trả rỗng. Cho thuê kho gần Cát Lái đồng bộ giờ với forwarder.",
        "Scan invoice/packing trước 24h để xếp sơ đồ kệ, tránh cont nằm sân.",
        "Lệch số lượng lập biên bản ngay cửa. Ảnh timestamp gửi chủ hàng.",
      ],
      "Giá và chi phí kéo kèm theo": [
        "Giá lưu theo m²/m³ như bảng chung; cộng cước kéo Cát Lái – kho, phụ phí đêm, lưu rỗng. Báo giá cho thuê kho gần Cát Lái nên gộp 1 trang “cảng → kệ”.",
        "So giá kho xa: cộng 2 lượt kéo và thời gian tài xế. Thường kho gần thắng.",
        "Ưu đãi dài hạn giống ${THUE}. Hỏi ${ZALO}.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${ZALO}", ZALO)),
      "Hàng lẻ LCL và rút ruột CFS": [
        "LCL nhận từ CFS rồi cộng gộp về cho thuê kho gần Cát Lái. Phù hợp SME không đủ FCL.",
        "Deconsolidation, dán lại mã, chia bill đa điểm. Xem CFS/ngoại quan trên [Hải quan Việt Nam](https://www.customs.gov.vn/) nếu hàng chưa thông quan xong.",
        "Không nhầm kho thường với kho ngoại quan. Khai sai địa điểm là rủi ro.",
      ],
      "Pháp lý, PCCC, giờ cấm tải khu cảng": [
        "Khu cảng giờ cao điểm và quy định xe. Cho thuê kho gần Cát Lái phải có lộ trình xe hợp lệ, không để tài xế tự tìm đường cấm.",
        "PCCC và camera bắt buộc vì mật độ hàng cao. Sân chứa rỗng tách khu hàng.",
        "Bảo vệ 24/7 nhận cont đêm khi cắt máng trễ.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho gần Cát Lái có hạ 40' không? Tùy điểm; báo loại cont khi book slot.",
        "Có làm thủ tục hải quan tại kho? Kho thường nhận hàng đã thông quan; kho ngoại quan là gói khác.",
        "Giữ chỗ bao lâu trước tàu cập? 3–7 ngày tùy mùa; Tết book sớm.",
      ],
      "Checklist trước khi hạ cont": [
        "Số cont, seal, packing, người nhận tại kho, xe nâng ca nào, hàng có chồng được không. Thiếu 1 ý làm chậm cho thuê kho gần Cát Lái.",
        "Bảo hiểm hàng nếu giá trị cao. Kiểm đếm cửa kho.",
        "Lịch trả rỗng. Đừng để rỗng chiếm sân.",
      ],
      "Đặt chỗ cho thuê kho gần Cát Lái": [
        "Gửi ETA tàu + số m³ dự kiến. Minh Tuấn giữ slot cho thuê kho gần Cát Lái và xe kéo.",
        "Form ${CONTACT} hoặc ${ZALO}.",
        "Có thể chuyển một phần hàng sang ${TMDT} sau khi rút ruột.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO).replace("${TMDT}", TMDT)),
    },
  },
];

// remaining specs continue in same array via push below to keep file readable
SPECS.push(
  {
    id: 1123,
    keyword: "cho thuê kho phân phối",
    slug: "cho-thue-kho-phan-phoi",
    title: "Cho thuê kho phân phối 2026 — Xuất nhập 15 phút | MINH TUẤN",
    metaDescription:
      "Cho thuê kho phân phối 2026: quản lý A–Z, từ 65K/m³, miễn phí <20 mã, báo cáo realtime. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho phân phối tại Minh Tuấn là gói gửi hàng – soạn hộ – báo cáo realtime, giá chỉ từ 65.000đ/m³, miễn quản lý dưới 20 mã, xuất nhập khoảng 15 phút khi chứng từ đủ.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/bai-viet/bang-gia-cho-thue-kho", "/bai-viet/dich-vu-quan-ly-kho", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Cho thuê kho phân phối khác tự quản thế nào?",
      "Ưu đãi cho thuê kho phân phối 2026",
      "Quy trình xuất nhập 15 phút",
      "Phần mềm tồn và báo cáo điện thoại",
      "Hàng và SKU phù hợp mô hình phân phối",
      "Tiện ích xe nâng, đóng gói, vận chuyển",
      "Khi nào nên chuyển sang fulfillment",
      "Câu hỏi thường gặp",
      "Rủi ro nếu chọn kho phân phối sai",
      "Đăng ký cho thuê kho phân phối",
    ],
    paragraphsByHeading: {
      "Cho thuê kho phân phối khác tự quản thế nào?": [
        "Cho thuê kho phân phối nghĩa là kho đứng ra nhận, xếp kệ, xuất theo lệnh, bạn không cần nhân viên kho. Tự quản thì bạn thuê sàn và tự sắp.",
        "Phù hợp DN cần minh bạch tồn, nhiều điểm giao, không muốn tuyển thủ kho. Nằm trong hệ ${THUE}.",
        "Chi phí cao hơn m² trần nhưng rẻ hơn một team kho + phần mềm + PCCC riêng.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Ưu đãi cho thuê kho phân phối 2026": [
        "Giảm đến 50% phí thuê khi ký dài, chỉ từ 65.000đ/m³, miễn quản lý < 20 mã, free pallet theo gói, giảm 15% cước xe Minh Tuấn.",
        "Cho thuê kho phân phối tính theo m³ chiếm kệ, không bắt buộc thuê 50 m² trống.",
        "Ưu đãi còn chỗ. Xác nhận bằng báo giá có ngày hiệu lực.",
      ],
      "Quy trình xuất nhập 15 phút": [
        "Nhập: đối chiếu packing, lên kệ, cập nhật tồn. Xuất: nhận lệnh, soạn, bàn giao, ký phiếu. Khi hồ sơ đủ, cho thuê kho phân phối xử lý khoảng 15 phút/lệnh tiêu chuẩn.",
        "Lệnh thiếu mã/số lượng bị hold. Nhanh vì SOP, không phải vì bỏ QC.",
        "Khách không bắt buộc có mặt. Ủy quyền qua email/Zalo.",
      ],
      "Phần mềm tồn và báo cáo điện thoại": [
        "Xem tồn, phiếu, lịch sử. Cho thuê kho phân phối hướng tới realtime trên điện thoại — sales chốt đơn biết còn hàng.",
        "Đối soát tuần với kế toán. Lệch điều tra camera/kệ.",
        "API/file xuất Excel cho SME chưa cần ERP.",
      ],
      "Hàng và SKU phù hợp mô hình phân phối": [
        "Hàng thùng, pallet, luân chuyển tuần. Dưới 20 SKU hưởng miễn quản lý; trên 20 vẫn nhận, phí quản lý thêm.",
        "Hàng mát xếp khu riêng, không tính giá kho thường. Cho thuê kho phân phối không thay kho lạnh âm sâu.",
        "Hàng serial/IMEI cần gói kiểm chi tiết.",
      ],
      "Tiện ích xe nâng, đóng gói, vận chuyển": [
        "Xe nâng, bốc xếp, đóng gói, dán tem, giao nội thành/liên tỉnh. Một lệnh kho + một lệnh xe.",
        "Cho thuê kho phân phối gần trục HCM, hạn chế cung cấm tải. Xem ${KHO}.",
        "Ca đêm theo lịch sale. Báo trước 1 ngày.",
      ].map((p) => p.replace("${KHO}", KHO)),
      "Khi nào nên chuyển sang fulfillment": [
        "Khi đơn B2C hàng trăm bill/ngày, mô hình phân phối theo lệnh lớn không tối ưu bàn pack. Chuyển ${TMDT}.",
        "Có thể song song: B2B đi phân phối, B2C đi fulfillment.",
        "Minh Tuấn tách SOP để không lẫn bill sàn với phiếu xuất đại lý.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Câu hỏi thường gặp": [
        "Cho thuê kho phân phối có tối thiểu m³? Linh hoạt; dưới ngưỡng có thể về gói mini.",
        "Mất hàng? Đối soát WMS + camera; bồi thường theo hợp đồng nếu lỗi kho.",
        "Xuất gấp trong 1 giờ? Phụ thuộc ca và kệ; hàng ABC gần lối ra nhanh hơn.",
      ],
      "Rủi ro nếu chọn kho phân phối sai": [
        "Kho không WMS, đếm sổ tay, sai tồn. Cho thuê kho phân phối kém làm sales bán hàng ma.",
        "Kho xa điểm giao, SLA chết. Chọn vị trí trước khi chọn giá.",
        "Không PCCC. Bảo hiểm hàng có thể từ chối bồi thường.",
      ],
      "Đăng ký cho thuê kho phân phối": [
        "Gửi danh mục mã và sản lượng tuần. Nhận đề xuất m³ và giá cho thuê kho phân phối.",
        "${ZALO} hoặc ${CONTACT}.",
        "Có thể xem kho trước khi chuyển hàng.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1124,
    keyword: "cho thuê kho tự quản",
    slug: "cho-thue-kho-tu-quan",
    title: "Cho thuê kho tự quản 2026 — Setup văn phòng trong kho | MINH TUẤN",
    metaDescription:
      "Cho thuê kho tự quản 2026: từ 130K/m², PCCC, điện 3 pha, sân bãi, setup VP trong kho. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho tự quản của Minh Tuấn cho doanh nghiệp thuê mặt sàn, tự bố trí kệ và nhân sự, giá từ 130.000đ/m²/tháng, hạ tầng PCCC – điện 3 pha – sân bãi, có thể setup góc văn phòng trong kho.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/bai-viet/cho-thue-kho-mini", "/bai-viet/cho-thue-kho-tphcm", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Cho thuê kho tự quản phù hợp ai?",
      "Hạ tầng điện 3 pha, PCCC, sân bãi",
      "Giá cho thuê kho tự quản và ưu đãi dài hạn",
      "Setup văn phòng và xưởng nhẹ trong kho",
      "An ninh, giờ ra vào, nội quy",
      "Cont vào tận kho và xe nâng",
      "Khi nào nên thuê tự quản thay vì gửi hộ",
      "Câu hỏi thường gặp về cho thuê kho tự quản",
      "Hồ sơ pháp lý cần xem trước khi ký",
      "Khảo sát mặt bằng cho thuê kho tự quản",
    ],
    paragraphsByHeading: {
      "Cho thuê kho tự quản phù hợp ai?": [
        "Cho thuê kho tự quản dành đại lý, xưởng đóng gói, đội giao nhận, DN có sẵn thủ kho và muốn kiểm soát layout. Bạn thuê m², Minh Tuấn cung cấp mặt bằng và hạ tầng.",
        "Khác ${THUE} phân phối, gói này không soạn hộ từng đơn trừ khi mua thêm.",
        "Phù hợp sản lượng ổn định 50 m² trở lên. Dưới đó cân nhắc mini.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Hạ tầng điện 3 pha, PCCC, sân bãi": [
        "PCCC tự động/thẩm duyệt, điện 3 pha, nước sinh hoạt, sân quay đầu. Cho thuê kho tự quản không phải nhà dân cải tạo.",
        "Nền chịu tải, thoát nước mùa mưa. Hỏi tải kg/m² nếu để hàng sắt.",
        "Pháp lý GPKD điểm kho minh bạch khi khách audit.",
      ],
      "Giá cho thuê kho tự quản và ưu đãi dài hạn": [
        "Từ 130.000đ/m²/tháng. Ký dài có giá tốt hơn. Điện nước theo đồng hồ hoặc định mức — ghi rõ trong hợp đồng cho thuê kho tự quản.",
        "Đặt cọc thường 1–2 tháng. Bàn giao mặt bằng sạch, hoàn cọc theo biên bản.",
        "So với thuê xưởng KCN, gói này linh hoạt thời hạn hơn với SME.",
      ],
      "Setup văn phòng và xưởng nhẹ trong kho": [
        "Được dựng vách nhẹ, bàn CSKH, góc pack trong phần diện tích thuê. Cho thuê kho tự quản cấm thay đổi kết cấu chịu lực và hệ PCCC.",
        "Sản xuất nặng, phun sơn, hàng nóng chảy cần khảo sát riêng.",
        "Wifi/camera phụ shop tự lắp trong khu mình, không can nhiễu hệ thống kho.",
      ],
      "An ninh, giờ ra vào, nội quy": [
        "Camera chung + bảo vệ 24/7. Cho thuê kho tự quản: hàng trong khu khóa riêng do khách chịu, trừ khi chứng minh lỗi hạ tầng/an ninh chung.",
        "Giờ mở cửa theo điểm; ca đêm đăng ký trước. Khách lạ để lại giấy tờ.",
        "Cấm nấu ăn, ở lại qua đêm trong kho.",
      ],
      "Cont vào tận kho và xe nâng": [
        "Một số điểm cho thuê kho tự quản nhận cont tới cửa. Hỏi chiều cao cửa và sân trước khi book 40'.",
        "Xe nâng có thể thuê theo giờ nếu khách chưa có. Không tự điều khiển xe kho khi chưa phép.",
        "Hàng từ Cát Lái xem thêm bài kho gần cảng.",
      ],
      "Khi nào nên thuê tự quản thay vì gửi hộ": [
        "Có team kho, SOP riêng, cần branding mặt bằng, sản xuất nhẹ. Cho thuê kho tự quản rẻ hơn gửi hộ nếu đơn rất lớn và nhân sự sẵn.",
        "Chưa có người kho thì đừng tự quản — sai tồn đắt hơn tiền thuê.",
        "Có thể hybrid: tự quản hàng chậm + gửi hộ SKU nóng.",
      ],
      "Câu hỏi thường gặp về cho thuê kho tự quản": [
        "Sửa điện trong khu thuê? Xin phép, thợ có chứng chỉ, không đụng PCCC.",
        "Chia nhỏ cho thuê lại? Cần đồng ý bằng văn bản. Cho thuê kho tự quản không mặc định được sublease.",
        "Tăng diện tích giữa kỳ? Nếu còn slot liền kề sẽ ưu tiên khách cũ.",
      ],
      "Hồ sơ pháp lý cần xem trước khi ký": [
        "Xem PCCC, giấy tờ đất/thuê, nội quy PCCC, bảo hiểm tài sản chung. Cho thuê kho tự quản uy tín sẵn sàng cho xem.",
        "Chụp hiện trạng lúc nhận. Ghi vết nứt, ẩm để khỏi bị trừ cọc.",
        "Hợp đồng ghi rõ dịch vụ chung (bảo vệ, vệ sinh hành lang).",
      ],
      "Khảo sát mặt bằng cho thuê kho tự quản": [
        "Hẹn xem kho, đo cửa, hỏi hướng xe tải. Mang thước và list máy sẽ đặt.",
        "${ZALO} / ${CONTACT}. Giữ chỗ sau đặt cọc.",
        "Kèm nhu cầu điện 3 pha để tránh thuê rồi thiếu nguồn.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1125,
    keyword: "cho thuê kho mát",
    slug: "cho-thue-kho-mat",
    title: "Cho thuê kho mát 2026 — Ổn định 18–25°C | MINH TUẤN",
    metaDescription:
      "Cho thuê kho mát 2026: 18–25°C, ẩm ≤50%, từ 180K/m³, mỹ phẩm thực phẩm rượu vang. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho mát 18–25°C, độ ẩm ≤ 50% tại Minh Tuấn bảo vệ mỹ phẩm, thực phẩm khô, rượu vang, hương liệu và thiết bị y tế — giá từ 180.000đ/m³/tháng, có phương án dự phòng mất điện.",
    internalLinks: ["/bai-viet/cho-thue-kho", "/bai-viet/cho-thue-kho-lanh", "/bai-viet/bang-gia-cho-thue-kho", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Cho thuê kho mát khác kho thường và kho lạnh",
      "Hàng nên để kho mát 18–25°C",
      "Ưu đãi cho thuê kho mát 2026",
      "Kỹ thuật dàn lạnh, ẩm và dự phòng điện",
      "Quản lý xuất nhập khu mát",
      "Rủi ro để hàng nhạy nhiệt ở kho thường",
      "Cách đo và nghiệm thu nhiệt độ",
      "Câu hỏi thường gặp về cho thuê kho mát",
      "Hồ sơ cần gửi trước khi nhập hàng",
      "Đặt slot cho thuê kho mát",
    ],
    paragraphsByHeading: {
      "Cho thuê kho mát khác kho thường và kho lạnh": [
        "Kho thường HCM mùa nóng vượt 32–35°C. Cho thuê kho mát giữ 18–25°C. Kho lạnh thường 0–8°C hoặc âm sâu — đắt hơn, không cần cho mỹ phẩm ổn định.",
        "Nhầm mát và lạnh làm hỏng kết cấu một số kem/son. Đọc TDS trước khi book.",
        "Gói mát nằm trong ${THUE}, tách khu, không để cửa mở lâu.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Hàng nên để kho mát 18–25°C": [
        "Mỹ phẩm, thực phẩm khô, bia rượu vang, hương liệu, một số thiết bị y tế, chocolate theo mùa. Cho thuê kho mát không thay chuỗi lạnh thịt cá tươi.",
        "Hàng có HSD xếp FEFO. Tem lô rõ để xuất đúng.",
        "Pin/hóa chất dễ sinh hơi cần khảo sát riêng, có thể từ chối.",
      ],
      "Ưu đãi cho thuê kho mát 2026": [
        "Giảm đến 20% phí, từ 180.000đ/m³/tháng, miễn quản lý < 20 mã, free pallet, giảm 15% cước xe Minh Tuấn.",
        "Slot cho thuê kho mát hữu hạn. Book trước mùa hè và Tết.",
        "Giá chưa gồm kiểm chi tiết từng serial.",
      ],
      "Kỹ thuật dàn lạnh, ẩm và dự phòng điện": [
        "Dàn lạnh công suất lớn, phân bổ đều, ẩm ≤ 50% nhằm hạn chế ẩm mốc bao bì. Cho thuê kho mát có phương án máy phát/dự phòng khi mất điện.",
        "Cảm biến ghi log. Khách có thể xin xem log tuần nếu audit brand.",
        "Bảo trì định kỳ, không chờ hỏng mới sửa.",
      ],
      "Quản lý xuất nhập khu mát": [
        "Mở cửa theo ca, soạn nhanh, đóng cửa. Cho thuê kho mát vẫn xử lý lệnh ~15 phút nếu hàng đã slot sẵn.",
        "Báo cáo realtime trên điện thoại như kho phân phối.",
        "Khách không cần đứng kho. Ủy quyền lệnh xuất.",
      ],
      "Rủi ro để hàng nhạy nhiệt ở kho thường": [
        "Mỹ phẩm tách lớp, rượu hỏng hương, thực phẩm chảy dầu. Bảo hiểm có thể từ chối nếu sai điều kiện bảo quản.",
        "Cho thuê kho mát đắt hơn vài chục nghìn/m³ nhưng rẻ hơn một lô claim.",
        "Livestream bán mỹ phẩm mà hàng để nhà nóng dễ tăng hoàn “hàng hư”.",
      ],
      "Cách đo và nghiệm thu nhiệt độ": [
        "Lúc onboard có thể đo góc kệ. Cho thuê kho mát nghiệm thu dải, không cam kết từng phút 18,0°C exact nếu cửa vừa mở.",
        "Đặt logger của khách trong lồng hàng nếu brand yêu cầu.",
        "Lệch dải kéo dài sẽ chuyển hàng và báo sự cố.",
      ],
      "Câu hỏi thường gặp về cho thuê kho mát": [
        "Cho thuê kho mát có âm 18°C không? Không — đó là lạnh đông, gói khác.",
        "Có chia nhỏ 1 m³ không? Có, tính m³ thực chiếm.",
        "Mất điện 2 giờ? Chạy dự phòng; log gửi khách nếu yêu cầu.",
      ],
      "Hồ sơ cần gửi trước khi nhập hàng": [
        "TDS/nhiệt độ NSX, HSD, SDS nếu hóa mỹ phẩm. Thiếu giấy, cho thuê kho mát có thể từ chối nhận.",
        "Ảnh thùng để tính m³. Hàng lệch kê khai bị giữ tại cửa.",
        "Xem [Hải quan Việt Nam](https://www.customs.gov.vn/) nếu hàng mới nhập chưa rõ điều kiện lưu.",
      ],
      "Đặt slot cho thuê kho mát": [
        "Nêu dải nhiệt và số m³. Giữ slot cho thuê kho mát theo tuần/tháng.",
        "${ZALO} — ${CONTACT}.",
        "Có thể kết hợp khu thường cho hàng không nhạy nhiệt để tiết kiệm.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1126,
    keyword: "kho fulfillment Lazada",
    slug: "kho-fulfillment-lazada",
    title: "Kho fulfillment Lazada 2026 — Đúng cut-off, ít hoàn | MINH TUẤN",
    metaDescription:
      "Kho fulfillment Lazada 2026: pick-pack, LEX/ĐVVC, đồng bộ tồn đa sàn, xử lý hoàn. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Kho fulfillment Lazada hỗ trợ seller soạn đơn đúng SKU, bắt kịp cut-off LEX/ĐVVC, giữ tồn thống nhất với Shopee/TikTok và xử lý hàng hoàn — Minh Tuấn vận hành tại TP.HCM.",
    internalLinks: ["/bai-viet/kho-fulfillment-shopee", "/bai-viet/kho-fulfillment-tiktok-shop", "/bai-viet/dich-vu-fulfillment-tphcm", "/bai-viet/cho-thue-kho-tmdt", "/lien-he"],
    headings: [
      "Kho fulfillment Lazada khác tự gửi bưu cục",
      "Cut-off LEX và ĐVVC liên kết",
      "Đồng bộ tồn Lazada – Shopee – TikTok",
      "Quy trình soạn đơn và QC",
      "Hàng hoàn Lazada và đổi trả",
      "Chi phí kho fulfillment Lazada",
      "Chuẩn barcode và SKU Lazada",
      "Câu hỏi thường gặp",
      "Mùa sale Lazada cần chuẩn bị gì",
      "Onboard kho fulfillment Lazada",
    ],
    paragraphsByHeading: {
      "Kho fulfillment Lazada khác tự gửi bưu cục": [
        "Tự gửi: xếp hàng giờ chót, sai bill, hết ca LEX. Kho fulfillment Lazada in/nhận vận đơn, đóng, chia chuyến đúng cửa lấy.",
        "Khác Lazada eLogistics nội sàn, 3PL cho bán chéo kênh. Xem ${TMDT}.",
        "Seller giữ bao bì brand, không bắt buộc hộp sàn.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Cut-off LEX và ĐVVC liên kết": [
        "Mỗi ĐVVC một giờ cắt. Kho fulfillment Lazada chốt một cut-off nội bộ sớm hơn cửa tài xế 30–60 phút.",
        "Đơn sau cut-off chuyển ngày hôm sau, shop được báo để khỏi hứa khách sai.",
        "Đổi ĐVVC giữa mùa: báo 1 ngày để sắp lại túi chuyến.",
      ],
      "Đồng bộ tồn Lazada – Shopee – TikTok": [
        "Một kệ, nhiều sàn. Kho fulfillment Lazada trừ tồn khi pick, tránh oversell.",
        "Flash sale Lazada lock SKU trước. Livestream TikTok dùng buffer riêng nếu shop yêu cầu.",
        "File tồn cuối ngày gửi kế toán/ads.",
      ],
      "Quy trình soạn đơn và QC": [
        "Pick list → kệ → đối biến thể → pack → bill → LEX/GHN…. Kho fulfillment Lazada hold đơn thiếu phụ kiện.",
        "Hàng dễ vỡ chèn 2 lớp. Phí vật tư tách dòng.",
        "Chụp QC nếu shop bật — giảm dispute.",
      ],
      "Hàng hoàn Lazada và đổi trả": [
        "Hoàn về, QC, nhập lại hoặc tách lỗi. Kho fulfillment Lazada không cộng tồn hàng móp trừ khi shop chấp nhận bán như mới.",
        "Ảnh gửi shop claim. Thời gian QC hoàn trong 24–48h làm việc.",
        "SKU hoàn nhiều được cảnh báo mô tả/size.",
      ],
      "Chi phí kho fulfillment Lazada": [
        "Lưu + pick + inbound hoàn. Không ăn % GMV. Kho fulfillment Lazada báo giá theo dòng đơn.",
        "Combo nhiều món đắt hơn đơn 1 món — đúng công soạn.",
        "${ZALO} để nhận bảng theo sản lượng.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Chuẩn barcode và SKU Lazada": [
        "Map SKU seller với SKU sàn. Sai map là đóng nhầm. Kho fulfillment Lazada yêu cầu file map trước lô đầu.",
        "Dán EAN/SKU ngoài thùng inbound.",
        "Hàng đổi bao bì giữa chừng phải báo để cập nhật ảnh QC.",
      ],
      "Câu hỏi thường gặp": [
        "Kho fulfillment Lazada nhận hàng từ kho LEX về? Có thể kéo, phí riêng.",
        "Có hỗ trợ chương trình lazbonus đóng gói? Theo brief shop, SOP riêng.",
        "Hủy đơn đã lên xe? Hủy trên seller center; kho không giữ được nếu đã bàn giao.",
      ],
      "Mùa sale Lazada cần chuẩn bị gì": [
        "Forecast 2 tuần, nhập trước 7 ngày, tăng ca. Kho fulfillment Lazada không nhận dump 5.000 đơn không báo.",
        "Vật tư hộp đủ size. Thiếu hộp làm chậm cả chuyến.",
        "Xem ${FF} cho SOP đa sàn.",
      ].map((p) => p.replace("${FF}", FF)),
      "Onboard kho fulfillment Lazada": [
        "20–50 đơn thử. Đối SLA lấy hàng. Rồi chuyển SKU nóng vào kho fulfillment Lazada.",
        "${CONTACT} / ${ZALO}.",
        "Có thể onboard cùng Shopee một lần inbound.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1127,
    keyword: "kho fulfillment TikTok Shop",
    slug: "kho-fulfillment-tiktok-shop",
    title: "Kho fulfillment TikTok Shop 2026 — Sẵn hàng livestream | MINH TUẤN",
    metaDescription:
      "Kho fulfillment TikTok Shop 2026: buffer livestream, pick đêm, đúng SLA, đồng bộ tồn đa sàn. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Kho fulfillment TikTok Shop của Minh Tuấn giữ buffer hàng gần bàn pack, soạn đơn phiên livestream và đơn sàn ngày, giúp seller không hết size giữa live và không lệch tồn với Shopee/Lazada.",
    internalLinks: ["/bai-viet/kho-fulfillment-shopee", "/bai-viet/kho-fulfillment-lazada", "/bai-viet/dich-vu-fulfillment-tphcm", "/bai-viet/cho-thue-kho-tmdt", "/lien-he"],
    headings: [
      "Kho fulfillment TikTok Shop giải quyết gì khi live?",
      "Buffer nóng và thứ tự ưu tiên pick",
      "SLA lấy hàng TikTok và ĐVVC",
      "Đồng bộ tồn khi chốt đơn trong phiên",
      "Đóng gói quà tặng, card, bill live",
      "Chi phí kho fulfillment TikTok Shop",
      "Hàng hoàn và đơn hủy sau live",
      "Câu hỏi thường gặp",
      "Checklist trước phiên live lớn",
      "Onboard kho fulfillment TikTok Shop",
    ],
    paragraphsByHeading: {
      "Kho fulfillment TikTok Shop giải quyết gì khi live?": [
        "Live chốt nhanh, kho nhà không kịp. Kho fulfillment TikTok Shop giữ hàng sẵn, pick theo wave sau phiên hoặc gần realtime tùy gói.",
        "Hết size giữa live vừa mất doanh thu vừa xấu hình ảnh. Buffer SKU hot được tách kệ.",
        "Vẫn bán Shopee/Lazada trên cùng tồn — xem ${TMDT}.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Buffer nóng và thứ tự ưu tiên pick": [
        "Trước live, shop gửi list SKU đẩy. Kho fulfillment TikTok Shop chuyển hàng ra bàn nóng.",
        "Sau live: ưu tiên đơn phiên, rồi đơn sàn ngày. Tránh ĐVVC tới mà túi live chưa xong.",
        "Không báo list trước = không cam kết tốc độ phiên.",
      ],
      "SLA lấy hàng TikTok và ĐVVC": [
        "TikTok siết hạn lấy. Kho fulfillment TikTok Shop cut-off nội bộ sớm hơn cửa tài xế.",
        "Đơn đêm muộn vào chuyến sáng nếu gói có ca đêm — đăng ký trước.",
        "Shop tự chịu nếu duyệt đơn chậm trên app.",
      ],
      "Đồng bộ tồn khi chốt đơn trong phiên": [
        "Trừ tồn theo wave. Kho fulfillment TikTok Shop cảnh báo SKU sắp hết để host ngừng push.",
        "Oversell live là nguồn hoàn lớn. Cập nhật tồn ảo trên seller center theo file kho.",
        "Lock SKU nếu shop chạy flash đồng thời sàn khác.",
      ],
      "Đóng gói quà tặng, card, bill live": [
        "Card cảm ơn, quà mốc, sticker — đăng ký SOP. Kho fulfillment TikTok Shop tính phí dòng phụ.",
        "Không nhét quà làm lệch cân bill. Báo khối lượng quà.",
        "Chụp QC đơn giá trị cao / khách VIP nếu shop đánh dấu.",
      ],
      "Chi phí kho fulfillment TikTok Shop": [
        "Lưu + pick + phụ live (nếu có ca đêm/buffer). Không % GMV.",
        "Phiên 1.000 đơn cần báo để tính nhân sự. Giá kho fulfillment TikTok Shop sale khác ngày thường.",
        "${ZALO} gửi số đơn live/tuần để báo đúng.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Hàng hoàn và đơn hủy sau live": [
        "Khách hủy sau chốt: nếu chưa lấy hàng, hoàn tồn ngay. Đã lấy thì theo ĐVVC. Kho fulfillment TikTok Shop QC hoàn như sàn khác.",
        "Đơn ảo/spam live được shop đánh dấu hủy sớm.",
        "Phân tích SKU hoàn sau live để sửa kịch bản chốt.",
      ],
      "Câu hỏi thường gặp": [
        "Kho fulfillment TikTok Shop có nhân viên đứng cạnh host không? Không — kho soạn, host ở studio.",
        "Có tích hợp app TikTok không? Theo thỏa thuận; mặc định file/wave.",
        "Hàng sample live để kho? Được, tách bin sample, không bán nhầm.",
      ],
      "Checklist trước phiên live lớn": [
        "List SKU, tồn tối thiểu, quà, giờ bắt đầu, ĐVVC. Gửi trước 24h. Kho fulfillment TikTok Shop xác nhận buffer đủ hay thiếu.",
        "In sẵn mã. Thiếu mã làm chậm wave.",
        "Cộng tác viên chốt đơn: một người duyệt địa chỉ lệch.",
      ],
      "Onboard kho fulfillment TikTok Shop": [
        "Chạy 1 phiên nhỏ 50–100 đơn. Đo pick và lấy hàng. Rồi scale.",
        "${CONTACT} / ${ZALO}.",
        "Onboard chung với Shopee/Lazada một inbound.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  }
);

SPECS.push(
  {
    id: 1128,
    keyword: "dịch vụ quản lý kho",
    slug: "dich-vu-quan-ly-kho",
    title: "Dịch vụ quản lý kho 2026 — WMS, xuất nhập tồn | MINH TUẤN",
    metaDescription:
      "Dịch vụ quản lý kho 2026: WMS, xuất nhập tồn realtime, kiểm đếm, báo cáo. Gửi hàng hay kho tại chỗ. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Dịch vụ quản lý kho của Minh Tuấn chuẩn hóa inbound, slotting, pick, kiểm kê và báo cáo realtime — áp dụng khi gửi hàng tại kho Minh Tuấn hoặc khi doanh nghiệp cần SOP/WMS cho kho sẵn có.",
    internalLinks: ["/bai-viet/cho-thue-kho-phan-phoi", "/bai-viet/cho-thue-kho", "/bai-viet/dich-vu-fulfillment-tphcm", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Dịch vụ quản lý kho gồm những module nào?",
      "WMS và xuất nhập tồn realtime",
      "Kiểm kê định kỳ và xử lý lệch",
      "Slotting, mã vạch, FEFO/FIFO",
      "Báo cáo cho sales, kế toán, sếp",
      "Quản lý kho tại chỗ hay gửi 3PL",
      "Chi phí dịch vụ quản lý kho",
      "Câu hỏi thường gặp",
      "Lộ trình triển khai 30 ngày",
      "Đăng ký dịch vụ quản lý kho",
    ],
    paragraphsByHeading: {
      "Dịch vụ quản lý kho gồm những module nào?": [
        "Dịch vụ quản lý kho = nhận hàng, dán mã, xếp slot, soạn xuất, kiểm kê, báo cáo, xử lý hàng lỗi/hàng hoàn. Không chỉ “có người trông kho”.",
        "Gắn ${THUE} phân phối hoặc ${FF} tùy B2B/B2C.",
        "SME thiếu SOP sẽ được viết checklist ca, chứ không chỉ giao phần mềm.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${FF}", FF)),
      "WMS và xuất nhập tồn realtime": [
        "Mọi phiếu qua hệ thống. Dịch vụ quản lý kho hướng tới tồn trên điện thoại — sales không hỏi Zalo “còn không?”.",
        "Phân quyền: thủ kho soạn, kế toán xem giá vốn nếu được cấp, sếp xem dashboard.",
        "Xuất Excel/PDF cuối ngày. API theo thỏa thuận.",
      ],
      "Kiểm kê định kỳ và xử lý lệch": [
        "Cycle count ABC: SKU nóng đếm dày. Lệch mở camera và lịch sử phiếu. Dịch vụ quản lý kho có biên bản lệch, không xóa số im lặng.",
        "Ngưỡng lệch cảnh báo. Lặp lại cùng kệ thì đổi slot/đào tạo.",
        "Kiểm kê full theo quý hoặc trước audit.",
      ],
      "Slotting, mã vạch, FEFO/FIFO": [
        "Hàng chạy gần bàn pack. Hàng chậm trên cao. HSD dùng FEFO. Dịch vụ quản lý kho từ chối inbound không HSD nếu hàng có hạn.",
        "Barcode nội bộ nếu hàng chưa có EAN.",
        "Serial/IMEI bật module scan xuất.",
      ],
      "Báo cáo cho sales, kế toán, sếp": [
        "Sales: tồn, hàng về. Kế toán: nhập xuất tồn, hàng gửi. Sếp: vòng quay, SKU chết. Dịch vụ quản lý kho gửi lịch cố định, không đợi nhắc.",
        "SKU chết 60–90 ngày đề xuất flash sale hoặc chuyển kho rẻ.",
        "File đủ cột để đổ Excel/Google Sheet.",
      ],
      "Quản lý kho tại chỗ hay gửi 3PL": [
        "Gửi 3PL: nhanh, ít tuyển người. Tại chỗ: brand muốn giữ mặt bằng. Dịch vụ quản lý kho Minh Tuấn làm được cả hai — khảo sát trước.",
        "Kho tại chỗ cần PCCC và mạng ổn. Thiếu thì nên gửi ${KHO}.",
        "Hybrid: nhà máy giữ NVL, thành phẩm gửi 3PL.",
      ].map((p) => p.replace("${KHO}", KHO)),
      "Chi phí dịch vụ quản lý kho": [
        "Theo m³/pallet + phiếu + kiểm kê. Hoặc gói nhân sự + WMS kho khách. Báo tách dòng.",
        "Rẻ hơn một lỗi giao nhầm lô hàng giá trị. Dịch vụ quản lý kho tính bằng rủi ro tránh được.",
        "${ZALO} mô tả số SKU và phiếu/ngày.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Câu hỏi thường gặp": [
        "Dịch vụ quản lý kho có làm hải quan không? Không thay tờ khai; phối hợp chứng từ và lịch xe. Xem customs.gov.vn.",
        "Nhân viên kho khách có mặt? Được, theo phân quyền, không phá SOP.",
        "Đổi WMS giữa chừng? Migrate theo dự án, không cắt số giữa tháng.",
      ],
      "Lộ trình triển khai 30 ngày": [
        "Tuần 1: master data, sơ đồ kệ. Tuần 2: inbound sạch. Tuần 3: xuất thật. Tuần 4: kiểm kê và chốt SOP. Dịch vụ quản lý kho go-live khi lệch dưới ngưỡng.",
        "Không go-live nếu file SKU còn trùng mã.",
        "Đào tạo 1–2 key user phía khách.",
      ],
      "Đăng ký dịch vụ quản lý kho": [
        "Gửi ảnh kho hiện tại hoặc sản lượng muốn gửi. Nhận đề xuất.",
        "${CONTACT} / ${ZALO}.",
        "Có thể bắt đầu 1 cụm SKU trước khi phủ toàn bộ.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1129,
    keyword: "cho thuê kho shop online",
    slug: "cho-thue-kho-shop-online",
    title: "Cho thuê kho shop online 2026 — Gửi hàng, soạn đơn | MINH TUẤN",
    metaDescription:
      "Cho thuê kho shop online 2026: mini hoặc fulfillment, Shopee Lazada TikTok, hết cảnh hết chỗ nhà. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho shop online giúp chủ shop lấy lại nhà, gửi hàng an toàn và nhờ soạn đơn khi scale — từ kiot mini tự lấy đến fulfillment đa sàn tại TP.HCM của Minh Tuấn.",
    internalLinks: ["/bai-viet/cho-thue-kho-mini", "/bai-viet/cho-thue-kho-tmdt", "/bai-viet/dich-vu-fulfillment-tphcm", "/bai-viet/cho-thue-kho", "/lien-he"],
    headings: [
      "Cho thuê kho shop online khi nào thì nên?",
      "Mini tự lấy hay gửi fulfillment",
      "Vận hành Shopee Lazada TikTok từ một kho",
      "Chi phí cho thuê kho shop online",
      "Hàng hoàn và đổi size",
      "An ninh hàng shop giá trị",
      "Lộ trình từ 20 đơn đến 500 đơn/ngày",
      "Câu hỏi thường gặp",
      "Checklist chuyển hàng khỏi nhà",
      "Đăng ký cho thuê kho shop online",
    ],
    paragraphsByHeading: {
      "Cho thuê kho shop online khi nào thì nên?": [
        "Hết phòng, hàng hoàn chất góc, ĐVVC phàn nàn giờ lấy, người nhà kêu ca. Đó là lúc cho thuê kho shop online rẻ hơn mất khách và mất sức.",
        "Đừng đợi 500 đơn/ngày mới chuyển — 30–50 đơn đã rối nếu 3 sàn.",
        "Minh Tuấn có 2 cửa: ${THUE} mini hoặc ${TMDT}.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${TMDT}", TMDT)),
      "Mini tự lấy hay gửi fulfillment": [
        "Còn thời gian đóng hàng: mini rẻ, giữ chìa. Hết thời gian / livestream: fulfillment. Cho thuê kho shop online có thể mix.",
        "Nhiều shop để hàng chậm ở mini, SKU ads ở fulfillment.",
        "Đổi gói không cần đổi công ty — cùng SOP mã hàng.",
      ],
      "Vận hành Shopee Lazada TikTok từ một kho": [
        "Một tồn thật. Cho thuê kho shop online trừ hàng khi soạn, ads không bán sản phẩm ma.",
        "Cut-off chung. Chủ shop ngủ, kho bắt chuyến sáng.",
        "Báo cáo SKU chết để cắt ads.",
      ],
      "Chi phí cho thuê kho shop online": [
        "Mini từ 300K/tháng. Fulfillment = lưu + pick. Lập 3 kịch bản đơn. Cho thuê kho shop online minh bạch hơn thuê trọ rồi cộng điện nước ẩn.",
        "Tính cả công sức đêm và phạt xu. Thường 3PL thắng khi >80 đơn/ngày.",
        "Bảng qua ${ZALO}.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Hàng hoàn và đổi size": [
        "Hoàn về kho, không về nhà. QC rồi nhập lại. Cho thuê kho shop online trả lại không gian sống.",
        "Đổi size: xuất cái mới, cái cũ về bin hoàn. SOP ghi rõ ai chịu ship.",
        "Ảnh hàng lỗi gửi shop claim khách.",
      ],
      "An ninh hàng shop giá trị": [
        "Camera, bảo vệ, kiot khóa / kệ mã. Cho thuê kho shop online hạn chế khu với mỹ phẩm high-end, điện tử.",
        "Không để nhân viên lạ vào kệ shop. Phân quyền.",
        "Bảo hiểm theo hợp đồng gói quản lý hộ.",
      ],
      "Lộ trình từ 20 đơn đến 500 đơn/ngày": [
        "20–50: mini. 50–150: hybrid. 150+: fulfillment đủ ca. Cho thuê kho shop online scale theo đơn, không ký xưởng 200 m² quá sớm.",
        "Trước 11.11 nhảy 1 mức. Báo forecast.",
        "Thuê người nhà pack không bền khi bạn đi công tác.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho shop online nhận hàng Trung Quốc về không? Có, sau thông quan; gắn kho Cát Lái.",
        "Có gói chỉ Tết 2 tháng? Mini/ngắn hạn được, giá khác tháng dài.",
        "Tự thiết kế hộp? Gửi vật tư, kho đóng theo SOP.",
      ],
      "Checklist chuyển hàng khỏi nhà": [
        "Đếm SKU, chụp, dán mã, loại hàng hỏng. Inbound sạch = cho thuê kho shop online không loạn tháng đầu.",
        "Báo ĐVVC đổi điểm lấy. Cập nhật địa chỉ kho trên sàn nếu cần.",
        "Giữ 1 thùng sample ở nhà nếu vẫn live tại nhà.",
      ],
      "Đăng ký cho thuê kho shop online": [
        "Gửi số đơn/ngày và ảnh kho nhà. Nhận đề xuất mini hay fulfillment.",
        "${CONTACT} / ${ZALO}.",
        "Có thể chuyển dần 10 SKU/tuần, không cần 1 đêm dọn hết.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1130,
    keyword: "cho thuê kho giá rẻ",
    slug: "cho-thue-kho-gia-re",
    title: "Cho thuê kho giá rẻ 2026 — Ưu đãi thuê dài hạn | MINH TUẤN",
    metaDescription:
      "Cho thuê kho giá rẻ 2026: từ 65K/m³, mini 300K, tặng tháng, chiết khấu 10–15%. Không cắt PCCC. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho giá rẻ tại Minh Tuấn đến từ ưu đãi dài hạn, đúng mô hình (mini/m³) và cắt km kéo — không phải kho hết PCCC hay cấm tải; bảng “chỉ từ” 65K/m³ và mini 300K/tháng.",
    internalLinks: ["/bai-viet/bang-gia-cho-thue-kho", "/bai-viet/chi-phi-thue-kho", "/bai-viet/cho-thue-kho", "/bai-viet/cho-thue-kho-mini", "/lien-he"],
    headings: [
      "Cho thuê kho giá rẻ đúng nghĩa là gì?",
      "Mức giá rẻ thật sau ưu đãi 2026",
      "Ba cách giảm giá mà không giảm an toàn",
      "Bẫy kho rẻ trên nhóm rao vặt",
      "Tính tổng chi phí thay vì chỉ nhìn m²",
      "Đối tượng hưởng cho thuê kho giá rẻ",
      "Câu hỏi thường gặp",
      "So sánh rẻ ngắn hạn và rẻ dài hạn",
      "Checklist trước khi chốt kho rẻ",
      "Nhận phương án cho thuê kho giá rẻ",
    ],
    paragraphsByHeading: {
      "Cho thuê kho giá rẻ đúng nghĩa là gì?": [
        "Cho thuê kho giá rẻ là đơn giá thấp đi kèm PCCC, camera, xe vào được và SLA rõ. Kho 80K/m² nhưng cấm tải 2km là kho đắt.",
        "Minh Tuấn giảm giá bằng thời hạn, thanh toán 1 lần, đúng mô hình — không tắt camera.",
        "Xem ${THUE} và ${BANG}.",
      ].map((p) => p.replace("${THUE}", THUE).replace("${BANG}", "[bảng giá cho thuê kho](/bai-viet/bang-gia-cho-thue-kho)")),
      "Mức giá rẻ thật sau ưu đãi 2026": [
        "Phân phối từ 65K/m³ (có thể giảm sâu khi dài hạn). Mini từ 300K + tặng tháng. Tự quản từ 130K/m². Cho thuê kho giá rẻ nằm ở cột sau chiết khấu 10–15%.",
        "In 2 cột: giá niêm yết / giá sau ưu đãi. CFO cần cột sau.",
        "Slot giá tốt có hạn. Hỏi còn chỗ.",
      ],
      "Ba cách giảm giá mà không giảm an toàn": [
        "1) Thuê đúng mini thay vì 30 m² trống. 2) Tự dán barcode, giảm inbound. 3) Forecast để kho xếp ca, tránh overtime. Cho thuê kho giá rẻ đến từ vận hành, không từ cắt PCCC.",
        "Gom SKU, bỏ mã chết. Ít mã = dễ được miễn quản lý <20.",
        "Đi xe Minh Tuấn giảm 15% cước — cộng vào bài toán rẻ.",
      ],
      "Bẫy kho rẻ trên nhóm rao vặt": [
        "Nhà dân, thấm dột, không PCCC, chủ cho thuê lại trái phép, đuổi giữa kỳ. Cho thuê kho giá rẻ kiểu này mất một lô hàng là hết “tiết kiệm” 5 năm.",
        "Không hợp đồng đóng dấu, không hóa đơn. Kế toán từ chối.",
        "Xem giấy PCCC và nội quy trước khi chuyển hàng.",
      ],
      "Tính tổng chi phí thay vì chỉ nhìn m²": [
        "Cộng kéo xe, điện, bốc xếp, hàng hỏng nhiệt, thời gian của bạn. Cho thuê kho giá rẻ thắng khi tổng 6 tháng thấp hơn, không phải tháng đầu.",
        "Kho xa Cát Lái thêm vài triệu kéo/cont. Kho gần đắt 10% m² vẫn rẻ hơn.",
        "Dùng bài ${CHI} để lập bảng.",
      ].map((p) => p.replace("${CHI}", "[chi phí thuê kho](/bai-viet/chi-phi-thue-kho)")),
      "Đối tượng hưởng cho thuê kho giá rẻ": [
        "Shop mới, hộ gia đình, SME ký 6–12 tháng, hàng không cần lạnh. Cho thuê kho giá rẻ ít dành hàng mát cao điểm hè (slot khan).",
        "Thanh toán một lần nếu cash flow cho phép — chiết khấu rõ.",
        "Hàng nguy hiểm không có giá dump.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho giá rẻ có phải hàng tồn kho xả không? Không — là chính sách thời hạn.",
        "Có kho 1 ngày 50K không? Gửi ngày giá cao hơn tháng; hỏi mini ngắn hạn.",
        "Rẻ nhất quận nào? Tùy slot; HCM cửa ngõ thường tốt hơn trung tâm.",
      ],
      "So sánh rẻ ngắn hạn và rẻ dài hạn": [
        "Ngắn hạn linh hoạt, đơn giá cao. Dài hạn cho thuê kho giá rẻ hơn 20–40% sau tặng tháng. Chọn theo độ chắc sản lượng.",
        "Không chắc 6 tháng: đừng ký 12 để “rẻ” rồi phá hợp đồng.",
        "Review quý nếu đơn tăng — có thể đổi gói.",
      ],
      "Checklist trước khi chốt kho rẻ": [
        "PCCC, camera, cửa cont, cấm tải, hợp đồng, hóa đơn, giờ ra vào. Thiếu 1 ý thì chưa phải cho thuê kho giá rẻ an toàn.",
        "Xem thực tế hoặc video timestamp.",
        "Đọc điều khoản phạt trả sớm.",
      ],
      "Nhận phương án cho thuê kho giá rẻ": [
        "Nêu ngân sách tháng và số m²/m³. Minh Tuấn đề xuất gói chạm sàn giá, đủ an toàn.",
        "${ZALO} / ${CONTACT}.",
        "Không hứa rẻ hơn mọi đối thủ nếu họ cắt pháp lý.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1131,
    keyword: "chi phí thuê kho",
    slug: "chi-phi-thue-kho",
    title: "Chi phí thuê kho 2026 — Cách tính m², m³, pallet | MINH TUẤN",
    metaDescription:
      "Chi phí thuê kho 2026: công thức m² m³ pallet, phí pick, kéo xe, ví dụ shop và SME. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Chi phí thuê kho không chỉ là giá mét sàn — bài này hướng dẫn tính m², m³, pallet, cộng pick, inbound, kéo xe và overtime để CFO thấy landed cost lưu kho 2026.",
    internalLinks: ["/bai-viet/bang-gia-cho-thue-kho", "/bai-viet/cho-thue-kho-gia-re", "/bai-viet/cho-thue-kho", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Chi phí thuê kho gồm những dòng nào?",
      "Công thức m², m³ và pallet",
      "Phí pick, inbound và vật tư",
      "Kéo xe, cấm tải, lưu đêm",
      "Ví dụ chi phí thuê kho cho shop 5 m³",
      "Ví dụ SME 80 m² tự quản",
      "Cách cắt chi phí thuê kho hợp lý",
      "Câu hỏi thường gặp",
      "Mẫu file lập ngân sách 12 tháng",
      "Nhờ Minh Tuấn bóc tách chi phí thuê kho",
    ],
    paragraphsByHeading: {
      "Chi phí thuê kho gồm những dòng nào?": [
        "Chi phí thuê kho = lưu (m²/m³/pallet) + inbound + pick/xuất + vật tư + điện nước (tự quản) + kéo xe + overtime + hoàn. Thiếu dòng là ngân sách hụt.",
        "VAT, cọc, phí làm hàng đêm Tết. Ghi chú trong file.",
        "Đối chiếu ${BANG} để lấy đơn giá “chỉ từ”.",
      ].map((p) => p.replace("${BANG}", "[bảng giá cho thuê kho](/bai-viet/bang-gia-cho-thue-kho)")),
      "Công thức m², m³ và pallet": [
        "Tự quản: m² × đơn giá × tháng. Gửi hộ: m³ chiếm kệ × đơn giá. Pallet: số pallet × giá. Chi phí thuê kho sai đơn vị lệch nặng.",
        "m³ = dài × rộng × cao (m). Cộng hành lang nếu hợp đồng tính cả lối đi — hỏi rõ.",
        "Hàng không chồng được tính theo footprint, không theo thể tích lý tưởng.",
      ],
      "Phí pick, inbound và vật tư": [
        "Inbound: đếm, dán mã. Pick: theo dòng hoặc đơn. Hộp/túi/bóng khí. Chi phí thuê kho TMĐT sống ở 3 dòng này hơn ở tiền lưu.",
        "Tự dán mã trước khi gửi = inbound rẻ.",
        "Combo 5 SKU = 5 pick. Thiết kế bundle từ kho cho rẻ hơn.",
      ],
      "Kéo xe, cấm tải, lưu đêm": [
        "Cont Cát Lái, xe tải nội thành, phụ cấm tải, lưu đêm sân. Cộng vào chi phí thuê kho khi so điểm xa/gần.",
        "Kho rẻ 15 km thêm có thể đắt hơn kho gần 10% giá lưu.",
        "Gom ngày kéo, đừng kéo lẻ mỗi ngày nếu không gấp.",
      ],
      "Ví dụ chi phí thuê kho cho shop 5 m³": [
        "Lưu 5 m³ × từ 65K = ~325K. Cộng pick 80 đơn × đơn giá pick + túi. Chi phí thuê kho shop nhỏ thường 1–4 triệu/tháng tùy đơn.",
        "Mini 300K nếu tự lấy, không pick. So 2 cột.",
        "Peak 11.11 nhân 2–3 pick; lập kịch bản.",
      ],
      "Ví dụ SME 80 m² tự quản": [
        "80 × 130K = 10,4 triệu lưu. Cộng điện 3 pha, bảo vệ (nếu phụ thu), xe nâng giờ. Chi phí thuê kho SME nhìn 12–18 triệu/tháng là phổ biến, chưa gồm lương thủ kho.",
        "So gửi hộ nếu chưa có người kho — tổng có thể thấp hơn.",
        "Cọc 1–2 tháng là cash flow, không phải chi phí P&L trừ khi mất cọc.",
      ],
      "Cách cắt chi phí thuê kho hợp lý": [
        "Đúng mô hình, đúng thời hạn, dọn SKU chết, forecast, gần cảng nếu nhập. Không cắt PCCC. Chi phí thuê kho giảm bền là giảm lãng phí.",
        "Thanh toán 6–12 tháng nếu lãi suất cơ hội thấp hơn chiết khấu 10–15%.",
        "Xem ${RE}.",
      ].map((p) => p.replace("${RE}", "[cho thuê kho giá rẻ](/bai-viet/cho-thue-kho-gia-re)")),
      "Câu hỏi thường gặp": [
        "Chi phí thuê kho có hóa đơn không? Có, theo hợp đồng.",
        "Tính theo ngày? Có, đơn giá cao. Hàng project vài ngày nên hỏi.",
        "Hàng mát? Nhân hệ số / giá riêng 180K/m³ từ.",
      ],
      "Mẫu file lập ngân sách 12 tháng": [
        "Cột: tháng, m³/m², đơn, pick, kéo, overtime, hoàn, tổng. Chi phí thuê kho theo mùa hiện rõ Tết.",
        "Gửi file mẫu khi bạn liên hệ — điền số thật.",
        "Review tháng 1 sau onboard, chỉnh định mức.",
      ],
      "Nhờ Minh Tuấn bóc tách chi phí thuê kho": [
        "Gửi loại hàng + sản lượng. Nhận 3 kịch bản chi phí thuê kho trong 24h.",
        "${ZALO} / ${CONTACT}.",
        "Không báo một con số “trọn gói” che pick.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1132,
    keyword: "pick pack ship",
    slug: "pick-pack-ship",
    title: "Pick pack ship 2026 — Soạn đóng gửi đa sàn | MINH TUẤN",
    metaDescription:
      "Pick pack ship 2026: soạn kệ, đóng gói, bàn giao ĐVVC Shopee Lazada TikTok. Đúng SKU, đúng bill. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Pick pack ship là chuỗi soạn hàng – đóng gói – bàn giao vận chuyển; Minh Tuấn chạy quy trình này cho shop đa sàn tại TP.HCM để giảm đóng sai, trễ cut-off và lệch cân bill.",
    internalLinks: ["/bai-viet/dich-vu-fulfillment-tphcm", "/bai-viet/cho-thue-kho-tmdt", "/bai-viet/kho-fulfillment-shopee", "/bai-viet/fulfillment-logistics", "/lien-he"],
    headings: [
      "Pick pack ship là gì trong TMĐT?",
      "Bước pick: đúng kệ, đúng biến thể",
      "Bước pack: chống sốc và đúng cân",
      "Bước ship: bill, chuyến, cut-off",
      "SLA pick pack ship theo sản lượng",
      "Chi phí pick pack ship",
      "Lỗi thường gặp và cách chặn",
      "Câu hỏi thường gặp",
      "Vật tư và SOP brand",
      "Thuê pick pack ship tại Minh Tuấn",
    ],
    paragraphsByHeading: {
      "Pick pack ship là gì trong TMĐT?": [
        "Pick pack ship = lấy đúng SKU khỏi kệ, đóng đúng chuẩn, giao đúng ĐVVC. Là trái tim ${TMDT} và ${FF}.",
        "Thiếu một mắt xích: khách nhận sai hàng hoặc sàn phạt trễ. Shop tưởng “chỉ cần kho”.",
        "Minh Tuấn đo từng bước bằng timestamp, không gộp “đã xử lý”.",
      ].map((p) => p.replace("${TMDT}", TMDT).replace("${FF}", FF)),
      "Bước pick: đúng kệ, đúng biến thể": [
        "Pick list theo wave. Scan mã. Sai màu/size bị chặn. Pick pack ship thất bại chủ yếu ở pick, không ở băng keo.",
        "SKU nóng kệ thấp. FEFO với HSD.",
        "Đơn thiếu 1 dòng hold, không gửi thiếu.",
      ],
      "Bước pack: chống sốc và đúng cân": [
        "Chọn hộp/túi vừa, chèn, dán. Lệch cân làm ĐVVC phụ thu hoặc vỡ. Pick pack ship ghi khối lượng lên SOP.",
        "Card/quà tính vào cân. Báo shop nếu vượt mốc phí ship.",
        "Hàng lỏng (bột, nước) niêm phong kép.",
      ],
      "Bước ship: bill, chuyến, cut-off": [
        "Dán bill đúng đơn, chia túi SPX/GHN/GHTK/LEX/J&T. Pick pack ship cắt giờ trước cửa tài xế.",
        "Đối chiếu số bill = số túi. Sót bill là mất xu.",
        "Ảnh bàn giao nếu tranh chấp “tài xế bảo không lấy”.",
      ],
      "SLA pick pack ship theo sản lượng": [
        "Dưới 100 đơn: trong ngày trước cut-off. 100–500: ca sóng. 500+: ca đêm đăng ký. Pick pack ship không cam kết nếu dump đơn không forecast.",
        "Live TikTok wave riêng.",
        "Báo cáo đơn trễ kèm lý do: hết hàng / lệch địa chỉ / ĐVVC hủy ca.",
      ],
      "Chi phí pick pack ship": [
        "Theo dòng pick + hộp + không gồm lưu trừ khi gửi kho. Gói all-in pick pack ship + lưu xem fulfillment HCM.",
        "Đơn 1 món rẻ hơn 5 món. Bundle từ kho.",
        "${ZALO} gửi đơn/ngày để báo giá.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Lỗi thường gặp và cách chặn": [
        "Bill dán nhầm, quên quà, sai size, sót chuyến. Pick pack ship chặn bằng scan 2 lớp và checklist miệng túi.",
        "Đào tạo lại nếu cùng người lỗi 2 lần/tuần.",
        "Khách claim: đối ảnh QC + camera pack.",
      ],
      "Câu hỏi thường gặp": [
        "Pick pack ship nhận hàng mang tới trong ngày không? Có hẹn ca inbound, không xô với giờ ship.",
        "Tự in bill? Được, hoặc kho in hộ.",
        "Hàng COD? ĐVVC thu; kho không giữ tiền.",
      ],
      "Vật tư và SOP brand": [
        "Shop gửi hộp in sẵn hoặc dùng vật tư kho. Pick pack ship theo brief: giấy lót, sticker, mùi (nếu cho phép an toàn).",
        "Đổi SOP giữa tháng: báo 3 ngày để train ca.",
        "Cấm vật tư chảy nước, dễ cháy.",
      ],
      "Thuê pick pack ship tại Minh Tuấn": [
        "Gửi 30 đơn thử. Đo tỷ lệ đúng SKU. Rồi ký pick pack ship tháng.",
        "${CONTACT} / ${ZALO}.",
        "Kết hợp lưu kho hoặc chỉ soạn hàng bạn gửi mỗi sáng.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1133,
    keyword: "cho thuê kho lạnh",
    slug: "cho-thue-kho-lanh",
    title: "Cho thuê kho lạnh 2026 — Bảo quản hàng nhạy nhiệt | MINH TUẤN",
    metaDescription:
      "Cho thuê kho lạnh 2026: tư vấn mát 18–25°C hoặc lạnh sâu hơn, thực phẩm dược mỹ phẩm. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho lạnh cần đúng dải nhiệt: nhiều hàng chỉ cần kho mát 18–25°C, một số thực phẩm/dược cần lạnh hơn — Minh Tuấn khảo sát TDS rồi xếp đúng khu, tránh hỏng hàng vì thuê nhầm kho.",
    internalLinks: ["/bai-viet/cho-thue-kho-mat", "/bai-viet/cho-thue-kho", "/dich-vu/kho-bai-logistics", "/bai-viet/van-chuyen-lanh", "/lien-he"],
    headings: [
      "Cho thuê kho lạnh và kho mát khác nhau ra sao?",
      "Khi nào thật sự cần lạnh, khi nào chỉ cần mát",
      "Hàng thực phẩm, dược, mỹ phẩm",
      "Hạ tầng máy lạnh, logger, dự phòng",
      "Giá cho thuê kho lạnh / mát tham khảo",
      "Vận chuyển lạnh nối từ kho",
      "Rủi ro thuê kho lạnh không logger",
      "Câu hỏi thường gặp",
      "Hồ sơ TDS và SOP cửa kho",
      "Khảo sát cho thuê kho lạnh",
    ],
    paragraphsByHeading: {
      "Cho thuê kho lạnh và kho mát khác nhau ra sao?": [
        "Thị trường hay gọi chung “kho lạnh”. Cho thuê kho lạnh đúng nghĩa thường 0–8°C hoặc âm; kho mát 18–25°C. Thuê sai dải làm hỏng kem hoặc làm đá hàng không cần đông.",
        "Minh Tuấn hỏi TDS trước. Nhiều brand mỹ phẩm chỉ cần ${MAT}.",
        "Không nhét hàng đông vào kho mát rồi gọi là đủ.",
      ].map((p) => p.replace("${MAT}", "[cho thuê kho mát](/bai-viet/cho-thue-kho-mat)")),
      "Khi nào thật sự cần lạnh, khi nào chỉ cần mát": [
        "Cần lạnh: một số sữa, thịt chế biến, vacxin/dược theo nhãn, raw food. Cần mát: son, serum, rượu, chocolate mùa nóng. Cho thuê kho lạnh đắt hơn — đừng trả thừa.",
        "Hàng “bảo quản nơi khô ráo, tránh nắng” ≠ kho đông.",
        "Audit chuỗi cung ứng: xe đông + kho mát = gãy cold chain.",
      ],
      "Hàng thực phẩm, dược, mỹ phẩm": [
        "Thực phẩm khô FEFO. Dược cần giấy tờ lưu hành / điều kiện. Mỹ phẩm SDS. Cho thuê kho lạnh/mát từ chối hàng không rõ nguồn.",
        "Không để thực phẩm chảy nước cạnh dược.",
        "Hải quan: hàng nhập xem customs.gov.vn trước khi về kho.",
      ],
      "Hạ tầng máy lạnh, logger, dự phòng": [
        "Dàn lạnh, cảm biến, máy phát/kế hoạch sự cố. Cho thuê kho lạnh không logger là rủi ro claim.",
        "Khách cắm logger riêng trong pallet được.",
        "Bảo trì định kỳ, không chờ hết gas.",
      ],
      "Giá cho thuê kho lạnh / mát tham khảo": [
        "Kho mát từ 180K/m³/tháng. Kho lạnh sâu báo riêng theo dải và slot. Cho thuê kho lạnh âm thường cao hơn mát rõ rệt.",
        "Ưu đãi dài hạn, free pallet gói mát như bảng chung.",
        "Giá chưa gồm xe lạnh giao hàng.",
      ],
      "Vận chuyển lạnh nối từ kho": [
        "Hàng ra khỏi kho đúng nhiệt rồi lên xe nóng là hỏng chuỗi. Hỏi xe thùng đông/mát. Xem [vận chuyển lạnh](/bai-viet/van-chuyen-lanh).",
        "Cho thuê kho lạnh + xe cùng đầu mối giảm trách nhiệm đùn đẩy.",
        "Leadtime giao nội thành tính cả precool xe.",
      ],
      "Rủi ro thuê kho lạnh không logger": [
        "Mất điện đêm, sáng hàng chảy, không chứng minh. Bảo hiểm từ chối. Cho thuê kho lạnh phải có log.",
        "Cửa mở lâu làm đọng tuyết, tốn điện, lệch nhiệt góc xa.",
        "Nhân sự không SOP áo kho, cửa — đào tạo ca.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho lạnh 1 pallet được không? Tùy điểm; mát thì dễ chia m³ nhỏ.",
        "Có âm 18°C? Khảo sát điểm chuyên; không cam kết mọi cơ sở đều có.",
        "Xem kho trước? Được, giữ cửa, hạn chế thời gian trong buồng lạnh.",
      ],
      "Hồ sơ TDS và SOP cửa kho": [
        "Gửi nhãn, TDS, số pallet. SOP: cửa, thời gian soạn tối đa. Cho thuê kho lạnh nhận hàng khi đủ giấy.",
        "Hàng lệch kê khai giữ tại cửa.",
        "Cập nhật HSD mỗi lô inbound.",
      ],
      "Khảo sát cho thuê kho lạnh": [
        "Nêu dải °C và sản lượng. Minh Tuấn xếp mát hoặc lạnh đúng, không bán nhầm tên.",
        "${ZALO} / ${CONTACT}.",
        "Book trước hè. Slot lạnh/mát hết nhanh.",
      ].map((p) => p.replace("${ZALO}", ZALO).replace("${CONTACT}", CONTACT)),
    },
  },
  {
    id: 1134,
    keyword: "cho thuê kho Quận 7",
    slug: "cho-thue-kho-quan-7",
    title: "Cho thuê kho Quận 7 2026 — Gần KCX Tân Thuận | MINH TUẤN",
    metaDescription:
      "Cho thuê kho Quận 7 2026: gần Tân Thuận, Nam Sài Gòn, kết nối Q4 Q8 Nhà Bè. Mini đến tự quản. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho Quận 7 hướng tới doanh nghiệp Nam Sài Gòn cần gần KCX Tân Thuận, khu dân cư và trục về trung tâm — Minh Tuấn tư vấn mini, phân phối hoặc tự quản đúng giờ cấm tải.",
    internalLinks: ["/bai-viet/cho-thue-kho-tphcm", "/bai-viet/cho-thue-kho-thu-duc", "/bai-viet/cho-thue-kho", "/dich-vu/kho-bai-logistics", "/lien-he"],
    headings: [
      "Cho thuê kho Quận 7 phù hợp mô hình nào?",
      "Vị trí Tân Thuận, Phú Mỹ Hưng, Nam Sài Gòn",
      "Giờ cấm tải và lộ trình xe",
      "Gói mini, phân phối, tự quản tại cửa ngõ Q7",
      "Giá cho thuê kho Quận 7 tham khảo",
      "Kết nối Cát Lái và nội thành",
      "Câu hỏi thường gặp",
      "Shop online ở Q7 nên chọn gói nào",
      "Checklist xem kho Quận 7",
      "Hẹn khảo sát cho thuê kho Quận 7",
    ],
    paragraphsByHeading: {
      "Cho thuê kho Quận 7 phù hợp mô hình nào?": [
        "Cho thuê kho Quận 7 hợp DN bán nội thành phía Nam, showroom kiêm kho nhỏ, hàng sau sản xuất KCX cần buffer. Không phải lúc nào cũng rẻ hơn Bình Tân — bù lại gần khách.",
        "Gắn mạng ${HCM} và ${THUE}.",
        "Hàng cont lớn vẫn nên so với kho gần Cát Lái nếu hạ 40' thường xuyên.",
      ].map((p) => p.replace("${HCM}", "[cho thuê kho TP.HCM](/bai-viet/cho-thue-kho-tphcm)").replace("${THUE}", THUE)),
      "Vị trí Tân Thuận, Phú Mỹ Hưng, Nam Sài Gòn": [
        "KCX Tân Thuận, trục Nguyễn Thị Thập, Nguyễn Văn Linh, Huỳnh Tấn Phát. Cho thuê kho Quận 7 lợi leadtime giao Q4, Q8, Nhà Bè, trung tâm giờ được phép.",
        "Khu dân cư khắt PCCC và ồn. Chọn điểm kho chuẩn, đừng thuê nhà phố làm kho.",
        "Bán kính lấy ĐVVC tốt cho shop.",
      ],
      "Giờ cấm tải và lộ trình xe": [
        "Q7 có khung giờ và tải trọng. Cho thuê kho Quận 7 phải có lộ trình xe nhỏ/đúng giờ, không để tài xế bị phạt.",
        "Hàng đêm: đăng ký ca. Hàng ngày: chia chuyến sớm.",
        "Hỏi rõ trước khi ký — đây là lý do kho “rẻ trung tâm” hóa đắt.",
      ],
      "Gói mini, phân phối, tự quản tại cửa ngõ Q7": [
        "Mini cho shop. Phân phối cho soạn hộ. Tự quản cho đại lý. Cho thuê kho Quận 7 không chỉ một size.",
        "Hàng mát hỏi slot riêng.",
        "Fulfillment đa sàn xem ${TMDT}.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Giá cho thuê kho Quận 7 tham khảo": [
        "Bám bảng chung (65K/m³, 300K mini, 130K/m²) — điểm sát trung tâm có thể cao hơn cửa ngõ. Cho thuê kho Quận 7 báo theo slot thật.",
        "Đừng so giá Bình Dương rồi bắt Q7 bằng giá đó.",
        "${ZALO} gửi số m² và loại xe.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Kết nối Cát Lái và nội thành": [
        "Từ Q7 sang Cát Lái gần hơn nhiều quận Tây. Cho thuê kho Quận 7 vẫn có thể làm buffer nhập nếu sản lượng vừa, sân đủ cửa.",
        "Cont 40' xác nhận sân. Không phải kiot nào cũng hạ cont.",
        "Nội thành: xe tải nhẹ, chia drop.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho Quận 7 có ở Phú Mỹ Hưng không? Ưu tiên cụm kho/PCCC, không nhét hầm giữ xe.",
        "Giao 2h sáng được không? Tùy bảo vệ điểm; đăng ký.",
        "Gửi hàng Shopee? Được, gói fulfillment hoặc tự lấy mini.",
      ],
      "Shop online ở Q7 nên chọn gói nào": [
        "Dưới 50 đơn: mini. Trên 80 đơn + live: fulfillment. Cho thuê kho Quận 7 gần nhà chủ shop là lợi thế kiểm hàng tuần.",
        "Đừng để hàng trong căn hộ PMH — PCCC và hàng xóm.",
        "Giữ sample ở nhà, bulk ở kho.",
      ],
      "Checklist xem kho Quận 7": [
        "Cửa, sân, PCCC, camera, đường xe, ngập mùa mưa, giờ cấm. Cho thuê kho Quận 7 gần kênh cần hỏi thoát nước.",
        "Đo ngõ. Xe 1.25 tấn có vào không.",
        "Chụp hiện trạng.",
      ],
      "Hẹn khảo sát cho thuê kho Quận 7": [
        "Nêu phường mong muốn và loại hàng. Minh Tuấn gửi 1–2 điểm còn chỗ.",
        "${CONTACT} / ${ZALO}.",
        "Giữ chỗ bằng cọc sau khi chốt.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1135,
    keyword: "cho thuê kho Thủ Đức",
    slug: "cho-thue-kho-thu-duc",
    title: "Cho thuê kho Thủ Đức 2026 — Kết nối vành đai | MINH TUẤN",
    metaDescription:
      "Cho thuê kho Thủ Đức 2026: vành đai, XA Lộ Hà Nội, kết nối Cát Lái Đồng Nai Bình Dương. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho Thủ Đức tận dụng trục vành đai và Xa lộ Hà Nội để trung chuyển Cát Lái – Đồng Nai – Bình Dương – nội thành, phù hợp SME phân phối và shop cần ĐVVC lấy hàng nhanh.",
    internalLinks: ["/bai-viet/cho-thue-kho-tphcm", "/bai-viet/cho-thue-kho-quan-7", "/bai-viet/cho-thue-kho-gan-cat-lai", "/bai-viet/cho-thue-kho", "/lien-he"],
    headings: [
      "Cho thuê kho Thủ Đức lợi thế giao thông nào?",
      "Khu vực Long Bình, Trường Thọ, Linh Xuân, Cát Lái",
      "Gói dịch vụ tại Thủ Đức",
      "Giá cho thuê kho Thủ Đức",
      "Shop TMĐT và ĐVVC phía Đông",
      "Hàng nhập chia về Đồng Nai, Bình Dương",
      "Câu hỏi thường gặp",
      "Ngập, cấm tải, giờ cao điểm",
      "Checklist xem kho Thủ Đức",
      "Đặt khảo sát cho thuê kho Thủ Đức",
    ],
    paragraphsByHeading: {
      "Cho thuê kho Thủ Đức lợi thế giao thông nào?": [
        "Thủ Đức nằm cửa ngõ Đông: Xa lộ Hà Nội, vành đai, cao tốc. Cho thuê kho Thủ Đức giảm thời gian sang Đồng Nai, Bình Dương và về Cát Lái so với kho Tây thành phố.",
        "Phù hợp hàng phân phối miền Đông và shop giao nội thành phía Đông.",
        "Nằm trong mạng ${HCM}.",
      ].map((p) => p.replace("${HCM}", "[cho thuê kho TP.HCM](/bai-viet/cho-thue-kho-tphcm)")),
      "Khu vực Long Bình, Trường Thọ, Linh Xuân, Cát Lái": [
        "Mỗi phường một lợi thế: gần KCX Linh Trung, gần cảng, gần vành đai. Cho thuê kho Thủ Đức chọn điểm theo loại xe và khách, không chỉ “thuộc Thủ Đức là xong”.",
        "Cát Lái (phường) gần cảng — xem bài kho gần Cát Lái nếu hạ cont nhiều.",
        "Tránh kho trong hẻm sâu xe 2 tấn không vào.",
      ],
      "Gói dịch vụ tại Thủ Đức": [
        "Mini, phân phối, mát, tự quản, fulfillment. Cho thuê kho Thủ Đức đủ mô hình như các cửa ngõ khác.",
        "Đội xe bộ nối nội thành và tỉnh.",
        "${THUE} để xem ưu đãi chung 2026.",
      ].map((p) => p.replace("${THUE}", THUE)),
      "Giá cho thuê kho Thủ Đức": [
        "Bám khung 65K/m³, 300K mini, 130K/m² — điểm sát vành đai/cảng có thể khác. Cho thuê kho Thủ Đức báo theo slot.",
        "So tổng kéo, đừng chỉ m².",
        "${ZALO} gửi map điểm giao chính.",
      ].map((p) => p.replace("${ZALO}", ZALO)),
      "Shop TMĐT và ĐVVC phía Đông": [
        "Hub ĐVVC phía Đông lấy hàng thuận. Cho thuê kho Thủ Đức + fulfillment giảm trễ bill.",
        "Live đêm, pack sáng, tài xế lấy sớm.",
        "Xem ${TMDT}.",
      ].map((p) => p.replace("${TMDT}", TMDT)),
      "Hàng nhập chia về Đồng Nai, Bình Dương": [
        "Hạ Cát Lái → kho Thủ Đức → chia 2–3 xe tỉnh. Cho thuê kho Thủ Đức làm cross-dock tốt.",
        "Tránh kéo về kho Q6 rồi quay lại Đông — đốt dầu.",
        "Lịch cắt máng đêm: bảo vệ nhận cont.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho Thủ Đức có gần metro không? Một số điểm gần XLHN; kho cần xe tải hơn là metro.",
        "Ngập? Hỏi cốt nền và lịch sử mưa. Xem thực tế mùa mưa nếu được.",
        "Thuê 20 m²? Mini/tự quản nhỏ; hỏi chỗ.",
      ],
      "Ngập, cấm tải, giờ cao điểm": [
        "XLHN kẹt giờ cao điểm. Cho thuê kho Thủ Đức nên xuất sớm hoặc sau khung. Cấm tải từng đoạn — lộ trình ghi SOP tài xế.",
        "Khu thấp: kệ chân cao, không để pallet sát nền.",
        "Bảo hiểm hàng nếu giá trị cao.",
      ],
      "Checklist xem kho Thủ Đức": [
        "Cửa cont, vòng xoay, PCCC, camera, cốt nền, khoảng cách vành đai/cảng. Cho thuê kho Thủ Đức thiếu sân là khổ hạ hàng.",
        "Đo ngõ, hỏi giờ bảo vệ.",
        "Chụp hiện trạng.",
      ],
      "Đặt khảo sát cho thuê kho Thủ Đức": [
        "Nêu 3 điểm giao nhiều nhất. Minh Tuấn chọn kho tối ưu km.",
        "${CONTACT} / ${ZALO}.",
        "Giữ slot Tết từ tháng 11–12.",
      ].map((p) => p.replace("${CONTACT}", CONTACT).replace("${ZALO}", ZALO)),
    },
  },
  {
    id: 1136,
    keyword: "dịch vụ fulfillment TP.HCM",
    skip: true,
  }
);

function main() {
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  const existingSlugs = new Set(posts.map((p) => p.slug));
  const existingKw = new Set(posts.map((p) => String(p.keyword || "").toLowerCase()));
  const maxId = posts.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);

  const toAdd = [];
  SPECS.forEach((spec, idx) => {
    if (spec.skip) return;
    if (existingSlugs.has(spec.slug) || existingKw.has(spec.keyword.toLowerCase())) {
      console.log(`Skip existing: ${spec.slug}`);
      return;
    }
    const post = makePost(spec, idx);
    post.id = Math.max(spec.id, maxId + 1 + toAdd.length);
    const report = analyze(post, { existingPosts: posts.concat(toAdd), currentId: post.id });
    const fails = (report.items || []).filter((i) => !i.ok);
    console.log(
      `SEO ${post.slug}: score=${report.score} publish=${report.canPublish} words=${post.wordCount} meta=${post.metaDescription.length}`
    );
    fails.forEach((i) => console.log(`  - FAIL: ${i.message}`));
    if (!report.canPublish) {
      console.log(`  !! will still add — fix after if needed`);
    }
    toAdd.push(post);
    existingSlugs.add(post.slug);
  });

  if (!toAdd.length) {
    console.log("No new articles.");
    return;
  }

  const merged = posts.concat(toAdd);
  const tmp = `${postsPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(merged), "utf8");
  fs.renameSync(tmp, postsPath);
  console.log(`Added ${toAdd.length} articles. Total ${merged.length}`);
  toAdd.forEach((a) => console.log(` - #${a.id} ${a.slug}`));
}

main();
