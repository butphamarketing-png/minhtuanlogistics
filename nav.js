(() => {
  const menu = document.getElementById("mainMenu");
  if (!menu || !menu.hasAttribute("data-nav-build")) return;

  const pathName = (window.location.pathname || "/").replace(/\/$/, "") || "/";

  const items = [
    { labelKey: "nav.home", href: "/" },
    {
      labelKey: "nav.about",
      href: "/gioi-thieu",
      children: [
        { labelKey: "nav.about_us", href: "/gioi-thieu/ve-chung-toi" },
        { labelKey: "nav.vision", href: "/gioi-thieu/tam-nhin" },
        { labelKey: "nav.values", href: "/gioi-thieu/gia-tri" },
      ],
    },
    {
      labelKey: "nav.services",
      href: "/dich-vu",
      children: [
        { labelKey: "services.import_export", href: "/dich-vu/xuat-nhap-khau" },
        { labelKey: "services.sea", href: "/dich-vu/van-chuyen-duong-bien" },
        { labelKey: "services.domestic", href: "/dich-vu/van-chuyen-duong-bo" },
        { labelKey: "services.air", href: "/dich-vu/van-chuyen-hang-khong" },
        { labelKey: "services.warehouse", href: "/dich-vu/kho-bai-logistics" },
        { labelKey: "services.trade", href: "/dich-vu/thuong-mai" },
        { labelKey: "services.consulting", href: "/dich-vu/tu-van-doanh-nghiep" },
      ],
    },
    {
      labelKey: "nav.projects",
      href: "/du-an",
      children: [
        { labelKey: "nav.featured_projects", href: "/du-an" },
        { labelKey: "nav.partners", href: "/du-an#khach-hang" },
      ],
    },
    {
      labelKey: "nav.news",
      href: "/tin-tuc",
      children: [
        { labelKey: "nav.news_events", href: "/tin-tuc" },
        { labelKey: "nav.knowledge", href: "/tin-tuc#kien-thuc" },
      ],
    },
    {
      labelKey: "nav.gallery",
      href: "/hinh-anh",
      children: [
        { labelKey: "nav.photo_gallery", href: "/hinh-anh" },
        { labelKey: "nav.videos", href: "/hinh-anh#video" },
      ],
    },
    {
      labelKey: "nav.contact",
      href: "/lien-he",
      children: [
        { labelKey: "nav.contact_info", href: "/lien-he" },
        { labelKey: "nav.contact_form", href: "/lien-he#tu-van" },
      ],
    },
  ];

  const label = (key) => (window.I18N ? window.I18N.t(key) : key);

  const normalize = (href) => {
    const path = (href || "/").split("#")[0].replace(/\.html$/, "");
    if (!path || path === "index") return "/";
    return path.startsWith("/") ? path.replace(/\/$/, "") || "/" : `/${path}`;
  };

  const isActive = (href) => {
    const target = normalize(href);
    if (target === "/") return pathName === "/" || pathName === "/index";
    return pathName === target || pathName.startsWith(`${target}/`);
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

  // Keep desktop dropdown open briefly after mouse leaves (easier to reach items)
  const CLOSE_DELAY_MS = 350;
  let closeTimer = null;
  const isDesktopNav = () => window.matchMedia("(min-width: 1025px)").matches;

  const clearHoverExcept = (keep) => {
    menu.querySelectorAll(".has-dropdown.is-hover").forEach((el) => {
      if (el !== keep) el.classList.remove("is-hover");
    });
  };

  menu.addEventListener("pointerover", (e) => {
    if (!isDesktopNav()) return;
    const item = e.target.closest(".has-dropdown");
    if (!item || !menu.contains(item)) return;
    clearTimeout(closeTimer);
    clearHoverExcept(item);
    item.classList.add("is-hover");
  });

  menu.addEventListener("pointerout", (e) => {
    if (!isDesktopNav()) return;
    const item = e.target.closest(".has-dropdown");
    if (!item || !menu.contains(item)) return;
    const related = e.relatedTarget;
    if (related && item.contains(related)) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => item.classList.remove("is-hover"), CLOSE_DELAY_MS);
  });
})();
