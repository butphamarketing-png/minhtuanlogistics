/**
 * Rank Math–style SEO checklist for Minh Tuấn Logistics CMS.
 * Works in Node (API) and browser (admin).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SEOChecklist = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const DEFAULTS = {
    minWords: 600,
    goodWords: 1200,
    idealDensityMin: 0.5,
    idealDensityMax: 2.5,
    maxUrlLen: 75,
    minImages: 5,
    siteHosts: ["minhtuanlogistics.com", "www.minhtuanlogistics.com"],
  };

  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFC")
      .replace(/\s+/g, " ")
      .trim();

  const slugify = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const includesKw = (text, keyword) => {
    const t = norm(text);
    const k = norm(keyword);
    if (!k || !t) return false;
    return t.includes(k);
  };

  const slugHasKeyword = (slug, keyword) => {
    const s = slugify(slug);
    const k = slugify(keyword);
    if (!s || !k) return false;
    if (s.includes(k)) return true;
    // match if most significant tokens from keyword appear in slug
    const tokens = k.split("-").filter((t) => t.length > 2);
    if (!tokens.length) return false;
    const hit = tokens.filter((t) => s.includes(t)).length;
    return hit >= Math.min(2, tokens.length) || hit / tokens.length >= 0.5;
  };

  const wordCount = (text) => {
    const m = String(text || "")
      .replace(/<[^>]+>/g, " ")
      .match(/[\p{L}\p{N}’'-]+/gu);
    return m ? m.length : 0;
  };

  const countKw = (text, keyword) => {
    const t = norm(text);
    const k = norm(keyword);
    if (!k || !t) return 0;
    let count = 0;
    let idx = 0;
    while ((idx = t.indexOf(k, idx)) !== -1) {
      count++;
      idx += k.length;
    }
    return count;
  };

  const flattenContent = (post) => {
    const parts = [];
    if (post.excerpt) parts.push(post.excerpt);
    if (post.lead) parts.push(post.lead);
    (post.sections || []).forEach((s) => {
      if (s.heading) parts.push(s.heading);
      (s.paragraphs || []).forEach((p) => parts.push(p));
      if (s.text) parts.push(s.text);
    });
    (post.body || []).forEach((p) => parts.push(typeof p === "string" ? p : p.text || ""));
    if (post.contentHtml) parts.push(String(post.contentHtml).replace(/<[^>]+>/g, " "));
    return parts.join("\n");
  };

  const extractHeadings = (post) => {
    const hs = [];
    (post.sections || []).forEach((s) => {
      if (s.heading) hs.push(s.heading);
      if (s.type === "h2" && s.text) hs.push(s.text);
    });
    if (Array.isArray(post.headings)) hs.push(...post.headings.filter(Boolean));
    return hs;
  };

  const extractImages = (post) => {
    const imgs = [];
    if (Array.isArray(post.images)) {
      post.images.forEach((img) => {
        if (!img) return;
        if (typeof img === "string") imgs.push({ src: img, alt: "" });
        else imgs.push({ src: img.src || img.url || "", alt: img.alt || "" });
      });
    }
    if (post.photo) imgs.push({ src: post.photo, alt: post.imageAlt || "" });
    if (post.cover) imgs.push({ src: post.cover, alt: post.imageAlt || "" });
    return imgs.filter((i) => i.src);
  };

  const extractLinks = (post, opts) => {
    const html = [
      flattenContent(post),
      post.contentHtml || "",
      ...(post.body || []).map((b) => (typeof b === "string" ? b : "")),
    ].join("\n");

    const urls = [];
    const md = html.matchAll(/\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/gi);
    for (const m of md) urls.push(m[2]);
    const raw = html.matchAll(/https?:\/\/[^\s<>"')]+/gi);
    for (const m of raw) urls.push(m[0]);
    (post.externalLinks || []).forEach((u) => urls.push(u));
    (post.internalLinks || []).forEach((u) => urls.push(u));

    const hosts = opts.siteHosts || DEFAULTS.siteHosts;
    const internal = [];
    const external = [];
    urls.forEach((u) => {
      try {
        if (u.startsWith("/")) {
          internal.push(u);
          return;
        }
        const host = new URL(u).hostname.replace(/^www\./, "");
        const own = hosts.some((h) => host === h.replace(/^www\./, ""));
        if (own) internal.push(u);
        else external.push(u);
      } catch {
        /* ignore */
      }
    });
    return { internal: [...new Set(internal)], external: [...new Set(external)] };
  };

  const item = (ok, message, { critical = false, points = 5 } = {}) => ({
    ok: !!ok,
    message,
    critical,
    points,
  });

  /**
   * @param {object} post
   * @param {object} [options]
   * @param {object[]} [options.existingPosts] - for unique keyword check
   * @param {string|number} [options.currentId]
   */
  function analyze(post, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const keyword = String(post.keyword || post.primaryKeyword || "").trim();
    const seoTitle = String(post.metaTitle || post.title || "").trim();
    const metaDesc = String(post.metaDescription || "").trim();
    const slug = String(post.slug || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");
    const content = flattenContent(post);
    const words = wordCount(content);
    const first10 = content.slice(0, Math.max(1, Math.floor(content.length * 0.1)));
    const headings = extractHeadings(post);
    const images = extractImages(post);
    const links = extractLinks(post, opts);
    const kwHits = countKw(content + " " + seoTitle + " " + metaDesc, keyword);
    const density = words ? (kwHits / words) * 100 : 0;

    const basic = [];
    basic.push(
      item(!!keyword && includesKw(seoTitle, keyword), "Tuyệt vời! Bạn đang sử dụng từ khoá chính trong Tiêu đề SEO.", {
        critical: true,
        points: 10,
      })
    );
    if (!keyword || !includesKw(seoTitle, keyword)) {
      basic[basic.length - 1].message = "Thêm từ khóa chính vào Tiêu đề SEO.";
    }

    basic.push(
      item(!!keyword && includesKw(metaDesc, keyword), "Đã sử dụng từ khoá chính trong Mô tả Meta SEO.", {
        critical: true,
        points: 10,
      })
    );
    if (!keyword || !includesKw(metaDesc, keyword)) {
      basic[basic.length - 1].message = "Thêm từ khóa chính vào Mô tả Meta SEO (120–160 ký tự).";
    }
    if (metaDesc && (metaDesc.length < 120 || metaDesc.length > 165)) {
      basic.push(
        item(metaDesc.length >= 120 && metaDesc.length <= 165, `Mô tả Meta dài ${metaDesc.length} ký tự (nên 120–160).`, {
          points: 4,
        })
      );
    }

    basic.push(
      item(!!keyword && slugHasKeyword(slug, keyword), "Từ khóa chính đã được sử dụng trong URL.", {
        critical: true,
        points: 8,
      })
    );
    if (!keyword || !slugHasKeyword(slug, keyword)) {
      basic[basic.length - 1].message = "Đưa từ khóa chính vào slug/URL (không dấu, nối bằng -).";
    }

    basic.push(
      item(!!keyword && includesKw(first10, keyword), "Từ khoá chính xuất hiện trong 10% nội dung đầu tiên.", {
        critical: true,
        points: 8,
      })
    );
    if (!keyword || !includesKw(first10, keyword)) {
      basic[basic.length - 1].message = "Đưa từ khóa chính vào đoạn mở đầu (10% nội dung đầu).";
    }

    basic.push(
      item(!!keyword && includesKw(content, keyword), "Đã tìm thấy từ khoá chính trong nội dung.", {
        critical: true,
        points: 8,
      })
    );
    if (!keyword || !includesKw(content, keyword)) {
      basic[basic.length - 1].message = "Chưa tìm thấy từ khóa chính trong nội dung.";
    }

    const wordsOk = words >= opts.minWords;
    const wordsGood = words >= opts.goodWords;
    basic.push(
      item(
        wordsOk,
        wordsGood
          ? `Nội dung dài ${words} từ. Làm tốt lắm!`
          : wordsOk
            ? `Nội dung dài ${words} từ (mục tiêu ≥ ${opts.goodWords} từ).`
            : `Nội dung mới ${words} từ — cần tối thiểu ${opts.minWords} từ (lý tưởng ≥ ${opts.goodWords}).`,
        { critical: true, points: wordsGood ? 12 : wordsOk ? 8 : 0 }
      )
    );

    const additional = [];
    const kwInHeadings = headings.some((h) => includesKw(h, keyword));
    additional.push(
      item(kwInHeadings, "Đã tìm thấy từ khoá chính trong các tiêu đề phụ.", { critical: true, points: 8 })
    );
    if (!kwInHeadings) {
      additional[additional.length - 1].message = "Thêm từ khóa chính vào ít nhất một tiêu đề H2/H3.";
    }

    const altsWithKw = images.filter((i) => includesKw(i.alt, keyword));
    const imagesOk = images.length >= opts.minImages && altsWithKw.length >= opts.minImages;
    additional.push(
      item(
        imagesOk,
        imagesOk
          ? `Đã tìm thấy Từ khóa chính trong (các) thuộc tính alt của hình ảnh (${altsWithKw.length}/${images.length}).`
          : `Cần ≥ ${opts.minImages} ảnh và mỗi alt chứa từ khóa chính (hiện ${images.length} ảnh, ${altsWithKw.length} alt đạt).`,
        { critical: true, points: 10 }
      )
    );

    const densityOk = density >= opts.idealDensityMin && density <= opts.idealDensityMax;
    additional.push(
      item(
        densityOk && kwHits > 0,
        `Mật độ từ khóa là ${density.toFixed(2)}, từ khóa chính và sự kết hợp xuất hiện ${kwHits} lần.`,
        { points: 6 }
      )
    );
    if (!densityOk) {
      additional[additional.length - 1].message = `Mật độ từ khóa ${density.toFixed(2)}% (nên ${opts.idealDensityMin}–${opts.idealDensityMax}%, hiện ${kwHits} lần).`;
      additional[additional.length - 1].ok = false;
    }

    const urlLen = (slug || "").length;
    additional.push(
      item(urlLen > 0 && urlLen <= opts.maxUrlLen, `URL dài ${urlLen} ký tự. Rất tốt!`, { points: 4 })
    );
    if (urlLen > opts.maxUrlLen) {
      additional[additional.length - 1].message = `URL dài ${urlLen} ký tự — nên ≤ ${opts.maxUrlLen}.`;
      additional[additional.length - 1].ok = false;
    }

    additional.push(
      item(
        links.external.length > 0,
        links.external.length
          ? `Có ${links.external.length} liên kết ngoài (dofollow khuyến nghị).`
          : "Không tìm thấy liên kết ra ngoài. Liên kết đến các tài nguyên bên ngoài.",
        { points: 5 }
      )
    );

    additional.push(
      item(
        links.internal.length > 0,
        links.internal.length
          ? "Bạn đang liên kết đến các tài nguyên khác trên trang web của mình, điều này thật tuyệt."
          : "Thêm liên kết nội bộ tới trang dịch vụ / bài viết liên quan.",
        { critical: true, points: 6 }
      )
    );

    const existing = opts.existingPosts || [];
    const currentId = opts.currentId != null ? String(opts.currentId) : "";
    const kwDup = existing.some(
      (p) =>
        String(p.id) !== currentId &&
        p.slug !== post.slug &&
        norm(p.keyword || p.primaryKeyword) === norm(keyword) &&
        keyword
    );
    additional.push(
      item(!kwDup, "Bạn chưa sử dụng Từ khóa chính này trước đây.", { critical: true, points: 6 })
    );
    if (kwDup) additional[additional.length - 1].message = "Từ khóa chính đã dùng cho bài khác — chọn từ khóa khác.";

    const titleRead = [];
    const kwAtStart = keyword && norm(seoTitle).startsWith(norm(keyword));
    titleRead.push(
      item(kwAtStart, "Từ khóa chính được sử dụng ở đầu tiêu đề SEO.", { critical: true, points: 8 })
    );
    if (!kwAtStart) {
      titleRead[0].message = "Đặt từ khóa chính ở đầu tiêu đề SEO.";
    }

    const hasNumber = /\d/.test(seoTitle);
    titleRead.push(
      item(hasNumber, "Tiêu đề SEO có chứa số (giúp CTR).", { points: 4 })
    );
    if (!hasNumber) {
      titleRead[titleRead.length - 1].message = "Tiêu đề SEO của bạn không chứa số.";
      titleRead[titleRead.length - 1].ok = false;
    }

    const contentRead = [];
    contentRead.push(
      item(
        headings.length >= 2,
        headings.length >= 2
          ? "Có mục lục / tiêu đề phụ để chia nhỏ văn bản."
          : "Thêm ít nhất 2 tiêu đề H2 để tạo mục lục (TOC).",
        { critical: true, points: 6 }
      )
    );

    const paras = content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const shortParas = paras.length ? paras.filter((p) => wordCount(p) <= 80).length / paras.length >= 0.6 : false;
    contentRead.push(
      item(shortParas || paras.length >= 5, "Bạn đang sử dụng các đoạn văn ngắn.", { points: 5 })
    );
    if (!(shortParas || paras.length >= 5)) {
      contentRead[contentRead.length - 1].message = "Chia nội dung thành các đoạn văn ngắn hơn.";
      contentRead[contentRead.length - 1].ok = false;
    }

    contentRead.push(
      item(
        images.length >= 1,
        images.length
          ? `Nội dung của bạn chứa ${images.length} hình ảnh.`
          : "Nội dung cần chứa hình ảnh và / hoặc video.",
        { critical: true, points: 5 }
      )
    );

    const groups = {
      basic: { label: "SEO cơ bản", items: basic },
      additional: { label: "Bổ sung", items: additional },
      titleReadability: { label: "Khả năng đọc tiêu đề", items: titleRead },
      contentReadability: { label: "Khả năng đọc nội dung", items: contentRead },
    };

    let earned = 0;
    let total = 0;
    let criticalFails = 0;
    let errorCount = 0;
    Object.values(groups).forEach((g) => {
      g.items.forEach((it) => {
        total += it.points || 5;
        if (it.ok) earned += it.points || 5;
        else {
          errorCount++;
          if (it.critical) criticalFails++;
        }
      });
    });

    Object.values(groups).forEach((g) => {
      const fails = g.items.filter((i) => !i.ok).length;
      g.errors = fails;
      g.allGood = fails === 0;
      g.summary = fails === 0 ? "Tất cả đều tốt" : `${fails} Lỗi`;
    });

    const score = total ? Math.round((earned / total) * 100) : 0;
    const canPublish = criticalFails === 0 && wordsOk && !!keyword;

    return {
      score,
      canPublish,
      criticalFails,
      errorCount,
      stats: {
        words,
        density: Number(density.toFixed(2)),
        kwHits,
        images: images.length,
        altsWithKw: altsWithKw.length,
        headings: headings.length,
        internalLinks: links.internal.length,
        externalLinks: links.external.length,
        slugLen: urlLen,
        metaLen: metaDesc.length,
      },
      groups,
      keyword,
    };
  }

  function assertPublishable(post, options = {}) {
    const result = analyze(post, options);
    if (post.published === false || post.published === "false") {
      return { ok: true, result };
    }
    if (!result.canPublish) {
      const fails = [];
      Object.values(result.groups).forEach((g) => {
        g.items.filter((i) => !i.ok && i.critical).forEach((i) => fails.push(i.message));
      });
      return {
        ok: false,
        result,
        error: "Bài viết chưa đạt checklist SEO bắt buộc để xuất bản.",
        fails,
      };
    }
    return { ok: true, result };
  }

  return { analyze, assertPublishable, wordCount, DEFAULTS };
});
