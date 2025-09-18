export async function verifyInitData(initData: string): Promise<boolean> {
  // Stub: later call Cloudflare Worker/Supabase to verify
  console.debug('[DEV] verifyInitData called with', initData);
  return Promise.resolve(true);
}

export async function pull(): Promise<void> {
  return Promise.resolve();
}

export async function push(): Promise<void> {
  return Promise.resolve();
}



