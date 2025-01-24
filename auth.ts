import { db } from "@/data/db";
import NextAuth from "next-auth";
import { events } from "@/auth/events";
import { providers } from "@/auth/providers";
import { callbacks } from "@/auth/callbacks";
import { Adapter } from "@auth/core/adapters";
import CustomPrismaAdapter from "@/auth/custom-prisma-adapter";

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: updateServerSession,
} = NextAuth({
  adapter: CustomPrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers,
  callbacks,
  events,
});
