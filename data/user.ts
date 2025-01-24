import "server-only";

import { getAccountAndUser, getAccountsByUserId } from "@/data/account";

import bcrypt from "bcrypt";
import { db } from "@/data/db";
import { defaultError } from "@/constants";

export const createUserAndAccount = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      email,
      password: hashed,
      emailVerified: new Date(),
      twoFactorEnabled: false,
      accounts: {
        create: [
          {
            email,
            type: "email",
            provider: "credentials",
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

export const getUserById = async (userId: string) => {
  return await db.user.findUnique({
    where: { id: userId },
  });
};

export const deleteUser = async (userId: string) => {
  await db.user.delete({
    where: {
      id: userId,
    },
  });
};
