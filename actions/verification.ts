"use server";

import { signIn } from "@/auth";
import { defaultError } from "@/constants";
import { emailSchema } from "@/schemas";

export const sendVerification = async (email: string) => {
  try {
    const validatedEmail = emailSchema.safeParse({ email });
    if (!validatedEmail.success) {
      const errors = validatedEmail.error.flatten().fieldErrors;
      return {
        success: false,
        errors: [{ name: "email", message: errors?.email?.[0] }],
      };
    }

    await signIn("verification", {
      email,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
