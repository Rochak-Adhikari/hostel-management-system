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

export const setGuardianPasswordHTML = (user: { full_name: string, email: string }, setPasswordLink: string) => {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h1 style="font-size: 20px; font-weight: 700; color: #111111; margin: 0 0 16px;">
        Guardian Account Invitation
      </h1>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 8px;">
        Dear ${user.full_name},
      </p>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 24px;">
        You have been linked as a guardian to a student account on HostelHub. Please click the button below to set your account password and activate your guardian portal:
      </p>

      <div style="text-align: center; margin: 0 0 24px;">
        <a href="${setPasswordLink}" style="background-color: #111111; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
          Set Password
        </a>
      </div>

      <p style="font-size: 12px; color: #777777; line-height: 1.5; margin: 0 0 8px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #0066cc; word-break: break-all; margin: 0 0 24px;">
        ${setPasswordLink}
      </p>

      <p style="font-size: 12px; color: #999999; line-height: 1.5; margin: 0;">
        This invitation link is valid for 24 hours.
      </p>
    </div>
  `;
  return html;
};

export const resetPasswordHTML = (user: { full_name: string, email: string }, setPasswordLink: string) => {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px;">
      <h1 style="font-size: 20px; font-weight: 700; color: #111111; margin: 0 0 16px;">
        Password Reset Request
      </h1>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 8px;">
        Dear ${user.full_name},
      </p>

      <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0 0 24px;">
        We received a request to reset your password for your HostelHub account. Click the button below to choose a new password:
      </p>

      <div style="text-align: center; margin: 0 0 24px;">
        <a href="${setPasswordLink}" style="background-color: #111111; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 12px; color: #777777; line-height: 1.5; margin: 0 0 8px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size: 12px; color: #0066cc; word-break: break-all; margin: 0 0 24px;">
        ${setPasswordLink}
      </p>

      <p style="font-size: 12px; color: #999999; line-height: 1.5; margin: 0;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;
  return html;
};