"use server";

import { formatZodErrors } from "@/lib/utils";
import { getAccountAndUser } from "@/data/account";

import {
  otpSchema,
  emailSchema,
  signupSchema,
  emailSchemaType,
  backupCodeSchema,
  signupSchemaType,
} from "@/schemas";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import { defaultError, redirectUrl } from "@/constants";
import { ExpiredToken, InvalidJWT, InvalidToken } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const checkEmail = async (email: emailSchemaType) => {
  try {
    const validatedEmail = emailSchema.safeParse(email);
    if (!validatedEmail.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedEmail.error),
      };
    }

    const { email: userEmail } = validatedEmail.data;
    const existingAccount = await getAccountAndUser(userEmail);
    if (!existingAccount) {
      return {
        success: false,
        errors: [
          {
            name: "email",
            message: "Couldn't find your account",
          },
        ],
      };
    }

    if (existingAccount.user.password) {
      redirect("/sign-in/password");
    } else {
      await signIn("verification", {
        email: userEmail,
        redirect: false,
      });
      redirect("/sign-in/otp");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    return defaultError;
  }
};

export const signInWithPassword = async (creds: signupSchemaType) => {
  try {
    const validatedCreds = signupSchema.safeParse(creds);
    if (!validatedCreds.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCreds.error),
      };
    }

    const { email, password } = validatedCreds.data;
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl,
    });

    return { success: true, errors: null };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        errors: [
          {
            name: "password",
            message: "Password is incorrect. Try again, or use another method",
          },
        ],
      };
    }

    console.error(error);
    return defaultError;
  }
};

export const signInWithToken = async (email: string, otpCode: string) => {
  try {
    const validatedToken = otpSchema.safeParse({ otpCode });
    if (!validatedToken.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedToken.error),
      };
    }

    const validatedEmail = emailSchema.safeParse({ email });
    if (!validatedEmail.success) {
      return defaultError;
    }

    await signIn("EmailAndOTP", {
      email,
      otpCode,
      redirectTo: redirectUrl,
    });
    return { success: true, errors: null };
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

export const signInWithTwoFactor = async (
  code: string,
  method: "app" | "backup-code"
) => {
  try {
    const schema = method === "app" ? otpSchema : backupCodeSchema;
    const validatedCode = schema.safeParse({ otpCode: code });
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    await signIn("TwoFactor", {
      code,
      method,
      redirect: false,
    });

    return { success: true, errors: null };
  } catch (error) {
    switch (true) {
      case error instanceof InvalidJWT:
        redirect("/sign-in");
      case error instanceof InvalidToken:
        return {
          success: false,
          errors: [{ name: "otpCode", message: "Invalid code" }],
        };
    }

    console.error(error);
    return defaultError;
  }
};
