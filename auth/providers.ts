import {
  verifyTotp,
  verifyBackupCode,
  getTwoFactorCookie,
  removeTwoFactorCookie,
} from "@/lib/two-factor";
import { sendEmail } from "@/lib/email";
import { getUserById } from "@/data/user";
import { decrypt } from "@/lib/encryption";
import { getAccountAndUser } from "@/data/account";
import { verifyTokenOrThrow } from "@/data/verification";

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { tokenTTLInSeconds } from "@/constants";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { InvalidJWT, InvalidToken } from "@/types";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin, NextAuthConfig } from "next-auth";

export const providers = [
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
      // TODO: Implement rate limiting
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
  Credentials({
    id: "EmailAndOTP",
    async authorize({ email, otpCode }) {
      // TODO: Implement rate limiting
      await verifyTokenOrThrow(email as string, otpCode as string);

      const account = await getAccountAndUser(email as string);
      const user = account?.user;
      if (!account || !user) {
        throw new CredentialsSignin();
      }
      return user;
    },
  }),
  Credentials({
    id: "TwoFactor",
    async authorize({ code, method }) {
      // TODO: Implement rate limiting

      const userId = (await getTwoFactorCookie()) as string;
      const user = await getUserById(userId);
      if (!user || !user.backupCodes || !user.twoFactorSecret) {
        await removeTwoFactorCookie();
        throw new InvalidJWT();
      }

      if (method === "app") {
        const { success } = verifyTotp(
          code as string,
          decrypt(user.twoFactorSecret)
        );
        if (!success) throw new InvalidToken();
      } else if (method === "backup-code") {
        const { success } = await verifyBackupCode(
          user.id,
          code as string,
          user.backupCodes
        );
        if (!success) throw new InvalidToken();
      } else {
        throw new Error();
      }

      await removeTwoFactorCookie();
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
      // TODO: Implement rate limiting
      await sendEmail(email, token);
    },
  },
] as NextAuthConfig["providers"];
