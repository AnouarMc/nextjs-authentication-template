"use server";

import { defaultError } from "@/constants";
import { formatZodErrors } from "@/lib/utils";
import { getAccountByEmail } from "@/data/account";
import { sendVerification } from "@/actions/verification";
import { signupSchema, signupSchemaType } from "@/schemas";

export const initSignup = async (creds: signupSchemaType) => {
  try {
    const validatedCreds = signupSchema.safeParse(creds);
    if (!validatedCreds.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCreds.error),
      };
    }

    const { email } = validatedCreds.data;
    const existingAccount = await getAccountByEmail(email);
    if (existingAccount) {
      return {
        success: false,
        errors: [
          {
            name: "email",
            message: "This email address is taken. Please try another",
          },
        ],
      };
    }

    const { success, errors } = await sendVerification(email);
    return { success, errors };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
