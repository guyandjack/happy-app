const crypto = require("crypto");

const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const create = async (connection, session) => {
  await connection.execute(
    `INSERT INTO auth_sessions (id, user_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [session.id, session.userId, session.tokenHash, session.expiresAt]
  );
};

const findByTokenHash = async (connection, tokenHash) => {
  const [rows] = await connection.execute(
    `SELECT id, user_id, token_hash, expires_at, revoked_at, replaced_by, replaced_at
     FROM auth_sessions
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash]
  );

  return rows[0] || null;
};

const revoke = async (connection, sessionId, replacementId = null) => {
  await connection.execute(
    `UPDATE auth_sessions
     SET revoked_at = COALESCE(revoked_at, NOW()),
         replaced_by = COALESCE(?, replaced_by),
         replaced_at = CASE WHEN ? IS NOT NULL AND replaced_at IS NULL THEN NOW() ELSE replaced_at END
     WHERE id = ?`,
    [replacementId, replacementId, sessionId]
  );
};

const revokeAllForUser = async (connection, userId) => {
  await connection.execute(
    "UPDATE auth_sessions SET revoked_at = COALESCE(revoked_at, NOW()) WHERE user_id = ?",
    [userId]
  );
};

module.exports = {
  create,
  findByTokenHash,
  hashRefreshToken,
  revoke,
  revokeAllForUser,
};
