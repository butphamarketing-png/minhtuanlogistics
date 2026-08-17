/**
 * Cluster 1000 new keywords into SEO build waves.
 * Output: data/keyword-build-plan.json
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const kws = JSON.parse(fs.readFileSync(path.join(root, "data", "keywords-1000-new.json"), "utf8"));

const CLUSTERS = [
  {
    id: "chuyen-tuyen-tq",
    name: "Chuyên tuyến Trung Quốc",
    pillar: "cước chuyên tuyến Trung Quốc 2026",
    service: "/dich-vu/van-chuyen-duong-bo",
    test: (k) =>
      /chuyên tuyến|cước.*(trung quốc|tq)|ship hàng trung|bảng giá ship trung|gom hàng|cước kg|cước khối|cước xe trung|cước bay trung|cước biển trung|transit time trung|lịch tàu trung|express trung|door to door trung|vận chuyển trung quốc door|ddp|dap|tracking hàng trung|mã vận đơn trung|hàng trung quốc bị giữ|hàng trung quốc bị mất|rút hàng trung|giao hàng trung|đóng gỗ hàng trung|đóng pallet hàng trung|kiểm hàng trung|kho nhận hàng trung|kho trung chuyển|bảo hiểm hàng trung|video unbox|chụp ảnh hàng trung|forwarder trung|công ty ship|đơn vị vận chuyển trung|nhận hàng trung|hàng quá khổ trung|máy móc trung|khuôn mẫu trung|hàng mẫu trung|chuyển phát nhanh trung|wechat|alibaba|hàng lẻ trung quốc|làm hồ sơ nhập hàng trung|kiểm tra chất lượng hàng trung/i.test(
        k
      ) && !/order|1688|taobao|pinduoduo|temu|xưởng|oem|odm|mua hộ|nguồn hàng/i.test(k),
  },
  {
    id: "order-tq",
    name: "Order / mua hộ Trung Quốc",
    pillar: "công ty order hàng Trung Quốc",
    service: "/dich-vu/xuat-nhap-khau",
    test: (k) =>
      /order|1688|taobao|pinduoduo|temu|mua hộ|nguồn hàng|tìm xưởng|đặt hàng xưởng|oem |odm |gia công hàng trung|in bao bì trung|thanh toán hộ|chuyển khoản trung|tỷ giá order|đặt cọc order|rủi ro order|khiếu nại order|đổi trả hàng trung/i.test(
        k
      ),
  },
  {
    id: "warehouse",
    name: "Cho thuê kho / CFS / ngoại quan",
    pillar: "cho thuê kho logistics",
    service: "/dich-vu/kho-bai-logistics",
    test: (k) =>
      /thuê kho|nhà xưởng có kho|diện tích kho|kho logistics|kho cfs|kho ngoại quan|kho lạnh|kho mát|kho khô|kho cao |kho nền|kho thông|kho tránh|kho đạt|kho có |kho 3pl|cold storage|kho dược|kho thực phẩm|kho hóa chất|kho hàng nguy|kho dg|bonded|cross docking|transshipment|rút ruột|đóng hàng xuất|kho năng lượng/i.test(
        k
      ),
  },
  {
    id: "fulfillment",
    name: "Fulfillment / 3PL / TMĐT",
    pillar: "dịch vụ 3PL Việt Nam",
    service: "/dich-vu/kho-bai-logistics",
    test: (k) =>
      /fulfillment|3pl|tmđt|shopee|lazada|tiktok|sendo|tiki|wms|pick pack|đóng gói hàng|dán tem|đồng bộ|tồn kho|giao hàng (ninja|ghtk|ghn|j&t)|xử lý đơn|xử lý hoàn/i.test(
        k
      ),
  },
  {
    id: "customs",
    name: "Hải quan / chứng từ / thuế",
    pillar: "dịch vụ khai thuê hải quan trọn gói",
    service: "/dich-vu/xuat-nhap-khau",
    test: (k) =>
      /hải quan|thông quan|tờ khai|vnaccs|luồng |kiểm hóa|hs code|mã hs|c\/o|eco chứng|thuế|incoterm|chứng từ|giấy phép|kiểm dịch|công bố|ruling|e-permit|ủy thác|loại hình|kho bảo thuế|gtgt|tiêu thụ đặc biệt|phytosanitary|health certificate|fumigation|inspection|commercial invoice|packing list|certificate of origin|insurance certificate|beneficiary certificate|l\/c |t\/t |hợp đồng ngoại|trị giá|ấn định|khiếu nại quyết định|scan hải|máy soi|vi phạm hải|tái xuất|tái nhập|tạm nhập|kiểm tra chất lượng nhà nước|kiểm tra chuyên ngành|royalty|related party|chuyển giá/i.test(
        k
      ),
  },
  {
    id: "sea",
    name: "Đường biển FCL/LCL / cảng",
    pillar: "cước tàu biển Việt Nam",
    service: "/dich-vu/van-chuyen-duong-bien",
    test: (k) =>
      /fcl|lcl|cảng|container|tàu|booking|bill of lading|house bill|master bill|telex|seaway|demurrage|detention|thc |ams|ens|feeder|cái mép|cát lái|icd |hãng tàu|maersk|msc |cma |evergreen|cosco|yang ming|all in|local charge|destination charge|origin charge|vgm|solas|verified gross|eir |d\/o|nâng hạ|hạ bãi|vệ sinh cont|phí lưu|phí doc|stuffing|giám sát đóng hàng|consolidation|hàng lẻ bị delay|transhipment|cbm|ispm|low sulphur|phí cân cầu|phí sửa chữa cont/i.test(
        k
      ),
  },
  {
    id: "air",
    name: "Hàng không / courier",
    pillar: "cước air cargo Việt Nam",
    service: "/dich-vu/van-chuyen-hang-khong",
    test: (k) =>
      /air cargo|air freight|hàng không|mawb|hawb|awb |tân sơn nhất cargo|nội bài cargo|dhl|fedex|ups|tnt|courier|chuyển phát nhanh|gửi hàng mẫu quốc tế|iata|lithium battery|charter máy bay|belly cargo|volumetric|chargeable|1:167|1:500/i.test(
        k
      ),
  },
  {
    id: "road",
    name: "Đường bộ / cửa khẩu / kéo cont",
    pillar: "vận tải container nội địa",
    service: "/dich-vu/van-chuyen-duong-bo",
    test: (k) =>
      /cửa khẩu|kéo cont|đầu kéo|đường bộ|nội địa|liên tỉnh|xe tải|xe \d|xe mooc|xe lạnh|ghép hàng|bắc nam|siêu trường|siêu trọng|quá khổ|cross border|cbtl|asean|hộ tống|máy cnc|dây chuyền|turbine|transformator|phí cầu đường/i.test(
        k
      ),
  },
  {
    id: "cn-cities",
    name: "Tuyến thành phố Trung Quốc",
    pillar: "vận chuyển hàng Quảng Châu về Việt Nam",
    service: "/dich-vu/van-chuyen-duong-bo",
    test: (k) =>
      /quảng châu|nghĩa ô|thâm quyến|thượng hải|đông quản|phật sơn|hàng châu|ninh ba|ôn châu|phúc châu|hạ môn|thanh đảo|côn minh|nam ninh|bằng tường|đông hưng|yantian|shekou/i.test(
        k
      ),
  },
  {
    id: "kr-jp-us",
    name: "Hàn / Nhật / Mỹ",
    pillar: "order hàng Hàn Quốc Coupang",
    service: "/dich-vu/van-chuyen-duong-bien",
    test: (k) =>
      /hàn quốc|nhật|mỹ|coupang|gmarket|k-beauty|skincare hàn|rakuten|mercari|yahoo auction|amazon|best buy|walmart|busan|incheon|seoul|gyeonggi|tokyo|osaka|yokohama|nagoya|los angeles|long beach|new york|chicago/i.test(
        k
      ),
  },
  {
    id: "commodity",
    name: "Ngành hàng XNK",
    pillar: "nhập khẩu điện tử từ Trung Quốc",
    service: "/dich-vu/xuat-nhap-khau",
    test: (k) =>
      /nhập khẩu|xuất khẩu|hs code |thuế nhập khẩu|thủ tục nhập|đóng gói .+ xuất|bảo hiểm vận chuyển|may mặc|giày dép|điện tử|nội thất|máy móc|nông sản|thủy sản|dược phẩm|mỹ phẩm|phụ tùng|thép|hóa chất|cà phê|hạt điều|gạo|cao su|gỗ /i.test(
        k
      ),
  },
  {
    id: "local",
    name: "Local SEO / KCN / quận huyện",
    pillar: "công ty logistics gần Tân Sơn Nhất",
    service: "/gioi-thieu/cong-ty-logistics-tp-hcm",
    test: (k) =>
      /công ty logistics|forwarder uy tín|forwarder giá rẻ|đối tác logistics|logistics cho |giao nhận |báo giá logistics|kcn |thuận an|dĩ an|tân uyên|bến cát|biên hòa|nhơn trạch|long thành|trảng bom|bến lức|đức hòa|cần giuộc|nhà bè|bình chánh|hóc môn|củ chi|quận |gò vấp|tân phú|phú nhuận|yên phong|quế võ|từ sơn|sóng thần|amata|long hậu|hiệp phước|đình vũ|vsip|tư vấn chọn forwarder|giảm cước vận chuyển quốc tế/i.test(
        k
      ),
  },
  {
    id: "knowledge",
    name: "FAQ / kiến thức logistics",
    pillar: "phân biệt FCL và LCL",
    service: "/dich-vu",
    test: (k) =>
      /là gì|như thế nào|bao lâu|có được|có cần|nên chọn|nên đi|khác |cách tính|checklist|so sánh|hidden fee|phí phát sinh|green logistics|bền vững|tracking container|edi |inttra|cargosmart|nvocc|fiata|scac|imo |baf |pss |gri |war risk|ets eu|carbon|giám định|vinacontrol|sgs |intertek|shortage|damage cargo|bồi thường|hàng nhái|hàng hư|ispm 15|cân hàng trước|đo cbm|lien hàng hóa|quyền giữ hàng|hợp đồng forwarding|bảo hiểm trách nhiệm forwarder/i.test(
        k
      ),
  },
];

const MONEY =
  /giá rẻ|báo giá|bảng giá|cước |thuê kho|order |fulfillment|trọn gói|uy tín|all in|công ty (order|ship|3pl|logistics)|khai thuê|door to door/i;

function clusterOf(keyword) {
  for (const c of CLUSTERS) {
    if (c.test(keyword)) return c;
  }
  return {
    id: "business-other",
    name: "Doanh nghiệp / còn lại",
    pillar: "tối ưu chi phí xuất nhập khẩu",
    service: "/lien-he",
  };
}

function articleType(item, cluster) {
  const k = item.keyword;
  if (k.toLowerCase() === String(cluster.pillar || "").toLowerCase()) return "pillar";
  if (
    MONEY.test(k) &&
    (cluster.id === "chuyen-tuyen-tq" ||
      cluster.id === "order-tq" ||
      cluster.id === "warehouse" ||
      cluster.id === "fulfillment" ||
      cluster.id === "customs")
  )
    return "money";
  if (cluster.id === "knowledge") return "faq";
  if (cluster.id === "local" || cluster.id === "cn-cities" || cluster.id === "commodity") return "longtail";
  return "cluster";
}

function isP0(keyword, clusterId, type) {
  if (type === "pillar") return true;
  const k = keyword.toLowerCase();
  if (clusterId === "chuyen-tuyen-tq") {
    return /cước kg|cước khối|cước bay|cước biển|cước xe|forwarder trung|công ty ship|bảng giá ship|door to door|fcl trung|lcl trung|chuyên tuyến đường/i.test(
      k
    );
  }
  if (clusterId === "order-tq") {
    return /công ty order|dịch vụ order hàng trung|order hàng trung quốc (cho shop|không cần|sỉ)|phí dịch vụ order|cách tính cước order/i.test(
      k
    );
  }
  if (clusterId === "warehouse") {
    return /cho thuê kho logistics|cho thuê kho chứa/i.test(k);
  }
  if (clusterId === "fulfillment") {
    return /dịch vụ 3pl việt nam|công ty 3pl tp\.hcm|fulfillment (shopee|lazada|tiktok shop) giá rẻ/i.test(k);
  }
  if (clusterId === "customs") {
    return /khai thuê hải quan trọn gói|công ty khai hải quan uy tín/i.test(k);
  }
  return false;
}

function waveOf(clusterId, type, keyword) {
  if (isP0(keyword, clusterId, type)) return 1;
  if (clusterId === "chuyen-tuyen-tq" || clusterId === "order-tq") return 2;
  if (clusterId === "warehouse" || clusterId === "fulfillment") return 3;
  if (clusterId === "customs") return 4;
  if (clusterId === "sea") return 5;
  if (clusterId === "cn-cities" || clusterId === "road") return 6;
  if (clusterId === "kr-jp-us" || clusterId === "air") return 7;
  if (clusterId === "local") return 8;
  if (clusterId === "commodity" || clusterId === "knowledge") return 9;
  return 10;
}

const TYPE_SPEC = {
  pillar: { words: 2000, h2: 8, images: 5 },
  money: { words: 1500, h2: 7, images: 5 },
  cluster: { words: 1200, h2: 6, images: 5 },
  longtail: { words: 1200, h2: 6, images: 5 },
  faq: { words: 1200, h2: 6, images: 5 },
};

const H2_BY_TYPE = {
  pillar: [
    "{kw} là gì — phạm vi dịch vụ Minh Tuấn",
    "Quy trình {kw} từng bước",
    "Bảng giá / cấu phần chi phí 2026",
    "Thời gian — transit time và cut-off",
    "Chứng từ và rủi ro thường gặp",
    "So sánh phương án (biển / bộ / bay hoặc FCL / LCL)",
    "{kw} theo địa bàn then chốt",
    "Khi nào nên chọn Minh Tuấn — CTA báo giá",
  ],
  money: [
    "{kw} — ai nên dùng",
    "Cấu phần giá và cách báo giá 24h",
    "Quy trình triển khai",
    "Mốc thời gian thực tế",
    "Rủi ro / phụ phí ẩn",
    "Case doanh nghiệp SME",
    "Liên hệ báo giá — Zalo 0938 961 012",
  ],
  cluster: [
    "{kw} trong hệ thống dịch vụ Minh Tuấn",
    "Điều kiện áp dụng",
    "Quy trình và chứng từ",
    "Chi phí và thời gian",
    "Lỗi thường gặp",
    "Bước tiếp theo / báo giá",
  ],
  longtail: [
    "{kw} — nhu cầu địa phương / ngành hàng",
    "Lợi thế vị trí hoặc tuyến",
    "Quy trình nhận — xử lý — giao",
    "Chi phí tham khảo 2026",
    "Lưu ý pháp lý / PCCC / hải quan",
    "Đặt lịch khảo sát",
  ],
  faq: [
    "Trả lời nhanh: {kw}",
    "Giải thích chi tiết cho doanh nghiệp",
    "Ví dụ số liệu / mốc thời gian",
    "Khi nào cách làm này không đúng",
    "Checklist tự kiểm",
    "Minh Tuấn hỗ trợ thế nào",
  ],
};

const items = kws.map((kw, i) => {
  const cluster = clusterOf(kw.keyword);
  const type = articleType(kw, cluster);
  const spec = TYPE_SPEC[type];
  const wave = waveOf(cluster.id, type, kw.keyword);
  return {
    index: i + 1,
    keyword: kw.keyword,
    slug: kw.slug,
    category: kw.category,
    clusterId: cluster.id,
    clusterName: cluster.name,
    pillarKeyword: cluster.pillar,
    serviceUrl: cluster.service,
    type,
    wave,
    minWords: spec.words,
    minH2: spec.h2,
    minImages: spec.images,
    h2Blueprint: H2_BY_TYPE[type].map((h) => h.replace(/\{kw\}/g, kw.keyword)),
    titlePattern: `${kw.keyword} 2026 — … | MINH TUẤN`,
  };
});

const byWave = {};
const byCluster = {};
const byType = {};
items.forEach((it) => {
  byWave[it.wave] = (byWave[it.wave] || 0) + 1;
  byCluster[it.clusterId] = byCluster[it.clusterId] || { name: it.clusterName, count: 0, types: {} };
  byCluster[it.clusterId].count++;
  byCluster[it.clusterId].types[it.type] = (byCluster[it.clusterId].types[it.type] || 0) + 1;
  byType[it.type] = (byType[it.type] || 0) + 1;
});

const WAVE_META = {
  1: { name: "P0 — bài trụ & money", focus: "Pillar + cước/order/kho/3PL/hải quan then chốt", pace: "8–10 bài/ngày", days: 4 },
  2: { name: "P1 — tuyến TQ & order", focus: "Cluster chuyên tuyến + order 1688/Taobao còn lại", pace: "12–15 bài/ngày", days: 8 },
  3: { name: "P1 — kho & fulfillment", focus: "Thuê kho quận/huyện + Shopee/Lazada/TikTok", pace: "12–15 bài/ngày", days: 8 },
  4: { name: "P2 — hải quan", focus: "Tờ khai, HS, C/O, thuế, Incoterms", pace: "15 bài/ngày", days: 7 },
  5: { name: "P2 — biển / cảng", focus: "FCL/LCL, Cát Lái, Cái Mép, phụ phí", pace: "15 bài/ngày", days: 8 },
  6: { name: "P2 — cửa khẩu & city TQ", focus: "Lào Cai/Lạng Sơn + Quảng Châu/Nghĩa Ô", pace: "15 bài/ngày", days: 8 },
  7: { name: "P3 — Hàn Nhật Mỹ & air", focus: "Coupang/Amazon + air cargo/courier", pace: "15 bài/ngày", days: 6 },
  8: { name: "P3 — local SEO", focus: "KCN, quận huyện, giao nhận địa phương", pace: "20 bài/ngày", days: 4 },
  9: { name: "P4 — ngành hàng & FAQ", focus: "XNK theo commodity + câu hỏi search", pace: "20 bài/ngày", days: 4 },
  10: { name: "P4 — phủ còn lại", focus: "Keyword chưa vào 13 cụm trên", pace: "20 bài/ngày", days: 2 },
};

const waves = Object.keys(WAVE_META)
  .map(Number)
  .sort((a, b) => a - b)
  .map((w) => ({
    wave: w,
    ...WAVE_META[w],
    articles: byWave[w] || 0,
    calendarDays: WAVE_META[w].days,
  }));

const plan = {
  generatedAt: "2026-08-17",
  source: "data/keywords-1000-new.json",
  total: items.length,
  seoGate: {
    canPublish: true,
    minScore: 85,
    analyzer: "lib/seo-checklist.js",
    critical: [
      "Từ khoá ở ĐẦU title SEO",
      "Từ khoá trong meta 120–160 ký tự",
      "Slug chứa từ khoá, ≤ 75 ký tự",
      "Từ khoá trong 10% nội dung đầu",
      "Từ khoá trong ≥ 1 H2",
      "≥ 1200 từ (tối thiểu cứng 600)",
      "≥ 5 ảnh, mỗi alt chứa từ khoá",
      "≥ 2 H2",
      "≥ 3 internal link + ≥ 1 external",
      "Mật độ từ khoá 0.5–2.5%",
      "Title có số (2026 / số ngày / số bước)",
      "Từ khoá chưa dùng ở bài khác",
    ],
    internalLinkRule:
      "Mỗi bài: 1 link pillar cụm + 2 sibling cùng wave + 1 trang dịch vụ + /lien-he",
    externalLinkDefault: ["https://www.customs.gov.vn/", "https://zalo.me/0938961012"],
  },
  summary: { byWave, byType, byCluster },
  waves,
  items,
};

fs.writeFileSync(path.join(root, "data", "keyword-build-plan.json"), JSON.stringify(plan, null, 2), "utf8");

const totalDays = waves.reduce((n, w) => n + (w.articles ? w.calendarDays : 0), 0);
console.log("total", items.length);
console.log("byType", byType);
console.log("byWave", byWave);
console.log(
  "clusters",
  Object.fromEntries(Object.entries(byCluster).map(([id, v]) => [id, v.count]))
);
console.log("wave articles", waves.map((w) => `${w.wave}:${w.articles}`).join(" "));
console.log("calendar days", totalDays);
console.log("other leftover", (byCluster["business-other"] || {}).count || 0);
