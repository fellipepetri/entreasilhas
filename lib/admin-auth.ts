import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "eai_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";
  const password = process.env.ADMIN_PASSWORD?.trim() || "entreasilhas2026!";
  const secret =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    "eai_admin_secret_session_default_key_2026";

  return { username, password, secret };
}

export function createSessionToken(username: string): string {
  const { secret } = getAdminCredentials();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${username}:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}:${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [username, expStr, signature] = parts;
    const expiresAt = Number(expStr);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false;
    }

    const { secret, username: expectedUser } = getAdminCredentials();
    if (username !== expectedUser) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${username}:${expStr}`)
      .digest("hex");

    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expectedSignature, "hex");

    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isServerAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export function isRequestAuthenticated(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookiesObj: Record<string, string> = {};
    cookieHeader.split(";").forEach((pair) => {
      const [k, v] = pair.trim().split("=");
      if (k && v) cookiesObj[k] = decodeURIComponent(v);
    });

    const token = cookiesObj[ADMIN_COOKIE_NAME];
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
