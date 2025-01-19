"use server";

import { defaultError } from "@/constants";
import { formatZodErrors } from "@/lib/utils";
import { getAccountByEmail } from "@/data/account";
import { sendVerification } from "@/actions/verification";
import {
  otpSchema,
  otpSchemaType,
  signupSchema,
  signupSchemaType,
} from "@/schemas";
import { verifyToken } from "@/data/verification";
import { createUserAndAccount } from "@/data/user";

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

export const signup = async (creds: signupSchemaType, code: otpSchemaType) => {
  try {
    const validatedCreds = signupSchema.safeParse(creds);
    if (!validatedCreds.success) {
      return defaultError;
    }

    const validatedCode = otpSchema.safeParse(code);
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    const { email, password } = validatedCreds.data;
    const { otpCode } = validatedCode.data;
    const existingAccount = await getAccountByEmail(email);
    if (existingAccount) {
      return defaultError;
    }

    const { success, errors } = await verifyToken(email, otpCode);
    if (!success) {
      return { success, errors };
    }

    await createUserAndAccount(email, password);
    // TODO: sign in user

    return { success: true };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
