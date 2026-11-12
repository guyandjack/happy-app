const assert = require("node:assert/strict");
const test = require("node:test");
const { getContactEmailConfiguration } = require("../config/mail");

test("uses the canonical production SMTP variables", () => {
  const configuration = getContactEmailConfiguration({
    NODE_ENV: "production",
    MAILBOX_PROD_HOST: "smtp.example.test",
    MAILBOX_PROD_PORT: "587",
    MAILBOX_PROD_ADDRESS: "contact@example.test",
    MAILBOX_PROD_PASSWORD: "password",
  });

  assert.equal(configuration.senderAddress, "contact@example.test");
  assert.deepEqual(configuration.transporterOptions, {
    host: "smtp.example.test",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "contact@example.test",
      pass: "password",
    },
  });
});

test("supports the legacy mailbox address variable during migration", () => {
  const configuration = getContactEmailConfiguration({
    NODE_ENV: "production",
    MAILBOX_PROD_HOST: "smtp.example.test",
    MAILBOX_PROD_ADRESS: "contact@example.test",
    MAILBOX_PROD_PASSWORD: "password",
  });

  assert.equal(configuration.senderAddress, "contact@example.test");
  assert.equal(configuration.transporterOptions.port, 465);
  assert.equal(configuration.transporterOptions.secure, true);
  assert.equal(configuration.transporterOptions.requireTLS, false);
});

test("allows the local Gmail transport to work with the Avast development certificate", () => {
  const configuration = getContactEmailConfiguration({
    MAILBOX_DEV_ADDRESS: "developer@example.test",
    MAILBOX_DEV_PASSWORD: "password",
  });

  assert.deepEqual(configuration.transporterOptions.tls, {
    rejectUnauthorized: false,
  });
});

test("rejects incomplete production SMTP configuration before sending", () => {
  assert.throws(
    () =>
      getContactEmailConfiguration({
        NODE_ENV: "production",
        MAILBOX_PROD_ADDRESS: "contact@example.test",
        MAILBOX_PROD_PASSWORD: "password",
      }),
    /Email configuration is incomplete/
  );
});
