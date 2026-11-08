-- Active: 1724159126619@@127.0.0.1@3306@happy_app
-- Execute once against existing databases before deploying the session rotation code.
-- Expand the ENUM before converting legacy `user` accounts to `redacteur`.
ALTER TABLE users
  MODIFY COLUMN role ENUM('user', 'admin', 'redacteur') NOT NULL DEFAULT 'redacteur';

UPDATE users SET role = 'redacteur' WHERE role = 'user' OR role IS NULL;

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'redacteur') NOT NULL DEFAULT 'redacteur';

CREATE TABLE IF NOT EXISTS auth_sessions (
  id CHAR(36) NOT NULL,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  replaced_by CHAR(36) NULL,
  replaced_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_auth_sessions_token_hash (token_hash),
  KEY idx_auth_sessions_user_id (user_id),
  KEY idx_auth_sessions_expires_at (expires_at),
  CONSTRAINT fk_auth_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
