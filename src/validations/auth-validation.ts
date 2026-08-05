import { z } from "zod";

export const registerValidateSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Fullname must be at least 3 characters long" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginValidateSchema = z.object({
  identifier: z.union([
    z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    z.email({ message: "Invalid email address" }),
  ]),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type TRegister = z.infer<typeof registerValidateSchema>;
export type TCreateUser = Omit<TRegister, "confirmPassword">;
export type TLogin = z.infer<typeof loginValidateSchema>;
