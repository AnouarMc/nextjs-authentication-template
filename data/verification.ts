import "server-only";

import { db } from "@/data/db";
import { createHash } from "node:crypto";

const authSecret = process.env.AUTH_SECRET;

export const verifyToken = async (
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
    return {
      success: false,
      errors: [{ name: "token", message: "Invalid code" }],
    };
  }

  if (shouldDelete) {
    await db.verificationToken.deleteMany({
      where: {
        identifier: email,
        token: hashedToken,
      },
    });
  }

  if (new Date() > verification.expires) {
    return {
      success: false,
      errors: [{ name: "token", message: "This code has expired" }],
    };
  } else {
    return { success: true };
  }
};
