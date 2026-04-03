import { z } from "zod";

export const ForgotPasswordEmailSchema = z.object({
  email: z.email(),
});

export const VerifyOTPSchema = z.object({
  email: z.email(),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
});

export const ResetPasswordSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
