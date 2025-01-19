"use server";

import { defaultError } from "@/constants";
import { formatZodErrors } from "@/lib/utils";
import { createUserAndAccount } from "@/data/user";
import { getAccountByEmail } from "@/data/account";
import { verifyTokenOrThrow } from "@/data/verification";

import {
  otpSchema,
  otpSchemaType,
  signupSchema,
  signupSchemaType,
} from "@/schemas";
import { signIn } from "@/auth";
import { ExpiredToken, InvalidToken } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
    await verifyTokenOrThrow(email, otpCode);

    await createUserAndAccount(email, password);
    // TODO: sign in user

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    switch (true) {
      case error instanceof InvalidToken:
        return {
          success: false,
          errors: [{ name: "otpCode", message: "Invalid code" }],
        };
      case error instanceof ExpiredToken:
        return {
          success: false,
          errors: [{ name: "otpCode", message: "This code has expired" }],
        };
    }

    console.error(error);
    return defaultError;
  }
};
