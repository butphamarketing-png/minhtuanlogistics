/**
 * Append 2 warehouse-rental articles to data/news-posts.json
 * Usage: node scripts/add-warehouse-rental-articles.js
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
    const paras = paragraphsByHeading[h] || [];
    paras.forEach((p) => {
      sections.push({ type: "p", text: p });
      body.push(p);
    });
  });
  return { sections, body };
};

const IMAGES = {
  rental: [
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  ],
  tmdt: [
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
};

const makeImages = (urls, keyword) =>
  urls.map((src, i) => ({
    src,
    alt: i === 0 ? `${keyword} — ảnh đại diện` : `${keyword} — hình ${i + 1}`,
  }));

const makePost = ({
  id,
  keyword,
  slug,
  title,
  metaDescription,
  excerpt,
  category = "warehouse",
  categoryLabel = "Kho bãi",
  headings,
  paragraphsByHeading,
  imageUrls,
  internalLinks,
  externalLinks,
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
    category,
    categoryLabel,
    date: "2026-08-11",
    dateLabel: "11/08/2026",
    dateModified: "2026-08-11",
    photo: images[0].src,
    cover: images[0].src,
    published: true,
    wordCount,
    headings,
    body,
    sections,
    images,
    internalLinks: internalLinks || [
      "/bai-viet/kho-bai-logistics",
      "/bai-viet/warehousing",
      "/bai-viet/fulfillment-logistics",
      "/dich-vu/kho-bai-logistics",
      "/lien-he",
    ],
    externalLinks: externalLinks || ["https://www.customs.gov.vn/", "https://zalo.me/0938961012"],
  };
};

const ARTICLES = [
  makePost({
    id: 1115,
    keyword: "cho thuê kho",
    slug: "cho-thue-kho",
    title: "Cho thuê kho 2026 — Ưu đãi giá hấp dẫn đa tầng | MINH TUẤN",
    metaDescription:
      "Cho thuê kho 2026: kho phân phối, kho mini, kho mát, kho tự quản. Ưu đãi giá hấp dẫn, quản lý A–Z. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho năm 2026 tại Minh Tuấn Logistics giúp doanh nghiệp tiết kiệm mặt bằng, chủ động tồn kho và vận hành xuất nhập minh bạch — từ kho phân phối, kho mini tự quản đến kho mát 18–25°C, giá ưu đãi theo thời hạn và hình thức thanh toán.",
    imageUrls: IMAGES.rental,
    headings: [
      "Cho thuê kho không lo về giá — ưu đãi đa tầng 2026",
      "4 mô hình cho thuê kho phù hợp mọi quy mô",
      "Kho phân phối — vận hành nhanh, báo cáo realtime",
      "Kho mini tự quản — kiot riêng từ 1m²",
      "Kho mát 18–25°C cho hàng nhạy nhiệt",
      "Kho tự quản diện tích lớn — setup văn phòng trong kho",
      "Bảng giá cho thuê kho tham khảo và cách tính phí",
      "Hạ tầng, PCCC, an ninh và tiện ích đi kèm",
      "Quy trình thuê kho 5 bước tại Minh Tuấn",
      "Câu hỏi thường gặp về cho thuê kho",
      "Vì sao chọn Minh Tuấn Logistics",
    ],
    paragraphsByHeading: {
      "Cho thuê kho không lo về giá — ưu đãi đa tầng 2026": [
        "Cho thuê kho đang là lựa chọn tối ưu khi mặt bằng nội thành đắt đỏ, nhân sự kho khó tuyển và doanh nghiệp cần linh hoạt tăng – giảm diện tích theo mùa vụ. Thay vì ký hợp đồng nhà xưởng dài hạn, bạn chỉ trả đúng phần diện tích và dịch vụ thực dùng.",
        "Năm 2026, Minh Tuấn triển khai gói cho thuê kho ưu đãi đa tầng: giảm phí lưu kho theo thời hạn, tặng tháng khi thuê dài, chiết khấu khi thanh toán một lần, miễn phí quản lý với số mã hàng nhỏ và giảm cước vận chuyển khi ghép tuyến từ kho.",
        "Dù bạn là shop online, hộ gia đình cần cất đồ, SME phân phối hay doanh nghiệp nhập khẩu chờ chia hàng, cho thuê kho giúp tách chi phí cố định thành chi phí biến đổi, dễ kiểm soát cash flow. Liên hệ [Zalo 0938 961 012](https://zalo.me/0938961012) để nhận báo giá trong 24 giờ.",
      ],
      "4 mô hình cho thuê kho phù hợp mọi quy mô": [
        "Minh Tuấn tách rõ 4 mô hình cho thuê kho để khách không trả thừa dịch vụ: kho phân phối (quản lý hộ A–Z), kho mini tự quản (kiot khóa riêng), kho mát ổn định 18–25°C và kho tự quản diện tích lớn có thể setup văn phòng.",
        "Kho phân phối phù hợp hàng luân chuyển nhanh, nhiều SKU, cần picking theo đơn. Kho mini hợp cá nhân, gia đình và shop mới. Kho mát dành mỹ phẩm, thực phẩm khô, rượu vang, hương liệu, thiết bị y tế. Kho tự quản hợp sản xuất nhẹ, đại lý cần sân bãi và xe cont vào tận cửa.",
        "Bạn có thể kết hợp nhiều mô hình cho thuê kho trong cùng hợp đồng — ví dụ giữ tồn chiến lược ở kho tự quản và đẩy hàng bán chạy sang kho phân phối gần tuyến giao. Xem thêm dịch vụ [kho bãi logistics](/dich-vu/kho-bai-logistics) để chọn đúng gói.",
      ],
      "Kho phân phối — vận hành nhanh, báo cáo realtime": [
        "Gói cho thuê kho phân phối hướng tới doanh nghiệp cần tốc độ: nhận hàng, lên kệ, soạn đơn, bàn giao vận chuyển trong cùng ca. Ưu đãi tham khảo 2026: giảm đến 50% phí thuê khi ký dài hạn, giá chỉ từ 65.000đ/m³, miễn phí quản lý dưới 20 mã hàng, miễn phí pallet theo thỏa thuận và giảm 15% cước vận chuyển ghép tuyến.",
        "Kho mới, kệ double deep, vị trí kết nối trung tâm TP.HCM, KCN/KCX, sân bay Tân Sơn Nhất và cảng Cát Lái — hạn chế cung đường cấm tải. Khách tùy chỉnh số khối (m³) và thời hạn theo nhu cầu, không bị khóa diện tích cứng.",
        "An ninh gồm PCCC, camera và bảo vệ 24/7. Quản lý A–Z trên phần mềm kho: xem tồn, phiếu xuất nhập và báo cáo realtime trên điện thoại. Xuất nhập xử lý khoảng 15 phút khi chứng từ đủ — khách không bắt buộc có mặt tại kho.",
        "Tiện ích đi kèm gói cho thuê kho phân phối: vận chuyển nội thành/liên tỉnh, bốc xếp, xe nâng, đóng gói, kiểm đếm, dán tem. Đây là mô hình gần với [fulfillment logistics](/bai-viet/fulfillment-logistics) nếu bạn bán đa kênh.",
      ],
      "Kho mini tự quản — kiot riêng từ 1m²": [
        "Cho thuê kho mini (tự quản) phục vụ cá nhân, gia đình, shop online và DN vừa & nhỏ cần không gian nhỏ, riêng tư, chủ động giờ lấy hàng. Diện tích từ 1m² đến vài chục m², thiết kế kiot hiện đại, mỗi khách một khóa.",
        "Ưu đãi theo thời hạn: thuê 03 tháng tặng +1 tháng phí; thuê 06 tháng tặng +2 tháng phí. Thanh toán một lần được chiết khấu thêm khoảng 10% (06 tháng) hoặc 15% (12 tháng). Giá chỉ từ 300.000đ/tháng — áp dụng kho dài hạn, thanh toán trước, còn chỗ.",
        "Bảo mật 4 lớp: kho/kiot riêng — khóa cá nhân — camera — bảo vệ 24/7. Miễn phí xe nâng, xe đẩy, thang máy chuyển hàng theo nội quy. Có thể đặt thêm bốc xếp, đóng gói, dán tem, vận chuyển nếu không muốn tự làm.",
        "Cho thuê kho mini giúp shop mới tránh thuê mặt bằng bán lẻ chỉ để chứa hàng. Bạn bán online, hàng nằm kho an toàn, lấy theo lịch — chi phí rõ từng tháng.",
      ],
      "Kho mát 18–25°C cho hàng nhạy nhiệt": [
        "Nhiều mặt hàng hỏng chất lượng nếu để kho thường mùa nóng. Gói cho thuê kho mát giữ 18–25°C, độ ẩm ≤ 50%, phù hợp mỹ phẩm, thực phẩm khô, bia rượu vang, hương liệu và một số thiết bị y tế.",
        "Ưu đãi tham khảo: giảm đến 20% phí thuê, chỉ từ 180.000đ/m³/tháng, miễn phí quản lý dưới 20 mã hàng, miễn phí pallet và giảm 15% cước vận chuyển khi đi cùng dịch vụ giao nhận Minh Tuấn.",
        "Dàn lạnh công suất lớn, hơi lạnh phân bổ đều; có phương án dự phòng khi mất điện. PCCC hiện đại, camera và bảo vệ 24/24. Quy trình xuất nhập giống kho phân phối: báo cáo realtime, xử lý nhanh, khách không cần trực kho.",
        "Trước khi ký cho thuê kho mát, hãy gửi TDS/nhiệt độ bảo quản nhà sản xuất. Đội ngũ sẽ xác nhận kho đủ điều kiện hay cần kho lạnh chuyên sâu hơn — tránh nhận hàng rồi mới phát hiện sai dải nhiệt.",
      ],
      "Kho tự quản diện tích lớn — setup văn phòng trong kho": [
        "Doanh nghiệp cần mặt bằng sản xuất nhẹ, đóng gói lại hoặc làm điểm trung chuyển container nên chọn cho thuê kho tự quản theo m². Giá siêu tốt tham khảo từ 130.000đ/m²/tháng, có ưu đãi khi ký dài hạn.",
        "Hệ thống kho Minh Tuấn tại TP.HCM kết nối trục đường lớn, sân bãi rộng, xe cont vào tận kho tùy điểm. Hạ tầng: PCCC tự động, điện 3 pha, nước sinh hoạt. Pháp lý: giấy phép kinh doanh và thẩm duyệt PCCC theo điểm kho.",
        "Linh hoạt tối đa: setup góc văn phòng, bàn đóng gói, kệ riêng trong phần diện tích thuê. An ninh camera + bảo vệ 24/7. Phù hợp đại lý, xưởng nhỏ, đội giao nhận cần bãi overnight.",
        "Cho thuê kho tự quản khác kho phân phối ở chỗ khách tự sắp xếp nhân sự và quy trình nội bộ; Minh Tuấn cung cấp mặt bằng, hạ tầng và tiện ích. Nếu sau này muốn bàn giao vận hành, có thể chuyển sang gói [kho bãi logistics](/bai-viet/kho-bai-logistics) hoặc 3PL.",
      ],
      "Bảng giá cho thuê kho tham khảo và cách tính phí": [
        "Giá cho thuê kho phụ thuộc loại kho (thường / mát / tự quản), đơn vị tính (m², m³ hay pallet), thời hạn, số SKU, tần suất xuất nhập và dịch vụ gia tăng. Bảng dưới là mức “chỉ từ” để lập ngân sách — báo giá chính thức theo khảo sát hàng và chỗ trống.",
        "Kho phân phối: từ 65.000đ/m³. Kho mát: từ 180.000đ/m³/tháng. Kho mini: từ 300.000đ/tháng. Kho tự quản: từ 130.000đ/m²/tháng. Thuê 03–06 tháng được tặng tháng; thanh toán 06–12 tháng một lần được chiết khấu 10–15%.",
        "Phí phát sinh thường gặp: overtime ngoài giờ, kiểm đếm chi tiết, dán lại tem, xử lý hàng lỗi, lưu đêm xe, giao hỏa tốc. Hãy yêu cầu tách dòng phí trong báo giá cho thuê kho để CFO duyệt nhanh — Minh Tuấn cam kết minh bạch, không phí ẩn.",
        "So sánh báo giá phải cùng điều kiện: cùng loại hàng, cùng dải nhiệt, cùng SLA xuất đơn và cùng điểm giao. Giá rẻ nhưng thiếu PCCC, camera hoặc phần mềm tồn kho thường đội chi phí thất thoát về sau.",
      ],
      "Hạ tầng, PCCC, an ninh và tiện ích đi kèm": [
        "Một hợp đồng cho thuê kho chỉ bền khi hạ tầng đạt: nền chịu tải, thoát nước, điện ổn định, PCCC tự động/thẩm duyệt, lối xe nâng và sân quay đầu. Minh Tuấn ưu tiên các điểm kho đáp ứng vận hành thực tế, không chỉ “có chỗ để hàng”.",
        "An ninh 24/7, phân quyền ra vào, camera lưu hình. Hàng giá trị cao có thể thỏa thuận khu vực hạn chế. Tiện ích: xe nâng, pallet, bàn pack, cân, máy quấn màng, hỗ trợ bốc xếp theo ca.",
        "Kết nối vận tải: kéo hàng từ cảng/sân bay vào kho, giao nội thành và liên tỉnh. Đây là lợi thế khi cho thuê kho gắn với chuỗi [vận chuyển đường bộ](/bai-viet/van-chuyen-duong-bo) và [xuất nhập khẩu](/dich-vu/xuat-nhap-khau) — một đầu mối thay vì thuê rời 3 nhà cung cấp.",
      ],
      "Quy trình thuê kho 5 bước tại Minh Tuấn": [
        "Bước 1 — Khảo sát nhu cầu: loại hàng, nhiệt độ, số SKU, sản lượng tháng, thời hạn, muốn tự quản hay gửi quản lý. Bước 2 — Đề xuất mô hình cho thuê kho và chỗ trống phù hợp.",
        "Bước 3 — Báo giá tách dòng + lịch onboard (dán mã, nhập tồn đầu). Bước 4 — Ký hợp đồng, nhận hàng, đối soát biên bản. Bước 5 — Vận hành hàng ngày, báo cáo định kỳ, tối ưu slot khi sản lượng đổi.",
        "Chuẩn bị sẵn: danh mục SKU, kích thước/thể tích thùng, ảnh hàng, yêu cầu FIFO/FEFO, đầu mối xuất đơn. Càng rõ đầu vào, cho thuê kho onboard càng nhanh — thường đo đếm và lên kệ trong 1–2 ngày làm việc với lô vừa.",
      ],
      "Câu hỏi thường gặp về cho thuê kho": [
        "Cho thuê kho có nhận hàng lẻ không? Có — kho mini và kho phân phối nhận từ vài thùng đến vài trăm m³. Hàng nguy hiểm, hàng cần kho lạnh âm sâu sẽ được tư vấn điểm chuyên biệt.",
        "Có được vào kho lấy hàng ngoài giờ? Kho tự quản/mini theo nội quy từng điểm; kho phân phối ưu tiên xuất hộ theo lệnh để kiểm soát an ninh. Hàng gửi quản lý có thể xuất trong ngày khi lệnh đủ trước cut-off.",
        "Hợp đồng cho thuê kho tối thiểu bao lâu? Linh hoạt theo tháng; ưu đãi giá tốt thường từ 03 tháng trở lên. Thanh toán một lần 06–12 tháng được chiết khấu.",
        "Mất mát hàng xử lý thế nào? Kho quản lý hộ đối soát tồn theo phần mềm và camera; kho tự quản khách tự chịu trách nhiệm khu vực khóa riêng. Điều khoản bồi thường ghi rõ trong hợp đồng.",
      ],
      "Vì sao chọn Minh Tuấn Logistics": [
        "Minh Tuấn không chỉ cho thuê kho trống: chúng tôi gắn kho với hải quan, biển – bộ – hàng không để SME tại TP.HCM có một đầu mối từ hàng về cảng đến lúc giao khách. Báo giá 24 giờ, chi phí tách dòng, tiến độ cập nhật.",
        "Đội ngũ hiểu mùa vụ Tết, 11.11, Tết Nguyên đán — chủ động giữ slot cho thuê kho trước cao điểm. Bạn gửi forecast, chúng tôi giữ sức chứa và nhân sự soạn hàng.",
        "Nhận tư vấn miễn phí: gọi/Zalo [0938 961 012](https://zalo.me/0938961012) hoặc form [liên hệ](/lien-he). Nêu loại hàng, số m²/m³ dự kiến và thời hạn — nhận phương án cho thuê kho kèm ước tính chi phí trong ngày làm việc.",
      ],
    },
  }),

  makePost({
    id: 1116,
    keyword: "cho thuê kho TMĐT",
    slug: "cho-thue-kho-tmdt",
    title: "Cho thuê kho TMĐT 2026 — Fulfillment Shopee Lazada TikTok | MINH TUẤN",
    metaDescription:
      "Cho thuê kho TMĐT 2026: lưu kho, pick-pack, quản lý tồn Shopee, Lazada, TikTok Shop. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Cho thuê kho TMĐT giúp shop Shopee, Lazada, TikTok Shop, Tiki và website tự vận hành hết cảnh hết hàng – trễ SLA – lệch tồn: Minh Tuấn nhận hàng, lưu kho, soạn đơn, đóng gói, bàn giao ĐVVC và xử lý hoàn, để chủ shop tập trung ads và chăm khách.",
    imageUrls: IMAGES.tmdt,
    internalLinks: [
      "/bai-viet/cho-thue-kho",
      "/bai-viet/fulfillment-logistics",
      "/bai-viet/dich-vu-3pl",
      "/dich-vu/kho-bai-logistics",
      "/lien-he",
    ],
    headings: [
      "Cho thuê kho TMĐT là gì và khác kho thường chỗ nào?",
      "Vì sao shop Shopee, Lazada, TikTok cần cho thuê kho TMĐT",
      "Quy trình quản lý hàng hóa đa sàn A–Z",
      "Dịch vụ đi kèm: pick-pack, COD, hoàn hàng, đổi trả",
      "Tích hợp vận hành đa kênh và báo cáo tồn",
      "Chi phí cho thuê kho TMĐT và cách tối ưu",
      "Tự giữ kho nhà so với gửi kho 3PL",
      "Checklist onboard cho chủ shop SME",
      "Câu hỏi thường gặp",
      "Bắt đầu cho thuê kho TMĐT với Minh Tuấn",
    ],
    paragraphsByHeading: {
      "Cho thuê kho TMĐT là gì và khác kho thường chỗ nào?": [
        "Cho thuê kho TMĐT (kho fulfillment sàn thương mại điện tử) là gói lưu trữ + vận hành đơn: nhận hàng NCC, dán SKU, soạn đúng biến thể, đóng gói theo tiêu chuẩn sàn, in vận đơn, bàn giao Shopee Xpress / GHN / GHTK / J&T / Ninja Van và ghi nhận hoàn về.",
        "Khác [cho thuê kho](/bai-viet/cho-thue-kho) tự quản chỉ thuê mét vuông, cho thuê kho TMĐT tính theo chỗ chứa (thùng/pallet) cộng phí pick theo dòng đơn. Shop không cần nhân viên kho, không thức đêm in bill, không chạy ra bưu cục giờ cut-off.",
        "Năm 2026, sàn siết SLA lấy hàng và tỷ lệ giao thành công. Cho thuê kho TMĐT giúp shop giữ rating, giảm hoàn do đóng sai, và scale mùa sale mà không thuê thêm mặt bằng. Minh Tuấn thiết kế gói cho SME tại TP.HCM — gần trục lấy hàng của các ĐVVC.",
      ],
      "Vì sao shop Shopee, Lazada, TikTok cần cho thuê kho TMĐT": [
        "Shop tự đóng tại nhà thường gặp: lệch tồn 2–3 sàn, hết size khi livestream, đóng nhầm màu, bill in sai COD, không còn chỗ chứa hàng hoàn. Cho thuê kho TMĐT gom một tồn thật, chia kênh ảo theo policy từng sàn.",
        "TikTok Shop và livestream cần hàng sẵn trong kho để chốt đơn trong phiên. Shopee/Lazada phạt trễ lấy hàng. Một kho fulfillment xử lý đơn đêm và sáng sớm giúp shop không mất xu hoặc bị hạn chế gian hàng.",
        "Khi nhập khẩu lô lớn, hàng về kho Minh Tuấn luôn — vừa làm điểm [kho bãi logistics](/dich-vu/kho-bai-logistics) sau thông quan, vừa tách thùng lên kệ TMĐT. Một đầu mối từ cảng đến tay người mua, giảm bốc xếp trung gian.",
        "Cho thuê kho TMĐT cũng hợp brand bán website + Facebook + Zalo Shop: cùng một tồn, nhiều kênh xuất. Báo cáo SKU chậm để bạn dừng ads đúng lúc, tránh chôn vốn.",
      ],
      "Quy trình quản lý hàng hóa đa sàn A–Z": [
        "Inbound: shop báo ASN (danh sách SKU, số lượng, lô). Kho nhận, đếm, chụp lệch, dán barcode nội bộ nếu hàng chưa có mã. Tồn chỉ lên hệ thống khi đối soát xong — tránh bán hàng chưa có thật.",
        "Lưu trữ: FEFO với mỹ phẩm/thực phẩm có HSD; FIFO với hàng thường. Slot theo ABC — SKU bán chạy gần bàn pack. Đây là phần cốt lõi khi cho thuê kho TMĐT: tốc độ pick quyết định SLA.",
        "Outbound: nhận file/đơn từ sàn hoặc sheet tổng; soạn, chụp (nếu yêu cầu), đóng gói chống sốc, dán vận đơn, phân chuyến theo ĐVVC. Cut-off thống nhất để tài xế lấy một lần, giảm sót bill.",
        "Hoàn và xử lý sự cố: hàng hoàn về được kiểm, phân loại bán lại / lỗi / mất phụ kiện, cập nhật tồn. Shop xem phiếu trên báo cáo tuần. Cho thuê kho TMĐT không kết thúc khi shipper lấy hàng — vòng đời đơn gồm cả chiều ngược.",
      ],
      "Dịch vụ đi kèm: pick-pack, COD, hoàn hàng, đổi trả": [
        "Gói chuẩn cho thuê kho TMĐT gồm: lưu kho, pick theo dòng, đóng carton/túi bóng khí, in bill, bàn giao ĐVVC. Gói mở rộng: dán quà tặng, card cảm ơn, kiểm pin/serial, đóng gỗ với hàng dễ vỡ, giao B2B theo PO riêng.",
        "COD và đối soát: kho không giữ tiền COD (ĐVVC hoàn về ví sàn/shop), nhưng hỗ trợ đối chiếu đơn giao thành công / hoàn / khiếu nại để kế toán shop khớp sổ. Giảm tình trạng “sàn báo giao, kho báo còn”.",
        "Đổi trả nội bộ: khách gửi hoàn về kho Minh Tuấn thay vì nhà riêng chủ shop. Hàng đạt QC được nhập lại tồn trong ngày. Mô hình này giữ trải nghiệm chuyên nghiệp khi brand lớn dần — xem thêm [dịch vụ 3PL](/bai-viet/dich-vu-3pl).",
      ],
      "Tích hợp vận hành đa kênh và báo cáo tồn": [
        "Shop có thể đẩy đơn bằng file Excel/CSV hằng ngày hoặc kết nối theo thỏa thuận kỹ thuật. Mục tiêu của cho thuê kho TMĐT là một nguồn tồn duy nhất: Shopee, Lazada, TikTok, Tiki không bán trùng một chiếc áo.",
        "Báo cáo gửi định kỳ: tồn theo SKU, đơn đã pick, đơn chờ lấy, hàng hoàn, SKU sắp hết, hàng lưu quá ngày. Chủ shop ra quyết định nhập thêm hay flash sale dựa trên số liệu kho, không phải cảm tính.",
        "Với livestream, kho giữ “buffer nóng” gần bàn pack. Khi phiên tăng đột biến, ưu tiên soạn đơn phiên đó trước. Đây là khác biệt giữa cho thuê kho TMĐT chuyên sàn và kho gửi đồ thông thường.",
      ],
      "Chi phí cho thuê kho TMĐT và cách tối ưu": [
        "Chi phí cho thuê kho TMĐT thường gồm: phí lưu (thùng/pallet/tháng), phí inbound, phí pick (theo dòng hoặc theo đơn), vật tư đóng gói, phụ phí đơn lệch/kiểm chi tiết, lưu hàng chậm xoay. Minh Tuấn tách dòng để shop thấy đơn vị kinh tế từng SKU.",
        "Tối ưu bằng cách chuẩn hóa SKU (một mã một biến thể), dán mã trước khi gửi kho, đóng thùng đồng nhất, forecast trước 9.9 / 11.11 / Tết. Hàng chậm nên rút về kho tự quản giá rẻ hơn — kết hợp [cho thuê kho](/bai-viet/cho-thue-kho) mini/tự quản với kho fulfillment.",
        "Đừng chỉ so giá pick 1.000đ. Hãy cộng tỷ lệ đóng sai, đơn trễ cut-off và công sức tự đi bưu cục. Cho thuê kho TMĐT thắng khi giảm hoàn và giữ xu sàn — thường lớn hơn vài nghìn đồng phí soạn hộ.",
        "Báo giá trong 24 giờ khi có: số SKU, đơn/ngày trung bình và peak, kích thước thùng, có hàng mát hay không. Nhắn [Zalo 0938 961 012](https://zalo.me/0938961012).",
      ],
      "Tự giữ kho nhà so với gửi kho 3PL": [
        "Tự kho nhà: rẻ mặt bằng ban đầu, chủ động đóng gói sáng tạo, nhưng vướng giờ lấy hàng ĐVVC, hàng chiếm phòng, khó tuyển người pack đêm sale. Scale 200–500 đơn/ngày thường gãy.",
        "Cho thuê kho TMĐT / 3PL: trả phí biến đổi theo đơn, có ca đêm, có camera đối soát, có chỗ chứa hoàn. Đổi lại shop phải chuẩn hóa SKU và chấp nhận SOP đóng gói chung (vẫn gắn card/sticker brand nếu đăng ký).",
        "Mốc nên chuyển: hết chỗ nhà, bắt đầu bán 2+ sàn, livestream đều, hoặc nhập nguyên container. Lúc đó cho thuê kho TMĐT rẻ hơn thuê nhân sự + mặt bằng + phạt sàn.",
      ],
      "Checklist onboard cho chủ shop SME": [
        "Chuẩn bị file master SKU: mã, tên, màu/size, barcode, giá khai (nếu cần), HSD, ảnh. In sẵn mã nếu có. Đóng thùng ghi rõ số lượng ngoài thùng — inbound cho thuê kho TMĐT nhanh gấp đôi khi thùng không phải mở đếm từng cái.",
        "Chốt ĐVVC mặc định từng sàn, mẫu đóng gói (túi / hộp / chèn), giờ cắt đơn mỗi ngày, người duyệt đơn lệch địa chỉ. Chỉ định 1 đầu mối shop (Zalo/email) để kho không hỏi 3 người khác nhau.",
        "Chạy tuần thử 20–50 đơn trước khi đổ cả kho. Đối soát tồn và 1–2 đơn mystery. Onboard xong mới bật ads lớn. Minh Tuấn hướng dẫn checklist này khi ký cho thuê kho TMĐT.",
      ],
      "Câu hỏi thường gặp": [
        "Cho thuê kho TMĐT nhận hàng mỹ phẩm, thực phẩm khô không? Có, nếu không cần kho đông lạnh; hàng mát 18–25°C xếp sang khu riêng. Hàng nguy hiểm, pin rời số lượng lớn cần khai báo trước.",
        "Có lấy hàng giúp từ kho NCC / sân bay không? Có — kết hợp inbound với vận tải nội địa. Hàng nhập khẩu đi luôn vào kệ TMĐT sau thông quan.",
        "Shop ở tỉnh khác gửi kho TP.HCM được không? Được. Nhiều brand gửi hàng về HCM vì mật độ ĐVVC và khách miền Nam. Cho thuê kho TMĐT tại HCM tối ưu leadtime nội thành.",
        "Hủy hợp đồng hàng còn trong kho? Shop book lịch rút hàng hoặc chuyển kho; phí lưu tính đến ngày bàn giao biên bản. Điều khoản ghi rõ khi ký.",
      ],
      "Bắt đầu cho thuê kho TMĐT với Minh Tuấn": [
        "Gửi danh mục SKU, sản lượng đơn/ngày và ảnh kho hiện tại (nếu có). Minh Tuấn đề xuất chỗ chứa, SLA pick và ước tính phí tháng đầu. Không cần chuyển hết hàng — có thể onboard theo đợt SKU bán chạy.",
        "Bạn đã có hợp đồng [cho thuê kho](/bai-viet/cho-thue-kho) tự quản có thể nâng cấp một phần diện tích sang fulfillment. Một điểm kho, hai cách vận hành.",
        "Liên hệ [0938 961 012](https://zalo.me/0938961012) hoặc [trang liên hệ](/lien-he). Cho thuê kho TMĐT năm 2026 của Minh Tuấn hướng tới shop muốn chuyên nghiệp hóa vận hành mà không xây kho riêng.",
      ],
    },
  }),
];

const main = () => {
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  const existingSlugs = new Set(posts.map((p) => p.slug));
  const maxId = posts.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0);

  const toAdd = [];
  for (const article of ARTICLES) {
    if (existingSlugs.has(article.slug)) {
      console.log(`Skip existing slug: ${article.slug}`);
      continue;
    }
    const next = { ...article, id: Math.max(article.id, maxId + 1 + toAdd.length) };
    const report = analyze(next, { existingPosts: posts.concat(toAdd), currentId: next.id });
    console.log(`SEO ${next.slug}: score=${report.score} canPublish=${report.canPublish} words=${next.wordCount}`);
    if (!report.canPublish) {
      report.items
        .filter((i) => !i.ok)
        .forEach((i) => console.log(`  - FAIL: ${i.message}`));
    }
    toAdd.push(next);
    existingSlugs.add(next.slug);
  }

  if (!toAdd.length) {
    console.log("No new articles to add.");
    return;
  }

  const merged = posts.concat(toAdd);
  const tmp = `${postsPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(merged), "utf8");
  fs.renameSync(tmp, postsPath);

  console.log(`Added ${toAdd.length} articles:`);
  toAdd.forEach((a) => console.log(` - #${a.id} ${a.slug} (${a.wordCount} words)`));
  console.log(`Total posts: ${merged.length}`);
};

main();
