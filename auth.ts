import { db } from "@/data/db";
import { sendEmail } from "@/lib/email";
import { tokenTTLInSeconds } from "@/constants";

import crypto from "node:crypto";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    {
      id: "verification",
      name: "verification",
      type: "email",
      maxAge: tokenTTLInSeconds,
      async generateVerificationToken() {
        const token = crypto.randomInt(100_000, 1_000_000).toString();
        return token;
      },
      async sendVerificationRequest({ identifier: email, token }) {
        await sendEmail(email, token);
      },
    },
  ],
});
