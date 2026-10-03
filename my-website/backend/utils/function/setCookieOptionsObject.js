/**
 * Returns the refresh-token cookie options.
 *
 * Do not set `domain` here. The API is served from api.helveclick.ch, so a
 * host-only cookie is sufficient for API requests and is more restrictive
 * than a cookie shared with every helveclick.ch subdomain.
 */
const setCookieOptionsObject = () => ({
  httpOnly: true,
  // Only an explicitly configured local development environment may use HTTP.
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
});

module.exports = setCookieOptionsObject;
