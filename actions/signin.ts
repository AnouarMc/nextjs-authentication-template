"use server";

import { formatZodErrors } from "@/lib/utils";
import { getAccountAndUser } from "@/data/account";
import { sendVerification } from "@/actions/verification";

import {
  emailSchema,
  emailSchemaType,
  signupSchema,
  signupSchemaType,
} from "@/schemas";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import { defaultError, redirectUrl } from "@/constants";
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
      const { success, errors } = await sendVerification(userEmail);
      if (!success) {
        return { success, errors };
      }
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
