const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const { restrictTo } = require("../middleware/auth.middleware");
const { requireTrustedOrigin } = require("../middleware/trustedOrigin.middleware");
const {
  clearAuthCookies,
  setAuthCookies,
} = require("../utils/function/authCookies");
const { redactLogData } = require("../utils/function/redactLogData");

test("redactLogData removes credentials from nested request data", () => {
  const source = {
    password: "secret",
    nested: { currentPassword: "old-secret", ordinary: "kept" },
    authorization: "Bearer token",
  };

  assert.deepEqual(redactLogData(source), {
    password: "[REDACTED]",
    nested: { currentPassword: "[REDACTED]", ordinary: "kept" },
    authorization: "[REDACTED]",
  });
});

test("requireTrustedOrigin rejects unsafe origins before state changes", () => {
  const response = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
  let nextCalled = false;

  requireTrustedOrigin(
    { get: () => "https://attacker.example" },
    response,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 403);
});

test("restrictTo allows only the declared roles", () => {
  const handler = restrictTo("admin");
  let nextCalled = false;
  const rejectedResponse = {
    statusCode: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };

  handler({ user: { role: "redacteur" } }, rejectedResponse, () => {
    nextCalled = true;
  });
  assert.equal(rejectedResponse.statusCode, 403);
  assert.equal(nextCalled, false);

  handler({ user: { role: "admin" } }, rejectedResponse, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
});

test("authentication cookies are HttpOnly, scoped and cleared consistently", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAccessDuration = process.env.JWT_ACCESS_EXPIRES_IN;
  const originalRefreshDuration = process.env.JWT_REFRESH_EXPIRES_IN;
  process.env.NODE_ENV = "production";
  process.env.JWT_ACCESS_EXPIRES_IN = "15m";
  process.env.JWT_REFRESH_EXPIRES_IN = "1h";

  const cookies = [];
  const response = {
    cookie(name, value, options) {
      cookies.push({ name, value, options });
      return this;
    },
    clearCookie(name, options) {
      cookies.push({ name, options, cleared: true });
      return this;
    },
  };

  try {
    setAuthCookies(response, { accessToken: "access", refreshToken: "refresh" });
    assert.equal(cookies[0].options.httpOnly, true);
    assert.equal(cookies[0].options.secure, true);
    assert.equal(cookies[0].options.sameSite, "lax");
    assert.equal(cookies[0].options.path, "/api");

    clearAuthCookies(response);
    assert.equal(cookies[2].cleared, true);
    assert.equal(cookies[2].options.path, "/api");
  } finally {
    const restoreEnvironmentVariable = (name, value) => {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    };
    restoreEnvironmentVariable("NODE_ENV", originalNodeEnv);
    restoreEnvironmentVariable("JWT_ACCESS_EXPIRES_IN", originalAccessDuration);
    restoreEnvironmentVariable("JWT_REFRESH_EXPIRES_IN", originalRefreshDuration);
  }
});

test("the API applies Helmet security headers", async () => {
  const app = require("../app");
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/test`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.ok(response.headers.get("content-security-policy"));
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
