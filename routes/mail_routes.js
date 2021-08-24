/*
AUTHOR: Devin Davis
DATE: July 24th, 2021
FILE: comment_routes.js
*/

// DEPENDENCIES
import express from 'express';
import nodemailer from 'nodemailer';

// CATEGORY ROUTES
const router = express.Router();

router.post('/', (req, res) => {
  const { recipient, subject, content } = req.body;
  const { SMTP_EMAIL, SMTP_PASS, MASTER_EMAIL } = process.env;

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS,
    },
  });

  transporter.sendMail({
    from: MASTER_EMAIL,
    to: recipient,
    subject,
    text: content,
  })
    .then(() => res.status(200))
    .catch(() => res.status(500).send('Failed to send email. Please try again.'));
});

export default router;
