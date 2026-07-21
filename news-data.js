/* Minh Tuan news data - 100 keyword articles */
(() => {
  const KEYWORDS = [
    "van chuyen hang hoa","logistics Viet Nam","xuat nhap khau","van chuyen duong bien","van chuyen duong bo",
    "van chuyen hang khong","freight forwarding","dich vu logistics","khai bao hai quan","thong quan hang hoa",
    "van tai container","FCL LCL","giao nhan hang hoa","kho bai logistics","warehousing",
    "van chuyen quoc te","import export Vietnam","cong ty logistics TP.HCM","gui hang di Trung Quoc","nhap hang Trung Quoc",
    "van chuyen di My","van chuyen di Han Quoc","van chuyen di Nhat Ban","van chuyen di Dai Loan","van chuyen di Thai Lan",
    "van chuyen di Singapore","bao gia van chuyen","dat lich van chuyen","cuoc phi van tai","van tai noi dia",
    "van tai lien tinh","dau keo container","giao hang dung tien do","giai phap logistics","tu van xuat nhap khau",
    "thu tuc hai quan","chung tu xuat nhap khau","thuong mai quoc te","chuoi cung ung","supply chain Vietnam",
    "van chuyen cua khau","hang hoa qua canh","tracking van don","dich vu door to door","van chuyen hang le",
    "van chuyen hang nguyen container","logistics Tan Son Nhat","cong ty XNK Minh Tuan","tu van doanh nghiep logistics","doi tac logistics uy tin",
    "dai ly giao nhan","forwarder Viet Nam","booking container","bill of lading","airway bill",
    "van don duong bien","van don hang khong","CFS warehouse","kho ngoai quan","bonded warehouse",
    "van chuyen cross border","logistics xuyen bien gioi","gui hang di chau Au","van chuyen di Duc","van chuyen di Uc",
    "van chuyen di Anh","van chuyen di UAE","van chuyen di Indonesia","van chuyen di Malaysia","van chuyen di Philippines",
    "nhap khau nguyen lieu","xuat khau hang hoa","kiem hoa hai quan","phan loai HS code","C/O form E",
    "chung nhan xuat xu","bao hiem hang hoa","cargo insurance","van chuyen hang nguy hiem","DG cargo",
    "hang qua kho qua tai","du an logistics","project cargo","multimodal transport","van tai da phuong thuc",
    "last mile delivery","giao hang chang cuoi","fulfillment logistics","3PL Viet Nam","dich vu 3PL",
    "toi uu chi phi logistics","theo doi lo hang","shipment tracking","lich tau bien","lich bay cargo",
    "cang Cat Lai","cang Hai Phong","san bay Tan Son Nhat cargo","logistics Ho Chi Minh","cong ty van tai quoc te"
  ];

  const LABELS = [
    "vận chuyển hàng hóa","logistics Việt Nam","xuất nhập khẩu","vận chuyển đường biển","vận chuyển đường bộ",
    "vận chuyển hàng không","freight forwarding","dịch vụ logistics","khai báo hải quan","thông quan hàng hóa",
    "vận tải container","FCL LCL","giao nhận hàng hóa","kho bãi logistics","warehousing",
    "vận chuyển quốc tế","import export Vietnam","công ty logistics TP.HCM","gửi hàng đi Trung Quốc","nhập hàng Trung Quốc",
    "vận chuyển đi Mỹ","vận chuyển đi Hàn Quốc","vận chuyển đi Nhật Bản","vận chuyển đi Đài Loan","vận chuyển đi Thái Lan",
    "vận chuyển đi Singapore","báo giá vận chuyển","đặt lịch vận chuyển","cước phí vận tải","vận tải nội địa",
    "vận tải liên tỉnh","đầu kéo container","giao hàng đúng tiến độ","giải pháp logistics","tư vấn xuất nhập khẩu",
    "thủ tục hải quan","chứng từ xuất nhập khẩu","thương mại quốc tế","chuỗi cung ứng","supply chain Vietnam",
    "vận chuyển cửa khẩu","hàng hóa quá cảnh","tracking vận đơn","dịch vụ door to door","vận chuyển hàng lẻ",
    "vận chuyển hàng nguyên container","logistics Tân Sơn Nhất","công ty XNK Minh Tuấn","tư vấn doanh nghiệp logistics","đối tác logistics uy tín",
    "đại lý giao nhận","forwarder Việt Nam","booking container","bill of lading","airway bill",
    "vận đơn đường biển","vận đơn hàng không","CFS warehouse","kho ngoại quan","bonded warehouse",
    "vận chuyển cross border","logistics xuyên biên giới","gửi hàng đi châu Âu","vận chuyển đi Đức","vận chuyển đi Úc",
    "vận chuyển đi Anh","vận chuyển đi UAE","vận chuyển đi Indonesia","vận chuyển đi Malaysia","vận chuyển đi Philippines",
    "nhập khẩu nguyên liệu","xuất khẩu hàng hóa","kiểm hóa hải quan","phân loại HS code","C/O form E",
    "chứng nhận xuất xứ","bảo hiểm hàng hóa","cargo insurance","vận chuyển hàng nguy hiểm","DG cargo",
    "hàng quá khổ quá tải","dự án logistics","project cargo","multimodal transport","vận tải đa phương thức",
    "last mile delivery","giao hàng chặng cuối","fulfillment logistics","3PL Việt Nam","dịch vụ 3PL",
    "tối ưu chi phí logistics","theo dõi lô hàng","shipment tracking","lịch tàu biển","lịch bay cargo",
    "cảng Cát Lái","cảng Hải Phòng","sân bay Tân Sơn Nhất cargo","logistics Hồ Chí Minh","công ty vận tải quốc tế"
  ];

  const CATS = ["sea","air","road","customs","warehouse","global","business"];
  const PHOTO = [
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
  ];
  const COLORS = ["#003da5","#005bff","#0a2e6b","#e31c23","#134e4a","#1e3a8a","#312e81"];
  const ACCENTS = ["#00a3e0","#7ec8ff","#ffcc00","#ffcc00","#5eead4","#fbbf24","#c4b5fd"];
  const CAT_LABEL = ["Đường biển","Hàng không","Đường bộ","Hải quan","Kho bãi","Quốc tế","Doanh nghiệp"];

  const pickCat = (kw) => {
    const k = kw.toLowerCase();
    if (/bien|tau|fcl|lcl|container|cang|booking|lading|cat lai|hai phong/.test(k)) return 0;
    if (/hang khong|air|bay cargo|airway|tan son nhat cargo/.test(k)) return 1;
    if (/duong bo|noi dia|lien tinh|dau keo|last mile|chang cuoi|cua khau/.test(k)) return 2;
    if (/hai quan|thong quan|hs code|c\/o|chung tu|kiem hoa|xuat xu|dg |nguy hiem/.test(k)) return 3;
    if (/kho|warehouse|cfs|bonded|warehousing|fulfillment/.test(k)) return 4;
    if (/trung quoc|my|han|nhat|dai|thai|singapore|duc|uc|anh|uae|indonesia|malaysia|philippines|chau au|quoc te|cross border|xuyen bien|import|export|gui hang|nhap hang|xuat khau|nhap khau/.test(k)) return 5;
    return 6;
  };

  const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  const cover = (label, ci, i) => {
    const words = label.split(" ");
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const n = line ? line + " " + w : w;
      if (n.length > 26 && line) { lines.push(line); line = w; } else line = n;
    });
    if (line) lines.push(line);
    const texts = lines.slice(0,3).map((t, idx) =>
      `<text x="40" y="${200+idx*36}" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700">${esc(t.charAt(0).toUpperCase()+t.slice(1))}</text>`
    ).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${COLORS[ci]}"/><stop offset="100%" stop-color="#050505"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g${i})"/><circle cx="1000" cy="120" r="200" fill="${ACCENTS[ci]}" opacity=".15"/><rect x="40" y="160" width="110" height="6" rx="3" fill="${ACCENTS[ci]}"/>${texts}<text x="40" y="620" fill="${ACCENTS[ci]}" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="2">MINH TUAN LOGISTICS</text><text x="1160" y="620" fill="rgba(255,255,255,.7)" font-family="Arial,sans-serif" font-size="16" text-anchor="end">${CAT_LABEL[ci]}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  const posts = LABELS.map((label, i) => {
    const ci = pickCat(KEYWORDS[i]);
    const slug = KEYWORDS[i].toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    const d = new Date(2026, 0, 2 + i);
    const iso = d.toISOString().slice(0, 10);
    const titleKw = label.charAt(0).toUpperCase() + label.slice(1);
    return {
      id: i + 1,
      keyword: label,
      slug,
      title: titleKw + ": hướng dẫn thực tiễn cho doanh nghiệp 2026",
      excerpt: "Tổng quan giải pháp liên quan đến " + label + ", giúp tối ưu chi phí và tiến độ logistics.",
      category: CATS[ci],
      categoryLabel: CAT_LABEL[ci],
      date: iso,
      dateLabel: iso.slice(8,10) + "/" + iso.slice(5,7) + "/" + iso.slice(0,4),
      photo: PHOTO[ci],
      cover: cover(label, ci, i),
      body: [
        titleKw + " đang được nhiều doanh nghiệp quan tâm khi mở rộng thị trường. Minh Tuấn Logistics đồng hành từ tư vấn, chứng từ đến giao nhận.",
        "Trong nhóm " + CAT_LABEL[ci].toLowerCase() + ", nắm rõ quy trình và chi phí giúp giảm rủi ro. Bài viết tập trung vào từ khóa “" + label + "”.",
        "Cần báo giá hoặc đặt lịch vận chuyển? Gọi 0938 961 012 — đội ngũ Minh Tuấn sẽ phản hồi sớm với phương án rõ ràng."
      ]
    };
  });

  window.NEWS_POSTS = posts;
  window.getNewsBySlug = (slug) => posts.find((p) => p.slug === slug);
  window.getLatestNews = (n = 4) => posts.slice().reverse().slice(0, n);
})();
