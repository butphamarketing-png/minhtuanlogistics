(() => {
  const data = window.BP_LOGIN;
  if (!data) return;

  const ICONS = {
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    message:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
    tag:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.6 13.4 12 22l-9-9V3h10z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    headset:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  };

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const desc = document.getElementById("loginFormDesc");
  if (desc && data.formDescription) desc.innerHTML = data.formDescription;

  const email = document.getElementById("loginEmail");
  if (email && data.emailPlaceholder) {
    email.placeholder = data.emailPlaceholder;
    if (!email.value) email.value = data.emailPlaceholder;
  }

  const hero = document.getElementById("loginHeroTitle");
  if (hero && data.heroLines?.length) {
    hero.innerHTML = data.heroLines.map((l) => esc(l)).join("<br />");
  }

  const lead = document.getElementById("loginHeroLead");
  if (lead && data.heroLead) lead.textContent = data.heroLead;

  const contacts = document.getElementById("loginContacts");
  if (contacts && data.contacts?.length) {
    contacts.innerHTML = data.contacts
      .map((c) => {
        const inner = `
          <span class="promo-chip-ico" aria-hidden="true">${ICONS[c.icon] || ICONS.globe}</span>
          <span>
            <small>${esc(c.label)}</small>
            <strong>${esc(c.value)}</strong>
          </span>`;
        return c.href
          ? `<a class="promo-chip" href="${esc(c.href)}" target="_blank" rel="noopener">${inner}</a>`
          : `<div class="promo-chip">${inner}</div>`;
      })
      .join("");
  }

  const services = document.getElementById("loginServices");
  if (services && data.services?.length) {
    services.innerHTML = data.services
      .map(
        (s) => `
      <a class="promo-service" href="${esc(s.href)}" target="_blank" rel="noopener">
        <span class="promo-service-ico" aria-hidden="true">${ICONS[s.icon] || ICONS.tag}</span>
        <span>
          <strong>${esc(s.title)}</strong>
          <small>${esc(s.desc)}</small>
        </span>
      </a>`
      )
      .join("");
  }

  const version = document.getElementById("loginVersion");
  if (version && data.version) version.textContent = data.version;
})();
