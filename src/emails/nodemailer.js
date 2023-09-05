import { createTransport } from 'nodemailer';
import { htmlCode } from './html.js';

export const sendEmail = async (options) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.NODEMAILER_EMAIL}>`,
    to: options.receiverEmail,
    subject: 'Email Verification',
    html: htmlCode(
      options.username,
      `${process.env.BASE_URL + 'api/v1/auth/verify/' + options.link}`
    ),
  });
  console.log('Message sent: %s', info.messageId);
};
