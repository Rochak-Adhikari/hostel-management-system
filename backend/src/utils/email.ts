export const otpVerificationHTML =(user:{full_name:string, email:string}, otp:string) => {

     const html = `
       <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px;">
       <h1 style="font-size: 20px; font-weight: 700; color: #111111; margin: 0 0 16px;">
        Email Verification
      </h1>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 8px;">
        Dear ${user.full_name},
      </p>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 24px;">
        Thank you for registering with HostelHub. Please use the following OTP to verify your email address:
      </p>

      <div style="background-color: #111111; color: #ffffff; text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
        ${otp}
      </div>

      <p style="font-size: 12px; color: #999999; line-height: 1.5; margin: 0;">
        This OTP is valid for a limited time. If you did not request this, you can safely ignore this email.
      </p>
    </div>
    `
    return html;
}

    