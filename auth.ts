import { db } from "@/data/db";
import { sendEmail } from "@/lib/email";
import { tokenTTLInSeconds } from "@/constants";
import { verifyTokenOrThrow } from "@/data/verification";
import { getAccountAndUser, updateAccountEmail } from "@/data/account";
import { getUserById, updateUserImage, updateUserName } from "@/data/user";
import {
  getTwoFactorCookie,
  removeTwoFactorCookie,
  setTwoFactorCookie,
  verifyTOTP,
} from "@/lib/two-factor";

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { User } from "@prisma/client";
import { Adapter } from "@auth/core/adapters";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { InvalidJWT, InvalidToken } from "./types";

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
      async authorize({ otpCode }) {
        const userId = (await getTwoFactorCookie()) as string;
        const user = await getUserById(userId);
        if (!user) {
          await removeTwoFactorCookie();
          throw new InvalidJWT();
        }

        const { success } = verifyTOTP(
          otpCode as string,
          user.twoFactorSecret!
        );
        if (!success) {
          throw new InvalidToken();
        }

        await removeTwoFactorCookie();
        return { ...user, twoFactorPassed: true };
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
    async signIn({ user, email }) {
      if (email?.verificationRequest) return true;
      const session = await auth();
      if (session) return true;

      if (user.twoFactorEnabled && !user.twoFactorPassed) {
        await setTwoFactorCookie(user.id!);
        return "/sign-in/two-factor";
      }
      return true;
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
