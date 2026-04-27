import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (!env.mail.host || !env.mail.user || !env.mail.pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: {
        user: env.mail.user,
        pass: env.mail.pass
      }
    });
  }

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    console.log("[mail:dev]", { to, subject, text });
    return { skipped: true };
  }

  return activeTransporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    text,
    html
  });
}

export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${token}`;

  return sendMail({
    to: user.email,
    subject: "Verify your Pizza Delivery account",
    text: `Welcome ${user.name}. Verify your account here: ${verifyUrl}`,
    html: `<p>Welcome ${user.name}.</p><p><a href="${verifyUrl}">Verify your account</a></p>`
  });
}

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  return sendMail({
    to: user.email,
    subject: "Reset your Pizza Delivery password",
    text: `Reset your password here: ${resetUrl}`,
    html: `<p>Hello ${user.name}.</p><p><a href="${resetUrl}">Reset your password</a></p>`
  });
}

export async function sendLowStockEmail(items) {
  const lines = items.map((item) => `${item.name} (${item.category}): ${item.quantity} ${item.unit}`).join("\n");

  return sendMail({
    to: env.mail.adminNotificationEmail,
    subject: "Pizza inventory stock alert",
    text: `The following inventory items are below threshold:\n\n${lines}`,
    html: `<p>The following inventory items are below threshold:</p><pre>${lines}</pre>`
  });
}
