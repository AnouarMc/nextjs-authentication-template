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
import { InvalidJWT, InvalidToken, TooManyRequests } from "@/types";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin, NextAuthConfig } from "next-auth";
import { shouldRateLimit } from "./rate-limiter";

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
    id: "EmailAndPassword",
    async authorize({ email, password }, req) {
      const { success } = shouldRateLimit("email-password", req);
      if (success) {
        throw new TooManyRequests();
      }
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
    async authorize({ email, otpCode }, req) {
      const { success } = shouldRateLimit("email-otp", req);
      if (success) {
        throw new TooManyRequests();
      }
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
    async authorize({ code, method }, req) {
      const { success } = shouldRateLimit("two-factor", req);
      if (success) {
        throw new TooManyRequests();
      }
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
    async sendVerificationRequest({ identifier: email, token, request }) {
      const { success } = shouldRateLimit("verification", request);
      if (success) {
        throw new TooManyRequests();
      }
      await sendEmail(email, token);
    },
  },
] as NextAuthConfig["providers"];
