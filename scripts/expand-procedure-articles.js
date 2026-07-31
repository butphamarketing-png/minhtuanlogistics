const fs = require("fs");
const path = require("path");

const postsPath = path.join(__dirname, "..", "data", "news-posts.json");
const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

const extras = {
  "quy-trinh-nhap-khau-do-bao-ho-lao-dong": [
    [
      "Tổng quan quy trình nhập khẩu đồ bảo hộ lao động",
      "Trong thực tế 2026, nhiều nhà thầu nhập PPE theo từng đợt thi công. Việc gắn mã dự án trên packing list giúp kho và kế toán đối soát nhanh sau thông quan, giảm thất lạc chứng từ khi quyết toán.",
    ],
    [
      "Phân nhóm PPE và lưu ý mã HS",
      "Doanh nghiệp nên lập bảng tra cứu nội bộ: tên hàng – chất liệu – tiêu chuẩn – mã HS tham chiếu. Bảng này rút ngắn thời gian làm tờ khai mỗi lần tái nhập cùng mặt hàng.",
    ],
    [
      "Chi phí landed cost cần tính",
      "Hãy tách chi phí logistics và chi phí tuân thủ (chứng nhận, thử nghiệm, nhãn). Hai nhóm này biến động khác nhau và cần chủ dự án duyệt riêng để tránh vượt ngân sách bất ngờ.",
    ],
  ],
  "quy-trinh-nhap-khau-pin-nang-luong-mat-troi": [
    [
      "Quy trình nhập khẩu pin năng lượng mặt trời là gì?",
      "Với dự án mái nhà xưởng và điện mặt trời mặt đất, lịch về hàng phải khớp tiến độ kết cấu. Minh Tuấn khuyến nghị họp kickoff logistics ngay khi chốt NCC để khóa pol/pod và lead time thực tế.",
    ],
    [
      "Đóng gói, container và vận chuyển",
      "Kiểm tra tiêu chuẩn hun trùng kiện gỗ (nếu dùng) theo yêu cầu nước xuất/nhập. Kiện không đạt có thể bị giữ tại cảng và phát sinh lưu bãi không đáng có.",
    ],
    [
      "Chi phí và thuế cần dự phòng",
      "Yêu cầu báo giá nêu rõ phí local tại cảng Việt Nam và phạm vi giao đến chân công trình. Thiếu dòng này thường làm lệch so sánh giữa các đơn vị logistics.",
    ],
    [
      "Lưu ý cho dự án EPC",
      "Nên có phương án lưu kho tạm nếu công trường chưa sẵn sàng nâng hạ. Để module ngoài trời không đúng cách có thể ảnh hưởng bảo hành nhà sản xuất.",
    ],
  ],
  "quy-trinh-nhap-khau-den-led": [
    [
      "Tổng quan quy trình nhập khẩu đèn LED",
      "Nhà phân phối nên phân tách hàng dân dụng và hàng dự án công trình vì chu kỳ bán, yêu cầu bảo hành và cách đóng gói khác nhau rõ rệt.",
    ],
    [
      "Yêu cầu kỹ thuật và nhãn hàng",
      "Giữ file PDF datasheet theo từng model trong drive nội bộ. Khi hải quan yêu cầu giải trình, việc gửi đúng file trong vài phút giúp giảm thời gian kiểm hóa.",
    ],
    [
      "Vận chuyển biển/bay",
      "Mùa cao điểm cuối năm, slot FCL đèn chiếu sáng thường căng. Book sớm 2–3 tuần giúp giữ giá và tránh phải chuyển bay với chi phí cao.",
    ],
    [
      "Rủi ro thường gặp",
      "Hàng nhái hoặc sai thông số công suất ảnh hưởng uy tín showroom. Nên có biên bản QC mẫu trước khi sản xuất đại trà và giữ sample đối chiếu khi nhận container.",
    ],
  ],
  "quy-trinh-xuat-nhap-khau-hang-nong-san": [
    [
      "Quy trình xuất nhập khẩu hàng nông sản là gì?",
      "Doanh nghiệp cần phân vai trò rõ: ai chịu trách nhiệm chất lượng đầu vào, ai giữ chứng từ gốc, ai theo dõi nhiệt độ reefer. Thiếu phân công là nguyên nhân phổ biến làm vỡ chuỗi khi có sự cố.",
    ],
    [
      "Kiểm dịch và chứng từ bắt buộc",
      "Luôn đối chiếu tên khoa học/tên hàng trên phytosanitary với invoice. Lệch tên dù nhỏ cũng có thể khiến bộ chứng từ bị từ chối tại nước nhập.",
    ],
    [
      "Chuỗi lạnh và đóng gói",
      "Đặt logger nhiệt độ trong container với hàng nhạy cảm. Dữ liệu logger là bằng chứng quan trọng khi khiếu nại bảo hiểm hoặc tranh chấp chất lượng.",
    ],
    [
      "Rủi ro thường gặp",
      "Theo dõi danh mục tạm ngừng/giới hạn nhập từ thị trường đích trước mỗi vụ. Chính sách có thể đổi nhanh hơn chu kỳ sản xuất nông sản.",
    ],
  ],
  "quy-trinh-nhap-khau-da-hoa-cuong": [
    [
      "Tổng quan quy trình nhập khẩu đá hoa cương",
      "Showroom nên chụp ảnh vân đá đã chọn và gắn mã tấm trước khi đóng container. Việc này giảm tranh chấp không đúng mẫu khi hàng về Việt Nam.",
    ],
    [
      "Đóng kiện và chống vỡ",
      "Kiểm tra độ ẩm kiện gỗ và đinh/ốc liên kết A-frame. Khung yếu là nguyên nhân chính làm đổ slab trong hành trình biển.",
    ],
    [
      "Vận chuyển biển và nội địa",
      "Khảo sát đường vào công trình (hẻm, giới hạn tải cầu) trước ngày giao. Nhiều lô đá mắc kẹt vì xe không vào được dù đã thông quan xong.",
    ],
    [
      "Chi phí hàng nặng",
      "Ngoài cước biển, hãy dự phòng chi phí xe cẩu/xe nâng tại điểm giao. Thiếu khoản này làm đội ngân sách dự án nội thất đột ngột.",
    ],
    [
      "Rủi ro và bảo hiểm",
      "Mua bảo hiểm với khai báo đúng trị giá thương mại. Khai thấp để giảm phí bảo hiểm sẽ bất lợi khi bồi thường sự cố vỡ đá.",
    ],
  ],
};

const countWords = (text) =>
  String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

let updated = 0;
for (const post of posts) {
  const add = extras[post.slug];
  if (!add) continue;
  for (const [heading, para] of add) {
    const idx = post.sections.findIndex((s) => s.type === "h2" && s.text === heading);
    if (idx < 0) continue;
    let insertAt = idx + 1;
    while (insertAt < post.sections.length && post.sections[insertAt].type === "p") insertAt += 1;
    post.sections.splice(insertAt, 0, { type: "p", text: para });
    post.body.push(para);
  }
  post.wordCount = post.body.reduce((n, p) => n + countWords(p), 0) + countWords(post.excerpt);
  post.dateModified = "2026-07-31";
  updated += 1;
  console.log(post.slug, post.wordCount);
}

const tmp = `${postsPath}.tmp`;
fs.writeFileSync(tmp, JSON.stringify(posts));
fs.renameSync(tmp, postsPath);
console.log("updated", updated);
