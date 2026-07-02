import { z } from "zod"

export const customerLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const customerRegisterSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required." }),
    last_name: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  })

export const customerForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export const customerResetPasswordSchema = z
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
