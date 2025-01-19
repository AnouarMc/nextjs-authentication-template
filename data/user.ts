import "server-only";

import { db } from "@/data/db";
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
