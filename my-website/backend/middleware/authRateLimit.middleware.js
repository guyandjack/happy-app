const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const sendRateLimitResponse = (_req, res) =>
  res.status(429).json({
    status: "error",
    message: "Too many authentication attempts. Please try again later.",
  });

const normalizedEmailKey = (req) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const value = email || "missing-email";

  // Do not retain raw email addresses in the in-memory limiter store.
  return crypto.createHash("sha256").update(value).digest("hex");
};

const commonOptions = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: sendRateLimitResponse,
};

const loginIpLimiter = rateLimit({
  ...commonOptions,
  max: 20,
});

const loginAccountLimiter = rateLimit({
  ...commonOptions,
  max: 5,
  keyGenerator: normalizedEmailKey,
});

const refreshLimiter = rateLimit({
  ...commonOptions,
  max: 30,
});

module.exports = {
  loginIpLimiter,
  loginAccountLimiter,
  refreshLimiter,
};
