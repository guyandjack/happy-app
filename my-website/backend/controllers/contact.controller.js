const nodemailer = require("nodemailer");

const localOrProd = require("../utils/function/localOrProd");
/**
 * Send contact email
 */
exports.sendContactEmail = async (req, res, next) => {
  const { mode } = localOrProd();
  let emailTo = "";
  try {
    const { name, email, subject, message } = req.body;

    // Create transporter
    //test si on est en prod
    if (mode === "prod" && req.hostname.includes(".ch")) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAILBOX_PROD_ADRESS,
          pass: process.env.MAILBOX_PROD_PASSWORD,
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

    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: emailTo,
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

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    next(error);
  }
};
