import z from "zod";

/*  Sign Up Schema */
export const signupSchema = z.object({
  email: z.string().email("Email address must be a valid email address"),
  password: z
    .string()
    .min(1, "Enter password")
    .min(8, "Your password must contain 8 or more characters"),
});
export type signupSchemaType = z.infer<typeof signupSchema>;

/*   Email Schema */
export const emailSchema = signupSchema.omit({ password: true });
export type emailSchemaType = z.infer<typeof emailSchema>;

/*   Password Schema */
export const passwordSchema = z.object({
  password: z.string().min(1, "Enter password"),
});
export type passwordSchemaType = z.infer<typeof passwordSchema>;

/*  OTP Code Schema */
export const otpSchema = z.object({
  otpCode: z.string().min(6, "Enter code").max(6, "Invalid code"),
});
export type otpSchemaType = z.infer<typeof otpSchema>;
