import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Hash an API key secret using SHA-256
 */
export function hashApiKey(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

/**
 * Generate a random API key secret
 */
export function generateRandomSecret(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
