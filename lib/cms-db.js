const { getAdminClient, isConfigured } = require("./supabase");

const DOC_KEYS = [
  "settings",
  "homepage",
  "gallery",
  "pages",
  "subpages",
  "seo-pages",
  "translations",
];

const getDoc = async (key) => {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client.from("cms_docs").select("data").eq("key", key).maybeSingle();
  if (error) throw new Error(`cms_docs get ${key}: ${error.message}`);
  return data ? data.data : null;
};

const setDoc = async (key, value) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const { error } = await client.from("cms_docs").upsert(
    { key, data: value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  if (error) throw new Error(`cms_docs set ${key}: ${error.message}`);
  return { ok: true };
};

const fetchNewsPages = async () => {
  const client = getAdminClient();
  if (!client) return null;
  const pageSize = 500;
  let from = 0;
  const all = [];
  for (;;) {
    const to = from + pageSize - 1;
    const { data, error } = await client
      .from("news_posts")
      .select("id, data")
      .order("id", { ascending: true })
      .range(from, to);
    if (error) throw new Error(`news_posts list: ${error.message}`);
    if (!data || !data.length) break;
    for (const row of data) {
      all.push(row.data && typeof row.data === "object" ? { ...row.data, id: row.id } : row.data);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
};

const saveNewsAll = async (posts) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  if (!Array.isArray(posts)) throw new Error("news must be an array");

  const { error: delErr } = await client.from("news_posts").delete().neq("id", -1);
  if (delErr) throw new Error(`news_posts clear: ${delErr.message}`);

  const chunk = 80;
  for (let i = 0; i < posts.length; i += chunk) {
    const slice = posts.slice(i, i + chunk).map((p) => ({
      id: Number(p.id) || i + 1,
      slug: String(p.slug || `post-${p.id}`),
      published: p.published !== false,
      data: p,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await client.from("news_posts").upsert(slice, { onConflict: "id" });
    if (error) throw new Error(`news_posts upsert: ${error.message}`);
  }
  return { ok: true, count: posts.length };
};

const upsertNewsPost = async (post) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const row = {
    id: Number(post.id),
    slug: String(post.slug),
    published: post.published !== false,
    data: post,
    updated_at: new Date().toISOString(),
  };
  const { error } = await client.from("news_posts").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`news_posts upsert one: ${error.message}`);
  return { ok: true };
};

const deleteNewsPost = async (idOrSlug) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const asId = Number(idOrSlug);
  let q = client.from("news_posts").delete();
  q = Number.isFinite(asId) && String(asId) === String(idOrSlug) ? q.eq("id", asId) : q.eq("slug", String(idOrSlug));
  const { error } = await q;
  if (error) throw new Error(`news_posts delete: ${error.message}`);
  return { ok: true };
};

const listSubmissions = async () => {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("submissions")
    .select("id, created_at, data")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`submissions list: ${error.message}`);
  return (data || []).map((row) => ({
    ...(row.data || {}),
    id: row.id,
    createdAt: row.created_at || row.data?.createdAt,
  }));
};

const addSubmissionRow = async (entry) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const id = entry.id || Date.now();
  const createdAt = entry.createdAt || new Date().toISOString();
  const row = { id, created_at: createdAt, data: { ...entry, id, createdAt } };
  const { error } = await client.from("submissions").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`submissions insert: ${error.message}`);
  return { ok: true, id };
};

const deleteSubmissionRow = async (id) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const { error } = await client.from("submissions").delete().eq("id", Number(id));
  if (error) throw new Error(`submissions delete: ${error.message}`);
  return { ok: true };
};

const listMedia = async () => {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("media")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`media list: ${error.message}`);
  return (data || []).map((m) => ({
    id: m.id,
    name: m.name,
    url: m.url,
    key: m.key,
    size: m.size,
    alt: m.alt,
    storage: m.storage,
    uploadedAt: m.uploaded_at,
  }));
};

const listVisits = async (limit = 2000) => {
  const client = getAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("visits")
    .select("id, created_at, data")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`visits list: ${error.message}`);
  return (data || []).map((row) => ({
    ...(row.data || {}),
    id: row.id,
    createdAt: row.created_at || row.data?.createdAt,
  }));
};

const addVisitRow = async (entry) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true };
  const id = entry.id || Date.now();
  const createdAt = entry.createdAt || new Date().toISOString();
  const row = { id, created_at: createdAt, data: { ...entry, id, createdAt } };
  const { error } = await client.from("visits").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`visits insert: ${error.message}`);
  return { ok: true, id };
};

const healthCms = async () => {
  if (!isConfigured()) return { ok: false, configured: false };
  const client = getAdminClient();
  const { error } = await client.from("cms_docs").select("key").limit(1);
  if (error) return { ok: false, configured: true, error: error.message };
  return { ok: true, configured: true };
};

module.exports = {
  DOC_KEYS,
  isConfigured,
  getDoc,
  setDoc,
  fetchNewsPages,
  saveNewsAll,
  upsertNewsPost,
  deleteNewsPost,
  listSubmissions,
  addSubmissionRow,
  deleteSubmissionRow,
  listMedia,
  listVisits,
  addVisitRow,
  healthCms,
};
