import "server-only";
import { db } from "./db";

export const getAccountByEmail = async (email: string) => {
  return await db.account.findFirst({
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
