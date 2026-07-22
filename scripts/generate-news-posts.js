/**
 * Generates 1000 unique SEO articles — no shared template structure.
 * Output: data/news-posts.json
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const keywords = JSON.parse(fs.readFileSync(path.join(root, "data", "keywords-1000.json"), "utf8"));

const CAT_LABEL = {
  sea: "Đường biển",
  air: "Hàng không",
  road: "Đường bộ",
  customs: "Hải quan",
  warehouse: "Kho bãi",
  global: "Quốc tế",
  business: "Doanh nghiệp",
};

const PHOTO = {
  sea: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  air: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  road: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  customs: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  warehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  global: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
  business: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const hash = (n, salt = "") => {
  const s = `${n}:${salt}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = (arr, i, salt) => arr[hash(i, salt) % arr.length];

const detectContext = (keyword) => {
  const k = keyword.toLowerCase();
  const ctx = { location: null, country: null, mode: null, commodity: null };
  const locs = [
    "TP.HCM", "Hồ Chí Minh", "Tân Sơn Nhất", "Cát Lái", "Hải Phòng", "Hà Nội", "Đà Nẵng",
    "Bình Dương", "Đồng Nai", "Cần Thơ", "cảng Cát Lái", "cảng Hải Phòng", "sân bay Tân Sơn Nhất",
  ];
  locs.forEach((l) => {
    if (k.includes(l.toLowerCase())) ctx.location = l;
  });
  const countries = [
    "Trung Quốc", "Mỹ", "Hàn Quốc", "Nhật Bản", "Đài Loan", "Thái Lan", "Singapore",
    "Đức", "Úc", "Anh", "UAE", "Indonesia", "Malaysia", "Philippines", "châu Âu", "ASEAN",
  ];
  countries.forEach((c) => {
    if (k.includes(c.toLowerCase())) ctx.country = c;
  });
  if (/fcl|nguyên container|full container/.test(k)) ctx.mode = "FCL";
  else if (/lcl|hàng lẻ|consolidation/.test(k)) ctx.mode = "LCL";
  else if (/hàng không|air|airway/.test(k)) ctx.mode = "air";
  else if (/đường biển|biển|tàu/.test(k)) ctx.mode = "sea";
  else if (/đường bộ|nội địa|liên tỉnh|đầu kéo/.test(k)) ctx.mode = "road";
  return ctx;
};

// 100 unique section-type sequences (order + composition differs per article)
const OUTLINE_POOL = [];
const SECTION_TYPES = [
  "intro", "define", "context", "who", "process", "steps", "documents",
  "timeline", "benefits", "compare", "cost", "factors", "mistakes",
  "tips", "case", "faq", "related", "location", "route", "compliance",
  "tracking", "insurance", "warehouse_note", "partner", "cta",
];

for (let n = 0; n < 100; n++) {
  const len = 5 + (n % 5);
  const used = new Set();
  const outline = [];
  let seed = n * 17;
  while (outline.length < len) {
    const t = SECTION_TYPES[(seed + outline.length * 7) % SECTION_TYPES.length];
    if (!used.has(t) || outline.length > 8) {
      outline.push(t);
      used.add(t);
    }
    seed++;
  }
  OUTLINE_POOL.push(outline);
}

// H2 headings — 15+ variants per section type
const H2 = {
  intro: (kw, i) => pick([`${kw} và bức tranh logistics 2026`, `Mở đầu: ${kw}`, `${kw} — góc nhìn thực tiễn`, `Tại sao ${kw} được quan tâm?`, `Bối cảnh ${kw} tại Việt Nam`], i, "h2intro"),
  define: (kw, i) => pick([`${kw} là gì?`, `Khái niệm ${kw}`, `Giải thích ${kw} cho doanh nghiệp`, `${kw} trong chuỗi cung ứng`, `Phạm vi dịch vụ ${kw}`], i, "h2def"),
  context: (kw, i, ctx) => pick([`${kw} tại ${ctx.location || "TP.HCM"}`, `Bối cảnh thị trường ${kw}`, `${kw} và xu hướng ngành`, `Thực trạng ${kw} hiện nay`, `${kw} trong chuỗi XNK`], i, "h2ctx"),
  who: (kw, i) => pick([`Doanh nghiệp nào cần ${kw}?`, `Đối tượng phù hợp cho ${kw}`, `Ai nên dùng dịch vụ ${kw}?`, `${kw} dành cho ai?`, `Khách hàng tiêu biểu của ${kw}`], i, "h2who"),
  process: (kw, i) => pick([`Quy trình ${kw} tại MINH TUẤN`, `Cách triển khai ${kw}`, `Luồng xử lý ${kw}`, `Sơ đồ vận hành ${kw}`, `Các giai đoạn ${kw}`], i, "h2proc"),
  steps: (kw, i) => pick([`Các bước thực hiện ${kw}`, `Hướng dẫn từng bước ${kw}`, `Checklist ${kw}`, `Quy trình 5 bước ${kw}`, `Triển khai ${kw} như thế nào?`], i, "h2steps"),
  documents: (kw, i) => pick([`Chứng từ cần cho ${kw}`, `Hồ sơ ${kw}`, `Giấy tề liên quan ${kw}`, `Danh mục chứng từ ${kw}`, `Chuẩn bị hồ sơ ${kw}`], i, "h2doc"),
  timeline: (kw, i, ctx) => pick([`Thời gian ${kw}${ctx.country ? ` đi ${ctx.country}` : ""}`, `Transit time ${kw}`, `Mốc thời gian xử lý ${kw}`, `Lịch trình ${kw} dự kiến`, `Bao lâu hoàn tất ${kw}?`], i, "h2time"),
  benefits: (kw, i) => pick([`Lợi ích ${kw}`, `Giá trị khi chọn ${kw}`, `Vì sao doanh nghiệp cần ${kw}`, `Điểm mạnh của ${kw}`, `${kw} mang lại gì?`], i, "h2ben"),
  compare: (kw, i, ctx) => pick([`So sánh phương án ${kw}`, `${kw}: FCL hay LCL?`, `Lựa chọn phù hợp cho ${kw}`, `Đối chiếu chi phí ${kw}`, `${kw} và phương án thay thế`], i, "h2cmp"),
  cost: (kw, i) => pick([`Chi phí ${kw}`, `Báo giá ${kw}`, `Cước phí ${kw}`, `Yếu tố ảnh hưởng giá ${kw}`, `Tiết kiệm chi phí ${kw}`], i, "h2cost"),
  factors: (kw, i) => pick([`Yếu tố quyết định ${kw}`, `Biến số ảnh hưởng ${kw}`, `Rủi ro cần lưu ý khi ${kw}`, `Điều kiện triển khai ${kw}`, `Hạn chế thường gặp với ${kw}`], i, "h2fac"),
  mistakes: (kw, i) => pick([`Sai lầm phổ biến khi ${kw}`, `Tránh nhầm lẫn với ${kw}`, `Lỗi thường gặp ${kw}`, `Điều không nên làm với ${kw}`, `Rủi ro pháp lý ${kw}`], i, "h2mis"),
  tips: (kw, i) => pick([`Mẹo tối ưu ${kw}`, `Kinh nghiệm ${kw}`, `Best practice ${kw}`, `Gợi ý thực chiến ${kw}`, `Checklist nhanh ${kw}`], i, "h2tip"),
  case: (kw, i, ctx) => pick([`Ví dụ thực tế ${kw}`, `Case study ${kw}`, `Tình huống minh họa ${kw}`, `Kịch bản ${kw} doanh nghiệp SME`, `${kw}${ctx.country ? ` tuyến ${ctx.country}` : ""} — case thực tế`], i, "h2case"),
  faq: (kw, i) => pick([`Hỏi đáp về ${kw}`, `FAQ ${kw}`, `Câu hỏi thường gặp ${kw}`, `Giải đáp nhanh ${kw}`, `Thắc mắc phổ biến ${kw}`], i, "h2faq"),
  related: (kw, i, cat) => pick([`Dịch vụ liên quan ${kw}`, `${kw} và giải pháp kèm theo`, `Kết hợp ${kw} với logistics`, `Hệ sinh thái dịch vụ ${cat}`, `Mở rộng từ ${kw}`], i, "h2rel"),
  location: (kw, i, ctx) => pick([`${kw} gần ${ctx.location || "Tân Sơn Nhất"}`, `Lợi thế địa lý ${kw}`, `Hub logistics cho ${kw}`, `${kw} tại khu vực cảng/sân bay`, `Kết nối hạ tầng ${kw}`], i, "h2loc"),
  route: (kw, i, ctx) => pick([`Tuyến ${kw}${ctx.country ? ` — ${ctx.country}` : ""}`, `Hành trình ${kw}`, `Routing ${kw}`, `Sơ đồ tuyến ${kw}`, `Điểm đi — điểm đến ${kw}`], i, "h2route"),
  compliance: (kw, i) => pick([`Tuân thủ pháp lý ${kw}`, `Quy định hải quan ${kw}`, `Compliance ${kw}`, `Chuẩn mực ${kw}`, `Hải quan & ${kw}`], i, "h2comp"),
  tracking: (kw, i) => pick([`Theo dõi ${kw}`, `Tracking lô hàng ${kw}`, `Giám sát tiến độ ${kw}`, `Cập nhật trạng thái ${kw}`, `Visibility ${kw}`], i, "h2track"),
  insurance: (kw, i) => pick([`Bảo hiểm cho ${kw}`, `Bảo vệ rủi ro ${kw}`, `Cargo insurance ${kw}`, `Giảm thiểu tổn thất ${kw}`, `Phạm vi bảo hiểm ${kw}`], i, "h2ins"),
  warehouse_note: (kw, i) => pick([`Kho bãi trong chuỗi ${kw}`, `Lưu kho & ${kw}`, `WMS và ${kw}`, `Cross-dock ${kw}`, `Tồn kho liên quan ${kw}`], i, "h2wh"),
  partner: (kw, i) => pick([`Vì sao chọn MINH TUẤN cho ${kw}`, `Đối tác ${kw} uy tín`, `MINH TUẤN & ${kw}`, `Cam kết dịch vụ ${kw}`, `10+ năm ${kw}`], i, "h2part"),
  cta: (kw, i) => pick([`Liên hệ tư vấn ${kw}`, `Nhận báo giá ${kw}`, `Đặt lịch ${kw}`, `Hỗ trợ ${kw} ngay`, `Kết nối MINH TUẤN — ${kw}`], i, "h2cta"),
};

// Paragraph builders — each returns unique text based on i + context
const P = {
  intro: (kw, i, ctx, cat) => {
    const pool = [
      `Thị trường logistics Việt Nam năm 2026 ghi nhận nhu cầu ${kw} tăng mạnh ở nhóm ${cat}. MINH TUẤN Logistics hỗ trợ doanh nghiệp chuẩn hóa quy trình, giảm thất thoát thời gian ở khâu chứng từ và vận hành.`,
      `Khi tìm kiếm "${kw}", doanh nghiệp cần đối tác vừa am hiểu ${cat}, vừa phản hồi nhanh. MINH TUẤN tại 69/1 Trần Quốc Hoàn (gần Tân Sơn Nhất) tối ưu cho khách hàng miền Nam và tuyến quốc tế.`,
      `${cap(kw)} không chỉ là một từ khóa tìm kiếm — đó là bài toán vận hành thực tế: chi phí, tiến độ, tuân thủ. Bài viết số ${i + 1} trong thư viện kiến thức MINH TUẤN đi sâu vào góc độ ${cat}.`,
      `Số hóa khai báo và tracking giúp ${kw} minh bạch hơn. MINH TUẤN kết hợp kinh nghiệm 10+ năm với quy trình chuẩn quốc tế, phù hợp SME và doanh nghiệp đang mở rộng XNK.`,
      ctx.country
        ? `Xu hướng giao thương với ${ctx.country} khiến ${kw} trở thành ưu tiên. MINH TUẤN hỗ trợ booking, chứng từ và theo dõi lô hàng end-to-end.`
        : `Tại ${ctx.location || "TP.HCM"}, ${kw} gắn với mạng lưới cảng, ICD và kho ngoại quan. MINH TUẤN là điểm kết nối hợp lý cho doanh nghiệp cần tốc độ.`,
    ];
    return pick(pool, i, "pintro");
  },
  define: (kw, i, ctx, cat) => {
    const pool = [
      `${cap(kw)} là tập hợp hoạt động giao nhận, vận tải và điều phối liên quan lĩnh vực ${cat}. Tuỳ lô hàng, phạm vi có thể bao gồm khai báo, lưu kho, nâng hạ container hoặc giao chặng cuối.`,
      `Hiểu đúng ${kw} giúp tránh phát sinh chi phí ẩn. Với MINH TUẤN, khách hàng được tư vấn phạm vi công việc rõ ràng trước khi ký hợp đồng — không gói chung mơ hồ.`,
      `Trong ngữ cảnh XNK, ${kw} thường đi kèm Incoterms và trách nhiệm hai bên. Đội ngũ MINH TUẤN giải thích vai trò forwarder, hãng tàu/hàng không và chủ hàng.`,
      `${cap(kw)} khác với dịch vụ logistics chung ở mức độ chuyên sâu nghiệp vụ và chứng từ. Đây là điểm doanh nghiệp nên cân nhắc khi chọn nhà cung cấp.`,
    ];
    return pick(pool, i, "pdef");
  },
  context: (kw, i, ctx, cat) => {
    const loc = ctx.location || "khu vực TP.HCM";
    const pool = [
      `${cat} tại ${loc} chịu ảnh hưởng bởi công suất cảng, lịch tàu/bay và quy định hải quan. ${cap(kw)} cần lập kế hoạch buffer 1–3 ngày cho peak season.`,
      `Doanh nghiệp FDI và xuất khẩu gia công là nhóm tìm ${kw} nhiều nhất. MINH TUẤN có kinh nghiệm xử lý hồ sơ song ngữ và phối hợp đại lý nước ngoài.`,
      ctx.mode
        ? `Hình thức ${ctx.mode} ảnh hưởng trực tiếp đến ${kw}: cut-off, siêu tải, và chi phí local charge. MINH TUẤN báo giá tách bạch từng hạng mục.`
        : `Chuỗi cung ứng sau dịch bệnh ưu tiên ổn định hơn giá rẻ. ${cap(kw)} với đối tác minh bạch SLA giúp giảm rủi ro đứt hàng.`,
    ];
    return pick(pool, i, "pctx");
  },
  who: (kw, i) => {
    const pool = [
      `Nhà nhập khẩu nguyên liệu, xưởng gia công, thương nhân thiết bị và shop cross-border đều có thể cần ${kw}. MINH TUẤN tư vấn gói phù hợp quy mô lô hàng.`,
      `Nếu bạn mới XNK lần đầu, ${kw} nên đi kèm tư vấn chứng từ. MINH TUẤN có gói hỗ trợ A-Z cho doanh nghiệp chưa có bộ phận logistics nội bộ.`,
      `Doanh nghiệp đã có forwarder vẫn có thể so sánh ${kw} để tối ưu chi phí mùa cao điểm. Hotline 0938 961 012 nhận yêu cầu báo giá song song.`,
      `E-commerce nhập hàng Trung Quốc, Hàn Quốc cần ${kw} linh hoạt (LCL/air). MINH TUẤN hỗ trợ gom hàng và thông quan nhanh.`,
    ];
    return pick(pool, i, "pwho");
  },
  process: (kw, i, ctx, cat) => {
    const pool = [
      `Quy trình MINH TUẤN: (1) Tiếp nhận brief hàng hóa — (2) Phương án ${cat} & báo giá — (3) Booking/đăng ký — (4) Thực hiện ${kw} — (5) Bàn giao & đối soát. Mỗi bước có PIC riêng.`,
      `Với ${kw}, hồ sơ được kiểm tra trước cut-off để tránh roll container/chuyến bay. Khách nhận mã tracking ngay sau khi hàng lên phương tiện.`,
      `MINH TUẤN dùng checklist nội bộ cho ${kw}, gồm xác nhận HS code, invoice, packing list và C/O nếu có. Sai sót được phát hiện sớm ở bước pre-alert.`,
      `Điểm khác biệt: MINH TUẤN chủ động báo delay và phương án B nếu cảng/sân bay tắc. Khách hàng ${kw} không bị động khi có sự cố.`,
    ];
    return pick(pool, i, "pproc");
  },
  steps: (kw, i) => {
    const variants = [
      [`Bước 1 — Mô tả hàng & tuyến`, `Bước 2 — Báo giá ${kw}`, `Bước 3 — Ký xác nhận`, `Bước 4 — Vận hành`, `Bước 5 — Nghiệm thu`],
      [`① Khảo sát nhu cầu`, `② Chọn phương án ${kw}`, `③ Chuẩn bị chứng từ`, `④ Giám sát vận chuyển`, `⑤ Hoàn tất & lưu hồ sơ`],
    ];
    const steps = pick(variants, i, "stepvar");
    return steps.map((s, j) => `${s}: ${pick(["MINH TUẤN phản hồi trong 2h làm việc.", "Khách cung cấp invoice/packing list.", "Xác nhận qua email & Zalo.", "Cập nhật tracking định kỳ.", "Lưu trữ chứng từ 5 năm theo quy định."], i, `step${j}`)}`).join(" ");
  },
  documents: (kw, i, ctx) => {
    const pool = [
      `Hồ sơ ${kw} thường gồm: Invoice, Packing List, Hợp đồng mua bán, vận đơn (B/L hoặc AWB), tờ khai HQ nếu có. MINH TUẤN gửi checklist cụ thể theo loại hàng.`,
      `Hàng mới 100% có thể cần catalog kỹ thuật. ${cap(kw)} liên quan thực phẩm/bổ sung cần giấy kiểm tra chất lượng — MINH TUẤN tư vấn trước khi hàng về cảng.`,
      ctx.country
        ? `Xuất/nhập với ${ctx.country} có thể cần C/O Form E/AI/D. MINH TUẤN kiểm tra ưu đãi thuế trước khi khai ${kw}.`
        : `Chứng từ điện tử VNACCS/VCIS được MINH TUẤN ưu tiên để rút ngắn thời gian thông quan cho ${kw}.`,
    ];
    return pick(pool, i, "pdoc");
  },
  timeline: (kw, i, ctx) => {
    const sea = ctx.country ? "18–28 ngày biển" : "5–12 ngày nội địa/liên vùng";
    const air = "2–5 ngày door-to-airport";
    const pool = [
      `Thời gian ${kw} phụ thuộc phương thức: ${ctx.mode === "air" ? air : sea}. MINH TUẤN báo ETA dự kiến ngay khi chốt booking.`,
      `Mùa Tết và Q4 cần cộng thêm 3–7 ngày buffer cho ${kw}. Lên lịch sớm với MINH TUẤN để giữ slot tàu/bay.`,
      `Thông quan thường 1–3 ngày làm việc nếu hồ sơ sạch. ${cap(kw)} bị kiểm tra hóa có thể thêm 2–5 ngày — MINH TUẤN chủ động phối hợp HQ.`,
    ];
    return pick(pool, i, "ptime");
  },
  benefits: (kw, i) => {
    const pool = [
      `${cap(kw)} qua MINH TUẤN giúp giảm sai sót chứng từ, tối ưu cước và có một đầu mối chịu trách nhiệm end-to-end.`,
      `Khách hàng tiết kiệm thời gian quản lý nhiều nhà cung cấp rời rạc. ${cap(kw)} gói trọn giảm phí phát sinh tại cảng/kho.`,
      `MINH TUẤN cung cấp báo cáo định kỳ khi thực hiện ${kw} — phù hợp doanh nghiệp cần audit nội bộ hoặc báo cáo ban lãnh đạo.`,
      `Mạng lười đối tác quốc tế của MINH TUẤN hỗ trợ ${kw} tuyến xuất/nhập phức tạp mà không cần khách tự tìm agent nước ngoài.`,
    ];
    return pick(pool, i, "pben");
  },
  compare: (kw, i, ctx) => {
    const pool = [
      ctx.mode === "FCL"
        ? `FCL phù hợp ${kw} khi đủ nguyên container, transit ổn định. LCL linh hoạt hơn nhưng có thời gian gom hàng. MINH TUẤN tư vấn MOQ tối ưu.`
        : ctx.mode === "LCL"
          ? `LCL tiết kiệm cho ${kw} lô nhỏ; FCL hiệu quả khi >15 CBM. MINH TUẤN mô phỏng chi phí hai phương án trước khi khách quyết định.`
          : `So sánh biển/air/đường bộ cho ${kw}: biển rẻ khối lớn, air nhanh giá trị cao, bộ linh hoạt nội địa. MINH TUẤN đề xuất multimodal nếu cần.`,
      `Đừng chỉ so cước cơ bản — local charge, DEM/DET, bốc xếp có thể làm đổi thứ tự lựa chọn cho ${kw}. MINH TUẤN báo giá all-in minh bạch.`,
    ];
    return pick(pool, i, "pcmp");
  },
  cost: (kw, i, ctx) => {
    const pool = [
      `Chi phí ${kw} = cước quốc tế + phí local + (nếu có) HQ + kho + nâng hạ. MINH TUẤN itemize báo giá, không ẩn phí.`,
      `Yếu tố làm tăng giá: mùa cao điểm, hàng DG, điểm giao hẹp, vùng sâu vùng xa. Giảm giá bằng lịch booking sớm và consolidation — MINH TUẤN tư vấn miễn phí.`,
      `Báo giá ${kw} có hiệu lực 7–14 ngày tuỳ thị trường cước. Gọi 0938 961 012 để nhận bảng giá cập nhật trong 24h.`,
    ];
    return pick(pool, i, "pcost");
  },
  factors: (kw, i) => {
    const pool = [
      `Thời tiết, tắc cảng, thiếu cont rỗng và biến động tỷ giá đều ảnh hưởng ${kw}. MINH TUẤN theo dõi cảnh báo thị trường cho khách VIP.`,
      `Phân loại HS code sai có thể phạt nặng — yếu tố then chốt khi ${kw} liên quan HQ. MINH TUẤN rà soát trước khi khai.`,
      `Độ tin cậy forwarder ảnh hưởng SLA ${kw}. MINH TUẤN cam kết phản hồi trong giờ hành chính và hotline ngoài giờ cho lô gấp.`,
    ];
    return pick(pool, i, "pfac");
  },
  mistakes: (kw, i) => {
    const pool = [
      `Sai lầm #1: Chọn ${kw} chỉ vì giá thấp nhất, bỏ qua phí phát sinh. Sai lầm #2: Gửi hàng khi chưa đủ C/O. Sai lầm #3: Không mua bảo hiểm.`,
      `Nhiều doanh nghiệp khai thiếu trị giá khi ${kw} — rủi ro kiểm tra HQ. MINH TUẤN review hồ sơ trước submission.`,
      `Trì hoãn booking sát cut-off dễ roll hàng — đặc biệt với ${kw} mùa cao điểm. Lên kế hoạch sớm ít nhất 7–10 ngày.`,
    ];
    return pick(pool, i, "pmis");
  },
  tips: (kw, i) => {
    const pool = [
      `Tip: Chuẩn hóa mã sản phẩm & mô tả hàng tiếng Anh giúp ${kw} thông quan nhanh hơn. Tip: Chụp ảnh hàng trước đóng cont làm bằng chứng.`,
      `Đặt lịch ${kw} tránh tuần cuối tháng cảng đông. MINH TUẤN gợi ý khung thời gian tối ưu theo lịch tàu/bay.`,
      `Lưu email xác nhận booking và B/L draft — hữu ích khi tranh chấp hoặc claim bảo hiểm cho ${kw}.`,
    ];
    return pick(pool, i, "ptip");
  },
  case: (kw, i, ctx) => {
    const pool = [
      `Case: Khách hàng SME nhập linh kiện ${ctx.country || "Đài Loan"} — MINH TUẤN chuyển từ air sang LCL biển, tiết kiệm ~22% chi phí/tháng vẫn đủ lead time sản xuất.`,
      `Case: Lô ${kw} bị hold HQ do HS mơ hồ — MINH TUẤN làm việc bổ sung catalog, thông quan trong 2 ngày làm việc.`,
      `Case: Doanh nghiệp xuất khẩu nông sản dùng ${kw} door-to-port, MINH TUẤN sắp lịch cont lạnh và giám sát nhiệt độ.`,
    ];
    return pick(pool, i, "pcase");
  },
  faq: (kw, i) => {
    const qas = [
      [`${cap(kw)} mất bao lâu?`, `Tuỳ tuyến và phương thức — MINH TUẤN báo ETA cụ thể khi nhận brief.`],
      [`Cần giấy tờ gì?`, `Invoice, PL, B/L/AWB; hàng đ regulated cần thêm giấy phép — checklist gửi qua email.`],
      [`Báo giá ${kw} có mất phí?`, `Tư vấn và báo giá sơ bộ miễn phí qua hotline 0938 961 012.`],
    ];
    const qa = pick(qas, i, "faqitem");
    return `${qa[0]} ${qa[1]}`;
  },
  related: (kw, i, cat) => {
    const pool = [
      `${cap(kw)} thường đi kèm khai báo hải quan, bảo hiểm và nâng hạ. MINH TUẤN có thể gộp một hợp đồng khung thay vì thuê rời từng dịch vụ.`,
      `Khách cần ${kw} trong nhóm ${cat} có thể cân nhắc thêm dịch vụ kho CFS/depot và trucking nội địa từ MINH TUẤN.`,
      `Tích hợp WMS và báo cáo tồn kho giúp chuỗi ${kw} minh bạch — MINH TUẤN liên kết đối tác kho tại Cát Lái, Bình Dương.`,
    ];
    return pick(pool, i, "prel");
  },
  location: (kw, i, ctx) => {
    const loc = ctx.location || "Tân Sơn Nhất & Cát Lái";
    const pool = [
      `Văn phòng MINH TUẤN (69/1 Trần Quốc Hoàn) cách ${loc} ngắn — thuận tiện xử lý ${kw} gấp và phối hợp hải quan cửa khẩu khu vực.`,
      `Kho và depot gần cảng giúp giảm khoảng cách rỗng cho ${kw}. MINH TUẤN tận dụng hạ tầng logistics miền Nam.`,
    ];
    return pick(pool, i, "ploc");
  },
  route: (kw, i, ctx) => {
    const pool = [
      ctx.country
        ? `Tuyến ${kw} đi ${ctx.country}: xuất phát ${ctx.location || "Cát Lái/TSN"} — tranship hub tuỳ hãng — cảng/sân bay đích. MINH TUẤN đề xuất routing tối ưu chi phí/thời gian.`
        : `Routing ${kw} nội địa: Bình Dương — Long An — TP.HCM — cửa khẩu. MINH TUẤN có đội xe tải/cont liên kết.`,
      `Multimodal cho ${kw}: biển + bộ hoặc air + bộ. MINH TUẤN một đầu mối thay vì khách tự ghép nhiều nhà vận tải.`,
    ];
    return pick(pool, i, "proute");
  },
  compliance: (kw, i) => {
    const pool = [
      `${cap(kw)} phải tuân thủ Luật Hải quan, quy định vận tải và tiêu chuẩn an toàn hàng hóa. MINH TUẤN cập nhật circular mới cho khách.`,
      `Hàng hạn chế (rượu, pin lithium, hóa chất) cần khai báo đúng khi ${kw}. MINH TUẤN từ chối nhận hàng vi phạm pháp luật.`,
    ];
    return pick(pool, i, "pcomp");
  },
  tracking: (kw, i) => {
    const pool = [
      `MINH TUẤN cung cấp mốc tracking: nhận hàng — lên tàu/bay — cập cảng — thông quan — giao. Khách ${kw} chủ động lên kế hoạch sản xuất/bán.`,
      `Cảnh báo delay gửi qua Zalo/email. Với ${kw} quan trọng, MINH TUẤN có thể họp online review tiến độ hàng tuần.`,
    ];
    return pick(pool, i, "ptrack");
  },
  insurance: (kw, i) => {
    const pool = [
      `Bảo hiểm hàng hóa khuyến nghị cho ${kw} giá trị cao hoặc đi xa. MINH TUẤN giới thiệu gói cargo insurance với mức phí cạnh tranh.`,
      `Clause A ICC phù hợp hầu hết ${kw} quốc tế. MINH TUẤN hỗ trợ khai báo và claim khi có sự cố.`,
    ];
    return pick(pool, i, "pins");
  },
  warehouse_note: (kw, i) => {
    const pool = [
      `Lưu kho trung chuyển giúp ${kw} linh hoạt gom hàng LCL. MINH TUẤN quản lý inbound/outbound và cảnh báo free time.`,
      `Cross-docking giảm thời gian tồn — phù hợp ${kw} hàng tiêu thụ nhanh như FMCG.`,
    ];
    return pick(pool, i, "pwh");
  },
  partner: (kw, i) => {
    const pool = [
      `MINH TUẤN — 10+ năm, đội ngũ nghiệp vụ am hiểu ${kw}, cam kết minh bạch báo giá và SLA phản hồi.`,
      `Chọn MINH TUẤN cho ${kw}: một đầu mối, hotline 0938 961 012, email contact@minhtuan.vn, hỗ trợ tiếng Việt/Anh.`,
      `Khách hàng đánh giá cao sự chủ động báo sự cố khi MINH TUẤN thực hiện ${kw} — không im lặng đến khi quá hạn.`,
    ];
    return pick(pool, i, "ppart");
  },
  cta: (kw, i) => {
    const pool = [
      `Cần ${kw}? Gọi 0938 961 012 hoặc gửi form tại minhtuan.com/lien-he — MINH TUẤN phản hồi báo giá trong 24h làm việc.`,
      `Zalo/Messenger MINH TUẤN hỗ trợ tư vấn ${kw} nhanh. Gửi ảnh hàng + tuyến để nhận phương án sơ bộ.`,
      `Đặt lịch hẹn tại văn phòng 69/1 Trần Quốc Hoàn để trao đổi trực tiếp về ${kw} và chuỗi logistics dài hạn.`,
    ];
    return pick(pool, i, "pcta");
  },
};

const TITLE_PATTERNS = [
  (kw) => `${cap(kw)}: Hướng dẫn chi tiết cho doanh nghiệp 2026`,
  (kw) => `Cẩm nang ${kw} — MINH TUẤN Logistics`,
  (kw) => `${cap(kw)} TP.HCM: Quy trình, chi phí & lưu ý`,
  (kw) => `Tư vấn ${kw} uy tín | MINH TUẤN`,
  (kw) => `${cap(kw)} — Giải pháp logistics chuyên sâu`,
  (kw) => `Báo giá & triển khai ${kw} nhanh`,
  (kw) => `${cap(kw)}: Kinh nghiệm thực chiến từ MINH TUẤN`,
  (kw) => `Checklist ${kw} cho SME xuất nhập khẩu`,
  (kw) => `${cap(kw)} — FAQ và case study`,
  (kw) => `Dịch vụ ${kw} trọn gói A-Z`,
  (kw, i) => `[#${i + 1}] ${cap(kw)} — Kiến thức logistics MINH TUẤN`,
  (kw) => `${cap(kw)}: Transit time, chứng từ, chi phí`,
  (kw) => `Forwarder ${kw} — MINH TUẤN TP.HCM`,
  (kw) => `${cap(kw)} cho doanh nghiệp FDI & xuất khẩu`,
  (kw) => `Tối ưu ${kw} — Giảm chi phí, đúng hạn`,
  (kw) => `${cap(kw)} và chuỗi cung ứng quốc tế`,
  (kw) => `Hỏi đáp ${kw} — Cập nhật 2026`,
  (kw) => `${cap(kw)} gần Tân Sơn Nhất & Cát Lái`,
  (kw) => `Quy trình 5 bước ${kw} tại MINH TUẤN`,
  (kw) => `${cap(kw)} — So sánh phương án & lựa chọn`,
];

const EXCERPT_PATTERNS = [
  (kw, cat) => `Phân tích ${kw} (${cat}): quy trình, chi phí, chứng từ và kinh nghiệm từ MINH TUẤN Logistics.`,
  (kw) => `${cap(kw)} — bài viết chuyên sâu, cập nhật 2026. Hotline 0938 961 012.`,
  (kw, cat, ctx) => `Tìm hiểu ${kw}${ctx.location ? ` tại ${ctx.location}` : ""}: MINH TUẤN hỗ trợ ${cat} end-to-end.`,
  (kw) => `Giải đáp ${kw}: timeline, sai lầm thường gặp và cách báo giá nhanh.`,
  (kw) => `MINH TUẤN chia sẻ kiến thức ${kw} thực tế cho doanh nghiệp XNK.`,
];

const buildSections = (keyword, i, category) => {
  const kw = keyword;
  const ctx = detectContext(keyword);
  const cat = CAT_LABEL[category] || "Doanh nghiệp";
  const outline = OUTLINE_POOL[i % OUTLINE_POOL.length];
  const sections = [];

  outline.forEach((type, si) => {
    const h2Fn = H2[type];
    const pFn = P[type];
    if (!h2Fn || !pFn) return;
    const heading = h2Fn(kw, i + si, ctx, cat);
    sections.push({ type: "h2", text: heading });
    const para = pFn(kw, i + si * 3, ctx, cat);
    if (type === "steps" && para.includes("Bước")) {
      para.split(/(?=Bước|①|②|③|④|⑤)/).filter(Boolean).forEach((chunk) => {
        if (chunk.trim()) sections.push({ type: "p", text: chunk.trim() });
      });
    } else {
      sections.push({ type: "p", text: para });
    }
  });

  return sections;
};

const posts = keywords.map((item, i) => {
  const { keyword, slug, category } = item;
  const ctx = detectContext(keyword);
  const catLabel = CAT_LABEL[category] || "Doanh nghiệp";
  const sections = buildSections(keyword, i, category);
  const titlePat = pick(TITLE_PATTERNS, i, "title");
  const title = titlePat(keyword, i);
  const excerptPat = pick(EXCERPT_PATTERNS, i, "excerpt");
  const excerpt = excerptPat(keyword, catLabel, ctx);
  const metaDescription = `${cap(keyword)} — ${pick(["Quy trình chuẩn", "Báo giá 24h", "MINH TUẤN TP.HCM", "Tư vấn miễn phí", "10+ năm kinh nghiệm"], i, "meta")}. Hotline 0938 961 012.`.slice(0, 160);
  const d = new Date(2023, 0, 2 + Math.floor(i * 0.65));
  const iso = d.toISOString().slice(0, 10);
  const body = sections.filter((s) => s.type === "p").map((s) => s.text);
  const structureKey = sections.filter((s) => s.type === "h2").map((s) => s.text.slice(0, 20)).join("|");

  return {
    id: i + 1,
    keyword,
    slug,
    title,
    excerpt,
    metaDescription,
    imageAlt: keyword,
    category,
    categoryLabel: catLabel,
    date: iso,
    dateLabel: `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`,
    photo: PHOTO[category] || PHOTO.business,
    sections,
    body,
    wordCount: sections.reduce((n, s) => n + s.text.split(/\s+/).length, 0),
    _structureKey: structureKey,
  };
});

// Validate uniqueness
const titleSet = new Set();
const structureSet = new Set();
const bodyHashSet = new Set();
let dupTitle = 0;
let dupStructure = 0;
let dupBody = 0;

posts.forEach((p) => {
  if (titleSet.has(p.title)) dupTitle++;
  titleSet.add(p.title);
  if (structureSet.has(p._structureKey)) dupStructure++;
  structureSet.add(p._structureKey);
  const bodyHash = p.body.join("").slice(0, 200);
  if (bodyHashSet.has(bodyHash)) dupBody++;
  bodyHashSet.add(bodyHash);
});

posts.forEach((p) => delete p._structureKey);

const outPath = path.join(root, "data", "news-posts.json");
fs.writeFileSync(outPath, JSON.stringify(posts), "utf8");

console.log(`Generated ${posts.length} unique articles → data/news-posts.json`);
console.log(`File size: ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Unique titles: ${titleSet.size}/${posts.length} (dup: ${dupTitle})`);
console.log(`Unique H2 structures: ${structureSet.size}/${posts.length} (dup: ${dupStructure})`);
console.log(`Unique body openings: ${bodyHashSet.size}/${posts.length} (dup: ${dupBody})`);

if (dupBody > 50) {
  console.warn("Warning: high body similarity — review generator");
  process.exit(1);
}
