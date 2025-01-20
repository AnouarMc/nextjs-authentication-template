"use server";

import { formatZodErrors } from "@/lib/utils";
import { updateUserPassword } from "@/data/user";
import { verifyTokenOrThrow } from "@/data/verification";

import {
  otpSchema,
  resetPasswordSchema,
  resetPasswordSchemaType,
} from "@/schemas";
import { defaultError } from "@/constants";
import { ExpiredToken, InvalidToken } from "@/types";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const resetPassword = async (
  email: string,
  otpCode: string,
  passwords: resetPasswordSchemaType
) => {
  try {
    const validatedCode = otpSchema.safeParse({ otpCode });
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    const validatedPasswords = resetPasswordSchema.safeParse(passwords);
    if (!validatedPasswords.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedPasswords.error),
      };
    }

    await verifyTokenOrThrow(email, otpCode, true);

    const { password } = passwords;
    await updateUserPassword(email, password);
    redirect("/sign-in");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    switch (true) {
      case error instanceof InvalidToken:
        return {
          success: false,
          errors: [{ name: "root", message: "Invalid verification code" }],
        };
      case error instanceof ExpiredToken:
        return {
          success: false,
          errors: [
            { name: "root", message: "This verification code has expired" },
          ],
        };
    }

    console.error(error);
    return defaultError;
  }
};
