/**
 * Phase 3: Upgrade 20 pillar articles — better lead, internal links, dateModified.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const postsPath = path.join(root, "data", "news-posts.json");
const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

const PILLARS = [
  {
    slug: "xuat-nhap-khau",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt:
      "Hướng dẫn xuất nhập khẩu tại TP.HCM: chứng từ, mã HS, ủy thác và mốc thời gian — kèm cách nhận báo giá nhanh từ Minh Tuấn Logistics.",
  },
  {
    slug: "khai-bao-hai-quan",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt:
      "Khai báo hải quan đúng giúp giảm chậm thông quan. Quy trình điện tử, lỗi thường gặp và checklist chứng từ cho doanh nghiệp TP.HCM.",
  },
  {
    slug: "khai-bao-hai-quan-cat-lai",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt:
      "Khai báo hải quan khu vực Cát Lái: lưu ý lịch cắt máng, chứng từ container và phối hợp cảng — kinh nghiệm thực tế từ Minh Tuấn.",
  },
  {
    slug: "freight-forwarding",
    service: "/dich-vu",
    excerpt:
      "Freight forwarding là gì và khi nào doanh nghiệp nên thuê forwarder? So sánh tự làm vs ủy thác tại TP.HCM.",
  },
  {
    slug: "van-chuyen-duong-bien",
    service: "/dich-vu/van-chuyen-duong-bien",
    excerpt:
      "Vận chuyển đường biển FCL/LCL từ TP.HCM: chọn tuyến, tối ưu chi phí và theo dõi lịch tàu thực tế.",
  },
  {
    slug: "van-chuyen-duong-bo",
    service: "/dich-vu/van-chuyen-duong-bo",
    excerpt:
      "Vận chuyển đường bộ nội địa/liên tỉnh và kéo container: lịch trình, an toàn hàng và báo giá nhanh.",
  },
  {
    slug: "van-chuyen-hang-khong",
    service: "/dich-vu/van-chuyen-hang-khong",
    excerpt:
      "Vận chuyển hàng không gần Tân Sơn Nhất: khi nào nên bay, chứng từ và door-to-door cho hàng gấp.",
  },
  {
    slug: "van-chuyen-hang-hoa",
    service: "/dich-vu",
    excerpt:
      "Tổng quan vận chuyển hàng hóa đa phương thức tại TP.HCM — chọn biển, bộ hay hàng không theo ngân sách và tiến độ.",
  },
  {
    slug: "thong-quan-hang-hoa",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt:
      "Thông quan hàng hóa mất bao lâu? Các bước, rủi ro kiểm tra và cách chuẩn bị hồ sơ để rút ngắn thời gian.",
  },
  {
    slug: "uy-thac-xuat-nhap-khau",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt:
      "Ủy thác xuất nhập khẩu giúp SME giảm gánh nặng chứng từ. Phạm vi dịch vụ, chi phí và quy trình làm việc với Minh Tuấn.",
  },
  {
    slug: "bao-gia-van-chuyen",
    service: "/lien-he",
    excerpt:
      "Báo giá vận chuyển logistics phụ thuộc yếu tố nào? Checklist thông tin cần gửi để nhận báo giá trong 24 giờ.",
  },
  {
    slug: "logistics-tp-hcm",
    service: "/gioi-thieu/cong-ty-logistics-tp-hcm",
    excerpt:
      "Logistics TP.HCM: lợi thế vị trí Tân Sơn Nhất – Cát Lái và cách chọn đối tác đồng hành dài hạn.",
  },
  {
    slug: "cong-ty-logistics",
    service: "/gioi-thieu/cong-ty-logistics-tp-hcm",
    excerpt:
      "Tiêu chí chọn công ty logistics: năng lực hải quan, vận tải, kho bãi và minh bạch chi phí.",
  },
  {
    slug: "project-cargo",
    service: "/dich-vu",
    excerpt:
      "Project cargo cần khảo sát kích thước, phương án nâng hạ và lịch trình đặc thù — lưu ý trước khi booking.",
  },
  {
    slug: "warehousing",
    service: "/dich-vu/kho-bai-logistics",
    excerpt:
      "Warehousing / kho bãi tại TP.HCM: lưu trữ, đóng gói và kết nối phân phối với chuỗi XNK.",
  },
  {
    slug: "fcl",
    service: "/dich-vu/van-chuyen-duong-bien",
    excerpt: "FCL (Full Container Load): khi nào nên đi nguyên container và cách tối ưu chi phí tuyến biển.",
  },
  {
    slug: "lcl",
    service: "/dich-vu/van-chuyen-duong-bien",
    excerpt: "LCL hàng lẻ: ưu nhược điểm, thời gian ghép hàng và lưu ý chứng từ khi xuất/nhập qua TP.HCM.",
  },
  {
    slug: "incoterms",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt: "Incoterms ảnh hưởng phân chia chi phí và rủi ro ra sao? Gợi ý chọn điều kiện phù hợp hợp đồng mua bán.",
  },
  {
    slug: "ma-hs",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt: "Mã HS sai gây chậm thông quan và phát sinh thuế. Cách rà soát mã trước khi khai báo.",
  },
  {
    slug: "chung-tu-xuat-nhap-khau",
    service: "/dich-vu/xuat-nhap-khau",
    excerpt: "Bộ chứng từ xuất nhập khẩu cơ bản và checklist trước khi gửi forwarder/hải quan.",
  },
];

const today = "2026-07-25";
const padLabel = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

let count = 0;
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

for (const cfg of PILLARS) {
  // fuzzy find if exact slug missing
  let post = bySlug[cfg.slug];
  if (!post) {
    post = posts.find((p) => p.slug.includes(cfg.slug) || (p.keyword || "").toLowerCase().includes(cfg.slug.replace(/-/g, " ")));
  }
  if (!post) {
    console.log(`· skip missing: ${cfg.slug}`);
    continue;
  }

  post.excerpt = cfg.excerpt;
  post.metaDescription = `${cfg.excerpt} Hotline 0938 961 012.`.slice(0, 160);
  post.dateModified = today;
  post.internalLinks = [
    cfg.service,
    "/lien-he",
    "/dich-vu",
    ...(post.internalLinks || []),
  ].filter((v, i, a) => a.indexOf(v) === i);
  post.externalLinks = ["https://www.customs.gov.vn/", ...(post.externalLinks || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  // Strengthen first paragraph / add CTA block at end of sections
  if (Array.isArray(post.sections) && post.sections.length) {
    const sections = post.sections.map((s) => ({ ...s, paragraphs: [...(s.paragraphs || [])] }));
    // improve first text block
    const firstP = sections.find((s) => (s.paragraphs && s.paragraphs.length) || s.type === "p");
    if (firstP) {
      if (firstP.paragraphs?.length) {
        firstP.paragraphs[0] = `${cfg.excerpt} ${firstP.paragraphs[0]}`.slice(0, 420);
      } else if (firstP.type === "p" && firstP.text) {
        firstP.text = `${cfg.excerpt} ${firstP.text}`.slice(0, 420);
      }
    }
    const last = sections[sections.length - 1];
    const cta = `Cần tư vấn ${post.keyword}? Xem [dịch vụ liên quan](${cfg.service}), [nhận báo giá](/lien-he) hoặc gọi 0938 961 012. Tham khảo [Hải quan Việt Nam](https://www.customs.gov.vn/). Cập nhật ${padLabel(today)}.`;
    if (last.paragraphs) {
      if (!last.paragraphs.some((p) => p.includes("0938 961 012") && p.includes(cfg.service))) {
        last.paragraphs.push(cta);
      }
    } else if (last.type === "p") {
      sections.push({ type: "p", text: cta });
    } else {
      sections.push({ heading: "Bước tiếp theo", paragraphs: [cta] });
    }
    post.sections = sections;
  }

  count++;
  console.log(`✓ ${post.slug}`);
}

fs.writeFileSync(postsPath, JSON.stringify(posts), "utf8");
console.log(`Upgraded ${count} pillar posts`);
