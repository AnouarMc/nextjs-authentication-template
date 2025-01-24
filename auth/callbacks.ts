import { auth } from "@/auth";
import { NextAuthConfig } from "next-auth";
import { getAccountByProvider } from "@/data/account";
import { setTwoFactorCookie } from "@/lib/two-factor";

export const callbacks = {
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
} as NextAuthConfig["callbacks"];
