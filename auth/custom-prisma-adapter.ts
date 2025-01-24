import { db } from "@/data/db";
import { User } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const CustomPrismaAdapter = (prisma: typeof db) => {
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
};

export default CustomPrismaAdapter;
