import "server-only";

import { db } from "@/data/db";
import { AccountCustomProps } from "@/types";
import { updateServerSession } from "@/auth";

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

export const getAccountByProvider = async (email: string, provider: string) => {
  const accounts = await db.account.findMany({
    include: { user: true },
    where: { email },
  });

  return (
    accounts.find((account) => account.provider === provider) ||
    accounts[0] ||
    null
  );
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

export const createAccount = async (userId: string, email: string) => {
  await db.account.create({
    data: {
      userId,
      email: email,
      type: "email",
      provider: "credentials",
      providerAccountId: email,
    },
  });
};

export const deleteAccount = async (userId: string, email: string) => {
  const accounts = await getAccountsByUserId(userId);
  const connectedAccount = accounts.find(
    (account) => account.provider !== "credentials" && account.email === email
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
          provider: "credentials",
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

export const deleteConnectedAccount = async (
  userId: string,
  email: string,
  provider: string
) => {
  await db.$transaction(async (prisma) => {
    await prisma.account.delete({
      where: {
        userId_email_provider: {
          userId,
          email,
          provider,
        },
      },
    });

    const account = await prisma.account.findUnique({
      where: {
        userId_email_provider: {
          userId,
          email,
          provider: "credentials",
        },
      },
    });

    if (!account) {
      await prisma.account.create({
        data: {
          userId,
          email: email,
          type: "email",
          provider: "credentials",
          providerAccountId: email,
        },
      });
    }
  });
  return { success: true, errors: null };
};
