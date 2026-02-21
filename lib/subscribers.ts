export type Subscriber = {
  email: string;
  createdAt: string;
};

// Note: In production, bind a KV namespace called SUBSCRIBERS_KV
async function getKV() {
  // @ts-ignore - KV binding will be available at runtime on Cloudflare
  return typeof SUBSCRIBERS_KV !== 'undefined' ? SUBSCRIBERS_KV : null;
}

async function getSubscribers(): Promise<Subscriber[]> {
  const kv = await getKV();
  if (!kv) {
    console.warn('KV not available, using empty array');
    return [];
  }
  
  const data = await kv.get('subscribers', { type: 'json' });
  return data || [];
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const kv = await getKV();
  if (!kv) {
    console.warn('KV not available, cannot save');
    return;
  }
  
  await kv.put('subscribers', JSON.stringify(subscribers));
}

export async function addSubscriber(email: string): Promise<void> {
  const subscribers = await getSubscribers();
  
  if (subscribers.some(s => s.email === email)) {
    throw new Error('Email already subscribed');
  }
  
  subscribers.push({
    email,
    createdAt: new Date().toISOString(),
  });
  
  await saveSubscribers(subscribers);
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  return await getSubscribers();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
