const nodeMailer = require("nodemailer");
const envConfig = require("../../configs/env.config");

const emailTransporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: envConfig.GOOGLE_EMAIL,
    pass: envConfig.GOOGLE_PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: envConfig.GOOGLE_EMAIL,
    to,
    subject,
    text,
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = {
  sendEmail,
};
