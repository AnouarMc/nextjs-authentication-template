import { db } from "@/data/db";
import { sendEmail } from "@/lib/email";
import { tokenTTLInSeconds } from "@/constants";
import { updateUserImage, updateUserName } from "@/data/user";
import { getAccountAndUser, updateAccountEmail } from "@/data/account";

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize({ email, password }) {
        const account = await getAccountAndUser(email as string);
        const user = account?.user;
        if (!account || !user?.password) {
          throw new CredentialsSignin();
        }

        const passwordMatch = await bcrypt.compare(
          password as string,
          user.password
        );
        if (!passwordMatch) {
          throw new CredentialsSignin();
        }

        return user;
      },
    }),
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
  events: {
    async linkAccount({ account, profile, user }) {
      if (!user.image) {
        user.image = profile.image;
        await updateUserImage(user.id!, user.image);
      }
      if (!user.name) {
        user.name = profile.name;
        await updateUserName(user.id!, user.name);
      }
      const { provider, providerAccountId } = account;
      const { email } = profile;
      await updateAccountEmail(provider, providerAccountId, email);
    },
  },
});
