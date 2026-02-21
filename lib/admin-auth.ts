export const ADMIN_SESSION_COOKIE = "artemis_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PANEL_PASSWORD ?? "change-this-password";
}

function getAdminSecret(): string {
  return process.env.ADMIN_PANEL_SECRET ?? "artemis-admin-secret";
}

async function buildSessionToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${getAdminSecret()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  return password === expected;
}

export async function createAdminSessionValue(password: string): Promise<string> {
  return await buildSessionToken(password);
}

export async function isValidAdminSession(sessionValue: string | undefined): Promise<boolean> {
  if (!sessionValue) return false;
  const expected = await buildSessionToken(getAdminPassword());
  return sessionValue === expected;
}
