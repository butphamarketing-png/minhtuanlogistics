(() => {
  const menu = document.getElementById("mainMenu");
  if (!menu || !menu.hasAttribute("data-nav-build")) return;

  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  const items = [
    { labelKey: "nav.home", href: "index.html" },
    {
      labelKey: "nav.about",
      href: "gioi-thieu.html",
      children: [
        { labelKey: "nav.about_us", href: "gioi-thieu.html" },
        { labelKey: "nav.vision", href: "gioi-thieu.html#tam-nhin" },
        { labelKey: "nav.values", href: "gioi-thieu.html#gia-tri" },
      ],
    },
    {
      labelKey: "nav.services",
      href: "dich-vu.html",
      children: [
        { labelKey: "services.import_export", href: "dich-vu.html#xnk" },
        { labelKey: "services.domestic", href: "dich-vu.html#van-tai-noi-dia" },
        { labelKey: "services.air", href: "dich-vu.html#hang-khong" },
        { labelKey: "services.warehouse", href: "dich-vu.html#kho-bai" },
        { labelKey: "services.trade", href: "dich-vu.html#thuong-mai" },
        { labelKey: "services.consulting", href: "dich-vu.html#tu-van" },
      ],
    },
    {
      labelKey: "nav.projects",
      href: "du-an.html",
      children: [
        { labelKey: "nav.featured_projects", href: "du-an.html" },
        { labelKey: "nav.partners", href: "du-an.html#khach-hang" },
      ],
    },
    {
      labelKey: "nav.news",
      href: "tin-tuc.html",
      children: [
        { labelKey: "nav.news_events", href: "tin-tuc.html" },
        { labelKey: "nav.knowledge", href: "tin-tuc.html#kien-thuc" },
      ],
    },
    {
      labelKey: "nav.gallery",
      href: "hinh-anh.html",
      children: [
        { labelKey: "nav.photo_gallery", href: "hinh-anh.html" },
        { labelKey: "nav.videos", href: "hinh-anh.html#video" },
      ],
    },
    {
      labelKey: "nav.contact",
      href: "lien-he.html",
      children: [
        { labelKey: "nav.contact_info", href: "lien-he.html" },
        { labelKey: "nav.contact_form", href: "lien-he.html#tu-van" },
      ],
    },
  ];

  const label = (key) => (window.I18N ? window.I18N.t(key) : key);

  const isActive = (href) => {
    const page = href.split("#")[0] || "index.html";
    return page.toLowerCase() === currentPage;
  };

  const buildMenu = () => {
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
          const itemLabel = label(item.labelKey);
          if (!item.children) {
            return `<li><a href="${item.href}"${isActive(item.href) ? ' class="is-active"' : ""}>${itemLabel}</a></li>`;
          }
          const openClass = isActive(item.href) ? " is-open" : "";
          const activeClass = isActive(item.href) ? " is-active" : "";
          const childLinks = item.children
            .map((child) => `<li><a href="${child.href}">${label(child.labelKey)}</a></li>`)
            .join("");
          return `
          <li class="has-dropdown${openClass}">
            <a href="${item.href}" class="nav-parent${activeClass}">
              ${itemLabel}
              <span class="nav-caret" aria-hidden="true">▾</span>
            </a>
            <ul class="dropdown">${childLinks}</ul>
          </li>`;
        })
        .join("") + hotlineCta;
  };

  buildMenu();
  menu.removeAttribute("data-nav-build");
  window.addEventListener("localechange", buildMenu);
})();
