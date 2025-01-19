import "server-only";

import { db } from "@/data/db";
import { createHash } from "node:crypto";
import { ExpiredToken, InvalidToken } from "@/types";

const authSecret = process.env.AUTH_SECRET;

export const verifyTokenOrThrow = async (
  email: string,
  token: string,
  shouldDelete: boolean = true
) => {
  const hashedToken = createHash("sha256")
    .update(`${token}${authSecret}`)
    .digest("hex");

  const verification = await db.verificationToken.findFirst({
    where: {
      identifier: email,
      token: hashedToken,
    },
  });
  if (!verification) {
    throw new InvalidToken();
  }
  if (new Date() > verification.expires) {
    throw new ExpiredToken();
  }

  if (shouldDelete) {
    await db.verificationToken.deleteMany({
      where: {
        identifier: email,
        token: hashedToken,
      },
    });
  }
};
