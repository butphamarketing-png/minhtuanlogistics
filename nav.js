(() => {
  const menu = document.getElementById("mainMenu");
  if (!menu || !menu.hasAttribute("data-nav-build")) return;

  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  const items = [
    { label: "Trang chủ", href: "index.html" },
    {
      label: "Giới thiệu",
      href: "gioi-thieu.html",
      children: [
        { label: "Về chúng tôi", href: "gioi-thieu.html" },
        { label: "Tầm nhìn & Sứ mệnh", href: "gioi-thieu.html#tam-nhin" },
        { label: "Giá trị cốt lõi", href: "gioi-thieu.html#gia-tri" },
      ],
    },
    {
      label: "Dịch vụ",
      href: "dich-vu.html",
      children: [
        { label: "Xuất nhập khẩu", href: "dich-vu.html#xnk" },
        { label: "Vận tải & Logistics", href: "dich-vu.html#logistics" },
        { label: "Thương mại", href: "dich-vu.html#thuong-mai" },
        { label: "Tư vấn doanh nghiệp", href: "dich-vu.html#tu-van" },
      ],
    },
    {
      label: "Dự án",
      href: "du-an.html",
      children: [
        { label: "Dự án tiêu biểu", href: "du-an.html" },
        { label: "Khách hàng đối tác", href: "du-an.html#khach-hang" },
      ],
    },
    {
      label: "Tin tức",
      href: "tin-tuc.html",
      children: [
        { label: "Tin tức & Sự kiện", href: "tin-tuc.html" },
        { label: "Kiến thức logistics", href: "tin-tuc.html#kien-thuc" },
      ],
    },
    {
      label: "Hình ảnh",
      href: "hinh-anh.html",
      children: [
        { label: "Thư viện ảnh", href: "hinh-anh.html" },
        { label: "Video hoạt động", href: "hinh-anh.html#video" },
      ],
    },
    {
      label: "Liên hệ",
      href: "lien-he.html",
      children: [
        { label: "Thông tin liên hệ", href: "lien-he.html" },
        { label: "Gửi yêu cầu tư vấn", href: "lien-he.html#tu-van" },
      ],
    },
  ];

  const isActive = (href) => {
    const page = href.split("#")[0] || "index.html";
    return page.toLowerCase() === currentPage;
  };

  const hotlineCta = `
    <li class="menu-cta">
      <a class="btn btn-hotline" href="tel:0938961012">
        <span class="hotline-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6.5 4.8c.4-1 1.6-1.3 2.4-.5l1.6 1.6c.7.7.8 1.8.2 2.6l-1 1.3c1.2 2.1 3.1 4 5.2 5.2l1.3-1c.8-.6 1.9-.5 2.6.2l1.6 1.6c.8.8.5 2-.5 2.4-1.3.5-2.7.7-4.1.4-3.5-.8-6.7-3.1-9.1-6.4-.8-1.1-1.2-2.4-1-3.8Z"/></svg>
        </span>
        0938 961 012
      </a>
    </li>`;

  menu.innerHTML =
    items
      .map((item) => {
        if (!item.children) {
          return `<li><a href="${item.href}"${isActive(item.href) ? ' class="is-active"' : ""}>${item.label}</a></li>`;
        }
        const openClass = isActive(item.href) ? " is-open" : "";
        const activeClass = isActive(item.href) ? " is-active" : "";
        const childLinks = item.children
          .map((child) => `<li><a href="${child.href}">${child.label}</a></li>`)
          .join("");
        return `
          <li class="has-dropdown${openClass}">
            <a href="${item.href}" class="nav-parent${activeClass}">
              ${item.label}
              <span class="nav-caret" aria-hidden="true">▾</span>
            </a>
            <ul class="dropdown">${childLinks}</ul>
          </li>`;
      })
      .join("") + hotlineCta;

  menu.removeAttribute("data-nav-build");
})();
