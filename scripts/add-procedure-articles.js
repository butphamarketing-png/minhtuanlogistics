/**
 * Append 6 import/export procedure articles to data/news-posts.json
 * Usage: node scripts/add-procedure-articles.js
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
  toys: [
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
  ppe: [
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  ],
  solar: [
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
  led: [
    "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  ],
  agri: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  ],
  granite: [
    "https://images.unsplash.com/photo-1615874959474-d125bc7524b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
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
  category = "customs",
  categoryLabel = "Hải quan",
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
    category,
    categoryLabel,
    date: "2026-07-31",
    dateLabel: "31/07/2026",
    dateModified: "2026-07-31",
    photo: images[0].src,
    cover: images[0].src,
    published: true,
    wordCount,
    headings,
    body,
    sections,
    images,
    internalLinks: [
      "/bai-viet/khai-bao-hai-quan",
      "/bai-viet/thong-quan-hang-hoa",
      "/bai-viet/xuat-nhap-khau",
      "/dich-vu/xuat-nhap-khau",
      "/lien-he",
    ],
    externalLinks: ["https://www.customs.gov.vn/", "https://zalo.me/0938961012"],
  };
};

const ARTICLES = [
  makePost({
    id: 1107,
    keyword: "quy trình nhập khẩu đồ chơi trẻ em",
    slug: "quy-trinh-nhap-khau-do-choi-tre-em",
    title: "Quy trình nhập khẩu đồ chơi trẻ em 2026 — Checklist A–Z | MINH TUẤN",
    metaDescription:
      "Quy trình nhập khẩu đồ chơi trẻ em 2026: hợp quy, nhãn phụ, mã HS, thông quan và checklist thực tế. Minh Tuấn Logistics — báo giá 24h, Zalo 0938 961 012.",
    excerpt:
      "Quy trình nhập khẩu đồ chơi trẻ em giúp doanh nghiệp chuẩn hóa hợp quy, nhãn phụ tiếng Việt, mã HS và mốc thông quan trước khi hàng vào kênh bán lẻ hoặc thương mại điện tử.",
    imageUrls: IMAGES.toys,
    headings: [
      "Quy trình nhập khẩu đồ chơi trẻ em là gì?",
      "Phân loại hàng và mã HS thường gặp",
      "Yêu cầu hợp quy, an toàn và nhãn phụ",
      "Chứng từ cần chuẩn bị trước khi hàng về",
      "Các bước quy trình nhập khẩu đồ chơi trẻ em",
      "Phương thức vận chuyển phù hợp",
      "Chi phí và thuế cần dự trù",
      "Rủi ro thường gặp và cách phòng tránh",
      "Checklist dành cho SME tại TP.HCM",
      "Câu hỏi thường gặp",
      "Vì sao chọn Minh Tuấn Logistics",
    ],
    paragraphsByHeading: {
      "Quy trình nhập khẩu đồ chơi trẻ em là gì?": [
        "Quy trình nhập khẩu đồ chơi trẻ em là chuỗi bước từ chọn nhà cung cấp, kiểm tra tiêu chuẩn an toàn, chuẩn bị chứng từ, [khai báo hải quan](/bai-viet/khai-bao-hai-quan) đến thông quan và giao kho Việt Nam.",
        "Khác hàng tiêu dùng thông thường, đồ chơi gắn yêu cầu hợp quy, cảnh báo độ tuổi và nhãn phụ tiếng Việt. Nếu bỏ qua khâu này, lô hàng dễ bị kiểm hóa kéo dài hoặc yêu cầu tái xuất.",
        "Năm 2026, doanh nghiệp nhập đồ chơi từ Trung Quốc, Thái Lan, Hàn Quốc hoặc EU cần lập SOP rõ ràng để đồng bộ mua hàng, kế toán và logistics. Minh Tuấn Logistics hỗ trợ khép quy trình nhập khẩu đồ chơi trẻ em theo checklist thực tế.",
      ],
      "Phân loại hàng và mã HS thường gặp": [
        "Trước khi book tàu/bay, hãy phân nhóm: đồ chơi điện tử, đồ chơi nhựa, đồ chơi gỗ, xe đồ chơi, bộ lắp ráp và hàng có pin/sạc. Mỗi nhóm có thể khác mã HS và mức kiểm tra.",
        "Mã HS sai là nguyên nhân phổ biến làm chậm quy trình nhập khẩu đồ chơi trẻ em. Doanh nghiệp nên đối chiếu catalog NCC với tên hàng khai báo, tránh mô tả chung chung kiểu “đồ chơi các loại”.",
        "Với hàng kèm pin lithium, cần khai báo riêng và tuân thủ quy định vận chuyển hàng nguy hiểm/hạn chế. Tra cứu thêm trên cổng [Tổng cục Hải quan Việt Nam](https://www.customs.gov.vn/) trước khi chốt đơn lớn.",
      ],
      "Yêu cầu hợp quy, an toàn và nhãn phụ": [
        "Đồ chơi trẻ em thường thuộc diện hàng phải công bố hợp quy hoặc chứng nhận phù hợp tiêu chuẩn an toàn trước khi lưu thông. Doanh nghiệp cần xác nhận phạm vi áp dụng theo từng SKU.",
        "Nhãn phụ tiếng Việt phải thể hiện tên hàng, xuất xứ, thông tin nhà nhập khẩu, hướng dẫn sử dụng và cảnh báo độ tuổi. Thiếu nhãn phụ là lý do phổ biến khiến quy trình nhập khẩu đồ chơi trẻ em bị dừng ở khâu kiểm tra.",
        "Nên yêu cầu NCC gửi test report, COA (nếu có) và ảnh bao bì trước khi sản xuất hàng loạt. Việc này giúp giảm chi phí sửa nhãn sau khi hàng đã về cảng.",
      ],
      "Chứng từ cần chuẩn bị trước khi hàng về": [
        "Bộ chứng từ tối thiểu gồm commercial invoice, packing list, vận đơn (B/L hoặc AWB), hợp đồng mua bán và chứng từ hợp quy/nhãn phụ theo yêu cầu mặt hàng.",
        "Doanh nghiệp nên chuẩn hóa file Excel danh mục SKU, đơn giá, chất liệu và độ tuổi khuyến nghị. File này hỗ trợ [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa) nhanh hơn khi bị yêu cầu giải trình.",
        "Nếu đi đường biển LCL/FCL hoặc đường hàng không, hãy gửi scan chứng từ cho đơn vị logistics trước cut-off ít nhất 24–48 giờ để rà lỗi sớm trong quy trình nhập khẩu đồ chơi trẻ em.",
      ],
      "Các bước quy trình nhập khẩu đồ chơi trẻ em": [
        "Bước 1 — Tư vấn mã HS & điều kiện nhập: cung cấp catalog, ảnh mẫu, chất liệu, có/không pin. Đội ngũ đề xuất checklist hợp quy và phương án vận chuyển.",
        "Bước 2 — Đặt hàng & kiểm tra bao bì: chốt nhãn phụ, cảnh báo và đóng gói chống vỡ. Bước 3 — Book mode (biển/bay) theo ETA bán hàng.",
        "Bước 4 — Chuẩn bị tờ khai và nộp hồ sơ. Bước 5 — [khai báo hải quan](/bai-viet/khai-bao-hai-quan), kiểm hóa nếu có. Bước 6 — Nộp thuế, nhận hàng, giao kho hoặc chia bill đa điểm.",
        "Bước 7 — Lưu chứng từ cho kiểm tra sau thông quan. Quy trình nhập khẩu đồ chơi trẻ em chỉ hoàn tất khi kế toán và kho đã đối soát đủ bộ hồ sơ.",
      ],
      "Phương thức vận chuyển phù hợp": [
        "Hàng mẫu hoặc hàng sự kiện nên đi hàng không để giữ lịch launch. Lô lớn, hàng nặng thể tích nên đi [vận chuyển đường biển](/bai-viet/van-chuyen-duong-bien) FCL/LCL để tối ưu unit cost.",
        "Đóng gói carton gia cố, chèn xốp và dán hướng mũi tên rất quan trọng với đồ chơi lắp ráp và hàng dễ vỡ. Bảo hiểm nên cân nhắc với lô giá trị cao.",
        "Minh Tuấn tư vấn multimodal khi cần: bay một phần mẫu, biển phần số lượng lớn trong cùng quy trình nhập khẩu đồ chơi trẻ em để cân bằng tốc độ và chi phí.",
      ],
      "Chi phí và thuế cần dự trù": [
        "Landed cost gồm cước vận chuyển, phụ phí, thuế nhập khẩu, GTGT, phí khai thuê, kiểm hóa phát sinh, lưu container/kho và chi phí hợp quy/nhãn nếu chưa hoàn tất từ nước ngoài.",
        "So sánh báo giá phải cùng Incoterm, cùng điểm nhận/giao và cùng phạm vi dịch vụ. Giá cước rẻ nhưng thiếu khâu hợp quy thường làm đội chi phí cuối trong quy trình nhập khẩu đồ chơi trẻ em.",
        "Yêu cầu tách dòng phí rõ để CFO duyệt nhanh. Minh Tuấn gửi báo giá trong 24 giờ làm việc khi thông tin đầu vào đủ — liên hệ [Zalo 0938 961 012](https://zalo.me/0938961012).",
      ],
      "Rủi ro thường gặp và cách phòng tránh": [
        "Rủi ro 1: sai HS code hoặc mô tả hàng. Cách xử lý: chuẩn hóa catalog đa ngữ và đối chiếu trước khi sản xuất.",
        "Rủi ro 2: thiếu hợp quy/nhãn phụ. Cách xử lý: hoàn tất hồ sơ trước khi hàng rời cảng xếp. Rủi ro 3: pin lithium khai thiếu — cần khai báo đúng và chọn mode phù hợp.",
        "Rủi ro 4: hàng về dồn trước Tết hoặc mùa tựu trường. Hãy book sớm và giữ buffer tồn kho. Đây là phần bắt buộc trong quy trình nhập khẩu đồ chơi trẻ em chuyên nghiệp.",
      ],
      "Checklist dành cho SME tại TP.HCM": [
        "SME tại TP.HCM nên giữ một đầu mối logistics gần cảng Cát Lái và sân bay Tân Sơn Nhất để rút ngắn thời gian lấy hàng sau thông quan.",
        "Lập SOP nội bộ: ai chốt mẫu nhãn, ai giữ chứng từ, ai đối soát thuế. Thiếu phân công khiến quy trình nhập khẩu đồ chơi trẻ em lệch dù đối tác làm đúng lịch.",
        "Kết hợp tư vấn [xuất nhập khẩu](/bai-viet/xuat-nhap-khau) nếu đội ngũ nội bộ chưa có kinh nghiệm mặt hàng có điều kiện.",
      ],
      "Câu hỏi thường gặp": [
        "Đồ chơi có bắt buộc hợp quy không? Phần lớn mặt hàng đồ chơi trẻ em thuộc diện quản lý chuyên ngành; cần xác nhận theo từng SKU trước khi nhập.",
        "Nhập mẫu có khác nhập kinh doanh không? Có — loại hình tờ khai, trị giá và mục đích sử dụng khác nhau. Khai sai loại hình dễ phát sinh xử lý sau.",
        "Thời gian thông quan mất bao lâu? Nếu hồ sơ đủ và không kiểm hóa sâu, có thể hoàn tất nhanh; thiếu nhãn/hợp quy sẽ kéo dài quy trình nhập khẩu đồ chơi trẻ em đáng kể.",
      ],
      "Vì sao chọn Minh Tuấn Logistics": [
        "Minh Tuấn Logistics đồng hành doanh nghiệp từ tư vấn HS code, checklist hợp quy đến [khai báo hải quan](/bai-viet/khai-bao-hai-quan), vận chuyển và giao kho.",
        "Đội ngũ gần TP.HCM hỗ trợ phản hồi nhanh qua Zalo, minh bạch chi phí và cập nhật mốc ETA. Bạn có thể gửi catalog để nhận checklist riêng cho quy trình nhập khẩu đồ chơi trẻ em.",
        "Liên hệ ngay qua [/lien-he](/lien-he) hoặc [Zalo 0938 961 012](https://zalo.me/0938961012) để nhận báo giá trong 24 giờ làm việc.",
      ],
    },
  }),

  makePost({
    id: 1108,
    keyword: "quy trình nhập khẩu đồ bảo hộ lao động",
    slug: "quy-trinh-nhap-khau-do-bao-ho-lao-dong",
    title: "Quy trình nhập khẩu đồ bảo hộ lao động 2026 — Hướng dẫn A–Z | MINH TUẤN",
    metaDescription:
      "Quy trình nhập khẩu đồ bảo hộ lao động 2026: mã HS, chứng nhận, nhãn phụ, thông quan và tối ưu chi phí. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Quy trình nhập khẩu đồ bảo hộ lao động giúp nhà thầu, nhà máy và nhà phân phối chuẩn hóa chứng từ, tiêu chuẩn kỹ thuật và lịch về hàng theo dự án.",
    imageUrls: IMAGES.ppe,
    headings: [
      "Tổng quan quy trình nhập khẩu đồ bảo hộ lao động",
      "Phân nhóm PPE và lưu ý mã HS",
      "Tiêu chuẩn, chứng nhận và nhãn hàng",
      "Bộ chứng từ cần có",
      "Các bước thực hiện từ đặt hàng đến giao kho",
      "Vận chuyển và đóng gói",
      "Chi phí landed cost cần tính",
      "Rủi ro kiểm hóa và sai chứng từ",
      "Gợi ý cho nhà thầu và nhà máy",
      "FAQ về nhập khẩu PPE",
      "Minh Tuấn hỗ trợ như thế nào",
    ],
    paragraphsByHeading: {
      "Tổng quan quy trình nhập khẩu đồ bảo hộ lao động": [
        "Quy trình nhập khẩu đồ bảo hộ lao động (PPE) bao gồm mũ, găng, giày bảo hộ, kính, khẩu trang công nghiệp, quần áo chống hóa chất và thiết bị gắn tiêu chuẩn an toàn.",
        "Doanh nghiệp cần xác định hàng dùng cho dự án nội bộ hay phân phối thương mại, vì điều này ảnh hưởng loại hình tờ khai và hồ sơ kèm theo.",
        "Minh Tuấn Logistics hỗ trợ [xuất nhập khẩu](/bai-viet/xuat-nhap-khau) PPE theo checklist, giúp giảm thời gian chờ tại cảng và kiểm soát landed cost.",
      ],
      "Phân nhóm PPE và lưu ý mã HS": [
        "PPE đa dạng về chất liệu và công dụng. Găng chống cắt, giày mũi thép, mặt nạ lọc độc hay quần áo chống tia lửa có thể thuộc nhóm HS khác nhau.",
        "Trong quy trình nhập khẩu đồ bảo hộ lao động, hãy tách dòng hàng theo chức năng và chất liệu thay vì gom “đồ bảo hộ các loại”. Việc này giảm rủi ro phân loại sai.",
        "Hàng gắn linh kiện điện tử hoặc pin (đèn đội đầu, thiết bị đo) cần khai báo bổ sung và có thể chịu kiểm tra kỹ thuật khác.",
      ],
      "Tiêu chuẩn, chứng nhận và nhãn hàng": [
        "Nhiều mặt hàng PPE yêu cầu chứng nhận theo tiêu chuẩn quốc tế (EN, ANSI, ISO…) hoặc tài liệu kỹ thuật từ nhà sản xuất. Hãy yêu cầu NCC cung cấp trước khi sản xuất.",
        "Nhãn hàng nên thể hiện size, tiêu chuẩn áp dụng, hướng dẫn sử dụng và thông tin nhà nhập khẩu. Thiếu thông tin làm chậm [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa).",
        "Với PPE dùng trong môi trường hóa chất hoặc cháy nổ, hồ sơ kỹ thuật càng đầy đủ thì quy trình nhập khẩu đồ bảo hộ lao động càng ít phát sinh giải trình.",
      ],
      "Bộ chứng từ cần có": [
        "Invoice, packing list, B/L hoặc AWB, hợp đồng, catalog kỹ thuật, CO (nếu hưởng ưu đãi thuế) và chứng nhận liên quan là bộ hồ sơ nền.",
        "Nên lưu bản PDF có chữ ký/stamp rõ. Scan mờ hoặc thiếu số lượng kiện là lý do phổ biến khiến tờ khai bị trả về.",
        "Doanh nghiệp dự án nên gắn mã công trình trên packing list để đối soát nội bộ sau khi hoàn tất quy trình nhập khẩu đồ bảo hộ lao động.",
      ],
      "Các bước thực hiện từ đặt hàng đến giao kho": [
        "Bước 1: Chốt mẫu và tiêu chuẩn. Bước 2: Xác nhận mã HS và thuế suất tham chiếu. Bước 3: Book vận chuyển theo tiến độ công trình.",
        "Bước 4: Chuẩn bị tờ khai và nộp hồ sơ. Bước 5: [khai báo hải quan](/bai-viet/khai-bao-hai-quan), xử lý kiểm hóa nếu có. Bước 6: Nộp thuế, lấy hàng, giao kho công trình hoặc trung tâm phân phối.",
        "Bước 7: Lưu chứng từ và biên bản giao nhận. Quy trình nhập khẩu đồ bảo hộ lao động chuyên nghiệp luôn khép vòng cho kế toán dự án.",
      ],
      "Vận chuyển và đóng gói": [
        "PPE thường đi biển với lô lớn để tối ưu chi phí; hàng gấp cho công trình có thể đi máy bay. Cần cân ETA với lịch thi công.",
        "Đóng pallet chắc, chống ẩm với giày/găng da và hàng vải. Hàng dễ biến dạng không nên chất đè quá tải trong container.",
        "Minh Tuấn tư vấn FCL/LCL và giao đa điểm công trình trong cùng quy trình nhập khẩu đồ bảo hộ lao động khi khách có nhiều kho nhận.",
      ],
      "Chi phí landed cost cần tính": [
        "Ngoài cước và thuế, hãy dự phòng phí lưu bãi, kiểm hóa, giao nội địa và chi phí chứng nhận nếu làm sau khi hàng về.",
        "So báo giá theo cùng Incoterm. Giá FOB thấp nhưng thiếu kiểm soát chất lượng tại xưởng có thể làm đội chi phí đổi trả trong quy trình nhập khẩu đồ bảo hộ lao động.",
        "Liên hệ [Zalo 0938 961 012](https://zalo.me/0938961012) để nhận báo giá kèm dự trù thuế tham chiếu khi cung cấp catalog.",
      ],
      "Rủi ro kiểm hóa và sai chứng từ": [
        "Sai mô tả chất liệu hoặc tiêu chuẩn trên invoice dễ dẫn đến kiểm hóa. Hãy đồng bộ catalog – invoice – nhãn thùng.",
        "Nhập PPE kém chất lượng có thể ảnh hưởng an toàn lao động và trách nhiệm pháp lý của chủ đầu tư/nhà thầu — không chỉ là vấn đề logistics.",
        "Book sát lịch mưa bão hoặc cao điểm cuối năm làm tăng rủi ro delay. Giữ buffer 7–14 ngày trong quy trình nhập khẩu đồ bảo hộ lao động cho dự án trọng điểm.",
      ],
      "Gợi ý cho nhà thầu và nhà máy": [
        "Lập khung đơn hàng theo quý để giữ giá và slot. PPE tiêu hao nhanh nếu không forecast sẽ phải bay gấp với chi phí cao.",
        "Chuẩn hóa bảng size và định mức cấp phát nội bộ giúp giảm tồn kho chết sau khi hàng về.",
        "Kết hợp dịch vụ [xuất nhập khẩu](/dich-vu/xuat-nhap-khau) nếu chưa có nhân sự hải quan riêng tại TP.HCM.",
      ],
      "FAQ về nhập khẩu PPE": [
        "PPE có cần kiểm tra chuyên ngành không? Tùy mặt hàng; cần rà theo danh mục tại thời điểm nhập. Đừng giả định mọi PPE đều tự do.",
        "Có được nhập hàng cũ/thanh lý không? Thường rủi ro cao về chất lượng và hồ sơ; nên ưu tiên hàng mới có nguồn gốc rõ.",
        "Thời gian hoàn tất quy trình nhập khẩu đồ bảo hộ lao động? Phụ thuộc mode vận chuyển và mức độ đủ hồ sơ; hồ sơ chuẩn giúp rút ngắn khâu thông quan.",
      ],
      "Minh Tuấn hỗ trợ như thế nào": [
        "Minh Tuấn hỗ trợ end-to-end: tư vấn HS, chứng từ, vận tải, [khai báo hải quan](/bai-viet/khai-bao-hai-quan) và giao kho theo tiến độ dự án.",
        "Doanh nghiệp gửi danh mục PPE để nhận checklist riêng. Xem thêm [/lien-he](/lien-he) hoặc nhắn [Zalo](https://zalo.me/0938961012).",
        "Mục tiêu của chúng tôi là giúp quy trình nhập khẩu đồ bảo hộ lao động minh bạch, đúng hạn và kiểm soát được landed cost.",
      ],
    },
  }),

  makePost({
    id: 1109,
    keyword: "quy trình nhập khẩu pin năng lượng mặt trời",
    slug: "quy-trinh-nhap-khau-pin-nang-luong-mat-troi",
    title: "Quy trình nhập khẩu pin năng lượng mặt trời 2026 — Checklist | MINH TUẤN",
    metaDescription:
      "Quy trình nhập khẩu pin năng lượng mặt trời 2026: module/tấm pin, chứng từ kỹ thuật, vận chuyển và thông quan. Minh Tuấn — Zalo 0938 961 012.",
    excerpt:
      "Quy trình nhập khẩu pin năng lượng mặt trời giúp EPC và nhà phân phối kiểm soát chứng từ kỹ thuật, packing và lịch về hàng cho dự án điện mặt trời.",
    imageUrls: IMAGES.solar,
    headings: [
      "Quy trình nhập khẩu pin năng lượng mặt trời là gì?",
      "Phân biệt module, inverter và phụ kiện",
      "Hồ sơ kỹ thuật và mã HS",
      "Đóng gói, container và vận chuyển",
      "Các bước thông quan thực tế",
      "Chi phí và thuế cần dự phòng",
      "Rủi ro vỡ hỏng và bảo hiểm",
      "Lưu ý cho dự án EPC",
      "FAQ",
      "Đồng hành cùng Minh Tuấn Logistics",
    ],
    paragraphsByHeading: {
      "Quy trình nhập khẩu pin năng lượng mặt trời là gì?": [
        "Quy trình nhập khẩu pin năng lượng mặt trời thường ám chỉ tấm pin/module quang điện và thiết bị liên quan trong hệ thống điện mặt trời.",
        "Doanh nghiệp cần đồng bộ thông số kỹ thuật (công suất, hiệu suất, kích thước, số cell) trên catalog, invoice và packing list để tránh lệch khai báo.",
        "Minh Tuấn Logistics hỗ trợ khâu vận tải – [khai báo hải quan](/bai-viet/khai-bao-hai-quan) – giao kho dự án theo tiến độ lắp đặt.",
      ],
      "Phân biệt module, inverter và phụ kiện": [
        "Module quang điện, inverter, khung/ray, cáp DC và phụ kiện lắp đặt nên tách dòng trên chứng từ. Gộp chung gây khó cho phân loại mã HS.",
        "Inverter và thiết bị điện có thể có yêu cầu kỹ thuật/kiểm tra khác module. Hãy xác nhận sớm trong quy trình nhập khẩu pin năng lượng mặt trời.",
        "Pin lưu trữ (battery storage) nếu đi kèm là nhóm hàng nhạy cảm hơn về an toàn vận chuyển — cần khai báo và đóng gói riêng.",
      ],
      "Hồ sơ kỹ thuật và mã HS": [
        "Chuẩn bị datasheet, flash report (nếu có), commercial invoice, packing list, B/L, hợp đồng và CO nếu áp dụng ưu đãi.",
        "Mã HS phải bám đúng bản chất hàng hóa. Sai mã ảnh hưởng thuế và có thể kích hoạt kiểm tra. Tham khảo thêm cổng [customs.gov.vn](https://www.customs.gov.vn/).",
        "Doanh nghiệp nên giữ file serial/pallet map để đối soát khi nhận hàng — rất hữu ích trong quy trình nhập khẩu pin năng lượng mặt trời quy mô lớn.",
      ],
      "Đóng gói, container và vận chuyển": [
        "Module thường đi FCL với pallet gỗ/ép đúng tiêu chuẩn, chống ẩm và chằng buộc chắc. Không để hàng xô trong container.",
        "LCL chỉ phù hợp lô nhỏ hoặc mẫu; rủi ro sang chiết và va đập cao hơn FCL. Hàng gấp có thể bay nhưng chi phí và giới hạn kích thước cần tính kỹ.",
        "Chọn [vận chuyển đường biển](/bai-viet/van-chuyen-duong-bien) đúng lịch cắt hàng để khớp tiến độ EPC trong quy trình nhập khẩu pin năng lượng mặt trời.",
      ],
      "Các bước thông quan thực tế": [
        "Bước 1: Chốt thông số kỹ thuật và số lượng theo hợp đồng EPC. Bước 2: Book tàu và chụp ảnh hiện trạng khi đóng hàng.",
        "Bước 3: Gửi chứng từ pre-alert cho logistics. Bước 4: Làm [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa), nộp thuế. Bước 5: Vận chuyển nội địa tới công trường/kho.",
        "Bước 6: Biên bản bàn giao theo pallet/serial. Đây là bước đóng quy trình nhập khẩu pin năng lượng mặt trời với nhà thầu.",
      ],
      "Chi phí và thuế cần dự phòng": [
        "Landed cost gồm cước biển, phụ phí, thuế, phí khai thuê, vận tải nội địa, nâng hạ và contingency cho lưu bãi nếu tàu trễ.",
        "So sánh báo giá phải nêu rõ ai chịu chi phí local tại cảng xếp/dỡ. Điều này ảnh hưởng mạnh tổng chi phí quy trình nhập khẩu pin năng lượng mặt trời.",
        "Minh Tuấn báo giá trong 24h khi có packing list sơ bộ — liên hệ [Zalo 0938 961 012](https://zalo.me/0938961012).",
      ],
      "Rủi ro vỡ hỏng và bảo hiểm": [
        "Module dễ nứt cell nếu chằng buộc kém hoặc sang chiết thô. Nên mua bảo hiểm và yêu cầu ảnh đóng hàng từ NCC.",
        "Khi nhận hàng, kiểm đếm pallet và ghi nhận hư hỏng ngay trên biên bản. Chậm khiếu nại làm yếu hồ sơ bồi thường.",
        "Giữ quy trình nhập khẩu pin năng lượng mặt trời gắn với checklist QC tại kho trước khi đưa ra công trường.",
      ],
      "Lưu ý cho dự án EPC": [
        "Neo lịch vận chuyển với tiến độ móng/khung đỡ. Hàng về sớm quá làm phát sinh lưu kho; về muộn làm đội chi phí nhân công.",
        "Chia lô theo phase dự án thay vì nhập dồn một lần nếu mặt bằng chưa sẵn sàng.",
        "Kết hợp tư vấn [xuất nhập khẩu](/dich-vu/xuat-nhap-khau) nếu chủ đầu tư chưa có đội hải quan riêng.",
      ],
      "FAQ": [
        "Có cần giấy phép đặc thù không? Tùy cấu phần và chính sách tại thời điểm nhập; cần rà trước khi ký LC/hợp đồng lớn.",
        "Nhập module kèm inverter chung tờ khai được không? Có thể nhưng nên tách dòng rõ; một số trường hợp nên tách lô để giảm rủi ro.",
        "Thời gian biển mất bao lâu? Phụ thuộc pol/pod; hãy giữ buffer trong quy trình nhập khẩu pin năng lượng mặt trời thay vì tính ETA lý thuyết.",
      ],
      "Đồng hành cùng Minh Tuấn Logistics": [
        "Minh Tuấn hỗ trợ FCL dự án, chứng từ và giao công trường. Đội ngũ cập nhật mốc tàu – thông quan – giao hàng minh bạch.",
        "Gửi packing list để nhận phương án. Xem [/lien-he](/lien-he) hoặc nhắn Zalo để bắt đầu quy trình nhập khẩu pin năng lượng mặt trời với checklist riêng.",
        "Chúng tôi hướng tới giảm vỡ hỏng, đúng tiến độ và kiểm soát landed cost cho EPC và nhà phân phối.",
      ],
    },
  }),

  makePost({
    id: 1110,
    keyword: "quy trình nhập khẩu đèn LED",
    slug: "quy-trinh-nhap-khau-den-led",
    title: "Quy trình nhập khẩu đèn LED 2026 — Hướng dẫn thông quan | MINH TUẤN",
    metaDescription:
      "Quy trình nhập khẩu đèn LED 2026: mã HS, nhãn năng lượng, chứng từ, vận chuyển và checklist SME. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Quy trình nhập khẩu đèn LED giúp nhà phân phối điện ánh sáng và dự án công trình chuẩn hóa hồ sơ kỹ thuật, nhãn hàng và lịch về kho.",
    imageUrls: IMAGES.led,
    headings: [
      "Tổng quan quy trình nhập khẩu đèn LED",
      "Phân loại bóng, đèn và phụ kiện",
      "Yêu cầu kỹ thuật và nhãn hàng",
      "Chứng từ và mã HS",
      "Quy trình từng bước",
      "Vận chuyển biển/bay",
      "Chi phí cần biết",
      "Rủi ro thường gặp",
      "Gợi ý cho nhà phân phối",
      "Câu hỏi thường gặp",
      "Liên hệ Minh Tuấn",
    ],
    paragraphsByHeading: {
      "Tổng quan quy trình nhập khẩu đèn LED": [
        "Quy trình nhập khẩu đèn LED gồm bóng LED, đèn tuýp, đèn highbay, đèn đường, đèn panel và driver/nguồn.",
        "Hàng chiếu sáng gắn yêu cầu kỹ thuật, nhãn năng lượng/nhãn phụ tùy nhóm. Doanh nghiệp nên xác nhận trước khi sản xuất bao bì.",
        "Minh Tuấn Logistics hỗ trợ từ tư vấn HS đến [khai báo hải quan](/bai-viet/khai-bao-hai-quan) và giao kho toàn quốc.",
      ],
      "Phân loại bóng, đèn và phụ kiện": [
        "Tách bóng rời, bộ đèn hoàn chỉnh, driver và phụ kiện lắp đặt trên invoice. Gộp chung dễ sai thuế suất.",
        "Đèn kèm pin hoặc thiết bị IoT/smart cần khai báo rõ chức năng để tránh vướng ở khâu kiểm tra.",
        "Catalog có công suất, quang thông, nhiệt độ màu và tiêu chuẩn CE/IEC giúp quy trình nhập khẩu đèn LED suôn sẻ hơn.",
      ],
      "Yêu cầu kỹ thuật và nhãn hàng": [
        "Nhãn hàng nên có thông số điện, công suất, nhà sản xuất/nhập khẩu và hướng dẫn an toàn. Thiếu nhãn làm chậm thông quan.",
        "Một số nhóm đèn thuộc diện quản lý hiệu suất năng lượng hoặc công bố hợp quy — cần rà danh mục cập nhật.",
        "Yêu cầu NCC in nhãn đúng bản tiếng Việt trước khi đóng thùng, thay vì dán lại sau khi hàng về trong quy trình nhập khẩu đèn LED.",
      ],
      "Chứng từ và mã HS": [
        "Invoice, packing list, B/L/AWB, hợp đồng, datasheet và CO (nếu có) là bộ cơ bản. Thêm test report khi khách dự án yêu cầu.",
        "Chọn mã HS theo bản chất (bóng/đèn/đèn hoàn chỉnh). Tham khảo [Tổng cục Hải quan](https://www.customs.gov.vn/) và tư vấn chuyên môn.",
        "Đồng bộ số model giữa catalog và invoice để giảm yêu cầu giải trình khi làm [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa).",
      ],
      "Quy trình từng bước": [
        "Bước 1: Chốt model và mẫu nhãn. Bước 2: Xác nhận HS/thuế. Bước 3: Book mode theo ETA bán hàng.",
        "Bước 4: Pre-alert chứng từ. Bước 5: Tờ khai – nộp thuế – lấy hàng. Bước 6: QC tại kho và nhập phần mềm bán hàng.",
        "Bước 7: Lưu hồ sơ kiểm tra sau thông quan. Đây là khâu đóng quy trình nhập khẩu đèn LED bài bản.",
      ],
      "Vận chuyển biển/bay": [
        "Lô dự án/đèn đường thường đi FCL. Hàng mẫu hoặc thiếu hụt trưng bày có thể đi máy bay.",
        "Đóng thùng chống sốc, chống ẩm cho driver và bóng dễ vỡ. Pallet hóa giúp giảm vỡ khi nâng hạ.",
        "Minh Tuấn tối ưu LCL/FCL trong quy trình nhập khẩu đèn LED theo sản lượng thực tế từng tháng.",
      ],
      "Chi phí cần biết": [
        "Tính đủ cước, thuế, phí local, giao nội địa và contingency kiểm hóa. Đừng chỉ so cước biển.",
        "Incoterm ảnh hưởng trách nhiệm rủi ro. Hiểu rõ FOB/CIF/DDP trước khi ký.",
        "Nhận báo giá nhanh qua [Zalo 0938 961 012](https://zalo.me/0938961012) khi gửi packing list.",
      ],
      "Rủi ro thường gặp": [
        "Sai model/công suất trên chứng từ. Hàng kém chất lượng ảnh hưởng bảo hành dự án.",
        "Vỡ bóng do đóng gói yếu. Thiếu nhãn phụ khiến quy trình nhập khẩu đèn LED bị dừng.",
        "Cao điểm cuối năm làm tăng lead time — hãy book sớm nếu có chiến dịch bán hàng.",
      ],
      "Gợi ý cho nhà phân phối": [
        "Giữ SKU lõi đi biển định kỳ và SKU chiến dịch đi bay có chọn lọc.",
        "Chuẩn hóa bảng quy đổi công suất – quang thông để sales và kho dùng chung.",
        "Thuê đơn vị [xuất nhập khẩu](/dich-vu/xuat-nhap-khau) nếu chưa có nhân sự hải quan full-time.",
      ],
      "Câu hỏi thường gặp": [
        "Đèn LED có cần giấy phép không? Tùy nhóm hàng và chính sách thời điểm; cần rà trước khi nhập số lượng lớn.",
        "Có nhập hàng thanh lý được không? Rủi ro chất lượng và bảo hành cao; ưu tiên nguồn rõ ràng.",
        "Thời gian thông quan? Hồ sơ đủ thì nhanh; thiếu datasheet/nhãn sẽ kéo dài quy trình nhập khẩu đèn LED.",
      ],
      "Liên hệ Minh Tuấn": [
        "Minh Tuấn đồng hành nhà phân phối và thầu M&E từ chứng từ đến giao kho.",
        "Gửi catalog để nhận checklist. Truy cập [/lien-he](/lien-he) hoặc Zalo để triển khai quy trình nhập khẩu đèn LED.",
        "Cam kết minh bạch chi phí và cập nhật tiến độ theo từng lô hàng.",
      ],
    },
  }),

  makePost({
    id: 1111,
    keyword: "quy trình xuất nhập khẩu hàng nông sản",
    slug: "quy-trinh-xuat-nhap-khau-hang-nong-san",
    title: "Quy trình xuất nhập khẩu hàng nông sản 2026 — A–Z | MINH TUẤN",
    metaDescription:
      "Quy trình xuất nhập khẩu hàng nông sản 2026: kiểm dịch, chứng từ, chuỗi lạnh và thông quan. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Quy trình xuất nhập khẩu hàng nông sản giúp doanh nghiệp xử lý kiểm dịch, chứng từ gốc và lựa chọn mode vận chuyển phù hợp từng mặt hàng.",
    category: "global",
    categoryLabel: "Quốc tế",
    imageUrls: IMAGES.agri,
    headings: [
      "Quy trình xuất nhập khẩu hàng nông sản là gì?",
      "Phân nhóm hàng và yêu cầu chuyên ngành",
      "Kiểm dịch và chứng từ bắt buộc",
      "Chuỗi lạnh và đóng gói",
      "Quy trình xuất khẩu nông sản",
      "Quy trình nhập khẩu nông sản",
      "Chi phí và Incoterm",
      "Rủi ro thường gặp",
      "Checklist doanh nghiệp SME",
      "FAQ",
      "Minh Tuấn đồng hành chuỗi nông sản",
    ],
    paragraphsByHeading: {
      "Quy trình xuất nhập khẩu hàng nông sản là gì?": [
        "Quy trình xuất nhập khẩu hàng nông sản bao gồm trái cây, rau củ, gạo, cà phê, hạt, thủy sản khô và nông sản chế biến — mỗi nhóm có điều kiện khác nhau.",
        "Điểm mấu chốt là đồng bộ kiểm dịch, chứng nhận xuất xứ, điều kiện bảo quản và lịch tàu/bay với hạn sử dụng/độ tươi.",
        "Minh Tuấn Logistics hỗ trợ doanh nghiệp thiết kế quy trình xuất nhập khẩu hàng nông sản theo mặt hàng và thị trường đích.",
      ],
      "Phân nhóm hàng và yêu cầu chuyên ngành": [
        "Hàng tươi sống khác hàng khô và hàng chế biến về kiểm dịch, bao bì và thời gian thông quan. Đừng áp một SOP cho mọi SKU.",
        "Thị trường EU, Trung Quốc, Mỹ, Nhật có yêu cầu dư lượng thuốc trừ sâu, nhãn và truy xuất khác nhau.",
        "Xác định sớm mã HS và điều kiện thị trường trước khi thu mua — đây là bước mở của quy trình xuất nhập khẩu hàng nông sản.",
      ],
      "Kiểm dịch và chứng từ bắt buộc": [
        "Hồ sơ thường gồm invoice, packing list, vận đơn, phytosanitary/kiểm dịch, C/O, và chứng từ theo yêu cầu nước nhập.",
        "Đặt lịch kiểm dịch sát cắt tàu nhưng vẫn đủ thời gian lấy chứng từ gốc. Trễ chứng từ làm lỡ chuyến.",
        "Lưu bản gốc và bản scan có hệ thống để phục vụ [khai báo hải quan](/bai-viet/khai-bao-hai-quan) và kiểm tra sau.",
      ],
      "Chuỗi lạnh và đóng gói": [
        "Hàng cần nhiệt độ ổn định phải đi reefer hoặc kho lạnh trung chuyển. Theo dõi nhiệt độ suốt hành trình.",
        "Bao bì thông khí/chống ẩm đúng chủng loại giúp giảm hư hỏng. Ghi rõ hướng xếp chồng.",
        "Quy trình xuất nhập khẩu hàng nông sản thất bại thường do gãy chuỗi lạnh chứ không chỉ do tờ khai.",
      ],
      "Quy trình xuất khẩu nông sản": [
        "Bước 1: Chốt tiêu chuẩn chất lượng với buyer. Bước 2: Thu hoạch/đóng gói theo lô. Bước 3: Kiểm dịch và lấy chứng từ.",
        "Bước 4: Book tàu/bay. Bước 5: Thông quan xuất. Bước 6: Gửi bộ chứng từ cho người mua theo Incoterm.",
        "Bước 7: Theo dõi ETA và hỗ trợ khiếu nại nếu có. Khép vòng quy trình xuất nhập khẩu hàng nông sản phía xuất.",
      ],
      "Quy trình nhập khẩu nông sản": [
        "Bước 1: Rà điều kiện được phép nhập. Bước 2: Ký hợp đồng và chốt bao bì. Bước 3: Nhận pre-alert chứng từ.",
        "Bước 4: [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa) và kiểm dịch nhập. Bước 5: Đưa vào kho/phân phối.",
        "Bước 6: Lưu hồ sơ truy xuất. Doanh nghiệp bán lẻ cần gắn mã lô để xử lý sự cố nhanh.",
      ],
      "Chi phí và Incoterm": [
        "Chi phí gồm cước, lạnh, kiểm dịch, thuế, phí local và hao hụt giả định. Hãy đưa hao hụt vào tính giá thành.",
        "FOB/CIF/CFR ảnh hưởng ai thuê tàu và mua bảo hiểm. Chọn Incoterm phù hợp năng lực logistics nội bộ.",
        "Minh Tuấn hỗ trợ báo giá theo kịch bản xuất hoặc nhập trong quy trình xuất nhập khẩu hàng nông sản — Zalo 0938 961 012.",
      ],
      "Rủi ro thường gặp": [
        "Trễ kiểm dịch, sai C/O, đứt chuỗi lạnh, tắc biên mùa vụ và thay đổi tạm ngừng nhập từ nước ngoài.",
        "Phòng tránh bằng lịch buffer, đối tác kiểm dịch quen quy trình và bảo hiểm phù hợp.",
        "Theo dõi cảnh báo thị trường thường xuyên thay vì chỉ làm đúng quy trình xuất nhập khẩu hàng nông sản năm cũ.",
      ],
      "Checklist doanh nghiệp SME": [
        "Có SOP theo SKU, có người giữ chứng từ gốc, có kế hoạch lạnh và có kênh cập nhật 24/7 với logistics.",
        "Thử lô nhỏ trước khi scale mùa vụ. Đo % hư hỏng thực tế sau 2–3 chuyến.",
        "Kết hợp [/dich-vu/xuat-nhap-khau](/dich-vu/xuat-nhap-khau) nếu chưa đủ nhân sự chuyên trách.",
      ],
      "FAQ": [
        "Nông sản khô có cần kiểm dịch không? Nhiều mặt hàng vẫn cần; không suy đoán theo cảm tính.",
        "Có gửi LCL được không? Được với hàng khô ổn định; hàng tươi ưu tiên FCL/reefer hoặc bay.",
        "Làm sao giảm hư hỏng? Đóng gói đúng, chuỗi lạnh kín và ETA thực tế trong quy trình xuất nhập khẩu hàng nông sản.",
      ],
      "Minh Tuấn đồng hành chuỗi nông sản": [
        "Minh Tuấn hỗ trợ chứng từ, book mode và phối hợp kiểm dịch/thông quan theo mặt hàng.",
        "Liên hệ [/lien-he](/lien-he) hoặc [Zalo](https://zalo.me/0938961012) để nhận checklist quy trình xuất nhập khẩu hàng nông sản riêng.",
        "Mục tiêu: giữ chất lượng, đúng hạn và minh bạch chi phí cho doanh nghiệp nông sản Việt.",
      ],
    },
  }),

  makePost({
    id: 1112,
    keyword: "quy trình nhập khẩu đá hoa cương",
    slug: "quy-trinh-nhap-khau-da-hoa-cuong",
    title: "Quy trình nhập khẩu đá hoa cương 2026 — Hướng dẫn A–Z | MINH TUẤN",
    metaDescription:
      "Quy trình nhập khẩu đá hoa cương 2026: slab/gạch, đóng kiện, vận chuyển nặng và thông quan. Minh Tuấn Logistics — Zalo 0938 961 012.",
    excerpt:
      "Quy trình nhập khẩu đá hoa cương giúp showroom và nhà thầu nội thất kiểm soát đóng kiện, cước hàng nặng và tiến độ về công trình.",
    imageUrls: IMAGES.granite,
    headings: [
      "Tổng quan quy trình nhập khẩu đá hoa cương",
      "Phân loại slab, gạch và thành phẩm",
      "Đóng kiện và chống vỡ",
      "Chứng từ và mã HS",
      "Các bước từ xưởng đến công trình",
      "Vận chuyển biển và nội địa",
      "Chi phí hàng nặng",
      "Rủi ro và bảo hiểm",
      "Gợi ý cho showroom/nhà thầu",
      "FAQ",
      "Hỗ trợ từ Minh Tuấn Logistics",
    ],
    paragraphsByHeading: {
      "Tổng quan quy trình nhập khẩu đá hoa cương": [
        "Quy trình nhập khẩu đá hoa cương gồm đá granite/marble dạng slab, gạch ốp và thành phẩm cắt sẵn theo dự án.",
        "Đặc thù là hàng nặng, dễ vỡ cạnh, cần A-frame/kiện gỗ chắc và thiết bị nâng tại cảng/kho.",
        "Minh Tuấn Logistics hỗ trợ book FCL, chứng từ và giao công trình trong quy trình nhập khẩu đá hoa cương.",
      ],
      "Phân loại slab, gạch và thành phẩm": [
        "Slab thô/đánh bóng, gạch cắt sẵn và lavabo/bàn thành phẩm nên tách dòng khai báo và đóng kiện riêng.",
        "Ghi rõ kích thước, độ dày, chủng loại đá và diện tích/m3 trên packing list để tính cước và thuế đúng.",
        "Ảnh thực tế lô hàng giúp đối soát màu/ván khi nhận — giảm tranh chấp trong quy trình nhập khẩu đá hoa cương.",
      ],
      "Đóng kiện và chống vỡ": [
        "Dùng khung A-frame hoặc kiện gỗ đúng tiêu chuẩn, chèn chống xô và bảo vệ cạnh mài bóng.",
        "Không chất đè sai hướng. Ghi cảnh báo heavy/fragile rõ trên kiện.",
        "Yêu cầu NCC gửi ảnh đóng hàng trước khi niêm phong container — bước quan trọng của quy trình nhập khẩu đá hoa cương.",
      ],
      "Chứng từ và mã HS": [
        "Invoice, packing list chi tiết kích thước, B/L, hợp đồng và CO (nếu có). Catalog đá hỗ trợ giải trình khi cần.",
        "Mã HS theo dạng đá và mức độ gia công. Sai mô tả “đá tự nhiên các loại” dễ gây chậm [thông quan hàng hóa](/bai-viet/thong-quan-hang-hoa).",
        "Tham khảo [customs.gov.vn](https://www.customs.gov.vn/) và tư vấn chuyên môn trước khi ký đơn lớn.",
      ],
      "Các bước từ xưởng đến công trình": [
        "Bước 1: Chọn ván/mẫu và chốt số lượng. Bước 2: Đóng kiện và book FCL. Bước 3: Pre-alert chứng từ.",
        "Bước 4: [khai báo hải quan](/bai-viet/khai-bao-hai-quan) và lấy hàng. Bước 5: Vận chuyển nội địa bằng xe phù hợp tải trọng.",
        "Bước 6: Bàn giao tại công trình/showroom kèm biên bản. Khép quy trình nhập khẩu đá hoa cương.",
      ],
      "Vận chuyển biển và nội địa": [
        "Ưu tiên FCL để giảm sang chiết. LCL đá slab rủi ro vỡ và phí local cao hơn kỳ vọng.",
        "Nội địa cần xe đời và dây chằng chuyên dụng; một số công trình cần xe cẩu hỗ trợ hạ hàng.",
        "Minh Tuấn phối hợp lịch giao theo tiến độ thi công trong quy trình nhập khẩu đá hoa cương.",
      ],
      "Chi phí hàng nặng": [
        "Cước tính theo trọng lượng/thể tích, cộng local charge, thuế, vận tải nội địa và contingency lưu bãi.",
        "Hàng nặng sai khai trọng lượng gây phát sinh lớn. Hãy cân/kiện chính xác từ xưởng.",
        "Nhận báo giá qua [Zalo 0938 961 012](https://zalo.me/0938961012) khi có packing list kích thước.",
      ],
      "Rủi ro và bảo hiểm": [
        "Vỡ slab, xước mặt bóng, cong A-frame và trễ tiến độ công trình là rủi ro chính.",
        "Nên mua bảo hiểm và kiểm đếm ngay khi mở container. Ghi nhận hư hỏng bằng ảnh/timestamp.",
        "Quy trình nhập khẩu đá hoa cương chuyên nghiệp luôn gắn QC đầu – cuối.",
      ],
      "Gợi ý cho showroom/nhà thầu": [
        "Đặt hàng theo phase lát/ốp, tránh nhập dồn khi mặt bằng chưa sẵn. Hàng để lâu tăng rủi ro xước.",
        "Chuẩn hóa mã vân/đá trong kho để sales bán đúng tấm khách đã chọn.",
        "Dùng dịch vụ [xuất nhập khẩu](/dich-vu/xuat-nhap-khau) nếu chưa có đội ngũ hải quan riêng.",
      ],
      FAQ: [
        "Có nhập đá qua LCL được không? Có nhưng FCL an toàn hơn với slab lớn.",
        "Thời gian biển bao lâu? Tùy pol; hãy giữ buffer trước ngày lắp đặt.",
        "Cần giấy phép gì? Tùy loại đá và chính sách thời điểm; rà trước khi đặt cọc trong quy trình nhập khẩu đá hoa cương.",
      ],
      "Hỗ trợ từ Minh Tuấn Logistics": [
        "Minh Tuấn hỗ trợ FCL đá, thông quan và giao công trình/showroom.",
        "Gửi danh mục tấm đá để nhận checklist. Xem [/lien-he](/lien-he) hoặc nhắn Zalo.",
        "Chúng tôi giúp quy trình nhập khẩu đá hoa cương giảm vỡ hỏng và đúng tiến độ thi công.",
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
