"use server";

import { signIn } from "@/auth";
import { emailSchema } from "@/schemas";
import { defaultError } from "@/constants";

export const sendVerification = async (email: string) => {
  try {
    const validatedEmail = emailSchema.safeParse({ email });
    if (!validatedEmail.success) {
      return defaultError;
    }

    await signIn("verification", {
      email,
      redirect: false,
    });
    return { success: true, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
