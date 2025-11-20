export async function retry<T>(
  fn: () => Promise<T>, 
  retries = 2, 
  delayMs = 200
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delayMs));
    return retry(fn, retries - 1, delayMs * 2);
  }
}
