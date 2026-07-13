(() => {
  const STORAGE_KEY = "minhtuan_locale";
  const SUPPORTED = ["vi", "en", "zh"];
  const FLAG_SVG = {
    vi: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="12" fill="#DA251D"/><polygon fill="#FF0" points="12,5.5 13.6,10.2 18.5,10.2 14.5,12.8 16.1,17.5 12,14.9 7.9,17.5 9.5,12.8 5.5,10.2 10.4,10.2"/></svg>',
    en: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="12" fill="#012169"/><path fill="#fff" d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="3"/><path fill="none" d="M0 0l24 24M24 0L0 24" stroke="#C8102E" stroke-width="1.5"/><path fill="#fff" d="M12 0v24M0 12h24" stroke="#fff" stroke-width="5"/><path fill="none" d="M12 0v24M0 12h24" stroke="#C8102E" stroke-width="3"/></svg>',
    zh: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="12" fill="#DE2910"/><polygon fill="#FFDE00" points="6.5,6 7.3,8.6 10,8.6 7.8,10.2 8.6,12.8 6.5,11.2 4.4,12.8 5.2,10.2 3,8.6 5.7,8.6"/><polygon fill="#FFDE00" points="11.5,4.5 11.8,5.5 12.9,5.5 12,6.1 12.3,7.1 11.5,6.5 10.7,7.1 11,6.1 10.1,5.5 11.2,5.5"/><polygon fill="#FFDE00" points="13.5,6.5 13.8,7.5 14.9,7.5 14,8.1 14.3,9.1 13.5,8.5 12.7,9.1 13,8.1 12.1,7.5 13.2,7.5"/><polygon fill="#FFDE00" points="13,9.5 13.3,10.5 14.4,10.5 13.5,11.1 13.8,12.1 13,11.5 12.2,12.1 12.5,11.1 11.6,10.5 12.7,10.5"/><polygon fill="#FFDE00" points="10.5,9 10.8,10 11.9,10 11,10.6 11.3,11.6 10.5,11 9.7,11.6 10,10.6 9.1,10 10.2,10"/></svg>',
  };

  const getStoredLocale = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : "vi";
  };

  let currentLocale = getStoredLocale();

  const getDict = (locale = currentLocale) => window.I18N_TRANSLATIONS?.[locale] || {};

  const t = (key, fallback = "") => {
    const value = getDict()[key];
    if (value !== undefined) return value;
    const viValue = window.I18N_TRANSLATIONS?.vi?.[key];
    return viValue !== undefined ? viValue : fallback || key;
  };

  const applyToElement = (el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const value = t(key);
    if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = value.replace(/\n/g, "<br />");
    } else {
      el.textContent = value;
    }
  };

  const applyAttributes = (el) => {
    const placeholderKey = el.getAttribute("data-i18n-placeholder");
    if (placeholderKey) el.placeholder = t(placeholderKey);

    const ariaKey = el.getAttribute("data-i18n-aria");
    if (ariaKey) el.setAttribute("aria-label", t(ariaKey));

    const titleKey = el.getAttribute("data-i18n-title");
    if (titleKey) el.title = t(titleKey);

    const altKey = el.getAttribute("data-i18n-alt");
    if (altKey) el.alt = t(altKey);
  };

  const applyPageMeta = () => {
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) document.title = t(titleEl.getAttribute("data-i18n"));

    const descEl = document.querySelector('meta[name="description"][data-i18n]');
    if (descEl) descEl.setAttribute("content", t(descEl.getAttribute("data-i18n")));

    document.documentElement.lang = currentLocale === "zh" ? "zh-CN" : currentLocale;
  };

  const applyTranslations = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.tagName === "META" || el.tagName === "TITLE") return;
      applyToElement(el);
    });
    document.querySelectorAll("[data-i18n-placeholder], [data-i18n-aria], [data-i18n-title], [data-i18n-alt]").forEach(applyAttributes);
    applyPageMeta();
    updateSwitcherUI();
  };

  const buildSwitcher = () => {
    const navInner = document.querySelector(".nav-inner");
    if (!navInner || document.getElementById("langSwitcher")) return;

    const switcher = document.createElement("div");
    switcher.className = "lang-switcher";
    switcher.id = "langSwitcher";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("data-i18n-aria", "aria.lang");

    SUPPORTED.forEach((lang) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-btn";
      btn.dataset.lang = lang;
      btn.innerHTML = `<span class="lang-flag">${FLAG_SVG[lang]}</span><span class="lang-label" data-i18n="lang.${lang}">${lang.toUpperCase()}</span>`;
      if (lang === currentLocale) btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", lang === currentLocale ? "true" : "false");
      btn.addEventListener("click", () => setLocale(lang));
      switcher.appendChild(btn);
    });

    const navCta = navInner.querySelector(".nav-cta");
    if (navCta) navInner.insertBefore(switcher, navCta);
    else navInner.appendChild(switcher);

    switcher.setAttribute("aria-label", t("aria.lang"));
  };

  const updateSwitcherUI = () => {
    const switcher = document.getElementById("langSwitcher");
    if (!switcher) return;
    switcher.setAttribute("aria-label", t("aria.lang"));
    switcher.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === currentLocale;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      const label = btn.querySelector(".lang-label");
      if (label) label.textContent = t(`lang.${btn.dataset.lang}`);
    });
  };

  const setLocale = (locale) => {
    if (!SUPPORTED.includes(locale) || locale === currentLocale) return;
    currentLocale = locale;
    localStorage.setItem(STORAGE_KEY, locale);
    applyTranslations();
    window.dispatchEvent(new CustomEvent("localechange", { detail: { locale } }));
  };

  const init = () => {
    buildSwitcher();
    applyTranslations();
  };

  window.I18N = { t, setLocale, getLocale: () => currentLocale, apply: applyTranslations };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
