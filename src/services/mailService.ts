import nodemailer from "nodemailer";

interface ActiveEmail {
  email: string;
  password: string;
}

function mailTransporter(activeEmail: ActiveEmail) {
  return nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST!,
    port: parseInt(process.env.MAIL_SMTP_PORT!, 10),
    secure: true,
    auth: {
      user: activeEmail.email,
      pass: activeEmail.password,
    },
  });
}

export { mailTransporter };
