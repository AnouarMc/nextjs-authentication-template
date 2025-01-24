import { db } from "@/data/db";
import {
  verifyTotp,
  verifyBackupCode,
  getTwoFactorCookie,
  setTwoFactorCookie,
  removeTwoFactorCookie,
} from "@/lib/two-factor";
import { sendEmail } from "@/lib/email";
import { tokenTTLInSeconds } from "@/constants";
import { verifyTokenOrThrow } from "@/data/verification";
import {
  getAccountAndUser,
  getAccountByProvider,
  updateAccountEmail,
} from "@/data/account";
import { getUserById, updateUserImage, updateUserName } from "@/data/user";

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { User } from "@prisma/client";
import { Adapter } from "@auth/core/adapters";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { InvalidJWT, InvalidToken } from "@/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { decrypt } from "./lib/encryption";

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: updateServerSession,
} = NextAuth({
  adapter: CustomPrismaAdapter(db) as Adapter,
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
    Credentials({
      id: "EmailAndOTP",
      async authorize({ email, otpCode }) {
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
        await sendEmail(email, token);
      },
    },
  ],
  callbacks: {
    async signIn({ user, email, account }) {
      if (email?.verificationRequest) return true;
      if (account?.provider === "TwoFactor") return true;
      const session = await auth();
      if (session) return true;

      let userId = user.id;
      let alreadyLinked = true;
      if (account?.type === "oauth") {
        const acc = await getAccountByProvider(user.email!, account.provider);
        if (acc) {
          userId = acc.userId;
          user.twoFactorEnabled = acc.user.twoFactorEnabled;
          alreadyLinked = acc.provider === account.provider;
        }
      }
      if (!user.twoFactorEnabled) return true;

      if (userId) {
        await setTwoFactorCookie({
          userId,
          ...(!alreadyLinked && { provider: account?.provider }),
        });
        return "/sign-in/two-factor";
      }
      return false;
    },
    async jwt({ token, session, trigger, user }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user) {
        const { twoFactorEnabled } = user;
        const hasPassword = user.password !== null;
        token = { ...token, twoFactorEnabled, hasPassword };
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.image = token.image;
      session.user.hasPassword = token.hasPassword;
      session.user.twoFactorEnabled = token.twoFactorEnabled;
      return session;
    },
  },
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

function CustomPrismaAdapter(prisma: typeof db) {
  return {
    ...PrismaAdapter(prisma),
    getUserByEmail: async (email: string) => {
      const account = await prisma.account.findFirst({
        where: { email },
        select: { user: true },
      });
      if (account?.user) account.user.email = email;
      return account?.user ?? null;
    },

    createUser: ({ name, email, emailVerified, image }: User) => {
      return prisma.user.create({
        data: {
          name,
          email,
          emailVerified,
          image,
          twoFactorEnabled: false,
        },
      });
    },
  };
}
