"use server";

import { updateBackupCodes } from "@/data/two-factor";
import { generateBackupCodes } from "@/lib/two-factor";
import { disableTwoFactor, enableTwoFactor } from "@/data/two-factor";

import QRCode from "qrcode";
import speakeasy from "speakeasy";
import { defaultError } from "@/constants";
import { formatZodErrors } from "@/lib/utils";
import { auth, updateServerSession } from "@/auth";
import { otpSchema, otpSchemaType } from "@/schemas";

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
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { ...defaultError, backupCodes: null };
    }

    const validatedCode = otpSchema.safeParse(otpCode);
    if (!validatedCode.success) {
      return {
        success: false,
        errors: formatZodErrors(validatedCode.error),
        backupCodes: null,
      };
    }

    const success = speakeasy.totp.verify({
      secret,
      token: validatedCode.data.otpCode,
      encoding: "base32",
    });

    if (success) {
      const backupCodes = await enableTwoFactor(userId, secret);
      await updateServerSession({ user: { twoFactorEnabled: true } });
      return { success, errors: null, backupCodes };
    }

    return {
      success: false,
      errors: [{ name: "otpCode", message: "Invalid code" }],
      backupCodes: null,
    };
  } catch (error) {
    console.error(error);
    return { ...defaultError, backupCodes: null };
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

export const regenerateBackupCodes = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { ...defaultError, backupCodes: null };
    }

    const { backupCodes, encrypted } = generateBackupCodes();
    await updateBackupCodes(userId, encrypted);

    return { success: true, errors: null, backupCodes };
  } catch (error) {
    console.error(error);
    return { ...defaultError, backupCodes: null };
  }
};
