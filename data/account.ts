import "server-only";

import { db } from "@/data/db";
import { AccountCustomProps } from "@/types";

export const getAccountByEmail = async (email: string) => {
  return await db.account.findFirst({
    where: { email },
  });
};

export const getAccountAndUser = async (email: string) => {
  return await db.account.findFirst({
    include: {
      user: true,
    },
    where: { email },
  });
};

export const updateAccountEmail = async (
  provider: string,
  providerAccountId: string,
  email?: string | null
) => {
  const updatedAccount = await db.account.update({
    data: {
      email,
    },
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
  });
  return updatedAccount;
};

export const getAccountsByUserId = async (userId: string) => {
  const result = await db.$queryRaw<AccountCustomProps[]>`
    SELECT
      a.email,
      a.provider,
      CASE WHEN a.email = u.email THEN true ELSE false END AS "isPrimary"
    FROM "User" u
    JOIN "Account" a
    ON u.id = a."userId"
    WHERE u.id = ${userId}
    ORDER BY "isPrimary" DESC;
  `;
  return result;
};
