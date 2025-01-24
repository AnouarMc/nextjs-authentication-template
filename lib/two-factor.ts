import "server-only";

import { decrypt, encrypt } from "@/lib/encryption";

import speakeasy from "speakeasy";
import { InvalidJWT } from "@/types";
import { cookies } from "next/headers";
import { webcrypto } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { TWO_FACTOR_COOKIE_NAME } from "@/constants";
import { updateBackupCodes } from "@/data/two-factor";

const secretKey = process.env.AUTH_SECRET;
const secret = new TextEncoder().encode(secretKey);

export const setTwoFactorCookie = async ({
  userId,
  provider,
}: {
  userId: string;
  provider?: string;
}) => {
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
  if (provider)
    cookieStore.set("provider_linking", provider, {
      httpOnly: false,
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

export const verifyTotp = (code: string, secret: string) => {
  const success = speakeasy.totp.verify({
    token: code,
    secret: secret,
    encoding: "base32",
  });
  return { success };
};

export const verifyBackupCode = async (
  userId: string,
  code: string,
  backupCodes: string
) => {
  let decrypted = JSON.parse(decrypt(backupCodes));
  if (decrypted.includes(code)) {
    decrypted = decrypted.filter((backupCode: string) => backupCode !== code);
    await updateBackupCodes(userId, encrypt(JSON.stringify(decrypted)));
    return { success: true };
  }
  return { success: false };
};

export const generateBackupCodes = () => {
  const backupCodes = Array.from({ length: 10 })
    .fill(null)
    .map(() => generateString());
  const encrypted = encrypt(JSON.stringify(backupCodes));
  return {
    backupCodes,
    encrypted,
  };
};

const generateString = () => {
  const length = 8;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;

  const charArray = new Uint8Array(length);
  webcrypto.getRandomValues(charArray);

  let code = "";
  for (let i = 0; i < length; i++) {
    const index = charArray[i] % charsLength;
    code += chars[index];
  }
  return code;
};
