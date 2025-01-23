import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    password?: string | null;
    hasPassword?: boolean;
    twoFactorEnabled: boolean;
    twoFactorPassed?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    image: string;
    hasPassword: boolean;
    twoFactorEnabled: boolean;
  }
}
