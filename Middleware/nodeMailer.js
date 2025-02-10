const nodemailer = require('nodemailer');
require('dotenv').config();
 
const sendEmail = (to, subject, text, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments
  };
 
  return transporter.sendMail(mailOptions);
};
 
module.exports = sendEmail;
 