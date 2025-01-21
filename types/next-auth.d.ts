import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    hasPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    hasPassword?: boolean;
  }
}
