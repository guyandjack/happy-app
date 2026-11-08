const { isAllowedOrigin } = require("../config/security");

/**
 * Requires a browser request to originate from one of the explicitly trusted
 * frontends. This complements SameSite cookies for state-changing requests.
 */
const requireTrustedOrigin = (req, res, next) => {
  const origin = req.get("origin");

  if (!origin || !isAllowedOrigin(origin)) {
    return res.status(403).json({
      status: "error",
      message: "This request origin is not allowed.",
    });
  }

  return next();
};

module.exports = { requireTrustedOrigin };
