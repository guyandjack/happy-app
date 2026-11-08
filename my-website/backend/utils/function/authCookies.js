const ACCESS_TOKEN_COOKIE = "tokenAccess";
const REFRESH_TOKEN_COOKIE = "tokenRefresh";
const COOKIE_PATH = "/api";

const durationToMilliseconds = (value, variableName) => {
  const match = String(value || "")
    .trim()
    .match(/^(\d+)\s*([smhd])$/i);

  if (!match) {
    throw new Error(`${variableName} must be a positive duration such as 15m or 1h.`);
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const milliseconds = amount * multipliers[unit];

  if (!Number.isSafeInteger(milliseconds) || milliseconds <= 0) {
    throw new Error(`${variableName} must be a positive duration.`);
  }

  return milliseconds;
};

const getCookieBaseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
  path: COOKIE_PATH,
});

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const accessMaxAge = durationToMilliseconds(
    process.env.JWT_ACCESS_EXPIRES_IN,
    "JWT_ACCESS_EXPIRES_IN"
  );
  const refreshMaxAge = durationToMilliseconds(
    process.env.JWT_REFRESH_EXPIRES_IN,
    "JWT_REFRESH_EXPIRES_IN"
  );
  const baseOptions = getCookieBaseOptions();

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: accessMaxAge,
  });
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: refreshMaxAge,
  });
};

const clearAuthCookies = (res) => {
  const baseOptions = getCookieBaseOptions();
  res.clearCookie(ACCESS_TOKEN_COOKIE, baseOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions);
};

module.exports = {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
};
