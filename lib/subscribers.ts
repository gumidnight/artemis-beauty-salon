import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Subscriber = {
  email: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const subscribersFile = path.join(dataDir, "subscribers.json");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(subscribersFile, "utf-8");
  } catch {
    await writeFile(subscribersFile, "[]\n", "utf-8");
  }
}

export async function readSubscribers(): Promise<Subscriber[]> {
  await ensureStore();
  const raw = await readFile(subscribersFile, "utf-8");

  try {
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]) {
  await ensureStore();
  await writeFile(subscribersFile, `${JSON.stringify(subscribers, null, 2)}\n`, "utf-8");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function addSubscriber(email: string): Promise<{ success: boolean; duplicate: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();
  const subscribers = await readSubscribers();

  if (subscribers.some((item) => item.email.toLowerCase() === normalizedEmail)) {
    return { success: true, duplicate: true };
  }

  subscribers.unshift({
    email: normalizedEmail,
    createdAt: new Date().toISOString()
  });

  await writeSubscribers(subscribers);
  return { success: true, duplicate: false };
}
