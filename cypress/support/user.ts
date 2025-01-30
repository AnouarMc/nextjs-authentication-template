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
