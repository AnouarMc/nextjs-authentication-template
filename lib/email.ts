import "server-only";

import EmailTemplate from "@/components/email-template";
import * as nodemailer from "nodemailer";

export const sendEmail = async (email: string, code: string) => {
  const verification = {
    subject: `${code} is your verification code`,
    title: "Verification code",
    subtitle: "Enter the following verification code when prompted:",
  };

  const { subject, title, subtitle } = verification;
  const html = EmailTemplate({ title, subtitle, code });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${process.env.USER_NAME}" ${process.env.USER_EMAIL}`,
    to: email,
    subject,
    html,
  });
};
