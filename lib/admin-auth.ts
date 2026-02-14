import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "artemis_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PANEL_PASSWORD ?? "change-this-password";
}

function getAdminSecret(): string {
  return process.env.ADMIN_PANEL_SECRET ?? "artemis-admin-secret";
}

function buildSessionToken(password: string): string {
  return createHash("sha256").update(`${password}:${getAdminSecret()}`).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const provided = Buffer.from(password);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}

export function createAdminSessionValue(): string {
  return buildSessionToken(getAdminPassword());
}

export function isValidAdminSession(sessionValue?: string): boolean {
  if (!sessionValue) {
    return false;
  }

  const expected = Buffer.from(createAdminSessionValue());
  const provided = Buffer.from(sessionValue);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}
