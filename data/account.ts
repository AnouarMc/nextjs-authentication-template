import "server-only";
import { db } from "./db";

export const getAccountByEmail = async (email: string) => {
  return await db.account.findFirst({
    where: { email },
  });
};
