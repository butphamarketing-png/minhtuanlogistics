/**
 * Phase 2: Strengthen money pages (services + about) — snippets, FAQ, internal links.
 */
const fs = require("fs");
const path = require("path");
const SEOChecklist = require("../lib/seo-checklist");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "subpages.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const UPGRADES = {
  "xuat-nhap-khau": {
    metaTitle: "Xuất nhập khẩu TP.HCM | Ủy thác & hải quan trọn gói",
    metaDescription:
      "Dịch vụ xuất nhập khẩu TP.HCM: ủy thác XNK, khai báo hải quan, chứng từ và giao nhận. Báo giá 24h. Hotline 0938 961 012 — Minh Tuấn Logistics.",
    lead:
      "Doanh nghiệp cần xuất nhập khẩu tại TP.HCM thường gặp khó ở chứng từ, mã HS và lịch thông quan. Minh Tuấn Logistics đồng hành từ tư vấn phương án đến vận hành trọn gói, gần Tân Sơn Nhất và cảng Cát Lái.",
    faq: [
      {
        q: "Ủy thác xuất nhập khẩu gồm những hạng mục nào?",
        a: "Gồm tư vấn Incoterms/mã HS, chuẩn bị chứng từ, khai báo hải quan, phối hợp vận tải và giao nhận theo tiến độ đã cam kết.",
      },
      {
        q: "Bao lâu nhận được báo giá xuất nhập khẩu?",
        a: "Thường trong 24 giờ làm việc sau khi cung cấp loại hàng, tuyến, khối lượng và yêu cầu thời gian.",
      },
      {
        q: "Minh Tuấn có hỗ trợ thông quan tại Cát Lái không?",
        a: "Có. Chúng tôi hỗ trợ khai báo và phối hợp thông quan hàng container qua khu vực cảng Cát Lái và các điểm liên quan tại TP.HCM.",
      },
      {
        q: "Chi phí xuất nhập khẩu phụ thuộc yếu tố nào?",
        a: "Loại hàng, tuyến, hình thức vận tải (biển/bộ/hàng không), yêu cầu kiểm tra và thời gian giao — báo giá luôn tách hạng mục rõ ràng.",
      },
    ],
    internalLinks: [
      "/dich-vu",
      "/lien-he",
      "/bai-viet/khai-bao-hai-quan",
      "/bai-viet/uy-thac-xuat-nhap-khau",
      "/bai-viet/bao-gia-van-chuyen",
    ],
  },
  "van-chuyen-duong-bien": {
    metaTitle: "Vận chuyển đường biển FCL/LCL TP.HCM | Minh Tuấn",
    metaDescription:
      "Vận chuyển đường biển quốc tế FCL/LCL từ TP.HCM: booking tàu, chứng từ, kết nối cảng. Tối ưu chi phí — đúng tiến độ. Hotline 0938 961 012.",
    lead:
      "Vận chuyển đường biển phù hợp hàng khối lượng lớn cần tối ưu chi phí. Minh Tuấn hỗ trợ FCL/LCL, booking, chứng từ và theo dõi lịch tàu cho doanh nghiệp tại TP.HCM.",
    faq: [
      {
        q: "Nên chọn FCL hay LCL?",
        a: "FCL phù hợp hàng đủ container; LCL phù hợp hàng lẻ ghép. Chúng tôi tư vấn theo khối lượng, lịch tàu và ngân sách.",
      },
      {
        q: "Thời gian vận chuyển đường biển mất bao lâu?",
        a: "Phụ thuộc tuyến (ASEAN, Trung Quốc, Mỹ, EU…). Sau khi có lịch tàu cụ thể, Minh Tuấn cập nhật ETA và mốc chứng từ.",
      },
      {
        q: "Có hỗ trợ vận chuyển nội địa sau khi hàng về cảng?",
        a: "Có — kết nối vận chuyển đường bộ từ cảng về kho khách hàng tại TP.HCM và các tỉnh.",
      },
      {
        q: "Bao lâu có báo giá đường biển?",
        a: "Thường trong 24 giờ làm việc khi đủ thông tin hàng, cảng đi/đến và lịch mong muốn.",
      },
    ],
    internalLinks: [
      "/dich-vu",
      "/dich-vu/xuat-nhap-khau",
      "/lien-he",
      "/bai-viet/van-chuyen-duong-bien",
      "/bai-viet/freight-forwarding",
    ],
  },
  "van-chuyen-duong-bo": {
    metaTitle: "Vận chuyển đường bộ nội địa & liên tỉnh | Minh Tuấn",
    metaDescription:
      "Vận chuyển đường bộ TP.HCM — nội địa, liên tỉnh, kéo container từ cảng/sân bay. An toàn, đúng tiến độ. Báo giá nhanh 0938 961 012.",
    lead:
      "Vận chuyển đường bộ là mắt xích kết nối cảng, sân bay và kho doanh nghiệp. Minh Tuấn tổ chức xe tải/container nội địa và liên tỉnh với lịch trình rõ ràng.",
    faq: [
      {
        q: "Có nhận kéo container từ Cát Lái không?",
        a: "Có. Chúng tôi hỗ trợ kéo container từ cảng về kho và chiều ngược lại theo lịch cắt máng.",
      },
      {
        q: "Phạm vi vận chuyển đường bộ đến đâu?",
        a: "Ưu tiên TP.HCM và các tỉnh trọng điểm; tuyến liên tỉnh theo yêu cầu sản lượng và lịch giao.",
      },
      {
        q: "Hàng dễ vỡ được xử lý thế nào?",
        a: "Đóng gói/chằng buộc theo đặc thù hàng, chọn xe phù hợp và cập nhật tiến độ cho đầu mối của bạn.",
      },
      {
        q: "Thời gian báo giá đường bộ?",
        a: "Thường trong ngày làm việc khi có điểm đi–đến, loại hàng và khối lượng.",
      },
    ],
    internalLinks: ["/dich-vu", "/dich-vu/kho-bai-logistics", "/lien-he", "/bai-viet/van-chuyen-duong-bo"],
  },
  "van-chuyen-hang-khong": {
    metaTitle: "Vận chuyển hàng không TP.HCM | Gần Tân Sơn Nhất",
    metaDescription:
      "Vận chuyển hàng không quốc tế/nội địa tại TP.HCM — ưu tiên tốc độ, gần sân bay Tân Sơn Nhất. Booking, chứng từ, giao nhận. Hotline 0938 961 012.",
    lead:
      "Khi cần tốc độ, vận chuyển hàng không là lựa chọn tối ưu. Minh Tuấn hỗ trợ booking, chứng từ và giao nhận với lợi thế gần sân bay Tân Sơn Nhất.",
    faq: [
      {
        q: "Hàng nào nên đi đường hàng không?",
        a: "Hàng giá trị cao, gấp tiến độ, mẫu hàng hoặc phụ tùng cần về kịp sản xuất.",
      },
      {
        q: "Có hỗ trợ door-to-door không?",
        a: "Có — kết hợp hàng không với giao nhận đường bộ tới kho khách hàng.",
      },
      {
        q: "Thời gian booking bay mất bao lâu?",
        a: "Tùy hãng và mùa cao điểm; chúng tôi cập nhật slot sớm và phương án thay thế nếu lịch đổi.",
      },
      {
        q: "Báo giá air freight trong bao lâu?",
        a: "Thường trong 24 giờ làm việc khi đủ thông tin trọng lượng, kích thước và tuyến.",
      },
    ],
    internalLinks: ["/dich-vu", "/dich-vu/xuat-nhap-khau", "/lien-he", "/bai-viet/van-chuyen-hang-khong"],
  },
  "kho-bai-logistics": {
    metaTitle: "Kho bãi & logistics TP.HCM | Lưu trữ – đóng gói",
    metaDescription:
      "Kho bãi logistics TP.HCM: lưu trữ, đóng gói, phân phối và kết nối XNK. Đồng bộ với vận tải biển/bộ/hàng không. Hotline 0938 961 012.",
    lead:
      "Kho bãi giúp doanh nghiệp chủ động tồn kho và lịch giao. Minh Tuấn cung cấp giải pháp lưu trữ – đóng gói – phân phối gắn với chuỗi xuất nhập khẩu tại TP.HCM.",
    faq: [
      {
        q: "Kho hỗ trợ loại hàng nào?",
        a: "Hàng thường, hàng cần đóng gói lại trước xuất/nhập; hàng đặc thù sẽ khảo sát điều kiện bảo quản trước khi nhận.",
      },
      {
        q: "Có kết nối giao nhận từ kho ra cảng/sân bay không?",
        a: "Có — đồng bộ lịch kho với vận tải biển, bộ và hàng không.",
      },
      {
        q: "Chi phí thuê kho tính thế nào?",
        a: "Theo diện tích/thời gian lưu và dịch vụ gia tăng (đóng gói, picking). Báo giá minh bạch theo nhu cầu.",
      },
      {
        q: "Thời gian nhận báo giá kho bãi?",
        a: "Thường trong 24 giờ sau khi nắm loại hàng, sản lượng và thời gian lưu dự kiến.",
      },
    ],
    internalLinks: ["/dich-vu", "/dich-vu/van-chuyen-duong-bo", "/lien-he", "/bai-viet/warehousing"],
  },
  "cong-ty-logistics-tp-hcm": {
    metaTitle: "Công ty logistics TP.HCM | Minh Tuấn gần Tân Sơn Nhất",
    metaDescription:
      "Công ty logistics TP.HCM uy tín: XNK, hải quan, vận tải biển–bộ–hàng không, kho bãi. Gần Tân Sơn Nhất & Cát Lái. Hotline 0938 961 012.",
    lead:
      "Minh Tuấn là công ty logistics tại TP.HCM đồng hành SME và doanh nghiệp XNK — quy trình rõ, chi phí minh bạch, gần sân bay Tân Sơn Nhất và cảng Cát Lái.",
    faq: [
      {
        q: "Minh Tuấn cung cấp những dịch vụ logistics nào?",
        a: "Xuất nhập khẩu, khai báo hải quan, vận chuyển biển/bộ/hàng không và kho bãi — có thể dùng lẻ hoặc trọn gói.",
      },
      {
        q: "Vì sao chọn đơn vị gần Tân Sơn Nhất?",
        a: "Rút ngắn thời gian xử lý chứng từ, phối hợp sân bay và giao nhận nội đô nhanh hơn cho hàng gấp.",
      },
      {
        q: "Doanh nghiệp nhỏ có thuê được không?",
        a: "Có. Chúng tôi hỗ trợ từ lô nhỏ đến sản lượng ổn định, báo giá theo nhu cầu thực tế.",
      },
      {
        q: "Liên hệ tư vấn bằng cách nào?",
        a: "Gọi 0938 961 012 hoặc gửi form tại trang Liên hệ để nhận tư vấn và báo giá trong 24 giờ.",
      },
    ],
    internalLinks: ["/dich-vu", "/gioi-thieu", "/lien-he", "/bai-viet/cong-ty-logistics", "/bai-viet/logistics-tp-hcm"],
  },
  "doi-tac-logistics-hang-dau": {
    metaTitle: "Đối tác logistics TP.HCM | Đồng hành dài hạn",
    metaDescription:
      "Trở thành đối tác logistics đáng tin cậy tại TP.HCM: quy trình chuẩn, báo cáo tiến độ, tối ưu chi phí XNK. Hotline 0938 961 012.",
    lead:
      "Doanh nghiệp cần đối tác logistics dài hạn hơn là nhà thầu một lần. Minh Tuấn đặt trọng tâm vào minh bạch tiến độ, kiểm soát rủi ro và đồng bộ chuỗi cung ứng.",
    faq: [
      {
        q: "Mô hình hợp tác như thế nào?",
        a: "Theo dự án hoặc hợp đồng khung dài hạn — có đầu mối phụ trách và báo cáo định kỳ.",
      },
      {
        q: "Có hỗ trợ mở tuyến mới không?",
        a: "Có. Chúng tôi khảo sát tuyến, chi phí và rủi ro trước khi tăng sản lượng.",
      },
      {
        q: "Làm sao đảm bảo đúng tiến độ?",
        a: "Checklist chứng từ, đặt lịch sớm và phương án thay thế khi tàu/bay đổi lịch.",
      },
      {
        q: "Bắt đầu hợp tác từ đâu?",
        a: "Liên hệ hotline hoặc trang Liên hệ để nhận tư vấn phương án phù hợp quy mô của bạn.",
      },
    ],
    internalLinks: ["/gioi-thieu/cong-ty-logistics-tp-hcm", "/dich-vu", "/lien-he", "/du-an"],
  },
  "gia-tri-cot-loi-logistics": {
    metaTitle: "Giá trị cốt lõi Minh Tuấn Logistics | Minh bạch – đúng hẹn",
    metaDescription:
      "Giá trị cốt lõi của Minh Tuấn: minh bạch chi phí, đúng tiến độ, đồng hành doanh nghiệp XNK tại TP.HCM. Hotline 0938 961 012.",
    lead:
      "Giá trị cốt lõi định hướng cách Minh Tuấn vận hành mọi lô hàng: trao đổi rủi ro sớm, chi phí rõ ràng và cam kết tiến độ với doanh nghiệp tại TP.HCM.",
    faq: [
      {
        q: "Minh Tuấn khác gì đơn vị chỉ booking hộ?",
        a: "Chúng tôi tư vấn phương án, kiểm soát chứng từ và cập nhật rủi ro — không chỉ đặt chỗ vận tải.",
      },
      {
        q: "Chi phí có phát sinh ẩn không?",
        a: "Báo giá tách hạng mục; phát sinh (nếu có) được thông báo trước khi triển khai.",
      },
      {
        q: "Có cam kết SLA tiến độ không?",
        a: "Mốc thời gian được thống nhất theo từng lô và theo dõi bởi đầu mối phụ trách.",
      },
      {
        q: "Làm sao để trải nghiệm dịch vụ?",
        a: "Bắt đầu bằng yêu cầu báo giá tại Liên hệ hoặc gọi 0938 961 012.",
      },
    ],
    internalLinks: ["/gioi-thieu", "/dich-vu", "/lien-he", "/du-an"],
  },
};

const wordCountPage = (page) => {
  const text = [
    page.lead,
    ...(page.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || [])]),
    ...(page.highlights || []),
    ...(page.faq || []).flatMap((f) => [f.q, f.a]),
  ].join("\n");
  return SEOChecklist.wordCount(text);
};

const enrichLastSection = (page, upgrade) => {
  const links = (upgrade.internalLinks || [])
    .slice(0, 4)
    .map((href) => {
      if (href.startsWith("/bai-viet/")) return `[đọc thêm](${href})`;
      if (href === "/lien-he") return `[liên hệ báo giá](${href})`;
      if (href === "/dich-vu") return `[tất cả dịch vụ](${href})`;
      return `[xem chi tiết](${href})`;
    })
    .join(", ");
  const cta = `Sẵn sàng triển khai? Gọi hotline 0938 961 012 hoặc xem ${links}. Tham khảo thêm quy định tại [Tổng cục Hải quan](https://www.customs.gov.vn/).`;
  const sections = [...(page.sections || [])];
  if (!sections.length) return page;
  const last = { ...sections[sections.length - 1] };
  const paras = [...(last.paragraphs || [])];
  if (!paras.some((p) => p.includes("0938 961 012"))) paras.push(cta);
  last.paragraphs = paras;
  sections[sections.length - 1] = last;
  return { ...page, sections };
};

let updated = 0;
["services", "about"].forEach((key) => {
  data[key] = (data[key] || []).map((page) => {
    const u = UPGRADES[page.slug];
    if (!u) return page;
    let next = {
      ...page,
      title: u.metaTitle,
      metaTitle: u.metaTitle,
      metaDescription: u.metaDescription.slice(0, 160),
      lead: u.lead,
      faq: u.faq,
      internalLinks: u.internalLinks,
      externalLinks: ["https://www.customs.gov.vn/", ...(page.externalLinks || [])].filter(
        (v, i, a) => a.indexOf(v) === i
      ),
    };
    next = enrichLastSection(next, u);
    next.wordCount = wordCountPage(next);
    updated++;
    console.log(`✓ ${page.slug} | title ${next.metaTitle.length}c | meta ${next.metaDescription.length}c | words ${next.wordCount}`);
    return next;
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Updated ${updated} money pages → ${dataPath}`);
