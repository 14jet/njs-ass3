const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const api_key =
  "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";

const transporter = nodemailer.createTransport(
  sendgridTransport({ auth: { api_key } })
);

const mailSender = (email, html) => {
  transporter.sendMail(
    {
      to: email,
      from: "ntav2095@gmail.com",
      subject: "Order mail",
      html: html,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      }

      if (info) {
        console.log(info);
      }
    }
  );
};

module.exports = mailSender;
