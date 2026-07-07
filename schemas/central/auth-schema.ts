import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    otp: z.string().min(1, { message: "OTP is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  })
