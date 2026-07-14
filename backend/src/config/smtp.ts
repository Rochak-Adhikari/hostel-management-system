import { ENV_CONFIG } from "./env.config";
import nodemailer from 'nodemailer'

console.log("SMTP CONFIG CHECK:", {
  host: ENV_CONFIG.SMTP_HOST,
  port: ENV_CONFIG.SMTP_PORT,
  user: ENV_CONFIG.SMTP_USER,
  passLength: ENV_CONFIG.SMTP_PASSWORD?.length,
});

  const transporter = nodemailer.createTransport({
    host: ENV_CONFIG.SMTP_HOST,
    // service: ENV_CONFIG.SMTP_SERVICE,
    port: Number(ENV_CONFIG.SMTP_PORT) || 587, 
    secure: Number(ENV_CONFIG.SMTP_PORT) === 465 ? true : false,
    auth: {
      user: ENV_CONFIG.SMTP_USER,
      pass: ENV_CONFIG.SMTP_PASSWORD,
    },

  }
)

export default transporter;