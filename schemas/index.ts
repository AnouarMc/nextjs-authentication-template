import z from "zod";
import { acceptedImageTypes, maxFileSize, maxFileSizeText } from "@/constants";

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

/*  Reset Password Schema */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Your password must contain 8 or more characters"),
    confirmPassword: z
      .string()
      .min(8, "Your password must contain 8 or more characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

/*  Image Schema  */
export const imageSchema = z.object({
  image: z
    .any()
    .refine((files) => {
      if (files?.[0]?.size === 0 || files?.[0] === undefined) return false;
      else return true;
    })
    .refine(
      (files) => acceptedImageTypes.includes(files?.[0]?.type),
      "We only support PNG, GIF, or JPG pictures"
    )
    .refine(
      (files) => files?.[0]?.size <= maxFileSize,
      `Please upload a picture smaller than ${maxFileSizeText}`
    ),
});
export type imageSchemaType = z.infer<typeof imageSchema>;
