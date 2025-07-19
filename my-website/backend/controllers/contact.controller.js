const nodemailer = require("nodemailer");
const localOrProd = require("../utils/function/localOrProd");

exports.sendContactEmail = async (req, res, next) => {
  const { mode } = localOrProd();
  console.log("mode:", mode);
  let emailTo = "";
  let transporter;

  try {
    const { name, email, subject, message } = req.body;

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
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

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
