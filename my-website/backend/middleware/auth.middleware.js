const fs = require("fs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/user.model");
const { ACCESS_TOKEN_COOKIE } = require("../utils/function/authCookies");

const JWT_ISSUER = process.env.JWT_ISSUER || "helveclick-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "helveclick-dashboard";

const getPublicKey = () =>
  fs.readFileSync(process.env.PUBLIC_KEY_PATH, "utf8");

/**
 * Protects API routes with the HttpOnly access-token cookie. Tokens are never
 * read from browser storage or accepted from arbitrary Authorization headers.
 */
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, getPublicKey(), {
      algorithms: ["RS256"],
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER,
    });

    if (decoded.tokenUse !== "access") {
      return res.status(401).json({
        status: "error",
        message: "Your session is no longer valid. Please log in again.",
      });
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "Your session is no longer valid. Please log in again.",
      });
    }

    req.auth = decoded;
    req.user = currentUser;
    return next();
  } catch (_error) {
    return res.status(401).json({
      status: "error",
      message: "Your session is no longer valid. Please log in again.",
    });
  }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: "error",
      message: "You do not have permission to perform this action.",
    });
  }

  return next();
};
