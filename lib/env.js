/**
 * Load .env / .env.local into process.env (local only).
 * On Vercel, env vars are already injected — this is a no-op for missing files.
 */
const fs = require("fs");
const path = require("path");

let loaded = false;

const parseLine = (line) => {
  const trimmed = String(line || "").trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eq = trimmed.indexOf("=");
  if (eq <= 0) return null;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return { key, value };
};

const loadFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const parsed = parseLine(line);
    if (!parsed) continue;
    if (process.env[parsed.key] === undefined) {
      process.env[parsed.key] = parsed.value;
    }
  }
};

const loadEnv = () => {
  if (loaded) return process.env;
  loaded = true;
  const root = path.resolve(__dirname, "..");
  loadFile(path.join(root, ".env"));
  loadFile(path.join(root, ".env.local"));
  return process.env;
};

const required = (keys) => {
  loadEnv();
  return keys.every((k) => Boolean(process.env[k]));
};

module.exports = { loadEnv, required };
