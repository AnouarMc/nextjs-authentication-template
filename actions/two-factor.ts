"use server";

import QRCode from "qrcode";
import { auth, updateServerSession } from "@/auth";
import speakeasy from "speakeasy";
import { defaultError } from "@/constants";
import { otpSchema, otpSchemaType } from "@/schemas";
import { formatZodErrors } from "@/lib/utils";
import { disableTwoFactor, enableTwoFactor } from "@/data/user";

export const getQrCode = async () => {
  try {
    const secret = speakeasy.generateSecret({
      name: process.env.NEXT_PUBLIC_APP_NAME,
    });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url as string);
    return {
      success: true,
      data: { data: qrCode, secret: secret.base32 },
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return { ...defaultError, data: null };
  }
};

export const verifyQrCode = async (otpCode: otpSchemaType, secret: string) => {
  try {
    console.log(otpCode, secret);
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    const validatedCode = otpSchema.safeParse(otpCode);
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
      };
    }

    const success = speakeasy.totp.verify({
      secret,
      token: validatedCode.data.otpCode,
      encoding: "base32",
    });

    if (success) {
      await enableTwoFactor(userId, secret);
      await updateServerSession({ user: { twoFactorEnabled: true } });
      return { success, errors: null };
    }

    return {
      success: false,
      errors: [{ name: "otpCode", message: "Invalid code" }],
    };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};

export const removeTwoFactor = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return defaultError;
    }

    await disableTwoFactor(userId);
    await updateServerSession({ user: { twoFactorEnabled: false } });
    return { success: true, errors: null };
  } catch (error) {
    console.error(error);
    return defaultError;
  }
};
