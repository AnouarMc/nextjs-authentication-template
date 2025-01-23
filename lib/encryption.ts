import { managedNonce } from "@noble/ciphers/webcrypto";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { hexToBytes, bytesToHex, utf8ToBytes } from "@noble/ciphers/utils";

const secret = process.env.AUTH_SECRET;

export const encrypt = (data: string) => {
  const key = Buffer.from(secret!, "base64");
  const chacha = managedNonce(xchacha20poly1305)(key);
  const dataAsBytes = utf8ToBytes(data);
  return bytesToHex(chacha.encrypt(dataAsBytes));
};

export const decrypt = (encrypted: string) => {
  const key = Buffer.from(secret!, "base64");
  const chacha = managedNonce(xchacha20poly1305)(key);
  const encryptedBytes = hexToBytes(encrypted);
  const decryptedBytes = chacha.decrypt(encryptedBytes);
  return new TextDecoder().decode(decryptedBytes);
};
