export const ENV_CONFIG = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",



  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_SERVICE: process.env.SMTP_SERVICE || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASS || "",

JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
JWT_SECRET: process.env.JWT_SECRET || "",


};