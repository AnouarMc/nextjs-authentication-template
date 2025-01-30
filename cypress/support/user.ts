import bcrypt from "bcrypt";
import { db } from "../../data/db";

export const deleteTestUser = async (email: string) => {
  try {
    const result = await db.user.deleteMany({
      where: {
        email,
      },
    });
    return result ?? null;
  } catch (error) {
    console.error(`Could not delete test user`, error);
  }
};

export const addTestUserWithPassword = async (
  email: string,
  password: string
) => {
  try {
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

    return newUser ?? null;
  } catch (error) {
    console.error(`Could not add test user with a password`, error);
  }
};

export const addTestUserWithoutPassword = async (email: string) => {
  try {
    const newUser = await db.user.create({
      data: {
        email,
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

    return newUser ?? null;
  } catch (error) {
    console.error(`Could not add test user without a password`, error);
  }
};
