import { ENV_CONFIG } from "./env.config";
import nodemailer from 'nodemailer'



  const transporter = nodemailer.createTransport({
    host: ENV_CONFIG.SMTP_HOST,
    service: ENV_CONFIG.SMTP_SERVICE,
    port: Number(ENV_CONFIG.SMTP_PORT) || 587, 
    secure: Number(ENV_CONFIG.SMTP_PORT) === 465 ? true : false,
    auth: {
      user: ENV_CONFIG.SMTP_USER,
      pass: ENV_CONFIG.SMTP_PASSWORD,
    },

  }
)

export default transporter;