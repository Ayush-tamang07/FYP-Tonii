const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: true,
  port: 465,
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: "tamangayush052@gmail.com",
    pass: "oijfyfaqxgqydyfv",
  },
});

module.exports = transporter;