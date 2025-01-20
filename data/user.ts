import "server-only";

import { db } from "@/data/db";
import { getAccountAndUser } from "@/data/account";

import bcrypt from "bcrypt";

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
