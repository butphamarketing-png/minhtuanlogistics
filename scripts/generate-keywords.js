/**
 * Generates 1000 unique logistics SEO keywords (Vietnamese).
 * Output: data/keywords-1000.json, data/keywords-list.txt
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "data");

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const SERVICES = [
  "vận chuyển hàng hóa", "xuất nhập khẩu", "khai báo hải quan", "thông quan hàng hóa",
  "freight forwarding", "giao nhận vận tải", "vận chuyển đường biển", "vận chuyển đường bộ",
  "vận chuyển hàng không", "vận tải container", "logistics", "dịch vụ logistics",
  "ủy thác xuất nhập khẩu", "kho bãi logistics", "warehousing", "đại lý giao nhận",
  "booking container", "vận chuyển FCL", "vận chuyển LCL", "vận chuyển door to door",
  "vận chuyển hàng lẻ", "vận chuyển nguyên container", "vận tải nội địa", "vận tải liên tỉnh",
  "đầu kéo container", "giao hàng chặng cuối", "fulfillment logistics", "dịch vụ 3PL",
  "tư vấn xuất nhập khẩu", "tư vấn logistics", "chuỗi cung ứng", "supply chain",
  "vận chuyển quốc tế", "vận chuyển cross border", "multimodal transport", "vận tải đa phương thức",
  "project cargo", "vận chuyển hàng quá khổ", "vận chuyển hàng nguy hiểm", "DG cargo",
  "bảo hiểm hàng hóa", "cargo insurance", "tracking vận đơn", "shipment tracking",
  "báo giá vận chuyển", "cước phí vận tải", "đặt lịch vận chuyển", "tối ưu chi phí logistics",
  "kho ngoại quan", "bonded warehouse", "CFS warehouse", "kiểm hóa hải quan",
  "phân loại HS code", "chứng nhận xuất xứ", "chứng từ xuất nhập khẩu", "thủ tục hải quan",
  "bill of lading", "airway bill", "vận đơn đường biển", "vận đơn hàng không",
  "import export", "thương mại quốc tế", "nhập khẩu nguyên liệu", "xuất khẩu hàng hóa",
  "giao nhận hàng hóa", "vận chuyển cửa khẩu", "hàng hóa quá cảnh", "logistics e-commerce",
  "last mile delivery", "giao hàng đúng tiến độ", "giải pháp logistics", "forwarder Việt Nam",
  "công ty logistics", "công ty xuất nhập khẩu", "dịch vụ hải quan", "khai thuê hải quan",
  "vận chuyển lạnh", "cold chain logistics", "vận chuyển thực phẩm", "vận chuyển linh kiện điện tử",
  "vận chuyển may mặc", "vận chuyển nội thất", "vận chuyển máy móc", "vận chuyển hóa chất",
  "vận chuyển dược phẩm", "vận chuyển nông sản", "vận chuyển thủy sản", "vận chuyển gỗ",
  "vận chuyển thép", "vận chuyển nhựa", "vận chuyển hàng tiêu dùng", "consolidation hàng lẻ",
  "deconsolidation", "rút ruột container", "đóng hàng container", "stuffing container",
  "dịch vụ đại lý tàu", "dịch vụ đại lý hàng không", "customs broker", "trade compliance",
];

const LOCATIONS = [
  "TP.HCM", "Hồ Chí Minh", "Tân Sơn Nhất", "Cát Lái", "Hải Phòng", "Hà Nội", "Đà Nẵng",
  "Bình Dương", "Đồng Nai", "Long An", "Cần Thơ", "Bắc Ninh", "Hải Dương", "Vũng Tàu",
  "Quy Nhon", "Lạng Sơn", "Móng Cái", "Lào Cai", "An Giang", "Kiên Giang", "Bình Phước",
  "Tây Ninh", "Bình Định", "Nghệ An", "Thanh Hóa", "Huế", "Nha Trang", "Phú Quốc",
  "cảng Cát Lái", "cảng Hải Phòng", "cảng Đà Nẵng", "cảng Sài Gòn", "cảng Cái Mép",
  "ICD SOTRANS", "khu công nghiệp Bình Dương", "khu công nghiệp Đồng Nai",
  "sân bay Tân Sơn Nhất", "sân bay Nội Bài", "sân bay Đà Nẵng", "cửa khẩu Lào Cai",
  "cửa khẩu Mộc Bài", "cửa khẩu Hữu Nghị", "cửa khẩu Tân Thanh", "kho CFS TP.HCM",
  "kho ngoại quan TP.HCM", "logistics Tân Bình", "logistics Quận 7", "logistics Thủ Đức",
];

const COUNTRIES = [
  "Trung Quốc", "Mỹ", "Hàn Quốc", "Nhật Bản", "Đài Loan", "Thái Lan", "Singapore",
  "Malaysia", "Indonesia", "Philippines", "Ấn Độ", "Úc", "New Zealand", "Đức", "Pháp",
  "Anh", "Hà Lan", "Bỉ", "Ý", "Tây Ban Nha", "Ba Lan", "Thụy Sĩ", "UAE", "Ả Rập Saudi",
  "Qatar", "Israel", "Thổ Nhĩ Kỳ", "Nga", "Brazil", "Mexico", "Canada", "Chile", "Argentina",
  "Colombia", "Peru", "Nam Phi", "Ai Cập", "Kenya", "Nigeria", "Campuchia", "Lào", "Myanmar",
  "Brunei", "Hong Kong", "Macau", "châu Âu", "châu Á", "châu Mỹ", "châu Úc", "ASEAN", "EU",
  "Long Beach", "Los Angeles", "Rotterdam", "Hamburg", "Shanghai", "Shenzhen", "Busan",
  "Tokyo", "Osaka", "Sydney", "Melbourne", "Dubai", "Bangkok", "Jakarta", "Manila",
];

const MODIFIERS = [
  "uy tín", "giá rẻ", "giá tốt", "nhanh", "trọn gói", "chuyên nghiệp", "tốt nhất",
  "rẻ nhất", "2026", "cho doanh nghiệp", "cho SME", "cho startup", "tận nơi",
  "door to door", "nội địa", "quốc tế", "online", "trực tuyến", "24/7", "nhanh chóng",
  "an toàn", "tiết kiệm chi phí", "tối ưu", "toàn diện", "A-Z", "trọn gói A-Z",
];

const PREFIXES = [
  "dịch vụ", "công ty", "báo giá", "chi phí", "quy trình", "hướng dẫn", "thủ tục",
  "nhập khẩu", "xuất khẩu", "gửi hàng đi", "vận chuyển đi", "vận chuyển hàng đi",
  "nhập hàng từ", "xuất hàng đi", "forwarder", "đối tác", "giải pháp", "tư vấn",
  "đặt lịch", "booking", "cước phí", "thời gian", "transit time",
];

const pickCat = (kw) => {
  const k = kw.toLowerCase();
  if (/biển|tàu|fcl|lcl|container|cảng|booking|lading|cát lái|hải phòng|cai mep/.test(k)) return "sea";
  if (/hàng không|air|bay cargo|airway|sân bay|tan son nhat/.test(k)) return "air";
  if (/đường bộ|nội địa|liên tỉnh|đầu kéo|last mile|chặng cuối|cửa khẩu|cross border/.test(k)) return "road";
  if (/hải quan|thông quan|hs code|c\/o|chứng từ|kiểm hóa|xuất xứ|dg |nguy hiểm|broker/.test(k)) return "customs";
  if (/kho|warehouse|cfs|bonded|warehousing|fulfillment|3pl|ngoại quan/.test(k)) return "warehouse";
  if (/trung quốc|mỹ|hàn|nhật|đài|thái|singapore|đức|úc|anh|uae|indonesia|malaysia|philippines|châu|quốc tế|import|export|gửi hàng|nhập hàng|xuất khẩu|nhập khẩu|asean|eu |long beach|shanghai/.test(k)) return "global";
  return "business";
};

const unique = new Set();
const keywords = [];

const add = (phrase) => {
  const p = phrase.replace(/\s+/g, " ").trim();
  if (!p || p.length < 8 || p.length > 80) return;
  const key = p.toLowerCase();
  if (unique.has(key)) return;
  unique.add(key);
  keywords.push({
    keyword: p,
    slug: slugify(p),
    category: pickCat(p),
  });
};

// Layer 1: base services
SERVICES.forEach((s) => add(s));

// Layer 2: service + location
SERVICES.forEach((s) => LOCATIONS.forEach((l) => add(`${s} ${l}`)));

// Layer 3: service + modifier
SERVICES.forEach((s) => MODIFIERS.slice(0, 12).forEach((m) => add(`${s} ${m}`)));

// Layer 4: prefix + service/country
PREFIXES.forEach((p) => {
  SERVICES.slice(0, 40).forEach((s) => add(`${p} ${s}`));
  COUNTRIES.forEach((c) => add(`${p} ${c}`));
});

// Layer 5: route keywords
COUNTRIES.forEach((c) => {
  add(`vận chuyển hàng đi ${c}`);
  add(`gửi hàng đi ${c}`);
  add(`xuất khẩu sang ${c}`);
  add(`nhập hàng từ ${c}`);
  add(`freight forwarding ${c}`);
  add(`logistics ${c}`);
});

// Layer 6: location + modifier
LOCATIONS.forEach((l) => MODIFIERS.slice(0, 8).forEach((m) => add(`logistics ${l} ${m}`)));

// Layer 7: FCL/LCL combinations
["FCL", "LCL", "FCL/LCL"].forEach((t) => {
  COUNTRIES.slice(0, 30).forEach((c) => add(`vận chuyển ${t} đi ${c}`));
  LOCATIONS.slice(0, 20).forEach((l) => add(`vận chuyển ${t} ${l}`));
});

// Layer 8: commodity + service
const COMMODITIES = [
  "container 20ft", "container 40ft", "container 40HC", "hàng lẻ", "pallet",
  "kiện hàng", "hàng điện tử", "linh kiện", "máy móc", "thực phẩm", "nông sản",
  "thủy sản", "may mặc", "dược phẩm", "hóa chất", "nhựa", "thép", "gỗ", "nội thất",
  "mỹ phẩm", "phụ tùng ô tô", "xe máy", "điện thoại", "laptop", "vải", "giày dép",
  "đồ gia dụng", "đồ chơi", "sách", "in ấn", "bao bì", "thiết bị y tế",
];
COMMODITIES.forEach((c) => {
  add(`vận chuyển ${c}`);
  add(`xuất nhập khẩu ${c}`);
  LOCATIONS.slice(0, 10).forEach((l) => add(`vận chuyển ${c} ${l}`));
});

// Layer 9: incoterms & docs
const INCOTERMS = ["FOB", "CIF", "CFR", "EXW", "DDP", "DAP", "FCA", "CPT", "CIP"];
INCOTERMS.forEach((i) => {
  add(`Incoterms ${i} logistics`);
  add(`vận chuyển theo ${i}`);
  COUNTRIES.slice(0, 15).forEach((c) => add(`${i} shipping ${c}`));
});

// Layer 10: fill to 1000 with numbered variants if needed
let n = 0;
while (keywords.length < 1000) {
  const s = SERVICES[n % SERVICES.length];
  const l = LOCATIONS[n % LOCATIONS.length];
  const m = MODIFIERS[n % MODIFIERS.length];
  add(`${s} ${l} ${m}`);
  add(`công ty ${s} ${l}`);
  add(`báo giá ${s} ${l}`);
  add(`dịch vụ ${s} tại ${l}`);
  n++;
  if (n > 5000) break;
}

const final = keywords.slice(0, 1000);

if (final.length < 1000) {
  console.error(`Only generated ${final.length} keywords, expected 1000`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "keywords-1000.json"), JSON.stringify(final, null, 0), "utf8");

const listText = final.map((k, i) => `${i + 1}. ${k.keyword}`).join("\n");
fs.writeFileSync(path.join(outDir, "keywords-list.txt"), listText, "utf8");

console.log(`Generated ${final.length} keywords`);
console.log(`→ data/keywords-1000.json`);
console.log(`→ data/keywords-list.txt`);
