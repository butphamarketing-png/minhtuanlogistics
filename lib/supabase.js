const { loadEnv, required } = require("./env");

let adminClient = null;

const isConfigured = () => required(["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const getAdminClient = () => {
  if (!isConfigured()) return null;
  if (adminClient) return adminClient;
  const { createClient } = require("@supabase/supabase-js");
  loadEnv();
  adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
};

/**
 * Upsert media metadata into public.media
 */
const upsertMedia = async (item) => {
  const client = getAdminClient();
  if (!client) return { ok: false, skipped: true, reason: "supabase_not_configured" };

  const row = {
    id: String(item.id),
    name: item.name || "",
    url: item.url || "",
    key: item.key || null,
    size: Number(item.size) || 0,
    alt: item.alt || "",
    storage: item.storage || "r2",
    uploaded_at: item.uploadedAt || new Date().toISOString(),
  };

  const { data, error } = await client.from("media").upsert(row, { onConflict: "id" }).select().maybeSingle();
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data };
};

const deleteMedia = async (id) => {
  const client = getAdminClient();
  if (!client || !id) return { ok: false, skipped: true };
  const { error } = await client.from("media").delete().eq("id", String(id));
  if (error) return { ok: false, error: error.message };
  return { ok: true };
};

const health = async () => {
  if (!isConfigured()) return { ok: false, configured: false };
  const client = getAdminClient();
  const { error } = await client.from("media").select("id").limit(1);
  if (error) return { ok: false, configured: true, error: error.message };
  return { ok: true, configured: true };
};

module.exports = {
  isConfigured,
  getAdminClient,
  upsertMedia,
  deleteMedia,
  health,
};
