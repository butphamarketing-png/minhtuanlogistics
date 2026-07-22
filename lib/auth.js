const crypto = require("crypto");

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const getSecret = () => process.env.ADMIN_SECRET || "minhtuan-admin-secret-change-me";

const getCredentials = () => ({
  user: process.env.ADMIN_USER || "admin@minhtuanlogistics.com",
  pass: process.env.ADMIN_PASSWORD || "minhtuanlogistics.com",
});

const signToken = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
};

const verifyToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

const createSession = (username) =>
  signToken({ user: username, exp: Date.now() + SESSION_TTL_MS });

const authenticate = (username, password) => {
  const creds = getCredentials();
  if (username !== creds.user || password !== creds.pass) return null;
  return createSession(username);
};

const getTokenFromRequest = (req) => {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const requireAuth = (req) => verifyToken(getTokenFromRequest(req));

module.exports = {
  authenticate,
  createSession,
  verifyToken,
  getTokenFromRequest,
  requireAuth,
  getCredentials,
};
