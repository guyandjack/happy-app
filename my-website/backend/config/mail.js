const logger = require("../logger");

const getConfiguredValue = (environment, ...names) =>
  names
    .map((name) => environment[name])
    .find(
      (value) => typeof value === "string" && value.trim().length > 0
    );

const getSmtpPort = (value) => {
  const port = Number(value || 465);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("MAILBOX_PROD_PORT must be a valid TCP port.");
  }

  return port;
};

const getSafeMailConfigurationForLog = (configuration) => {
  if (!configuration) {
    return null;
  }

  const { senderAddress, transporterOptions } = configuration;

  return {
    senderAddress,
    transporterOptions: {
      host: transporterOptions.host,
      port: transporterOptions.port,
      secure: transporterOptions.secure,
      requireTLS: transporterOptions.requireTLS,
      service: transporterOptions.service,
      tls: transporterOptions.tls,
      auth: {
        user: transporterOptions.auth.user,
        pass: "[REDACTED]",
      },
    },
  };
};

const logProductionTransportConfiguration = (configuration) => {
  logger.info(
    `[mail] Production SMTP transport configuration: ${JSON.stringify(
      getSafeMailConfigurationForLog(configuration)
    )}`
  );
};

const getContactEmailConfiguration = (environment = process.env) => {
  const isProduction = environment.NODE_ENV === "production";
  const senderAddress = isProduction
    ? getConfiguredValue(
        environment,
        "MAILBOX_PROD_ADDRESS",
        "MAILBOX_PROD_ADRESS"
      )
    : getConfiguredValue(
        environment,
        "MAILBOX_DEV_ADDRESS",
        "MAILBOX_DEV_ADRESS"
      );
  const password = getConfiguredValue(
    environment,
    isProduction ? "MAILBOX_PROD_PASSWORD" : "MAILBOX_DEV_PASSWORD"
  );

  if (!senderAddress || !password) {
    throw new Error(
      `Email configuration is incomplete for the ${
        isProduction ? "production" : "development"
      } environment.`
    );
  }

  if (!isProduction) {
    return {
      senderAddress,
      transporterOptions: {
        service: "gmail",
        auth: {
          user: senderAddress,
          pass: password,
        },
        // Avast Mail Shield injects an untrusted local certificate during
        // development. Production SMTP must keep certificate validation on.
        tls: {
          rejectUnauthorized: false,
        },
      },
    };
  }

  const host = getConfiguredValue(environment, "MAILBOX_PROD_HOST");

  if (!host) {
    throw new Error("Email configuration is incomplete for the production environment.");
  }

  const port = getSmtpPort(environment.MAILBOX_PROD_PORT);

  const configuration = {
    senderAddress,
    transporterOptions: {
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: {
        user: senderAddress,
        pass: password,
      },
    },
  };

  logProductionTransportConfiguration(configuration);

  return configuration;
};

module.exports = { getContactEmailConfiguration, getSafeMailConfigurationForLog };
