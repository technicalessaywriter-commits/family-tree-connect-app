import nodemailer from "nodemailer";
import { config } from "../config.js";

export async function sendInvite(email: string, treeName: string, token: string) {
  if (!config.mail.host || !config.mail.user || !config.mail.pass) {
    console.info(`Invite for ${email}: ${config.clientUrl}/invite/${token}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: { user: config.mail.user, pass: config.mail.pass }
  });

  await transporter.sendMail({
    from: config.mail.from,
    to: email,
    subject: `Invitation to collaborate on ${treeName}`,
    text: `You were invited to collaborate on ${treeName}. Open ${config.clientUrl}/invite/${token} to accept.`
  });
}
