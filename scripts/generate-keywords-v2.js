/**
 * 1000 high-intent logistics SEO keywords (batch 2).
 * Skips keywords/slugs already used in news-posts.json.
 * Output: data/keywords-1000-new.json, data/keywords-1000-new.txt
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

const pickCat = (kw) => {
  const k = kw.toLowerCase();
  if (/thuê kho|kho |warehouse|cfs|bonded|fulfillment|3pl|wms|pick pack|ngoại quan|phân phối/.test(k))
    return "warehouse";
  if (/hải quan|thông quan|hs code|c\/o|chứng từ|kiểm hóa|xuất xứ|broker|thuế nk|incoterm/.test(k))
    return "customs";
  if (/hàng không|air cargo|air freight|sân bay|nội bài|tân sơn nhất|chuyển phát nhanh quốc tế/.test(k))
    return "air";
  if (/đường bộ|nội địa|liên tỉnh|đầu kéo|cửa khẩu|cross border|xe tải|ghép hàng/.test(k))
    return "road";
  if (/biển|tàu|fcl|lcl|container|cảng|booking|cát lái|cái mép|bill of lading|cước biển/.test(k))
    return "sea";
  if (
    /trung quốc|quảng châu|nghĩa ô|thâm quyến|hàn quốc|nhật|mỹ|đài loan|thái|singapore|taobao|1688|order|mua hộ|ship hàng|chuyên tuyến|quốc tế|amazon|coupang|rakuten|pinduoduo|temu/.test(
      k
    )
  )
    return "global";
  return "business";
};

const existingKw = new Set();
const existingSlug = new Set();
try {
  const posts = JSON.parse(fs.readFileSync(path.join(outDir, "news-posts.json"), "utf8"));
  posts.forEach((p) => {
    if (p.keyword) existingKw.add(String(p.keyword).toLowerCase().trim());
    if (p.slug) existingSlug.add(String(p.slug).toLowerCase().trim());
  });
} catch {}
try {
  const oldList = fs.readFileSync(path.join(outDir, "keywords-list.txt"), "utf8");
  oldList.split(/\r?\n/).forEach((line) => {
    const m = line.replace(/^\d+\.\s*/, "").trim();
    if (m) existingKw.add(m.toLowerCase());
  });
} catch {}
try {
  const ct = JSON.parse(fs.readFileSync(path.join(outDir, "keywords-chuyen-tuyen-order.json"), "utf8"));
  ct.forEach((x) => existingKw.add(String(x.keyword).toLowerCase().trim()));
} catch {}

const unique = new Set();
const keywords = [];
const skipped = { dupArticle: 0, dupNew: 0, short: 0 };

const add = (phrase, forceCat) => {
  const p = String(phrase || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!p || p.length < 8 || p.length > 78) {
    skipped.short++;
    return false;
  }
  const key = p.toLowerCase();
  if (existingKw.has(key)) {
    skipped.dupArticle++;
    return false;
  }
  if (unique.has(key)) {
    skipped.dupNew++;
    return false;
  }
  const slug = slugify(p);
  if (!slug || existingSlug.has(slug) || keywords.some((x) => x.slug === slug)) {
    skipped.dupNew++;
    return false;
  }
  unique.add(key);
  keywords.push({ keyword: p, slug, category: forceCat || pickCat(p) });
  return true;
};

const VN_HUBS = [
  "TP.HCM",
  "Hà Nội",
  "Hải Phòng",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Long An",
  "Cần Thơ",
  "Bắc Ninh",
  "Vũng Tàu",
  "Cát Lái",
  "Thủ Đức",
  "Tân Bình",
  "Quận 7",
  "Bình Tân",
];

const PORTS = [
  "cảng Cát Lái",
  "cảng Hải Phòng",
  "cảng Đà Nẵng",
  "cảng Cái Mép",
  "cảng Sài Gòn",
  "ICD Sóng Thần",
  "ICD Tân Cảng",
];

const CN_CITIES = [
  "Quảng Châu",
  "Nghĩa Ô",
  "Thâm Quyến",
  "Thượng Hải",
  "Đông Quản",
  "Phật Sơn",
  "Hàng Châu",
  "Ninh Ba",
  "Ôn Châu",
  "Phúc Châu",
  "Hạ Môn",
  "Thanh Đảo",
  "Côn Minh",
  "Nam Ninh",
  "Bằng Tường",
  "Đông Hưng",
  "Thâm Quyến Yantian",
  "Shekou",
];

const BORDERS = [
  "Lào Cai",
  "Lạng Sơn",
  "Móng Cái",
  "Hữu Nghị",
  "Tân Thanh",
  "Mộc Bài",
  "Tịnh Biên",
  "Hà Khẩu",
  "Cầu Treo",
  "Lao Bảo",
];

const COUNTRIES = [
  "Trung Quốc",
  "Hàn Quốc",
  "Nhật Bản",
  "Mỹ",
  "Đài Loan",
  "Thái Lan",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Ấn Độ",
  "Úc",
  "Đức",
  "Anh",
  "Pháp",
  "Hà Lan",
  "UAE",
  "Campuchia",
  "Lào",
  "Myanmar",
];

const GOODS = [
  "điện tử",
  "linh kiện điện tử",
  "may mặc",
  "nội thất",
  "máy móc",
  "nông sản",
  "thủy sản",
  "dược phẩm",
  "mỹ phẩm",
  "phụ tùng ô tô",
  "giày dép",
  "vải",
  "nhựa",
  "thép",
  "gỗ",
  "hóa chất",
  "đồ chơi",
  "bao bì",
  "thiết bị y tế",
  "đồ gia dụng",
  "thực phẩm",
  "cà phê",
  "hạt điều",
  "gạo",
  "cao su",
  "phân bón",
  "xi măng",
  "gạch ốp lát",
  "đá granite",
  "nhôm",
  "inox",
  "pin lithium",
  "tấm pin năng lượng",
  "xe đạp điện",
  "xe máy điện",
];

const SEEDS = [
  // —— Chuyên tuyến TQ / cửa khẩu ——
  "vận chuyển chuyên tuyến Trung Quốc giá rẻ",
  "cước chuyên tuyến Trung Quốc 2026",
  "thời gian vận chuyển chuyên tuyến Trung Quốc",
  "chuyên tuyến đường bộ Trung Quốc",
  "chuyên tuyến đường biển Trung Quốc",
  "chuyên tuyến hàng không Trung Quốc",
  "ship hàng Trung Quốc về Việt Nam bao lâu",
  "bảng giá ship Trung Quốc",
  "cước kg hàng Trung Quốc",
  "cước khối hàng Trung Quốc",
  "gom hàng lẻ Trung Quốc về Việt Nam",
  "vận chuyển hàng lẻ Trung Quốc giá rẻ",
  "vận chuyển nguyên container Trung Quốc",
  "booking container Trung Quốc",
  "vận chuyển FCL Trung Quốc về Việt Nam",
  "vận chuyển LCL Trung Quốc về Việt Nam",
  "kho nhận hàng Trung Quốc",
  "kho trung chuyển hàng Trung Quốc",
  "kiểm hàng Trung Quốc trước khi ship",
  "đóng gỗ hàng Trung Quốc",
  "đóng pallet hàng Trung Quốc",
  "bảo hiểm hàng Trung Quốc",
  "tracking hàng Trung Quốc",
  "mã vận đơn Trung Quốc",
  "hàng Trung Quốc bị giữ hải quan",
  "rút hàng Trung Quốc tại cảng",
  "giao hàng Trung Quốc tận kho",
  "vận chuyển Trung Quốc door to door",
  "vận chuyển Trung Quốc DDP",
  "vận chuyển Trung Quốc DAP",
  "nhập khẩu ủy thác hàng Trung Quốc",
  "làm hồ sơ nhập hàng Trung Quốc",
  "thuế nhập khẩu hàng Trung Quốc",
  "HS code hàng Trung Quốc",
  "C/O form E Trung Quốc",
  "kiểm tra chất lượng hàng Trung Quốc",
  "chụp ảnh hàng Trung Quốc",
  "video unbox hàng Trung Quốc",
  "gom hàng 1688",
  "gom hàng Taobao",
  "gom hàng Pinduoduo",
  "ship hàng WeChat",
  "ship hàng Alibaba",
  "forwarder Trung Quốc uy tín",
  "công ty ship hàng Trung Quốc",
  "đơn vị vận chuyển Trung Quốc tại TP.HCM",
  "nhận hàng Trung Quốc tại Hà Nội",
  "nhận hàng Trung Quốc tại Hải Phòng",
  "vận chuyển hàng quá khổ Trung Quốc",
  "vận chuyển máy móc Trung Quốc",
  "vận chuyển khuôn mẫu Trung Quốc",
  "vận chuyển hàng mẫu Trung Quốc",
  "express Trung Quốc 3 ngày",
  "chuyển phát nhanh Trung Quốc",
  "cước bay Trung Quốc",
  "cước biển Trung Quốc",
  "cước xe Trung Quốc",
  "lịch tàu Trung Quốc Việt Nam",
  "transit time Trung Quốc Việt Nam",

  // —— Order / mua hộ ——
  "công ty order hàng Trung Quốc",
  "dịch vụ order hàng Trung Quốc uy tín",
  "order hàng Trung Quốc không cần vốn",
  "order hàng Trung Quốc cho shop",
  "order sỉ hàng Trung Quốc",
  "nguồn hàng sỉ Trung Quốc",
  "tìm xưởng Trung Quốc",
  "đặt hàng xưởng Trung Quốc",
  "OEM Trung Quốc",
  "ODM Trung Quốc",
  "gia công hàng Trung Quốc",
  "in bao bì Trung Quốc",
  "order phụ kiện điện thoại Trung Quốc",
  "order quần áo Trung Quốc",
  "order giày Trung Quốc",
  "order túi xách Trung Quốc",
  "order mỹ phẩm Trung Quốc",
  "order đồ gia dụng Trung Quốc",
  "order đồ chơi Trung Quốc",
  "order nội thất Trung Quốc",
  "order đèn LED Trung Quốc",
  "order máy pha chế Trung Quốc",
  "order thiết bị nhà hàng Trung Quốc",
  "phí dịch vụ order hàng Trung Quốc",
  "cách tính cước order Trung Quốc",
  "order hàng Trung Quốc thanh toán hộ",
  "chuyển khoản Trung Quốc",
  "tỷ giá order hàng Trung Quốc",
  "đặt cọc order hàng Trung Quốc",
  "rủi ro order hàng Trung Quốc",
  "hàng Trung Quốc bị mất",
  "khiếu nại order Trung Quốc",
  "đổi trả hàng Trung Quốc",
  "order hàng Hàn Quốc Coupang",
  "order hàng Hàn Quốc Gmarket",
  "order mỹ phẩm Hàn Quốc chính hãng",
  "order skincare Hàn Quốc",
  "order thời trang Hàn Quốc",
  "order K-beauty về Việt Nam",
  "cước ship Hàn Quốc về Việt Nam",
  "thời gian ship Hàn Quốc",
  "order hàng Nhật Yahoo Auction",
  "order hàng Nhật Mercari",
  "order đồ nội địa Nhật",
  "order máy ảnh Nhật",
  "order hàng secondhand Nhật",
  "cước ship Nhật Bản về Việt Nam",
  "thời gian ship Nhật Bản",
  "order Amazon Mỹ về Việt Nam giá rẻ",
  "order hàng Mỹ Best Buy",
  "order hàng Mỹ Walmart",
  "order đồ công nghệ Mỹ",
  "order thực phẩm chức năng Mỹ",
  "cước ship Mỹ về Việt Nam",
  "thời gian ship Mỹ về Việt Nam",
  "thuế nhập khẩu hàng Mỹ",
  "thuế nhập khẩu hàng Nhật",
  "thuế nhập khẩu hàng Hàn",

  // —— Kho / fulfillment ——
  "cho thuê kho logistics",
  "cho thuê kho chứa hàng",
  "cho thuê kho ngắn hạn",
  "cho thuê kho dài hạn",
  "cho thuê kho theo mét vuông",
  "cho thuê kho theo pallet",
  "cho thuê kho theo tháng",
  "cho thuê kho 100m2",
  "cho thuê kho 200m2",
  "cho thuê kho 500m2",
  "cho thuê kho 1000m2",
  "cho thuê kho xưởng",
  "cho thuê nhà xưởng có kho",
  "kho đạt chuẩn PCCC",
  "kho có camera 24/7",
  "kho có xe nâng",
  "kho có dock container",
  "kho cao 8m",
  "kho cao 10m",
  "kho nền epoxy",
  "kho thông thoáng",
  "kho khô ráo",
  "kho tránh ngập",
  "cho thuê kho gần cao tốc",
  "cho thuê kho gần cảng",
  "cho thuê kho gần sân bay",
  "cho thuê kho khu công nghiệp",
  "dịch vụ 3PL Việt Nam",
  "công ty 3PL TP.HCM",
  "kho 3PL cho TMĐT",
  "fulfillment Shopee giá rẻ",
  "fulfillment Lazada giá rẻ",
  "fulfillment TikTok Shop giá rẻ",
  "kho xử lý đơn TMĐT",
  "nhập hàng về kho 3PL",
  "xuất hàng từ kho 3PL",
  "báo cáo tồn kho realtime",
  "phần mềm WMS kho",
  "quản lý tồn kho đa kênh",
  "đồng bộ Shopee Lazada TikTok",
  "dán tem phụ TMĐT",
  "đóng gói hàng TMĐT",
  "giao hàng Ninja Van",
  "giao hàng GHTK từ kho",
  "giao hàng GHN từ kho",
  "giao hàng J&T từ kho",
  "cross docking kho",
  "kho transshipment",
  "kho CFS Cát Lái",
  "kho CFS Hải Phòng",
  "rút ruột container tại kho",
  "đóng hàng xuất khẩu tại kho",
  "kho ngoại quan Cát Lái",
  "kho ngoại quan Hải Phòng",
  "gửi hàng kho ngoại quan",
  "thủ tục kho ngoại quan",
  "chi phí kho ngoại quan",
  "cho thuê kho lạnh âm 18",
  "cho thuê kho mát 2-8 độ",
  "cho thuê kho mát 15-25 độ",
  "cold storage TP.HCM",
  "kho dược phẩm GDP",
  "kho thực phẩm HACCP",
  "kho hóa chất có phép",
  "kho hàng nguy hiểm",
  "kho DG class",

  // —— Biển / FCL LCL ——
  "cước tàu biển Việt Nam",
  "bảng giá cước biển 2026",
  "booking tàu biển",
  "đại lý tàu biển TP.HCM",
  "hãng tàu Maersk Việt Nam",
  "hãng tàu MSC Việt Nam",
  "hãng tàu CMA CGM Việt Nam",
  "hãng tàu ONE Việt Nam",
  "hãng tàu Yang Ming",
  "hãng tàu Evergreen Việt Nam",
  "hãng tàu COSCO Việt Nam",
  "lịch tàu Cát Lái",
  "lịch tàu Hải Phòng",
  "lịch tàu Cái Mép",
  "demurrage container",
  "detention container",
  "phí lưu container",
  "phí lưu bãi",
  "phí THC cảng",
  "phí handling cảng",
  "phí DOC bill",
  "phí AMS",
  "phí ENS",
  "vận đơn house bill",
  "vận đơn master bill",
  "telex release bill",
  "surrender bill of lading",
  "seaway bill",
  "container 20DC",
  "container 40DC",
  "container 40HC giá cước",
  "container 45HC",
  "container reefer",
  "container open top",
  "container flat rack",
  "container tank",
  "thuê container rỗng",
  "mua container cũ",
  "sửa chữa container",
  "vệ sinh container",
  "kiểm đếm hàng container",
  "niêm phong container",
  "chụp ảnh stuffing",
  "giám sát đóng hàng",
  "hàng lẻ consolidation",
  "kho gom hàng lẻ",
  "cước LCL theo CBM",
  "cước LCL theo kg",
  "minimum CBM LCL",
  "hàng lẻ bị delay",
  "transhipment hàng lẻ",
  "direct service FCL",
  "feeder Cát Lái",
  "mẹ Cái Mép",

  // —— Hàng không ——
  "cước air cargo Việt Nam",
  "bảng giá air freight 2026",
  "booking hàng không cargo",
  "đại lý hàng không cargo",
  "MAWB hàng không",
  "HAWB hàng không",
  "AWB tracking",
  "hàng không Tân Sơn Nhất cargo",
  "hàng không Nội Bài cargo",
  "hàng không Đà Nẵng cargo",
  "kho hàng không SCS",
  "kho hàng không ALS",
  "cut off time air cargo",
  "hàng nguy hiểm air cargo",
  "IATA DGR",
  "lithium battery air cargo",
  "hàng mẫu air cargo",
  "courier vs air cargo",
  "chuyển phát nhanh DHL",
  "chuyển phát nhanh FedEx",
  "chuyển phát nhanh UPS",
  "chuyển phát nhanh TNT",
  "cước DHL quốc tế",
  "cước FedEx quốc tế",
  "gửi chứng từ quốc tế",
  "gửi hàng mẫu quốc tế",
  "air cargo express",
  "air cargo deferred",
  "charter máy bay cargo",
  "belly cargo passenger",

  // —— Đường bộ / nội địa ——
  "vận tải container nội địa",
  "kéo container Cát Lái",
  "kéo container Hiệp Phước",
  "kéo container Cái Mép",
  "cước đầu kéo container",
  "bảng giá kéo cont 2026",
  "xe tải chở hàng liên tỉnh",
  "xe 1 tấn chở hàng",
  "xe 2.5 tấn chở hàng",
  "xe 5 tấn chở hàng",
  "xe 8 tấn chở hàng",
  "xe 15 tấn chở hàng",
  "xe 30 tấn chở hàng",
  "xe mooc sàn",
  "xe mooc xương",
  "xe mooc lồng",
  "xe lạnh chở hàng",
  "ghép hàng Sài Gòn Hà Nội",
  "ghép hàng Sài Gòn Đà Nẵng",
  "ghép hàng Sài Gòn Cần Thơ",
  "vận chuyển Bắc Nam",
  "vận chuyển hàng siêu trường",
  "vận chuyển hàng siêu trọng",
  "xin giấy phép quá khổ",
  "hộ tống hàng quá khổ",
  "vận chuyển máy CNC",
  "vận chuyển dây chuyền",
  "vận chuyển turbine",
  "vận chuyển transformator",
  "cross border trucking",
  "vận tải ASEAN",
  "CBTL Trung Quốc Việt Nam",
  "e-permit cửa khẩu",
  "tờ khai đường bộ",

  // —— Hải quan / XNK ——
  "dịch vụ khai thuê hải quan trọn gói",
  "công ty khai hải quan uy tín",
  "đại lý hải quan mã số",
  "tờ khai hải quan điện tử",
  "VNACCS / VCIS",
  "luồng xanh hải quan",
  "luồng vàng hải quan",
  "luồng đỏ hải quan",
  "kiểm hóa tại cảng",
  "kiểm hóa tại kho",
  "giám sát hải quan",
  "niêm phong hải quan",
  "tái xuất hàng hóa",
  "tái nhập hàng hóa",
  "hàng tạm nhập tái xuất",
  "gia công xuất khẩu",
  "sản xuất xuất khẩu",
  "loại hình A11 A12",
  "loại hình E21 E23",
  "kho bảo thuế",
  "cửa hàng miễn thuế logistics",
  "chính sách thuế NK 2026",
  "biểu thuế xuất nhập khẩu",
  "thuế GTGT hàng nhập khẩu",
  "thuế tiêu thụ đặc biệt NK",
  "mã HS 2026",
  "tra cứu HS code Việt Nam",
  "phân loại HS sai bị phạt",
  "ruling HS code",
  "C/O form D",
  "C/O form E",
  "C/O form AK",
  "C/O form AJ",
  "C/O form VK",
  "C/O form EUR.1",
  "C/O form B",
  "eCO chứng nhận xuất xứ",
  "kiểm dịch thực vật",
  "kiểm dịch động vật",
  "công bố mỹ phẩm nhập khẩu",
  "giấy phép nhập khẩu",
  "giấy phép xuất khẩu",
  "kiểm tra chất lượng nhà nước",
  "đăng ký kiểm tra chuyên ngành",
  "CR hồ sơ hải quan",
  "sửa tờ khai hải quan",
  "hủy tờ khai hải quan",
  "nợ thuế hải quan",
  "hoàn thuế NK",
  "bảo lãnh thuế",
  "Incoterms 2020 FOB",
  "Incoterms 2020 CIF",
  "Incoterms 2020 EXW",
  "Incoterms 2020 DDP",
  "Incoterms 2020 DAP",
  "Incoterms 2020 FCA",
  "rủi ro Incoterms",
  "hợp đồng ngoại thương",
  "L/C thư tín dụng",
  "T/T thanh toán quốc tế",
  "bộ chứng từ xuất khẩu",
  "commercial invoice",
  "packing list chuẩn",
  "certificate of origin",
  "phytosanitary certificate",
  "health certificate",
  "fumigation certificate",
  "inspection certificate",
  "insurance certificate",
  "beneficiary certificate",

  // —— Local SEO / công ty ——
  "công ty logistics gần Tân Sơn Nhất",
  "công ty logistics Cát Lái",
  "công ty logistics Bình Dương",
  "công ty logistics Đồng Nai",
  "công ty logistics Long An",
  "công ty logistics Hải Phòng",
  "công ty logistics Hà Nội",
  "forwarder uy tín TP.HCM",
  "forwarder giá rẻ Cát Lái",
  "đối tác logistics SME",
  "logistics cho shop online",
  "logistics cho nhà máy",
  "logistics cho thương mại",
  "tư vấn chọn forwarder",
  "so sánh 3PL và tự vận hành",
  "tối ưu chi phí xuất nhập khẩu",
  "giảm cước vận chuyển quốc tế",
  "checklist xuất khẩu lần đầu",
  "checklist nhập khẩu lần đầu",
  "hồ sơ mở tờ khai lần đầu",
  "mã số thuế xuất nhập khẩu",
  "đăng ký chữ ký số hải quan",
  "tài khoản VNACCS",
];

SEEDS.forEach((s) => add(s));

const FAQ = [
  "cước vận chuyển Trung Quốc tính như thế nào",
  "ship hàng Trung Quốc bao lâu thì tới",
  "nên đi đường bộ hay đường biển Trung Quốc",
  "order 1688 có bị hải quan giữ không",
  "hàng personal effects có được nhập không",
  "nhập hàng mẫu có đóng thuế không",
  "giá trị tối thiểu phải mở tờ khai",
  "hàng dưới 1 triệu có cần hải quan không",
  "cách tính thuế nhập khẩu 2026",
  "phân biệt FCL và LCL",
  "nên chọn FOB hay CIF",
  "DDP có gồm thuế không",
  "kho ngoại quan khác bonded warehouse",
  "cho thuê kho có cần PCCC không",
  "diện tích kho tối thiểu cho shop",
  "chi phí fulfillment tính theo đơn hay theo kg",
  "3PL có giữ hàng hộ được không",
  "thời gian thông quan Cát Lái",
  "thời gian thông quan Hải Phòng",
  "cắt mái tàu Cát Lái mấy giờ",
  "phí lưu cont tính từ ngày nào",
  "demurrage khác detention thế nào",
  "hàng DG có đi được LCL không",
  "pin lithium gửi hàng không được không",
  "cách booking tàu lần đầu",
  "cần giấy tờ gì khi nhập khẩu",
  "mở tờ khai cần chữ ký số loại nào",
  "có được ủy thác xuất nhập khẩu không",
  "công ty logistics có làm CO không",
  "kiểm dịch thực vật mất bao lâu",
  "hàng nông sản xuất khẩu cần giấy gì",
  "thủy sản xuất khẩu cần health cert",
  "mỹ phẩm nhập khẩu cần công bố không",
  "thực phẩm nhập khẩu cần gì",
  "máy móc cũ nhập khẩu được không",
  "nhập khẩu phế liệu có bị cấm không",
  "hàng nhái bị xử lý thế nào",
  "bảo hiểm all risk khác ICC A",
  "khiếu nại bồi thường hàng hư",
  "hàng rơi vãi container xử lý sao",
  "shortage cargo claim",
  "damage cargo survey",
  "giám định hàng hóa Vinacontrol",
  "giám định SGS logistics",
  "giám định Intertek",
  "fumigation 56 độ gỗ xuất khẩu",
  "ISPM 15 pallet",
  "đóng thùng gỗ xuất khẩu",
  "đóng crate máy móc",
  "cân hàng trước khi xuất",
  "đo CBM hàng lẻ",
  "cách tính CBM",
  "volumetric weight hàng không",
  "chargeable weight",
  "tỷ lệ 1:167 air cargo",
  "tỷ lệ 1:500 courier",
  "minimum charge LCL",
  "BAF CAF là gì",
  "PSS peak season surcharge",
  "GRI cước biển",
  "war risk surcharge",
  "low sulphur surcharge",
  "ETS EU shipping",
  "carbon surcharge logistics",
  "green logistics Việt Nam",
  "logistics bền vững",
  "kho năng lượng mặt trời",
  "xe điện vận tải nội địa",
  "tracking container realtime",
  "EDI hãng tàu",
  "inttra booking",
  "cargosmart tracking",
  "VGM cân container",
  "SOLAS VGM",
  "verified gross mass",
  "IMO number tàu",
  "SCAC code forwarder",
  "IATA cargo agent",
  "FIATA bill",
  "NVOCC Việt Nam",
  "đăng ký NVOCC",
  "bảo hiểm trách nhiệm forwarder",
  "hợp đồng forwarding",
  "điều khoản bill of lading",
  "lien hàng hóa",
  "quyền giữ hàng",
  "phí local charge",
  "destination charge",
  "origin charge",
  "cước all in",
  "cước all in Cát Lái",
  "báo giá all in FCL",
  "báo giá all in LCL",
  "báo giá all in air",
  "so sánh cước 3 forwarder",
  "hidden fee logistics",
  "phí phát sinh vận chuyển",
  "phụ phí xăng dầu vận tải",
  "phí cầu đường container",
  "phí cân cầu",
  "phí hạ bãi",
  "phí nâng hạ",
  "phí vệ sinh cont",
  "phí sửa chữa cont",
  "EIR phiếu giao cont",
  "lệnh giao hàng D/O",
  "phiếu EIR",
  "máy soi container",
  "scan hải quan",
  "chụp X-quang hàng hóa",
  "đội kiểm soát hải quan",
  "xử lý vi phạm hải quan",
  "phạt chậm nộp thuế NK",
  "ấn định thuế hải quan",
  "khiếu nại quyết định hải quan",
  "tham vấn trị giá hải quan",
  "trị giá tính thuế",
  "royalty phí bản quyền NK",
  "assist cost trị giá",
  "related party giao dịch liên kết",
  "chuyển giá logistics",
];
FAQ.forEach((s) => add(s));

VN_HUBS.forEach((l) => {
  add(`cho thuê kho ${l}`);
  add(`kho logistics ${l}`);
  add(`dịch vụ fulfillment ${l}`);
  add(`công ty 3PL ${l}`);
  add(`kéo container ${l}`);
  add(`khai hải quan ${l}`);
  add(`giao nhận ${l}`);
  add(`kho CFS ${l}`);
  add(`báo giá logistics ${l}`);
  add(`vận chuyển nội địa ${l}`);
});

const SHOPS = ["Shopee", "Lazada", "TikTok Shop", "Sendo", "Tiki"];
SHOPS.forEach((s) => {
  add(`kho fulfillment ${s}`);
  add(`dịch vụ fulfillment ${s}`);
  add(`giao hàng ${s} từ kho 3PL`);
  add(`đóng gói đơn ${s}`);
  add(`xử lý hoàn hàng ${s}`);
  VN_HUBS.slice(0, 6).forEach((l) => add(`fulfillment ${s} ${l}`));
});

BORDERS.forEach((b) => {
  add(`vận chuyển cửa khẩu ${b}`);
  add(`thông quan cửa khẩu ${b}`);
  add(`chuyên tuyến cửa khẩu ${b}`);
  add(`cước xe cửa khẩu ${b}`);
  add(`thủ tục cửa khẩu ${b}`);
  add(`thời gian thông quan ${b}`);
});

CN_CITIES.forEach((c) => {
  add(`vận chuyển hàng ${c} về Việt Nam`);
  add(`ship hàng ${c}`);
  add(`chuyên tuyến ${c}`);
  add(`cước vận chuyển ${c}`);
  add(`order hàng ${c}`);
  add(`gom hàng ${c} về TP.HCM`);
});

const KR_JP_US = [
  ["Hàn Quốc", ["Busan", "Incheon", "Seoul", "Gyeonggi"]],
  ["Nhật Bản", ["Tokyo", "Osaka", "Yokohama", "Nagoya"]],
  ["Mỹ", ["Los Angeles", "Long Beach", "New York", "Chicago"]],
];
KR_JP_US.forEach(([country, cities]) => {
  cities.forEach((city) => {
    add(`vận chuyển ${city} về Việt Nam`);
    add(`ship hàng ${city}`);
    add(`cước vận chuyển ${city}`);
    add(`FCL ${city}`);
    add(`air cargo ${city}`);
  });
  add(`chuyên tuyến ${country} đường biển`);
  add(`chuyên tuyến ${country} hàng không`);
  add(`gom hàng lẻ ${country}`);
  add(`kiểm hàng ${country}`);
  add(`kho nhận hàng ${country}`);
});

PORTS.forEach((p) => {
  add(`thủ tục ${p}`);
  add(`rút hàng ${p}`);
  add(`booking ${p}`);
  add(`cước phí ${p}`);
  add(`thời gian thông quan ${p}`);
  add(`kho gần ${p}`);
  add(`đầu kéo ${p}`);
});

const INTENT = ["giá rẻ", "uy tín", "trọn gói", "nhanh", "tận nơi", "2026"];
[
  "vận chuyển Trung Quốc",
  "order hàng Trung Quốc",
  "cho thuê kho",
  "fulfillment TMĐT",
  "khai báo hải quan",
  "vận chuyển FCL",
  "vận chuyển LCL",
  "air cargo",
  "kéo container",
  "kho ngoại quan",
].forEach((base) => {
  INTENT.forEach((m) => add(`${base} ${m}`));
  VN_HUBS.slice(0, 8).forEach((l) => add(`${base} ${l}`));
});

const MODES = ["đường biển", "đường bộ", "hàng không"];
["Trung Quốc", "Hàn Quốc", "Nhật Bản", "Mỹ", "Đài Loan", "Thái Lan"].forEach((c) => {
  MODES.forEach((m) => {
    add(`vận chuyển ${m} ${c}`);
    add(`cước ${m} ${c}`);
    add(`thời gian ${m} ${c}`);
  });
});

const EXTRA_LOCS = [
  "Thuận An",
  "Dĩ An",
  "Tân Uyên",
  "Bến Cát",
  "Biên Hòa",
  "Nhơn Trạch",
  "Long Thành",
  "Trảng Bom",
  "Bến Lức",
  "Đức Hòa",
  "Cần Giuộc",
  "Nhà Bè",
  "Bình Chánh",
  "Hóc Môn",
  "Củ Chi",
  "Quận 1",
  "Quận 12",
  "Gò Vấp",
  "Tân Phú",
  "Phú Nhuận",
  "Yên Phong",
  "Quế Võ",
  "Từ Sơn",
  "KCN VSIP",
  "KCN Sóng Thần",
  "KCN Amata",
  "KCN Long Hậu",
  "KCN Tân Phú Trung",
  "KCN Hiệp Phước",
  "KCN Đình Vũ",
];
EXTRA_LOCS.forEach((l) => {
  add(`cho thuê kho ${l}`);
  add(`logistics ${l}`);
  add(`vận chuyển hàng ${l}`);
  add(`kéo container ${l}`);
});

const COMMODITY_ROUTES = [
  ["may mặc", "Trung Quốc"],
  ["giày dép", "Trung Quốc"],
  ["điện tử", "Trung Quốc"],
  ["nội thất", "Trung Quốc"],
  ["máy móc", "Trung Quốc"],
  ["mỹ phẩm", "Hàn Quốc"],
  ["thời trang", "Hàn Quốc"],
  ["linh kiện ô tô", "Nhật Bản"],
  ["máy móc chính xác", "Nhật Bản"],
  ["đồ công nghệ", "Mỹ"],
  ["thực phẩm chức năng", "Mỹ"],
  ["nông sản", "Trung Quốc"],
  ["thủy sản", "Nhật Bản"],
  ["cà phê", "Đức"],
  ["hạt điều", "Mỹ"],
  ["gạo", "Trung Quốc"],
  ["cao su", "Trung Quốc"],
  ["gỗ", "Trung Quốc"],
  ["thép", "Hàn Quốc"],
  ["hóa chất", "Đài Loan"],
];
COMMODITY_ROUTES.forEach(([g, c]) => {
  add(`nhập khẩu ${g} từ ${c}`);
  add(`xuất khẩu ${g} sang ${c}`);
  add(`vận chuyển ${g} ${c}`);
  add(`cước vận chuyển ${g} ${c}`);
});

COUNTRIES.forEach((c) => {
  add(`cước vận chuyển ${c} 2026`);
  add(`vận chuyển door to door ${c}`);
  add(`ủy thác nhập khẩu ${c}`);
  add(`FCL ${c} về Việt Nam`);
  add(`LCL ${c} về Việt Nam`);
  add(`air cargo ${c}`);
});

GOODS.forEach((g) => {
  add(`nhập khẩu ${g}`);
  add(`xuất khẩu ${g}`);
  add(`thủ tục nhập khẩu ${g}`);
  add(`thuế nhập khẩu ${g}`);
});

// Fill remaining with high-intent long-tails
const FILL_BASE = [
  "vận chuyển chuyên tuyến",
  "order hàng",
  "cho thuê kho",
  "fulfillment",
  "khai thuê hải quan",
  "vận chuyển FCL",
  "vận chuyển LCL",
  "air freight",
  "kéo cont",
  "kho CFS",
  "ship hàng",
  "gom hàng lẻ",
  "ủy thác XNK",
  "báo giá cước",
  "thông quan",
];
const FILL_WHERE = [
  ...VN_HUBS,
  ...CN_CITIES.slice(0, 10),
  ...COUNTRIES.slice(0, 12),
  ...BORDERS.slice(0, 6),
];
const FILL_MOD = [
  "giá tốt",
  "cho doanh nghiệp",
  "cho SME",
  "tận kho",
  "A-Z",
  "online",
  "nhanh chóng",
  "an toàn",
  "tiết kiệm",
  "trọn gói A-Z",
];

let n = 0;
while (keywords.length < 1000 && n < 20000) {
  const b = FILL_BASE[n % FILL_BASE.length];
  const w = FILL_WHERE[Math.floor(n / FILL_BASE.length) % FILL_WHERE.length];
  const m = FILL_MOD[Math.floor(n / (FILL_BASE.length * FILL_WHERE.length)) % FILL_MOD.length];
  add(`${b} ${w}`);
  if (keywords.length >= 1000) break;
  add(`${b} ${w} ${m}`);
  n++;
}

const final = keywords.slice(0, 1000);
if (final.length < 1000) {
  console.error(`Only generated ${final.length}/1000`);
  process.exit(1);
}

const cats = {};
final.forEach((k) => {
  cats[k.category] = (cats[k.category] || 0) + 1;
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "keywords-1000-new.json"), JSON.stringify(final, null, 2), "utf8");
fs.writeFileSync(
  path.join(outDir, "keywords-1000-new.txt"),
  final.map((k, i) => `${i + 1}. ${k.keyword}`).join("\n"),
  "utf8"
);

console.log(`Generated ${final.length} keywords`);
console.log("categories", cats);
console.log("skipped", skipped);
console.log("→ data/keywords-1000-new.json");
console.log("→ data/keywords-1000-new.txt");
