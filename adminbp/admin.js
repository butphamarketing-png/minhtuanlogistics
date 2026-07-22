(() => {
  const API = "/api";
  let token = localStorage.getItem("admin_token") || "";
  let currentView = "dashboard";

  const $ = (sel) => document.querySelector(sel);
  const content = $("#content");
  const loginScreen = $("#loginScreen");
  const adminApp = $("#adminApp");
  const toast = $("#toast");

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.hidden = true; }, 2800);
  };

  const api = async (path, opts = {}) => {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...opts, headers, credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      token = "";
      localStorage.removeItem("admin_token");
      showLogin();
      throw new Error("Phiên đăng nhập hết hạn");
    }
    if (!res.ok) throw new Error(data.error || "Lỗi API");
    return data;
  };

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const showLogin = () => {
    loginScreen.hidden = false;
    adminApp.hidden = true;
  };

  const showApp = (user) => {
    loginScreen.hidden = true;
    adminApp.hidden = false;
    $("#topbarUser").textContent = user || "admin";
    renderView(currentView);
  };

  const checkAuth = async () => {
    if (!token) return showLogin();
    try {
      const me = await api("/auth/me");
      showApp(me.user);
    } catch {
      showLogin();
    }
  };

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const errEl = $("#loginError");
    errEl.hidden = true;
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
      });
      token = data.token;
      localStorage.setItem("admin_token", token);
      showApp(data.user);
    } catch (err) {
      errEl.textContent = err.message;
      errEl.hidden = false;
    }
  });

  $("#togglePassword")?.addEventListener("click", () => {
    const input = $("#loginPassword");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  });

  $("#logoutBtn").addEventListener("click", async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch (_) {}
    token = "";
    localStorage.removeItem("admin_token");
    showLogin();
  });

  $("#sidebarNav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    currentView = btn.dataset.view;
    $("#sidebarNav").querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
    renderView(currentView);
  });

  const titles = {
    dashboard: "Tổng quan website",
    settings: "Thông tin & Footer",
    homepage: "Trang chủ",
    pages: "Trang con",
    news: "Tin tức",
    gallery: "Thư viện ảnh",
    translations: "Đa ngôn ngữ",
    submissions: "Yêu cầu khách hàng",
    media: "Thư viện Media",
  };

  async function renderView(view) {
    $("#viewTitle").textContent = titles[view] || view;
    content.innerHTML = '<p class="empty">Đang tải...</p>';
    try {
      if (view === "dashboard") await renderDashboard();
      else if (view === "settings") await renderSettings();
      else if (view === "homepage") await renderHomepage();
      else if (view === "pages") await renderPages();
      else if (view === "news") await renderNews();
      else if (view === "gallery") await renderGallery();
      else if (view === "translations") await renderTranslations();
      else if (view === "submissions") await renderSubmissions();
      else if (view === "media") await renderMedia();
    } catch (err) {
      content.innerHTML = `<p class="empty">${esc(err.message)}</p>`;
    }
  }

  async function renderDashboard() {
    const d = await api("/dashboard");
    content.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><strong>${d.news}</strong><span>Bài viết tin tức</span></div>
        <div class="stat-card"><strong>${d.published}</strong><span>Đang xuất bản</span></div>
        <div class="stat-card"><strong>${d.submissions}</strong><span>Yêu cầu khách hàng</span></div>
        <div class="stat-card"><strong>${d.media}</strong><span>File media</span></div>
      </div>
      <div class="panel">
        <h3>Quản lý toàn bộ website</h3>
        <div class="form-grid" style="margin-top:12px">
          <button type="button" class="btn btn-ghost go-view" data-view="settings">⚙️ Hotline, email, footer, SEO</button>
          <button type="button" class="btn btn-ghost go-view" data-view="homepage">🏠 Slideshow, dịch vụ, quy trình, đánh giá</button>
          <button type="button" class="btn btn-ghost go-view" data-view="pages">📄 Giới thiệu, dự án, liên hệ...</button>
          <button type="button" class="btn btn-ghost go-view" data-view="news">📰 Tin tức & SEO bài viết</button>
          <button type="button" class="btn btn-ghost go-view" data-view="gallery">🖼️ Thư viện ảnh & video</button>
          <button type="button" class="btn btn-ghost go-view" data-view="translations">🌐 Nội dung VI / EN / 中文</button>
          <button type="button" class="btn btn-ghost go-view" data-view="submissions">📬 Form liên hệ & đặt lịch</button>
          <button type="button" class="btn btn-ghost go-view" data-view="media">📁 Upload logo, banner...</button>
        </div>
      </div>`;
    content.querySelectorAll(".go-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentView = btn.dataset.view;
        $("#sidebarNav").querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b.dataset.view === currentView));
        renderView(currentView);
      });
    });
  }

  async function renderSettings() {
    const s = await api("/settings");
    content.innerHTML = `
      <form id="settingsForm" class="panel">
        <h3>Thông tin liên hệ</h3>
        <div class="form-grid">
          <label>Tên công ty<input name="company" value="${esc(s.company)}" /></label>
          <label>Hotline<input name="hotline" value="${esc(s.hotline)}" /></label>
          <label>SĐT (số)<input name="phone" value="${esc(s.phone)}" /></label>
          <label>Email<input name="email" value="${esc(s.email)}" /></label>
          <label>Địa chỉ<input name="address" value="${esc(s.address)}" /></label>
          <label>Website<input name="website" value="${esc(s.website)}" /></label>
          <label>URL website (SEO)<input name="siteUrl" value="${esc(s.siteUrl)}" placeholder="https://www.minhtuan.com" /></label>
          <label>Giờ làm việc<input name="workingHours" value="${esc(s.workingHours)}" /></label>
        </div>
        <h3 style="margin-top:20px">Mạng xã hội</h3>
        <div class="form-grid">
          <label>Facebook<input name="social.facebook" value="${esc(s.social?.facebook)}" /></label>
          <label>Zalo<input name="social.zalo" value="${esc(s.social?.zalo)}" /></label>
          <label>Messenger<input name="social.messenger" value="${esc(s.social?.messenger)}" /></label>
          <label>LinkedIn<input name="social.linkedin" value="${esc(s.social?.linkedin)}" /></label>
          <label>Google Maps<input name="social.maps" value="${esc(s.social?.maps)}" /></label>
        </div>
        <h3 style="margin-top:20px">SEO trang chủ</h3>
        <div class="form-grid">
          <label>Tiêu đề<input name="seo.homeTitle" value="${esc(s.seo?.homeTitle)}" /></label>
          <label style="grid-column:1/-1">Mô tả<textarea name="seo.homeDescription">${esc(s.seo?.homeDescription)}</textarea></label>
          <label style="grid-column:1/-1">Từ khóa<textarea name="seo.keywords" placeholder="logistics, xuất nhập khẩu, ...">${esc(s.seo?.keywords)}</textarea></label>
          <label>Ảnh OG (Open Graph)<input name="seo.ogImage" value="${esc(s.seo?.ogImage)}" placeholder="/logo.png" /></label>
        </div>
        <h3 style="margin-top:20px">Footer & Logo</h3>
        <div class="form-grid">
          <label>Logo URL<input name="logo" value="${esc(s.logo)}" placeholder="/logo.png" /></label>
          <label style="grid-column:1/-1">Mô tả footer<textarea name="footer.desc">${esc(s.footer?.desc)}</textarea></label>
          <label style="grid-column:1/-1">Copyright<textarea name="footer.copyright">${esc(s.footer?.copyright)}</textarea></label>
        </div>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Lưu cài đặt</button></div>
      </form>`;

    $("#settingsForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = { ...s, social: { ...s.social }, seo: { ...s.seo }, footer: { ...s.footer } };
      for (const [k, v] of fd.entries()) {
        if (k.startsWith("social.")) data.social[k.slice(7)] = v;
        else if (k.startsWith("seo.")) data.seo[k.slice(4)] = v;
        else if (k.startsWith("footer.")) data.footer[k.slice(7)] = v;
        else data[k] = v;
      }
      await api("/settings", { method: "PUT", body: JSON.stringify(data) });
      showToast("Đã lưu cài đặt");
    });
  }

  async function renderHomepage() {
    const h = await api("/homepage");
    const slidesHtml = (h.heroSlides || [])
      .map(
        (sl, i) => `
        <div class="panel" data-slide="${i}">
          <h3>Slide ${i + 1}</h3>
          <div class="form-grid">
            <label>URL ảnh<input class="slide-src" value="${esc(sl.src)}" /></label>
            <label>Mô tả alt<input class="slide-alt" value="${esc(sl.alt)}" /></label>
          </div>
        </div>`
      )
      .join("");

    const statsHtml = (h.stats || [])
      .map(
        (st, i) => `
        <div class="form-grid panel" data-stat="${i}">
          <label>Giá trị<input class="stat-value" type="number" value="${st.value}" /></label>
          <label>Hậu tố<input class="stat-suffix" value="${esc(st.suffix)}" /></label>
          <label>Nhãn<input class="stat-label" value="${esc(st.label)}" /></label>
        </div>`
      )
      .join("");

    content.innerHTML = `
      <form id="homepageForm">
        <div class="panel">
          <h3>Hero — Tiêu đề chính</h3>
          <div class="form-grid">
            <label>Brand<input class="hero-brand" value="${esc(h.hero?.brand)}" /></label>
            <label>Dòng 1<input class="hero-h1" value="${esc(h.hero?.headline1)}" /></label>
            <label>Dòng 2 (accent)<input class="hero-h2" value="${esc(h.hero?.headline2)}" /></label>
            <label style="grid-column:1/-1">Mô tả ngắn<textarea class="hero-lead">${esc(h.hero?.lead)}</textarea></label>
          </div>
        </div>
        <h3 style="margin-bottom:12px">Hero Slideshow</h3>
        ${slidesHtml}
        <h3 style="margin:20px 0 12px">Dịch vụ (7 thẻ)</h3>
        <div id="servicesList"></div>
        <h3 style="margin:20px 0 12px">Thống kê</h3>
        ${statsHtml}
        <h3 style="margin:20px 0 12px">Tại sao chọn chúng tôi</h3>
        <div id="whyList"></div>
        <h3 style="margin:20px 0 12px">Quy trình làm việc</h3>
        <div id="processList"></div>
        <h3 style="margin:20px 0 12px">Đánh giá khách hàng</h3>
        <div id="testimonialsList"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="addTestimonial">+ Thêm đánh giá</button>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Lưu trang chủ</button></div>
      </form>`;

    const renderServices = () => {
      $("#servicesList").innerHTML = (h.services || [])
        .map(
          (svc, i) => `
          <div class="panel" data-service="${i}">
            <div class="form-grid">
              <label>Tên dịch vụ<input class="svc-title" value="${esc(svc.title)}" /></label>
              <label>Link<input class="svc-link" value="${esc(svc.link)}" /></label>
              <label style="grid-column:1/-1">URL ảnh<input class="svc-image" value="${esc(svc.image)}" /></label>
              <label style="grid-column:1/-1">Alt ảnh<input class="svc-alt" value="${esc(svc.alt)}" /></label>
            </div>
          </div>`
        )
        .join("");
    };
    renderServices();

    const renderWhy = () => {
      $("#whyList").innerHTML = (h.whyChoose || [])
        .map(
          (w, i) => `
          <div class="form-grid panel" data-why="${i}">
            <label>Tiêu đề<input class="why-title" value="${esc(w.title)}" /></label>
            <label style="grid-column:1/-1">Mô tả<textarea class="why-text">${esc(w.text)}</textarea></label>
          </div>`
        )
        .join("");
    };
    renderWhy();

    const renderProcess = () => {
      $("#processList").innerHTML = (h.process || [])
        .map(
          (p, i) => `
          <div class="form-grid panel" data-process="${i}">
            <label>Bước ${i + 1}<input class="proc-title" value="${esc(p.title)}" /></label>
            <label style="grid-column:1/-1">Mô tả<textarea class="proc-text">${esc(p.text)}</textarea></label>
          </div>`
        )
        .join("");
    };
    renderProcess();

    const renderTestimonials = () => {
      const list = $("#testimonialsList");
      list.innerHTML = (h.testimonials || [])
        .map(
          (t, i) => `
          <div class="panel" data-testimonial="${i}">
            <div class="form-grid">
              <label>Tên<input class="t-name" value="${esc(t.name)}" /></label>
              <label>Chức vụ<input class="t-role" value="${esc(t.role)}" /></label>
              <label style="grid-column:1/-1">Nội dung<textarea class="t-text">${esc(t.text)}</textarea></label>
              <label style="grid-column:1/-1">Avatar URL<input class="t-avatar" value="${esc(t.avatar)}" /></label>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-t">Xóa</button>
          </div>`
        )
        .join("");
      list.querySelectorAll(".remove-t").forEach((btn) => {
        btn.addEventListener("click", () => {
          h.testimonials.splice(Number(btn.closest("[data-testimonial]").dataset.testimonial), 1);
          renderTestimonials();
        });
      });
    };
    renderTestimonials();

    $("#addTestimonial").addEventListener("click", () => {
      h.testimonials.push({ name: "", role: "", text: "", avatar: "" });
      renderTestimonials();
    });

    $("#homepageForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      h.hero = {
        brand: content.querySelector(".hero-brand")?.value || "",
        headline1: content.querySelector(".hero-h1")?.value || "",
        headline2: content.querySelector(".hero-h2")?.value || "",
        lead: content.querySelector(".hero-lead")?.value || "",
      };
      h.heroSlides = [...content.querySelectorAll("[data-slide]")].map((el) => ({
        src: el.querySelector(".slide-src").value,
        alt: el.querySelector(".slide-alt").value,
      }));
      h.services = [...content.querySelectorAll("[data-service]")].map((el) => ({
        title: el.querySelector(".svc-title").value,
        link: el.querySelector(".svc-link").value,
        image: el.querySelector(".svc-image").value,
        alt: el.querySelector(".svc-alt").value,
      }));
      h.stats = [...content.querySelectorAll("[data-stat]")].map((el) => ({
        value: Number(el.querySelector(".stat-value").value),
        suffix: el.querySelector(".stat-suffix").value,
        label: el.querySelector(".stat-label").value,
      }));
      h.whyChoose = [...content.querySelectorAll("[data-why]")].map((el) => ({
        title: el.querySelector(".why-title").value,
        text: el.querySelector(".why-text").value,
      }));
      h.process = [...content.querySelectorAll("[data-process]")].map((el) => ({
        title: el.querySelector(".proc-title").value,
        text: el.querySelector(".proc-text").value,
      }));
      h.testimonials = [...content.querySelectorAll("[data-testimonial]")].map((el) => ({
        name: el.querySelector(".t-name").value,
        role: el.querySelector(".t-role").value,
        text: el.querySelector(".t-text").value,
        avatar: el.querySelector(".t-avatar").value,
      }));
      await api("/homepage", { method: "PUT", body: JSON.stringify(h) });
      showToast("Đã lưu trang chủ");
    });
  }

  async function renderPages() {
    const pages = await api("/pages");
    const pageKeys = Object.keys(pages);
    content.innerHTML = `
      <form id="pagesForm">
        <p style="color:var(--muted);margin:0 0 16px">Chỉnh tiêu đề, mô tả hero các trang con. Nội dung chi tiết chỉnh thêm tại <strong>Đa ngôn ngữ</strong>.</p>
        ${pageKeys
          .map(
            (key) => `
          <div class="panel" data-page="${key}">
            <h3>${esc(key.toUpperCase())}</h3>
            <div class="form-grid">
              <label>Tiêu đề<input class="pg-title" value="${esc(pages[key].title)}" /></label>
              <label style="grid-column:1/-1">Mô tả<textarea class="pg-desc">${esc(pages[key].desc)}</textarea></label>
              ${pages[key].image !== undefined ? `<label style="grid-column:1/-1">Ảnh (about)<input class="pg-image" value="${esc(pages[key].image)}" /></label>` : ""}
              ${pages[key].featured !== undefined ? `<label style="grid-column:1/-1">Dự án tiêu biểu<textarea class="pg-featured">${esc(pages[key].featured)}</textarea></label>` : ""}
              ${pages[key].partners !== undefined ? `<label style="grid-column:1/-1">Đối tác<textarea class="pg-partners">${esc(pages[key].partners)}</textarea></label>` : ""}
              ${pages[key].videoTitle !== undefined ? `<label>Video title<input class="pg-vtitle" value="${esc(pages[key].videoTitle)}" /></label>` : ""}
              ${pages[key].videoText !== undefined ? `<label style="grid-column:1/-1">Video mô tả<textarea class="pg-vtext">${esc(pages[key].videoText)}</textarea></label>` : ""}
            </div>
          </div>`
          )
          .join("")}
        <div class="form-actions"><button type="submit" class="btn btn-primary">Lưu trang con</button></div>
      </form>`;

    $("#pagesForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      [...content.querySelectorAll("[data-page]")].forEach((el) => {
        const key = el.dataset.page;
        pages[key] = {
          ...pages[key],
          title: el.querySelector(".pg-title")?.value || pages[key].title,
          desc: el.querySelector(".pg-desc")?.value || pages[key].desc,
        };
        const img = el.querySelector(".pg-image");
        if (img) pages[key].image = img.value;
        const feat = el.querySelector(".pg-featured");
        if (feat) pages[key].featured = feat.value;
        const part = el.querySelector(".pg-partners");
        if (part) pages[key].partners = part.value;
        const vt = el.querySelector(".pg-vtitle");
        if (vt) pages[key].videoTitle = vt.value;
        const vtx = el.querySelector(".pg-vtext");
        if (vtx) pages[key].videoText = vtx.value;
      });
      await api("/pages", { method: "PUT", body: JSON.stringify(pages) });
      showToast("Đã lưu trang con");
    });
  }

  async function renderNews(editId) {
    const posts = await api("/news");
    if (editId === "new") {
      content.innerHTML = renderNewsForm({});
      bindNewsForm(null, posts);
      return;
    }
    if (editId) {
      const post = posts.find((p) => String(p.id) === editId || p.slug === editId);
      content.innerHTML = renderNewsForm(post || {});
      bindNewsForm(post, posts);
      return;
    }

    content.innerHTML = `
      <div class="form-actions" style="margin-bottom:16px">
        <button type="button" class="btn btn-primary" id="newPostBtn">+ Thêm bài viết</button>
      </div>
      <div class="table-wrap panel" style="padding:0">
        <table>
          <thead><tr><th>Tiêu đề</th><th>Danh mục</th><th>Ngày</th><th>TT</th><th></th></tr></thead>
          <tbody>
            ${posts
              .map(
                (p) => `
              <tr>
                <td>${esc(p.title)}</td>
                <td>${esc(p.categoryLabel || p.category)}</td>
                <td>${esc(p.dateLabel || p.date)}</td>
                <td><span class="badge ${p.published !== false ? "badge-ok" : "badge-off"}">${p.published !== false ? "Xuất bản" : "Ẩn"}</span></td>
                <td class="row-actions">
                  <button type="button" class="btn btn-ghost btn-sm edit-post" data-id="${p.id}">Sửa</button>
                  <button type="button" class="btn btn-danger btn-sm del-post" data-id="${p.id}">Xóa</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;

    $("#newPostBtn").addEventListener("click", () => renderNews("new"));
    content.querySelectorAll(".edit-post").forEach((b) =>
      b.addEventListener("click", () => renderNews(b.dataset.id))
    );
    content.querySelectorAll(".del-post").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Xóa bài viết này?")) return;
        await api(`/news/${b.dataset.id}`, { method: "DELETE" });
        showToast("Đã xóa");
        renderNews();
      })
    );
  }

  function renderNewsForm(p) {
    return `
      <form id="newsForm" class="panel">
        <h3>${p.id ? "Sửa bài viết" : "Thêm bài viết"}</h3>
        <div class="form-grid">
          <label style="grid-column:1/-1">Tiêu đề<input name="title" value="${esc(p.title)}" required /></label>
          <label>Từ khóa<input name="keyword" value="${esc(p.keyword)}" /></label>
          <label>Slug<input name="slug" value="${esc(p.slug)}" /></label>
          <label>Danh mục<input name="category" value="${esc(p.category)}" placeholder="sea, air, road..." /></label>
          <label>Nhãn DM<input name="categoryLabel" value="${esc(p.categoryLabel)}" /></label>
          <label>Ngày<input name="date" type="date" value="${esc(p.date)}" /></label>
          <label>Ảnh cover<input name="cover" value="${esc(p.cover)}" /></label>
          <label>Ảnh nội dung<input name="photo" value="${esc(p.photo)}" /></label>
          <label style="grid-column:1/-1">Mô tả ngắn<textarea name="excerpt">${esc(p.excerpt)}</textarea></label>
          <label style="grid-column:1/-1">Nội dung (mỗi đoạn 1 dòng)<textarea name="body" rows="6">${esc((p.body || []).join("\n"))}</textarea></label>
          <label><input type="checkbox" name="published" ${p.published !== false ? "checked" : ""} /> Xuất bản</label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Lưu</button>
          <button type="button" class="btn btn-ghost" id="backNews">← Quay lại</button>
        </div>
      </form>`;
  }

  function bindNewsForm(post, _posts) {
    $("#backNews").addEventListener("click", () => renderNews());
    $("#newsForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = {
        title: fd.get("title"),
        keyword: fd.get("keyword"),
        slug: fd.get("slug"),
        category: fd.get("category"),
        categoryLabel: fd.get("categoryLabel"),
        date: fd.get("date"),
        cover: fd.get("cover"),
        photo: fd.get("photo"),
        excerpt: fd.get("excerpt"),
        body: String(fd.get("body") || "")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        published: fd.get("published") === "on",
        dateLabel: fd.get("date") ? new Date(fd.get("date")).toLocaleDateString("vi-VN") : "",
      };
      if (post?.id) {
        await api(`/news/${post.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/news", { method: "POST", body: JSON.stringify(body) });
      }
      showToast("Đã lưu bài viết");
      renderNews();
    });
  }

  async function renderGallery() {
    const g = await api("/gallery");
    content.innerHTML = `
      <form id="galleryForm" class="panel">
        <h3>Thư viện ảnh</h3>
        <div id="galleryImages"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="addImage">+ Thêm ảnh</button>
        <label style="margin-top:16px;display:block">Video URL (YouTube embed)<input name="videoUrl" value="${esc(g.videoUrl)}" /></label>
        <div class="form-actions"><button type="submit" class="btn btn-primary">Lưu gallery</button></div>
      </form>`;

    const renderImages = () => {
      $("#galleryImages").innerHTML = (g.images || [])
        .map(
          (img, i) => `
          <div class="form-grid panel" data-img="${i}">
            <label>URL<input class="img-src" value="${esc(img.src)}" /></label>
            <label>Alt<input class="img-alt" value="${esc(img.alt)}" /></label>
            <button type="button" class="btn btn-danger btn-sm remove-img">Xóa</button>
          </div>`
        )
        .join("");
      $("#galleryImages").querySelectorAll(".remove-img").forEach((btn) => {
        btn.addEventListener("click", () => {
          g.images.splice(Number(btn.closest("[data-img]").dataset.img), 1);
          renderImages();
        });
      });
    };
    renderImages();
    $("#addImage").addEventListener("click", () => {
      g.images.push({ src: "", alt: "" });
      renderImages();
    });
    $("#galleryForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      g.images = [...content.querySelectorAll("[data-img]")].map((el) => ({
        src: el.querySelector(".img-src").value,
        alt: el.querySelector(".img-alt").value,
      }));
      g.videoUrl = new FormData(e.target).get("videoUrl");
      await api("/gallery", { method: "PUT", body: JSON.stringify(g) });
      showToast("Đã lưu gallery");
    });
  }

  async function renderTranslations() {
    const t = await api("/translations");
    const locales = ["vi", "en", "zh"];
    const keys = [...new Set(locales.flatMap((l) => Object.keys(t[l] || {})))].sort();

    content.innerHTML = `
      <div class="panel">
        <div class="form-grid" style="margin-bottom:16px">
          <label>Locale<select id="transLocale">${locales.map((l) => `<option value="${l}">${l.toUpperCase()}</option>`).join("")}</select></label>
          <label>Tìm key<input id="transSearch" placeholder="hero.title, nav.home..." /></label>
        </div>
        <div id="transList"></div>
        <div class="form-actions"><button type="button" class="btn btn-primary" id="saveTrans">Lưu bản dịch</button></div>
      </div>`;

    const renderList = () => {
      const loc = $("#transLocale").value;
      const q = ($("#transSearch").value || "").toLowerCase();
      const filtered = keys.filter((k) => !q || k.includes(q));
      $("#transList").innerHTML = filtered
        .slice(0, 80)
        .map(
          (k) => `
          <label style="margin-bottom:10px;display:grid;gap:4px">
            <span style="font-size:11px;color:var(--muted)">${esc(k)}</span>
            <input data-key="${esc(k)}" value="${esc(t[loc]?.[k] || "")}" />
          </label>`
        )
        .join("");
      if (filtered.length > 80) {
        $("#transList").innerHTML += `<p class="empty">Hiển thị 80/${filtered.length} key — dùng tìm kiếm để thu hẹp</p>`;
      }
    };

    renderList();
    $("#transLocale").addEventListener("change", renderList);
    $("#transSearch").addEventListener("input", renderList);

    $("#saveTrans").addEventListener("click", async () => {
      const loc = $("#transLocale").value;
      $("#transList").querySelectorAll("[data-key]").forEach((inp) => {
        if (!t[loc]) t[loc] = {};
        t[loc][inp.dataset.key] = inp.value;
      });
      await api("/translations", { method: "PUT", body: JSON.stringify(t) });
      showToast("Đã lưu & cập nhật translations.js");
    });
  }

  async function renderSubmissions() {
    const list = await api("/submissions");
    content.innerHTML = `
      <div class="table-wrap panel" style="padding:0">
        <table>
          <thead><tr><th>Thời gian</th><th>Loại</th><th>KH</th><th>SĐT</th><th>Nội dung</th><th></th></tr></thead>
          <tbody>
            ${
              list.length
                ? list
                    .map(
                      (s) => `
              <tr>
                <td>${esc(new Date(s.createdAt).toLocaleString("vi-VN"))}</td>
                <td>${esc(s.type)}</td>
                <td>${esc(s.name)}</td>
                <td>${esc(s.phone)}</td>
                <td>${esc(s.message || s.email)}</td>
                <td><button type="button" class="btn btn-danger btn-sm del-sub" data-id="${s.id}">Xóa</button></td>
              </tr>`
                    )
                    .join("")
                : '<tr><td colspan="6" class="empty">Chưa có yêu cầu</td></tr>'
            }
          </tbody>
        </table>
      </div>`;

    content.querySelectorAll(".del-sub").forEach((b) =>
      b.addEventListener("click", async () => {
        await api(`/submissions/${b.dataset.id}`, { method: "DELETE" });
        showToast("Đã xóa");
        renderSubmissions();
      })
    );
  }

  async function renderMedia() {
    const list = await api("/media");
    content.innerHTML = `
      <div class="panel">
        <label>Upload ảnh<input type="file" id="uploadFile" accept="image/*" /></label>
      </div>
      <div class="media-grid">
        ${
          list.length
            ? list
                .map(
                  (m) => `
            <div class="media-item">
              <img src="${esc(m.url)}" alt="" />
              <small>${esc(m.url)}</small>
            </div>`
                )
                .join("")
            : '<p class="empty">Chưa có file — upload ảnh ở trên</p>'
        }
      </div>`;

    $("#uploadFile").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        await api("/upload", {
          method: "POST",
          body: JSON.stringify({ filename: file.name, data: reader.result }),
        });
        showToast("Upload thành công");
        renderMedia();
      };
      reader.readAsDataURL(file);
    });
  }

  checkAuth();
})();
