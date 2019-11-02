import nodemailer from 'nodemailer';
import constants from './../config/constants';

export default async function emailSender(email, rememberToken) {
  const transporter = nodemailer.createTransport({
    host: constants.SMTP_HOST,
    port: 2525,
    auth: {
      user: constants.SMTP_USER,
      pass: constants.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Test Server" <test@example.com>',
    to: email,
    subject: 'Email Test',
    text: rememberToken,
  };
  const info = transporter.sendMail(mailOptions);
  return info;
}
