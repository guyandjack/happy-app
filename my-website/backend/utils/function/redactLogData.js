const SENSITIVE_KEYS = new Set([
  "password",
  "currentpassword",
  "newpassword",
  "confirmpassword",
  "authorization",
  "cookie",
  "token",
  "tokenaccess",
  "tokenrefresh",
]);

const REDACTED = "[REDACTED]";

const redactLogData = (value, key = "") => {
  if (SENSITIVE_KEYS.has(String(key).toLowerCase())) return REDACTED;
  if (Array.isArray(value)) return value.map((item) => redactLogData(item));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      redactLogData(entryValue, entryKey),
    ])
  );
};

module.exports = { redactLogData };
