const { loadEnv, required } = require("./env");

let clientPromise = null;

const isConfigured = () =>
  required([
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ]);

const getEndpoint = () => {
  loadEnv();
  return (
    process.env.R2_ENDPOINT ||
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  );
};

const getPublicUrl = (key) => {
  loadEnv();
  const base = String(process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (!base) return null;
  return `${base}/${String(key).replace(/^\//, "")}`;
};

const getClient = async () => {
  if (!isConfigured()) return null;
  if (clientPromise) return clientPromise;
  clientPromise = (async () => {
    const { S3Client } = require("@aws-sdk/client-s3");
    loadEnv();
    return new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: getEndpoint(),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: false,
    });
  })();
  return clientPromise;
};

const contentTypeFor = (ext) => {
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  return map[String(ext || "").toLowerCase()] || "application/octet-stream";
};

/**
 * Upload buffer to R2.
 * @returns {{ key, url, bucket, etag }}
 */
const uploadObject = async ({ key, body, contentType, cacheControl }) => {
  if (!isConfigured()) {
    throw new Error("R2 chưa cấu hình (thiếu env)");
  }
  const { PutObjectCommand } = require("@aws-sdk/client-s3");
  const client = await getClient();
  loadEnv();
  const bucket = process.env.R2_BUCKET_NAME;
  const result = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl || "public, max-age=31536000, immutable",
    })
  );
  const url = getPublicUrl(key);
  if (!url) {
    throw new Error("Thiếu R2_PUBLIC_URL — bật R2.dev subdomain hoặc custom domain");
  }
  return { key, url, bucket, etag: result.ETag || null };
};

const deleteObject = async (key) => {
  if (!key || !isConfigured()) return { ok: false, skipped: true };
  const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
  const client = await getClient();
  loadEnv();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  );
  return { ok: true };
};

module.exports = {
  isConfigured,
  getEndpoint,
  getPublicUrl,
  getClient,
  contentTypeFor,
  uploadObject,
  deleteObject,
};
