import "server-only";

import { db } from "@/data/db";
import { encrypt } from "@/lib/encryption";
import { generateBackupCodes } from "@/lib/two-factor";

export const enableTwoFactor = async (
  userId: string,
  twoFactorSecret: string
) => {
  const { backupCodes, encrypted } = generateBackupCodes();
  await db.user.update({
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: encrypt(twoFactorSecret),
      backupCodes: encrypted,
    },
    where: {
      id: userId,
    },
  });
  return backupCodes;
};

export const disableTwoFactor = async (userId: string) => {
  await db.user.update({
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: null,
    },
    where: { id: userId },
  });
};

export const updateBackupCodes = async (
  userId: string,
  backupCodes: string
) => {
  await db.user.update({
    data: { backupCodes },
    where: { id: userId },
  });
};
