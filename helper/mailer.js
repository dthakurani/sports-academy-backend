const nodemailer = require('nodemailer');

/**
 * Get nodemailer mail transporter
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendMail(data) {
  const { to, attachments, bcc, cc, from, subject, text, html } = data;
  const mailOptions = {
    from: from || process.env.EMAIL_ID,
    to
  };
  if (cc) mailOptions.cc = cc;
  if (bcc) mailOptions.bcc = bcc;
  if (subject) mailOptions.subject = subject;
  if (text) mailOptions.text = text;
  if (html) mailOptions.html = html;
  if (attachments) mailOptions.attachments = attachments;

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendMail
};
