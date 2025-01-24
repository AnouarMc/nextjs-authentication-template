import { NextAuthConfig } from "next-auth";
import { updateAccountEmail } from "@/data/account";
import { updateUserImage, updateUserName } from "@/data/user";

export const events = {
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
} as NextAuthConfig["events"];
