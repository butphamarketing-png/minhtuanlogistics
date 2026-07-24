/**
 * Admin modules: Giới thiệu, Dịch vụ, SEO trang — full site content.
 * Depends on globals from admin.js: api, esc, showToast, content, $, openMediaPicker
 */
(() => {
  const bindSiteModules = (ctx) => {
    const { api, esc, showToast, content, $, openMediaPicker, formatBytes } = ctx;

    const sectionToText = (sections) =>
      (sections || [])
        .map((s) => {
          const head = s.heading || "";
          const paras = (s.paragraphs || []).join("\n");
          return `## ${head}\n${paras}`;
        })
        .join("\n\n");

    const textToSections = (raw) => {
      const chunks = String(raw || "").split(/\n(?=## )/);
      return chunks
        .map((chunk) => {
          const lines = chunk.trim().split("\n");
          if (!lines.length) return null;
          const heading = lines[0].replace(/^##\s*/, "").trim();
          const paragraphs = lines
            .slice(1)
            .map((l) => l.trim())
            .filter(Boolean);
          if (!heading && !paragraphs.length) return null;
          return { heading: heading || "Nội dung", paragraphs };
        })
        .filter(Boolean);
    };

    async function renderSubpages(kind, editSlug) {
      const label = kind === "about" ? "Giới thiệu" : "Dịch vụ";
      const list = await api(`/subpages/${kind}`);

      if (editSlug === "new" || editSlug) {
        const page =
          editSlug === "new"
            ? {
                slug: "",
                primaryKeyword: "",
                title: "",
                metaTitle: "",
                metaDescription: "",
                lead: "",
                images: [{ src: "", alt: "" }, { src: "", alt: "" }, { src: "", alt: "" }],
                sections: [],
                highlights: [],
                faqs: [],
              }
            : await api(`/subpages/${kind}/${encodeURIComponent(editSlug)}`);

        content.innerHTML = `
          <form id="subpageForm" class="panel news-seo-form">
            <h3>${editSlug === "new" ? "Thêm" : "Sửa"} trang ${label}</h3>
            <div class="form-grid">
              <label>Slug / URL<input name="slug" value="${esc(page.slug)}" ${editSlug === "new" ? "" : "readonly"} required /></label>
              <label>Từ khóa chính<input name="primaryKeyword" value="${esc(page.primaryKeyword || "")}" /></label>
              <label style="grid-column:1/-1">Tiêu đề H1<input name="title" value="${esc(page.title || "")}" required /></label>
              <label style="grid-column:1/-1">Meta title<input name="metaTitle" value="${esc(page.metaTitle || "")}" /></label>
              <label style="grid-column:1/-1">Meta description<textarea name="metaDescription" rows="2">${esc(page.metaDescription || "")}</textarea></label>
              <label style="grid-column:1/-1">Lead / mở đầu<textarea name="lead" rows="3">${esc(page.lead || "")}</textarea></label>
              <label style="grid-column:1/-1">Nội dung (## tiêu đề H2, mỗi đoạn 1 dòng)<textarea name="body" rows="14">${esc(sectionToText(page.sections))}</textarea></label>
              <label style="grid-column:1/-1">Điểm nổi bật (mỗi dòng 1 mục)<textarea name="highlights" rows="3">${esc((page.highlights || []).join("\n"))}</textarea></label>
            </div>
            <h4 class="seo-section-title">Hình ảnh</h4>
            <div class="seo-images-grid">
              ${(page.images || [{ src: "", alt: "" }, { src: "", alt: "" }, { src: "", alt: "" }])
                .slice(0, 5)
                .map(
                  (img, i) => `
                <div class="seo-image-row">
                  <label>Ảnh ${i + 1}
                    <div class="media-url-row">
                      <input name="imgSrc${i}" value="${esc(img.src || "")}" />
                      <button type="button" class="btn btn-ghost btn-sm pick-from-media" data-target="imgSrc${i}">Chọn từ kho</button>
                    </div>
                  </label>
                  <label>Alt<input name="imgAlt${i}" value="${esc(img.alt || "")}" /></label>
                </div>`
                )
                .join("")}
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Lưu & xuất trang</button>
              <button type="button" class="btn btn-ghost" id="backSubpages">← Quay lại</button>
            </div>
          </form>`;

        $("#backSubpages").addEventListener("click", () => renderSubpages(kind));
        content.querySelectorAll(".pick-from-media").forEach((btn) => {
          btn.addEventListener("click", async () => {
            await openMediaPicker({
              onSelect: (url) => {
                const input = content.querySelector(`[name="${btn.dataset.target}"]`);
                if (input) input.value = url;
              },
            });
          });
        });

        $("#subpageForm").addEventListener("submit", async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const images = [];
          for (let i = 0; i < 5; i++) {
            const src = String(fd.get(`imgSrc${i}`) || "").trim();
            const alt = String(fd.get(`imgAlt${i}`) || "").trim();
            if (src) images.push({ src, alt });
          }
          const payload = {
            slug: String(fd.get("slug") || "").trim(),
            primaryKeyword: String(fd.get("primaryKeyword") || "").trim(),
            title: String(fd.get("title") || "").trim(),
            metaTitle: String(fd.get("metaTitle") || fd.get("title") || "").trim(),
            metaDescription: String(fd.get("metaDescription") || "").trim(),
            lead: String(fd.get("lead") || "").trim(),
            sections: textToSections(fd.get("body")),
            highlights: String(fd.get("highlights") || "")
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean),
            images,
          };
          try {
            if (editSlug === "new") {
              await api(`/subpages/${kind}`, { method: "POST", body: JSON.stringify(payload) });
            } else {
              await api(`/subpages/${kind}/${encodeURIComponent(editSlug)}`, {
                method: "PUT",
                body: JSON.stringify(payload),
              });
            }
            showToast("Đã lưu trang & xuất HTML");
            renderSubpages(kind);
          } catch (err) {
            showToast(err.message);
          }
        });
        return;
      }

      content.innerHTML = `
        <div class="form-actions" style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="btn btn-primary" id="newSubpage">+ Thêm trang ${label}</button>
          <button type="button" class="btn btn-ghost" id="rebuildSubpages">Xuất lại toàn bộ HTML</button>
        </div>
        <div class="table-wrap panel" style="padding:0">
          <table>
            <thead><tr><th>Tiêu đề</th><th>Slug</th><th>Từ khóa</th><th></th></tr></thead>
            <tbody>
              ${
                list.length
                  ? list
                      .map(
                        (p) => `
                <tr>
                  <td>${esc(p.title)}</td>
                  <td><code>/${esc(p.parent || "")}/${esc(p.slug)}</code></td>
                  <td>${esc(p.primaryKeyword || "")}</td>
                  <td class="row-actions">
                    <a class="btn btn-ghost btn-sm" href="/${esc(p.parent)}/${esc(p.slug)}" target="_blank" rel="noopener">Xem</a>
                    <button type="button" class="btn btn-ghost btn-sm edit-sub" data-slug="${esc(p.slug)}">Sửa</button>
                    <button type="button" class="btn btn-danger btn-sm del-sub" data-slug="${esc(p.slug)}">Xóa</button>
                  </td>
                </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="4" class="empty">Chưa có trang</td></tr>`
              }
            </tbody>
          </table>
        </div>`;

      $("#newSubpage").addEventListener("click", () => renderSubpages(kind, "new"));
      $("#rebuildSubpages").addEventListener("click", async () => {
        try {
          await api("/rebuild", { method: "POST", body: JSON.stringify({ targets: ["subpages", "sitemap"] }) });
          showToast("Đã xuất lại HTML trang con");
        } catch (err) {
          showToast(err.message);
        }
      });
      content.querySelectorAll(".edit-sub").forEach((b) =>
        b.addEventListener("click", () => renderSubpages(kind, b.dataset.slug))
      );
      content.querySelectorAll(".del-sub").forEach((b) =>
        b.addEventListener("click", async () => {
          if (!confirm("Xóa trang này?")) return;
          await api(`/subpages/${kind}/${encodeURIComponent(b.dataset.slug)}`, { method: "DELETE" });
          showToast("Đã xóa");
          renderSubpages(kind);
        })
      );
    }

    async function renderSeoPages() {
      const pages = await api("/seo-pages");
      const keys = Object.keys(pages);
      content.innerHTML = `
        <form id="seoPagesForm" class="panel">
          <h3>SEO trang tĩnh</h3>
          <p class="seo-hint">Title / description / keywords cho các trang chính (trang chủ, giới thiệu, dịch vụ…).</p>
          ${keys
            .map((key) => {
              const p = pages[key] || {};
              return `
              <fieldset class="seo-page-block" data-key="${esc(key)}">
                <legend>${esc(key)}</legend>
                <div class="form-grid">
                  <label style="grid-column:1/-1">Title<input name="${esc(key)}__title" value="${esc(p.title || "")}" /></label>
                  <label style="grid-column:1/-1">Description<textarea name="${esc(key)}__description" rows="2">${esc(p.description || "")}</textarea></label>
                  <label style="grid-column:1/-1">Keywords<input name="${esc(key)}__keywords" value="${esc(p.keywords || "")}" /></label>
                </div>
              </fieldset>`;
            })
            .join("")}
          <div class="form-actions"><button type="submit" class="btn btn-primary">Lưu SEO trang</button></div>
        </form>`;

      $("#seoPagesForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const next = {};
        keys.forEach((key) => {
          next[key] = {
            title: String(fd.get(`${key}__title`) || ""),
            description: String(fd.get(`${key}__description`) || ""),
            keywords: String(fd.get(`${key}__keywords`) || ""),
          };
        });
        await api("/seo-pages", { method: "PUT", body: JSON.stringify(next) });
        showToast("Đã lưu SEO trang tĩnh");
      });
    }

    return { renderSubpages, renderSeoPages };
  };

  window.AdminSiteModules = { bindSiteModules };
})();
