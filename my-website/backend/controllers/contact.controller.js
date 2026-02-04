const nodemailer = require("nodemailer");
const axios = require("axios");
const localOrProd = require("../utils/function/localOrProd");

const TELEGRAM_API_BASE = process.env.TELEGRAM_BOT_TOKEN
  ? `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
  : null;


const CHAT_ID = process.env.TELEGRAM_CHAT_ID
  ? process.env.TELEGRAM_CHAT_ID
  : null;

const escapeMarkdownV2 = (value = "") =>
  String(value).replace(/([_\*\[\]\(\)~`>#\+\-=|{}.!\\])/g, "\\$1");

const truncateMessage = (text = "", limit = 1000) =>
  String(text).slice(0, limit);

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (ip) return ip;
  }
  if (req.ip) return req.ip;
  if (req.connection && req.connection.remoteAddress)
    return req.connection.remoteAddress;
  return "";
};

const anonymizeIp = (rawIp = "") => {
  if (!rawIp) return "inconnue";
  let ip = rawIp
    .replace(/^::ffff:/i, "")
    .replace(/^\[(.*)\]$/, "$1")
    .trim();

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const parts = ip.split(".");
    parts[3] = "xxx";
    return parts.join(".");
  }

  if (ip.includes(":")) {
    const segments = ip.split(":");
    const visible = segments
      .filter((segment) => segment !== "")
      .slice(0, 4)
      .map((segment) => segment || "0")
      .join(":");
    return `${visible || "0"}::xxxx`;
  }

  return "inconnue";
};

const buildTelegramMessage = ({
  name,
  firstName,
  email,
  subject,
  message,
  isoDate,
  anonymizedIp,
  referer,
}) => {
  const lines = [
    escapeMarkdownV2("📬 Nouveau message – Formulaire de contact"),
    `Nom: ${escapeMarkdownV2(name || "")}`,
    `Prénom: ${escapeMarkdownV2(firstName || "")}`,
    `Email: ${escapeMarkdownV2(email || "")}`,
  ];

  if (subject) {
    lines.push(`Sujet: ${escapeMarkdownV2(subject)}`);
  }

  lines.push(`Message: ${escapeMarkdownV2(message || "")}`);
  lines.push(`Date: ${escapeMarkdownV2(isoDate)}`);
  lines.push(`IP: ${escapeMarkdownV2(anonymizedIp)}`);

  if (referer) {
    lines.push(`Referer: ${escapeMarkdownV2(referer)}`);
  }

  return lines.join("\n");
};

const sendTelegramNotification = async (payload) => {
  if (!TELEGRAM_API_BASE || !CHAT_ID) {
    return;
  }

  const text = buildTelegramMessage(payload);

  try {
    await axios.post(TELEGRAM_API_BASE, {
      chat_id: CHAT_ID,
      text,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    });
  } catch (telegramError) {
    console.error("Telegram notification error:", telegramError.message);
  }
};

exports.sendContactEmail = async (req, res, next) => {
  const { mode } = localOrProd();
  console.log("mode:", mode);
  let emailTo = "";
  let transporter;

  try {
    const { name, firstName, email, subject, message } = req.body;

    if (mode === "prod" && req.hostname.includes("helveclick.ch")) {
      transporter = nodemailer.createTransport({
        host: process.env.MAILBOX_PROD_HOST,
        port: 465, // ou 587 selon ton host
        secure: true,
        auth: {
          user: process.env.MAILBOX_PROD_ADRESS,
          pass: process.env.MAILBOX_PROD_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      emailTo = process.env.MAILBOX_PROD_ADRESS;
    } else {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAILBOX_DEV_ADRESS,
          pass: process.env.MAILBOX_DEV_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      emailTo = process.env.MAILBOX_DEV_ADRESS;
    }

    const mailOptions = {
      from: `"${name}" <${emailTo}>`,
      to: emailTo,
      replyTo: email, // pour que le destinataire puisse répondre directement
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    try {
      const truncatedMessage = truncateMessage(message, 1000);
      const clientIp = getClientIp(req);
      await sendTelegramNotification({
        name,
        firstName,
        email,
        subject,
        message: truncatedMessage,
        isoDate: new Date().toISOString(),
        anonymizedIp: anonymizeIp(clientIp),
        referer: req.headers.referer,
      });
    } catch (notificationError) {
      console.error("Notification handling error:", notificationError.message);
    }

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      status: "error",
      message: `Email sending error: ${error.message}`,
    });
  }
};
