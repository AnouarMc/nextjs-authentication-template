import "server-only";

import { db } from "@/data/db";
import { getAccountAndUser, getAccountsByUserId } from "@/data/account";

import bcrypt from "bcrypt";
import { defaultError } from "@/constants";
import { updateServerSession } from "@/auth";

export const createUserAndAccount = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      email,
      password: hashed,
      emailVerified: new Date(),
      accounts: {
        create: [
          {
            email,
            type: "email",
            provider: "email",
            providerAccountId: email,
          },
        ],
      },
    },
  });

  return newUser;
};

export const updateUserImage = async (
  userId: string,
  image?: string | null
) => {
  await db.user.update({
    data: { image },
    where: { id: userId },
  });
};

export const updateUserName = async (userId: string, name?: string | null) => {
  await db.user.update({
    data: { name },
    where: { id: userId },
  });
};

export const updateUserPassword = async (email: string, password: string) => {
  const account = await getAccountAndUser(email);
  const userId = account?.user.id;

  const hashed = await bcrypt.hash(password, 10);
  await db.user.update({
    data: { password: hashed },
    where: { id: userId },
  });
};

export const deleteAccount = async (userId: string, email: string) => {
  const accounts = await getAccountsByUserId(userId);
  const connectedAccount = accounts.find(
    (account) => account.provider !== "email" && account.email === email
  );

  if (connectedAccount) {
    return {
      success: false,
      errors: [
        {
          name: "root",
          message:
            "This email address is linked to a Connected Account, remove the Connected Account before deleting this email address",
        },
      ],
    };
  }

  const distinctEmails = Array.from(
    new Map(accounts.map((account) => [account.email, account])).values()
  );
  if (distinctEmails.length <= 1) {
    return {
      success: false,
      errors: [
        {
          name: "root",
          message: "Cannot delete the email as no replacement is present",
        },
      ],
    };
  }

  await db.$transaction(async (prisma) => {
    await prisma.account.delete({
      where: {
        userId_email_provider: {
          userId,
          email,
          provider: "email",
        },
      },
    });

    const deletedAccount = distinctEmails.find(
      (account) => account.email === email
    );
    if (deletedAccount?.isPrimary) {
      const otherEmail = distinctEmails.find(
        (account) => account.email !== email
      );
      await prisma.user.update({
        where: { id: userId },
        data: { email: otherEmail?.email },
      });
      await updateServerSession({ user: { email: otherEmail?.email } });
    }
  });

  return { success: true };
};

export const updatePrimaryEmail = async (userId: string, email: string) => {
  const accounts = await getAccountsByUserId(userId);
  const found = accounts.find((account) => account.email === email);
  if (!found) {
    return defaultError;
  }

  await db.user.update({
    data: { email },
    where: { id: userId },
  });

  return { success: true, errors: null };
};
