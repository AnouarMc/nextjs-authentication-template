"use server";

import { formatZodErrors } from "@/lib/utils";
import { verifyTokenOrThrow } from "@/data/verification";

import { signIn } from "@/auth";
import { defaultError } from "@/constants";
import { emailSchema, otpSchema } from "@/schemas";
import { ExpiredToken, InvalidToken, TooManyRequests } from "@/types";

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
    if (error instanceof TooManyRequests) {
      return {
        success: false,
        errors: [
          {
            name: "root",
            message: "Too many requests. Please try again later",
          },
        ],
      };
    }
    console.error(error);
    return defaultError;
  }
};

export const verifyOTPCode = async (email: string, otpCode: string) => {
  try {
    const validatedCode = otpSchema.safeParse({ otpCode });
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    await verifyTokenOrThrow(email, otpCode, false);
    return { success: true, errors: null };
  } catch (error) {
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
