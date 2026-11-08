const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const AuthSession = require("../models/authSession.model");
const { getConnection, releaseConnection } = require("../config/database");
const {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} = require("../utils/function/authCookies");

const JWT_ISSUER = process.env.JWT_ISSUER || "helveclick-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "helveclick-dashboard";
const REFRESH_REUSE_GRACE_PERIOD_MS = 5_000;

const getPrivateKey = () =>
  fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");

const getPublicKey = () =>
  fs.readFileSync(process.env.PUBLIC_KEY_PATH, "utf8");

const getTokenExpirationDate = (token) => {
  const { exp } = jwt.decode(token) || {};
  if (!Number.isInteger(exp)) throw new Error("The signed token has no expiration.");
  return new Date(exp * 1000);
};

const signAccessToken = (userId) =>
  jwt.sign({ id: userId, tokenUse: "access" }, getPrivateKey(), {
    algorithm: "RS256",
    audience: JWT_AUDIENCE,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    issuer: JWT_ISSUER,
    jwtid: crypto.randomUUID(),
    subject: String(userId),
  });

const signRefreshToken = (userId, sessionId) =>
  jwt.sign({ id: userId, tokenUse: "refresh" }, getPrivateKey(), {
    algorithm: "RS256",
    audience: JWT_AUDIENCE,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    issuer: JWT_ISSUER,
    jwtid: sessionId,
    subject: String(userId),
  });

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, getPublicKey(), {
    algorithms: ["RS256"],
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  });

  if (decoded.tokenUse !== "refresh") {
    throw new Error("An access token cannot be used to refresh a session.");
  }

  return decoded;
};

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueSession = async (connection, user) => {
  const sessionId = crypto.randomUUID();
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id, sessionId);

  await AuthSession.create(connection, {
    id: sessionId,
    userId: user.id,
    tokenHash: AuthSession.hashRefreshToken(refreshToken),
    expiresAt: getTokenExpirationDate(refreshToken),
  });

  return {
    accessToken,
    accessExpiresAt: getTokenExpirationDate(accessToken).getTime(),
    refreshToken,
  };
};

const sendAuthenticatedResponse = (res, statusCode, user, session) => {
  setAuthCookies(res, session);
  res.set("Cache-Control", "no-store");
  return res.status(statusCode).json({
    status: "success",
    data: { user: toSafeUser(user) },
    session: { accessExpiresAt: session.accessExpiresAt },
  });
};

const invalidateCurrentSession = (res, statusCode = 401) => {
  clearAuthCookies(res);
  res.set("Cache-Control", "no-store");
  return res.status(statusCode).json({
    status: "error",
    message: "Your session is no longer valid. Please log in again.",
  });
};

exports.login = async (req, res, next) => {
  let connection;

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password.",
      });
    }

    connection = await getConnection();
    await connection.beginTransaction();
    const session = await issueSession(connection, user);
    await connection.commit();

    return sendAuthenticatedResponse(res, 200, user, session);
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    releaseConnection(connection);
  }
};

exports.refreshToken = async (req, res, next) => {
  let connection;

  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) return invalidateCurrentSession(res);

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (_error) {
      return invalidateCurrentSession(res);
    }

    connection = await getConnection();
    await connection.beginTransaction();

    const session = await AuthSession.findByTokenHash(
      connection,
      AuthSession.hashRefreshToken(refreshToken)
    );
    const sessionExpired = !session || new Date(session.expires_at).getTime() <= Date.now();
    const sessionDoesNotMatchToken =
      !session ||
      session.id !== decoded.jti ||
      String(session.user_id) !== String(decoded.id);

    if (sessionExpired || sessionDoesNotMatchToken) {
      if (session) await AuthSession.revoke(connection, session.id);
      await connection.commit();
      return invalidateCurrentSession(res);
    }

    if (session.revoked_at) {
      const replacedAt = session.replaced_at
        ? new Date(session.replaced_at).getTime()
        : 0;
      const wasJustRotated =
        replacedAt > 0 && Date.now() - replacedAt <= REFRESH_REUSE_GRACE_PERIOD_MS;

      if (!wasJustRotated) await AuthSession.revokeAllForUser(connection, session.user_id);
      await connection.commit();
      return invalidateCurrentSession(res);
    }

    const user = await User.findById(decoded.id);
    if (!user || user.changedPasswordAfter(decoded.iat)) {
      await AuthSession.revokeAllForUser(connection, decoded.id);
      await connection.commit();
      return invalidateCurrentSession(res);
    }

    const nextSession = await issueSession(connection, user);
    const replacementId = jwt.decode(nextSession.refreshToken).jti;
    await AuthSession.revoke(connection, session.id, replacementId);
    await connection.commit();

    return sendAuthenticatedResponse(res, 200, user, nextSession);
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    releaseConnection(connection);
  }
};

exports.logout = async (req, res, next) => {
  let connection;

  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (refreshToken) {
      connection = await getConnection();
      const session = await AuthSession.findByTokenHash(
        connection,
        AuthSession.hashRefreshToken(refreshToken)
      );
      if (session) await AuthSession.revoke(connection, session.id);
    }

    clearAuthCookies(res);
    res.set("Cache-Control", "no-store");
    return res.status(200).json({ status: "success" });
  } catch (error) {
    return next(error);
  } finally {
    releaseConnection(connection);
  }
};

exports.getCurrentUser = (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    status: "success",
    data: { user: toSafeUser(req.user) },
    session: { accessExpiresAt: req.auth.exp * 1000 },
  });
};

exports.updatePassword = async (req, res, next) => {
  let connection;

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect =
      user && (await user.correctPassword(currentPassword, user.password));

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "The current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    connection = await getConnection();
    await connection.beginTransaction();
    await connection.execute(
      "UPDATE users SET password = ?, passwordChangedAt = NOW() WHERE id = ?",
      [hashedPassword, user.id]
    );
    await AuthSession.revokeAllForUser(connection, user.id);
    const session = await issueSession(connection, user);
    await connection.commit();

    return sendAuthenticatedResponse(res, 200, user, session);
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    releaseConnection(connection);
  }
};

exports.protect = require("../middleware/auth.middleware").protect;
exports.restrictTo = require("../middleware/auth.middleware").restrictTo;
