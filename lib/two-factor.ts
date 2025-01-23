import "server-only";

import speakeasy from "speakeasy";
import { InvalidJWT } from "@/types";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { TWO_FACTOR_COOKIE_NAME } from "@/constants";

const secretKey = process.env.AUTH_SECRET;
const secret = new TextEncoder().encode(secretKey);

export const setTwoFactorCookie = async (userId: string) => {
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(TWO_FACTOR_COOKIE_NAME, jwt, {
    httpOnly: true,
    maxAge: 60 * 10, //10 min
    sameSite: "strict",
  });
};

export const getTwoFactorCookie = async () => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get(TWO_FACTOR_COOKIE_NAME)?.value.toString();

    const { payload } = await jwtVerify(jwt!, secret, {
      algorithms: ["HS256"],
    });
    return payload.userId;
  } catch {
    await removeTwoFactorCookie();
    throw new InvalidJWT();
  }
};

export const removeTwoFactorCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(TWO_FACTOR_COOKIE_NAME);
};

export const verifyTOTP = (code: string, secret: string) => {
  const success = speakeasy.totp.verify({
    token: code,
    secret: secret,
    encoding: "base32",
  });
  return { success };
};
