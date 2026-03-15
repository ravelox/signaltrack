import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEYLEN = 64;

const deriveHash = (password: string, salt: string) => scryptSync(password, salt, SCRYPT_KEYLEN);

export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = deriveHash(password, salt).toString("hex");
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, passwordHash: string): boolean => {
  const [salt, expectedHash] = passwordHash.split(":");
  if (!salt || !expectedHash) return false;

  const derived = deriveHash(password, salt);
  const expected = Buffer.from(expectedHash, "hex");

  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
};
