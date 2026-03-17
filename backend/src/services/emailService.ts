import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "NextFace <onboarding@resend.dev>",
      to,
      subject: "Verify your NextFace account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6366f1;">Welcome to NextFace!</h2>
          <p>Thank you for joining our community. To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; text-align: center;">NextFace Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Could not send verification email");
    }

    console.log(`Verification email sent to ${to} (ID: ${data?.id})`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Could not send verification email");
  }
};

